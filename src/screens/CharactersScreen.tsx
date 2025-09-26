import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import { CHARACTERS } from "../data/characters";
import { getElementIcon, getPathIcon } from "../constants/iconMappings";

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
  Remembrance: "#6366f1",
};

const ROLE_COLORS: Record<string, string> = {
  "Sub-DPS": "#f97316",
  DPS: "#ef4444",
  Support: "#22c55e",
  Sustain: "#14b8a6",
};

export function CharactersScreen() {
  const getCharacterImage = (characterId: string) => {
    try {
      return require(`../../images/${characterId}.webp`);
    } catch (error) {
      // Fallback to a placeholder or return null if image doesn't exist
      return null;
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return "";
    return "★".repeat(rating) + "☆".repeat(10 - rating);
  };

  const renderBadge = (
    label: string,
    color: string,
    icon?: ImageSourcePropType
  ) => {
    if (icon) {
      return (
        <View style={styles.badgeIconWrapper}>
          <Image source={icon} style={styles.badgeIcon} resizeMode="contain" />
        </View>
      );
    }

    return (
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={CHARACTERS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trailblazer Roster</Text>
            <Text style={styles.headerSubtitle}>
              Browse every playable character, their speciality, and how they
              rank in the current meta.
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const ratingValue = item.rating ?? 0;
          const ratingPercent = Math.max(0, Math.min(10, ratingValue)) * 10;

          return (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  {getCharacterImage(item.id) ? (
                    <Image
                      source={getCharacterImage(item.id)}
                      style={styles.characterImage}
                    />
                  ) : (
                    <View
                      style={[styles.characterImage, styles.placeholderImage]}
                    >
                      <Text style={styles.placeholderText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.info}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{item.name}</Text>
                    {item.meta && (
                      <View style={styles.metaPill}>
                        <Text style={styles.metaPillText}>{item.meta}</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.badgeRow}>
                    {renderBadge(
                      item.element,
                      ELEMENT_COLORS[item.element] ?? "#475569",
                      getElementIcon(item.element)
                    )}
                    {item.path &&
                      renderBadge(
                        item.path,
                        PATH_COLORS[item.path] ?? "#334155",
                        getPathIcon(item.path)
                      )}
                    {item.role &&
                      renderBadge(
                        item.role,
                        ROLE_COLORS[item.role] ?? "#1e293b"
                      )}
                  </View>
                  <View style={styles.ratingSection}>
                    <View style={styles.ratingTopRow}>
                      <Text style={styles.ratingLabel}>Rating</Text>
                      <Text style={styles.ratingValue}>
                        {item.rating ? `${item.rating}/10` : "Unrated"}
                      </Text>
                    </View>
                    <View style={styles.ratingBar}>
                      <View
                        style={[
                          styles.ratingFill,
                          { width: `${ratingPercent}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.starString}>
                      {renderStars(item.rating)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#130914",
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 18,
    backgroundColor: "#1c1024",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#2f1b3d",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f4ecff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c7b9d6",
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#191222",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "#2a1538",
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 7,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingRight: 4,
  },
  avatarWrapper: {
    marginRight: 18,
    padding: 5,
    borderRadius: 18,
    backgroundColor: "#23132f",
  },
  characterImage: {
    width: 72,
    height: 72,
    borderRadius: 14,
    backgroundColor: "#2b183a",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9c86c0",
  },
  info: {
    flex: 1,
    marginLeft: 2,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f3ecff",
    flexShrink: 1,
  },
  metaPill: {
    backgroundColor: "rgba(190, 160, 222, 0.22)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(205, 175, 235, 0.35)",
  },
  metaPillText: {
    fontSize: 12,
    color: "#e1d0ff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#160b1e",
  },
  badgeIconWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  badgeIcon: {
    width: 24,
    height: 24,
  },
  ratingSection: {
    gap: 6,
  },
  ratingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#b59ed2",
    textTransform: "uppercase",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f3ecff",
  },
  ratingBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#2b1a35",
    overflow: "hidden",
  },
  ratingFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#fbbf24",
  },
  starString: {
    fontSize: 14,
    letterSpacing: 2,
    color: "#facc15",
  },
});
