const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "buildUpdate.json");
const CHARS_FILE = path.join(__dirname, "..", "src", "data", "characters.ts");
const BASE_URL = "https://www.prydwen.gg/star-rail/characters";
const DEFAULT_DELAY_MS = 500;
const JITTER_MS = 500;
const MAX_FETCH_RETRIES = 3;
const PAGE_TIMEOUT_MS = 45000;

// Some character pages leak low-rarity light cone names into relic slots.
// Strip those known light-cone-only names from relic set recommendations.
const NON_RELIC_SET_NAMES = new Set([
  "adversarial",
  "collapsing sky",
  "meshing cogs",
  "multiplication",
  "passkey",
  "reminiscence",
]);

// Map character IDs to their Prydwen character page URLs
const CHARACTER_URL_MAP = {
  "acheron": "acheron",
  "aglaea": "aglaea",
  "anaxa": "anaxa",
  "archer": "archer",
  "argenti": "argenti",
  "arlan": "arlan",
  "asta": "asta",
  "aventurine": "aventurine",
  "bailu": "bailu",
  "blackswan": "black-swan",
  "blade": "blade",
  "boothill": "boothill",
  "bronya": "bronya",
  "castorice": "castorice",
  "cerydra": "cerydra",
  "cipher": "cipher",
  "clara": "clara",
  "danheng": "dan-heng",
  "danheng_imaginary": "imbibitor-lunae",
  "danheng_terrae": "dan-heng-permansor-terrae",
  "dr_ratio": "dr-ratio",
  "feixiao": "feixiao",
  "firefly": "firefly",
  "fuxuan": "fu-xuan",
  "gallagher": "gallagher",
  "gepard": "gepard",
  "guinaifen": "guinaifen",
  "hanya": "hanya",
  "herta": "herta",
  "himeko": "himeko",
  "hook": "hook",
  "huohuo": "huohuo",
  "hyacine": "hyacine",
  "hysilens": "hysilens",
  "jade": "jade",
  "jiaoqiu": "jiaoqiu",
  "jingyuan": "jing-yuan",
  "jingliu": "jingliu",
  "kafka": "kafka",
  "kevin": "phainon",
  "luka": "luka",
  "luocha": "luocha",
  "lynx": "lynx",
  "march7th": "march-7th",
  "evernight": "march-7th-evernight",
  "march7_imag": "march-7th-swordmaster",
  "misha": "misha",
  "moze": "moze",
  "mydei": "mydei",
  "natasha": "natasha",
  "pela": "pela",
  "qingque": "qingque",
  "rappa": "rappa",
  "robin": "robin",
  "ruanmei": "ruan-mei",
  "saber": "saber",
  "sampo": "sampo",
  "seele": "seele",
  "serval": "serval",
  "silverwolf": "silver-wolf",
  "sparkle": "sparkle",
  "sunday": "sunday",
  "sushang": "sushang",
  "thedahlia": "the-dahlia",
  "the_herta": "the-herta",
  "tingyun": "tingyun",
  "fugue": "tingyun-fugue",
  "topaz_numby": "topaz",
  "trail_physical": "trailblazer-destruction",
  "trail_fire": "trailblazer-preservation",
  "trail_ice": "trailblazer-remembrance",
  "trail_imag": "trailblazer-harmony",
  "tribbie": "tribbie",
  "welt": "welt",
  "xueyi": "xueyi",
  "yanqing": "yanqing",
  "yukong": "yukong",
  "yunli": "yunli",
  "lingsha": "lingsha",
  "ashveil": "ashveil",
  "sparxie": "sparxie",
  "yaoguang": "yao-guang",
  "raiden": "acheron",
  "elisia": "cyrene",
  "elysia": "cyrene",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Prydwen now fronts the site with a Cloudflare JS challenge, so a plain
// fetch()/curl gets a 403. A real (headless) browser passes it fine.
async function fetchRenderedHtml(browser, url) {
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_FETCH_RETRIES; attempt++) {
    const page = await browser.newPage();
    try {
      await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
      );
      await page.setViewport({ width: 1366, height: 900 });

      const resp = await page.goto(url, { waitUntil: "networkidle2", timeout: PAGE_TIMEOUT_MS });
      if (!resp || !resp.ok()) {
        throw new Error(`Failed to fetch ${url} (${resp ? resp.status() : "no response"})`);
      }

      // Give hydration a moment to settle before reading the DOM.
      await sleep(800);
      return await page.content();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_FETCH_RETRIES) {
        const backoff = attempt * 1200 + Math.floor(Math.random() * 500);
        await sleep(backoff);
      }
    } finally {
      await page.close().catch(() => {});
    }
  }

  throw lastError || new Error(`Failed to fetch ${url}`);
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function normalizeItemName(name) {
  return decodeHtmlEntities(
    String(name || "")
      .trim()
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
  );
}

// Find the [start,end) span of the div opened by the tag at openTagIndex/openTagText.
function findDivInnerSpan(html, openTagIndex, openTagText) {
  const startTagEnd = openTagIndex + openTagText.length;
  const divTagRegex = /<\/?div\b[^>]*>/gi;
  divTagRegex.lastIndex = startTagEnd;

  let depth = 1;
  let match;
  while ((match = divTagRegex.exec(html)) !== null) {
    if (match[0][1] === "/") depth -= 1;
    else depth += 1;
    if (depth === 0) return [startTagEnd, match.index];
  }
  return null;
}

// Find all <div class="...CLASS..."> blocks (nesting-aware) and return their [start,end) spans.
function findDivBlockSpansByClass(html, className, fromIndex = 0) {
  const spans = [];
  const classRegex = new RegExp(`<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "gi");
  classRegex.lastIndex = fromIndex;
  let classMatch;
  while ((classMatch = classRegex.exec(html)) !== null) {
    const span = findDivInnerSpan(html, classMatch.index, classMatch[0]);
    if (span) {
      spans.push({ outerStart: classMatch.index, innerStart: span[0], innerEnd: span[1] });
      classRegex.lastIndex = span[1];
    }
  }
  return spans;
}

function findHeadingIndex(html, textPattern, fromIndex = 0) {
  const re = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  re.lastIndex = fromIndex;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = normalizeItemName(m[1]);
    if (textPattern.test(text)) {
      return { index: m.index, end: re.lastIndex, text };
    }
  }
  return null;
}

// Slice out the HTML between one heading and the next matching heading (or
// end of document if there's no next section on the page).
function extractBuildSection(html, headingPattern, stopPattern) {
  const heading = findHeadingIndex(html, headingPattern);
  if (!heading) return "";
  const stop = findHeadingIndex(html, stopPattern, heading.end);
  const endIndex = stop ? stop.index : html.length;
  return html.slice(heading.end, endIndex);
}

// Light cones / relic sets / planar ornaments are each rendered as an <img>
// (holding the clean item name in its alt attribute) inside a wrapper <div>
// whose class identifies the item type (hsr-cone-icon, hsr-set-image relic,
// hsr-set-image planetary). Relic/planar entries also carry a "(N-PC)" piece
// count in a sibling span shortly after the image.
function extractSetItems(sectionHtml, wrapperClassPattern, { withPieces = false } = {}) {
  const items = [];
  const seen = new Set();
  const wrapperRegex = new RegExp(
    `<div[^>]*class=["'][^"']*${wrapperClassPattern.source}[^"']*["'][^>]*>\\s*<img[^>]*\\balt="([^"]*)"`,
    "gi"
  );
  let m;
  while ((m = wrapperRegex.exec(sectionHtml)) !== null) {
    const name = normalizeItemName(m[1]);
    if (!name || seen.has(name)) continue;

    let pieces = "";
    if (withPieces) {
      const window = sectionHtml.slice(m.index, m.index + 1500);
      const pcMatch = normalizeItemName(window).match(/\((\d+)\s*-?PC\)/i);
      if (pcMatch) pieces = `${pcMatch[1]}pc`;
    }

    seen.add(name);
    items.push(withPieces ? { name, pieces } : name);
  }
  return items;
}

function extractStats(html) {
  const emptyStats = { body: [], feet: [], sphere: [], rope: [], subStats: [] };

  // The "Best Stats" heading lives inside one of possibly several
  // build-stats blocks (there's also a "Traces priority" block with the
  // same class) — pick the one that actually contains the stats heading.
  const spans = findDivBlockSpansByClass(html, "build-stats");
  let statsBlock = "";
  for (const span of spans) {
    const inner = html.slice(span.innerStart, span.innerEnd);
    if (/best\s+stats/i.test(inner)) {
      statsBlock = inner;
      break;
    }
  }
  if (!statsBlock) return emptyStats;

  const result = { ...emptyStats };
  const slotKeyMap = {
    body: "body",
    feet: "feet",
    "planar sphere": "sphere",
    "link rope": "rope",
  };

  for (const span of findDivBlockSpansByClass(statsBlock, "box")) {
    const boxHtml = statsBlock.slice(span.innerStart, span.innerEnd);
    const headerMatch = boxHtml.match(/<div[^>]*class=["'][^"']*stats-header[^"']*["'][^>]*><span>([^<]*)<\/span>/i);
    if (!headerMatch) continue;

    const slot = slotKeyMap[normalizeItemName(headerMatch[1]).toLowerCase()];
    if (!slot) continue;

    const statNames = [];
    const statRegex = /<div[^>]*class=["'][^"']*hsr-stat[^"']*["'][^>]*>[\s\S]*?<span[^>]*>([^<]*)<\/span>\s*<\/div>/gi;
    let sm;
    while ((sm = statRegex.exec(boxHtml)) !== null) {
      const name = normalizeItemName(sm[1]);
      if (name) statNames.push(name);
    }
    result[slot] = statNames;
  }

  // Substats box: <div class="box sub-stats..."><span>Substats:</span><p>...</p></div>
  const subStatsMatch = statsBlock.match(
    /<div[^>]*class=["'][^"']*\bsub-stats\b[^"']*["'][^>]*>\s*<span>Substats:<\/span>\s*<p>([\s\S]*?)<\/p>/i
  );
  if (subStatsMatch) {
    const text = normalizeItemName(subStatsMatch[1]);
    if (text) result.subStats = [text];
  }

  return result;
}

function extractBuildData(html) {
  try {
    const lightConesSection = extractBuildSection(html, /best\s+light\s+cones/i, /best\s+relic\s+sets/i);
    const relicSection = extractBuildSection(html, /best\s+relic\s+sets/i, /best\s+planetary\s+sets/i);
    const planarSection = extractBuildSection(html, /best\s+planetary\s+sets/i, /best\s+stats/i);

    return {
      lightCones: extractSetItems(lightConesSection, /hsr-cone-icon/i).slice(0, 11),
      relicSets: extractSetItems(relicSection, /hsr-set-image\s+relic/i, { withPieces: true }).slice(0, 6),
      planarOrnaments: extractSetItems(planarSection, /hsr-set-image\s+planetary/i, { withPieces: true }).slice(0, 6),
      stats: extractStats(html),
    };
  } catch (error) {
    console.error(`Error parsing build data: ${error.message}`);
    return {
      lightCones: [],
      relicSets: [],
      planarOrnaments: [],
      stats: { body: [], feet: [], sphere: [], rope: [], subStats: [] },
    };
  }
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

function formatBuild(characterId, buildData) {
  const stats = buildData.stats || {};

  // relicSets/planarOrnaments may be plain name strings (from the merge
  // fallback path) or {name, pieces} objects (fresh scrape output).
  const asRelicSet = (entry) =>
    typeof entry === "string"
      ? { name: entry, pieces: "4pc", notes: "" }
      : { name: entry.name, pieces: entry.pieces || "4pc", notes: "" };
  const asPlanar = (entry) =>
    typeof entry === "string" ? { name: entry, notes: "" } : { name: entry.name, notes: "" };
  const asLightCone = (entry) => ({ name: typeof entry === "string" ? entry : entry.name, notes: "" });

  return {
    characterId: characterId,
    lightCones: (buildData.lightCones || []).map(asLightCone),
    relics: {
      sets: (buildData.relicSets || []).map(asRelicSet),
      planar: (buildData.planarOrnaments || []).map(asPlanar),
    },
    stats: {
      body: Array.isArray(stats.body) && stats.body.length ? stats.body : ["CRIT Rate", "CRIT DMG"],
      feet: Array.isArray(stats.feet) && stats.feet.length ? stats.feet : ["ATK%", "Speed"],
      sphere: Array.isArray(stats.sphere) && stats.sphere.length ? stats.sphere : ["ATK%"],
      rope: Array.isArray(stats.rope) && stats.rope.length ? stats.rope : ["ATK%"],
      subStats: Array.isArray(stats.subStats) && stats.subStats.length ? stats.subStats : ["ATK%", "CRIT DMG", "CRIT Rate", "Speed"],
    },
  };
}

function sanitizeFormattedBuild(formattedBuild) {
  const sanitized = JSON.parse(JSON.stringify(formattedBuild));

  if (sanitized?.relics?.sets?.length) {
    sanitized.relics.sets = sanitized.relics.sets.filter((setEntry) => {
      const name = String(setEntry?.name || "").toLowerCase().trim();
      return name && !NON_RELIC_SET_NAMES.has(name);
    });
  }

  return sanitized;
}

function loadExistingBuilds() {
  if (!fs.existsSync(OUTPUT_FILE)) return {};

  try {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, "utf8"));
  } catch (_) {
    return {};
  }
}

function normalizeExistingList(items) {
  if (!Array.isArray(items)) return [];

  return items
    .map((item) => {
      if (!item) return "";
      if (typeof item === "string") return item;
      if (typeof item === "object" && item.name) return String(item.name);
      return "";
    })
    .map((s) => s.trim())
    .filter(Boolean);
}

function mergeWithExisting(characterId, scrapedData, existingBuild) {
  const existingLightCones = normalizeExistingList(existingBuild?.lightCones);
  const existingRelicSets = normalizeExistingList(existingBuild?.relics?.sets);
  const existingPlanar = normalizeExistingList(existingBuild?.relics?.planar);

  const existingStats = {
    body: Array.isArray(existingBuild?.stats?.body) ? existingBuild.stats.body : [],
    feet: Array.isArray(existingBuild?.stats?.feet) ? existingBuild.stats.feet : [],
    sphere: Array.isArray(existingBuild?.stats?.sphere) ? existingBuild.stats.sphere : [],
    rope: Array.isArray(existingBuild?.stats?.rope) ? existingBuild.stats.rope : [],
    subStats: Array.isArray(existingBuild?.stats?.subStats) ? existingBuild.stats.subStats : [],
  };

  const mergedInput = {
    lightCones: scrapedData.lightCones.length ? scrapedData.lightCones : existingLightCones,
    relicSets: scrapedData.relicSets.length ? scrapedData.relicSets : existingRelicSets,
    planarOrnaments: scrapedData.planarOrnaments.length ? scrapedData.planarOrnaments : existingPlanar,
    stats:
      (Array.isArray(scrapedData?.stats?.body) && scrapedData.stats.body.length) ||
      (Array.isArray(scrapedData?.stats?.feet) && scrapedData.stats.feet.length) ||
      (Array.isArray(scrapedData?.stats?.sphere) && scrapedData.stats.sphere.length) ||
      (Array.isArray(scrapedData?.stats?.rope) && scrapedData.stats.rope.length) ||
      (Array.isArray(scrapedData?.stats?.subStats) && scrapedData.stats.subStats.length)
      ? scrapedData.stats
      : [
          ...existingStats.body,
          ...existingStats.feet,
          ...existingStats.sphere,
          ...existingStats.rope,
          ...existingStats.subStats,
        ].filter(Boolean),
  };

  const formatted = formatBuild(characterId, mergedInput);

  const scrapedHasStats =
    (Array.isArray(scrapedData?.stats?.body) && scrapedData.stats.body.length) ||
    (Array.isArray(scrapedData?.stats?.feet) && scrapedData.stats.feet.length) ||
    (Array.isArray(scrapedData?.stats?.sphere) && scrapedData.stats.sphere.length) ||
    (Array.isArray(scrapedData?.stats?.rope) && scrapedData.stats.rope.length) ||
    (Array.isArray(scrapedData?.stats?.subStats) && scrapedData.stats.subStats.length);

  if (!scrapedHasStats) {
    formatted.stats = {
      body: existingStats.body.length ? existingStats.body : formatted.stats.body,
      feet: existingStats.feet.length ? existingStats.feet : formatted.stats.feet,
      sphere: existingStats.sphere.length ? existingStats.sphere : formatted.stats.sphere,
      rope: existingStats.rope.length ? existingStats.rope : formatted.stats.rope,
      subStats: existingStats.subStats.length ? existingStats.subStats : formatted.stats.subStats,
    };
  }

  return sanitizeFormattedBuild(formatted);
}

async function scrapeBuildData() {
  console.log("Scraping character builds from Prydwen...\n");

  const argv = process.argv.slice(2);
  const singleCharFlagIndex = argv.indexOf("--character");
  const shortCharFlagIndex = argv.indexOf("-c");
  const positionalChar = argv.find((arg) => !arg.startsWith("-"));
  const singleCharId =
    singleCharFlagIndex >= 0
      ? String(argv[singleCharFlagIndex + 1] || "").trim()
      : shortCharFlagIndex >= 0
        ? String(argv[shortCharFlagIndex + 1] || "").trim()
        : String(positionalChar || "").trim();

  // Load existing characters
  const charsContent = fs.readFileSync(CHARS_FILE, "utf8");
  const allCharacters = parseCharactersFromTS(charsContent);
  const characters = singleCharId
    ? allCharacters.filter((c) => c.id === singleCharId)
    : allCharacters;

  if (singleCharId && characters.length === 0) {
    console.error(`❌ Character '${singleCharId}' was not found in characters.ts`);
    process.exit(1);
  }

  const existingBuilds = loadExistingBuilds();
  console.log(`📝 Loaded ${allCharacters.length} characters from characters.ts`);
  if (singleCharId) {
    console.log(`🎯 Single-character mode enabled: ${singleCharId}`);
  }
  console.log("");

  const builds = {};
  let succeeded = 0;
  let failed = 0;
  const errors = [];
  const unmapped = [];
  const emptyAfterScrape = [];
  const processed = [];

  console.log("Fetching character pages from Prydwen (headless browser)...");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  try {
    for (const char of characters) {
      const charId = char.id;
      const prydwenCharName = CHARACTER_URL_MAP[charId];
      const existingBuild = existingBuilds[charId];

      if (!prydwenCharName) {
        // Keep unmapped characters in output so buildUpdate.json stays complete.
        builds[charId] = existingBuild || formatBuild(charId, {});
        unmapped.push(charId);
        failed++;
        continue;
      }

      const url = `${BASE_URL}/${prydwenCharName}`;
      processed.push(charId);

      try {
        const html = await fetchRenderedHtml(browser, url);
        const buildData = extractBuildData(html);

        // Check if we got meaningful data
        const hasData =
          buildData.lightCones.length > 0 ||
          buildData.relicSets.length > 0 ||
          buildData.planarOrnaments.length > 0 ||
          (Array.isArray(buildData?.stats?.body) && buildData.stats.body.length > 0) ||
          (Array.isArray(buildData?.stats?.feet) && buildData.stats.feet.length > 0) ||
          (Array.isArray(buildData?.stats?.sphere) && buildData.stats.sphere.length > 0) ||
          (Array.isArray(buildData?.stats?.rope) && buildData.stats.rope.length > 0) ||
          (Array.isArray(buildData?.stats?.subStats) && buildData.stats.subStats.length > 0);

        if (hasData) {
          builds[charId] = mergeWithExisting(charId, buildData, existingBuild);
          succeeded++;
        } else {
          builds[charId] = existingBuild || formatBuild(charId, {});
          emptyAfterScrape.push(charId);
          failed++;
        }

        process.stdout.write(`\r  ✅ ${processed.length}/${characters.length} (${succeeded} with data, ${failed} empty)`);
      } catch (error) {
        errors.push({ charId, error: error.message });
        builds[charId] = existingBuilds[charId] || formatBuild(charId, {});
        failed++;
        process.stdout.write(`\r  ⚠️  ${processed.length}/${characters.length} (${succeeded} with data, ${failed} empty/failed)`);
      }

      // Slow, jittered pacing to reduce the chance of anti-bot throttling.
      if (!singleCharId || processed.length < characters.length) {
        await sleep(DEFAULT_DELAY_MS + Math.floor(Math.random() * JITTER_MS));
      }
    }
  } finally {
    await browser.close();
  }

  console.log("\n");

  // Save the builds
  const outputData = singleCharId
    ? { ...existingBuilds, ...builds }
    : builds;
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(outputData, null, 2) + "\n", "utf8");

  console.log(`✅ Build data saved to ${OUTPUT_FILE}`);
  console.log(`📊 Total characters processed: ${processed.length}`);
  console.log(`📈 Successfully scraped with data: ${succeeded}`);
  console.log(`⚠️  Empty/partial: ${failed}`);

  if (unmapped.length > 0) {
    console.log(`\n🧭 Unmapped character IDs (${unmapped.length}):`);
    console.log(`   ${unmapped.join(", ")}`);
  }

  if (emptyAfterScrape.length > 0) {
    console.log(`\n🪫 Characters with no scraped build blocks (${emptyAfterScrape.length}):`);
    console.log(`   ${emptyAfterScrape.slice(0, 25).join(", ")}${emptyAfterScrape.length > 25 ? ", ..." : ""}`);
  }

  if (errors.length > 0) {
    console.log(`\n❌ ${errors.length} errors encountered:`);
    errors.slice(0, 5).forEach(({ charId, error }) => console.log(`   - ${charId}: ${error}`));
    if (errors.length > 5) {
      console.log(`   ... and ${errors.length - 5} more`);
    }
  }
}

// Run the scraper
scrapeBuildData().catch((err) => {
  console.error(`❌ Error: ${err.message}`);
  process.exit(1);
});
