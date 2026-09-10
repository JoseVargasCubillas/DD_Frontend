import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface WhatsappBroadcastPayload {
  message: string;
  segment: string;
}

export interface WhatsappBroadcastResult {
  sent: number;
  failed: number;
  skipped: number;
  total: number;
}

export interface WhatsappSegmentCounts {
  all: number;
  subscribed: number;
  customers: number;
  leads: number;
  guideLeads?: number;
  guiaSat?: number;
  newsletterLeads?: number;
  configured: boolean;
}

export interface WhatsappContactPreview {
  name: string;
  phone: string;
  email?: string;
}

export const sendBroadcast = (payload: WhatsappBroadcastPayload): Promise<WhatsappBroadcastResult> =>
  client.post<ApiResponse<WhatsappBroadcastResult>>('/whatsapp/broadcast', payload).then((r) => r.data);

export const getSegments = (): Promise<WhatsappSegmentCounts> =>
  client.get<ApiResponse<WhatsappSegmentCounts>>('/whatsapp/segments').then((r) => r.data);

export const getSegmentContacts = (segment: string): Promise<WhatsappContactPreview[]> =>
  client
    .get<ApiResponse<WhatsappContactPreview[]>>('/whatsapp/contacts?segment=' + encodeURIComponent(segment))
    .then((r) => r.data);
