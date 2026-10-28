import { client } from './client';
import type { ApiResponse } from '@t/index';

export type ShipmentStatus = 'pending' | 'processing' | 'label_created' | 'rejected' | 'error';
export type DeliveryState = 'unknown' | 'in_transit' | 'delivered' | 'incident';

export interface ShipmentItem {
  bookId: string;
  slug: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface ShipmentTrackingEvent {
  date: string;
  description: string;
  location: string;
}

export type ShipmentSource = 'advisor' | 'web';

export interface Shipment {
  _id: string;
  status: ShipmentStatus;
  source: ShipmentSource;
  orderId: string;
  advisorId: string;
  advisorName: string;
  customer: { name: string; phone: string; email: string };
  address: { street: string; colony: string; postalCode: string; city: string; state: string; references: string };
  items: ShipmentItem[];
  notes: string;
  warnings: string[];
  quotedPrice: number | null;
  carrier: string;
  service: string;
  shippingCost: number | null;
  trackingNumber: string;
  labelUrl: string;
  trackUrl: string;
  enviaStatus: string;
  deliveryState: DeliveryState;
  enviaEvents: ShipmentTrackingEvent[];
  enviaCheckedAt: string | null;
  rejectionReason: string;
  error: string;
  notifications: string[];
  reviewedAt: string | null;
  reviewedBy: string;
  createdAt: string;
}

export interface ShipmentDraft {
  customer: { name: string; phone: string; email: string };
  address: { street: string; colony: string; postalCode: string; city: string; state: string; references: string };
  items: Array<{ slug: string; quantity: number }>;
  notes: string;
}

export interface ShipmentRate {
  carrier: string;
  carrierDescription: string;
  service: string;
  serviceDescription: string;
  deliveryEstimate: string;
  deliveryDays: number;
  totalPrice: number;
  currency: string;
}

export interface ShipmentAdvisor {
  _id: string;
  name: string;
  phone: string;
  email: string;
  token: string;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
  shipmentsCount: number;
  pendingCount: number;
}

export interface ShipmentList {
  items: Shipment[];
  counts: Record<string, number>;
  sources: Record<string, number>;
  total: number;
  page: number;
  pages: number;
}

// ── Público (link del asesor) ────────────────────────────────

export interface PublicBook {
  slug: string;
  title: string;
  format: string;
  inStock: boolean;
}

export interface PublicShipmentInfo {
  advisorName: string;
  books: PublicBook[];
}

export interface ShipmentValidation {
  errors: string[];
  warnings: string[];
  quotedPrice: number | null;
  duplicate: { id: string; createdAt: string; status: ShipmentStatus } | null;
}

export interface AdvisorShipmentRow {
  _id: string;
  status: ShipmentStatus;
  customerName: string;
  destination: string;
  itemsTitle: string;
  carrier: string;
  trackingNumber: string;
  trackUrl: string;
  enviaStatus: string;
  rejectionReason: string;
  createdAt: string;
}

export const getPublicInfo = (token: string): Promise<PublicShipmentInfo> =>
  client.get<ApiResponse<PublicShipmentInfo>>(`/shipments/public/${token}`).then((r) => r.data);

export interface PostalCodeResult {
  found: boolean;
  unavailable?: boolean;
  postalCode?: string;
  state?: string;
  city?: string;
  colonies?: string[];
}

export const lookupPostalCode = (token: string, postalCode: string): Promise<PostalCodeResult> =>
  client.get<ApiResponse<PostalCodeResult>>(`/shipments/public/${token}/postal-code/${postalCode}`).then((r) => r.data);

export const validatePublicShipment = (token: string, draft: ShipmentDraft): Promise<ShipmentValidation> =>
  client.post<ApiResponse<ShipmentValidation>>(`/shipments/public/${token}/validate`, draft).then((r) => r.data);

export const submitPublicShipment = (
  token: string,
  draft: ShipmentDraft,
  confirmDuplicate: boolean,
): Promise<{ _id: string; warnings: string[] }> =>
  client
    .post<ApiResponse<{ _id: string; warnings: string[] }>>(`/shipments/public/${token}`, { ...draft, confirmDuplicate })
    .then((r) => r.data);

export const getMyShipments = (token: string): Promise<AdvisorShipmentRow[]> =>
  client.get<ApiResponse<AdvisorShipmentRow[]>>(`/shipments/public/${token}/mine`).then((r) => r.data);

// ── Admin ────────────────────────────────────────────────────

export const listShipments = (params: {
  status?: string;
  source?: string;
  search?: string;
  page?: number;
}): Promise<ShipmentList> =>
  client.get<ApiResponse<ShipmentList>>('/shipments', params).then((r) => r.data);

export const getShipmentQuotes = (id: string): Promise<ShipmentRate[]> =>
  client.get<ApiResponse<ShipmentRate[]>>(`/shipments/${id}/quotes`).then((r) => r.data);

export const editShipment = (id: string, draft: ShipmentDraft): Promise<Shipment> =>
  client.patch<ApiResponse<Shipment>>(`/shipments/${id}`, draft).then((r) => r.data);

export const approveShipment = (id: string, choice?: { carrier: string; service: string }): Promise<Shipment> =>
  client.post<ApiResponse<Shipment>>(`/shipments/${id}/approve`, choice ?? {}).then((r) => r.data);

export const rejectShipment = (id: string, reason: string): Promise<Shipment> =>
  client.post<ApiResponse<Shipment>>(`/shipments/${id}/reject`, { reason }).then((r) => r.data);

export const refreshShipmentTracking = (id: string): Promise<Shipment> =>
  client.post<ApiResponse<Shipment>>(`/shipments/${id}/refresh-tracking`).then((r) => r.data);

export const refreshAllTracking = (): Promise<{ checked: number }> =>
  client.post<ApiResponse<{ checked: number }>>('/shipments/refresh-tracking').then((r) => r.data);

export const listAdvisors = (): Promise<ShipmentAdvisor[]> =>
  client.get<ApiResponse<ShipmentAdvisor[]>>('/shipments/advisors').then((r) => r.data);

export const createAdvisor = (input: { name: string; phone: string; email: string }): Promise<ShipmentAdvisor> =>
  client.post<ApiResponse<ShipmentAdvisor>>('/shipments/advisors', input).then((r) => r.data);

export const updateAdvisor = (
  id: string,
  input: Partial<{ name: string; phone: string; email: string; isActive: boolean }>,
): Promise<ShipmentAdvisor> =>
  client.patch<ApiResponse<ShipmentAdvisor>>(`/shipments/advisors/${id}`, input).then((r) => r.data);

export const rotateAdvisorToken = (id: string): Promise<ShipmentAdvisor> =>
  client.post<ApiResponse<ShipmentAdvisor>>(`/shipments/advisors/${id}/rotate`).then((r) => r.data);
