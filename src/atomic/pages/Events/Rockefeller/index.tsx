import { useEffect, useMemo, useRef, useState } from 'react';
import HubspotForm from '@molecules/HubspotForm';
import { HUBSPOT_FORMS } from '@utils/hubspotForms';
import { useEvents } from '@hooks/useEvents';
import { useNowTick } from '@hooks/useNowTick';
import diegoPortrait from '../../../../../assets/eventos/LEF_img_001.png';
import oscarPortrait from '../../../../../assets/eventos/oscar-cayetano.png';
import {
  FALLBACK_CALENDAR_EVENTS,
  getNextRockefellerEvent,
  isRockefellerEvent,
  loadStoredCalendarEvents,
  mergeCalendarEventSources,
  type CalendarEventSummary,
} from '@utils/eventCalendar';

/**
 * Landing "Estrategia Rockefeller" — entrenamiento presencial de 3 días en CDMX.
 * Diseno adaptado del wireframe compartido preservando la paleta clay-tierra
 * + tipografia editorial (Baskerville + Helvetica) del sitio.
 *
 * Hero: skyline de NYC en escala de grises + overlay dorado + composicion
 * editorial. El formulario de registro esta reemplazado por el embed de
 * HubSpot (portal 49215056, form 2fe02947-b452-4695-89c3-fb08c97055d2).
 *
 * La fecha se sincroniza con el calendario editorial (utils/eventCalendar):
 * usa el proximo evento cuyo slug/titulo coincide con "rockefeller" /
 * "4e-codigo-rockefeller" — mismo patron que Estrategia Fiscal / CEO.
 */

const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== 'false';

const HUBSPOT_PORTAL_ID = HUBSPOT_FORMS.rockefeller.portalId;
const HUBSPOT_FORM_ID = HUBSPOT_FORMS.rockefeller.formId;

const FALLBACK_ROCKEFELLER: CalendarEventSummary =
  FALLBACK_CALENDAR_EVENTS.find(isRockefellerEvent) ?? FALLBACK_CALENDAR_EVENTS[0];

// "20–22 noviembre · 2026"
const formatRangeDate = (startISO: string, days = 3) => {
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return 'Fecha por definir';
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  const monthFmt = new Intl.DateTimeFormat('es-MX', { month: 'long' });
  const sameMonth = start.getMonth() === end.getMonth();
  const monthLabel = monthFmt.format(sameMonth ? start : end);
  const range = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${monthLabel}`
    : `${start.getDate()} ${monthFmt.format(start)} – ${end.getDate()} ${monthLabel}`;
  return `${range} · ${start.getFullYear()}`;
};

const formatStripDate = (startISO: string, days = 3) => {
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return 'Fecha por definir';
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  const monthFmt = new Intl.DateTimeFormat('es-MX', { month: 'long' });
  return `CDMX · ${start.getDate()}–${end.getDate()} de ${monthFmt.format(end)} ${start.getFullYear()}`;
};

const formatCierreDate = (startISO: string, days = 3) => {
  const start = new Date(startISO);
  if (Number.isNaN(start.getTime())) return 'próximamente en CDMX';
  const end = new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
  const monthFmt = new Intl.DateTimeFormat('es-MX', { month: 'long' });
  return `Del ${start.getDate()} al ${end.getDate()} de ${monthFmt.format(end)} · Ciudad de México`;
};

type DirigidoCard = { n: string; title: string; italic: string; body: string };

const dirigidoCards: DirigidoCard[] = [
  {
    n: '01',
    title: 'Directores',
    italic: 'y CEOs.',
    body: 'Directores de empresa que tengan su posición como CEO’s, así como líderes de área y departamento.',
  },
  {
    n: '02',
    title: 'Empresarios',
    italic: 'en crecimiento.',
    body: 'Empresarios que busquen el crecimiento y desarrollo de su compañía.',
  },
];

type Facilitador = {
  role: string;
  name: string;
  italic: string;
  bio: string;
  initials: string;
  photo: string;
};

const facilitadores: Facilitador[] = [
  {
    role: '— Coach ejecutivo · Liderazgo',
    name: 'Óscar',
    italic: 'Cayetano.',
    bio: 'Ingeniero Mecánico Administrador por el Tecnológico de Monterrey y Director de OCL México, representante en México de marcas alemanas de herramentales de precisión. Coach Ejecutivo Certificado por la ICC y Maxwell Leadership, con diploma en Comunicación Persuasiva por el MIT. Consultor de liderazgo con Díaz Lara. Combina su experiencia técnica e industrial con su labor como autor y consultor en liderazgo enfocado en formar líderes con visión y propósito.',
    initials: 'ÓC',
    photo: oscarPortrait,
  },
  {
    role: '— Estratega fiscal · Empresario',
    name: 'Diego',
    italic: 'Díaz.',
    bio: 'Un emprendedor que transformó su firma contable en una empresa multimillonaria con más de 50 colaboradores. Su experiencia va más allá de los libros: vivió en carne propia los desafíos fiscales y legales del emprendimiento, superando embargos y obstáculos financieros. Hoy, comparte sus aprendizajes para que tú evites esos errores y avances más rápido.',
    initials: 'DD',
    photo: diegoPortrait,
  },
];

type TemarioBlock = {
  roman: string;
  num: string;
  title: string;
  italic: string;
  body: string;
};

const temarioBlocks: TemarioBlock[] = [
  {
    roman: 'I',
    num: '01',
    title: 'Estrategia',
    italic: '.',
    body: 'Desarrollarás tu plan estratégico anual, así como una estrategia 10X.',
  },
  {
    roman: 'II',
    num: '02',
    title: 'Equipo',
    italic: '.',
    body: 'Ajustarás tu organigrama, clasificación de colaboradores, tu sistema de retroalimentación y el camino para lograr un accountability (entrega de cuentas) a un ownership (apropiamiento de los resultados).',
  },
  {
    roman: 'III',
    num: '03',
    title: 'Ejecución',
    italic: '.',
    body: 'Conocerás las 3 disciplinas de la ejecución, desarrollarás tus indicadores de utilidades (ganancias) así como tus tableros de indicadores.',
  },
  {
    roman: 'IV',
    num: '04',
    title: 'Efectivo',
    italic: '.',
    body: 'Aprenderás a leer un estado de resultados y un flujo de efectivo, con la finalidad de implementar tu propio flujo de efectivo que será tu reporte diario.',
  },
  {
    roman: 'V',
    num: '05',
    title: 'Agenda',
    italic: '.',
    body: 'Tu prioridad no es la operación, es el resultado y la meta. Tu agenda deberá estar estructurada de forma que tengas tiempo para lo prioritario.',
  },
];

const horarios: [string, string][] = [
  ['Viernes', '09:00 – 18:00 hrs'],
  ['Sábado', '16:00 – 22:00 hrs'],
  ['Domingo', '09:00 – 15:00 hrs'],
];

export default function RockefellerLanding() {
  const formRef = useRef<HTMLDivElement | null>(null);

  const scrollToRegistro = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const nowTick = useNowTick(30_000);
  const [storedEvents, setStoredEvents] = useState<CalendarEventSummary[]>(
    loadStoredCalendarEvents,
  );
  const { data: eventsData } = useEvents(
    ENABLE_EVENT_API_SYNC
      ? { limit: 100, status: 'upcoming' }
      : { limit: 0, status: 'upcoming' },
  );

  useEffect(() => {
    const refresh = () => setStoredEvents(loadStoredCalendarEvents());
    window.addEventListener('storage', refresh);
    window.addEventListener('dd-events-updated', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('dd-events-updated', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  const currentEvent = useMemo<CalendarEventSummary>(() => {
    const candidates = mergeCalendarEventSources(
      FALLBACK_CALENDAR_EVENTS,
      (eventsData?.data as CalendarEventSummary[] | undefined) ?? [],
      storedEvents,
    );
    return getNextRockefellerEvent(candidates, nowTick) ?? FALLBACK_ROCKEFELLER;
  }, [eventsData?.data, storedEvents, nowTick]);

  const currentEventDate = currentEvent.startDate || FALLBACK_ROCKEFELLER.startDate;
  const metaDateLabel = formatRangeDate(currentEventDate);
  const stripDateLabel = formatStripDate(currentEventDate);
  const cierreDateLabel = formatCierreDate(currentEventDate);
  const yearLabel = String(new Date(currentEventDate).getFullYear() || new Date().getFullYear());

  return (
    <main className="overflow-hidden bg-cream text-ink-900">
      <style>{`
        @keyframes ddRockGlow {
          0%, 100% { opacity: .82; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.05); }
        }
        @keyframes ddRockShine {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes ddRockAurora {
          0%, 100% { transform: translate3d(0,0,0)   scale(1);   opacity: .55; }
          50%      { transform: translate3d(3%,-2%,0) scale(1.08); opacity: .9;  }
        }
        .dd-rock-glow  { animation: ddRockGlow 6s ease-in-out infinite; }
        .dd-rock-aurora{ animation: ddRockAurora 10s ease-in-out infinite; }
        .dd-rock-shine {
          background-image: linear-gradient(
            100deg,
            #8a6a3d 0%,
            #b98a4a 35%,
            #d9a866 50%,
            #b98a4a 65%,
            #8a6a3d 100%
          );
          background-size: 220% 100%;
          background-position: 0 0;
          animation: ddRockShine 9s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .dd-rock-glow, .dd-rock-aurora, .dd-rock-shine { animation: none !important; }
          .dd-rock-shine { background: #c49454; -webkit-background-clip: text; background-clip: text; }
        }
      `}</style>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-[#050505] text-cream">
        {/* Foto skyline de fondo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[0] overflow-hidden">
          <img
            src="/eventos/rockefeller-hero.webp"
            alt=""
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover object-[center_40%]"
            style={{
              opacity: 0.32,
              filter: 'grayscale(1) contrast(1.05) brightness(0.85)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(5,5,5,0.60) 0%, rgba(5,5,5,0.40) 40%, rgba(5,5,5,0.85) 100%), linear-gradient(90deg, rgba(5,5,5,0.65) 0%, rgba(5,5,5,0.15) 55%, rgba(5,5,5,0.55) 100%)',
            }}
          />
        </div>

        {/* Halo dorado */}
        <div
          aria-hidden="true"
          className="dd-rock-glow pointer-events-none absolute z-[1] hidden lg:block"
          style={{
            right: '-6%',
            top: '10%',
            width: '820px',
            height: '820px',
            background:
              'radial-gradient(circle at 45% 55%, rgba(196,148,84,0.32) 0%, rgba(138,106,61,0.16) 32%, transparent 68%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Grano editorial */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        {/* Fade inferior */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-32"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(5,5,5,0.35) 40%, #050505 100%)',
          }}
        />

        {/* Strip superior cream */}
        <div className="relative z-[3] border-b border-cream/10 bg-cream px-5 py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.26em] text-ink-900 sm:px-8">
          <span className="mr-3 inline-block border border-ink-900/60 px-2 py-0.5 text-[9px] tracking-[0.22em]">
            Entrenamiento presencial
          </span>
          <span>{stripDateLabel}</span>
          <span className="mx-3 text-ink-600/50">·</span>
          <span>Cupos limitados</span>
        </div>

        {/* Contenido */}
        <div className="relative z-[3] mx-auto max-w-[1312px] px-5 py-24 sm:px-8 sm:py-28 lg:px-16 lg:py-32">
          <p className="mb-6 text-[10.5px] font-medium uppercase tracking-[0.32em] text-cream/55">
            <span className="text-[#c49454]">— 00</span> Programa insignia · CDMX {yearLabel}
          </p>

          <h1 className="font-sans font-bold uppercase leading-[0.94] tracking-[-0.055em] text-cream text-[60px] sm:text-[96px] lg:text-[130px] xl:text-[150px]">
            <span className="block">Estrategia</span>
            <span className="dd-rock-shine block bg-clip-text text-transparent">
              Rockefeller.
            </span>
          </h1>

          <p className="mt-8 max-w-[820px] border-l-2 border-[#8a6a3d] pl-6 font-serif text-[22px] italic leading-[1.35] tracking-[-0.010em] text-cream/85 sm:text-[26px]">
            Quién tiene la visión, <span className="not-italic text-cream">no pide permiso para crecer.</span>
          </p>

          <p className="mt-8 max-w-[640px] text-[15px] leading-[1.7] text-cream/78">
            El Taller Rockefeller es el sistema más preciso para crecer y estabilizar tu empresa. Aquí pasas de la
            estrategia a la acción, enfocándote en los puntos que realmente mueven tus indicadores hacia adelante,
            mientras aprendes a aprovechar oportunidades en lugar de solo gestionar adversidades.
          </p>

          <div className="mt-12 grid gap-0 border-y border-cream/20 sm:grid-cols-2">
            <div className="border-b border-cream/12 py-5 pr-10 sm:border-b-0 sm:border-r sm:pr-14">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">— Fecha</p>
              <p className="mt-2 font-serif text-[20px] italic text-cream">{metaDateLabel}</p>
            </div>
            <div className="py-5 sm:pl-14">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">— Sede</p>
              <p className="mt-2 font-serif text-[20px] italic text-cream">
                CDMX <span className="text-cream/70">presencial.</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToRegistro}
            className="mt-12 inline-flex min-h-14 cursor-pointer items-center gap-6 border border-cream bg-cream px-9 text-[11.5px] font-medium uppercase tracking-[0.24em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-8 hover:bg-cream-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            <span>Reservar mi lugar</span>
            <span className="font-serif text-[16px] italic normal-case tracking-normal">→</span>
          </button>
        </div>
      </section>

      {/* ============ OBJETIVO ============ */}
      <section className="border-y border-ink-900/10 bg-cream-200 px-5 py-24 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1080px] text-center">
          <p className="text-[18px] font-normal leading-[1.55] tracking-[0.002em] text-ink-900 sm:text-[26px] sm:leading-[1.5]">
            Desarrolla la estrategia de crecimiento para tu empresa dominando los{' '}
            <strong className="border-b border-ink-900/40 pb-[1px] font-serif text-[20px] font-normal tracking-[-0.005em] sm:text-[26px]">
              hábitos de Rockefeller
            </strong>{' '}
            que son explotados actualmente por instituciones bancarias, multinacionales y también por aquellos que
            decidieron crecer y diseñar una empresa que funcione estratégicamente generando{' '}
            <span className="font-serif italic text-[#6b4f2a]">utilidades y flujos de efectivo en exceso.</span>
          </p>
        </div>
      </section>

      {/* ============ DIRIGIDO A ============ */}
      <section className="px-5 py-24 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1312px]">
          <div className="mb-14 grid gap-8 border-b border-ink-900/10 pb-7 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <h2 className="font-serif text-[36px] font-normal leading-[1.02] tracking-[-0.022em] sm:text-[52px]">
                Dirigido <span className="italic">a.</span>
              </h2>
              <p className="mt-4 max-w-[680px] text-[15px] leading-[1.65] text-ink-800">
                Un entrenamiento pensado para quienes ya toman decisiones y necesitan un sistema —no más teoría.
              </p>
            </div>
            <p className="text-right text-[10px] font-medium uppercase leading-[1.6] tracking-[0.20em] text-ink-600">
              Presencial<br />CDMX {yearLabel}
            </p>
          </div>

          <div className="grid gap-px border border-ink-900/10 bg-ink-900/10 lg:grid-cols-2">
            {dirigidoCards.map((card) => (
              <article key={card.n} className="flex flex-col gap-4 bg-cream px-10 py-11">
                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#6b4f2a]">
                  — {card.n}
                </span>
                <h3 className="font-serif text-[26px] font-normal leading-[1.15] tracking-[-0.014em]">
                  {card.title} <span className="italic">{card.italic}</span>
                </h3>
                <p className="text-[13.5px] leading-[1.65] text-ink-800">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FACILITADORES ============ */}
      <section className="relative bg-ink-900 py-28 text-cream sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(180,150,110,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-16">
          <div className="mb-14 grid gap-6 border-b border-cream/20 pb-7 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <h2 className="font-serif text-[36px] font-normal leading-[1.02] tracking-[-0.022em] text-cream sm:text-[52px]">
                Sobre los <span className="italic">facilitadores.</span>
              </h2>
              <p className="mt-4 max-w-[680px] text-[15px] leading-[1.65] text-cream/75">
                Dos trayectorias, una misma tesis: el crecimiento se diseña. Nunca se improvisa.
              </p>
            </div>
            <p className="text-right text-[10px] font-medium uppercase leading-[1.6] tracking-[0.20em] text-cream/55">
              Dos<br />voces
            </p>
          </div>

          <div className="grid gap-px border border-cream/20 bg-cream/20 lg:grid-cols-2">
            {facilitadores.map((fac) => (
              <article key={fac.name} className="flex flex-col bg-ink-900">
                <div
                  className="relative flex h-[360px] w-full items-end overflow-hidden border-b border-cream/20 sm:h-[420px]"
                  style={{
                    background:
                      'radial-gradient(circle at 40% 40%, rgba(180,150,110,0.30) 0%, transparent 55%), linear-gradient(135deg, #2a2620 0%, #1a1611 50%, #0a0a0a 100%)',
                  }}
                >
                  <img
                    src={fac.photo}
                    alt={`${fac.name} ${fac.italic}`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-[center_top]"
                    style={{ filter: 'grayscale(0.15) contrast(1.02)' }}
                  />
                  {/* Overlay editorial para integrar la foto al lenguaje oscuro */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(10,10,10,0.20) 0%, rgba(10,10,10,0.05) 40%, rgba(10,10,10,0.85) 100%)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-5 top-5 z-[1] text-[9px] font-medium uppercase tracking-[0.24em] text-cream/60"
                  >
                    — Facilitador
                  </span>
                  <span className="relative z-[1] pb-5 pl-6 font-serif text-[16px] italic text-cream/80">
                    {fac.name} {fac.italic}
                  </span>
                </div>
                <div className="flex flex-col gap-5 px-10 py-11 sm:px-12 sm:py-12">
                  <span className="border-b border-cream/15 pb-3.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8a6a3d]">
                    {fac.role}
                  </span>
                  <h3 className="font-serif text-[38px] font-normal leading-[1] tracking-[-0.022em] text-cream sm:text-[44px]">
                    {fac.name} <span className="italic">{fac.italic}</span>
                  </h3>
                  <p className="text-[14px] leading-[1.75] text-cream/80">{fac.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TEMARIO ============ */}
      <section className="px-5 py-28 sm:px-8 lg:px-16 lg:py-32">
        <div className="mx-auto max-w-[1312px]">
          <div className="mb-14 grid gap-6 border-b border-ink-900/10 pb-7 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <h2 className="font-serif text-[36px] font-normal leading-[1.02] tracking-[-0.022em] sm:text-[52px]">
                Temario <span className="italic">Rockefeller.</span>
              </h2>
              <p className="mt-4 max-w-[680px] text-[15px] leading-[1.65] text-ink-800">
                Cinco bloques secuenciales. Del pensamiento estratégico al ejercicio operativo diario.
              </p>
            </div>
            <p className="text-right text-[10px] font-medium uppercase leading-[1.6] tracking-[0.20em] text-ink-600">
              Programa<br />completo
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-px border border-ink-900/10 bg-ink-900/10">
            {temarioBlocks.map((block) => (
              <article
                key={block.num}
                className="grid gap-8 bg-cream px-6 py-11 transition-colors duration-500 hover:bg-cream-200 sm:grid-cols-[120px_1.1fr_1.5fr] sm:gap-12 sm:px-14"
              >
                <div className="font-serif text-[56px] font-normal italic leading-[0.9] tracking-[-0.02em] text-[#6b4f2a] sm:text-[72px]">
                  {block.roman}
                </div>
                <div className="pt-1.5">
                  <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.28em] text-ink-600">
                    — Bloque {block.num}
                  </span>
                  <h3 className="font-sans text-[26px] font-bold uppercase leading-[1.1] tracking-[-0.030em] text-ink-900 sm:text-[32px]">
                    {block.title}
                    <span className="font-serif text-[24px] font-normal italic normal-case tracking-[-0.01em] text-[#6b4f2a] sm:text-[30px]">
                      {block.italic}
                    </span>
                  </h3>
                </div>
                <ul className="list-none">
                  <li className="relative py-3 pl-6 text-[14px] leading-[1.65] text-ink-800">
                    <span className="absolute left-0 top-3.5 font-serif italic text-[#6b4f2a]">—</span>
                    {block.body}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INVERSION ============ */}
      <section className="relative overflow-hidden border-t border-cream/10 bg-ink-800 px-5 py-28 text-center text-cream sm:px-8 lg:px-16 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(180,150,110,0.14),transparent_58%)]" />

        <div className="relative mx-auto max-w-[1180px]">
          <p className="mb-5 text-[10.5px] font-medium uppercase tracking-[0.32em] text-cream/55">
            — Inversión del entrenamiento
          </p>
          <h2 className="mx-auto mb-11 max-w-[880px] font-sans text-[42px] font-bold uppercase leading-[1.02] tracking-[-0.032em] text-cream sm:text-[56px]">
            Asegura tu <span className="text-[#8a6a3d]">lugar.</span>
          </h2>

          <div className="mx-auto grid max-w-[1080px] items-stretch border border-cream/20 bg-cream/[0.04] text-left lg:grid-cols-[1.15fr_1fr]">
            {/* Precio + CTA */}
            <div className="relative flex flex-col border-b border-cream/20 px-10 py-12 lg:border-b-0 lg:border-r">
              <div className="mb-1 flex items-baseline gap-3.5">
                <span className="text-[13px] font-medium uppercase tracking-[0.24em] text-cream/60">MXN</span>
                <span className="font-sans text-[64px] font-bold leading-[0.95] tracking-[-0.045em] text-cream sm:text-[88px]">
                  $74,997
                </span>
              </div>
              <div className="mb-5 text-[12px] font-medium uppercase tracking-[0.18em] text-cream/60">
                4,093 USD · <span className="opacity-70">precio incluye IVA</span>
              </div>
              <span className="mb-7 inline-block self-start border border-[#8a6a3d] px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.28em] text-[#8a6a3d]">
                — Incluye servicio de coffee
              </span>

              <div className="mt-auto border-t border-cream/15 pt-6">
                <button
                  type="button"
                  onClick={scrollToRegistro}
                  className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-6 bg-cream px-8 text-[11.5px] font-medium uppercase tracking-[0.24em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-7 hover:bg-cream-200 hover:shadow-[0_12px_30px_rgba(0,0,0,0.30)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                >
                  Reservar mi lugar
                  <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
                </button>
                <p className="mt-5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream/55">
                  — Cupos limitados. Confirmación por correo tras el registro.
                </p>
              </div>
            </div>

            {/* Detalles */}
            <div className="flex flex-col px-10 py-12">
              <p className="mb-2 border-b border-cream/20 pb-4 text-[10px] font-medium uppercase tracking-[0.30em] text-cream/55">
                — Detalles del entrenamiento
              </p>

              <div className="grid grid-cols-[130px_1fr] items-baseline gap-5 border-b border-cream/10 py-4">
                <span className="pt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-cream/55">
                  — Horario
                </span>
                <div className="flex flex-col gap-0.5 text-[13px] text-cream">
                  {horarios.map(([day, time]) => (
                    <span key={day} className="flex items-baseline justify-between gap-3">
                      <b className="pt-0.5 text-[9.5px] font-medium uppercase tracking-[0.18em] text-cream/55">
                        {day}
                      </b>
                      <span>{time}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[130px_1fr] items-baseline gap-5 border-b border-cream/10 py-4">
                <span className="pt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-cream/55">
                  — Duración
                </span>
                <span className="text-[14px] font-medium leading-[1.5] text-cream">
                  3 días <span className="font-normal text-cream/65">de entrenamiento.</span>
                </span>
              </div>

              <div className="grid grid-cols-[130px_1fr] items-baseline gap-5 py-4">
                <span className="pt-0.5 text-[9px] font-medium uppercase tracking-[0.24em] text-cream/55">
                  — Segunda persona
                </span>
                <span className="text-[14px] font-medium leading-[1.5] text-cream">
                  $29,997 MXN <span className="font-normal text-cream/65">/ 1,567 USD.</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ASESOR strip ============ */}
      <section className="border-y border-ink-900/10 bg-cream-200 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-12">
          <div>
            <p className="mb-2 text-[9.5px] font-medium uppercase tracking-[0.28em] text-ink-600">
              — ¿Tienes dudas antes de reservar?
            </p>
            <p className="font-serif text-[22px] leading-[1.25] tracking-[-0.012em] text-ink-900 sm:text-[26px]">
              Habla directamente con <span className="italic text-[#6b4f2a]">un asesor.</span> Resolvemos tus preguntas
              por WhatsApp antes de que reserves tu lugar.
            </p>
          </div>
          <a
            href="https://wa.me/525584001184?text=Hola%2C%20tengo%20dudas%20sobre%20el%20entrenamiento%20Estrategia%20Rockefeller."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-14 items-center gap-3.5 border border-[#6b4f2a] bg-[#8a6a3d] px-7 text-[11.5px] font-semibold uppercase tracking-[0.20em] text-cream shadow-[0_6px_18px_rgba(107,79,42,0.30)] transition-all duration-300 hover:-translate-y-0.5 hover:gap-4 hover:bg-[#6b4f2a] hover:shadow-[0_12px_28px_rgba(107,79,42,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b4f2a]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hablar con un asesor
            <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
          </a>
        </div>
      </section>

      {/* ============ REGISTRO · HubSpot ============ */}
      <section
        id="registro"
        ref={formRef}
        className="scroll-mt-24 relative overflow-hidden border-t border-cream/10 bg-ink-900 px-5 py-24 text-cream sm:px-8 lg:px-16 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(180,150,110,0.14),transparent_62%)]" />

        <div className="relative mx-auto grid max-w-[1180px] items-start gap-16 lg:grid-cols-[1fr_640px] lg:gap-20">
          <div>
            <h2 className="mb-7 font-serif text-[44px] font-normal leading-[0.98] tracking-[-0.024em] text-cream sm:text-[56px] lg:text-[60px]">
              Reserva tu <span className="italic">lugar en CDMX.</span>
            </h2>
            <p className="mb-9 max-w-[440px] text-[15px] leading-[1.7] text-cream/78">
              Déjanos tus datos y te enviamos el enlace de pago y las instrucciones logísticas. Cupos limitados para
              asegurar aprendizaje dirigido y aplicable.
            </p>

            <div className="border-y border-cream/20">
              <div className="grid grid-cols-[160px_1fr] items-baseline gap-5 border-b border-cream/10 py-4">
                <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">— Fecha</span>
                <span className="font-serif text-[17px] italic text-cream">{metaDateLabel}</span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline gap-5 border-b border-cream/10 py-4">
                <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">— Sede</span>
                <span className="font-serif text-[17px] italic text-cream">
                  CDMX <span className="text-cream/70">presencial.</span>
                </span>
              </div>
              <div className="grid grid-cols-[160px_1fr] items-baseline gap-5 py-4">
                <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">
                  — Inversión
                </span>
                <span className="font-serif text-[17px] italic text-cream">$74,997 MXN.</span>
              </div>
            </div>
          </div>

          {/* Card del formulario HubSpot */}
          <div className="relative border border-ink-900/30 bg-cream p-9 text-ink-900 shadow-[0_40px_100px_rgba(0,0,0,0.42),0_12px_30px_rgba(0,0,0,0.22)] sm:p-11">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">
              — Formulario de registro
            </p>
            <h3 className="mb-7 font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.016em] text-ink-900 sm:text-[32px]">
              Déjanos tus datos <span className="italic">y adentro.</span>
            </h3>

            <HubspotForm portalId={HUBSPOT_PORTAL_ID} formId={HUBSPOT_FORM_ID} />

            <div className="mt-6 border-t border-ink-900/10 pt-5 text-center font-serif text-[13px] italic text-ink-600">
              — Cupo válido tras confirmación de pago.
            </div>
          </div>
        </div>
      </section>

      {/* ============ CIERRE ============ */}
      <section className="relative overflow-hidden border-t border-ink-900/10 bg-cream-200 px-5 py-28 text-center sm:px-8 lg:px-16 lg:py-32">
        <div className="dd-rock-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(196,148,84,0.14),transparent_60%)]" />
        <div
          className="dd-rock-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(180,150,110,0.10),transparent_58%)]"
          style={{ animationDelay: '2s', animationDuration: '12s' }}
        />
        <div className="relative mx-auto max-w-[1000px]">
          <h2 className="font-serif text-[42px] font-normal leading-[1.08] tracking-[-0.020em] text-ink-900 sm:text-[56px]">
            Quién tiene la visión, <span className="italic text-[#6b4f2a]">no pide permiso para crecer.</span>
          </h2>
          <div className="mt-9 font-serif text-[16px] italic text-ink-600 sm:text-[18px]">
            — {cierreDateLabel}
          </div>
        </div>
      </section>
    </main>
  );
}
