/**
 * Merges build recommendations from buildUpdate.json into characterBuilds.ts
 * 
 * Usage: node scripts/mergeBuildData.js
 * 
 * This script:
 * 1. Reads buildUpdate.json (from your scraper)
 * 2. Reads existing characterBuilds.ts
 * 3. Matches characters by ID (with name mapping from mergeTierData.js)
 * 4. Updates build recommendations (light cones, relics, stats)
 * 5. Generates updated characterBuilds.ts
 * 6. Skips unreleased characters not in the app
 */

const fs = require('fs');
const path = require('path');

const BUILD_FILE = path.join(__dirname, '..', 'src', 'data', 'buildUpdate.json');
const BUILDS_TS_FILE = path.join(__dirname, '..', 'src', 'data', 'characterBuilds.ts');
const CHARS_FILE = path.join(__dirname, '..', 'src', 'data', 'characters.ts');
const BACKUP_FILE = path.join(__dirname, '..', 'src', 'data', 'characterBuilds.ts.backup');
const REPORT_FILE = path.join(__dirname, '..', 'build-merge-report.txt');

// Name mapping for matching (same as mergeTierData.js)
const NAME_ALIASES = {
  "Trailblazer (Remembrance)": "trail_ice",
  "Trailblazer (Imaginary)": "trail_imag",
  "Trailblazer (Harmony)": "trail_imag",
  "Trailblazer (Fire)": "trail_fire",
  "Trailblazer (Preservation)": "trail_fire",
  "Trailblazer (Ice)": "trail_ice",
  "Trailblazer (Physical)": "trail_physical",
  "Trailblazer (Destruction)": "trail_physical",
  "trailblazer-remembrance": "trail_ice",
  "trailblazer-harmony": "trail_imag",
  "trailblazer-preservation": "trail_fire",
  "trailblazer-destruction": "trail_physical",
  "March 7th (Evernight)": "evernight",
  "March 7th (Swordmaster)": "march7_imag",
  "march-7th-evernight": "evernight",
  "march-7th-swordmaster": "march7_imag",
  "March 7th": "march7th",
  "Dan Heng • Imbibitor Lunae": "danheng_imaginary",
  "Imbibitor Lunae": "danheng_imaginary",
  "The Herta": "the_herta",
  Herta: "herta",
  "Topaz & Numby": "topaz_numby",
  Topaz: "topaz_numby",
  "Dr. Ratio": "dr_ratio",
  "dr-ratio": "dr_ratio",
  "Silver Wolf": "silverwolf",
  "Black Swan": "blackswan",
  "Ruan Mei": "ruanmei",
  "Jing Yuan": "jingyuan",
  "Fu Xuan": "fuxuan",
  "Dan Heng": "danheng",
  Phainon: "kevin",
  Acheron: "raiden",
  "tingyun-fugue": "fugue",
  "Tingyun (Fugue)": "fugue",
  cyrene: "elisia",
  Cyrene: "elisia",
};

function normalizeNameForMatching(name) {
  return name.toLowerCase()
    .replace(/[•\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCharacterId(buildCharId, charactersList) {
  // First check if buildCharId matches directly
  const directMatch = charactersList.find(c => c.id === buildCharId);
  if (directMatch) return buildCharId;

  // Check aliases - try to find by the key (character name)
  for (const [aliasName, aliasId] of Object.entries(NAME_ALIASES)) {
    if (normalizeNameForMatching(aliasName) === normalizeNameForMatching(buildCharId)) {
      return aliasId;
    }
  }

  // Try fuzzy name matching
  const normalized = normalizeNameForMatching(buildCharId);
  for (const char of charactersList) {
    const charNorm = normalizeNameForMatching(char.name);
    if (charNorm === normalized) {
      return char.id;
    }
  }

  return null;
}

function parseCharactersFromTS(content) {
  const characters = [];
  const lines = content.split("\n");
  let currentChar = null;
  let inCharacter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line === "{") {
      inCharacter = true;
      currentChar = {};
    } else if (line === "}," || line === "}") {
      if (inCharacter && currentChar && currentChar.id) {
        characters.push(currentChar);
      }
      inCharacter = false;
      currentChar = null;
    } else if (inCharacter && line.includes(":")) {
      const colonIndex = line.indexOf(":");
      const field = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();

      if (value.endsWith(",")) {
        value = value.slice(0, -1);
      }

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      currentChar[field] = value;
    }
  }

  return characters;
}

function formatBuildObject(characterId, buildData) {
  const lines = [];
  lines.push(`  ${characterId}: {`);
  lines.push(`    characterId: "${characterId}",`);
  
  // Light Cones
  lines.push(`    lightCones: [`);
  buildData.lightCones.forEach((lc, index) => {
    const isLast = index === buildData.lightCones.length - 1;
    const notes = lc.notes ? `, notes: "${lc.notes}"` : '';
    lines.push(`      { name: "${lc.name}"${notes} }${isLast ? '' : ','}`);
  });
  lines.push(`    ],`);
  
  // Relics
  lines.push(`    relics: {`);
  lines.push(`      sets: [`);
  buildData.relics.sets.forEach((set, index) => {
    const isLast = index === buildData.relics.sets.length - 1;
    const pieces = set.pieces ? `, pieces: "${set.pieces}"` : '';
    const notes = set.notes ? `, notes: "${set.notes}"` : '';
    lines.push(`        { name: "${set.name}"${pieces}${notes} }${isLast ? '' : ','}`);
  });
  lines.push(`      ],`);
  lines.push(`      planar: [`);
  buildData.relics.planar.forEach((planar, index) => {
    const isLast = index === buildData.relics.planar.length - 1;
    const notes = planar.notes ? `, notes: "${planar.notes}"` : '';
    lines.push(`        { name: "${planar.name}"${notes} }${isLast ? '' : ','}`);
  });
  lines.push(`      ],`);
  lines.push(`    },`);
  
  // Stats
  lines.push(`    stats: {`);
  lines.push(`      body: [${buildData.stats.body.map(s => `"${s}"`).join(', ')}],`);
  lines.push(`      feet: [${buildData.stats.feet.map(s => `"${s}"`).join(', ')}],`);
  lines.push(`      sphere: [${buildData.stats.sphere.map(s => `"${s}"`).join(', ')}],`);
  lines.push(`      rope: [${buildData.stats.rope.map(s => `"${s}"`).join(', ')}],`);
  lines.push(`      subStats: [${buildData.stats.subStats.map(s => `"${s}"`).join(', ')}],`);
  lines.push(`    },`);
  
  lines.push(`  },`);
  
  return lines.join('\n');
}

function mergeBuildData() {
  console.log("🔄 Merging build data from buildUpdate.json...\n");

  // Load build data
  if (!fs.existsSync(BUILD_FILE)) {
    console.error(`❌ Error: ${BUILD_FILE} not found!`);
    console.error("   Run your scraper first to generate buildUpdate.json");
    process.exit(1);
  }

  const buildData = JSON.parse(fs.readFileSync(BUILD_FILE, "utf8"));
  const buildCharacterIds = Object.keys(buildData);
  console.log(`📊 Loaded ${buildCharacterIds.length} character builds from buildUpdate.json\n`);

  // Load current characters to check which exist in the app
  const charsContent = fs.readFileSync(CHARS_FILE, "utf8");
  const characters = parseCharactersFromTS(charsContent);
  console.log(`📝 Loaded ${characters.length} characters from characters.ts\n`);

  const existingCharIds = new Set(characters.map(c => c.id));

  // Backup existing file
  if (fs.existsSync(BUILDS_TS_FILE)) {
    fs.copyFileSync(BUILDS_TS_FILE, BACKUP_FILE);
    console.log(`✅ Backed up to ${BACKUP_FILE}\n`);
  }

  // Process builds
  let matched = 0;
  let skipped = [];
  let unreleased = [];
  const report = [];
  const buildObjects = [];

  report.push("=".repeat(80));
  report.push("BUILD DATA MERGE REPORT");
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push("=".repeat(80));
  report.push("");

  buildCharacterIds.forEach((buildCharId) => {
    const charId = findCharacterId(buildCharId, characters);

    if (charId && existingCharIds.has(charId)) {
      matched++;
      const build = buildData[buildCharId];
      buildObjects.push({ id: charId, data: build });
      report.push(`✅ ${buildCharId} → ${charId}`);
    } else if (!charId) {
      // Check if it's likely an unreleased character
      if (!existingCharIds.has(buildCharId)) {
        unreleased.push(buildCharId);
        report.push(`⏳ UNRELEASED: ${buildCharId}`);
      } else {
        skipped.push(buildCharId);
        report.push(`❌ SKIPPED: ${buildCharId} (no match found)`);
      }
    }
  });

  report.push("");
  report.push("=".repeat(80));
  report.push("SUMMARY");
  report.push("=".repeat(80));
  report.push(`✅ Matched: ${matched}`);
  report.push(`⏳ Unreleased: ${unreleased.length}`);
  report.push(`❌ Skipped: ${skipped.length}`);
  report.push("");

  if (unreleased.length > 0) {
    report.push("Unreleased characters:");
    unreleased.forEach(name => report.push(`  - ${name}`));
    report.push("");
  }

  if (skipped.length > 0) {
    report.push("Skipped characters (check name mapping):");
    skipped.forEach(name => report.push(`  - ${name}`));
  }

  // Write report
  fs.writeFileSync(REPORT_FILE, report.join("\n"));
  console.log(`\n📄 Report written to ${REPORT_FILE}\n`);

  // Generate new characterBuilds.ts
  const outputLines = [];
  outputLines.push(`export type CharacterBuild = {`);
  outputLines.push(`  characterId: string;`);
  outputLines.push(`  lightCones: { name: string; notes?: string }[];`);
  outputLines.push(`  relics: {`);
  outputLines.push(`    sets: { name: string; pieces?: string; notes?: string }[];`);
  outputLines.push(`    planar: { name: string; notes?: string }[];`);
  outputLines.push(`  };`);
  outputLines.push(`  stats: {`);
  outputLines.push(`    body: string[];`);
  outputLines.push(`    feet: string[];`);
  outputLines.push(`    sphere: string[];`);
  outputLines.push(`    rope: string[];`);
  outputLines.push(`    subStats: string[];`);
  outputLines.push(`  };`);
  outputLines.push(`};`);
  outputLines.push(``);
  outputLines.push(`export const CHARACTER_BUILDS: Record<string, CharacterBuild> = {`);

  // Sort by character ID for consistency
  buildObjects.sort((a, b) => a.id.localeCompare(b.id));

  buildObjects.forEach((build) => {
    outputLines.push(formatBuildObject(build.id, build.data));
  });

  outputLines.push(`};`);
  outputLines.push(``);
  outputLines.push(`// Helper function to get build for a character`);
  outputLines.push(`export function getCharacterBuild(characterId: string): CharacterBuild | undefined {`);
  outputLines.push(`  return CHARACTER_BUILDS[characterId];`);
  outputLines.push(`}`);
  outputLines.push(``);

  fs.writeFileSync(BUILDS_TS_FILE, outputLines.join('\n'));

  console.log(`✅ Successfully merged ${matched} character builds!`);
  console.log(`⏳ Skipped ${unreleased.length} unreleased characters`);
  console.log(`❌ Could not match ${skipped.length} characters\n`);
  console.log(`📝 Updated ${BUILDS_TS_FILE}`);
  console.log(`📄 Check ${REPORT_FILE} for details`);
}

// Run the merge
try {
  mergeBuildData();
} catch (error) {
  console.error("❌ Error during merge:", error.message);
  console.error(error.stack);
  process.exit(1);
}
