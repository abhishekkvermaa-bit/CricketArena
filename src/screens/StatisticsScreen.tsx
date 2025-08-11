import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, StatusBar, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useUserStats } from '../hooks/useUserStats';
import { useAuth } from '../hooks/useAuth';
import { useSounds } from '../hooks/useSounds';

type Props = NativeStackScreenProps<RootStackParamList, 'Statistics'>;

const { width } = Dimensions.get('window');

function StatisticsScreen({ navigation }: Props) {
  const { stats, isLoading, isOnline } = useUserStats();
  const { user } = useAuth();
  const { playButtonClick } = useSounds();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'achievements' | 'progress'>('overview');

  const handleGoBack = () => {
    playButtonClick();
    navigation.goBack();
  };

  const handlePlayNow = () => {
    playButtonClick();
    navigation.navigate('GameSelection');
  };

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingEmoji}>🏏</Text>
      <Text style={styles.loadingText}>Loading your cricket journey...</Text>
      <View style={styles.loadingBar}>
        <View style={styles.loadingProgress} />
      </View>
    </View>
  );

  const renderTabSelector = () => (
    <View style={styles.tabContainer}>
      {[
        { id: 'overview', icon: '📊', label: 'Overview' },
        { id: 'achievements', icon: '🏆', label: 'Achievements' },
        { id: 'progress', icon: '📈', label: 'Progress' }
      ].map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, selectedTab === tab.id && styles.activeTab]}
          onPress={() => {
            playButtonClick();
            setSelectedTab(tab.id as any);
          }}
        >
          <Text style={[styles.tabIcon, selectedTab === tab.id && styles.activeTabIcon]}>
            {tab.icon}
          </Text>
          <Text style={[styles.tabLabel, selectedTab === tab.id && styles.activeTabLabel]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderPlayerCard = () => {
    if (!stats) return null;

    const playerLevel = Math.floor(stats.totalGamesWon / 10) + 1;
    const nextLevelProgress = (stats.totalGamesWon % 10) / 10;
    const playerTitle = getPlayerTitle(stats.totalGamesWon, stats.winPercentage);

    return (
      <View style={styles.playerCard}>
        <View style={styles.playerHeader}>
          <View style={styles.playerAvatar}>
            <Text style={styles.avatarEmoji}>🏏</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{playerLevel}</Text>
            </View>
          </View>
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              {user?.displayName || user?.email || 'Cricket Champion'}
            </Text>
            <Text style={styles.playerTitle}>{playerTitle}</Text>
            <View style={styles.syncIndicator}>
              <View style={[styles.syncDot, { backgroundColor: isOnline ? '#4CAF50' : '#FF9800' }]} />
              <Text style={styles.syncText}>
                {user?.isAnonymous ? 'Session Only' : (isOnline ? 'Cloud Synced' : 'Offline')}
              </Text>
            </View>
          </View>
        </View>

        {/* Level Progress Bar */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>Level {playerLevel} Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${nextLevelProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {stats.totalGamesWon % 10}/10 wins to Level {playerLevel + 1}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOverviewTab = () => {
    if (!stats) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
        {/* Main Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.primaryStat]}>
            <Text style={styles.statIcon}>🎮</Text>
            <Text style={styles.statNumber}>{stats.totalGamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
            {stats.totalGamesPlayed > 0 && (
              <Text style={styles.statSubtext}>Keep playing!</Text>
            )}
          </View>

          <View style={[styles.statCard, styles.successStat]}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statNumber}>{stats.totalGamesWon}</Text>
            <Text style={styles.statLabel}>Victories</Text>
            {stats.totalGamesWon > 0 && (
              <Text style={styles.statSubtext}>Champion!</Text>
            )}
          </View>

          <View style={[styles.statCard, styles.percentageStat]}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statNumber}>{stats.winPercentage}%</Text>
            <Text style={styles.statLabel}>Win Rate</Text>
            <Text style={styles.statSubtext}>
              {getWinRateMessage(stats.winPercentage)}
            </Text>
          </View>

          <View style={[styles.statCard, styles.streakStat]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statNumber}>{stats.currentWinStreak}</Text>
            <Text style={styles.statLabel}>Current Streak</Text>
            {stats.currentWinStreak > 0 && (
              <Text style={styles.statSubtext}>On fire!</Text>
            )}
          </View>
        </View>

        {/* Motivational Challenge Cards */}
        <View style={styles.challengeSection}>
          <Text style={styles.sectionTitle}>🎯 Your Next Challenges</Text>
          {renderChallenges()}
        </View>

        {/* Mode Comparison */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>⚔️ Battle Arena Performance</Text>
          <View style={styles.modeCards}>
            <View style={[styles.modeCard, styles.classicCard]}>
              <Text style={styles.modeEmoji}>⚡</Text>
              <Text style={styles.modeTitle}>Classic Arena</Text>
              <Text style={styles.modeStats}>
                {stats.classicMode.gamesWon}/{stats.classicMode.gamesPlayed} wins
              </Text>
              <Text style={styles.modeWinRate}>{stats.classicMode.winRate}% win rate</Text>
              {stats.classicMode.bestTime > 0 && (
                <Text style={styles.modeBest}>⏱️ Best: {stats.classicMode.bestTime}s</Text>
              )}
            </View>

            <View style={[styles.modeCard, styles.endlessCard]}>
              <Text style={styles.modeEmoji}>♾️</Text>
              <Text style={styles.modeTitle}>Endless Battle</Text>
              <Text style={styles.modeStats}>
                {stats.endlessMode.gamesWon}/{stats.endlessMode.gamesPlayed} wins
              </Text>
              <Text style={styles.modeWinRate}>{stats.endlessMode.winRate}% win rate</Text>
              <Text style={styles.modeBest}>🔥 Best streak: {stats.endlessMode.bestStreak}</Text>
            </View>
          </View>
        </View>

        {/* Call to Action */}
        <TouchableOpacity style={styles.playButton} onPress={handlePlayNow}>
          <Text style={styles.playButtonText}>🚀 Continue Your Journey</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderAchievementsTab = () => {
    if (!stats) return null;

    const achievements = [
      {
        id: 'firstBoundary',
        emoji: '🏏',
        title: 'First Boundary',
        description: 'Win your first match',
        unlocked: stats.achievements.firstBoundary,
        rarity: 'common'
      },
      {
        id: 'hatTrickHero',
        emoji: '🎯',
        title: 'Hat-trick Hero',
        description: 'Win 3 games in a row',
        unlocked: stats.achievements.hatTrickHero,
        rarity: 'uncommon'
      },
      {
        id: 'fireBrand',
        emoji: '🔥',
        title: 'Fire Brand',
        description: 'Achieve 10-win streak',
        unlocked: stats.achievements.fireBrand,
        rarity: 'rare'
      },
      {
        id: 'lightningStrike',
        emoji: '⚡',
        title: 'Lightning Strike',
        description: 'Win Classic in under 30s',
        unlocked: stats.achievements.lightningStrike,
        rarity: 'epic'
      },
      {
        id: 'centuryMaker',
        emoji: '💯',
        title: 'Century Maker',
        description: 'Reach 100 total wins',
        unlocked: stats.achievements.centuryMaker,
        rarity: 'legendary'
      },
      {
        id: 'captainCool',
        emoji: '👑',
        title: 'Captain Cool',
        description: 'Maintain 75% win rate',
        unlocked: stats.achievements.captainCool,
        rarity: 'legendary'
      }
    ];

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
        <View style={styles.achievementHeader}>
          <Text style={styles.achievementStats}>
            🏆 {unlockedCount}/{achievements.length} Achievements Unlocked
          </Text>
          <Text style={styles.achievementProgress}>
            {Math.round((unlockedCount / achievements.length) * 100)}% Complete
          </Text>
        </View>

        <View style={styles.achievementGrid}>
          {achievements.map((achievement) => (
            <View
  key={achievement.id}
  style={[
    styles.achievementCard,
    achievement.unlocked && styles.achievementUnlocked,
    achievement.rarity === 'common' && styles.commonAchievement,
    achievement.rarity === 'uncommon' && styles.uncommonAchievement,
    achievement.rarity === 'rare' && styles.rareAchievement,
    achievement.rarity === 'epic' && styles.epicAchievement,
    achievement.rarity === 'legendary' && styles.legendaryAchievement,
  ]}
>
              <View style={styles.achievementIconContainer}>
                <Text style={[
                  styles.achievementEmoji,
                  !achievement.unlocked && styles.achievementLocked
                ]}>
                  {achievement.emoji}
                </Text>
                {achievement.unlocked && (
                  <View style={styles.unlockedBadge}>
                    <Text style={styles.unlockedBadgeText}>✓</Text>
                  </View>
                )}
              </View>

              <Text style={[
                styles.achievementTitle,
                !achievement.unlocked && styles.achievementTextLocked
              ]}>
                {achievement.title}
              </Text>

              <Text style={[
                styles.achievementDescription,
                !achievement.unlocked && styles.achievementTextLocked
              ]}>
                {achievement.description}
              </Text>

             <View style={[
  styles.rarityBadge,
  achievement.rarity === 'common' && styles.commonBadge,
  achievement.rarity === 'uncommon' && styles.uncommonBadge,
  achievement.rarity === 'rare' && styles.rareBadge,
  achievement.rarity === 'epic' && styles.epicBadge,
  achievement.rarity === 'legendary' && styles.legendaryBadge,
]}>
  <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
</View>
            </View>
          ))}
        </View>

        {/* Coming Soon Section */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.sectionTitle}>🔮 Coming Soon</Text>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonEmoji}>🌟</Text>
            <Text style={styles.comingSoonTitle}>New Achievements</Text>
            <Text style={styles.comingSoonText}>
              • Multiplayer Champion{'\n'}
              • Daily Challenge Master{'\n'}
              • Tournament Victor{'\n'}
              • Social Cricket Star
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderProgressTab = () => {
    if (!stats) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
        {/* Weekly Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>📅 Your Journey This Week</Text>
          <View style={styles.weeklyCard}>
            <Text style={styles.weeklyTitle}>Games This Week</Text>
            <Text style={styles.weeklyNumber}>{Math.min(stats.totalGamesPlayed, 15)}</Text>
            <Text style={styles.weeklySubtext}>
              {stats.totalGamesPlayed < 7 ? 'Play more to build momentum!' : 'Great consistency!'}
            </Text>
          </View>
        </View>

        {/* Skill Level Breakdown */}
        <View style={styles.skillSection}>
          <Text style={styles.sectionTitle}>🎯 Skill Mastery</Text>
          {renderSkillBars()}
        </View>

        {/* Goals & Milestones */}
        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>🏁 Next Milestones</Text>
          {renderMilestones()}
        </View>

        {/* Coming Soon Features */}
        <View style={styles.comingSoonSection}>
          <Text style={styles.sectionTitle}>🚀 Coming Soon</Text>
          <View style={styles.comingSoonCard}>
            <Text style={styles.comingSoonEmoji}>📊</Text>
            <Text style={styles.comingSoonTitle}>Advanced Analytics</Text>
            <Text style={styles.comingSoonText}>
              • Performance trends over time{'\n'}
              • Detailed match analysis{'\n'}
              • AI-powered improvement tips{'\n'}
              • Compare with global players
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderChallenges = () => {
    if (!stats) return null;

    const challenges = [];

    if (stats.totalGamesPlayed < 10) {
      challenges.push({
        icon: '🎯',
        title: 'Newcomer Challenge',
        description: `Play ${10 - stats.totalGamesPlayed} more games`,
        progress: stats.totalGamesPlayed / 10,
        reward: '+100 XP'
      });
    }

    if (stats.currentWinStreak < 5) {
      challenges.push({
        icon: '🔥',
        title: 'Streak Master',
        description: `Win ${5 - stats.currentWinStreak} more in a row`,
        progress: stats.currentWinStreak / 5,
        reward: 'Fire Brand Badge'
      });
    }

    if (stats.winPercentage < 75) {
      challenges.push({
        icon: '⚡',
        title: 'Elite Player',
        description: 'Reach 75% win rate',
        progress: stats.winPercentage / 75,
        reward: 'Elite Status'
      });
    }

    return challenges.map((challenge, index) => (
      <View key={index} style={styles.challengeCard}>
        <Text style={styles.challengeIcon}>{challenge.icon}</Text>
        <View style={styles.challengeContent}>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          <View style={styles.challengeProgressBar}>
            <View style={[styles.challengeProgressFill, { width: `${Math.min(challenge.progress * 100, 100)}%` }]} />
          </View>
          <Text style={styles.challengeReward}>Reward: {challenge.reward}</Text>
        </View>
      </View>
    ));
  };

  const renderSkillBars = () => {
    if (!stats) return null;

    const skills = [
      {
        name: 'Classic Mastery',
        level: Math.min(stats.classicMode.winRate, 100),
        color: '#4CAF50'
      },
      {
        name: 'Endless Endurance',
        level: Math.min(stats.endlessMode.winRate, 100),
        color: '#FF6B35'
      },
      {
        name: 'Consistency',
        level: Math.min((stats.totalGamesPlayed / 50) * 100, 100),
        color: '#FFD700'
      },
      {
        name: 'Speed',
        level: stats.classicMode.bestTime > 0 ? Math.max(100 - stats.classicMode.bestTime, 0) : 0,
        color: '#9C27B0'
      }
    ];

    return skills.map((skill, index) => (
      <View key={index} style={styles.skillBar}>
        <View style={styles.skillHeader}>
          <Text style={styles.skillName}>{skill.name}</Text>
          <Text style={styles.skillLevel}>{Math.round(skill.level)}%</Text>
        </View>
        <View style={styles.skillBarContainer}>
          <View style={[styles.skillBarFill, { width: `${skill.level}%`, backgroundColor: skill.color }]} />
        </View>
      </View>
    ));
  };

  const renderMilestones = () => {
    if (!stats) return null;

    const milestones = [
      {
        title: 'Next Win Milestone',
        current: stats.totalGamesWon,
        target: Math.ceil((stats.totalGamesWon + 1) / 10) * 10,
        icon: '🏆'
      },
      {
        title: 'Next Level',
        current: stats.totalGamesWon % 10,
        target: 10,
        icon: '⬆️'
      },
      {
        title: 'Win Rate Goal',
        current: stats.winPercentage,
        target: Math.min(stats.winPercentage + 10, 100),
        icon: '📈'
      }
    ];

    return milestones.map((milestone, index) => (
      <View key={index} style={styles.milestoneCard}>
        <Text style={styles.milestoneIcon}>{milestone.icon}</Text>
        <View style={styles.milestoneContent}>
          <Text style={styles.milestoneTitle}>{milestone.title}</Text>
          <Text style={styles.milestoneProgress}>
            {milestone.current}/{milestone.target}
          </Text>
          <View style={styles.milestoneBar}>
            <View style={[
              styles.milestoneBarFill,
              { width: `${(milestone.current / milestone.target) * 100}%` }
            ]} />
          </View>
        </View>
      </View>
    ));
  };

  const getPlayerTitle = (wins: number, winRate: number): string => {
    if (wins >= 100 && winRate >= 80) return '🏆 Cricket Legend';
    if (wins >= 50 && winRate >= 70) return '⭐ Elite Player';
    if (wins >= 25 && winRate >= 60) return '🎯 Skilled Batsman';
    if (wins >= 10) return '🏏 Rising Star';
    if (wins >= 5) return '⚡ Rookie Champion';
    return '🌱 Cricket Newcomer';
  };

  const getWinRateMessage = (winRate: number): string => {
    if (winRate >= 80) return 'Legendary!';
    if (winRate >= 70) return 'Excellent!';
    if (winRate >= 60) return 'Great!';
    if (winRate >= 50) return 'Good!';
    return 'Keep going!';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cricket Statistics</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Player Card */}
      {renderPlayerCard()}

      {/* Tab Navigation */}
      {renderTabSelector()}

      {/* Tab Content */}
      <View style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'achievements' && renderAchievementsTab()}
        {selectedTab === 'progress' && renderProgressTab()}
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
    width: 60,
  },
  
  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 30,
    textAlign: 'center',
  },
  loadingBar: {
    width: '60%',
    height: 4,
    backgroundColor: '#FFFFFF20',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '70%',
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 2,
  },

  // Player Card
  playerCard: {
    margin: 20,
    padding: 20,
    backgroundColor: 'linear-gradient(135deg, #1A1A4D, #2D2D6D)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFD70030',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  playerAvatar: {
    position: 'relative',
    marginRight: 15,
  },
  avatarEmoji: {
    fontSize: 48,
    backgroundColor: '#FFD70020',
    borderRadius: 30,
    width: 60,
    height: 60,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0C0C2D',
  },
  levelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  playerTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
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
  progressContainer: {
    marginTop: 10,
  },
  progressLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  progressBarContainer: {
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#FFFFFF20',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    color: '#FFD700',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },

  // Tabs
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF10',
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  activeTabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
  },
  activeTabLabel: {
    color: '#0C0C2D',
    fontFamily: 'Poppins-Bold',
  },

  // Content
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF10',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF20',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  primaryStat: {
    borderColor: '#4285F4',
    backgroundColor: '#4285F420',
  },
  successStat: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5020',
  },
  percentageStat: {
    borderColor: '#FFD700',
    backgroundColor: '#FFD70020',
  },
  streakStat: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B3520',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  statLabel: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginBottom: 4,
  },
  statSubtext: {
    color: '#FFD700',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Sections
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    marginTop: 10,
  },

  // Challenges
  challengeSection: {
    marginBottom: 30,
  },
  challengeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    alignItems: 'center',
  },
  challengeIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  challengeDescription: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    marginBottom: 8,
  },
  challengeProgressBar: {
    height: 6,
    backgroundColor: '#FFFFFF20',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  challengeProgressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  challengeReward: {
    color: '#FFD700',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },

  // Mode Cards
  modeSection: {
    marginBottom: 30,
  },
  modeCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  classicCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5010',
  },
  endlessCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#FF6B3510',
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modeStats: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  modeWinRate: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  modeBest: {
    color: '#4CAF50',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Achievements
  achievementHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
  },
  achievementStats: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  achievementProgress: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  achievementCard: {
    width: (width - 60) / 2,
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  achievementUnlocked: {
    backgroundColor: '#FFD70015',
    borderColor: '#FFD70040',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  commonAchievement: {
    borderColor: '#CCCCCC40',
  },
  uncommonAchievement: {
    borderColor: '#4CAF5040',
  },
  rareAchievement: {
    borderColor: '#2196F340',
  },
  epicAchievement: {
    borderColor: '#9C27B040',
  },
  legendaryAchievement: {
    borderColor: '#FF9800040',
  },
  achievementIconContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  achievementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementLocked: {
    opacity: 0.3,
  },
  unlockedBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  achievementTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  achievementDescription: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementTextLocked: {
    opacity: 0.4,
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 5,
  },
  commonBadge: {
    backgroundColor: '#CCCCCC20',
  },
  uncommonBadge: {
    backgroundColor: '#4CAF5020',
  },
  rareBadge: {
    backgroundColor: '#2196F320',
  },
  epicBadge: {
    backgroundColor: '#9C27B020',
  },
  legendaryBadge: {
    backgroundColor: '#FF980020',
  },
  rarityText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontFamily: 'Poppins-Bold',
  },

  // Progress Tab
  progressSection: {
    marginBottom: 30,
  },
  weeklyCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  weeklyTitle: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 8,
  },
  weeklyNumber: {
    color: '#FFD700',
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  weeklySubtext: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },

  // Skills
  skillSection: {
    marginBottom: 30,
  },
  skillBar: {
    marginBottom: 20,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
  },
  skillLevel: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
  },
  skillBarContainer: {
    height: 8,
    backgroundColor: '#FFFFFF20',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // Goals
  goalsSection: {
    marginBottom: 30,
  },
  milestoneCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    alignItems: 'center',
  },
  milestoneIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  milestoneProgress: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  milestoneBar: {
    height: 6,
    backgroundColor: '#FFFFFF20',
    borderRadius: 3,
    overflow: 'hidden',
  },
  milestoneBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },

  // Coming Soon
  comingSoonSection: {
    marginBottom: 30,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    borderStyle: 'dashed',
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: 15,
  },
  comingSoonTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  comingSoonText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Call to Action
  playButton: {
    backgroundColor: 'linear-gradient(45deg, #4CAF50, #45A049)',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
});

export default StatisticsScreen;
