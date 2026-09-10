import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface LeadCaptureResult {
  email: string;
  source: string;
  emailedAt: string | null;
  /**
   * Estado del correo. Cuando es `pending`, el backend guardó el lead pero
   * el envío falló (típicamente por límite diario de SMTP). El frontend debe
   * disparar la descarga directa usando `downloadUrl` para no dejar al
   * usuario sin el recurso.
   */
  emailStatus?: 'delivered' | 'pending';
  downloadUrl?: string;
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

/**
 * Dispara la descarga directa del recurso — se usa como fallback cuando el
 * correo del lead quedó en estado `pending`. Abre el PDF en una pestaña
 * nueva para que el navegador lo descargue o lo muestre inline.
 */
export const triggerLeadDownload = (downloadUrl: string, filename?: string): void => {
  if (typeof window === 'undefined') return;
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  if (filename) a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const listLeads = (source?: string): Promise<Lead[]> =>
  client.get<ApiResponse<Lead[]>>('/leads', source ? { source } : undefined).then((r) => r.data);

