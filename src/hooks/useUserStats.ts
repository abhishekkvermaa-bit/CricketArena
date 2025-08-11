import { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserStats, StatsUpdate } from '../types/statistics';
import { useAuth } from './useAuth';

const INITIAL_STATS: Omit<UserStats, 'uid' | 'createdAt' | 'updatedAt'> = {
  totalGamesPlayed: 0,
  totalGamesWon: 0,
  totalGamesLost: 0,
  winPercentage: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
  currentLossStreak: 0,
  classicMode: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    winRate: 0,
    bestTime: 0,
  },
  endlessMode: {
    gamesPlayed: 0,
    gamesWon: 0,
    gamesLost: 0,
    winRate: 0,
    bestStreak: 0,
  },
  achievements: {
    firstBoundary: false,
    hatTrickHero: false,
    centuryMaker: false,
    lightningStrike: false,
    fireBrand: false,
    captainCool: false,
  },
  lastPlayedAt: new Date().toISOString(),
};

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    async function initializeUserStats() {
      if (!user) {
        setStats(null);
        setIsLoading(false);
        return;
      }

      try {
        if (user.isAnonymous) {
          // ✅ FIX: Guest users get fresh stats every session
          await createFreshGuestStats();
        } else {
          // Authenticated users get persistent stats
          await loadFirestoreStats();
        }
      } catch (error) {
        console.error('❌ Error loading user stats:', error);
        await createFreshGuestStats();
      }
    }

    initializeUserStats();
  }, [user]);

  // ✅ NEW: Create fresh stats for guest users (session-only)
  const createFreshGuestStats = async () => {
    if (!user) return;

    const newStats: UserStats = {
      uid: user.uid,
      ...INITIAL_STATS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log('👤 Created fresh guest session stats');
    setStats(newStats);
    setIsLoading(false);
  };

  // ✅ UPDATED: Only load persistent stats for authenticated users
  const loadFirestoreStats = async () => {
    if (!user || user.isAnonymous) return;

    try {
      const docRef = firestore().collection('users').doc(user.uid).collection('profile').doc('stats');
      const doc = await docRef.get();
      
      if (doc.exists()) {
        const firestoreStats = doc.data() as UserStats;
        setStats(firestoreStats);
        
        // Save to local storage for offline access
        await AsyncStorage.setItem(`stats_${user.uid}`, JSON.stringify(firestoreStats));
        console.log('☁️ Loaded persistent stats from Firestore');
      } else {
        await createInitialFirestoreStats();
      }
      
      setIsLoading(false);
      setIsOnline(true);
    } catch (error) {
      console.error('❌ Error loading Firestore stats:', error);
      setIsOnline(false);
      // Try to load from local storage
      await loadLocalStats();
    }
  };

  // ✅ UPDATED: Load local persistent stats (authenticated users only)
  const loadLocalStats = async () => {
    if (!user || user.isAnonymous) {
      await createFreshGuestStats();
      return;
    }

    try {
      const localStatsJson = await AsyncStorage.getItem(`stats_${user.uid}`);
      
      if (localStatsJson) {
        const localStats: UserStats = JSON.parse(localStatsJson);
        setStats(localStats);
        console.log('💾 Loaded persistent stats from local storage');
      } else {
        await createInitialFirestoreStats();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Error loading local stats:', error);
      await createFreshGuestStats();
    }
  };

  const createInitialFirestoreStats = async () => {
    if (!user || user.isAnonymous) return;

    const newStats: UserStats = {
      uid: user.uid,
      ...INITIAL_STATS,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = firestore().collection('users').doc(user.uid).collection('profile').doc('stats');
      await docRef.set(newStats);
      setStats(newStats);
      
      // Save locally too
      await AsyncStorage.setItem(`stats_${user.uid}`, JSON.stringify(newStats));
      console.log('✅ Created initial persistent stats');
    } catch (error) {
      console.error('❌ Error creating Firestore stats:', error);
      setStats(newStats);
    }
  };

  const updateStats = async (gameUpdate: StatsUpdate) => {
    if (!stats || !user) {
      console.log('⚠️ Cannot update stats: missing stats or user');
      return;
    }

    if (isUpdating) {
      console.log('⚠️ Stats update already in progress, skipping...');
      return;
    }

    setIsUpdating(true);
    
    try {
      console.log('📊 Updating stats:', gameUpdate);
      
      const updatedStats = calculateUpdatedStats(stats, gameUpdate);
      setStats(updatedStats);
      
      // ✅ FIX: Only save to persistent storage for authenticated users
      if (!user.isAnonymous) {
        await AsyncStorage.setItem(`stats_${user.uid}`, JSON.stringify(updatedStats));
        
        try {
          const docRef = firestore().collection('users').doc(user.uid).collection('profile').doc('stats');
          await docRef.set(updatedStats);
          setIsOnline(true);
          console.log('✅ Stats updated in Firestore');
        } catch (error) {
          console.error('❌ Error updating Firestore stats:', error);
          setIsOnline(false);
        }
      } else {
        console.log('👤 Guest stats updated (session-only)');
      }

      checkAchievements(stats, updatedStats);
    } catch (error) {
      console.error('❌ Error updating stats:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const calculateUpdatedStats = (currentStats: UserStats, update: StatsUpdate): UserStats => {
    const isWin = update.result === 'win';
    
    const newTotalGames = currentStats.totalGamesPlayed + 1;
    const newTotalWins = currentStats.totalGamesWon + (isWin ? 1 : 0);
    const newTotalLosses = currentStats.totalGamesLost + (isWin ? 0 : 1);
    const newWinPercentage = Math.round((newTotalWins / newTotalGames) * 100);
    
    let newWinStreak = currentStats.currentWinStreak;
    let newLossStreak = currentStats.currentLossStreak;
    let newBestWinStreak = currentStats.bestWinStreak;
    
    if (isWin) {
      newWinStreak += 1;
      newLossStreak = 0;
      newBestWinStreak = Math.max(newBestWinStreak, newWinStreak);
    } else {
      newWinStreak = 0;
      newLossStreak += 1;
    }
    
    const isClassicMode = update.gameMode === 'classic';
    
    let updatedClassicMode = currentStats.classicMode;
    let updatedEndlessMode = currentStats.endlessMode;
    
    if (isClassicMode) {
      const newClassicGames = currentStats.classicMode.gamesPlayed + 1;
      const newClassicWins = currentStats.classicMode.gamesWon + (isWin ? 1 : 0);
      const newClassicLosses = currentStats.classicMode.gamesLost + (isWin ? 0 : 1);
      const newClassicWinRate = Math.round((newClassicWins / newClassicGames) * 100);
      
      updatedClassicMode = {
        gamesPlayed: newClassicGames,
        gamesWon: newClassicWins,
        gamesLost: newClassicLosses,
        winRate: newClassicWinRate,
        bestTime: (isWin && (currentStats.classicMode.bestTime === 0 || update.duration < currentStats.classicMode.bestTime)) 
          ? update.duration 
          : currentStats.classicMode.bestTime,
      };
    } else {
      const newEndlessGames = currentStats.endlessMode.gamesPlayed + 1;
      const newEndlessWins = currentStats.endlessMode.gamesWon + (isWin ? 1 : 0);
      const newEndlessLosses = currentStats.endlessMode.gamesLost + (isWin ? 0 : 1);
      const newEndlessWinRate = Math.round((newEndlessWins / newEndlessGames) * 100);
      
      updatedEndlessMode = {
        gamesPlayed: newEndlessGames,
        gamesWon: newEndlessWins,
        gamesLost: newEndlessLosses,
        winRate: newEndlessWinRate,
        bestStreak: Math.max(currentStats.endlessMode.bestStreak, newWinStreak),
      };
    }
    
    return {
      ...currentStats,
      totalGamesPlayed: newTotalGames,
      totalGamesWon: newTotalWins,
      totalGamesLost: newTotalLosses,
      winPercentage: newWinPercentage,
      currentWinStreak: newWinStreak,
      bestWinStreak: newBestWinStreak,
      currentLossStreak: newLossStreak,
      classicMode: updatedClassicMode,
      endlessMode: updatedEndlessMode,
      updatedAt: new Date().toISOString(),
      lastPlayedAt: new Date().toISOString(),
    };
  };

  const checkAchievements = (oldStats: UserStats, newStats: UserStats) => {
    const newAchievements: string[] = [];
    
    if (!oldStats.achievements.firstBoundary && newStats.totalGamesWon === 1) {
      newAchievements.push('🏏 First Boundary - You won your first match!');
    }
    
    if (!oldStats.achievements.hatTrickHero && newStats.currentWinStreak === 3) {
      newAchievements.push('🎯 Hat-trick Hero - 3 wins in a row!');
    }
    
    if (!oldStats.achievements.fireBrand && newStats.currentWinStreak === 10) {
      newAchievements.push('🔥 Fire Brand - 10-win streak achieved!');
    }
    
    if (!oldStats.achievements.centuryMaker && newStats.totalGamesWon === 100) {
      newAchievements.push('💯 Century Maker - 100 total wins!');
    }
    
    if (!oldStats.achievements.lightningStrike && 
        newStats.classicMode.bestTime > 0 && 
        newStats.classicMode.bestTime <= 30) {
      newAchievements.push('⚡ Lightning Strike - Won Classic mode in under 30 seconds!');
    }
    
    newAchievements.forEach(achievement => {
      console.log('🏆 Achievement Unlocked:', achievement);
    });
  };

  const refreshStats = async () => {
    if (!user) return;
    
    try {
      if (user.isAnonymous) {
        await createFreshGuestStats();
      } else {
        await loadFirestoreStats();
      }
    } catch (error) {
      console.error('❌ Error refreshing stats:', error);
    }
  };

  return {
    stats,
    isLoading,
    isOnline,
    isUpdating,
    updateStats,
    refreshStats,
  };
}
