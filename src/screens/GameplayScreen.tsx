import React, {useEffect, useState} from 'react';
 import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button
 } from 'react-native';
 import type {NativeStackScreenProps} from '@react-navigation/native-stack';
 import type {RootStackParamList} from '../navigation/AppNavigator';

import PlayerCard from '../../src/components/PlayerCard';
import StatsSelector from '../../src/components/StatsSelector';
import allPlayersData from '../../src/assets/data/playerData.json';

 type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;
 type Player = (typeof allPlayersData)[0];
 // ... (Your other types like GameState, StatName, etc. can be brought in as we add logic back)

 function GameplayScreen({navigation}: Props) {
  const [playerDeck, setPlayerDeck] = useState<Player[]>([]);
  const [computerDeck, setComputerDeck] = useState<Player[]>([]);

  useEffect(() => {
    // This logic remains the same for now to get some data
    const shuffleArray = (array: Player[]) => array.sort(() => Math.random() - 0.5);
    const shuffledPlayers = shuffleArray([...allPlayersData]);
    const gameDeck = shuffledPlayers.slice(0, 20);
    setPlayerDeck(gameDeck.slice(0, 10));
    setComputerDeck(gameDeck.slice(10, 20));
  }, []);

  const currentPlayerCard = playerDeck.length > 0 ? playerDeck?.[0] : null;
  const computerPlayerCard = computerDeck.length > 0 ? computerDeck?.[0] : null;

  if (!currentPlayerCard || !computerPlayerCard) {
    return ( <SafeAreaView style={styles.container}><Text style={styles.infoText}>Loading...</Text></SafeAreaView> );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Computer's Card (Moved Up) */}
        <View style={styles.computerCardContainer}>
          <PlayerCard player={computerPlayerCard} isComputer={true} />
        </View>

        {/* Player's Card (Moved to Middle) */}
        <View style={styles.playerCardContainer}>
          <PlayerCard player={currentPlayerCard} />
        </View>

        {/* Stats Selector Panel */}
        <View style={styles.statsSelectorContainer}>
          <StatsSelector
            player={currentPlayerCard}
            onStatSelect={(stat) => console.log(stat)}
            disabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
 }

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Dark background from your mockup
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-around', // Distribute space vertically
    paddingVertical: 20,
  },
  computerCardContainer: {
    marginTop: 10, // Adjust as needed
  },
  playerCardContainer: {
    // No specific styling needed for middle position with space-around
  },
  statsSelectorContainer: {
    marginBottom: 10, // Adjust as needed
  },
  infoText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 50,
  },
 });

 export default GameplayScreen;