import { ImageSourcePropType } from "react-native";

const RELIC_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  "Band of Sizzling Thunder": require("../../images/relics/Relic_Band_of_Sizzling_Thunder.webp"),
  "Champion of Streetwise Boxing": require("../../images/relics/Relic_Champion_of_Streetwise_Boxing.png"),
  "Eagle of Twilight Line": require("../../images/relics/Relic_Eagle_of_Twilight_Line.webp"),
  "Firesmith of Lava-Forging": require("../../images/relics/Relic_Firesmith_of_Lava_Forging.png"),
  "Genius of Brilliant Stars": require("../../images/relics/Relic_Genius_of_Brilliant_Stars.webp"),
  "Hero of Triumphant Song": require("../../images/relics/Relic_Hero_of_Triumphant_Song.webp"),
  "Hunter of Glacial Forest": require("../../images/relics/Relic_Hunter_of_Glacial_Forest.png"),
  "Iron Cavalry Against the Scourge": require("../../images/relics/Relic_Iron_Cavalry_Against_the_Scourge.webp"),
  "Knight of Purity Palace": require("../../images/relics/Relic_Knight_of_Purity_Palace.webp"),
  "Longevous Disciple": require("../../images/relics/Relic_Longevous_Disciple.webp"),
  "Messenger Traversing Hackerspace": require("../../images/relics/Relic_Messenger_Traversing_Hackerspace.png"),
  "Musketeer of Wild Wheat": require("../../images/relics/Relic_Musketeer_of_Wild_Wheat.png"),
  "Passerby of Wandering Cloud": require("../../images/relics/Relic_Passerby_of_Wandering_Cloud.webp"),
  "Pioneer Diver of Dead Waters": require("../../images/relics/Relic_Pioneer_Diver_of_Dead_Waters.png"),
  "Poet of Mourning Collapse": require("../../images/relics/Relic_Poet_of_Mourning_Collapse.webp"),
  "Prisoner in Deep Confinement": require("../../images/relics/Relic_Prisoner_in_Deep_Confinement.webp"),
  "Sacerdos' Relived Ordeal": require("../../images/relics/Relic_Sacerdos_Relived_Ordeal.webp"),
  "Scholar Lost in Erudition": require("../../images/relics/Relic_Scholar_Lost_in_Erudition.webp"),
  "Self-Enshrouded Recluse": require("../../images/relics/Relic_Self-Enshrouded_Recluse.png"),
  "Thief of Shooting Meteor": require("../../images/relics/Relic_Thief_of_Shooting_Meteor.png"),
  "Warrior Goddess of Sun and Thunder": require("../../images/relics/Relic_Warrior_Goddess_of_Sun_and_Thunder.png"),
  "Wastelander of Banditry Desert": require("../../images/relics/Relic_Wastelander_of_Banditry_Desert.webp"),
  "Watchmaker, Master of Dream Machinations": require("../../images/relics/Relic_Watchmaker_C_Master_of_Dream_Machinations.webp"),
  "Wavestrider Captain": require("../../images/relics/Relic_Wavestrider_Captain.webp"),
  "World-Remaking Deliverer": require("../../images/relics/Relic_World_Remaking_Deliverer.png"),
};

export function getRelicImageWithFallback(name: string): ImageSourcePropType | null {
  return RELIC_IMAGE_MAP[name] || null;
}
