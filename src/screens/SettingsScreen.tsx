import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../hooks/useAuth';
import { useSounds } from '../hooks/useSounds';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

function SettingsScreen({ navigation }: Props) {
  const { user, signOut, signInWithGoogle, isLoading } = useAuth();
  const { playButtonClick } = useSounds();
  
  // Settings state - you can expand this later
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleGoBack = () => {
    playButtonClick();
    navigation.goBack();
  };

  const handleSignOut = async () => {
    try {
      playButtonClick();
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
              } catch (error) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      playButtonClick();
      await signInWithGoogle();
      Alert.alert('Success!', 'Successfully signed in with Google!');
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    }
  };

  const handleUpgradeFromGuest = () => {
    Alert.alert(
      'Upgrade Account',
      'Sign in with Google to save your progress and access more features!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: handleGoogleSignIn }
      ]
    );
  };

  const renderAccountSection = () => {
    if (user?.isAnonymous) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountStatus}>👤 Guest Account</Text>
              <Text style={styles.accountSubtext}>Sign in to save your progress</Text>
            </View>
            <TouchableOpacity 
              style={styles.upgradeButton} 
              onPress={handleUpgradeFromGuest}
              disabled={isLoading}
            >
              <Text style={styles.upgradeButtonText}>
                {isLoading ? 'Signing In...' : '🔐 Sign In with Google'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.accountCard}>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>
                {user?.displayName || 'Google User'}
              </Text>
              <Text style={styles.accountEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Account Section */}
        {renderAccountSection()}

        {/* Audio Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audio</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>🔊 Sound Effects</Text>
              <Text style={styles.settingSubtext}>Game sounds and button clicks</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={soundEnabled ? '#FFF' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>🎵 Background Music</Text>
              <Text style={styles.settingSubtext}>Ambient cricket sounds</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={musicEnabled ? '#FFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View>
              <Text style={styles.settingLabel}>🔔 Push Notifications</Text>
              <Text style={styles.settingSubtext}>Game updates and achievements</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={notificationsEnabled ? '#FFF' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Game Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>📖 How to Play</Text>
            <Text style={styles.infoArrow}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>⭐ Rate Cricket Arena</Text>
            <Text style={styles.infoArrow}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoItem}>
            <Text style={styles.infoLabel}>📋 Privacy Policy</Text>
            <Text style={styles.infoArrow}>-</Text>
          </TouchableOpacity>

          <View style={styles.versionItem}>
            <Text style={styles.versionText}>Cricket Arena v1.0</Text>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF20',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
  },
  accountCard: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  accountInfo: {
    marginBottom: 15,
  },
  accountStatus: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  accountEmail: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  accountSubtext: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  upgradeButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  settingSubtext: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  infoArrow: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  versionItem: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  versionText: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default SettingsScreen;
