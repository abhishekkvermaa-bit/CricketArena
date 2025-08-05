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
    handleNextRound,
    getStatValue, // We'll use this for the result text
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

      {/* --- NEW, STRUCTURED LAYOUT --- */}
      {/* This container will hold the cards and take up the available space */}
      <View style={styles.gameTableContainer}>
        <GameTable 
          playerDeck={playerDeck}
          computerDeck={computerDeck}
          gameState={gameState}
          setGameState={setGameState}
          selectedStat={selectedStat}
          roundWinner={roundWinner}
        />
      </View>
      
      {/* This container will hold the stats and sit at the bottom */}
      <View style={styles.bottomContainer}>
        {gameState !== 'dealing' && currentPlayerCard && (
          <StatsSelector 
            player={currentPlayerCard}
            onStatSelect={handleStatSelect} 
            disabled={currentTurn !== 'player' || gameState !== 'selecting'}
          />
        )}
      </View>
      {/* --------------------------- */}
      
      {/* Overlays for results and game over */}
      {gameState === 'revealing' && (
        <View style={styles.resultContainer}>
            <Text style={styles.resultText}>
              {roundWinner === 'player' && 'You Win!'}
              {roundWinner === 'computer' && 'Computer Wins!'}
              {roundWinner === 'draw' && 'It\'s a Draw!'}
            </Text>
            {selectedStat && (
              <Text style={styles.resultStatText}>
                {getStatValue(playerDeck[0], selectedStat)} vs {getStatValue(computerDeck[0], selectedStat)}
              </Text>
            )}
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
        backgroundColor: '#0a0a0a' 
    },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 20, 
        paddingTop: 10, 
        zIndex: 10 
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
    // --- UPDATED LAYOUT STYLES ---
    gameTableContainer: {
        flex: 1, // This makes the game table take all available vertical space
        justifyContent: 'center',
    },
    bottomContainer: { 
        // This container now sits below the game table
        paddingBottom: 20, 
        justifyContent: 'center',
    },
    // ----------------------------
    resultContainer: { 
        position: 'absolute', 
        top: 0, right: 0, bottom: 0, left: 0, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#000000A0', 
        zIndex: 20 
    },
    resultText: { 
        fontSize: 32, 
        fontFamily: 'Poppins-Bold', 
        color: '#FFD700', 
        textAlign: 'center' 
    },
    resultStatText: {
        fontSize: 18,
        fontFamily: 'Poppins-Regular',
        color: '#FFFFFF',
        marginBottom: 20,
    },
});

export default GameplayScreen;