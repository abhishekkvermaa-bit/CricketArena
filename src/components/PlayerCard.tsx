import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import { StatName, statDisplayNames, battingStatKeys, bowlingStatKeys } from '../types';

type PlayerCardProps = {
  player: any;
  mode: 'image-only' | 'stats-visible' | 'face-down';
  isComputer?: boolean;
  isBlurred?: boolean;
  selectedStat?: StatName | null;
};

const API_KEY = '20fc158ca7msha85acf70ccb89eap1eaa7djsn55dd8c9b9b2c';
const API_HOST = 'cricbuzz-cricket.p.rapidapi.com';

const computerImage = 'https://via.placeholder.com/400x300/1a1a1a/FFFFFF?text=OPPONENT';

function PlayerCard({player, mode, isComputer = false, isBlurred = false, selectedStat}: PlayerCardProps) {
  if (mode === 'face-down') {
    return <View style={[styles.card, styles.cardBack]} />;
  }
  
  const imageUrl = isComputer && mode === 'image-only' ? computerImage : player.imageUrl;
  const title = isComputer && mode === 'image-only' ? 'Opponent' : player.name;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: imageUrl,
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
          },
        }}
        style={styles.playerImage}
      />

      {mode === 'stats-visible' && (
        <View style={styles.statsOverlay}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.statsContainer}>
            {[...battingStatKeys, ...bowlingStatKeys].map(stat => (
              <View key={stat} style={[styles.statRow, selectedStat === stat && styles.highlightedStat]}>
                <Text style={styles.statLabel}>{statDisplayNames[stat]}</Text>
                <Text style={styles.statValue}>{player.battingStats?.ODI?.[stat] ?? player.bowlingStats?.ODI?.[stat] ?? '-'}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {mode === 'image-only' && (
          <View style={styles.nameOverlay}>
              <Text style={styles.playerName}>{title}</Text>
          </View>
      )}

      {isBlurred && <View style={styles.blurOverlay} />}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 200, height: 300, borderRadius: 20, backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cardBack: { borderWidth: 5, borderColor: '#D4AF37' },
  playerImage: { width: '100%', height: '100%', position: 'absolute' },
  statsOverlay: { flex: 1, width: '100%', backgroundColor: '#000000B3', justifyContent: 'flex-end', padding: 10 },
  blurOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000080' },
  nameOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: '#00000080' },
  playerName: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  statsContainer: { width: '100%' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  highlightedStat: { backgroundColor: '#FFD70050', borderRadius: 4 },
  statLabel: { color: '#FFFFFF80', fontFamily: 'Poppins-Regular', fontSize: 12 },
  statValue: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 12 },
});

export default PlayerCard;