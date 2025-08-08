import React, {useEffect, useState} from 'react';
import {StyleSheet, View, useWindowDimensions} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import CardDeck from './CardDeck';
import PlayerCard from './PlayerCard';
import { Player, GameState, StatName } from '../types';
import { useSounds } from '../hooks/useSounds';

type GameTableProps = {
  playerDeck: Player[];
  computerDeck: Player[];
  cardsInPlay: {player: Player | null, computer: Player | null};
  gameState: GameState;
  setGameState: (state: GameState) => void;
  selectedStat: StatName | null;
  roundWinner: 'player' | 'computer' | 'draw' | null;
  finalizeRound: () => void;
};

const DEAL_DURATION = 120;

function GameTable({ playerDeck, computerDeck, cardsInPlay, gameState, setGameState, selectedStat, roundWinner, finalizeRound }: GameTableProps) {
  const { playCardDeal } = useSounds();
  const { width, height } = useWindowDimensions();
  const playerCardPos = useSharedValue({ x: 0, y: 0, opacity: 0, scale: 1 });
  const computerCardPos = useSharedValue({ x: 0, y: 0, opacity: 0, scale: 1 });
  const dealerCardPosition = useSharedValue({ y: 0, opacity: 0 });
  
  const [visiblePlayerDeck, setVisiblePlayerDeck] = useState<Player[]>([]);
  const [visibleComputerDeck, setVisibleComputerDeck] = useState<Player[]>([]);

  const playerCardStyle = useAnimatedStyle(() => ({
    opacity: playerCardPos.value.opacity,
    transform: [{ translateX: playerCardPos.value.x }, { translateY: playerCardPos.value.y }, { scale: playerCardPos.value.scale }]
  }));
  
  const computerCardStyle = useAnimatedStyle(() => ({
    opacity: computerCardPos.value.opacity,
    transform: [{ translateX: computerCardPos.value.x }, { translateY: computerCardPos.value.y }, { scale: computerCardPos.value.scale }]
  }));
  
  const dealerCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dealerCardPosition.value.opacity,
    transform: [{ translateY: dealerCardPosition.value.y }],
  }));

  useEffect(() => {
    if (gameState === 'dealing' && playerDeck.length > 0) {
      setVisiblePlayerDeck([]);
      setVisibleComputerDeck([]);
      runDealingAnimation();
    }
  }, [gameState, playerDeck]);

  useEffect(() => {
    if (gameState === 'collecting' && roundWinner && cardsInPlay.player && cardsInPlay.computer) {
      const playerWon = roundWinner === 'player';
      
      const computerStartPosition = { x: -width * 0.2, y: -height * 0.25 };
      const playerStartPosition = { x: width * 0.2, y: height * 0.25 };
      const targetPosition = playerWon ? playerStartPosition : computerStartPosition;
      
      computerCardPos.value = { ...computerStartPosition, opacity: 1, scale: 1 };
      playerCardPos.value = { ...playerStartPosition, opacity: 1, scale: 1 };
      
      const onAnimationComplete = () => {
        'worklet';
        runOnJS(finalizeRound)();
      };
      
      const animationConfig = { duration: 300 };
      computerCardPos.value = withTiming({ ...targetPosition, opacity: 0, scale: 0.5 }, animationConfig);
      playerCardPos.value = withTiming({ ...targetPosition, opacity: 0, scale: 0.5 }, animationConfig, (isFinished) => {
        if(isFinished) onAnimationComplete();
      });
    }
  }, [gameState, roundWinner, cardsInPlay, finalizeRound, width, height, computerCardPos, playerCardPos]);

  const runDealingAnimation = async (): Promise<void> => {
    dealerCardPosition.value = withTiming({ y: 0, opacity: 1 }, { duration: 200 });
    await new Promise(r => setTimeout(r, 300));
    
    for (let i = 0; i < 10; i++) {
      playCardDeal();
      
      dealerCardPosition.value = withTiming({ y: -100, opacity: 0 }, { duration: DEAL_DURATION });
      await new Promise(r => setTimeout(r, DEAL_DURATION));
      setVisibleComputerDeck(prev => [...prev, computerDeck[i]]);
      dealerCardPosition.value = { y: 0, opacity: 1 };
      
      dealerCardPosition.value = withTiming({ y: 100, opacity: 0 }, { duration: DEAL_DURATION });
      await new Promise(r => setTimeout(r, DEAL_DURATION));
      setVisiblePlayerDeck(prev => [...prev, playerDeck[i]]);
      dealerCardPosition.value = { y: 0, opacity: 1 };
    }
    
    dealerCardPosition.value = withTiming({ y: 0, opacity: 0 });
    setGameState('selecting');
  };

  return (
    <View style={styles.container}>
      {/* Card Decks */}
      <View style={{opacity: gameState === 'collecting' ? 0 : 1}}>
        <View style={styles.topDeckContainer}>
          <CardDeck 
            deck={gameState === 'dealing' ? visibleComputerDeck : computerDeck} 
            gameState={gameState} 
            isComputer={true} 
            direction="right" 
          />
        </View>
        <View style={styles.bottomDeckContainer}>
          <CardDeck 
            deck={gameState === 'dealing' ? visiblePlayerDeck : playerDeck} 
            gameState={gameState} 
            isComputer={false} 
            direction="left" 
          />
        </View>
      </View>
      
      {/* Dealer Card */}
      {gameState === 'dealing' && <Animated.View style={[styles.dealerCard, dealerCardAnimatedStyle]} />}

      {/* Computer Playing Card - Centered in middle area */}
      <Animated.View style={[styles.computerPlayingCard, computerCardStyle]}>
        {cardsInPlay.computer && (
          <PlayerCard 
            player={cardsInPlay.computer} 
            mode="stats-visible" 
            selectedStat={selectedStat} 
            isComputer={true} 
          />
        )}
      </Animated.View>

      {/* Player Playing Card - Positioned below computer card in center */}
      <Animated.View style={[styles.playerPlayingCard, playerCardStyle]}>
        {cardsInPlay.player && (
          <PlayerCard 
            player={cardsInPlay.player} 
            mode="stats-visible" 
            selectedStat={selectedStat} 
            isComputer={false} 
          />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    position: 'relative',
  },
  topDeckContainer: { 
    position: 'absolute',
    top: 0,
    right: 150,
    zIndex: 1,
  },
  bottomDeckContainer: { 
    position: 'absolute',
    top: 300, // ← Changed from 10 to 180 to move it above stats
    left: 150,
    zIndex: 1,
  },
  // Keep all other styles the same - don't change card positions yet
  computerPlayingCard: { 
    position: 'absolute', 
    alignSelf: 'center', 
    zIndex: 100, 
    top: '35%',
    left: '50%', 
    marginLeft: -75,
    marginTop: -100,
  },
  playerPlayingCard: { 
    position: 'absolute', 
    alignSelf: 'center', 
    zIndex: 100, 
    top: '55%',
    left: '50%', 
    marginLeft: -75,
    marginTop: -100,
  },
  dealerCard: {
    width: 140,
    height: 120,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#D4AF37',
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    left: '50%',
    marginLeft: -70,
    marginTop: -60,
    zIndex: 100,
  },
});


export default GameTable;
