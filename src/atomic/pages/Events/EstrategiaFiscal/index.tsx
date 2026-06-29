import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';
import heroDiego from '../../../../../assets/home/007_home_bios_DD.png';
import heroVideo from '../../../../../assets/eventos/Video EF.mp4';
import diegoPortrait from '../../../../../assets/eventos/LEF_img_001.png';
import irmaPortrait from '../../../../../assets/eventos/LEF_img 002.png';
import azucenaPortrait from '../../../../../assets/eventos/LEF_img 003.png';
import jessicaPortrait from '../../../../../assets/eventos/LEF_img_004.png';
import type { Event as SiteEvent } from '@t/index';

const EVENT_SLUG = 'estrategia-fiscal';
const EVENT_STORAGE_KEY = 'dd-admin-events';
const EVENT_DATE = '2026-08-28T09:00:00-06:00';
const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== 'false';
const dossierUrl = new URL('../../../../../assets/eventos/Seminario Estrategia Fiscal (2).pdf', import.meta.url).href;
const stripeCheckoutUrls = {
  general: String(import.meta.env.VITE_ESTRATEGIA_FISCAL_GENERAL_STRIPE_URL || ''),
  vip: String(import.meta.env.VITE_ESTRATEGIA_FISCAL_VIP_STRIPE_URL || ''),
};

const countdownLabels = [
  ['days', 'Días'],
  ['hours', 'Horas'],
  ['minutes', 'Min'],
  ['seconds', 'Seg'],
] as const;

const FALLBACK_EVENT: Pick<SiteEvent, 'title' | 'slug' | 'shortDescription' | 'description' | 'location' | 'startDate' | 'endDate' | 'modality'> = {
  title: 'Estrategia Fiscal Edición CDMX',
  slug: EVENT_SLUG,
  shortDescription: 'El evento emblema de Diego. Un día intensivo en CDMX con cierre de alto fiscal en mente.',
  description:
    'Un día intensivo para empresarios que quieren rediseñar la estrategia fiscal de su empresa antes del cierre del año.',
  location: 'WTC CDMX',
  startDate: EVENT_DATE,
  endDate: '2026-08-28T18:00:00-06:00',
  modality: 'in-person',
};

const loadStoredEvent = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as SiteEvent[]) : [];
    return events.find((event) => event.slug === EVENT_SLUG) ?? null;
  } catch {
    return null;
  }
};

const formatLandingDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha por definir';
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
    .format(date)
    .replace('.', '');
};

const formatHeaderDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Fecha por definir';
  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
};

const formatLandingTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Horario por definir';
  return new Intl.DateTimeFormat('es-MX', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

const formatModality = (modality: SiteEvent['modality']) => {
  if (modality === 'online') return 'Online';
  if (modality === 'hybrid') return 'Híbrido';
  return 'Presencial';
};

const audienceProfiles = [
  {
    number: 'i.',
    content: (
      <>
        Eres dueño de negocio, que <span className="font-serif italic">quiere capacitarse</span>{' '}
        <br />
        para entender mejor los números de su empresa
      </>
    ),
  },
  {
    number: 'ii.',
    content: (
      <>
        Sientes que pagas <span className="font-serif italic">más impuestos</span>{' '}
        <br />
        de los que deberías.
      </>
    ),
  },
  {
    number: 'iii.',
    content: (
      <>
        Has tenido <span className="font-serif italic">(o temes tener)</span> una revisión del SAT
      </>
    ),
  },
  {
    number: 'iv.',
    content: (
      <>
        Quieres una estrategia fiscal real, no sólo{' '}
        <br />
        <span className="font-serif italic">presentar declaraciones.</span>
      </>
    ),
  },
  {
    number: 'v.',
    content: (
      <>
        Buscas estructurar holding, partes relacionadas{' '}
        <br />o <span className="font-serif italic">reorganizar tu patrimonio</span>
      </>
    ),
  },
];

const learningCards = [
  {
    number: '01',
    title: (
      <>
        Cómo cobrarle{' '}
        <br />
        <span className="font-serif italic">correctamente</span>{' '}
        <br />a tu empresa
      </>
    ),
    items: [
      'Formas correctas de cobrarle a tu empresa',
      'Asimilados vs honorarios vs dividendos (visión práctica)',
      'Obligaciones reales que nadie explica',
      'Errores comunes que generan contingencias',
      'Cómo documentarlo correctamente',
    ],
  },
  {
    number: '02',
    title: (
      <>
        Deducciones{' '}
        <br />
        <span className="font-serif italic">estratégicas</span>{' '}
        <br />
        que si funcionan
      </>
    ),
    items: [
      'Deducciones reales para PF que le cobra a su empresa',
      'PPR como herramienta estratégica (no ahorro mágico)',
      'Deducción de automóvil >175k (qué sí se puede y qué no)',
      'Gastos que suelen mal aplicarse',
      'Errores que generan riesgo innecesario',
    ],
  },
  {
    number: '03',
    title: (
      <>
        Sistema básico{' '}
        <br />
        de <span className="font-serif italic">estructura fiscal</span>{' '}
        <br />
        empresarial
      </>
    ),
    items: [
      'Cuadrante de estructura fiscal',
      'Empresa operativa',
      'Empresa de servicios',
      'Empresa patrimonial',
      'Concepto general de separación',
    ],
  },
  {
    number: '04',
    title: (
      <>
        Señales de que{' '}
        <br />
        <span className="font-serif italic">necesitas algo más</span>{' '}
        <br />
        que optimización
      </>
    ),
    items: [
      'Cuando la facturación supera 25–30M',
      'Cuando existen múltiples razones sociales',
      'Cuando hay socios familiares',
      'Cuando hay expansión nacional',
      'Cuando el riesgo patrimonial aumenta',
    ],
  },
];

const agenda = [
  {
    time: '09:00',
    title: 'Registro y bienvenida',
    description: 'Acreditación, café de cortesía y networking inicial entre asistentes.',
    duration: '60 min',
  },
  {
    time: '10:00',
    title: 'Apertura: Panorama fiscal MX 2026',
    description: 'Por Diego Díaz. Estado actual del SAT, reformas vigentes y lo que viene en el resto del año.',
    duration: '90 min',
  },
  {
    time: '11:30',
    title: 'Bloque I: Blindaje fiscal',
    description: 'Los 7 documentos clave + 3 casos reales de revisión y cómo se resolvieron.',
    duration: '150 min',
  },
  {
    time: '14:00',
    title: 'Comida + networking',
    description: 'Comida formal incluida. Mesa con asignación por sector empresarial.',
    duration: '90 min',
  },
  {
    time: '15:30',
    title: 'Bloque II: Estructura y deducciones',
    description: 'Holding · Partes relacionadas · Deducciones inteligentes con ejercicios en vivo.',
    duration: '90 min',
  },
  {
    time: '17:00',
    title: 'Cierrre + Q&A en vivo con Diego Díaz',
    description: '60 minutos de preguntas y respuestas sin filtros. Asistentes prioritarios: tier General + VIP.',
    duration: '60 min',
  },
];

const speakers = [
  {
    name: 'Diego Díaz',
    role: 'Anfitrión · Estrategia fiscal',
    image: diegoPortrait,
    bio: 'Autor de 3 libros, 25 años de trayectoria, fundador de Díaz Lara. Conferencista y facilitador de temas fiscales y empresariales.',
  },
  {
    name: 'Imar Amor',
    role: 'Invitada',
    image: irmaPortrait,
    bio: 'Licenciada en Finanzas y Contaduría Pública. Colabora en la formación de empresarios con estructura empresarial y análisis financiero.',
  },
  {
    name: 'Jazmín Robles',
    role: 'Invitada',
    image: azucenaPortrait,
    bio: 'Abogada Fiscalista, Maestra en Derecho Fiscal y Doctorante en Ciencias de lo Fiscal. Distinción internacional "The Lawyer of the Year 2025"',
  },
  {
    name: 'Jessica Tapia',
    role: 'Invitada',
    image: jessicaPortrait,
    bio: 'Soporte especializado para revisar obligaciones, escenarios y documentación empresarial.',
  },
];

const tickets = [
  {
    eyebrow: 'Early bird',
    titleTop: 'Entrada',
    titleBottom: 'General',
    variant: 'general',
    cta: 'Conseguir mi lugar',
    href: stripeCheckoutUrls.general,
    items: ['Acceso completo al evento', 'Material digital descargable', 'Coffee break + comida'],
  },
  {
    eyebrow: 'Recomendado',
    titleTop: 'Acceso',
    titleBottom: 'VIP',
    variant: 'vip',
    cta: 'Quiero ser VIP',
    href: stripeCheckoutUrls.vip,
    items: ['Acceso completo al evento', 'Material digital + impreso', 'Coffee + comida', 'Networking estructurado', 'Prioridad en Q&A'],
  },
];

const faqItems = [
  {
    question: '¿Hay grabación si no puedo asistir?',
    answer:
      'El evento es 100% presencial. Por lo cual no hay grabación del mismo, para un evento grabado consultar opciones online.',
  },
  {
    question: '¿Puedo cancelar o transferir mi lugar?',
    answer: 'Puedes transferir tu lugar a otra persona avisando al equipo antes del cierre de registro.',
  },
  {
    question: '¿Emiten factura?',
    answer: 'Sí. Al completar tu compra podrás solicitar los datos necesarios para emitir tu factura.',
  },
  {
    question: '¿El contenido sirve si no soy contador?',
    answer: 'Sí. Está diseñado para empresarios que necesitan entender decisiones fiscales sin lenguaje técnico innecesario.',
  },
  {
    question: '¿Cuánto dura cada bloque y hay descansos?',
    answer: 'La agenda contempla bloques de trabajo durante el día, con comida y espacios de pausa incluidos.',
  },
  {
    question: '¿Tengo que llevar material extra?',
    answer: 'No. Recibirás el material necesario para seguir la sesión y tomar notas durante el seminario.',
  },
];

function getCountdown(targetDate: string) {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function useCountdown(targetDate: string) {
  const [time, setTime] = useState(() => getCountdown(targetDate));

  useEffect(() => {
    setTime(getCountdown(targetDate));
    const interval = window.setInterval(() => setTime(getCountdown(targetDate)), 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  return time;
}

function SectionFrame({
  label,
  marker,
  children,
  className = '',
}: {
  label: string;
  marker: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border-t border-cream-400 ${className}`}>
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-6 px-5 py-16 sm:px-7 md:py-20 lg:grid-cols-[112px_minmax(0,1fr)_112px] lg:px-10 lg:py-24">
        <div className="section-label text-[9px] tracking-[0.32em]">{marker}</div>
        <div>{children}</div>
        <div className="hidden text-right text-[9px] uppercase tracking-[0.32em] text-ink-300 lg:block">{label}</div>
      </div>
    </section>
  );
}

const FaqSection = memo(function FaqSection() {
  return (
    <section id="faq" className="border-t border-cream-400 bg-cream-50">
      <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:px-[32px] md:pb-[64px] md:pt-[86px]">
        <div className="grid items-end border-b border-cream-400 pb-[18px] md:grid-cols-[96px_minmax(0,1fr)_120px]">
          <p className="mb-6 text-[9px] uppercase leading-none tracking-[0.34em] text-ink-300 md:mb-[43px]">
            08 /{' '}
            <span>FAQ</span>
          </p>
          <h2 className="font-serif text-[clamp(55px,7.2vw,68px)] font-normal leading-[0.88] tracking-[-0.06em] text-ink-900">
            Preguntas
            <span className="block italic">frecuentes.</span>
          </h2>
          <p className="mb-[47px] hidden text-right text-[9px] lowercase tracking-[0.28em] text-ink-300 md:block">
            8 preguntas
          </p>
        </div>

        <div className="mx-auto mt-[50px] max-w-[644px] border-y border-cream-400">
          {faqItems.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0 ? true : undefined}
              className="group border-b border-cream-400 last:border-b-0"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[44px_minmax(0,1fr)_24px] items-start gap-[15px] py-[18px] text-ink-900 [&::-webkit-details-marker]:hidden">
                <span className="font-serif text-[20px] italic leading-[1.1] tracking-[-0.04em] text-ink-300">
                  {String(index + 1).padStart(2, '0')}.
                </span>
                <span className="font-serif text-[clamp(22px,2.7vw,26px)] font-normal leading-[1.08] tracking-[-0.052em]">
                  {faq.question}
                </span>
                <span className="text-right font-sans text-[20px] font-normal leading-none text-ink-400">
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">−</span>
                </span>
              </summary>
              <p className="-mt-[6px] max-w-[590px] pb-[30px] pl-[59px] pr-8 text-[12px] font-normal leading-[1.45] tracking-[-0.01em] text-ink-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
});

export default function EstrategiaFiscalLanding() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const unlockedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(true);
  const [syncedEvent, setSyncedEvent] = useState<SiteEvent | null>(() => loadStoredEvent());
  const { data: apiEvent } = useQuery({
    queryKey: ['event', EVENT_SLUG],
    queryFn: () => eventsApi.getEventBySlug(EVENT_SLUG),
    enabled: ENABLE_EVENT_API_SYNC,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // En el primer gesto del usuario, quita el mute directamente (el video ya está corriendo)
  useEffect(() => {
    const unlock = () => {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      const video = videoRef.current;
      if (video) {
        video.muted = false;
        video.volume = 1;
        setIsMuted(false);
      }
      window.removeEventListener('pointerdown', unlock);
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    return () => window.removeEventListener('pointerdown', unlock);
  }, []);

  useEffect(() => {
    const refreshEvent = () => setSyncedEvent(loadStoredEvent());
    window.addEventListener('storage', refreshEvent);
    window.addEventListener('dd-events-updated', refreshEvent);
    window.addEventListener('focus', refreshEvent);
    return () => {
      window.removeEventListener('storage', refreshEvent);
      window.removeEventListener('dd-events-updated', refreshEvent);
      window.removeEventListener('focus', refreshEvent);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    unlockedRef.current = true;
    video.muted = !video.muted;
    video.volume = video.muted ? 0 : 1;
    setIsMuted(video.muted);
  };

  const currentEvent = apiEvent ?? syncedEvent ?? FALLBACK_EVENT;
  const currentEventDate = currentEvent.startDate || EVENT_DATE;
  const currentEventLocation = currentEvent.location || FALLBACK_EVENT.location;
  const currentEventDescription =
    currentEvent.shortDescription || currentEvent.description || FALLBACK_EVENT.description;
  const currentEventModality = formatModality(currentEvent.modality);
  const currentEventTime = formatLandingTime(currentEventDate);
  const currentEventEndTime =
    currentEvent.endDate && !Number.isNaN(new Date(currentEvent.endDate).getTime())
      ? formatLandingTime(currentEvent.endDate)
      : '18:00';
  const countdown = useCountdown(currentEventDate);
  const featuredSpeakers = speakers;
  const countdownEntries = useMemo(
    () => countdownLabels.map(([key, label]) => ({ key, label, value: countdown[key] })),
    [countdown],
  );

  return (
    <div className="bg-cream-200 text-ink-900">

      <header className="bg-cream-200 border-b border-cream-400">
        <div className="mx-auto max-w-[1200px] px-5 pb-12 pt-7 sm:px-7 lg:px-10 lg:pb-16 lg:pt-9">
          <div className="flex flex-col gap-3 border-b border-cream-400 pb-7 text-[9px] uppercase tracking-[0.34em] text-ink-400 sm:flex-row sm:items-center sm:justify-between">
            <p>— Próximo evento · Seminario presencial</p>
            <p>{formatHeaderDate(currentEventDate)} — Quedan 23 cupos</p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-[9px] uppercase tracking-[0.28em] text-ink-400">
            <span className="border border-ink-900 bg-ink-900 px-4 py-2 text-white">Seminario · 1 día</span>
            <span className="border border-cream-400 px-4 py-2">{currentEventLocation}</span>
            <span className="border border-cream-400 px-4 py-2">
              {currentEventTime} — {currentEventEndTime}
            </span>
          </div>

          <p className="mt-6 text-[11px] text-ink-300 tracking-[0.05em]">—</p>

          <h1 className="ef-hero-title mt-3 max-w-[1080px] text-[clamp(58px,9.5vw,132px)] leading-[0.88] tracking-[-0.055em] text-ink-900">
            Estrategia
            <span className="block font-serif font-normal italic leading-[0.88] tracking-[-0.075em]">Fiscal</span>
          </h1>

          <p className="mt-5 max-w-[610px] text-[clamp(16px,1.8vw,22px)] font-normal leading-[1.16] tracking-[-0.025em] text-ink-500">
            “{currentEventDescription}”
          </p>

          {/* Video full-width sobre fondo cream */}
          <div className="mt-5">
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                src={heroVideo}
                poster={heroDiego}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full w-full object-cover object-center"
                aria-label="Video del seminario Estrategia Fiscal"
              />
              {/* Botón mute/unmute */}
              <button
                onClick={toggleMute}
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L19.5 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L19.5 10.94l-1.72-1.72Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06ZM15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1-.001-1.061Z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Datos + countdown */}
            <div className="grid border-t border-cream-400 lg:grid-cols-[minmax(0,700px)_1fr]">
              <div className="bg-white">
                <div className="grid grid-cols-2 border-b border-cream-300 sm:grid-cols-4">
                  {[
                    ['Fecha', formatLandingDate(currentEventDate)],
                    ['Sede', currentEventLocation],
                    ['Cupos', '90 / 100'],
                    ['Formato', currentEventModality],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white border-r border-cream-300 px-5 py-4 last:border-r-0">
                      <p className="text-[8px] uppercase tracking-[0.32em] text-ink-300">— {label}</p>
                      <p className="mt-5 text-[17px] leading-none text-ink-900">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-8 bg-white px-5 py-5 sm:gap-12">
                  {countdownEntries.map(({ key, label, value }) => (
                    <div key={key}>
                      <div className="ef-hero-numeral text-[clamp(34px,6vw,58px)] leading-none tracking-[-0.04em] text-ink-900">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="mt-2 text-[8px] uppercase tracking-[0.28em] text-ink-300">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block bg-cream-200 border-l border-cream-400" />
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a href="#formatos" className="btn-primary justify-center">
              Reservar mi lugar →
            </a>
            <a href={dossierUrl} download className="btn-secondary justify-center">
              Descargar dossier ↓
            </a>
            <p className="text-[9px] uppercase tracking-[0.32em] text-ink-400">
              — Cierra el 10 Jun · 23 cupos restantes
            </p>
          </div>
        </div>
      </header>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[96px] lg:px-10 lg:py-[118px]">
          <div className="grid items-start border-b border-cream-400 pb-0 md:grid-cols-[96px_minmax(0,1fr)_100px] lg:grid-cols-[128px_minmax(0,1fr)_120px]">
            <p className="mb-8 text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-0">
              01 /
              <br />
              Audiencia
            </p>
            <h2 className="max-w-[690px] text-[clamp(46px,6.1vw,76px)] font-normal leading-[0.92] tracking-[-0.045em] text-ink-900">
              Para <span className="font-serif italic tracking-[-0.06em]">quién</span> está{' '}
              <br />
              diseñado
            </h2>
            <p className="mt-5 hidden text-right text-[9px] uppercase tracking-[0.34em] text-ink-300 md:block">
              5 perfiles
            </p>
          </div>

          <div className="mt-14 grid md:mt-[50px] md:grid-cols-[96px_minmax(0,1fr)_100px] lg:grid-cols-[128px_minmax(0,1fr)_120px]">
            <div className="hidden md:block" />
            <div className="max-w-[930px]">
              {audienceProfiles.map((profile, index) => (
                <div
                  key={profile.number}
                  className={`grid grid-cols-[56px_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[70px_minmax(0,1fr)] md:pb-2 md:pt-[42px] ${
                    index < audienceProfiles.length - 1 ? 'border-b border-cream-400' : ''
                  }`}
                >
                  <span className="font-serif text-[23px] italic leading-none text-ink-300 md:text-[25px]">{profile.number}</span>
                  <p className="max-w-[820px] text-[clamp(23px,2.7vw,31px)] font-normal leading-[1.1] tracking-[-0.035em] text-ink-900">
                    {profile.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-cream-400 bg-cream-200">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[96px] lg:px-10 lg:py-[104px]">
          <div className="grid items-end border-b border-cream-400 md:grid-cols-[96px_minmax(0,1fr)_100px] lg:grid-cols-[128px_minmax(0,1fr)_120px]">
            <p className="mb-8 text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-[74px]">
              02 /
              <br />
              Aprendizajes
            </p>
            <h2 className="max-w-[650px] pb-2 text-[clamp(46px,6.1vw,76px)] font-normal leading-[0.92] tracking-[-0.045em] text-ink-900">
              Esto es lo que{' '}
              <br />
              <span className="font-serif italic tracking-[-0.06em]">aprenderas</span>
            </h2>
            <p className="mb-[78px] hidden text-right text-[9px] uppercase tracking-[0.34em] text-ink-300 md:block">
              6 módulos
            </p>
          </div>

          <div className="mt-[52px] grid border border-cream-400 bg-cream-50 md:grid-cols-2">
            {learningCards.map((card, index) => (
              <article
                key={card.number}
                className={`min-h-[260px] border-cream-400 p-6 sm:p-7 md:min-h-[221px] ${
                  index < 2 ? 'border-b' : ''
                } ${index % 2 === 0 ? 'md:border-r' : ''} ${index !== learningCards.length - 1 ? 'max-md:border-b' : ''}`}
              >
                <div className="grid gap-8 sm:grid-cols-[154px_minmax(0,1fr)] sm:gap-5">
                  <div>
                    <div className="font-serif text-[44px] italic leading-none tracking-[-0.05em] text-ink-300">
                      {card.number}
                    </div>
                    <h3 className="mt-9 max-w-[190px] text-[22px] font-normal leading-[1.06] tracking-[-0.04em] text-ink-900 md:text-[20px]">
                      {card.title}
                    </h3>
                  </div>
                  <ul className="space-y-[10px] text-[13px] font-normal leading-[1.22] tracking-[-0.02em] text-ink-400 md:text-[12px]">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.35em] text-[11px] leading-none text-ink-300">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="agenda" className="border-t border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[104px] lg:px-10 lg:py-[112px]">
          <div className="grid items-end border-b border-cream-400 md:grid-cols-[96px_minmax(0,1fr)_100px] lg:grid-cols-[128px_minmax(0,1fr)_120px]">
            <p className="mb-8 text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-[70px]">
              03 /{' '}
              <br />
              Programa
            </p>
            <h2 className="max-w-[650px] pb-1 text-[clamp(50px,6.1vw,72px)] font-normal leading-[0.88] tracking-[-0.05em] text-ink-900">
              Agenda{' '}
              <br />
              del <span className="font-serif italic tracking-[-0.06em]">día</span>
            </h2>
            <p className="mb-[74px] hidden whitespace-nowrap text-right text-[9px] lowercase tracking-[0.28em] text-ink-300 md:block">
              9 hrs / 6 bloques
            </p>
          </div>

          <div className="mx-auto mt-[52px] w-full md:w-[min(76vw,980px)]">
            <div className="flex min-h-8 flex-wrap items-center justify-between gap-x-6 gap-y-1 overflow-hidden bg-ink-900 px-4 py-2 text-[7px] uppercase tracking-[0.2em] text-white sm:flex-nowrap sm:px-7 sm:text-[9px] sm:tracking-[0.34em]">
              <span className="sm:whitespace-nowrap">— {formatLandingDate(currentEventDate)} · Día único</span>
              <span className="sm:whitespace-nowrap">{currentEventLocation}</span>
            </div>

            <div className="border-b border-cream-400">
              {agenda.map((item) => (
                <article
                  key={item.time}
                  className="grid min-h-[104px] grid-cols-[92px_minmax(0,1fr)] border-t border-cream-400 px-4 py-6 sm:grid-cols-[148px_minmax(0,1fr)_104px] sm:px-7"
                >
                  <time className="text-[32px] font-normal leading-none tracking-[-0.04em] text-ink-900 md:text-[34px]">
                    {item.time}
                  </time>
                  <div>
                    <h3 className="font-serif text-[25px] font-normal leading-[0.98] tracking-[-0.03em] text-ink-900 md:text-[28px]">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-[620px] text-[13px] font-normal leading-[1.2] tracking-[-0.01em] text-ink-500 md:text-[14px]">
                      {item.description}
                    </p>
                  </div>
                  <span className="mt-[17px] hidden text-right text-[9px] uppercase tracking-[0.32em] text-ink-300 sm:block">
                    — {item.duration}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[104px] lg:px-10 lg:py-[112px]">
          <div className="grid items-end border-b border-cream-400 md:grid-cols-[96px_minmax(0,1fr)_170px] lg:grid-cols-[128px_minmax(0,1fr)_190px]">
            <p className="mb-8 text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-[72px]">
              04 /{' '}
              <br />
              Ponentes
            </p>
            <h2 className="max-w-[650px] pb-2 text-[clamp(50px,6.1vw,76px)] font-normal leading-[0.9] tracking-[-0.05em] text-ink-900">
              Quién está al{' '}
              <br />
              frente
            </h2>
            <p className="mb-[76px] hidden whitespace-nowrap text-right text-[9px] lowercase tracking-[0.28em] text-ink-300 md:block">
              1 anfitrión / 3 invitadas
            </p>
          </div>

          <div className="mt-[52px] overflow-hidden">
            <div className="flex w-max motion-safe:animate-[speaker-carousel_60s_linear_infinite]">
              {[0, 1].map((group) => (
                <div
                  key={group}
                  aria-hidden={group === 1}
                  className="flex shrink-0 gap-5 pr-5"
                >
                  {featuredSpeakers.map((speaker) => (
                    <article
                      key={`${group}-${speaker.name}`}
                      className="w-[78vw] shrink-0 border border-cream-400 bg-cream-50 sm:w-[42vw] md:w-[29vw] md:max-w-[386px]"
                    >
                      <div className="aspect-[4/5] overflow-hidden bg-cream-200">
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="h-full w-full object-cover object-top"
                          loading={group === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                      <div className="min-h-[128px] border-t border-cream-400 px-5 py-5">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-ink-300">— {speaker.role}</p>
                        <h3 className="mt-5 font-serif text-[26px] italic leading-none tracking-[-0.04em] text-ink-900">
                          {speaker.name}
                        </h3>
                        <p className="mt-4 max-w-[310px] text-[13px] font-normal leading-[1.18] tracking-[-0.01em] text-ink-500">
                          {speaker.bio}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="sede" className="border-t border-cream-400 bg-cream-200">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[96px] lg:px-10 lg:py-[100px]">
          <div className="grid items-end border-b border-cream-400 md:grid-cols-[96px_minmax(0,1fr)_100px] lg:grid-cols-[128px_minmax(0,1fr)_120px]">
            <p className="mb-8 text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-[70px]">
              05 /{' '}
              <br />
              Sede
            </p>
            <h2 className="max-w-[650px] pb-2 text-[clamp(50px,6.1vw,72px)] font-normal leading-[0.9] tracking-[-0.05em] text-ink-900">
              Donde y cómo
              <br />
              llegar
            </h2>
            <p className="mb-[74px] hidden whitespace-nowrap text-right text-[9px] uppercase tracking-[0.28em] text-ink-300 md:block">
              {currentEventLocation}
            </p>
          </div>

          <div className="mt-[52px] overflow-hidden border border-cream-400 md:grid md:min-h-[402px] md:grid-cols-[0.46fr_0.54fr]">
            <div className="min-h-[332px] bg-cream-200 px-8 py-12 md:min-h-[402px] lg:px-[32px]">
              <h3 className="text-[clamp(30px,3.4vw,42px)] font-normal leading-[0.95] tracking-[-0.045em] text-ink-900">
                JW Marriott Hotel
                <span className="block font-serif tracking-[-0.055em]">Mexico City Santa Fe</span>
              </h3>
              <div className="mt-[64px] grid grid-cols-[64px_minmax(0,1fr)] gap-8 border-b border-cream-400 pb-4">
                <p className="text-[8px] uppercase tracking-[0.34em] text-ink-300">Dirección</p>
                <p className="text-[13px] font-normal leading-[1.2] tracking-[-0.02em] text-ink-900">
                  212 Antonio Dovali Jaime
                  <br />
                  Ciudad de México, Cd. de México
                </p>
              </div>
            </div>
            <div className="min-h-[360px] bg-white md:min-h-[402px]">
              <iframe
                title="Mapa JW Marriott Hotel Mexico City Santa Fe"
                src="https://www.google.com/maps?q=JW%20Marriott%20Hotel%20Mexico%20City%20Santa%20Fe&output=embed"
                className="h-[360px] w-full border-0 md:h-[402px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="formatos" className="border-t border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1344px] px-5 py-20 sm:px-8 md:py-[76px] lg:px-10">
          <div className="grid items-end gap-8 md:grid-cols-[210px_minmax(0,1fr)_120px] md:gap-9">
            <p className="text-[9px] uppercase leading-[1.35] tracking-[0.34em] text-ink-300 md:mb-[70px] md:pl-[56px]">
              06 /{' '}
              <br />
              Inversion
            </p>
            <h2 className="text-center text-[clamp(56px,6.1vw,66px)] font-normal leading-[0.84] tracking-[-0.05em] text-ink-900">
              Dos formatos.
              <span className="block font-serif tracking-[-0.06em]">Una experiencia.</span>
            </h2>
            <p className="hidden text-right text-[9px] uppercase tracking-[0.28em] text-ink-300 md:mb-[70px] md:block">
              + IVA
            </p>
          </div>

          <div className="mt-8 grid gap-8 md:grid-cols-[210px_minmax(0,1fr)_120px] md:gap-9">
            <div className="border-t border-cream-400" />
            <div className="border-t border-cream-400" />
            <div className="hidden md:block" />
          </div>

          <div className="mx-auto mt-[50px] grid max-w-[900px] grid-cols-1 overflow-hidden border border-cream-400 sm:grid-cols-2">
            {tickets.map((ticket) => {
              const isVip = ticket.variant === 'vip';
              const checkoutHref = ticket.href || '#formatos';
              return (
                <article
                  key={`${ticket.titleTop}-${ticket.titleBottom}`}
                  className={`relative flex min-h-[580px] flex-col px-[34px] pb-[40px] pt-[44px] md:min-h-[620px] md:px-[40px] md:pt-[52px] ${
                    isVip
                      ? 'border-t border-cream-400 bg-[#050505] text-white sm:border-l sm:border-t-0 sm:border-cream-400 sm:pt-[72px] md:sm:pt-[78px]'
                      : 'bg-cream-50 text-ink-900'
                  }`}
                >
                  {isVip ? (
                    <div className="absolute inset-x-0 top-0 flex h-[26px] items-center justify-center bg-[#78562a] text-[9px] uppercase tracking-[0.42em] text-cream-50">
                      {ticket.eyebrow}
                    </div>
                  ) : (
                    <p className="text-[10px] uppercase tracking-[0.34em] text-ink-300">— {ticket.eyebrow}</p>
                  )}

                  <h3 className="mt-10 text-[clamp(46px,5.4vw,58px)] font-normal leading-[0.86] tracking-[-0.055em]">
                    <span className="block font-sans">{ticket.titleTop}</span>
                    <span className="block font-serif tracking-[-0.06em]">{ticket.titleBottom}</span>
                  </h3>

                  <ul className={`${isVip ? 'mt-[44px]' : 'mt-[40px]'} divide-y ${isVip ? 'divide-white/12' : 'divide-cream-400'}`}>
                    {ticket.items.map((item) => (
                      <li
                        key={item}
                        className={`grid grid-cols-[22px_minmax(0,1fr)] gap-3 py-[14px] text-[14px] font-normal leading-[1.25] tracking-[-0.01em] ${
                          isVip ? 'text-ink-200' : 'text-ink-500'
                        }`}
                      >
                        <span aria-hidden="true">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={checkoutHref}
                    target={ticket.href ? '_blank' : undefined}
                    rel={ticket.href ? 'noopener noreferrer' : undefined}
                    aria-disabled={!ticket.href}
                    className={`mt-auto flex min-h-[54px] items-center justify-between border px-6 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      isVip
                        ? 'border-cream-50 bg-cream-50 text-ink-900 hover:bg-white'
                        : 'border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white'
                    } ${ticket.href ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                  >
                    <span>{ticket.cta}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="voces" className="bg-cream-50">
        <div className="mx-auto flex min-h-[612px] max-w-[1344px] flex-col px-5 py-16 sm:px-10 md:px-[68px] md:py-[84px]">
          <div className="flex items-center justify-between text-[9px] uppercase leading-none tracking-[0.34em] text-ink-300">
            <p>
              07 /{' '}
              <span className="normal-case">Voces</span>
            </p>
            <p>01 / 8</p>
          </div>

          <blockquote className="mx-auto mt-[86px] max-w-[790px] text-center text-[clamp(29px,4.1vw,38px)] font-normal leading-[1.32] tracking-[-0.052em] text-ink-900">
            Fui por asesoría fiscal y terminé transformando
            <br className="hidden md:block" />
            <span> mi empresa. </span>
            <span className="font-serif tracking-[-0.06em]">Hoy tengo 47 personas alineadas,</span>
            <br className="hidden md:block" />
            <span> finanzas estructuradas y una cultura de liderazgo</span>
            <br className="hidden md:block" />
            <span> real. </span>
            <span className="tracking-[-0.045em]">Diego te hace mirar más allá de los{' '}</span>
            <br className="hidden md:block" />
            <span className="tracking-[-0.045em]">números, y eso cambia todo.</span>
          </blockquote>

          <div className="mt-[34px] text-center text-ink-900">
            <p className="font-serif text-[11px] italic leading-none tracking-[-0.02em]">C4 Group</p>
            <p className="mt-1 text-[11px] font-normal leading-none tracking-[-0.01em]">Cliente corporativo</p>
          </div>

          <div className="mt-[31px] flex justify-center gap-[6px]" aria-label="Testimonio 1 de 8">
            {Array.from({ length: 5 }).map((_, index) => (
              <span
                key={index}
                aria-hidden="true"
                className={`h-[5px] w-[5px] rounded-full ${index === 0 ? 'bg-ink-900' : 'bg-ink-300/45'}`}
              />
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section id="cta-final" className="border-b border-white/10 bg-[#070707] text-white">
        <div className="mx-auto flex min-h-[790px] max-w-[1344px] flex-col items-center px-5 pb-[130px] pt-[127px] text-center sm:px-8 md:min-h-[790px]">
          <p className="text-[8px] uppercase tracking-[0.42em] text-white/35">09 / Ultima llamada</p>

          <h2 className="mt-[31px] max-w-[820px] text-[clamp(46px,7.1vw,68px)] font-bold leading-[1.14] tracking-[-0.055em] text-white">
            No esperes a que una{' '}
            <span className="block font-serif font-normal tracking-[-0.07em]">contingencia fiscal</span>
            <span className="block">te obligue a estructurarte.</span>
          </h2>

          <p className="mt-[32px] max-w-[520px] font-serif text-[15px] italic leading-[1.32] tracking-[-0.015em] text-white/55">
            &quot;Hoy decides si te quedas pagando lo de siempre — o tomas
            <span className="block">el control de tu estrategia fiscal.&quot;</span>
          </p>

          <div className="mt-[45px] w-full border-t border-white/12 pt-[27px]">
            <div className="mx-auto grid max-w-[316px] grid-cols-4 gap-0">
              {countdownEntries.map(({ key, label, value }) => (
                <div key={key} className="px-1">
                  <div className="font-serif text-[clamp(38px,5.1vw,49px)] font-normal leading-none tracking-[-0.04em] text-white">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="mt-[5px] text-[7px] uppercase tracking-[0.34em] text-white/28">
                    {label === 'Días' ? 'Dias' : label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a
            href={stripeCheckoutUrls.general || '#formatos'}
            target={stripeCheckoutUrls.general ? '_blank' : undefined}
            rel={stripeCheckoutUrls.general ? 'noopener noreferrer' : undefined}
            className="mt-[40px] flex min-h-[36px] w-[153px] cursor-pointer items-center justify-between bg-cream-50 px-[20px] text-[9px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white"
          >
            <span>Reservar mi lugar</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </div>
  );
}
