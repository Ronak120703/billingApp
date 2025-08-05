import { useState, useEffect, useCallback } from 'react';
import { apiService, Invoice, InvoiceFormData, InvoiceStats } from '../services/api';

export const useInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<InvoiceStats | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllInvoices();
      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const data = await apiService.getInvoiceStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  const createInvoice = useCallback(async (invoiceData: InvoiceFormData): Promise<Invoice> => {
    try {
      setLoading(true);
      setError(null);
      const newInvoice = await apiService.createInvoice(invoiceData);
      setInvoices(prev => [newInvoice, ...prev]);
      await loadStats(); // Refresh stats after creating invoice
      return newInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create invoice';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  const updateInvoice = useCallback(async (id: string, invoiceData: Partial<InvoiceFormData>): Promise<Invoice> => {
    try {
      setLoading(true);
      setError(null);
      const updatedInvoice = await apiService.updateInvoice(id, invoiceData);
      setInvoices(prev => prev.map(invoice => 
        invoice._id === id ? updatedInvoice : invoice
      ));
      await loadStats(); // Refresh stats after updating invoice
      return updatedInvoice;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update invoice';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  const deleteInvoice = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await apiService.deleteInvoice(id);
      setInvoices(prev => prev.filter(invoice => invoice._id !== id));
      await loadStats(); // Refresh stats after deleting invoice
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete invoice';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadStats]);

  const searchInvoices = useCallback(async (customerName: string): Promise<Invoice[]> => {
    try {
      setLoading(true);
      setError(null);
      const results = await apiService.searchInvoicesByCustomer(customerName);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search invoices';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextInvoiceNumber = useCallback(async (): Promise<string> => {
    try {
      const result = await apiService.getNextInvoiceNumber();
      return result.nextInvoiceNumber;
    } catch (err) {
      console.error('Failed to get next invoice number:', err);
      return 'INV-001'; // Fallback
    }
  }, []);

  const getInvoiceById = useCallback(async (id: string): Promise<Invoice> => {
    try {
      return await apiService.getInvoiceById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get invoice';
      throw new Error(errorMessage);
    }
  }, []);

  const getInvoiceByNumber = useCallback(async (invoiceNumber: string): Promise<Invoice> => {
    try {
      return await apiService.getInvoiceByNumber(invoiceNumber);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get invoice';
      throw new Error(errorMessage);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadInvoices();
    loadStats();
  }, [loadInvoices, loadStats]);

  return {
    invoices,
    loading,
    error,
    stats,
    loadInvoices,
    loadStats,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    searchInvoices,
    getNextInvoiceNumber,
    getInvoiceById,
    getInvoiceByNumber,
  };
}; 