import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { transactionsService } from '../../services/transactionsService';
import { wompiService } from '../../services/wompiService';
import { customersService } from '../../services/customersService';
import { CartItem, CustomerFormData, DeliveryInfo, PaymentInfo } from '../../types';
import type { TransactionResponse } from '../../services/transactionsService';

interface CheckoutState {
  step: 'customer' | 'delivery' | 'payment' | 'summary' | 'processing' | 'complete';
  cart: CartItem[];
  customerInfo: CustomerFormData | null;
  deliveryInfo: DeliveryInfo | null;
  paymentInfo: PaymentInfo | null;
  customerId: string | null;
  transactionId: string | null;
  currentProduct: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  } | null;
  validationErrors: Record<string, string>;
  loading: boolean;
  error: string | null;
  transactionResult: TransactionResponse | null;
}

const initialState: CheckoutState = {
  step: 'customer',
  cart: [],
  customerInfo: null,
  deliveryInfo: null,
  paymentInfo: null,
  customerId: null,
  transactionId: null,
  currentProduct: null,
  validationErrors: {},
  loading: false,
  error: null,
  transactionResult: null,
};

export const processCheckout = createAsyncThunk(
  'checkout/processCheckout',
  async (params: {
    productId: string;
    customerInfo: CustomerFormData;
    deliveryInfo: DeliveryInfo;
    paymentInfo: PaymentInfo;
    quantity: number;
    productName: string;
    productPrice: number;
    productImageUrl: string;
  }, { rejectWithValue }) => {
    try {
      // 1. Crear o recuperar cliente
      const customer = await customersService.createCustomer({
        name: params.customerInfo.fullName,
        email: params.customerInfo.email,
        phone: params.customerInfo.phoneNumber,
      });
      const customerId = customer.id;

      // 2. Tokenizar tarjeta con Wompi
      const cardToken = await wompiService.tokenizeCard({
        number: params.paymentInfo.cardNumber,
        cvc: params.paymentInfo.cvv,
        exp_month: params.paymentInfo.expiryMonth,
        exp_year: params.paymentInfo.expiryYear,
        card_holder: params.paymentInfo.cardHolder,
      });

      const acceptanceToken = await wompiService.getAcceptanceToken();

      const transaction = await transactionsService.create({
        customerId: customerId,
        productId: params.productId,
        quantity: params.quantity,
        deliveryInfo: params.deliveryInfo,
      });

      const paymentResult = await transactionsService.processPayment(transaction.id, {
        cardToken: cardToken,
        customerEmail: params.customerInfo.email,
        acceptanceToken: acceptanceToken,
      });

      return paymentResult;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Checkout failed'
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<CheckoutState['step']>) => {
      state.step = action.payload;
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.cart = action.payload;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.cart.find(item => item.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.productId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.cart.find(item => item.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cart = [];
    },
    setCustomerInfo: (state, action: PayloadAction<CustomerFormData>) => {
      state.customerInfo = action.payload;
      localStorage.setItem('checkout_customer', JSON.stringify(action.payload));
    },
    setDeliveryInfo: (state, action: PayloadAction<DeliveryInfo>) => {
      state.deliveryInfo = action.payload;
      localStorage.setItem('checkout_delivery', JSON.stringify(action.payload));
    },
    setPaymentInfo: (state, action: PayloadAction<PaymentInfo>) => {
      state.paymentInfo = action.payload;
    },
    setCurrentProduct: (state, action: PayloadAction<{ id: string; name: string; price: number; imageUrl: string }>) => {
      state.currentProduct = action.payload;
    },
    setCustomerId: (state, action: PayloadAction<string | null>) => {
      state.customerId = action.payload;
    },
    setTransactionId: (state, action: PayloadAction<string | null>) => {
      state.transactionId = action.payload;
    },
    setValidationError: (state, action: PayloadAction<{ field: string; error: string }>) => {
      state.validationErrors[action.payload.field] = action.payload.error;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    restoreFromStorage: (state) => {
      const savedCustomer = localStorage.getItem('checkout_customer');
      const savedDelivery = localStorage.getItem('checkout_delivery');
      
      if (savedCustomer) {
        state.customerInfo = JSON.parse(savedCustomer);
      }
      if (savedDelivery) {
        state.deliveryInfo = JSON.parse(savedDelivery);
      }
    },
    clearCheckout: (state) => {
      state.customerInfo = null;
      state.deliveryInfo = null;
      state.paymentInfo = null;
      state.customerId = null;
      state.transactionId = null;
      state.step = 'customer';
      state.validationErrors = {};
      state.error = null;
      state.transactionResult = null;
      localStorage.removeItem('checkout_customer');
      localStorage.removeItem('checkout_delivery');
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(processCheckout.pending, (state) => {
        state.step = 'processing';
        state.loading = true;
        state.error = null;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.step = 'complete';
        state.loading = false;
        state.transactionResult = action.payload;
        state.transactionId = action.payload.id;
        state.cart = [];
        state.paymentInfo = null;
        localStorage.removeItem('checkout_customer');
        localStorage.removeItem('checkout_delivery');
      })
      .addCase(processCheckout.rejected, (state, action) => {
        state.step = 'payment';
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setStep,
  setCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCustomerInfo,
  setDeliveryInfo,
  setPaymentInfo,
  setCurrentProduct,
  setCustomerId,
  setTransactionId,
  setValidationError,
  clearValidationErrors,
  setError,
  restoreFromStorage,
  clearCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
export type { CheckoutState };
