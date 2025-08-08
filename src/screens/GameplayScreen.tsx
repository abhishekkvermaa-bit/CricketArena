import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import GameTable from '../../src/components/GameTable';
import StatsSelector from '../../src/components/StatsSelector';
import { useGameLogic } from '../../src/hooks/useGameLogic';

function GameplayScreen({ route, navigation }: NativeStackScreenProps<RootStackParamList, 'Gameplay'>) {
  const {
    playerDeck, computerDeck, gameState, setGameState, selectedStat, roundWinner, currentTurn,
    setupGame, handleStatSelect, finalizeRound, cardsInPlay, roundNumber, computerSelectedStat,
  } = useGameLogic();
  
  const currentPlayerCard = playerDeck.length > 0 ? playerDeck[0] : null;
  const statToHighlight = gameState === 'awaiting_player' ? computerSelectedStat : selectedStat;

  useEffect(() => {
    if (gameState === 'game_over') {
      navigation.replace('GameOver', {
        result: playerDeck.length > 0 ? 'win' : 'loss',
        reason: 'all_cards',
        mode: 'Gameplay',
      });
    }
  }, [gameState]);

  useEffect(() => {
    if (route.params?.reset) {
      setupGame();
      navigation.setParams({ reset: false });
    }
  }, [route.params?.reset]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Levels'}</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.deckCountText}>Player: {playerDeck.length}</Text>
          <Text style={styles.deckCountText}>Computer: {computerDeck.length}</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
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
      </View>
      
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0a0a0a' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 8,
    height: 50,
  },
  gameArea: {
    flex: 1,
    marginVertical: 5,
  },
  backButtonText: { 
    color: '#FFFFFF', 
    fontSize: 18, 
    fontFamily: 'Poppins-Regular' 
  },
  deckCountText: { 
    color: '#FFFFFF', 
    fontFamily: 'Poppins-SemiBold', 
    fontSize: 14, 
    textAlign: 'right' 
  },
  bottomContainer: { 
    height: 130,
    justifyContent: 'center',
    paddingBottom: 10,
    paddingTop: 5,
    marginBottom: 75, 
  },
});



export default GameplayScreen;
