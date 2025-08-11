import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { useSounds } from '../hooks/useSounds';
import { useUserStats } from '../hooks/useUserStats';
import { useAuth } from '../hooks/useAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSelection'>;

const { width } = Dimensions.get('window');

interface Game {
  id: string;
  name: string;
  shortName: string;
  description: string;
  emoji: string;
  isLocked: boolean;
  screen?: 'ModeSelection';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  estimatedTime: string;
  features: string[];
  comingSoonDate?: string;
}

const games: Game[] = [
  { 
    id: 'trump-cards',
    name: 'Cricket Trump Cards', 
    shortName: 'Trump Cards',
    description: 'Master timing and strategy in this fast-paced card battle arena.',
    emoji: '🏏',
    isLocked: false, 
    screen: 'ModeSelection',
    difficulty: 'Beginner',
    estimatedTime: '2-5 min',
    features: ['Quick Battles', 'Endless Mode', 'Statistics Tracking']
  },
  { 
    id: 'book-cricket',
    name: 'Book Cricket Challenge', 
    shortName: 'Book Cricket',
    description: 'Classic book cricket with modern twists and multiplayer support.',
    emoji: '📖',
    isLocked: true,
    difficulty: 'Intermediate',
    estimatedTime: '5-10 min',
    features: ['Classic Rules', 'Multiplayer', 'Tournament Mode'],
    comingSoonDate: 'September 2025'
  },
  { 
    id: 'runs-challenge',
    name: '500K Runs Marathon', 
    shortName: '500K Challenge',
    description: 'Epic endurance challenge to score half a million runs across seasons.',
    emoji: '🏃‍♂️',
    isLocked: true,
    difficulty: 'Expert',
    estimatedTime: '30+ hours',
    features: ['Season Mode', 'Career Progression', 'Global Leaderboards'],
    comingSoonDate: 'October 2025'
  },
  { 
    id: 'guess-player',
    name: 'Guess the Cricket Star', 
    shortName: 'Guess Player',
    description: 'Test your cricket knowledge with photo and stats-based player guessing.',
    emoji: '🤔',
    isLocked: true,
    difficulty: 'Advanced',
    estimatedTime: '3-8 min',
    features: ['Photo Clues', 'Stats Hints', 'Daily Challenges'],
    comingSoonDate: 'November 2025'
  },
];

function GameSelectionScreen({ navigation }: Props) {
  const { playButtonClick } = useSounds();
  const { stats, isLoading } = useUserStats();
  const { user } = useAuth();

  const handleGameSelect = (game: Game): void => {
    playButtonClick();
    if (!game.isLocked && game.screen) {
      navigation.navigate(game.screen);
    } else if (game.isLocked) {
      // Show coming soon info - could be expanded to a modal
      console.log(`🔒 ${game.name} is coming ${game.comingSoonDate || 'soon'}!`);
    }
  };

  const handleBack = (): void => {
    playButtonClick();
    navigation.goBack();
  };

  const handleStatistics = (): void => {
    playButtonClick();
    navigation.navigate('Statistics');
  };

  const renderUserHeader = () => {
    if (isLoading) {
      return (
        <View style={styles.userHeader}>
          <Text style={styles.loadingText}>Loading your progress...</Text>
        </View>
      );
    }

    if (!stats || stats.totalGamesPlayed === 0) {
      return (
        <View style={styles.userHeader}>
          <Text style={styles.welcomeTitle}>🎮 Choose Your Cricket Adventure</Text>
          <Text style={styles.welcomeSubtext}>Start your journey to cricket mastery!</Text>
        </View>
      );
    }

    const playerLevel = Math.floor(stats.totalGamesWon / 10) + 1;
    const getPlayerTitle = () => {
      if (stats.winPercentage >= 80) return '🏆 Cricket Legend';
      if (stats.winPercentage >= 70) return '⭐ Elite Player';
      if (stats.winPercentage >= 60) return '🎯 Skilled Batsman';
      if (stats.totalGamesWon >= 10) return '🏏 Rising Star';
      return '🌟 Cricket Rookie';
    };

    return (
      <View style={styles.userHeader}>
        <View style={styles.playerCard}>
          <View style={styles.playerInfo}>
            <Text style={styles.playerTitle}>{getPlayerTitle()}</Text>
            <Text style={styles.playerLevel}>Level {playerLevel} Player</Text>
            <Text style={styles.playerStats}>
              {stats.totalGamesPlayed} games • {stats.totalGamesWon} wins • {stats.winPercentage}% win rate
            </Text>
          </View>
          <TouchableOpacity style={styles.statsButton} onPress={handleStatistics}>
            <Text style={styles.statsIcon}>📊</Text>
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#4CAF50';
      case 'Intermediate': return '#FFD700';
      case 'Advanced': return '#FF9800';
      case 'Expert': return '#F44336';
      default: return '#CCCCCC';
    }
  };

  const renderGameCard = (game: Game) => {
    const isAvailable = !game.isLocked;
    
    return (
      <TouchableOpacity
        key={game.id}
        style={[
          styles.gameCard,
          isAvailable ? styles.availableCard : styles.lockedCard
        ]}
        onPress={() => handleGameSelect(game)}
        activeOpacity={isAvailable ? 0.8 : 1}
      >
        {/* Game Header */}
        <View style={styles.gameHeader}>
          <Text style={styles.gameEmoji}>{game.emoji}</Text>
          <View style={styles.gameHeaderText}>
            <Text style={[styles.gameName, !isAvailable && styles.lockedText]}>
              {game.name}
            </Text>
            <View style={styles.gameMetadata}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(game.difficulty) }]}>
                  {game.difficulty}
                </Text>
              </View>
              <Text style={[styles.estimatedTime, !isAvailable && styles.lockedText]}>
                ⏱️ {game.estimatedTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Game Description */}
        <Text style={[styles.gameDescription, !isAvailable && styles.lockedText]}>
          {game.description}
        </Text>

        {/* Game Features */}
        <View style={styles.featuresContainer}>
          {game.features.map((feature, index) => (
            <View key={index} style={[styles.featureBadge, !isAvailable && styles.lockedFeature]}>
              <Text style={[styles.featureText, !isAvailable && styles.lockedText]}>
                {feature}
              </Text>
            </View>
          ))}
        </View>

        {/* Action Area */}
        <View style={styles.actionArea}>
          {isAvailable ? (
            <View style={styles.playButton}>
              <Text style={styles.playButtonText}>🎮 Play Now</Text>
            </View>
          ) : (
            <View style={styles.comingSoonContainer}>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonText}>🔒 COMING SOON</Text>
              </View>
              {game.comingSoonDate && (
                <Text style={styles.comingSoonDate}>Expected: {game.comingSoonDate}</Text>
              )}
            </View>
          )}
        </View>

        {/* Available Game Highlight */}
        {isAvailable && (
          <View style={styles.availableBorder} />
        )}
      </TouchableOpacity>
    );
  };

  const renderRecommendation = () => {
    if (!stats || stats.totalGamesPlayed === 0) {
      return (
        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>🎯 Recommended for You</Text>
          <Text style={styles.recommendationText}>
            Start with <Text style={styles.highlightText}>Cricket Trump Cards</Text> - perfect for beginners to learn the basics!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.recommendationCard}>
        <Text style={styles.recommendationTitle}>🔥 Continue Your Journey</Text>
        <Text style={styles.recommendationText}>
          You're on a roll with {stats.currentWinStreak > 0 ? `${stats.currentWinStreak}-game streak` : `${stats.winPercentage}% win rate`}! 
          Keep playing <Text style={styles.highlightText}>Trump Cards</Text> to improve your skills.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#0C0C2D" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Game Arena</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Header */}
        {renderUserHeader()}

        {/* Recommendation */}
        {renderRecommendation()}

        {/* Games Grid */}
        <View style={styles.gamesContainer}>
          <Text style={styles.sectionTitle}>🎮 Available Games</Text>
          {games.map(renderGameCard)}
        </View>

        {/* Coming Soon Features */}
        <View style={styles.comingSoonFeaturesContainer}>
          <Text style={styles.sectionTitle}>🚀 What's Coming Next</Text>
          <View style={styles.futureFeatures}>
            <View style={styles.futureFeatureItem}>
              <Text style={styles.futureFeatureEmoji}>🌐</Text>
              <Text style={styles.futureFeatureText}>Multiplayer Battles</Text>
            </View>
            <View style={styles.futureFeatureItem}>
              <Text style={styles.futureFeatureEmoji}>🏆</Text>
              <Text style={styles.futureFeatureText}>Tournament Mode</Text>
            </View>
            <View style={styles.futureFeatureItem}>
              <Text style={styles.futureFeatureEmoji}>📱</Text>
              <Text style={styles.futureFeatureText}>Social Features</Text>
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

  // User Header
  userHeader: {
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
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF08',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF15',
  },
  playerInfo: {
    flex: 1,
  },
  playerTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 4,
  },
  playerLevel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 4,
  },
  playerStats: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  statsButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#FFD70020',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD70040',
  },
  statsIcon: {
    fontSize: 24,
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
  recommendationCard: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#FFD70015',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFD70030',
  },
  recommendationTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  recommendationText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
  highlightText: {
    color: '#FFD700',
    fontFamily: 'Poppins-SemiBold',
  },

  // Games Section
  gamesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 20,
  },

  // Game Cards
  gameCard: {
    backgroundColor: '#FFFFFF08',
    borderRadius: 20,
    padding: 20,
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
  availableCard: {
    borderColor: '#4CAF5040',
    backgroundColor: '#4CAF5010',
  },
  lockedCard: {
    opacity: 0.7,
  },
  availableBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#4CAF50',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  // Game Header
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameEmoji: {
    fontSize: 48,
    marginRight: 15,
  },
  gameHeaderText: {
    flex: 1,
  },
  gameName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    marginBottom: 8,
  },
  lockedText: {
    opacity: 0.6,
  },
  gameMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  difficultyText: {
    fontSize: 11,
    fontFamily: 'Poppins-Bold',
  },
  estimatedTime: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },

  // Game Description
  gameDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    lineHeight: 20,
    marginBottom: 15,
  },

  // Features
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  featureBadge: {
    backgroundColor: '#FFFFFF15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  lockedFeature: {
    backgroundColor: '#FFFFFF08',
  },
  featureText: {
    color: '#FFD700',
    fontSize: 11,
    fontFamily: 'Poppins-SemiBold',
  },

  // Action Area
  actionArea: {
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  comingSoonContainer: {
    alignItems: 'center',
  },
  comingSoonBadge: {
    backgroundColor: '#FF9800',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
  },
  comingSoonDate: {
    color: '#CCCCCC',
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    fontStyle: 'italic',
  },

  // Coming Soon Features
  comingSoonFeaturesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  futureFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF05',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF10',
    borderStyle: 'dashed',
  },
  futureFeatureItem: {
    alignItems: 'center',
    flex: 1,
  },
  futureFeatureEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  futureFeatureText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
});

export default GameSelectionScreen;
