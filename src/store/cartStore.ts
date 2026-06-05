import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { OrderItem } from '@t/index';

interface CartItem extends OrderItem {
  id: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => s.items.find((i) => i.id === item.id) ? s : { items: [...s.items, item] }),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * (i.quantity ?? 1), 0),
    }),
    { name: 'dd-cart' }
  )
);
