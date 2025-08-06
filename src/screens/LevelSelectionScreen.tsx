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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
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
              onPress={() => {
                if (!level.isLocked) {
                  navigation.navigate('Gameplay');
                }
              }}
              >
              <Text style={styles.levelButtonText}>{level.name}</Text>
              {level.isLocked && <Text style={styles.lockIcon}>🔒</Text>}
            </TouchableOpacity>
          ))}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
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
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
});

export default LevelSelectionScreen;