const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const teamsFile = path.join(repoRoot, 'teamslist.txt');
const charsFile = path.join(repoRoot, 'src', 'data', 'characters.ts');
const outTeamsFile = path.join(repoRoot, 'src', 'data', 'teams.ts');

const text = fs.readFileSync(teamsFile, 'utf8');
const charsText = fs.readFileSync(charsFile, 'utf8');
const currentTeamsTs = fs.readFileSync(outTeamsFile, 'utf8');

// Build character id -> name map and lowercase name map for fuzzy matching.
// characters.ts uses double-quoted keys; accept either quote style.
const idRe = /\{\s*id:\s*["']([^"']+)["']\s*,\s*name:\s*["']([^"']+)["']/g;
const chars = [];
let m;
while ((m = idRe.exec(charsText)) !== null) {
  chars.push({ id: m[1], name: m[2], nameLower: m[2].toLowerCase() });
}
if (chars.length === 0) {
  throw new Error('Failed to parse any characters from characters.ts - check idRe against the file format.');
}

function findIdForName(raw) {
  if (!raw) return '';
  let name = raw.trim().toLowerCase();

  // common alias map (extend as needed)
  const aliases = {
    'fu xuan': 'fuxuan',
    'fu_xuan': 'fuxuan',
    'fu-xuan': 'fuxuan',
    'black swan': 'blackswan',
    'black_swan': 'blackswan',
    'march 7th imaginary': 'march7_imag',
    'march 7th': 'march7th',
    'topaz': 'topaz_numby',
    'topaz & numby': 'topaz_numby',
    'trailblazer imaginary': 'trail_imag',
    'trailblazer ice': 'trail_ice',
    'trailblazer-fire': 'trail_fire',
    'trailblazer fire': 'trail_fire',
    'trailblazer physical': 'trail_physical',
    'trailblazer lightning': 'trail_elation',
    // "Trailblazer Harmony" isn't a real element - every other occurrence of
    // this exact team pattern (Firefly/Rappa/Fugue + Ruan Mei) uses the
    // Imaginary trailblazer, whose kit path happens to be Harmony, so treat
    // the two as the same unit rather than dropping these teams.
    'trailblazer harmony': 'trail_imag',
    'trailblazer': 'trail_physical',
    'the herta': 'the_herta',
    'herta': 'herta',
    'dr ratio': 'dr_ratio',
    'silver wolf': 'silverwolf',
    'silver wolf 999': 'silverwolf999',
    'jiaoqui': 'jiaoqiu',
    'advneturine': 'aventurine',
    'march 7th imag': 'march7_imag',
    'sampo': 'sampo',
    // characters.ts spells these with a "•" separator; teamslist.txt uses "-"
    'dan heng - permansor terrae': 'danheng_terrae',
    'permansor terrae': 'danheng_terrae',
    'dan heng - imbibitor lunae': 'danheng_imaginary',
  };

  if (aliases[name]) return aliases[name];

  // normalize to id-like
  const simple = name.replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, '_');
  if (chars.find(c => c.id === simple)) return simple;

  // try exact name match
  const exact = chars.find(c => c.nameLower === name);
  if (exact) return exact.id;

  // try contains
  const contains = chars.find(c => c.nameLower.includes(name) || name.includes(c.nameLower));
  if (contains) return contains.id;

  return '';
}

// parse teamslist: find lines with ["...", "...", "...", "..."]
const teamRe = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g;
let teams = [];
while ((m = teamRe.exec(text)) !== null) {
  const raw = [m[1], m[2], m[3], m[4]];
  const ids = raw.map(r => findIdForName(r));
  teams.push({ raw, ids });
}

// deduplicate (ignoring member order - same 4 characters = same team) and
// drop any teams where a name failed to resolve
const good = [];
const bad = [];
const seen = new Set();
for (const t of teams) {
  const missing = t.ids.filter(i => !i);
  if (missing.length > 0) {
    bad.push({ raw: t.raw, missing });
    continue;
  }
  const key = [...t.ids].sort().join('|');
  if (seen.has(key)) continue;
  seen.add(key);
  good.push(t.ids);
}

// Splice the regenerated TEAMS array into the existing teams.ts, leaving the
// surrounding types, calculateTeamRating helper, and every scoring/lookup
// function below the array untouched.
const arrayStart = currentTeamsTs.indexOf('export const TEAMS: Team[] = [');
const arrayEndMarker = '\n];';
const arrayEnd = currentTeamsTs.indexOf(arrayEndMarker, arrayStart);
if (arrayStart === -1 || arrayEnd === -1) {
  throw new Error('Could not locate the TEAMS array bounds in teams.ts - aborting to avoid clobbering the file.');
}
const header = currentTeamsTs.slice(0, arrayStart);
const footer = currentTeamsTs.slice(arrayEnd + arrayEndMarker.length);

const lines = [];
lines.push('export const TEAMS: Team[] = [');

let idCounter = 101;
for (const ids of good) {
  const tid = `t-${idCounter}`;
  const name = `${ids[0]} team ${idCounter - 100}`;
  const membersLiteral = `[${ids.map(id => `"${id}"`).join(', ')}]`;
  lines.push(`  {`);
  lines.push(`    id: "${tid}",`);
  lines.push(`    name: "${name}",`);
  lines.push(`    members: ${membersLiteral},`);
  lines.push(`    notes: "Imported from teamslist.txt",`);
  lines.push(`    teamRating: calculateTeamRating(${membersLiteral}),`);
  lines.push(`  },`);
  idCounter++;
}

lines.push('];');

const out = header + lines.join('\n') + footer;

fs.writeFileSync(outTeamsFile, out, 'utf8');

console.log(`Wrote ${good.length} teams to ${outTeamsFile}`);
if (bad.length > 0) {
  console.log(`Skipped ${bad.length} teams due to unresolved names:`);
  const uniqueBad = [];
  const seenBad = new Set();
  for (const b of bad) {
    const key = b.raw.join(', ') + ' -> ' + b.missing.join(', ');
    if (seenBad.has(key)) continue;
    seenBad.add(key);
    uniqueBad.push(b);
  }
  uniqueBad.forEach(b => console.log(' -', b.raw.join(', '), 'missing ->', b.missing.join(', ')));
}
