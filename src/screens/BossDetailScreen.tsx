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
import { BOSSES, getBossAttributes } from "../data/bosses";
import { teamsMatchingWeakness, resolveTeamMembers } from "../data/teams";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { getElementIcon } from "../constants/iconMappings";
import { getBossImage } from "../constants/bossImageMappings";
import { getCharacterImage } from "../constants/characterImageMappings";

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

  const { weaknesses, resistances, metaWeaknesses, metaResistances } =
    getBossAttributes(boss);
  const { filteredTeams, excludedTeamsCount } = useMemo(() => {
    const baseTeams = teamsMatchingWeakness(weaknesses);
    const enrichedTeams = baseTeams.map((team) => ({
      team,
      members: resolveTeamMembers(team),
    }));
    const availableTeams = enrichedTeams.filter(({ members }) =>
      members.every((member) => isCharacterOwned(member.id))
    );

    return {
      filteredTeams: availableTeams,
      excludedTeamsCount: enrichedTeams.length - availableTeams.length,
    };
  }, [weaknesses, isCharacterOwned]);

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
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeader}>Recommended Strike Teams</Text>
        {excludedTeamsCount > 0 ? (
          <Text style={styles.filterHint}>
            {excludedTeamsCount} team
            {excludedTeamsCount === 1 ? "" : "s"} hidden based on your roster
            settings.
          </Text>
        ) : null}
        {filteredTeams.length ? (
          filteredTeams.map(({ team, members }) => (
            <View key={team.id} style={styles.teamCard}>
              <View style={styles.teamHeader}>
                <Text style={styles.teamName}>
                  {team.name ?? `Team ${team.id.toUpperCase()}`}
                </Text>
                <View style={styles.teamIdBadge}>
                  <Text style={styles.teamIdText}>{team.id}</Text>
                </View>
              </View>
              {team.notes ? (
                <Text style={styles.teamNotes}>{team.notes}</Text>
              ) : null}
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
          ))
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
});
