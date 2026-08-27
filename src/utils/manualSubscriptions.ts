// Local fallback para asignaciones manuales de suscripción.
//
// El backend actualmente puede no exponer /subscriptions/admin/all, o no
// registrar las asignaciones manuales como orden/suscripción persistente
// todavía. Mientras eso se termina de implementar server-side, guardamos
// una copia local por navegador para que el admin siga viendo lo que ha
// asignado. En cuanto el backend devuelva las suscripciones reales, se
// fusionan por userId+packageId (dedupe).

import type { AdminSubscriptionRow } from '@api/subscriptions.api';

const STORAGE_KEY = 'dd-manual-subscriptions';
const EVENT = 'dd-manual-subscriptions-updated';

export interface ManualSubscriptionRecord {
  _id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  packageId: string;
  packageName?: string;
  packageTier?: string;
  price?: number;
  currency?: string;
  durationDays: number;
  startDate: string;
  currentPeriodEnd: string;
  status: 'active';
  source: 'manual_admin';
  createdAt: string;
}

function readAll(): ManualSubscriptionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ManualSubscriptionRecord[];
  } catch {
    return [];
  }
}

function writeAll(rows: ManualSubscriptionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* ignore quota errors */
  }
}

/** Records or upserts a manual subscription assignment. */
export function upsertManualSubscription(record: Omit<ManualSubscriptionRecord, '_id' | 'createdAt'> & { _id?: string }) {
  const all = readAll();
  const id = record._id || `manual-${record.userId}-${record.packageId}-${Date.now()}`;
  const now = new Date().toISOString();
  // Reemplaza cualquier entrada previa para el mismo usuario+paquete.
  const filtered = all.filter((r) => !(r.userId === record.userId && r.packageId === record.packageId));
  const nextRow: ManualSubscriptionRecord = {
    createdAt: now,
    ...record,
    _id: id,
  };
  filtered.push(nextRow);
  writeAll(filtered);
  return nextRow;
}

export function loadManualSubscriptions(): AdminSubscriptionRow[] {
  return readAll().map((r) => ({
    _id: r._id,
    user: r.userId,
    userName: r.userName,
    userEmail: r.userEmail,
    packageName: r.packageName,
    packageTier: r.packageTier,
    offerTitle: null,
    plan: 'business' as any,
    status: r.status,
    currentPeriodEnd: r.currentPeriodEnd,
    startDate: r.startDate,
    cancelAtPeriodEnd: false,
    source: r.source,
    package: r.packageId,
    offer: null,
  }));
}

/** Merge remote + local, dedupe by userId+packageId preferring remote. */
export function mergeManualIntoSubscriptions(remote: AdminSubscriptionRow[]): AdminSubscriptionRow[] {
  const remoteKey = (r: AdminSubscriptionRow) => `${r.user}::${r.package ?? ''}`;
  const remoteSet = new Set(remote.map(remoteKey));
  const localOnly = loadManualSubscriptions().filter((r) => !remoteSet.has(remoteKey(r)));
  return [...remote, ...localOnly];
}

export const MANUAL_SUBS_UPDATED_EVENT = EVENT;
