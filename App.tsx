import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // <-- NEW
import AppNavigator from './src/navigation/AppNavigator'; // <-- NEW
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;