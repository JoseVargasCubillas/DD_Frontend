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

export interface AdminSubscriptionRow extends Subscription {
  userName?: string;
  userEmail?: string;
  packageName?: string | null;
  packageTier?: string | null;
  offerTitle?: string | null;
  price?: number | null;
  currency?: string | null;
  createdAt?: string;
}

export const listAllSubscriptions = (): Promise<AdminSubscriptionRow[]> =>
  client
    .get<ApiResponse<AdminSubscriptionRow[]>>('/subscriptions/admin/all')
    .then((r) => r.data)
    .catch(() => []);

export interface SubscriptionReceipt {
  id: string;
  plan: string;
  offerTitle: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  cardLabel: string;
  nextChargeAt: string | null;
  reference: string;
}

export const getSubscriptionReceipt = (id: string): Promise<SubscriptionReceipt> =>
  client.get<ApiResponse<SubscriptionReceipt>>(`/receipts/subscription/${id}`).then((r) => r.data);
