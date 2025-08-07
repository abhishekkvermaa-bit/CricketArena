import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

// This screen will receive a 'result' parameter ('win' or 'loss')
type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

function GameOverScreen({ route, navigation }: Props) {
  const { result } = route.params; // Get the result from the navigation parameters

  const handlePlayAgain = () => {
    // Navigate back to the Gameplay screen and trigger a reset
    navigation.navigate('Gameplay', { reset: true });
  };

  const handleMainMenu = () => {
    // Navigate back to the Main Menu
    navigation.navigate('MainMenu');
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
          <Text style={styles.secondaryButtonText}>Main Menu</Text>
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
    marginBottom: 50,
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
      borderColor: '#555',
  },
  secondaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#999',
    fontSize: 18,
  }
});

export default GameOverScreen;