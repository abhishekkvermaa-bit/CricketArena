export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  createdAt: string;
}

export interface UserStats {
  uid: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winStreak: number;
  bestWinStreak: number;
  totalPlayTime: number; // in minutes
  classicModeWins: number;
  endlessModeWins: number;
  createdAt: string;
  lastPlayedAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
