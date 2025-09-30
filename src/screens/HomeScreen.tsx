import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BossGuide</Text>
      <Text style={styles.subtitle}>
        Quick reference for Star Rail bosses (skeleton app)
      </Text>
      <View style={styles.testContainer}>
        <Text style={styles.testText}>TESTING</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#2d2d2dff",
  },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6b6b6bff", textAlign: "center" },
  testContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  testText: { color: "#fff", fontSize: 16 },
});
