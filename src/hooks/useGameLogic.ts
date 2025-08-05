import {useState, useEffect} from 'react';
import allPlayersData from '../assets/data/playerData.json';
import { Player, StatName, isBattingStat, allStatKeys } from '../types';

export type GameState = 'dealing' | 'selecting' | 'revealing' | 'game_over';

// This is our new custom hook
export function useGameLogic() {
  const [playerDeck, setPlayerDeck] = useState<Player[]>([]);
  const [computerDeck, setComputerDeck] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('dealing');
  const [selectedStat, setSelectedStat] = useState<StatName | null>(null);
  const [roundWinner, setRoundWinner] = useState<'player' | 'computer' | 'draw' | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'computer'>('player');

  useEffect(() => {
    setupGame();
  }, []);

  useEffect(() => {
    if (currentTurn === 'computer' && gameState === 'selecting' && computerDeck.length > 0) {
      const timer = setTimeout(() => {
        handleComputerTurn();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameState, computerDeck]);

  const setupGame = () => {
    const shuffleArray = (array: Player[]) => array.sort(() => Math.random() - 0.5);
    const shuffledPlayers = shuffleArray([...allPlayersData]);
    const gameDeck = shuffledPlayers.slice(0, 20);
    setPlayerDeck(gameDeck.slice(0, 10));
    setComputerDeck(gameDeck.slice(10, 20));
    setGameState('dealing');
    setRoundWinner(null);
    setSelectedStat(null);
    setCurrentTurn('player');
  };

  const handleComputerTurn = () => {
    const computerCard = computerDeck[0];
    let bestStat: StatName = 'Runs';
    let bestScore = -1;
    allStatKeys.forEach(stat => {
      const statValue = getStatValue(computerCard, stat);
      if (stat === 'Eco') {
        if (statValue < (bestScore === -1 ? 1000 : bestScore) && statValue !== Infinity) {
          bestScore = statValue;
          bestStat = stat;
        }
      } else {
        if (statValue > bestScore) {
          bestScore = statValue;
          bestStat = stat;
        }
      }
    });
    handleStatSelect(bestStat);
  };

  const handleStatSelect = (statName: StatName) => {
    if (gameState !== 'selecting') return;
    const playerStatValue = getStatValue(playerDeck[0], statName);
    const computerStatValue = getStatValue(computerDeck[0], statName);
    let winner: 'player' | 'computer' | 'draw' = 'draw';
    if (statName === 'Eco') {
      if (playerStatValue < computerStatValue) winner = 'player';
      if (computerStatValue < playerStatValue) winner = 'computer';
    } else {
      if (playerStatValue > computerStatValue) winner = 'player';
      if (computerStatValue > playerStatValue) winner = 'computer';
    }
    setRoundWinner(winner);
    setSelectedStat(statName);
    setGameState('revealing');
  };

  const handleNextRound = () => {
    const playerCard = playerDeck[0];
    const computerCard = computerDeck[0];
    const newPlayerDeck = playerDeck.slice(1);
    const newComputerDeck = computerDeck.slice(1);

    if (roundWinner === 'player') {
      newPlayerDeck.push(playerCard, computerCard);
      setCurrentTurn('player');
    } else if (roundWinner === 'computer') {
      newComputerDeck.push(computerCard, playerCard);
      setCurrentTurn('computer');
    } else {
      newPlayerDeck.push(playerCard);
      newComputerDeck.push(computerCard);
    }
    
    setPlayerDeck(newPlayerDeck);
    setComputerDeck(newComputerDeck);
    
    if (newPlayerDeck.length === 0 || newComputerDeck.length === 0) {
      setGameState('game_over');
    } else {
      setGameState('selecting');
      setRoundWinner(null);
      setSelectedStat(null);
    }
  };

  const getStatValue = (player: Player, statName: StatName): number => {
    let value: string | undefined;
    if (isBattingStat(statName)) {
      value = player.battingStats?.ODI?.[statName];
    } else {
      value = player.bowlingStats?.ODI?.[statName];
    }
    if (value === undefined || value === null || value === 'N/A' || value === '-') {
        return statName === 'Eco' ? Infinity : 0;
    }
    if (statName === 'BBI' && typeof value === 'string' && value.includes('/')) {
        return parseFloat(value.split('/')[0]) || 0;
    }
    const parsedValue = parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;
    if (statName === 'Eco' && parsedValue === 0) {
      return Infinity;
    }
    return parsedValue;
  };
  
  // The hook returns all the state and functions that our UI will need
  return {
    playerDeck,
    computerDeck,
    gameState,
    setGameState, // <-- ADD THIS LINE
    selectedStat,
    roundWinner,
    currentTurn,
    setupGame,
    handleStatSelect,
    handleNextRound,
    getStatValue,
  };
}