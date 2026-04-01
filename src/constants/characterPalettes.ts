// Central place for per-character accent palettes derived from artwork.
// Populate entries as needed: use character id keys (e.g., "kafka").
export type CharacterPalette = {
  accent: string;
  accentSoft?: string;
  accentBorder?: string;
  secondary?: string;
  tertiary?: string;
};

import generatedPalettes from "./characterPalettes.generated.json";

// Start from the extracted palettes, then layer curated overrides on top.
const PRECOMPUTED: Record<string, CharacterPalette> = {
  ...(generatedPalettes as Record<string, CharacterPalette>),
  aglaea: {
    accent: "#f4d79c", // gold trim
    accentSoft: "rgba(244, 215, 156, 0.22)",
    accentBorder: "rgba(244, 215, 156, 0.55)",
    secondary: "#42b6c8", // aqua swirl
    tertiary: "#1c2545", // deep navy backdrop
  },
  kafka: {
    accent: "#b44cff",
    accentSoft: "rgba(180, 76, 255, 0.2)",
    accentBorder: "rgba(180, 76, 255, 0.55)",
    secondary: "#2c1f33",
    tertiary: "#0f0b14",
  },
  blade: {
    accent: "#8b1a2b",
    accentSoft: "rgba(139, 26, 43, 0.2)",
    accentBorder: "rgba(139, 26, 43, 0.55)",
    secondary: "#1f3a3d",
    tertiary: "#0f0f16",
  },
  jingliu: {
    accent: "#6dd0ff",
    accentSoft: "rgba(109, 208, 255, 0.2)",
    accentBorder: "rgba(109, 208, 255, 0.55)",
    secondary: "#2a3b68",
    tertiary: "#0f1224",
  },
  ruanmei: {
    accent: "#70d2c6",
    accentSoft: "rgba(112, 210, 198, 0.2)",
    accentBorder: "rgba(112, 210, 198, 0.55)",
    secondary: "#c77fb2",
    tertiary: "#203042",
  },
  firefly: {
    accent: "#f6b33f",
    accentSoft: "rgba(246, 179, 63, 0.22)",
    accentBorder: "rgba(246, 179, 63, 0.55)",
    secondary: "#f27f3d",
    tertiary: "#1f120c",
  },
  sparkle: {
    accent: "#7df2ff",
    accentSoft: "rgba(125, 242, 255, 0.2)",
    accentBorder: "rgba(125, 242, 255, 0.55)",
    secondary: "#ff7fd1",
    tertiary: "#111428",
  },
  argenti: {
    accent: "#d8b347",
    accentSoft: "rgba(216, 179, 71, 0.2)",
    accentBorder: "rgba(216, 179, 71, 0.55)",
    secondary: "#832123",
    tertiary: "#1c1a24",
  },
  anaxa: {
    accent: "#2fd3e2", // aqua spellburst
    accentSoft: "rgba(47, 211, 226, 0.2)",
    accentBorder: "rgba(47, 211, 226, 0.55)",
    secondary: "#1f6b73", // deep jade cloth
    tertiary: "#123c3f", // forest shadow
  },
  archer: {
    accent: "#d8432f", // scarlet cloak
    accentSoft: "rgba(216, 67, 47, 0.2)",
    accentBorder: "rgba(216, 67, 47, 0.55)",
    secondary: "#15a4ff", // electric blades
    tertiary: "#22151a", // charred backdrop
  },
  arlan: {
    accent: "#a26bff", // violet lightning
    accentSoft: "rgba(162, 107, 255, 0.2)",
    accentBorder: "rgba(162, 107, 255, 0.55)",
    secondary: "#1b2245", // deep navy cloak
    tertiary: "#2f1f3f", // smoky violet shadow
  },
  ashveil: {
    accent: "#4de3d4", // cyan mist
    accentSoft: "rgba(77, 227, 212, 0.2)",
    accentBorder: "rgba(77, 227, 212, 0.55)",
    secondary: "#0f3e54", // dark teal smoke
    tertiary: "#3a1f4a", // amethyst shadow
  },
  asta: {
    accent: "#e255b7", // magenta trim
    accentSoft: "rgba(226, 85, 183, 0.2)",
    accentBorder: "rgba(226, 85, 183, 0.55)",
    secondary: "#1d2347", // midnight dome
    tertiary: "#3e2f66", // deep plum night sky
  },
  bronya: {
    accent: "#5ec8ff", // icy blue bursts
    accentSoft: "rgba(94, 200, 255, 0.2)",
    accentBorder: "rgba(94, 200, 255, 0.55)",
    secondary: "#1c2c64", // deep cobalt cape
    tertiary: "#6c6aa8", // soft lavender steel
  },
  clara: {
    accent: "#c4312e", // crimson coat
    accentSoft: "rgba(196, 49, 46, 0.22)",
    accentBorder: "rgba(196, 49, 46, 0.55)",
    secondary: "#3c3a54", // dusky armor violet
    tertiary: "#1d1f2e", // snow shadow navy
  },
  danheng: {
    accent: "#e25b3c", // autumn maple
    accentSoft: "rgba(226, 91, 60, 0.2)",
    accentBorder: "rgba(226, 91, 60, 0.55)",
    secondary: "#1c706f", // teal robe
    tertiary: "#1b1114", // dark ink wash
  },
  dr_ratio: {
    accent: "#29b1ff", // cyan energy
    accentSoft: "rgba(41, 177, 255, 0.2)",
    accentBorder: "rgba(41, 177, 255, 0.55)",
    secondary: "#e5c07a", // parchment gold
    tertiary: "#0c1c2c", // starfield navy
  },
  elysia: {
    accent: "#f6a7e7", // candy pink
    accentSoft: "rgba(246, 167, 231, 0.2)",
    accentBorder: "rgba(246, 167, 231, 0.55)",
    secondary: "#7ad7ff", // sky aqua
    tertiary: "#2a1b6a", // deep twilight violet
  },
  evanescia: {
    accent: "#d080ff", // orchid glow
    accentSoft: "rgba(208, 128, 255, 0.2)",
    accentBorder: "rgba(208, 128, 255, 0.55)",
    secondary: "#5f3aa3", // royal violet
    tertiary: "#1b122c", // night plum
  },
  evernight: {
    accent: "#6cd3cb", // seafoam light
    accentSoft: "rgba(108, 211, 203, 0.2)",
    accentBorder: "rgba(108, 211, 203, 0.55)",
    secondary: "#27475f", // deep teal
    tertiary: "#0f1b27", // abyss navy
  },
  feixiao: {
    accent: "#e36a2f", // amber strike
    accentSoft: "rgba(227, 106, 47, 0.2)",
    accentBorder: "rgba(227, 106, 47, 0.55)",
    secondary: "#7e2f2a", // russet armor
    tertiary: "#1b0f12", // ember shadow
  },
  fuxuan: {
    accent: "#b48cff", // amethyst glow
    accentSoft: "rgba(180, 140, 255, 0.2)",
    accentBorder: "rgba(180, 140, 255, 0.55)",
    secondary: "#3c2f5c", // deep violet silk
    tertiary: "#120f1c", // void plum
  },
  gallagher: {
    accent: "#e35b4f", // wine red
    accentSoft: "rgba(227, 91, 79, 0.2)",
    accentBorder: "rgba(227, 91, 79, 0.55)",
    secondary: "#1f3c48", // teal smoke
    tertiary: "#0f1b22", // barroom shadow
  },
  gepard: {
    accent: "#6fc7ff", // ice blue
    accentSoft: "rgba(111, 199, 255, 0.2)",
    accentBorder: "rgba(111, 199, 255, 0.55)",
    secondary: "#2a3f6b", // cobalt armor
    tertiary: "#111827", // frost night
  },
  guinaifen: {
    accent: "#ff7f4c", // fiery orange
    accentSoft: "rgba(255, 127, 76, 0.2)",
    accentBorder: "rgba(255, 127, 76, 0.55)",
    secondary: "#d12f5a", // hot magenta-red
    tertiary: "#1e0f14", // soot backdrop
  },
  hanya: {
    accent: "#7ae0c4", // mint jade
    accentSoft: "rgba(122, 224, 196, 0.2)",
    accentBorder: "rgba(122, 224, 196, 0.55)",
    secondary: "#2f3d63", // navy wraps
    tertiary: "#141b2b", // ink wash
  },
  herta: {
    accent: "#6bc2ff", // lab blue
    accentSoft: "rgba(107, 194, 255, 0.2)",
    accentBorder: "rgba(107, 194, 255, 0.55)",
    secondary: "#2a2f54", // indigo coat
    tertiary: "#0f1324", // observatory shadow
  },
  himiko: {
    accent: "#e85b47", // crimson captain
    accentSoft: "rgba(232, 91, 71, 0.2)",
    accentBorder: "rgba(232, 91, 71, 0.55)",
    secondary: "#f2b43c", // solar gold
    tertiary: "#1c0f18", // space noir
  },
  hook: {
    accent: "#d74f43", // red jacket
    accentSoft: "rgba(215, 79, 67, 0.2)",
    accentBorder: "rgba(215, 79, 67, 0.55)",
    secondary: "#5c3b2f", // brown boots
    tertiary: "#1b1311", // mine shadow
  },
  huohuo: {
    accent: "#7be0b1", // soft jade
    accentSoft: "rgba(123, 224, 177, 0.2)",
    accentBorder: "rgba(123, 224, 177, 0.55)",
    secondary: "#f3c46a", // warm gold bell
    tertiary: "#1c2a32", // dusk teal
  },
  hyacine: {
    accent: "#f4c94f", // sunflower gold
    accentSoft: "rgba(244, 201, 79, 0.2)",
    accentBorder: "rgba(244, 201, 79, 0.55)",
    secondary: "#d05b82", // rose ribbon
    tertiary: "#2a8ca3", // brook teal
  },
  hysilens: {
    accent: "#7a6fff", // violet tide
    accentSoft: "rgba(122, 111, 255, 0.2)",
    accentBorder: "rgba(122, 111, 255, 0.55)",
    secondary: "#e34f55", // coral bloom
    tertiary: "#0f1c36", // abyss navy
  },
  jade: {
    accent: "#7f59f6", // royal amethyst
    accentSoft: "rgba(127, 89, 246, 0.2)",
    accentBorder: "rgba(127, 89, 246, 0.55)",
    secondary: "#d9b25c", // gilded scales
    tertiary: "#1a142a", // midnight vault
  },
  jiaoqiu: {
    accent: "#f3662f", // ember fan
    accentSoft: "rgba(243, 102, 47, 0.2)",
    accentBorder: "rgba(243, 102, 47, 0.55)",
    secondary: "#1d6f8d", // teal robes
    tertiary: "#21161a", // smoky atelier
  },
  march7th: {
    accent: "#73d3ff", // icy cyan petals
    accentSoft: "rgba(115, 211, 255, 0.2)",
    accentBorder: "rgba(115, 211, 255, 0.55)",
    secondary: "#de8aff", // lilac sails
    tertiary: "#14213a", // night indigo
  },
  misha: {
    accent: "#62c8ff", // glacial blue
    accentSoft: "rgba(98, 200, 255, 0.2)",
    accentBorder: "rgba(98, 200, 255, 0.55)",
    secondary: "#dba86b", // brass gadgetry
    tertiary: "#2a1a38", // plum shadow
  },
  pela: {
    accent: "#81d4ff", // pastel aqua
    accentSoft: "rgba(129, 212, 255, 0.2)",
    accentBorder: "rgba(129, 212, 255, 0.55)",
    secondary: "#2c2f55", // navy uniform
    tertiary: "#e6b9d4", // soft blush cloud
  },
  the_herta: {
    accent: "#7e6bff", // amethyst frame
    accentSoft: "rgba(126, 107, 255, 0.2)",
    accentBorder: "rgba(126, 107, 255, 0.55)",
    secondary: "#c7a35f", // gilt gear
    tertiary: "#1b1028", // void plum
  },
  trail_ice: {
    accent: "#f2c14b", // golden arc
    accentSoft: "rgba(242, 193, 75, 0.2)",
    accentBorder: "rgba(242, 193, 75, 0.55)",
    secondary: "#6f8bf5", // astral violet
    tertiary: "#191f38", // starlit slate
  },
  yanqing: {
    accent: "#67cfff", // blade glow
    accentSoft: "rgba(103, 207, 255, 0.2)",
    accentBorder: "rgba(103, 207, 255, 0.55)",
    secondary: "#204c73", // navy sash
    tertiary: "#0f1c2f", // midnight deck
  },
  aventurine: {
    accent: "#d4b25a", // gilded dice
    accentSoft: "rgba(212, 178, 90, 0.2)",
    accentBorder: "rgba(212, 178, 90, 0.55)",
    secondary: "#2a7c83", // teal lapels
    tertiary: "#14181e", // midnight suit shadow
  },
  blackswan: {
    accent: "#9d7bff", // amethyst veil
    accentSoft: "rgba(157, 123, 255, 0.22)",
    accentBorder: "rgba(157, 123, 255, 0.55)",
    secondary: "#4b3a7a", // twilight plum
    tertiary: "#120e1f", // starless ink
  },
  boothill: {
    accent: "#d14632", // crimson scarf
    accentSoft: "rgba(209, 70, 50, 0.2)",
    accentBorder: "rgba(209, 70, 50, 0.55)",
    secondary: "#c29a5b", // brass trim
    tertiary: "#1a1416", // gunmetal dusk
  },
  jingyuan: {
    accent: "#e3c45a", // radiant gold
    accentSoft: "rgba(227, 196, 90, 0.2)",
    accentBorder: "rgba(227, 196, 90, 0.55)",
    secondary: "#2f6d7d", // jade armor
    tertiary: "#0f141b", // deep navy dusk
  },
  luocha: {
    accent: "#e0c27a", // haloed gold
    accentSoft: "rgba(224, 194, 122, 0.2)",
    accentBorder: "rgba(224, 194, 122, 0.55)",
    secondary: "#1f4f45", // forest teal cloak
    tertiary: "#0f1a16", // chapel shadow
  },
  lynx: {
    accent: "#6fc5ff", // polar sky
    accentSoft: "rgba(111, 197, 255, 0.2)",
    accentBorder: "rgba(111, 197, 255, 0.55)",
    secondary: "#2a6e8a", // glacial teal
    tertiary: "#0e1e2c", // tundra night
  },
  natasha: {
    accent: "#e06b6f", // rose sash
    accentSoft: "rgba(224, 107, 111, 0.2)",
    accentBorder: "rgba(224, 107, 111, 0.55)",
    secondary: "#3a6c8a", // clinic teal
    tertiary: "#141b28", // ward midnight
  },
  qingque: {
    accent: "#6fd1c4", // jade tiles
    accentSoft: "rgba(111, 209, 196, 0.2)",
    accentBorder: "rgba(111, 209, 196, 0.55)",
    secondary: "#f2c46b", // lucky gold
    tertiary: "#1c2a3a", // moonlit navy
  },
  sampo: {
    accent: "#b23d8c", // magenta flourish
    accentSoft: "rgba(178, 61, 140, 0.2)",
    accentBorder: "rgba(178, 61, 140, 0.55)",
    secondary: "#2f4c7a", // cobalt jacket
    tertiary: "#0f1324", // alley shadow
  },
  seele: {
    accent: "#6b6dff", // indigo surge
    accentSoft: "rgba(107, 109, 255, 0.2)",
    accentBorder: "rgba(107, 109, 255, 0.55)",
    secondary: "#1f2e5a", // night sapphire
    tertiary: "#0b0d18", // void midnight
  },
  bailu: {
    accent: "#6ac8ff", // sky jade glow
    accentSoft: "rgba(106, 200, 255, 0.2)",
    accentBorder: "rgba(106, 200, 255, 0.55)",
    secondary: "#5a7be0", // periwinkle fin
    tertiary: "#102039", // deep lake shadow
  },
  serval: {
    accent: "#f6c14a", // amber strike
    accentSoft: "rgba(246, 193, 74, 0.2)",
    accentBorder: "rgba(246, 193, 74, 0.55)",
    secondary: "#6e4bb0", // violet riff
    tertiary: "#1b1228", // stage noir
  },
  silverwolf: {
    accent: "#8de2ff", // neon cyan glitch
    accentSoft: "rgba(141, 226, 255, 0.2)",
    accentBorder: "rgba(141, 226, 255, 0.55)",
    secondary: "#5f4ac6", // violet UI glow
    tertiary: "#0c0f1c", // midnight terminal
  },
  topaz_numby: {
    accent: "#f59f42", // gold contract
    accentSoft: "rgba(245, 159, 66, 0.2)",
    accentBorder: "rgba(245, 159, 66, 0.55)",
    secondary: "#b8453a", // ruby trim
    tertiary: "#1a1110", // coal ledger
  },
  tingyun: {
    accent: "#5ec7b7", // jade tassel
    accentSoft: "rgba(94, 199, 183, 0.2)",
    accentBorder: "rgba(94, 199, 183, 0.55)",
    secondary: "#f5b15c", // foxfire gold
    tertiary: "#21161d", // dusk plum
  },
  welt: {
    accent: "#a7c0ff", // astral blue
    accentSoft: "rgba(167, 192, 255, 0.2)",
    accentBorder: "rgba(167, 192, 255, 0.55)",
    secondary: "#3c4f7a", // naval coat
    tertiary: "#0f141f", // cosmic slate
  },
  yukong: {
    accent: "#f2c86d", // gilded plume
    accentSoft: "rgba(242, 200, 109, 0.2)",
    accentBorder: "rgba(242, 200, 109, 0.55)",
    secondary: "#2d5564", // jade feathers
    tertiary: "#151c24", // skyship shadow
  },
  sushang: {
    accent: "#ffb45a", // apricot sash
    accentSoft: "rgba(255, 180, 90, 0.2)",
    accentBorder: "rgba(255, 180, 90, 0.55)",
    secondary: "#5c3b7f", // violet ribbon
    tertiary: "#1a111f", // night training yard
  },
  xueyi: {
    accent: "#c8463f", // crimson prayer beads
    accentSoft: "rgba(200, 70, 63, 0.2)",
    accentBorder: "rgba(200, 70, 63, 0.55)",
    secondary: "#2e3e6d", // indigo mantle
    tertiary: "#0d0f1a", // shrine midnight
  },
  robin: {
    accent: "#b6a5ff", // pastel starlight
    accentSoft: "rgba(182, 165, 255, 0.2)",
    accentBorder: "rgba(182, 165, 255, 0.55)",
    secondary: "#6c8bd8", // lilac wing
    tertiary: "#11182c", // twilight stage
  },
  danheng_terrae: {
    accent: "#c8a45d", // sanded gold
    accentSoft: "rgba(200, 164, 93, 0.2)",
    accentBorder: "rgba(200, 164, 93, 0.55)",
    secondary: "#3b6b62", // jade trim
    tertiary: "#0f1916", // earthen night
  },
  kevin: {
    accent: "#7fa0d8", // frosted steel
    accentSoft: "rgba(127, 160, 216, 0.2)",
    accentBorder: "rgba(127, 160, 216, 0.55)",
    secondary: "#3e5678", // navy pauldrons
    tertiary: "#0d111c", // dusk cobalt
  },
  luka: {
    accent: "#f0605f", // crimson wraps
    accentSoft: "rgba(240, 96, 95, 0.2)",
    accentBorder: "rgba(240, 96, 95, 0.55)",
    secondary: "#4f5f82", // slate harness
    tertiary: "#11121c", // alley night
  },
  trail_physical: {
    accent: "#d0a757", // brass gauntlet
    accentSoft: "rgba(208, 167, 87, 0.2)",
    accentBorder: "rgba(208, 167, 87, 0.55)",
    secondary: "#727b88", // muted steel
    tertiary: "#14161d", // rail dusk
  },
  yunli: {
    accent: "#f2b45f", // phoenix gold
    accentSoft: "rgba(242, 180, 95, 0.2)",
    accentBorder: "rgba(242, 180, 95, 0.55)",
    secondary: "#224f73", // deep teal sash
    tertiary: "#0f121a", // night parade
  },
  fugue: {
    accent: "#b18252", // caramel leather
    accentSoft: "rgba(177, 130, 82, 0.2)",
    accentBorder: "rgba(177, 130, 82, 0.55)",
    secondary: "#3d526c", // denim navy
    tertiary: "#14161f", // barroom dusk
  },
  lingsha: {
    accent: "#d06a53", // terracotta silk
    accentSoft: "rgba(208, 106, 83, 0.2)",
    accentBorder: "rgba(208, 106, 83, 0.55)",
    secondary: "#7c2e2d", // ember trim
    tertiary: "#0f1018", // lantern night
  },
  trail_fire: {
    accent: "#f29c54", // ember arc
    accentSoft: "rgba(242, 156, 84, 0.2)",
    accentBorder: "rgba(242, 156, 84, 0.55)",
    secondary: "#b63a2d", // flame trim
    tertiary: "#181014", // cinder shadow
  },
  moze: {
    accent: "#6f8fb6", // icebound steel
    accentSoft: "rgba(111, 143, 182, 0.2)",
    accentBorder: "rgba(111, 143, 182, 0.55)",
    secondary: "#3b3f63", // indigo cloak
    tertiary: "#0d111c", // polar night
  },
  raiden: {
    accent: "#b4484f", // crimson blade
    accentSoft: "rgba(180, 72, 79, 0.2)",
    accentBorder: "rgba(180, 72, 79, 0.55)",
    secondary: "#2c2f4f", // storm indigo
    tertiary: "#0c0d17", // thunder midnight
  },
  cerydra: {
    accent: "#8f7bd8", // lavender plume
    accentSoft: "rgba(143, 123, 216, 0.2)",
    accentBorder: "rgba(143, 123, 216, 0.55)",
    secondary: "#37527a", // deep teal fin
    tertiary: "#0e121f", // abyssal tide
  },
  saber: {
    accent: "#f6df7a", // banner gold
    accentSoft: "rgba(246, 223, 122, 0.2)",
    accentBorder: "rgba(246, 223, 122, 0.55)",
    secondary: "#1f2f70", // navy crest
    tertiary: "#0b1120", // fortress night
  },
  castorice: {
    accent: "#6db1d8", // glacier cyan
    accentSoft: "rgba(109, 177, 216, 0.2)",
    accentBorder: "rgba(109, 177, 216, 0.55)",
    secondary: "#25435b", // fjord teal
    tertiary: "#0d121a", // polar shadow
  },
  cipher: {
    accent: "#d8b778", // brass dial
    accentSoft: "rgba(216, 183, 120, 0.2)",
    accentBorder: "rgba(216, 183, 120, 0.55)",
    secondary: "#3f2d2b", // cocoa leather
    tertiary: "#0f0c12", // vault shadow
  },
  tribbie: {
    accent: "#c4b2e8", // lilac shimmer
    accentSoft: "rgba(196, 178, 232, 0.2)",
    accentBorder: "rgba(196, 178, 232, 0.55)",
    secondary: "#7a6aa8", // amethyst trim
    tertiary: "#131121", // starry waltz
  },
  danheng_imaginary: {
    accent: "#78d2c8", // jade wind
    accentSoft: "rgba(120, 210, 200, 0.2)",
    accentBorder: "rgba(120, 210, 200, 0.55)",
    secondary: "#2f4f81", // cobalt sash
    tertiary: "#0d121c", // astral dusk
  },
  march7_imag: {
    accent: "#c8d5ff", // pastel frost
    accentSoft: "rgba(200, 213, 255, 0.2)",
    accentBorder: "rgba(200, 213, 255, 0.55)",
    secondary: "#7db4f6", // sky ribbon
    tertiary: "#0f1320", // aurora night
  },
  mydei: {
    accent: "#9c6bd2", // violet crest
    accentSoft: "rgba(156, 107, 210, 0.2)",
    accentBorder: "rgba(156, 107, 210, 0.55)",
    secondary: "#3b2d5a", // plum mantle
    tertiary: "#0e0f19", // catacomb dusk
  },
  rappa: {
    accent: "#a2e062", // neon lime
    accentSoft: "rgba(162, 224, 98, 0.2)",
    accentBorder: "rgba(162, 224, 98, 0.55)",
    secondary: "#1c4a72", // cobalt visor
    tertiary: "#0a1020", // cyber midnight
  },
  sunday: {
    accent: "#d9c6bf", // ivory robe
    accentSoft: "rgba(217, 198, 191, 0.2)",
    accentBorder: "rgba(217, 198, 191, 0.55)",
    secondary: "#7b7ca8", // lilac lining
    tertiary: "#111421", // cathedral night
  },
  trail_imag: {
    accent: "#b875d9", // amethyst arc
    accentSoft: "rgba(184, 117, 217, 0.2)",
    accentBorder: "rgba(184, 117, 217, 0.55)",
    secondary: "#2b3b6a", // indigo wrap
    tertiary: "#0c0f1c", // void horizon
  },
  sparxie: {
    accent: "#34c8e8", // aqua bolt
    accentSoft: "rgba(52, 200, 232, 0.2)",
    accentBorder: "rgba(52, 200, 232, 0.55)",
    secondary: "#f2d15a", // neon gold
    tertiary: "#10121f", // arcade dusk
  },
  thedahlia: {
    accent: "#6f8ad8", // periwinkle bloom
    accentSoft: "rgba(111, 138, 216, 0.2)",
    accentBorder: "rgba(111, 138, 216, 0.55)",
    secondary: "#c99bb3", // rose petal
    tertiary: "#131226", // twilight garden
  },
  yaoguang: {
    accent: "#f4b56a", // amber lantern
    accentSoft: "rgba(244, 181, 106, 0.2)",
    accentBorder: "rgba(244, 181, 106, 0.55)",
    secondary: "#286478", // teal canopy
    tertiary: "#0e151c", // harbor night
  },
  himeko: {
    accent: "#e86a4f", // ember flare
    accentSoft: "rgba(232, 106, 79, 0.2)",
    accentBorder: "rgba(232, 106, 79, 0.55)",
    secondary: "#c6a35a", // brass trim
    tertiary: "#121018", // starlit bridge
  },
};

export const getCharacterPalette = (id: string): CharacterPalette | undefined => {
  return PRECOMPUTED[id];
};
