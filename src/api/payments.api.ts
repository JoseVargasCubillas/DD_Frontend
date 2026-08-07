import { client } from './client';
import type { Order, OrderItem, ShippingAddress, ApiResponse } from '@t/index';

interface PaymentIntentResult {
  clientSecret: string;
  orderId: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
}

export const createPaymentIntent = (items: OrderItem[], shipping?: ShippingAddress) =>
  client
    .post<ApiResponse<PaymentIntentResult>>('/payments/intent', { items, shipping })
    .then((r) => r.data);

export const getOrders = (): Promise<Order[]> =>
  client.get<ApiResponse<Order[]>>('/payments/orders').then((r) => r.data);
