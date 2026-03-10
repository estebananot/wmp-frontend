import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TransactionHistoryItem {
  id: string;
  transactionNumber: string;
  totalAmount: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  createdAt: string;
}

interface TransactionState {
  transactionId: string | null;
  status: 'pending' | 'processing' | 'completed' | 'failed' | null;
  paymentStatus: unknown;
  error: string | null;
  loading: boolean;
  transactionResult: unknown;
  history: TransactionHistoryItem[];
  historyLoading: boolean;
  historyError: string | null;
}

const initialState: TransactionState = {
  transactionId: null,
  status: null,
  paymentStatus: null,
  error: null,
  loading: false,
  transactionResult: null,
  history: [],
  historyLoading: false,
  historyError: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionId: (state, action: PayloadAction<string | null>) => {
      state.transactionId = action.payload;
    },
    setStatus: (state, action: PayloadAction<TransactionState['status']>) => {
      state.status = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<unknown>) => {
      state.paymentStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setTransactionResult: (state, action: PayloadAction<unknown>) => {
      state.transactionResult = action.payload;
    },
    resetTransaction: (state) => {
      state.transactionId = null;
      state.status = null;
      state.paymentStatus = null;
      state.error = null;
      state.loading = false;
      state.transactionResult = null;
    },
    setHistory: (state, action: PayloadAction<TransactionHistoryItem[]>) => {
      state.history = action.payload;
    },
    setHistoryLoading: (state, action: PayloadAction<boolean>) => {
      state.historyLoading = action.payload;
    },
    setHistoryError: (state, action: PayloadAction<string | null>) => {
      state.historyError = action.payload;
    },
  },
});

export const {
  setTransactionId,
  setStatus,
  setPaymentStatus,
  setError,
  setLoading,
  setTransactionResult,
  resetTransaction,
  setHistory,
  setHistoryLoading,
  setHistoryError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
export type { TransactionState, TransactionHistoryItem };
