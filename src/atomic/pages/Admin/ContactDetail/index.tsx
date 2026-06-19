import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchContact } from '@utils/mock-data';

type Tab = 'lifecycle' | 'info' | 'purchases' | 'products' | 'notes';

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ContactDetail() {
  const { id = '' } = useParams();
  const [tab, setTab] = useState<Tab>('lifecycle');
  const { data: contact, isLoading } = useQuery({ queryKey: ['contact', id], queryFn: () => fetchContact(id) });

  if (isLoading) return <p className="text-ink-500">Cargando perfil…</p>;
  if (!contact) return <p className="text-ink-500">Contacto no encontrado.</p>;

  const lifespanDays = Math.max(1, Math.floor((Date.now() - new Date(contact.addedDate).getTime()) / 86400000));

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/contactos" className="text-xs link-grow uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 self-start">← Contactos</Link>

      <header className="flex items-end justify-between border-b border-cream-400 pb-6">
        <div>
          <p className="section-label text-ink-500">Perfil de cliente</p>
          <h1 className="font-heading text-3xl font-bold mt-1">{contact.name}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <button className="link-grow uppercase tracking-[0.2em] text-xs">Editar</button>
            <button className="link-grow uppercase tracking-[0.2em] text-xs">Enviar contraseña</button>
            <details className="group relative">
              <summary className="link-grow uppercase tracking-[0.2em] text-xs cursor-pointer list-none">Más acciones ▾</summary>
              <div className="absolute top-full left-0 mt-2 bg-white border border-cream-300 shadow-lg p-2 min-w-[200px] z-10">
                {['Silenciar','Ocultar','Otorgar oferta','Ver historial','Cambiar contraseña','Eliminar contacto'].map((a) => (
                  <button key={a} className="block w-full text-left px-3 py-1.5 text-sm hover:bg-cream-100 cursor-pointer">{a}</button>
                ))}
              </div>
            </details>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-cream-300 p-6 flex gap-5">
            <div className="w-20 h-20 rounded-full bg-cream-300 flex items-center justify-center font-heading text-2xl font-bold shrink-0">
              {contact.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </div>
            <div className="min-w-0">
              <p className="font-bold">{contact.name}</p>
              <a className="text-sm text-ink-500 hover:text-ink-900 link-grow break-all" href={`mailto:${contact.email}`}>{contact.email}</a>
              <p className="text-sm text-ink-500 mt-2">Alta · <strong className="text-ink-900">{fmtDate(contact.addedDate)}</strong></p>
              <p className="text-sm text-ink-500">Cliente desde · <strong className="text-ink-900">{fmtDate(contact.addedDate)}</strong></p>
            </div>
          </div>

          <div className="bg-white border border-cream-300">
            <nav className="flex gap-6 px-6 border-b border-cream-300 overflow-x-auto">
              {([
                ['lifecycle', 'Ciclo de vida'],
                ['info', 'Información'],
                ['purchases', 'Compras'],
                ['products', 'Productos'],
                ['notes', 'Notas'],
              ] as const).map(([k, l]) => (
                <button key={k} onClick={() => setTab(k)}
                  className={`relative py-3 text-sm cursor-pointer transition-colors whitespace-nowrap ${tab === k ? 'text-ink-900 font-semibold' : 'text-ink-500 hover:text-ink-900'}`}>
                  {l}
                  {tab === k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-ink-900" />}
                </button>
              ))}
            </nav>

            {tab === 'lifecycle' && (
              <div className="p-6">
                <div className="grid grid-cols-3 border border-cream-300 mb-6">
                  {[['Antigüedad', `${lifespanDays} días`], ['Compras', contact.totalOffers.toString()], ['Ingresos netos', `$${contact.lifetimeValue.toLocaleString('es-MX')} MXN`]].map(([k, v], i) => (
                    <div key={k} className={`px-4 py-5 text-center ${i < 2 ? 'border-r border-cream-300' : ''}`}>
                      <p className="section-label text-ink-500">{k}</p>
                      <p className="font-heading text-2xl font-bold mt-2">{v}</p>
                    </div>
                  ))}
                </div>
                <p className="section-label mb-3">Filtrar por tipo de evento</p>
                <select className="input-cream max-w-xs mb-4"><option>Todos los tipos</option><option>Otorgamientos</option><option>Compras</option></select>
                <p className="text-sm text-ink-500 mb-3">Feed limitado a los últimos 500 eventos.</p>
                <div className="border border-cream-300 p-4 flex gap-4">
                  <div className="w-10 h-10 bg-cream-200 flex items-center justify-center text-ink-500" aria-hidden>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-4 6.7V18h-4v-3.3a2 2 0 1 1 4 0z" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-ink-500">{fmtDate(contact.addedDate)}</p>
                    <p className="mt-1">Se otorgó <strong>Mastermind 2026</strong> de forma gratuita</p>
                    <a href="#" className="text-sm link-grow">Ver información de compra →</a>
                  </div>
                </div>
              </div>
            )}
            {tab === 'info' && <div className="p-6 text-sm text-ink-500">Información extendida del contacto (campos personalizados, dirección, etc).</div>}
            {tab === 'purchases' && <div className="p-6 text-sm text-ink-500">Historial de compras y pagos.</div>}
            {tab === 'products' && <div className="p-6 text-sm text-ink-500">Productos a los que tiene acceso.</div>}
            {tab === 'notes' && <div className="p-6 text-sm text-ink-500">Notas internas del equipo.</div>}
          </div>
        </section>

        <aside className="bg-white border border-cream-300 p-6 h-fit">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold">Etiquetas</h3>
            <button className="text-xs link-grow uppercase tracking-[0.2em]">Ver todas</button>
          </div>
          <select className="input-cream"><option>Seleccionar etiqueta…</option></select>
          <div className="flex flex-wrap gap-2 mt-4">
            {contact.tags.map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-[0.2em] bg-ink-900 text-white px-2 py-1">{t}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
