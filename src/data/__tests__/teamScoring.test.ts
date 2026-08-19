import type { Character } from "../characters";
import type { Team } from "../teams";
import {
  calculateTeamRecommendationScore,
  getRecommendedTeamsSorted,
} from "../teams";

// Minimal fixtures for the pure scoring math. calculateTeamRecommendationScore
// only touches the global CHARACTERS list to find the current max character
// rating (for the power-contribution cap), so synthetic members here don't
// need to exist in the real roster.
function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: "test-char",
    name: "Test Character",
    element: "Fire",
    path: "Destruction",
    role: "DPS",
    rating: 20,
    ...overrides,
  } as Character;
}

function makeTeam(members: [string, string, string, string]): Team {
  return { id: "test-team", members };
}

describe("calculateTeamRecommendationScore", () => {
  it("penalizes a team with an unresolved/missing member", () => {
    const dps = makeCharacter({ id: "dps", role: "DPS" });
    const support = makeCharacter({ id: "support", role: "Support" });
    const sustain = makeCharacter({ id: "sustain", role: "Sustain" });
    const subDps = makeCharacter({ id: "sub-dps", role: "Sub-DPS" });

    const team = makeTeam(["dps", "support", "sustain", "sub-dps"]);

    const full = calculateTeamRecommendationScore(team, {}, [
      dps,
      support,
      sustain,
      subDps,
    ]);
    // Simulate one id failing to resolve (e.g. a data typo) by only handing
    // back 3 of the 4 members team.members declares.
    const missingOne = calculateTeamRecommendationScore(team, {}, [
      dps,
      support,
      sustain,
    ]);

    expect(missingOne.breakdown.missingPenalty).toBe(-40);
    // `-0 * 40` is `-0` in JS, so compare numerically rather than with
    // strict `toBe` identity.
    expect(full.breakdown.missingPenalty).toBeCloseTo(0);
    expect(missingOne.score).toBeLessThan(full.score);
  });

  it("returns a zero score for a team with no resolvable members", () => {
    const team = makeTeam(["a", "b", "c", "d"]);
    const result = calculateTeamRecommendationScore(team, {}, []);
    expect(result.score).toBe(0);
    expect(result.breakdown.total).toBe(0);
  });

  it("scores a DPS exploiting the boss's elemental weakness higher than one hitting a resistance", () => {
    const fireDps = makeCharacter({ id: "dps", element: "Fire", role: "DPS" });
    const others = [
      makeCharacter({ id: "a", role: "Support" }),
      makeCharacter({ id: "b", role: "Sustain" }),
      makeCharacter({ id: "c", role: "Sub-DPS" }),
    ];
    const team = makeTeam(["dps", "a", "b", "c"]);

    const vsWeakness = calculateTeamRecommendationScore(
      team,
      { elements: { Fire: 2 } },
      [fireDps, ...others],
    );
    const vsResistance = calculateTeamRecommendationScore(
      team,
      { elements: { Fire: -2 } },
      [fireDps, ...others],
    );

    expect(vsWeakness.breakdown.element).toBeGreaterThan(
      vsResistance.breakdown.element,
    );
    expect(vsWeakness.score).toBeGreaterThan(vsResistance.score);
  });

  it("awards the DPS+Sustain composition bonus", () => {
    const withSustain = [
      makeCharacter({ id: "a", role: "DPS" }),
      makeCharacter({ id: "b", role: "Sustain" }),
      makeCharacter({ id: "c", element: "Ice" }),
      makeCharacter({ id: "d", element: "Ice" }),
    ];
    const withoutSustain = [
      makeCharacter({ id: "a", role: "DPS" }),
      makeCharacter({ id: "b", role: "DPS" }),
      makeCharacter({ id: "c", element: "Ice" }),
      makeCharacter({ id: "d", element: "Ice" }),
    ];
    const team = makeTeam(["a", "b", "c", "d"]);

    const withSustainResult = calculateTeamRecommendationScore(
      team,
      {},
      withSustain,
    );
    const withoutSustainResult = calculateTeamRecommendationScore(
      team,
      {},
      withoutSustain,
    );

    expect(withSustainResult.breakdown.composition).toBe(10);
    expect(withoutSustainResult.breakdown.composition).toBe(0);
  });
});

describe("getRecommendedTeamsSorted", () => {
  it("sorts results by score descending, then by team power descending", () => {
    const results = getRecommendedTeamsSorted({}, false);
    expect(results.length).toBeGreaterThan(0);

    for (let i = 1; i < results.length; i++) {
      const prev = results[i - 1];
      const curr = results[i];
      const scoreOk = prev.score > curr.score;
      const tiedScoreOk =
        prev.score === curr.score && prev.teamPower >= curr.teamPower;
      expect(scoreOk || tiedScoreOk).toBe(true);
    }
  });

  it("excludes every team when no characters are owned and onlyAvailable is true", () => {
    const results = getRecommendedTeamsSorted({}, true, () => false);
    expect(results).toHaveLength(0);
  });

  it("includes every resolvable team when all characters are owned", () => {
    const ownAll = getRecommendedTeamsSorted({}, true, () => true);
    const unfiltered = getRecommendedTeamsSorted({}, false);
    expect(ownAll.length).toBe(unfiltered.length);
  });
});
