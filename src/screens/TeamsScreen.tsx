import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { TEAMS, resolveTeamMembers } from "../data/teams";
import { getCharacterImage } from "../constants/characterImageMappings";
import { getElementIcon, getPathIcon } from "../constants/iconMappings";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { getCharacterPalette } from "../constants/characterPalettes";

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

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type FilterState = {
  availability: "all" | "available" | "unavailable";
  minRating: number;
  maxRating: number;
  sortBy: "name" | "rating" | "id";
  sortOrder: "asc" | "desc";
  element: string | null;
  path: string | null;
  role: string | null;
  meta: string | null;
  target: string | null;
  containsAll: boolean; // true = team must have ALL selected attributes, false = team must have ANY
};

export function TeamsScreen() {
  const navigation = useNavigation();
  const { isCharacterOwned } = useCharacterOwnership();
  const isWeb = Platform.OS === "web";
  const [hoveredMemberKey, setHoveredMemberKey] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    availability: "all",
    minRating: 0,
    maxRating: 120,
    sortBy: "name",
    sortOrder: "asc",
    element: null,
    path: null,
    role: null,
    meta: null,
    target: null,
    containsAll: false,
  });

  const enrichedTeams = useMemo(() => {
    return TEAMS.map((team) => {
      const members = resolveTeamMembers(team);
      const computedPower = members.reduce(
        (sum, m) => sum + (m.rating || 0),
        0,
      );
      const teamPower =
        Number.isFinite(team.teamRating) && (team.teamRating as number) > 0
          ? (team.teamRating as number)
          : computedPower;

      return {
        team,
        members,
        teamPower,
      };
    });
  }, []);

  const { availableTeams, unavailableTeams, filteredAndSortedTeams } =
    useMemo(() => {
      const available = enrichedTeams.filter(({ members }) =>
        members.every((member) => isCharacterOwned(member.id)),
      );
      const unavailable = enrichedTeams.filter(
        ({ members }) =>
          !members.every((member) => isCharacterOwned(member.id)),
      );

      // Apply filters
      let teamsToFilter = enrichedTeams;
      if (filters.availability === "available") {
        teamsToFilter = available;
      } else if (filters.availability === "unavailable") {
        teamsToFilter = unavailable;
      }

      // Filter by rating range and character attributes
      const filtered = teamsToFilter.filter(({ teamPower, members }) => {
        const rating = teamPower || 0;
        if (rating < filters.minRating || rating > filters.maxRating) {
          return false;
        }

        // Check character attribute filters
        const attributeFilters = [
          { filter: filters.element, memberAttribute: "element" },
          { filter: filters.path, memberAttribute: "path" },
          { filter: filters.role, memberAttribute: "role" },
          { filter: filters.meta, memberAttribute: "meta" },
          { filter: filters.target, memberAttribute: "target" },
        ].filter((f) => f.filter !== null);

        if (attributeFilters.length === 0) return true;

        if (filters.containsAll) {
          // Team must have ALL selected attributes
          return attributeFilters.every(({ filter, memberAttribute }) =>
            members.some(
              (member) => (member as any)[memberAttribute] === filter,
            ),
          );
        } else {
          // Team must have ANY of the selected attributes
          return attributeFilters.some(({ filter, memberAttribute }) =>
            members.some(
              (member) => (member as any)[memberAttribute] === filter,
            ),
          );
        }
      });

      // Sort teams
      const sorted = [...filtered].sort((a, b) => {
        let aValue, bValue;

        switch (filters.sortBy) {
          case "rating":
            aValue = a.teamPower || 0;
            bValue = b.teamPower || 0;
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
          return filters.sortOrder === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return filters.sortOrder === "asc"
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      });

      return {
        availableTeams: available,
        unavailableTeams: unavailable,
        filteredAndSortedTeams: sorted,
      };
    }, [enrichedTeams, isCharacterOwned, filters]);

  const calculateTeamModeRatings = (members: any[]) => {
    const mocTotal = members.reduce((sum, m) => sum + (m.mocRating || 0), 0);
    const pfTotal = members.reduce((sum, m) => sum + (m.pfRating || 0), 0);
    const asTotal = members.reduce((sum, m) => sum + (m.asRating || 0), 0);
    return { mocTotal, pfTotal, asTotal };
  };

  const renderGameModeStars = (
    mocTotal: number,
    pfTotal: number,
    asTotal: number,
    isAvailable: boolean,
  ) => {
    const renderModeStars = (rating: number, color: string, key: string) => {
      // Each mode: 4 points per half star, so 5 stars = 40 points
      const halfStars = Math.round(rating / 4);
      const fullStars = Math.floor(halfStars / 2);
      const hasHalfStar = halfStars % 2 === 1;
      const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

      return (
        <View key={key} style={{ flexDirection: "row" }}>
          <Text
            style={{
              color: isAvailable ? color : "#4b5563",
              fontSize: 16,
              letterSpacing: 1,
            }}
          >
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
        {renderModeStars(mocTotal, "#ef4444", "moc")}
        {renderModeStars(pfTotal, "#3b82f6", "pf")}
        {renderModeStars(asTotal, "#a855f7", "as")}
      </View>
    );
  };

  const renderTeamCard = ({
    item,
  }: {
    item: { team: any; members: any[]; teamPower: number };
  }) => {
    const { team, members, teamPower } = item;
    const isAvailable = members.every((member) => isCharacterOwned(member.id));

    return (
      <View style={[styles.teamCard, !isAvailable && styles.teamCardDisabled]}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamName}>
            {team.name ?? `Team ${team.id.toUpperCase()}`}
          </Text>
          <View
            style={[
              styles.teamIdBadge,
              !isAvailable && styles.teamIdBadgeDisabled,
            ]}
          >
            <Text
              style={[
                styles.teamIdText,
                !isAvailable && styles.teamIdTextDisabled,
              ]}
            >
              {team.id}
            </Text>
          </View>
        </View>
        {team.notes ? (
          <Text
            style={[styles.teamNotes, !isAvailable && styles.teamNotesDisabled]}
          >
            {team.notes}
          </Text>
        ) : null}
        <View
          style={[
            styles.teamRatingSection,
            !isAvailable && styles.teamRatingSectionDisabled,
          ]}
        >
          <View style={styles.teamRatingTopRow}>
            <Text
              style={[
                styles.teamRatingLabel,
                !isAvailable && styles.teamRatingLabelDisabled,
              ]}
            >
              Team Power
            </Text>
            <Text
              style={[
                styles.teamRatingValue,
                !isAvailable && styles.teamRatingValueDisabled,
              ]}
            >
              {teamPower || 0}/120
            </Text>
          </View>
          <View
            style={[
              styles.teamRatingBar,
              !isAvailable && styles.teamRatingBarDisabled,
            ]}
          >
            <View
              style={[
                styles.teamRatingFill,
                !isAvailable && styles.teamRatingFillDisabled,
                {
                  width: `${Math.min(100, ((teamPower || 0) / 120) * 100)}%`,
                },
              ]}
            />
          </View>
          {(() => {
            const { mocTotal, pfTotal, asTotal } =
              calculateTeamModeRatings(members);
            return renderGameModeStars(mocTotal, pfTotal, asTotal, isAvailable);
          })()}
        </View>
        <View style={styles.memberGrid}>
          {members.map((member) => {
            const memberImage = getCharacterImage(member.id);
            const elementIcon = getElementIcon(member.element);
            const pathIcon = getPathIcon(member.path);
            const isOwned = isCharacterOwned(member.id);
            const instanceKey = `${team.id}-${member.id}`;
            const paletteEntry = getCharacterPalette(member.id);
            const accent =
              paletteEntry?.accent ||
              ELEMENT_COLORS[member.element] ||
              PATH_COLORS[member.path] ||
              "#ff6ce0";
            const accentSoft =
              paletteEntry?.accentSoft ||
              (accent.startsWith("#")
                ? hexToRgba(accent, 0.18)
                : "rgba(255, 108, 224, 0.18)");
            const accentBorder =
              paletteEntry?.accentBorder ||
              (accent.startsWith("#")
                ? hexToRgba(accent, 0.45)
                : "rgba(255, 108, 224, 0.45)");

            return (
              <Pressable
                key={instanceKey}
                style={[
                  styles.memberCard,
                  hoveredMemberKey === instanceKey && styles.memberCardActive,
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
                <View style={styles.memberImageContainer}>
                  {memberImage ? (
                    <Image
                      source={memberImage}
                      style={[
                        styles.memberAvatar,
                        !isOwned && styles.memberAvatarDisabled,
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
                        !isOwned && styles.memberAvatarDisabled,
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
                  {!isOwned && <View style={styles.memberOverlay} />}
                </View>
                <View style={styles.memberInfo}>
                  <Text
                    style={[
                      styles.memberName,
                      !isOwned && styles.memberNameDisabled,
                    ]}
                  >
                    {member.name}
                  </Text>
                  <View style={styles.memberMetaRow}>
                    <View
                      style={[
                        styles.memberChip,
                        elementIcon
                          ? styles.memberChipIconOnly
                          : {
                              backgroundColor:
                                ELEMENT_COLORS[member.element] ?? "#64748b",
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
                    <View
                      style={[
                        styles.memberChip,
                        pathIcon
                          ? styles.memberChipIconOnly
                          : {
                              backgroundColor:
                                PATH_COLORS[member.path] ?? "#64748b",
                            },
                      ]}
                    >
                      {pathIcon ? (
                        <Image
                          source={pathIcon}
                          style={styles.memberChipIcon}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.memberChipText}>{member.path}</Text>
                      )}
                    </View>
                  </View>
                </View>
                {isWeb && hoveredMemberKey === instanceKey
                  ? renderMemberHoverCard(member, {
                      accent,
                      accentSoft,
                      accentBorder,
                    })
                  : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  };

  const renderMemberHoverCard = (
    member: any,
    colors: { accent: string; accentSoft: string; accentBorder: string },
  ) => {
    return (
      <View
        style={[
          styles.memberHoverCard,
          {
            borderColor: colors.accentBorder,
            backgroundColor: colors.accentSoft,
          },
        ]}
      >
        <View style={styles.memberHoverHeader}>
          <Text style={styles.memberHoverName}>{member.name}</Text>
          <Text style={[styles.memberHoverRating, { color: colors.accent }]}>
            {member.rating ? `${member.rating}/30` : "Unrated"}
          </Text>
        </View>
        <View style={styles.memberHoverBadges}>
          <View style={styles.memberHoverBadge}>
            <View
              style={[
                styles.memberHoverBadgeFill,
                {
                  backgroundColor:
                    ELEMENT_COLORS[member.element] ?? colors.accent,
                },
              ]}
            />
            <Text style={styles.memberHoverBadgeText}>{member.element}</Text>
          </View>
          {member.path && (
            <View style={styles.memberHoverBadge}>
              <View
                style={[
                  styles.memberHoverBadgeFill,
                  {
                    backgroundColor: PATH_COLORS[member.path] ?? colors.accent,
                  },
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
                  { backgroundColor: colors.accent },
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
                  { backgroundColor: colors.accent },
                ]}
              />
              <Text style={styles.memberHoverBadgeText}>{member.meta}</Text>
            </View>
          )}
        </View>
        <View style={styles.memberHoverStars}>
          <Text style={[styles.memberHoverStarValue, { color: colors.accent }]}>
            MoC {member.mocRating || 0}
          </Text>
          <Text style={[styles.memberHoverStarValue, { color: colors.accent }]}>
            PF {member.pfRating || 0}
          </Text>
          <Text style={[styles.memberHoverStarValue, { color: colors.accent }]}>
            AS {member.asRating || 0}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredAndSortedTeams}
        keyExtractor={(item) => item.team.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Strike Teams</Text>
            <Text style={styles.headerSubtitle}>
              Complete collection of team compositions for all encounters.
            </Text>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilterModal(true)}
            >
              <Text style={styles.filterButtonText}>🔍 Filter & Sort</Text>
            </TouchableOpacity>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{availableTeams.length}</Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{unavailableTeams.length}</Text>
                <Text style={styles.statLabel}>Missing Teams</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{TEAMS.length}</Text>
                <Text style={styles.statLabel}>Total Teams</Text>
              </View>
            </View>
          </View>
        }
        renderItem={renderTeamCard}
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
              <Text style={styles.modalTitle}>Filter & Sort Teams</Text>
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
                    availability: "all",
                    minRating: 0,
                    maxRating: 120,
                    sortBy: "name",
                    sortOrder: "asc",
                    element: null,
                    path: null,
                    role: null,
                    meta: null,
                    target: null,
                    containsAll: false,
                  })
                }
              >
                <Text style={styles.clearButtonText}>Clear All Filters</Text>
              </TouchableOpacity>

              {/* Sort Options */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Sort By</Text>
                <View style={styles.filterRow}>
                  {["name", "rating", "id"].map((sort) => (
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

              {/* Availability Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Availability</Text>
                <View style={styles.filterRow}>
                  {[
                    { key: "all", label: "All Teams" },
                    { key: "available", label: "Available Only" },
                    { key: "unavailable", label: "Missing Characters" },
                  ].map(({ key, label }) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.filterChip,
                        filters.availability === key && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          availability: key as any,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.availability === key &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Match Logic */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Match Logic</Text>
                <View style={styles.filterRow}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !filters.containsAll && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, containsAll: false }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        !filters.containsAll && styles.filterChipTextActive,
                      ]}
                    >
                      Any Match
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      filters.containsAll && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters((prev) => ({ ...prev, containsAll: true }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.containsAll && styles.filterChipTextActive,
                      ]}
                    >
                      Must Have All
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
                    "Elation",
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

              {/* Target Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Target Type</Text>
                <View style={styles.filterRow}>
                  {["Single", "Blast", "AoE", "Team"].map((target) => (
                    <TouchableOpacity
                      key={target}
                      style={[
                        styles.filterChip,
                        filters.target === target && styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          target: prev.target === target ? null : target,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.target === target &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {target}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating Range Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Team Power Range</Text>
                <View style={styles.filterRow}>
                  {[
                    { min: 0, max: 120, label: "All Power Levels" },
                    { min: 90, max: 120, label: "High Power (90-120)" },
                    { min: 60, max: 89, label: "Medium Power (60-89)" },
                    { min: 0, max: 59, label: "Low Power (0-59)" },
                  ].map(({ min, max, label }) => (
                    <TouchableOpacity
                      key={`${min}-${max}`}
                      style={[
                        styles.filterChip,
                        filters.minRating === min &&
                          filters.maxRating === max &&
                          styles.filterChipActive,
                      ]}
                      onPress={() =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating: min,
                          maxRating: max,
                        }))
                      }
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          filters.minRating === min &&
                            filters.maxRating === max &&
                            styles.filterChipTextActive,
                        ]}
                      >
                        {label}
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
    marginBottom: 20,
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
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: "#ff6ce0",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f4ecff",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#c7b9d6",
    lineHeight: 22,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(25, 18, 34, 0.6)",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 108, 224, 0.1)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ff6ce0",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#b8a6d9",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 108, 224, 0.2)",
    marginHorizontal: 16,
  },
  teamCard: {
    backgroundColor: "#191222",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    shadowColor: "#2a1538",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  teamCardDisabled: {
    opacity: 0.6,
    backgroundColor: "#151019",
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  teamName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f4ecff",
    flex: 1,
  },
  teamIdBadge: {
    backgroundColor: "rgba(255, 108, 224, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  teamIdBadgeDisabled: {
    backgroundColor: "rgba(100, 100, 100, 0.1)",
  },
  teamIdText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ff6ce0",
  },
  teamIdTextDisabled: {
    color: "#64748b",
  },
  teamRatingSection: {
    gap: 6,
    marginBottom: 16,
  },
  teamRatingSectionDisabled: {
    opacity: 0.6,
  },
  teamRatingTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamRatingLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#b59ed2",
    textTransform: "uppercase",
  },
  teamRatingLabelDisabled: {
    color: "#64748b",
  },
  teamRatingValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f3ecff",
  },
  teamRatingValueDisabled: {
    color: "#64748b",
  },
  teamRatingBar: {
    height: 8,
    borderRadius: 999,
    backgroundColor: "#2b1a35",
    overflow: "hidden",
  },
  teamRatingBarDisabled: {
    backgroundColor: "#1a1a2e",
  },
  teamRatingFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#fbbf24",
  },
  teamRatingFillDisabled: {
    backgroundColor: "#64748b",
  },
  teamStarString: {
    fontSize: 14,
    letterSpacing: 2,
    color: "#facc15",
  },
  teamStarStringDisabled: {
    color: "#64748b",
  },
  gameModeStarsContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    alignItems: "center",
  },
  teamNotes: {
    fontSize: 14,
    color: "#b8a6d9",
    marginBottom: 16,
    lineHeight: 20,
  },
  teamNotesDisabled: {
    color: "#64748b",
  },
  memberGrid: {
    flexDirection: "row",
    gap: 12,
  },
  memberCard: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  memberCardActive: {
    zIndex: 20,
  },
  memberImageContainer: {
    position: "relative",
    marginBottom: 8,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 108, 224, 0.2)",
  },
  memberAvatarDisabled: {
    borderColor: "rgba(100, 100, 100, 0.2)",
  },
  memberPlaceholder: {
    backgroundColor: "#2a1538",
    alignItems: "center",
    justifyContent: "center",
  },
  memberPlaceholderText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#9f8ab8",
  },
  memberOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  memberInfo: {
    alignItems: "center",
  },
  memberName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f4ecff",
    textAlign: "center",
    marginBottom: 4,
  },
  memberNameDisabled: {
    color: "#64748b",
  },
  memberMetaRow: {
    flexDirection: "row",
    gap: 4,
  },
  memberChip: {
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  memberChipIconOnly: {
    backgroundColor: "transparent",
    padding: 0,
    width: 16,
    height: 16,
  },
  memberChipIcon: {
    width: 14,
    height: 14,
  },
  memberChipText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  memberHoverCard: {
    position: "absolute",
    top: -160,
    left: -10,
    width: 220,
    backgroundColor: "#1c1024",
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#2a1538",
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
    color: "#f4ecff",
    flexShrink: 1,
  },
  memberHoverRating: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ff6ce0",
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
    color: "#c7b9d6",
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
    color: "#d8c7f5",
    fontWeight: "600",
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
});