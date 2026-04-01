const fs = require("fs");

const charsContent = fs.readFileSync("./src/data/characters.ts", "utf8");
const characterIds = Array.from(charsContent.matchAll(/id:\s*"([^"]+)"/g)).map((m) => m[1]);

const buildData = JSON.parse(fs.readFileSync("./src/data/buildUpdate.json", "utf8"));
const buildIds = Object.keys(buildData);

const scraperSrc = fs.readFileSync("./scripts/scrapeBuildData.js", "utf8");
const mapBlockMatch = scraperSrc.match(/const CHARACTER_URL_MAP = \{([\s\S]*?)\};/);
const mappedIds = mapBlockMatch
  ? Array.from(mapBlockMatch[1].matchAll(/"([^"]+)"\s*:\s*"([^"]+)"/g)).map((m) => m[1])
  : [];

const missingFromBuildJson = characterIds.filter((id) => !buildIds.includes(id));
const notMappedInScraper = characterIds.filter((id) => !mappedIds.includes(id));
const emptyEntries = Object.entries(buildData)
  .filter(([, b]) => (b.lightCones || []).length === 0 && (b.relics?.sets || []).length === 0)
  .map(([id]) => id);

console.log("characters.ts IDs:", characterIds.length);
console.log("buildUpdate.json entries:", buildIds.length);
console.log("missing from buildUpdate.json:", missingFromBuildJson.length, missingFromBuildJson);
console.log("not mapped in scraper:", notMappedInScraper.length, notMappedInScraper);
console.log("empty build entries (no LCs and no relic sets):", emptyEntries.length, emptyEntries);
