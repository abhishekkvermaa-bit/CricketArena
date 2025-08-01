import React from 'react';
 import {View, Text, Image, StyleSheet} from 'react-native';

 // Define the props (inputs) for this component
 type PlayerCardProps = {
  player?: any; // The player data object
  isComputer?: boolean; // Is this the computer's card?
 };

 const API_KEY = '20fc158ca7msha85acf70ccb89eap1eaa7djsn55dd8c9b9b2c';
 const API_HOST = 'cricbuzz-cricket.p.rapidapi.com';

 // A placeholder image for the generic computer player
 const computerImage = 'https://via.placeholder.com/400x200/2c3e50/ffffff?text=Computer';

 function PlayerCard({player, isComputer = false}: PlayerCardProps) {
  const title = isComputer ? 'Computer' : player?.name;
  const imageUrl = isComputer ? computerImage : player?.imageUrl;

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri: imageUrl,
          headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
          },
        }}
        style={styles.playerImage}
      />
      <View style={styles.infoContainer}>
        {isComputer && <Text style={styles.selectedText}>Selected</Text>}
        <Text style={styles.playerName}>{title}</Text>
      </View>
    </View>
  );
 }

 const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a', // Dark card background
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10, // Reduced margin
    width: '90%',
    height: 150, // Shorter height
    alignSelf: 'center',
  },
  playerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  infoContainer: {
    padding: 10, // Reduced padding
  },
  selectedText: {
    fontFamily: 'Poppins-Regular',
    color: '#999',
    fontSize: 10, // Smaller selected text
  },
  playerName: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 18, // Smaller player name
  },
 });

 export default PlayerCard;