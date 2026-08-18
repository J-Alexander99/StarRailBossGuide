/**
 * Merges tier ratings from tierUpdate.json into characters.ts
 * 
 * Usage: node scripts/mergeTierData.js
 * 
 * This script:
 * 1. Reads tierUpdate.json (from your scraper)
 * 2. Reads existing characters.ts
 * 3. Matches characters by name (with fuzzy matching)
 * 4. Updates the rating field based on total_rating
 * 5. Generates updated characters.ts
 */

const fs = require('fs');
const path = require('path');

const TIER_FILE = path.join(__dirname, '..', 'src', 'data', 'tierUpdate.json');
const CHARS_FILE = path.join(__dirname, '..', 'src', 'data', 'characters.ts');
const BACKUP_FILE = path.join(__dirname, '..', 'src', 'data', 'characters.ts.backup');
const REPORT_FILE = path.join(__dirname, '..', 'tier-merge-report.txt');

// Name mapping for fuzzy matching
const NAME_ALIASES = {
  "Trailblazer (Remembrance)": "trail_ice",
  "Trailblazer (Imaginary)": "trail_imag",
  "Trailblazer (Harmony)": "trail_imag",
  "Trailblazer (Fire)": "trail_fire",
  "Trailblazer (Preservation)": "trail_fire",
  "Trailblazer (Ice)": "trail_ice",
  "Trailblazer (Physical)": "trail_physical",
  "Trailblazer (Destruction)": "trail_physical",
  // Prydwen's site rebuild renamed these to "Trailblazer • <Path>" (bullet,
  // named by Path rather than by Element like the parenthesis aliases above).
  "Trailblazer • Remembrance": "trail_ice",
  "Trailblazer • Harmony": "trail_imag",
  "Trailblazer • Preservation": "trail_fire",
  "Trailblazer • Destruction": "trail_physical",
  "March 7th (Evernight)": "evernight",
  "March 7th (Swordmaster)": "march7_imag",
  "March 7th": "march7th",
  "Dan Heng • Imbibitor Lunae": "danheng_imaginary",
  "Imbibitor Lunae": "danheng_imaginary",
  "The Herta": "the_herta",
  Herta: "herta",
  "Topaz & Numby": "topaz_numby",
  Topaz: "topaz_numby",
  "Dr. Ratio": "dr_ratio",
  "Silver Wolf": "silverwolf",
  "Black Swan": "blackswan",
  "Ruan Mei": "ruanmei",
  "Jing Yuan": "jingyuan",
  "Fu Xuan": "fuxuan",
  "Dan Heng": "danheng",
  Phainon: "kevin",
  Acheron: "raiden",
  Cyrene: "elysia",
};

function normalizeNameForMatching(name) {
  return name.toLowerCase()
    .replace(/[•\-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCharacterId(tierName, charactersList) {
  // Check aliases first
  if (NAME_ALIASES[tierName]) {
    return NAME_ALIASES[tierName];
  }
  
  const normalized = normalizeNameForMatching(tierName);
  
  // Try exact match first
  for (const char of charactersList) {
    if (normalizeNameForMatching(char.name) === normalized) {
      return char.id;
    }
  }
  
  // Try fuzzy match (contains)
  for (const char of charactersList) {
    const charNorm = normalizeNameForMatching(char.name);
    if (charNorm.includes(normalized) || normalized.includes(charNorm)) {
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

      if (
        field === "rating" ||
        field === "mocRating" ||
        field === "pfRating" ||
        field === "asRating"
      ) {
        currentChar[field] = parseInt(value);
      } else {
        currentChar[field] = value;
      }
    }
  }

  return characters;
}

function convertTotalRatingTo10Scale(totalRating) {
  // Total rating is out of 30 (3 modes × 10)
  // Convert to 1-10 scale
  const normalized = (totalRating / 30) * 10;
  return Math.round(normalized);
}

// Update (or insert) a single `field: value,` line within one character's
// object-literal block, preserving indentation and every other line as-is.
function updateOrInsertField(blockText, fieldName, value) {
  const lineRegex = new RegExp(`^([ \\t]*)${fieldName}:\\s*[^,\\n]+,?[ \\t]*$`, "m");
  if (lineRegex.test(blockText)) {
    return blockText.replace(lineRegex, (_, indent) => `${indent}${fieldName}: ${value},`);
  }

  const lines = blockText.split("\n");
  let closingIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/^[ \t]*\},?[ \t]*$/.test(lines[i])) {
      closingIdx = i;
      break;
    }
  }
  if (closingIdx === -1) return blockText; // shouldn't happen; leave untouched

  const idLine = lines.find((l) => /^[ \t]*id:/.test(l));
  const indent = idLine ? idLine.match(/^([ \t]*)/)[1] : "    ";
  lines.splice(closingIdx, 0, `${indent}${fieldName}: ${value},`);
  return lines.join("\n");
}

// Patch only the four rating fields for each matched character, leaving the
// rest of the file (type definitions, other fields, helper functions,
// formatting, comments) byte-for-byte untouched.
function patchRatingsInPlace(sourceText, updatedFieldsById) {
  let result = sourceText;

  for (const [charId, fields] of Object.entries(updatedFieldsById)) {
    const blockRegex = new RegExp(`\\{[^{}]*\\bid:\\s*"${charId}"[^{}]*\\}`);
    const match = blockRegex.exec(result);
    if (!match) continue; // shouldn't happen since charId came from this same file

    let block = match[0];
    block = updateOrInsertField(block, "rating", fields.rating);
    block = updateOrInsertField(block, "mocRating", fields.mocRating);
    block = updateOrInsertField(block, "pfRating", fields.pfRating);
    block = updateOrInsertField(block, "asRating", fields.asRating);

    result = result.slice(0, match.index) + block + result.slice(match.index + match[0].length);
  }

  return result;
}

function mergeTierData() {
  console.log("🔄 Merging tier data from tierUpdate.json...\n");

  // Load tier data
  if (!fs.existsSync(TIER_FILE)) {
    console.error(`❌ Error: ${TIER_FILE} not found!`);
    console.error("   Run your scraper first to generate tierUpdate.json");
    process.exit(1);
  }

  const tierData = JSON.parse(fs.readFileSync(TIER_FILE, "utf8"));
  console.log(
    `📊 Loaded ${tierData.total_characters} characters from tier list`
  );
  console.log(`   Generated: ${tierData.generated_at}\n`);

  // Load current characters
  const charsContent = fs.readFileSync(CHARS_FILE, "utf8");
  const characters = parseCharactersFromTS(charsContent);
  console.log(`📝 Loaded ${characters.length} characters from characters.ts\n`);

  // Backup existing file
  fs.copyFileSync(CHARS_FILE, BACKUP_FILE);
  console.log(`✅ Backed up to ${BACKUP_FILE}\n`);

  // Create character lookup by id
  const charMap = {};
  characters.forEach((char) => {
    charMap[char.id] = char;
  });

  // Merge tier ratings
  let matched = 0;
  let unmatched = [];
  let updated = 0;
  const report = [];
  const updatedFields = {}; // charId -> { rating, mocRating, pfRating, asRating }

  report.push("=".repeat(80));
  report.push("TIER DATA MERGE REPORT");
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Tier data from: ${tierData.generated_at}`);
  report.push("=".repeat(80));
  report.push("");

  tierData.characters.forEach((tierChar) => {
    const charId = findCharacterId(tierChar.name, characters);

    if (charId && charMap[charId]) {
      matched++;
      const char = charMap[charId];
      const newRating = tierChar.total_rating; // Use total rating directly (max 30)
      const newMocRating = tierChar.MoC_rating;
      const newPfRating = tierChar.PF_rating;
      const newAsRating = tierChar.AS_rating;

      const oldRating = char.rating || 0;
      const oldMocRating = char.mocRating || 0;
      const oldPfRating = char.pfRating || 0;
      const oldAsRating = char.asRating || 0;

      if (
        oldRating !== newRating ||
        oldMocRating !== newMocRating ||
        oldPfRating !== newPfRating ||
        oldAsRating !== newAsRating
      ) {
        updated++;
        report.push(`✏️  UPDATED: ${char.name} (${char.id})`);
        report.push(`   Overall: ${oldRating} → ${newRating}`);
        report.push(
          `   MoC: ${oldMocRating} → ${newMocRating} | PF: ${oldPfRating} → ${newPfRating} | AS: ${oldAsRating} → ${newAsRating}`
        );
        report.push("");
      }

      char.rating = newRating;
      char.mocRating = newMocRating;
      char.pfRating = newPfRating;
      char.asRating = newAsRating;

      updatedFields[charId] = {
        rating: newRating,
        mocRating: newMocRating,
        pfRating: newPfRating,
        asRating: newAsRating,
      };
    } else {
      unmatched.push(tierChar.name);
      report.push(
        `⚠️  UNMATCHED: "${tierChar.name}" - no matching character found`
      );
      report.push(
        `   Tier scores: MoC=${tierChar.MoC_rating} PF=${tierChar.PF_rating} AS=${tierChar.AS_rating} (Total=${tierChar.total_rating})`
      );
      report.push("");
    }
  });

  // Patch ratings in place rather than regenerating the whole file: this
  // file accumulates hand-added types/fields/helper functions over time
  // (e.g. the Implant type, subMeta/implant fields, getCharacterMetaTypes)
  // that a from-scratch template would silently drop.
  const content = patchRatingsInPlace(charsContent, updatedFields);

  // Write updated file
  fs.writeFileSync(CHARS_FILE, content);
  console.log(`✅ Updated ${CHARS_FILE}\n`);

  // Write report
  report.push("");
  report.push("=".repeat(80));
  report.push("SUMMARY");
  report.push("=".repeat(80));
  report.push(`Total tier list characters: ${tierData.total_characters}`);
  report.push(`Matched: ${matched}`);
  report.push(`Updated ratings: ${updated}`);
  report.push(`Unmatched: ${unmatched.length}`);
  report.push("");

  if (unmatched.length > 0) {
    report.push("Unmatched characters:");
    unmatched.forEach((name) => report.push(`  - ${name}`));
  }

  fs.writeFileSync(REPORT_FILE, report.join("\n"));
  console.log(`📋 Summary:`);
  console.log(`   Matched: ${matched}/${tierData.total_characters}`);
  console.log(`   Updated: ${updated} characters`);
  console.log(`   Unmatched: ${unmatched.length}`);

  if (unmatched.length > 0) {
    console.log(`\n⚠️  Unmatched characters (add to NAME_ALIASES in script):`);
    unmatched.forEach((name) => console.log(`   - ${name}`));
  }

  console.log(`\n📄 Full report saved to: ${REPORT_FILE}`);
  console.log("\n✨ Done!");
}

// Run the merge
try {
  mergeTierData();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
