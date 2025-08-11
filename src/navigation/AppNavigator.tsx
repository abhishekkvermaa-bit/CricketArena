import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import MainMenuScreen from '../screens/MainMenuScreen';
import GameSelectionScreen from '../screens/GameSelectionScreen';
import ModeSelectionScreen from '../screens/ModeSelectionScreen';
import GameplayScreen from '../screens/GameplayScreen';
import ClassicGameplayScreen from '../screens/ClassicGameplayScreen';
import GameOverScreen from '../screens/GameOverScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatisticsScreen from '../screens/StatisticsScreen';

import { useAuth } from '../hooks/useAuth';

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
  Login: undefined;
  Settings: undefined;
  Statistics: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <React.Fragment>
          <Stack.Screen name="MainMenu" component={MainMenuScreen} />
          <Stack.Screen name="GameSelection" component={GameSelectionScreen} />
          <Stack.Screen name="ModeSelection" component={ModeSelectionScreen} />
          <Stack.Screen name="Gameplay" component={GameplayScreen} />
          <Stack.Screen name="ClassicGameplay" component={ClassicGameplayScreen} />
          <Stack.Screen name="GameOver" component={GameOverScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Statistics" component={StatisticsScreen} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Stack.Screen name="Login">
            {() => <LoginScreen onLoginSuccess={() => {}} />}
          </Stack.Screen>
        </React.Fragment>
      )}
    </Stack.Navigator>
  );
}

export default AppNavigator;
