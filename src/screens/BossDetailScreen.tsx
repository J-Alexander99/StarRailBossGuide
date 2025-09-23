import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BOSSES } from '../data/bosses';
import { teamsMatchingWeakness, resolveTeamMembers } from '../data/teams';

export function BossDetailScreen({ route }: any) {
  const { bossId } = route.params;
  const boss = BOSSES.find((b) => b.id === bossId);

  if (!boss) {
    return (
      <View style={styles.container}>
        <Text>Boss not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>
      <Text style={styles.name}>{boss.name}</Text>
      <Text style={styles.location}>{boss.location}</Text>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.paragraph}>{boss.description}</Text>
      <Text style={styles.sectionTitle}>Weakness</Text>
      <Text style={styles.paragraph}>{boss.weakness || '—'}</Text>

      <Text style={styles.sectionTitle}>Recommended teams</Text>
      {teamsMatchingWeakness(boss.weakness).map((team) => (
        <View key={team.id} style={styles.teamCard}>
          <Text style={styles.teamName}>{team.name}</Text>
          {team.notes ? <Text style={styles.teamNotes}>{team.notes}</Text> : null}
          <View style={styles.memberRow}>
            {resolveTeamMembers(team).map((m) => (
              <View key={m.id} style={styles.memberPill}>
                <Text style={styles.memberText}>{m.name} • {m.element}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  name: { fontSize: 26, fontWeight: '700', marginBottom: 6 },
  location: { fontSize: 14, color: '#666', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 12 },
  paragraph: { fontSize: 14, color: '#333', marginTop: 6 }
  ,
  teamCard: { padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginTop: 10 },
  teamName: { fontSize: 16, fontWeight: '700' },
  teamNotes: { fontSize: 12, color: '#666', marginTop: 4 },
  memberRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  memberPill: { backgroundColor: '#f3f3f3', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 8 },
  memberText: { fontSize: 12 }
});
