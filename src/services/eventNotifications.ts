import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { getLiveEvents, type LiveEvent } from "../data/liveEvents";

const ALERT_PREFERENCES_STORAGE_KEY = "bossguide:alertPreferencesV2";
const DAILY_ENABLED_STORAGE_KEY = "bossguide:dailyNotificationsEnabled";
const WEEKLY_ENABLED_STORAGE_KEY = "bossguide:weeklyNotificationsEnabled";
const IDS_STORAGE_KEY = "bossguide:eventNotificationIds";
const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const SCHEDULE_HORIZON_DAYS = 120;

export type DailyLeadTime = "24h" | "12h" | "both";

export type AlertPreferences = {
  dailyNotifications: boolean;
  weeklyNotifications: boolean;
  notificationHour: number;
  notificationMinute: number;
  dailyLeadTime: DailyLeadTime;
  includeEndgame: boolean;
  includeBanner: boolean;
  includeVersionUpdate: boolean;
  includeGenshinEvents: boolean;
  includeZzzEvents: boolean;
  quietHoursEnabled: boolean;
  quietHoursStartHour: number;
  quietHoursEndHour: number;
};

export const DEFAULT_ALERT_PREFERENCES: AlertPreferences = {
  dailyNotifications: false,
  weeklyNotifications: false,
  notificationHour: 9,
  notificationMinute: 0,
  dailyLeadTime: "24h",
  includeEndgame: true,
  includeBanner: true,
  includeVersionUpdate: true,
  includeGenshinEvents: false,
  includeZzzEvents: false,
  quietHoursEnabled: false,
  quietHoursStartHour: 22,
  quietHoursEndHour: 8,
};

export type NotificationRescheduleResult = {
  scheduledCount: number;
};

let notificationsInitialized = false;

export async function initializeEventNotifications(): Promise<void> {
  if (notificationsInitialized) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("event-reminders", {
      name: "Event Reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#ff6ce0",
      sound: undefined,
    });
  }

  notificationsInitialized = true;
}

export async function getAlertPreferences(): Promise<AlertPreferences> {
  const v2Raw = await AsyncStorage.getItem(ALERT_PREFERENCES_STORAGE_KEY);
  if (v2Raw) {
    try {
      const parsed = JSON.parse(v2Raw);
      return sanitizeAlertPreferences(parsed);
    } catch {
      // Fall back to legacy values below.
    }
  }

  const [dailyRaw, weeklyRaw] = await Promise.all([
    AsyncStorage.getItem(DAILY_ENABLED_STORAGE_KEY),
    AsyncStorage.getItem(WEEKLY_ENABLED_STORAGE_KEY),
  ]);

  return {
    ...DEFAULT_ALERT_PREFERENCES,
    dailyNotifications: dailyRaw === "true",
    weeklyNotifications: weeklyRaw === "true",
  };
}

export async function setAlertPreferences(
  preferences: AlertPreferences,
): Promise<void> {
  const sanitized = sanitizeAlertPreferences(preferences);

  await Promise.all([
    AsyncStorage.setItem(
      ALERT_PREFERENCES_STORAGE_KEY,
      JSON.stringify(sanitized),
    ),
    AsyncStorage.setItem(
      DAILY_ENABLED_STORAGE_KEY,
      sanitized.dailyNotifications ? "true" : "false",
    ),
    AsyncStorage.setItem(
      WEEKLY_ENABLED_STORAGE_KEY,
      sanitized.weeklyNotifications ? "true" : "false",
    ),
  ]);
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const permissions = await Notifications.getPermissionsAsync();
  if (permissions.granted || permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }

  const requested = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return requested.granted || requested.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
}

export async function cancelScheduledEventNotifications(): Promise<void> {
  const rawIds = await AsyncStorage.getItem(IDS_STORAGE_KEY);
  const parsedIds = rawIds ? safeParseIds(rawIds) : [];

  if (parsedIds.length) {
    await Promise.all(parsedIds.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined)));
  }

  await AsyncStorage.removeItem(IDS_STORAGE_KEY);
}

export async function syncEventNotificationsIfEnabled(
  now: Date = new Date(),
): Promise<NotificationRescheduleResult | null> {
  const preferences = await getAlertPreferences();
  if (!preferences.dailyNotifications && !preferences.weeklyNotifications) {
    await cancelScheduledEventNotifications();
    return null;
  }

  const permissions = await Notifications.getPermissionsAsync();
  const hasPermission =
    permissions.granted ||
    permissions.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

  if (!hasPermission) {
    return null;
  }

  return rescheduleEventNotifications(preferences, now);
}

export async function rescheduleEventNotifications(
  preferences: AlertPreferences,
  now: Date = new Date(),
): Promise<NotificationRescheduleResult> {
  const normalizedPreferences = sanitizeAlertPreferences(preferences);
  await cancelScheduledEventNotifications();

  const upcomingOccurrences = buildUpcomingEventOccurrences(
    now,
    SCHEDULE_HORIZON_DAYS,
    normalizedPreferences,
  ).filter((event) => isEventEnabled(event, normalizedPreferences));

  const schedules: NotificationSchedule[] = [];

  if (normalizedPreferences.weeklyNotifications) {
    schedules.push(
      ...buildMondaySummaryNotifications(
        now,
        upcomingOccurrences,
        normalizedPreferences,
      ),
    );
  }

  if (normalizedPreferences.dailyNotifications) {
    schedules.push(
      ...buildExpiringSoonNotifications(
        upcomingOccurrences,
        now,
        normalizedPreferences,
      ),
    );
  }

  const filteredSchedules = schedules.filter((schedule) => {
    if (schedule.triggerDate.getTime() <= now.getTime()) {
      return false;
    }

    return !isBlockedByQuietHours(schedule.triggerDate, normalizedPreferences);
  });

  const notificationIds: string[] = [];

  for (const schedule of filteredSchedules) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: schedule.title,
        body: schedule.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: schedule.triggerDate,
        channelId: Platform.OS === "android" ? "event-reminders" : undefined,
      },
    });

    notificationIds.push(id);
  }

  await AsyncStorage.setItem(IDS_STORAGE_KEY, JSON.stringify(notificationIds));

  return { scheduledCount: notificationIds.length };
}

type NotificationSchedule = {
  triggerDate: Date;
  title: string;
  body: string;
};

function buildExpiringSoonNotifications(
  occurrences: LiveEventOccurrence[],
  now: Date,
  preferences: AlertPreferences,
): NotificationSchedule[] {
  const thresholds = getLeadThresholds(preferences.dailyLeadTime);
  const groupedByDate = new Map<
    string,
    { triggerDate: Date; title: string; events: LiveEvent[] }
  >();

  for (const occurrence of occurrences) {
    for (const thresholdHours of thresholds) {
      const notificationDate = getLeadNotificationDate(
        occurrence.nextReset,
        thresholdHours,
        preferences.notificationHour,
        preferences.notificationMinute,
      );
      if (!notificationDate) {
        continue;
      }

      if (notificationDate.getTime() <= now.getTime()) {
        continue;
      }

      const key = `${notificationDate.getTime()}-${thresholdHours}`;
      const existing = groupedByDate.get(key);
      if (existing) {
        existing.events.push(occurrence);
      } else {
        groupedByDate.set(key, {
          triggerDate: notificationDate,
          title:
            thresholdHours === 12
              ? "Under 12h Remaining"
              : "Under 24h Remaining",
          events: [occurrence],
        });
      }
    }
  }

  return Array.from(groupedByDate.values())
    .sort((a, b) => a.triggerDate.getTime() - b.triggerDate.getTime())
    .map((entry) => ({
      triggerDate: entry.triggerDate,
      title: entry.title,
      body: buildExpiringSoonBody(entry.events),
    }));
}

type LiveEventOccurrence = LiveEvent;

function buildMondaySummaryNotifications(
  now: Date,
  occurrences: LiveEventOccurrence[],
  preferences: AlertPreferences,
): NotificationSchedule[] {
  const upcomingMondays = getUpcomingMondayAtHour(
    now,
    16,
    preferences.notificationHour,
    preferences.notificationMinute,
  );

  return upcomingMondays.map((mondayNine) => {
    const start = mondayNine.getTime();
    const end = start + WEEK_MS;
    const eventsForWeek = occurrences.filter((event) => {
      const reset = event.nextReset.getTime();
      return reset >= start && reset < end;
    });

    return {
      triggerDate: mondayNine,
      title: "Weekly Reset Briefing",
      body: buildWeeklySummaryBody(eventsForWeek),
    };
  });
}

function buildUpcomingEventOccurrences(
  now: Date,
  horizonDays: number,
  preferences: AlertPreferences,
): LiveEventOccurrence[] {
  const endTime = now.getTime() + horizonDays * DAY_MS;
  const seen = new Set<string>();
  const occurrences: LiveEventOccurrence[] = [];

  for (let dayOffset = 0; dayOffset <= horizonDays; dayOffset += 1) {
    const probeDate = new Date(now.getTime() + dayOffset * DAY_MS);
    const eventsAtProbe = getLiveEvents(probeDate, {
      includeGenshin: preferences.includeGenshinEvents,
      includeZzz: preferences.includeZzzEvents,
    });

    for (const event of eventsAtProbe) {
      const resetTime = event.nextReset.getTime();
      if (resetTime <= now.getTime() || resetTime > endTime) {
        continue;
      }

      const key = `${event.id}:${resetTime}`;
      if (seen.has(key)) {
        continue;
      }

      seen.add(key);
      occurrences.push(event);
    }
  }

  return occurrences.sort((a, b) => a.nextReset.getTime() - b.nextReset.getTime());
}

function getUpcomingMondayAtHour(
  fromDate: Date,
  count: number,
  hour: number,
  minute: number,
): Date[] {
  const mondayDates: Date[] = [];

  const cursor = new Date(fromDate);
  cursor.setSeconds(0, 0);

  while (mondayDates.length < count) {
    const mondayNine = toLocalDateAtHourMinute(cursor, hour, minute);

    if (mondayNine.getDay() === 1 && mondayNine.getTime() > fromDate.getTime()) {
      mondayDates.push(mondayNine);
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return mondayDates;
}

function getLeadNotificationDate(
  resetDate: Date,
  thresholdHours: number,
  hour: number,
  minute: number,
): Date | null {
  const thresholdMs = thresholdHours * 60 * 60 * 1000;
  let chosen: Date | null = null;

  for (let dayOffset = 0; dayOffset <= 2; dayOffset += 1) {
    const candidateBase = new Date(resetDate);
    candidateBase.setDate(candidateBase.getDate() - dayOffset);
    const candidate = toLocalDateAtHourMinute(candidateBase, hour, minute);
    const diff = resetDate.getTime() - candidate.getTime();

    if (diff > 0 && diff <= thresholdMs) {
      if (!chosen || candidate.getTime() > chosen.getTime()) {
        chosen = candidate;
      }
    }
  }

  return chosen;
}

function toLocalDateAtHourMinute(date: Date, hour: number, minute: number): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0,
  );
}

function getLeadThresholds(dailyLeadTime: DailyLeadTime): number[] {
  if (dailyLeadTime === "12h") {
    return [12];
  }

  if (dailyLeadTime === "both") {
    return [24, 12];
  }

  return [24];
}

function isEventEnabled(event: LiveEvent, preferences: AlertPreferences): boolean {
  if (event.game === "genshin" && !preferences.includeGenshinEvents) {
    return false;
  }

  if (event.game === "zzz" && !preferences.includeZzzEvents) {
    return false;
  }

  if (event.kind === "endgame") {
    return preferences.includeEndgame;
  }

  if (event.kind === "banner") {
    return preferences.includeBanner;
  }

  if (event.kind === "update") {
    return preferences.includeVersionUpdate;
  }

  return true;
}

function isBlockedByQuietHours(
  date: Date,
  preferences: AlertPreferences,
): boolean {
  if (!preferences.quietHoursEnabled) {
    return false;
  }

  return isHourWithinQuietHours(
    date.getHours(),
    preferences.quietHoursStartHour,
    preferences.quietHoursEndHour,
  );
}

function isHourWithinQuietHours(
  hour: number,
  startHour: number,
  endHour: number,
): boolean {
  if (startHour === endHour) {
    return false;
  }

  if (startHour < endHour) {
    return hour >= startHour && hour < endHour;
  }

  return hour >= startHour || hour < endHour;
}

function buildWeeklySummaryBody(events: LiveEvent[]): string {
  if (!events.length) {
    return "No tracked resets this week.";
  }

  const eventLabels = events.map((event) => `${event.name} (${formatDayLabel(event.nextReset)})`);
  return `This week: ${eventLabels.join(", ")}`;
}

function buildExpiringSoonBody(events: LiveEvent[]): string {
  if (events.length === 1) {
    return `${events[0].name} resets soon.`;
  }

  return `${events.length} tracked events reset soon: ${events
    .map((event) => event.name)
    .join(", ")}.`;
}

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function safeParseIds(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

function sanitizeAlertPreferences(value: unknown): AlertPreferences {
  const candidate = value as Partial<AlertPreferences> | null | undefined;

  return {
    dailyNotifications:
      typeof candidate?.dailyNotifications === "boolean"
        ? candidate.dailyNotifications
        : DEFAULT_ALERT_PREFERENCES.dailyNotifications,
    weeklyNotifications:
      typeof candidate?.weeklyNotifications === "boolean"
        ? candidate.weeklyNotifications
        : DEFAULT_ALERT_PREFERENCES.weeklyNotifications,
    notificationHour:
      typeof candidate?.notificationHour === "number"
        ? clampHour(candidate.notificationHour)
        : DEFAULT_ALERT_PREFERENCES.notificationHour,
    notificationMinute:
      typeof candidate?.notificationMinute === "number"
        ? clampMinute(candidate.notificationMinute)
        : DEFAULT_ALERT_PREFERENCES.notificationMinute,
    dailyLeadTime:
      candidate?.dailyLeadTime === "12h" ||
      candidate?.dailyLeadTime === "24h" ||
      candidate?.dailyLeadTime === "both"
        ? candidate.dailyLeadTime
        : DEFAULT_ALERT_PREFERENCES.dailyLeadTime,
    includeEndgame:
      typeof candidate?.includeEndgame === "boolean"
        ? candidate.includeEndgame
        : DEFAULT_ALERT_PREFERENCES.includeEndgame,
    includeBanner:
      typeof candidate?.includeBanner === "boolean"
        ? candidate.includeBanner
        : DEFAULT_ALERT_PREFERENCES.includeBanner,
    includeVersionUpdate:
      typeof candidate?.includeVersionUpdate === "boolean"
        ? candidate.includeVersionUpdate
        : DEFAULT_ALERT_PREFERENCES.includeVersionUpdate,
    includeGenshinEvents:
      typeof candidate?.includeGenshinEvents === "boolean"
        ? candidate.includeGenshinEvents
        : DEFAULT_ALERT_PREFERENCES.includeGenshinEvents,
    includeZzzEvents:
      typeof candidate?.includeZzzEvents === "boolean"
        ? candidate.includeZzzEvents
        : DEFAULT_ALERT_PREFERENCES.includeZzzEvents,
    quietHoursEnabled:
      typeof candidate?.quietHoursEnabled === "boolean"
        ? candidate.quietHoursEnabled
        : DEFAULT_ALERT_PREFERENCES.quietHoursEnabled,
    quietHoursStartHour:
      typeof candidate?.quietHoursStartHour === "number"
        ? clampHour(candidate.quietHoursStartHour)
        : DEFAULT_ALERT_PREFERENCES.quietHoursStartHour,
    quietHoursEndHour:
      typeof candidate?.quietHoursEndHour === "number"
        ? clampHour(candidate.quietHoursEndHour)
        : DEFAULT_ALERT_PREFERENCES.quietHoursEndHour,
  };
}

function clampHour(value: number): number {
  return Math.max(0, Math.min(23, Math.floor(value)));
}

function clampMinute(value: number): number {
  return Math.max(0, Math.min(59, Math.floor(value)));
}
