import { client } from './client';
import type { Subscription, ApiResponse } from '@types/index';

export const getActiveSubscription = (): Promise<Subscription | null> =>
  client.get<ApiResponse<Subscription | null>>('/subscriptions/active').then((r) => r.data);

export const subscribe = (data: { priceId: string; plan: string }) =>
  client.post<ApiResponse<unknown>>('/subscriptions', data).then((r) => r.data);

export const cancelSubscription = (): Promise<Subscription> =>
  client.post<ApiResponse<Subscription>>('/subscriptions/cancel').then((r) => r.data);
