import React from 'react';
import {View, StyleSheet} from 'react-native';
import PlayerCard from './PlayerCard';
import { StatName, GameState } from '../types';

type CardDeckProps = {
  deck: any[];
  gameState: GameState;
  isComputer: boolean;
  selectedStat?: StatName | null;
  isBlurred?: boolean;
};

function CardDeck({deck, gameState, isComputer, selectedStat, isBlurred = false}: CardDeckProps) {
  const cardsToShow = Math.min(deck.length, 5);
  const stack = Array.from({length: cardsToShow});
  
  const isFaceDown = isComputer && gameState === 'selecting';

  return (
    <View style={styles.deckContainer}>
      {stack.map((_, index) => {
        const isTopCard = index === cardsToShow - 1;
        
        const cardStyle = {
          position: 'absolute' as 'absolute',
          transform: [{translateY: index * 4}, {translateX: index * 2}],
          zIndex: index,
        };
        
        if (isTopCard && deck[0]) {
          return (
            <View key={deck[0].id} style={cardStyle}>
              <PlayerCard 
                player={deck[0]} 
                mode={isFaceDown ? 'face-down' : (gameState === 'revealing' ? 'stats-visible' : 'image-only')}
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
  deckContainer: { width: 220, height: 320 },
  cardBack: { width: 200, height: 300, backgroundColor: 'transparent', borderRadius: 20, borderWidth: 5, borderColor: '#D4AF37', alignSelf: 'center' },
});

export default CardDeck;