import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';
import { useUserStats } from '../hooks/useUserStats';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function GameOverScreen({ navigation, route }: Props) {
  const { result, reason, mode } = route.params;
  const { playButtonClick } = useSounds();
  const { updateStats } = useUserStats();
  const hasRecorded = useRef(false);

  // Record game result in background (no UI display)
  useEffect(() => {
    const recordGameResult = async () => {
      if (hasRecorded.current) {
        console.log('⚠️ Game result already recorded, skipping...');
        return;
      }
      
      hasRecorded.current = true;
      
      try {
        const gameMode = mode === 'ClassicGameplay' ? 'classic' : 'endless';
        
        console.log('🎮 Recording game result (background):', { gameMode, result });
        
        await updateStats({
          gameMode,
          result,
          duration: 0, // TODO: Add proper timing in future
          endReason: reason,
        });
        
        console.log('✅ Game statistics updated successfully');
      } catch (error) {
        console.error('❌ Error recording game result:', error);
        hasRecorded.current = false; // Allow retry on error
      }
    };

    recordGameResult();
  }, []);

  const handlePlayAgain = (): void => {
    playButtonClick();
    const targetScreen = mode === 'ClassicGameplay' ? 'ClassicGameplay' : 'Gameplay';
    navigation.navigate(targetScreen, { reset: true });
  };

  const handleMainMenu = (): void => {
    playButtonClick();
    navigation.navigate('MainMenu');
  };

  const handleViewStats = (): void => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  // Get result styling and messages
  const isWin = result === 'win';
  const resultConfig = {
    win: {
      color: '#4CAF50',
      title: '🏆 Victory!',
      message: 'Excellent performance!',
      emoji: '🎉',
    },
    loss: {
      color: '#F44336', 
      title: '💔 Game Over',
      message: 'Better luck next time!',
      emoji: '😔',
    }
  };

  const config = resultConfig[result];
  const reasonText = reason === 'time_up' ? 'Time ran out' : 'All cards collected';
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      <View style={styles.content}>
        {/* Game Result Display */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>{config.emoji}</Text>
          <Text style={[styles.resultTitle, { color: config.color }]}>
            {config.title}
          </Text>
          <Text style={styles.resultMessage}>{config.message}</Text>
          <Text style={styles.reasonText}>{reasonText}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.playAgainButton]} 
            onPress={handlePlayAgain}
          >
            <Text style={styles.buttonText}>🎮 Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.statsButton]} 
            onPress={handleViewStats}
          >
            <Text style={styles.buttonText}>📊 View Statistics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.mainMenuButton]} 
            onPress={handleMainMenu}
          >
            <Text style={styles.buttonText}>🏠 Main Menu</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isWin 
              ? "🔥 Keep the momentum going!" 
              : "💪 Every game makes you stronger!"
            }
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultContainer: {
    alignItems: 'center',
    marginBottom: 60,
    backgroundColor: '#FFFFFF05',
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  resultTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 36,
    textAlign: 'center',
    marginBottom: 12,
  },
  resultMessage: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  reasonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#CCCCCC',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginVertical: 6,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
  },
  statsButton: {
    backgroundColor: '#FFD700',
  },
  mainMenuButton: {
    backgroundColor: '#FFFFFF20',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default GameOverScreen;
