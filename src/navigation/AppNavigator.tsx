import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainMenuScreen from '../screens/MainMenuScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import GameplayScreen from '../screens/GameplayScreen';
import GameOverScreen from '../screens/GameOverScreen'; // <-- Import the new screen

// This is our app's "map" of all possible screens and their parameters
export type RootStackParamList = {
  MainMenu: undefined;
  LevelSelection: undefined;
  // The Gameplay screen can optionally receive a 'reset' parameter
  Gameplay: { reset?: boolean } | undefined; 
  // The GameOver screen MUST receive a 'result' parameter
  GameOver: { result: 'win' | 'loss' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
      <Stack.Screen name="Gameplay" component={GameplayScreen} />
      {/* Add the new screen to the navigator stack */}
      <Stack.Screen name="GameOver" component={GameOverScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;