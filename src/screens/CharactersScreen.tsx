import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { CHARACTERS } from "../data/characters";

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

  const renderBadge = (label: string, color: string) => (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{label}</Text>
    </View>
  );

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
                      ELEMENT_COLORS[item.element] ?? "#475569"
                    )}
                    {item.path &&
                      renderBadge(
                        item.path,
                        PATH_COLORS[item.path] ?? "#334155"
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
    backgroundColor: "#0f172a",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarWrapper: {
    marginRight: 16,
  },
  characterImage: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: "#1f2937",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#475569",
  },
  info: {
    flex: 1,
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
    color: "#f8fafc",
    flexShrink: 1,
  },
  metaPill: {
    backgroundColor: "rgba(148, 163, 184, 0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  metaPillText: {
    fontSize: 12,
    color: "#cbd5f5",
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
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0f172a",
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
    color: "#94a3b8",
    textTransform: "uppercase",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f8fafc",
  },
  ratingBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#334155",
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
