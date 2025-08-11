import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';
import { useUserStats } from '../hooks/useUserStats';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelection'>;

const { width } = Dimensions.get('window');

function ModeSelectionScreen({ navigation }: Props) {
  const { playButtonClick } = useSounds();
  const { stats, isLoading } = useUserStats();
  const { user } = useAuth();

  const handleBackPress = () => {
    playButtonClick();
    navigation.goBack();
  };

  const handleClassicMode = () => {
    playButtonClick();
    navigation.navigate('ClassicGameplay', { reset: true });
  };

  const handleEndlessMode = () => {
    playButtonClick();
    navigation.navigate('Gameplay', { reset: true });
  };

  const handleStatistics = () => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  const getModeRecommendation = () => {
    if (!stats || stats.totalGamesPlayed === 0) {
      return {
        recommended: 'classic',
        reason: 'Perfect for beginners!'
      };
    }

    if (stats.classicMode.winRate < 60) {
      return {
        recommended: 'classic',
        reason: 'Master the basics first!'
      };
    }

    if (stats.endlessMode.gamesPlayed < stats.classicMode.gamesPlayed / 2) {
      return {
        recommended: 'endless',
        reason: 'Try the endless challenge!'
      };
    }

    return {
      recommended: stats.classicMode.winRate > stats.endlessMode.winRate ? 'classic' : 'endless',
      reason: 'Play your stronger mode!'
    };
  };

  const renderStatsHeader = () => {
    if (isLoading) {
      return (
        <View style={styles.statsHeader}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      );
    }

    if (!stats || stats.totalGamesPlayed === 0) {
      return (
        <View style={styles.statsHeader}>
          <Text style={styles.welcomeTitle}>🏏 Welcome to Cricket Arena!</Text>
          <Text style={styles.welcomeSubtext}>Choose your first battle mode</Text>
        </View>
      );
    }

    return (
      <View style={styles.statsHeader}>
        <View style={styles.playerLevel}>
          <Text style={styles.levelEmoji}>🏏</Text>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Level {Math.floor(stats.totalGamesWon / 10) + 1} Player</Text>
            <Text style={styles.levelSubtext}>
              {stats.totalGamesPlayed} games • {stats.totalGamesWon} wins • {stats.winPercentage}% win rate
            </Text>
          </View>
          <TouchableOpacity style={styles.quickStatsButton} onPress={handleStatistics}>
            <Text style={styles.quickStatsIcon}>📊</Text>
            {stats.currentWinStreak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥{stats.currentWinStreak}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderModeCard = (
    mode: 'classic' | 'endless',
    title: string,
    description: string,
    emoji: string,
    onPress: () => void
  ) => {
    const isRecommended = getModeRecommendation().recommended === mode;
    const modeStats = stats ? (mode === 'classic' ? stats.classicMode : stats.endlessMode) : null;
    
    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          mode === 'classic' ? styles.classicCard : styles.endlessCard,
          isRecommended && styles.recommendedCard
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {isRecommended && (
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedText}>⭐ RECOMMENDED</Text>
          </View>
        )}

        <View style={styles.modeHeader}>
          <Text style={styles.modeEmoji}>{emoji}</Text>
          <Text style={styles.modeTitle}>{title}</Text>
        </View>

        <Text style={styles.modeDescription}>{description}</Text>

        {modeStats && modeStats.gamesPlayed > 0 ? (
          <View style={styles.modeStats}>
            <Text style={styles.modeStatsTitle}>Your Performance:</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{modeStats.gamesPlayed}</Text>
                <Text style={styles.statLabel}>Played</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{modeStats.gamesWon}</Text>
                <Text style={styles.statLabel}>Won</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#FFD700' }]}>{modeStats.winRate}%</Text>
                <Text style={styles.statLabel}>Win Rate</Text>
              </View>
            </View>
            
            {mode === 'classic' && modeStats && 'bestTime' in modeStats && modeStats.bestTime > 0 && (
              <Text style={styles.bestRecord}>⏱️ Best Time: {modeStats.bestTime}s</Text>
            )}
            
            {mode === 'endless' && modeStats && 'bestStreak' in modeStats && modeStats.bestStreak > 0 && (
              <Text style={styles.bestRecord}>🔥 Best Streak: {modeStats.bestStreak}</Text>
            )}
          </View>
        ) : (
          <View style={styles.newModeIndicator}>
            <Text style={styles.newModeText}>
              {stats && stats.totalGamesPlayed > 0 ? '🆕 Try This Mode!' : '🌟 Start Here!'}
            </Text>
          </View>
        )}

        <View style={styles.playButtonContainer}>
          <Text style={styles.playButtonText}>
            {mode === 'classic' ? '⚡ Quick Battle' : '♾️ Endless Challenge'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecommendation = () => {
    const recommendation = getModeRecommendation();
    
    return (
      <View style={styles.recommendationContainer}>
        <Text style={styles.recommendationTitle}>🎯 AI Recommendation</Text>
        <Text style={styles.recommendationText}>
          Try <Text style={styles.highlightText}>
            {recommendation.recommended === 'classic' ? 'Classic Mode' : 'Endless Mode'}
          </Text> - {recommendation.reason}
        </Text>
      </View>
    );
  };

  const renderMotivationalStats = () => {
    if (!stats || stats.totalGamesPlayed === 0) {
      return (
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationTitle}>🚀 Ready to Begin Your Journey?</Text>
          <Text style={styles.motivationText}>
            Every champion started with their first game. Choose a mode and make history!
          </Text>
        </View>
      );
    }

    let motivationMessage = '';
    let motivationEmoji = '🏏';

    if (stats.currentWinStreak >= 5) {
      motivationMessage = `You're on fire with a ${stats.currentWinStreak}-game winning streak!`;
      motivationEmoji = '🔥';
    } else if (stats.winPercentage >= 80) {
      motivationMessage = `Incredible ${stats.winPercentage}% win rate! You're a true champion!`;
      motivationEmoji = '🏆';
    } else if (stats.winPercentage >= 60) {
      motivationMessage = `Great ${stats.winPercentage}% win rate! Keep pushing for excellence!`;
      motivationEmoji = '⭐';
    } else if (stats.totalGamesWon >= 10) {
      motivationMessage = `${stats.totalGamesWon} wins achieved! You're building momentum!`;
      motivationEmoji = '💪';
    } else {
      motivationMessage = `${stats.totalGamesPlayed} games played! Every match makes you stronger!`;
      motivationEmoji = '🌟';
    }

    return (
      <View style={styles.motivationContainer}>
        <Text style={styles.motivationEmoji}>{motivationEmoji}</Text>
        <Text style={styles.motivationText}>{motivationMessage}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Your Arena</Text>
        <View style={styles.placeholder} />
      </View>

      {/* ✅ MAIN FIX: Add ScrollView here */}
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Header */}
        {renderStatsHeader()}

        {/* AI Recommendation */}
        {renderRecommendation()}

        {/* Mode Cards */}
        <View style={styles.modesContainer}>
          {renderModeCard(
            'classic',
            'Classic Mode',
            'Quick 60-second battles. Master timing and strategy to collect the most cards before time runs out.',
            '⚡',
            handleClassicMode
          )}

          {renderModeCard(
            'endless',
            'Endless Mode',
            'No time limits! Keep playing until all cards are collected. Perfect for relaxed, strategic gameplay.',
            '♾️',
            handleEndlessMode
          )}
        </View>

        {/* Motivational Message */}
        {renderMotivationalStats()}

        {/* Coming Soon */}
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonTitle}>🔮 Coming Soon</Text>
          <Text style={styles.comingSoonText}>
            Multiplayer Arena • Tournament Mode • Daily Challenges
          </Text>
        </View>

        {/* Bottom spacing for better scrolling */}
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
  // ✅ ADD: ScrollView styles
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
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

  // Stats Header
  statsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  loadingText: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  welcomeTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtext: {
    color: '#CCCCCC',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  playerLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  levelEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  levelSubtext: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  quickStatsButton: {
    position: 'relative',
    padding: 10,
    backgroundColor: '#FFD70020',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  quickStatsIcon: {
    fontSize: 20,
  },
  streakBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
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

  // Recommendation
  recommendationContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFD70015',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  recommendationTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  recommendationText: {
    color: '#CCCCCC',
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 18,
  },
  highlightText: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
  },

  // Mode Cards
  modesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modeCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  classicCard: {
    borderColor: '#4CAF5040',
    backgroundColor: '#4CAF5010',
  },
  endlessCard: {
    borderColor: '#FF6B3540',
    backgroundColor: '#FF6B3510',
  },
  recommendedCard: {
    borderColor: '#FFD70060',
    backgroundColor: '#FFD70015',
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    transform: [{ rotate: '3deg' }],
  },
  recommendedText: {
    color: '#0C0C2D',
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
  },
  modeHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  modeEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  modeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  modeDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  
  // Mode Stats
  modeStats: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  modeStatsTitle: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#CCCCCC',
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
  },
  bestRecord: {
    color: '#4CAF50',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginTop: 5,
  },

  // New Mode
  newModeIndicator: {
    backgroundColor: '#FFFFFF05',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderStyle: 'dashed',
  },
  newModeText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },

  // Play Button
  playButtonContainer: {
    backgroundColor: '#FFFFFF15',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },

  // Motivation
  motivationContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF15',
    marginBottom: 20,
  },
  motivationTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  motivationEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  motivationText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Coming Soon
  comingSoonContainer: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF05',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    marginBottom: 6,
  },
  comingSoonText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  // ✅ ADD: Bottom spacing for better scrolling
  bottomSpacing: {
    height: 30,
  },
});

export default ModeSelectionScreen;
