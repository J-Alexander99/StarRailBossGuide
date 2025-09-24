import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { BOSSES, Boss } from "../data/bosses";

export function BossListScreen({ navigation }: { navigation: any }) {
  const renderItem = ({ item }: { item: Boss }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate("BossDetail", { bossId: item.id })}
    >
      <Text style={styles.itemTitle}>{item.name}</Text>
      <Text style={styles.itemSubtitle}>{item.location}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={BOSSES}
        keyExtractor={(i) => i.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemTitle: { fontSize: 18, fontWeight: '600' },
  itemSubtitle: { fontSize: 12, color: '#666' }
});
