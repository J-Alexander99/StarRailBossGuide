import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  formatEventDate,
  formatTimeRemaining,
  getLiveEventTheme,
  getLiveEvents,
  type LiveEvent,
} from "../data/liveEvents";

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

function EventCard({ item, now }: { item: LiveEvent; now: Date }) {
  const theme = getLiveEventTheme(item.id);

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
        style={[
          styles.eventAccent,
          { backgroundColor: theme.accentColor },
        ]}
      />
      <View
        style={[
          styles.eventGlow,
          { backgroundColor: theme.secondaryAccentColor },
        ]}
      />

      <View style={styles.eventHeaderRow}>
        <Text style={[styles.eventName, { color: theme.nameText }]}>
          {item.name}
        </Text>
        <View
          style={[
            styles.categoryPill,
            { backgroundColor: theme.labelBackground, borderColor: theme.borderColor },
          ]}
        >
          <Text style={[styles.categoryPillText, { color: theme.labelText }]}>
            {item.category === "endgame" ? "Endgame" : "System"}
          </Text>
        </View>
      </View>

      <Text style={[styles.countdown, { color: theme.countdownText }]}>
        {formatTimeRemaining(item.nextReset, now)}
      </Text>
      <Text style={[styles.resetLabel, { color: theme.mutedText }]}>
        Resets {formatEventDate(item.nextReset)}
      </Text>
    </View>
  );
}

export function LiveEventsScreen() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 30_000);

    return () => clearInterval(timer);
  }, []);

  const events = useMemo(() => getLiveEvents(now), [now]);

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Live Events</Text>
            <Text style={styles.headerSubtitle}>
              Countdown tracking for endgame mode resets, next banner, and next
              version update with color-coded event cards.
            </Text>
          </View>
        }
        renderItem={({ item }) => <EventCard item={item} now={now} />}
      />
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
