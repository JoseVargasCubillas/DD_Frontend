import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchContacts, fetchTags, type Contact } from '@utils/mock-data';

type Tab = 'all' | 'tags';

function fmtDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(n);
}

function ContactDrawer({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink-900/40" onClick={onClose} />
      <aside className="relative w-full max-w-md bg-white border-l border-cream-400 overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-300">
          <a href={`/admin/contactos/${contact.id}`} className="text-sm link-grow font-medium">Abrir perfil completo →</a>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 cursor-pointer p-1" aria-label="Cerrar">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-6 py-6 flex flex-col items-center text-center border-b border-cream-300">
          <div className="w-16 h-16 rounded-full bg-cream-300 flex items-center justify-center font-heading text-xl font-bold mb-3">
            {contact.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
          </div>
          <h3 className="font-heading text-xl font-bold">{contact.name}</h3>
          <p className="text-sm text-ink-500">{contact.email}</p>
        </div>
        <dl className="px-6 py-4 grid grid-cols-1 gap-3 text-sm border-b border-cream-300">
          {[
            ['Lifetime value', fmtMoney(contact.lifetimeValue)],
            ['Total ofertas', contact.totalOffers.toString()],
            ['Total productos', contact.totalProducts.toString()],
            ['Último ingreso', fmtDate(contact.lastSignIn)],
            ['Total ingresos', contact.totalSignIns.toString()],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between"><dt className="text-ink-500">{k}</dt><dd className="font-medium">{v}</dd></div>
          ))}
        </dl>
        <dl className="px-6 py-4 grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-ink-500">Estado contacto</dt>
            <dd><span className="text-[10px] uppercase tracking-[0.2em] bg-ink-900 text-white px-2 py-1">{contact.status}</span></dd>
          </div>
          <div className="flex justify-between"><dt className="text-ink-500">Estado marketing</dt><dd className="font-medium">{contact.marketingStatus}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">Alta</dt><dd className="font-medium">{fmtDate(contact.addedDate)}</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">Opt-in</dt><dd className="font-medium">{contact.optIn}</dd></div>
        </dl>
      </aside>
    </div>
  );
}

export default function ManageContacts() {
  const [tab, setTab] = useState<Tab>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Contact | null>(null);

  const { data: contacts = [], isLoading } = useQuery({ queryKey: ['contacts'], queryFn: fetchContacts });
  const { data: tags = [] } = useQuery({ queryKey: ['tags'], queryFn: fetchTags });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? contacts.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)) : contacts;
  }, [contacts, search]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-cream-400 pb-4">
        <div>
          <p className="section-label text-ink-500">Sección · CRM</p>
          <h1 className="font-heading text-3xl font-bold mt-1">Contactos</h1>
        </div>
        <button className="btn-primary">{tab === 'tags' ? '+ Nueva etiqueta' : '+ Agregar contacto'}</button>
      </header>

      <div className="border-b border-cream-300 flex gap-8 -mt-2">
        {([['all','Todos los contactos'],['tags','Etiquetas']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`relative pb-3 text-sm font-medium cursor-pointer transition-colors ${tab === k ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'}`}>
            {label}
            {tab === k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-ink-900" />}
          </button>
        ))}
      </div>

      {tab === 'all' && (
        <>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <select className="input-cream md:max-w-[180px]">
              <option>Segmentos</option>
              <option>Solo clientes</option>
              <option>Solo leads</option>
            </select>
            <div className="relative flex-1">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar contactos..." className="input-cream pl-10" />
              <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
            </div>
            <button className="btn-secondary">Filtros</button>
          </div>

          <div className="flex items-center justify-between text-sm text-ink-500">
            <span>Mostrando <strong className="text-ink-900">{filtered.length}</strong> de {contacts.length} contactos</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 border border-cream-400 hover:border-ink-900 transition-colors cursor-pointer" aria-label="Anterior">‹</button>
              <button className="w-8 h-8 border border-cream-400 hover:border-ink-900 transition-colors cursor-pointer" aria-label="Siguiente">›</button>
            </div>
          </div>

          <div className="bg-white border border-cream-300 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-cream-50 border-b border-cream-300">
                <tr>
                  {['Nombre', 'Email', 'Marketing', 'Lifetime', 'Alta', 'Última actividad'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 section-label text-ink-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-10 text-ink-500">Cargando contactos...</td></tr>
                ) : filtered.map((c) => (
                  <tr key={c.id} onClick={() => setSelected(c)} className="hover:bg-cream-50 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cream-300 flex items-center justify-center text-[10px] font-bold">
                          {c.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                        </div>
                        {c.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{c.email}</td>
                    <td className="px-4 py-3 text-ink-600">{c.marketingStatus}</td>
                    <td className="px-4 py-3">{fmtMoney(c.lifetimeValue)}</td>
                    <td className="px-4 py-3 text-ink-600">{fmtDate(c.addedDate)}</td>
                    <td className="px-4 py-3 text-ink-600">{fmtDate(c.lastActivity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'tags' && (
        <>
          <div className="relative max-w-xl">
            <input placeholder="Buscar etiquetas..." className="input-cream pl-10" />
            <svg className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
          </div>
          <div className="bg-white border border-cream-300 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-cream-50 border-b border-cream-300">
                <tr>
                  <th className="text-left px-4 py-3 section-label text-ink-500 font-semibold">Nombre</th>
                  <th className="text-left px-4 py-3 section-label text-ink-500 font-semibold">Contactos</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {tags.map((t) => (
                  <tr key={t.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3"><a href="#" className="link-grow uppercase tracking-wider text-xs">{t.name}</a></td>
                    <td className="px-4 py-3 font-medium">{t.contactsCount}</td>
                    <td className="px-4 py-3 text-right text-ink-400 cursor-pointer">···</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selected && <ContactDrawer contact={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
