import {useState, useEffect, useCallback} from 'react';
import allPlayersData from '../assets/data/playerData.json';
import { Player, StatName, isBattingStat, allStatKeys, GameState } from '../types';

export function useClassicGameLogic() {
  const [playerDeck, setPlayerDeck] = useState<Player[]>([]);
  const [computerDeck, setComputerDeck] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<GameState>('dealing');
  const [selectedStat, setSelectedStat] = useState<StatName | null>(null);
  const [roundWinner, setRoundWinner] = useState<'player' | 'computer' | 'draw' | null>(null);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'computer'>('player');
  const [roundNumber, setRoundNumber] = useState(0);
  const [computerSelectedStat, setComputerSelectedStat] = useState<StatName | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);

  useEffect(() => { setupGame(); }, []);

  // Timer logic - only runs when game is active
  useEffect(() => {
    if (gameState === 'selecting' || gameState === 'awaiting_player') {
      if (timeLeft <= 0) {
        console.log('⏰ Game over - Time up!');
        setGameState('game_over');
        return;
      }
      const interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, gameState]);

  // 🔧 FIX: Check for instant win condition after each round
  useEffect(() => {
    if (gameState === 'selecting' || gameState === 'awaiting_player' || gameState === 'revealing') {
      // Check if someone has all cards (instant win)
      if (playerDeck.length === 0 || computerDeck.length === 0) {
        console.log('🃏 Game over - All cards taken!');
        setGameState('game_over');
        return;
      }
      
      // Check if someone has 20 cards (all cards)
      if (playerDeck.length === 20 || computerDeck.length === 20) {
        console.log('🃏 Game over - One player has all cards!');
        setGameState('game_over');
        return;
      }
    }
  }, [playerDeck.length, computerDeck.length, gameState]);

  useEffect(() => {
    if (currentTurn === 'computer' && gameState === 'selecting' && computerDeck.length > 0) {
      const timer = setTimeout(() => { handleComputerTurn(); }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameState, computerDeck]);
  
  useEffect(() => {
    if (gameState === 'revealing') {
      const timer = setTimeout(() => { setGameState('collecting'); }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState, roundWinner]);

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
    setRoundNumber(0);
    setComputerSelectedStat(null);
    setTimeLeft(120);
  };

  const handleComputerTurn = () => {
    if (!computerDeck.length) return;
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
    setComputerSelectedStat(bestStat);
    setGameState('awaiting_player');
  };
  
  const handleStatSelect = (statName: StatName) => {
    if ((gameState === 'selecting' && currentTurn === 'player') || (gameState === 'awaiting_player' && statName === computerSelectedStat)) {
      if (!playerDeck.length || !computerDeck.length) return;
      const playerStatValue = getStatValue(playerDeck[0], statName);
      const computerStatValue = getStatValue(computerDeck[0], statName);
      determineWinner(statName, playerStatValue, computerStatValue);
    }
  };

  const determineWinner = (statName: StatName, playerStatValue: number, computerStatValue: number) => {
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

  const finalizeRound = useCallback(() => {
    if (!roundWinner || !playerDeck[0] || !computerDeck[0]) return;
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
    
    // 🔧 FIX: Check for instant win immediately after updating decks
    if (newPlayerDeck.length === 0 || newComputerDeck.length === 20) {
      console.log('🃏 Player lost all cards - Game Over!');
      setPlayerDeck(newPlayerDeck);
      setComputerDeck(newComputerDeck);
      setGameState('game_over');
      return;
    }
    
    if (newComputerDeck.length === 0 || newPlayerDeck.length === 20) {
      console.log('🃏 Player won all cards - Game Over!');
      setPlayerDeck(newPlayerDeck);
      setComputerDeck(newComputerDeck);
      setGameState('game_over');
      return;
    }

    // Continue game if no instant win
    setPlayerDeck(newPlayerDeck);
    setComputerDeck(newComputerDeck);
    setRoundNumber(prev => prev + 1);
    setGameState('selecting');
    setRoundWinner(null);
    setSelectedStat(null);
    setComputerSelectedStat(null);
  }, [roundWinner, playerDeck, computerDeck]);

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
  
  return {
    playerDeck, 
    computerDeck, 
    gameState, 
    setGameState, 
    selectedStat, 
    roundWinner, 
    currentTurn,
    setupGame, 
    handleStatSelect, 
    getStatValue,
    roundNumber, 
    computerSelectedStat, 
    timeLeft,
    cardsInPlay: { player: playerDeck[0], computer: computerDeck[0] },
    finalizeRound,
  };
}
