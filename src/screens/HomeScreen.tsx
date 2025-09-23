import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>BossGuide</Text>
      <Text style={styles.subtitle}>Quick reference for Star Rail bosses (skeleton app)</Text>
      <view style={styles.container}>TESTING</view>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#2d2d2dff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6b6b6bff', textAlign: 'center' }
});
