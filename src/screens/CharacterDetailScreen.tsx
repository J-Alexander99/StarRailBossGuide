import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StarRatingRow } from "../components/StarRatingRow";
import { getCharacterPalette } from "../constants/characterPalettes";
import {
  getCharacterDetailImage,
  getCharacterImage,
} from "../constants/characterImageMappings";
import { getElementIcon, getPathIcon } from "../constants/iconMappings";
import { getLightconeImageWithFallback } from "../constants/lightconeImageMappings";
import { getPlanarImageWithFallback } from "../constants/planarImageMappings";
import { getRelicImageWithFallback } from "../constants/relicImageMappings";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { CHARACTERS, Character } from "../data/characters";
import { getCharacterBuild } from "../data/characterBuilds";
import { resolveTeamMembers, TEAMS } from "../data/teams";

const palette = {
  background: "#130914",
  surface: "#191222",
  surfaceBorder: "rgba(255, 255, 255, 0.06)",
  surfaceShadow: "#2a1538",
  highlight: "#1c1024",
  highlightBorder: "rgba(255, 255, 255, 0.08)",
  textPrimary: "#f4ecff",
  textSecondary: "#c7b9d6",
  textMuted: "#9f8ab8",
  chipFallback: "#2a1b34",
  divider: "rgba(255, 255, 255, 0.08)",
  accent: "#ff6ce0",
  accentSoft: "rgba(255, 108, 224, 0.18)",
  accentBorder: "rgba(255, 108, 224, 0.35)",
};

type ThemePalette = {
  background: string;
  surface: string;
  surfaceBorder: string;
  surfaceShadow: string;
  highlight: string;
  highlightBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  chipFallback: string;
  divider: string;
  accent: string;
  accentSoft: string;
  accentBorder: string;
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const blendColors = (foreground: string, background: string, ratio: number) => {
  const parse = (hex: string) => {
    const n = hex.replace("#", "");
    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ];
  };

  const [fr, fg, fb] = parse(foreground);
  const [br, bg, bb] = parse(background);

  const mix = (f: number, b: number) => Math.round(f * ratio + b * (1 - ratio));

  return `#${[mix(fr, br), mix(fg, bg), mix(fb, bb)]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("")}`;
};

const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#ec4899",
  Fire: "#f97316",
  Ice: "#38bdf8",
  Lightning: "#a855f7",
  Wind: "#22d3ee",
  Quantum: "#8b5cf6",
  Imaginary: "#facc15",
  All: "#94a3b8",
};

const PATH_COLORS: Record<string, string> = {
  Destruction: "#ef4444",
  Hunt: "#22c55e",
  Erudition: "#3b82f6",
  Harmony: "#f59e0b",
  Nihility: "#8b5cf6",
  Preservation: "#0ea5e9",
  Abundance: "#10b981",
  Elation: "#14b8a6",
  Remembrance: "#6366f1",
};

const ROLE_COLORS: Record<string, string> = {
  "Sub-DPS": "#f97316",
  DPS: "#ef4444",
  Support: "#22c55e",
  Sustain: "#14b8a6",
};

const META_COLORS: Record<string, string> = {
  DOT: "#f97316",
  Crit: "#38bdf8",
  Break: "#a855f7",
  "Follow-Up": "#22d3ee",
  Summon: "#8b5cf6",
  General: "#facc15",
  Kevin: "#f87171",
  Raiden: "#60a5fa",
  Ultimate: "#fb7185",
};

export function CharacterDetailScreen({ route }: any) {
  const { characterId } = route.params;
  const character = CHARACTERS.find((c) => c.id === characterId);
  const { isCharacterOwned } = useCharacterOwnership();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const [hoveredMemberKey, setHoveredMemberKey] = useState<string | null>(null);
  const navigation = useNavigation();

  if (!character) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#fff" }}>Character not found</Text>
      </View>
    );
  }

  const characterImageSource = getCharacterDetailImage(character.id);
  const elementIcon = getElementIcon(character.element);
  const pathIcon = character.path ? getPathIcon(character.path) : undefined;
  const isOwned = isCharacterOwned(character.id);

  const paletteEntry = getCharacterPalette(character.id);
  const accentColor =
    paletteEntry?.accent ||
    ELEMENT_COLORS[character.element] ||
    (character.path ? PATH_COLORS[character.path] : undefined) ||
    palette.accent;
  const accentTone = blendColors(accentColor, "#ffffff", 0.55);
  const warmLift = blendColors(accentColor, "#f8e8c0", 0.35);
  const accentSoft = paletteEntry?.accentSoft || hexToRgba(accentTone, 0.35);
  const accentBorder = paletteEntry?.accentBorder || hexToRgba(accentTone, 0.6);
  const accentSurface = hexToRgba(accentTone, 0.16);
  const secondaryColor = paletteEntry?.secondary || accentColor;
  const softSecondary = blendColors(secondaryColor, "#ffffff", 0.42);
  const tertiaryColor = paletteEntry?.tertiary || secondaryColor;
  const softTertiary = blendColors(tertiaryColor, "#ffffff", 0.34);
  const backgroundBase = blendColors(tertiaryColor, "#0b1024", 0.72);
  const secondarySurface = hexToRgba(softSecondary, 0.22);
  const tertiarySurface = hexToRgba(softTertiary, 0.2);

  const theme = useMemo<ThemePalette>(
    () => ({
      background: backgroundBase,
      surface: secondarySurface,
      surfaceBorder: hexToRgba(softSecondary, 0.5),
      surfaceShadow: hexToRgba(warmLift, 0.5),
      highlight: hexToRgba(accentTone, 0.3),
      highlightBorder: hexToRgba(accentTone, 0.6),
      textPrimary: "#f4ecff",
      textSecondary: hexToRgba(accentTone, 0.95),
      textMuted: hexToRgba(softTertiary, 0.78),
      chipFallback: hexToRgba(softSecondary, 0.32),
      divider: hexToRgba(accentTone, 0.5),
      accent: accentTone,
      accentSoft,
      accentBorder,
    }),
    [
      accentBorder,
      accentColor,
      accentTone,
      accentSoft,
      secondaryColor,
      softSecondary,
      secondarySurface,
      tertiaryColor,
      softTertiary,
      backgroundBase,
      warmLift,
    ],
  );

  const styles = useMemo(() => createStyles(theme), [theme]);

  const sectionTone = {
    borderColor: accentBorder,
    shadowColor: accentTone,
    backgroundColor: secondarySurface,
  };

  // Sync header/tab chrome with character palette when focused
  useFocusEffect(
    useMemo(
      () => () => {
        const defaultHeader = {
          headerStyle: {
            backgroundColor: "#191222",
            borderBottomColor: "rgba(255, 255, 255, 0.06)",
            borderBottomWidth: 1,
            shadowColor: "#2a1538",
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 8,
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
            color: "#f4ecff",
          },
          headerTintColor: "#ff6ce0",
          headerBackTitleVisible: false,
        } as const;

        const defaultTabOptions = {
          tabBarStyle: {
            backgroundColor: "#191222",
            borderTopColor: "rgba(255, 255, 255, 0.06)",
            borderTopWidth: 1,
            paddingBottom: 8,
            paddingTop: 8,
            height: 60,
          },
          tabBarActiveTintColor: "#ff6ce0",
          tabBarInactiveTintColor: "#9f8ab8",
        } as const;

        const headerStyle = {
          backgroundColor: hexToRgba(accentTone, 0.24),
          borderBottomColor: accentBorder,
          borderBottomWidth: 1,
          shadowColor: accentTone,
          shadowOpacity: 0.32,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 10,
        } as const;

        const tabBarStyle = {
          backgroundColor: hexToRgba("#05070f", 0.78),
          borderTopColor: hexToRgba(accentColor, 0.3),
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        } as const;

        // Apply when focused
        navigation.setOptions({
          headerStyle,
          headerTintColor: accentTone,
          headerTitleStyle: { fontSize: 20, fontWeight: "700", color: "#f4ecff" },
          headerBackTitleVisible: false,
        });

        const tabNavigator = (navigation as any).getParent?.("rootTab")
          ?? (navigation as any).getParent?.()?.getParent?.();
        tabNavigator?.setOptions({
          tabBarStyle,
          tabBarActiveTintColor: accentTone,
          tabBarInactiveTintColor: hexToRgba(accentTone, 0.35),
        });

        // Cleanup to defaults when leaving
        return () => {
          navigation.setOptions(defaultHeader);
          tabNavigator?.setOptions(defaultTabOptions);
        };
      },
      [accentBorder, accentTone, navigation],
    ),
  );

  const scrollY = useRef(new Animated.Value(0));

  // Get build recommendations for this character
  const buildData = getCharacterBuild(character.id);

  // Find teams that include this character
  const teamsWithCharacter = useMemo(() => {
    return TEAMS.map((team) => {
      const members = resolveTeamMembers(team);
      const computedPower = members.reduce((sum, m) => sum + (m.rating || 0), 0);
      const teamPower = Number.isFinite(team.teamRating) && team.teamRating! > 0
        ? team.teamRating
        : computedPower;

      return {
        team,
        members,
        teamPower,
        isAvailable: team.members.every((memberId) => isCharacterOwned(memberId)),
      };
    }).filter(({ team }) => team.members.includes(character.id));
  }, [character.id, isCharacterOwned]);

  const renderGameModeStars = (
    mocRating?: number,
    pfRating?: number,
    asRating?: number,
  ) => {
    return (
      <View style={styles.gameModeStarsContainer}>
        <StarRatingRow rating={mocRating || 0} color={accentTone} size={18} />
        <StarRatingRow
          rating={pfRating || 0}
          color={secondaryColor}
          size={18}
        />
        <StarRatingRow rating={asRating || 0} color={tertiaryColor} size={18} />
      </View>
    );
  };

  const renderMemberHoverCard = (member: Character) => {
    const renderBadge = (label: string, color: string) => (
      <View style={styles.memberHoverBadge}>
        <View
          style={[
            styles.memberHoverBadgeFill,
            { backgroundColor: color || palette.chipFallback },
          ]}
        />
        <Text style={styles.memberHoverBadgeText}>{label}</Text>
      </View>
    );

    return (
      <View style={styles.memberHoverCard}>
        <View style={styles.memberHoverHeader}>
          <Text style={styles.memberHoverName}>{member.name}</Text>
          <Text style={styles.memberHoverRating}>
            {member.rating ? `${member.rating}/30` : "Unrated"}
          </Text>
        </View>
        <View style={styles.memberHoverBadges}>
          {renderBadge(
            member.element,
            ELEMENT_COLORS[member.element] ?? palette.chipFallback,
          )}
          {member.path &&
            renderBadge(
              member.path,
              PATH_COLORS[member.path] ?? palette.chipFallback,
            )}
          {member.role &&
            renderBadge(
              member.role,
              ROLE_COLORS[member.role] ?? palette.chipFallback,
            )}
          {member.meta &&
            renderBadge(
              member.meta,
              META_COLORS[member.meta] ?? palette.chipFallback,
            )}
        </View>
        <View style={styles.memberHoverStars}>
          <StarRatingRow
            rating={member.mocRating || 0}
            color={accentTone}
            size={14}
          />
          <StarRatingRow
            rating={member.pfRating || 0}
            color={secondaryColor}
            size={14}
          />
          <StarRatingRow
            rating={member.asRating || 0}
            color={tertiaryColor}
            size={14}
          />
        </View>
      </View>
    );
  };
  const heroImageStyles = [
    styles.heroImage,
    ...(width >= 900 ? [styles.heroImageDesktop] : []),
  ];
  const heroPlaceholderStyles = [
    styles.heroImagePlaceholder,
    ...(width >= 900 ? [styles.heroImagePlaceholderDesktop] : []),
  ];

  const floatAnim = useRef(new Animated.Value(0));
  const heroFloatTranslate = floatAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });
  const heroFloatScale = floatAnim.current.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  const heroParallax = scrollY.current.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  const heroCenterTranslate = scrollY.current.interpolate({
    inputRange: [0, 300],
    outputRange: [0, 220],
    extrapolate: "clamp",
  });

  const heroScrollScale = scrollY.current.interpolate({
    inputRange: [0, 300],
    outputRange: [1.05, 1.35],
    extrapolate: "clamp",
  });

  const heroWallpaperOpacity = scrollY.current.interpolate({
    inputRange: [0, 120, 360],
    outputRange: [1, 1, 0.45],
    extrapolate: "clamp",
  });

  const heroOverlayTranslate = scrollY.current.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -24],
    extrapolate: "clamp",
  });

  const heroOverlayOpacity = scrollY.current.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });

  const heroAnimatedImageStyles = [
    ...heroImageStyles,
    {
      transform: [
        {
          translateY: Animated.add(
            Animated.add(heroFloatTranslate, heroParallax),
            heroCenterTranslate,
          ),
        },
        { scale: Animated.multiply(heroFloatScale, heroScrollScale) },
      ],
      opacity: heroWallpaperOpacity,
    },
  ];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim.current, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim.current, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={styles.container}>
      {/* Hero Section - Fixed Background */}
      <View style={styles.heroSection}>
        <View
          style={[
            styles.heroAccentPrimary,
            { backgroundColor: hexToRgba(accentTone, 0.32) },
          ]}
        />
        <View
          style={[
            styles.heroAccentSecondary,
            { backgroundColor: hexToRgba(secondaryColor, 0.26) },
          ]}
        />
        {characterImageSource ? (
          <Animated.Image
            source={characterImageSource}
            style={heroAnimatedImageStyles}
          />
        ) : (
          <Animated.View
            style={[
              ...heroPlaceholderStyles,
              {
                transform: [
                  {
                    translateY: Animated.add(
                      Animated.add(heroFloatTranslate, heroParallax),
                      heroCenterTranslate,
                    ),
                  },
                  { scale: Animated.multiply(heroFloatScale, heroScrollScale) },
                ],
                opacity: heroWallpaperOpacity,
              },
            ]}
          >
            <Text style={styles.heroPlaceholderText}>
              {character.name.charAt(0).toUpperCase()}
            </Text>
          </Animated.View>
        )}
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY.current } } }],
          { useNativeDriver: true },
        )}
      >
        {/* Hero Overlay - Scrolls with content */}
        <Animated.View
          style={[
            styles.heroOverlay,
            {
              transform: [{ translateY: heroOverlayTranslate }],
              opacity: heroOverlayOpacity,
              borderColor: accentBorder,
              backgroundColor: tertiarySurface,
            },
          ]}
        >
          <View style={styles.heroOverlayHeader}>
            <View style={styles.heroTitleGroup}>
              <Text style={styles.heroEyebrow}>Character dossier</Text>
              <Text style={styles.heroTitle}>{character.name}</Text>
              <View style={styles.heroChipRow}>
                {elementIcon && (
                  <View style={styles.heroChip}>
                    <Image source={elementIcon} style={styles.heroChipIcon} />
                    <Text style={styles.heroChipText}>{character.element}</Text>
                  </View>
                )}
                {pathIcon && (
                  <View style={styles.heroChip}>
                    <Image source={pathIcon} style={styles.heroChipIcon} />
                    <Text style={styles.heroChipText}>{character.path}</Text>
                  </View>
                )}
                {character.role && (
                  <View style={styles.heroChip}>
                    <Text style={styles.heroChipText}>{character.role}</Text>
                  </View>
                )}
                {character.meta && (
                  <View style={styles.heroChip}>
                    <Text style={styles.heroChipText}>{character.meta}</Text>
                  </View>
                )}
                <View
                  style={[
                    styles.heroChip,
                    isOwned ? styles.heroChipPositive : styles.heroChipNegative,
                  ]}
                >
                  <Text style={styles.heroChipText}>
                    {isOwned ? "Owned" : "Wishlist"}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.heroScoreBadge, { borderColor: accentBorder }]}
            >
              <Text style={[styles.heroScoreValue, { color: accentTone }]}>
                {character.rating || 0}/30
              </Text>
              <Text style={styles.heroScoreLabel}>Composite power</Text>
              <Text style={styles.heroScoreSubtext}>
                MoC {character.mocRating || 0} · PF {character.pfRating || 0} ·
                AS {character.asRating || 0}
              </Text>
            </View>
          </View>

          <View style={styles.heroOverlayFooter}>
            <View style={styles.heroRatingBar}>
              <View style={styles.ratingBar}>
                <View
                  style={[
                    styles.ratingFill,
                    {
                      width: `${Math.min(
                        100,
                        ((character.rating || 0) / 30) * 100,
                      )}%`,
                      backgroundColor: accentTone,
                    },
                  ]}
                />
              </View>
              <Text style={styles.heroMetaText}>
                Calibrated against the current roster
              </Text>
            </View>
            <View style={styles.heroStarsBlock}>
              {renderGameModeStars(
                character.mocRating,
                character.pfRating,
                character.asRating,
              )}
              <Text style={styles.heroStarsLabel}>
                MoC · Pure Fiction · Apoc Shadow
              </Text>
            </View>
          </View>
        </Animated.View>

        <View
          style={[
            styles.section,
            styles.sectionFloating,
            {
              borderColor: accentBorder,
              shadowColor: accentTone,
              backgroundColor: secondarySurface,
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Ratings</Text>
            <Text style={styles.sectionSubtitle}>
              Where they land at a glance
            </Text>
          </View>
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#ffffff" }]}>
                {character.rating || 0}/30
              </Text>
              <Text style={styles.statLabel}>Composite</Text>
              <Text style={styles.statSubtext}>All modes weighted</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#ffffff" }]}>
                {character.mocRating || 0}/10
              </Text>
              <Text style={styles.statLabel}>MoC</Text>
              <Text style={styles.statSubtext}>Memory of Chaos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#ffffff" }]}>
                {character.pfRating || 0}/10
              </Text>
              <Text style={styles.statLabel}>Pure Fiction</Text>
              <Text style={styles.statSubtext}>Multi-target burst</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: "#ffffff" }]}>
                {character.asRating || 0}/10
              </Text>
              <Text style={styles.statLabel}>Apoc Shadow</Text>
              <Text style={styles.statSubtext}>Solo endurance</Text>
            </View>
          </View>
        </View>

        {/* Attributes Section */}
        <View style={[styles.section, sectionTone]}>
          <Text style={styles.sectionTitle}>Attributes</Text>
          <View style={styles.chipRow}>
            <View
              style={[
                styles.chip,
                {
                  backgroundColor:
                    ELEMENT_COLORS[character.element] || palette.chipFallback,
                },
              ]}
            >
              <Text style={styles.chipText}>{character.element}</Text>
            </View>
            {character.path && (
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      PATH_COLORS[character.path] || palette.chipFallback,
                  },
                ]}
              >
                <Text style={styles.chipText}>{character.path}</Text>
              </View>
            )}
            {character.role && (
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      ROLE_COLORS[character.role] || palette.chipFallback,
                  },
                ]}
              >
                <Text style={styles.chipText}>{character.role}</Text>
              </View>
            )}
            {character.meta && (
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor:
                      META_COLORS[character.meta] || palette.chipFallback,
                  },
                ]}
              >
                <Text style={styles.chipText}>{character.meta}</Text>
              </View>
            )}
            {character.target && (
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor: tertiarySurface,
                    borderColor: accentBorder,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: accentTone }]}>
                  {character.target}
                </Text>
              </View>
            )}
            {character.implant && (
              <View
                style={[
                  styles.chip,
                  {
                    backgroundColor: tertiarySurface,
                    borderColor: accentBorder,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: accentTone }]}>
                  {character.implant === "ultNegate"
                    ? "Weakness Negation"
                    : "Implant"}
                </Text>
              </View>
            )}
          </View>
          {character.implant && (
            <View
              style={[
                styles.implantDescription,
                {
                  borderColor: accentBorder,
                  backgroundColor: tertiarySurface,
                },
              ]}
            >
              <Text style={styles.implantText}>
                {character.implant === "Firefly" &&
                  `${character.name} adds Fire weakness to enemy when attacking them while in combustion state.`}
                {character.implant === "Silver Wolf" &&
                  `${character.name} adds weakness with skill. The element type of the weakness depends on the element of the character in position 1 of the party.`}
                {character.implant === "Anaxa" &&
                  `${character.name} adds random weaknesses with skill. ${character.name} adds ALL weaknesses with ultimate.`}
                {character.implant === "ult" &&
                  `${character.name} adds ${character.element} weakness to enemy with their ultimate.`}
                {character.implant === "ultNegate" &&
                  `${character.name} negates the enemy weakness with their ultimate. Attacks made with this character's ultimate will deal damage to the enemy toughness bar regardless of elemental type.`}
              </Text>
            </View>
          )}
        </View>

        {/* Light Cones Section */}
        <View style={[styles.section, sectionTone]}>
          <Text style={styles.sectionTitle}>Best Light Cones</Text>
          {buildData && buildData.lightCones.length > 0 ? (
            <View
              style={[
                styles.recommendationCard,
                {
                  borderColor: accentBorder,
                  backgroundColor: secondarySurface,
                },
              ]}
            >
              {buildData.lightCones.map((lc, index) => {
                const lightconeImage = getLightconeImageWithFallback(lc.name);
                return (
                  <View key={index} style={styles.lightconeItem}>
                    {lightconeImage && (
                      <Image
                        source={lightconeImage}
                        style={styles.lightconeImage}
                      />
                    )}
                    <View style={styles.lightconeTextContainer}>
                      <Text style={styles.recommendationItemName}>
                        {lc.name}
                      </Text>
                      {lc.notes && (
                        <Text style={styles.recommendationItemNotes}>
                          {lc.notes}
                        </Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Light cone recommendations coming soon.
            </Text>
          )}
        </View>

        {/* Relics Section */}
        <View style={[styles.section, sectionTone]}>
          <Text style={styles.sectionTitle}>Relic Sets</Text>
          {buildData ? (
            <>
              <View
                style={[
                  styles.recommendationCard,
                  {
                    borderColor: accentBorder,
                    backgroundColor: secondarySurface,
                  },
                ]}
              >
                <Text style={styles.recommendationTitle}>Recommended Sets</Text>
                {buildData.relics.sets.length > 0 ? (
                  buildData.relics.sets.map((relic, index) => {
                    const relicImage = getRelicImageWithFallback(relic.name);
                    return (
                      <View key={index} style={styles.lightconeItem}>
                        {relicImage && (
                          <Image
                            source={relicImage}
                            style={styles.lightconeImage}
                          />
                        )}
                        <View style={styles.lightconeTextContainer}>
                          <Text style={styles.recommendationItemName}>
                            {relic.name} {relic.pieces && `(${relic.pieces})`}
                          </Text>
                          {relic.notes && (
                            <Text style={styles.recommendationItemNotes}>
                              {relic.notes}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.recommendationText}>
                    No relic set recommendations yet.
                  </Text>
                )}
              </View>
              <View
                style={[
                  styles.recommendationCard,
                  {
                    borderColor: accentBorder,
                    backgroundColor: secondarySurface,
                  },
                ]}
              >
                <Text style={styles.recommendationTitle}>Planar Ornaments</Text>
                {buildData.relics.planar.length > 0 ? (
                  buildData.relics.planar.map((planar, index) => {
                    const planarImage = getPlanarImageWithFallback(planar.name);
                    return (
                      <View key={index} style={styles.lightconeItem}>
                        {planarImage && (
                          <Image
                            source={planarImage}
                            style={styles.lightconeImage}
                          />
                        )}
                        <View style={styles.lightconeTextContainer}>
                          <Text style={styles.recommendationItemName}>
                            {planar.name}
                          </Text>
                          {planar.notes && (
                            <Text style={styles.recommendationItemNotes}>
                              {planar.notes}
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.recommendationText}>
                    No planar recommendations yet.
                  </Text>
                )}
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Relic recommendations coming soon.
            </Text>
          )}
        </View>

        {/* Stats Section */}
        <View style={[styles.section, sectionTone]}>
          <Text style={styles.sectionTitle}>Stat Priority</Text>
          {buildData ? (
            <>
              <View
                style={[
                  styles.recommendationCard,
                  {
                    borderColor: accentBorder,
                    backgroundColor: secondarySurface,
                  },
                ]}
              >
                <Text style={styles.recommendationTitle}>Main Stats</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statSlot}>Body:</Text>
                  <Text style={styles.statValues}>
                    {buildData.stats.body.join(", ")}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statSlot}>Feet:</Text>
                  <Text style={styles.statValues}>
                    {buildData.stats.feet.join(", ")}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statSlot}>Sphere:</Text>
                  <Text style={styles.statValues}>
                    {buildData.stats.sphere.join(", ")}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statSlot}>Rope:</Text>
                  <Text style={styles.statValues}>
                    {buildData.stats.rope.join(", ")}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.recommendationCard,
                  {
                    borderColor: accentBorder,
                    backgroundColor: secondarySurface,
                  },
                ]}
              >
                <Text style={styles.recommendationTitle}>
                  Sub Stats Priority
                </Text>
                <Text style={styles.recommendationText}>
                  {buildData.stats.subStats.join(" > ")}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.emptyText}>
              Stat recommendations coming soon.
            </Text>
          )}
        </View>

        {/* Teams Section */}
        <View style={[styles.section, sectionTone]}>
          <Text style={styles.sectionTitle}>
            Teams ({teamsWithCharacter.length})
          </Text>
          {teamsWithCharacter.length > 0 ? (
            teamsWithCharacter.map(({ team, members, teamPower, isAvailable }) => (
              <View
                key={team.id}
                style={[
                  styles.teamCard,
                  {
                    borderColor: accentBorder,
                    backgroundColor: secondarySurface,
                  },
                  !isAvailable && styles.teamCardDisabled,
                ]}
              >
                <View
                  style={[
                    styles.teamHeader,
                    { borderBottomColor: accentBorder, borderBottomWidth: 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.teamName,
                      !isAvailable && styles.teamNameDisabled,
                    ]}
                  >
                    {team.name ?? `Team ${team.id.toUpperCase()}`}
                  </Text>
                  <Text
                    style={[
                      styles.teamPower,
                      { color: accentTone },
                      !isAvailable && styles.teamPowerDisabled,
                    ]}
                  >
                    {teamPower || 0}/120
                  </Text>
                </View>
                <View style={styles.teamMembers}>
                  {members.map((member) => {
                    const memberImage = getCharacterImage(member.id);
                    const isOwned = isCharacterOwned(member.id);
                    const isCurrentChar = member.id === character.id;
                    const instanceKey = `${team.id}-${member.id}`;

                    return (
                      <Pressable
                        key={member.id}
                        style={[
                          styles.memberIconWrapper,
                          hoveredMemberKey === instanceKey &&
                            styles.memberIconWrapperActive,
                        ]}
                        onHoverIn={() => setHoveredMemberKey(instanceKey)}
                        onHoverOut={() =>
                          setHoveredMemberKey((prev) =>
                            prev === instanceKey ? null : prev,
                          )
                        }
                        onPressIn={() => setHoveredMemberKey(instanceKey)}
                        onPressOut={() =>
                          setHoveredMemberKey((prev) =>
                            prev === instanceKey ? null : prev,
                          )
                        }
                      >
                        <View
                          style={[
                            styles.memberIcon,
                            isCurrentChar && styles.memberIconHighlight,
                            !isOwned && styles.memberIconDisabled,
                          ]}
                        >
                          {memberImage ? (
                            <Image
                              source={memberImage}
                              style={styles.memberImage}
                            />
                          ) : (
                            <View style={styles.memberPlaceholder}>
                              <Text style={styles.memberPlaceholderText}>
                                {member.name.charAt(0)}
                              </Text>
                            </View>
                          )}
                        </View>
                        {isWeb && hoveredMemberKey === instanceKey
                          ? renderMemberHoverCard(member)
                          : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No teams found with this character
            </Text>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const createStyles = (palette: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      flex: 1,
      zIndex: 1,
    },
    scrollContent: {
      paddingTop: 340,
      paddingBottom: 40,
      gap: 12,
    },
    missingText: {
      fontSize: 18,
      color: palette.textMuted,
    },
    heroSection: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 460,
      backgroundColor: palette.background,
      zIndex: 0,
    },
    heroAccentPrimary: {
      position: "absolute",
      width: 260,
      height: 260,
      borderRadius: 200,
      backgroundColor: palette.accentSoft,
      top: -50,
      right: -70,
      transform: [{ rotate: "18deg" }],
    },
    heroAccentSecondary: {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: 180,
      backgroundColor: palette.surfaceShadow,
      bottom: -40,
      left: -60,
      opacity: 0.55,
    },
    heroImage: {
      width: "80%",
      height: "80%",
      resizeMode: "contain",
      alignSelf: "center",
    },
    heroImageDesktop: {
      height: 500,
    },
    heroImagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: palette.highlight,
      justifyContent: "center",
      alignItems: "center",
    },
    heroImagePlaceholderDesktop: {
      height: 250,
    },
    heroPlaceholderText: {
      fontSize: 48,
      color: palette.textMuted,
      fontWeight: "700",
    },
    heroOverlay: {
      marginHorizontal: 16,
      marginTop: -40,
      marginBottom: 8,
      padding: 20,
      backgroundColor: palette.background,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: palette.highlightBorder,
      shadowColor: palette.surfaceShadow,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
      gap: 14,
    },
    heroOverlayHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 14,
    },
    heroTitleGroup: {
      flex: 1,
      gap: 6,
    },
    heroEyebrow: {
      fontSize: 12,
      letterSpacing: 1,
      textTransform: "uppercase",
      color: palette.textMuted,
    },
    heroTitle: {
      fontSize: 30,
      fontWeight: "700",
      color: palette.textPrimary,
    },
    heroChipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    heroChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: palette.surfaceBorder,
      backgroundColor: palette.surface,
      gap: 6,
    },
    heroChipIcon: {
      width: 18,
      height: 18,
    },
    heroChipText: {
      color: palette.textPrimary,
      fontSize: 13,
      fontWeight: "600",
    },
    heroChipPositive: {
      borderColor: palette.accentBorder,
      backgroundColor: palette.accentSoft,
    },
    heroChipNegative: {
      borderColor: palette.surfaceBorder,
      backgroundColor: palette.surface,
    },
    heroScoreBadge: {
      minWidth: 160,
      backgroundColor: palette.surface,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: palette.highlightBorder,
    },
    heroScoreValue: {
      fontSize: 24,
      fontWeight: "700",
      color: palette.accent,
    },
    heroScoreLabel: {
      fontSize: 12,
      fontWeight: "600",
      color: palette.textSecondary,
      marginTop: 4,
    },
    heroScoreSubtext: {
      fontSize: 12,
      color: palette.textMuted,
      marginTop: 6,
    },
    heroOverlayFooter: {
      flexDirection: "row",
      gap: 12,
      flexWrap: "wrap",
    },
    heroRatingBar: {
      flex: 1,
      backgroundColor: palette.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.surfaceBorder,
    },
    ratingBar: {
      height: 8,
      backgroundColor: palette.surfaceShadow,
      borderRadius: 999,
      overflow: "hidden",
      marginBottom: 10,
    },
    ratingFill: {
      height: "100%",
      backgroundColor: palette.accent,
      borderRadius: 999,
    },
    heroMetaText: {
      fontSize: 12,
      color: palette.textMuted,
    },
    heroStarsBlock: {
      minWidth: 200,
      backgroundColor: palette.surface,
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: palette.surfaceBorder,
      alignItems: "center",
    },
    gameModeStarsContainer: {
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
    },
    heroStarsLabel: {
      fontSize: 12,
      color: palette.textMuted,
      marginTop: 6,
      textAlign: "center",
    },
    statsSection: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
    },
    statCard: {
      flex: 1,
      minWidth: 150,
      backgroundColor: palette.highlight,
      borderRadius: 14,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: palette.highlightBorder,
      shadowColor: palette.surfaceShadow,
      shadowOpacity: 0.2,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    statValue: {
      fontSize: 24,
      fontWeight: "700",
      color: palette.accent,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: palette.textSecondary,
      fontWeight: "600",
    },
    statSubtext: {
      fontSize: 11,
      color: palette.textMuted,
      marginTop: 4,
    },
    section: {
      padding: 16,
      backgroundColor: palette.surface,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: palette.surfaceBorder,
      shadowColor: palette.surfaceShadow,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },
    sectionFloating: {
      borderColor: palette.accentBorder,
      shadowColor: palette.surfaceShadow,
    },
    sectionHeader: {
      marginBottom: 12,
      gap: 4,
    },
    sectionSubtitle: {
      fontSize: 13,
      color: palette.textMuted,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: palette.textPrimary,
      marginBottom: 8,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    chip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    chipText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#fff",
    },
    teamCard: {
      backgroundColor: palette.highlight,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: palette.highlightBorder,
    },
    teamCardDisabled: {
      opacity: 0.5,
    },
    teamHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    teamName: {
      fontSize: 16,
      fontWeight: "600",
      color: palette.textPrimary,
      flex: 1,
    },
    teamNameDisabled: {
      color: palette.textMuted,
    },
    teamPower: {
      fontSize: 14,
      fontWeight: "600",
      color: palette.accent,
    },
    teamPowerDisabled: {
      color: palette.textMuted,
    },
    teamMembers: {
      flexDirection: "row",
      gap: 8,
      overflow: "visible",
    },
    memberIconWrapper: {
      position: "relative",
      width: 60,
      height: 60,
      flexShrink: 0,
    },
    memberIconWrapperActive: {
      zIndex: 20,
    },
    memberIcon: {
      width: 60,
      height: 60,
      borderRadius: 8,
      overflow: "hidden",
      borderWidth: 2,
      borderColor: "transparent",
    },
    memberIconHighlight: {
      borderColor: palette.accent,
      borderWidth: 3,
    },
    memberIconDisabled: {
      opacity: 0.5,
    },
    memberImage: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    memberPlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: palette.surface,
      justifyContent: "center",
      alignItems: "center",
    },
    memberPlaceholderText: {
      fontSize: 20,
      fontWeight: "700",
      color: palette.textMuted,
    },
    memberHoverCard: {
      position: "absolute",
      top: -150,
      left: -10,
      width: 230,
      backgroundColor: palette.surface,
      borderColor: palette.surfaceBorder,
      borderWidth: 1,
      borderRadius: 12,
      padding: 12,
      shadowColor: palette.surfaceShadow,
      shadowOpacity: 0.35,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
      zIndex: 10,
    },
    memberHoverHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 6,
    },
    memberHoverName: {
      fontSize: 14,
      fontWeight: "700",
      color: palette.textPrimary,
      flexShrink: 1,
    },
    memberHoverRating: {
      fontSize: 12,
      fontWeight: "700",
      color: palette.accent,
    },
    memberHoverBadges: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
      marginBottom: 8,
    },
    memberHoverBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      paddingHorizontal: 8,
      backgroundColor: palette.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: palette.divider,
      gap: 6,
    },
    memberHoverBadgeFill: {
      width: 10,
      height: 10,
      borderRadius: 20,
    },
    memberHoverBadgeText: {
      color: palette.textSecondary,
      fontSize: 12,
      fontWeight: "600",
    },
    memberHoverStars: {
      flexDirection: "row",
      gap: 6,
      alignItems: "center",
    },
    emptyText: {
      fontSize: 14,
      color: palette.textMuted,
      fontStyle: "italic",
    },
    recommendationCard: {
      backgroundColor: palette.highlight,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: palette.highlightBorder,
    },
    recommendationTitle: {
      fontSize: 15,
      fontWeight: "600",
      color: palette.textPrimary,
      marginBottom: 8,
    },
    recommendationText: {
      fontSize: 14,
      color: palette.textSecondary,
      lineHeight: 20,
    },
    recommendationItem: {
      marginBottom: 8,
    },
    recommendationItemName: {
      fontSize: 14,
      fontWeight: "600",
      color: palette.textPrimary,
      marginBottom: 2,
    },
    recommendationItemNotes: {
      fontSize: 13,
      color: palette.textMuted,
      marginLeft: 12,
      fontStyle: "italic",
    },
    lightconeItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      gap: 12,
    },
    lightconeImage: {
      width: 60,
      height: 80,
      borderRadius: 4,
      resizeMode: "cover",
    },
    lightconeTextContainer: {
      flex: 1,
    },
    statRow: {
      flexDirection: "row",
      marginBottom: 8,
      alignItems: "flex-start",
    },
    statSlot: {
      fontSize: 14,
      fontWeight: "600",
      color: palette.textSecondary,
      width: 70,
    },
    statValues: {
      fontSize: 14,
      color: palette.textPrimary,
      flex: 1,
    },
    implantDescription: {
      marginTop: 12,
      padding: 12,
      backgroundColor: palette.highlight,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: palette.highlightBorder,
    },
    implantText: {
      fontSize: 14,
      color: palette.textSecondary,
      lineHeight: 20,
    },
  });
