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
import { CHARACTERS } from "../data/characters";
import { TEAMS, resolveTeamMembers } from "../data/teams";
import { getCharacterBuild } from "../data/characterBuilds";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { getElementIcon, getPathIcon } from "../constants/iconMappings";
import {
  getCharacterImage,
  getCharacterDetailImage,
} from "../constants/characterImageMappings";
import { getLightconeImageWithFallback } from "../constants/lightconeImageMappings";

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

  if (!character) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.missingText}>Character not found</Text>
      </View>
    );
  }

  const characterImageSource = getCharacterDetailImage(character.id);
  const elementIcon = getElementIcon(character.element);
  const pathIcon = character.path ? getPathIcon(character.path) : undefined;

  // Get build recommendations for this character
  const buildData = getCharacterBuild(character.id);

  // Find teams that include this character
  const teamsWithCharacter = useMemo(() => {
    return TEAMS.map((team) => ({
      team,
      members: resolveTeamMembers(team),
      isAvailable: team.members.every((memberId) => isCharacterOwned(memberId)),
    })).filter(({ team }) => team.members.includes(character.id));
  }, [character.id, isCharacterOwned]);

  const renderGameModeStars = (
    mocRating?: number,
    pfRating?: number,
    asRating?: number
  ) => {
    const renderModeStars = (rating: number, color: string, key: string) => {
      const halfStars = Math.min(rating, 10);
      const fullStars = Math.floor(halfStars / 2);
      const hasHalfStar = halfStars % 2 === 1;
      const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

      return (
        <View key={key} style={{ flexDirection: "row" }}>
          <Text style={{ color, fontSize: 18, letterSpacing: 1 }}>
            {"★".repeat(fullStars)}
            {hasHalfStar ? "⯨" : ""}
          </Text>
          <Text style={{ color: "#6b7280", fontSize: 18, letterSpacing: 1 }}>
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

  const heroImageStyles = [
    styles.heroImage,
    ...(width >= 900 ? [styles.heroImageDesktop] : []),
  ];
  const heroPlaceholderStyles = [
    styles.heroImagePlaceholder,
    ...(width >= 900 ? [styles.heroImagePlaceholderDesktop] : []),
  ];

  return (
    <View style={styles.container}>
      {/* Hero Section - Fixed Background */}
      <View style={styles.heroSection}>
        {characterImageSource ? (
          <Image source={characterImageSource} style={heroImageStyles} />
        ) : (
          <View style={heroPlaceholderStyles}>
            <Text style={styles.heroPlaceholderText}>
              {character.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Overlay - Scrolls with content */}
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>{character.name}</Text>
          <View style={styles.heroIconRow}>
            {elementIcon && (
              <Image source={elementIcon} style={styles.heroIcon} />
            )}
            {pathIcon && <Image source={pathIcon} style={styles.heroIcon} />}
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.rating || 0}/30</Text>
            <Text style={styles.statLabel}>Total Power</Text>
            <Text style={styles.statSubtext}>Combined</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.mocRating || 0}/10</Text>
            <Text style={styles.statLabel}>MoC</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.pfRating || 0}/10</Text>
            <Text style={styles.statLabel}>Pure Fiction</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{character.asRating || 0}/10</Text>
            <Text style={styles.statLabel}>Apoc Shadow</Text>
          </View>
        </View>

        {/* Rating Bar */}
        <View style={styles.ratingSection}>
          <View style={styles.ratingBar}>
            <View
              style={[
                styles.ratingFill,
                {
                  width: `${Math.min(
                    100,
                    ((character.rating || 0) / 30) * 100
                  )}%`,
                },
              ]}
            />
          </View>
          {renderGameModeStars(
            character.mocRating,
            character.pfRating,
            character.asRating
          )}
        </View>

        {/* Attributes Section */}
        <View style={styles.section}>
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
                style={[styles.chip, { backgroundColor: palette.chipFallback }]}
              >
                <Text style={styles.chipText}>{character.target}</Text>
              </View>
            )}
            {character.implant && (
              <View
                style={[styles.chip, { backgroundColor: palette.chipFallback }]}
              >
                <Text style={styles.chipText}>
                  {character.implant === "ultNegate"
                    ? "Weakness Negation"
                    : "Implant"}
                </Text>
              </View>
            )}
          </View>
          {character.implant && (
            <View style={styles.implantDescription}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best Light Cones</Text>
          {buildData && buildData.lightCones.length > 0 ? (
            <View style={styles.recommendationCard}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Relic Sets</Text>
          {buildData ? (
            <>
              <View style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>Recommended Sets</Text>
                {buildData.relics.sets.length > 0 ? (
                  buildData.relics.sets.map((relic, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.recommendationItemName}>
                        • {relic.name} {relic.pieces && `(${relic.pieces})`}
                      </Text>
                      {relic.notes && (
                        <Text style={styles.recommendationItemNotes}>
                          {relic.notes}
                        </Text>
                      )}
                    </View>
                  ))
                ) : (
                  <Text style={styles.recommendationText}>
                    No relic set recommendations yet.
                  </Text>
                )}
              </View>
              <View style={styles.recommendationCard}>
                <Text style={styles.recommendationTitle}>Planar Ornaments</Text>
                {buildData.relics.planar.length > 0 ? (
                  buildData.relics.planar.map((planar, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.recommendationItemName}>
                        • {planar.name}
                      </Text>
                      {planar.notes && (
                        <Text style={styles.recommendationItemNotes}>
                          {planar.notes}
                        </Text>
                      )}
                    </View>
                  ))
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stat Priority</Text>
          {buildData ? (
            <>
              <View style={styles.recommendationCard}>
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
              <View style={styles.recommendationCard}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Teams ({teamsWithCharacter.length})
          </Text>
          {teamsWithCharacter.length > 0 ? (
            teamsWithCharacter.map(({ team, members, isAvailable }) => (
              <View
                key={team.id}
                style={[
                  styles.teamCard,
                  !isAvailable && styles.teamCardDisabled,
                ]}
              >
                <View style={styles.teamHeader}>
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
                      !isAvailable && styles.teamPowerDisabled,
                    ]}
                  >
                    {team.teamRating || 0}/120
                  </Text>
                </View>
                <View style={styles.teamMembers}>
                  {members.map((member) => {
                    const memberImage = getCharacterImage(member.id);
                    const isOwned = isCharacterOwned(member.id);
                    const isCurrentChar = member.id === character.id;

                    return (
                      <View
                        key={member.id}
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
      </ScrollView>
    </View>
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
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingTop: 320,
    paddingBottom: 32,
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
    height: 400,
    backgroundColor: palette.surface,
    zIndex: 0,
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
    padding: 20,
    backgroundColor: "rgba(19, 9, 20, 0.9)",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  heroIconRow: {
    flexDirection: "row",
    gap: 12,
  },
  heroIcon: {
    width: 28,
    height: 28,
  },
  statsSection: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.surfaceBorder,
  },
  statCard: {
    flex: 1,
    backgroundColor: palette.highlight,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: palette.highlightBorder,
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
    fontSize: 10,
    color: palette.textMuted,
    marginTop: 2,
  },
  ratingSection: {
    padding: 16,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.surfaceBorder,
  },
  ratingBar: {
    height: 8,
    backgroundColor: palette.highlight,
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 12,
  },
  ratingFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: 999,
  },
  gameModeStarsContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  section: {
    padding: 16,
    backgroundColor: palette.background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 12,
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
    backgroundColor: palette.highlight,
    justifyContent: "center",
    alignItems: "center",
  },
  memberPlaceholderText: {
    fontSize: 20,
    fontWeight: "700",
    color: palette.textMuted,
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
