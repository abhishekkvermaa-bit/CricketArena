import allPlayersData from './assets/data/playerData.json';

// The actual keys in the JSON data that we will use
export const battingStatKeys = ['Matches', 'Runs', 'Average', '100s', 'Highest'] as const;
export const bowlingStatKeys = ['Wickets', 'BBI', 'Eco'] as const;

// A combined list of all keys
export const allStatKeys = [...battingStatKeys, ...bowlingStatKeys] as const;

// TypeScript types derived from the keys
export type BattingStatName = (typeof battingStatKeys)[number];
export type BowlingStatName = (typeof bowlingStatKeys)[number];
export type StatName = (typeof allStatKeys)[number];

// A mapping to get user-friendly display names for the UI
export const statDisplayNames: Record<StatName, string> = {
    Matches: 'Matches',
    Runs: 'Runs',
    Average: 'Bat Avg',
    '100s': '100s',
    Highest: 'Highest',
    Wickets: 'Wickets',
    BBI: 'BBI',
    Eco: 'Economy',
};

// A helper function to check if a stat is a batting stat
export function isBattingStat(stat: StatName): stat is BattingStatName {
    return (battingStatKeys as readonly string[]).includes(stat);
}

// The type for a single player object from our JSON
export type Player = (typeof allPlayersData)[0];

// --- THIS IS THE FIX ---
// Add 'dealing' and 'collecting' back to the list of possible game states.
export type GameState = 'dealing' | 'selecting' | 'awaiting_player' | 'revealing' | 'collecting' | 'game_over';