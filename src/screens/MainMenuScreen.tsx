import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';
// --- FIX: Added runOnJS to the import list ---
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

function MainMenuScreen({ navigation }: Props) {
  const isPressed = useSharedValue(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isPressed.value ? 0.95 : 1) }],
    };
  });
  const navigateToLevelSelection = () => {
    navigation.navigate('LevelSelection');
  };
  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(navigateToLevelSelection)();
    });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cricket Arena</Text>
      </View>
      <View style={styles.buttonContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.button, animatedStyle]}>
            <Text style={styles.buttonText}>Play</Text>
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>High Scores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FFFFFF20',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MainMenuScreen;