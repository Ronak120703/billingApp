import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function DashboardCard({ title, value, subtitle, trend, icon }: DashboardCardProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const cardBackground = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView style={[styles.card, { backgroundColor: cardBackground }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>{title}</ThemedText>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
      
      <ThemedText style={[styles.value, { color: textColor }]}>{value}</ThemedText>
      
      {subtitle && (
        <ThemedText style={[styles.subtitle, { color: textColor }]}>{subtitle}</ThemedText>
      )}
      
      {trend && (
        <View style={styles.trendContainer}>
          <ThemedText 
            style={[
              styles.trendText, 
              { color: trend.isPositive ? '#22C55E' : '#EF4444' }
            ]}
          >
            {trend.isPositive ? '+' : ''}{trend.value}%
          </ThemedText>
          <ThemedText style={[styles.trendLabel, { color: textColor }]}>
            vs last period
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
  },
  trendLabel: {
    fontSize: 12,
    opacity: 0.6,
  },
}); 