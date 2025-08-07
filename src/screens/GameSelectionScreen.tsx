import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSelection'>;

// We'll define our list of games here
const games = [
  { name: 'Trump Cards', isLocked: false, screen: 'ModeSelection' },
  { name: 'Book Cricket', isLocked: true },
  { name: '500k Runs Challenge', isLocked: true },
  { name: 'Guess the Player', isLocked: true },
];

function GameSelectionScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Select a Game</Text>
        
        {games.map((game) => (
          <TouchableOpacity 
            key={game.name}
            style={[styles.button, game.isLocked && styles.lockedButton]} 
            // Only navigate if the game is not locked
            onPress={() => !game.isLocked && navigation.navigate(game.screen as any)}
            disabled={game.isLocked}
          >
            <Text style={styles.buttonText}>{game.name}</Text>
            {game.isLocked && (
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>COMING SOON</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    width: '85%',
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  lockedButton: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 24,
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFD700',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: {
    fontFamily: 'Poppins-Bold',
    color: '#000000',
    fontSize: 10,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default GameSelectionScreen;