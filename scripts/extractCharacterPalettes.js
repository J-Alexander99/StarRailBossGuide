// Utility: generate per-character accent palettes from character art
// Output: src/constants/characterPalettes.generated.json
// Usage: npm run palette:characters

/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const charactersDir = path.resolve(__dirname, "..", "images", "characters");
const outputPath = path.resolve(
  __dirname,
  "..",
  "src",
  "constants",
  "characterPalettes.generated.json",
);

const BUCKET_SIZE = 24; // larger bucket smooths noise; adjust for more/less variance
const MIN_BRIGHTNESS = 0.15; // ignore near-black buckets
const MAX_BRIGHTNESS = 0.9; // ignore near-white buckets
const MIN_SATURATION = 0.1; // ignore near-gray buckets

const bucketKey = (r, g, b) =>
  `${Math.floor(r / BUCKET_SIZE)}-${Math.floor(g / BUCKET_SIZE)}-${Math.floor(
    b / BUCKET_SIZE,
  )}`;

const toHex = ([r, g, b]) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const toRgba = ([r, g, b], alpha) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const toStats = (rgb, count) => {
  const [r, g, b] = rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const saturation = max === 0 ? 0 : (max - min) / max;
  return { rgb, count, brightness, saturation };
};

async function extractTopColors(filePath) {
  const { data, info } = await sharp(filePath)
    .resize({ width: 200, height: 200, fit: "inside" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const buckets = new Map();

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const key = bucketKey(r, g, b);
    const entry = buckets.get(key) || { count: 0, sum: [0, 0, 0] };
    entry.count += 1;
    entry.sum[0] += r;
    entry.sum[1] += g;
    entry.sum[2] += b;
    buckets.set(key, entry);
  }

  const ranked = [...buckets.entries()].map(([, entry]) => {
    const avg = entry.sum.map((sum) => Math.round(sum / entry.count));
    return toStats(avg, entry.count);
  });

  const filtered = ranked.filter(
    ({ brightness, saturation }) =>
      brightness >= MIN_BRIGHTNESS &&
      brightness <= MAX_BRIGHTNESS &&
      saturation >= MIN_SATURATION,
  );

  const source = (filtered.length > 0 ? filtered : ranked).sort(
    (a, b) => b.count - a.count,
  );

  return source.slice(0, 3).map((entry) => entry.rgb);
}

async function main() {
  if (!fs.existsSync(charactersDir)) {
    console.error("Character images directory not found", charactersDir);
    process.exit(1);
  }

  const files = fs
    .readdirSync(charactersDir)
    .filter((file) => file.toLowerCase().endsWith(".webp"));

  const palettes = {};

  for (const file of files) {
    const id = path.basename(file, path.extname(file));
    const fullPath = path.join(charactersDir, file);

    try {
      const [primary, secondary, tertiary] = await extractTopColors(fullPath);
      if (!primary) continue;

      palettes[id] = {
        accent: toHex(primary),
        accentSoft: toRgba(primary, 0.18),
        accentBorder: toRgba(primary, 0.35),
        secondary: secondary ? toHex(secondary) : undefined,
        tertiary: tertiary ? toHex(tertiary) : undefined,
      };

      console.log(`Palette extracted for ${id}`);
    } catch (error) {
      console.warn(`Failed to extract for ${id}:`, error.message);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(palettes, null, 2));
  console.log(
    `Wrote palettes for ${Object.keys(palettes).length} characters -> ${path.relative(
      process.cwd(),
      outputPath,
    )}`,
  );
}

main();
