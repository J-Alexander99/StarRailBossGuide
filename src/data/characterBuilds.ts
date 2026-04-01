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
  aglaea: {
    characterId: "aglaea",
    lightCones: [
      { name: "Time Woven Into Gold" },
      { name: "Sweat Now, Cry Less" },
      { name: "Reminiscence" },
      { name: "Geniuses' Greetings" }
    ],
    relics: {
      sets: [
        { name: "Hero of Triumphant Song", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Musketeer of Wild Wheat", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Arcadia of Woven Dreams" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Lightning DMG"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  anaxa: {
    characterId: "anaxa",
    lightCones: [
      { name: "Life Should Be Cast to Flames" },
      { name: "Into the Unreachable Veil" },
      { name: "The Great Cosmic Enterprise" },
      { name: "Today Is Another Peaceful Day" },
      { name: "Before Dawn" }
    ],
    relics: {
      sets: [
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed"],
      sphere: ["ATK%", "Wind DMG"],
      rope: ["ATK%", "Energy Regen Rate"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT RATE > CRIT DMG > ATK%"],
    },
  },
  archer: {
    characterId: "archer",
    lightCones: [
      { name: "The Hell Where Ideals Burn" },
      { name: "Baptism of Pure Thought" },
      { name: "Cruising in the Stellar Sea" },
      { name: "See You at the End" },
      { name: "Only Silence Remains" }
    ],
    relics: {
      sets: [
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Wavestrider Captain", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Tengoku@Livestream" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate"],
      feet: ["ATK%"],
      sphere: ["ATK%", "Quantum DMG"],
      rope: ["ATK%"],
      subStats: ["CRIT Rate (Until 100% with buffs) > CRIT DMG > ATK%"],
    },
  },
  argenti: {
    characterId: "argenti",
    lightCones: [
      { name: "Into the Unreachable Veil" },
      { name: "An Instant Before A Gaze" },
      { name: "Today Is Another Peaceful Day" },
      { name: "Night on the Milky Way" },
      { name: "Eternal Calculus" },
      { name: "Geniuses' Repose" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" }
      ],
      planar: [
        { name: "Inert Salsotto" },
        { name: "Sigonia, the Unclaimed Desolation" },
        { name: "Firmament Frontline: Glamoth" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (Breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  arlan: {
    characterId: "arlan",
    lightCones: [
      { name: "On the Fall of an Aeon" },
      { name: "The Unreachable Side" },
      { name: "A Secret Vow" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Band of Sizzling Thunder", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (Breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  ashveil: {
    characterId: "ashveil",
    lightCones: [
      { name: "The Finale of a Lie" },
      { name: "Baptism of Pure Thought" },
      { name: "Worrisome, Blissful" },
      { name: "Cruising in the Stellar Sea" },
      { name: "See You at the End" },
      { name: "The Hell Where Ideals Burn" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "City of Converging Stars" },
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate"],
      feet: ["ATK%", "Speed"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["ATK%", "Energy Regen Rate"],
      subStats: ["CRIT Rate = CRIT DMG > ATK% > SPD"],
    },
  },
  asta: {
    characterId: "asta",
    lightCones: [
      { name: "Dance! Dance! Dance!" },
      { name: "Meshing Cogs" },
      { name: "But the Battle Isn't Over" },
      { name: "Planetary Rendezvous" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "DEF%"],
      feet: ["Speed"],
      sphere: ["Fire DMG", "HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (Until breakpoint) > HP = DEF > EFF RES% (30% If using Broken Keel)"],
    },
  },
  aventurine: {
    characterId: "aventurine",
    lightCones: [
      { name: "Inherently Unjust Destiny" },
      { name: "Journey, Forever Peaceful" },
      { name: "Moment of Victory" },
      { name: "Day One of My New Life" },
      { name: "Concert for Two" },
      { name: "Trend of the Universal Market" },
      { name: "Landau's Choice" }
    ],
    relics: {
      sets: [
        { name: "Self-Enshrouded Recluse", pieces: "4pc" },
        { name: "Knight of Purity Palace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["DEF%", "CRIT DMG"],
      feet: ["Speed", "DEF%"],
      sphere: ["DEF%", "Imaginary DMG"],
      rope: ["DEF%"],
      subStats: ["DEF% (aim for 4k) >= SPD > CRIT DMG > CRIT Rate > Effect RES"],
    },
  },
  bailu: {
    characterId: "bailu",
    lightCones: [
      { name: "Night of Fright" },
      { name: "Time Waits for No One" },
      { name: "Post-Op Conversation" },
      { name: "Unto Tomorrow's Morrow" },
      { name: "Perfect Timing" },
      { name: "Quid Pro Quo" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Passerby of Wandering Cloud", pieces: "4pc" }
      ],
      planar: [
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["Outgoing Healing", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) > HP% > EFF RES% = DEF%"],
    },
  },
  blackswan: {
    characterId: "blackswan",
    lightCones: [
      { name: "Reforged Remembrance" },
      { name: "Those Many Springs" },
      { name: "Eyes of the Prey" },
      { name: "It's Showtime" },
      { name: "Why Does the Ocean Sing" }
    ],
    relics: {
      sets: [
        { name: "Prisoner in Deep Confinement", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Revelry by the Sea" },
        { name: "Pan-Cosmic Commercial Enterprise" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate"],
      feet: ["ATK%"],
      sphere: ["Wind DMG"],
      rope: ["ATK%"],
      subStats: ["EHR (Until 120%) > SPD (Until breakpoint) > ATK%"],
    },
  },
  blade: {
    characterId: "blade",
    lightCones: [
      { name: "The Unreachable Side" },
      { name: "Flame of Blood, Blaze My Path" },
      { name: "A Secret Vow" },
      { name: "A Trail of Bygone Blood" },
      { name: "Ninja Record: Sound Hunt" },
      { name: "Flames Afar" }
    ],
    relics: {
      sets: [
        { name: "Longevous Disciple", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Inert Salsotto" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT DMG", "CRIT Rate"],
      feet: ["Speed", "HP%"],
      sphere: ["Wind DMG", "HP%"],
      rope: ["HP%"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT Rate = CRIT DMG > HP%"],
    },
  },
  boothill: {
    characterId: "boothill",
    lightCones: [
      { name: "Sailing Towards A Second Life" },
      { name: "Shadowed By Night" },
      { name: "Adversarial" },
      { name: "River Flows in Spring" },
      { name: "Swordplay" },
      { name: "Cruising in the Stellar Sea" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" }
      ],
      planar: [
        { name: "Talia: Kingdom of Banditry" },
        { name: "Forge of the Kalpagni Lantern" }
      ],
    },
    stats: {
      body: ["Anything", "CRIT Rate"],
      feet: ["Speed"],
      sphere: ["Anything", "Physical DMG"],
      rope: ["Break Effect"],
      subStats: ["SPD (Until breakpoint OR if you got nothing else to stack) >= Break Effect"],
    },
  },
  bronya: {
    characterId: "bronya",
    lightCones: [
      { name: "A Grounded Ascent" },
      { name: "But the Battle Isn't Over" },
      { name: "Past and Future" },
      { name: "Dance! Dance! Dance!" }
    ],
    relics: {
      sets: [
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (Until breakpoint) > CRIT DMG > HP = DEF > Effect RES% (30% If Keel)"],
    },
  },
  castorice: {
    characterId: "castorice",
    lightCones: [
      { name: "Make Farewells More Beautiful" },
      { name: "The Flower Remembers" },
      { name: "Sweat Now, Cry Less" },
      { name: "Time Waits for No One" },
      { name: "The Story's Next Page" },
      { name: "Post-Op Conversation" },
      { name: "Victory In a Blink" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Arcadia of Woven Dreams" }
      ],
    },
    stats: {
      body: ["CRIT DMG", "HP%"],
      feet: ["HP%"],
      sphere: ["HP%", "Quantum DMG"],
      rope: ["HP%"],
      subStats: ["CRIT DMG = CRIT Rate > HP% > SPD (Less than 95)"],
    },
  },
  cerydra: {
    characterId: "cerydra",
    lightCones: [
      { name: "Epoch Etched in Golden Blood" },
      { name: "Flowing Nightglow" },
      { name: "The Forever Victual" },
      { name: "Earthly Escapade" },
      { name: "Planetary Rendezvous" }
    ],
    relics: {
      sets: [
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" }
      ],
    },
    stats: {
      body: ["ATK%"],
      feet: ["Speed", "ATK%"],
      sphere: ["ATK%"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["SPD (Until Desired Speed Build) > ATK% > ATK > Defensive Stats"],
    },
  },
  cipher: {
    characterId: "cipher",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Resolution Shines As Pearls of Sweat" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Genius of Brilliant Stars", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Fleet of the Ageless" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "CRIT DMG"],
      feet: ["Speed"],
      sphere: ["Quantum DMG", "ATK%"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["[SPD (Until Desired Breakpoint) > EHR (If Desired) > CRIT RATE = CRIT DMG > ATK%] or [SPD (Until Desired Breakpoint) > EHR (If Desired) > HP% >= DEF%]"],
    },
  },
  clara: {
    characterId: "clara",
    lightCones: [
      { name: "Thus Burns the Dawn" },
      { name: "Dance at Sunset" },
      { name: "Something Irreplaceable" },
      { name: "The Unreachable Side" },
      { name: "On the Fall of an Aeon" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" }
      ],
      planar: [
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Inert Salsotto" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint if desired) = CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  danheng: {
    characterId: "danheng",
    lightCones: [
      { name: "In the Night" },
      { name: "Swordplay" },
      { name: "Only Silence Remains" },
      { name: "Cruising in the Stellar Sea" },
      { name: "Sleep Like the Dead" },
      { name: "Return to Darkness" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Wind DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) = CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  danheng_imaginary: {
    characterId: "danheng_imaginary",
    lightCones: [
      { name: "Thus Burns the Dawn" },
      { name: "Brighter Than the Sun" },
      { name: "On the Fall of an Aeon" },
      { name: "Something Irreplaceable" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Wastelander of Banditry Desert", pieces: "4pc" },
        { name: "Musketeer of Wild Wheat", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Tengoku@Livestream" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["CRIT DMG", "CRIT Rate"],
      feet: ["ATK%", "Speed"],
      sphere: ["Imaginary DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  danheng_terrae: {
    characterId: "danheng_terrae",
    lightCones: [
      { name: "Though Worlds Apart" },
      { name: "Journey, Forever Peaceful" },
      { name: "Thus Burns the Dawn" },
      { name: "Day One of My New Life" },
      { name: "Trend of the Universal Market" }
    ],
    relics: {
      sets: [
        { name: "Self-Enshrouded Recluse", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "City of Converging Stars" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" }
      ],
    },
    stats: {
      body: ["ATK%"],
      feet: ["Speed", "ATK%"],
      sphere: ["ATK%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (until desired breakpoint) > ATK% > ATK > Effect RES"],
    },
  },
  dr_ratio: {
    characterId: "dr_ratio",
    lightCones: [
      { name: "Baptism of Pure Thought" },
      { name: "Worrisome, Blissful" },
      { name: "Only Silence Remains" },
      { name: "Cruising in the Stellar Sea" },
      { name: "In the Night" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Wastelander of Banditry Desert", pieces: "4pc" }
      ],
      planar: [
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Imaginary DMG", "ATK%"],
      rope: ["ATK%", "ATK"],
      subStats: ["SPD (breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  elysia: {
    characterId: "elysia",
    lightCones: [
      { name: "This Love, Forever" },
      { name: "Long May Rainbows Adorn the Sky" },
      { name: "Memory's Curtain Never Falls" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "World-Remaking Deliverer", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Amphoreus, The Eternal Land" }
      ],
    },
    stats: {
      body: ["HP%", "CRIT DMG"],
      feet: ["Speed"],
      sphere: ["HP%", "Ice DMG"],
      rope: ["HP%"],
      subStats: ["SPD (until 180/200) > Crit Rate > Crit DMG > HP%"],
    },
  },
  evernight: {
    characterId: "evernight",
    lightCones: [
      { name: "To Evernight's Stars" },
      { name: "Make Farewells More Beautiful" },
      { name: "Sweat Now, Cry Less" },
      { name: "The Flower Remembers" },
      { name: "The Story's Next Page" },
      { name: "Time Waits for No One" },
      { name: "Memory's Curtain Never Falls" }
    ],
    relics: {
      sets: [
        { name: "World-Remaking Deliverer", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Arcadia of Woven Dreams" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["HP%", "Speed"],
      sphere: ["Ice DMG", "HP%"],
      rope: ["HP%", "Energy Regen Rate"],
      subStats: ["CRIT Rate (Until cap) = CRIT DMG > HP% > SPD"],
    },
  },
  feixiao: {
    characterId: "feixiao",
    lightCones: [
      { name: "I Venture Forth to Hunt" },
      { name: "Baptism of Pure Thought" },
      { name: "Worrisome, Blissful" },
      { name: "Swordplay" },
      { name: "Cruising in the Stellar Sea" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Musketeer of Wild Wheat", pieces: "4pc" },
        { name: "Prisoner in Deep Confinement", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" }
      ],
      planar: [
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Wind DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (Until Desired Breakpoint) = CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  firefly: {
    characterId: "firefly",
    lightCones: [
      { name: "Whereabouts Should Dreams Rest" },
      { name: "Thus Burns the Dawn" },
      { name: "On the Fall of an Aeon" },
      { name: "Indelible Promise" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Forge of the Kalpagni Lantern" },
        { name: "Talia: Kingdom of Banditry" }
      ],
    },
    stats: {
      body: ["ATK%"],
      feet: ["Speed"],
      sphere: ["ATK%"],
      rope: ["Break Effect"],
      subStats: ["SPD (Until Breakpoint) > Break Effect% > ATK%"],
    },
  },
  fugue: {
    characterId: "fugue",
    lightCones: [
      { name: "Long Road Leads Home" },
      { name: "Lies Dance on the Breeze" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Solitary Healing" },
      { name: "Before the Tutorial Mission Starts" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Forge of the Kalpagni Lantern" },
        { name: "Talia: Kingdom of Banditry" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Break Effect", "Energy Regen Rate"],
      subStats: ["Effect Hit Rate (Until 67%) > Break Effect (Until 220% or 250% For Iron Cavalry) > SPD > HP% = DEF%"],
    },
  },
  fuxuan: {
    characterId: "fuxuan",
    lightCones: [
      { name: "She Already Shut Her Eyes" },
      { name: "Moment of Victory" },
      { name: "Texture of Memories" },
      { name: "Day One of My New Life" },
      { name: "Landau's Choice" },
      { name: "Trend of the Universal Market" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "DEF%"],
      feet: ["Speed", "HP%"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) = HP% >= DEF% > EFF RES%"],
    },
  },
  gallagher: {
    characterId: "gallagher",
    lightCones: [
      { name: "Scent Alone Stays True" },
      { name: "Quid Pro Quo" },
      { name: "Post-Op Conversation" },
      { name: "What Is Real?" },
      { name: "Unto Tomorrow's Morrow" },
      { name: "Shared Feeling" },
      { name: "Warmth Shortens Cold Nights" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Forge of the Kalpagni Lantern" },
        { name: "Talia: Kingdom of Banditry" }
      ],
    },
    stats: {
      body: ["Outgoing Healing"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (as much as possible) > Break Effect % (up to 150%) > Effect RES% > HP% = DEF%"],
    },
  },
  gepard: {
    characterId: "gepard",
    lightCones: [
      { name: "Journey, Forever Peaceful" },
      { name: "Moment of Victory" },
      { name: "Day One of My New Life" },
      { name: "Landau's Choice" },
      { name: "Texture of Memories" },
      { name: "Trend of the Universal Market" }
    ],
    relics: {
      sets: [
        { name: "Self-Enshrouded Recluse", pieces: "4pc" },
        { name: "Knight of Purity Palace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["DEF%"],
      feet: ["Speed"],
      sphere: ["DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) = DEF% > HP% = EFF RES%"],
    },
  },
  guinaifen: {
    characterId: "guinaifen",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Those Many Springs" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Eyes of the Prey" },
      { name: "Solitary Healing" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["ATK%", "Effect HIT Rate"],
      feet: ["Speed"],
      sphere: ["Fire DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["EHR (67%) > SPD (breakpoint) > ATK% > HP% = DEF% = Break Effect %"],
    },
  },
  hanya: {
    characterId: "hanya",
    lightCones: [
      { name: "Dance! Dance! Dance!" },
      { name: "Meshing Cogs" },
      { name: "But the Battle Isn't Over" },
      { name: "Planetary Rendezvous" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "DEF%"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD > HP = DEF > Break Effect = EFF RES% (30% If using Broken Keel)"],
    },
  },
  herta: {
    characterId: "herta",
    lightCones: [
      { name: "Before Dawn" },
      { name: "Night on the Milky Way" },
      { name: "For Pure Fiction only." },
      { name: "Geniuses' Repose" },
      { name: "Eternal Calculus" },
      { name: "Today Is Another Peaceful Day" },
      { name: "The Seriousness of Breakfast" },
      { name: "The Birth of the Self" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Hunter of Glacial Forest", pieces: "4pc" }
      ],
      planar: [
        { name: "Sigonia, the Unclaimed Desolation" },
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Inert Salsotto" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Ice DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) = CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  himeko: {
    characterId: "himeko",
    lightCones: [
      { name: "Before Dawn" },
      { name: "Best overall option for Himeko." },
      { name: "Night on the Milky Way" },
      { name: "Pure Fiction only." },
      { name: "Geniuses' Repose" },
      { name: "Eternal Calculus" },
      { name: "Today Is Another Peaceful Day" },
      { name: "The Day The Cosmos Fell" },
      { name: "The Seriousness of Breakfast" },
      { name: "After the Charmony Fall" }
    ],
    relics: {
      sets: [
        { name: "Firesmith of Lava-Forging", pieces: "4pc" }
      ],
      planar: [
        { name: "Sigonia, the Unclaimed Desolation" },
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Fire DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) = CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  hook: {
    characterId: "hook",
    lightCones: [
      { name: "On the Fall of an Aeon" },
      { name: "Woof! Walk Time!" },
      { name: "A Secret Vow" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Firesmith of Lava-Forging", pieces: "4pc" }
      ],
      planar: [
        { name: "Firmament Frontline: Glamoth" },
        { name: "Rutilant Arena" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Fire DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  huohuo: {
    characterId: "huohuo",
    lightCones: [
      { name: "Night of Fright" },
      { name: "Post-Op Conversation" },
      { name: "Shared Feeling" },
      { name: "Unto Tomorrow's Morrow" },
      { name: "Quid Pro Quo" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Passerby of Wandering Cloud", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["Outgoing Healing", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) > HP% > EFF RES% = DEF%"],
    },
  },
  hyacine: {
    characterId: "hyacine",
    lightCones: [
      { name: "Long May Rainbows Adorn the Sky" },
      { name: "Memory's Curtain Never Falls" },
      { name: "The Story's Next Page" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Giant Tree of Rapt Brooding" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Broken Keel" }
      ],
    },
    stats: {
      body: ["Outgoing Healing", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD to 200 or more > HP% > CRIT DMG >= Effect RES"],
    },
  },
  hysilens: {
    characterId: "hysilens",
    lightCones: [
      { name: "Why Does the Ocean Sing" },
      { name: "Reforged Remembrance" },
      { name: "Those Many Springs" },
      { name: "Patience Is All You Need" },
      { name: "Eyes of the Prey" },
      { name: "Good Night and Sleep Well" },
      { name: "It's Showtime" }
    ],
    relics: {
      sets: [
        { name: "Prisoner in Deep Confinement", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Revelry by the Sea" },
        { name: "Pan-Cosmic Commercial Enterprise" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "ATK%"],
      feet: ["ATK%", "Speed"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%", "Energy Regen Rate"],
      subStats: ["Effect Hit Rate to 120% = SPD (Until Desired Breakpoint) > ATK%"],
    },
  },
  jade: {
    characterId: "jade",
    lightCones: [
      { name: "Yet Hope Is Priceless" },
      { name: "Before Dawn" },
      { name: "Today Is Another Peaceful Day" },
      { name: "Night on the Milky Way" },
      { name: "Geniuses' Repose" },
      { name: "Eternal Calculus" },
      { name: "The Seriousness of Breakfast" },
      { name: "The Birth of the Self" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Sigonia, the Unclaimed Desolation" },
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%"],
      sphere: ["Quantum DMG"],
      rope: ["ATK%"],
      subStats: ["CRIT RATE >= CRIT DMG > ATK% > SPD"],
    },
  },
  jiaoqiu: {
    characterId: "jiaoqiu",
    lightCones: [
      { name: "Those Many Springs" },
      { name: "Lies Dance on the Breeze" },
      { name: "Eyes of the Prey" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Before the Tutorial Mission Starts" },
      { name: "Solitary Healing" }
    ],
    relics: {
      sets: [
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate"],
      feet: ["Speed"],
      sphere: ["Fire DMG"],
      rope: ["Energy Regen Rate"],
      subStats: ["EHR (Until 140%) > SPD > ATK%"],
    },
  },
  jingliu: {
    characterId: "jingliu",
    lightCones: [
      { name: "Flame of Blood, Blaze My Path" },
      { name: "I Shall Be My Own Sword" },
      { name: "A Trail of Bygone Blood" },
      { name: "A Secret Vow" },
      { name: "Ninja Record: Sound Hunt" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" },
        { name: "Hunter of Glacial Forest", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Rutilant Arena" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["HP%", "CRIT DMG"],
      feet: ["Speed", "HP%"],
      sphere: ["Ice DMG", "HP%"],
      rope: ["HP%"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT Rate (Until 100% Buffed) > HP% > CRIT DMG"],
    },
  },
  jingyuan: {
    characterId: "jingyuan",
    lightCones: [
      { name: "Before Dawn" },
      { name: "A Dream Scented in Wheat" },
      { name: "Today Is Another Peaceful Day" },
      { name: "Geniuses' Repose" },
      { name: "The Seriousness of Breakfast" }
    ],
    relics: {
      sets: [
        { name: "Band of Sizzling Thunder", pieces: "4pc" }
      ],
      planar: [
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["Speed (Until breakpoint to make -1 Speed setup work) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  kafka: {
    characterId: "kafka",
    lightCones: [
      { name: "Before the Tutorial Mission Starts" },
      { name: "Patience Is All You Need" },
      { name: "Lies Dance on the Breeze" },
      { name: "Those Many Springs" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Good Night and Sleep Well" },
      { name: "Eyes of the Prey" }
    ],
    relics: {
      sets: [
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "ATK%"],
      feet: ["Speed"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["Effect Hit Rate (Until 75%) > SPD > ATK%"],
    },
  },
  kevin: {
    characterId: "kevin",
    lightCones: [
      { name: "Thus Burns the Dawn" },
      { name: "On the Fall of an Aeon" },
      { name: "Something Irreplaceable" },
      { name: "A Trail of Bygone Blood" }
    ],
    relics: {
      sets: [
        { name: "Wavestrider Captain", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" }
      ],
      planar: [
        { name: "Arcadia of Woven Dreams" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (if needed) > CRIT RATE > CRIT DMG > ATK%"],
    },
  },
  lingsha: {
    characterId: "lingsha",
    lightCones: [
      { name: "Scent Alone Stays True" },
      { name: "Quid Pro Quo" },
      { name: "Post-Op Conversation" },
      { name: "What Is Real?" },
      { name: "Unto Tomorrow's Morrow" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Forge of the Kalpagni Lantern" },
        { name: "Talia: Kingdom of Banditry" }
      ],
    },
    stats: {
      body: ["Outgoing Healing"],
      feet: ["Speed"],
      sphere: ["ATK%", "HP%"],
      rope: ["Energy Regen Rate", "Break Effect"],
      subStats: ["SPD (until the desired breakpoint) > BREAK% >= ATK%"],
    },
  },
  luka: {
    characterId: "luka",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Patience Is All You Need" },
      { name: "Good Night and Sleep Well" },
      { name: "Eyes of the Prey" },
      { name: "Resolution Shines As Pearls of Sweat" }
    ],
    relics: {
      sets: [
        { name: "Prisoner in Deep Confinement", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Revelry by the Sea" },
        { name: "Talia: Kingdom of Banditry" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Pan-Cosmic Commercial Enterprise" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "ATK%"],
      feet: ["Speed"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["Break Effect", "ATK%"],
      subStats: ["SPD (breakpoint) = EHR (until cap) > Break Effect >= ATK%"],
    },
  },
  luocha: {
    characterId: "luocha",
    lightCones: [
      { name: "Echoes of the Coffin" },
      { name: "Perfect Timing" },
      { name: "Quid Pro Quo" },
      { name: "Unto Tomorrow's Morrow" },
      { name: "Provides allies with some DMG boost." },
      { name: "Shared Feeling" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Musketeer of Wild Wheat", pieces: "4pc" },
        { name: "Passerby of Wandering Cloud", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["Outgoing Healing"],
      feet: ["Speed"],
      sphere: ["ATK%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) > ATK% > DEF% = HP% > EFF RES%"],
    },
  },
  lynx: {
    characterId: "lynx",
    lightCones: [
      { name: "Night of Fright" },
      { name: "Time Waits for No One" },
      { name: "Post-Op Conversation" },
      { name: "Perfect Timing" },
      { name: "Quid Pro Quo" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Passerby of Wandering Cloud", pieces: "4pc" }
      ],
      planar: [
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["Outgoing Healing", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) > HP% > Effect RES > DEF%"],
    },
  },
  march7_imag: {
    characterId: "march7_imag",
    lightCones: [
      { name: "In the Night" },
      { name: "Swordplay" },
      { name: "Worrisome, Blissful" },
      { name: "Cruising in the Stellar Sea" },
      { name: "Sailing Towards A Second Life" },
      { name: "Premium Super Break option" },
      { name: "Shadowed By Night" },
      { name: "Gacha option for Super Break team." }
    ],
    relics: {
      sets: [
        { name: "Musketeer of Wild Wheat", pieces: "4pc" },
        { name: "Wastelander of Banditry Desert", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Firmament Frontline: Glamoth" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Imaginary DMG", "ATK%"],
      rope: ["ATK%", "ATK"],
      subStats: ["SPD (Until breakpoint) > CRIT RATE% = CRIT DMG% > ATK%"],
    },
  },
  march7th: {
    characterId: "march7th",
    lightCones: [
      { name: "Inherently Unjust Destiny" },
      { name: "Journey, Forever Peaceful" },
      { name: "Day One of My New Life" },
      { name: "Texture of Memories" },
      { name: "Moment of Victory" },
      { name: "Landau's Choice" },
      { name: "Trend of the Universal Market" }
    ],
    relics: {
      sets: [
        { name: "Self-Enshrouded Recluse", pieces: "4pc" },
        { name: "Knight of Purity Palace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Belobog of the Architects" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "DEF%"],
      feet: ["Speed"],
      sphere: ["DEF%"],
      rope: ["Energy Regen Rate", "DEF%"],
      subStats: ["Effect Hit Rate (Until 64% OR skip if no Freeze build) = SPD (Breakpoint) > DEF% > HP% = Effect RES"],
    },
  },
  misha: {
    characterId: "misha",
    lightCones: [
      { name: "Thus Burns the Dawn" },
      { name: "On the Fall of an Aeon" },
      { name: "A Secret Vow" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Hunter of Glacial Forest", pieces: "4pc" }
      ],
      planar: [
        { name: "Firmament Frontline: Glamoth" },
        { name: "Rutilant Arena" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Ice DMG", "ATK%"],
      rope: ["ATK%", "ATK"],
      subStats: ["SPD (Breakpoint) > CRIT Rate = CRIT DMG > ATK%"],
    },
  },
  moze: {
    characterId: "moze",
    lightCones: [
      { name: "Worrisome, Blissful" },
      { name: "Baptism of Pure Thought" },
      { name: "Swordplay" },
      { name: "Cruising in the Stellar Sea" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%"],
      sphere: ["Lightning DMG"],
      rope: ["ATK%"],
      subStats: ["SPD (only if needed for your team) = CRIT RATE >= CRIT DMG > ATK%"],
    },
  },
  mydei: {
    characterId: "mydei",
    lightCones: [
      { name: "Flame of Blood, Blaze My Path" },
      { name: "The Unreachable Side" },
      { name: "A Secret Vow" },
      { name: "Ninja Record: Sound Hunt" },
      { name: "Flames Afar" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["HP%", "CRIT DMG"],
      feet: ["Speed", "HP%"],
      sphere: ["HP%", "Imaginary DMG"],
      rope: ["HP%"],
      subStats: ["HP% (Best until 8k then equal) >= CRIT Rate/CRIT DMG"],
    },
  },
  natasha: {
    characterId: "natasha",
    lightCones: [
      { name: "Night of Fright" },
      { name: "Time Waits for No One" },
      { name: "Post-Op Conversation" },
      { name: "Perfect Timing" },
      { name: "Quid Pro Quo" },
      { name: "Multiplication" }
    ],
    relics: {
      sets: [
        { name: "Warrior Goddess of Sun and Thunder", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Passerby of Wandering Cloud", pieces: "4pc" }
      ],
      planar: [
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["Outgoing Healing", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (breakpoint) > HP% > Effect RES = DEF%"],
    },
  },
  pela: {
    characterId: "pela",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Before the Tutorial Mission Starts" }
    ],
    relics: {
      sets: [
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "HP%"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["Effect Hit Rate (Until 67%) = SPD (Until Breakpoint) > HP = DEF > Effect RES (30% with Broken Keel)"],
    },
  },
  qingque: {
    characterId: "qingque",
    lightCones: [
      { name: "Yet Hope Is Priceless" },
      { name: "Night on the Milky Way" },
      { name: "Geniuses' Repose" },
      { name: "Eternal Calculus" },
      { name: "Before Dawn" },
      { name: "Today Is Another Peaceful Day" },
      { name: "The Seriousness of Breakfast" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Tengoku@Livestream" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["Quantum DMG"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > CRIT Rate = CRIT DMG > ATK%"],
    },
  },
  raiden: {
    characterId: "raiden",
    lightCones: [
      { name: "Along the Passing Shore" },
      { name: "Incessant Rain" },
      { name: "Good Night and Sleep Well" },
      { name: "Boundless Choreo" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Band of Sizzling Thunder", pieces: "4pc" }
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Inert Salsotto" },
        { name: "Space Sealing Station" },
        { name: "Firmament Frontline: Glamoth" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%", "Speed"],
      sphere: ["ATK%", "Lightning DMG"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint if you play 134+ Acheron; with Sparkle, fully ignore Speed) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  rappa: {
    characterId: "rappa",
    lightCones: [
      { name: "Ninjutsu Inscription: Dazzling Evilbreaker" },
      { name: "After the Charmony Fall" },
      { name: "Eternal Calculus" },
      { name: "Make the World Clamor" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" }
      ],
      planar: [
        { name: "Talia: Kingdom of Banditry" },
        { name: "Forge of the Kalpagni Lantern" }
      ],
    },
    stats: {
      body: ["ATK%"],
      feet: ["Speed"],
      sphere: ["ATK%"],
      rope: ["Break Effect", "Energy Regen Rate"],
      subStats: ["SPD (Until Desired Breakpoint) > Break Effect > ATK%"],
    },
  },
  robin: {
    characterId: "robin",
    lightCones: [
      { name: "Flowing Nightglow" },
      { name: "But the Battle Isn't Over" },
      { name: "For Tomorrow's Journey" },
      { name: "Meshing Cogs" },
      { name: "Poised to Bloom" }
    ],
    relics: {
      sets: [
        { name: "Musketeer of Wild Wheat", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["ATK%"],
      feet: ["ATK%"],
      sphere: ["ATK%", "Physical DMG"],
      rope: ["Energy Regen Rate"],
      subStats: ["ATK% >= SPD > HP% = DEF%"],
    },
  },
  ruanmei: {
    characterId: "ruanmei",
    lightCones: [
      { name: "Past Self in Mirror" },
      { name: "In Pursuit of the Wind" },
      { name: "Memories of the Past" },
      { name: "Meshing Cogs" },
      { name: "Dance! Dance! Dance!" }
    ],
    relics: {
      sets: [
        { name: "Watchmaker, Master of Dream Machinations", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "DEF%"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate", "Break Effect"],
      subStats: ["Break Effect (Until 180%) > SPD (Until Breakpoint) > HP% = DEF% > Effect RES (30% if using Broken Keel)"],
    },
  },
  saber: {
    characterId: "saber",
    lightCones: [
      { name: "A Thankless Coronation" },
      { name: "On the Fall of an Aeon" },
      { name: "A Trail of Bygone Blood" },
      { name: "A Secret Vow" }
    ],
    relics: {
      sets: [
        { name: "Wavestrider Captain", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Inert Salsotto" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" },
        { name: "Rutilant Arena" }
      ],
    },
    stats: {
      body: ["CRIT DMG", "CRIT Rate"],
      feet: ["Speed", "ATK%"],
      sphere: ["Wind DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT Rate = CRIT DMG > ATK%"],
    },
  },
  sampo: {
    characterId: "sampo",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Good Night and Sleep Well" },
      { name: "Eyes of the Prey" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Support Sampo" }
    ],
    relics: {
      sets: [
        { name: "Prisoner in Deep Confinement", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" }
      ],
      planar: [
        { name: "Revelry by the Sea" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Pan-Cosmic Commercial Enterprise" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "ATK%"],
      feet: ["Speed", "ATK%"],
      sphere: ["Wind DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) = EHR (Until recommended) > ATK% > Break Effect"],
    },
  },
  seele: {
    characterId: "seele",
    lightCones: [
      { name: "The Hell Where Ideals Burn" },
      { name: "In the Night" },
      { name: "Swordplay" },
      { name: "Only Silence Remains" },
      { name: "Cruising in the Stellar Sea" }
    ],
    relics: {
      sets: [
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%"],
      sphere: ["Quantum DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  serval: {
    characterId: "serval",
    lightCones: [
      { name: "Night on the Milky Way" },
      { name: "For Pure Fiction only." },
      { name: "Eternal Calculus" },
      { name: "Geniuses' Repose" },
      { name: "Before Dawn" },
      { name: "Today Is Another Peaceful Day" },
      { name: "The Seriousness of Breakfast" },
      { name: "Passkey" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Band of Sizzling Thunder", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" },
        { name: "Rutilant Arena" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Lightning DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  silverwolf: {
    characterId: "silverwolf",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Holiday Thermae Escapade" },
      { name: "Incessant Rain" },
      { name: "Before the Tutorial Mission Starts" },
      { name: "Along the Passing Shore" },
      { name: "Good Night and Sleep Well" },
      { name: "Boundless Choreo" }
    ],
    relics: {
      sets: [
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Sprightly Vonwacq" }
      ],
    },
    stats: {
      body: ["Effect HIT Rate", "CRIT Rate"],
      feet: ["Speed"],
      sphere: ["Quantum DMG", "ATK%"],
      rope: ["Energy Regen Rate"],
      subStats: ["Effect Hit Rate (Until 50-67%) > SPD > CRIT = CRIT DMG > ATK%"],
    },
  },
  sparkle: {
    characterId: "sparkle",
    lightCones: [
      { name: "A Grounded Ascent" },
      { name: "Earthly Escapade" },
      { name: "Dance! Dance! Dance!" },
      { name: "But the Battle Isn't Over" }
    ],
    relics: {
      sets: [
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" },
        { name: "Eagle of Twilight Line", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (Until breakpoint OR as much as possible) > CRIT DMG% > HP = DEF = EFF RES% (30% if using Broken Keel)"],
    },
  },
  sparxie: {
    characterId: "sparxie",
    lightCones: [
      { name: "Dazzled by a Flowery World" },
      { name: "Today's Good Luck" },
      { name: "Mushy Shroomy's Adventures" }
    ],
    relics: {
      sets: [
        { name: "Ever-Glorious Magical Girl", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Tengoku@Livestream" },
        { name: "Izumo Gensei and Takama Divine Realm" }
      ],
    },
    stats: {
      body: ["CRIT Rate"],
      feet: ["ATK%", "Speed"],
      sphere: ["ATK%"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["ATK until 3600 (after team buffs) > CRIT Rate >= CRIT DMG"],
    },
  },
  sunday: {
    characterId: "sunday",
    lightCones: [
      { name: "A Grounded Ascent" },
      { name: "But the Battle Isn't Over" },
      { name: "Past and Future" },
      { name: "Dance! Dance! Dance!" }
    ],
    relics: {
      sets: [
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Fleet of the Ageless" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (Until desired speed build) > CRIT DMG > EFF RES% > DEF% = HP%"],
    },
  },
  sushang: {
    characterId: "sushang",
    lightCones: [
      { name: "Sailing Towards A Second Life" },
      { name: "Sushang's best in slot Light Cone." },
      { name: "Swordplay" },
      { name: "Cruising in the Stellar Sea" },
      { name: "Only Silence Remains" }
    ],
    relics: {
      sets: [
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Talia: Kingdom of Banditry" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["Break Effect", "ATK%"],
      subStats: ["SPD (breakpoint) > BREAK EFFECT% (If Break Build) >= CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  the_herta: {
    characterId: "the_herta",
    lightCones: [
      { name: "Into the Unreachable Veil" },
      { name: "Today Is Another Peaceful Day" },
      { name: "Night on the Milky Way" },
      { name: "Before Dawn" },
      { name: "Geniuses' Repose" },
      { name: "Eternal Calculus" },
      { name: "The Seriousness of Breakfast" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Hunter of Glacial Forest", pieces: "4pc" }
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Ice DMG", "ATK%"],
      rope: ["ATK%", "Energy Regen Rate"],
      subStats: ["SPD (Until Desired Breakpoint) > CRIT RATE > CRIT DMG > ATK%"],
    },
  },
  thedahlia: {
    characterId: "thedahlia",
    lightCones: [
      { name: "Never Forget Her Flame" },
      { name: "Long Road Leads Home" },
      { name: "Lies Dance on the Breeze" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Holiday Thermae Escapade" },
      { name: "Before the Tutorial Mission Starts" }
    ],
    relics: {
      sets: [
        { name: "Iron Cavalry Against the Scourge", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" },
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" }
      ],
      planar: [
        { name: "Forge of the Kalpagni Lantern" },
        { name: "Talia: Kingdom of Banditry" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "Effect HIT Rate"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate", "Break Effect"],
      subStats: ["SPD > Break Effect > HP%/DEF% > Effect RES"],
    },
  },
  tingyun: {
    characterId: "tingyun",
    lightCones: [
      { name: "A Grounded Ascent" },
      { name: "Dance! Dance! Dance!" },
      { name: "Meshing Cogs" },
      { name: "But the Battle Isn't Over" },
      { name: "Planetary Rendezvous" }
    ],
    relics: {
      sets: [
        { name: "Sacerdos' Relived Ordeal", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" },
        { name: "Musketeer of Wild Wheat", pieces: "4pc" }
      ],
      planar: [
        { name: "Sprightly Vonwacq" },
        { name: "Fleet of the Ageless" },
        { name: "Broken Keel" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["ATK%", "HP%"],
      feet: ["Speed"],
      sphere: ["ATK%", "HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (Until Breakpoint) = ATK% (Until Recommended) > HP = DEF > EFF RES% (30% if using Broken Keel)"],
    },
  },
  topaz_numby: {
    characterId: "topaz_numby",
    lightCones: [
      { name: "Worrisome, Blissful" },
      { name: "Swordplay" },
      { name: "Cruising in the Stellar Sea" },
      { name: "Only Silence Remains" },
      { name: "Final Victor" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Duran, Dynasty of Running Wolves" },
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Fire DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  trail_fire: {
    characterId: "trail_fire",
    lightCones: [
      { name: "Moment of Victory" },
      { name: "Landau's Choice" },
      { name: "Texture of Memories" },
      { name: "Day One of My New Life" },
      { name: "Trend of the Universal Market" }
    ],
    relics: {
      sets: [
        { name: "Knight of Purity Palace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["DEF%"],
      feet: ["Speed", "DEF%"],
      sphere: ["DEF%", "Fire DMG"],
      rope: ["Energy Regen Rate", "DEF%"],
      subStats: ["Effect RES until 30% (if running Broken Keel) > Speed > DEF% > HP% > Effect Hit Rate"],
    },
  },
  trail_ice: {
    characterId: "trail_ice",
    lightCones: [
      { name: "This Love, Forever" },
      { name: "Long May Rainbows Adorn the Sky" },
      { name: "Fly Into a Pink Tomorrow" },
      { name: "Memory's Curtain Never Falls" },
      { name: "Victory In a Blink" },
      { name: "Shadowburn" }
    ],
    relics: {
      sets: [
        { name: "World-Remaking Deliverer", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Amphoreus, The Eternal Land" },
        { name: "Sprightly Vonwacq" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["Speed"],
      sphere: ["Ice DMG", "HP%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD > CRIT DMG > Effect RES (until 30% with Broken Keel)"],
    },
  },
  trail_imag: {
    characterId: "trail_imag",
    lightCones: [
      { name: "Past Self in Mirror" },
      { name: "Dance! Dance! Dance!" },
      { name: "In Pursuit of the Wind" },
      { name: "Memories of the Past" },
      { name: "Meshing Cogs" }
    ],
    relics: {
      sets: [
        { name: "Watchmaker, Master of Dream Machinations", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Talia: Kingdom of Banditry" },
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["HP%", "DEF%"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Break Effect", "Energy Regen Rate"],
      subStats: ["SPD = Break Effect% > HP% = DEF%"],
    },
  },
  trail_physical: {
    characterId: "trail_physical",
    lightCones: [
      { name: "On the Fall of an Aeon" },
      { name: "A Secret Vow" },
      { name: "Indelible Promise" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Champion of Streetwise Boxing", pieces: "4pc" },
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" }
      ],
      planar: [
        { name: "Rutilant Arena" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Inert Salsotto" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > BREAK EFFECT% (If Break Build) >= CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  tribbie: {
    characterId: "tribbie",
    lightCones: [
      { name: "If Time Were a Flower" },
      { name: "Dance! Dance! Dance!" },
      { name: "Memories of the Past" },
      { name: "Meshing Cogs" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" },
        { name: "Longevous Disciple", pieces: "4pc" },
        { name: "Scholar Lost in Erudition", pieces: "4pc" }
      ],
      planar: [
        { name: "Bone Collection's Serene Demesne" },
        { name: "Inert Salsotto" },
        { name: "Lushaka, the Sunken Seas" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Fleet of the Ageless" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["HP%", "Speed"],
      sphere: ["HP%", "Quantum DMG"],
      rope: ["Energy Regen Rate", "HP%"],
      subStats: ["SPD (Until desired breakpoint and only if playing Fast Tribbie) > CRIT RATE = CRIT DMG > HP%"],
    },
  },
  welt: {
    characterId: "welt",
    lightCones: [
      { name: "Lies Dance on the Breeze" },
      { name: "Along the Passing Shore" },
      { name: "Best DPS option" },
      { name: "Incessant Rain" },
      { name: "Good Night and Sleep Well" },
      { name: "In the Name of the World" },
      { name: "Holiday Thermae Escapade" },
      { name: "Support option (whale)" },
      { name: "Resolution Shines As Pearls of Sweat" },
      { name: "Support option" }
    ],
    relics: {
      sets: [
        { name: "Pioneer Diver of Dead Waters", pieces: "4pc" },
        { name: "Wastelander of Banditry Desert", pieces: "4pc" }
      ],
      planar: [
        { name: "Izumo Gensei and Takama Divine Realm" },
        { name: "Firmament Frontline: Glamoth" },
        { name: "Rutilant Arena" },
        { name: "Pan-Cosmic Commercial Enterprise" },
        { name: "Inert Salsotto" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "Effect HIT Rate"],
      feet: ["Speed"],
      sphere: ["Imaginary DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) = EHR% (Until recommended) > CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  xueyi: {
    characterId: "xueyi",
    lightCones: [
      { name: "Indelible Promise" },
      { name: "On the Fall of an Aeon" }
    ],
    relics: {
      sets: [
        { name: "Genius of Brilliant Stars", pieces: "4pc" },
        { name: "Thief of Shooting Meteor", pieces: "4pc" }
      ],
      planar: [
        { name: "Talia: Kingdom of Banditry" },
        { name: "Space Sealing Station" },
        { name: "Inert Salsotto" },
        { name: "Firmament Frontline: Glamoth" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["ATK%", "Quantum DMG"],
      rope: ["Break Effect"],
      subStats: ["SPD (breakpoint) > BREAK EFFECT% >= CRIT RATE = CRIT DMG > ATK%"],
    },
  },
  yanqing: {
    characterId: "yanqing",
    lightCones: [
      { name: "In the Night" },
      { name: "Swordplay" },
      { name: "Only Silence Remains" },
      { name: "Cruising in the Stellar Sea" },
      { name: "Sleep Like the Dead" },
      { name: "Buffs Yanqing's Crit Rate during Ultimate Downtime" }
    ],
    relics: {
      sets: [
        { name: "Scholar Lost in Erudition", pieces: "4pc" },
        { name: "Hunter of Glacial Forest", pieces: "4pc" }
      ],
      planar: [
        { name: "Firmament Frontline: Glamoth" },
        { name: "Rutilant Arena" },
        { name: "Space Sealing Station" }
      ],
    },
    stats: {
      body: ["CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Ice DMG", "ATK%"],
      rope: ["ATK%"],
      subStats: ["SPD (breakpoint) > CRIT RATE (Until soft cap) = CRIT DMG > ATK% > CRIT RATE (After soft cap)"],
    },
  },
  yaoguang: {
    characterId: "yaoguang",
    lightCones: [
      { name: "When She Decided to See" },
      { name: "Mushy Shroomy's Adventures" }
    ],
    relics: {
      sets: [
        { name: "Diviner of Distant Reach", pieces: "4pc" },
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Lushaka, the Sunken Seas" },
        { name: "Sprightly Vonwacq" },
        { name: "Broken Keel" },
        { name: "Giant Tree of Rapt Brooding" }
      ],
    },
    stats: {
      body: ["CRIT DMG", "CRIT Rate"],
      feet: ["Speed"],
      sphere: ["HP%", "DEF%"],
      rope: ["Energy Regen Rate"],
      subStats: ["SPD (as much as possible) > CRIT Rate > CRIT DMG"],
    },
  },
  yukong: {
    characterId: "yukong",
    lightCones: [
      { name: "Memories of the Past" },
      { name: "But the Battle Isn't Over" },
      { name: "Meshing Cogs" },
      { name: "Planetary Rendezvous" }
    ],
    relics: {
      sets: [
        { name: "Messenger Traversing Hackerspace", pieces: "4pc" }
      ],
      planar: [
        { name: "Broken Keel" },
        { name: "Fleet of the Ageless" },
        { name: "Penacony, Land of the Dreams" },
        { name: "Lushaka, the Sunken Seas" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["Speed", "ATK%"],
      sphere: ["Imaginary DMG", "ATK%"],
      rope: ["Energy Regen Rate", "ATK%"],
      subStats: ["SPD > HP = DEF > EFF RES% (30% if using Broken Keel)"],
    },
  },
  yunli: {
    characterId: "yunli",
    lightCones: [
      { name: "Dance at Sunset" },
      { name: "The Unreachable Side" },
      { name: "Brighter Than the Sun" },
      { name: "Something Irreplaceable" },
      { name: "On the Fall of an Aeon" },
      { name: "Under the Blue Sky" }
    ],
    relics: {
      sets: [
        { name: "Poet of Mourning Collapse", pieces: "4pc" }
      ],
      planar: [
        { name: "Inert Salsotto" },
        { name: "Duran, Dynasty of Running Wolves" }
      ],
    },
    stats: {
      body: ["CRIT Rate", "CRIT DMG"],
      feet: ["ATK%"],
      sphere: ["Physical DMG", "ATK%"],
      rope: ["ATK%", "Energy Regen Rate"],
      subStats: ["CRIT RATE = CRIT DMG > ATK%"],
    },
  },
};

// Helper function to get build for a character
export function getCharacterBuild(characterId: string): CharacterBuild | undefined {
  return CHARACTER_BUILDS[characterId];
}
