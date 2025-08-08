import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Updated import
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function GameOverScreen({ route, navigation }: Props) {
  const { playGameWin, playGameLose, playButtonClick } = useSounds();
  const insets = useSafeAreaInsets(); // <-- NEW: Get safe area insets
  const { result, reason, mode } = route.params;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (result === 'win') {
        playGameWin();
      } else {
        playGameLose();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [result, playGameWin, playGameLose]);

  const handlePlayAgain = (): void => {
    playButtonClick();
    navigation.replace(mode, { reset: true });
  };

  const handleMainMenu = (): void => {
    playButtonClick();
    navigation.popToTop();
  };

  const getSubtitle = (): string => {
    if (reason === 'time_up') {
      return result === 'win' ? "Time's up! You had more cards." : "Time's up! The computer had more cards.";
    }
    return result === 'win' ? 'You have collected all the cards.' : 'The computer has collected all your cards.';
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> {/* <-- Updated */}
      <View style={styles.content}>
        <Text style={styles.title}>
          {result === 'win' ? 'YOU ARE THE CHAMPION!' : 'GAME OVER'}
        </Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>

        <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleMainMenu}>
          <Text style={styles.buttonText}>Main Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#FFD700', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 16, color: '#CCCCCC', textAlign: 'center', marginBottom: 60, maxWidth: '80%' },
  button: { backgroundColor: '#2A2A2A', borderRadius: 12, paddingVertical: 15, width: '80%', alignItems: 'center', marginBottom: 15, borderWidth: 2, borderColor: '#FFD700' },
  buttonText: { fontFamily: 'Poppins-SemiBold', color: '#FFD700', fontSize: 18 },
  secondaryButton: { backgroundColor: 'transparent', borderColor: '#444' },
});

export default GameOverScreen;
