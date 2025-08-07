import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainMenuScreen from '../screens/MainMenuScreen';
import GameSelectionScreen from '../screens/GameSelectionScreen';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import GameplayScreen from '../screens/GameplayScreen';
import ClassicGameplayScreen from '../screens/ClassicGameplayScreen';
import GameOverScreen from '../screens/GameOverScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  GameSelection: undefined;
  ModeSelection: undefined;
  Gameplay: { reset?: boolean } | undefined;
  ClassicGameplay: { reset?: boolean } | undefined;
  GameOver: { 
    result: 'win' | 'loss';
    reason: 'time_up' | 'all_cards';
    mode: 'ClassicGameplay' | 'Gameplay';
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
      <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
      <Stack.Screen name="Gameplay" component={GameplayScreen} />
      <Stack.Screen name="ClassicGameplay" component={ClassicGameplayScreen} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;