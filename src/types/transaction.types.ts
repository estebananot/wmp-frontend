export type TransactionStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';

export interface Transaction {
  id: string;
  customerId: string;
  totalAmount: number;
  baseFee: number;
  deliveryFee: number;
  currency: string;
  status: TransactionStatus;
  paymentStatus: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionResponse {
  transactionId: string;
  status: string;
  reference: string;
}

export interface PaymentResponse {
  transactionId: string;
  status: TransactionStatus;
  paymentMethod: string;
  amount: number;
  createdAt: string;
}
