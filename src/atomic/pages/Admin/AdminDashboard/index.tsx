import { useQuery } from '@tanstack/react-query';
import { fetchContacts, fetchProducts, fetchSubscriptions } from '@utils/mock-data';

function fmtMoney(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n);
}

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-cream-300 p-6 hover:border-ink-900 transition-colors duration-200">
      <p className="section-label text-ink-500">{label}</p>
      <p className="font-heading text-3xl font-bold mt-2">{value}</p>
      {hint && <p className="font-serif italic text-sm text-ink-500 mt-1">{hint}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: contacts = [] } = useQuery({ queryKey: ['contacts'], queryFn: fetchContacts });
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });
  const { data: subs = [] }     = useQuery({ queryKey: ['subscriptions'], queryFn: fetchSubscriptions });

  const customers = contacts.filter((c) => c.status === 'Customer').length;
  const activeSubs = subs.filter((s) => s.status === 'Active' || s.status === 'Granted').length;
  const revenue = contacts.reduce((acc, c) => acc + c.lifetimeValue, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-end justify-between border-b border-cream-400 pb-6">
        <div>
          <p className="section-label text-ink-500">Edición · {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <h1 className="font-heading text-4xl font-bold mt-2">Panel general</h1>
          <p className="font-serif italic text-ink-500 mt-1">Estado actual de la academia.</p>
        </div>
        <button className="btn-primary">+ Nuevo contacto</button>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Contactos"          value={contacts.length.toLocaleString('es-MX')} hint="Total registrados" />
        <Kpi label="Clientes activos"   value={customers.toLocaleString('es-MX')}        hint={`${Math.round((customers / Math.max(contacts.length, 1)) * 100)}% conversión`} />
        <Kpi label="Suscripciones vivas" value={activeSubs.toString()}                    hint={`${subs.length} históricas`} />
        <Kpi label="Ingresos del período" value={fmtMoney(revenue)}                       hint="Lifetime value total" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-cream-300 p-6">
          <h2 className="font-heading text-xl font-bold mb-4">Productos publicados</h2>
          <div className="divide-y divide-cream-300">
            {products.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="section-label text-ink-400 mt-0.5">{p.members} miembros · {p.type}</p>
                </div>
                <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${p.status === 'Published' ? 'bg-ink-900 text-white' : 'border border-ink-400 text-ink-500'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-ink-900 text-white p-6">
          <p className="section-label-inv">Acceso</p>
          <h2 className="font-heading text-2xl font-bold mt-2">Crear cuenta de cliente</h2>
          <p className="font-serif italic text-ink-300 text-sm mt-2">
            Genera credenciales y envíalas por correo. Solo el admin puede crear cuentas.
          </p>
          <a href="/admin/usuarios" className="btn-primary-inv mt-6 inline-flex">+ Nueva cuenta</a>
        </div>
      </section>
    </div>
  );
}

