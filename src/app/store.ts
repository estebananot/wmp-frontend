import { configureStore } from '@reduxjs/toolkit';
import productsReducer, { ProductsState } from '../features/products/productsSlice';
import checkoutReducer, { CheckoutState } from '../features/checkout/checkoutSlice';
import transactionReducer, { TransactionState } from '../features/transaction/transactionSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    checkout: checkoutReducer,
    transaction: transactionReducer,
  },
});

export type RootState = {
  products: ProductsState;
  checkout: CheckoutState;
  transaction: TransactionState;
};

export type AppDispatch = typeof store.dispatch;
