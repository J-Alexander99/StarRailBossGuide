export type Boss = {
  id: string;
  name: string;
  // allow a single value or multiple values for these fields
  weakness?: string | string[];
  resistance?: string | string[];
  metaWeakness?: string | string[];
  metaResistance?: string | string[];
  description?: string;
  image?: string; //For later use
  // optional location string (kept for backward compatibility with UI)
  location?: string;
};

export const BOSSES: Boss[] = [
  {
    id: "1",
    name: "Bronya",
    weakness: "{Physical, Fire, Imaginary}",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Bronya",
  },
  {
    id: "2",
    name: "Cocolia",
    weakness: "{Fire, Lightning, Quantum}",
    resistance: "{Physical, Ice, Wind}",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Cocolia",
  },
  {
    id: "3",
    name: "Gepard",
    weakness: "{Physical, Lightning, Imaginary}",
    resistance: "Ice",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Gepard",
  },
  {
    id: "4",
    name: "Svarog",
    weakness: "{Fire, Lightning, Wind}",
    metaWeakness: "DOT",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Svarog",
  },
  {
    id: "5",
    name: "Abundant Ebon Deer",
    weakness: "{Fire, Ice, Quantum}",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Abundant_Ebon_Deer",
  },
  {
    id: "6",
    name: "Borisin Warhead: Hoolay",
    weakness: "{Physical, Fire, Wind}",
    metaWeakness: "Follow-Up",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Hoolay",
  },
  {
    id: "7",
    name: "Cirrus",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Cirrus",
  },
  {
    id: "8",
    name: "Cloud Knight Lieutenant: Yanqing",
    weakness: "{Lightning, Wind, Imaginary}",
    resistance: "Ice",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Cloud_Knight_Yanqing",
  },
  {
    id: "9",
    name: "Fulminating Wolflord",
    weakness: "{Physical, Fire, Wind, Quantum}",
    resistance: "{Ice, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Fulminating_Wolflord",
  },
  {
    id: "10",
    name: "Stellaron Hunter: Kafka",
    weakness: "{Physical, Wind, Imaginary}",
    resistance: "Lightning",
    metaWeakness: "",
    metaResistance: "",
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Kafka",
  },
  {
    id: "11",
    name: "Stellaron Hunter: Sam",
    weakness: "{Lightning, Quantum, Imaginary}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Sam",
  },
  {
    id: "12",
    name: "Swarm: True Sting",
    weakness: "{Ice, Quantum, Imaginary}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Swarm_True_Sting",
  },
  {
    id: "13",
    name: "Ten Stonehearts: Aventurine of Stratagems",
    weakness: "{Ice, Lightning, Physical}",
    resistance: "Imaginary",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Aventurine",
  },
  {
    id: "14",
    name: "The Past, Present, and Eternal Show",
    weakness: "{Physical, Wind, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "Crit",
    description: "",
    image: "Big_Enemy_The_Past_Present_Show",
  },
  {
    id: "15",
    name: "Wonder Forest's Banacademic Office Staff",
    weakness: "{Fire, Ice, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Banacademic_Office_Staff",
  },
  {
    id: "16",
    name: "Memory Zone Meme Something Unto Death",
    weakness: "{Fire, Wind, Imaginary}",
    metaWeakness: "DOT",
    metaResistance: "Ultimate",
    description: "",
    image: "Big_Enemy_Memory_Zone_Meme",
  },
  {
    id: "17",
    name: "Pollux, Netherwing Husk, Ferry of Souls",
    weakness: "{Wind, Quantum, Imaginary}",
    metaWeakness: "Summon",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Pollux",
  },
  {
    id: "18",
    name: "Savage God, Mad King, Incarnation of Strife",
    weakness: "{Ice, Lightning, Quantum}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Savage_Incarnation_Of_Strife",
  },
  {
    id: "19",
    name: "The Giver, Master of Legions, Lance of Fury",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_The_Lance_of_Fury",
  },
  {
    id: "20",
    name: "Flame Reaver of the Deepest Dark",
    weakness: "{Ice, Lightning, Quantum}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Flame_Reaver",
  },
  {
    id: "21",
    name: "Argenti",
    weakness: "{Ice, Fire, Physical}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    description: "",
    image: "Big_Enemy_Argenti",
  },
  {
    id: "22",
    name: "First Genius, Entelechy, Zandar",
    weakness: "{Ice, Wind, Physical}",
    metaWeakness: "{Kevin, Summon}",
    metaResistance: "Raiden",
    description: "",
    image: "Big_Enemy_First_Genius_Zandar",
  },
];

/**
 * Helper to normalize boss attributes into arrays.
 * Use this when code expects multiple weaknesses/resistances.
 */
export function getBossAttributes(b: Boss) {
  const parseElements = (v?: string | string[]): string[] => {
    if (v == null || v === "") return [];
    if (Array.isArray(v)) return v;

    // Handle strings like "{Physical, Fire, Imaginary}" or single elements
    const str = v.trim();
    if (str.startsWith("{") && str.endsWith("}")) {
      // Parse comma-separated values inside curly braces
      return str
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }

    // Single element or comma-separated without braces
    return str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  return {
    weaknesses: parseElements(b.weakness),
    resistances: parseElements(b.resistance),
    metaWeaknesses: parseElements(b.metaWeakness),
    metaResistances: parseElements(b.metaResistance),
  };
}
