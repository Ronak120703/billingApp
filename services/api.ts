const API_BASE_URL = 'http://localhost:3001/api';

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

// MongoDB Invoice structure
export interface Invoice {
  _id: string;
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
    return this.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id: string, invoiceData: Partial<InvoiceFormData>): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
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