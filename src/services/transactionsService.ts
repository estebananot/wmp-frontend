import api from './api';
import { DEFAULT_CUSTOMER } from '../types';

export interface TransactionData {
  customerId?: string;
  productId: string;
  quantity: number;
  deliveryInfo: {
    address: string;
    city: string;
    department?: string;
    postalCode?: string;
  };
}

export interface PaymentData {
  cardToken: string;
  customerEmail: string;
  acceptanceToken: string;
}

export interface TransactionResponse {
  id: string;
  transactionNumber: string;
  customerId: string;
  productId: string;
  quantity: number;
  productAmount: number;
  baseFee: number;
  deliveryFee: number;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  wompiTransactionId?: string;
  wompiReference?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export const transactionsService = {
  async create(data: TransactionData): Promise<TransactionResponse> {
    const customerId = data.customerId || DEFAULT_CUSTOMER.id;
    
    const payload = {
      customerId,
      productId: data.productId,
      quantity: data.quantity,
      deliveryInfo: data.deliveryInfo,
    };

    const response = await api.post<{ data: TransactionResponse }>('/transactions', payload);
    return response.data.data;
  },

  async processPayment(transactionId: string, data: PaymentData): Promise<TransactionResponse> {
    const response = await api.post<{ data: TransactionResponse }>(
      `/transactions/${transactionId}/payment`,
      data
    );
    return response.data.data;
  },

  async getTransaction(id: string): Promise<TransactionResponse> {
    const response = await api.get<{ data: TransactionResponse }>(`/transactions/${id}`);
    return response.data.data;
  },

  async getAll(): Promise<TransactionResponse[]> {
    const response = await api.get<{ data: TransactionResponse[] }>('/transactions');
    return response.data.data;
  },
};
