import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
import { StatName, statDisplayNames, allStatKeys } from '../types';

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
  const rotate = useSharedValue(mode === 'face-down' ? 180 : 0);

  useEffect(() => {
    rotate.value = withTiming(mode === 'face-down' ? 180 : 0, { duration: 500 });
  }, [mode]);

  const animatedStyle = useAnimatedStyle(() => {
    return { transform: [{ rotateY: `${rotate.value}deg` }] };
  });

  const frontStyle = useAnimatedStyle(() => {
    return { opacity: interpolate(rotate.value, [89, 90], [1, 0]) };
  });
  const backStyle = useAnimatedStyle(() => {
    return { opacity: interpolate(rotate.value, [90, 91], [0, 1]) };
  });
  
  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Animated.View style={[styles.card, styles.cardFace, styles.cardBack, backStyle]} />
      <Animated.View style={[styles.card, styles.cardFace, frontStyle]}>
        <Image
          source={{
            uri: isComputer && mode !== 'stats-visible' ? computerImage : player.imageUrl,
            headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST },
          }}
          style={styles.playerImage}
        />
        {mode === 'stats-visible' && (
          <View style={styles.statsOverlay}>
            <Text style={styles.playerName}>{player.name}</Text>
            <View style={styles.statsContainer}>
              {allStatKeys.map(stat => (
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
                <Text style={styles.playerName}>{player.name}</Text>
            </View>
        )}
        {isBlurred && <View style={styles.blurOverlay} />}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardContainer: { width: 200, height: 300 },
  card: { width: '100%', height: '100%', borderRadius: 20, backgroundColor: '#1E1E1E', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  cardFace: { position: 'absolute', backfaceVisibility: 'hidden' },
  cardBack: { borderWidth: 5, borderColor: '#D4AF37', backgroundColor: '#111', transform: [{ rotateY: '180deg' }] },
  playerImage: { width: '100%', height: '100%', position: 'absolute' },
  statsOverlay: { flex: 1, width: '100%', backgroundColor: '#000000B3', justifyContent: 'flex-end', padding: 10 },
  blurOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#00000080' },
  nameOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 10, backgroundColor: '#00000080' },
  playerName: { fontSize: 18, fontFamily: 'Poppins-Bold', color: '#FFFFFF', textAlign: 'center', marginBottom: 8 },
  statsContainer: { width: '100%' },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 2 },
  highlightedStat: { backgroundColor: '#FFD70050', borderRadius: 4 },
  statLabel: { color: '#FFFFFF80', fontFamily: 'Poppins-Regular', fontSize: 12 },
  statValue: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 12 },
});

export default PlayerCard;