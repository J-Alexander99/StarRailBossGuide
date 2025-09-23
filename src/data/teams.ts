import { CHARACTERS, type Character } from './characters';

export type Team = {
  id: string;
  name?: string;
  // members are references to character ids to avoid duplication
  members: [string, string, string, string];
  notes?: string;
};

// Example teams. Keep this list extensible — add more teams below as you discover or test them.
export const TEAMS: Team[] = [
  { id: 't-1', name: 'Blazing Strike', members: ['c-1', 'c-2', 'c-3', 'c-4'], notes: 'High Fire presence — great vs Fire-weak bosses.' },
  { id: 't-2', name: 'Stormbreakers', members: ['c-5', 'c-6', 'c-7', 'c-8'], notes: 'Strong Lightning core with utility.' },
  { id: 't-3', name: 'Frost Line', members: ['c-9', 'c-10', 'c-11', 'c-12'], notes: 'Balanced frost team with sustain.' },
  { id: 't-4', name: 'Balanced Quartet', members: ['c-13', 'c-14', 'c-15', 'c-16'], notes: 'All-rounder team — has at least one of the common elements.' },
  { id: 't-5', name: 'Lightning Focus', members: ['c-17', 'c-18', 'c-19', 'c-20'], notes: 'High Lightning damage — great vs Lightning-weak targets.' }
];

export function resolveTeamMembers(team: Team) {
  return team.members.map((id) => CHARACTERS.find((c) => c.id === id)).filter(Boolean) as Character[];
}

export function teamsMatchingWeakness(weakness?: string) {
  if (!weakness) return TEAMS;
  return TEAMS.filter((team) =>
    resolveTeamMembers(team).some((m) => m.element === weakness || m.element === 'All')
  );
}
