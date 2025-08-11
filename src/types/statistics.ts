export interface UserStats {
  uid: string;
  
  // Core Statistics
  totalGamesPlayed: number;
  totalGamesWon: number;
  totalGamesLost: number;
  winPercentage: number;
  
  // Streak Tracking
  currentWinStreak: number;
  bestWinStreak: number;
  currentLossStreak: number;
  
  // Mode-Specific Data
  classicMode: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    winRate: number;
    bestTime: number;           // This property exists only in classicMode
  };
  
  endlessMode: {
    gamesPlayed: number;
    gamesWon: number; 
    gamesLost: number;
    winRate: number;
    bestStreak: number;         // This property exists only in endlessMode
  };
  
  // Cricket-Themed Achievements
  achievements: {
    firstBoundary: boolean;
    hatTrickHero: boolean;
    centuryMaker: boolean;
    lightningStrike: boolean;
    fireBrand: boolean;
    captainCool: boolean;
  };
  
  // Session Info
  createdAt: string;
  updatedAt: string;
  lastPlayedAt: string;
}

export interface GameSession {
  sessionId: string;
  uid: string;
  gameMode: 'classic' | 'endless';
  result: 'win' | 'loss';
  duration: number;
  endReason: 'time_up' | 'all_cards';
  timestamp: string;
  playerCards: number;
  computerCards: number;
}

export interface StatsUpdate {
  gameMode: 'classic' | 'endless';
  result: 'win' | 'loss';
  duration: number;
  endReason: 'time_up' | 'all_cards';
}
