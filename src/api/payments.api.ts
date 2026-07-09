import { client } from './client';
import type { Order, OrderItem, ApiResponse } from '@t/index';

const checkoutRefs = (items: OrderItem[]) =>
  items.map((item) => ({
    type: item.type,
    refId: item.refId,
    quantity: item.quantity ?? 1,
  }));

export const createPaymentIntent = (items: OrderItem[]) =>
  client.post<ApiResponse<{ clientSecret: string; orderId: string }>>(
    '/payments/intent',
    { items: checkoutRefs(items) },
  ).then((r) => r.data);

export const getOrders = (): Promise<Order[]> =>
  client.get<ApiResponse<Order[]>>('/payments/orders').then((r) => r.data);
