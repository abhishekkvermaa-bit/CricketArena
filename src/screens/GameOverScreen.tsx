import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// This tells TypeScript what kind of navigation props this screen will receive.
// It expects a 'result' parameter, which will be either 'win' or 'loss'.
type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function GameOverScreen({ route, navigation }: Props) {
  // Get the result ('win' or 'loss') that was passed from the GameplayScreen
  const { result } = route.params;

  const handlePlayAgain = () => {
    // Navigate back to the Gameplay screen. We'll add logic there to reset the game.
    navigation.replace('Gameplay');
  };

  const handleMainMenu = () => {
    // Navigate back to the Main Menu screen.
    navigation.popToTop();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {result === 'win' ? 'YOU ARE THE CHAMPION!' : 'GAME OVER'}
        </Text>
        <Text style={styles.subtitle}>
          {result === 'win' ? 'You have collected all the cards.' : 'The computer has collected all your cards.'}
        </Text>

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
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFD700', // Gold color for the title
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 60,
    maxWidth: '80%',
  },
  button: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    paddingVertical: 15,
    width: '80%',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFD700',
    fontSize: 18,
  },
  secondaryButton: {
      backgroundColor: 'transparent',
      borderColor: '#444',
  },
});

export default GameOverScreen;