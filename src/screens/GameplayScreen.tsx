import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

import GameTable from '../../src/components/GameTable';
import StatsSelector from '../../src/components/StatsSelector';
import { useGameLogic } from '../../src/hooks/useGameLogic';

// We need to update the props to include 'route' so we can handle "Play Again"
type Props = NativeStackScreenProps<RootStackParamList, 'Gameplay'>;

function GameplayScreen({ route, navigation }: Props) {
  const {
    playerDeck,
    computerDeck,
    gameState,
    setGameState,
    selectedStat,
    roundWinner,
    currentTurn,
    setupGame,
    handleStatSelect,
    finalizeRound,
    cardsInPlay,
    roundNumber,
    computerSelectedStat,
  } = useGameLogic();
  
  // --- THIS IS THE FIX ---
  // This 'effect' watches the game state. When it becomes 'game_over',
  // it navigates to our new GameOverScreen.
  useEffect(() => {
    if (gameState === 'game_over') {
      navigation.replace('GameOver', {
        result: playerDeck.length > 0 ? 'win' : 'loss',
      });
    }
  }, [gameState]);

  // This 'effect' watches for the "Play Again" command from the GameOverScreen
  useEffect(() => {
    if (route.params?.reset) {
      setupGame();
      // Clear the parameter so it doesn't run again on a hot-reload
      navigation.setParams({ reset: false }); 
    }
  }, [route.params?.reset]);
  // --------------------
  
  const currentPlayerCard = playerDeck.length > 0 ? playerDeck[0] : null;
  const statToHighlight = gameState === 'awaiting_player' ? computerSelectedStat : selectedStat;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Levels'}</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.deckCountText}>Player: {playerDeck.length}</Text>
          <Text style={styles.deckCountText}>Computer: {computerDeck.length}</Text>
        </View>
      </View>

      <GameTable 
        key={roundNumber}
        playerDeck={playerDeck}
        computerDeck={computerDeck}
        gameState={gameState}
        setGameState={setGameState}
        selectedStat={statToHighlight}
        roundWinner={roundWinner}
        cardsInPlay={cardsInPlay}
        finalizeRound={finalizeRound}
      />
      
      <View style={styles.bottomContainer}>
        {currentPlayerCard && (
          <StatsSelector 
            player={currentPlayerCard}
            onStatSelect={handleStatSelect} 
            disabled={currentTurn === 'computer' && gameState !== 'awaiting_player'}
            computerSelectedStat={computerSelectedStat}
          />
        )}
      </View>
      
      {/* The old 'game_over' overlay has now been removed */}
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, zIndex: 10 },
    backButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Regular' },
    deckCountText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 14, textAlign: 'right' },
    bottomContainer: { paddingBottom: 20, justifyContent: 'center' },
});

export default GameplayScreen;