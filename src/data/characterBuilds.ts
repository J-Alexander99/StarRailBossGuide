export type CharacterBuild = {
  characterId: string;
  lightCones: { name: string; notes?: string }[];
  relics: {
    sets: { name: string; pieces?: string; notes?: string }[];
    planar: { name: string; notes?: string }[];
  };
  stats: {
    body: string[];
    feet: string[];
    sphere: string[];
    rope: string[];
    subStats: string[];
  };
};

export const CHARACTER_BUILDS: Record<string, CharacterBuild> = {
  // Example build - Acheron/Raiden
  raiden: {
    characterId: "raiden",
    lightCones: [
      { name: "Along the Passing Shore", notes: "Best in slot for ultimate damage" },
      { name: "Reforged Remembrance", notes: "Strong alternative" },
      { name: "Good Night and Sleep Well", notes: "Best 4-star option" },
      { name: "Fermata", notes: "F2P alternative" },
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc", notes: "Best overall damage" },
        { name: "Prisoner in Deep Confinement", pieces: "4pc", notes: "Debuff-focused teams" },
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm", notes: "Best for ultimate spam" },
        { name: "Firmament Frontline: Glamoth", notes: "High speed builds" },
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["ATK%", "Energy Regen"],
      subStats: ["CRIT Rate", "CRIT DMG", "ATK%", "Speed", "Break Effect"],
    },
  },

  // Add more character builds here
  // Template:
  /*
  character_id: {
    characterId: "character_id",
    lightCones: [
      { name: "Light Cone Name", notes: "Optional notes" },
    ],
    relics: {
      sets: [
        { name: "Relic Set Name", pieces: "4pc/2pc", notes: "Optional notes" },
      ],
      planar: [
        { name: "Planar Set Name", notes: "Optional notes" },
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Element DMG", "ATK%"],
      rope: ["Energy Regen", "ATK%"],
      subStats: ["CRIT Rate", "CRIT DMG", "ATK%", "Speed"],
    },
  },
  */
};

// Helper function to get build for a character
export function getCharacterBuild(characterId: string): CharacterBuild | undefined {
  return CHARACTER_BUILDS[characterId];
}
