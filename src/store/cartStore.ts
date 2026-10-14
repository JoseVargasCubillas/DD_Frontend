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
    {
      name: 'dd-cart',
      version: 1,
      // v1: los boletos de evento guardan la edición (eventId/eventSlug) para
      // validar códigos de descuento. Los guardados antes no la traen: se quitan
      // una sola vez y la persona vuelve a elegir su boleto desde la landing.
      migrate: (persisted, version) => {
        const state = persisted as { items?: CartItem[] } | undefined;
        if (version < 1 && state?.items) {
          state.items = state.items.filter(
            (item) => item.type !== 'event' || item.eventId || item.eventSlug,
          );
        }
        return state as CartState;
      },
    }
  )
);
