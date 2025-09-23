import { TEAMS } from '../src/data/teams';
import { CHARACTERS } from '../src/data/characters';

function validate() {
  const charIds = new Set(CHARACTERS.map((c) => c.id));
  let ok = true;
  for (const team of TEAMS) {
    for (const id of team.members) {
      if (!charIds.has(id)) {
        console.error(`Team ${team.id} references unknown character id: ${id}`);
        ok = false;
      }
    }
  }
  if (ok) {
    console.log('All team member ids resolved.');
    process.exit(0);
  } else {
    process.exit(2);
  }
}

validate();
