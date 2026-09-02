import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface WaClickStats {
  total: number;
  last30d: number;
  last7d: number;
  today: number;
  uniqueVisitors: number;
  bySource: Array<{ source: string; total: number; last30d: number }>;
  byDay: Array<{ day: string; count: number }>;
  recent: Array<{
    id: string;
    source: string;
    page?: string;
    message?: string;
    anonId?: string;
    referrer?: string;
    createdAt: string;
  }>;
}

export interface WaClick {
  id: string;
  _id?: string;
  source: string;
  page?: string;
  message?: string;
  anonId?: string;
  referrer?: string;
  userAgent?: string;
  ip?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export const getWaClickStats = (): Promise<WaClickStats> =>
  client.get<ApiResponse<WaClickStats>>('/analytics/wa-click/stats').then((r) => r.data);

export const listWaClicks = (source?: string): Promise<WaClick[]> =>
  client
    .get<ApiResponse<WaClick[]>>('/analytics/wa-click', source ? { source } : undefined)
    .then((r) => r.data);
