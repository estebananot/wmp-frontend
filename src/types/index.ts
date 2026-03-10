export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
}

export interface Transaction {
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
  product: {
    id: string;
    name: string;
    price: number;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  delivery: {
    id: string;
    address: string;
    city: string;
    department?: string;
    postalCode?: string;
    deliveryStatus: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CheckoutSummary {
  subtotal: number;
  baseFee: number;
  deliveryFee: number;
  total: number;
}

export interface CustomerFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export interface DeliveryInfo {
  address: string;
  city: string;
  department?: string;
  postalCode?: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardType: 'visa' | 'mastercard' | null;
}

// Default customer for development
export const DEFAULT_CUSTOMER: Customer = {
  id: 'dc697192-c2cd-48a8-bfdd-7d1bfd729abb',
  name: 'Usuario de Prueba',
  email: 'test@example.com',
  phone: '+573001234567',
  createdAt: new Date().toISOString(),
};
