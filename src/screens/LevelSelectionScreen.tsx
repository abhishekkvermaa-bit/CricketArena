import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelection'>;

function LevelSelectionScreen({navigation}: Props) {
  const [levels, setLevels] = useState([
    {id: 1, name: 'Easy', isLocked: false},
    {id: 2, name: 'Medium', isLocked: true},
    {id: 3, name: 'Hard', isLocked: true},
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Select a Level</Text>

      <View style={styles.levelContainer}>
        {levels.map(level => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelButton,
              level.isLocked && styles.lockedButton,
            ]}
            disabled={level.isLocked}
            // --- THIS IS THE CHANGE ---
            onPress={() => {
              if (!level.isLocked) {
                navigation.navigate('Gameplay');
              }
            }}
            // --------------------------
            >
            <Text style={styles.levelButtonText}>{level.name}</Text>
            {level.isLocked && <Text style={styles.lockIcon}>🔒</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  levelContainer: {
    alignItems: 'center',
  },
  levelButton: {
    backgroundColor: '#FFFFFF20',
    paddingVertical: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  levelButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
  },
  lockedButton: {
    opacity: 0.5,
  },
  lockIcon: {
    fontSize: 20,
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default LevelSelectionScreen;