const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const TIER_PAGE_URL = "https://www.prydwen.gg/star-rail/tier-list/";
const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "tierUpdate.json");

// Prydwen now fronts the site with a Cloudflare JS challenge, so a plain
// fetch()/curl gets a 403. A real (headless) browser passes it fine.
async function fetchRenderedHtml(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-blink-features=AutomationControlled"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 900 });

    await page.goto(url, { waitUntil: "networkidle2", timeout: 45000 });
    // Give the Cloudflare challenge / hydration a moment to settle.
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return await page.content();
  } finally {
    await browser.close();
  }
}

// The site is now built with Next.js App Router, which streams page data as
// React Server Component "flight" payloads embedded in the HTML via
// `self.__next_f.push([streamId, "<chunk>"])` calls. Concatenating every
// chunk for a given stream id reconstructs the full serialized payload,
// which contains the tier list's character/rating data as plain JSON.
function extractBracketedArray(source, startIndex) {
  const openIndex = source.indexOf("[", startIndex);
  if (openIndex === -1) return null;

  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;

  for (let i = openIndex; i < source.length; i++) {
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

    if (ch === "[") depth++;
    if (ch === "]") depth--;

    if (depth === 0) {
      return source.slice(openIndex, i + 1);
    }
  }

  return null;
}

function extractNextFlightPayload(html) {
  const callRegex = /self\.__next_f\.push\(/g;
  let match;
  let combined = "";

  while ((match = callRegex.exec(html)) !== null) {
    const callStart = match.index + match[0].length - 1; // position of the "(" arg's opening bracket search start
    const arrLiteral = extractBracketedArray(html, callStart);
    if (!arrLiteral) continue;

    let arr;
    try {
      arr = Function(`"use strict"; return (${arrLiteral});`)();
    } catch (_) {
      continue;
    }

    if (Array.isArray(arr) && typeof arr[1] === "string") {
      combined += arr[1];
    }
  }

  return combined;
}

function extractCharactersDataset(flightPayload) {
  const marker = '"characters":[';
  const idx = flightPayload.indexOf(marker);
  if (idx === -1) return null;

  const arrayLiteral = extractBracketedArray(flightPayload, idx + marker.length - 1);
  if (!arrayLiteral) return null;

  try {
    const characters = JSON.parse(arrayLiteral);
    return Array.isArray(characters) ? characters : null;
  } catch (_) {
    return null;
  }
}

function aggregateRatings(rawCharacters) {
  const characters = [];

  for (const entry of rawCharacters) {
    if (!entry || !entry.name) continue;
    if (entry.isReleased === false) continue;

    const ratings = Array.isArray(entry.tierRatings) ? entry.tierRatings : [];
    if (!ratings.length) continue;

    // Some characters have multiple role/category ratings (e.g. Sub-DPS and
    // DPS lanes) — keep their best per-mode rating, same as before.
    let moc = 0;
    let pf = 0;
    let as = 0;
    for (const rating of ratings) {
      moc = Math.max(moc, Number(rating.moc_rating || 0) - 1);
      pf = Math.max(pf, Number(rating.pure_rating || 0) - 1);
      as = Math.max(as, Number(rating.apo_rating || 0) - 1);
    }
    moc = Math.max(0, moc);
    pf = Math.max(0, pf);
    as = Math.max(0, as);

    characters.push({
      name: entry.name,
      MoC_rating: moc,
      PF_rating: pf,
      AS_rating: as,
      total_rating: moc + pf + as,
    });
  }

  characters.sort((a, b) => b.total_rating - a.total_rating || a.name.localeCompare(b.name));
  return characters;
}

async function main() {
  console.log("Scraping Prydwen Star Rail tier ratings...");

  const html = await fetchRenderedHtml(TIER_PAGE_URL);
  console.log(`Fetched rendered tier list page (${html.length} bytes).`);

  const flightPayload = extractNextFlightPayload(html);
  if (!flightPayload) {
    throw new Error("Failed to reconstruct Next.js flight payload from page");
  }

  const rawCharacters = extractCharactersDataset(flightPayload);
  if (!rawCharacters || !rawCharacters.length) {
    throw new Error("Could not locate characters dataset in flight payload");
  }
  console.log(`Found ${rawCharacters.length} characters in tier list dataset.`);

  const characters = aggregateRatings(rawCharacters);
  if (!characters.length) {
    throw new Error("No characters with tier ratings were parsed");
  }

  const payload = {
    generated_at: new Date().toISOString().slice(0, 10),
    total_characters: characters.length,
    characters,
  };

  fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Wrote ${characters.length} character ratings to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(`Scrape failed: ${err.message}`);
  process.exit(1);
});
