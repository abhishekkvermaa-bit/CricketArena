import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSounds } from '../hooks/useSounds';

type SettingsScreenProps = {
  navigation: any; // You can type this properly based on your navigation setup
};

function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { soundsEnabled, setSoundsEnabled, playButtonClick } = useSounds();

  const handleBack = (): void => {
    playButtonClick();
    navigation.goBack();
  };

  const toggleSounds = (value: boolean): void => {
    if (value) {
      playButtonClick();
    }
    setSoundsEnabled(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sound Effects</Text>
          <Switch
            value={soundsEnabled}
            onValueChange={toggleSounds}
            trackColor={{ false: '#444', true: '#FFD700' }}
            thumbColor={soundsEnabled ? '#FFF' : '#888'}
          />
        </View>
        
        <Text style={styles.subtitle}>More settings coming soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: { paddingHorizontal: 20, paddingTop: 10 },
  content: { flex: 1, padding: 20 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 32, color: '#FFFFFF', textAlign: 'center', marginBottom: 50 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
  settingLabel: { fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 18 },
  subtitle: { fontFamily: 'Poppins-Regular', color: '#888', fontSize: 16, textAlign: 'center', marginTop: 50 },
  backButtonText: { color: '#FFFFFF', fontSize: 18, fontFamily: 'Poppins-Regular' },
});

export default SettingsScreen;
