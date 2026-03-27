const fs = require("fs");
const path = require("path");

const TIER_PAGE_URL = "https://www.prydwen.gg/star-rail/tier-list/";
const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "tierUpdate.json");

function unique(arr) {
  return Array.from(new Set(arr));
}

function normalizeName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[•]/g, "")
    .replace(/[()]/g, " ")
    .replace(/[\-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  return res.text();
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  return res.json();
}

function parseScriptUrls(html) {
  const matches = Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/g));
  const urls = matches
    .map((m) => m[1])
    .filter((u) => u.includes("prydwen.gg") || u.startsWith("/"));

  return unique(
    urls.map((u) => {
      if (u.startsWith("http")) return u;
      return `https://www.prydwen.gg${u.startsWith("/") ? "" : "/"}${u}`;
    })
  );
}

function findTierListManifestSource(sources) {
  return sources.find((s) => s.includes('component---src-pages-star-rail-tier-list-tsx":function(){return Promise.all(['));
}

function parseTierDependencyIds(manifestSource) {
  const routeMatch = manifestSource.match(
    /"component---src-pages-star-rail-tier-list-tsx":function\(\)\{return Promise\.all\(\[(.*?)\]\)\.then\(t\.bind\(t,(\d+)\)\)\}/s
  );
  if (!routeMatch) {
    throw new Error("Unable to locate tier-list route dependency block in manifest");
  }

  const depsRaw = routeMatch[1];
  const ids = unique(Array.from(depsRaw.matchAll(/t\.e\((\d+)\)/g)).map((m) => Number(m[1])));
  return {
    dependencyIds: ids,
    routeModuleId: Number(routeMatch[2]),
  };
}

function getRuntimeValuesById(runtimeSource, id) {
  const re = new RegExp(`${id}:\"([^\"]+)\"`, "g");
  return unique(Array.from(runtimeSource.matchAll(re)).map((m) => m[1]));
}

async function resolveChunkUrls(runtimeSource, chunkId) {
  const values = getRuntimeValuesById(runtimeSource, chunkId);
  const candidates = [];

  for (const v of values) {
    candidates.push(`https://www.prydwen.gg/${v}.js`);
    candidates.push(`https://www.prydwen.gg/${chunkId}-${v}.js`);
  }
  for (const a of values) {
    for (const b of values) {
      if (a === b) continue;
      candidates.push(`https://www.prydwen.gg/${a}-${b}.js`);
    }
  }

  const deduped = unique(candidates);
  const found = [];

  for (const url of deduped) {
    try {
      const text = await fetchText(url);
      if (text.includes(":function(")) {
        found.push({ url, text });
      }
    } catch (_) {
      // Ignore non-existing candidate URLs.
    }
  }

  return found;
}

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

function extractRatingsDataset(chunkText) {
  if (!chunkText.includes("moc_rating") || !chunkText.includes("pure_rating") || !chunkText.includes("apo_rating")) {
    return null;
  }

  const start = chunkText.indexOf("var r=[");
  if (start === -1) return null;

  const arrayLiteral = extractBracketedArray(chunkText, start);
  if (!arrayLiteral) return null;

  try {
    const rows = Function(`"use strict"; return (${arrayLiteral});`)();
    if (!Array.isArray(rows)) return null;
    return rows;
  } catch (_) {
    return null;
  }
}

function aggregateRatings(rows) {
  const byName = new Map();

  const normalizeScore = (value) => Math.max(0, Number(value || 0) - 1);

  for (const row of rows) {
    if (!row || typeof row !== "object" || !row.name) continue;

    const key = normalizeName(row.name);
    const moc = normalizeScore(row.moc_rating);
    const pf = normalizeScore(row.pure_rating);
    const as = normalizeScore(row.apo_rating);

    if (!byName.has(key)) {
      byName.set(key, {
        name: row.name,
        MoC_rating: moc,
        PF_rating: pf,
        AS_rating: as,
      });
      continue;
    }

    // Some characters appear in multiple role lanes. Keep their best per-mode rating.
    const current = byName.get(key);
    current.MoC_rating = Math.max(current.MoC_rating, moc);
    current.PF_rating = Math.max(current.PF_rating, pf);
    current.AS_rating = Math.max(current.AS_rating, as);
  }

  const characters = Array.from(byName.values())
    .map((entry) => ({
      ...entry,
      total_rating: entry.MoC_rating + entry.PF_rating + entry.AS_rating,
    }))
    .sort((a, b) => b.total_rating - a.total_rating || a.name.localeCompare(b.name));

  return characters;
}

async function main() {
  console.log("Scraping Prydwen Star Rail tier ratings...");

  const html = await fetchText(TIER_PAGE_URL);
  const scriptUrls = parseScriptUrls(html);

  if (!scriptUrls.length) {
    throw new Error("No script URLs discovered from tier list page");
  }

  const scriptSources = [];
  for (const url of scriptUrls) {
    try {
      scriptSources.push({ url, text: await fetchText(url) });
    } catch (_) {
      // Ignore blocked third-party scripts.
    }
  }

  const manifest = findTierListManifestSource(scriptSources.map((s) => s.text));
  if (!manifest) {
    throw new Error("Failed to find manifest source containing tier-list route mapping");
  }

  const runtimeEntry = scriptSources.find((s) => s.url.includes("webpack-runtime"));
  if (!runtimeEntry) {
    throw new Error("Failed to find webpack runtime script");
  }

  const { dependencyIds, routeModuleId } = parseTierDependencyIds(manifest);
  console.log(`Found route module ${routeModuleId} with ${dependencyIds.length} dependency chunks.`);

  let ratingsRows = null;
  for (const depId of dependencyIds) {
    const candidates = await resolveChunkUrls(runtimeEntry.text, depId);
    for (const candidate of candidates) {
      const extracted = extractRatingsDataset(candidate.text);
      if (extracted && extracted.length) {
        ratingsRows = extracted;
        console.log(`Resolved ratings dataset from chunk ${depId}: ${candidate.url}`);
        break;
      }
    }
    if (ratingsRows) break;
  }

  if (!ratingsRows || !ratingsRows.length) {
    throw new Error("Could not locate ratings dataset in route dependency chunks");
  }

  const characters = aggregateRatings(ratingsRows);

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
