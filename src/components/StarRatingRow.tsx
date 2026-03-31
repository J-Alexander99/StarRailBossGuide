import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StarRatingRowProps = {
  rating: number;
  color: string;
  size?: number;
  spacing?: number;
  emptyColor?: string;
};

const STAR_COUNT = 5;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function StarRatingRow({
  rating,
  color,
  size = 16,
  spacing = 2,
  emptyColor = "#6b7280",
}: StarRatingRowProps) {
  const normalizedStars = clamp(rating, 0, 10) / 2;

  return (
    <View style={[styles.row, { gap: spacing }]}>
      {Array.from({ length: STAR_COUNT }).map((_, index) => {
        const fillRatio = clamp(normalizedStars - index, 0, 1);

        return (
          <View key={`star-${index}`} style={{ width: size, height: size }}>
            <Text
              style={[
                styles.star,
                { color: emptyColor, fontSize: size, lineHeight: size },
              ]}
            >
              ★
            </Text>
            {fillRatio > 0 ? (
              <View style={[styles.fillMask, { width: `${fillRatio * 100}%` }]}>
                <Text
                  style={[
                    styles.star,
                    { color, fontSize: size, lineHeight: size },
                  ]}
                >
                  ★
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  star: {
    includeFontPadding: false,
  },
  fillMask: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
  },
});
