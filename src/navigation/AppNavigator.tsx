import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainMenuScreen from '../screens/MainMenuScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import GameplayScreen from '../screens/GameplayScreen';
import GameOverScreen from '../screens/GameOverScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  LevelSelection: undefined;
  Gameplay: { reset?: boolean } | undefined;
  GameOver: { result: 'win' | 'loss' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    // The invalid comment has been removed from inside this component
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
      <Stack.Screen name="Gameplay" component={GameplayScreen} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;