import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useInvoices } from '@/hooks/useInvoices';
import { useThemeColor } from '@/hooks/useThemeColor';
import React, { useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function InvoicesScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const { 
    invoices, 
    loading, 
    deleteInvoice, 
    searchInvoices, 
    loadInvoices 
  } = useInvoices();

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchInvoices(query);
    } else {
      loadInvoices();
    }
  };

  const handleDeleteInvoice = (invoiceId: string, invoiceNumber: string) => {
    Alert.alert(
      'Delete Invoice',
      `Are you sure you want to delete invoice ${invoiceNumber}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteInvoice(invoiceId);
            } catch (error) {
              console.error('Error deleting invoice:', error);
            }
          }
        }
      ]
    );
  };

  const renderInvoiceItem = ({ item }: { item: any }) => (
    <View style={[styles.invoiceCard, { backgroundColor: 'rgba(10, 126, 164, 0.1)' }]}>
      <View style={styles.invoiceHeader}>
        <ThemedText style={[styles.invoiceNumber, { color: textColor }]}>
          {item.invoiceNumber}
        </ThemedText>
        <ThemedText style={[styles.invoiceDate, { color: textColor }]}>
          {item.date}
        </ThemedText>
      </View>
      
      <View style={styles.customerInfo}>
        <ThemedText style={[styles.customerName, { color: textColor }]}>
          {item.customerName}
        </ThemedText>
        {item.customerPhone && (
          <ThemedText style={[styles.customerPhone, { color: textColor }]}>
            {item.customerPhone}
          </ThemedText>
        )}
      </View>

      <View style={styles.invoiceDetails}>
        <View style={styles.detailRow}>
          <ThemedText style={[styles.detailLabel, { color: textColor }]}>
            Total Weight:
          </ThemedText>
          <ThemedText style={[styles.detailValue, { color: textColor }]}>
            {item.totalWeightKg} kg ({item.totalWeightMaund})
          </ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <ThemedText style={[styles.detailLabel, { color: textColor }]}>
            Price per Kg:
          </ThemedText>
          <ThemedText style={[styles.detailValue, { color: textColor }]}>
            ₹{item.pricePerKg}
          </ThemedText>
        </View>

        {item.bagQuantity && (
          <View style={styles.detailRow}>
            <ThemedText style={[styles.detailLabel, { color: textColor }]}>
              Bags:
            </ThemedText>
            <ThemedText style={[styles.detailValue, { color: textColor }]}>
              {item.bagQuantity} × ₹{item.bagAmount} = ₹{item.totalBagPrice}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.invoiceFooter}>
        <ThemedText style={[styles.totalAmount, { color: tintColor }]}>
          Total: ₹{item.totalAmount}
        </ThemedText>
        
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#EF4444' }]}
          onPress={() => handleDeleteInvoice(item._id, item.invoiceNumber)}
        >
          <IconSymbol size={16} name="trash" color="#fff" />
          <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol size={64} name="doc.text" color={textColor + '40'} />
      <ThemedText style={[styles.emptyStateTitle, { color: textColor }]}>
        No Invoices Found
      </ThemedText>
      <ThemedText style={[styles.emptyStateSubtitle, { color: textColor }]}>
        {searchQuery ? 'Try adjusting your search terms' : 'Create your first invoice to get started'}
      </ThemedText>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Invoices
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </ThemedText>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchInput, { borderColor: textColor }]}>
          <IconSymbol size={20} name="magnifyingglass" color={textColor} />
          <TextInput
            style={[styles.searchTextInput, { color: textColor }]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder="Search by customer name..."
            placeholderTextColor={textColor + '80'}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <IconSymbol size={20} name="xmark.circle.fill" color={textColor} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={invoices}
        renderItem={renderInvoiceItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadInvoices}
            tintColor={tintColor}
          />
        }
        ListEmptyComponent={EmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
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
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  invoiceCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  invoiceDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  customerInfo: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  invoiceDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  invoiceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
}); 