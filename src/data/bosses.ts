// Scoring system: -2 (very bad), -1 (bad), 0 (neutral), 1 (good), 2 (very good)
export type EffectivenessScore = -2 | -1 | 0 | 1 | 2;

export type ElementalAffinities = {
  Physical?: EffectivenessScore;
  Fire?: EffectivenessScore;
  Ice?: EffectivenessScore;
  Lightning?: EffectivenessScore;
  Wind?: EffectivenessScore;
  Quantum?: EffectivenessScore;
  Imaginary?: EffectivenessScore;
};

export type RangeAffinities = {
  Single?: EffectivenessScore;
  Blast?: EffectivenessScore;
  AoE?: EffectivenessScore;
  Bounce?: EffectivenessScore;
};

export type MetaAffinities = {
  DOT?: EffectivenessScore;
  Crit?: EffectivenessScore;
  Break?: EffectivenessScore;
  "Follow-Up"?: EffectivenessScore;
  Summon?: EffectivenessScore;
  General?: EffectivenessScore;
  Kevin?: EffectivenessScore;
  Raiden?: EffectivenessScore;
  Ultimate?: EffectivenessScore;
  Burn?: EffectivenessScore;
  Freeze?: EffectivenessScore;
  // Extended meta keys used by newer bosses
  SharedHP?: EffectivenessScore;
  Shielding?: EffectivenessScore;
  ControlRES?: EffectivenessScore;
  SummonAdds?: EffectivenessScore;
  Entanglement?: EffectivenessScore;
  ToughnessReduction?: EffectivenessScore;
  SkillPointDrain?: EffectivenessScore;
  HPReduction?: EffectivenessScore;
  Safeguard?: EffectivenessScore;
  Resonance?: EffectivenessScore;
  WeaknessBrokenBonus?: EffectivenessScore;
  TemperatureStack?: EffectivenessScore;
  ThundercloudStack?: EffectivenessScore;
};

export type Boss = {
  id: string;
  name: string;
  // New scoring-based system
  elements?: ElementalAffinities;
  ranges?: RangeAffinities;
  meta?: MetaAffinities;
  description?: string;
  image?: string;
  location?: string;

  // Legacy fields (kept for backward compatibility, can be deprecated later)
  weakness?: string | string[];
  resistance?: string | string[];
  metaWeakness?: string | string[];
  metaResistance?: string | string[];
  rangeWeakness?: string | string[];
  rangeResistance?: string | string[];
};

export const BOSSES: Boss[] = [
  {
    id: "1",
    name: "Bronya",
    elements: {
      Physical: 2,
      Fire: 2,
      Imaginary: 2,
      Wind: -1,
    },
    ranges: {
      Single: 1,
      AoE: 0,
      Blast: 0,
    },
    meta: {
      Crit: 1,
      Break: 0,
    },
    description:
      "-Suppressive Fire: is single Target and deals Wind DMG (500%) ATK and delays their action (50%).\n\n" +
      "-Windrider Bullet: deals Wind DMG (300% ATK) to a single target.\n\n" +
      "-Combat Redeployment: is a support that dispels all debuffs on a friendly unit except Bronya, and causes them to take action immediately.",
    image: "Big_Enemy_Bronya",
    // Legacy
    weakness: "{Physical, Fire, Imaginary}",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "2",
    name: "Cocolia",
    elements: {
      Fire: 2,
      Lightning: 2,
      Quantum: 2,
      Physical: -2,
      Ice: -2,
      Wind: -1,
    },
    ranges: {
      AoE: 1,
      Single: 0,
      Blast: 1,
    },
    meta: {
      Break: 1,
      DOT: 1,
      Freeze: -2,
    },
    description:
      "-Punishment of Endless Winter: Deals massive Ice DMG (500% ATK) to all targets.\n\n" +
      "-Chill of Bone-Piercing Coagulation: Deals Ice DMG (300% ATK) to a single target.\n\n" +
      "-Omen of Everlasting Freeze: Summons Ice Edges.\n\n" +
      "-Hoarfrost of Eternal Isolation: Deals minor Ice DMG (150% ATK) to a single target, with a high chance (100% Base Chance) to Freeze the target (150% ATK Delayed DMG).\n\n" +
      "-Wrath of Winterland Saints: Enters the Charging state (DMG +25%, 1 Turn). The next action casts (Punishment of Endless Winter) on all targets.\n\n" +
      "-Icy Wind: Deals minor Ice DMG (200% ATK) to all targets.",
    image: "Big_Enemy_Cocolia",
    // Legacy
    weakness: "{Fire, Lightning, Quantum}",
    resistance: "{Physical, Ice, Wind}",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "3",
    name: "Gepard",
    elements: {
      Physical: 2,
      Lightning: 2,
      Imaginary: 2,
      Ice: -2,
    },
    ranges: {
      AoE: 1,
      Single: 1,
      Blast: 0,
    },
    meta: {
      Break: 1,
      Crit: 0,
      Freeze: -1,
    },
    description:
      "-Frigid Waterfall: Deals Ice DMG (380% ATK) to all targets and slightly increases the DMG dealt (12%). This DMG boosting effect is stackable.\n\n" +
      "-Fist of Conviction: Deals minor Ice DMG (300% ATK) to a single target.\n\n" +
      "-Smite of Frost: Deals Ice DMG (350% ATK) to a single target.\n\n" +
      "-Garrison Aura Field: Unleashes the Collective Shield which absorbs DMG taken by all friendly units, as well as preventing all friendly units from receiving damage to their Toughness.\n\n" +
      "-Besiege: Gepard Locks On a single target, causing all friendly units to immediately launch coordinated attacks on the target.\n\n" +
      "-Tit for Tat: Goes into the Counter state for 1 turn. If attacked by a target while in this state, immediately use (Smite of Frost) on the attacker. This effect can only be triggered 1 time.\n\n" +
      "-Support: When the phase starts, immediately summons two Silvermane Lieutenant's.",
    image: "Big_Enemy_Gepard",
    // Legacy
    weakness: "{Physical, Lightning, Imaginary}",
    resistance: "Ice",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "4",
    name: "Svarog",
    elements: {
      Fire: 2,
      Lightning: 2,
      Wind: 2,
      Physical: -1,
    },
    ranges: {
      Single: 1,
      AoE: 0,
      Blast: 1,
    },
    meta: {
      DOT: 2,
      Break: 1,
      Crit: 0,
    },
    description:
      "-Oversaturated Bombardment: Deals massive Physical DMG (15% ATK × 12) to all targets, with a high chance (100% Base Chance) to reduce their DEF (20%, 3 Turns). This debuff can stack.\n\n" +
      "-Banishing Punch: Deals Physical DMG (300% ATK) to a single target.\n\n" +
      "-Burning Beam: Deals Physical DMG (300% ATK) to a single target and delays their action (50%).\n\n" +
      "-Boost Deployment: Summons Auxiliary Robot Arm Unit.\n\n" +
      "-Controlled Blasting: The Auxiliary Robot Arm explodes, dealing massive Physical DMG (1500% ATK) to a single target.\n\n" +
      "-Oppressive Embrace: Restrains a single target, and deals Physical DMG (50% Target Max HP) 1 time. When this unit has their Weakness Broken, dispels the Restrain status from the target.\n\n" +
      "-Overload Warning: Auxiliary Robot Arm Unit enters Overload mode and immediately removes Restrain status from friendly units. When entering this mode, Auxiliary Robot Arm Unit will cast Controlled Blasting in its next action.",
    image: "Big_Enemy_Svarog",
    // Legacy
    weakness: "{Fire, Lightning, Wind}",
    metaWeakness: "DOT",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "5",
    name: "Abundant Ebon Deer",
    elements: {
      Fire: 2,
      Ice: 2,
      Quantum: 2,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      DOT: 1,
      Break: 1,
    },
    description: "",
    image: "Big_Enemy_Abundant_Ebon_Deer",
    // Legacy
    weakness: "{Fire, Ice, Quantum}",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "6",
    name: "Borisin Warhead: Hoolay",
    elements: {
      Physical: 2,
      Fire: 2,
      Wind: 2,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      "Follow-Up": 2,
      Break: 1,
    },
    description: "",
    image: "Big_Enemy_Hoolay",
    // Legacy
    weakness: "{Physical, Fire, Wind}",
    metaWeakness: "Follow-Up",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "7",
    name: "Cirrus",
    elements: {
      Fire: 1,
      Ice: 1,
      Lightning: 1,
    },
    ranges: {
      AoE: 1,
      Single: 0,
    },
    meta: {
      Crit: 1,
      Break: 0,
    },
    description: "",
    image: "Big_Enemy_Cirrus",
    // Legacy
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "8",
    name: "Cloud Knight Lieutenant: Yanqing",
    elements: {
      Lightning: 2,
      Wind: 2,
      Imaginary: 2,
      Ice: -2,
    },
    ranges: {
      Single: 1,
      Blast: 0,
    },
    meta: {
      Crit: 1,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_Cloud_Knight_Yanqing",
    // Legacy
    weakness: "{Lightning, Wind, Imaginary}",
    resistance: "Ice",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "9",
    name: "Fulminating Wolflord",
    elements: {
      Physical: 2,
      Fire: 2,
      Wind: 2,
      Quantum: 2,
      Ice: -2,
      Lightning: -2,
      Imaginary: -1,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      Break: 2,
      Crit: 0,
    },
    description: "",
    image: "Big_Enemy_Fulminating_Wolflord",
    // Legacy
    weakness: "{Physical, Fire, Wind, Quantum}",
    resistance: "{Ice, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "10",
    name: "Stellaron Hunter: Kafka",
    elements: {
      Physical: 2,
      Wind: 2,
      Imaginary: 2,
      Lightning: -2,
    },
    ranges: {
      Single: 1,
      AoE: 0,
    },
    meta: {
      DOT: 1,
      Crit: 1,
    },
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Kafka",
    // Legacy
    weakness: "{Physical, Wind, Imaginary}",
    resistance: "Lightning",
    metaWeakness: "",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "11",
    name: "Stellaron Hunter: Sam",
    elements: {
      Lightning: 2,
      Quantum: 2,
      Imaginary: 2,
      Fire: -1,
    },
    ranges: {
      Single: 1,
      Blast: 0,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
      Break: 1,
    },
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Sam",
    // Legacy
    weakness: "{Lightning, Quantum, Imaginary}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "12",
    name: "Swarm: True Sting",
    elements: {
      Ice: 2,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      AoE: 2,
      Blast: 1,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
      DOT: 1,
    },
    description: "",
    image: "Big_Enemy_Swarm_True_Sting",
    // Legacy
    weakness: "{Ice, Quantum, Imaginary}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "13",
    name: "Ten Stonehearts: Aventurine of Stratagems",
    elements: {
      Ice: 2,
      Lightning: 2,
      Physical: 2,
      Imaginary: -2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
      Break: 1,
    },
    description: "",
    image: "Big_Enemy_Aventurine",
    // Legacy
    weakness: "{Ice, Lightning, Physical}",
    resistance: "Imaginary",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "14",
    name: "The Past, Present, and Eternal Show",
    elements: {
      Physical: 2,
      Wind: 2,
      Lightning: 2,
      Imaginary: 2,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      Break: 2,
      Crit: -2,
      DOT: 1,
    },
    description: "",
    image: "Big_Enemy_The_Past_Present_Show",
    // Legacy
    weakness: "{Physical, Wind, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "Crit",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "15",
    name: "Wonder Forest's Banacademic Office Staff",
    elements: {
      Fire: 2,
      Ice: 2,
      Lightning: 2,
      Imaginary: 2,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      Break: 2,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_Banacademic_Office_Staff",
    // Legacy
    weakness: "{Fire, Ice, Lightning, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "16",
    name: "Memory Zone Meme Something Unto Death",
    elements: {
      Fire: 2,
      Wind: 2,
      Imaginary: 2,
    },
    ranges: {
      Single: 0,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Ultimate: -2,
    },
    description: "",
    image: "Big_Enemy_Memory_Zone_Meme",
    // Legacy
    weakness: "{Fire, Wind, Imaginary}",
    metaWeakness: "DOT",
    metaResistance: "Ultimate",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "17",
    name: "Pollux, Netherwing Husk, Ferry of Souls",
    elements: {
      Wind: 2,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      Summon: 2,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_Pollux",
    // Legacy
    weakness: "{Wind, Quantum, Imaginary}",
    metaWeakness: "Summon",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "18",
    name: "Savage God, Mad King, Incarnation of Strife",
    elements: {
      Ice: 2,
      Lightning: 2,
      Quantum: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_Savage_Incarnation_Of_Strife",
    // Legacy
    weakness: "{Ice, Lightning, Quantum}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "19",
    name: "The Giver, Master of Legions, Lance of Fury",
    elements: {
      Fire: 1,
      Ice: 1,
      Lightning: 1,
    },
    ranges: {
      AoE: 1,
      Single: 0,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_The_Lance_of_Fury",
    // Legacy
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "20",
    name: "Flame Reaver of the Deepest Dark",
    elements: {
      Ice: 2,
      Lightning: 2,
      Quantum: 2,
      Fire: -1,
    },
    ranges: {
      AoE: 1,
      Blast: 1,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
    },
    description: "",
    image: "Big_Enemy_Flame_Reaver",
    // Legacy
    weakness: "{Ice, Lightning, Quantum}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "21",
    name: "Argenti",
    elements: {
      Ice: 2,
      Fire: 2,
      Physical: 2,
    },
    ranges: {
      Single: 1,
      Blast: 0,
    },
    meta: {
      Burn: 2,
      Freeze: -2,
      Crit: 1,
    },
    description: "",
    image: "Big_Enemy_Argenti",
    // Legacy
    weakness: "{Ice, Fire, Physical}",
    metaWeakness: "Burn",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "22",
    name: "First Genius, Entelechy, Zandar",
    elements: {
      Ice: 2,
      Wind: 2,
      Physical: 2,
    },
    ranges: {
      AoE: 1,
      Single: 0,
    },
    meta: {
      Kevin: 2,
      Summon: 2,
      Raiden: -2,
    },
    description: "",
    image: "Big_Enemy_First_Genius_Zandar",
    // Legacy
    weakness: "{Ice, Wind, Physical}",
    metaWeakness: "{Kevin, Summon}",
    metaResistance: "Raiden",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "23",
    name: "Doomsday Beast",
    elements: {
      Fire: 2,
      Quantum: 1,
      Imaginary: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      Break: 2,
      DOT: 1,
      Crit: 0,
    },
    description:
      "A boss formed using fragments of the Dusk Leviathan and the bones of the Warforge, powered by a dark matter engine. In its fight it consists of three parts (Disaster's Right Hand, Dawn's Left Hand, and the Antimatter Engine). Until these parts are destroyed, the core cannot be attacked. Once they are destroyed, the body becomes vulnerable.\n\n" +
      "-The Doomsday Beast has extremely high control resistance, making it difficult to apply debuffs.\n\n" +
      "-Focus on breaking the individual parts first before attacking the main body.\n\n" +
      "-Fire damage is highly effective against its components, especially the engine.",
    image: "Doomsday_Beast",
    location: "Herta Space Station",
    // Legacy
    weakness: "{Fire, Quantum, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "24",
    name: "Cocolia, Mother of Deception",
    elements: {
      Ice: 2,
      Imaginary: 2,
      Fire: 1,
      Quantum: 1,
      Lightning: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      Freeze: -2,
      Break: 2,
      DOT: 1,
    },
    description:
      "The Supreme Guardian of Belobog corrupted by Fragmentum energy, Cocolia transforms into a singer of Imaginary power, summoning Lances of Eternal Freeze and unleashing both ice and imaginary attacks. Her fight occurs in two phases, shifting from Ice-dominant to Imaginary-dominant on the transformation.\n\n" +
      "-Phase 1: Focuses on Ice attacks and summons Lances of Eternal Freeze.\n\n" +
      "-Phase 2: After transformation, gains Imaginary attacks and increased power.\n\n" +
      "-Highly resistant to Freeze effects.\n\n" +
      "-Breaking her toughness bar is crucial to interrupt her powerful attacks.",
    image: "Cocolia_Mother_of_Deception",
    location: "Everwinter Hill, Jarilo-VI",
    // Legacy
    weakness: "{Ice, Imaginary, Fire, Quantum, Lightning}",
    metaWeakness: "Break",
    metaResistance: "Freeze",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "25",
    name: "Phantylia the Undying",
    elements: {
      Wind: 2,
      Imaginary: 2,
      Lightning: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      Break: 2,
      DOT: 1,
      Crit: 0,
    },
    description:
      "A manifestation of the Lord Ravager of the Antimatter Legion. Phantylia the Undying engineers a body from the Ambrosial Arbor, commanding Abundance and Destruction Lotuses to disrupt the party's skill points and HP while she strikes with Wind, Lightning and Imaginary attacks.\n\n" +
      "-Summons Abundance Lotuses that drain skill points and restore her HP.\n\n" +
      "-Summons Destruction Lotuses that reduce party HP significantly.\n\n" +
      "-Action delay mechanics can disrupt team rotation.\n\n" +
      "-Managing the Lotuses is crucial - prioritize destroying them quickly.\n\n" +
      "-High toughness bars make Break teams very effective.",
    image: "Phantylia_The_Undying",
    location: "Scalegorge Waterscape, Xianzhou Luofu",
    // Legacy
    weakness: "{Wind, Imaginary, Lightning}",
    metaWeakness: "Break",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "26",
    name: "Starcrusher Swarm King: Skaracabaz (Synthetic)",
    elements: {
      Quantum: 2,
      Ice: 1,
      Physical: 1,
      Imaginary: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      Break: 2,
      DOT: 1,
      Summon: -2,
    },
    description:
      "A synthetic clone of the Emanator of Propagation originally bred by Ruan Mei, this incomplete version of Skaracabaz breaks free in the Seclusion Zone on Herta Space Station. It uses devastating Quantum attacks, summons swarms of 'Gnaw Sting' and 'Lesser Sting' adds, and enters a Multiply/Carapace state where its damage taken is reduced and attacking it causes more adds to appear. If its Weakness is Broken during that state, it deals massive Toughness damage to its allies.\n\n" +
      "-Constantly summons Gnaw Sting and Lesser Sting adds that must be managed.\n\n" +
      "-Enters Multiply/Carapace state with damage reduction - attacking spawns more adds.\n\n" +
      "-Breaking its Weakness during Carapace state deals massive toughness damage to all enemies.\n\n" +
      "-AoE attacks are highly effective for managing swarms.\n\n" +
      "-Quantum damage is the most effective element.",
  image: "Skaracabaz_Synthetic",
    location: "Seclusion Zone, Herta Space Station",
    // Legacy
    weakness: "{Quantum, Ice, Physical, Imaginary}",
    metaWeakness: "Break",
    metaResistance: "",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "27",
    name: "\"Harmonious Choir\" The Great Septimus",
    elements: {
      Imaginary: 2,
      Fire: 1,
      Lightning: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      SharedHP: 2,
      Shielding: 2,
      ControlRES: 1,
      SummonAdds: 1,
    },
    description:
      "An Echo of War boss in Penacony, conducted by Dominicus, the Great Septimus fights under the title \"Harmonious Choir.\" He summons multiple Echoes of Faded Dreams whose damage is redirected to him, commands powerful Imaginary attacks (Grazioso, Maestoso, Volteggiando, Tempestoso), and in Phase 3 transforms into Embryo of Philosophy Sunday with layered Toughness bars and a massive all-target attack after 7 turns.\n\n" +
      "-Damage from Echoes is redirected to the main boss (Shared HP mechanic).\n\n" +
      "-Shielding phases grant strong damage mitigation to the choir; focus on breaking shields quickly.\n\n" +
      "-Control resistance is elevated; debuffs may be unreliable.\n\n" +
      "-Adds must be removed quickly to prevent the choir from amplifying its shared HP recovery.",
    image: "Harmonious_Choir_The_Great_Septimus",
    location: "Penacony, The Grand Theatre",
    // Legacy
    weakness: "{Imaginary, Fire, Lightning}",
    metaWeakness: "Break",
    metaResistance: "ControlRES",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "28",
    name: "Shadow of \"Feixiao\" & Ecliptic Inner Beast",
    elements: {
      Wind: 2,
      Quantum: 1,
      Fire: 1,
      Physical: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      Safeguard: 2,
      SharedHP: 2,
      Resonance: 2,
      WeaknessBrokenBonus: 2,
    },
    description:
      "In this Echo of War fight, the Shadow of Feixiao (manifested from Feixiao’s inner corruption) fights in conjunction with the Ecliptic Inner Beast. In later phases she gains parts (Nebula Devourer, Planeshred Claws, Worldpurge Tail) which share HP with her via a ‘Seance’ effect. Safeguard shields her until a Weakness Break is inflicted; resonance mechanics with her parts restore Toughness or amplify their attacks; in Phase 3 she can use ‘Sweep the Heavens, Swallow the Earth’ to deal massive damage which scales with how many parts remain unbroken.\n\n" +
      "-Manage parts to avoid high damage from Sweep the Heavens; breaking parts reduces the final attack's potency.\n\n" +
      "-Safeguard phases must be removed or ignored via mechanics to enable Weakness Break opportunities.\n\n" +
      "-Resonance between parts can restore Toughness; coordinate breaks to prevent heals.",
    image: "Shadow_of_Feixiao_Ecliptic_Inner_Beast",
    location: "Echo Arena, Penacony",
    // Legacy
    weakness: "{Wind, Quantum, Fire, Physical}",
    metaWeakness: "Break",
    metaResistance: "Safeguard",
    rangeWeakness: "",
    rangeResistance: "",
  },
  {
    id: "29",
    name: "Sublime, Radiant, Avatar of the Sky",
    elements: {
      Fire: 2,
      Lightning: 2,
      Physical: 1,
      Ice: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      TemperatureStack: 2,
      ThundercloudStack: 2,
      SharedHP: 1,
      Safeguard: 1,
    },
    description:
      "The Sky‐Titan known as Theos Synthetos, corrupted and fused with humanity, governing the rampage of the skies in Amphoreus. In the Echo of War battle, this boss fights alongside ‘Hundred Eyes’ add-units (Daythunder Raven, Shoot of Hundred Eyes, Twig of Hundred Eyes) and cycles through phases that revolve around Fire (Day/Heat) and Lightning (Storm) mechanics, with Temperature and Thundercloud stacks driving massive multi-target damage.\n\n" +
      "-Manage Temperature and Thundercloud stacks to avoid devastating multi-target attacks.\n\n" +
      "-Shared HP mechanics connect the boss and its Hundred Eyes adds; controlling adds reduces incoming damage.\n\n" +
      "-Safeguard phases grant temporary immunity until mechanics are resolved.",
    image: "Sublime_Radiant_Avatar_of_the_Sky",
    location: "Amphoreus, Sky Spire",
    // Legacy
    weakness: "{Fire, Lightning, Physical, Ice}",
    metaWeakness: "TemperatureStack",
    metaResistance: "Safeguard",
    rangeWeakness: "",
    rangeResistance: "",
  },
];

/**
 * Helper to get boss effectiveness scores
 */
export function getBossAffinities(boss: Boss) {
  return {
    elements: boss.elements || {},
    ranges: boss.ranges || {},
    meta: boss.meta || {},
  };
}

/**
 * Get effectiveness score for a specific attribute
 * Returns 0 (neutral) if not specified
 */
export function getEffectivenessScore(
  affinities: Record<string, EffectivenessScore>,
  key: string
): EffectivenessScore {
  return affinities[key] ?? 0;
}

/**
 * Legacy helper to normalize boss attributes into arrays.
 * Use this when code expects multiple weaknesses/resistances.
 * @deprecated Use getBossAffinities instead
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
    rangeWeaknesses: parseElements(b.rangeWeakness),
    rangeResistances: parseElements(b.rangeResistance),
  };
}
