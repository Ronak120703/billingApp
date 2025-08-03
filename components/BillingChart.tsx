import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface BillingChartProps {
  data: { label: string; value: number; color?: string }[];
  title: string;
}

export function BillingChart({ data, title }: BillingChartProps) {
  const textColor = useThemeColor({}, 'text');
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
      
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || '#0a7ea4',
                  },
                ]}
              />
            </View>
            <ThemedText style={[styles.barLabel, { color: textColor }]}>
              {item.label}
            </ThemedText>
            <ThemedText style={[styles.barValue, { color: textColor }]}>
              ${item.value.toLocaleString()}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    gap: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    height: 80,
    width: 20,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 