import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Import our screens
import MainMenuScreen from '../screens/MainMenuScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import GameplayScreen from '../screens/GameplayScreen';

export type RootStackParamList = {
  MainMenu: undefined;
  LevelSelection: undefined;
  Gameplay: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainMenu" component={MainMenuScreen} />
      <Stack.Screen name="LevelSelection" component={LevelSelectionScreen} />
      <Stack.Screen name="Gameplay" component={GameplayScreen} />
    </Stack.Navigator>
  );
}

export default AppNavigator;