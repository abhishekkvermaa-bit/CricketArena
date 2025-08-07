import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { allStatKeys, StatName, statDisplayNames } from '../types';

type StatsSelectorProps = {
  onStatSelect: (statName: StatName) => void;
  player: any;
  disabled: boolean;
  computerSelectedStat?: StatName | null;
};

function StatsSelector({onStatSelect, player, disabled, computerSelectedStat}: StatsSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Stats</Text>
      <View style={styles.grid}>
        {allStatKeys.map(stat => {
          const isHighlighted = stat === computerSelectedStat;
          const isDisabled = disabled || (computerSelectedStat !== null && !isHighlighted);
          return (
            <TouchableOpacity
              key={stat}
              style={[ styles.statChip, isHighlighted && styles.highlightedChip, isDisabled && styles.disabledChip ]}
              onPress={() => onStatSelect(stat)}
              disabled={isDisabled}>
              <Text style={styles.statLabel}>{statDisplayNames[stat]}</Text>
              <Text style={styles.statValue}>{player.battingStats?.ODI?.[stat] ?? player.bowlingStats?.ODI?.[stat] ?? '-'}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { width: '90%', alignSelf: 'center', paddingVertical: 20 },
    heading: { fontFamily: 'Poppins-Bold', color: '#FFFFFF', fontSize: 20, marginBottom: 15 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    statChip: { width: '23%', backgroundColor: '#2A2A2A', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
    highlightedChip: { borderColor: '#FFD700' },
    disabledChip: { opacity: 0.5 },
    statLabel: { fontFamily: 'Poppins-Regular', color: '#A0A0A0', fontSize: 12, marginBottom: 4 },
    statValue: { fontFamily: 'Poppins-SemiBold', color: '#FFFFFF', fontSize: 16 },
});

export default StatsSelector;