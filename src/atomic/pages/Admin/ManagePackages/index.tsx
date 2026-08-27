import { useMemo, useState } from 'react';
import { usePackages, useCreatePackage, useUpdatePackage } from '@hooks/usePackages';
import { useCourses } from '@hooks/useCourses';
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

export default function ManagePackages() {
  const { data: packages = [], isLoading } = usePackages();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const create = useCreatePackage();
  const update = useUpdatePackage();

  // Índice paquete por tier (si ya existe en BD)
  const byTier = useMemo(() => {
    const map: Partial<Record<PackageTier, Package>> = {};
    for (const p of packages) if (p.tier) map[p.tier] = p;
    return map;
  }, [packages]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Academia</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Paquetes</h1>
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

      {isLoading ? (
        <p className="p-8 text-sm text-ink-500">Cargando…</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TIERS.map((def) => {
            const pkg = byTier[def.tier];
            return (
              <TierCard
                key={def.tier}
                def={def}
                pkg={pkg}
                courses={courses}
                onCreate={(data) => create.mutate(data as any)}
                onUpdate={(id, data) => update.mutate({ id, data })}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function TierCard({
  def,
  pkg,
  courses,
  onCreate,
  onUpdate,
}: {
  def: TierDef;
  pkg?: Package;
  courses: Course[];
  onCreate: (data: Partial<Package>) => void;
  onUpdate: (id: string, data: Partial<Package>) => void;
}) {
  const [editing, setEditing] = useState(false);
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
            {pkg?.benefits?.allCourses ? 'Todos' : `${pkg?.courseIds.length ?? 0}`}
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
