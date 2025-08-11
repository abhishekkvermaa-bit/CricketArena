import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SessionStats {
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  currentStreak: number;
  bestStreak: number;
  sessionStartTime: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge: string;
  unlocked: boolean;
  requirement: string;
  progress: number;
  target: number;
}

export const useSessionStats = () => {
  const [stats, setStats] = useState<SessionStats>({
    totalGames: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    winRate: 0,
    currentStreak: 0,
    bestStreak: 0,
    sessionStartTime: Date.now(),
  });

  const [isGuest, setIsGuest] = useState(true); // Track if user is guest

  // Initialize stats on component mount
  useEffect(() => {
    initializeStats();
  }, []);

  const initializeStats = async () => {
    try {
      // For guest users, always start fresh (don't load from storage)
      if (isGuest) {
        const sessionStats: SessionStats = {
          totalGames: 0,
          wins: 0,
          losses: 0,
          draws: 0,
          winRate: 0,
          currentStreak: 0,
          bestStreak: 0,
          sessionStartTime: Date.now(),
        };
        setStats(sessionStats);
      } else {
        // For signed-in users, load from persistent storage
        const savedStats = await AsyncStorage.getItem('userStats');
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const updateStats = async (gameResult: 'win' | 'loss' | 'draw') => {
    const newStats = { ...stats };
    
    // Update game counts
    newStats.totalGames += 1;
    
    switch (gameResult) {
      case 'win':
        newStats.wins += 1;
        newStats.currentStreak += 1;
        newStats.bestStreak = Math.max(newStats.bestStreak, newStats.currentStreak);
        break;
      case 'loss':
        newStats.losses += 1;
        newStats.currentStreak = 0;
        break;
      case 'draw':
        newStats.draws += 1;
        // Current streak continues on draw
        break;
    }
    
    // Calculate win rate
    newStats.winRate = newStats.totalGames > 0 
      ? Math.round((newStats.wins / newStats.totalGames) * 100) 
      : 0;
    
    setStats(newStats);
    
    // Save to storage only for signed-in users
    if (!isGuest) {
      try {
        await AsyncStorage.setItem('userStats', JSON.stringify(newStats));
      } catch (error) {
        console.error('Error saving stats:', error);
      }
    }
  };

  const resetSessionStats = () => {
    const resetStats: SessionStats = {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      currentStreak: 0,
      bestStreak: 0,
      sessionStartTime: Date.now(),
    };
    setStats(resetStats);
  };

  const switchToSignedInMode = async (userId: string) => {
    setIsGuest(false);
    // Here you would typically load user stats from Firebase
    // For now, we'll keep current session stats and start persisting
    try {
      await AsyncStorage.setItem('userStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats on sign in:', error);
    }
  };

  const getSessionDuration = () => {
    const duration = Date.now() - stats.sessionStartTime;
    const minutes = Math.floor(duration / (1000 * 60));
    return minutes;
  };

  const getAchievements = (): Achievement[] => {
    const achievements: Achievement[] = [
      // Win streak achievements - Cricket themed
      {
        id: 'win_streak_5',
        title: 'Century Partnership!',
        description: stats.currentStreak >= 5 
          ? `${stats.currentStreak} victories in a row - building momentum`
          : 'Win 5 games in a row to unlock this achievement',
        icon: stats.currentStreak >= 5 ? '🔥' : '🔒',
        badge: 'STREAK',
        unlocked: stats.currentStreak >= 5,
        requirement: 'Win 5 consecutive games',
        progress: stats.currentStreak,
        target: 5
      },
      {
        id: 'win_streak_10',
        title: 'Unbeaten Innings!',
        description: stats.currentStreak >= 10
          ? `${stats.currentStreak} consecutive wins - legendary form`
          : 'Win 10 games in a row to unlock this achievement',
        icon: stats.currentStreak >= 10 ? '⚡' : '🔒',
        badge: 'EPIC',
        unlocked: stats.currentStreak >= 10,
        requirement: 'Win 10 consecutive games',
        progress: stats.currentStreak,
        target: 10
      },
      {
        id: 'win_streak_15',
        title: 'Double Century!',
        description: stats.currentStreak >= 15
          ? `${stats.currentStreak} wins without defeat - master class`
          : 'Win 15 games in a row to unlock this legendary achievement',
        icon: stats.currentStreak >= 15 ? '🏆' : '🔒',
        badge: 'LEGEND',
        unlocked: stats.currentStreak >= 15,
        requirement: 'Win 15 consecutive games',
        progress: stats.currentStreak,
        target: 15
      },

      // Game count achievements - Cricket themed
      {
        id: 'games_10',
        title: 'Opening Batsman',
        description: stats.totalGames >= 10
          ? 'Played 10 matches this session - getting your eye in'
          : 'Play 10 games to unlock this achievement',
        icon: stats.totalGames >= 10 ? '🏏' : '🔒',
        badge: 'STARTER',
        unlocked: stats.totalGames >= 10,
        requirement: 'Play 10 games',
        progress: stats.totalGames,
        target: 10
      },
      {
        id: 'games_25',
        title: 'Middle Order Specialist',
        description: stats.totalGames >= 25
          ? 'Played 25 matches - finding your rhythm'
          : 'Play 25 games to unlock this achievement',
        icon: stats.totalGames >= 25 ? '🎯' : '🔒',
        badge: 'RISING',
        unlocked: stats.totalGames >= 25,
        requirement: 'Play 25 games',
        progress: stats.totalGames,
        target: 25
      },
      {
        id: 'games_50',
        title: 'All-Rounder',
        description: stats.totalGames >= 50
          ? 'Played 50 matches this session - complete player'
          : 'Play 50 games to unlock this achievement',
        icon: stats.totalGames >= 50 ? '⭐' : '🔒',
        badge: 'PRO',
        unlocked: stats.totalGames >= 50,
        requirement: 'Play 50 games',
        progress: stats.totalGames,
        target: 50
      },
      {
        id: 'games_100',
        title: 'Test Match Veteran',
        description: stats.totalGames >= 100
          ? 'Incredible 100 matches in one session - legendary endurance'
          : 'Play 100 games to unlock this legendary achievement',
        icon: stats.totalGames >= 100 ? '🚀' : '🔒',
        badge: 'LEGEND',
        unlocked: stats.totalGames >= 100,
        requirement: 'Play 100 games',
        progress: stats.totalGames,
        target: 100
      },

      // Perfect game achievements - Cricket themed
      {
        id: 'perfect_session_5',
        title: 'Perfect Match Rating!',
        description: (stats.totalGames >= 5 && stats.winRate === 100)
          ? '100% win rate maintained - flawless technique'
          : 'Maintain 100% win rate for 5+ games to unlock',
        icon: (stats.totalGames >= 5 && stats.winRate === 100) ? '💎' : '🔒',
        badge: 'PERFECT',
        unlocked: stats.totalGames >= 5 && stats.winRate === 100,
        requirement: 'Win all games (min 5 games)',
        progress: stats.winRate,
        target: 100
      },
      {
        id: 'clean_sweep',
        title: 'Series Whitewash!',
        description: (stats.totalGames >= 10 && stats.winRate === 100)
          ? 'Won every single match - total dominance'
          : 'Win all 10+ games without a single loss',
        icon: (stats.totalGames >= 10 && stats.winRate === 100) ? '🧹' : '🔒',
        badge: 'CHAMPION',
        unlocked: stats.totalGames >= 10 && stats.winRate === 100,
        requirement: 'Win all games (min 10 games)',
        progress: stats.winRate,
        target: 100
      },

      // High win rate achievements
      {
        id: 'consistent_performer',
        title: 'Consistent Run Scorer',
        description: (stats.totalGames >= 20 && stats.winRate >= 80)
          ? 'Maintaining excellent form - reliable performer'
          : 'Maintain 80%+ win rate over 20+ games',
        icon: (stats.totalGames >= 20 && stats.winRate >= 80) ? '📈' : '🔒',
        badge: 'RELIABLE',
        unlocked: stats.totalGames >= 20 && stats.winRate >= 80,
        requirement: 'Maintain 80%+ win rate (min 20 games)',
        progress: stats.winRate,
        target: 80
      },

      // Win milestone achievements
      {
        id: 'half_century_wins',
        title: 'Half Century of Victories!',
        description: stats.wins >= 50
          ? 'Scored 50 wins - solid innings'
          : 'Win 50 games to unlock this milestone',
        icon: stats.wins >= 50 ? '🏏' : '🔒',
        badge: 'MILESTONE',
        unlocked: stats.wins >= 50,
        requirement: 'Win 50 games',
        progress: stats.wins,
        target: 50
      },
      {
        id: 'century_wins',
        title: 'Century of Victories!',
        description: stats.wins >= 100
          ? 'Reached 100 wins - incredible achievement'
          : 'Win 100 games to unlock this legendary milestone',
        icon: stats.wins >= 100 ? '💯' : '🔒',
        badge: 'CENTURY',
        unlocked: stats.wins >= 100,
        requirement: 'Win 100 games',
        progress: stats.wins,
        target: 100
      }
    ];

    return achievements;
  };

  return {
    stats,
    isGuest,
    updateStats,
    resetSessionStats,
    switchToSignedInMode,
    getSessionDuration,
    getAchievements,
  };
};
