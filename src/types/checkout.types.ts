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
  email: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
}
