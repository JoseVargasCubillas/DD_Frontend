import { client } from './client';
import type { Subscription, ApiResponse } from '@t/index';

export interface CheckoutItemRef {
  type: string;
  refId: string;
  quantity?: number;
}

export interface CheckoutCustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export interface SubscriptionCheckoutResult {
  subscription?: Subscription;
  clientSecret: string;
}

export const getActiveSubscription = (): Promise<Subscription | null> =>
  client.get<ApiResponse<Subscription | null>>('/subscriptions/active').then((r) => r.data);

export const subscribe = (data: {
  priceId?: string;
  plan?: string;
  item?: { type?: string; refId?: string; quantity?: number };
  customer?: Partial<CheckoutCustomerInfo>;
}): Promise<SubscriptionCheckoutResult> =>
  client.post<ApiResponse<SubscriptionCheckoutResult>>('/subscriptions', data).then((r) => r.data);

export const cancelSubscription = (): Promise<Subscription> =>
  client.post<ApiResponse<Subscription>>('/subscriptions/cancel').then((r) => r.data);
