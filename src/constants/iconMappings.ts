import { ImageSourcePropType } from "react-native";

const ELEMENT_ICON_MAP: Record<string, ImageSourcePropType> = {
  Physical: require("../../images/icons/Type_Physical.webp"),
  Fire: require("../../images/icons/Type_Fire.webp"),
  Ice: require("../../images/icons/Type_Ice.webp"),
  Lightning: require("../../images/icons/Type_Lightning.webp"),
  Wind: require("../../images/icons/Type_Wind.webp"),
  Quantum: require("../../images/icons/Type_Quantum.webp"),
  Imaginary: require("../../images/icons/Type_Imaginary.webp"),
};

const PATH_ICON_MAP: Record<string, ImageSourcePropType> = {
  Destruction: require("../../images/icons/Path_Destruction.webp"),
  Hunt: require("../../images/icons/Path_The_Hunt.webp"),
  Erudition: require("../../images/icons/Path_Erudition.webp"),
  Harmony: require("../../images/icons/Path_Harmony.webp"),
  Nihility: require("../../images/icons/Path_Nihility.webp"),
  Preservation: require("../../images/icons/Path_Preservation.webp"),
  Abundance: require("../../images/icons/Path_Abundance.webp"),
  Remembrance: require("../../images/icons/Path_Remembrance.webp"),
};

export const getElementIcon = (element?: string): ImageSourcePropType | undefined => {
  if (!element) return undefined;
  return ELEMENT_ICON_MAP[element];
};

export const getPathIcon = (path?: string): ImageSourcePropType | undefined => {
  if (!path) return undefined;
  return PATH_ICON_MAP[path];
};
