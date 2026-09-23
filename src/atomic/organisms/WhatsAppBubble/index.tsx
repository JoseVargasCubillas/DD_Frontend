import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { waLink, trackWaClick, WHATSAPP_PHONE } from '@utils/whatsapp';

// Rutas donde la burbuja NO debe aparecer para no distraer del checkout
// ni pisar CTAs criticas de conversion. Todo lo demas la muestra.
const HIDE_ON_PREFIXES = [
  '/checkout',
  '/eventos/checkout',
  '/libros/', // BookCheckout vive en /libros/:slug/checkout
  '/pago-exito',
  '/pago-cancelado',
];

// En estas rutas la burbuja NO abre chat de WhatsApp; en su lugar
// aparece un CTA compacto que empuja hacia el evento correspondiente.
// El objetivo es no competir con la conversion propia de la landing.
type EventBubble = {
  routes: string[];
  label: string;
  href: string;
  source: string;
};

const EVENT_BUBBLES: EventBubble[] = [
  {
    routes: [
      '/eventos/emprendedor-vs-ceo',
      '/eventos/tablero-del-ceo',
      '/eventos/el-emprendedor-vs-el-ceo',
    ],
    label: 'Reserva tu lugar gratis',
    href: '/eventos/emprendedor-vs-ceo#registro',
    source: 'bubble-event-ceo',
  },
];

// Umbral de "segundo scroll" — el usuario ya recorrio ~1 pantalla y
// vuelve a hacer scroll. Combino conteo de gestos separados por >180ms
// con fallback por scrollY para no requerir el segundo gesto en usuarios
// que hacen un solo scroll largo.
const SCROLL_GESTURE_THRESHOLD = 2;
const SCROLL_Y_FALLBACK_MULT = 1.4; // 1.4x viewport height

type ChatOption = {
  id: string;
  emoji: string;
  label: string;
  message: string;
  source: string;
};

const CHAT_OPTIONS: ChatOption[] = [
  {
    id: 'holding',
    emoji: '🏢',
    label: 'Holding y protección patrimonial',
    message:
      'Hola Diego, quiero información sobre Holding y protección patrimonial.',
    source: 'bubble-holding',
  },
  {
    id: 'estrategia',
    emoji: '📊',
    label: 'Estrategia fiscal para mi empresa',
    message: 'Hola Diego, me interesa la estrategia fiscal para mi empresa.',
    source: 'bubble-estrategia',
  },
  {
    id: 'masterclass',
    emoji: '🎓',
    label: 'Masterclasses y capacitaciones',
    message:
      'Hola Diego, quiero información sobre masterclasses y capacitaciones.',
    source: 'bubble-masterclass',
  },
  {
    id: 'asesor',
    emoji: '💬',
    label: 'Quiero hablar con un asesor',
    message: 'Hola Diego, quiero hablar con un asesor.',
    source: 'bubble-asesor',
  },
];

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Burbuja flotante de WhatsApp que aparece al segundo scroll, respetando
 * `prefers-reduced-motion` y ocultandose en rutas de checkout. Cada opcion
 * dispara `trackWaClick` con un `source` distinto para medir CTR desde el
 * panel admin (analytics/wa-clicks).
 */
export default function WhatsAppBubble() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  const gesturesRef = useRef(0);
  const lastGestureAtRef = useRef(0);

  const hidden = HIDE_ON_PREFIXES.some((prefix) => location.pathname.startsWith(prefix));
  const eventBubble = EVENT_BUBBLES.find((b) =>
    b.routes.some((r) => location.pathname === r || location.pathname.startsWith(`${r}/`)),
  );

  // Detecta el "segundo scroll" para revelar la burbuja con animacion.
  useEffect(() => {
    if (hidden) return;
    if (typeof window === 'undefined') return;
    if (visible) return;

    const reveal = () => {
      setVisible(true);
    };

    const onScroll = () => {
      const now = Date.now();
      // Contamos como gesto separado si pasaron >180ms desde el ultimo.
      if (now - lastGestureAtRef.current > 180) {
        gesturesRef.current += 1;
      }
      lastGestureAtRef.current = now;

      const passesGesture = gesturesRef.current >= SCROLL_GESTURE_THRESHOLD;
      const passesFallback =
        window.scrollY > window.innerHeight * SCROLL_Y_FALLBACK_MULT;

      if (passesGesture || passesFallback) {
        reveal();
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [hidden, visible]);

  // Al cambiar de ruta, cerramos el widget (queda visible el FAB).
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Cierre con Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (hidden) return null;

  // Variante especial: en landings de evento la burbuja se convierte en
  // una pill de CTA hacia el registro/checkout del evento, en lugar de
  // abrir el chat de WhatsApp (para no competir con el formulario propio).
  if (eventBubble) {
    return (
      <>
        <style>{`
          @keyframes ddWaCtaIn {
            0%   { opacity:0; transform: translateY(28px) scale(.9); }
            100% { opacity:1; transform: translateY(0)    scale(1);  }
          }
          @keyframes ddWaCtaPulse {
            0%   { box-shadow: 0 0 0 0 rgba(138,106,61,.55); }
            100% { box-shadow: 0 0 0 18px rgba(138,106,61,0); }
          }
          @media (prefers-reduced-motion: reduce) {
            .dd-wa-cta { animation: none !important; }
            .dd-wa-cta::after { animation: none !important; }
          }
        `}</style>
        <Link
          to={eventBubble.href}
          onClick={() =>
            trackWaClick(eventBubble.source, {
              page: window.location.pathname,
            })
          }
          aria-label={eventBubble.label}
          className="dd-wa-cta group fixed z-[80] inline-flex cursor-pointer items-center gap-4 border border-cream/20 text-cream shadow-[0_18px_42px_rgba(10,10,10,0.45),0_4px_10px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:gap-6 hover:bg-[#6b4f2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a6a3d]"
          style={{
            bottom: '24px',
            right: '24px',
            padding: '14px 22px',
            backgroundColor: '#0a0a0a',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            animation: visible ? 'ddWaCtaIn 620ms cubic-bezier(.16,1,.3,1) both' : undefined,
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              animation: visible ? 'ddWaCtaPulse 2.4s ease-out infinite' : undefined,
            }}
          />
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: '#8a6a3d', boxShadow: '0 0 0 3px rgba(138,106,61,.35)' }}
          />
          <span>{eventBubble.label}</span>
          <span
            aria-hidden="true"
            className="font-serif text-[15px] italic normal-case tracking-normal transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </>
    );
  }

  const handleToggle = () => {
    // Solo alterna el widget; el tracking se dispara UNICAMENTE cuando
    // el usuario elige una de las opciones (mensaje concreto a WhatsApp).
    setOpen((prev) => !prev);
  };

  const handleOptionClick = (option: ChatOption) => {
    trackWaClick(option.source, {
      message: option.message,
      page: window.location.pathname,
    });
  };

  return (
    <>
      <style>{`
        @keyframes ddWaBubbleIn {
          0%   { opacity:0; transform: translateY(28px) scale(.72); }
          100% { opacity:1; transform: translateY(0)    scale(1);   }
        }
        @keyframes ddWaPulse {
          0%   { transform: scale(1);    opacity:.65; }
          70%  { transform: scale(1.35); opacity:0;   }
          100% { transform: scale(1.35); opacity:0;   }
        }
        @keyframes ddWaWidgetIn {
          0%   { opacity:0; transform: translateY(16px) scale(.96); }
          100% { opacity:1; transform: translateY(0)    scale(1);   }
        }
        @keyframes ddWaOptionIn {
          0%   { opacity:0; transform: translateY(6px); }
          100% { opacity:1; transform: translateY(0);   }
        }
        @media (prefers-reduced-motion: reduce) {
          .dd-wa-fab, .dd-wa-widget, .dd-wa-option, .dd-wa-pulse { animation: none !important; }
        }
      `}</style>

      {/* FAB — burbuja flotante siempre presente cuando la ruta lo permite */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={open ? 'Cerrar chat de WhatsApp' : 'Abrir chat de WhatsApp con Diego Díaz'}
        aria-expanded={open}
        className="dd-wa-fab group fixed z-[80] flex cursor-pointer items-center justify-center rounded-full text-white shadow-[0_16px_36px_rgba(107,79,42,0.45),0_4px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8a6a3d]"
        style={{
          bottom: '24px',
          right: '24px',
          width: '62px',
          height: '62px',
          backgroundColor: '#8a6a3d',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          animation: visible ? 'ddWaBubbleIn 620ms cubic-bezier(.16,1,.3,1) both' : undefined,
        }}
      >
        {/* Halo pulsante para "llamar la atencion" sin ser agresivo */}
        <span
          aria-hidden="true"
          className="dd-wa-pulse pointer-events-none absolute inset-0 rounded-full"
          style={{
            border: '1.5px solid #8a6a3d',
            animation: visible ? 'ddWaPulse 2.6s cubic-bezier(.4,0,.6,1) infinite' : 'none',
          }}
        />
        {/* Indicador nuevo mensaje */}
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0a0a0a] px-1.5 font-serif text-[11px] italic text-cream"
          style={{ boxShadow: '0 2px 6px rgba(0,0,0,.35)' }}
        >
          1
        </span>
        <WhatsAppIcon className="h-7 w-7 fill-cream" />
      </button>

      {/* Widget de chat */}
      {open && visible && (
        <>
          {/* Backdrop sutil, solo se muestra abierta la conversacion */}
          <button
            type="button"
            aria-label="Cerrar chat"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] cursor-default bg-ink-900/15"
            style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
          />

          <div
            role="dialog"
            aria-modal="false"
            aria-label="Chat con el equipo de Diego Díaz"
            className="dd-wa-widget fixed z-[90] overflow-hidden shadow-[0_28px_70px_rgba(0,0,0,.30),0_8px_18px_rgba(0,0,0,.18)]"
            style={{
              bottom: '100px',
              right: '24px',
              width: 'min(360px, calc(100vw - 32px))',
              backgroundColor: '#ede8df',
              borderRadius: '14px',
              animation: 'ddWaWidgetIn 260ms cubic-bezier(.2,.7,.2,1) both',
              transformOrigin: 'bottom right',
            }}
          >
            {/* Header editorial */}
            <div
              className="relative grid items-center gap-3 px-5 py-4"
              style={{
                gridTemplateColumns: 'auto 1fr auto',
                backgroundColor: '#0a0a0a',
                color: '#f5f2ec',
              }}
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full font-serif text-2xl italic"
                style={{
                  backgroundColor: '#f5f2ec',
                  color: '#0a0a0a',
                  border: '2px solid rgba(245,242,236,0.35)',
                }}
              >
                D
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 font-serif text-[15.5px] italic leading-tight">
                  <span className="truncate">Diego Díaz · Estratega Fiscal</span>
                  <span
                    aria-hidden="true"
                    className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: '#8a6a3d', boxShadow: '0 0 0 2px rgba(138,106,61,.35)' }}
                  />
                </div>
                <div
                  className="mt-1 text-[10px] font-medium uppercase"
                  style={{ letterSpacing: '0.20em', color: 'rgba(245,242,236,0.6)' }}
                >
                  En línea · Responde en minutos
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar chat"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-cream/75 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <span aria-hidden="true" className="text-[22px] leading-none">×</span>
              </button>
            </div>

            {/* Cuerpo */}
            <div className="relative px-5 py-5" style={{ backgroundColor: '#ede8df' }}>
              {/* Mensaje de bienvenida */}
              <div
                className="relative mb-4 max-w-[92%] border p-3.5"
                style={{
                  backgroundColor: '#f5f2ec',
                  borderColor: 'rgba(10,10,10,0.12)',
                  color: '#0a0a0a',
                }}
              >
                <span
                  className="mb-1 block text-[9.5px] font-medium uppercase"
                  style={{ letterSpacing: '0.20em', color: '#6b4f2a' }}
                >
                  Equipo Diego Díaz
                </span>
                <p className="text-[13.5px] leading-[1.55]">
                  ¡Hola! Gracias por escribirnos. ¿En qué te podemos ayudar hoy?
                </p>
                <span
                  className="mt-1.5 block text-right font-serif text-[10.5px] italic"
                  style={{ color: '#6b6258' }}
                >
                  Ahora
                </span>
              </div>

              {/* Opciones */}
              <div className="flex flex-col gap-2">
                {CHAT_OPTIONS.map((option, idx) => (
                  <a
                    key={option.id}
                    href={waLink(option.message)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleOptionClick(option)}
                    className="dd-wa-option group flex cursor-pointer items-center gap-3 border px-3.5 py-3 text-left text-[13.5px] leading-tight text-ink-900 transition-all duration-200 hover:-translate-y-px hover:pl-4"
                    style={{
                      backgroundColor: '#f5f2ec',
                      borderColor: 'rgba(10,10,10,0.32)',
                      animation: `ddWaOptionIn 320ms cubic-bezier(.2,.7,.2,1) ${120 + idx * 60}ms both`,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = '#8a6a3d';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(10,10,10,0.32)';
                    }}
                  >
                    <span className="text-[18px] leading-none">{option.emoji}</span>
                    <span className="flex-1">{option.label}</span>
                    <span
                      className="font-serif text-[15px] italic transition-transform group-hover:translate-x-1"
                      style={{ color: '#6b4f2a' }}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-center gap-2 px-4 py-3 text-[9.5px] font-medium uppercase"
              style={{
                letterSpacing: '0.22em',
                backgroundColor: '#e3ddd0',
                color: '#6b6258',
                borderTop: '1px solid rgba(10,10,10,0.10)',
              }}
            >
              <WhatsAppIcon className="h-3 w-3" />
              <span>Chat vía WhatsApp · +{WHATSAPP_PHONE.slice(0, 2)} {WHATSAPP_PHONE.slice(2, 5)} {WHATSAPP_PHONE.slice(5, 8)} {WHATSAPP_PHONE.slice(8)}</span>
            </div>
          </div>
        </>
      )}
    </>
  );
}
