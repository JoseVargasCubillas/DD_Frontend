import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@store/cartStore';
import { waLink, trackWaClick } from '@utils/whatsapp';
import prospeccionHero from '../../../../../assets/eventos/prospeccion-digital-hero.png';

const mono = 'font-mono text-[11px] uppercase tracking-[0.16em]';
const marker = 'inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500 before:h-px before:w-6 before:bg-ink-500 before:content-[""]';

const participants: Array<[string, JSX.Element]> = [
  ['01', <><b>El CEO</b>, fundador o dueño de la empresa.</>],
  ['02', <>El director de <b>marketing</b> en conjunto con el CEO.</>],
  ['03', <>Si no existe esa posición, el director, gerente o líder de mayor jerarquía del <b>área comercial</b>.</>],
];

const dayOne: Array<[string, string]> = [
  ['01', 'Definición del cliente y de la empresa ideal.'],
  ['02', 'Identificación de problemas, deseos, objeciones y comportamientos de compra.'],
  ['03', 'Construcción del mensaje y la propuesta de valor.'],
  ['04', 'Diseño de la escalera de ofertas: gratuita, de entrada y high ticket.'],
  ['05', 'Estrategia de contenido para generar autoridad, confianza y demanda.'],
];

const dayTwo: Array<[string, string]> = [
  ['01', 'Diseño del recorrido completo del prospecto.'],
  ['02', 'Integración de contenido, anuncios, correo, WhatsApp, eventos y llamadas.'],
  ['03', 'Cómo crear campañas que generen prospectos calificados.'],
  ['04', 'Procesos para mejorar seguimiento y conversión.'],
  ['05', 'Métricas clave y plan de ejecución para implementar la estrategia.'],
];

const WA_MESSAGE =
  'Hola Diego, quiero reservar mi lugar en la Cumbre Sistema de Prospección Digital (4 y 5 de septiembre).';

const reserveHref = waLink(WA_MESSAGE);

type Ticket = {
  refId: string;
  eyebrow: string;
  label: string;
  price: string;
  priceValue: number;
  primary: boolean;
};

const tickets: Ticket[] = [
  {
    refId: 'prospeccion-digital-lista',
    eyebrow: 'Precio Lista',
    label: 'Cumbre Sistema de Prospección Digital',
    price: '$14,997',
    priceValue: 14997,
    primary: true,
  },
  {
    refId: 'prospeccion-digital-invitado',
    eyebrow: 'Invitado Adicional',
    label: 'Cumbre Sistema de Prospección Digital · invitado',
    price: '$7,498.50',
    priceValue: 7498.5,
    primary: false,
  },
];

export default function ProspeccionDigitalLanding() {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Sistema de Prospección Digital — Cumbre · Diego Díaz';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow,noarchive';
    document.head.appendChild(meta);
    return () => {
      document.title = prev;
      meta.remove();
    };
  }, []);

  const scrollToInversion = () => {
    const el = document.getElementById('inversion');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const buyTicket = (ticket: Ticket) => {
    clearCart();
    addItem({
      id: `event-${ticket.refId}`,
      type: 'event',
      refId: ticket.refId,
      title: ticket.label,
      price: ticket.priceValue,
      quantity: 1,
      currency: 'MXN',
      paymentType: 'one_time',
    });
    navigate('/eventos/checkout');
  };

  return (
    <div className="bg-cream-50 text-ink-900">
      {/* ── 01 · HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/10 bg-ink-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${prospeccionHero})` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink-900/85 via-ink-900/70 to-ink-900"
          aria-hidden="true"
        />
        <div className="container-app relative py-24 lg:py-32">
          <p className={`${mono} text-white/55`}>— Cumbre · Presencial CDMX</p>
          <h1 className="mt-6 max-w-[15ch] font-serif text-[clamp(44px,7vw,88px)] font-normal leading-[1.02] tracking-[-0.04em]">
            Sistema de <span className="italic">Prospección</span> Digital.
          </h1>
          <p className="mt-6 max-w-[52ch] font-serif text-[clamp(18px,1.6vw,22px)] italic leading-[1.55] text-white/70">
            Atracción y conversión de prospectos de alto valor.
          </p>

          <div className="mt-12 grid gap-4 border-t border-white/15 pt-8 sm:grid-cols-3 sm:gap-8">
            {[
              ['Fecha', '4 y 5 de sep'],
              ['Duración', '2 días'],
              ['Modalidad', 'Presencial'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className={`${mono} text-white/45`}>— {k}</p>
                <p className="mt-3 inline-block border border-white/15 px-4 py-2 font-mono text-[13px] tracking-[0.02em]">
                  {v}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 max-w-[52ch] text-[16px] leading-[1.6] text-white/75">
            Diseña una estrategia práctica para atraer, educar, calificar y
            convertir prospectos de alto valor.
          </p>

          <button
            type="button"
            onClick={scrollToInversion}
            className="mt-10 inline-flex items-center gap-3 border border-white bg-white px-8 py-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-900 transition-colors duration-300 hover:bg-transparent hover:text-white cursor-pointer"
          >
            Quiero mi lugar <span aria-hidden="true">↓</span>
          </button>
        </div>
      </section>

      {/* ── 02 · OBJETIVO ─────────────────────────────────────────── */}
      <section className="container-app py-20 lg:py-24">
        <p className={marker}>Objetivo</p>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <h2 className="font-serif text-[clamp(30px,3.6vw,44px)] font-normal leading-[1.1] tracking-[-0.035em]">
            El contenido no es el fin.
            <br />
            <span className="italic">Es la herramienta.</span>
          </h2>
          <p className="max-w-[56ch] text-[17px] leading-[1.65] text-ink-900/65">
            Diseñar una estrategia práctica para atraer, educar, calificar y
            convertir prospectos de alto valor. El contenido será utilizado como
            gancho y como herramienta para construir confianza, no como un fin
            aislado.
          </p>
        </div>
      </section>

      {/* ── 03 · PARTICIPANTES ────────────────────────────────────── */}
      <section className="border-y border-ink-900/10 bg-cream-100">
        <div className="container-app py-20 lg:py-24">
          <p className={marker}>¿Quién debe participar?</p>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {participants.map(([n, node]) => (
              <div
                key={n}
                className="group relative border-t border-ink-900 pt-6 transition-[padding] duration-500 hover:pl-3"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[-1px] h-[2px] w-0 bg-ink-900/60 transition-all duration-500 group-hover:w-full"
                />
                <span className={`${mono} block text-ink-500`}>{n}</span>
                <p className="mt-4 text-[16px] leading-[1.55] text-ink-900">{node}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 · TEMARIO ──────────────────────────────────────────── */}
      <section className="container-app py-20 lg:py-24">
        <div className="grid items-end gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <p className={marker}>Temario</p>
          <h2 className="text-[clamp(26px,3.2vw,38px)] font-bold leading-[1.18] tracking-[-0.01em]">
            Dos días para construir el sistema completo, de la oferta a la
            conversión.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {[
            { label: 'Día 01', title: 'Cliente, mensaje y oferta', items: dayOne },
            { label: 'Día 02', title: 'Atracción y conversión', items: dayTwo },
          ].map((day) => (
            <div
              key={day.label}
              className="border border-ink-900 bg-cream-50 p-8 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(10,10,10,0.12)]"
            >
              <span className={`${mono} text-ink-500`}>{day.label}</span>
              <h3 className="mt-2 font-serif text-[26px] font-normal leading-[1.15] tracking-[-0.03em]">
                {day.title}
              </h3>
              <ol className="mt-6 divide-y divide-ink-900/10">
                {day.items.map(([n, text]) => (
                  <li
                    key={n}
                    className="grid grid-cols-[28px_1fr] gap-3 py-3 text-[15px] leading-[1.5] transition-[padding] duration-300 hover:pl-1.5"
                  >
                    <span className={`${mono} text-ink-500`}>{n}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ── 05 · INVERSIÓN ────────────────────────────────────────── */}
      <section id="inversion" className="scroll-mt-24 bg-cream-200 py-20 lg:py-24">
        <div className="container-app">
          <p className={marker}>Inversión</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {tickets.map((ticket) => {
              const dark = ticket.primary;
              return (
                <div
                  key={ticket.refId}
                  className={`flex flex-col justify-between gap-6 border border-ink-900 p-8 transition-transform duration-500 hover:-translate-y-1 ${
                    dark
                      ? 'bg-ink-900 text-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]'
                      : 'bg-cream-50 text-ink-900 hover:shadow-[0_20px_40px_rgba(10,10,10,0.14)]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div>
                      <p className="font-serif text-[16px] italic">{ticket.eyebrow}</p>
                      <p
                        className={`mt-2 font-mono text-[11px] uppercase tracking-[0.1em] ${
                          dark ? 'text-white/55' : 'text-ink-500'
                        }`}
                      >
                        IVA incluido
                      </p>
                    </div>
                    <p className="whitespace-nowrap text-right font-sans text-[clamp(36px,4.4vw,52px)] font-bold tracking-[-0.015em]">
                      {ticket.price}
                      <sup className="ml-1 align-middle font-mono text-[13px] font-normal">MXN</sup>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => buyTicket(ticket)}
                    className={`inline-flex cursor-pointer items-center justify-center gap-3 border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                      dark
                        ? 'border-white bg-white text-ink-900 hover:bg-transparent hover:text-white'
                        : 'border-ink-900 bg-ink-900 text-white hover:bg-transparent hover:text-ink-900'
                    }`}
                  >
                    Comprar ahora <span aria-hidden="true">→</span>
                  </button>
                </div>
              );
            })}
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
            ¿Prefieres coordinar por WhatsApp?{' '}
            <a
              href={reserveHref}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackWaClick('prospeccion-inversion-wa', { message: WA_MESSAGE })}
              className="underline underline-offset-4 hover:text-ink-900"
            >
              Escríbenos aquí →
            </a>
          </p>
        </div>
      </section>

      {/* ── 06 · RESULTADO + CIERRE ───────────────────────────────── */}
      <section className="bg-ink-900 py-24 text-white">
        <div className="container-app text-center">
          <p className={`${marker} justify-center text-white/55 before:bg-white/55`}>Resultado</p>
          <blockquote className="mx-auto mt-8 max-w-[42ch] text-[clamp(22px,2.8vw,29px)] leading-[1.4] tracking-[-0.005em]">
            Cada empresa saldrá con su avatar, mensaje, escalera de ofertas,
            circuito de conversión y una campaña lista para implementarse.
          </blockquote>
          <div className="mt-12">
            <button
              type="button"
              onClick={scrollToInversion}
              className="inline-flex cursor-pointer items-center gap-3 border border-white bg-white px-8 py-4 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-900 transition-colors duration-300 hover:bg-transparent hover:text-white"
            >
              Reservar mi lugar <span aria-hidden="true">↑</span>
            </button>
          </div>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">
            Sistema de Prospección Digital · 4 y 5 de septiembre
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-white/40">
            <Link to="/eventos" className="underline-offset-4 hover:underline">
              ← Volver al calendario de eventos
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
