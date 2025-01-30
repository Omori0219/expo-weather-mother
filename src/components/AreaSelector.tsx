import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { AREAS } from '../constants/areas';
import type { AreaData } from '../types/user';

interface AreaSelectorProps {
  onSelect: (area: AreaData) => void;
  selectedAreaCode?: string;
}

export function AreaSelector({ onSelect, selectedAreaCode }: AreaSelectorProps) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.grid}>
        {AREAS.map(area => (
          <TouchableOpacity
            key={area.areaCode}
            style={[styles.areaButton, selectedAreaCode === area.areaCode && styles.selectedButton]}
            onPress={() => onSelect(area)}
          >
            <Text
              style={[styles.areaText, selectedAreaCode === area.areaCode && styles.selectedText]}
            >
              {area.areaName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'center',
  },
  areaButton: {
    width: '30%',
    aspectRatio: 2,
    margin: '1.5%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  selectedButton: {
    backgroundColor: '#007AFF',
  },
  areaText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
});
