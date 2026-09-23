import { useEffect, useRef } from 'react';

/**
 * Landing "El emprendedor vs. el CEO" — clase gratuita por Zoom.
 * Diseno adaptado del wireframe compartido preservando la paleta
 * clay-tierra + editorial (Baskerville + Helvetica) del sitio.
 *
 * El formulario de registro esta reemplazado por el embed de HubSpot
 * (portal 49215056, form 5057ba2a-b64d-4073-967d-2c61c652dc77). El
 * script del embed se carga una sola vez por sesion; el elemento
 * `.hs-form-html` se renderiza dentro del contenedor y HubSpot lo
 * hidrata al detectar el script.
 */

const HUBSPOT_SCRIPT_ID = 'hs-form-embed-49215056';
const HUBSPOT_SCRIPT_SRC = 'https://js.hsforms.net/forms/embed/developer/49215056.js';
const HUBSPOT_PORTAL_ID = '49215056';
const HUBSPOT_FORM_ID = '5057ba2a-b64d-4073-967d-2c61c652dc77';

const metaItems: [string, string][] = [
  ['Fecha', '10 de noviembre · 2026'],
  ['Modalidad', 'Zoom en vivo'],
  ['Inversión', 'Gratuita'],
];

const emprendedorItems = [
  'Ventas del mes',
  'Saldo en bancos',
  'Gastos de la empresa',
  'Empleados y nómina',
];

const ceoItems = [
  'Flujo disponible real',
  'Rentabilidad por unidad de negocio',
  'Patrimonio neto',
  'Velocidad de crecimiento',
];

type TemarioBlock = {
  num: string;
  title: string;
  italic: string;
  subtitle: string;
  items: { text: string; it?: string }[];
};

const temarioBlocks: TemarioBlock[] = [
  {
    num: '01',
    title: 'Mentalidad CEO',
    italic: 'vs. emprendedor.',
    subtitle: 'Dos formas distintas de mirar la misma empresa —y por qué solo una la hace crecer.',
    items: [
      { text: 'Qué mira un emprendedor:', it: 'ventas, saldo, gastos, empleados.' },
      { text: 'Qué mira un CEO:', it: 'flujo real, rentabilidad, patrimonio, velocidad.' },
      { text: 'Por qué facturar más no es lo mismo que crecer.' },
      { text: 'Autodiagnóstico:', it: '¿qué revisaste hoy tú?' },
    ],
  },
  {
    num: '02',
    title: 'Tablero 1:',
    italic: 'Flujo.',
    subtitle: 'El dinero que crees que tienes y el que realmente puedes usar.',
    items: [
      { text: 'Saldo bancario real', it: 'vs. saldo disponible (menos impuestos, tarjetas, pasivos, compromisos).' },
      { text: 'Cuánto puedes retirar hoy', it: 'sin poner en riesgo la operación.' },
      { text: 'Flujo mensual y su crecimiento.' },
      { text: 'Flujo por unidad de negocio.' },
    ],
  },
  {
    num: '03',
    title: 'Tablero 2:',
    italic: 'Unidades de negocio.',
    subtitle: 'Cuál genera riqueza real y cuál solo genera ventas.',
    items: [
      { text: 'Flujo por unidad,', it: 'no solo ventas por unidad.' },
      { text: 'Participación porcentual de cada negocio en el total.' },
      { text: 'Cómo detectar qué unidad', it: 'genera riqueza real.' },
      { text: 'Qué hacer con las que no.' },
    ],
  },
  {
    num: '04',
    title: 'Tablero 3:',
    italic: 'Inteligencia fiscal.',
    subtitle: 'Lo que sí pagas y lo que crees que pagas.',
    items: [
      { text: 'Lo que realmente pagas de impuestos', it: 'vs. lo que crees.' },
      { text: 'IVA por pagar', it: 'vs. IVA acreditable.' },
      { text: 'Retenciones y su impacto en el flujo.' },
      { text: 'Flujo comprometido con autoridades.' },
    ],
  },
  {
    num: '05',
    title: 'Tablero 4:',
    italic: 'Patrimonio.',
    subtitle: 'El indicador maestro que resume tu decisión empresarial.',
    items: [
      { text: 'Activos que generan flujo', it: 'vs. activos que generan plusvalía.' },
      { text: 'Activos personales', it: 'vs. empresariales.' },
      { text: 'Clasificación de pasivos:', it: 'bancarios, hipotecarios, personales, empresariales.' },
      { text: 'Patrimonio neto como', it: 'indicador maestro.' },
    ],
  },
  {
    num: '06',
    title: 'Las 4 Decisiones',
    italic: '(Rockefeller).',
    subtitle: 'La arquitectura de dirección que sostiene el crecimiento consistente.',
    items: [
      { text: 'Estrategia:', it: 'BHAG, propósito, valores, visión.' },
      { text: 'Equipo:', it: 'contratación por valores, accountability, ownership.' },
      { text: 'Ejecución:', it: 'prioridades, indicadores, juntas de ritmo.' },
      { text: 'Efectivo:', it: 'flujo, utilidad, planeación financiera.' },
    ],
  },
  {
    num: '07',
    title: 'El costo',
    italic: 'de la incertidumbre.',
    subtitle: 'La cifra que nadie calcula —y que separa a las empresas que crecen de las que se quedan.',
    items: [
      { text: 'Empresas que crecen también tienen problemas.', it: 'La diferencia es el sistema.' },
      { text: 'Caso: perder 10% de crecimiento en $20M =', it: '$600K perdidos.' },
      { text: 'Caso: en $50M, la pérdida sube a', it: '$750K–$1M.' },
      { text: 'Sin sistema, la incertidumbre', it: 'siempre gana.' },
    ],
  },
];

const llevas = [
  { n: '01', text: 'Claridad sobre la diferencia entre lo que mide un', it: 'emprendedor y lo que mide un CEO.' },
  { n: '02', text: 'Los', it: '4 tableros que necesitas empezar a revisar en tu empresa.' },
  { n: '03', text: 'Una introducción al sistema de las', it: '4 Decisiones.' },
  { n: '04', text: 'El', it: 'costo real de operar sin sistema.' },
];

// Carga el script del embed de HubSpot una unica vez por documento.
function useHubspotEmbed() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (document.getElementById(HUBSPOT_SCRIPT_ID)) return;
    const script = document.createElement('script');
    script.id = HUBSPOT_SCRIPT_ID;
    script.src = HUBSPOT_SCRIPT_SRC;
    script.defer = true;
    document.body.appendChild(script);
  }, []);
}

export default function EmprendedorVsCeoLanding() {
  useHubspotEmbed();
  const formRef = useRef<HTMLDivElement | null>(null);

  const scrollToRegistro = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <main className="overflow-hidden bg-cream text-ink-900">
      {/* ============ ANIMACIONES GLOBALES DE LA LANDING ============ */}
      <style>{`
        @keyframes ddHeroGlowBreathe {
          0%, 100% { opacity: .85; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.06); }
        }
        @keyframes ddHeroBeamSweep {
          0%   { transform: translateX(-8%); opacity: .0; }
          40%  { opacity: 1; }
          100% { transform: translateX(8%);  opacity: 0; }
        }
        @keyframes ddHeroPieceDrift {
          0%, 100% { transform: translateY(0)      rotate(0deg); }
          50%      { transform: translateY(-10px)  rotate(-.35deg); }
        }
        @keyframes ddHeroSpark {
          0%, 100% { opacity: 0;   transform: translateY(0)   scale(.6); }
          15%      { opacity: .7;                                       }
          50%      { opacity: 1;   transform: translateY(-16px) scale(1); }
          85%      { opacity: .5;                                       }
        }
        @keyframes ddHeroDotPulse {
          0%, 100% { transform: scale(1);    opacity: .85; box-shadow: 0 0 12px rgba(196,148,84,.75), 0 0 3px rgba(255,220,170,.9); }
          50%      { transform: scale(1.55); opacity: 1;   box-shadow: 0 0 28px rgba(196,148,84,1),   0 0 6px rgba(255,220,170,1);  }
        }
        @keyframes ddHeroShineSweep {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes ddHeroBtnSheen {
          0%   { transform: translateX(0)     skewX(-20deg); }
          55%  { transform: translateX(420%)  skewX(-20deg); }
          100% { transform: translateX(420%)  skewX(-20deg); }
        }
        @keyframes ddHeroScrollCue {
          0%   { transform: scaleY(0); transform-origin: top;    }
          50%  { transform: scaleY(1); transform-origin: top;    }
          51%  {                        transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        @keyframes ddSectionAurora {
          0%, 100% { transform: translate3d(0,0,0)   scale(1);   opacity: .55; }
          50%      { transform: translate3d(3%,-2%,0) scale(1.08); opacity: .9;  }
        }

        .dd-hero-glow, .dd-hero-glow-inner {
          animation: ddHeroGlowBreathe 5.6s ease-in-out infinite;
        }
        .dd-hero-glow-inner { animation-duration: 4.2s; animation-delay: .3s; }
        .dd-hero-beam       { animation: ddHeroBeamSweep 7.5s ease-in-out infinite; }
        .dd-hero-piece      { animation: ddHeroPieceDrift 8s ease-in-out infinite; }
        .dd-hero-dot        { animation: ddHeroDotPulse 2.6s ease-in-out infinite; }
        .dd-hero-scrollcue  { animation: ddHeroScrollCue 2.4s ease-in-out infinite; }

        .dd-hero-shine {
          background-image: linear-gradient(
            100deg,
            #8a6a3d 0%,
            #c49454 30%,
            #ffe1ad 48%,
            #c49454 66%,
            #8a6a3d 100%
          );
          background-size: 200% 100%;
          background-position: 0 0;
          animation: ddHeroShineSweep 6.5s linear infinite;
        }

        .dd-section-aurora { animation: ddSectionAurora 9s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .dd-hero-glow, .dd-hero-glow-inner, .dd-hero-beam,
          .dd-hero-piece, .dd-hero-dot, .dd-hero-scrollcue,
          .dd-hero-spark, .dd-hero-shine, .dd-section-aurora,
          .dd-hero-cta [style*="ddHeroBtnSheen"] {
            animation: none !important;
          }
          .dd-hero-shine {
            background: #c49454;
            -webkit-background-clip: text;
            background-clip: text;
          }
        }
      `}</style>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-[#050505] text-cream">
        <div className="relative z-[6] border-b border-cream/10 bg-cream px-5 py-3 text-center text-[10px] font-medium uppercase tracking-[0.26em] text-ink-900 sm:px-8">
          <span className="mr-3 inline-block border border-ink-900 px-2 py-0.5 text-[9px] tracking-[0.22em]">
            Clase gratuita
          </span>
          <span>Vía Zoom · En vivo</span>
          <span className="mx-3 text-ink-500">·</span>
          <span>10 de noviembre · 2026</span>
        </div>

        {/* --- Capas de fondo --- */}
        {/* 1. Gradiente base radial (mancha profunda en la izquierda) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              'radial-gradient(120% 90% at 12% 40%, #0a0a0a 0%, #050505 55%, #000 100%)',
          }}
        />

        {/* 2. Halo dorado principal detrás de las piezas (respira) */}
        <div
          aria-hidden="true"
          className="dd-hero-glow pointer-events-none absolute z-[1] hidden lg:block"
          style={{
            right: '-4%',
            top: '20%',
            width: '780px',
            height: '780px',
            background:
              'radial-gradient(circle at 40% 55%, rgba(196,148,84,0.55) 0%, rgba(138,106,61,0.32) 22%, rgba(107,79,42,0.14) 44%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
        {/* Halo mobile (más pequeño, arriba) */}
        <div
          aria-hidden="true"
          className="dd-hero-glow pointer-events-none absolute z-[1] block lg:hidden"
          style={{
            right: '-20%',
            top: '2%',
            width: '520px',
            height: '520px',
            background:
              'radial-gradient(circle at 40% 55%, rgba(196,148,84,0.42) 0%, rgba(138,106,61,0.22) 30%, transparent 68%)',
            filter: 'blur(4px)',
          }}
        />

        {/* 3. Rayo de luz diagonal (spot cinematográfico) */}
        <div
          aria-hidden="true"
          className="dd-hero-beam pointer-events-none absolute inset-0 z-[1] mix-blend-screen"
          style={{
            background:
              'linear-gradient(115deg, transparent 40%, rgba(196,148,84,0.10) 55%, rgba(255,220,170,0.05) 62%, transparent 78%)',
          }}
        />

        {/* 4. Grano editorial */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        {/* 5. Partículas de polvo luminoso */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] hidden lg:block">
          {Array.from({ length: 18 }).map((_, i) => {
            const seed = i * 137;
            const left = (seed % 90) + 5;
            const top = (seed * 1.7) % 100;
            const size = 1.5 + (i % 3) * 0.8;
            const dur = 6 + (i % 5) * 1.8;
            const delay = (i % 7) * 0.7;
            return (
              <span
                key={i}
                className="dd-hero-spark absolute rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: '#e6c78c',
                  boxShadow: '0 0 8px rgba(230,199,140,0.85)',
                  animation: `ddHeroSpark ${dur}s ease-in-out ${delay}s infinite`,
                  opacity: 0,
                }}
              />
            );
          })}
        </div>

        {/* --- Contenido --- */}
        <div className="relative z-[3] mx-auto grid max-w-[1312px] items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:px-16 lg:py-28">
          {/* Columna texto */}
          <div className="relative">
            <div className="mb-10 flex flex-col gap-3 border-b border-cream/20 pb-5 text-[10px] font-medium uppercase tracking-[0.30em] text-cream/55 sm:flex-row sm:items-center sm:justify-between">
              <span><span className="text-[#c49454]">— 00</span> Evento gratuito 2026</span>
              <span>Diego Díaz · Estratega fiscal</span>
            </div>

            <h1 className="font-sans font-bold leading-[0.94] tracking-[-0.055em] text-cream text-[64px] sm:text-[104px] lg:text-[132px] xl:text-[156px]">
              <span className="block">Tablero</span>
              <span className="block">
                del{' '}
                <span className="dd-hero-shine relative inline-block bg-clip-text text-transparent">
                  CEO
                </span>
                <span className="font-serif text-cream/40 italic tracking-[-0.02em]">.</span>
              </span>
            </h1>

            <p className="mt-8 max-w-[540px] text-[15.5px] leading-[1.7] text-cream/80">
              La diferencia entre <strong className="font-medium text-cream">facturar más</strong> y realmente crecer no
              está en el esfuerzo. Está en el sistema. Una clase por Zoom para dueños de empresa que quieren pasar de
              administrar operación a dirigir un negocio.
            </p>

            <div className="mt-11 grid gap-6 border-y border-cream/20 py-6 sm:grid-cols-3">
              {metaItems.map(([label, value]) => (
                <div key={label}>
                  <p className="text-[9.5px] font-medium uppercase tracking-[0.24em] text-cream/55">— {label}</p>
                  <p className="mt-2 font-serif text-[18px] italic text-cream">{value}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToRegistro}
              className="dd-hero-cta group relative mt-11 inline-flex min-h-14 cursor-pointer items-center gap-6 overflow-hidden border border-cream bg-cream px-9 text-[11.5px] font-medium uppercase tracking-[0.24em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-8 hover:bg-cream-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
            >
              <span className="relative z-[1]">Reservar mi lugar gratis</span>
              <span className="relative z-[1] font-serif text-[16px] italic normal-case tracking-normal">→</span>
              <span className="relative z-[1] ml-4 border-l border-ink-900/15 pl-4 font-serif text-[13px] italic normal-case tracking-normal text-[#6b4f2a]">
                Cupos limitados
              </span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.75) 50%, transparent 100%)',
                  animation: 'ddHeroBtnSheen 4.2s ease-in-out 1.4s infinite',
                }}
              />
            </button>
          </div>

          {/* Columna imagen — piezas de ajedrez con drift + halo */}
          <div className="relative order-first h-[380px] lg:order-none lg:h-[640px]">
            {/* Halo secundario detrás de las piezas (dorado cálido, muy blur) */}
            <div
              aria-hidden="true"
              className="dd-hero-glow-inner pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(45% 55% at 50% 60%, rgba(255,196,120,0.42) 0%, rgba(196,148,84,0.22) 30%, transparent 70%)',
                filter: 'blur(2px)',
              }}
            />
            <img
              src="/eventos/ceo-ajedrez-hero.webp"
              alt="Piezas de ajedrez iluminadas — metáfora del tablero del CEO"
              loading="eager"
              decoding="async"
              className="dd-hero-piece relative z-[1] mx-auto h-full w-auto max-w-[560px] select-none object-contain"
              style={{
                filter:
                  'drop-shadow(0 40px 60px rgba(196,148,84,0.28)) drop-shadow(0 0 30px rgba(196,148,84,0.18))',
              }}
            />
            {/* Punto dorado flotante (acento editorial) */}
            <span
              aria-hidden="true"
              className="dd-hero-dot absolute z-[2] rounded-full"
              style={{
                left: '18%',
                top: '18%',
                width: '10px',
                height: '10px',
                backgroundColor: '#c49454',
                boxShadow: '0 0 20px rgba(196,148,84,0.9), 0 0 4px rgba(255,220,170,1)',
              }}
            />
          </div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-[4] hidden -translate-x-1/2 flex-col items-center gap-2 text-[9.5px] font-medium uppercase tracking-[0.36em] text-cream/45 lg:flex"
        >
          <span>Scroll</span>
          <span
            className="dd-hero-scrollcue block h-8 w-px"
            style={{
              background: 'linear-gradient(to bottom, rgba(230,199,140,0.9), transparent)',
            }}
          />
        </div>
      </section>

      {/* ============ PROBLEMA ============ */}
      <section className="border-y border-ink-900/10 bg-cream-200 px-5 py-24 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1312px]">
          <p className="mb-5 text-center text-[10.5px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">
            — El planteamiento
          </p>
          <h2 className="mx-auto max-w-[1080px] text-center font-serif text-[36px] font-normal leading-[1.15] tracking-[-0.02em] sm:text-[48px]">
            ¿Cuántos de ustedes revisaron hoy su flujo disponible real, su rentabilidad por unidad de negocio,{' '}
            <span className="italic text-[#6b4f2a]">su patrimonio neto?</span>
          </h2>

          <div className="mt-14 grid gap-10 border-t border-ink-900/10 pt-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <div className="px-5">
              <p className="mb-5 border-b border-ink-900/30 pb-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-ink-600">
                — Lo que revisa un emprendedor
              </p>
              <h3 className="mb-4 font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.014em] sm:text-[32px]">
                Administra <span className="italic">operación.</span>
              </h3>
              <ul className="list-none space-y-2.5 text-[14px] leading-[1.55]">
                {emprendedorItems.map((item) => (
                  <li key={item} className="grid grid-cols-[14px_1fr] gap-3">
                    <span className="font-serif italic text-ink-600">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider con "vs." */}
            <div className="relative hidden w-px self-stretch bg-ink-900/30 lg:block">
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-cream-200 px-2.5 py-3.5 font-serif text-[22px] italic text-[#6b4f2a]">
                vs.
              </span>
            </div>

            <div className="px-5">
              <p className="mb-5 border-b border-ink-900/30 pb-3.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[#6b4f2a]">
                — Lo que revisa un CEO
              </p>
              <h3 className="mb-4 font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.014em] sm:text-[32px]">
                Dirige el <span className="italic">sistema.</span>
              </h3>
              <ul className="list-none space-y-2.5 text-[14px] leading-[1.55]">
                {ceoItems.map((item) => (
                  <li key={item} className="grid grid-cols-[14px_1fr] gap-3">
                    <span className="font-serif italic text-[#6b4f2a]">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-14 border-t border-ink-900/10 pt-9 text-center font-serif text-[24px] font-normal leading-[1.15] tracking-[-0.014em] sm:text-[32px]">
            Facturar más <span className="italic text-[#6b4f2a]">no es lo mismo</span> que crecer.
          </p>
        </div>
      </section>

      {/* ============ PROMESA ============ */}
      <section className="px-5 py-24 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[960px] text-center">
          <p className="mb-5 text-[10.5px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">— La tesis</p>
          <h2 className="mx-auto mb-8 max-w-[960px] font-serif text-[38px] font-normal leading-[1.02] tracking-[-0.022em] sm:text-[56px]">
            La mayoría de las empresas que crecen no dependen de un dueño brillante. Dependen de un{' '}
            <span className="italic">sistema de dirección.</span>
          </h2>
          <p className="mx-auto mb-5 max-w-[820px] text-[16px] leading-[1.75] text-ink-800">
            Después de estudiar empresas que crecían de forma consistente, encontramos que casi todas compartían la
            misma arquitectura interna: <strong className="font-medium text-ink-900">tableros claros</strong> y{' '}
            <strong className="font-medium text-ink-900">decisiones repetibles</strong>.
          </p>
          <p className="mx-auto mb-6 max-w-[820px] text-[16px] leading-[1.75] text-ink-800">
            En esta clase por Zoom, gratuita, vas a conocer los{' '}
            <span className="font-serif italic text-[#6b4f2a]">4 tableros que usa un CEO</span> para dirigir su empresa —y el{' '}
            <span className="font-serif italic text-[#6b4f2a]">sistema de las 4 Decisiones</span> que sostiene ese crecimiento.
          </p>
          <button
            type="button"
            onClick={scrollToRegistro}
            className="mt-9 inline-flex min-h-14 items-center gap-5 bg-ink-900 px-9 text-[11.5px] font-medium uppercase tracking-[0.24em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:gap-7 hover:bg-[#6b4f2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            Quiero mi lugar en Zoom
            <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
          </button>
        </div>
      </section>

      {/* ============ TEMARIO ============ */}
      <section className="relative bg-ink-900 py-28 text-cream sm:py-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(180,150,110,0.10),transparent_60%)]" />
        <div className="relative mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-16">
          <div className="mb-10 grid gap-6 border-b border-cream/20 pb-7 lg:grid-cols-[1fr_auto] lg:items-start lg:gap-8">
            <div>
              <h2 className="font-serif text-[36px] font-normal leading-[1.02] tracking-[-0.022em] text-cream sm:text-[48px]">
                Temario <span className="italic">completo.</span>
              </h2>
              <p className="mt-3 max-w-[640px] text-[15px] leading-[1.65] text-cream/75">
                Siete bloques secuenciales. De la mentalidad CEO al costo real de operar sin sistema.
              </p>
            </div>
            <p className="text-right text-[10px] font-medium uppercase leading-[1.6] tracking-[0.20em] text-cream/55">
              Programa<br />en vivo
            </p>
          </div>
        </div>

        <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
          <div className="flex flex-col gap-px border border-cream/20 bg-cream/20">
            {temarioBlocks.map((block) => (
              <article
                key={block.num}
                className="grid gap-8 bg-ink-900 px-6 py-9 transition-colors duration-500 hover:bg-ink-800 sm:grid-cols-[110px_1fr_1.4fr] sm:gap-11 sm:px-11"
              >
                <div className="font-serif text-[48px] font-normal leading-[0.9] tracking-[-0.02em] text-cream sm:text-[58px]">
                  {block.num}
                </div>
                <div>
                  <h3 className="mb-3 font-serif text-[22px] font-normal leading-[1.12] tracking-[-0.014em] text-cream sm:text-[26px]">
                    {block.title} <span className="italic">{block.italic}</span>
                  </h3>
                  <p className="max-w-[340px] text-[12.5px] leading-[1.6] text-cream/65">{block.subtitle}</p>
                </div>
                <ul className="list-none border-t border-cream/20">
                  {block.items.map((item, i) => (
                    <li
                      key={i}
                      className="border-b border-cream/15 py-2.5 text-[12.5px] leading-[1.5] text-cream/85 transition-all duration-300 hover:pl-3 hover:text-cream"
                    >
                      {item.text}
                      {item.it && <span className="italic text-cream/55"> {item.it}</span>}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-[1312px] px-5 text-center sm:px-8 lg:px-16">
          <button
            type="button"
            onClick={scrollToRegistro}
            className="inline-flex min-h-14 items-center gap-5 bg-cream px-9 text-[11.5px] font-medium uppercase tracking-[0.24em] text-ink-900 transition-all duration-300 hover:-translate-y-0.5 hover:gap-7 hover:bg-cream-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            Ver horario y reservar mi lugar en Zoom
            <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
          </button>
        </div>
      </section>

      {/* ============ COSTO ============ */}
      <section className="border-y border-ink-900/10 bg-cream-200 px-5 py-28 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-[1312px]">
          <div className="mb-16 text-center">
            <p className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.32em] text-[#6b4f2a]">
              — El costo de operar sin sistema
            </p>
            <h2 className="mx-auto max-w-[900px] font-serif text-[38px] font-normal leading-[1.05] tracking-[-0.022em] sm:text-[52px]">
              Si tu empresa deja de crecer 10%, <span className="italic">¿cuánto pierdes?</span>
            </h2>
          </div>

          <div className="mx-auto grid max-w-[960px] gap-px border border-ink-900/30 bg-ink-900/10 md:grid-cols-2">
            {[
              {
                label: 'Empresa · $20 millones',
                intro: (
                  <>
                    Si tu empresa factura <span className="italic">$20 millones</span> y deja de crecer 10%…
                  </>
                ),
                amount: '$600,000',
                outro: (
                  <>
                    Perdidos <span className="italic">en un año.</span>
                  </>
                ),
              },
              {
                label: 'Empresa · $50 millones',
                intro: (
                  <>
                    Si tu empresa factura <span className="italic">$50 millones</span>, la pérdida sube a…
                  </>
                ),
                amount: '$750K–$1M',
                outro: (
                  <>
                    Perdidos <span className="italic">en un año.</span>
                  </>
                ),
              },
            ].map((card) => (
              <div key={card.label} className="flex flex-col gap-4 bg-cream p-10">
                <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-ink-600">— {card.label}</span>
                <p className="font-serif text-[19px] leading-[1.35] text-ink-800">{card.intro}</p>
                <p className="font-serif text-[48px] font-normal leading-[0.95] tracking-[-0.028em] text-[#6b4f2a] sm:text-[56px]">
                  <span className="mr-2 align-super text-[18px] font-medium tracking-[0.12em] text-ink-600">MXN</span>
                  {card.amount}
                </p>
                <p className="font-serif text-[19px] leading-[1.35] text-ink-800">{card.outro}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 text-center font-serif text-[26px] font-normal italic leading-[1.15] text-ink-800 sm:text-[32px]">
            ¿Cuánto cuesta un año de{' '}
            <span className="border-b border-[#6b4f2a] pb-1 text-[#6b4f2a]">incertidumbre sin sistema?</span>
          </p>
        </div>
      </section>

      {/* ============ TE LLEVAS ============ */}
      <section className="px-5 py-24 sm:px-8 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1312px]">
          <div className="grid items-start gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <div>
              <p className="mb-4 text-[10.5px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">
                — Al terminar la clase
              </p>
              <h2 className="mb-6 font-serif text-[38px] font-normal leading-[1.02] tracking-[-0.022em] sm:text-[52px]">
                No es teoría. Es una primera mirada <span className="italic">al sistema.</span>
              </h2>
              <p className="mb-9 text-[15px] leading-[1.75] text-ink-800">
                Es una <strong className="font-medium text-ink-900">primera mirada al sistema</strong> con el que vas a
                dirigir tu empresa, en vivo por Zoom. Sales sabiendo qué medir, qué no, y por dónde empezar el lunes por la
                mañana.
              </p>
              <button
                type="button"
                onClick={scrollToRegistro}
                className="inline-flex min-h-14 items-center gap-5 bg-ink-900 px-9 text-[11.5px] font-medium uppercase tracking-[0.24em] text-cream transition-all duration-300 hover:-translate-y-0.5 hover:gap-7 hover:bg-[#6b4f2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
              >
                Sí, quiero mi lugar gratis en Zoom
                <span className="font-serif text-[15px] italic normal-case tracking-normal">→</span>
              </button>
            </div>

            <div className="border border-ink-900/30 bg-cream-200 px-10 py-11">
              <div className="mb-2 border-b border-ink-900/10 pb-4 text-[10.5px] font-medium uppercase tracking-[0.28em] text-ink-600">
                — Lo que te llevas
              </div>
              <ul className="list-none">
                {llevas.map((item) => (
                  <li
                    key={item.n}
                    className="grid grid-cols-[44px_1fr] items-start gap-4 border-b border-ink-900/10 py-5 last:border-b-0"
                  >
                    <span className="pt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#6b4f2a]">
                      — {item.n}
                    </span>
                    <span className="font-serif text-[17px] leading-[1.4] tracking-[-0.008em] text-ink-900">
                      {item.text} <span className="italic text-ink-600">{item.it}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL · Registro con HubSpot ============ */}
      <section
        id="registro"
        ref={formRef}
        className="scroll-mt-24 relative border-t border-cream/10 bg-ink-800 px-5 py-24 text-cream sm:px-8 lg:px-16 lg:py-32"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(180,150,110,0.15),transparent_62%)]" />

        <div className="relative mx-auto grid max-w-[1180px] items-start gap-16 lg:grid-cols-[1fr_640px] lg:gap-20">
          <div>
            <h2 className="mb-7 font-serif text-[44px] font-normal leading-[0.98] tracking-[-0.024em] text-cream sm:text-[56px] lg:text-[64px]">
              Reserva tu <span className="italic">lugar en Zoom.</span>
            </h2>
            <p className="mb-9 max-w-[440px] text-[15px] leading-[1.7] text-cream/78">
              Déjanos tus datos y te enviamos el enlace de acceso por correo y por WhatsApp. Cupos limitados —confírmalos
              antes de que se cierre el registro.
            </p>
            <div className="border-y border-cream/20">
              {metaItems.map(([label, value]) => (
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

          {/* Card del formulario HubSpot */}
          <div className="relative border border-ink-900/30 bg-cream p-9 text-ink-900 shadow-[0_40px_100px_rgba(0,0,0,0.42),0_12px_30px_rgba(0,0,0,0.22)] sm:p-11">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.30em] text-[#6b4f2a]">
              — Formulario de registro
            </p>
            <h3 className="mb-7 font-serif text-[28px] font-normal leading-[1.05] tracking-[-0.016em] text-ink-900 sm:text-[32px]">
              Deja tus datos <span className="italic">y adentro.</span>
            </h3>

            {/* Embed oficial de HubSpot — el script global hidrata este div */}
            <div
              className="hs-form-html dd-hs-form"
              data-region="na1"
              data-form-id={HUBSPOT_FORM_ID}
              data-portal-id={HUBSPOT_PORTAL_ID}
            />

            <div className="mt-6 border-t border-ink-900/10 pt-5 text-center font-serif text-[13px] italic text-ink-600">
              — Recibirás el enlace de acceso en menos de 5 minutos.
            </div>

            {/* Ajustes visuales minimos para el markup que inyecta HubSpot,
                sin romper su comportamiento */}
            <style>{`
              .dd-hs-form form { display:flex; flex-direction:column; gap:22px; }
              .dd-hs-form .hs-form-field { display:flex; flex-direction:column; }
              .dd-hs-form label {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 9px;
                font-weight: 500;
                letter-spacing: 0.20em;
                text-transform: uppercase;
                color: #6b6258;
                margin-bottom: 8px;
              }
              .dd-hs-form .hs-form-required { color: #6b4f2a; margin-left: 4px; }
              .dd-hs-form input[type="text"],
              .dd-hs-form input[type="email"],
              .dd-hs-form input[type="tel"],
              .dd-hs-form input[type="number"],
              .dd-hs-form select,
              .dd-hs-form textarea {
                width: 100%;
                font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
                font-size: 16px;
                color: #0a0a0a;
                background: transparent;
                border: 0;
                border-bottom: 1px solid rgba(10,10,10,0.32);
                padding: 4px 0 10px;
                outline: none;
                transition: border-color 260ms ease;
                -webkit-appearance: none;
                appearance: none;
                border-radius: 0;
              }
              .dd-hs-form input:focus,
              .dd-hs-form select:focus,
              .dd-hs-form textarea:focus { border-bottom-color: #0a0a0a; }
              .dd-hs-form input::placeholder,
              .dd-hs-form textarea::placeholder { color: #6b6258; font-style: italic; }
              .dd-hs-form select {
                cursor: pointer;
                background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path d='M1 1l5 5 5-5' stroke='%236b6258' stroke-width='1.5' fill='none' stroke-linecap='round' stroke-linejoin='round'/></svg>");
                background-repeat: no-repeat;
                background-position: right 4px center;
                padding-right: 24px;
              }
              .dd-hs-form ul.hs-error-msgs { list-style: none; padding: 0; margin: 8px 0 0; }
              .dd-hs-form .hs-error-msg,
              .dd-hs-form .hs-error-msgs label {
                font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
                font-size: 11px;
                font-style: italic;
                letter-spacing: 0;
                text-transform: none;
                color: #b91c1c;
                margin: 0;
              }
              .dd-hs-form .hs-form-booleancheckbox-display,
              .dd-hs-form .legal-consent-container label {
                display: flex;
                gap: 10px;
                align-items: flex-start;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11.5px;
                letter-spacing: 0;
                text-transform: none;
                color: #2a2a2a;
                cursor: pointer;
                line-height: 1.55;
              }
              .dd-hs-form input[type="checkbox"] { accent-color: #0a0a0a; margin-top: 2px; }
              .dd-hs-form .hs-submit { margin-top: 6px; }
              .dd-hs-form .hs-button, .dd-hs-form input[type="submit"] {
                width: 100%;
                padding: 18px 32px;
                background: #0a0a0a;
                color: #f5f2ec;
                border: 1px solid #0a0a0a;
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 11.5px;
                font-weight: 500;
                letter-spacing: 0.24em;
                text-transform: uppercase;
                cursor: pointer;
                transition: background 300ms ease, transform 300ms cubic-bezier(.16,1,.3,1), box-shadow 300ms ease;
              }
              .dd-hs-form .hs-button:hover, .dd-hs-form input[type="submit"]:hover {
                background: #6b4f2a;
                border-color: #6b4f2a;
                transform: translateY(-2px);
                box-shadow: 0 12px 30px rgba(0,0,0,0.22);
              }
              .dd-hs-form .submitted-message {
                font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
                font-size: 17px;
                line-height: 1.5;
                color: #0a0a0a;
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* ============ CIERRE ============ */}
      <section className="relative overflow-hidden border-t border-cream/10 bg-ink-900 px-5 py-32 text-cream sm:px-8 lg:px-16">
        <div className="dd-section-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,rgba(196,148,84,0.22),transparent_62%)]" />
        <div className="dd-section-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(180,150,110,0.14),transparent_58%)]" style={{ animationDelay: '1.8s', animationDuration: '11s' }} />
        <div className="relative mx-auto max-w-[1180px] text-center">
          <p className="mb-8 text-[10.5px] font-medium uppercase tracking-[0.32em] text-cream/55">
            — Cierre editorial
          </p>
          <h2 className="mx-auto font-sans text-[48px] font-bold leading-[1.05] tracking-[-0.04em] text-cream sm:text-[68px] lg:text-[88px]">
            <span className="block py-1.5">
              El emprendedor{' '}
              <span className="font-serif text-[38px] font-normal italic text-cream/38 sm:text-[54px] lg:text-[76px]">
                opera.
              </span>
            </span>
            <span className="block py-1.5">
              El <span className="text-[#8a6a3d]">CEO</span> construye{' '}
              <span className="font-serif text-[38px] font-normal italic text-cream/38 sm:text-[54px] lg:text-[76px]">
                patrimonio.
              </span>
            </span>
          </h2>
          <div className="mt-11 font-serif text-[16px] italic text-cream/65 sm:text-[18px]">
            — La clase empieza el 10 de noviembre.
          </div>
        </div>
      </section>
    </main>
  );
}
