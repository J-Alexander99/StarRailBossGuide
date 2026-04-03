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
  Team?: EffectivenessScore;
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
  Elation?: EffectivenessScore;
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
};

export const BOSSES: Boss[] = [
  {
    id: "1",
    name: "Bronya",
    elements: {
      Physical: 2,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: -1,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 2,
      Blast: 0,
      AoE: -1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 0,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: -1,
      Raiden: 0,
      Ultimate: -1,
    },
    description:
      "-Suppressive Fire: is single Target and deals Wind DMG (500%) ATK and delays their action (50%).\n\n" +
      "-Windrider Bullet: deals Wind DMG (300% ATK) to a single target.\n\n" +
      "-Combat Redeployment: is a support that dispels all debuffs on a friendly unit except Bronya, and causes them to take action immediately.",
    image: "Big_Enemy_Bronya",
  },
  {
    id: "2",
    name: "Cocolia",
    elements: {
      Physical: -1,
      Fire: 2,
      Ice: -2,
      Lightning: 2,
      Wind: -1,
      Quantum: 2,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 0,
    },
    description:
      "-Punishment of Endless Winter: Deals massive Ice DMG (500% ATK) to all targets.\n\n" +
      "-Chill of Bone-Piercing Coagulation: Deals Ice DMG (300% ATK) to a single target.\n\n" +
      "-Omen of Everlasting Freeze: Summons Ice Edges.\n\n" +
      "-Hoarfrost of Eternal Isolation: Deals minor Ice DMG (150% ATK) to a single target, with a high chance (100% Base Chance) to Freeze the target (150% ATK Delayed DMG).\n\n" +
      "-Wrath of Winterland Saints: Enters the Charging state (DMG +25%, 1 Turn). The next action casts (Punishment of Endless Winter) on all targets.\n\n" +
      "-Icy Wind: Deals minor Ice DMG (200% ATK) to all targets.",
    image: "Big_Enemy_Cocolia",
  },
  {
    id: "3",
    name: "Gepard",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: -2,
      Lightning: 2,
      Wind: 0,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 0,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: 0,
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
  },
  {
    id: "4",
    name: "Svarog",
    elements: {
      Physical: -1,
      Fire: 2,
      Ice: 0,
      Lightning: 2,
      Wind: 2,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 0,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 1,
      General: 0,
      Kevin: 0,
      Raiden: -1,
      Ultimate: 0,
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
  },
  {
    id: "5",
    name: "Abundant Ebon Deer",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 2,
      Lightning: 0,
      Wind: 0,
      Quantum: 2,
      Imaginary: 0,
    },
    ranges: {
      Single: 0,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 0,
    },
    description: "",
    image: "Big_Enemy_Abundant_Ebon_Deer",
  },
  {
    id: "6",
    name: "Borisin Warhead: Hoolay",
    elements: {
      Physical: 2,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: 2,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 1,
      "Follow-Up": 2,
      Summon: 1,
      General: 0,
      Kevin: -1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Hoolay",
  },
  {
    id: "7",
    name: "Cirrus",
    elements: {
      Physical: 0,
      Fire: 1,
      Ice: 1,
      Lightning: 1,
      Wind: 0,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 0,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 1,
      Break: 1,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 1,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Cirrus",
  },
  {
    id: "8",
    name: "Cloud Knight Lieutenant: Yanqing",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: -2,
      Lightning: 2,
      Wind: 2,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Cloud_Knight_Yanqing",
  },
  {
    id: "9",
    name: "Fulminating Wolflord",
    elements: {
      Physical: 2,
      Fire: 2,
      Ice: -2,
      Lightning: -2,
      Wind: 2,
      Quantum: 2,
      Imaginary: -1,
    },
    ranges: {
      Single: 2,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      DOT: 0,
      Crit: 1,
      Break: 2,
      "Follow-Up": 0,
      Summon: 2,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 0,
    },
    description: "",
    image: "Big_Enemy_Fulminating_Wolflord",
  },
  {
    id: "10",
    name: "Stellaron Hunter: Kafka",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: 0,
      Lightning: -2,
      Wind: 2,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 2,
      Blast: 1,
      AoE: 0,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Kafka",
  },
  {
    id: "11",
    name: "Stellaron Hunter: Sam",
    elements: {
      Physical: 0,
      Fire: -1,
      Ice: 0,
      Lightning: 2,
      Wind: 0,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 0,
      AoE: 0,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: 0,
    },
    description: "",
    image: "Big_Enemy_Stellaron_Hunter_Sam",
  },
  {
    id: "12",
    name: "Swarm: True Sting",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: 2,
      Lightning: 0,
      Wind: 0,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 2,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Swarm_True_Sting",
  },
  {
    id: "13",
    name: "Ten Stonehearts: Aventurine of Stratagems",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: 2,
      Lightning: 2,
      Wind: 0,
      Quantum: 0,
      Imaginary: -2,
    },
    ranges: {
      Single: -2,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 2,
      General: 0,
      Kevin: 0,
      Raiden: 2,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Aventurine",
  },
  {
    id: "14",
    name: "The Past, Present, and Eternal Show",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: 0,
      Lightning: 2,
      Wind: 2,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_The_Past_Present_Show",
  },
  {
    id: "15",
    name: "Wonder Forest's Banacademic Office Staff",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 2,
      Lightning: 2,
      Wind: 0,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 0,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 2,
      Summon: 2,
      General: 0,
      Kevin: 2,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Banacademic_Office_Staff",
  },
  {
    id: "16",
    name: "Memory Zone Meme Something Unto Death",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: 2,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 1,
      "Follow-Up": 1,
      Summon: 0,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: -1,
    },
    description: "",
    image: "Big_Enemy_Memory_Zone_Meme",
  },
  {
    id: "17",
    name: "Pollux, Netherwing Husk, Ferry of Souls",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: 0,
      Lightning: 0,
      Wind: 2,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 2,
      General: 0,
      Kevin: 0,
      Raiden: -1,
      Ultimate: -1,
    },
    description: "",
    image: "Big_Enemy_Pollux",
  },
  {
    id: "18",
    name: "Savage God, Mad King, Incarnation of Strife",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: 2,
      Lightning: 2,
      Wind: 0,
      Quantum: 2,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 1,
      "Follow-Up": 2,
      Summon: 2,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Savage_Incarnation_Of_Strife",
  },
  {
    id: "19",
    name: "The Giver, Master of Legions, Lance of Fury",
    elements: {
      Physical: 0,
      Fire: 1,
      Ice: 1,
      Lightning: 1,
      Wind: 0,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 2,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 1,
      "Follow-Up": 2,
      Summon: 2,
      General: 0,
      Kevin: 1,
      Raiden: -1,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_The_Lance_of_Fury",
  },
  {
    id: "20",
    name: "Flame Reaver of the Deepest Dark",
    elements: {
      Physical: 0,
      Fire: -1,
      Ice: 2,
      Lightning: 2,
      Wind: 0,
      Quantum: 2,
      Imaginary: 0,
    },
    ranges: {
      Single: 0,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 1,
      "Follow-Up": 1,
      Summon: 2,
      General: 0,
      Kevin: 2,
      Raiden: 0,
      Ultimate: 2,
    },
    description: "",
    image: "Big_Enemy_Flame_Reaver",
  },
  {
    id: "21",
    name: "Argenti",
    elements: {
      Physical: 2,
      Fire: 2,
      Ice: 2,
      Lightning: 0,
      Wind: 0,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 0,
      Blast: 2,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 2,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_Argenti",
  },
  {
    id: "22",
    name: "First Genius, Entelechy, Zandar",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: 2,
      Lightning: 0,
      Wind: 2,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 2,
      General: 0,
      Kevin: 2,
      Raiden: -2,
      Ultimate: 1,
    },
    description: "",
    image: "Big_Enemy_First_Genius_Zandar",
  },
  {
    id: "23",
    name: "Doomsday Beast",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: 0,
      Quantum: 1,
      Imaginary: 1,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 2,
      Raiden: 1,
      Ultimate: 1,
    },
    description:
      "A boss formed using fragments of the Dusk Leviathan and the bones of the Warforge, powered by a dark matter engine. In its fight it consists of three parts (Disaster's Right Hand, Dawn's Left Hand, and the Antimatter Engine). Until these parts are destroyed, the core cannot be attacked. Once they are destroyed, the body becomes vulnerable.\n\n" +
      "-The Doomsday Beast has extremely high control resistance, making it difficult to apply debuffs.\n\n" +
      "-Focus on breaking the individual parts first before attacking the main body.\n\n" +
      "-Fire damage is highly effective against its components, especially the engine.",
    image: "Doomsday_Beast",
    location: "Herta Space Station",
  },
  {
    id: "24",
    name: "Cocolia, Mother of Deception",
    elements: {
      Physical: 0,
      Fire: 1,
      Ice: 2,
      Lightning: 1,
      Wind: 0,
      Quantum: 1,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 0,
      General: 0,
      Kevin: 1,
      Raiden: 1,
      Ultimate: 1,
    },
    description:
      "The Supreme Guardian of Belobog corrupted by Fragmentum energy, Cocolia transforms into a singer of Imaginary power, summoning Lances of Eternal Freeze and unleashing both ice and imaginary attacks. Her fight occurs in two phases, shifting from Ice-dominant to Imaginary-dominant on the transformation.\n\n" +
      "-Phase 1: Focuses on Ice attacks and summons Lances of Eternal Freeze.\n\n" +
      "-Phase 2: After transformation, gains Imaginary attacks and increased power.\n\n" +
      "-Highly resistant to Freeze effects.\n\n" +
      "-Breaking her toughness bar is crucial to interrupt her powerful attacks.",
    image: "Cocolia_Mother_of_Deception",
    location: "Everwinter Hill, Jarilo-VI",
  },
  {
    id: "25",
    name: "Phantylia the Undying",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: 0,
      Lightning: 2,
      Wind: 2,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 1,
      Ultimate: 0,
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
  },
  {
    id: "26",
    name: "Starcrusher Swarm King: Skaracabaz (Synthetic)",
    elements: {
      Physical: 1,
      Fire: 0,
      Ice: 1,
      Lightning: 0,
      Wind: 0,
      Quantum: 2,
      Imaginary: 1,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 2,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 1,
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
  },
  {
    id: "27",
    name: '"Harmonious Choir" The Great Septimus',
    elements: {
      Physical: 0,
      Fire: 1,
      Ice: 0,
      Lightning: 1,
      Wind: 0,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 1,
      Summon: 0,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 0,
    },
    description:
      'An Echo of War boss in Penacony, conducted by Dominicus, the Great Septimus fights under the title "Harmonious Choir." He summons multiple Echoes of Faded Dreams whose damage is redirected to him, commands powerful Imaginary attacks (Grazioso, Maestoso, Volteggiando, Tempestoso), and in Phase 3 transforms into Embryo of Philosophy Sunday with layered Toughness bars and a massive all-target attack after 7 turns.\n\n' +
      "-Damage from Echoes is redirected to the main boss (Shared HP mechanic).\n\n" +
      "-Shielding phases grant strong damage mitigation to the choir; focus on breaking shields quickly.\n\n" +
      "-Control resistance is elevated; debuffs may be unreliable.\n\n" +
      "-Adds must be removed quickly to prevent the choir from amplifying its shared HP recovery.",
    image: "Harmonious_Choir_The_Great_Septimus",
    location: "Penacony, The Grand Theatre",
  },
  {
    id: "28",
    name: 'Shadow of "Feixiao" & Ecliptic Inner Beast',
    elements: {
      Physical: 1,
      Fire: 1,
      Ice: 0,
      Lightning: 0,
      Wind: 2,
      Quantum: 1,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 1,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: -1,
    },
    description:
      "In this Echo of War fight, the Shadow of Feixiao (manifested from Feixiao's inner corruption) fights in conjunction with the Ecliptic Inner Beast. In later phases she gains parts (Nebula Devourer, Planeshred Claws, Worldpurge Tail) which share HP with her via a 'Seance' effect. Safeguard shields her until a Weakness Break is inflicted; resonance mechanics with her parts restore Toughness or amplify their attacks; in Phase 3 she can use 'Sweep the Heavens, Swallow the Earth' to deal massive damage which scales with how many parts remain unbroken.\n\n" +
      "-Manage parts to avoid high damage from Sweep the Heavens; breaking parts reduces the final attack's potency.\n\n" +
      "-Safeguard phases must be removed or ignored via mechanics to enable Weakness Break opportunities.\n\n" +
      "-Resonance between parts can restore Toughness; coordinate breaks to prevent heals.",
    image: "Shadow_of_Feixiao_Ecliptic_Inner_Beast",
    location: "Echo Arena, Penacony",
  },
  {
    id: "29",
    name: "Sublime, Radiant, Avatar of the Sky",
    elements: {
      Physical: 1,
      Fire: 2,
      Ice: 1,
      Lightning: 2,
      Wind: 0,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 1,
      Blast: 2,
      AoE: 1,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 2,
      General: 0,
      Kevin: 1,
      Raiden: -1,
      Ultimate: -1,
    },
    description: "",
    image: "Sublime_Radiant_Avatar_of_the_Sky",
    location: "Amphoreus, Sky Spire",
  },
  {
    id: "30",
    name: "Ichor Memosprite: Judge of Oblivion",
    elements: {
      Physical: 2,
      Fire: 0,
      Ice: 1,
      Lightning: 0,
      Wind: 0,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 2,
      Blast: 0,
      AoE: 1,
    },
    meta: {
      DOT: 2,
      Crit: 0,
      Break: 2,
      "Follow-Up": -1,
      Summon: 2,
      General: 0,
      Kevin: 2,
      Raiden: -1,
      Ultimate: -1,
    },
    description:
      "A new powerful boss in Amphoreus that locks onto targets and uses high-impact single-target abilities (Hemotort Teethgrind / Hemotort Saw) while spawning Pheasant summons via Execution in Place. Summons directly interact with the boss’ Toughness — destroying summons reduces the boss’ Toughness, making them a priority target. The boss gains Pursuer/target-lock effects and applies Hemotort Corruption based on damage taken; certain status effects (Expedite Verdict) reduce incoming damage until the boss is Weakness-Broken. Shields interact uniquely with its kit: if the target has a Shield, some of the boss’ attacks instead reduce its Toughness (so shielded playstyles are strongly recommended).",
    image: "Ichor_Memosprite_Judge_of_Oblivion",
    location: "Amphoreus (Memory / World boss/Encounter in 3.6 content)",
  },
  {
    id: "31",
    name: "Harbinger of Death: Swarm Nightmare",
    elements: {
      Physical: 2,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: 2,
      Quantum: 0,
      Imaginary: 0,
    },
    ranges: {
      Single: 2,
      Blast: 1,
      AoE: 0,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 2,
      "Follow-Up": 0,
      Summon: 1,
      General: 0,
      Kevin: 1,
      Raiden: 0,
      Ultimate: 0,
    },
    description:
      "A shell covered in strange matter, distorted by a Stellaron's will as if a suit Glamoth armor corroded by Propagation. Deep within the dreamscape, the Swarm Disaster resurfaces in this form.",
    image: "",
    location: "",
  },
  {
    id: "32",
    name: "@SparxiConOfficial",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 0,
      Lightning: 0,
      Wind: 0,
      Quantum: 2,
      Imaginary: 2,
    },
    ranges: {
      Single: 0,
      Blast: 0,
      AoE: 0,
    },
    meta: {
      DOT: 1,
      Crit: 0,
      Break: 1,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: 0,
      Raiden: -2,
      Ultimate: 0,
      Elation: 2,
    },
    description:
      "Planarcadia's trending streamer Sparxie is going live! Tonight, witness the SparxiCon where she'll unveil her brand-new image to her devoted fans!",
    image: "",
    location: "",
  },
  {
    id: "33",
    name: "Alloy Mechatron: King Pom-Pom",
    elements: {
      Physical: 0,
      Fire: 2,
      Ice: 0,
      Lightning: 2,
      Wind: 0,
      Quantum: 0,
      Imaginary: 2,
    },
    ranges: {
      Single: 0,
      Blast: 0,
      AoE: 0,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 0,
      "Follow-Up": 0,
      Summon: 0,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: 0,
    },
    description:
      "Who can handle the wild, untamed power of the Astral Express!? Pom-Pom, now beyond control, has transformed into the Alloy Mechatron: King Pom-Pom. King Pom-Pom is a powerful mechatron obsessed with cleanliness and order. By its standards, this place is a mess and needs a thorough! Deep! Clean!",
    image: "",
    location: "",
  },
  {
    id: "34",
    name: "Anti-Creator, Hatred Inundate",
    elements: {
      Physical: 0,
      Fire: 0,
      Ice: 2,
      Lightning: 2,
      Wind: 0,
      Quantum: 2,
      Imaginary: 0,
    },
    ranges: {
      Single: 0,
      Blast: 0,
      AoE: 0,
    },
    meta: {
      DOT: 0,
      Crit: 0,
      Break: 0,
      "Follow-Up": 0,
      Summon: 2,
      General: 0,
      Kevin: 0,
      Raiden: 0,
      Ultimate: 0,
    },
    description:
      "The core of the ancient Scepter, the materialized hatred of Amphoreus. It has recorded billions of souls' suffering, countless lambs' blood converging into an absolute darkness. The endless, infinite darkness flows out from a broken shell, driving forth the headless giant. This shell, forged from an endless stream of hatred, seems to contain a heart wrapped in chaotic flames deep within.",
    image: "",
    location: "Echo of War: Rusted Crypt of the Iron Carcass",
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






