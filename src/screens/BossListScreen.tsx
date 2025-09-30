import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { BOSSES, Boss, getBossAttributes } from "../data/bosses";
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

export function BossListScreen({ navigation }: { navigation: any }) {
  const renderChips = (
    title: string,
    values: string[],
    colorMap: Record<string, string>,
    defaultColor: string,
    iconResolver?: (value: string) => ImageSourcePropType | undefined
  ) => {
    const normalized = ensureArray(values);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {normalized.length ? (
          <View style={styles.chipRow}>
            {normalized.map((value) => {
              const icon = iconResolver?.(value);
              const hasIcon = Boolean(icon);
              const baseStyles = hasIcon
                ? [styles.chip, styles.chipIconOnly]
                : iconResolver
                ? [styles.chip, styles.chipNeutral]
                : [
                    styles.chip,
                    {
                      backgroundColor: colorMap[value] ?? defaultColor,
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

  const renderItem = ({ item }: { item: Boss }) => {
    const { weaknesses, resistances, metaWeaknesses, metaResistances } =
      getBossAttributes(item);
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
          <Text style={styles.description}>{descriptionText}</Text>
        ) : null}

        <View style={styles.divider} />

        {renderChips(
          "Weaknesses",
          weaknesses,
          ELEMENT_COLORS,
          palette.chipFallback,
          getElementIcon
        )}
        {renderChips(
          "Resistances",
          resistances,
          ELEMENT_COLORS,
          palette.chipFallback,
          getElementIcon
        )}
        {renderChips(
          "Meta Weakness",
          metaWeaknesses,
          META_COLORS,
          palette.chipFallback
        )}
        {renderChips(
          "Meta Resistance",
          metaResistances,
          META_COLORS,
          palette.chipFallback
        )}
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
    marginBottom: 14,
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
});
