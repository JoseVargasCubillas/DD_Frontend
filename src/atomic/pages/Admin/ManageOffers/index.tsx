import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOffers, fetchProducts } from '@utils/mock-data';

function fmtMoney(n: number, ccy: string) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: ccy, maximumFractionDigits: 0 }).format(n);
}

function durationLabel(days: number) {
  if (days % 365 === 0) return `${days / 365} año${days === 365 ? '' : 's'}`;
  if (days % 30 === 0) return `${days / 30} mes${days === 30 ? '' : 'es'}`;
  return `${days} días`;
}

const PRESET_DURATIONS = [
  { days: 30,  label: '1 mes' },
  { days: 60,  label: '2 meses' },
  { days: 90,  label: '3 meses' },
  { days: 180, label: '6 meses' },
  { days: 365, label: '1 año' },
];

export default function ManageOffers() {
  const [showNew, setShowNew] = useState(false);
  const { data: offers = [], isLoading } = useQuery({ queryKey: ['offers'], queryFn: fetchOffers });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-cream-400 pb-4">
        <div>
          <p className="section-label text-ink-500">Sección · Catálogo</p>
          <h1 className="font-heading text-3xl font-bold mt-1">Ofertas y paquetes</h1>
          <p className="font-serif italic text-ink-500 text-sm mt-1">Suscripciones con duración predeterminada.</p>
        </div>
        <button onClick={() => setShowNew(true)} className="btn-primary">+ Nueva oferta</button>
      </header>

      <div className="bg-white border border-cream-300 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="bg-cream-50 border-b border-cream-300">
            <tr>
              {['Nombre', 'Duración', 'Productos incluidos', 'Precio', 'Estado', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 section-label text-ink-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10 text-ink-500">Cargando ofertas…</td></tr>
            ) : offers.map((o) => (
              <tr key={o.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3 font-medium">{o.name}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] border border-ink-900 px-2 py-1">{durationLabel(o.durationDays)}</span>
                </td>
                <td className="px-4 py-3 text-ink-600">{o.productIds.length} producto{o.productIds.length === 1 ? '' : 's'}</td>
                <td className="px-4 py-3 font-medium">{o.price === 0 ? 'Gratuita' : fmtMoney(o.price, o.currency)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${o.active ? 'bg-ink-900 text-white' : 'border border-ink-400 text-ink-500'}`}>
                    {o.active ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs link-grow uppercase tracking-[0.2em] cursor-pointer">Otorgar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink-900/50" onClick={() => setShowNew(false)} />
          <div className="relative w-full max-w-lg bg-white border border-cream-300 p-8">
            <p className="section-label text-ink-500">Nueva</p>
            <h2 className="font-heading text-2xl font-bold mt-1 mb-6">Crear oferta</h2>
            <form className="flex flex-col gap-4">
              <label className="flex flex-col gap-1.5">
                <span className="section-label text-ink-700">Nombre del paquete</span>
                <input className="input-cream" placeholder="Ej. Mastermind 6 meses" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="section-label text-ink-700">Duración</span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_DURATIONS.map((d) => (
                    <button type="button" key={d.days} className="border border-ink-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer">
                      {d.label}
                    </button>
                  ))}
                </div>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="section-label text-ink-700">Precio (MXN)</span>
                <input className="input-cream" type="number" placeholder="0 = gratuita" />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="section-label text-ink-700">Productos incluidos</span>
                <select multiple className="input-cream h-32">
                  {products.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </select>
              </label>
              <div className="flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setShowNew(false)} className="btn-secondary">Cancelar</button>
                <button type="submit" className="btn-primary">Crear oferta</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
