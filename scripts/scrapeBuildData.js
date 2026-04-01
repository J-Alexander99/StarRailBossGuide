const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = path.join(__dirname, "..", "src", "data", "buildUpdate.json");
const CHARS_FILE = path.join(__dirname, "..", "src", "data", "characters.ts");
const BASE_URL = "https://www.prydwen.gg/star-rail/characters";
const DEFAULT_DELAY_MS = 900;
const JITTER_MS = 700;
const MAX_FETCH_RETRIES = 3;

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

async function fetchText(url) {
  const headers = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "accept-language": "en-US,en;q=0.9",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "cache-control": "no-cache",
    "pragma": "no-cache",
  };

  let lastError = null;
  for (let attempt = 1; attempt <= MAX_FETCH_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers, redirect: "follow" });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${url} (${res.status})`);
      }

      const text = await res.text();
      if (/attention required|checking your browser|cf-browser-verification|cloudflare/i.test(text)) {
        throw new Error(`Anti-bot challenge detected for ${url}`);
      }

      return text;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_FETCH_RETRIES) {
        const backoff = attempt * 1200 + Math.floor(Math.random() * 500);
        await sleep(backoff);
      }
    }
  }

  throw lastError || new Error(`Failed to fetch ${url}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDivBlocksByClass(html, className) {
  const blocks = [];
  const classRegex = new RegExp(`<div[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "gi");
  let classMatch;

  while ((classMatch = classRegex.exec(html)) !== null) {
    const startIndex = classMatch.index;
    const startTagEnd = classMatch.index + classMatch[0].length;

    const divTagRegex = /<\/?div\b[^>]*>/gi;
    divTagRegex.lastIndex = startTagEnd;

    let depth = 1;
    let endTagIndex = -1;
    let match;

    while ((match = divTagRegex.exec(html)) !== null) {
      if (match[0][1] === "/") {
        depth -= 1;
      } else {
        depth += 1;
      }

      if (depth === 0) {
        endTagIndex = match.index;
        break;
      }
    }

    if (endTagIndex !== -1) {
      blocks.push(html.slice(startTagEnd, endTagIndex));
      classRegex.lastIndex = endTagIndex;
    }
  }

  return blocks;
}

function normalizeItemName(name) {
  return decodeHtmlEntities(
    String(name || "")
      .trim()
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
  );
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

function isPercentage(text) {
  // Match patterns like "115.65%", "100%", etc.
  return /^\d+(?:\.\d+)?%$/.test(text.trim());
}

function isLikelyRelicSetName(text) {
  // Relic set names typically have multiple capitalized words or specific patterns
  // They contain words like: Scholar, Warrior, Messenger, Thief, Wastelander, etc.
  const relicKeywords = /scholar|warrior|messenger|thief|wastelander|hunter|champion|bandits|firmament|inert|duran|synth|spire|maid|divine|furnace|talia|penacony|rutilant|arena|lonesome|honourbound|dreamweaver|firesmith|sprightly|vonwacq|broken|keel|fleet|ageless|land of dreams|sealing|glamoth|lushaka|pan-cosmic|revelry|condemn|obsessed|obsession/i;
  const capitalizedWords = (text.match(/\b[A-Z]/g) || []).length;
  
  // If it has multiple capitalized letters and/or matches relic keywords, it's likely a relic name
  if (capitalizedWords >= 2 || relicKeywords.test(text)) {
    return true;
  }
  
  return false;
}

function isLikelyDescription(text) {
  // Descriptions are typically longer or contain specific patterns
  const descKeywords = /offers|provides|grants|allows|requires|focuses on|useful|strength|weakness|best option|alternative|note:|be summed|assumes|improves|higher|lower|combo|synerg|condition|increases?|decreases?|reduced|prevents|grants|stacked?|maintained|uptime|activation/i;
  const hasMultipleSentences = (text.match(/\./g) || []).length > 0;
  
  // If text is very long (>100 chars), it's definitely a description
  if (text.length > 100) return true;
  
  // If it's moderately long (40+) and has keywords or multiple sentences, it's a description
  if (text.length >= 40 && (descKeywords.test(text) || hasMultipleSentences)) {
    return true;
  }
  
  return false;
}

function isDefinitelyNotASet(text) {
  // Patterns that indicate this is explanatory text, not a set name
  const descriptions = /^(The |A |Max |Only |Flex|For |Mix |Assumes|If |This |Good|Strong|When |Best|Another|Use |Useful|Note:|Gives |Grants |Provides )/i;
  const explanatoryContent = /good|option|best|only|useful|perform|make|cost|provide|give|grant/i;
  const longWithPeriods = text.length > 75 && text.includes('.');
  const veryLong = text.length > 110;
  const hasMultipleWords = (text.match(/\s/g) || []).length >= 5; // 6+ words
  
  return descriptions.test(text) || longWithPeriods || veryLong || (hasMultipleWords && explanatoryContent.test(text));
}

function extractItemsFromDiv(html, divClass, isLightCones = false) {
  const blocks = getDivBlocksByClass(html, divClass);
  if (!blocks.length) {
    return [];
  }
  const items = [];

  for (const divContent of blocks) {
    const itemPattern = /<(?:a|div|span|p|li)[^>]*>([^<]+)<\/(?:a|div|span|p|li)>/gi;
    let match;

    while ((match = itemPattern.exec(divContent)) !== null) {
      const item = normalizeItemName(match[1]);
      
      // Skip empty or too-short items
      if (!item || item.length <= 2) continue;
      
      // Skip if already in list
      if (items.includes(item)) continue;
      
      // For light cones, apply stricter filtering
      if (isLightCones) {
        // Skip percentages
        if (isPercentage(item)) continue;
        
        // Skip descriptions (long text with description keywords)
        if (isLikelyDescription(item)) continue;
        
        // Skip labels like "Substats:", "Skills priority:", etc.
        if (/^(body|feet|sphere|rope|sub\s*stats?|skills priority|major traces|crit rate|atk|spd|breakpoint|speed)$/i.test(item)) continue;
      }
      
      items.push(item);
    }
  }

  return items;
}

function extractDivInnerByOpenTag(html, openTagIndex, openTagText) {
  if (openTagIndex < 0 || !openTagText) {
    return "";
  }

  const startTagEnd = openTagIndex + openTagText.length;
  const divTagRegex = /<\/?div\b[^>]*>/gi;
  divTagRegex.lastIndex = startTagEnd;

  let depth = 1;
  let endTagIndex = -1;
  let match;

  while ((match = divTagRegex.exec(html)) !== null) {
    if (match[0][1] === "/") {
      depth -= 1;
    } else {
      depth += 1;
    }

    if (depth === 0) {
      endTagIndex = match.index;
      break;
    }
  }

  if (endTagIndex === -1) {
    return "";
  }

  return html.slice(startTagEnd, endTagIndex);
}

function getDetailedConesSectionByTitle(html, titlePattern) {
  const headingRegex = /<h6[^>]*>([\s\S]*?)<\/h6>/gi;
  let headingMatch;

  while ((headingMatch = headingRegex.exec(html)) !== null) {
    const headingText = normalizeItemName(headingMatch[1]);
    if (!titlePattern.test(headingText)) {
      continue;
    }

    const sectionRegex = /<div[^>]*class=["'][^"']*\bdetailed-cones\b[^"']*["'][^>]*>/gi;
    sectionRegex.lastIndex = headingMatch.index + headingMatch[0].length;
    const sectionMatch = sectionRegex.exec(html);

    if (!sectionMatch) {
      return "";
    }

    return extractDivInnerByOpenTag(html, sectionMatch.index, sectionMatch[0]);
  }

  return "";
}

function extractSetNamesFromDetailedConesSection(sectionHtml) {
  if (!sectionHtml) {
    return [];
  }

  const names = [];
  const singleConeBlocks = getDivBlocksByClass(sectionHtml, "single-cone");
  const blocksToScan = singleConeBlocks.length ? singleConeBlocks : [sectionHtml];

  for (const block of blocksToScan) {
    // Preferred source: set image alt text usually holds exact set names.
    const imageAltPattern = /<img[^>]*\balt=["']([^"']+)["'][^>]*>/gi;
    let imageMatch;
    while ((imageMatch = imageAltPattern.exec(block)) !== null) {
      const altName = normalizeItemName(imageMatch[1]);
      if (!altName) continue;
      if (isDefinitelyNotASet(altName)) continue;
      if (!isLikelyRelicSetName(altName)) continue;
      if (!names.includes(altName)) {
        names.push(altName);
      }
    }

    const itemPattern = /<(?:a|div|span|p|li)[^>]*>([^<]+)<\/(?:a|div|span|p|li)>/gi;
    let match;

    while ((match = itemPattern.exec(block)) !== null) {
      const token = normalizeItemName(match[1]);
      if (!token || token.length <= 2) continue;
      if (isPercentage(token)) continue;
      if (isDefinitelyNotASet(token)) continue;
      if (!isLikelyRelicSetName(token)) continue;
      if (!names.includes(token)) {
        names.push(token);
      }
    }
  }

  return names;
}

function isStatSectionHeader(token) {
  return /^(body|feet|planar sphere|sphere|link rope|rope|sub\s*stats?:?)$/i.test(token.trim());
}

function isStatNoise(token) {
  const t = token.trim();
  return (
    !t ||
    /^>=?$/.test(t) ||
    /^(skills priority:|major traces priority:|if you want to learn more)/i.test(t)
  );
}

function isLikelyMainStatValue(token) {
  const t = String(token || "").trim();
  if (!t) return false;
  if (/^[=/><|]+$/.test(t)) return false;
  if (t.length > 40) return false;
  if (/[.:]/.test(t)) return false;
  if (/\b(signature|uses|while|option|recommended|substats?)\b/i.test(t)) return false;
  if (/^(planar sphere|link rope|sub\s*stats?:?)$/i.test(t)) return false;

  return /^(CRIT Rate|CRIT DMG|ATK%|ATK|HP%|HP|DEF%|DEF|Speed|Outgoing Healing|Effect HIT Rate|Break Effect|Energy Regen Rate|[A-Za-z]+ DMG|Anything)$/i.test(t);
}

function pushUniqueCaseInsensitive(list, value) {
  const key = String(value || "").toLowerCase();
  if (!key) return;
  if (!list.some((item) => String(item).toLowerCase() === key)) {
    list.push(value);
  }
}

function parseStatsFromTokens(tokens) {
  const parsed = {
    body: [],
    feet: [],
    sphere: [],
    rope: [],
    subStats: [],
  };

  let section = "";
  let capturedSubStatsLine = false;

  for (const raw of tokens) {
    const token = decodeHtmlEntities(raw).trim();
    if (!token) continue;

    if (/^body$/i.test(token)) {
      section = "body";
      continue;
    }
    if (/^feet$/i.test(token)) {
      section = "feet";
      continue;
    }
    if (/^(planar sphere|sphere)$/i.test(token)) {
      section = "sphere";
      continue;
    }
    if (/^(link rope|rope)$/i.test(token)) {
      section = "rope";
      continue;
    }
    if (/^sub\s*stats?:?$/i.test(token)) {
      section = "subStats";
      continue;
    }

    if (isStatNoise(token)) {
      continue;
    }

    if (section === "subStats") {
      if (/^(skills priority:|major traces priority:)/i.test(token)) {
        break;
      }

      // Keep only the text from the Substats box, not the full priority/traces list.
      if (!capturedSubStatsLine) {
        parsed.subStats.push(token);
        capturedSubStatsLine = true;
      }
      continue;
    }

    if (!section) {
      continue;
    }

    if (/^(planar sphere|link rope|sub\s*stats?:?)$/i.test(token)) {
      continue;
    }

    if (!isLikelyMainStatValue(token)) {
      continue;
    }

    pushUniqueCaseInsensitive(parsed[section], token);
  }

  // Fallback for pages where headers are missing from extracted tokens.
  if (!parsed.body.length && !parsed.feet.length && !parsed.sphere.length && !parsed.rope.length) {
    const cleaned = tokens
      .map((t) => decodeHtmlEntities(t))
      .map((t) => t.trim())
      .filter((t) => t && !isStatNoise(t) && !isStatSectionHeader(t) && !/^(planar sphere|link rope)$/i.test(t))
      .filter((t) => isLikelyMainStatValue(t));

    for (const value of cleaned.slice(0, 2)) pushUniqueCaseInsensitive(parsed.body, value);
    for (const value of cleaned.slice(2, 4)) pushUniqueCaseInsensitive(parsed.feet, value);
    if (cleaned.length > 4) pushUniqueCaseInsensitive(parsed.sphere, cleaned[4]);
    if (cleaned.length > 5) pushUniqueCaseInsensitive(parsed.rope, cleaned[5]);
  }

  parsed.body = parsed.body.slice(0, 2);
  parsed.feet = parsed.feet.slice(0, 2);
  parsed.sphere = parsed.sphere.slice(0, 2);
  parsed.rope = parsed.rope.slice(0, 2);

  return parsed;
}

function extractBuildData(html) {
  const buildData = {
    lightCones: [],
    relicSets: [],
    planarOrnaments: [],
    stats: {
      body: [],
      feet: [],
      sphere: [],
      rope: [],
      subStats: [],
    },
  };

  try {
    // Extract light cones from build-cones div with stricter filtering
    buildData.lightCones = extractItemsFromDiv(html, "build-cones", true).slice(0, 11);

    // Prefer heading-aware extraction because relic and planar can share the same class names.
    const relicSection = getDetailedConesSectionByTitle(html, /best\s+relic\s+sets/i);
    const planarSection = getDetailedConesSectionByTitle(html, /best\s+plan(?:etary|ar)\s+sets/i);

    if (relicSection) {
      buildData.relicSets = extractSetNamesFromDetailedConesSection(relicSection).slice(0, 6);
    }

    if (planarSection) {
      buildData.planarOrnaments = extractSetNamesFromDetailedConesSection(planarSection).slice(0, 6);
    }

    // Fallback for legacy pages.
    if (!buildData.relicSets.length) {
      const relicItems = extractItemsFromDiv(html, "build-relics", false);
      buildData.relicSets = relicItems
        .filter(item => {
          if (isDefinitelyNotASet(item)) return false;
          if (isLikelyRelicSetName(item)) return true;
          if (/^\(\d\)$/.test(item.trim())) return false;
          return item.length < 120 && !item.includes('.');
        })
        .slice(0, 6);
    }

    if (!buildData.planarOrnaments.length) {
      const planarBlocks = getDivBlocksByClass(html, "build-planar");
      for (const content of planarBlocks) {
        const itemPattern = /<(?:div|span|p|li)[^>]*>([^<]+)<\/(?:div|span|p|li)>/gi;
        let m;
        while ((m = itemPattern.exec(content)) !== null) {
          const item = normalizeItemName(m[1]);
          if (item && item.length > 2 && !buildData.planarOrnaments.includes(item)) {
            if (isDefinitelyNotASet(item)) continue;
            if (isLikelyRelicSetName(item)) {
              buildData.planarOrnaments.push(item);
            }
          }
        }
      }
      buildData.planarOrnaments = buildData.planarOrnaments.slice(0, 6);
    }

    // Prevent planar names from polluting relic set recommendations.
    const planarNameSet = new Set(buildData.planarOrnaments.map((name) => name.toLowerCase()));
    buildData.relicSets = buildData.relicSets.filter((name) => !planarNameSet.has(String(name).toLowerCase()));

    // Extract stats from build-stats sections and map by slot headers.
    const statTokens = [];

    for (const content of getDivBlocksByClass(html, "build-stats")) {
      const itemPattern = /<(?:div|span|p|li)[^>]*>([^<]+)<\/(?:div|span|p|li)>/gi;
      let m;
      while ((m = itemPattern.exec(content)) !== null) {
        const stat = normalizeItemName(m[1]);
        if (stat && stat.length > 0) {
          statTokens.push(stat);
        }
      }
    }
    buildData.stats = parseStatsFromTokens(statTokens);
  } catch (error) {
    console.error(`Error parsing build data: ${error.message}`);
  }

  return buildData;
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

  return {
    characterId: characterId,
    lightCones: (buildData.lightCones || []).map(name => ({ name, notes: "" })),
    relics: {
      sets: (buildData.relicSets || []).map(name => ({ name, pieces: "4pc", notes: "" })),
      planar: (buildData.planarOrnaments || []).map(name => ({ name, notes: "" })),
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

  console.log("Fetching character pages from Prydwen...");

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
      const html = await fetchText(url);
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
