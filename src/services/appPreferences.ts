import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_PREFERENCES_STORAGE_KEY = "bossguide:appPreferences";
const ROSTER_PRESETS_STORAGE_KEY = "bossguide:rosterPresets";

export type TimezoneMode = "local" | "utc";

export type AppPreferences = {
  timezoneMode: TimezoneMode;
  textScale: number;
  highContrast: boolean;
  reduceMotion: boolean;
};

export type RosterPresetSlot = "A" | "B" | "C";
export type RosterPresets = Record<RosterPresetSlot, string[]>;

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  timezoneMode: "local",
  textScale: 1,
  highContrast: false,
  reduceMotion: false,
};

const DEFAULT_ROSTER_PRESETS: RosterPresets = {
  A: [],
  B: [],
  C: [],
};

export async function getAppPreferences(): Promise<AppPreferences> {
  const raw = await AsyncStorage.getItem(APP_PREFERENCES_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_APP_PREFERENCES;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      timezoneMode:
        parsed?.timezoneMode === "utc" || parsed?.timezoneMode === "local"
          ? parsed.timezoneMode
          : DEFAULT_APP_PREFERENCES.timezoneMode,
      textScale:
        typeof parsed?.textScale === "number"
          ? clamp(parsed.textScale, 0.9, 1.35)
          : DEFAULT_APP_PREFERENCES.textScale,
      highContrast:
        typeof parsed?.highContrast === "boolean"
          ? parsed.highContrast
          : DEFAULT_APP_PREFERENCES.highContrast,
      reduceMotion:
        typeof parsed?.reduceMotion === "boolean"
          ? parsed.reduceMotion
          : DEFAULT_APP_PREFERENCES.reduceMotion,
    };
  } catch {
    return DEFAULT_APP_PREFERENCES;
  }
}

export async function setAppPreferences(
  preferences: AppPreferences,
): Promise<void> {
  await AsyncStorage.setItem(
    APP_PREFERENCES_STORAGE_KEY,
    JSON.stringify(preferences),
  );
}

export async function getRosterPresets(): Promise<RosterPresets> {
  const raw = await AsyncStorage.getItem(ROSTER_PRESETS_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_ROSTER_PRESETS;
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      A: sanitizeIdArray(parsed?.A),
      B: sanitizeIdArray(parsed?.B),
      C: sanitizeIdArray(parsed?.C),
    };
  } catch {
    return DEFAULT_ROSTER_PRESETS;
  }
}

export async function saveRosterPreset(
  slot: RosterPresetSlot,
  disabledCharacterIds: string[],
): Promise<RosterPresets> {
  const existing = await getRosterPresets();
  const next: RosterPresets = {
    ...existing,
    [slot]: sanitizeIdArray(disabledCharacterIds),
  };

  await AsyncStorage.setItem(ROSTER_PRESETS_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function setRosterPresets(presets: RosterPresets): Promise<void> {
  const sanitized: RosterPresets = {
    A: sanitizeIdArray(presets.A),
    B: sanitizeIdArray(presets.B),
    C: sanitizeIdArray(presets.C),
  };

  await AsyncStorage.setItem(
    ROSTER_PRESETS_STORAGE_KEY,
    JSON.stringify(sanitized),
  );
}

function sanitizeIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
