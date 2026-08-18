import AsyncStorage from "@react-native-async-storage/async-storage";

const EVENT_TIME_OVERRIDES_STORAGE_KEY = "bossguide:eventTimeOverrides";

/**
 * Manual corrections for live event countdowns, keyed by event id.
 * Each value is an ISO date string for the reset time as observed in-game,
 * used to override the normally-computed schedule when it drifts (e.g. a
 * maintenance delay). An override is only honored while its date is still
 * in the future - once it passes, `getLiveEvents` automatically falls back
 * to the regular computed schedule again.
 */
export type EventTimeOverrides = Record<string, string>;

export const DEFAULT_EVENT_TIME_OVERRIDES: EventTimeOverrides = {};

export async function getEventTimeOverrides(): Promise<EventTimeOverrides> {
  const raw = await AsyncStorage.getItem(EVENT_TIME_OVERRIDES_STORAGE_KEY);
  if (!raw) {
    return DEFAULT_EVENT_TIME_OVERRIDES;
  }

  try {
    return sanitizeOverrides(JSON.parse(raw));
  } catch {
    return DEFAULT_EVENT_TIME_OVERRIDES;
  }
}

export async function setEventTimeOverride(
  eventId: string,
  targetDate: Date,
): Promise<EventTimeOverrides> {
  const existing = await getEventTimeOverrides();
  const next: EventTimeOverrides = {
    ...existing,
    [eventId]: targetDate.toISOString(),
  };

  await AsyncStorage.setItem(
    EVENT_TIME_OVERRIDES_STORAGE_KEY,
    JSON.stringify(next),
  );
  return next;
}

export async function clearEventTimeOverride(
  eventId: string,
): Promise<EventTimeOverrides> {
  const existing = await getEventTimeOverrides();
  const next = { ...existing };
  delete next[eventId];

  await AsyncStorage.setItem(
    EVENT_TIME_OVERRIDES_STORAGE_KEY,
    JSON.stringify(next),
  );
  return next;
}

export async function clearAllEventTimeOverrides(): Promise<void> {
  await AsyncStorage.removeItem(EVENT_TIME_OVERRIDES_STORAGE_KEY);
}

export async function setEventTimeOverrides(
  overrides: EventTimeOverrides,
): Promise<EventTimeOverrides> {
  const sanitized = sanitizeOverrides(overrides);
  await AsyncStorage.setItem(
    EVENT_TIME_OVERRIDES_STORAGE_KEY,
    JSON.stringify(sanitized),
  );
  return sanitized;
}

function sanitizeOverrides(value: unknown): EventTimeOverrides {
  if (!value || typeof value !== "object") {
    return DEFAULT_EVENT_TIME_OVERRIDES;
  }

  const sanitized: EventTimeOverrides = {};
  for (const [eventId, isoDate] of Object.entries(
    value as Record<string, unknown>,
  )) {
    if (
      typeof eventId === "string" &&
      typeof isoDate === "string" &&
      !Number.isNaN(new Date(isoDate).getTime())
    ) {
      sanitized[eventId] = isoDate;
    }
  }

  return sanitized;
}
