import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useUserStats } from '../hooks/useUserStats';
import { useAuth } from '../hooks/useAuth';
import { useSounds } from '../hooks/useSounds';

type Props = NativeStackScreenProps<RootStackParamList, 'Statistics'>;

function StatisticsScreen({ navigation }: Props) {
  const { stats, isLoading, isOnline } = useUserStats();
  const { user } = useAuth();
  const { playButtonClick } = useSounds();

  const handleGoBack = () => {
    playButtonClick();
    navigation.goBack();
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading your cricket statistics...</Text>
    </View>
  );

  const renderStatisticsContent = () => {
    if (!stats) return renderLoadingState();

    return (
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerStatsContainer}>
          <Text style={styles.sectionTitle}>🏏 Your Cricket Performance</Text>
          
          <View style={styles.syncStatus}>
            <View style={[styles.syncDot, { backgroundColor: isOnline ? '#4CAF50' : '#FF9800' }]} />
            <Text style={styles.syncText}>
              {user?.isAnonymous ? 'Local Stats' : (isOnline ? 'Cloud Synced' : 'Offline Mode')}
            </Text>
          </View>
        </View>

        <View style={styles.mainStatsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalGamesPlayed}</Text>
            <Text style={styles.statLabel}>Total Games</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.totalGamesWon}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#F44336' }]}>{stats.totalGamesLost}</Text>
            <Text style={styles.statLabel}>Losses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#FFD700' }]}>{stats.winPercentage}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
          </View>
        </View>

        <View style={styles.streakSection}>
          <Text style={styles.sectionTitle}>🔥 Streak Performance</Text>
          <View style={styles.streakContainer}>
            <View style={styles.streakCard}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakTitle}>Current Streak</Text>
              <Text style={[styles.streakNumber, { color: '#FF6B35' }]}>
                {stats.currentWinStreak} wins
              </Text>
            </View>
            <View style={styles.streakCard}>
              <Text style={styles.streakEmoji}>⭐</Text>
              <Text style={styles.streakTitle}>Personal Best</Text>
              <Text style={[styles.streakNumber, { color: '#FFD700' }]}>
                {stats.bestWinStreak} wins
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>🎮 Game Mode Breakdown</Text>
          
          <View style={styles.modeCard}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>⚡ Classic Mode</Text>
              <Text style={styles.modeWinRate}>{stats.classicMode.winRate}%</Text>
            </View>
            <View style={styles.modeStatsRow}>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatNumber}>{stats.classicMode.gamesPlayed}</Text>
                <Text style={styles.modeStatLabel}>Played</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={[styles.modeStatNumber, { color: '#4CAF50' }]}>{stats.classicMode.gamesWon}</Text>
                <Text style={styles.modeStatLabel}>Won</Text>
              </View>
              {stats.classicMode.bestTime > 0 && (
                <View style={styles.modeStatItem}>
                  <Text style={[styles.modeStatNumber, { color: '#FFD700' }]}>{stats.classicMode.bestTime}s</Text>
                  <Text style={styles.modeStatLabel}>Best Time</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.modeCard}>
            <View style={styles.modeHeader}>
              <Text style={styles.modeTitle}>♾️ Endless Mode</Text>
              <Text style={styles.modeWinRate}>{stats.endlessMode.winRate}%</Text>
            </View>
            <View style={styles.modeStatsRow}>
              <View style={styles.modeStatItem}>
                <Text style={styles.modeStatNumber}>{stats.endlessMode.gamesPlayed}</Text>
                <Text style={styles.modeStatLabel}>Played</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={[styles.modeStatNumber, { color: '#4CAF50' }]}>{stats.endlessMode.gamesWon}</Text>
                <Text style={styles.modeStatLabel}>Won</Text>
              </View>
              <View style={styles.modeStatItem}>
                <Text style={[styles.modeStatNumber, { color: '#FF6B35' }]}>{stats.endlessMode.bestStreak}</Text>
                <Text style={styles.modeStatLabel}>Best Streak</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>🏆 Cricket Achievements</Text>
          {renderAchievements()}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  const renderAchievements = () => {
    if (!stats) return null;

    const achievements = [
      { key: 'firstBoundary', emoji: '🏏', title: 'First Boundary', desc: 'Win your first match', unlocked: stats.achievements.firstBoundary },
      { key: 'hatTrickHero', emoji: '🎯', title: 'Hat-trick Hero', desc: '3 wins in a row', unlocked: stats.achievements.hatTrickHero },
      { key: 'fireBrand', emoji: '🔥', title: 'Fire Brand', desc: '10-win streak', unlocked: stats.achievements.fireBrand },
      { key: 'centuryMaker', emoji: '💯', title: 'Century Maker', desc: '100 total wins', unlocked: stats.achievements.centuryMaker },
      { key: 'lightningStrike', emoji: '⚡', title: 'Lightning Strike', desc: 'Win Classic in under 30s', unlocked: stats.achievements.lightningStrike },
      { key: 'captainCool', emoji: '👑', title: 'Captain Cool', desc: '75% win rate', unlocked: stats.achievements.captainCool },
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
      <View>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementProgress}>{unlockedCount}/{achievements.length} Unlocked</Text>
        </View>
        
        <View style={styles.achievementGrid}>
          {achievements.map((achievement) => (
            <View key={achievement.key} style={[
              styles.achievementCard, 
              achievement.unlocked && styles.achievementUnlocked
            ]}>
              <Text style={[
                styles.achievementEmoji, 
                !achievement.unlocked && styles.achievementLocked
              ]}>
                {achievement.emoji}
              </Text>
              <Text style={[
                styles.achievementTitle, 
                !achievement.unlocked && styles.achievementTextLocked
              ]}>
                {achievement.title}
              </Text>
              <Text style={[
                styles.achievementDesc, 
                !achievement.unlocked && styles.achievementTextLocked
              ]}>
                {achievement.desc}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cricket Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {isLoading ? renderLoadingState() : renderStatisticsContent()}
      </View>
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
    width: 60,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerStatsContainer: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  syncStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  syncText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  mainStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  statCard: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  streakSection: {
    marginBottom: 25,
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakCard: {
    backgroundColor: '#FFFFFF10',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF20',
  },
  streakEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  streakTitle: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  modeSection: {
    marginBottom: 25,
  },
  modeCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  modeWinRate: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  modeStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeStatItem: {
    alignItems: 'center',
  },
  modeStatNumber: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  modeStatLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  achievementsSection: {
    marginBottom: 20,
  },
  achievementHeader: {
    marginBottom: 15,
  },
  achievementProgress: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 10,
    padding: 12,
    width: '48%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    alignItems: 'center',
  },
  achievementUnlocked: {
    backgroundColor: '#FFD70015',
    borderColor: '#FFD70040',
  },
  achievementEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  achievementLocked: {
    opacity: 0.3,
  },
  achievementTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 2,
  },
  achievementDesc: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  achievementTextLocked: {
    opacity: 0.4,
  },
  bottomSpacing: {
    height: 30,
  },
});

export default StatisticsScreen;
