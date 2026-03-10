export const BASE_FEE = 2000;
export const DELIVERY_FEE = 5000;
export const CURRENCY = 'COP';

export const ROUTES = {
  HOME: '/',
  CHECKOUT: '/checkout',
  TRANSACTION_STATUS: (id: string) => `/transaction/${id}/status`,
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'APPROVED',
  FAILED: 'DECLINED',
} as const;

export const STORAGE_KEYS = {
  CART: 'wompi_cart',
  CUSTOMER: 'wompi_customer',
  TRANSACTION: 'wompi_transaction',
} as const;

export const CARD_BRANDS = {
  VISA: 'Visa',
  MASTERCARD: 'Mastercard',
  AMEX: 'Amex',
  DISCOVER: 'Discover',
  UNKNOWN: 'Unknown',
} as const;
