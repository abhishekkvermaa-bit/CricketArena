import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch, Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../hooks/useAuth';
import { useSounds } from '../hooks/useSounds';
import { useUserStats } from '../hooks/useUserStats';

import { Modal } from 'react-native'; // Add this import


type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

function SettingsScreen({ navigation }: Props) {
  const { user, signOut, signInWithGoogle, isLoading } = useAuth();
  const { stats, isLoading: statsLoading, isOnline } = useUserStats();
  const { playButtonClick } = useSounds();
  
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
        'Are you sure you want to sign out? Your progress will be saved to the cloud.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                console.log('✅ Successfully signed out');
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
      Alert.alert('Welcome!', 'Successfully signed in with Google! Your progress is now saved to the cloud.');
    } catch (error) {
      Alert.alert('Sign In Failed', 'Unable to sign in with Google. Please try again.');
    }
  };

  const handleViewStatistics = () => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  const handleUpgradeFromGuest = () => {
    Alert.alert(
      'Upgrade Your Account',
      `You have played ${stats?.totalGamesPlayed || 0} games as a guest!\n\nSign in to:\n• Save your progress permanently\n• Sync across all devices\n• Unlock achievements\n• Compare with other players`,
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Sign In Now', style: 'default', onPress: handleGoogleSignIn }
      ]
    );
  };

  const renderAccountSection = () => {
    if (user?.isAnonymous) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Account Status</Text>
          
          <View style={styles.guestAccountCard}>
            <View style={styles.guestHeader}>
              <Text style={styles.guestTitle}>Guest Account</Text>
              <View style={styles.sessionBadge}>
                <Text style={styles.sessionBadgeText}>SESSION ONLY</Text>
              </View>
            </View>
            
            <View style={styles.guestStats}>
              <Text style={styles.guestStatsText}>
                📊 Games Played: {stats?.totalGamesPlayed || 0}
              </Text>
              <Text style={styles.guestStatsText}>
                🏆 Games Won: {stats?.totalGamesWon || 0}
              </Text>
              <Text style={styles.guestWarning}>
                ⚠️ Stats will be lost when you close the app
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.upgradeButton} 
              onPress={handleUpgradeFromGuest}
              disabled={isLoading}
            >
              <Text style={styles.upgradeButtonText}>
                {isLoading ? 'Signing In...' : '🚀 Upgrade to Permanent Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsTitle}>Benefits of signing in:</Text>
              <Text style={styles.benefitItem}>☁️ Cloud-saved progress</Text>
              <Text style={styles.benefitItem}>📱 Cross-device synchronization</Text>
              <Text style={styles.benefitItem}>🏆 Permanent achievements</Text>
              <Text style={styles.benefitItem}>📊 Advanced analytics</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>☁️ Cloud Account</Text>
          
          <View style={styles.authenticatedAccountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>
                  {user?.displayName || 'Authenticated User'}
                </Text>
                <Text style={styles.accountEmail}>{user?.email || 'Google Account'}</Text>
                <View style={styles.syncStatusContainer}>
                  <View style={[styles.syncDot, { backgroundColor: isOnline ? '#4CAF50' : '#FF9800' }]} />
                  <Text style={styles.syncStatusText}>
                    {isOnline ? 'Synced to Cloud' : 'Offline Mode'}
                  </Text>
                </View>
              </View>
            </View>

            {stats && (
              <View style={styles.accountStats}>
                <Text style={styles.accountStatsTitle}>Your Progress:</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalGamesPlayed}</Text>
                    <Text style={styles.statLabel}>Games</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.totalGamesWon}</Text>
                    <Text style={styles.statLabel}>Wins</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.winPercentage}%</Text>
                    <Text style={styles.statLabel}>Win Rate</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{stats.bestWinStreak}</Text>
                    <Text style={styles.statLabel}>Best Streak</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.accountActions}>
              <TouchableOpacity style={styles.statisticsButton} onPress={handleViewStatistics}>
                <Text style={styles.statisticsButtonText}>📊 View Full Statistics</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                <Text style={styles.signOutButtonText}>🚪 Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }
  };

  const renderQuickStatsSection = () => {
    if (!stats || stats.totalGamesPlayed === 0) {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
          <View style={styles.noStatsCard}>
            <Text style={styles.noStatsEmoji}>🏏</Text>
            <Text style={styles.noStatsTitle}>No Games Yet</Text>
            <Text style={styles.noStatsText}>
              Start playing to see your cricket statistics here!
            </Text>
            <TouchableOpacity 
              style={styles.startPlayingButton}
              onPress={() => {
                playButtonClick();
                navigation.navigate('GameSelection');
              }}
            >
              <Text style={styles.startPlayingButtonText}>🎮 Start Playing</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📊 Quick Stats</Text>
          <TouchableOpacity style={styles.viewMoreButton} onPress={handleViewStatistics}>
            <Text style={styles.viewMoreText}>View More →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>🎮</Text>
            <Text style={styles.quickStatNumber}>{stats.totalGamesPlayed}</Text>
            <Text style={styles.quickStatLabel}>Total Games</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>🏆</Text>
            <Text style={styles.quickStatNumber}>{stats.totalGamesWon}</Text>
            <Text style={styles.quickStatLabel}>Victories</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>📈</Text>
            <Text style={styles.quickStatNumber}>{stats.winPercentage}%</Text>
            <Text style={styles.quickStatLabel}>Win Rate</Text>
          </View>
          
          <View style={styles.quickStatCard}>
            <Text style={styles.quickStatIcon}>🔥</Text>
            <Text style={styles.quickStatNumber}>{stats.currentWinStreak}</Text>
            <Text style={styles.quickStatLabel}>Current Streak</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Account Section */}
        {renderAccountSection()}

        {/* Quick Statistics Section */}
        {renderQuickStatsSection()}

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ App Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🔊 Sound Effects</Text>
              <Text style={styles.settingSubtext}>Game sounds and button clicks</Text>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={(value) => {
                setSoundEnabled(value);
                playButtonClick();
              }}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={soundEnabled ? '#FFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🎵 Background Music</Text>
              <Text style={styles.settingSubtext}>Ambient cricket atmosphere</Text>
            </View>
            <Switch
              value={musicEnabled}
              onValueChange={(value) => {
                setMusicEnabled(value);
                playButtonClick();
              }}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={musicEnabled ? '#FFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>🔔 Notifications</Text>
              <Text style={styles.settingSubtext}>Game updates and achievements</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={(value) => {
                setNotificationsEnabled(value);
                playButtonClick();
              }}
              trackColor={{ false: '#3e3e3e', true: '#FFD700' }}
              thumbColor={notificationsEnabled ? '#FFF' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          </View>
        </View>

        {/* Coming Soon Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Coming Soon</Text>
          
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonTitle}>Exciting Features Ahead!</Text>
            <View style={styles.featureList}>
              <Text style={styles.featureItem}>🌐 Multiplayer Battles</Text>
              <Text style={styles.featureItem}>🏆 Global Leaderboards</Text>
              <Text style={styles.featureItem}>🎯 Daily Challenges</Text>
              <Text style={styles.featureItem}>👥 Friend System</Text>
              <Text style={styles.featureItem}>🎨 Customizable Themes</Text>
              <Text style={styles.featureItem}>🔗 Social Media Integration</Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ About</Text>
          
          <View style={styles.infoCard}>
            <Text style={styles.appName}>Cricket Arena</Text>
            <Text style={styles.appVersion}>Version 1.0.0</Text>
            <Text style={styles.appDescription}>
              Master the cards, conquer the pitch! A modern cricket card game experience.
            </Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Developer:</Text>
              <Text style={styles.infoValue}>Cricket Arena Studios</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated:</Text>
              <Text style={styles.infoValue}>August 2025</Text>
            </View>
          </View>
        </View>

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
    borderBottomColor: '#FFFFFF15',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
  },
  viewMoreButton: {
    padding: 8,
  },
  viewMoreText: {
    color: '#4CAF50',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },

  // Guest Account Styles
  guestAccountCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FF980040',
    marginBottom: 15,
  },
  guestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  guestTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  sessionBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sessionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  guestStats: {
    marginBottom: 20,
  },
  guestStatsText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  guestWarning: {
    color: '#FF9800',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginTop: 8,
    fontStyle: 'italic',
  },
  upgradeButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#4285F4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  benefitsContainer: {
    backgroundColor: '#FFFFFF05',
    borderRadius: 10,
    padding: 15,
  },
  benefitsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  benefitItem: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },

  // Authenticated Account Styles
  authenticatedAccountCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4CAF5040',
    marginBottom: 15,
  },
  accountHeader: {
    marginBottom: 15,
  },
  accountInfo: {
    marginBottom: 10,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  accountEmail: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  syncStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  syncStatusText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  accountStats: {
    backgroundColor: '#FFFFFF05',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  accountStatsTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statisticsButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  statisticsButtonText: {
    color: '#0C0C2D',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },

  // Quick Stats Styles
  noStatsCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  noStatsEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  noStatsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  noStatsText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  startPlayingButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  startPlayingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickStatCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  quickStatIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  quickStatNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Settings Styles
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  settingInfo: {
    flex: 1,
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

  // Coming Soon Styles
  comingSoonCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    borderStyle: 'dashed',
    marginBottom: 15,
  },
  comingSoonTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  featureList: {
    alignItems: 'center',
  },
  featureItem: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
    textAlign: 'center',
  },

  // App Info Styles
  infoCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    marginBottom: 15,
  },
  appName: {
    color: '#FFD700',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  appVersion: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 15,
  },
  appDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default SettingsScreen;
