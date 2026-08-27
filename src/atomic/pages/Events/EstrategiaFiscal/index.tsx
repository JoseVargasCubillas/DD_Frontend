import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';
import heroDiego from '../../../../../assets/home/007_home_bios_DD.png';
// Videos subidos manualmente al VPS en /public_html/media/ (deploy-safe).
const heroVideo = '/media/VIDEO%20SEF%20vertical%20web.mp4';
import diegoPortrait from '../../../../../assets/eventos/LEF_img_001.png';
import irmaPortrait from '../../../../../assets/eventos/LEF_img 002.png';
import azucenaPortrait from '../../../../../assets/eventos/LEF_img 003.png';
import jessicaPortrait from '../../../../../assets/eventos/LEF_img_004.png';
import type { Event as SiteEvent } from '@t/index';

const EVENT_SLUG = 'estrategia-fiscal';
const EVENT_STORAGE_KEY = 'dd-admin-events';
const EVENT_DATE = '2026-06-15T09:00:00-06:00';
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

const FALLBACK_EVENT: Pick<SiteEvent, 'title' | 'slug' | 'shortDescription' | 'description' | 'location' | 'startDate' | 'endDate' | 'modality' | 'capacity' | 'registeredCount'> = {
  title: 'Estrategia Fiscal Edición CDMX',
  slug: EVENT_SLUG,
  shortDescription:
    'Un día intensivo para empresarios que quieren rediseñar la estrategia fiscal de su empresa antes del cierre de año. Sólo 80 cupos por edición.',
  description:
    'Un día intensivo para empresarios que quieren rediseñar la estrategia fiscal de su empresa antes del cierre de año. Sólo 80 cupos por edición.',
  location: 'WTC CDMX',
  startDate: EVENT_DATE,
  endDate: '2026-06-15T18:00:00-06:00',
  modality: 'in-person',
  capacity: 80,
  registeredCount: 57,
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
        Eres dueño o socio de un negocio con facturación de{' '}
        <span className="font-serif italic">$5M MXN o más.</span>
      </>
    ),
    tag: 'Esencial',
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
    tag: 'Esencial',
  },
  {
    number: 'iii.',
    content: (
      <>
        Has tenido <span className="font-serif italic">(o temes tener)</span> una revisión del SAT
      </>
    ),
    tag: 'Recomendado',
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
    tag: 'Esencial',
  },
  {
    number: 'v.',
    content: (
      <>
        Buscas estructurar holding, partes relacionadas{' '}
        <br />o <span className="font-serif italic">reorganizar tu patrimonio</span>
      </>
    ),
    tag: 'Recomendado',
  },
];

const learningCards = [
  {
    number: '01',
    title: 'Blindaje ante el SAT',
    description:
      'Los 7 documentos que toda empresa debe tener antes de una revisión, según casos reales del despacho.',
  },
  {
    number: '02',
    title: 'Deducciones inteligentes',
    description:
      'Estrategias legales que la mayoría de contadores no aplica por desconocimiento o exceso de cautela.',
  },
  {
    number: '03',
    title: 'Estructura holding',
    description: 'Cuándo conviene, cómo se construye y los 5 errores más costosos a evitar.',
  },
  {
    number: '04',
    title: 'Cobrar a tu empresa',
    description: 'Cómo cobrarte legalmente sin generar contingencias fiscales ni laborales.',
  },
  {
    number: '05',
    title: 'Partes relacionadas',
    description: 'El error más común que paraliza a empresas familiares y cómo prevenirlo.',
  },
  {
    number: '06',
    title: 'Plan fiscal 2026',
    description: 'Cómo construir el plan para los próximos 12 meses considerando las reformas vigentes.',
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
    price: '$X,XXX',
    note: 'Termina el 30 de mayo',
    variant: 'early',
    cta: 'Reservar Early Bird',
    href: stripeCheckoutUrls.general,
    items: ['Acceso completo al evento', 'Material digital descargable', 'Coffee break + comida', 'Networking estructurado'],
  },
  {
    eyebrow: 'General',
    price: '$X,XXX',
    note: 'Disponibilidad regular',
    variant: 'general',
    cta: 'Reservar General',
    href: stripeCheckoutUrls.general,
    items: [
      'Acceso completo al evento',
      'Material digital + impreso',
      'Coffee + comida + cena de cierre',
      'Networking estructurado',
      'Grabación de sesiones · 30 días',
      'Prioridad en Q&A',
    ],
  },
  {
    eyebrow: 'VIP',
    price: '$XX,XXX',
    note: 'Solo 10 cupos',
    variant: 'vip',
    cta: 'Aplicar a VIP',
    href: stripeCheckoutUrls.vip,
    items: [
      'Todo lo anterior, incluido',
      'Comida privada con Diego',
      'Sesión 1-a-1 · 30 min post-evento',
      '3 meses gratis en Academia',
      'Asientos en primera fila',
      'Material exclusivo VIP',
    ],
  },
];

const faqItems = [
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
    answer: 'El día contempla bloques de trabajo, comida y espacios de pausa incluidos.',
  },
  {
    question: '¿Cómo se aplica al tier VIP?',
    answer: 'El acceso VIP incluye beneficios adicionales y cupos limitados. Después de reservar, el equipo confirma disponibilidad y detalles de seguimiento.',
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
            5 preguntas
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
  const currentEventCapacity = Math.max(Number(currentEvent.capacity || 0), 0);
  const currentEventRegistered = Math.max(Number(currentEvent.registeredCount || 0), 0);
  const currentEventRemaining =
    currentEventCapacity > 0
      ? Math.max(currentEventCapacity - currentEventRegistered, 0)
      : null;
  const countdown = useCountdown(currentEventDate);
  const featuredSpeakers = speakers;
  const countdownEntries = useMemo(
    () => countdownLabels.map(([key, label]) => ({ key, label, value: countdown[key] })),
    [countdown],
  );

  return (
    <div className="bg-cream-200 text-ink-900">

      <header className="border-b border-cream-400 bg-cream-200">
        <div className="mx-auto max-w-[1440px] px-5 pb-12 pt-7 sm:px-8 lg:px-14 lg:pb-[75px] lg:pt-10">
          <div className="grid gap-3 border-b border-cream-400 pb-4 text-[9px] uppercase tracking-[0.32em] text-ink-300 sm:grid-cols-[1fr_auto]">
            <p>— Evento · {currentEventModality}</p>
            <p>
              {currentEventRemaining !== null
                ? `${currentEventRemaining} / ${currentEventCapacity} · Quedan ${currentEventRemaining} cupos`
                : 'Cupos por confirmar'}
            </p>
          </div>

          <div className="mt-[38px] flex flex-wrap items-center gap-3 text-[8px] uppercase tracking-[0.28em] text-ink-400">
            <span className="border border-ink-900 bg-ink-900 px-4 py-2 text-white">
              {currentEventModality}
            </span>
            <span className="border border-cream-400 px-4 py-2">
              {currentEventLocation}
            </span>
            <span className="border border-cream-400 px-4 py-2">
              {currentEventTime} - {currentEventEndTime}
            </span>
          </div>

          <h1 className="ef-hero-title mt-7 max-w-[760px] text-[clamp(64px,11vw,156px)] leading-[0.78] tracking-[-0.075em] text-ink-900">
            Estrategia
            <span className="block font-serif font-normal italic leading-[0.78] tracking-[-0.08em]">Fiscal</span>
          </h1>

          <p className="mt-8 max-w-[520px] font-serif text-[clamp(16px,1.7vw,20px)] italic leading-[1.23] tracking-[-0.035em] text-ink-500">
            “{currentEventDescription}”
          </p>

          <div className="mt-10 border border-cream-400 bg-cream-50 lg:grid lg:min-h-[690px] lg:grid-cols-2">
            <div className="flex flex-col bg-cream-50 lg:min-h-[690px]">
              <div>
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
                <div className="flex flex-wrap gap-8 px-6 py-8 sm:gap-12 lg:px-8">
                  {countdownEntries.map(({ key, label, value }) => (
                    <div key={key}>
                      <div className="ef-hero-numeral text-[clamp(38px,6vw,62px)] leading-none tracking-[-0.04em] text-ink-900">
                        {String(value).padStart(2, '0')}
                      </div>
                      <div className="mt-2 text-[8px] uppercase tracking-[0.28em] text-ink-300">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex min-h-[520px] items-center justify-center overflow-hidden border-t border-cream-400 bg-cream-200 lg:min-h-[690px] lg:border-l lg:border-t-0">
              <video
                ref={videoRef}
                src={heroVideo}
                poster={heroDiego}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="h-full max-h-[690px] w-full object-contain object-center"
                aria-label="Video del seminario Estrategia Fiscal"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a href="#formatos" className="btn-primary justify-center">
              Reservar mi lugar →
            </a>
            <a href={dossierUrl} download className="btn-secondary justify-center">
              Descargar dossier ↓
            </a>
            <p className="text-[9px] uppercase tracking-[0.32em] text-ink-400">
              {currentEventRemaining !== null
                ? `— ${currentEventRemaining} cupos restantes`
                : '— Cupos por confirmar'}
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
            <div className="max-w-[1000px]">
              {audienceProfiles.map((profile, index) => (
                <div
                  key={profile.number}
                  className={`grid grid-cols-[56px_minmax(0,1fr)] gap-5 py-6 sm:grid-cols-[70px_minmax(0,1fr)_110px] md:pb-6 md:pt-8 ${
                    index < audienceProfiles.length - 1 ? 'border-b border-cream-400' : ''
                  }`}
                >
                  <span className="font-serif text-[23px] italic leading-none text-ink-300 md:text-[25px]">{profile.number}</span>
                  <p className="max-w-[780px] text-[clamp(20px,2.2vw,28px)] font-normal leading-[1.15] tracking-[-0.035em] text-ink-900">
                    {profile.content}
                  </p>
                  <span className="hidden self-center text-right text-[8px] uppercase tracking-[0.28em] text-ink-300 sm:block">
                    — {profile.tag}
                  </span>
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
              Lo que te vas{' '}
              <br />a <span className="font-serif italic tracking-[-0.06em]">llevar.</span>
            </h2>
            <p className="mb-[78px] hidden text-right text-[9px] uppercase tracking-[0.34em] text-ink-300 md:block">
              6 módulos
            </p>
          </div>

          <div className="mt-[52px] grid border border-cream-400 bg-cream-50 md:grid-cols-3">
            {learningCards.map((card, index) => (
              <article
                key={card.number}
                className={`relative z-0 min-h-[250px] border-cream-400 p-7 transition-[transform,background-color,box-shadow] duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] hover:z-10 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_18px_42px_-20px_rgba(10,10,10,0.35)] motion-reduce:hover:translate-y-0 md:min-h-[320px] md:p-10 ${
                  index < 3 ? 'md:border-b' : ''
                } ${index % 3 !== 2 ? 'md:border-r' : ''} ${index !== learningCards.length - 1 ? 'max-md:border-b' : ''}`}
              >
                <div className="font-serif text-[44px] italic leading-none tracking-[-0.05em] text-ink-300">
                  {card.number}
                </div>
                <h3 className="mt-12 max-w-[220px] text-[24px] font-normal leading-[0.98] tracking-[-0.045em] text-ink-900">
                  {card.title}
                </h3>
                <p className="mt-5 max-w-[340px] text-[13px] font-normal leading-[1.35] tracking-[-0.01em] text-ink-500">
                  {card.description}
                </p>
              </article>
            ))}
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
              Dónde y cómo
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
                WTC Ciudad
                <span className="block font-serif italic tracking-[-0.055em]">de México</span>
                <span className="mt-2 block font-serif text-[16px] italic tracking-[-0.03em] text-ink-400">
                  Nápoles, Benito Juárez
                </span>
              </h3>
              <dl className="mt-[52px] space-y-0 border-y border-cream-400">
                {[
                  ['Dirección', 'Montecito 38, piso 35'],
                  ['Estacionamiento', 'Incluido identificación'],
                  ['Hotel aliado', 'Tarifa especial sin confirmación'],
                  ['Transporte público', 'Metro San Antonio · L7'],
                  ['Incluye', 'Coffee + comida + material'],
                ].map(([term, detail]) => (
                  <div key={term} className="grid grid-cols-[112px_minmax(0,1fr)] gap-5 border-b border-cream-400 py-3 last:border-b-0">
                    <dt className="text-[8px] uppercase tracking-[0.34em] text-ink-300">{term}</dt>
                    <dd className="text-[12px] font-semibold leading-[1.25] tracking-[-0.02em] text-ink-900">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="min-h-[360px] bg-white md:min-h-[402px]">
              <iframe
                title="Mapa WTC Ciudad de México"
                src="https://www.google.com/maps?q=WTC%20Ciudad%20de%20Mexico%20Montecito%2038&output=embed"
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
              Tres formatos.
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

          <div className="mx-auto mt-[50px] grid max-w-[1240px] grid-cols-1 overflow-visible border border-cream-400 md:grid-cols-3">
            {tickets.map((ticket) => {
              const isGeneral = ticket.variant === 'general';
              const checkoutHref = ticket.href || '#formatos';
              return (
                <article
                  key={ticket.eyebrow}
                  className={`card-lift relative z-0 flex min-h-[600px] flex-col border-cream-400 px-[34px] pb-[40px] pt-[56px] hover:z-10 md:min-h-[688px] md:px-[40px] ${
                    isGeneral
                      ? 'bg-[#050505] pt-[88px] text-white'
                      : 'bg-cream-50 text-ink-900'
                  } ${ticket.variant !== 'early' ? 'border-t md:border-l md:border-t-0' : ''}`}
                >
                  {isGeneral && (
                    <div className="absolute inset-x-0 top-0 flex h-[31px] items-center justify-center bg-[#78562a] text-[9px] uppercase tracking-[0.42em] text-cream-50">
                      Recomendado
                    </div>
                  )}

                  <p className={`text-[10px] uppercase tracking-[0.34em] ${isGeneral ? 'text-white/45' : 'text-ink-300'}`}>
                    — {ticket.eyebrow}
                  </p>

                  <h3 className="mt-5 text-[clamp(46px,5.4vw,64px)] font-normal leading-none tracking-[-0.055em]">
                    {ticket.price}
                  </h3>
                  <p className={`mt-4 text-[9px] uppercase tracking-[0.28em] ${isGeneral ? 'text-white/35' : 'text-ink-300'}`}>
                    {ticket.note}
                  </p>

                  <ul className={`mt-[54px] divide-y ${isGeneral ? 'divide-white/12' : 'divide-cream-400'}`}>
                    {ticket.items.map((item) => (
                      <li
                        key={item}
                        className={`grid grid-cols-[22px_minmax(0,1fr)] gap-3 py-[14px] text-[13px] font-normal leading-[1.25] tracking-[-0.01em] ${
                          isGeneral ? 'text-white/70' : 'text-ink-500'
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
                    className={`mt-auto flex min-h-[54px] w-fit items-center justify-between gap-4 border px-5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      isGeneral
                        ? 'border-cream-50 bg-cream-50 text-ink-900 hover:bg-white'
                        : 'border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white'
                    } ${ticket.href ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                  >
                    <span>{ticket.cta}</span>
                    <span className="card-arrow" aria-hidden="true">→</span>
                  </a>
                </article>
              );
            })}
          </div>

          <p className="mt-8 text-center text-[8px] uppercase tracking-[0.34em] text-ink-300">
            — Acepta tarjeta, transferencia y OXXO Pay · Factura disponible para todos los tiers
          </p>
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
            &quot;Salí con un plan <span className="font-serif italic tracking-[-0.06em]">concreto</span> para los
            <br className="hidden md:block" />
            próximos seis meses.
            <br className="hidden md:block" />
            Lo mejor: las estrategias funcionan,
            <span className="block font-serif italic tracking-[-0.06em]">no son teoría.&quot;</span>
          </blockquote>

          <div className="mt-[34px] text-center text-ink-900">
            <p className="font-serif text-[11px] italic leading-none tracking-[-0.02em]">— Asistente Edición Mayo 2025</p>
            <p className="mt-1 text-[11px] font-normal leading-none tracking-[-0.01em]">Director General · PyME familiar</p>
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
          <p className="text-[8px] uppercase tracking-[0.42em] text-white/35">09 / Última llamada</p>

          <h2 className="mt-[31px] max-w-[760px] text-[clamp(54px,7.1vw,92px)] font-normal leading-[0.9] tracking-[-0.065em] text-white">
            El cambio
            <span className="block font-serif italic font-normal tracking-[-0.08em]">empieza</span>
            <span className="block">el 15 de junio.</span>
          </h2>

          <p className="mt-[32px] max-w-[520px] font-serif text-[15px] italic leading-[1.32] tracking-[-0.015em] text-white/55">
            &quot;Hoy decides si te quedas pagando lo de siempre — o tomas el
            <span className="block">control de tu estrategia fiscal.&quot;</span>
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
