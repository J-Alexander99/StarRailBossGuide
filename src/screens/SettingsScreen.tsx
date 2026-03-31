import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Switch,
  TextInput,
} from "react-native";
import { useWindowDimensions } from "react-native";
import appConfig from "../../app.json";
import tierUpdate from "../data/tierUpdate.json";
import { CHARACTERS } from "../data/characters";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";
import { useAppPreferences } from "../context/AppPreferencesContext";
import { getCharacterImage } from "../constants/characterImageMappings";
import {
  cancelScheduledEventNotifications,
  DEFAULT_ALERT_PREFERENCES,
  ensureNotificationPermission,
  getAlertPreferences,
  initializeEventNotifications,
  rescheduleEventNotifications,
  setAlertPreferences,
  type AlertPreferences,
  type DailyLeadTime,
} from "../services/eventNotifications";
import {
  getRosterPresets,
  saveRosterPreset,
  setRosterPresets,
  type RosterPresetSlot,
  type RosterPresets,
} from "../services/appPreferences";

const palette = {
  background: "#130914",
  surface: "#191222",
  surfaceBorder: "rgba(255, 255, 255, 0.05)",
  surfaceShadow: "#2a1538",
  textPrimary: "#f4ecff",
  textSecondary: "#c7b9d6",
  textMuted: "#9f8ab8",
  accent: "#ff6ce0",
  accentSoft: "rgba(255, 108, 224, 0.14)",
  accentBorder: "rgba(255, 108, 224, 0.35)",
};

const TILE_GAP = 12;
const LIST_HORIZONTAL_PADDING = 20;
const MIN_TILE_SIZE = 60;
const MAX_TILE_SIZE = 88;
const MIN_COLUMNS = 4;
const MAX_COLUMNS = 7;

type BackupPayload = {
  version: number;
  exportedAt: string;
  appPreferences: {
    timezoneMode: "local" | "utc";
    textScale: number;
    highContrast: boolean;
    reduceMotion: boolean;
  };
  alertPreferences: AlertPreferences;
  disabledCharacterIds: string[];
  rosterPresets: RosterPresets;
};

export function SettingsScreen() {
  const {
    isCharacterOwned,
    toggleCharacterOwnership,
    disabledCharacterList,
    replaceDisabledCharacterList,
  } = useCharacterOwnership();
  const { preferences, updatePreferences } = useAppPreferences();
  const { width } = useWindowDimensions();

  const [alertPreferences, setAlertPreferencesState] =
    useState<AlertPreferences>(DEFAULT_ALERT_PREFERENCES);
  const [rosterPresets, setRosterPresetsState] = useState<RosterPresets>({
    A: [],
    B: [],
    C: [],
  });
  const [isLoadingNotificationState, setIsLoadingNotificationState] =
    useState(true);
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [backupText, setBackupText] = useState("");

  const hasAnyAlertsEnabled =
    alertPreferences.dailyNotifications || alertPreferences.weeklyNotifications;

  const sortedCharacters = useMemo(
    () =>
      [...CHARACTERS].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      ),
    [],
  );

  const allCharacterIds = useMemo(
    () => sortedCharacters.map((c) => c.id),
    [sortedCharacters],
  );

  const { columns, tileSize } = useMemo(() => {
    const availableWidth = Math.max(0, width - LIST_HORIZONTAL_PADDING * 2);
    const estimatedColumns = Math.floor(
      (availableWidth + TILE_GAP) / (MIN_TILE_SIZE + TILE_GAP),
    );
    const clampedColumns = Math.max(
      MIN_COLUMNS,
      Math.min(MAX_COLUMNS, estimatedColumns || MIN_COLUMNS),
    );
    const usableWidth = Math.max(
      0,
      availableWidth - TILE_GAP * (clampedColumns - 1),
    );
    const calculatedSize = usableWidth / clampedColumns;
    const clampedSize = Math.max(
      MIN_TILE_SIZE,
      Math.min(MAX_TILE_SIZE, calculatedSize),
    );

    const finalColumns = Math.max(
      MIN_COLUMNS,
      Math.min(
        MAX_COLUMNS,
        Math.floor((availableWidth + TILE_GAP) / (clampedSize + TILE_GAP)) ||
          MIN_COLUMNS,
      ),
    );
    const finalUsableWidth = Math.max(
      0,
      availableWidth - TILE_GAP * (finalColumns - 1),
    );
    const finalTileSize = finalUsableWidth / finalColumns;

    return {
      columns: finalColumns,
      tileSize: Math.max(MIN_TILE_SIZE, Math.min(MAX_TILE_SIZE, finalTileSize)),
    };
  }, [width]);

  useEffect(() => {
    const hydrate = async () => {
      try {
        await initializeEventNotifications();
        const [storedAlertPreferences, presets] = await Promise.all([
          getAlertPreferences(),
          getRosterPresets(),
        ]);
        setAlertPreferencesState(storedAlertPreferences);
        setRosterPresetsState(presets);
      } finally {
        setIsLoadingNotificationState(false);
      }
    };

    hydrate();
  }, []);

  const applyAlertPreferences = useCallback(
    async (nextPreferences: AlertPreferences) => {
      const shouldEnableAlerts =
        nextPreferences.dailyNotifications ||
        nextPreferences.weeklyNotifications;

      if (shouldEnableAlerts) {
        const hasPermission = await ensureNotificationPermission();
        if (!hasPermission) {
          Alert.alert(
            "Notifications disabled",
            "Permission was not granted. You can enable notifications later from device settings.",
          );
          return false;
        }
      }

      await setAlertPreferences(nextPreferences);
      setAlertPreferencesState(nextPreferences);

      if (!shouldEnableAlerts) {
        await cancelScheduledEventNotifications();
        return true;
      }

      await rescheduleEventNotifications(nextPreferences);
      return true;
    },
    [],
  );

  const updateAlerts = useCallback(
    async (updates: Partial<AlertPreferences>, toastLabel?: string) => {
      if (isUpdatingNotifications) {
        return;
      }

      setIsUpdatingNotifications(true);
      try {
        const nextPreferences = {
          ...alertPreferences,
          ...updates,
        };

        const applied = await applyAlertPreferences(nextPreferences);
        if (applied && toastLabel) {
          Alert.alert("Updated", toastLabel);
        }
      } catch {
        Alert.alert(
          "Update failed",
          "Could not update alert preferences. Please try again.",
        );
      } finally {
        setIsUpdatingNotifications(false);
      }
    },
    [alertPreferences, applyAlertPreferences, isUpdatingNotifications],
  );

  const onRescheduleNotifications = useCallback(async () => {
    if (!hasAnyAlertsEnabled || isUpdatingNotifications) {
      return;
    }

    setIsUpdatingNotifications(true);
    try {
      const result = await rescheduleEventNotifications(alertPreferences);
      Alert.alert(
        "Reminders refreshed",
        `Scheduled ${result.scheduledCount} upcoming reminders.`,
      );
    } catch {
      Alert.alert(
        "Refresh failed",
        "Could not refresh reminders. Please try again.",
      );
    } finally {
      setIsUpdatingNotifications(false);
    }
  }, [alertPreferences, hasAnyAlertsEnabled, isUpdatingNotifications]);

  const onSavePreset = useCallback(
    async (slot: RosterPresetSlot) => {
      const next = await saveRosterPreset(slot, disabledCharacterList);
      setRosterPresetsState(next);
      Alert.alert("Preset saved", `Saved current roster to slot ${slot}.`);
    },
    [disabledCharacterList],
  );

  const onLoadPreset = useCallback(
    (slot: RosterPresetSlot) => {
      replaceDisabledCharacterList(rosterPresets[slot]);
      Alert.alert("Preset loaded", `Loaded roster preset ${slot}.`);
    },
    [replaceDisabledCharacterList, rosterPresets],
  );

  const onExportBackup = useCallback(() => {
    const payload: BackupPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      appPreferences: preferences,
      alertPreferences,
      disabledCharacterIds: disabledCharacterList,
      rosterPresets,
    };

    const json = JSON.stringify(payload, null, 2);
    setBackupText(json);
    Alert.alert("Backup prepared", "Backup JSON has been generated below.");
  }, [alertPreferences, disabledCharacterList, preferences, rosterPresets]);

  const onImportBackup = useCallback(async () => {
    if (!backupText.trim()) {
      Alert.alert("No backup text", "Paste backup JSON first.");
      return;
    }

    try {
      const parsed = JSON.parse(backupText) as Partial<BackupPayload>;
      if (!parsed.alertPreferences || !parsed.appPreferences) {
        throw new Error("Invalid backup file");
      }

      await updatePreferences(parsed.appPreferences);
      await applyAlertPreferences(parsed.alertPreferences);
      if (Array.isArray(parsed.disabledCharacterIds)) {
        replaceDisabledCharacterList(parsed.disabledCharacterIds);
      }

      if (parsed.rosterPresets) {
        await setRosterPresets(parsed.rosterPresets);
        setRosterPresetsState(parsed.rosterPresets);
      }

      Alert.alert("Backup restored", "Settings and roster data restored.");
    } catch {
      Alert.alert("Import failed", "Backup JSON could not be parsed.");
    }
  }, [
    applyAlertPreferences,
    backupText,
    replaceDisabledCharacterList,
    updatePreferences,
  ]);

  const onToggleAllCharacterFilters = useCallback(() => {
    if (disabledCharacterList.length === 0) {
      replaceDisabledCharacterList(allCharacterIds);
      return;
    }

    replaceDisabledCharacterList([]);
  }, [
    allCharacterIds,
    disabledCharacterList.length,
    replaceDisabledCharacterList,
  ]);

  const scale = preferences.textScale;

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedCharacters}
        keyExtractor={(item) => item.id}
        numColumns={columns}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontSize: 22 * scale }]}>
              Settings & Roster
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: 14 * scale }]}>
              Tap any character portrait to toggle them in your roster. Greyed
              portraits are treated as unavailable and will be excluded from
              team recommendations.
            </Text>
            {disabledCharacterList.length ? (
              <View style={styles.statusPill}>
                <Text style={styles.statusPillText}>
                  {disabledCharacterList.length} character
                  {disabledCharacterList.length === 1 ? "" : "s"} filtered
                </Text>
              </View>
            ) : null}
            <Pressable
              style={styles.secondaryButton}
              onPress={onToggleAllCharacterFilters}
            >
              <Text style={styles.secondaryButtonText}>
                {disabledCharacterList.length === 0
                  ? "Deselect All Characters"
                  : "Select All Characters"}
              </Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerSections}>
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Alerts</Text>
              <Text style={styles.sectionSubtitle}>
                Configure daily and weekly reminders, event scope, and quiet
                hours.
              </Text>

              <SettingRow label="Daily notifications">
                <Switch
                  value={alertPreferences.dailyNotifications}
                  disabled={
                    isUpdatingNotifications || isLoadingNotificationState
                  }
                  onValueChange={(value) =>
                    updateAlerts({ dailyNotifications: value })
                  }
                />
              </SettingRow>
              <SettingRow label="Weekly notifications">
                <Switch
                  value={alertPreferences.weeklyNotifications}
                  disabled={
                    isUpdatingNotifications || isLoadingNotificationState
                  }
                  onValueChange={(value) =>
                    updateAlerts({ weeklyNotifications: value })
                  }
                />
              </SettingRow>

              <Text style={styles.inlineLabel}>Notification Time</Text>
              <View style={styles.stepperRow}>
                <Stepper
                  label="Hour"
                  value={alertPreferences.notificationHour}
                  min={0}
                  max={23}
                  onChange={(value) =>
                    updateAlerts({ notificationHour: value })
                  }
                />
                <Stepper
                  label="Minute"
                  value={alertPreferences.notificationMinute}
                  min={0}
                  max={59}
                  onChange={(value) =>
                    updateAlerts({ notificationMinute: value })
                  }
                />
              </View>

              <Text style={styles.inlineLabel}>Daily Lead Time</Text>
              <ChipSelector
                value={alertPreferences.dailyLeadTime}
                options={[
                  { label: "24h", value: "24h" },
                  { label: "12h", value: "12h" },
                  { label: "Both", value: "both" },
                ]}
                onChange={(value) =>
                  updateAlerts({ dailyLeadTime: value as DailyLeadTime })
                }
              />

              <Text style={styles.inlineLabel}>Event Types</Text>
              <SettingRow label="Endgame">
                <Switch
                  value={alertPreferences.includeEndgame}
                  onValueChange={(value) =>
                    updateAlerts({ includeEndgame: value })
                  }
                />
              </SettingRow>
              <SettingRow label="Banners">
                <Switch
                  value={alertPreferences.includeBanner}
                  onValueChange={(value) =>
                    updateAlerts({ includeBanner: value })
                  }
                />
              </SettingRow>
              <SettingRow label="Version updates">
                <Switch
                  value={alertPreferences.includeVersionUpdate}
                  onValueChange={(value) =>
                    updateAlerts({ includeVersionUpdate: value })
                  }
                />
              </SettingRow>

              <Text style={styles.inlineLabel}>Other Games</Text>
              <SettingRow label="Include Genshin Impact events">
                <Switch
                  value={alertPreferences.includeGenshinEvents}
                  onValueChange={(value) =>
                    updateAlerts({ includeGenshinEvents: value })
                  }
                />
              </SettingRow>
              <SettingRow label="Include Zenless Zone Zero events">
                <Switch
                  value={alertPreferences.includeZzzEvents}
                  onValueChange={(value) =>
                    updateAlerts({ includeZzzEvents: value })
                  }
                />
              </SettingRow>

              <SettingRow label="Quiet hours">
                <Switch
                  value={alertPreferences.quietHoursEnabled}
                  onValueChange={(value) =>
                    updateAlerts({ quietHoursEnabled: value })
                  }
                />
              </SettingRow>

              {alertPreferences.quietHoursEnabled ? (
                <View style={styles.stepperRow}>
                  <Stepper
                    label="Start"
                    value={alertPreferences.quietHoursStartHour}
                    min={0}
                    max={23}
                    onChange={(value) =>
                      updateAlerts({ quietHoursStartHour: value })
                    }
                  />
                  <Stepper
                    label="End"
                    value={alertPreferences.quietHoursEndHour}
                    min={0}
                    max={23}
                    onChange={(value) =>
                      updateAlerts({ quietHoursEndHour: value })
                    }
                  />
                </View>
              ) : null}

              {hasAnyAlertsEnabled ? (
                <Pressable
                  style={styles.primaryButton}
                  onPress={onRescheduleNotifications}
                >
                  <Text style={styles.primaryButtonText}>
                    Refresh Notification Schedule
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Roster Presets</Text>
              <Text style={styles.sectionSubtitle}>
                Save and load multiple account rosters instantly.
              </Text>
              {(["A", "B", "C"] as RosterPresetSlot[]).map((slot) => (
                <View key={slot} style={styles.presetRow}>
                  <Text style={styles.settingLabel}>
                    Preset {slot} ({rosterPresets[slot].length} disabled)
                  </Text>
                  <View style={styles.presetButtons}>
                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => onSavePreset(slot)}
                    >
                      <Text style={styles.secondaryButtonText}>Save</Text>
                    </Pressable>
                    <Pressable
                      style={styles.secondaryButton}
                      onPress={() => onLoadPreset(slot)}
                    >
                      <Text style={styles.secondaryButtonText}>Load</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Display & Accessibility</Text>
              <SettingRow label="Timezone Mode">
                <ChipSelector
                  value={preferences.timezoneMode}
                  options={[
                    { label: "Local", value: "local" },
                    { label: "UTC", value: "utc" },
                  ]}
                  onChange={(value) =>
                    updatePreferences({
                      timezoneMode: value as "local" | "utc",
                    })
                  }
                />
              </SettingRow>

              <View style={styles.stepperRow}>
                <Stepper
                  label="Text Scale"
                  value={Math.round(preferences.textScale * 100)}
                  min={90}
                  max={135}
                  step={5}
                  onChange={(value) =>
                    updatePreferences({
                      textScale: Number((value / 100).toFixed(2)),
                    })
                  }
                  suffix="%"
                />
              </View>

              <SettingRow label="High contrast">
                <Switch
                  value={preferences.highContrast}
                  onValueChange={(value) =>
                    updatePreferences({ highContrast: value })
                  }
                />
              </SettingRow>

              <SettingRow label="Reduce motion">
                <Switch
                  value={preferences.reduceMotion}
                  onValueChange={(value) =>
                    updatePreferences({ reduceMotion: value })
                  }
                />
              </SettingRow>
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Backup & Restore</Text>
              <Text style={styles.sectionSubtitle}>
                Export settings and roster to JSON, then import on another
                device.
              </Text>
              <View style={styles.backupActionsRow}>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={onExportBackup}
                >
                  <Text style={styles.secondaryButtonText}>
                    Generate Backup JSON
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.secondaryButton}
                  onPress={onImportBackup}
                >
                  <Text style={styles.secondaryButtonText}>
                    Import from JSON
                  </Text>
                </Pressable>
              </View>
              <TextInput
                multiline
                value={backupText}
                onChangeText={setBackupText}
                placeholder="Backup JSON will appear here. Paste JSON here to restore."
                placeholderTextColor={palette.textMuted}
                style={styles.backupTextArea}
              />
            </View>

            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>App Info</Text>
              <Text style={styles.infoLine}>
                App version: {appConfig.expo.version}
              </Text>
              <Text style={styles.infoLine}>
                Tier data updated: {tierUpdate.generated_at ?? "Unknown"}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const owned = isCharacterOwned(item.id);
          const characterImage = getCharacterImage(item.id);
          const isLastColumn = (index + 1) % columns === 0;

          return (
            <Pressable
              onPress={() => toggleCharacterOwnership(item.id)}
              style={({ pressed }) => [
                styles.tile,
                {
                  width: tileSize,
                  height: tileSize,
                  marginRight: isLastColumn ? 0 : TILE_GAP,
                },
                !owned && styles.tileDisabled,
                pressed && styles.tilePressed,
              ]}
            >
              {characterImage ? (
                <Image
                  source={characterImage}
                  style={[styles.tileImage, !owned && styles.tileImageDisabled]}
                />
              ) : (
                <View
                  style={[
                    styles.tileImage,
                    styles.placeholderTile,
                    !owned && styles.tileImageDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.placeholderText,
                      { fontSize: Math.min(22, tileSize * 0.34) },
                    ]}
                  >
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {!owned ? (
                <View style={styles.tileOverlay} pointerEvents="none">
                  <Text style={styles.tileOverlayText}>Unavailable</Text>
                </View>
              ) : null}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingLabel}>{label}</Text>
      <View>{children}</View>
    </View>
  );
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  step = 1,
  suffix = "",
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  step?: number;
  suffix?: string;
}) {
  const canDecrement = value > min;
  const canIncrement = value < max;

  return (
    <View style={styles.stepperCard}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <Pressable
          disabled={!canDecrement}
          style={[
            styles.stepButton,
            !canDecrement && styles.stepButtonDisabled,
          ]}
          onPress={() => onChange(Math.max(min, value - step))}
        >
          <Text style={styles.stepButtonText}>-</Text>
        </Pressable>
        <Text style={styles.stepValueText}>
          {String(value).padStart(2, "0")}
          {suffix}
        </Text>
        <Pressable
          disabled={!canIncrement}
          style={[
            styles.stepButton,
            !canIncrement && styles.stepButtonDisabled,
          ]}
          onPress={() => onChange(Math.min(max, value + step))}
        >
          <Text style={styles.stepButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ChipSelector({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.chipSelectorRow}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            style={[styles.selectorChip, selected && styles.selectorChipActive]}
            onPress={() => onChange(option.value)}
          >
            <Text
              style={[
                styles.selectorChipText,
                selected && styles.selectorChipTextActive,
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 20,
  },
  columnWrapper: {
    marginBottom: TILE_GAP,
  },
  header: {
    marginBottom: 8,
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    shadowColor: palette.surfaceShadow,
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 7,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    lineHeight: 20,
  },
  statusPill: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: palette.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: palette.accentBorder,
  },
  statusPillText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  tile: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
  },
  tileDisabled: {
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  tilePressed: {
    opacity: 0.8,
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tileImageDisabled: {
    opacity: 0.25,
  },
  tileOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(19, 9, 20, 0.65)",
    justifyContent: "center",
    alignItems: "center",
  },
  tileOverlayText: {
    color: palette.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  placeholderTile: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 22,
    fontWeight: "700",
    color: palette.textMuted,
  },
  footerSections: {
    marginTop: 18,
    gap: 12,
  },
  sectionCard: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
    padding: 14,
  },
  sectionTitle: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  sectionSubtitle: {
    marginTop: 4,
    marginBottom: 8,
    color: palette.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  settingRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  settingLabel: {
    color: palette.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inlineLabel: {
    color: palette.textMuted,
    marginTop: 10,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chipSelectorRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },
  selectorChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  selectorChipActive: {
    backgroundColor: palette.accentSoft,
    borderColor: palette.accentBorder,
  },
  selectorChipText: {
    color: palette.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  selectorChipTextActive: {
    color: palette.accent,
  },
  stepperRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  stepperCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 10,
    padding: 8,
  },
  stepperLabel: {
    color: palette.textMuted,
    fontSize: 11,
    marginBottom: 6,
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  stepButtonText: {
    color: palette.textPrimary,
    fontSize: 18,
    fontWeight: "700",
  },
  stepValueText: {
    color: palette.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  presetRow: {
    marginTop: 10,
    gap: 8,
  },
  presetButtons: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    marginTop: 12,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: palette.accentSoft,
    borderColor: palette.accentBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: palette.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  secondaryButton: {
    alignSelf: "flex-start",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  secondaryButtonText: {
    color: palette.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  backupActionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  backupTextArea: {
    marginTop: 10,
    minHeight: 140,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    borderRadius: 10,
    padding: 10,
    color: palette.textPrimary,
    textAlignVertical: "top",
    backgroundColor: "rgba(0,0,0,0.18)",
    fontSize: 12,
  },
  infoLine: {
    color: palette.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
});
