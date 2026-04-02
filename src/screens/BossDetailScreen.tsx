import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
  Platform,
  Pressable,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  InteractionManager,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  BOSSES,
  getBossAffinities,
  type EffectivenessScore,
  type Boss,
} from "../data/bosses";
import { CHARACTERS } from "../data/characters";
import { getRecommendedTeamsSorted } from "../data/teams";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { getElementIcon } from "../constants/iconMappings";
import { getBossImage } from "../constants/bossImageMappings";
import { getCharacterImage } from "../constants/characterImageMappings";
import { getCharacterPalette } from "../constants/characterPalettes";

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

const SCORE_COLORS: Record<EffectivenessScore, string> = {
  [-2]: "#ef4444",
  [-1]: "#f97316",
  [0]: "#9ca3af",
  [1]: "#22c55e",
  [2]: "#10b981",
};

const SCORE_LABELS: Record<EffectivenessScore, string> = {
  [-2]: "Terrible",
  [-1]: "Bad",
  [0]: "Neutral",
  [1]: "Good",
  [2]: "Great",
};

type RecommendedTeam = {
  team: any;
  members: any[];
  teamPower: number;
  score: number;
  isAvailable: boolean;
};

type TeamFilterState = {
  availability: "all" | "available" | "unavailable";
  sortBy: "rating" | "power" | "name" | "id" | "random";
  sortOrder: "asc" | "desc";
  element: string[];
  path: string[];
  role: string[];
  meta: string[];
  target: string[];
  containsAll: boolean;
};

type TeamMultiFilterKey = "element" | "path" | "role" | "meta" | "target";

type ScoreThresholds = {
  excellentMin: number;
  goodMin: number;
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

function quantile(values: number[], q: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = Math.min(
    sorted.length - 1,
    Math.max(0, (sorted.length - 1) * q),
  );
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const weight = position - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function getScoreThresholds(scores: number[]): ScoreThresholds {
  if (!scores.length) return { excellentMin: 90, goodMin: 70 };
  return {
    excellentMin: quantile(scores, 0.7),
    goodMin: quantile(scores, 0.4),
  };
}

function getRecommendationTier(
  score: number,
  thresholds: ScoreThresholds,
): "EXCELLENT" | "GOOD" | "FAIR" {
  if (score >= thresholds.excellentMin) return "EXCELLENT";
  if (score >= thresholds.goodMin) return "GOOD";
  return "FAIR";
}

function keysByScore(
  map: Record<string, EffectivenessScore> | undefined,
  predicate: (value: EffectivenessScore) => boolean,
) {
  return Object.entries(map || {})
    .filter(([, value]) => predicate(value))
    .map(([key]) => key);
}

export function BossDetailScreen({ route }: any) {
  const { bossId } = route.params;
  const boss: Boss | undefined = BOSSES.find((b) => b.id === bossId);
  const navigation = useNavigation();
  const { isCharacterOwned } = useCharacterOwnership();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const [hoveredMemberKey, setHoveredMemberKey] = useState<string | null>(null);
  const [showTeamFilterModal, setShowTeamFilterModal] = useState(false);
  const [isTeamDataReady, setIsTeamDataReady] = useState(false);
  const [teamFilters, setTeamFilters] = useState<TeamFilterState>({
    availability: "available",
    sortBy: "rating",
    sortOrder: "desc",
    element: [],
    path: [],
    role: [],
    meta: [],
    target: [],
    containsAll: false,
  });

  const toggleTeamMultiFilter = (key: TeamMultiFilterKey, value: string) => {
    setTeamFilters((prev) => {
      const currentValues = prev[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [key]: nextValues,
      };
    });
  };

  useEffect(() => {
    setIsTeamDataReady(false);
    const task = InteractionManager.runAfterInteractions(() => {
      setIsTeamDataReady(true);
    });

    return () => {
      task.cancel();
    };
  }, [bossId]);

  if (!boss) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.missingText}>Boss not found</Text>
      </View>
    );
  }

  const affinities = useMemo(() => getBossAffinities(boss), [boss]);
  const weaknesses = useMemo(
    () => keysByScore(affinities.elements, (value) => value > 0),
    [affinities.elements],
  );
  const resistances = useMemo(
    () => keysByScore(affinities.elements, (value) => value < 0),
    [affinities.elements],
  );
  const metaWeaknesses = useMemo(
    () => keysByScore(affinities.meta, (value) => value > 0),
    [affinities.meta],
  );
  const metaResistances = useMemo(
    () => keysByScore(affinities.meta, (value) => value < 0),
    [affinities.meta],
  );

  const { filteredTeams, excludedTeamsCount, totalTeamsCount } = useMemo(() => {
    if (!isTeamDataReady) {
      return {
        filteredTeams: [] as RecommendedTeam[],
        excludedTeamsCount: 0,
        totalTeamsCount: 0,
      };
    }

    const recommendedTeams = getRecommendedTeamsSorted(
      weaknesses,
      resistances,
      metaWeaknesses,
      metaResistances,
      false,
      isCharacterOwned,
    ) as RecommendedTeam[];

    const total = recommendedTeams.length;
    const excludedByOwnership = recommendedTeams.filter(
      (t) => !t.isAvailable,
    ).length;

    let teamsToFilter = recommendedTeams;
    if (teamFilters.availability === "available") {
      teamsToFilter = teamsToFilter.filter((team) => team.isAvailable);
    } else if (teamFilters.availability === "unavailable") {
      teamsToFilter = teamsToFilter.filter((team) => !team.isAvailable);
    }

    const attributeGroups = [
      { selected: teamFilters.element, memberAttribute: "element" },
      { selected: teamFilters.path, memberAttribute: "path" },
      { selected: teamFilters.role, memberAttribute: "role" },
      { selected: teamFilters.meta, memberAttribute: "meta" },
      { selected: teamFilters.target, memberAttribute: "target" },
    ].filter((group) => group.selected.length > 0);

    const selectedAttributeFilters = attributeGroups.flatMap(
      ({ selected, memberAttribute }) =>
        selected.map((value) => ({ value, memberAttribute })),
    );

    const attributeFiltered = teamsToFilter.filter(({ members }) => {
      if (!selectedAttributeFilters.length) return true;

      if (teamFilters.containsAll) {
        return selectedAttributeFilters.every(({ value, memberAttribute }) =>
          members.some((member) => (member as any)[memberAttribute] === value),
        );
      }

      return selectedAttributeFilters.some(({ value, memberAttribute }) =>
        members.some((member) => (member as any)[memberAttribute] === value),
      );
    });

    if (teamFilters.sortBy === "random") {
      const shuffled = [...attributeFiltered];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = temp;
      }

      return {
        filteredTeams:
          teamFilters.sortOrder === "desc" ? shuffled.reverse() : shuffled,
        excludedTeamsCount: excludedByOwnership,
        totalTeamsCount: total,
      };
    }

    const sortedTeams = [...attributeFiltered].sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (teamFilters.sortBy) {
        case "rating":
          aValue = a.score;
          bValue = b.score;
          break;
        case "power":
          aValue = a.teamPower;
          bValue = b.teamPower;
          break;
        case "id":
          aValue = a.team.id;
          bValue = b.team.id;
          break;
        case "name":
        default:
          aValue = a.team.name || a.team.id;
          bValue = b.team.name || b.team.id;
          break;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return teamFilters.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return teamFilters.sortOrder === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });

    return {
      filteredTeams: sortedTeams,
      excludedTeamsCount: excludedByOwnership,
      totalTeamsCount: total,
    };
  }, [
    weaknesses,
    resistances,
    metaWeaknesses,
    metaResistances,
    isCharacterOwned,
    teamFilters,
    isTeamDataReady,
  ]);

  const scoreThresholds = useMemo(
    () => getScoreThresholds(filteredTeams.map((team) => team.score)),
    [filteredTeams],
  );

  const descriptionText = boss.description?.trim();
  const locationText = boss.location?.trim();
  const bossImageSource = getBossImage(boss.image);
  const heroImageStyles = [
    styles.heroImage,
    ...(width >= 900 ? [styles.heroImageDesktop] : []),
  ];
  const heroPlaceholderStyles = [
    styles.heroImagePlaceholder,
    ...(width >= 900 ? [styles.heroImagePlaceholderDesktop] : []),
  ];

  const renderAffinitySection = (
    title: string,
    scored: Record<string, EffectivenessScore> | undefined,
    iconResolver?: (value: string) => ImageSourcePropType | undefined,
  ) => {
    if (!scored) return null;

    const filteredEntries = Object.entries(scored).filter(
      ([, score]) => score !== 0,
    );
    if (!filteredEntries.length) return null;

    const sortedEntries = filteredEntries.sort(([, a], [, b]) => b - a);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.affinityList}>
          {sortedEntries.map(([key, score]) => {
            const icon = iconResolver?.(key);
            const scoreColor = SCORE_COLORS[score];
            const scoreLabel = SCORE_LABELS[score];

            return (
              <View key={`${title}-${key}`} style={styles.affinityRow}>
                <View style={styles.affinityLeft}>
                  {icon && (
                    <Image
                      source={icon}
                      style={styles.affinityIcon}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.affinityLabel}>{key}</Text>
                </View>
                <View style={styles.affinityRight}>
                  <View
                    style={[styles.scoreBar, { backgroundColor: scoreColor }]}
                  >
                    <Text style={styles.scoreText}>{scoreLabel}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMemberHoverCard = (member: any) => {
    const paletteEntry = getCharacterPalette(member.id);
    const accent =
      paletteEntry?.accent || ELEMENT_COLORS[member.element] || palette.accent;
    const accentSoft =
      paletteEntry?.accentSoft ||
      (accent.startsWith("#") ? hexToRgba(accent, 0.18) : palette.accentSoft);
    const accentBorder =
      paletteEntry?.accentBorder ||
      (accent.startsWith("#") ? hexToRgba(accent, 0.45) : palette.accentBorder);

    return (
      <View
        style={[
          styles.memberHoverCard,
          { borderColor: accentBorder, backgroundColor: accentSoft },
        ]}
      >
        <View style={styles.memberHoverHeader}>
          <Text style={styles.memberHoverName}>{member.name}</Text>
          <Text style={[styles.memberHoverRating, { color: accent }]}>
            {member.rating ? `${member.rating}/30` : "Unrated"}
          </Text>
        </View>
        <View style={styles.memberHoverBadges}>
          <View style={styles.memberHoverBadge}>
            <View
              style={[
                styles.memberHoverBadgeFill,
                { backgroundColor: ELEMENT_COLORS[member.element] ?? accent },
              ]}
            />
            <Text style={styles.memberHoverBadgeText}>{member.element}</Text>
          </View>
          {member.path && (
            <View style={styles.memberHoverBadge}>
              <View
                style={[
                  styles.memberHoverBadgeFill,
                  { backgroundColor: PATH_COLORS[member.path] ?? accent },
                ]}
              />
              <Text style={styles.memberHoverBadgeText}>{member.path}</Text>
            </View>
          )}
          {member.role && (
            <View style={styles.memberHoverBadge}>
              <View
                style={[
                  styles.memberHoverBadgeFill,
                  { backgroundColor: ROLE_COLORS[member.role] ?? accent },
                ]}
              />
              <Text style={styles.memberHoverBadgeText}>{member.role}</Text>
            </View>
          )}
          {member.meta && (
            <View style={styles.memberHoverBadge}>
              <View
                style={[
                  styles.memberHoverBadgeFill,
                  { backgroundColor: META_COLORS[member.meta] ?? accent },
                ]}
              />
              <Text style={styles.memberHoverBadgeText}>{member.meta}</Text>
            </View>
          )}
        </View>
        <View style={styles.memberHoverStars}>
          <Text style={[styles.memberHoverStarValue, { color: accent }]}>
            MoC {member.mocRating || 0}
          </Text>
          <Text style={[styles.memberHoverStarValue, { color: accent }]}>
            PF {member.pfRating || 0}
          </Text>
          <Text style={[styles.memberHoverStarValue, { color: accent }]}>
            AS {member.asRating || 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        {bossImageSource ? (
          <Image
            source={bossImageSource}
            style={heroImageStyles}
            resizeMode="contain"
          />
        ) : (
          <View style={heroPlaceholderStyles}>
            <Text style={styles.heroImagePlaceholderText}>
              {boss.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={styles.heroHeader}>
          <View style={styles.heroTitleBlock}>
            <Text style={styles.heroTitle}>{boss.name}</Text>
            <Text style={styles.heroSubtitle}>
              {locationText?.length ? locationText : "Unknown location"}
            </Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Encounter #{boss.id}</Text>
          </View>
        </View>
        {descriptionText?.length ? (
          <Text style={styles.heroDescription}>{descriptionText}</Text>
        ) : (
          <Text style={styles.heroDescriptionMuted}>
            No tactical dossier provided for this foe yet.
          </Text>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Battle Intel</Text>
        {renderAffinitySection(
          "Elemental Effectiveness",
          affinities.elements,
          getElementIcon,
        )}
        {renderAffinitySection("Range Effectiveness", affinities.ranges)}
        {renderAffinitySection("Meta Effectiveness", affinities.meta)}
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>Recommended Strike Teams</Text>
          <TouchableOpacity
            style={styles.teamFilterButton}
            onPress={() => setShowTeamFilterModal(true)}
          >
            <Text style={styles.teamFilterButtonText}>Filter & Sort</Text>
          </TouchableOpacity>
        </View>

        {!isTeamDataReady ? (
          <Text style={styles.filterHint}>Loading recommendations...</Text>
        ) : null}

        {isTeamDataReady &&
        teamFilters.availability === "available" &&
        excludedTeamsCount > 0 ? (
          <Text style={styles.filterHint}>
            Filtered out {excludedTeamsCount} team(s) you do not own (
            {totalTeamsCount} total available).
          </Text>
        ) : null}

        {filteredTeams.length > 0 &&
          (() => {
            const allCharacters = CHARACTERS;
            const totalTeams = totalTeamsCount;

            const averageRating =
              filteredTeams.reduce((sum, { teamPower }) => sum + teamPower, 0) /
              filteredTeams.length;
            const averagePower =
              filteredTeams.reduce((sum, { score }) => sum + score, 0) /
              filteredTeams.length;

            const usedCharacterIds = new Set<string>();
            filteredTeams.forEach(({ members }) => {
              members.forEach((member) => usedCharacterIds.add(member.id));
            });

            const elementCounts: Record<string, number> = {};
            const metaCounts: Record<string, number> = {};
            const pathCounts: Record<string, number> = {};

            filteredTeams.forEach(({ members }) => {
              members.forEach((member) => {
                elementCounts[member.element] =
                  (elementCounts[member.element] || 0) + 1;
                if (member.meta)
                  metaCounts[member.meta] = (metaCounts[member.meta] || 0) + 1;
                if (member.path)
                  pathCounts[member.path] = (pathCounts[member.path] || 0) + 1;
              });
            });

            const mostCommonElement = Object.entries(elementCounts).reduce(
              (a, b) => (elementCounts[a[0]] > elementCounts[b[0]] ? a : b),
            )[0];
            const mostCommonMeta =
              Object.keys(metaCounts).length > 0
                ? Object.entries(metaCounts).reduce((a, b) =>
                    metaCounts[a[0]] > metaCounts[b[0]] ? a : b,
                  )[0]
                : "None";
            const mostCommonPath =
              Object.keys(pathCounts).length > 0
                ? Object.entries(pathCounts).reduce((a, b) =>
                    pathCounts[a[0]] > pathCounts[b[0]] ? a : b,
                  )[0]
                : "None";

            return (
              <View style={styles.statsSummary}>
                <Text style={styles.statsSummaryTitle}>Team Analysis</Text>

                <View style={styles.statsGrid}>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {filteredTeams.length}/{totalTeams}
                      </Text>
                      <Text style={styles.statLabel}>Teams Recommended</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {averageRating.toFixed(1)}
                      </Text>
                      <Text style={styles.statLabel}>Avg Rating</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {Math.round(averagePower)}
                      </Text>
                      <Text style={styles.statLabel}>Avg Power</Text>
                    </View>
                  </View>

                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>
                        {usedCharacterIds.size}/{allCharacters.length}
                      </Text>
                      <Text style={styles.statLabel}>Characters Used</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{mostCommonElement}</Text>
                      <Text style={styles.statLabel}>Top Element</Text>
                    </View>

                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{mostCommonMeta}</Text>
                      <Text style={styles.statLabel}>Top Meta</Text>
                    </View>
                  </View>

                  <View style={styles.statsRowSingle}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{mostCommonPath}</Text>
                      <Text style={styles.statLabel}>Most Common Path</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })()}
        {filteredTeams.length ? (
          filteredTeams.map(
            ({ team, members, teamPower, score }: RecommendedTeam) => {
              const tier = getRecommendationTier(score, scoreThresholds);

              return (
                <View
                  key={team.id}
                  style={[
                    styles.teamCard,
                    tier === "EXCELLENT"
                      ? styles.teamCardExcellent
                      : tier === "GOOD"
                        ? styles.teamCardGood
                        : styles.teamCardFair,
                  ]}
                >
                  <View style={styles.teamHeader}>
                    <View style={styles.teamTitleSection}>
                      <Text style={styles.teamName}>
                        {team.name ?? `Team ${team.id.toUpperCase()}`}
                      </Text>
                      <View style={styles.teamSubInfo}>
                        <Text style={styles.teamIdText}>ID: {team.id}</Text>
                        <View style={styles.teamSubDivider} />
                        <Text style={styles.teamPowerText}>
                          Power: {teamPower}/120
                        </Text>
                      </View>
                    </View>

                    <View style={styles.recommendationSection}>
                      <View
                        style={[
                          styles.recommendationBadgeLarge,
                          tier === "EXCELLENT"
                            ? styles.recommendationBadgeHighLarge
                            : tier === "GOOD"
                              ? styles.recommendationBadgeMediumLarge
                              : styles.recommendationBadgeLowLarge,
                        ]}
                      >
                        <Text style={styles.recommendationScoreText}>
                          {Math.round(score)}
                        </Text>
                        <Text style={styles.recommendationLabelText}>
                          {tier}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {team.notes && (
                    <Text style={styles.teamNotes}>{team.notes}</Text>
                  )}
                  <View style={styles.memberGrid}>
                    {members.map((member) => {
                      const memberImage = getCharacterImage(member.id);
                      const elementIcon = getElementIcon(member.element);
                      const paletteEntry = getCharacterPalette(member.id);
                      const accent =
                        paletteEntry?.accent ||
                        ELEMENT_COLORS[member.element] ||
                        palette.accent;
                      const accentSoft =
                        paletteEntry?.accentSoft ||
                        (accent.startsWith("#")
                          ? hexToRgba(accent, 0.18)
                          : palette.accentSoft);
                      const accentBorder =
                        paletteEntry?.accentBorder ||
                        (accent.startsWith("#")
                          ? hexToRgba(accent, 0.45)
                          : palette.accentBorder);
                      const instanceKey = `${team.id}-${member.id}`;

                      return (
                        <Pressable
                          key={instanceKey}
                          style={[
                            styles.memberCard,
                            hoveredMemberKey === instanceKey &&
                              styles.memberCardActive,
                          ]}
                          onPress={() => {
                            (navigation as any).navigate("CharacterDetail", {
                              characterId: member.id,
                            });
                          }}
                          onHoverIn={() => setHoveredMemberKey(instanceKey)}
                          onHoverOut={() =>
                            setHoveredMemberKey((prev) =>
                              prev === instanceKey ? null : prev,
                            )
                          }
                        >
                          {memberImage ? (
                            <Image
                              source={memberImage}
                              style={[
                                styles.memberAvatar,
                                {
                                  borderColor: accentBorder,
                                  backgroundColor: accentSoft,
                                },
                              ]}
                            />
                          ) : (
                            <View
                              style={[
                                styles.memberAvatar,
                                styles.memberPlaceholder,
                                {
                                  borderColor: accentBorder,
                                  backgroundColor: accentSoft,
                                },
                              ]}
                            >
                              <Text style={styles.memberPlaceholderText}>
                                {member.name.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <View style={styles.memberMetaRow}>
                              <View
                                style={[
                                  styles.memberChip,
                                  elementIcon
                                    ? styles.memberChipIconOnly
                                    : {
                                        backgroundColor:
                                          ELEMENT_COLORS[member.element] ??
                                          palette.chipFallback,
                                      },
                                ]}
                              >
                                {elementIcon ? (
                                  <Image
                                    source={elementIcon}
                                    style={styles.memberChipIcon}
                                    resizeMode="contain"
                                  />
                                ) : (
                                  <Text style={styles.memberChipText}>
                                    {member.element}
                                  </Text>
                                )}
                              </View>
                              {member.role ? (
                                <View
                                  style={[
                                    styles.memberRolePill,
                                    {
                                      borderColor: accentBorder,
                                      backgroundColor: accentSoft,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.memberRoleText,
                                      { color: accent },
                                    ]}
                                  >
                                    {member.role}
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                          {isWeb && hoveredMemberKey === instanceKey
                            ? renderMemberHoverCard(member)
                            : null}
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              );
            },
          )
        ) : (
          <Text style={styles.emptyValue}>
            No strike teams match the documented weaknesses with your current
            roster.
          </Text>
        )}
      </View>
      <Modal
        visible={showTeamFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTeamFilterModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTeamFilterModal(false)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Filter & Sort Teams</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowTeamFilterModal(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.teamFilterClearButton}
                    onPress={() =>
                      setTeamFilters({
                        availability: "available",
                        sortBy: "rating",
                        sortOrder: "desc",
                        element: [],
                        path: [],
                        role: [],
                        meta: [],
                        target: [],
                        containsAll: false,
                      })
                    }
                  >
                    <Text style={styles.teamFilterClearButtonText}>
                      Clear Filters
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.teamFilterSection}>
                    <Text style={styles.teamFilterTitle}>Sort By</Text>
                    <View style={styles.teamFilterRow}>
                      {[
                        { key: "rating", label: "Rating" },
                        { key: "power", label: "Power" },
                        { key: "name", label: "Name" },
                        { key: "id", label: "ID" },
                        { key: "random", label: "Random" },
                      ].map(({ key, label }) => (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.teamFilterChip,
                            teamFilters.sortBy === key &&
                              styles.teamFilterChipActive,
                          ]}
                          onPress={() =>
                            setTeamFilters((prev) => ({
                              ...prev,
                              sortBy: key as TeamFilterState["sortBy"],
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.teamFilterChipText,
                              teamFilters.sortBy === key &&
                                styles.teamFilterChipTextActive,
                            ]}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.teamFilterRow}>
                      <TouchableOpacity
                        style={[
                          styles.teamFilterChip,
                          teamFilters.sortOrder === "desc" &&
                            styles.teamFilterChipActive,
                        ]}
                        onPress={() =>
                          setTeamFilters((prev) => ({
                            ...prev,
                            sortOrder: "desc",
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.teamFilterChipText,
                            teamFilters.sortOrder === "desc" &&
                              styles.teamFilterChipTextActive,
                          ]}
                        >
                          Descending
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.teamFilterChip,
                          teamFilters.sortOrder === "asc" &&
                            styles.teamFilterChipActive,
                        ]}
                        onPress={() =>
                          setTeamFilters((prev) => ({
                            ...prev,
                            sortOrder: "asc",
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.teamFilterChipText,
                            teamFilters.sortOrder === "asc" &&
                              styles.teamFilterChipTextActive,
                          ]}
                        >
                          Ascending
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.teamFilterSection}>
                    <Text style={styles.teamFilterTitle}>Availability</Text>
                    <View style={styles.teamFilterRow}>
                      {[
                        { key: "all", label: "All" },
                        { key: "available", label: "Owned" },
                        { key: "unavailable", label: "Missing" },
                      ].map(({ key, label }) => (
                        <TouchableOpacity
                          key={key}
                          style={[
                            styles.teamFilterChip,
                            teamFilters.availability === key &&
                              styles.teamFilterChipActive,
                          ]}
                          onPress={() =>
                            setTeamFilters((prev) => ({
                              ...prev,
                              availability:
                                key as TeamFilterState["availability"],
                            }))
                          }
                        >
                          <Text
                            style={[
                              styles.teamFilterChipText,
                              teamFilters.availability === key &&
                                styles.teamFilterChipTextActive,
                            ]}
                          >
                            {label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.teamFilterSection}>
                    <Text style={styles.teamFilterTitle}>Match Logic</Text>
                    <View style={styles.teamFilterRow}>
                      <TouchableOpacity
                        style={[
                          styles.teamFilterChip,
                          !teamFilters.containsAll &&
                            styles.teamFilterChipActive,
                        ]}
                        onPress={() =>
                          setTeamFilters((prev) => ({
                            ...prev,
                            containsAll: false,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.teamFilterChipText,
                            !teamFilters.containsAll &&
                              styles.teamFilterChipTextActive,
                          ]}
                        >
                          Any Match
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.teamFilterChip,
                          teamFilters.containsAll &&
                            styles.teamFilterChipActive,
                        ]}
                        onPress={() =>
                          setTeamFilters((prev) => ({
                            ...prev,
                            containsAll: true,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.teamFilterChipText,
                            teamFilters.containsAll &&
                              styles.teamFilterChipTextActive,
                          ]}
                        >
                          Must Have All
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {[
                    {
                      title: "Element",
                      key: "element" as const,
                      values: [
                        "Fire",
                        "Ice",
                        "Lightning",
                        "Physical",
                        "Quantum",
                        "Wind",
                        "Imaginary",
                      ],
                    },
                    {
                      title: "Path",
                      key: "path" as const,
                      values: [
                        "Destruction",
                        "Hunt",
                        "Erudition",
                        "Harmony",
                        "Nihility",
                        "Preservation",
                        "Abundance",
                        "Elation",
                        "Remembrance",
                      ],
                    },
                    {
                      title: "Role",
                      key: "role" as const,
                      values: ["DPS", "Sub-DPS", "Support", "Sustain"],
                    },
                    {
                      title: "Meta",
                      key: "meta" as const,
                      values: [
                        "DOT",
                        "Crit",
                        "Break",
                        "Follow-Up",
                        "Summon",
                        "General",
                        "Kevin",
                        "Raiden",
                        "Ultimate",
                      ],
                    },
                    {
                      title: "Target",
                      key: "target" as const,
                      values: ["Single", "Blast", "AoE", "Team"],
                    },
                  ].map((group) => (
                    <View key={group.key} style={styles.teamFilterSection}>
                      <Text style={styles.teamFilterTitle}>{group.title}</Text>
                      <View style={styles.teamFilterRow}>
                        {group.values.map((value) => {
                          const isActive =
                            teamFilters[group.key].includes(value);
                          return (
                            <TouchableOpacity
                              key={value}
                              style={[
                                styles.teamFilterChip,
                                isActive && styles.teamFilterChipActive,
                              ]}
                              onPress={() =>
                                toggleTeamMultiFilter(group.key, value)
                              }
                            >
                              <Text
                                style={[
                                  styles.teamFilterChipText,
                                  isActive && styles.teamFilterChipTextActive,
                                ]}
                              >
                                {value}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  missingText: {
    fontSize: 16,
    color: palette.textSecondary,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
    gap: 18,
  },
  heroCard: {
    backgroundColor: palette.highlight,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.highlightBorder,
    shadowColor: palette.surfaceShadow,
    shadowOpacity: 0.35,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  heroImage: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  heroImagePlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroImagePlaceholderText: {
    fontSize: 48,
    fontWeight: "800",
    color: palette.textMuted,
  },
  heroImageDesktop: {
    alignSelf: "center",
    width: "75%",
    maxWidth: 560,
    height: 200,
    aspectRatio: undefined,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: 16,
  },
  heroImagePlaceholderDesktop: {
    alignSelf: "center",
    width: "75%",
    maxWidth: 560,
    height: 200,
    aspectRatio: undefined,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  heroTitleBlock: {
    flexShrink: 1,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: palette.textPrimary,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: palette.textSecondary,
  },
  heroBadge: {
    backgroundColor: palette.accentSoft,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.accentBorder,
  },
  heroBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.accent,
    letterSpacing: 0.5,
  },
  heroDescription: {
    fontSize: 15,
    color: palette.textPrimary,
    lineHeight: 22,
  },
  heroDescriptionMuted: {
    fontSize: 15,
    color: palette.textMuted,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    shadowColor: palette.surfaceShadow,
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    gap: 14,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  teamFilterButton: {
    backgroundColor: palette.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.accentBorder,
  },
  teamFilterButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  filterHint: {
    fontSize: 12,
    color: palette.textMuted,
    marginTop: -4,
    marginBottom: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "rgba(19, 9, 20, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "60%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a3a",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  closeButton: {
    padding: 8,
    backgroundColor: "#2a2a3a",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  teamFilterPanel: {
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    borderRadius: 14,
    padding: 12,
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  teamFilterSection: {
    gap: 6,
  },
  teamFilterTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.textSecondary,
    letterSpacing: 0.4,
  },
  teamFilterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  teamFilterChip: {
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(255, 255, 255, 0.015)",
  },
  teamFilterChipActive: {
    borderColor: palette.accent,
    backgroundColor: palette.accentSoft,
  },
  teamFilterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textSecondary,
  },
  teamFilterChipTextActive: {
    color: palette.accent,
  },
  teamFilterClearButton: {
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  teamFilterClearButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textMuted,
  },
  section: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  chipIconOnly: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  chipIcon: {
    width: 22,
    height: 22,
  },
  chipNeutral: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#140a1a",
  },
  chipNeutralText: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  emptyValue: {
    fontSize: 13,
    color: palette.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: palette.divider,
    marginVertical: 8,
  },
  teamCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    gap: 12,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamName: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.textPrimary,
    flexShrink: 1,
    paddingRight: 12,
  },
  teamIdBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  teamIdText: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textMuted,
    letterSpacing: 0.5,
  },
  teamRightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamRatingBadge: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accentBorder,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  teamRatingText: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.accent,
    letterSpacing: 0.5,
  },
  teamNotes: {
    fontSize: 12,
    color: palette.textSecondary,
    lineHeight: 18,
  },
  memberGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  memberCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderRadius: 14,
    padding: 10,
    minWidth: 150,
    gap: 12,
    position: "relative",
  },
  memberCardActive: {
    zIndex: 20,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 2,
    borderColor: palette.surfaceBorder,
  },
  memberPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  memberPlaceholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textMuted,
  },
  memberInfo: {
    flex: 1,
    justifyContent: "center",
  },
  memberName: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
    marginBottom: 6,
  },
  memberMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  memberChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  memberChipIconOnly: {
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  memberChipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#140a1a",
  },
  memberChipIcon: {
    width: 18,
    height: 18,
  },
  memberRolePill: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  memberRoleText: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textSecondary,
  },
  memberHoverCard: {
    position: "absolute",
    top: -160,
    left: -8,
    width: 220,
    backgroundColor: "#1c1024",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: palette.surfaceShadow,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    zIndex: 30,
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
    backgroundColor: "#191222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    gap: 6,
  },
  memberHoverBadgeFill: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: "#6b7280",
  },
  memberHoverBadgeText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  memberHoverStars: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  memberHoverStarValue: {
    fontSize: 12,
    color: palette.textSecondary,
    fontWeight: "600",
  },
  recommendationBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 32,
    alignItems: "center",
  },
  recommendationBadgeHigh: {
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    borderColor: "rgba(34, 197, 94, 0.4)",
  },
  recommendationBadgeMedium: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  recommendationBadgeLow: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  recommendationText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  recommendationSummary: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryItem: {
    flexDirection: "column",
    alignItems: "center",
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#60a5fa",
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 12,
  },
  bestMatchContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  bestMatchLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
  },
  bestMatchValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  qualityDistribution: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  qualityGroup: {
    alignItems: "center",
    flex: 1,
  },
  qualityCount: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  qualityGroupLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
  },
  teamCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  teamNameContainer: {
    flex: 1,
  },
  teamPowerDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  teamPowerText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginRight: 4,
  },
  scoreDisplay: {
    alignItems: "center",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.4)",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#60a5fa",
    marginBottom: 1,
  },
  scoreLabel: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  matchTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 6,
  },
  matchDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  matchBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  matchBadgeAdvantage: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  matchBadgeDisadvantage: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  matchBadgeNeutral: {
    backgroundColor: "rgba(156, 163, 175, 0.15)",
    borderColor: "rgba(156, 163, 175, 0.4)",
  },
  matchIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  matchText: {
    fontSize: 10,
    fontWeight: "500",
  },
  matchTextAdvantage: {
    color: "#10b981",
  },
  matchTextDisadvantage: {
    color: "#ef4444",
  },
  matchTextNeutral: {
    color: "#9ca3af",
  },
  summaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryBadgeHigh: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "rgba(16, 185, 129, 0.4)",
  },
  summaryBadgeMedium: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "rgba(245, 158, 11, 0.4)",
  },
  summaryBadgeLow: {
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "rgba(239, 68, 68, 0.4)",
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 4,
  },
  summaryValueMuted: {
    fontSize: 18,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 2,
  },
  qualityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  qualityLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
  },
  qualityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  qualityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  qualityDotHigh: {
    backgroundColor: "#10b981",
  },
  qualityDotMedium: {
    backgroundColor: "#f59e0b",
  },
  qualityDotLow: {
    backgroundColor: "#ef4444",
  },
  qualityText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
  },
  teamCardExcellent: {
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  teamCardGood: {
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
  },
  teamCardFair: {
    borderLeftWidth: 3,
    borderLeftColor: "#ef4444",
  },
  teamTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  teamSubInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  teamSubDivider: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 6,
  },
  recommendationSection: {
    alignItems: "center",
  },
  recommendationBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
  },
  recommendationBadgeHighLarge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    borderColor: "#10b981",
  },
  recommendationBadgeMediumLarge: {
    backgroundColor: "rgba(245, 158, 11, 0.2)",
    borderColor: "#f59e0b",
  },
  recommendationBadgeLowLarge: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderColor: "#ef4444",
  },
  recommendationScoreText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 1,
  },
  recommendationLabelText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsSummary: {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  statsSummaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
    textAlign: "center",
  },
  statsGrid: {
    gap: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsRowSingle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#60a5fa",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
  },
  affinityList: {
    gap: 8,
  },
  affinityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  affinityLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  affinityIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  affinityLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.textPrimary,
  },
  affinityRight: {
    marginLeft: 12,
  },
  scoreBar: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  scoreText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
