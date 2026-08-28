import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface LeadCaptureResult {
  email: string;
  source: string;
  emailedAt: string | null;
}

export interface Lead {
  id: string;
  _id?: string;
  email: string;
  source: string;
  name?: string;
  phone?: string;
  meta?: Record<string, unknown>;
  emailedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const requestSatGuide = (email: string, name?: string): Promise<LeadCaptureResult> =>
  client
    .post<ApiResponse<LeadCaptureResult>>('/leads/sat-guide', { email, name })
    .then((r) => r.data);

export const requestMediaKit = (email: string, name?: string): Promise<LeadCaptureResult> =>
  client
    .post<ApiResponse<LeadCaptureResult>>('/leads/media-kit', { email, name })
    .then((r) => r.data);

export const listLeads = (source?: string): Promise<Lead[]> =>
  client.get<ApiResponse<Lead[]>>('/leads', source ? { source } : undefined).then((r) => r.data);

