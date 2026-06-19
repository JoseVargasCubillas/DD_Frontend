import { useQuery } from '@tanstack/react-query';
import { fetchSubscriptions, type SubscriptionRow } from '@utils/mock-data';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

const STATUS_STYLES: Record<SubscriptionRow['status'], string> = {
  'Active':               'bg-ink-900 text-white',
  'Granted':              'bg-cream-300 text-ink-900',
  'Pending deactivation': 'bg-brand-100 text-brand-800 border border-brand-300',
  'Expired':              'border border-ink-300 text-ink-400',
};

export default function ManageSubscriptions() {
  const { data: subs = [], isLoading } = useQuery({ queryKey: ['subscriptions'], queryFn: fetchSubscriptions });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-cream-400 pb-4">
        <div>
          <p className="section-label text-ink-500">Sección · Membresías</p>
          <h1 className="font-heading text-3xl font-bold mt-1">Suscripciones</h1>
          <p className="font-serif italic text-ink-500 text-sm mt-1">Otorgamientos vigentes por cliente.</p>
        </div>
        <button className="btn-primary">+ Otorgar suscripción</button>
      </header>

      <div className="bg-white border border-cream-300 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-cream-50 border-b border-cream-300">
            <tr>
              {['Cliente', 'Paquete', 'Inicio', 'Vence', 'Restante', 'Estado'].map((h) => (
                <th key={h} className="text-left px-4 py-3 section-label text-ink-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10 text-ink-500">Cargando…</td></tr>
            ) : subs.map((s) => (
              <tr key={s.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium">{s.contactName}</p>
                  <p className="text-ink-500 text-xs">{s.contactEmail}</p>
                </td>
                <td className="px-4 py-3">{s.offerName}</td>
                <td className="px-4 py-3 text-ink-600">{fmtDate(s.startDate)}</td>
                <td className="px-4 py-3 text-ink-600">{fmtDate(s.endDate)}</td>
                <td className="px-4 py-3">
                  <div className="w-32">
                    <div className="h-1.5 bg-cream-200 overflow-hidden">
                      <div className="h-full bg-ink-900" style={{ width: `${Math.min(100, (s.remainingDays / 365) * 100)}%` }} />
                    </div>
                    <p className="text-xs text-ink-500 mt-1">{s.remainingDays} días</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${STATUS_STYLES[s.status]}`}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
