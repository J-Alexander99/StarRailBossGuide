import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageSourcePropType,
  useWindowDimensions,
} from "react-native";
import {
  BOSSES,
  getBossAttributes,
  getBossAffinities,
  getEffectivenessScore,
  type EffectivenessScore,
} from "../data/bosses";
import { CHARACTERS } from "../data/characters";
import {
  getRecommendedTeamsSorted,
} from "../data/teams";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { getElementIcon } from "../constants/iconMappings";
import { getBossImage } from "../constants/bossImageMappings";
import { getCharacterImage } from "../constants/characterImageMappings";

type RecommendedTeam = {
  team: any;
  members: any[];
  teamPower: number;
  score: number;
  isAvailable: boolean;
};

type ScoreThresholds = {
  excellentMin: number;
  goodMin: number;
};

function quantile(values: number[], q: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const position = Math.min(sorted.length - 1, Math.max(0, (sorted.length - 1) * q));
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  const weight = position - lower;
  return sorted[lower] + (sorted[upper] - sorted[lower]) * weight;
}

function getScoreThresholds(scores: number[]): ScoreThresholds {
  if (!scores.length) {
    return { excellentMin: 0, goodMin: 0 };
  }

  return {
    excellentMin: quantile(scores, 0.8),
    goodMin: quantile(scores, 0.45),
  };
}

function getRecommendationTier(score: number, thresholds: ScoreThresholds) {
  if (score >= thresholds.excellentMin) return "EXCELLENT" as const;
  if (score >= thresholds.goodMin) return "GOOD" as const;
  return "FAIR" as const;
}

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
  Burn: "#fb923c",
  Freeze: "#38bdf8",
};

const RANGE_COLORS: Record<string, string> = {
  Single: "#ec4899",
  Blast: "#f97316",
  AoE: "#22d3ee",
  Bounce: "#a855f7",
};

// Score colors for effectiveness display
const SCORE_COLORS: Record<EffectivenessScore, string> = {
  2: "#a855f7", // Very Good - Purple
  1: "#84cc16", // Good - Light Green
  0: "#64748b", // Neutral - Gray
  "-1": "#f97316", // Bad - Orange
  "-2": "#ef4444", // Very Bad - Red
};

const SCORE_LABELS: Record<EffectivenessScore, string> = {
  2: "Very Effective",
  1: "Effective",
  0: "Neutral",
  "-1": "Resisted",
  "-2": "Highly Resisted",
};

const ensureArray = (values: string[]): string[] => {
  const seen = new Set<string>();
  return values
    .map((value) => value.trim().replace(/\s+/g, " "))
    .filter((value) => {
      if (!value) return false;
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
};

export function BossDetailScreen({ route }: any) {
  const { bossId } = route.params;
  const boss = BOSSES.find((b) => b.id === bossId);
  const { isCharacterOwned } = useCharacterOwnership();
  const { width } = useWindowDimensions();

  if (!boss) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.missingText}>Boss not found</Text>
      </View>
    );
  }

  // Get both old and new format data
  const { weaknesses, resistances, metaWeaknesses, metaResistances } =
    getBossAttributes(boss);
  const affinities = getBossAffinities(boss);

  const { filteredTeams, excludedTeamsCount, totalTeamsCount } = useMemo(() => {
    const recommendedTeams: RecommendedTeam[] = getRecommendedTeamsSorted(
      weaknesses,
      resistances,
      metaWeaknesses,
      metaResistances,
      false, // Don't filter by availability yet
      isCharacterOwned
    );

    const availableTeams = recommendedTeams.filter(
      (t: RecommendedTeam) => t.isAvailable
    );
    const excludedCount = recommendedTeams.length - availableTeams.length;

    return {
      filteredTeams: availableTeams,
      excludedTeamsCount: excludedCount,
      totalTeamsCount: recommendedTeams.length,
    };
  }, [
    weaknesses,
    resistances,
    metaWeaknesses,
    metaResistances,
    isCharacterOwned,
  ]);

  const scoreThresholds = useMemo(
    () => getScoreThresholds(filteredTeams.map((team) => team.score)),
    [filteredTeams]
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

  const renderChipGroup = (
    title: string,
    values: string[],
    colorMap: Record<string, string>,
    iconResolver?: (value: string) => ImageSourcePropType | undefined
  ) => {
    const cleaned = ensureArray(values);
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {cleaned.length ? (
          <View style={styles.chipRow}>
            {cleaned.map((value) => {
              const icon = iconResolver?.(value);
              const hasIcon = Boolean(icon);
              const baseStyles = hasIcon
                ? [styles.chip, styles.chipIconOnly]
                : iconResolver
                ? [styles.chip, styles.chipNeutral]
                : [
                    styles.chip,
                    {
                      backgroundColor: colorMap[value] ?? palette.chipFallback,
                    },
                  ];

              return (
                <View key={`${title}-${value}`} style={baseStyles}>
                  {hasIcon ? (
                    <Image
                      source={icon!}
                      style={styles.chipIcon}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text
                      style={
                        iconResolver ? styles.chipNeutralText : styles.chipText
                      }
                    >
                      {value}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyValue}>None</Text>
        )}
      </View>
    );
  };

  // New rendering function for scored affinities
  const renderAffinitySection = (
    title: string,
    affinities: Record<string, EffectivenessScore> | undefined,
    iconResolver?: (value: string) => ImageSourcePropType | undefined
  ) => {
    if (!affinities || Object.keys(affinities).length === 0) {
      return null;
    }

    // Sort by score (highest to lowest) for better visual flow
    const sortedEntries = Object.entries(affinities).sort(
      ([, a], [, b]) => b - a
    );

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
        {/* Use new scoring system if available, otherwise fall back to legacy */}
        {affinities.elements && Object.keys(affinities.elements).length > 0 ? (
          <>
            {renderAffinitySection(
              "Elemental Effectiveness",
              affinities.elements,
              getElementIcon
            )}
            {renderAffinitySection("Range Effectiveness", affinities.ranges)}
            {renderAffinitySection("Meta Effectiveness", affinities.meta)}
          </>
        ) : (
          <>
            {renderChipGroup(
              "Elemental Weaknesses",
              weaknesses,
              ELEMENT_COLORS,
              getElementIcon
            )}
            {renderChipGroup(
              "Elemental Resistances",
              resistances,
              ELEMENT_COLORS,
              getElementIcon
            )}
            {renderChipGroup("Meta Weakness", metaWeaknesses, META_COLORS)}
            {renderChipGroup("Meta Resistance", metaResistances, META_COLORS)}
          </>
        )}
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Recommended Strike Teams</Text>

        {/* Team Statistics Summary */}
        {filteredTeams.length > 0 &&
          (() => {
            const allCharacters = CHARACTERS;
            const totalTeams = totalTeamsCount;

            // Calculate statistics
            const averageRating =
              filteredTeams.reduce(
                (sum, { teamPower }) => sum + teamPower,
                0
              ) / filteredTeams.length;
            const averagePower =
              filteredTeams.reduce((sum, { score }) => sum + score, 0) /
              filteredTeams.length;

            // Get all unique characters used in recommended teams
            const usedCharacterIds = new Set<string>();
            filteredTeams.forEach(({ members }) => {
              members.forEach((member) => usedCharacterIds.add(member.id));
            });

            // Count most common attributes
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
              (a, b) => (elementCounts[a[0]] > elementCounts[b[0]] ? a : b)
            )[0];
            const mostCommonMeta =
              Object.keys(metaCounts).length > 0
                ? Object.entries(metaCounts).reduce((a, b) =>
                    metaCounts[a[0]] > metaCounts[b[0]] ? a : b
                  )[0]
                : "None";
            const mostCommonPath =
              Object.keys(pathCounts).length > 0
                ? Object.entries(pathCounts).reduce((a, b) =>
                    pathCounts[a[0]] > pathCounts[b[0]] ? a : b
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
          filteredTeams.map(({ team, members, teamPower, score }: RecommendedTeam) => {
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
              {/* Header with recommendation score prominence */}
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

              {team.notes && <Text style={styles.teamNotes}>{team.notes}</Text>}
              <View style={styles.memberGrid}>
                {members.map((member) => {
                  const memberImage = getCharacterImage(member.id);
                  const elementIcon = getElementIcon(member.element);

                  return (
                    <View key={member.id} style={styles.memberCard}>
                      {memberImage ? (
                        <Image
                          source={memberImage}
                          style={styles.memberAvatar}
                        />
                      ) : (
                        <View
                          style={[
                            styles.memberAvatar,
                            styles.memberPlaceholder,
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
                            <View style={styles.memberRolePill}>
                              <Text style={styles.memberRoleText}>
                                {member.role}
                              </Text>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          );
          })
        ) : (
          <Text style={styles.emptyValue}>
            No strike teams match the documented weaknesses with your current
            roster.
          </Text>
        )}
      </View>
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
  filterHint: {
    fontSize: 12,
    color: palette.textMuted,
    marginTop: -4,
    marginBottom: 4,
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
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
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
  },
  memberRoleText: {
    fontSize: 11,
    fontWeight: "600",
    color: palette.textSecondary,
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
  // Recommendation Summary Styles
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
  // Enhanced Team Card Styles
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
  // Summary Badge Styles
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
  // Quality Distribution Styles
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
  // Enhanced Team Card Quality Styles
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

  // Statistics Summary Styles
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

  // New Affinity Scoring Styles
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
