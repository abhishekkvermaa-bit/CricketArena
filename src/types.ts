import allPlayersData from './assets/data/playerData.json';

// The actual keys in the JSON data
export const battingStatKeys = ['Matches', 'Runs', 'Average', '100s', 'Highest'] as const;
export const bowlingStatKeys = ['Wickets', 'BBI', 'Eco'] as const;

export const allStatKeys = [...battingStatKeys, ...bowlingStatKeys] as const;

export type BattingStatName = (typeof battingStatKeys)[number];
export type BowlingStatName = (typeof bowlingStatKeys)[number];
export type StatName = (typeof allStatKeys)[number];

// A mapping to get user-friendly display names
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

export function isBattingStat(stat: StatName): stat is BattingStatName {
    return (battingStatKeys as readonly string[]).includes(stat);
}

export type Player = (typeof allPlayersData)[0];

// --- ADD THIS TYPE ---
export type GameState = 'dealing' | 'selecting' | 'revealing' | 'game_over';