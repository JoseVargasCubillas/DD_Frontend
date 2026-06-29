import { client } from './client';
import type { Promotion, ApiResponse } from '@t/index';

export const listPromotions = (): Promise<Promotion[]> =>
  client.get<ApiResponse<Promotion[]>>('/promotions').then((r) => r.data);

export const createPromotion = (input: Partial<Promotion> & { code: string }): Promise<Promotion> =>
  client.post<ApiResponse<Promotion>>('/promotions', input).then((r) => r.data);

export const updatePromotion = (id: string, data: Partial<Promotion>): Promise<Promotion> =>
  client.put<ApiResponse<Promotion>>(`/promotions/${id}`, data).then((r) => r.data);

export const deletePromotion = (id: string): Promise<void> =>
  client.delete<void>(`/promotions/${id}`);
