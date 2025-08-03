import { BillingChart } from '@/components/BillingChart';
import { DashboardCard } from '@/components/DashboardCard';
import { PeriodSelector } from '@/components/PeriodSelector';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getBillingData } from '@/services/billingData';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Period = 'today' | 'weekly' | 'yearly';

export default function DashboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('today');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const billingData = getBillingData(selectedPeriod);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Billing Dashboard
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          Track your billing performance
        </ThemedText>
      </View>

      <PeriodSelector
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />

      <View style={styles.cardsContainer}>
        <DashboardCard
          title="Total Revenue"
          value={`$${billingData.revenue.toLocaleString()}`}
          subtitle={`${selectedPeriod} earnings`}
          trend={{ value: 12.5, isPositive: true }}
        />

        <DashboardCard
          title="Invoices Generated"
          value={billingData.invoices.toString()}
          subtitle={`${selectedPeriod} invoices`}
          trend={{ value: 8.2, isPositive: true }}
        />

        <DashboardCard
          title="Pending Amount"
          value={`$${billingData.pendingAmount.toLocaleString()}`}
          subtitle="Awaiting payment"
          trend={{ value: 3.1, isPositive: false }}
        />

        <DashboardCard
          title="Paid Amount"
          value={`$${billingData.paidAmount.toLocaleString()}`}
          subtitle="Successfully collected"
          trend={{ value: 15.7, isPositive: true }}
        />
      </View>

      <BillingChart
        data={billingData.chartData}
        title={`Revenue Trend - ${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)}`}
      />

      <View style={styles.summaryContainer}>
        <ThemedText style={[styles.summaryTitle, { color: textColor }]}>
          Summary
        </ThemedText>
        <ThemedText style={[styles.summaryText, { color: textColor }]}>
          Your billing performance for {selectedPeriod} shows strong growth with a 
          {selectedPeriod === 'today' ? ' 12.5%' : selectedPeriod === 'weekly' ? ' 8.2%' : ' 15.7%'} 
          increase in revenue compared to the previous period. 
          {selectedPeriod === 'today' ? ' Today\'s' : selectedPeriod === 'weekly' ? ' This week\'s' : ' This year\'s'} 
          total of ${billingData.revenue.toLocaleString()} represents excellent progress toward your billing goals.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  cardsContainer: {
    marginBottom: 16,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
});
