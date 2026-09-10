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
 * Dispara la descarga directa del recurso. Usa `fetch` + Blob para
 * garantizar la descarga incluso después de un `await` (donde `a.click()`
 * sobre una URL remota puede ser bloqueado por el popup blocker o
 * ignorado por perder el gesto del usuario).
 *
 * Fallback: si el fetch falla (CORS, red), abre la URL en una pestaña
 * nueva como último recurso.
 */
export const triggerLeadDownload = async (
  downloadUrl: string,
  filename?: string,
): Promise<void> => {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch(downloadUrl, { credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename ?? 'documento.pdf';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Libera el object URL despues del click.
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  } catch (err) {
    console.warn('[triggerLeadDownload] blob fetch failed, abriendo en pestaña nueva:', err);
    try {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } catch {
      /* noop */
    }
  }
};

export const listLeads = (source?: string): Promise<Lead[]> =>
  client.get<ApiResponse<Lead[]>>('/leads', source ? { source } : undefined).then((r) => r.data);

