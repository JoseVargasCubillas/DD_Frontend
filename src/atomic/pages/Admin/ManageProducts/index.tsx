import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@utils/mock-data';

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ManageProducts() {
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between border-b border-cream-400 pb-4">
        <div>
          <p className="section-label text-ink-500">Sección · Catálogo</p>
          <h1 className="font-heading text-3xl font-bold mt-1">Productos</h1>
          <p className="font-serif italic text-ink-500 text-sm mt-1">Cursos y programas de la academia.</p>
        </div>
        <button className="btn-primary">+ Nuevo producto</button>
      </header>

      <div className="bg-white border border-cream-300 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead className="bg-cream-50 border-b border-cream-300">
            <tr>
              {['Título', 'Miembros', 'Creado', 'Tipo', 'Estado', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 section-label text-ink-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-200">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10 text-ink-500">Cargando…</td></tr>
            ) : products.map((p) => (
              <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-4 py-3">
                  <Link to={`/admin/productos/${p.id}`} className="flex items-center gap-3 group">
                    <div className="w-14 h-10 bg-ink-900 text-white flex items-center justify-center text-[9px] font-bold tracking-wider shrink-0 overflow-hidden">
                      {p.title.split(' ')[0].slice(0, 8)}
                    </div>
                    <span className="font-medium uppercase text-xs tracking-wider group-hover:underline">{p.title}</span>
                  </Link>
                </td>
                <td className="px-4 py-3">{p.members.toLocaleString('es-MX')}</td>
                <td className="px-4 py-3 text-ink-600">{fmtDate(p.createdAt)}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] border border-ink-900 px-2 py-1">{p.type}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 ${p.status === 'Published' ? 'bg-ink-900 text-white' : 'border border-ink-400 text-ink-500'}`}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-right text-ink-400 cursor-pointer">···</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
