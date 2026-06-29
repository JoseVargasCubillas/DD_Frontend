import { client } from './client';
import type { ApiResponse, Offer } from '@t/index';

export type OfferInput = Partial<Omit<Offer, '_id' | 'id' | 'slug' | 'createdAt'>>;

export const listOffers = (): Promise<Offer[]> =>
  client.get<ApiResponse<Offer[]>>('/offers').then((r) => r.data);

export const createOffer = (input: OfferInput): Promise<Offer> =>
  client.post<ApiResponse<Offer>>('/offers', input).then((r) => r.data);

export const updateOffer = (id: string, input: OfferInput): Promise<Offer> =>
  client.put<ApiResponse<Offer>>(`/offers/${id}`, input).then((r) => r.data);

export const deleteOffer = (id: string): Promise<Offer> =>
  client.delete<ApiResponse<Offer>>(`/offers/${id}`).then((r) => r.data);

export const assignOffer = (offerId: string, userIds: string[]): Promise<Offer> =>
  client.post<ApiResponse<Offer>>(`/offers/${offerId}/assign`, { userIds }).then((r) => r.data);

export const revokeOffer = (offerId: string, userId: string): Promise<Offer> =>
  client.delete<ApiResponse<Offer>>(`/offers/${offerId}/users/${userId}`).then((r) => r.data);
