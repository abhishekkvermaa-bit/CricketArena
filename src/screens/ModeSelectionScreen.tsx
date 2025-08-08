import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Updated import
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelection'>;

function ModeSelectionScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets(); // <-- NEW: Get safe area insets

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}> {/* <-- Updated */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Select a Mode</Text>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('ClassicGameplay')}
        >
          <Text style={styles.buttonText}>Classic</Text>
          <Text style={styles.buttonSubtitle}>2-minute timer. Most cards win!</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Gameplay')}
        >
          <Text style={styles.buttonText}>Endless</Text>
          <Text style={styles.buttonSubtitle}>Play until one player has all the cards.</Text>
        </TouchableOpacity>
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
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 24,
  },
  buttonSubtitle: {
    fontFamily: 'Poppins-Regular',
    color: '#999',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default ModeSelectionScreen;
