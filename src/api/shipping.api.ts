import { client } from './client';
import type { ShippingAddress, OrderItem, ApiResponse } from '@t/index';

export interface ShippingRateOption {
  carrier: string;
  carrierDescription: string;
  service: string;
  serviceDescription: string;
  deliveryEstimate: string;
  deliveryDays: number;
  totalPrice: number;
  currency: string;
}

export const quoteShipping = (items: OrderItem[], shipping: ShippingAddress): Promise<ShippingRateOption[]> =>
  client
    .post<ApiResponse<ShippingRateOption[]>>('/payments/shipping-quote', { items, shipping })
    .then((r) => r.data)
    .catch(() => []);
