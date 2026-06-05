import { useCartStore } from '@store/cartStore';
import type { OrderItem } from '@t/index';

export const useCart = () => {
  const { items, addItem, removeItem, clear, total } = useCartStore();

  const addToCart = (item: OrderItem & { id: string }) => addItem(item);

  return { items, addToCart, removeItem, clear, total: total(), count: items.length };
};
