import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUsers, useToggleUserActive, useAdminCreateUser } from '@hooks/useUsers';
import type { User } from '@t/index';

interface NewUserForm { name: string; email: string; role: 'user' | 'admin' }

export default function ManageUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const { data, isLoading } = useUsers({ page, limit: 20, search: search || undefined });
  const toggle = useToggleUserActive();
  const create = useAdminCreateUser();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewUserForm>({
    defaultValues: { role: 'user' },
  });

  const onCreate = (form: NewUserForm) => {
    create.mutate(form, {
      onSuccess: () => { reset(); setShowNew(false); },
    });
  };

  const users = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;

  return (
    <div className="space-y-8">
      <header className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Sección · Comunidad</p>
          <h1 className="font-serif text-4xl text-ink-900">Suscriptores</h1>
          <p className="font-serif italic text-ink-600 mt-1">
            {total} {total === 1 ? 'suscriptor' : 'suscriptores'} en la base.
          </p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="text-[11px] uppercase tracking-[0.32em] bg-ink-900 text-cream px-6 py-3 hover:tracking-[0.42em] transition-all cursor-pointer"
        >
          {showNew ? 'Cancelar' : '+ Dar acceso'}
        </button>
      </header>

      <div className="h-px bg-ink-900/30" />

      {/* Form crear cuenta */}
      {showNew && (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="bg-cream-100 border border-ink-900/20 p-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end"
        >
          <div className="flex flex-col gap-1.5 lg:col-span-1">
            <label className="text-[10px] uppercase tracking-[0.3em] text-ink-700">Nombre</label>
            <input
              type="text"
              className="ink-input"
              placeholder="Nombre completo"
              {...register('name', { required: 'Requerido' })}
            />
            {errors.name && <p className="text-[11px] text-red-700 italic font-serif">{errors.name.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5 lg:col-span-1">
            <label className="text-[10px] uppercase tracking-[0.3em] text-ink-700">Correo</label>
            <input
              type="email"
              className="ink-input"
              placeholder="cliente@ejemplo.com"
              {...register('email', { required: 'Requerido' })}
            />
            {errors.email && <p className="text-[11px] text-red-700 italic font-serif">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] uppercase tracking-[0.3em] text-ink-700">Rol</label>
            <select className="ink-input" {...register('role')}>
              <option value="user">Suscriptor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={create.isPending}
            className="btn-broadsheet h-[52px] lg:col-span-1"
          >
            {create.isPending ? 'Creando…' : 'Enviar credenciales →'}
          </button>
        </form>
      )}

      {/* Buscador */}
      <div className="flex items-center gap-3 border-b border-ink-900/20 pb-2">
        <svg className="w-4 h-4 text-ink-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          placeholder="Buscar por nombre o correo…"
          className="flex-1 bg-transparent border-0 outline-none font-serif text-ink-900 placeholder:text-ink-500 placeholder:italic"
        />
      </div>

      {/* Tabla */}
      <div className="bg-cream-100 border border-ink-900/15 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-900/20 bg-cream-200/60">
              {['Nombre', 'Correo', 'Rol', 'Estado', 'Registro', 'Acción'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-[10px] uppercase tracking-[0.3em] text-ink-700 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/10">
            {isLoading && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-600 font-serif italic">Cargando suscriptores…</td></tr>
            )}
            {!isLoading && users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-ink-600 font-serif italic">Sin resultados.</td></tr>
            )}
            {users.map((u: User) => {
              const id = u._id ?? u.id ?? '';
              return (
                <tr key={id} className="hover:bg-cream-200/50 transition-colors">
                  <td className="px-4 py-3 font-serif text-ink-900">{u.name}</td>
                  <td className="px-4 py-3 text-ink-700">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-[0.28em] border border-ink-900/30 px-2 py-1">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] ${u.isActive ? 'text-emerald-800' : 'text-ink-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-700' : 'bg-ink-400'}`} />
                      {u.isActive ? 'activo' : 'inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-600 text-xs font-serif italic">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-MX') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle.mutate(id)}
                      disabled={toggle.isPending}
                      className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 underline decoration-ink-900/30 hover:decoration-ink-900 underline-offset-4 cursor-pointer"
                    >
                      {u.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ink-700">
          <span>Página {data.pagination.page} de {data.pagination.pages}</span>
          <div className="flex gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 border border-ink-900/30 hover:border-ink-900 disabled:opacity-30 cursor-pointer"
            >
              ← Ant.
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= data.pagination.pages}
              className="px-4 py-2 border border-ink-900/30 hover:border-ink-900 disabled:opacity-30 cursor-pointer"
            >
              Sig. →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

