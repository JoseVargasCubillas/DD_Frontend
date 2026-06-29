import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal, useHeroReveal } from '@hooks/useReveal';

const profiles = [
  {
    eyebrow: 'Primario',
    type: 'Para empresarios',
    description:
      'Dueños y socios de PyMEs y medianas empresas que quieren tomar decisiones fiscales informadas sin depender 100% de su contador. Estrategia, blindaje y planeación a largo plazo.',
    tags: ['Pymes', 'Dirección', 'Estrategia', 'Patrimonio'],
  },
  {
    eyebrow: 'Secundario',
    type: 'Para contadores',
    description:
      'Profesionales fiscales y despachos que quieren especializarse en estrategia y dar un servicio más completo a sus clientes. Track específico con material técnico avanzado.',
    tags: ['Contadores', 'Despachos', 'Consultoría', 'Defensa'],
  },
];

const includes = [
  { number: '01', text: '+120 horas', emphasis: 'de contenido' },
  { number: '02', text: 'Cursos nuevos', emphasis: 'cada mes' },
  { number: '03', text: 'Sesiones', emphasis: 'mastermind' },
  { number: '04', text: 'Descargables', emphasis: 'exclusivos' },
  { number: '05', text: 'Acceso', emphasis: '24/7 · app' },
];

const courses = [
  {
    id: '01',
    title: 'Estrategia Fiscal 2026',
    description:
      'De la declaración a la arquitectura. Aprende a estructurar tu empresa para pagar lo justo, no lo de más.',
    duration: '18 hrs',
    level: 'Avanzado',
    modules: '2026',
    featured: true,
  },
  {
    id: '02',
    title: 'Equipos de Alto Impacto',
    description:
      'Crea blindaje corporativo y fiscal con estructuras que protegen tu patrimonio y optimizan tus impuestos.',
    duration: '8 hrs',
    level: 'Intermedio',
    modules: 'Nuevo',
  },
  {
    id: '03',
    title: 'Deducciones Inteligentes',
    description:
      'Entiende cómo actúa el SAT, cuándo impugnar y cómo construir una defensa fiscal sólida.',
    duration: '6 hrs',
    level: 'Avanzado',
    modules: 'Nuevo',
  },
  {
    id: '04',
    title: 'Precios de Transferencia',
    description:
      'Entiende operaciones entre partes relacionadas y reduce riesgos fiscales con documentación clara.',
    duration: '10 hrs',
    level: 'Avanzado',
    modules: 'Especialidad',
  },
  {
    id: '05',
    title: 'Derechos de Autor',
    description:
      'Aprende a estructurar propiedad intelectual, regalías y esquemas de protección legal.',
    duration: '5 hrs',
    level: 'Básico',
    modules: 'Nuevo',
  },
];

const instructors = [
  {
    id: '01',
    name: 'Diego Díaz',
    role: 'Estratega principal',
    description: 'Fundador de Díaz Lara. 25 años. Autor de 3 libros.',
  },
  {
    id: '02',
    name: 'Especialista 2',
    role: 'Precios de transferencia',
    description: '+12 años en BEPS y estudios internacionales.',
  },
  {
    id: '03',
    name: 'Especialista 3',
    role: 'Defensa SAT',
    description: 'Abogado fiscal con +15 años en defensa contenciosa.',
  },
  {
    id: '04',
    name: 'Especialista 4',
    role: 'Holdings',
    description: 'Estructuras corporativas para grupos familiares.',
  },
];

const plans = [
  {
    name: 'Entrepreneur',
    price: 'X,XXX',
    period: 'mes',
    description: '7 días gratis · cancela cuando quieras',
    features: [
      'Acceso ilimitado al catálogo',
      '+120 hrs de contenido',
      'Consultor especialista asignado',
      'Soporte vía chat empresarial',
    ],
    cta: 'Empezar gratis 7 días',
    highlight: false,
  },
  {
    name: 'Business',
    price: 'X,XXX',
    period: 'mes',
    description: 'Premium · cancelación flexible',
    features: [
      'Todo lo anterior incluido',
      'Consultor senior · 8+ años exp.',
      'Reportes de avance trimestrales',
      'Mastermind mensual en vivo',
      'Material descargable exclusivo',
    ],
    cta: 'Empezar gratis 7 días',
    highlight: true,
  },
  {
    name: 'Master',
    price: 'XX,XXX',
    period: 'mes',
    description: 'Plazas limitadas',
    features: [
      'Todo lo anterior incluido',
      'Mentoría directa con Diego',
      'Sesiones 1-a-1 mensuales',
      'Implementación supervisada',
      'Acceso a eventos VIP',
    ],
    cta: 'Aplicar a Master',
    highlight: false,
  },
];

const b2bFeatures = [
  'Acceso colectivo desde 3 usuarios',
  'Facturación corporativa (CFDI)',
  'Seguimiento de progreso por miembro',
  'Asesor de cuenta dedicado',
];

const faq = [
  {
    q: '¿Necesito experiencia previa en contabilidad?',
    a: 'No. La Academia está diseñada tanto para empresarios sin formación contable como para contadores que quieren elevar su criterio fiscal.',
  },
  {
    q: '¿Puedo cancelar en cualquier momento?',
    a: 'Sí. En el plan mensual puedes cancelar antes del siguiente ciclo sin penalización ni trámites complicados.',
  },
  {
    q: '¿Las clases son grabadas o en vivo?',
    a: 'Ambas. Tenemos sesiones en vivo cada semana y acceso permanente a la biblioteca completa de grabaciones.',
  },
  {
    q: '¿Hay certificado al finalizar?',
    a: 'Sí. Al completar cada curso recibes un certificado de participación emitido por Díaz Lara Consultores.',
  },
  {
    q: '¿Qué pasa si no puedo asistir a una clase en vivo?',
    a: 'Todas las sesiones quedan grabadas y disponibles en tu perfil dentro de las 24 horas siguientes.',
  },
];

const academyFaq = [
  {
    q: '¿Cómo funciona la prueba gratis?',
    a: 'Te registras con tu email, eliges el plan, ingresas tu tarjeta y tienes acceso completo durante 7 días. Si cancelas antes del día 7, no se te cobra nada. Si no cancelas, se inicia tu suscripción.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí. Puedes cancelar tu suscripción antes del siguiente ciclo desde tu cuenta.',
  },
  {
    q: '¿Los cursos se actualizan?',
    a: 'Sí. El catálogo se actualiza con contenido nuevo y sesiones mensuales.',
  },
  {
    q: '¿Hay certificación?',
    a: 'Sí. Algunos cursos incluyen constancia o certificación según el módulo.',
  },
  {
    q: '¿Cómo se accede a las masterminds?',
    a: 'Desde tu panel de alumno, cuando tu plan incluya acceso a sesiones mastermind.',
  },
  {
    q: '¿Emiten factura?',
    a: 'Sí. Puedes solicitar factura con tus datos fiscales.',
  },
];

/* ── Componentes locales ─────────────────────────────────── */

function SectionMeta({
  index,
  label,
  right,
  dark = false,
}: {
  index: string;
  label: string;
  right?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`grid border-b pb-7 text-[10px] uppercase tracking-[0.24em] md:grid-cols-[120px_minmax(0,1fr)_180px] ${
        dark ? 'border-white/10 text-white/30' : 'border-cream-400 text-ink-300'
      }`}
    >
      <p>
        {index} /<span className="block">{label}</span>
      </p>
      <span />
      {right && <p className="mt-3 text-left md:mt-0 md:text-right">{right}</p>}
    </div>
  );
}

function FaqItem({ q, a, number, defaultOpen = false }: { q: string; a: string; number: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-cream-400">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="grid w-full cursor-pointer grid-cols-[64px_minmax(0,1fr)_24px] items-start gap-6 py-8 text-left"
      >
        <span className="font-serif text-[24px] italic leading-none tracking-[-0.04em] text-ink-300">{number}.</span>
        <span className="pr-8 font-serif text-[30px] leading-[1.08] tracking-[-0.045em] text-ink-900">{q}</span>
        <span className="mt-1 shrink-0 text-[24px] leading-none text-ink-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <p className="ml-[88px] max-w-[820px] pb-8 text-[15px] leading-[1.75] text-ink-500">{a}</p>
      )}
    </div>
  );
}

/* ── Página principal ────────────────────────────────────── */

export default function Academy() {
  const heroRef           = useHeroReveal();
  const profilesRef       = useReveal();
  const includesRef       = useReveal();
  const coursesRef        = useReveal();
  const instructorsRef    = useReveal();
  const plansRef          = useReveal();

  return (
    <div className="bg-cream-50 text-ink-900">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1328px] px-5 pb-16 pt-10 sm:px-8 lg:px-0 lg:pb-[102px] lg:pt-20">
          <div className="flex items-center justify-between border-b border-cream-400 pb-6 text-[10px] uppercase tracking-[0.24em] text-ink-300">
            <p>— Academia · Suscripción mensual</p>
            <p>+120 hrs · Contenido nuevo cada mes</p>
          </div>

          <div className="grid gap-12 pt-[78px] lg:grid-cols-[minmax(0,1.3fr)_minmax(430px,542px)] lg:items-end lg:gap-20">
            <div ref={heroRef} className="hero-reveal max-w-[710px]">
              <h1 className="academy-hero-title font-serif font-normal leading-[0.86] tracking-[-0.06em]">
                <span className="line-mask"><span>La academia</span></span>
                <span className="line-mask">
                  <span>
                    donde <em className="italic tracking-[-0.075em]">aprendes a ser</em>
                  </span>
                </span>
                <span className="line-mask italic-late"><span>empresario.</span></span>
              </h1>
              <p className="mt-8 max-w-[580px] text-[17px] leading-[1.52] text-ink-500 md:text-[19px]">
                Más de 120 horas de cursos especializados en estrategia fiscal mexicana, sesiones mastermind mensuales en vivo y contenido nuevo cada semana. Un solo pago con acceso anual.
              </p>
              <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link to="/checkout" className="btn-primary justify-center">
                  Comenzar →
                </Link>
                <a href="#contenido" className="btn-secondary justify-center">
                  Ver catálogo
                </a>
              </div>
            </div>

            <div className="relative aspect-[542/965] w-full border border-ink-900/20 bg-[linear-gradient(135deg,#1a1a1a,#2a2a2a)] text-white">
              <button
                type="button"
                aria-label="Reproducir video de Academia"
                className="absolute left-1/2 top-1/2 flex h-[68px] w-[68px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/60 text-white/80 transition-colors hover:border-white hover:text-white"
              >
                <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[12px] border-y-transparent border-l-current" />
              </button>
              <div className="absolute bottom-6 left-6 text-[9px] uppercase tracking-[0.22em] text-white/35">— Tour 360°</div>
              <div className="absolute bottom-6 right-6 text-[9px] uppercase tracking-[0.22em] text-white/35">02:14</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 Perfiles ──────────────────────────────────────── */}
      <section id="contenido" className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              01 /<br />
              Audiencia
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Diseñada para
              <span className="block">
                dos <span className="italic tracking-[-0.07em]">perfiles.</span>
              </span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">— Empresarios + Contadores</p>
          </div>

          <div ref={profilesRef} className="stagger-grid mt-[68px] grid border-l border-t border-cream-400 bg-cream-50 md:grid-cols-2">
            {profiles.map(({ eyebrow, type, description, tags }, i) => (
              <div key={type} data-s={String(i)} className="flex min-h-[360px] flex-col justify-between border-b border-r border-cream-400 px-10 py-12 md:px-[42px] md:py-[50px]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— {eyebrow}</p>
                  <h3 className="mt-7 font-serif text-[38px] font-normal leading-[1.04] tracking-[-0.045em] text-ink-900">
                    {type.split(' ')[0]}{' '}
                    <span className="italic tracking-[-0.06em]">{type.split(' ')[1]}</span>
                  </h3>
                  <p className="mt-7 max-w-[500px] font-serif text-[18px] leading-[1.55] tracking-[-0.015em] text-ink-500">
                    {description}
                  </p>
                </div>
                <div className="mt-9 flex flex-wrap gap-2 border-t border-cream-400 pt-5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-cream-400 px-3 py-2 text-[9px] uppercase tracking-[0.2em] text-ink-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 Membresía ─────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              02 /<br />
              Beneficios
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Qué incluye
              <span className="block">
                tu <span className="italic tracking-[-0.07em]">membresía.</span>
              </span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">Acceso ilimitado · 24/7</p>
          </div>

          <div
            ref={includesRef}
            className="stagger-grid mt-[68px] grid border-l border-t border-cream-400 bg-cream-50 sm:grid-cols-2 lg:grid-cols-5"
          >
            {includes.map(({ number, text, emphasis }, i) => (
              <div
                key={number}
                data-s={String(i)}
                className="group flex min-h-[172px] cursor-pointer flex-col justify-between border-b border-r border-cream-400 px-6 py-8 transition-colors duration-200 hover:bg-[#0b0b0b]"
              >
                <p className="font-serif text-[46px] italic leading-none tracking-[-0.06em] text-ink-300 transition-colors duration-200 group-hover:text-white">
                  {number}
                </p>
                <p className="max-w-[130px] text-[18px] leading-[1.05] tracking-[-0.035em] text-ink-900 transition-colors duration-200 group-hover:text-white">
                  {text}
                  <span className="block font-serif italic tracking-[-0.055em]">{emphasis}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 Cursos ────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              03 /<br />
              Catálogo
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Cursos
              <span className="block italic tracking-[-0.07em]">destacados.</span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">+40 cursos · 8 categorías</p>
          </div>

          <div
            ref={coursesRef}
            className="stagger-grid mt-[68px] grid border-l border-t border-cream-400 bg-cream-50 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]"
          >
            {courses.map(({ title, duration, level, featured }, i) => (
              <article
                key={title}
                data-s={String(i)}
                className={`group flex cursor-pointer flex-col justify-between border-b border-r border-cream-400 transition-colors duration-200 hover:bg-[#0b0b0b] ${
                  featured ? 'min-h-[476px] p-7 md:col-span-2 lg:col-span-1 lg:row-span-2' : 'min-h-[238px] p-6'
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300 transition-colors duration-200 group-hover:text-white/45">
                    — {featured ? 'Curso insignia · ' : ''}{duration}
                  </p>
                  <h3
                    className={`font-serif font-normal leading-[0.95] tracking-[-0.05em] text-ink-900 transition-colors duration-200 group-hover:text-white ${
                      featured ? 'mt-7 max-w-[330px] text-[38px]' : 'mt-6 max-w-[220px] text-[25px]'
                    }`}
                  >
                    {title === 'Estrategia Fiscal 2026' && (
                      <>
                        Estrategia <span className="italic tracking-[-0.065em]">Fiscal</span>
                        <span className="block">2026</span>
                      </>
                    )}
                    {title === 'Equipos de Alto Impacto' && (
                      <>
                        Equipos de Alto
                        <span className="block italic tracking-[-0.065em]">Impacto</span>
                      </>
                    )}
                    {title === 'Deducciones Inteligentes' && (
                      <>
                        Deducciones
                        <span className="block italic tracking-[-0.065em]">Inteligentes</span>
                      </>
                    )}
                    {title === 'Precios de Transferencia' && (
                      <>
                        Precios de
                        <span className="block italic tracking-[-0.065em]">Transferencia</span>
                      </>
                    )}
                    {title === 'Derechos de Autor' && (
                      <>
                        Derechos de <span className="italic tracking-[-0.065em]">Autor</span>
                      </>
                    )}
                  </h3>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-cream-400 pt-4 text-[10px] uppercase tracking-[0.2em] text-ink-400 transition-colors duration-200 group-hover:border-white/20 group-hover:text-white/45">
                  <span>{level}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-ink-900 text-[14px] leading-none text-ink-900 transition-colors duration-200 group-hover:border-white group-hover:text-white">
                    →
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/cursos" className="btn-secondary">
              Ver catálogo completo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 04 Instructor ────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              04 /<br />
              Ponentes
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Quién
              <span className="block italic tracking-[-0.07em]">imparte.</span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">7 ponentes · expertos</p>
          </div>

          <div ref={instructorsRef} className="stagger-grid mt-[68px] grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {instructors.map(({ id, name, role, description }, i) => (
              <article key={id} data-s={String(i)} className="border border-cream-400 bg-cream-50">
                <div className="flex aspect-[1.04] items-center justify-center bg-[#eee9df] text-[10px] tracking-[0.24em] text-ink-300">
                  [ {id === '01' ? 'Foto Diego' : 'Foto experto'} ]
                </div>
                <div className="min-h-[122px] border-t border-cream-400 px-6 py-5">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-300">— {role}</p>
                  <h3 className="mt-3 font-serif text-[25px] font-normal leading-[1.08] tracking-[-0.045em] text-ink-900">
                    {name}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.35] text-ink-500">{description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/acerca" className="btn-secondary">
              Ver todos los ponentes →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 05 Planes ────────────────────────────────────────── */}
      <section className="border-b border-white/10 bg-[#0b0b0b] text-white">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-white/15 pb-8 text-[10px] uppercase tracking-[0.24em] text-white/35 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              05 /<br />
              Inversión
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-white md:text-[66px]">
              Tres planes.
              <span className="block">
                Una <span className="italic tracking-[-0.07em]">academia.</span>
              </span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">— MXN + IVA</p>
          </div>

          <div
            ref={plansRef}
            className="stagger-grid mt-[68px] grid border-l border-t border-white/20 md:grid-cols-3"
          >
            {plans.map(({ name, price, period, description, features, cta, highlight }, i) => (
              <div
                key={name}
                data-s={String(i)}
                className={`relative flex min-h-[560px] flex-col border-b border-r p-8 ${
                  highlight
                    ? 'border-cream-400 bg-cream-50 text-ink-900'
                    : 'border-white/20 bg-[#0b0b0b] text-white'
                }`}
              >
                {highlight && (
                  <div className="absolute inset-x-0 top-0 flex h-[28px] items-center justify-center bg-[#78562a] text-[8px] uppercase tracking-[0.32em] text-cream-50">
                    Más demandado
                  </div>
                )}
                <p
                  className={`text-[10px] uppercase tracking-[0.24em] ${highlight ? 'mt-10 text-ink-300' : 'text-white/35'}`}
                >
                  — {name === 'Entrepreneur' ? 'Plan básico' : name === 'Business' ? 'Más demandado' : 'Acceso total'}
                </p>
                <h3 className="mt-5 font-serif text-[42px] italic leading-none tracking-[-0.055em]">{name}</h3>
                <div className="mt-6 flex items-end gap-2">
                  <span className="pb-3 font-serif text-[14px]">$</span>
                  <span className="font-serif text-[62px] leading-none tracking-[-0.065em]">{price}</span>
                  <span className={`pb-3 text-[10px] uppercase tracking-[0.18em] ${highlight ? 'text-ink-400' : 'text-white/35'}`}>
                    /{period}
                  </span>
                </div>
                <p className={`mt-3 text-[10px] uppercase tracking-[0.24em] ${highlight ? 'text-ink-300' : 'text-white/35'}`}>
                  — {description}
                </p>
                <ul className={`mt-8 flex-1 divide-y ${highlight ? 'divide-cream-400' : 'divide-white/12'}`}>
                  {features.map((f) => (
                    <li key={f} className={`flex items-start gap-4 py-3 text-[13px] leading-[1.45] ${highlight ? 'text-ink-500' : 'text-white/68'}`}>
                      <span className={`mt-0.5 shrink-0 ${highlight ? 'text-ink-300' : 'text-white/35'}`}>→</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/checkout"
                  className={`mt-8 flex h-[48px] w-full items-center justify-between border px-5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    highlight
                      ? 'border-ink-900 bg-[#0b0b0b] text-white hover:bg-ink-900'
                      : 'border-white/55 text-white hover:bg-white hover:text-ink-900'
                  }`}
                >
                  {cta} <span>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 B2B ───────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">
              06 / Para<br />
              empresas
            </p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Academia
              <span className="block">
                para tu <span className="italic tracking-[-0.07em]">despacho.</span>
              </span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">— Plan B2B</p>
          </div>

          <div className="grid gap-16 pt-[72px] lg:grid-cols-[minmax(0,620px)_480px] lg:items-start lg:gap-[70px]">
            <div>
              <h3 className="font-serif text-[50px] font-normal leading-[0.9] tracking-[-0.055em] text-ink-900 md:text-[58px]">
                Capacita a tu equipo
                <span className="block">
                  de un <span className="italic tracking-[-0.07em]">solo golpe.</span>
                </span>
              </h3>
              <p className="mt-9 max-w-[520px] font-serif text-[17px] leading-[1.65] tracking-[-0.01em] text-ink-500">
                Si lideras un despacho o firma de contadores, el plan B2B te permite suscribir a todo tu equipo, acceder a reportes consolidados de avance, y compartir el mismo nivel técnico de capacitación que reciben los clientes de Diego.
              </p>
              <div className="mt-9 grid max-w-[620px] border-l border-t border-cream-400 sm:grid-cols-2">
                {[
                  ['01', 'Acceso para', 'todo el equipo'],
                  ['02', 'Reportes de', 'avance'],
                  ['03', 'Capacitación', 'certificada'],
                  ['04', 'Onboarding', 'dedicado'],
                ].map(([num, line, italic]) => (
                  <div key={num} className="min-h-[134px] border-b border-r border-cream-400 px-7 py-6">
                    <p className="font-serif text-[38px] italic leading-none text-ink-300">{num}</p>
                    <p className="mt-4 max-w-[140px] font-serif text-[17px] leading-[1.08] tracking-[-0.025em] text-ink-900">
                      {line}
                      <span className="block italic tracking-[-0.055em]">{italic}</span>
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/contacto" className="mt-9 flex h-[50px] w-fit min-w-[198px] items-center justify-between bg-[#0b0b0b] px-6 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-900">
                Habla con ventas <span className="ml-8">→</span>
              </Link>
            </div>

            <div className="border border-ink-900 bg-cream-50 p-10 lg:mt-[104px]">
              <p className="font-serif text-[64px] italic leading-none tracking-[-0.06em] text-[#78562a]">~B2B</p>
              <h3 className="mt-8 font-serif text-[30px] font-normal leading-[0.95] tracking-[-0.045em] text-ink-900">
                Academia for
                <span className="block italic tracking-[-0.06em]">Teams</span>
              </h3>
              <p className="mt-5 max-w-[360px] text-[14px] leading-[1.55] text-ink-500">
                Plan empresarial con licencias por usuario, descuentos por volumen y soporte dedicado. Ideal para despachos de 5+ contadores o departamentos de finanzas internos.
              </p>
              <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                — Desde 5 usuarios · cotización a medida
              </p>
              <Link to="/contacto" className="mt-5 flex h-[52px] items-center justify-between border border-ink-900 px-6 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-[#0b0b0b] hover:text-white">
                Solicitar propuesta <span>→</span>
              </Link>
              </div>
          </div>
        </div>
      </section>

      {/* ── 07 Testimonio ────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 py-[108px] sm:px-8 lg:px-0 lg:py-[132px]">
          <div className="flex items-start justify-between text-[10px] uppercase tracking-[0.24em] text-ink-300">
            <p>07 / Voces</p>
            <p>01 / 12 alumnos</p>
          </div>
          <div className="mx-auto max-w-[1030px] pt-[86px] text-center">
            <blockquote className="font-serif text-[42px] font-normal leading-[1.08] tracking-[-0.055em] text-ink-900 md:text-[64px]">
              "La Academia ha sido la <span className="italic tracking-[-0.07em]">mejor</span>
              <span className="block">
                <span className="italic tracking-[-0.07em]">inversión</span> que hemos hecho con mi
              </span>
              <span className="block">equipo de socios.</span>
              <span className="block">
                Estrategias prácticas, <span className="italic tracking-[-0.07em]">no teoría.</span>"
              </span>
            </blockquote>
            <div className="mt-12 text-center">
              <p className="font-serif text-[18px] italic tracking-[-0.035em]">— Lic. Cristian Orlando García Cruz</p>
              <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                Director de consultoría administrativa y fiscal
              </p>
              <div className="mt-12 flex justify-center gap-2">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? 'bg-ink-900' : 'bg-ink-300/45'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 08 FAQ ───────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-[104px] sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.24em] text-ink-300 md:grid-cols-[120px_minmax(0,1fr)_220px]">
            <p className="leading-[1.7]">08 / FAQ</p>
            <h2 className="font-serif text-[54px] font-normal normal-case leading-[0.92] tracking-[-0.055em] text-ink-900 md:text-[66px]">
              Preguntas
              <span className="block italic tracking-[-0.07em]">frecuentes.</span>
            </h2>
            <p className="hidden justify-self-end pb-5 md:block">6 preguntas</p>
          </div>
          <div className="mx-auto mt-[78px] max-w-[930px] border-t border-cream-400">
            {academyFaq.map(({ q, a }, i) => (
              <FaqItem key={q} q={q} a={a} number={String(i + 1).padStart(2, '0')} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 Trial CTA ─────────────────────────────────────── */}
      <section className="bg-[#0b0b0b] text-white">
        <div className="mx-auto max-w-[1184px] px-5 py-[108px] sm:px-8 lg:px-0 lg:py-[132px]">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">09 / Empieza hoy</p>
            <h2 className="mx-auto mt-8 max-w-[840px] font-serif text-[60px] font-normal leading-[0.9] tracking-[-0.06em] text-cream-50 md:text-[86px]">
              Siete días.
              <span className="block">
                <span className="italic tracking-[-0.075em]">Cero</span> compromiso.
              </span>
            </h2>
            <p className="mx-auto mt-8 max-w-[520px] font-serif text-[18px] italic leading-[1.35] tracking-[-0.02em] text-white/55">
              "Si no es para ti, cancela antes del día 7 y no se cobra nada."
            </p>
            <Link to="/checkout" className="mx-auto mt-10 flex h-[44px] w-fit min-w-[210px] items-center justify-between bg-cream-50 px-6 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white">
              Empezar prueba gratis <span className="ml-5">→</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
