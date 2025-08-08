import React from 'react';
import {View, StyleSheet} from 'react-native';
import PlayerCard from './PlayerCard';
import { StatName, GameState, Player } from '../types';

type CardDeckProps = {
  deck: Player[];
  gameState: GameState;
  isComputer: boolean;
  selectedStat?: StatName | null;
  isBlurred?: boolean;
  direction: 'left' | 'right';
};

function CardDeck({deck, gameState, isComputer, selectedStat, isBlurred = false, direction}: CardDeckProps) {
  const cardsToShow = Math.min(deck.length, 10);
  const stack = Array.from({length: cardsToShow});
  
  let mode: 'image-only' | 'stats-visible' | 'face-down';

  if (gameState === 'revealing' || gameState === 'game_over') {
    mode = 'stats-visible';
  } else if (gameState === 'awaiting_player' && isComputer) {
    mode = 'stats-visible';
  } else {
    mode = isComputer ? 'face-down' : 'image-only';
  }

  return (
    <View style={styles.deckContainer}>
      {stack.map((_, index) => {
        const isTopCard = index === cardsToShow - 1;
        const offset = direction === 'left' ? -12 : 12; // ← Increased offset for bigger cards
        const cardStyle = {
          position: 'absolute' as 'absolute',
          transform: [{translateX: index * offset}],
          zIndex: index,
        };
        
        if (isTopCard && deck[0]) {
          return (
            <View key={deck[0].id} style={cardStyle}>
              <PlayerCard 
                player={deck[0]} 
                mode={mode}
                selectedStat={selectedStat}
                isComputer={isComputer}
                isBlurred={isBlurred}
              />
            </View>
          );
        }
        return (
          <View key={index} style={[styles.cardBack, cardStyle]} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  deckContainer: { 
    width: 200 + (12 * 10), // ← Increased width for bigger cards
    height: 280, // ← Increased height for bigger cards
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  cardBack: { 
    width: 180, // ← Increased from 150 to 180
    height: 240, // ← Increased from 200 to 240
    backgroundColor: '#1E1E1E', 
    borderRadius: 18, // ← Slightly larger border radius
    borderWidth: 4, // ← Increased border width
    borderColor: '#D4AF37' 
  },
});

export default CardDeck;
