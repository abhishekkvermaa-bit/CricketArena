import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function GameOverScreen({ route, navigation }: Props) {
  const { result, reason, mode } = route.params;

  const handlePlayAgain = () => {
    // Navigate to the correct screen based on the mode played
    navigation.replace(mode, { reset: true });
  };

  const handleMainMenu = () => {
    navigation.popToTop();
  };

  // Choose the subtitle based on the reason the game ended
  const getSubtitle = () => {
    if (reason === 'time_up') {
      return result === 'win' ? "Time's up! You had more cards." : "Time's up! The computer had more cards.";
    }
    // Default 'all_cards' reason
    return result === 'win' ? 'You have collected all the cards.' : 'The computer has collected all your cards.';
  }

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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