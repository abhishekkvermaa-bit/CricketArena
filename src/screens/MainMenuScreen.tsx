import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from 'react-native';

// We need to import 'runOnJS'
import Animated, { runOnJS, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'; // <-- CHANGED
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

  // This is a normal JavaScript function
  const navigateToLevelSelection = () => {
    navigation.navigate('LevelSelection');
  };

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet'; // <-- NEW: Mark this as a worklet
      isPressed.value = true;
    })
    .onFinalize(() => {
      'worklet'; // <-- NEW: Mark this as a worklet
      isPressed.value = false;
    })
    .onEnd(() => {
      'worklet'; // <-- NEW: Mark this as a worklet
      // Use runOnJS to call our navigation function safely
      runOnJS(navigateToLevelSelection)(); // <-- CHANGED
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

// Styles are the same
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