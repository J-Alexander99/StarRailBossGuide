import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  formatEventDate,
  formatTimeRemaining,
  getLiveEventTheme,
  getLiveEvents,
  type LiveEvent,
} from "../data/liveEvents";
import { useAppPreferences } from "../context/AppPreferencesContext";
import {
  DEFAULT_ALERT_PREFERENCES,
  getAlertPreferences,
} from "../services/eventNotifications";

const palette = {
  background: "#130914",
  surface: "#191222",
  surfaceBorder: "rgba(255, 255, 255, 0.06)",
  textPrimary: "#f4ecff",
  textSecondary: "#c7b9d6",
  textMuted: "#9f8ab8",
  accent: "#ff6ce0",
  accentSoft: "rgba(255, 108, 224, 0.14)",
};

function EventCard({
  item,
  now,
  timezoneMode,
  textScale,
}: {
  item: LiveEvent;
  now: Date;
  timezoneMode: "local" | "utc";
  textScale: number;
}) {
  const theme = getLiveEventTheme(item.id, item.game);
  const gameLabel =
    item.game === "hsr" ? "HSR" : item.game === "genshin" ? "GENSHIN" : "ZZZ";

  return (
    <View
      style={[
        styles.eventCard,
        {
          backgroundColor: theme.cardBackground,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <View
        style={[styles.eventAccent, { backgroundColor: theme.accentColor }]}
      />
      <View
        style={[
          styles.eventGlow,
          { backgroundColor: theme.secondaryAccentColor },
        ]}
      />

      <View style={styles.eventHeaderRow}>
        <Text
          style={[
            styles.eventName,
            { color: theme.nameText, fontSize: 16 * textScale },
          ]}
        >
          {item.name}
        </Text>
        <View
          style={[
            styles.categoryPill,
            {
              backgroundColor: theme.labelBackground,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Text style={[styles.categoryPillText, { color: theme.labelText }]}>
            {gameLabel} · {item.category === "endgame" ? "Endgame" : "System"}
          </Text>
        </View>
      </View>

      <Text style={[styles.countdown, { color: theme.countdownText }]}>
        {formatTimeRemaining(item.nextReset, now)}
      </Text>
      <Text style={[styles.resetLabel, { color: theme.mutedText }]}>
        Resets {formatEventDate(item.nextReset, timezoneMode)}
      </Text>
    </View>
  );
}

export function LiveEventsScreen() {
  const [now, setNow] = useState(() => new Date());
  const { preferences } = useAppPreferences();
  const [alertPreferences, setAlertPreferences] = useState(
    DEFAULT_ALERT_PREFERENCES,
  );

  const scaledTitle = 22 * preferences.textScale;
  const scaledSubtitle = 14 * preferences.textScale;

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    getAlertPreferences()
      .then((value) => setAlertPreferences(value))
      .catch(() => {
        // Keep defaults if preferences cannot be loaded.
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      getAlertPreferences()
        .then((value) => {
          if (!cancelled) {
            setAlertPreferences(value);
          }
        })
        .catch(() => {
          // Ignore and keep current values.
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const events = useMemo(
    () =>
      getLiveEvents(now, {
        includeGenshin: alertPreferences.includeGenshinEvents,
        includeZzz: alertPreferences.includeZzzEvents,
      }),
    [
      now,
      alertPreferences.includeGenshinEvents,
      alertPreferences.includeZzzEvents,
    ],
  );

  return (
    <View
      style={[
        styles.container,
        preferences.highContrast && styles.containerHighContrast,
      ]}
    >
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontSize: scaledTitle }]}>
              Live Events
            </Text>
            <Text style={[styles.headerSubtitle, { fontSize: scaledSubtitle }]}>
              Countdown tracking for endgame mode resets, next banner, and next
              version update with color-coded event cards.
            </Text>
            <Text style={[styles.headerSubtitle, styles.timezoneBadge]}>
              Timezone: {preferences.timezoneMode.toUpperCase()}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <EventCard
            item={item}
            now={now}
            timezoneMode={preferences.timezoneMode}
            textScale={preferences.textScale}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  containerHighContrast: {
    backgroundColor: "#0c050c",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 14,
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: palette.surfaceBorder,
  },
  headerTitle: {
    color: palette.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: palette.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  timezoneBadge: {
    marginTop: 10,
    fontSize: 12,
    color: palette.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  eventCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  eventAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.95,
  },
  eventGlow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 999,
    top: -42,
    right: -30,
    opacity: 0.12,
  },
  eventHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  eventName: {
    color: palette.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  categoryPill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  countdown: {
    marginTop: 12,
    color: palette.accent,
    fontSize: 24,
    fontWeight: "800",
  },
  resetLabel: {
    marginTop: 6,
    color: palette.textMuted,
    fontSize: 13,
  },
});
