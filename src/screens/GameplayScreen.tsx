import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

import playerData from '../../src/assets/data/playerData.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;
type Player = (typeof playerData)[0];

// --- NEW: Define our API credentials here ---
const API_KEY = '20fc158ca7msha85acf70ccb89eap1eaa7djsn55dd8c9b9b2c';
const API_HOST = 'cricbuzz-cricket.p.rapidapi.com';
// -----------------------------------------

function GameplayScreen({navigation}: Props) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * playerData.length);
    setCurrentPlayer(playerData[randomIndex]);
  }, []);

  if (!currentPlayer) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.infoText}>Loading Player...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'< Levels'}</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        {/* --- THIS IS THE CHANGE --- */}
        <Image
          source={{
            uri: currentPlayer.imageUrl,
            headers: {
              'x-rapidapi-key': API_KEY,
              'x-rapidapi-host': API_HOST,
            },
          }}
          style={styles.playerImage}
        />
        {/* -------------------------- */}
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  card: {
    width: '85%',
    backgroundColor: '#FFFFFF10',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  playerImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    marginBottom: 20,
  },
  playerName: {
    fontSize: 28,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
});

export default GameplayScreen;