import { memo, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import LeadCaptureModal from '@molecules/LeadCaptureModal';
import { requestEstrategiaFiscalDossier } from '@api/leads.api';
import { useNavigate } from 'react-router-dom';
import { useAutoUnmuteOnGesture } from '@hooks/useAutoUnmuteOnGesture';
import { useEvents } from '@hooks/useEvents';
import { useNowTick } from '@hooks/useNowTick';
import { useCartStore } from '@store/cartStore';
import {
  FALLBACK_CALENDAR_EVENTS,
  getNextEstrategiaFiscalEvent,
  loadStoredCalendarEvents,
  mergeCalendarEventSources,
  type CalendarEventSummary,
} from '@utils/eventCalendar';
import heroDiego from '../../../../../assets/home/007_home_bios_DD.png';
// Video hospedado en el GitHub Release `media-v1` (mismo esquema que Academia).
// Sobrevive a cualquier deploy destructivo del VPS y tiene CDN de GitHub.
// GitHub convierte espacios en puntos al subir → nombre real: VIDEO.SEF.vertical.web.mp4
const heroVideo =
  'https://github.com/JoseVargasCubillas/DD_Frontend/releases/download/media-v1/VIDEO.SEF.vertical.web.mp4';
import diegoPortrait from '../../../../../assets/eventos/LEF_img_001.png';
import irmaPortrait from '../../../../../assets/eventos/LEF_img 002.png';
import azucenaPortrait from '../../../../../assets/eventos/LEF_img 003.png';
import jessicaPortrait from '../../../../../assets/eventos/LEF_img_004.png';
import type { Event as SiteEvent } from '@t/index';

const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== 'false';
const countdownLabels = [
  ['days', 'Días'],
  ['hours', 'Horas'],
  ['minutes', 'Min'],
  ['seconds', 'Seg'],
] as const;

const FALLBACK_ESTRATEGIA_FISCAL: CalendarEventSummary =
  FALLBACK_CALENDAR_EVENTS.find((event) =>
    event.slug.includes('taller-estrategia-fiscal'),
  ) ?? FALLBACK_CALENDAR_EVENTS[0];

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

const formatCalloutDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'en la próxima edición';
  return `el ${new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
  }).format(date)}`;
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

const formatModality = (modality: SiteEvent['modality'] | undefined) => {
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
    eyebrow: 'Online',
    price: '$4,997',
    priceValue: 4997,
    refId: 'estrategia-fiscal-online',
    note: 'Pago único · Acceso en vivo',
    variant: 'early',
    cta: 'Comprar Online',
    items: [
      'Transmisión en vivo de los 6 bloques',
      '09:00 a 14:00 hrs (aprox.)',
      'Grabación disponible por tiempo limitado',
    ],
  },
  {
    eyebrow: 'General · CDMX',
    price: '$7,997',
    priceValue: 7997,
    refId: 'estrategia-fiscal-general',
    note: 'Pago único · Entrada general',
    variant: 'general',
    cta: 'Comprar General',
    items: [
      'Entrada general al evento',
      '09:00 a 14:00 hrs (aprox.)',
      'Acceso a los 6 bloques completos',
    ],
  },
  {
    eyebrow: 'VIP · CDMX',
    price: '$24,997',
    priceValue: 24997,
    refId: 'estrategia-fiscal-vip',
    note: 'Pago único · Cupo reducido',
    variant: 'vip',
    cta: 'Comprar VIP',
    items: [
      'Entrada en zona preferencial',
      'Espacio privado para empresarios con Diego Díaz',
      '15:00 a 16:30 hrs · Incluye alimentos',
    ],
  },
];

const testimonials: Array<{
  quote: ReactNode;
  author: string;
  role: string;
}> = [
  {
    quote: (
      <>
        Estamos creciendo y necesitábamos <span className="font-bold">blindarnos.</span>{' '}
        En unas horas entendí cómo estructurar mi empresa, cómo cobrar correctamente y
        cómo prepararme para el cierre fiscal 2026.{' '}
        <span className="font-bold">El valor es inmenso.</span>
      </>
    ),
    author: '— Empresario asistente',
    role: 'Seminario Estrategia Fiscal',
  },
  {
    quote: (
      <>
        Vine buscando una solución porque mi contador no conocía estos temas.
        Aprendí cómo estructurar holdings, empresas operativas y nuevas estrategias
        fiscales para <span className="font-bold">cobrarle mejor a mi empresa.</span>
      </>
    ),
    author: '— Dueño de negocio',
    role: 'Asistente presencial',
  },
  {
    quote: (
      <>
        Aprendí cómo cobrarle a mi empresa, cómo estructurar una holding y cómo
        proteger mi patrimonio para el futuro.{' '}
        <span className="font-bold">Era justo lo que estaba buscando.</span>
      </>
    ),
    author: '— Empresario en crecimiento',
    role: 'Estrategia Fiscal 2026',
  },
  {
    quote: (
      <>
        Se me fue rapidísimo el tiempo. Es un evento privado, muy directo, y lo que
        aprendí me va a servir muchísimo para estructurar el futuro de mi empresa y
        mi patrimonio.
      </>
    ),
    author: '— Director de empresa',
    role: 'Edición presencial',
  },
  {
    quote: (
      <>
        Esto va dirigido a dueños de negocio que ya tienen retos fiscales que su
        contador no siempre puede resolver. Si estás creciendo, necesitas entender
        cómo <span className="font-bold">blindarte antes de tener un problema.</span>
      </>
    ),
    author: '— Socio fundador',
    role: 'PyME mexicana',
  },
  {
    quote: (
      <>
        Al 1000%, quien pueda tomarlo, que lo aproveche. Vale la pena la inversión
        porque sales con claridad para tu cierre fiscal, tu empresa y tu patrimonio.
      </>
    ),
    author: '— Asistente del seminario',
    role: 'Cierre fiscal 2026',
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
  useAutoUnmuteOnGesture(videoRef);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clear);
  const nowTick = useNowTick(30_000);
  const [dossierOpen, setDossierOpen] = useState(false);
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

  // Próximo taller de Estrategia Fiscal (online, CDMX, Monterrey — cualquier variante).
  // Se recomputa cada 30s con nowTick: cuando la fecha del actual pasa, salta
  // automáticamente al siguiente de la lista.
  const currentEvent = useMemo<CalendarEventSummary>(() => {
    const candidates = mergeCalendarEventSources(
      FALLBACK_CALENDAR_EVENTS,
      (eventsData?.data as CalendarEventSummary[] | undefined) ?? [],
      storedEvents,
    );
    return (
      getNextEstrategiaFiscalEvent(candidates, nowTick) ??
      FALLBACK_ESTRATEGIA_FISCAL
    );
  }, [eventsData?.data, storedEvents, nowTick]);

  const currentEventDate = currentEvent.startDate || FALLBACK_ESTRATEGIA_FISCAL.startDate;
  const currentEventLocation = currentEvent.location || FALLBACK_ESTRATEGIA_FISCAL.location;
  const currentEventDescription =
    currentEvent.shortDescription ||
    currentEvent.description ||
    FALLBACK_ESTRATEGIA_FISCAL.shortDescription ||
    '';
  const currentEventCalloutDate = formatCalloutDate(currentEventDate);
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
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialLeaving, setTestimonialLeaving] = useState(false);
  const activeTestimonial = testimonials[testimonialIndex];

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const interval = window.setInterval(() => {
      setTestimonialLeaving(true);
      window.setTimeout(() => {
        setTestimonialIndex((current) => (current + 1) % testimonials.length);
        setTestimonialLeaving(false);
      }, 260);
    }, 6200);

    return () => window.clearInterval(interval);
  }, []);

  const buyTicket = (ticket: (typeof tickets)[number]) => {
    clearCart();
    addItem({
      id: `event-${ticket.refId}`,
      type: 'event',
      refId: ticket.refId,
      title: `Taller de Estrategia Fiscal · ${ticket.eyebrow}`,
      price: ticket.priceValue,
      quantity: 1,
      currency: 'MXN',
      paymentType: 'one_time',
    });
    navigate('/eventos/checkout');
  };

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

            <div className="relative flex aspect-[1080/1350] min-h-0 items-center justify-center overflow-hidden border-t border-cream-400 bg-cream-200 lg:aspect-auto lg:min-h-[690px] lg:border-l lg:border-t-0">
              <video
                ref={videoRef}
                src={heroVideo}
                poster={heroDiego}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className="h-full max-h-[690px] w-full object-contain object-center"
                aria-label="Video del seminario Estrategia Fiscal"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center">
            <a href="#formatos" className="btn-primary justify-center">
              Reservar mi lugar →
            </a>
            <button
              type="button"
              onClick={() => setDossierOpen(true)}
              className="btn-secondary justify-center"
            >
              Descargar dossier ↓
            </button>
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

                  <button
                    type="button"
                    onClick={() => buyTicket(ticket)}
                    className={`mt-auto flex min-h-[54px] w-fit cursor-pointer items-center justify-between gap-4 border px-5 text-[10px] uppercase tracking-[0.16em] transition-colors ${
                      isGeneral
                        ? 'border-cream-50 bg-cream-50 text-ink-900 hover:bg-white'
                        : 'border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white'
                    }`}
                  >
                    <span>{ticket.cta}</span>
                    <span className="card-arrow" aria-hidden="true">→</span>
                  </button>
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
            <p>
              {String(testimonialIndex + 1).padStart(2, '0')} /{' '}
              {String(testimonials.length).padStart(2, '0')}
            </p>
          </div>

          <div
            className={`transition duration-300 ease-out ${
              testimonialLeaving ? 'translate-y-3 opacity-0' : 'translate-y-0 opacity-100'
            }`}
            aria-live="polite"
          >
            <blockquote className="mx-auto mt-[86px] max-w-[940px] text-center text-[clamp(28px,4.3vw,44px)] font-normal leading-[1.18] tracking-[-0.056em] text-ink-900">
              &quot;{activeTestimonial.quote}&quot;
            </blockquote>

            <div className="mt-[34px] text-center text-ink-900">
              <p className="font-serif text-[12px] italic leading-none tracking-[-0.02em]">
                {activeTestimonial.author}
              </p>
              <p className="mt-2 text-[10px] font-normal uppercase leading-none tracking-[0.22em] text-ink-400">
                {activeTestimonial.role}
              </p>
            </div>
          </div>

          <div
            className="mt-[31px] flex justify-center gap-[7px]"
            aria-label={`Testimonio ${testimonialIndex + 1} de ${testimonials.length}`}
          >
            {testimonials.map((testimonial, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setTestimonialIndex(index)}
                aria-label={`Ver testimonio ${index + 1}: ${testimonial.role}`}
                className={`h-[7px] w-[7px] cursor-pointer rounded-full transition-colors ${
                  index === testimonialIndex ? 'bg-ink-900' : 'bg-ink-300/45 hover:bg-ink-500'
                }`}
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
            <span className="block">{currentEventCalloutDate}.</span>
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

          <button
            type="button"
            onClick={() => buyTicket(tickets[1])}
            className="mt-[40px] flex min-h-[36px] w-[153px] cursor-pointer items-center justify-between bg-cream-50 px-[20px] text-[9px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white"
          >
            <span>Reservar mi lugar</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <LeadCaptureModal
        open={dossierOpen}
        onClose={() => setDossierOpen(false)}
        resource="estrategia-fiscal-dossier"
        submit={requestEstrategiaFiscalDossier}
        requireName
        requirePhone
        title="Recibe el dossier del seminario"
        description="Déjanos tu nombre, correo y número. Te enviaremos el dossier oficial de Estrategia Fiscal directamente a tu bandeja."
        submitLabel="Enviar dossier"
      />
    </div>
  );
}
