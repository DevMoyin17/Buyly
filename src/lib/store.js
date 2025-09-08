import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCurrencySlice } from './slices/currencySlice';
import { createCartSlice } from './slices/cartSlice';
import { createProductSlice } from './slices/productSlice';
import { createOrderSlice } from './slices/orderSlice';

export const useStore = create(
  persist(
    (set, get) => ({
      ...createCurrencySlice(set, get),
      ...createCartSlice(set, get),
      ...createProductSlice(set, get),
      ...createOrderSlice(set, get),
    }),
    {
      name: 'shopping-cart',
    }
  )
);

// Initialize exchange rates when the store is created
if (typeof window !== 'undefined') {
  useStore.getState().fetchExchangeRates();
}
