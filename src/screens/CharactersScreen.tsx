import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { CHARACTERS } from '../data/characters';

export function CharactersScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={CHARACTERS}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.element} · {item.path}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { fontSize: 12, color: '#666' }
});
