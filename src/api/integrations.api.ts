import { client } from './client';
import type { ApiResponse } from '@t/index';
import type { CalendarEventSummary } from '@utils/eventCalendar';

export interface IntegrationsStatus {
  catalog: {
    /** 'db' si se actualizó desde el panel; 'file' si usa el respaldo que viene con el servidor. */
    source: 'db' | 'file';
    count: number;
    syncedAt: string | null;
    syncedBy: string | null;
  };
  hubspot: {
    enabled: boolean;
    intervalSec: number;
    lastRunAt: string | null;
    cursor: string | null;
    pendingEvent: number;
    issued: number;
  };
}

export interface CatalogSyncResult {
  count: number;
  added: number;
  updated: number;
  removed: number;
  syncedAt: string;
}

export interface HubspotSyncResult {
  deals: number;
  issued: number;
  skipped: number;
  pendingEvent: number;
  emailsSent: number;
  retries: number;
  /** true si ya había otra sincronización en curso y esta se omitió. */
  lockedByOther?: boolean;
}

export const getIntegrationsStatus = (): Promise<IntegrationsStatus> =>
  client.get<ApiResponse<IntegrationsStatus>>('/integrations/status').then((r) => r.data);

// Manda el calendario fijo del sitio al backend para que el polling de HubSpot
// pueda resolver ediciones que no tienen fila en la tabla de eventos.
export const syncEventCatalog = (events: CalendarEventSummary[]): Promise<CatalogSyncResult> =>
  client
    .post<ApiResponse<CatalogSyncResult>>('/integrations/event-catalog', {
      events: events.map((e) => ({
        slug: e.slug,
        title: e.title,
        startDate: e.startDate,
        endDate: e.endDate,
        location: e.location,
        modality: e.modality,
      })),
    })
    .then((r) => r.data);

export const syncHubspotNow = (): Promise<HubspotSyncResult> =>
  client.post<ApiResponse<HubspotSyncResult>>('/integrations/hubspot/sync').then((r) => r.data);
