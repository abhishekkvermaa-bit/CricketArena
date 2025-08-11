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
    firstBoundary: boolean;     // First win
    hatTrickHero: boolean;      // 3-win streak  
    centuryMaker: boolean;      // 100 total wins
    lightningStrike: boolean;   // Win Classic in under 30s
    fireBrand: boolean;         // 10-win streak
    captainCool: boolean;       // 75% win rate in last 20 games
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
  duration: number;             // Game duration in seconds
  endReason: 'time_up' | 'all_cards';
  timestamp: string;
  
  // Game-specific data
  playerCards: number;          // Cards won by player
  computerCards: number;        // Cards won by computer
}

export interface StatsUpdate {
  gameMode: 'classic' | 'endless';
  result: 'win' | 'loss';
  duration: number;
  endReason: 'time_up' | 'all_cards';
}
