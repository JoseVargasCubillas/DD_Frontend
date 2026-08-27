import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAllSubscriptions } from '@api/subscriptions.api';
import { listAllOrders } from '@api/payments.api';
import ManagePackages from '@pages/Admin/ManagePackages';

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n || 0);
}

function statusStyle(status: string) {
  switch (status) {
    case 'active':
      return 'bg-ink-900 text-cream';
    case 'trialing':
      return 'bg-cream-300 text-ink-900 border border-ink-900/15';
    case 'past_due':
      return 'bg-amber-100 text-amber-900 border border-amber-300';
    case 'canceled':
      return 'border border-ink-400 text-ink-500';
    default:
      return 'border border-ink-300 text-ink-500';
  }
}

function daysUntil(iso?: string) {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.round((end - now) / (1000 * 60 * 60 * 24)));
}

/**
 * Suscripciones = registro de qué Paquete tiene cada cliente (por compra o asignación).
 * Se otorgan desde el perfil del contacto ("Asignar paquete").
 */
export default function ManageSubscriptions() {
  const { data: subs = [], isLoading, error } = useQuery({
    queryKey: ['subscriptions', 'admin', 'all'],
    queryFn: listAllSubscriptions,
  });
  const { data: orders = [] } = useQuery({
    queryKey: ['orders', 'admin', 'all'],
    queryFn: listAllOrders,
    staleTime: 30 * 1000,
  });

  const metrics = useMemo(() => {
    const active = subs.filter((s) => s.status === 'active' || s.status === 'trialing').length;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const paidOrders = orders.filter((o) => o.status === 'completed');
    const monthRevenue = paidOrders
      .filter((o) => new Date(o.createdAt || 0).getTime() >= monthStart)
      .reduce((sum, o) => sum + (o.total ?? 0), 0);
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total ?? 0), 0);
    return { active, monthRevenue, totalRevenue, paidCount: paidOrders.length };
  }, [subs, orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10),
    [orders],
  );

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Suscripciones</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-3xl">
          Todo lo relacionado a los planes de la Academia en un solo lugar: precios, ventas por Stripe,
          asignación manual con tiempo limitado, pagos que llegan de la web y suscripciones activas.
        </p>
      </header>

      {/* Métricas */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        <MetricCard label="Suscripciones activas" value={String(metrics.active)} hint="active + trialing" />
        <MetricCard label="Ingresos este mes" value={fmtMoney(metrics.monthRevenue)} hint="pagos confirmados" />
        <MetricCard label="Ingresos totales" value={fmtMoney(metrics.totalRevenue)} hint="histórico" />
        <MetricCard label="Pagos totales" value={String(metrics.paidCount)} hint="órdenes pagadas" />
      </section>

      {/* Config de los 3 tiers + venta / asignación */}
      <ManagePackages hideHeader />

      {/* Pagos recientes */}
      <section className="mt-16">
        <header className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Ingresos</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink-900 leading-none">Pagos recientes desde la web</h2>
          <p className="text-sm text-ink-600 mt-2">Se actualizan automáticamente cuando el cliente completa el checkout de Stripe.</p>
        </header>
        <div className="bg-cream-100 border border-ink-900/15 overflow-hidden overflow-x-auto mb-12">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="bg-cream-200 border-b border-ink-900/15">
              <tr>
                {['Fecha', 'Cliente', 'Concepto', 'Estado', 'Total'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-ink-500 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-ink-500 italic font-serif">
                    Aún no hay pagos registrados.
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => {
                  const firstItem = o.items?.[0];
                  return (
                    <tr key={o._id || o.id} className="hover:bg-cream-50">
                      <td className="px-4 py-3 text-ink-600">{fmtDate(o.createdAt as any)}</td>
                      <td className="px-4 py-3">
                        <p className="font-serif text-ink-900">
                          {(o as any).customerName || (typeof o.customer === 'object' ? (o.customer as any)?.name : '') || '—'}
                        </p>
                        <p className="text-xs text-ink-500 mt-0.5">
                          {(o as any).customerEmail || (typeof o.customer === 'object' ? (o.customer as any)?.email : '') || ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-ink-700">{firstItem?.title || (o.items?.length ? `${o.items.length} items` : '—')}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] uppercase tracking-[0.28em] px-2 py-1 ${statusStyle(o.status)}`}>{o.status}</span>
                      </td>
                      <td className="px-4 py-3 font-serif text-ink-900">{fmtMoney(o.total)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-16">
        <header className="mb-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Registro</p>
          <h2 className="font-serif text-2xl md:text-3xl text-ink-900 leading-none">Clientes con suscripción activa</h2>
        </header>

      <div className="bg-cream-100 border border-ink-900/15 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead className="bg-cream-200 border-b border-ink-900/15">
            <tr>
              {['Cliente', 'Paquete / Oferta', 'Inicio', 'Vence', 'Restante', 'Estado'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-ink-500 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-ink-500">
                  Cargando…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-red-700 text-sm">
                  <p className="font-serif text-base mb-1">No pude cargar la lista de suscripciones.</p>
                  <p className="text-xs opacity-80">
                    {(error as Error)?.message || 'Error desconocido'}
                  </p>
                </td>
              </tr>
            ) : subs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-14 text-ink-500 italic font-serif">
                  Aún no hay suscripciones. Asigna un paquete a un contacto desde su perfil.
                </td>
              </tr>
            ) : (
              subs.map((s) => {
                const rem = daysUntil(s.currentPeriodEnd);
                return (
                  <tr key={s._id ?? s.id} className="hover:bg-cream-50">
                    <td className="px-4 py-3">
                      <p className="font-serif text-ink-900 text-base leading-tight">{s.userName || '—'}</p>
                      <p className="text-xs text-ink-500 mt-0.5">{s.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      {s.packageName && (
                        <>
                          <p className="font-serif text-ink-900">{s.packageName}</p>
                          {s.packageTier && (
                            <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mt-0.5">
                              Tier · {s.packageTier}
                            </p>
                          )}
                        </>
                      )}
                      {!s.packageName && s.offerTitle && (
                        <>
                          <p className="font-serif text-ink-900">{s.offerTitle}</p>
                          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mt-0.5">Oferta</p>
                        </>
                      )}
                      {!s.packageName && !s.offerTitle && <span className="text-ink-500">—</span>}
                    </td>
                    <td className="px-4 py-3 text-ink-600">{fmtDate(s.startDate)}</td>
                    <td className="px-4 py-3 text-ink-600">{fmtDate(s.currentPeriodEnd)}</td>
                    <td className="px-4 py-3">
                      {rem !== null ? (
                        <div className="w-32">
                          <div className="h-1.5 bg-cream-200 overflow-hidden">
                            <div
                              className="h-full bg-ink-900"
                              style={{ width: `${Math.min(100, (rem / 365) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-ink-500 mt-1">{rem} días</p>
                        </div>
                      ) : (
                        <span className="text-ink-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-[0.28em] px-2 py-1 ${statusStyle(s.status)}`}>
                        {s.status}
                      </span>
                      {s.cancelAtPeriodEnd && (
                        <p className="text-[10px] text-amber-700 mt-1">Cancela al final del periodo</p>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-cream-100 border border-ink-900/15 p-5">
      <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">{label}</p>
      <p className="font-serif text-3xl text-ink-900 mt-3 leading-none">{value}</p>
      {hint && <p className="text-xs text-ink-500 mt-2">{hint}</p>}
    </div>
  );
}