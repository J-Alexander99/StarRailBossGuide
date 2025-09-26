import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { useWindowDimensions } from "react-native";
import { CHARACTERS } from "../data/characters";
import { useCharacterOwnership } from "../context/CharacterOwnershipContext";

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
};

const TILE_GAP = 12;
const LIST_HORIZONTAL_PADDING = 20;
const MIN_TILE_SIZE = 60;
const MAX_TILE_SIZE = 88;
const MIN_COLUMNS = 4;
const MAX_COLUMNS = 7;

const getCharacterImage = (characterId: string) => {
  try {
    return require(`../../images/${characterId}.webp`);
  } catch (error) {
    return null;
  }
};

export function SettingsScreen() {
  const { isCharacterOwned, toggleCharacterOwnership, disabledCharacterList } =
    useCharacterOwnership();
  const { width } = useWindowDimensions();

  const sortedCharacters = useMemo(
    () =>
      [...CHARACTERS].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      ),
    []
  );

  const { columns, tileSize } = useMemo(() => {
    const availableWidth = Math.max(0, width - LIST_HORIZONTAL_PADDING * 2);
    const estimatedColumns = Math.floor(
      (availableWidth + TILE_GAP) / (MIN_TILE_SIZE + TILE_GAP)
    );
    const clampedColumns = Math.max(
      MIN_COLUMNS,
      Math.min(MAX_COLUMNS, estimatedColumns || MIN_COLUMNS)
    );
    const usableWidth = Math.max(
      0,
      availableWidth - TILE_GAP * (clampedColumns - 1)
    );
    const calculatedSize = usableWidth / clampedColumns;
    const clampedSize = Math.max(
      MIN_TILE_SIZE,
      Math.min(MAX_TILE_SIZE, calculatedSize)
    );

    const finalColumns = Math.max(
      MIN_COLUMNS,
      Math.min(
        MAX_COLUMNS,
        Math.floor(
          (availableWidth + TILE_GAP) / (clampedSize + TILE_GAP)
        ) || MIN_COLUMNS
      )
    );
    const finalUsableWidth = Math.max(
      0,
      availableWidth - TILE_GAP * (finalColumns - 1)
    );
    const finalTileSize = finalUsableWidth / finalColumns;

    return {
      columns: finalColumns,
      tileSize: Math.max(
        MIN_TILE_SIZE,
        Math.min(MAX_TILE_SIZE, finalTileSize)
      ),
    };
  }, [width]);

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
            <Text style={styles.headerTitle}>Settings & Roster</Text>
            <Text style={styles.headerSubtitle}>
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
    marginBottom: 4,
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
    borderColor: "rgba(255, 108, 224, 0.35)",
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
});
