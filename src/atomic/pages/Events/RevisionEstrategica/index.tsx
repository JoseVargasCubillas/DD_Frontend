import { useEffect, useRef, type ReactNode } from 'react';
import HubspotForm from '@molecules/HubspotForm';
import { HUBSPOT_FORMS } from '@utils/hubspotForms';
import { waClickHandler, waLink } from '@utils/whatsapp';
import revisionLogo from '../../../../assets/eventos/revision-estrategica-logo.png';

/**
 * Landing "Revisión Estratégica · Mesa Estratégica 2026".
 * Adaptación del wireframe desktop v3 a la paleta editorial del sitio
 * (cream + ink + café-dorado, Baskerville + Helvetica). La landing no tiene
 * formulario: el acceso se otorga tras una llamada de pre-calificación, por
 * eso el CTA final abre WhatsApp con el mensaje ya armado.
 */

const WA_MESSAGE =
  'Hola, quiero agendar una llamada con un asesor para la Mesa Estratégica · Revisión Estratégica 2026.';

const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

type DirigidoCard = { n: string; text: ReactNode };
const dirigidoCards: DirigidoCard[] = [
  {
    n: '01',
    text: (
      <>
        Han crecido, pero siguen operando con una{' '}
        <em className="text-[#6b6258]">estructura fiscal y corporativa básica.</em>
      </>
    ),
  },
  {
    n: '02',
    text: (
      <>
        Buscan proteger su patrimonio y <em className="text-[#6b6258]">separar riesgos operativos.</em>
      </>
    ),
  },
  {
    n: '03',
    text: (
      <>
        Quieren implementar estrategias fiscales legales <em className="text-[#6b6258]">sin improvisación.</em>
      </>
    ),
  },
  {
    n: '04',
    text: (
      <>
        Necesitan claridad sobre si requieren o no una{' '}
        <em className="text-[#6b6258]">holding, fideicomisos o estructuras internacionales.</em>
      </>
    ),
  },
  {
    n: '05',
    text: (
      <>
        Están considerando expansión o diversificación, pero{' '}
        <em className="text-[#6b6258]">no tienen una arquitectura definida.</em>
      </>
    ),
  },
];

type Etapa = {
  roman: string;
  num: string;
  title: string;
  italic: string;
  body: string;
  items: ReactNode[];
  diagram: ReactNode;
  caption: string;
};

const SvgLabel = ({ x, y, children, className = '' }: { x: number; y: number; children: ReactNode; className?: string }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fontFamily="'Libre Baskerville', Georgia, serif"
    fontStyle="italic"
    fontSize="11"
    fill="#6b6258"
    className={className}
  >
    {children}
  </text>
);

const SvgBox = ({
  x,
  y,
  w,
  h,
  label,
  sub,
  variant = 'ink',
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  variant?: 'ink' | 'accent' | 'outline';
}) => {
  const fill = variant === 'accent' ? '#6b4f2a' : variant === 'outline' ? '#f5f2ec' : '#0a0a0a';
  const text = variant === 'outline' ? '#0a0a0a' : '#f5f2ec';
  const cx = x + w / 2;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} stroke={variant === 'outline' ? '#0a0a0a' : 'none'} strokeWidth="1.5" />
      <text
        x={cx}
        y={sub ? y + h / 2 - 4 : y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize="11"
        letterSpacing="1.2"
        fill={text}
      >
        {label}
      </text>
      {sub ? (
        <text
          x={cx}
          y={y + h / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontWeight="700"
          fontSize="8"
          letterSpacing="1.4"
          fill={text}
          opacity="0.7"
        >
          {sub}
        </text>
      ) : null}
    </g>
  );
};

const LINE = { stroke: 'rgba(10,10,10,0.32)', strokeWidth: 1, fill: 'none' } as const;
const ACCENT_DASH = { stroke: '#6b4f2a', strokeWidth: 1.3, strokeDasharray: '3 3', strokeLinecap: 'round', fill: 'none' } as const;

const etapas: Etapa[] = [
  {
    roman: 'I',
    num: '01',
    title: 'Operadora',
    italic: 'en luz verde.',
    body: 'Validamos si tu operación actual está correctamente estructurada o si ya presenta riesgos fiscales o financieros.',
    items: ['Tasa efectiva.', 'Capacidad instalada.', 'Relación EFOS.', 'Compliance.'],
    caption: 'Validación del estatus operativo',
    diagram: (
      <svg viewBox="0 0 420 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama: operadora y semáforo de estatus">
        <g transform="translate(40,40)">
          <rect x="0" y="20" width="80" height="100" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
          {[35, 55, 75].map((yy) =>
            [10, 30, 50].map((xx) => <rect key={`${xx}-${yy}`} x={xx} y={yy} width="12" height="12" fill="#0a0a0a" opacity="0.3" />),
          )}
          <rect x="30" y="100" width="20" height="20" fill="#0a0a0a" />
          <SvgLabel x={40} y={12}>Operadora</SvgLabel>
        </g>
        <line x1="130" y1="90" x2="230" y2="90" stroke="#6b4f2a" strokeWidth="1.5" strokeDasharray="4 4" />
        <g transform="translate(250,30)">
          <rect x="0" y="0" width="60" height="140" rx="4" fill="#0a0a0a" />
          <circle cx="30" cy="30" r="14" fill="#8a3d2a" />
          <circle cx="30" cy="70" r="14" fill="#6b4f2a" />
          <circle cx="30" cy="110" r="14" fill="#3d5a3d" />
          <SvgLabel x={30} y={-6}>Estatus</SvgLabel>
        </g>
        <g transform="translate(324,42)" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="10.5" fontWeight="600" letterSpacing="2">
          <text x="0" y="0" fill="#8a3d2a">BLOQUEO CSD</text>
          <text x="0" y="40" fill="#6b4f2a">AUDITORÍA</text>
          <text x="0" y="80" fill="#3d5a3d">LUZ VERDE</text>
        </g>
      </svg>
    ),
  },
  {
    roman: 'II',
    num: '02',
    title: 'Holding',
    italic: '.',
    body: 'Determinamos si necesitas un holding y cómo debería estructurarse en tu caso.',
    items: [
      'Tipo de sociedad.',
      'Ingresos Holding.',
      'Activos Holding.',
      <>Proceso para <em className="text-[#6b6258]">instalación.</em></>,
      'Compliance.',
    ],
    caption: 'Separación de activos y riesgos',
    diagram: (
      <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama: holding con operadoras">
        <g transform="translate(180,15)">
          <path d="M 0 12 L 10 0 L 20 10 L 30 0 L 40 10 L 50 0 L 60 12 L 60 20 L 0 20 Z" fill="none" stroke="#6b4f2a" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="10" cy="4" r="2" fill="#6b4f2a" />
          <circle cx="30" cy="2" r="2" fill="#6b4f2a" />
          <circle cx="50" cy="4" r="2" fill="#6b4f2a" />
        </g>
        <SvgBox x={170} y={45} w={80} h={54} label="SAPI" sub="HOLDING" variant="accent" />
        <line x1="210" y1="99" x2="210" y2="130" {...LINE} />
        <line x1="110" y1="130" x2="310" y2="130" {...LINE} />
        <line x1="110" y1="130" x2="110" y2="150" {...LINE} />
        <line x1="310" y1="130" x2="310" y2="150" {...LINE} />
        <SvgBox x={70} y={150} w={80} h={54} label="SA" sub="OPERADORA" />
        <SvgBox x={270} y={150} w={80} h={54} label="SA" sub="OPERADORA" />
      </svg>
    ),
  },
  {
    roman: 'III',
    num: '03',
    title: 'Empresa',
    italic: 'de servicios.',
    body: 'Analizamos si conviene separar funciones para optimizar carga fiscal y control operativo.',
    items: [
      'Tipo de sociedad.',
      'Objeto.',
      <>Servicios a <em className="text-[#6b6258]">operadoras.</em></>,
      <>Deducciones <em className="text-[#6b6258]">estratégicas.</em></>,
    ],
    caption: 'Separación de funciones y optimización',
    diagram: (
      <svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama: empresa de servicios facturando a operadoras">
        <defs>
          <marker id="re-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#6b4f2a" />
          </marker>
        </defs>
        <SvgBox x={190} y={20} w={80} h={48} label="SAPI" sub="HOLDING" variant="accent" />
        <line x1="230" y1="68" x2="230" y2="100" {...LINE} />
        <line x1="100" y1="100" x2="360" y2="100" {...LINE} />
        <line x1="100" y1="100" x2="100" y2="130" {...LINE} />
        <line x1="230" y1="100" x2="230" y2="130" {...LINE} />
        <SvgBox x={60} y={130} w={80} h={48} label="SA" sub="OPERADORA" />
        <SvgBox x={190} y={130} w={80} h={48} label="SA" sub="OPERADORA" />
        <SvgBox x={340} y={100} w={90} h={52} label="SC" sub="SERVICIOS" variant="outline" />
        <path d="M 340 126 Q 310 180 140 180" {...ACCENT_DASH} markerEnd="url(#re-arrow)" />
        <path d="M 340 140 Q 330 180 270 180" {...ACCENT_DASH} markerEnd="url(#re-arrow)" />
        <g transform="translate(372,80)" stroke="#6b4f2a" strokeWidth="1.3" fill="none">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" fill="#6b4f2a" />
          <line x1="12" y1="0" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="24" />
          <line x1="0" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="24" y2="12" />
        </g>
        <SvgLabel x={100} y={208}>Operadoras</SvgLabel>
        <SvgLabel x={230} y={208}>Operadoras</SvgLabel>
        <SvgLabel x={385} y={164}>Facturación a operadoras</SvgLabel>
      </svg>
    ),
  },
  {
    roman: 'IV',
    num: '04',
    title: 'Cómo cobran',
    italic: 'los socios y directores.',
    body: 'Revisamos la forma en que retiras utilidades y si lo estás haciendo de manera eficiente o costosa.',
    items: [
      <>Emolumentos a miembros <em className="text-[#6b6258]">del consejo.</em></>,
      'Comisiones a CEOs.',
      <>Prestación de servicios, <em className="text-[#6b6258]">arrendamientos y regalías.</em></>,
      'Partes relacionadas.',
      'Dividendos.',
    ],
    caption: 'Cinco rutas para retirar utilidades',
    diagram: (
      <svg viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama: flujos de pago de la empresa al socio">
        <defs>
          <marker id="re-arr4" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M 0 0 L 8 4 L 0 8 z" fill="#6b4f2a" />
          </marker>
        </defs>
        <rect x="20" y="60" width="100" height="100" fill="#0a0a0a" rx="2" />
        {[78, 102].map((yy) =>
          [35, 59, 83].map((xx) => <rect key={`${xx}-${yy}`} x={xx} y={yy} width="14" height="14" fill="#f5f2ec" opacity="0.3" />),
        )}
        <rect x="55" y="130" width="30" height="30" fill="#6b4f2a" />
        <SvgLabel x={70} y={50}>Empresa</SvgLabel>
        <path d="M 120 85 Q 180 70 240 70" {...ACCENT_DASH} markerEnd="url(#re-arr4)" />
        <path d="M 120 100 L 240 100" {...ACCENT_DASH} markerEnd="url(#re-arr4)" />
        <path d="M 120 130 L 240 130" {...ACCENT_DASH} markerEnd="url(#re-arr4)" />
        <path d="M 120 145 Q 180 160 240 160" {...ACCENT_DASH} markerEnd="url(#re-arr4)" />
        <g fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="9" fontWeight="600" letterSpacing="1.5" fill="#6b4f2a" textAnchor="middle">
          <text x="180" y="62">EMOLUMENTOS</text>
          <text x="180" y="94">HONORARIOS</text>
          <text x="180" y="124">ARRENDAMIENTO</text>
          <text x="180" y="155">DIVIDENDOS</text>
        </g>
        <g transform="translate(250,55)">
          <circle cx="60" cy="15" r="12" fill="none" stroke="#0a0a0a" strokeWidth="1.5" />
          <path d="M 36 55 Q 36 30 60 30 Q 84 30 84 55 L 84 110 L 36 110 Z" fill="none" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M 55 30 L 60 42 L 65 30 L 65 55 L 60 65 L 55 55 Z" fill="#6b4f2a" />
          <SvgLabel x={60} y={130}>Socio / Director</SvgLabel>
        </g>
        <g transform="translate(410,80)">
          <circle cx="12" cy="12" r="12" fill="none" stroke="#6b4f2a" strokeWidth="1.5" />
          <text x="12" y="17" fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontWeight="700" fontSize="14" textAnchor="middle" fill="#6b4f2a">
            $
          </text>
        </g>
      </svg>
    ),
  },
  {
    roman: 'V',
    num: '05',
    title: 'Arquitectura',
    italic: 'internacional.',
    body: 'Exploramos si tu modelo ya requiere expansión o blindaje internacional.',
    items: [
      'Residencia Fiscal.',
      'Paraísos fiscales.',
      '"Lo prohibido".',
      <>Lo que el SAT <em className="text-[#6b6258]">no puede tocar.</em></>,
    ],
    caption: 'Puente entre estructura local y arquitectura offshore',
    diagram: (
      <svg viewBox="0 0 460 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagrama: estructura local en México y vehículo offshore">
        <g fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif" fontSize="10" fontWeight="700" letterSpacing="3" fill="#6b6258" textAnchor="middle">
          <text x="100" y="20">MÉXICO</text>
          <text x="370" y="20">OFFSHORE</text>
        </g>
        <line x1="20" y1="30" x2="180" y2="30" {...LINE} />
        <line x1="280" y1="30" x2="450" y2="30" {...LINE} />
        <SvgBox x={60} y={45} w={80} h={50} label="SAPI" sub="HOLDING" variant="accent" />
        <line x1="100" y1="95" x2="100" y2="115" {...LINE} />
        <line x1="40" y1="115" x2="160" y2="115" {...LINE} />
        <line x1="40" y1="115" x2="40" y2="130" {...LINE} />
        <line x1="100" y1="115" x2="100" y2="130" {...LINE} />
        <line x1="160" y1="115" x2="160" y2="130" {...LINE} />
        <SvgBox x={10} y={130} w={60} h={36} label="SA" />
        <SvgBox x={70} y={130} w={60} h={36} label="SA" />
        <SvgBox x={130} y={130} w={60} h={36} label="SC" variant="outline" />
        <g transform="translate(205,100)" fill="none" stroke="#6b4f2a">
          <circle cx="25" cy="25" r="24" strokeWidth="1.5" />
          <ellipse cx="25" cy="25" rx="12" ry="24" strokeWidth="1" />
          <line x1="1" y1="25" x2="49" y2="25" strokeWidth="1" />
          <path d="M 25 1 Q 10 15 25 25 Q 40 35 25 49" strokeWidth="1" />
          <SvgLabel x={25} y={68} className="fill-[#6b4f2a]">internacional</SvgLabel>
        </g>
        <line x1="195" y1="80" x2="275" y2="80" stroke="#6b4f2a" strokeWidth="1.3" strokeDasharray="4 3" strokeLinecap="round" />
        <SvgBox x={320} y={45} w={100} h={50} label="FIP" sub="VEHÍCULO" variant="accent" />
        <line x1="370" y1="95" x2="370" y2="115" {...LINE} />
        <line x1="320" y1="115" x2="420" y2="115" {...LINE} />
        <line x1="320" y1="115" x2="320" y2="130" {...LINE} />
        <line x1="420" y1="115" x2="420" y2="130" {...LINE} />
        <SvgBox x={290} y={130} w={60} h={36} label="LLC" variant="outline" />
        <SvgBox x={390} y={130} w={60} h={36} label="INC" variant="outline" />
        <SvgLabel x={100} y={185}>Estructura local</SvgLabel>
        <SvgLabel x={370} y={185}>Expansión / blindaje</SvgLabel>
      </svg>
    ),
  },
];

type Lleva = { n: string; title: string; text: ReactNode };
const llevas: Lleva[] = [
  { n: '01', title: 'Diagnóstico claro.', text: <>Diagnóstico de tu estructura actual: <em className="text-cream/55">qué está bien y qué está mal.</em></> },
  { n: '02', title: 'Mapa de arquitectura.', text: <>Mapa de arquitectura empresarial recomendado — <em className="text-cream/55">cómo debería verse tu grupo.</em></> },
  { n: '03', title: 'Planes de acción.', text: <>Planes de acción concretos para <em className="text-cream/55">implementar cada etapa.</em></> },
  { n: '04', title: 'Prioridades.', text: <>Prioridades de ejecución — <em className="text-cream/55">qué hacer primero y qué puede esperar.</em></> },
  { n: '05', title: 'Estimación.', text: <>Estimación de inversión para implementar la estructura — <em className="text-cream/55">sin sorpresas.</em></> },
  { n: '06', title: 'Acompañamiento.', text: <>Propuesta de acompañamiento <em className="text-cream/55">para llevarlo a ejecución.</em></> },
];

const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default function RevisionEstrategicaLanding() {
  const rootRef = useRef<HTMLElement | null>(null);
  const inversionRef = useRef<HTMLElement | null>(null);

  const scrollToInversion = () => {
    inversionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Reveal on scroll: misma coreografía del wireframe (opacity + translate).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach((n) => n.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  const waHref = waLink(WA_MESSAGE);

  return (
    <main ref={rootRef} className="overflow-hidden bg-[#f5f2ec] text-ink-900">
      <style>{`
        .dd-re [data-reveal]{opacity:0;transform:translateY(30px);transition:opacity 900ms cubic-bezier(.2,.7,.2,1),transform 900ms cubic-bezier(.2,.7,.2,1);}
        .dd-re [data-reveal="scale"]{transform:scale(0.94);}
        .dd-re [data-reveal="num"]{transform:translateY(60px) rotate(-6deg);transition-duration:1100ms;}
        .dd-re [data-reveal].is-in{opacity:1;transform:none;}
        .dd-re [data-delay="1"]{transition-delay:80ms;}
        .dd-re [data-delay="2"]{transition-delay:160ms;}
        .dd-re [data-delay="3"]{transition-delay:240ms;}
        .dd-re [data-delay="4"]{transition-delay:320ms;}
        .dd-re [data-delay="5"]{transition-delay:400ms;}
        @keyframes ddReDrift{0%,100%{transform:translate3d(0,0,0) scale(1.06);}50%{transform:translate3d(-1.5%,-1%,0) scale(1.1);}}
        .dd-re-bp{animation:ddReDrift 28s ease-in-out infinite;}
        @media (prefers-reduced-motion: reduce){
          .dd-re [data-reveal]{opacity:1;transform:none;transition:none;}
          .dd-re-bp{animation:none;}
        }
      `}</style>

      <div className="dd-re">
        {/* ============ HERO ============ */}
        <section className="relative overflow-hidden bg-[#0a0a0a] text-[#f5f2ec]">
          {/* Blueprint de fondo */}
          <div aria-hidden="true" className="pointer-events-none absolute -inset-x-[6%] -top-[10%] -bottom-[20%] z-0 overflow-hidden">
            <div
              className="dd-re-bp h-full w-full will-change-transform"
              style={{
                backgroundImage: 'url(/event-media/revision-estrategica-hero.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 45%, rgba(18,18,20,0.35) 0%, rgba(18,18,20,0.70) 75%), linear-gradient(180deg, rgba(18,18,20,0.10) 0%, rgba(18,18,20,0.55) 100%)',
              }}
            />
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] opacity-30 mix-blend-screen" style={{ backgroundImage: NOISE }} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute z-[1] hidden rounded-full lg:block"
            style={{
              right: '-160px',
              top: '-120px',
              width: '900px',
              height: '900px',
              background: 'radial-gradient(circle, rgba(180,150,110,0.22) 0%, transparent 60%)',
            }}
          />

          {/* Strip superior */}
          <div className="relative z-[3] bg-[#f5f2ec] px-5 py-3.5 text-center text-[10px] font-medium uppercase tracking-[0.26em] text-ink-900 sm:px-8">
            <span className="mr-3 inline-block border border-ink-900 px-2 py-0.5 text-[9px] tracking-[0.22em]">Mesa Estratégica</span>
            <span>Edición 2026</span>
            <span className="mx-3 text-[#6b6258]">·</span>
            <span>Cupos limitados</span>
          </div>

          {/* Marcador de edición flotante */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-24 z-[2] hidden select-none font-sans font-bold leading-[0.85] tracking-[-0.06em] text-[#8a6a3d]/15 lg:block lg:text-[160px] xl:right-16 xl:text-[200px]"
          >
            2026
          </div>

          <div className="relative z-[3] mx-auto max-w-[1312px] px-5 py-20 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
            <div data-reveal className="mb-9 inline-block border border-[#8a6a3d] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.32em] text-[#8a6a3d] sm:text-[14px]">
              ★ Mesa Estratégica
            </div>

            <h1 className="sr-only">Revisión Estratégica 2026</h1>
            <img
              data-reveal
              src={revisionLogo}
              alt="Revisión Estratégica 2026"
              width={980}
              height={448}
              decoding="async"
              className="mb-9 block h-auto w-full max-w-[980px] select-none"
              draggable={false}
            />

            <p data-reveal data-delay="2" className="mb-12 max-w-[860px] border-l-2 border-[#8a6a3d] pl-6 font-serif text-[20px] italic leading-[1.4] tracking-[-0.012em] text-[#f5f2ec]/88 sm:text-[24px] lg:text-[28px]">
              Una <span className="text-[#8a6a3d]">revisión estructural intensiva</span> de tu empresa — donde analizamos si tu operación, tu estructura fiscal y tu arquitectura patrimonial están realmente diseñadas para crecer, o si están improvisadas.
            </p>

            <div data-reveal data-delay="3" className="mb-11 grid max-w-[900px] border-y border-[#f5f2ec]/20 sm:grid-cols-3">
              {[
                ['— Formato', <>Mesa estratégica.</>],
                ['— Modalidad', <>Presencial <span className="font-serif text-[20px] font-normal normal-case italic tracking-normal text-[#8a6a3d]">1:1.</span></>],
                ['— Edición', <>2026.</>],
              ].map(([lbl, val], i) => (
                <div key={i} className="flex flex-col gap-1.5 border-b border-[#f5f2ec]/14 py-5 sm:border-b-0 sm:border-r sm:pr-9 sm:last:border-r-0 sm:[&:not(:first-child)]:pl-9">
                  <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-[#f5f2ec]/50">{lbl}</span>
                  <span className="font-sans text-[22px] font-bold uppercase tracking-[-0.015em] text-[#f5f2ec]">{val}</span>
                </div>
              ))}
            </div>

            <div data-reveal data-delay="4" className="flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={scrollToInversion}
                className="inline-flex min-h-14 cursor-pointer items-center gap-6 border border-[#f5f2ec] bg-[#f5f2ec] px-10 text-[12px] font-semibold uppercase tracking-[0.26em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-8 hover:bg-[#ede8df] hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5f2ec]"
              >
                <span>Reservar mi lugar</span>
                <span className="font-serif text-[16px] italic normal-case tracking-normal">→</span>
              </button>
              <span className="border-l border-[#f5f2ec]/20 pl-5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f5f2ec]/60">
                Inversión · <strong className="text-[13px] font-bold text-[#f5f2ec]">$49,997 MXN</strong>
              </span>
            </div>
          </div>
        </section>

        {/* ============ DIRIGIDO A ============ */}
        <section className="border-b border-ink-900/10 bg-[#ede8df] px-5 py-24 sm:px-8 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[1312px]">
            <div data-reveal className="mb-14 text-center">
              <p className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.32em] text-[#6b4f2a]">— Dirigido a</p>
              <h2 className="mx-auto max-w-[960px] font-serif text-[32px] font-normal leading-[1.08] tracking-[-0.022em] text-ink-900 sm:text-[42px] lg:text-[52px]">
                Dueños de negocio, empresarios y directores de empresas <span className="italic text-[#6b4f2a]">que ya crecieron.</span>
              </h2>
            </div>
            <div className="grid gap-px border border-ink-900/10 bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-5">
              {dirigidoCards.map((card, i) => (
                <article
                  key={card.n}
                  data-reveal
                  data-delay={i ? String(i) : undefined}
                  className="flex flex-col gap-3.5 bg-[#f5f2ec] px-6 py-8 transition-all duration-500 hover:-translate-y-1 hover:bg-[#e3ddd0]"
                >
                  <span className="font-sans text-[28px] font-bold tracking-[-0.025em] text-[#6b4f2a]">{card.n}</span>
                  <p className="text-[13px] leading-[1.55] text-ink-700">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ DESCRIPCIÓN · pull quote ============ */}
        <section className="relative bg-[#f5f2ec] px-5 py-28 text-center sm:px-8 lg:px-16 lg:py-36">
          <div className="mx-auto max-w-[1060px]">
            <div data-reveal aria-hidden="true" className="-mb-16 select-none font-serif text-[160px] italic leading-none text-[#6b4f2a]/[0.08] sm:-mb-20 sm:text-[220px]">
              "
            </div>
            <p data-reveal data-delay="1" className="relative font-serif text-[24px] font-normal leading-[1.35] tracking-[-0.016em] text-ink-900 sm:text-[32px] lg:text-[38px]">
              Analizamos si tu operación, tu estructura fiscal y tu arquitectura patrimonial están realmente{' '}
              <strong className="border-b border-ink-900/30 font-normal">diseñadas para crecer</strong>… o si están{' '}
              <span className="italic text-[#6b4f2a]">improvisadas.</span>
            </p>
          </div>
        </section>

        {/* ============ ETAPAS ============ */}
        <section className="px-5 pb-24 pt-24 sm:px-8 lg:px-16 lg:pt-32">
          <div className="mx-auto max-w-[1312px]">
            <div data-reveal className="mb-16 text-center lg:mb-20">
              <p className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.32em] text-[#6b4f2a]">— Programa</p>
              <h2 className="font-sans text-[40px] font-bold uppercase leading-[0.98] tracking-[-0.04em] text-ink-900 sm:text-[56px] lg:text-[72px]">
                Cinco etapas <span className="text-[#6b4f2a]">para rediseñar</span> tu arquitectura.
              </h2>
              <p className="mx-auto mt-5 max-w-[720px] font-serif text-[16px] italic leading-[1.5] text-ink-700 sm:text-[18px]">
                Recibirás un material de trabajo personalizado, construido sobre tu estructura actual. Avanzamos contigo en una revisión guiada por etapas.
              </p>
            </div>

            {etapas.map((etapa, idx) => (
              <article
                key={etapa.num}
                className={`border-t border-ink-900/10 py-14 lg:py-[72px] ${idx === etapas.length - 1 ? 'border-b' : ''}`}
              >
                <div className="grid gap-10 lg:grid-cols-[140px_1fr_1fr] lg:gap-14">
                  <div data-reveal="num" className="font-serif text-[80px] italic leading-[0.9] tracking-[-0.025em] text-[#6b4f2a] lg:text-[120px]">
                    {etapa.roman}
                    <span className="mt-3 block font-sans text-[9.5px] font-medium not-italic uppercase tracking-[0.28em] text-[#6b6258]">
                      — Etapa {etapa.num}
                    </span>
                  </div>
                  <div data-reveal className="lg:pt-3">
                    <h3 className="mb-4 font-sans text-[28px] font-bold uppercase leading-[1.1] tracking-[-0.028em] text-ink-900 sm:text-[36px]">
                      {etapa.title}{' '}
                      <span className="font-serif text-[26px] font-normal normal-case italic tracking-[-0.014em] text-[#6b4f2a] sm:text-[34px]">{etapa.italic}</span>
                    </h3>
                    <p className="text-[14.5px] leading-[1.65] text-ink-700">{etapa.body}</p>
                    <div className="relative mt-6 overflow-hidden border border-ink-900/10 bg-[#ede8df] px-6 py-7">
                      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" style={{ backgroundImage: NOISE }} />
                      <div className="relative mx-auto max-w-[460px] [&>svg]:block [&>svg]:h-auto [&>svg]:w-full">{etapa.diagram}</div>
                      <p className="relative mt-3.5 text-center text-[9.5px] font-medium uppercase tracking-[0.26em] text-[#6b6258]">— {etapa.caption}</p>
                    </div>
                  </div>
                  <div data-reveal data-delay="1" className="lg:pt-3">
                    <ol className="list-none">
                      {etapa.items.map((item, i) => (
                        <li
                          key={i}
                          className="relative border-b border-ink-900/10 py-3 pl-[42px] text-[13.5px] leading-[1.5] text-ink-700 transition-all duration-300 last:border-b-0 hover:pl-[50px] hover:text-ink-900"
                        >
                          <span className="absolute left-0 top-3 font-sans text-[11px] font-bold tracking-[0.08em] text-[#6b4f2a]">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          {item}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ============ QUÉ TE LLEVAS ============ */}
        <section className="relative bg-[#0a0a0a] px-5 py-24 text-cream sm:px-8 lg:px-16 lg:py-32">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-25 mix-blend-screen" style={{ backgroundImage: NOISE }} />
          <div className="relative mx-auto max-w-[1312px]">
            <div data-reveal className="mb-16 text-center lg:mb-20">
              <h2 className="font-sans text-[44px] font-bold uppercase leading-[0.98] tracking-[-0.038em] text-cream sm:text-[60px] lg:text-[72px]">
                ¿Qué te <span className="text-[#8a6a3d]">llevas?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-[640px] font-serif text-[16px] italic text-cream/75 sm:text-[18px]">
                Aquí es donde debes subir el nivel. No es "te llevas ideas." — es implementación concreta.
              </p>
            </div>
            <div className="grid gap-px border border-cream/20 bg-cream/20 sm:grid-cols-2 lg:grid-cols-3">
              {llevas.map((card, i) => (
                <article
                  key={card.n}
                  data-reveal
                  data-delay={i ? String(Math.min(i, 5)) : undefined}
                  className="flex flex-col gap-4 bg-[#0a0a0a] px-8 py-10 transition-all duration-500 hover:-translate-y-1.5 hover:bg-[#1a1a1a]"
                >
                  <span className="font-serif text-[48px] italic leading-[0.9] tracking-[-0.02em] text-[#8a6a3d]">{card.n}</span>
                  <h3 className="font-sans text-[18px] font-bold uppercase leading-[1.2] tracking-[-0.014em] text-cream">{card.title}</h3>
                  <p className="text-[13px] leading-[1.65] text-cream/72">{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ INVERSIÓN ============ */}
        <section ref={inversionRef} id="inversion" className="scroll-mt-24 border-y border-ink-900/10 bg-[#ede8df] px-5 py-24 text-center sm:px-8 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[1312px]">
            <div data-reveal>
              <h2 className="mb-4 font-sans text-[44px] font-bold uppercase tracking-[-0.038em] text-ink-900 sm:text-[60px] lg:text-[72px]">
                Asegura tu <span className="text-[#6b4f2a]">lugar.</span>
              </h2>
              <p className="mx-auto mb-14 max-w-[620px] font-serif text-[16px] italic text-ink-700 sm:text-[17px]">
                Mesa Estratégica · Edición 2026. El acceso se otorga tras una llamada de pre-calificación 1:1 con un asesor.
              </p>
            </div>

            <div data-reveal="scale" className="relative mx-auto mt-7 max-w-[720px] bg-[#0a0a0a] text-cream">
              <div className="absolute -top-[18px] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-[#6b4f2a] px-6 py-2.5 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-cream shadow-[0_8px_20px_rgba(0,0,0,0.30)]">
                ★ Mesa Estratégica · 2026
              </div>
              <div className="relative overflow-hidden">
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen" style={{ backgroundImage: NOISE }} />

                <div className="relative px-7 pb-10 pt-[72px] text-center sm:px-14">
                  <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.32em] text-[#8a6a3d]">— Inversión única</p>
                  <p className="mb-6 font-sans text-[22px] font-bold uppercase tracking-[-0.025em] text-cream sm:text-[28px]">Revisión Estratégica</p>
                  <p className="font-sans text-[72px] font-bold leading-[0.95] tracking-[-0.055em] text-cream sm:text-[100px] lg:text-[128px]">
                    $49,997<span className="align-[0.5em] text-[28px] text-[#8a6a3d] sm:text-[48px]">*</span>
                  </p>
                  <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.26em] text-cream/60">MXN · Precios incluyen IVA</p>
                </div>

                <div className="relative border-y border-cream/14 bg-cream/[0.04] px-7 pb-7 pt-8 text-left sm:px-14">
                  <p className="mb-1 border-b border-cream/14 pb-4 text-[10px] font-medium uppercase tracking-[0.30em] text-[#8a6a3d]">— Cómo funciona el acceso</p>
                  {[
                    <>Agendas una llamada con un asesor <em className="font-serif text-cream/65">— sin costo.</em></>,
                    <>Validamos juntos si esta mesa es <em className="font-serif text-cream/65">para tu empresa.</em></>,
                    <>Te enviamos la invitación formal <em className="font-serif text-cream/65">y los pasos de pago.</em></>,
                  ].map((txt, i) => (
                    <div key={i} className="grid grid-cols-[52px_1fr] items-baseline gap-4 border-b border-cream/10 py-4 last:border-b-0">
                      <span className="font-serif text-[30px] italic leading-[0.9] text-[#8a6a3d]">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-[14.5px] leading-[1.55] text-cream">{txt}</p>
                    </div>
                  ))}
                </div>

                <div className="relative px-7 pb-12 pt-9 sm:px-14">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={waClickHandler('revision-estrategica-inversion', WA_MESSAGE)}
                    className="inline-flex min-h-14 w-full items-center justify-center gap-3.5 border border-cream bg-cream px-6 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-5 hover:bg-[#ede8df] hover:shadow-[0_12px_30px_rgba(0,0,0,0.30)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:text-[12px]"
                  >
                    <WhatsAppIcon className="h-4 w-4 shrink-0" />
                    Agendar llamada con un asesor
                    <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
                  </a>
                  <p className="mt-4 text-center text-[10px] font-medium uppercase tracking-[0.26em] text-cream/55">
                    — Cupos limitados · Pre-calificación 1:1 antes de reservar
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ CIERRE ============ */}
        <section className="relative overflow-hidden bg-[#1a1a1a] px-5 py-28 text-center text-cream sm:px-8 lg:px-16 lg:py-36">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-20 mix-blend-screen" style={{ backgroundImage: NOISE }} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full"
            style={{
              left: '-200px',
              bottom: '-180px',
              width: '720px',
              height: '720px',
              background: 'radial-gradient(circle, rgba(180,150,110,0.18) 0%, transparent 62%)',
            }}
          />
          <div className="relative mx-auto max-w-[1100px]">
            <h2 data-reveal className="font-sans text-[40px] font-bold uppercase leading-none tracking-[-0.042em] text-cream sm:text-[64px] lg:text-[88px]">
              Diseñada para crecer,{' '}
              <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-[#8a6a3d]">no improvisada.</span>
            </h2>
            <p data-reveal data-delay="1" className="mt-10 font-serif text-[18px] italic text-cream/75 sm:text-[20px]">
              — Mesa Estratégica · Edición 2026
            </p>
          </div>
        </section>

        {/* ============ REGISTRO · HubSpot ============ */}
        <section
          id="registro"
          className="scroll-mt-24 relative border-t border-cream/10 bg-ink-800 px-5 py-24 text-cream sm:px-8 lg:px-16 lg:py-32"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(180,150,110,0.15),transparent_62%)]" />

          <div className="relative mx-auto grid max-w-[1180px] items-start gap-16 lg:grid-cols-[1fr_640px] lg:gap-20">
            <div>
              <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.30em] text-[#b98a4a]">
                ★ Mesa Estratégica · 2026
              </p>
              <h2 className="mb-7 font-serif text-[44px] font-normal leading-[0.98] tracking-[-0.024em] text-cream sm:text-[56px] lg:text-[64px]">
                Solicita tu <span className="italic">pre-calificación.</span>
              </h2>
              <p className="mb-9 max-w-[440px] text-[15px] leading-[1.7] text-cream/78">
                Déjanos tus datos y un asesor te contacta para validar si la Mesa Estratégica es para tu empresa.
                Cupos limitados — el acceso se confirma tras la llamada 1:1.
              </p>
              <div className="border-y border-cream/20">
                {[
                  ['Formato', 'Mesa Estratégica'],
                  ['Modalidad', 'Presencial 1:1'],
                  ['Inversión', '$49,997 MXN'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[160px_1fr] items-baseline gap-5 border-b border-cream/10 py-4 last:border-b-0"
                  >
                    <span className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/50">— {label}</span>
                    <span className="font-serif text-[18px] italic text-cream">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative border border-ink-900/30 bg-cream p-9 text-ink-900 shadow-[0_40px_100px_rgba(0,0,0,0.42),0_12px_30px_rgba(0,0,0,0.22)] sm:p-11">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">
                — Formulario de registro
              </p>
              <h3 className="mb-7 font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.016em] text-ink-900 sm:text-[32px]">
                Regístrate a la <span className="italic">Revisión Estratégica.</span>
              </h3>

              <HubspotForm
                portalId={HUBSPOT_FORMS.revisionEstrategica.portalId}
                formId={HUBSPOT_FORMS.revisionEstrategica.formId}
              />

              <div className="mt-6 border-t border-ink-900/10 pt-5 text-center font-serif text-[13px] italic text-ink-600">
                — Un asesor te contactará en menos de 24 horas.
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
