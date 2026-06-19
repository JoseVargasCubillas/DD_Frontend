import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchOutline, MOCK_PRODUCTS } from '@utils/mock-data';

type Tab = 'outline' | 'customize' | 'offers' | 'customers' | 'certificates' | 'settings';

export default function ProductDetail() {
  const { id = '' } = useParams();
  const [tab, setTab] = useState<Tab>('outline');
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['m1']));
  const [query, setQuery] = useState('');

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const { data: modules = [] } = useQuery({ queryKey: ['outline', id], queryFn: () => fetchOutline(id) });

  const filtered = modules.filter((m) =>
    m.title.toLowerCase().includes(query.toLowerCase()) ||
    m.lessons.some((l) => l.title.toLowerCase().includes(query.toLowerCase()))
  );

  function toggle(mid: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(mid) ? next.delete(mid) : next.add(mid);
      return next;
    });
  }

  if (!product) return <p className="text-ink-500">Producto no encontrado.</p>;

  return (
    <div className="flex flex-col gap-6">
      <Link to="/admin/productos" className="text-xs link-grow uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900 self-start">← Productos</Link>

      <header className="flex items-center gap-5 border-b border-cream-400 pb-6">
        <div className="w-20 h-20 bg-ink-900 text-white flex items-center justify-center font-bold text-[10px] text-center shrink-0 p-1 overflow-hidden">
          {product.title.split(' ').slice(0, 2).join(' ')}
        </div>
        <div className="flex-1">
          <p className="section-label text-ink-500">Producto</p>
          <h1 className="font-heading text-3xl font-bold mt-1 uppercase tracking-wider">{product.title}</h1>
        </div>
        <button className="btn-primary">+ Agregar contenido</button>
      </header>

      <nav className="border-b border-cream-300 flex gap-6 -mt-2 overflow-x-auto">
        {([
          ['outline', 'Outline'],
          ['customize', 'Personalizar'],
          ['offers', 'Ofertas (18)'],
          ['customers', `Clientes (${product.members})`],
          ['certificates', 'Certificados'],
          ['settings', 'Ajustes'],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`relative pb-3 text-sm whitespace-nowrap cursor-pointer transition-colors ${tab === k ? 'text-ink-900 font-semibold' : 'text-ink-500 hover:text-ink-900'}`}>
            {l}
            {tab === k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-ink-900" />}
          </button>
        ))}
      </nav>

      {tab === 'outline' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-cream-300 p-4">
            <div className="relative">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar módulo o lección…" className="input-cream pl-10" />
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="font-medium">{modules.length} módulos</p>
              <button onClick={() => setExpanded(new Set(modules.map((m) => m.id)))} className="text-xs link-grow uppercase tracking-[0.2em] cursor-pointer">Expandir todo</button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {filtered.map((m) => (
              <div key={m.id} className="bg-white border border-cream-300">
                <button onClick={() => toggle(m.id)} className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-cream-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" /></svg>
                    <span className="font-medium uppercase tracking-wider text-sm">{m.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-xs link-grow uppercase tracking-[0.2em] cursor-pointer" onClick={(e) => e.stopPropagation()}>+ Agregar contenido</button>
                    <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${m.published ? 'bg-ink-900 text-white' : 'border border-ink-400 text-ink-500'}`}>{m.published ? 'Publicado' : 'Borrador'}</span>
                    <svg className={`w-4 h-4 transition-transform ${expanded.has(m.id) ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </button>
                {expanded.has(m.id) && (
                  <div className="border-t border-cream-300 divide-y divide-cream-200">
                    {m.lessons.map((l) => (
                      <div key={l.id} className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-cream-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4 text-ink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16" fill="currentColor" stroke="none" /></svg>
                          <span className="text-sm">{l.title}</span>
                          <span className="text-xs text-ink-400">· {l.durationMin} min</span>
                        </div>
                        <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${l.published ? 'bg-ink-900 text-white' : 'border border-ink-400 text-ink-500'}`}>{l.published ? 'Publicado' : 'Borrador'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === 'customize' && (
        <div className="bg-white border border-cream-300 p-8">
          <h3 className="font-heading text-xl font-bold mb-4">Portada del producto</h3>
          <div className="aspect-video bg-ink-900 text-white flex items-center justify-center mb-4 max-w-2xl">
            <span className="font-heading text-3xl tracking-wider">{product.title}</span>
          </div>
          <button className="btn-secondary">Cambiar portada</button>
        </div>
      )}
      {tab !== 'outline' && tab !== 'customize' && (
        <div className="bg-white border border-cream-300 p-8 text-ink-500 text-sm">Sección {tab} — próximamente.</div>
      )}
    </div>
  );
}
