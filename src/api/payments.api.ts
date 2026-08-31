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

const checkoutRefs = (items: OrderItem[]) =>
  items.map((item) => ({
    type: item.type,
    refId: item.refId,
    title: item.title,
    price: item.price,
    quantity: item.quantity ?? 1,
  }));

export const createPaymentIntent = (
  items: OrderItem[],
  shipping?: ShippingAddress,
  customer?: { name: string; email: string; phone: string },
) =>
  client
    .post<ApiResponse<PaymentIntentResult>>('/payments/intent', { items: checkoutRefs(items), shipping, customer })
    .then((r) => r.data);

export const getOrders = (): Promise<Order[]> =>
  client.get<ApiResponse<Order[]>>('/payments/orders').then((r) => r.data);

export const listAllOrders = (): Promise<Order[]> =>
  client
    .get<ApiResponse<Order[]>>('/payments/admin/orders')
    .then((r) => r.data)
    .catch(() => []);
