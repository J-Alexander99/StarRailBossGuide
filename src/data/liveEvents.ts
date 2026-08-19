export type LiveEventCategory = "endgame" | "system";
export type LiveEventGame = "hsr" | "genshin" | "zzz";
export type LiveEventKind = "endgame" | "banner" | "update";

export interface LiveEvent {
  id: string;
  name: string;
  category: LiveEventCategory;
  game: LiveEventGame;
  kind: LiveEventKind;
  nextReset: Date;
  /** True when `nextReset` came from a manual override rather than the computed schedule. */
  isOverridden?: boolean;
}

export interface LiveEventQueryOptions {
  includeGenshin?: boolean;
  includeZzz?: boolean;
  /**
   * Manual per-event corrections (event id -> ISO reset date), used when the
   * in-game schedule has drifted from the computed one. An override is only
   * applied while its date is still in the future; once it passes, the
   * event reverts to its normal computed schedule automatically.
   */
  overrides?: Record<string, string>;
}

export interface LiveEventTheme {
  accentColor: string;
  secondaryAccentColor: string;
  cardBackground: string;
  borderColor: string;
  labelBackground: string;
  labelText: string;
  nameText: string;
  mutedText: string;
  countdownText: string;
}

interface CyclingEventConfig {
  id: string;
  name: string;
  category: LiveEventCategory;
  game: LiveEventGame;
  kind: LiveEventKind;
  anchorUtcIso: string;
  cycleDays: number;
}

// Banners and version updates recur on a regular cadence just like endgame
// modes do, so they're modeled the same way: an anchor date (any past
// occurrence works) plus how often the cycle repeats. This keeps the
// countdown accurate indefinitely instead of needing a one-off date bumped
// by hand every patch. Real-world patch lengths occasionally vary by a few
// days (e.g. a 5-week patch instead of the usual 6), so treat the computed
// date as an estimate and use `eventOverrides`/`LiveEventQueryOptions.overrides`
// to correct an individual occurrence when it drifts from the announced date.
type FixedEventConfig = CyclingEventConfig;

// Keep these in UTC so all users get consistent countdowns regardless of locale.
const CYCLING_EVENTS: CyclingEventConfig[] = [
  {
    id: "memory-of-chaos",
    name: "Memory of Chaos",
    category: "endgame",
    game: "hsr",
    kind: "endgame",
    anchorUtcIso: "2026-04-13T03:00:00Z",
    cycleDays: 42,
  },
  {
    id: "pure-fiction",
    name: "Pure Fiction",
    category: "endgame",
    game: "hsr",
    kind: "endgame",
    anchorUtcIso: "2026-05-11T03:00:00Z",
    cycleDays: 42,
  },
  {
    id: "apocalyptic-shadow",
    name: "Apocalyptic Shadow",
    category: "endgame",
    game: "hsr",
    kind: "endgame",
    anchorUtcIso: "2026-04-27T03:00:00Z",
    cycleDays: 42,
  },
  {
    id: "anomaly-arbitration",
    name: "Anomaly Arbitration",
    category: "endgame",
    game: "hsr",
    kind: "endgame",
    anchorUtcIso: "2026-04-21T22:00:00Z",
    cycleDays: 42,
  },
  {
    id: "genshin-spiral-abyss",
    name: "Spiral Abyss",
    category: "endgame",
    game: "genshin",
    kind: "endgame",
    anchorUtcIso: "2026-04-01T04:00:00Z",
    cycleDays: 15,
  },
  {
    id: "genshin-imaginarium-theater",
    name: "Imaginarium Theater",
    category: "endgame",
    game: "genshin",
    kind: "endgame",
    anchorUtcIso: "2026-04-01T04:00:00Z",
    cycleDays: 30,
  },
  {
    id: "genshin-stygian-onslaught",
    name: "Stygian Onslaught",
    category: "endgame",
    game: "genshin",
    kind: "endgame",
    anchorUtcIso: "2026-04-07T04:00:00Z",
    cycleDays: 14,
  },
  {
    id: "zzz-shiyu-defense",
    name: "Shiyu Defence",
    category: "endgame",
    game: "zzz",
    kind: "endgame",
    anchorUtcIso: "2026-04-06T04:00:00Z",
    cycleDays: 14,
  },
  {
    id: "zzz-deadly-assault",
    name: "Deadly Assault",
    category: "endgame",
    game: "zzz",
    kind: "endgame",
    anchorUtcIso: "2026-04-13T04:00:00Z",
    cycleDays: 14,
  },
];

const FIXED_EVENTS: FixedEventConfig[] = [
  {
    // Anchored to Version 4.5's Phase 2 banner (Aventurine Waveflair), Sep 12
    // 2026; HSR banners change roughly every 3 weeks.
    id: "next-banner",
    name: "Next Banner",
    category: "system",
    game: "hsr",
    kind: "banner",
    anchorUtcIso: "2026-09-12T11:00:00Z",
    cycleDays: 21,
  },
  {
    // Anchored to Version 4.5's launch, Aug 26 2026; HSR version updates
    // land roughly every 6 weeks (occasionally 5, as 4.5 was).
    id: "next-version-update",
    name: "Next Update",
    category: "system",
    game: "hsr",
    kind: "update",
    anchorUtcIso: "2026-08-26T11:00:00Z",
    cycleDays: 42,
  },
  {
    // Anchored to Version 7.0 Phase 2 (Genshin's Snezhnaya-cycle opener),
    // Sep 1 2026; Genshin banners change roughly every 3 weeks.
    id: "genshin-next-banner",
    name: "Genshin Next Banner",
    category: "system",
    game: "genshin",
    kind: "banner",
    anchorUtcIso: "2026-09-01T10:00:00Z",
    cycleDays: 21,
  },
  {
    // Anchored to Version 7.0's launch, Aug 12 2026; Genshin version
    // updates land roughly every 6 weeks.
    id: "genshin-next-version-update",
    name: "Genshin Next Update",
    category: "system",
    game: "genshin",
    kind: "update",
    anchorUtcIso: "2026-08-12T10:00:00Z",
    cycleDays: 42,
  },
  {
    // Anchored to Version 3.1's Phase 2 banner (Sigrid's debut), Aug 19
    // 2026; ZZZ banners change roughly every 3 weeks.
    id: "zzz-next-banner",
    name: "ZZZ Next Banner",
    category: "system",
    game: "zzz",
    kind: "banner",
    anchorUtcIso: "2026-08-19T04:00:00Z",
    cycleDays: 21,
  },
  {
    // Anchored to Version 3.1's launch, Jul 29 2026; ZZZ version updates
    // land roughly every 6 weeks.
    id: "zzz-next-version-update",
    name: "ZZZ Next Update",
    category: "system",
    game: "zzz",
    kind: "update",
    anchorUtcIso: "2026-07-29T04:00:00Z",
    cycleDays: 42,
  },
];

export const DAY_MS = 24 * 60 * 60 * 1000;
export const HOUR_MS = 60 * 60 * 1000;
export const MINUTE_MS = 60 * 1000;

const DEFAULT_THEME: LiveEventTheme = {
  accentColor: "#ff6ce0",
  secondaryAccentColor: "#ff9cec",
  cardBackground: "#191222",
  borderColor: "rgba(255, 255, 255, 0.08)",
  labelBackground: "rgba(255, 108, 224, 0.16)",
  labelText: "#f4ecff",
  nameText: "#f4ecff",
  mutedText: "#b8a6d9",
  countdownText: "#ff6ce0",
};

const GAME_THEMES: Record<Exclude<LiveEventGame, "hsr">, LiveEventTheme> = {
  genshin: {
    accentColor: "#22c55e",
    secondaryAccentColor: "#60a5fa",
    cardBackground: "#102319",
    borderColor: "rgba(34, 197, 94, 0.42)",
    labelBackground: "rgba(59, 130, 246, 0.2)",
    labelText: "#dbeafe",
    nameText: "#ecfdf3",
    mutedText: "#93c5fd",
    countdownText: "#22c55e",
  },
  zzz: {
    accentColor: "#f97316",
    secondaryAccentColor: "#0a0a0a",
    cardBackground: "#101010",
    borderColor: "rgba(249, 115, 22, 0.45)",
    labelBackground: "rgba(0, 0, 0, 0.48)",
    labelText: "#ffedd5",
    nameText: "#fff7ed",
    mutedText: "#fdba74",
    countdownText: "#f97316",
  },
};

const EVENT_THEMES: Record<string, LiveEventTheme> = {
  "memory-of-chaos": {
    accentColor: "#ef4444",
    secondaryAccentColor: "#fb7185",
    cardBackground: "#25151a",
    borderColor: "rgba(239, 68, 68, 0.45)",
    labelBackground: "rgba(239, 68, 68, 0.2)",
    labelText: "#ffe5e5",
    nameText: "#fff1f1",
    mutedText: "#f2b7b7",
    countdownText: "#ff6b6b",
  },
  "pure-fiction": {
    accentColor: "#3b82f6",
    secondaryAccentColor: "#38bdf8",
    cardBackground: "#152035",
    borderColor: "rgba(59, 130, 246, 0.45)",
    labelBackground: "rgba(59, 130, 246, 0.2)",
    labelText: "#dbeafe",
    nameText: "#ecf4ff",
    mutedText: "#aac6e8",
    countdownText: "#60a5fa",
  },
  "apocalyptic-shadow": {
    accentColor: "#a855f7",
    secondaryAccentColor: "#c084fc",
    cardBackground: "#221834",
    borderColor: "rgba(168, 85, 247, 0.45)",
    labelBackground: "rgba(168, 85, 247, 0.2)",
    labelText: "#f3e8ff",
    nameText: "#f7edff",
    mutedText: "#d8b4fe",
    countdownText: "#c084fc",
  },
  "anomaly-arbitration": {
    accentColor: "#f3f4f6",
    secondaryAccentColor: "#d1d5db",
    cardBackground: "#20242b",
    borderColor: "rgba(243, 244, 246, 0.35)",
    labelBackground: "rgba(243, 244, 246, 0.14)",
    labelText: "#f9fafb",
    nameText: "#f3f4f6",
    mutedText: "#d1d5db",
    countdownText: "#f9fafb",
  },
  "next-banner": {
    accentColor: "#cab689",
    secondaryAccentColor: "#e6d7b4",
    cardBackground: "#2a2116",
    borderColor: "rgba(202, 182, 137, 0.5)",
    labelBackground: "rgba(202, 182, 137, 0.2)",
    labelText: "#f3e7cb",
    nameText: "#f4ead4",
    mutedText: "#d4c2a0",
    countdownText: "#e6d7b4",
  },
  "next-version-update": {
    accentColor: "#d0bd94",
    secondaryAccentColor: "#78889d",
    cardBackground: "#1b2430",
    borderColor: "rgba(120, 136, 157, 0.45)",
    labelBackground: "rgba(120, 136, 157, 0.24)",
    labelText: "#e2dfd5",
    nameText: "#ebe7dd",
    mutedText: "#a9b6c8",
    countdownText: "#d8c7a2",
  },
};

function getNextCyclingDate(
  anchorUtcIso: string,
  cycleDays: number,
  now: Date,
): Date {
  const anchorTime = new Date(anchorUtcIso).getTime();
  const cycleMs = cycleDays * DAY_MS;
  const nowTime = now.getTime();

  if (nowTime <= anchorTime) {
    return new Date(anchorTime);
  }

  const elapsedCycles = Math.floor((nowTime - anchorTime) / cycleMs);
  const nextCycleTime = anchorTime + (elapsedCycles + 1) * cycleMs;
  return new Date(nextCycleTime);
}

export function getLiveEvents(
  now: Date = new Date(),
  options: LiveEventQueryOptions = {},
): LiveEvent[] {
  const includeGenshin = options.includeGenshin ?? false;
  const includeZzz = options.includeZzz ?? false;
  const overrides = options.overrides ?? {};

  const applyOverride = (event: LiveEvent): LiveEvent => {
    const overrideIso = overrides[event.id];
    if (!overrideIso) {
      return event;
    }

    const overrideTime = new Date(overrideIso).getTime();
    if (Number.isNaN(overrideTime) || overrideTime <= now.getTime()) {
      // Stale or invalid override - fall back to the computed schedule.
      return event;
    }

    return { ...event, nextReset: new Date(overrideTime), isOverridden: true };
  };

  const cyclingEvents: LiveEvent[] = CYCLING_EVENTS.map((event) =>
    applyOverride({
      id: event.id,
      name: event.name,
      category: event.category,
      game: event.game,
      kind: event.kind,
      nextReset: getNextCyclingDate(event.anchorUtcIso, event.cycleDays, now),
    }),
  );

  const fixedEvents: LiveEvent[] = FIXED_EVENTS.map((event) =>
    applyOverride({
      id: event.id,
      name: event.name,
      category: event.category,
      game: event.game,
      kind: event.kind,
      nextReset: getNextCyclingDate(event.anchorUtcIso, event.cycleDays, now),
    }),
  );

  return [...cyclingEvents, ...fixedEvents]
    .filter((event) => {
      if (event.game === "genshin") {
        return includeGenshin;
      }

      if (event.game === "zzz") {
        return includeZzz;
      }

      return true;
    })
    .sort((a, b) => a.nextReset.getTime() - b.nextReset.getTime());
}

export function formatTimeRemaining(
  targetDate: Date,
  now: Date = new Date(),
): string {
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "Now";
  }

  const days = Math.floor(diff / DAY_MS);
  const hours = Math.floor((diff % DAY_MS) / HOUR_MS);
  const minutes = Math.floor((diff % HOUR_MS) / MINUTE_MS);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${Math.max(1, minutes)}m`;
}

export function formatEventDate(
  targetDate: Date,
  timezoneMode: "local" | "utc" = "local",
): string {
  return targetDate.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezoneMode === "utc" ? "UTC" : undefined,
    timeZoneName: timezoneMode === "utc" ? "short" : undefined,
  });
}

export function getLiveEventTheme(
  eventId: string,
  game: LiveEventGame = "hsr",
): LiveEventTheme {
  if (EVENT_THEMES[eventId]) {
    return EVENT_THEMES[eventId];
  }

  if (game === "genshin" || game === "zzz") {
    return GAME_THEMES[game];
  }

  return DEFAULT_THEME;
}
