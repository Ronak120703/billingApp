export interface BillingData {
  revenue: number;
  invoices: number;
  pendingAmount: number;
  paidAmount: number;
  chartData: { label: string; value: number; color?: string }[];
}

export const getBillingData = (period: 'today' | 'weekly' | 'yearly'): BillingData => {
  switch (period) {
    case 'today':
      return {
        revenue: 2847,
        invoices: 12,
        pendingAmount: 1250,
        paidAmount: 1597,
        chartData: [
          { label: '9AM', value: 450, color: '#0a7ea4' },
          { label: '12PM', value: 720, color: '#0a7ea4' },
          { label: '3PM', value: 890, color: '#0a7ea4' },
          { label: '6PM', value: 787, color: '#0a7ea4' },
        ],
      };

    case 'weekly':
      return {
        revenue: 18450,
        invoices: 67,
        pendingAmount: 8750,
        paidAmount: 9700,
        chartData: [
          { label: 'Mon', value: 2450, color: '#22C55E' },
          { label: 'Tue', value: 3120, color: '#22C55E' },
          { label: 'Wed', value: 2890, color: '#22C55E' },
          { label: 'Thu', value: 3560, color: '#22C55E' },
          { label: 'Fri', value: 2980, color: '#22C55E' },
          { label: 'Sat', value: 1450, color: '#22C55E' },
        ],
      };

    case 'yearly':
      return {
        revenue: 245000,
        invoices: 1247,
        pendingAmount: 45000,
        paidAmount: 200000,
        chartData: [
          { label: 'Jan', value: 18500, color: '#F59E0B' },
          { label: 'Feb', value: 19200, color: '#F59E0B' },
          { label: 'Mar', value: 21000, color: '#F59E0B' },
          { label: 'Apr', value: 19800, color: '#F59E0B' },
          { label: 'May', value: 22500, color: '#F59E0B' },
          { label: 'Jun', value: 23800, color: '#F59E0B' },
          { label: 'Jul', value: 24500, color: '#F59E0B' },
          { label: 'Aug', value: 23200, color: '#F59E0B' },
          { label: 'Sep', value: 21800, color: '#F59E0B' },
          { label: 'Oct', value: 20100, color: '#F59E0B' },
          { label: 'Nov', value: 18900, color: '#F59E0B' },
          { label: 'Dec', value: 21500, color: '#F59E0B' },
        ],
      };

    default:
      return {
        revenue: 0,
        invoices: 0,
        pendingAmount: 0,
        paidAmount: 0,
        chartData: [],
      };
  }
}; 