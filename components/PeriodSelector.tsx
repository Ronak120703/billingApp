import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './ThemedText';

type Period = 'today' | 'weekly' | 'yearly';

interface PeriodSelectorProps {
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
}

export function PeriodSelector({ selectedPeriod, onPeriodChange }: PeriodSelectorProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const periods: { key: Period; label: string }[] = [
    { key: 'today', label: 'Today' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'yearly', label: 'Yearly' },
  ];

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.key}
          style={[
            styles.periodButton,
            selectedPeriod === period.key && { backgroundColor: tintColor },
          ]}
          onPress={() => onPeriodChange(period.key)}
        >
          <ThemedText
            style={[
              styles.periodText,
              {
                color: selectedPeriod === period.key ? '#fff' : textColor,
              },
            ]}
          >
            {period.label}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 