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
  const lines = content.split('\n');
  let currentChar = null;
  let inCharacter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line === '{') {
      inCharacter = true;
      currentChar = {};
    } else if (line === '},' || line === '}') {
      if (inCharacter && currentChar && currentChar.id) {
        characters.push(currentChar);
      }
      inCharacter = false;
      currentChar = null;
    } else if (inCharacter && line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const field = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      if (value.endsWith(',')) {
        value = value.slice(0, -1);
      }
      
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (field === 'rating') {
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

function mergeTierData() {
  console.log('🔄 Merging tier data from tierUpdate.json...\n');
  
  // Load tier data
  if (!fs.existsSync(TIER_FILE)) {
    console.error(`❌ Error: ${TIER_FILE} not found!`);
    console.error('   Run your scraper first to generate tierUpdate.json');
    process.exit(1);
  }
  
  const tierData = JSON.parse(fs.readFileSync(TIER_FILE, 'utf8'));
  console.log(`📊 Loaded ${tierData.total_characters} characters from tier list`);
  console.log(`   Generated: ${tierData.generated_at}\n`);
  
  // Load current characters
  const charsContent = fs.readFileSync(CHARS_FILE, 'utf8');
  const characters = parseCharactersFromTS(charsContent);
  console.log(`📝 Loaded ${characters.length} characters from characters.ts\n`);
  
  // Backup existing file
  fs.copyFileSync(CHARS_FILE, BACKUP_FILE);
  console.log(`✅ Backed up to ${BACKUP_FILE}\n`);
  
  // Create character lookup by id
  const charMap = {};
  characters.forEach(char => {
    charMap[char.id] = char;
  });
  
  // Merge tier ratings
  let matched = 0;
  let unmatched = [];
  let updated = 0;
  const report = [];
  
  report.push('='.repeat(80));
  report.push('TIER DATA MERGE REPORT');
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Tier data from: ${tierData.generated_at}`);
  report.push('='.repeat(80));
  report.push('');
  
  tierData.characters.forEach(tierChar => {
    const charId = findCharacterId(tierChar.name, characters);
    
    if (charId && charMap[charId]) {
      matched++;
      const char = charMap[charId];
      const newRating = convertTotalRatingTo10Scale(tierChar.total_rating);
      const oldRating = char.rating || 0;
      
      if (oldRating !== newRating) {
        updated++;
        report.push(`✏️  UPDATED: ${char.name} (${char.id})`);
        report.push(`   Old rating: ${oldRating} → New rating: ${newRating}`);
        report.push(`   Tier scores: MoC=${tierChar.MoC_rating} PF=${tierChar.PF_rating} AS=${tierChar.AS_rating} (Total=${tierChar.total_rating})`);
        report.push('');
      }
      
      char.rating = newRating;
    } else {
      unmatched.push(tierChar.name);
      report.push(`⚠️  UNMATCHED: "${tierChar.name}" - no matching character found`);
      report.push(`   Tier scores: MoC=${tierChar.MoC_rating} PF=${tierChar.PF_rating} AS=${tierChar.AS_rating} (Total=${tierChar.total_rating})`);
      report.push('');
    }
  });
  
  // Generate updated TypeScript
  const TYPE_DEFINITIONS = `export type Element = 'Fire' | 'Ice' | 'Lightning' | 'Physical' | 'Quantum' | 'Wind' | 'Imaginary' | 'All';

export type Path = 'Destruction' | 'Hunt' | 'Erudition' | 'Harmony' | 'Nihility' | 'Preservation' | 'Abundance' | 'Remembrance';

export type Role = 'Sub-DPS' | 'DPS' | 'Support' | 'Sustain';

export type Target = "Single" | "Blast" | "AoE" | "Team";

export type Meta =
  | "DOT"
  | "Crit"
  | "Break"
  | "Follow-Up"
  | "Summon"
  | "General"
  | "Kevin"
  | "Raiden"
  | "Ultimate";

export type Character = {
  id: string;
  name: string;
  element: Element;
  path?: Path;
  role?: Role;
  meta?: Meta;
  target?: Target;
  rating?: number; // 1 to 10 stars
};

`;

  // Group by element
  const byElement = {
    Physical: [],
    Fire: [],
    Ice: [],
    Lightning: [],
    Wind: [],
    Quantum: [],
    Imaginary: [],
    All: []
  };
  
  characters.forEach(char => {
    if (byElement[char.element]) {
      byElement[char.element].push(char);
    }
  });
  
  // Sort within each element group by name
  Object.keys(byElement).forEach(element => {
    byElement[element].sort((a, b) => a.name.localeCompare(b.name));
  });
  
  // Generate TypeScript content
  let content = TYPE_DEFINITIONS;
  content += 'export const CHARACTERS: Character[] = [\n';
  
  const elementOrder = ['Physical', 'Fire', 'Ice', 'Lightning', 'Wind', 'Quantum', 'Imaginary', 'All'];
  
  elementOrder.forEach((element, index) => {
    const chars = byElement[element];
    if (chars.length > 0) {
      content += `  // ${element}\n`;
      chars.forEach((char, charIndex) => {
        content += '  {\n';
        content += `    id: "${char.id}",\n`;
        content += `    name: "${char.name}",\n`;
        content += `    element: "${char.element}",\n`;
        if (char.path) content += `    path: "${char.path}",\n`;
        if (char.role) content += `    role: "${char.role}",\n`;
        if (char.meta) content += `    meta: "${char.meta}",\n`;
        if (char.target) content += `    target: "${char.target}",\n`;
        if (char.rating) content += `    rating: ${char.rating},\n`;
        content += '  }';
        if (charIndex < chars.length - 1 || index < elementOrder.length - 1) {
          content += ',\n';
        }
      });
      if (index < elementOrder.length - 1) {
        content += '\n';
      }
    }
  });
  
  content += '\n];\n';
  
  // Write updated file
  fs.writeFileSync(CHARS_FILE, content);
  console.log(`✅ Updated ${CHARS_FILE}\n`);
  
  // Write report
  report.push('');
  report.push('='.repeat(80));
  report.push('SUMMARY');
  report.push('='.repeat(80));
  report.push(`Total tier list characters: ${tierData.total_characters}`);
  report.push(`Matched: ${matched}`);
  report.push(`Updated ratings: ${updated}`);
  report.push(`Unmatched: ${unmatched.length}`);
  report.push('');
  
  if (unmatched.length > 0) {
    report.push('Unmatched characters:');
    unmatched.forEach(name => report.push(`  - ${name}`));
  }
  
  fs.writeFileSync(REPORT_FILE, report.join('\n'));
  console.log(`📋 Summary:`);
  console.log(`   Matched: ${matched}/${tierData.total_characters}`);
  console.log(`   Updated: ${updated} characters`);
  console.log(`   Unmatched: ${unmatched.length}`);
  
  if (unmatched.length > 0) {
    console.log(`\n⚠️  Unmatched characters (add to NAME_ALIASES in script):`);
    unmatched.forEach(name => console.log(`   - ${name}`));
  }
  
  console.log(`\n📄 Full report saved to: ${REPORT_FILE}`);
  console.log('\n✨ Done!');
}

// Run the merge
try {
  mergeTierData();
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error(error.stack);
  process.exit(1);
}
