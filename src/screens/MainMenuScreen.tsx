import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';
import { useAuth } from '../hooks/useAuth';
import { useUserStats } from '../hooks/useUserStats';

type Props = NativeStackScreenProps<RootStackParamList, 'MainMenu'>;

function MainMenuScreen({ navigation }: Props) {
  const { playButtonClick } = useSounds();
  const { signOut, user } = useAuth();
  const { stats, isLoading } = useUserStats();
  const isPressed = useSharedValue(false);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(isPressed.value ? 0.95 : 1) }],
    };
  });
  
  const navigateToGameSelection = (): void => {
    playButtonClick();
    navigation.navigate('GameSelection');
  };

  const handleHighScores = (): void => {
    playButtonClick();
    console.log('High Scores - Coming Soon!');
  };

  const handleSettings = (): void => {
    playButtonClick();
    navigation.navigate('Settings');
  };

  const handleStatistics = (): void => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      playButtonClick();
      console.log('🔄 Signing out...');
      await signOut();
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  // Debug logging for statistics
  React.useEffect(() => {
    if (stats) {
      console.log('📊 User Statistics Loaded:', {
        totalGames: stats.totalGamesPlayed,
        wins: stats.totalGamesWon,
        losses: stats.totalGamesLost,
        winRate: `${stats.winPercentage}%`,
        currentStreak: stats.currentWinStreak,
        bestStreak: stats.bestWinStreak,
        userType: user?.isAnonymous ? 'Guest (Session-Only)' : 'Authenticated (Permanent)',
      });
    }
    if (isLoading) {
      console.log('⏳ Loading user statistics...');
    }
  }, [stats, isLoading, user?.isAnonymous]);

  const gesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      isPressed.value = true;
    })
    .onFinalize(() => {
      'worklet';
      isPressed.value = false;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(navigateToGameSelection)();
    });

  // Render user info with proper session/permanent indication
  const renderUserInfo = () => {
    if (user?.isAnonymous) {
      return (
        <View style={styles.userInfo}>
          <View style={styles.userDetailsContainer}>
            <Text style={styles.userText}>👤 Guest User</Text>
            <Text style={styles.sessionText}>(Session-only stats)</Text>
          </View>
          <TouchableOpacity onPress={handleStatistics} style={styles.statsIconButton}>
            <Text style={styles.statsIcon}>📊</Text>
            {stats && stats.totalGamesPlayed > 0 && (
              <View style={[styles.statsBadge, styles.guestBadge]}>
                <Text style={styles.statsBadgeText}>{stats.totalGamesPlayed}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={styles.userInfo}>
          <View style={styles.userDetailsContainer}>
            <Text style={styles.userText}>
              👋 {user?.displayName || user?.email || 'Authenticated User'}
            </Text>
            <Text style={styles.permanentText}>☁️ Cloud-synced stats</Text>
          </View>
          <TouchableOpacity onPress={handleStatistics} style={styles.statsIconButton}>
            <Text style={styles.statsIcon}>📊</Text>
            {stats && stats.totalGamesPlayed > 0 && (
              <View style={[styles.statsBadge, styles.permanentBadge]}>
                <Text style={styles.statsBadgeText}>{stats.totalGamesPlayed}</Text>
              </View>
            )}
            {stats && stats.currentWinStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥{stats.currentWinStreak}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Render quick stats preview for authenticated users
  const renderQuickStats = () => {
    if (user?.isAnonymous || !stats || stats.totalGamesPlayed === 0) {
      return null;
    }

    return (
      <View style={styles.quickStatsContainer}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.totalGamesWon}</Text>
          <Text style={styles.quickStatLabel}>Wins</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.winPercentage}%</Text>
          <Text style={styles.quickStatLabel}>Win Rate</Text>
        </View>
        <View style={styles.quickStatDivider} />
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatNumber}>{stats.bestWinStreak}</Text>
          <Text style={styles.quickStatLabel}>Best Streak</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* User info with statistics icon */}
      {renderUserInfo()}

      {/* Quick stats preview for authenticated users */}
      {renderQuickStats()}

      {/* Main title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cricket Arena</Text>
        <Text style={styles.subtitle}>Master the cards, conquer the pitch!</Text>
      </View>

      {/* Main navigation buttons */}
      <View style={styles.buttonContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.button, styles.playButton, animatedStyle]}>
            <Text style={styles.buttonText}>⚡ Play Game</Text>
          </Animated.View>
        </GestureDetector>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleHighScores}>
          <Text style={styles.buttonText}>🏆 High Scores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleSettings}>
          <Text style={styles.buttonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        {/* Sign out button for authenticated users */}
        {!user?.isAnonymous && (
          <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>🚪 Sign Out</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Quick access tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsText}>
          💡 Tip: {user?.isAnonymous 
            ? 'Sign in to save your progress permanently!' 
            : 'Your stats are automatically saved to the cloud!'
          }
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0C2D',
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF10',
  },
  userDetailsContainer: {
    flex: 1,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 2,
  },
  sessionText: {
    color: '#FF9800',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },
  permanentText: {
    color: '#4CAF50',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  statsIconButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#FFD70020',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD70040',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  statsIcon: {
    fontSize: 24,
  },
  statsBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBadge: {
    backgroundColor: '#FF9800',
  },
  permanentBadge: {
    backgroundColor: '#4CAF50',
  },
  statsBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  streakBadge: {
    position: 'absolute',
    top: -4,
    left: -8,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  quickStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF05',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatNumber: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  quickStatLabel: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  quickStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#FFFFFF20',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  title: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginVertical: 8,
    width: '75%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF20',
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 10,
    width: '60%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF05',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  tipsText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MainMenuScreen;
