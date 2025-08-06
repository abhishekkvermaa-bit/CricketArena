import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

import GameTable from '../../src/components/GameTable';
import StatsSelector from '../../src/components/StatsSelector';
import { useGameLogic } from '../../src/hooks/useGameLogic';

function GameplayScreen({navigation}: NativeStackScreenProps<RootStackParamList, 'Gameplay'>) {
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
  } = useGameLogic();
  
  const currentPlayerCard = playerDeck.length > 0 ? playerDeck[0] : null;

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
        selectedStat={selectedStat}
        roundWinner={roundWinner}
        cardsInPlay={cardsInPlay}
        finalizeRound={finalizeRound}
      />
      
      <View style={styles.bottomContainer}>
        {currentPlayerCard && (
          <StatsSelector 
            player={currentPlayerCard}
            onStatSelect={handleStatSelect} 
            disabled={currentTurn !== 'player' || gameState !== 'selecting'}
          />
        )}
      </View>
      
      {gameState === 'game_over' && (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>{playerDeck.length > 0 ? 'YOU ARE THE CHAMPION!' : 'GAME OVER'}</Text>
            <Button title="Play Again" onPress={setupGame} />
        </View>
      )}

      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>State: {gameState}</Text>
        <Text style={styles.debugText}>Turn: {currentTurn}</Text>
        <Text style={styles.debugText}>Round: {roundNumber}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0a0a0a' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, zIndex: 10 },
    backButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Regular' },
    deckCountText: { color: '#FFFFFF', fontFamily: 'Poppins-SemiBold', fontSize: 14, textAlign: 'right' },
    bottomContainer: { paddingBottom: 20, justifyContent: 'center' },
    resultContainer: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000A0', zIndex: 20 },
    resultText: { fontSize: 32, fontFamily: 'Poppins-Bold', color: '#FFD700', marginBottom: 20, textAlign: 'center' },
    debugContainer: { position: 'absolute', bottom: 0, left: 0, backgroundColor: '#00000080', padding: 5, },
    debugText: { color: '#FFFFFF', fontSize: 10, },
});

export default GameplayScreen;