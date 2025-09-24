const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const teamsFile = path.join(repoRoot, 'teamslist.txt');
const charsFile = path.join(repoRoot, 'src', 'data', 'characters.ts');
const outTeamsFile = path.join(repoRoot, 'src', 'data', 'teams.ts');

const text = fs.readFileSync(teamsFile, 'utf8');
const charsText = fs.readFileSync(charsFile, 'utf8');

// Build character id -> name map and lowercase name map for fuzzy matching
const idRe = /\{\s*id:\s*'([^']+)'\s*,\s*name:\s*'([^']+)'/g;
const chars = [];
let m;
while ((m = idRe.exec(charsText)) !== null) {
  chars.push({ id: m[1], name: m[2], nameLower: m[2].toLowerCase() });
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
    'trailblazer physical': 'trail_physical',
    'trailblazer': 'trail_physical',
    'the herta': 'the_herta',
    'herta': 'herta',
    'dr ratio': 'dr_ratio',
    'silver wolf': 'silverwolf',
    'jiaoqui': 'jiaoqiu',
    'advneturine': 'aventurine',
    'march 7th imag': 'march7_imag',
    'sampo': 'sampo'
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

// parse teamslist: find lines with ["...", "...", ...]
const teamRe = /\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\]/g;
let teams = [];
while ((m = teamRe.exec(text)) !== null) {
  const raw = [m[1], m[2], m[3], m[4]];
  const ids = raw.map(r => findIdForName(r));
  teams.push({ raw, ids });
}

// deduplicate and drop any teams where mapping failed
const good = [];
const bad = [];
const seen = new Set();
for (const t of teams) {
  const missing = t.ids.filter(i => !i);
  if (missing.length > 0) {
    bad.push({ raw: t.raw, missing });
    continue;
  }
  const key = t.ids.join('|');
  if (seen.has(key)) continue;
  seen.add(key);
  good.push(t.ids);
}

// generate TypeScript file content
const header = `import { CHARACTERS, type Character } from './characters';\n\nexport type Team = {\n  id: string;\n  name?: string;\n  members: [string, string, string, string];\n  notes?: string;\n};\n\n`;

const teamsTsParts = [];
teamsTsParts.push(header);
teamsTsParts.push('export const TEAMS: Team[] = [');

let idCounter = 101;
for (const ids of good) {
  const tid = `t-${idCounter}`;
  const name = `${ids[0]} team ${idCounter - 100}`;
  teamsTsParts.push(`  { id: '${tid}', name: '${name}', members: ['${ids[0]}', '${ids[1]}', '${ids[2]}', '${ids[3]}'], notes: 'Imported from teamslist.txt' },`);
  idCounter++;
}

teamsTsParts.push('];\n\n');

// add helper functions
teamsTsParts.push("export function resolveTeamMembers(team: Team) {\n  return team.members.map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean) as Character[];\n}\n\n");
teamsTsParts.push("export function teamsMatchingWeakness(weakness?: string) {\n  if (!weakness) return TEAMS;\n  return TEAMS.filter((team) =>\n    resolveTeamMembers(team).some((m) => m.element === weakness || m.element === 'All')\n  );\n}\n");

const out = teamsTsParts.join('\n');

fs.writeFileSync(outTeamsFile, out, 'utf8');

console.log(`Wrote ${good.length} teams to ${outTeamsFile}`);
if (bad.length > 0) {
  console.log(`Skipped ${bad.length} teams due to unresolved names:`);
  bad.slice(0, 10).forEach(b => console.log(' -', b.raw.join(', '), 'missing ->', b.missing.join(', ')));
}
