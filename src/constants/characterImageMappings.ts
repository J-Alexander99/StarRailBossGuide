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
  
  // W
  welt: require("../../images/welt.webp"),
  
  // X
  xueyi: require("../../images/xueyi.webp"),
  
  // Y
  yanqing: require("../../images/yanqing.webp"),
  yukong: require("../../images/yukong.webp"),
  yunli: require("../../images/yunli.webp"),
};

export const getCharacterImage = (characterId: string): ImageSourcePropType | null => {
  return CHARACTER_IMAGE_MAP[characterId] || null;
};