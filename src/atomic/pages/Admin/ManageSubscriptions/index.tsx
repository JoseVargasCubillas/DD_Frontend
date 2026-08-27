import { useQuery } from '@tanstack/react-query';
import { listAllSubscriptions } from '@api/subscriptions.api';
import ManagePackages from '@pages/Admin/ManagePackages';

function fmtDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
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

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Suscripciones</h1>
        <p className="text-sm text-ink-600 mt-3 max-w-3xl">
          Los tres planes de la Academia. Edita precio, tiempo, cursos incluidos y beneficios. Cada uno
          genera un link de pago con Stripe (envíaselo al cliente) y puedes también otorgarlo manualmente
          por email. La tabla de abajo lista todas las suscripciones activas.
        </p>
      </header>

      {/* Config de los 3 tiers + venta / asignación */}
      <ManagePackages hideHeader />

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
                  Error cargando suscripciones. ¿Estás autenticado como admin?
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
