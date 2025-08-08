import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Updated import
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSelection'>;

interface Game {
  name: string;
  isLocked: boolean;
  screen?: 'ModeSelection';
}

const games: Game[] = [
  { name: 'Trump Cards', isLocked: false, screen: 'ModeSelection' },
  { name: 'Book Cricket', isLocked: true },
  { name: '500k Runs Challenge', isLocked: true },
  { name: 'Guess the Player', isLocked: true },
];

function GameSelectionScreen({ navigation }: Props) {
  const { playButtonClick } = useSounds();
  const insets = useSafeAreaInsets(); // <-- NEW: Get safe area insets

  const handleGameSelect = (game: Game): void => {
    playButtonClick();
    if (!game.isLocked && game.screen) {
      navigation.navigate(game.screen);
    }
  };

  const handleBack = (): void => {
    playButtonClick();
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> {/* <-- Updated */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Select a Game</Text>
        
        {games.map((game) => (
          <TouchableOpacity 
            key={game.name}
            style={[styles.button, game.isLocked && styles.lockedButton]} 
            onPress={() => handleGameSelect(game)}
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
    </View>
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
    paddingBottom: 10, // <-- Added bottom padding
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // <-- Added horizontal padding
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
