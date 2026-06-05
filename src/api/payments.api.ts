import { client } from './client';
import type { Order, OrderItem, ApiResponse } from '@t/index';

export const createPaymentIntent = (items: OrderItem[]) =>
  client.post<ApiResponse<{ clientSecret: string; orderId: string }>>('/payments/intent', { items }).then((r) => r.data);

export const getOrders = (): Promise<Order[]> =>
  client.get<ApiResponse<Order[]>>('/payments/orders').then((r) => r.data);
