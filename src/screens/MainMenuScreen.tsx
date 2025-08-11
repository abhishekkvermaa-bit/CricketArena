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

  React.useEffect(() => {
    if (stats) {
      console.log('📊 User Statistics Loaded:', {
        totalGames: stats.totalGamesPlayed,
        wins: stats.totalGamesWon,
        losses: stats.totalGamesLost,
        winRate: `${stats.winPercentage}%`,
        currentStreak: stats.currentWinStreak,
        bestStreak: stats.bestWinStreak,
      });
    }
    if (isLoading) {
      console.log('⏳ Loading user statistics...');
    }
  }, [stats, isLoading]);

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      <View style={styles.userInfo}>
        <Text style={styles.userText}>
          {user?.isAnonymous ? '👤 Guest User' : `👋 ${user?.displayName || user?.email}`}
        </Text>
        <TouchableOpacity onPress={handleStatistics} style={styles.statsIconButton}>
          <Text style={styles.statsIcon}>📊</Text>
          {stats && stats.totalGamesPlayed > 0 && (
            <View style={styles.statsBadge}>
              <Text style={styles.statsBadgeText}>{stats.totalGamesPlayed}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Cricket Arena</Text>
      </View>
      <View style={styles.buttonContainer}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.button, animatedStyle]}>
            <Text style={styles.buttonText}>Play</Text>
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity style={styles.button} onPress={handleHighScores}>
          <Text style={styles.buttonText}>High Scores</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
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
    paddingVertical: 10,
  },
  userText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  statsIconButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#FFD70020',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  statsIcon: {
    fontSize: 20,
  },
  statsBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
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
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    paddingBottom: 50,
  },
  button: {
    backgroundColor: '#FFFFFF20',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginVertical: 10,
    width: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default MainMenuScreen;
