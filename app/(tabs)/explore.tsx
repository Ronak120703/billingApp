import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  date: string;
  dueDate: string;
}

const mockInvoices: Invoice[] = [
  {
    id: 'INV-001',
    clientName: 'Tech Solutions Inc.',
    amount: 2500,
    status: 'paid',
    date: '2024-01-15',
    dueDate: '2024-01-30',
  },
  {
    id: 'INV-002',
    clientName: 'Digital Marketing Pro',
    amount: 1800,
    status: 'pending',
    date: '2024-01-18',
    dueDate: '2024-02-02',
  },
  {
    id: 'INV-003',
    clientName: 'Web Design Studio',
    amount: 3200,
    status: 'overdue',
    date: '2024-01-10',
    dueDate: '2024-01-25',
  },
  {
    id: 'INV-004',
    clientName: 'Mobile App Dev',
    amount: 4500,
    status: 'paid',
    date: '2024-01-20',
    dueDate: '2024-02-05',
  },
  {
    id: 'INV-005',
    clientName: 'Cloud Services Ltd.',
    amount: 1200,
    status: 'pending',
    date: '2024-01-22',
    dueDate: '2024-02-07',
  },
];

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return '#22C55E';
      case 'pending':
        return '#F59E0B';
      case 'overdue':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  return (
    <TouchableOpacity>
      <ThemedView style={[styles.invoiceCard, { backgroundColor }]}>
        <View style={styles.invoiceHeader}>
          <ThemedText style={[styles.invoiceId, { color: textColor }]}>
            {invoice.id}
          </ThemedText>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(invoice.status) }]}>
            <ThemedText style={styles.statusText}>
              {getStatusText(invoice.status)}
            </ThemedText>
          </View>
        </View>
        
        <ThemedText style={[styles.clientName, { color: textColor }]}>
          {invoice.clientName}
        </ThemedText>
        
        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: textColor }]}>
              Amount:
            </ThemedText>
            <ThemedText style={[styles.amount, { color: textColor }]}>
              ${invoice.amount.toLocaleString()}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: textColor }]}>
              Date:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: textColor }]}>
              {new Date(invoice.date).toLocaleDateString()}
            </ThemedText>
          </View>
          
          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: textColor }]}>
              Due Date:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: textColor }]}>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}

export default function InvoicesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Invoices
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          Manage your billing invoices
        </ThemedText>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: textColor }]}>
            {mockInvoices.length}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: textColor }]}>
            Total Invoices
          </ThemedText>
        </View>
        
        <View style={styles.statCard}>
          <ThemedText style={[styles.statValue, { color: textColor }]}>
            ${mockInvoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: textColor }]}>
            Total Amount
          </ThemedText>
        </View>
      </View>

      <View style={styles.invoicesContainer}>
        <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
          Recent Invoices
        </ThemedText>
        
        {mockInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} />
        ))}
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  invoicesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  invoiceCard: {
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  invoiceId: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  invoiceDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
