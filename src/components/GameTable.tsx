import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

import CardDeck from './CardDeck';
import { Player, GameState, StatName } from '../types';

type GameTableProps = {
  playerDeck: Player[];
  computerDeck: Player[];
  gameState: GameState;
  setGameState: (state: GameState) => void;
  selectedStat: StatName | null;
  roundWinner: 'player' | 'computer' | 'draw' | null;
};

const DEAL_DURATION = 150;

function GameTable({ playerDeck, computerDeck, gameState, setGameState, selectedStat, roundWinner }: GameTableProps) {
  const dealerCardPosition = useSharedValue({ y: 0, opacity: 0 });
  const [visiblePlayerDeck, setVisiblePlayerDeck] = useState<Player[]>([]);
  const [visibleComputerDeck, setVisibleComputerDeck] = useState<Player[]>([]);

  const dealerCardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: dealerCardPosition.value.opacity,
    transform: [{ translateY: dealerCardPosition.value.y }],
  }));

  useEffect(() => {
    if (gameState === 'dealing') {
      setVisiblePlayerDeck([]);
      setVisibleComputerDeck([]);
      runDealingAnimation();
    }
  }, [gameState, playerDeck]);

  const runDealingAnimation = async () => {
    dealerCardPosition.value = withTiming({ y: 0, opacity: 1 }, { duration: 200 });
    await new Promise(r => setTimeout(r, 200));
    for (let i = 0; i < 10; i++) {
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
      <View style={styles.computerDeck}>
        <CardDeck 
          deck={computerDeck} 
          gameState={gameState}
          isComputer={true}
          selectedStat={selectedStat}
          isBlurred={gameState === 'revealing' && (roundWinner === 'player' || roundWinner === 'draw')}
        />
      </View>
      
      <View style={styles.playerDeck}>
        <CardDeck 
          deck={playerDeck} 
          gameState={gameState}
          isComputer={false}
          selectedStat={selectedStat}
          isBlurred={gameState === 'revealing' && (roundWinner === 'computer' || roundWinner === 'draw')}
        />
      </View>

      {gameState === 'dealing' && <Animated.View style={[styles.dealerCard, dealerCardAnimatedStyle]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, position: 'relative' },
  computerDeck: { position: 'absolute', top: '5%', left: '5%' },
  playerDeck: { position: 'absolute', bottom: '5%', right: '5%' },
  dealerCard: {
    width: 170, height: 150,
    backgroundColor: '#1E1E1E',
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#D4AF37',
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    left: '50%',
    marginLeft: -85,
    marginTop: -75,
    zIndex: 100,
  }
});

export default GameTable;