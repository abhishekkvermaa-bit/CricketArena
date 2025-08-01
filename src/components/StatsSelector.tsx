import React from 'react';
 import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

 const allStatKeys = ['Runs', 'Average', 'Strike Rate', '100s', 'Matches', 'Wickets', 'BBI', 'Economy'] as const;
 type StatName = (typeof allStatKeys)[number];

 type StatsSelectorProps = {
  onStatSelect: (statName: StatName) => void;
  player: any;
  disabled: boolean;
 };

 function StatsSelector({onStatSelect, player, disabled}: StatsSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stats</Text>
      <View style={styles.grid}>
        {allStatKeys.map(stat => (
          <TouchableOpacity
            key={stat}
            style={styles.statBox}
            onPress={() => onStatSelect(stat)}
            disabled={disabled}>
            <Text style={styles.statLabel}>{stat}</Text>
            <Text style={styles.statValue}>
              {player.battingStats?.ODI?.[stat] ?? player.bowlingStats?.ODI?.[stat] ?? '-' }
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
 }

 const styles = StyleSheet.create({
  container: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  heading: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 20,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    // --- CHANGED: Adjust width for 4 columns ---
    width: '25%', // Allows 4 items per row with a small gap
    paddingVertical: 8,
    marginBottom: 12,
    alignItems: 'center', // Center the text
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    color: '#999',
    fontSize: 15, // Slightly smaller for a tighter fit
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
    fontSize: 16, // Slightly smaller for a tighter fit
  },
});

 export default StatsSelector;