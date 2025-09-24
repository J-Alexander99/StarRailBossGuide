const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const charFile = path.join(repoRoot, 'src', 'data', 'characters.ts');
const teamsFile = path.join(repoRoot, 'src', 'data', 'teams.ts');

const charText = fs.readFileSync(charFile, 'utf8');
const teamsText = fs.readFileSync(teamsFile, 'utf8');

// extract character ids from characters.ts
const charIdRe = /\{\s*id:\s*'([^']+)'/g;
const charIds = new Set();
let m;
while ((m = charIdRe.exec(charText)) !== null) {
  charIds.add(m[1]);
}

// extract all quoted tokens from teams.ts
const quotedRe = /['"]([a-z0-9_]+)['"]/gi;
const teamIds = new Set();
while ((m = quotedRe.exec(teamsText)) !== null) {
  const tok = m[1];
  // heuristic: skip plain words that are likely not ids like 'From' in notes
  // but our ids are lowercase with underscores and digits
  if (/^[a-z0-9_]+$/.test(tok)) {
    teamIds.add(tok);
  }
}

// remove some known non-id words that may appear (like 't-101' etc). We'll focus on team member ids which are in charIds
const teamMemberIds = Array.from(teamIds).filter(id => charIds.has(id) || id.startsWith('t-') === false);

// Now check which team ids are missing from characters
const missing = [];
teamIds.forEach(id => {
  if (!charIds.has(id)) missing.push(id);
});

console.log('characters count:', charIds.size);
console.log('team quoted tokens count:', teamIds.size);
if (missing.length === 0) {
  console.log('All team ids found in CHARACTERS ✅');
} else {
  console.log('Missing ids in CHARACTERS (found in TEAMS but not in CHARACTERS):');
  missing.forEach(id => console.log(' -', id));
}
