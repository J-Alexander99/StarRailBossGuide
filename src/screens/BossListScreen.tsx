import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import {
  BOSSES,
  Boss,
  getBossAffinities,
  type EffectivenessScore,
} from "../data/bosses";
import { getElementIcon } from "../constants/iconMappings";
import { getBossImage } from "../constants/bossImageMappings";

const palette = {
  background: "#130914",
  card: "#191222",
  cardBorder: "rgba(255, 255, 255, 0.05)",
  cardShadow: "#2a1538",
  headerBg: "#1c1024",
  headerBorder: "rgba(255, 255, 255, 0.06)",
  textPrimary: "#f4ecff",
  textSecondary: "#c7b9d6",
  textMuted: "#9f8ab8",
  chipFallback: "#2a1b34",
  divider: "rgba(255, 255, 255, 0.08)",
  accent: "#ff6ce0",
};

// Score colors for effectiveness display
const SCORE_COLORS: Record<EffectivenessScore, string> = {
  2: "#a855f7", // Very Good - Purple
  1: "#84cc16", // Good - Light Green
  0: "#64748b", // Neutral - Gray
  "-1": "#f97316", // Bad - Orange
  "-2": "#ef4444", // Very Bad - Red
};

export function BossListScreen({ navigation }: { navigation: any }) {
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set(),
  );

  const toggleDescription = (bossId: string) => {
    setExpandedDescriptions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bossId)) {
        newSet.delete(bossId);
      } else {
        newSet.add(bossId);
      }
      return newSet;
    });
  };

  const renderAffinityBadges = (
    affinities: Record<string, EffectivenessScore> | undefined,
    iconResolver?: (value: string) => ImageSourcePropType | undefined,
  ) => {
    if (!affinities || Object.keys(affinities).length === 0) {
      return null;
    }

    // Only show positive scores (effective) and negative scores (resisted) in list view
    const effectiveEntries = Object.entries(affinities)
      .filter(([, score]) => score !== 0)
      .sort(([, a], [, b]) => b - a);

    if (effectiveEntries.length === 0) return null;

    return (
      <View style={styles.affinityBadgeContainer}>
        {effectiveEntries.map(([key, score]) => {
          const icon = iconResolver?.(key);
          const scoreColor = SCORE_COLORS[score];

          return (
            <View
              key={key}
              style={[
                styles.affinityBadge,
                {
                  backgroundColor: scoreColor + "20",
                  borderColor: scoreColor + "60",
                },
              ]}
            >
              {icon && (
                <Image
                  source={icon}
                  style={styles.affinityBadgeIcon}
                  resizeMode="contain"
                />
              )}
              {!icon && (
                <Text style={[styles.affinityBadgeText, { color: scoreColor }]}>
                  {key}
                </Text>
              )}
              <View
                style={[
                  styles.affinityScoreDot,
                  { backgroundColor: scoreColor },
                ]}
              />
            </View>
          );
        })}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Boss }) => {
    const affinities = getBossAffinities(item);
    const bossImageSource = getBossImage(item.image);

    const descriptionText = item.description?.trim();
    const locationText = item.location?.trim();

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => navigation.navigate("BossDetail", { bossId: item.id })}
      >
        <View style={styles.cardHeader}>
          {bossImageSource ? (
            <Image
              source={bossImageSource}
              style={styles.thumbnail}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.thumbnailPlaceholderText}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.headerContent}>
            <View style={styles.headerTopRow}>
              <Text style={styles.title}>{item.name}</Text>
              <View style={styles.idPill}>
                <Text style={styles.idText}>#{item.id}</Text>
              </View>
            </View>
            <Text style={styles.subtitle}>
              {locationText?.length ? locationText : "Unknown location"}
            </Text>
          </View>
        </View>

        {descriptionText?.length ? (
          <View style={styles.descriptionContainer}>
            {!expandedDescriptions.has(item.id) ? (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleDescription(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.expandButtonText}>Show Description</Text>
                <Text style={styles.expandIcon}>+</Text>
              </TouchableOpacity>
            ) : (
              <View>
                <Text style={styles.description}>{descriptionText}</Text>
                <TouchableOpacity
                  style={styles.collapseButton}
                  onPress={() => toggleDescription(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.collapseIcon}>−</Text>
                  <Text style={styles.collapseButtonText}>
                    Hide Description
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : null}

        <View style={styles.divider} />

        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Element Effectiveness</Text>
            {renderAffinityBadges(affinities.elements, getElementIcon)}
          </View>
          {affinities.ranges && Object.keys(affinities.ranges).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Range Effectiveness</Text>
              {renderAffinityBadges(affinities.ranges)}
            </View>
          )}
          {affinities.meta && Object.keys(affinities.meta).length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meta Effectiveness</Text>
              {renderAffinityBadges(affinities.meta)}
            </View>
          )}
        </>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={BOSSES}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Boss Intel Archive</Text>
            <Text style={styles.headerSubtitle}>
              Review every encounter at a glance. Tap a boss to drill into
              guides, recommended teams, and counterplay notes.
            </Text>
          </View>
        }
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
    backgroundColor: palette.headerBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.headerBorder,
    shadowColor: palette.cardShadow,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: palette.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.cardBorder,
    shadowColor: palette.cardShadow,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 16,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  thumbnailPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailPlaceholderText: {
    fontSize: 26,
    fontWeight: "700",
    color: palette.textMuted,
  },
  headerContent: {
    flex: 1,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.textPrimary,
    flexShrink: 1,
    marginRight: 12,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: palette.textSecondary,
  },
  idPill: {
    backgroundColor: "rgba(255, 108, 224, 0.18)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.35)",
  },
  idText: {
    fontSize: 12,
    fontWeight: "700",
    color: palette.accent,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: palette.textMuted,
    lineHeight: 20,
    marginBottom: 12,
  },
  descriptionContainer: {
    marginBottom: 14,
  },
  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255, 108, 224, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.2)",
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: palette.accent,
  },
  expandIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.accent,
  },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: "rgba(255, 108, 224, 0.05)",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
  },
  collapseButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: palette.textMuted,
    marginLeft: 6,
  },
  collapseIcon: {
    fontSize: 16,
    fontWeight: "700",
    color: palette.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: palette.divider,
    marginBottom: 14,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: palette.textSecondary,
    textTransform: "uppercase",
    marginBottom: 6,
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
  chipNeutral: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipIcon: {
    width: 22,
    height: 22,
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
    fontSize: 12,
    color: palette.textMuted,
  },

  // New Affinity Badge Styles
  affinityBadgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  affinityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    gap: 6,
  },
  affinityBadgeIcon: {
    width: 18,
    height: 18,
  },
  affinityBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  affinityScoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
