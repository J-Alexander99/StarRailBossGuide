import { ImageSourcePropType } from "react-native";

const PLANAR_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  "Amphoreus, The Eternal Land": require("../../images/planar/PO_Amphoreus_C_The_Eternal_Land.webp"),
  "Arcadia of Woven Dreams": require("../../images/planar/PO_Arcadia_of_Woven_Dreams.webp"),
  "Belobog of the Architects": require("../../images/planar/PO_Belobog_of_the_Architects.png"),
  "Bone Collection's Serene Demesne": require("../../images/planar/PO_Bone_Collections_Serene_Demesne.webp"),
  "Broken Keel": require("../../images/planar/PO_Broken_Keel.webp"),
  "Duran, Dynasty of Running Wolves": require("../../images/planar/PO_Duran_C_Dynasty_of_Running_Wolves.webp"),
  "Firmament Frontline: Glamoth": require("../../images/planar/PO_Firmament_Frontline_Glamoth.png"),
  "Fleet of the Ageless": require("../../images/planar/PO_Fleet_of_the_Ageless.webp"),
  "Forge of the Kalpagni Lantern": require("../../images/planar/PO_Forge_of_the_Kalpagni_Lantern.webp"),
  "Giant Tree of Rapt Brooding": require("../../images/planar/PO_Giant_Tree_of_Rapt_Brooding.webp"),
  "Inert Salsotto": require("../../images/planar/PO_Inert_Salsotto.png"),
  "Izumo Gensei and Takama Divine Realm": require("../../images/planar/PO_Izumo_Gensei_and_Takama_Divine_Realm.webp"),
  "City of Converging Stars": require("../../images/planar/PO_City_of_Converging_Stars.webp"),
  "Lushaka, the Sunken Seas": require("../../images/planar/PO_Lushaka,_the_Sunken_Seas.png"),
  "Pan-Cosmic Commercial Enterprise": require("../../images/planar/PO_Pan_Cosmic_Commercial_Enterprise.webp"),
  "Penacony, Land of the Dreams": require("../../images/planar/PO_Penacony,_Land_of_the_Dreams.png"),
  "Revelry by the Sea": require("../../images/planar/PO_Revelry_by_the_Sea.webp"),
  "Rutilant Arena": require("../../images/planar/PO_Rutilant_Arena.png"),
  "Sigonia, the Unclaimed Desolation": require("../../images/planar/PO_Sigonia_C_the_Unclaimed_Desolation.webp"),
  "Space Sealing Station": require("../../images/planar/PO_Space_Sealing_Station.webp"),
  "Sprightly Vonwacq": require("../../images/planar/PO_Sprightly_Vonwacq.png"),
  "Talia: Kingdom of Banditry": require("../../images/planar/PO_Talia_Kingdom_of_Banditry.webp"),
  "Tengoku@Livestream": require("../../images/planar/PO_Tengoku_Livestream.webp"),
};

export function getPlanarImageWithFallback(name: string): ImageSourcePropType | null {
  return PLANAR_IMAGE_MAP[name] || null;
}
