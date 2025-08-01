import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

import allPlayersData from '../../src/assets/data/playerData.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;
type Player = (typeof allPlayersData)[0];

const API_KEY = '20fc158ca7msha85acf70ccb89eap1eaa7djsn55dd8c9b9b2c';
const API_HOST = 'cricbuzz-cricket.p.rapidapi.com';

type GameState = 'selecting' | 'revealing' | 'game_over';

const battingStatKeys = ['Matches', 'Runs', 'Average', '100s', 'Highest'] as const;
const bowlingStatKeys = ['Wickets', 'BBI', 'Eco'] as const;

type BattingStatName = (typeof battingStatKeys)[number];
type BowlingStatName = (typeof bowlingStatKeys)[number];
type StatName = BattingStatName | BowlingStatName;

function isBattingStat(stat: StatName): stat is BattingStatName {
    return (battingStatKeys as readonly string[]).includes(stat);
}

function GameplayScreen({navigation}: Props) {
  const [playerDeck, setPlayerDeck] = useState<Player[]>([]);
  const [computerDeck, setComputerDeck] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('selecting');
  const [selectedStat, setSelectedStat] = useState<StatName | null>(null);
  const [roundWinner, setRoundWinner] = useState<'player' | 'computer' | 'draw' | null>(null);

  useEffect(() => {
    setupGame();
  }, []);

  const setupGame = () => {
    const shuffleArray = (array: Player[]) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    const shuffledPlayers = shuffleArray([...allPlayersData]);
    const gameDeck = shuffledPlayers.slice(0, 20);
    setPlayerDeck(gameDeck.slice(0, 10));
    setComputerDeck(gameDeck.slice(10, 20));
    setGameState('selecting');
    setRoundWinner(null);
    setSelectedStat(null);
  };

  const handleStatSelect = (statName: StatName) => {
    if (gameState !== 'selecting') return;

    const playerStatValue = getStatValue(playerDeck[0], statName);
    const computerStatValue = getStatValue(computerDeck[0], statName);
    
    let winner: 'player' | 'computer' | 'draw' = 'draw';
    if (statName === 'Eco') {
      if (playerStatValue < computerStatValue) winner = 'player';
      if (computerStatValue < playerStatValue) winner = 'computer';
    } else {
      if (playerStatValue > computerStatValue) winner = 'player';
      if (computerStatValue > playerStatValue) winner = 'computer';
    }
    setRoundWinner(winner);

    setSelectedStat(statName);
    setGameState('revealing');
  };

  // --- NEW: Function to handle the end of a round ---
  const handleNextRound = () => {
    const playerCard = playerDeck[0];
    const computerCard = computerDeck[0];
    
    const newPlayerDeck = playerDeck.slice(1);
    const newComputerDeck = computerDeck.slice(1);

    if (roundWinner === 'player') {
      newPlayerDeck.push(playerCard, computerCard);
    } else if (roundWinner === 'computer') {
      newComputerDeck.push(computerCard, playerCard);
    } else { // Draw
      newPlayerDeck.push(playerCard);
      newComputerDeck.push(computerCard);
    }
    
    setPlayerDeck(newPlayerDeck);
    setComputerDeck(newComputerDeck);
    
    // Check for game over
    if (newPlayerDeck.length === 0 || newComputerDeck.length === 0) {
      setGameState('game_over');
      // We will navigate to a GameOver screen here later
    } else {
      // Reset for next round
      setGameState('selecting');
      setRoundWinner(null);
      setSelectedStat(null);
    }
  };
  
  const getStatValue = (player: Player, statName: StatName): number => {
    let value: string | undefined = '0';
  
    if (isBattingStat(statName)) {
      value = player.battingStats?.ODI?.[statName];
    } else {
      value = player.bowlingStats?.ODI?.[statName];
    }
    
    if (statName === 'BBI' && typeof value === 'string' && value.includes('/')) {
        return parseFloat(value.split('/')[0]) || 0;
    }
    
    return parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
  };
  
  const currentPlayerCard = playerDeck.length > 0 ? playerDeck[0] : null;
  const computerPlayerCard = computerDeck.length > 0 ? computerDeck[0] : null;

  if (!currentPlayerCard || !computerPlayerCard) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.infoText}>Setting up the deck...</Text>
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
      
      {/* Deck Counts */}
      <View style={styles.deckCountContainer}>
        <Text style={styles.deckCountText}>Player: {playerDeck.length}</Text>
        <Text style={styles.deckCountText}>Computer: {computerDeck.length}</Text>
      </View>

      <View style={[styles.card, styles.computerCard, { opacity: gameState === 'revealing' ? 1 : 0 }]}>
        <Image source={{ uri: computerPlayerCard.imageUrl, headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST } }} style={styles.playerImage} />
        <Text style={styles.playerName}>{computerPlayerCard.name}</Text>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: currentPlayerCard.imageUrl, headers: { 'x-rapidapi-key': API_KEY, 'x-rapidapi-host': API_HOST } }} style={styles.playerImage} />
        <Text style={styles.playerName}>{currentPlayerCard.name}</Text>
        <View style={styles.statsContainer}>
          {battingStatKeys.map(stat => (
            <TouchableOpacity key={stat} style={styles.statRow} onPress={() => handleStatSelect(stat)} disabled={gameState !== 'selecting'}>
              <Text style={styles.statLabel}>{stat}</Text>
              <Text style={styles.statValue}>{currentPlayerCard.battingStats?.ODI?.[stat] ?? 'N/A'}</Text>
            </TouchableOpacity>
          ))}
          {bowlingStatKeys.map(stat => (
            <TouchableOpacity key={stat} style={styles.statRow} onPress={() => handleStatSelect(stat)} disabled={gameState !== 'selecting'}>
              <Text style={styles.statLabel}>{stat}</Text>
              <Text style={styles.statValue}>{currentPlayerCard.bowlingStats?.ODI?.[stat] ?? 'N/A'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {gameState === 'revealing' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            {roundWinner === 'player' && 'You Win!'}
            {roundWinner === 'computer' && 'Computer Wins!'}
            {roundWinner === 'draw' && 'It\'s a Draw!'}
          </Text>
          <Button title="Next Round" onPress={handleNextRound} />
        </View>
      )}

      {gameState === 'game_over' && (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{playerDeck.length > 0 ? 'YOU ARE THE CHAMPION!' : 'GAME OVER'}</Text>
            <Button title="Play Again" onPress={setupGame} />
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  deckCountContainer: {
      position: 'absolute',
      top: 50,
      right: 20,
      alignItems: 'flex-end',
      zIndex: 10,
  },
  deckCountText: {
      color: '#FFFFFF',
      fontFamily: 'Poppins-SemiBold',
      fontSize: 16,
  },
  card: {
    width: '90%',
    backgroundColor: '#FFFFFF10',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  computerCard: {
    position: 'absolute',
    top: 80,
    zIndex: 1,
  },
  playerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginBottom: 10,
  },
  playerName: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsContainer: {
    width: '100%',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF20',
  },
  statLabel: {
    color: '#FFFFFF80',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  statValue: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  resultContainer: {
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A0', // semi-transparent black overlay
    zIndex: 20,
  },
  resultText: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
  },
});

export default GameplayScreen;