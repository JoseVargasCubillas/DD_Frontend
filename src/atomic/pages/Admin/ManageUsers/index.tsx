import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUsers, useToggleUserActive, useAdminCreateUser, useDeleteUser } from '@hooks/useUsers';
import { usePackages, useAssignPackage } from '@hooks/usePackages';
import { upsertManualSubscription } from '@utils/manualSubscriptions';
import type { User } from '@t/index';

interface NewUserForm { name: string; email: string; phone: string; role: 'user' | 'admin' | 'staff' }

const ASSIGNABLE_TIERS = ['master', 'business', 'entrepreneur', 'elite'];
const tierRank = (tier?: string) => {
  const i = ASSIGNABLE_TIERS.indexOf(String(tier || '').toLowerCase());
  return i === -1 ? 99 : i;
};

const SUBSCRIPTION_DURATION_OPTIONS: { days: number; label: string; sub: string }[] = [
  { days: 30, label: '1 mes', sub: '30 días de acceso' },
  { days: 90, label: '90 días', sub: '3 meses de acceso' },
  { days: 365, label: '1 año', sub: '365 días de acceso' },
];

export default function ManageUsers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showNew, setShowNew] = useState(false);
  const { data, isLoading } = useUsers({ page, limit: 20, search: search || undefined });
  const toggle = useToggleUserActive();
  const remove = useDeleteUser();
  const create = useAdminCreateUser();
  const assignPackage = useAssignPackage();
  const { data: allPackages = [] } = usePackages();
  // Paquetes oficiales (Entrepreneur / Business / Master) + Élite Privé (venta en eventos, sólo manual); los legacy no se asignan.
  const activePackages = useMemo(
    () => allPackages
      .filter((p) => p.isActive && ASSIGNABLE_TIERS.includes(String(p.tier || '').toLowerCase()))
      .sort((a, b) => tierRank(a.tier) - tierRank(b.tier)),
    [allPackages],
  );

  const [assignSubscription, setAssignSubscription] = useState(false);
  // Todos los miembros de la Academia deben recibir mailing; por defecto activo.
  const [subscribeMarketing, setSubscribeMarketing] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('');
  const [subscriptionDurationDays, setSubscriptionDurationDays] = useState<number>(365);

  useEffect(() => {
    if (!selectedPackageId && activePackages.length > 0) {
      setSelectedPackageId(activePackages[0]._id);
    }
  }, [activePackages, selectedPackageId]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewUserForm>({
    defaultValues: { role: 'user', phone: '' },
  });

  const effectiveMarketing = assignSubscription || subscribeMarketing;

  const onCreate = (form: NewUserForm) => {
    create.mutate({
      name: form.name,
      email: form.email,
      role: form.role,
      phone: form.phone.trim() || undefined,
      marketingStatus: effectiveMarketing ? 'subscribed' : 'never_subscribed',
    }, {
      onSuccess: (data) => {
        const done = () => { reset(); setShowNew(false); setAssignSubscription(false); setSubscribeMarketing(true); };
        const pkg = activePackages.find((p) => p._id === selectedPackageId);
        if (assignSubscription && selectedPackageId && pkg && data?.user?._id) {
          const userId = data.user._id;
          assignPackage.mutate(
            { userId, packageId: selectedPackageId, durationDays: subscriptionDurationDays },
            {
              onSuccess: () => {
                const start = new Date();
                const end = new Date(start.getTime() + subscriptionDurationDays * 86400000);
                upsertManualSubscription({
                  userId,
                  userName: form.name,
                  userEmail: form.email,
                  packageId: pkg._id,
                  packageName: pkg.name,
                  packageTier: pkg.tier,
                  price: pkg.price,
                  currency: pkg.currency,
                  durationDays: subscriptionDurationDays,
                  startDate: start.toISOString(),
                  currentPeriodEnd: end.toISOString(),
                  status: 'active',
                  source: 'manual_admin',
                });
                done();
              },
              onError: done,
            },
          );
        } else {
          done();
        }
      },
    });
  };

  const selectedPackage = activePackages.find((p) => p._id === selectedPackageId);
  const isSaving = create.isPending || assignPackage.isPending;

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
          className="bg-cream-100 border border-ink-900/20 p-6 space-y-5"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
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
            <div className="flex flex-col gap-1.5 lg:col-span-1">
              <label className="text-[10px] uppercase tracking-[0.3em] text-ink-700">Teléfono</label>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className="ink-input"
                placeholder="+52 55 1234 5678"
                {...register('phone', {
                  validate: (v) => !v.trim() || /^[+\d][\d\s().-]{6,}$/.test(v.trim()) || 'Teléfono inválido',
                })}
              />
              {errors.phone && <p className="text-[11px] text-red-700 italic font-serif">{errors.phone.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-[0.3em] text-ink-700">Rol</label>
              <select className="ink-input" {...register('role')}>
                <option value="user">Suscriptor</option>
                <option value="staff">Staff (solo check-in)</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="btn-broadsheet h-[52px] lg:col-span-1"
            >
              {isSaving ? 'Creando…' : 'Enviar credenciales →'}
            </button>
          </div>

          {/* Mailing */}
          <div className="border-t border-ink-900/15 pt-5">
            <label className={`flex items-center gap-3 text-sm text-ink-900 ${assignSubscription ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
              <input
                type="checkbox"
                checked={effectiveMarketing}
                disabled={assignSubscription}
                onChange={(e) => setSubscribeMarketing(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-ink-900 disabled:cursor-not-allowed"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink-700">
                Suscribir a mailing
              </span>
            </label>
            <p className="mt-2 pl-7 text-xs text-ink-500">
              {assignSubscription
                ? 'Todos los miembros de la Academia reciben el mailing; se activa automáticamente.'
                : 'Recibirá los correos de la comunidad. Desactívalo sólo si el cliente lo pidió.'}
            </p>
          </div>

          {/* Suscripción a la Academia */}
          <div className="border-t border-ink-900/15 pt-5">
            <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-900">
              <input
                type="checkbox"
                checked={assignSubscription}
                onChange={(e) => setAssignSubscription(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-ink-900"
              />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink-700">
                Asignar suscripción a la Academia
              </span>
            </label>

            {assignSubscription && (
              <div className="mt-4 space-y-4">
                {activePackages.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-ink-900/15 bg-cream p-4 text-center text-sm text-ink-600">
                    No hay paquetes activos. Crea uno en <span className="underline">Ventas · Paquetes</span>.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-ink-500">Paquete</p>
                      <div className="max-h-48 space-y-2 overflow-y-auto border border-ink-900/15 bg-cream p-2">
                        {activePackages.map((p) => (
                          <label
                            key={p._id}
                            className={`flex cursor-pointer items-start gap-3 border p-3 transition-colors ${
                              selectedPackageId === p._id
                                ? 'border-ink-900 bg-cream-200'
                                : 'border-transparent hover:bg-cream-200/60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="new-user-pkg"
                              value={p._id}
                              checked={selectedPackageId === p._id}
                              onChange={() => setSelectedPackageId(p._id)}
                              className="mt-1 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-serif text-base text-ink-900">{p.name}</p>
                              <p className="mt-0.5 text-xs text-ink-500">
                                {p.courseIds.length} cursos{p.tier ? ` · ${p.tier}` : ''}
                                {p.tier === 'elite' ? ' · venta en evento' : ''}
                              </p>
                            </div>
                            <p className="shrink-0 font-serif text-base text-ink-900">${p.price.toLocaleString('es-MX')}</p>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-[10px] uppercase tracking-[0.32em] text-ink-500">Duración</p>
                      <div className="space-y-2">
                        {SUBSCRIPTION_DURATION_OPTIONS.map((opt) => (
                          <label
                            key={opt.days}
                            className={`flex cursor-pointer items-center gap-3 border p-3 transition-colors ${
                              subscriptionDurationDays === opt.days
                                ? 'border-ink-900 bg-cream-200'
                                : 'border-ink-900/15 hover:bg-cream-200/60'
                            }`}
                          >
                            <input
                              type="radio"
                              name="new-user-duration"
                              value={opt.days}
                              checked={subscriptionDurationDays === opt.days}
                              onChange={() => setSubscriptionDurationDays(opt.days)}
                              className="shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="font-serif text-base text-ink-900">{opt.label}</p>
                              <p className="text-xs text-ink-500">{opt.sub}</p>
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-500">{opt.days} días</p>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedPackage && activePackages.length > 0 && (
                  <p className="text-xs text-ink-500">
                    Se asignará <span className="text-ink-900">{selectedPackage.name}</span> sin cobro
                    (no es una venta) con {subscriptionDurationDays} días de vigencia.
                  </p>
                )}
              </div>
            )}
          </div>
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
      <div className="bg-cream-100 border border-ink-900/15 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
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
                    <div className="flex items-center gap-5">
                      <button
                        onClick={() => toggle.mutate(id)}
                        disabled={toggle.isPending}
                        className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 underline decoration-ink-900/30 hover:decoration-ink-900 underline-offset-4 cursor-pointer"
                      >
                        {u.isActive ? 'Desactivar' : 'Activar'}
                      </button>
                      {/* Las cuentas admin no se pueden borrar (el servidor lo rechaza). */}
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (!window.confirm(`¿Eliminar a ${u.name} (${u.email})?\n\nSe borra la cuenta y no se puede deshacer. Sus órdenes y boletos no se borran.`)) return;
                            remove.mutate(id);
                          }}
                          disabled={remove.isPending}
                          className="text-[10px] uppercase tracking-[0.28em] text-red-700 hover:text-red-900 underline decoration-red-700/30 hover:decoration-red-900 underline-offset-4 cursor-pointer disabled:opacity-50"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
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

