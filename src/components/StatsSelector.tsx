import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
// --- NEW: Import from our central types file ---
import { allStatKeys, StatName, statDisplayNames } from '../types';

type StatsSelectorProps = {
  onStatSelect: (statName: StatName) => void;
  player: any;
  disabled: boolean;
};

function StatsSelector({onStatSelect, player, disabled}: StatsSelectorProps) {
  const getStatValue = (stat: StatName) => {
    return player.battingStats?.ODI?.[stat] ?? player.bowlingStats?.ODI?.[stat] ?? '-';
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stats</Text>
      <View style={styles.grid}>
        {allStatKeys.map(stat => (
          <TouchableOpacity
            key={stat}
            style={styles.statChip}
            onPress={() => onStatSelect(stat)}
            disabled={disabled}>
            {/* Use the display name from our types file */}
            <Text style={styles.statLabel}>{statDisplayNames[stat]}</Text>
            <Text style={styles.statValue}>{getStatValue(stat)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Styles are the same as before
const styles = StyleSheet.create({
    container: { width: '90%', alignSelf: 'center', paddingVertical: 20 },
    heading: { fontFamily: 'Poppins-Bold', color: '#FFFFFF', fontSize: 20, marginBottom: 15, },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
    statChip: { width: '23%', backgroundColor: '#2A2A2A', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center', },
    statLabel: { fontFamily: 'Poppins-Regular', color: '#A0A0A0', fontSize: 12, marginBottom: 4, },
    statValue: { fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 16, },
});

export default StatsSelector;