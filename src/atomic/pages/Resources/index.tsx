import { useState } from 'react';
import { Link } from 'react-router-dom';

// ── Tipos ─────────────────────────────────────────────────────
type ResourceCategory = 'guias' | 'plantillas' | 'herramientas' | 'todos';

interface Resource {
  id: string;
  category: Exclude<ResourceCategory, 'todos'>;
  format: 'PDF' | 'XLSX' | 'DOCX' | 'ZIP';
  title: string;
  description: string;
  pages?: number;
  size: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  new?: boolean;
  premium?: boolean;
  downloadUrl: string;
}

// ── Datos ──────────────────────────────────────────────────────
const resources: Resource[] = [
  {
    id: 'guia-estructura-fiscal',
    category: 'guias',
    format: 'PDF',
    title: 'Guía de Estructuración Fiscal para PyMEs',
    description: 'Cómo elegir el régimen fiscal correcto según el tipo de empresa, volumen de ventas y perfil del socio.',
    pages: 48,
    size: '3.2 MB',
    level: 'Intermedio',
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'guia-sat-2026',
    category: 'guias',
    format: 'PDF',
    title: 'Novedades SAT 2026 — Lo que necesitas saber',
    description: 'Resumen ejecutivo de las reformas fiscales, nuevas obligaciones y cambios en plataformas digitales.',
    pages: 24,
    size: '1.8 MB',
    level: 'Avanzado',
    new: true,
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'guia-defensa-sat',
    category: 'guias',
    format: 'PDF',
    title: 'Manual de Defensa ante el SAT',
    description: 'Protocolo paso a paso para responder auditorías, cartas invitación y requerimientos de información.',
    pages: 62,
    size: '4.1 MB',
    level: 'Avanzado',
    premium: true,
    downloadUrl: '#',
  },
  {
    id: 'guia-precios-transferencia',
    category: 'guias',
    format: 'PDF',
    title: 'Precios de Transferencia — Guía Práctica',
    description: 'Principios OCDE aplicados a México, métodos de análisis y cómo preparar tu estudio de partes relacionadas.',
    pages: 38,
    size: '2.7 MB',
    level: 'Avanzado',
    premium: true,
    downloadUrl: '#',
  },
  {
    id: 'plantilla-flujo-caja',
    category: 'plantillas',
    format: 'XLSX',
    title: 'Plantilla de Flujo de Caja Empresarial',
    description: 'Control mensual de ingresos, egresos y proyección a 12 meses. Incluye dashboard visual automático.',
    size: '820 KB',
    level: 'Básico',
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'plantilla-deducibles',
    category: 'plantillas',
    format: 'XLSX',
    title: 'Registro de Gastos Deducibles',
    description: 'Clasificación por categoría SAT, validación automática de límites y resumen para declaración anual.',
    size: '640 KB',
    level: 'Intermedio',
    new: true,
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'plantilla-nomina',
    category: 'plantillas',
    format: 'XLSX',
    title: 'Cálculo de Nómina — Régimen de Sueldos',
    description: 'ISR, IMSS, INFONAVIT y percepciones integradas. Compatible con CFDI de nómina 4.0.',
    size: '1.1 MB',
    level: 'Avanzado',
    premium: true,
    downloadUrl: '#',
  },
  {
    id: 'plantilla-valuacion',
    category: 'plantillas',
    format: 'XLSX',
    title: 'Valuación de Empresa — Método DCF',
    description: 'Descuento de flujos de caja con supuestos editables, WACC y análisis de sensibilidad integrado.',
    size: '980 KB',
    level: 'Avanzado',
    premium: true,
    downloadUrl: '#',
  },
  {
    id: 'herramienta-checklist-auditoria',
    category: 'herramientas',
    format: 'PDF',
    title: 'Checklist de Auditoría Fiscal Interna',
    description: '87 puntos de revisión para detectar riesgos antes que el SAT. Actualizado a RMF 2026.',
    pages: 14,
    size: '560 KB',
    level: 'Intermedio',
    new: true,
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'herramienta-calculadora-isr',
    category: 'herramientas',
    format: 'XLSX',
    title: 'Calculadora ISR Persona Moral 2026',
    description: 'Coeficiente de utilidad, pagos provisionales y ajuste anual. Tablas actualizadas para el ejercicio 2026.',
    size: '490 KB',
    level: 'Intermedio',
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'herramienta-comparador-regimenes',
    category: 'herramientas',
    format: 'XLSX',
    title: 'Comparador de Regímenes Fiscales',
    description: 'Ingresa tus datos y compara ISR efectivo, IMSS, deducciones y carga total entre regímenes.',
    size: '720 KB',
    level: 'Básico',
    premium: false,
    downloadUrl: '#',
  },
  {
    id: 'herramienta-pack-contratos',
    category: 'herramientas',
    format: 'ZIP',
    title: 'Pack de Contratos Fiscales Básicos',
    description: 'Modelos editables: servicios, honorarios, arrendamiento y compraventa. Con cláusulas fiscales incluidas.',
    size: '2.3 MB',
    level: 'Básico',
    premium: true,
    downloadUrl: '#',
  },
];

const categories: { id: ResourceCategory; label: string; count?: number }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'guias', label: 'Guías' },
  { id: 'plantillas', label: 'Plantillas' },
  { id: 'herramientas', label: 'Herramientas' },
];

const formatColors: Record<Resource['format'], string> = {
  PDF: 'bg-red-50 text-red-700',
  XLSX: 'bg-green-50 text-green-700',
  DOCX: 'bg-blue-50 text-blue-700',
  ZIP: 'bg-amber-50 text-amber-700',
};

const levelColors: Record<Resource['level'], string> = {
  'Básico': 'text-ink-400',
  'Intermedio': 'text-ink-600',
  'Avanzado': 'text-ink-900',
};

// ── Componentes ────────────────────────────────────────────────
function ResourceCard({ resource }: { resource: Resource }) {
  const isPremium = resource.premium;

  return (
    <article className="group relative flex flex-col border border-cream-400 bg-white transition-shadow duration-200 hover:shadow-md">
      {resource.new && (
        <div className="absolute right-4 top-4 bg-ink-900 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-white">
          Nuevo
        </div>
      )}

      <div className="flex-1 p-7">
        {/* Format + Level */}
        <div className="mb-5 flex items-center gap-3">
          <span className={`inline-block rounded-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em] ${formatColors[resource.format]}`}>
            {resource.format}
          </span>
          <span className={`text-[10px] uppercase tracking-[0.18em] ${levelColors[resource.level]}`}>
            {resource.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[17px] font-bold leading-[1.2] tracking-[-0.015em] text-ink-900">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-[13px] leading-[1.6] text-ink-500">{resource.description}</p>

        {/* Meta */}
        <div className="mt-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.16em] text-ink-300">
          {resource.pages && <span>{resource.pages} págs.</span>}
          <span>{resource.size}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-cream-300 p-5">
        {isPremium ? (
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-400">Solo miembros</span>
            <Link
              to="/academia"
              className="inline-flex h-[36px] items-center gap-2 border border-ink-900 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white"
            >
              Desbloquear →
            </Link>
          </div>
        ) : (
          <a
            href={resource.downloadUrl}
            className="flex h-[36px] w-full items-center justify-between border border-cream-400 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
          >
            Descargar gratis
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}

// ── Página ─────────────────────────────────────────────────────
export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>('todos');
  const [search, setSearch] = useState('');

  const filtered = resources.filter((r) => {
    const matchCat = activeCategory === 'todos' || r.category === activeCategory;
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const counts: Record<ResourceCategory, number> = {
    todos: resources.length,
    guias: resources.filter((r) => r.category === 'guias').length,
    plantillas: resources.filter((r) => r.category === 'plantillas').length,
    herramientas: resources.filter((r) => r.category === 'herramientas').length,
  };

  const freeCount = resources.filter((r) => !r.premium).length;
  const premiumCount = resources.filter((r) => r.premium).length;

  return (
    <div className="bg-cream-50 text-ink-900">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="container-app py-12 lg:py-16">
          <div className="mb-9 flex flex-wrap items-center justify-between gap-4 border-b border-cream-400 pb-4">
            <p className="text-[10px] uppercase tracking-[0.34em] text-ink-400">Biblioteca de recursos</p>
            <Link to="/academia" className="link-grow text-[10px] font-bold uppercase tracking-[0.24em] text-ink-900">
              Acceso completo →
            </Link>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
            <div>
              <h1 className="text-[clamp(48px,8vw,108px)] font-bold leading-[0.86] tracking-[-0.035em]">
                Recursos
                <span className="block font-serif italic font-normal tracking-[-0.055em]">fiscales.</span>
              </h1>
              <p className="mt-7 max-w-[520px] text-[16px] leading-relaxed text-ink-600">
                Guías, plantillas y herramientas prácticas para empresarios y contadores. Descargables gratuitos y material premium de la Academia.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 border border-cream-400 bg-white">
              {[
                { n: String(resources.length), label: 'Recursos totales' },
                { n: String(freeCount), label: 'Gratis' },
                { n: String(premiumCount), label: 'Premium' },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col items-center justify-center py-8 [&:not(:last-child)]:border-r [&:not(:last-child)]:border-cream-300">
                  <span className="font-serif text-[42px] italic leading-none tracking-[-0.06em] text-ink-900">{n}</span>
                  <span className="mt-2 text-[9px] uppercase tracking-[0.22em] text-ink-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Filtros ───────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-white">
        <div className="container-app">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            {/* Categorías */}
            <nav className="flex items-center gap-1">
              {categories.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`inline-flex h-9 items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors ${
                    activeCategory === id
                      ? 'bg-ink-900 text-white'
                      : 'text-ink-400 hover:text-ink-900'
                  }`}
                >
                  {label}
                  <span className={`text-[9px] ${activeCategory === id ? 'text-white/60' : 'text-ink-300'}`}>
                    {counts[id]}
                  </span>
                </button>
              ))}
            </nav>

            {/* Búsqueda */}
            <div className="relative">
              <svg className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar recursos…"
                className="h-9 w-[220px] border border-cream-400 bg-cream-50 pl-9 pr-4 text-[12px] placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid de recursos ──────────────────────────────────── */}
      <section className="container-app py-10 lg:py-14">
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-serif text-[22px] italic text-ink-300">Sin resultados para "{search}"</p>
            <button onClick={() => { setSearch(''); setActiveCategory('todos'); }} className="mt-6 text-[11px] uppercase tracking-[0.2em] text-ink-500 underline underline-offset-4">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-400">
                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── CTA Premium ───────────────────────────────────────── */}
      <section className="border-t border-cream-400 bg-ink-900 text-white">
        <div className="container-app py-16 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">— Academia · Suscripción</p>
              <h2 className="mt-5 font-serif text-[clamp(36px,5vw,64px)] font-normal leading-[0.9] tracking-[-0.055em]">
                Desbloquea todos<br />
                los <span className="italic tracking-[-0.07em]">recursos premium.</span>
              </h2>
              <p className="mt-6 max-w-[480px] text-[15px] leading-relaxed text-white/55">
                Acceso ilimitado a plantillas avanzadas, guías técnicas y herramientas exclusivas. Incluido en tu suscripción a la Academia.
              </p>
              <Link
                to="/academia"
                className="mt-8 inline-flex h-[44px] items-center gap-4 bg-white px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-cream-100"
              >
                Ver planes →
              </Link>
            </div>
            <div className="hidden border border-white/15 bg-white/5 p-8 lg:block">
              {resources
                .filter((r) => r.premium)
                .slice(0, 3)
                .map((r, i) => (
                  <div key={r.id} className={`flex items-start gap-4 py-4 ${i !== 0 ? 'border-t border-white/10' : ''}`}>
                    <span className={`mt-0.5 inline-block shrink-0 rounded-sm px-1.5 py-0.5 text-[8px] font-bold uppercase ${formatColors[r.format]}`}>
                      {r.format}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold leading-tight text-white">{r.title}</p>
                      <p className="mt-1 text-[11px] text-white/35">{r.level} · {r.size}</p>
                    </div>
                    <svg className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                ))}
              <div className="mt-4 border-t border-white/10 pt-4 text-center text-[10px] uppercase tracking-[0.2em] text-white/30">
                + {premiumCount - 3} recursos más con membresía
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
