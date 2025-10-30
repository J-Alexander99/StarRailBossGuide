import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CHARACTERS, Character } from "../data/characters";
import { getElementIcon, getPathIcon } from "../constants/iconMappings";
import { getCharacterImage } from "../constants/characterImageMappings";

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

type FilterState = {
  element: string | null;
  path: string | null;
  role: string | null;
  meta: string | null;
  sortBy: "name" | "rating" | "element" | "path" | "role";
  sortOrder: "asc" | "desc";
};

export function CharactersScreen() {
  const navigation = useNavigation();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    element: null,
    path: null,
    role: null,
    meta: null,
    sortBy: "name",
    sortOrder: "asc",
  });

  const filteredAndSortedCharacters = useMemo(() => {
    let result = [...CHARACTERS];

    // Apply filters
    if (filters.element) {
      result = result.filter((char) => char.element === filters.element);
    }
    if (filters.path) {
      result = result.filter((char) => char.path === filters.path);
    }
    if (filters.role) {
      result = result.filter((char) => char.role === filters.role);
    }
    if (filters.meta) {
      result = result.filter((char) => char.meta === filters.meta);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal, bVal;

      switch (filters.sortBy) {
        case "rating":
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case "element":
          aVal = a.element;
          bVal = b.element;
          break;
        case "path":
          aVal = a.path || "";
          bVal = b.path || "";
          break;
        case "role":
          aVal = a.role || "";
          bVal = b.role || "";
          break;
        default:
          aVal = a.name;
          bVal = b.name;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return filters.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      const comparison = String(aVal).localeCompare(String(bVal));
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [filters]);

  const renderGameModeStars = (
    mocRating?: number,
    pfRating?: number,
    asRating?: number
  ) => {
    const renderModeStars = (rating: number, color: string, key: string) => {
      // Each mode has 5 stars, each half star = 1 point (so 10 points = 5 full stars)
      // rating is 0-10, we want 0-5 stars
      const halfStars = Math.min(rating, 10); // Clamp to max 10
      const fullStars = Math.floor(halfStars / 2);
      const hasHalfStar = halfStars % 2 === 1;
      const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

      return (
        <View key={key} style={{ flexDirection: "row" }}>
          <Text style={{ color, fontSize: 16, letterSpacing: 1 }}>
            {"★".repeat(fullStars)}
            {hasHalfStar ? "⯨" : ""}
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 16, letterSpacing: 1 }}>
            {"☆".repeat(emptyStars)}
          </Text>
        </View>
      );
    };

    return (
      <View style={styles.gameModeStarsContainer}>
        {renderModeStars(mocRating || 0, "#ef4444", "moc")}
        {renderModeStars(pfRating || 0, "#3b82f6", "pf")}
        {renderModeStars(asRating || 0, "#a855f7", "as")}
      </View>
    );
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
        data={filteredAndSortedCharacters}
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
            <View style={styles.iconButtonRow}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowFilterModal(true)}
              >
                <Text style={styles.iconButtonEmoji}>🔍</Text>
                <Text style={styles.iconButtonLabel}>Filter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate("Teams" as never)}
              >
                <Image
                  source={require("../../images/icons/Team - Transparent.png")}
                  style={styles.iconButtonImage}
                />
                <Text style={styles.iconButtonLabel}>Teams</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          const ratingValue = item.rating ?? 0;
          // Convert rating from 30-point scale to percentage
          const ratingPercent =
            Math.max(0, Math.min(30, ratingValue)) * (100 / 30);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                (navigation as any).navigate("CharacterDetail", {
                  characterId: item.id,
                });
              }}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View style={styles.avatarWrapper}>
                  {getCharacterImage(item.id) ? (
                    <Image
                      source={getCharacterImage(item.id)!}
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
                        {item.rating ? `${item.rating}/30` : "Unrated"}
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
                    {renderGameModeStars(
                      item.mocRating,
                      item.pfRating,
                      item.asRating
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort Characters</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowFilterModal(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Clear Filters */}
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() =>
                  setFilters({
                    element: null,
                    path: null,
                    role: null,
                    meta: null,
                    sortBy: "name",
                    sortOrder: "asc",
                  })
                }
              >
                <Text style={styles.clearButtonText}>Clear All Filters</Text>
              </TouchableOpacity>

              {/* Sort Options */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.filterRow}>
                  {["name", "rating", "element", "path", "role"].map((sort) => (
                    <TouchableOpacity
                      key={sort}
                      style={[
                        styles.filterChip,
                        filters.sortBy === sort && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({ ...prev, sortBy: sort as any }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.sortBy === sort &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {sort.charAt(0).toUpperCase() + sort.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.sortOrder === "asc" && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, sortOrder: "asc" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.sortOrder === "asc" &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      Ascending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.sortOrder === "desc" && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, sortOrder: "desc" }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.sortOrder === "desc" &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      Descending
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Element Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Element</Text>
                <View style={styles.filterRow}>
                  {[
                    "Fire",
                    "Ice",
                    "Lightning",
                    "Physical",
                    "Quantum",
                    "Wind",
                    "Imaginary",
                  ].map((element) => (
                    <TouchableOpacity
                      key={element}
                      style={[
                        styles.filterChip,
                        filters.element === element && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          element: prev.element === element ? null : element,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.element === element &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {element}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Path Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Path</Text>
                <View style={styles.filterRow}>
                  {[
                    "Destruction",
                    "Hunt",
                    "Erudition",
                    "Harmony",
                    "Nihility",
                    "Preservation",
                    "Abundance",
                    "Remembrance",
                  ].map((path) => (
                    <TouchableOpacity
                      key={path}
                      style={[
                        styles.filterChip,
                        filters.path === path && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          path: prev.path === path ? null : path,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.path === path && styles.filterChipTextActive,
                        ]}
                      >
                        {path}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Role Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Role</Text>
                <View style={styles.filterRow}>
                  {["DPS", "Sub-DPS", "Support", "Sustain"].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={[
                        styles.filterChip,
                        filters.role === role && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          role: prev.role === role ? null : role,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.role === role && styles.filterChipTextActive,
                        ]}
                      >
                        {role}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Meta Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Meta Archetype</Text>
                <View style={styles.filterRow}>
                  {[
                    "DOT",
                    "Crit",
                    "Break",
                    "Follow-Up",
                    "Summon",
                    "General",
                    "Kevin",
                    "Raiden",
                    "Ultimate",
                  ].map((meta) => (
                    <TouchableOpacity
                      key={meta}
                      style={[
                        styles.filterChip,
                        filters.meta === meta && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          meta: prev.meta === meta ? null : meta,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.meta === meta && styles.filterChipTextActive,
                        ]}
                      >
                        {meta}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: 16,
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
  gameModeStarsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#ff6ce0",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
  },
  filterButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
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
  clearButton: {
    backgroundColor: "#444455",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#2a2a3a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: "#ff6ce0",
  },
  filterChipText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  iconButtonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  iconButton: {
    backgroundColor: "rgba(255, 108, 224, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 80,
    flex: 1,
    marginHorizontal: 8,
  },
  iconButtonEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconButtonImage: {
    width: 24,
    height: 24,
    marginBottom: 4,
    tintColor: "#ff6ce0",
  },
  iconButtonLabel: {
    color: "#ff6ce0",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
