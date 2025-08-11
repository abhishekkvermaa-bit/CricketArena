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

  useEffect(() => {
    const recordGameResult = async () => {
      if (hasRecorded.current) {
        console.log('⚠️ Game result already recorded, skipping...');
        return;
      }
      
      hasRecorded.current = true;
      
      try {
        const gameMode = mode === 'ClassicGameplay' ? 'classic' : 'endless';
        
        console.log('🎮 Recording game result (one-time):', { gameMode, result });
        
        await updateStats({
          gameMode,
          result,
          duration: 0,
          endReason: reason,
        });
        
        console.log('✅ Game result recorded successfully');
      } catch (error) {
        console.error('❌ Error recording game result:', error);
        hasRecorded.current = false;
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

  const isWin = result === 'win';
  const resultText = isWin ? 'You Win!' : 'You Lose!';
  const reasonText = reason === 'time_up' ? 'Time\'s up!' : 'All cards collected!';
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      <View style={styles.content}>
        <View style={styles.resultContainer}>
          <Text style={[styles.resultText, { color: isWin ? '#4CAF50' : '#F44336' }]}>
            {resultText}
          </Text>
          <Text style={styles.reasonText}>{reasonText}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.playAgainButton]} onPress={handlePlayAgain}>
            <Text style={styles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.mainMenuButton]} onPress={handleMainMenu}>
            <Text style={styles.buttonText}>Main Menu</Text>
          </TouchableOpacity>
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
    marginBottom: 50,
  },
  resultText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 10,
  },
  reasonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  playAgainButton: {
    backgroundColor: '#4CAF50',
  },
  mainMenuButton: {
    backgroundColor: '#FFFFFF20',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default GameOverScreen;
