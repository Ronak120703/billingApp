const API_BASE_URL = 'http://localhost:3000/api';

// Frontend form data structure (what's actually being sent)
export interface InvoiceFormData {
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
  date: string;
  wheatWeightKg: string;
  wheatWeightMaund: string;
  cutPieces: string;
  number2: string;
  number5: string;
  totalWeightKg: string;
  totalWeightMaund: string;
  bagQuantity: string;
  pricePerKg: string;
  bagAmount: string;
  totalBagPrice: string;
  totalAmount: string;
}

// Backend-compatible invoice structure
export interface BackendInvoiceData {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  date: Date;
  dueDate: Date;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  status?: string;
}

export interface Invoice extends BackendInvoiceData {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  currentMonthInvoices: number;
  currentMonthAmount: number;
  averageAmount: number;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Invoice operations
  async getAllInvoices(): Promise<Invoice[]> {
    return this.request<Invoice[]>('/invoices');
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`);
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/number/${invoiceNumber}`);
  }

  async createInvoice(invoiceData: InvoiceFormData): Promise<Invoice> {
    // Transform frontend data to backend format
    const backendData: BackendInvoiceData = {
      invoiceNumber: invoiceData.invoiceNumber,
      customerName: invoiceData.customerName,
      customerEmail: '', // Not provided in frontend
      customerPhone: invoiceData.customerPhone,
      customerAddress: '', // Not provided in frontend
      date: new Date(invoiceData.date),
      dueDate: new Date(invoiceData.date), // Same as invoice date
      items: [
        {
          description: 'Wheat Weight',
          quantity: parseFloat(invoiceData.wheatWeightKg) || 0,
          rate: parseFloat(invoiceData.pricePerKg) || 0,
          amount: (parseFloat(invoiceData.wheatWeightKg) || 0) * (parseFloat(invoiceData.pricePerKg) || 0)
        },
        {
          description: 'Cut Pieces',
          quantity: parseFloat(invoiceData.cutPieces) || 0,
          rate: parseFloat(invoiceData.pricePerKg) || 0,
          amount: (parseFloat(invoiceData.cutPieces) || 0) * (parseFloat(invoiceData.pricePerKg) || 0)
        },
        {
          description: '2+5 Number Total',
          quantity: (parseFloat(invoiceData.number2) || 0) + (parseFloat(invoiceData.number5) || 0),
          rate: parseFloat(invoiceData.pricePerKg) || 0,
          amount: ((parseFloat(invoiceData.number2) || 0) + (parseFloat(invoiceData.number5) || 0)) * (parseFloat(invoiceData.pricePerKg) || 0)
        },
        {
          description: 'Bag Amount',
          quantity: parseFloat(invoiceData.bagQuantity) || 0,
          rate: parseFloat(invoiceData.bagAmount) || 0,
          amount: parseFloat(invoiceData.totalBagPrice) || 0
        }
      ],
      subtotal: parseFloat(invoiceData.totalAmount) || 0,
      tax: 0, // No tax in this system
      total: parseFloat(invoiceData.totalAmount) || 0,
      notes: `Wheat Weight: ${invoiceData.wheatWeightKg}kg (${invoiceData.wheatWeightMaund}), Cut Pieces: ${invoiceData.cutPieces}kg, 2+5 Number: ${invoiceData.number2}+${invoiceData.number5}kg, Total Weight: ${invoiceData.totalWeightKg}kg (${invoiceData.totalWeightMaund}), Bag Quantity: ${invoiceData.bagQuantity}, Bag Amount: ₹${invoiceData.bagAmount}`,
      status: 'pending'
    };

    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
  }

  async updateInvoice(id: string, invoiceData: Partial<InvoiceFormData>): Promise<Invoice> {
    // Transform frontend data to backend format
    const backendData: Partial<BackendInvoiceData> = {
      invoiceNumber: invoiceData.invoiceNumber,
      customerName: invoiceData.customerName,
      customerEmail: '', // Not provided in frontend
      customerPhone: invoiceData.customerPhone,
      customerAddress: '', // Not provided in frontend
      date: invoiceData.date ? new Date(invoiceData.date) : undefined,
      dueDate: invoiceData.date ? new Date(invoiceData.date) : undefined,
      items: invoiceData.totalAmount ? [
        {
          description: 'Wheat Weight',
          quantity: parseFloat(invoiceData.wheatWeightKg || '0') || 0,
          rate: parseFloat(invoiceData.pricePerKg || '0') || 0,
          amount: (parseFloat(invoiceData.wheatWeightKg || '0') || 0) * (parseFloat(invoiceData.pricePerKg || '0') || 0)
        },
        {
          description: 'Cut Pieces',
          quantity: parseFloat(invoiceData.cutPieces || '0') || 0,
          rate: parseFloat(invoiceData.pricePerKg || '0') || 0,
          amount: (parseFloat(invoiceData.cutPieces || '0') || 0) * (parseFloat(invoiceData.pricePerKg || '0') || 0)
        },
        {
          description: '2+5 Number Total',
          quantity: (parseFloat(invoiceData.number2 || '0') || 0) + (parseFloat(invoiceData.number5 || '0') || 0),
          rate: parseFloat(invoiceData.pricePerKg || '0') || 0,
          amount: ((parseFloat(invoiceData.number2 || '0') || 0) + (parseFloat(invoiceData.number5 || '0') || 0)) * (parseFloat(invoiceData.pricePerKg || '0') || 0)
        },
        {
          description: 'Bag Amount',
          quantity: parseFloat(invoiceData.bagQuantity || '0') || 0,
          rate: parseFloat(invoiceData.bagAmount || '0') || 0,
          amount: parseFloat(invoiceData.totalBagPrice || '0') || 0
        }
      ] : undefined,
      subtotal: parseFloat(invoiceData.totalAmount || '0') || 0,
      tax: 0, // No tax in this system
      total: parseFloat(invoiceData.totalAmount || '0') || 0,
      notes: invoiceData.totalAmount ? `Wheat Weight: ${invoiceData.wheatWeightKg}kg (${invoiceData.wheatWeightMaund}), Cut Pieces: ${invoiceData.cutPieces}kg, 2+5 Number: ${invoiceData.number2}+${invoiceData.number5}kg, Total Weight: ${invoiceData.totalWeightKg}kg (${invoiceData.totalWeightMaund}), Bag Quantity: ${invoiceData.bagQuantity}, Bag Amount: ₹${invoiceData.bagAmount}` : undefined,
      status: 'pending'
    };

    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
  }

  async deleteInvoice(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  async getNextInvoiceNumber(): Promise<{ nextInvoiceNumber: string }> {
    return this.request<{ nextInvoiceNumber: string }>('/invoices/next-number');
  }

  async getInvoiceStats(): Promise<InvoiceStats> {
    return this.request<InvoiceStats>('/invoices/stats');
  }

  async searchInvoicesByCustomer(customerName: string): Promise<Invoice[]> {
    return this.request<Invoice[]>(`/invoices/search/${encodeURIComponent(customerName)}`);
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 