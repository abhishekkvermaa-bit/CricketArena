import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';
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
  // --- FIX #1: Initialize the card in the correct starting position ---
  const rotate = useSharedValue(mode === 'face-down' ? 180 : 0);

  useEffect(() => {
    // --- FIX #2: Only perform the timed animation when revealing the card ---
    if (mode === 'stats-visible' || (mode === 'image-only' && !isComputer)) {
        // This is the flip from face-down to face-up
        rotate.value = withTiming(0, { duration: 500 });
    } else {
        // For all other cases (like resetting on Next Round), make the change instant
        rotate.value = 180;
    }
  }, [mode]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateY: `${rotate.value}deg` }],
    };
  });

  // These styles are used to prevent seeing the back of a card face during the flip
  const frontStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(rotate.value, [90, 91], [1, 0]),
    };
  });
  const backStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(rotate.value, [89, 90], [0, 1]),
    };
  });

  const getStatValue = (stat: StatName) => {
    return player.battingStats?.ODI?.[stat] ?? player.bowlingStats?.ODI?.[stat] ?? '-';
  }

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      {/* Card Back */}
      <Animated.View style={[styles.card, styles.cardFace, styles.cardBack, backStyle]} />

      {/* Card Front */}
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
              {[...battingStatKeys, ...bowlingStatKeys].map(stat => (
                <View key={stat} style={[styles.statRow, selectedStat === stat && styles.highlightedStat]}>
                  <Text style={styles.statLabel}>{statDisplayNames[stat]}</Text>
                  <Text style={styles.statValue}>{getStatValue(stat)}</Text>
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
  cardFace: { position: 'absolute' },
  cardBack: { borderWidth: 5, borderColor: '#D4AF37', backgroundColor: '#111' },
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