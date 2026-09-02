import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { usePackages, useCreatePackage, useUpdatePackage, useDeletePackage, useAssignPackage } from '@hooks/usePackages';
import { useCourses } from '@hooks/useCourses';
import { usePromotions } from '@hooks/usePromotions';
import * as usersApi from '@api/users.api';
import type { BillingInterval, Course, Package, PackageBenefits, PackageTier } from '@t/index';

/**
 * Página Paquetes.
 *
 * Modelo:
 *  - Entrepreneur → acceso a todos los cursos.
 *  - Business     → Entrepreneur + masterclass bimestral + WhatsApp asesores.
 *  - Master       → Business - grupo asesores + WhatsApp directo con Diego Díaz.
 *
 * Los 3 paquetes son un catálogo fijo. Se crean automáticamente si faltan
 * y sólo se editan (precio, beneficios, cursos incluidos, URLs de WhatsApp).
 */

type TierDef = {
  tier: PackageTier;
  name: string;
  slug: string;
  eyebrow: string;
  suggestedPrice: number;
  defaultBenefits: PackageBenefits;
  copy: string;
};

const TIERS: TierDef[] = [
  {
    tier: 'entrepreneur',
    name: 'Entrepreneur',
    slug: 'entrepreneur',
    eyebrow: 'Plan de entrada',
    suggestedPrice: 4997,
    defaultBenefits: { allCourses: true, masterclassEveryTwoMonths: false },
    copy: 'Acceso completo al catálogo de la Academia (33 cursos).',
  },
  {
    tier: 'business',
    name: 'Business',
    slug: 'business',
    eyebrow: 'Más demandado',
    suggestedPrice: 14997,
    defaultBenefits: {
      allCourses: true,
      masterclassEveryTwoMonths: true,
      whatsappGroupAdvisors: { enabled: true, url: '' },
    },
    copy: 'Entrepreneur + masterclass bimestral + grupo de WhatsApp con asesores y consultores.',
  },
  {
    tier: 'master',
    name: 'Master',
    slug: 'master',
    eyebrow: 'Acompañamiento con Diego',
    suggestedPrice: 49997,
    defaultBenefits: {
      allCourses: true,
      masterclassEveryTwoMonths: true,
      whatsappDirectCEO: { enabled: true, url: '' },
    },
    copy: 'Business + acompañamiento directo por WhatsApp con Diego Díaz.',
  },
];

export default function ManagePackages({ hideHeader = false }: { hideHeader?: boolean } = {}) {
  const { data: packages = [], isLoading } = usePackages();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const create = useCreatePackage();
  const update = useUpdatePackage();
  const remove = useDeletePackage();
  const assign = useAssignPackage();
  const { data: promotions = [] } = usePromotions();
  const activePromotions = useMemo(
    () => promotions.filter((p) => p.isActive && (!p.expiresAt || new Date(p.expiresAt) > new Date())),
    [promotions],
  );

  // Índice paquete por tier (si ya existe en BD)
  const byTier = useMemo(() => {
    const map: Partial<Record<PackageTier, Package>> = {};
    for (const p of packages) if (p.tier) map[p.tier] = p;
    return map;
  }, [packages]);

  // Paquetes viejos sin tier oficial — se pueden borrar desde aquí
  const legacyPackages = useMemo(
    () =>
      packages.filter(
        (p) => !['entrepreneur', 'business', 'master'].includes(String(p.tier || '').toLowerCase()),
      ),
    [packages],
  );

  return (
    <div>
      {!hideHeader && (
        <header className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-900 leading-none">Paquetes</h1>
              <p className="text-sm text-ink-600 mt-3 max-w-2xl">
                Los tres productos de la Academia. Precio, cursos incluidos y beneficios (masterclass y grupos
                de WhatsApp) se controlan aquí. Estos paquetes son los que aparecen públicamente en{' '}
                <span className="font-mono text-[11px] px-1.5 py-0.5 bg-cream-200 border border-ink-900/10">
                  /academia
                </span>{' '}
                y los que asignas manualmente a un cliente desde su perfil.
              </p>
            </div>
          </div>
        </header>
      )}

      {isLoading ? (
        <p className="p-8 text-sm text-ink-500">Cargando…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TIERS.map((def) => {
              const pkg = byTier[def.tier];
              return (
                <TierCard
                  key={def.tier}
                  def={def}
                  pkg={pkg}
                  courses={courses}
                  promotions={activePromotions}
                  onCreate={(data) => create.mutate(data as any)}
                  onUpdate={(id, data) => update.mutate({ id, data })}
                  onAssign={(userId, packageId, durationDays) =>
                    assign.mutate({ userId, packageId, durationDays })
                  }
                />
              );
            })}
          </div>

          {legacyPackages.length > 0 && (
            <section className="mt-12 border border-red-400/50 bg-red-50/50 p-6">
              <header className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.4em] text-red-700">Limpieza</p>
                <h2 className="font-serif text-2xl text-ink-900 mt-1">Paquetes legacy sin categoría</h2>
                <p className="text-sm text-ink-600 mt-2 max-w-2xl">
                  Estos paquetes fueron creados antes del modelo Entrepreneur/Business/Master y aparecen
                  en <span className="font-mono text-[11px] px-1 bg-cream-200">/academia</span> con nombres
                  viejos. Elimínalos para que la landing use sólo los tres oficiales de arriba.
                </p>
              </header>
              <ul className="space-y-2">
                {legacyPackages.map((p) => (
                  <li
                    key={p._id || p.id}
                    className="flex items-center justify-between gap-4 border border-ink-900/10 bg-white px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-serif text-lg text-ink-900 truncate">{p.name || '(sin nombre)'}</p>
                      <p className="text-xs text-ink-500">
                        ${(p.price ?? 0).toLocaleString('es-MX')} {p.currency || 'MXN'} · id: {p._id || p.id}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Eliminar "${p.name || 'paquete sin nombre'}"? Esta acción no se puede deshacer.`)) {
                          remove.mutate(p._id || p.id!);
                        }
                      }}
                      className="text-[10px] uppercase tracking-[0.28em] border border-red-700 text-red-700 px-3 py-2 hover:bg-red-700 hover:text-white transition-colors"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function TierCard({
  def,
  pkg,
  courses,
  promotions,
  onCreate,
  onUpdate,
  onAssign,
}: {
  def: TierDef;
  pkg?: Package;
  courses: Course[];
  promotions: { _id?: string; id?: string; code: string; name?: string }[];
  onCreate: (data: Partial<Package>) => void;
  onUpdate: (id: string, data: Partial<Package>) => void;
  onAssign: (userId: string, packageId: string, durationDays?: number | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [selling, setSelling] = useState(false);
  const exists = !!pkg;

  return (
    <article className="bg-cream-100 border border-ink-900/15 p-6 flex flex-col gap-5">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">{def.eyebrow}</p>
        <h2 className="font-serif text-3xl text-ink-900 mt-1">{def.name}</h2>
        <p className="text-sm text-ink-600 mt-2">{pkg?.description || def.copy}</p>
      </header>

      <div className="border-t border-ink-900/10 pt-5">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-1">Precio</p>
        <p className="font-serif text-3xl text-ink-900">
          ${(pkg?.price ?? def.suggestedPrice).toLocaleString('es-MX')}{' '}
          <span className="text-xs text-ink-500 tracking-wide">
            {pkg?.currency ?? 'MXN'} · {intervalLabel(pkg?.billingInterval ?? 'year')}
          </span>
        </p>
      </div>

      <BenefitsSummary benefits={pkg?.benefits ?? def.defaultBenefits} />

      <div className="border-t border-ink-900/10 pt-4 text-xs text-ink-600 flex items-center justify-between">
        <span>
          Cursos incluidos:{' '}
          <b className="text-ink-900">
            {pkg?.benefits?.allCourses
              ? 'Todos'
              : `${Math.min(pkg?.courseIds.length ?? 0, courses.length || Number.MAX_SAFE_INTEGER)}`}
          </b>
        </span>
        <span
          className={
            'text-[10px] uppercase tracking-[0.28em] px-2 py-1 border ' +
            (pkg?.isActive
              ? 'border-emerald-700 text-emerald-700'
              : 'border-ink-400 text-ink-500')
          }
        >
          {exists ? (pkg!.isActive ? 'Activo' : 'Pausado') : 'Sin crear'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setEditing((v) => !v)}
        className="btn-broadsheet"
      >
        {editing ? 'Cerrar' : exists ? 'Editar paquete' : 'Crear paquete'}
      </button>

      {editing && (
        <TierEditor
          def={def}
          pkg={pkg}
          courses={courses}
          onSave={(data) => {
            if (exists) onUpdate(pkg!._id, data);
            else onCreate(data);
            setEditing(false);
          }}
        />
      )}

      {exists && (
        <>
          <button
            type="button"
            onClick={() => setSelling((v) => !v)}
            className="border border-ink-900 text-ink-900 py-2.5 text-[11px] uppercase tracking-[0.28em] hover:bg-ink-900 hover:text-cream transition-colors"
          >
            {selling ? 'Cerrar venta' : 'Vender o asignar'}
          </button>
          {selling && <SellPanel pkg={pkg!} promotions={promotions} onAssign={onAssign} />}
        </>
      )}
    </article>
  );
}

function BenefitsSummary({ benefits }: { benefits: PackageBenefits }) {
  const rows = [
    { on: benefits.allCourses, label: 'Acceso a los 33 cursos' },
    { on: benefits.masterclassEveryTwoMonths, label: 'Masterclass gratis cada 2 meses' },
    { on: !!benefits.whatsappGroupAdvisors?.enabled, label: 'Grupo WhatsApp con asesores' },
    { on: !!benefits.whatsappDirectCEO?.enabled, label: 'WhatsApp directo con Diego Díaz' },
  ];
  return (
    <ul className="text-sm text-ink-700 space-y-1.5">
      {rows.map((r) => (
        <li key={r.label} className="flex items-start gap-2">
          <span
            className={
              'mt-0.5 h-4 w-4 shrink-0 border ' +
              (r.on ? 'bg-ink-900 border-ink-900' : 'bg-transparent border-ink-400')
            }
            aria-hidden
          >
            {r.on && (
              <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2.5" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 10 3 3 7-7" />
              </svg>
            )}
          </span>
          <span className={r.on ? '' : 'text-ink-400 line-through'}>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}

function TierEditor({
  def,
  pkg,
  courses,
  onSave,
}: {
  def: TierDef;
  pkg?: Package;
  courses: Course[];
  onSave: (data: Partial<Package>) => void;
}) {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    price: number;
    currency: string;
    billingInterval: BillingInterval;
    isActive: boolean;
    isFeatured: boolean;
    courseIds: string[];
    benefits: PackageBenefits;
  }>({
    name: pkg?.name ?? def.name,
    description: pkg?.description ?? def.copy,
    price: pkg?.price ?? def.suggestedPrice,
    currency: pkg?.currency ?? 'MXN',
    billingInterval: pkg?.billingInterval ?? 'year',
    isActive: pkg?.isActive ?? true,
    isFeatured: pkg?.isFeatured ?? def.tier === 'business',
    courseIds: pkg?.courseIds ? [...pkg.courseIds] : [],
    benefits: { ...(pkg?.benefits ?? def.defaultBenefits) },
  });

  const toggleCourse = (cid: string) =>
    setForm((f) => ({
      ...f,
      courseIds: f.courseIds.includes(cid)
        ? f.courseIds.filter((x) => x !== cid)
        : [...f.courseIds, cid],
    }));

  const selectAllCourses = () =>
    setForm((f) => ({
      ...f,
      benefits: { ...f.benefits, allCourses: true },
      courseIds: courses.map((c) => String(c._id || c.id)),
    }));

  const clearCourses = () =>
    setForm((f) => ({ ...f, benefits: { ...f.benefits, allCourses: false }, courseIds: [] }));

  return (
    <div className="border-t border-ink-900/10 pt-5 space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="ink-label">Nombre público</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="ink-input" />
        </div>
        <div>
          <label className="ink-label">Precio</label>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className="ink-input flex-1"
            />
            <input
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value.toUpperCase() })}
              className="ink-input w-20 text-center uppercase"
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="ink-label">Descripción</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="ink-input font-serif"
          />
        </div>
        <div>
          <label className="ink-label">Ciclo de cobro</label>
          <select
            value={form.billingInterval}
            onChange={(e) => setForm({ ...form, billingInterval: e.target.value as BillingInterval })}
            className="ink-input cursor-pointer"
          >
            <option value="year">Anual</option>
            <option value="month">Mensual</option>
            <option value="lifetime">De por vida</option>
          </select>
        </div>
        <div className="flex items-center gap-4 pt-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-ink-700">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Activo
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-ink-700">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
            Destacar
          </label>
        </div>
      </div>

      {/* Beneficios */}
      <div className="border-t border-ink-900/10 pt-5">
        <p className="ink-label mb-3">Beneficios</p>
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.benefits.masterclassEveryTwoMonths}
              onChange={(e) =>
                setForm({
                  ...form,
                  benefits: { ...form.benefits, masterclassEveryTwoMonths: e.target.checked },
                })
              }
            />
            Masterclass gratis cada 2 meses
          </label>

          <div className="border border-ink-900/10 p-3 bg-cream-200/40">
            <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.benefits.whatsappGroupAdvisors?.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: {
                      ...form.benefits,
                      whatsappGroupAdvisors: {
                        enabled: e.target.checked,
                        url: form.benefits.whatsappGroupAdvisors?.url ?? '',
                      },
                    },
                  })
                }
              />
              Grupo de WhatsApp con asesores y consultores
            </label>
            {form.benefits.whatsappGroupAdvisors?.enabled && (
              <input
                placeholder="Enlace de invitación (https://chat.whatsapp.com/…)"
                value={form.benefits.whatsappGroupAdvisors.url ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: {
                      ...form.benefits,
                      whatsappGroupAdvisors: { enabled: true, url: e.target.value },
                    },
                  })
                }
                className="ink-input mt-2 text-xs"
              />
            )}
          </div>

          <div className="border border-ink-900/10 p-3 bg-cream-200/40">
            <label className="flex items-center gap-2 text-sm text-ink-700 cursor-pointer">
              <input
                type="checkbox"
                checked={!!form.benefits.whatsappDirectCEO?.enabled}
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: {
                      ...form.benefits,
                      whatsappDirectCEO: {
                        enabled: e.target.checked,
                        url: form.benefits.whatsappDirectCEO?.url ?? '',
                      },
                    },
                  })
                }
              />
              WhatsApp directo con Diego Díaz (CEO)
            </label>
            {form.benefits.whatsappDirectCEO?.enabled && (
              <input
                placeholder="Enlace o número (https://wa.me/52…)"
                value={form.benefits.whatsappDirectCEO.url ?? ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    benefits: {
                      ...form.benefits,
                      whatsappDirectCEO: { enabled: true, url: e.target.value },
                    },
                  })
                }
                className="ink-input mt-2 text-xs"
              />
            )}
          </div>
        </div>
      </div>

      {/* Cursos incluidos */}
      <div className="border-t border-ink-900/10 pt-5">
        <div className="flex items-center justify-between mb-2">
          <p className="ink-label !mb-0">Cursos incluidos</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAllCourses}
              className="text-[10px] uppercase tracking-[0.28em] text-ink-700 hover:text-ink-900 cursor-pointer"
            >
              Todos
            </button>
            <button
              type="button"
              onClick={clearCourses}
              className="text-[10px] uppercase tracking-[0.28em] text-ink-500 hover:text-red-700 cursor-pointer"
            >
              Ninguno
            </button>
          </div>
        </div>
        {form.benefits.allCourses ? (
          <p className="text-xs text-ink-600 bg-cream-200/40 border border-ink-900/10 p-3">
            Este paquete incluye <b>todos los cursos activos</b>. Los cursos nuevos se agregan automáticamente.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 max-h-48 overflow-y-auto border border-ink-900/10 p-2 bg-cream text-sm">
            {courses.map((c) => {
              const cid = String(c._id || c.id);
              const checked = form.courseIds.includes(cid);
              return (
                <label
                  key={cid}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-cream-200"
                >
                  <input type="checkbox" checked={checked} onChange={() => toggleCourse(cid)} />
                  <span className="font-serif text-ink-900 truncate">{c.title}</span>
                </label>
              );
            })}
            {courses.length === 0 && (
              <p className="text-xs text-ink-500 p-2 col-span-2">Crea cursos primero.</p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() =>
          onSave({
            name: form.name,
            slug: def.slug,
            tier: def.tier,
            description: form.description,
            price: form.price,
            currency: form.currency,
            paymentType: 'subscription',
            billingInterval: form.billingInterval,
            durationDays:
              form.billingInterval === 'year' ? 365 : form.billingInterval === 'month' ? 30 : 0,
            isActive: form.isActive,
            isFeatured: form.isFeatured,
            benefits: form.benefits,
            courseIds: form.benefits.allCourses
              ? courses.map((c) => String(c._id || c.id))
              : form.courseIds,
          })
        }
        className="btn-broadsheet w-full"
      >
        Guardar {def.name}
      </button>
    </div>
  );
}

function intervalLabel(interval: BillingInterval) {
  if (interval === 'year') return '/ año';
  if (interval === 'month') return '/ mes';
  return '/ único pago';
}

function SellPanel({
  pkg,
  promotions,
  onAssign,
}: {
  pkg: Package;
  promotions: { _id?: string; id?: string; code: string; name?: string }[];
  onAssign: (userId: string, packageId: string, durationDays?: number | null) => void;
}) {
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [durationMode, setDurationMode] = useState<'default' | 'custom'>('default');
  const [customDays, setCustomDays] = useState<number>(365);

  const defaultDays = pkg.durationDays ?? (pkg.billingInterval === 'year' ? 365 : pkg.billingInterval === 'month' ? 30 : 365);

  const buildStripeLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams({ pkg: String(pkg._id || pkg.id) });
    if (promoCode) params.set('promo', promoCode);
    return `${origin}/checkout?${params.toString()}`;
  };

  const copyLink = async () => {
    try {
      const link = buildStripeLink();
      await navigator.clipboard.writeText(link);
      toast.success('Link copiado al portapapeles');
    } catch {
      toast.error('No se pudo copiar');
    }
  };

  const assignByEmail = async () => {
    if (!email.trim()) return toast.error('Escribe un email');
    setAssigning(true);
    try {
      const res = await usersApi.listUsers({ search: email.trim(), limit: 5 });
      const rows = Array.isArray(res) ? res : res.data ?? [];
      const found = rows.find(
        (u: any) => String(u.email || '').toLowerCase() === email.trim().toLowerCase(),
      );
      if (!found) {
        toast.error(`No hay un usuario con email ${email}`);
        return;
      }
      const days = durationMode === 'default' ? defaultDays : customDays;
      onAssign(String(found._id || found.id), String(pkg._id || pkg.id), days);
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Error buscando usuario');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="border-t border-ink-900/10 pt-5 space-y-5">
      <div>
        <p className="ink-label mb-2">Link de checkout (Stripe)</p>
        <p className="text-xs text-ink-500 mb-3">
          Envía este link al cliente. Al pagar se le crea la suscripción automáticamente con la duración del paquete.
        </p>
        {promotions.length > 0 && (
          <select
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="ink-input cursor-pointer mb-3"
          >
            <option value="">Sin promoción</option>
            {promotions.map((p) => (
              <option key={p._id || p.id} value={p.code}>
                {p.code}{p.name ? ` — ${p.name}` : ''}
              </option>
            ))}
          </select>
        )}
        <div className="flex items-center gap-2">
          <code className="flex-1 truncate text-xs bg-cream-200 border border-ink-900/10 px-2 py-2 font-mono">
            {buildStripeLink()}
          </code>
          <button
            type="button"
            onClick={copyLink}
            className="cursor-pointer text-[10px] uppercase tracking-[0.28em] border border-ink-900 text-ink-900 px-3 py-2 hover:bg-ink-900 hover:text-cream transition-colors"
          >
            Copiar
          </button>
        </div>
      </div>

      <div className="border-t border-ink-900/10 pt-5">
        <p className="ink-label mb-2">Asignar manualmente</p>
        <p className="text-xs text-ink-500 mb-3">
          El cliente ya tiene cuenta y no pasará por Stripe. Se le otorga acceso inmediato por el tiempo elegido.
        </p>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto] mb-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.28em] text-ink-500 block mb-1">Duración</span>
            <select
              value={durationMode === 'default' ? 'default' : String(customDays)}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'default') {
                  setDurationMode('default');
                } else {
                  setDurationMode('custom');
                  setCustomDays(Number(v));
                }
              }}
              className="ink-input cursor-pointer"
            >
              <option value="default">Duración del paquete ({defaultDays} días)</option>
              <option value="30">1 mes</option>
              <option value="60">2 meses</option>
              <option value="90">3 meses</option>
              <option value="180">6 meses</option>
              <option value="270">9 meses</option>
              <option value="365">1 año</option>
              <option value="730">2 años</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="email"
            placeholder="email del cliente"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ink-input flex-1"
          />
          <button
            type="button"
            disabled={assigning}
            onClick={assignByEmail}
            className="cursor-pointer text-[10px] uppercase tracking-[0.28em] bg-ink-900 text-cream px-3 py-2 hover:bg-ink-700 transition-colors disabled:opacity-50"
          >
            {assigning ? 'Asignando…' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}
