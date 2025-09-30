import { ImageSourcePropType } from "react-native";

// Static mapping for boss images to avoid dynamic require() issues
const BOSS_IMAGE_MAP: Record<string, ImageSourcePropType> = {
  Big_Enemy_Bronya: require("../../images/bosses/Big_Enemy_Bronya.webp"),
  Big_Enemy_Cocolia: require("../../images/bosses/Big_Enemy_Cocolia.webp"),
  Big_Enemy_Gepard: require("../../images/bosses/Big_Enemy_Gepard.webp"),
  Big_Enemy_Svarog: require("../../images/bosses/Big_Enemy_Svarog.webp"),
  Big_Enemy_Abundant_Ebon_Deer: require("../../images/bosses/Big_Enemy_Abundant_Ebon_Deer.webp"),
  Big_Enemy_Hoolay: require("../../images/bosses/Big_Enemy_Hoolay.webp"),
  Big_Enemy_Cirrus: require("../../images/bosses/Big_Enemy_Cirrus.webp"),
  Big_Enemy_Cloud_Knight_Yanqing: require("../../images/bosses/Big_Enemy_Cloud_Knight_Yanqing.webp"),
  Big_Enemy_Fulminating_Wolflord: require("../../images/bosses/Big_Enemy_Fulminating_Wolflord.webp"),
  Big_Enemy_Stellaron_Hunter_Kafka: require("../../images/bosses/Big_Enemy_Stellaron_Hunter_Kafka.webp"),
  Big_Enemy_Stellaron_Hunter_Sam: require("../../images/bosses/Big_Enemy_Stellaron_Hunter_Sam.webp"),
  Big_Enemy_Swarm_True_Sting: require("../../images/bosses/Big_Enemy_Swarm_True_Sting.webp"),
  Big_Enemy_Aventurine: require("../../images/bosses/Big_Enemy_Aventurine.webp"),
  Big_Enemy_The_Past_Present_Show: require("../../images/bosses/Big_Enemy_The_Past_Present_Show.webp"),
  Big_Enemy_Banacademic_Office_Staff: require("../../images/bosses/Big_Enemy_Banacademic_Office_Staff.webp"),
  Big_Enemy_Memory_Zone_Meme: require("../../images/bosses/Big_Enemy_Memory_Zone_Meme.webp"),
  Big_Enemy_Pollux: require("../../images/bosses/Big_Enemy_Pollux.webp"),
  Big_Enemy_Savage_Incarnation_Of_Strife: require("../../images/bosses/Big_Enemy_Savage_Incarnation_Of_Strife.webp"),
  Big_Enemy_The_Lance_of_Fury: require("../../images/bosses/Big_Enemy_The_Lance_of_Fury.webp"),
  Big_Enemy_Flame_Reaver: require("../../images/bosses/Big_Enemy_Flame_Reaver.webp"),
  Big_Enemy_Argenti: require("../../images/bosses/Big_Enemy_Argenti.webp"),
  Big_Enemy_First_Genius_Zandar: require("../../images/bosses/Big_Enemy_First_Genius_Zandar.webp"),
};

export const getBossImage = (imageKey?: string): ImageSourcePropType | null => {
  if (!imageKey) return null;
  return BOSS_IMAGE_MAP[imageKey] || null;
};