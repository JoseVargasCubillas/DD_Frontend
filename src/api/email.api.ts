import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface BroadcastPayload {
  subject: string;
  html: string;
  segment: string;
}

export interface BroadcastResult {
  sent: number;
  failed: number;
  total: number;
}

export interface SegmentCounts {
  all: number;
  subscribed: number;
  customers: number;
  leads: number;
}

export const sendBroadcast = (payload: BroadcastPayload): Promise<BroadcastResult> =>
  client.post<ApiResponse<BroadcastResult>>('/email/broadcast', payload).then((r) => r.data);

export interface ContactPreview {
  name: string;
  email: string;
}

export const getSegments = (): Promise<SegmentCounts> =>
  client.get<ApiResponse<SegmentCounts>>('/email/segments').then((r) => r.data);

export const getSegmentContacts = (segment: string): Promise<ContactPreview[]> =>
  client.get<ApiResponse<ContactPreview[]>>('/email/contacts?segment=' + segment).then((r) => r.data);
