import { ImageSourcePropType } from "react-native";

// Static character image mapping
// All images follow the pattern: /images/{characterId}.webp
// Organized alphabetically for easier maintenance

const CHARACTER_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  // A
  aglaea: require("../../images/aglaea.webp"),
  anaxa: require("../../images/anaxa.webp"),
  archer: require("../../images/archer.webp"),
  argenti: require("../../images/argenti.webp"),
  arlan: require("../../images/arlan.webp"),
  ashveil: require("../../images/ashveil.webp"),
  asta: require("../../images/asta.webp"),
  aventurine: require("../../images/aventurine.webp"),

  // B
  bailu: require("../../images/bailu.webp"),
  blackswan: require("../../images/blackswan.webp"),
  blade: require("../../images/blade.webp"),
  boothill: require("../../images/boothill.webp"),
  bronya: require("../../images/bronya.webp"),

  // C
  castorice: require("../../images/castorice.webp"),
  cerydra: require("../../images/cerydra.webp"),
  cipher: require("../../images/cipher.webp"),
  clara: require("../../images/clara.webp"),

  // D
  danheng: require("../../images/danheng.webp"),
  danheng_imaginary: require("../../images/danheng_imaginary.webp"),
  danheng_terrae: require("../../images/danheng_terrae.webp"),
  dr_ratio: require("../../images/dr_ratio.webp"),

  // E
  elysia: require("../../images/elysia.webp"),
  evernight: require("../../images/evernight.webp"),

  // F
  feixiao: require("../../images/feixiao.webp"),
  firefly: require("../../images/firefly.webp"),
  fugue: require("../../images/fugue.webp"),
  fuxuan: require("../../images/fuxuan.webp"),

  // G
  gallagher: require("../../images/gallagher.webp"),
  gepard: require("../../images/gepard.webp"),
  guinaifen: require("../../images/guinaifen.webp"),

  // H
  hanya: require("../../images/hanya.webp"),
  herta: require("../../images/herta.webp"),
  himeko: require("../../images/himeko.webp"),
  hook: require("../../images/hook.webp"),
  huohuo: require("../../images/huohuo.webp"),
  hyacine: require("../../images/hyacine.webp"),
  hysilens: require("../../images/hysilens.webp"),

  // J
  jade: require("../../images/jade.webp"),
  jiaoqiu: require("../../images/jiaoqiu.webp"),
  jingliu: require("../../images/jingliu.webp"),
  jingyuan: require("../../images/jingyuan.webp"),

  // K
  kafka: require("../../images/kafka.webp"),
  kevin: require("../../images/kevin.webp"),

  // L
  lingsha: require("../../images/lingsha.webp"),
  luka: require("../../images/luka.webp"),
  luocha: require("../../images/luocha.webp"),
  lynx: require("../../images/lynx.webp"),

  // M
  march7th: require("../../images/march7th.webp"),
  march7_imag: require("../../images/march7_imag.webp"),
  misha: require("../../images/misha.webp"),
  moze: require("../../images/moze.webp"),
  mydei: require("../../images/mydei.webp"),

  // N
  natasha: require("../../images/natasha.webp"),

  // P
  pela: require("../../images/pela.webp"),

  // Q
  qingque: require("../../images/qingque.webp"),

  // R
  raiden: require("../../images/raiden.webp"),
  rappa: require("../../images/rappa.webp"),
  robin: require("../../images/robin.webp"),
  ruanmei: require("../../images/ruanmei.webp"),

  // S
  saber: require("../../images/saber.webp"),
  sampo: require("../../images/sampo.webp"),
  seele: require("../../images/seele.webp"),
  serval: require("../../images/serval.webp"),
  silverwolf: require("../../images/silverwolf.webp"),
  sparxie: require("../../images/sparxie.webp"),
  sparkle: require("../../images/sparkle.webp"),
  sunday: require("../../images/sunday.webp"),
  sushang: require("../../images/sushang.webp"),

  // T
  the_herta: require("../../images/the_herta.webp"),
  tingyun: require("../../images/tingyun.webp"),
  topaz_numby: require("../../images/topaz_numby.webp"),
  trail_fire: require("../../images/trail_fire.webp"),
  trail_ice: require("../../images/trail_ice.webp"),
  trail_imag: require("../../images/trail_imag.webp"),
  trail_physical: require("../../images/trail_physical.webp"),
  tribbie: require("../../images/tribbie.webp"),
  thedahlia: require("../../images/the_dahlia.webp"),

  // W
  welt: require("../../images/welt.webp"),

  // X
  xueyi: require("../../images/xueyi.webp"),

  // Y
  yanqing: require("../../images/yanqing.webp"),
  yaoguang: require("../../images/yao_guang.webp"),
  yukong: require("../../images/yukong.webp"),
  yunli: require("../../images/yunli.webp"),
};

// Full character images for detail screen
const CHARACTER_DETAIL_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  aglaea: require("../../images/characters/aglaea.webp"),
  anaxa: require("../../images/characters/anaxa.webp"),
  archer: require("../../images/characters/archer.webp"),
  argenti: require("../../images/characters/argenti.webp"),
  arlan: require("../../images/characters/arlan.webp"),
  ashveil: require("../../images/characters/ashveil.webp"),
  asta: require("../../images/characters/asta.webp"),
  aventurine: require("../../images/characters/aventurine.webp"),
  bailu: require("../../images/characters/bailu.webp"),
  blackswan: require("../../images/characters/blackswan.webp"),
  blade: require("../../images/characters/blade.webp"),
  boothill: require("../../images/characters/boothill.webp"),
  bronya: require("../../images/characters/bronya.webp"),
  castorice: require("../../images/characters/castorice.webp"),
  cerydra: require("../../images/characters/cerydra.webp"),
  cipher: require("../../images/characters/cipher.webp"),
  clara: require("../../images/characters/clara.webp"),
  danheng: require("../../images/characters/danheng.webp"),
  danheng_imaginary: require("../../images/characters/danheng_imaginary.webp"),
  danheng_terrae: require("../../images/characters/danheng_terrae.webp"),
  dr_ratio: require("../../images/characters/dr_ratio.webp"),
  elysia: require("../../images/characters/elysia.webp"),
  evernight: require("../../images/characters/evernight.webp"),
  feixiao: require("../../images/characters/feixiao.webp"),
  firefly: require("../../images/characters/firefly.webp"),
  fugue: require("../../images/characters/fugue.webp"),
  fuxuan: require("../../images/characters/fuxuan.webp"),
  gallagher: require("../../images/characters/gallagher.webp"),
  gepard: require("../../images/characters/gepard.webp"),
  guinaifen: require("../../images/characters/guinaifen.webp"),
  hanya: require("../../images/characters/hanya.webp"),
  herta: require("../../images/characters/herta.webp"),
  himeko: require("../../images/characters/himiko.webp"),
  hook: require("../../images/characters/hook.webp"),
  huohuo: require("../../images/characters/huohuo.webp"),
  hyacine: require("../../images/characters/hyacine.webp"),
  hysilens: require("../../images/characters/hysilens.webp"),
  jade: require("../../images/characters/jade.webp"),
  jiaoqiu: require("../../images/characters/jiaqiu.webp"),
  jingliu: require("../../images/characters/jingliu.webp"),
  jingyuan: require("../../images/characters/jingyuan.webp"),
  kafka: require("../../images/characters/kafka.webp"),
  kevin: require("../../images/characters/kevin.webp"),
  lingsha: require("../../images/characters/lingsha.webp"),
  luka: require("../../images/characters/luka.webp"),
  luocha: require("../../images/characters/luocha.webp"),
  lynx: require("../../images/characters/lynx.webp"),
  march7th: require("../../images/characters/march7th.webp"),
  march7_imag: require("../../images/characters/march7_imag.webp"),
  misha: require("../../images/characters/misha.webp"),
  moze: require("../../images/characters/moze.webp"),
  mydei: require("../../images/characters/mydei.webp"),
  natasha: require("../../images/characters/natasha.webp"),
  pela: require("../../images/characters/pela.webp"),
  qingque: require("../../images/characters/qingque.webp"),
  raiden: require("../../images/characters/raiden.webp"),
  rappa: require("../../images/characters/rappa.webp"),
  robin: require("../../images/characters/robin.webp"),
  ruanmei: require("../../images/characters/ruanmei.webp"),
  saber: require("../../images/characters/saber.webp"),
  sampo: require("../../images/characters/sampo.webp"),
  seele: require("../../images/characters/seele.webp"),
  serval: require("../../images/characters/serval.webp"),
  silverwolf: require("../../images/characters/silverwolf.webp"),
  sparxie: require("../../images/characters/sparxie.webp"),
  sparkle: require("../../images/characters/sparkle.webp"),
  sunday: require("../../images/characters/sunday.webp"),
  sushang: require("../../images/characters/sushang.webp"),
  the_herta: require("../../images/characters/the_herta.webp"),
  tingyun: require("../../images/characters/tingyun.webp"),
  topaz_numby: require("../../images/characters/topaz_numby.webp"),
  trail_fire: require("../../images/characters/trail.webp"),
  trail_ice: require("../../images/characters/trail.webp"),
  trail_imag: require("../../images/characters/trail.webp"),
  trail_physical: require("../../images/characters/trail.webp"),
  tribbie: require("../../images/characters/tribbie.webp"),
  thedahlia: require("../../images/characters/the_dahlia.webp"),
  welt: require("../../images/characters/welt.webp"),
  xueyi: require("../../images/characters/xueyi.webp"),
  yanqing: require("../../images/characters/yanqing.webp"),
  yaoguang: require("../../images/characters/yao_guang.webp"),
  yukong: require("../../images/characters/yukong.webp"),
  yunli: require("../../images/characters/yunli.webp"),
};

export const getCharacterImage = (characterId: string): ImageSourcePropType | null => {
  return CHARACTER_IMAGE_MAP[characterId] || null;
};

export const getCharacterDetailImage = (characterId: string): ImageSourcePropType | null => {
  // Try to get the full character image first, fallback to icon if not available
  return CHARACTER_DETAIL_IMAGE_MAP[characterId] || CHARACTER_IMAGE_MAP[characterId] || null;
};