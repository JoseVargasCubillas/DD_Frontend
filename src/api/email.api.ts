import { client } from './client';
import type { ApiResponse } from '@t/index';

export interface BroadcastPayload {
  subject: string;
  html: string;
  segment: string;
  segmentLabel?: string;
  // Valida todo con Mailchimp sin enviar nada.
  dryRun?: boolean;
  // Solo con segment === 'custom': contactos pegados o importados de un archivo (con nombre opcional).
  recipients?: Array<{ email: string; name?: string }>;
  // Solo con segment === 'custom': correos sueltos (formato anterior).
  emails?: string[];
  // 'web': contactos de tu base de datos. 'mailchimp': una audiencia que ya vive en Mailchimp.
  source?: 'web' | 'mailchimp';
  // Solo con source === 'mailchimp'. Sin `audienceSegmentId` es TODA la audiencia.
  audienceId?: string;
  audienceSegmentId?: number | null;
  // Frase "ENVIAR A TODOS" que el servidor exige en los envíos masivos.
  confirmation?: string;
}

export type CampaignStatus = 'sending' | 'sent' | 'failed';

export interface AudienceInfo {
  id: string;
  name: string;
  memberCount: number;
  isWebAudience: boolean;
}

export interface AudienceSegmentInfo {
  id: number;
  name: string;
  // 'static' = etiqueta; 'saved' = segmento por condiciones.
  type: string;
  memberCount: number;
}

export interface AudienceMember {
  email: string;
  name: string;
  status: string;
}

export interface AudienceMembersPage {
  members: AudienceMember[];
  total: number;
  page: number;
  pages: number;
}

export const getAudienceMembers = (
  audienceId: string,
  params: { segmentId?: number | null; page?: number; limit?: number; q?: string },
): Promise<AudienceMembersPage> =>
  client
    .get<ApiResponse<AudienceMembersPage>>(`/email/audiences/${audienceId}/members`, params as Record<string, unknown>)
    .then((r) => r.data);

export const getAudiences = (): Promise<AudienceInfo[]> =>
  client.get<ApiResponse<AudienceInfo[]>>('/email/audiences').then((r) => r.data);

export const getAudienceSegments = (audienceId: string): Promise<AudienceSegmentInfo[]> =>
  client.get<ApiResponse<AudienceSegmentInfo[]>>(`/email/audiences/${audienceId}/segments`).then((r) => r.data);

export interface ChecklistItem {
  type: string;
  heading: string;
  details: string;
}

export interface BroadcastResult {
  sent: number;
  failed: number;
  total: number;
  campaignId?: string;
  // Un envío real responde 'sending': corre en segundo plano y se sigue en el historial.
  status?: CampaignStatus;
  dryRun?: boolean;
  ready?: boolean;
  // Correos descartados por estar dados de baja.
  excluded?: number;
  recipientCount?: number;
  checklist?: ChecklistItem[];
}

export interface TestPayload {
  subject: string;
  html: string;
  to?: string[];
}

export const sendTest = (payload: TestPayload): Promise<{ sentTo: string[] }> =>
  client.post<ApiResponse<{ sentTo: string[] }>>('/email/test', payload).then((r) => r.data);

export interface CampaignReport {
  emailsSent: number;
  opens: number;
  openRate: number;
  clicks: number;
  clickRate: number;
  unsubscribed: number;
  bounces: number;
}

export interface CampaignLog {
  id: string;
  subject: string;
  segment: string;
  totalTargets: number;
  recipientCount: number;
  sentAt: string;
  status: CampaignStatus;
  error: string | null;
  report: CampaignReport | null;
}

export interface CampaignHistoryItem {
  id: string;
  subject: string;
  segment: string;
  totalTargets: number;
  recipientCount: number;
  sentAt: string;
  sentByName: string | null;
  status: CampaignStatus;
  error: string | null;
  hasHtml: boolean;
  report: CampaignReport | null;
}

export interface CampaignHistoryPage {
  items: CampaignHistoryItem[];
  total: number;
  page: number;
  pages: number;
  segments: string[];
}

export interface CampaignHistoryParams {
  page?: number;
  limit?: number;
  q?: string;
  segment?: string;
  from?: string;
  to?: string;
}

export interface CampaignDetailReport extends CampaignReport {
  opensTotal: number;
  clicksTotal: number;
  hardBounces: number;
  softBounces: number;
  abuseReports: number;
  sendTime: string | null;
  mailchimpUrl: string | null;
}

export interface CampaignDetail {
  id: string;
  subject: string;
  html: string | null;
  segment: string;
  // Valor interno del segmento (para duplicar la campaña con el mismo público).
  segmentId: string;
  status: CampaignStatus;
  error: string | null;
  totalTargets: number;
  recipientCount: number;
  syncErrors: number;
  sentAt: string;
  sentByName: string | null;
  detail: CampaignDetailReport | null;
}

export const getCampaignHistory = (params: CampaignHistoryParams): Promise<CampaignHistoryPage> =>
  client
    .get<ApiResponse<CampaignHistoryPage>>('/email/campaigns/history', params as Record<string, unknown>)
    .then((r) => r.data);

export const getCampaignDetail = (id: string): Promise<CampaignDetail> =>
  client.get<ApiResponse<CampaignDetail>>(`/email/campaigns/${id}`).then((r) => r.data);

export const getCampaigns = (): Promise<CampaignLog[]> =>
  client.get<ApiResponse<CampaignLog[]>>('/email/campaigns').then((r) => r.data);

export interface SegmentCounts {
  all: number;
  subscribed: number;
  customers: number;
  leads: number;
  guideLeads?: number;
  guiaSat?: number;
  iniciativaFiscal2027?: number;
  newsletterLeads?: number;
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
