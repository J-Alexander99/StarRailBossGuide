const fs = require("fs");
const path = require("path");

const TIER_FILE = path.join(__dirname, "..", "src", "data", "tierUpdate.json");
const CHARS_FILE = path.join(__dirname, "..", "src", "data", "characters.ts");
const REPORT_FILE = path.join(__dirname, "..", "tier-merge-report.txt");

const NAME_ALIASES = {
  "trailblazer remembrance": "trail_ice",
  "trailblazer imaginary": "trail_imag",
  "trailblazer harmony": "trail_imag",
  "trailblazer fire": "trail_fire",
  "trailblazer preservation": "trail_fire",
  "trailblazer ice": "trail_ice",
  "trailblazer physical": "trail_physical",
  "trailblazer destruction": "trail_physical",
  "march 7th evernight": "evernight",
  "march 7th swordmaster": "march7_imag",
  "march 7th": "march7th",
  "dan heng imbibitor lunae": "danheng_imaginary",
  "imbibitor lunae": "danheng_imaginary",
  "the herta": "the_herta",
  herta: "herta",
  "topaz numby": "topaz_numby",
  topaz: "topaz_numby",
  "dr ratio": "dr_ratio",
  "silver wolf": "silverwolf",
  "black swan": "blackswan",
  "ruan mei": "ruanmei",
  "jing yuan": "jingyuan",
  "fu xuan": "fuxuan",
  "dan heng": "danheng",
  phainon: "kevin",
  acheron: "raiden",
};

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[•]/g, "")
    .replace(/[()]/g, " ")
    .replace(/[\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getObjectRangeById(source, id) {
  const idNeedle = `id: "${id}"`;
  const idPos = source.indexOf(idNeedle);
  if (idPos === -1) return null;

  let start = idPos;
  while (start >= 0 && source[start] !== "{") {
    start--;
  }
  if (start < 0) return null;

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = start; i < source.length; i++) {
    const ch = source[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === quote) {
        inString = false;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }

    if (ch === "{") depth++;
    if (ch === "}") depth--;

    if (depth === 0) {
      return { start, end: i + 1 };
    }
  }

  return null;
}

function setNumericField(objectBlock, field, value) {
  const fieldRegex = new RegExp(`(^\\s*${field}:\\s*)(\\d+)(,\\s*$)`, "m");
  if (fieldRegex.test(objectBlock)) {
    return objectBlock.replace(fieldRegex, `$1${value}$3`);
  }

  const insert = `\n    ${field}: ${value},`;
  return objectBlock.replace(/\n\s*}\s*$/, `${insert}\n  }`);
}

function parseCharacterIndex(source) {
  const index = [];
  const objectStartRegex = /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?\n\s*name:\s*"([^"]+)"/g;
  let match;

  while ((match = objectStartRegex.exec(source)) !== null) {
    index.push({
      id: match[1],
      name: match[2],
      normalized: normalizeName(match[2]),
    });
  }

  return index;
}

function findCharacterId(tierName, charIndex) {
  const normalized = normalizeName(tierName);

  if (NAME_ALIASES[normalized]) {
    return NAME_ALIASES[normalized];
  }

  const exact = charIndex.find((c) => c.normalized === normalized);
  if (exact) return exact.id;

  const fuzzy = charIndex.find(
    (c) => c.normalized.includes(normalized) || normalized.includes(c.normalized)
  );
  return fuzzy ? fuzzy.id : null;
}

function main() {
  if (!fs.existsSync(TIER_FILE)) {
    console.error(`Missing tier file: ${TIER_FILE}`);
    process.exit(1);
  }

  const tierData = JSON.parse(fs.readFileSync(TIER_FILE, "utf8"));
  let source = fs.readFileSync(CHARS_FILE, "utf8");
  const charIndex = parseCharacterIndex(source);

  let updated = 0;
  let unmatched = 0;
  const report = [];
  report.push("=".repeat(80));
  report.push("SAFE CHARACTER RATING UPDATE REPORT");
  report.push(`Generated: ${new Date().toISOString()}`);
  report.push(`Tier data from: ${tierData.generated_at}`);
  report.push("=".repeat(80));
  report.push("");

  for (const row of tierData.characters || []) {
    const id = findCharacterId(row.name, charIndex);
    if (!id) {
      unmatched++;
      report.push(`UNMATCHED: ${row.name}`);
      continue;
    }

    const range = getObjectRangeById(source, id);
    if (!range) {
      unmatched++;
      report.push(`UNMATCHED_ID: ${row.name} -> ${id}`);
      continue;
    }

    const oldBlock = source.slice(range.start, range.end);
    const moc = Math.round(Number(row.MoC_rating || 0));
    const pf = Math.round(Number(row.PF_rating || 0));
    const as = Math.round(Number(row.AS_rating || 0));
    const total = Math.round(Number(row.total_rating || moc + pf + as));

    let newBlock = oldBlock;
    newBlock = setNumericField(newBlock, "rating", total);
    newBlock = setNumericField(newBlock, "mocRating", moc);
    newBlock = setNumericField(newBlock, "pfRating", pf);
    newBlock = setNumericField(newBlock, "asRating", as);

    if (newBlock !== oldBlock) {
      source = source.slice(0, range.start) + newBlock + source.slice(range.end);
      updated++;
      report.push(`UPDATED: ${row.name} -> ${id} | ${moc}/${pf}/${as} (total ${total})`);
    }
  }

  fs.writeFileSync(CHARS_FILE, source, "utf8");

  report.push("");
  report.push(`Total in tier file: ${(tierData.characters || []).length}`);
  report.push(`Updated: ${updated}`);
  report.push(`Unmatched: ${unmatched}`);

  fs.writeFileSync(REPORT_FILE, `${report.join("\n")}\n`, "utf8");

  console.log(`Updated ${updated} character entries.`);
  console.log(`Unmatched entries: ${unmatched}`);
}

main();
