import { Link } from 'react-router-dom';
import { useHeroReveal, useReveal } from '@hooks/useReveal';

const columns = [
  {
    num: '01',
    title: 'Aquí aprendes.',
    description:
      'En diegodiaz.mx encuentras contenido gratuito, eventos, academia y la voz pública de Diego. Es la puerta de entrada del ecosistema.',
  },
  {
    num: '02',
    title: 'Allá te atienden.',
    description:
      'En diazlara.mx opera el despacho. Es donde se contratan los servicios profesionales: defensa, dictamen, estructuras y patrimonio.',
  },
  {
    num: '03',
    title: 'Mismo estándar.',
    description:
      'Diego Díaz lidera la firma. Lo que escuches aquí es lo mismo que aplica el despacho en cada caso. Sólo cambia el canal.',
  },
];

const stayHere = [
  'Quieres aprender fiscal sin asesor todavía',
  'Te interesa la academia o un evento',
  'Quieres leer casos y artículos',
  'Necesitas un diagnóstico inicial gratuito',
  'Eres contador y quieres especializarte',
];

const goToDespacho = [
  'Has recibido cartas o requerimientos del SAT',
  'Necesitas diseñar una estructura legal',
  'Vas a hacer una operación corporativa',
  'Quieres una opinión legal por escrito',
  'Buscas defensa o litigio fiscal',
];

export default function DiazLara() {
  const heroRef   = useHeroReveal();
  const cardRef   = useReveal<HTMLDivElement>(0.05);
  const bridgeRef = useHeroReveal();
  const colsRef   = useReveal();
  const gateRef   = useReveal();
  const panelsRef = useReveal();
  const bioRef    = useReveal();
  const ctaRef    = useHeroReveal();

  return (
    <div className="bg-cream-50 text-ink-900">

      {/* ── 01 HERO ─────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 pb-20 pt-16 sm:px-8 lg:px-0 lg:pb-[88px] lg:pt-[80px]">
          <div className="flex items-center justify-between border-b border-cream-400 pb-7 text-[10px] uppercase tracking-[0.24em] text-ink-400">
            <p>- Díaz Lara · El despacho</p>
            <a
              href="https://diazlara.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden transition-colors hover:text-ink-900 sm:block"
            >
              diazlara.mx ↗
            </a>
          </div>

          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,580px)_minmax(0,1fr)] lg:gap-20">
            <div ref={heroRef} className="hero-reveal pt-8 lg:pt-14">
              <h1 className="dl-hero-title max-w-[700px] font-normal leading-[0.84] tracking-[-0.055em]">
                <span className="line-mask"><span>Para</span></span>
                <span className="line-mask"><span>casos</span></span>
                <span className="line-mask italic-late font-serif italic tracking-[-0.07em] text-[#a87a40]">
                  <span>que exigen</span>
                </span>
                <span className="line-mask follow-late"><span>un</span></span>
                <span className="line-mask follow-late"><span>despacho.</span></span>
              </h1>
              <p className="hero-lede mt-8 max-w-[480px] text-[17px] leading-[1.55] tracking-[-0.01em] text-ink-600">
                El consultorio fiscal de Díaz Lara opera de manera independiente desde su propio sitio. Si necesitas defensa, opinión legal o estructuras a la medida, te llevamos hasta allá.
              </p>
              <div className="hero-lede mt-8 flex flex-wrap gap-5">
                <a
                  href="https://diazlara.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ir a diazlara.mx ↗
                </a>
                <a href="#bridge" className="btn-secondary">
                  ¿Cuál necesito? →
                </a>
              </div>
            </div>

            {/* Website preview card */}
            <div
              ref={cardRef}
              className="fade-up lg:pt-16"
              style={{ transitionDelay: '500ms' }}
            >
              {/* Float wrapper — bobs up/down after card fades in */}
              <div className="dl-card-float">
                {/* Window wrapper — perspective tilt on hover */}
                <div className="dl-card-window shadow-[0_32px_80px_-12px_rgba(10,10,10,0.13)]">

                  {/* Browser chrome — macOS traffic lights */}
                  <div className="group flex cursor-default items-center gap-2 border border-b-0 border-cream-400 bg-cream-200 px-5 py-3.5">
                    {/* Red · close */}
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#FF5F57]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#930000] opacity-0 transition-opacity duration-200 group-hover:opacity-100">✕</span>
                    </span>
                    {/* Yellow · minimize */}
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#FFBD2E]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#875800] opacity-0 transition-opacity duration-200 group-hover:opacity-100">−</span>
                    </span>
                    {/* Green · maximize */}
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#28C840]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#006d14] opacity-0 transition-opacity duration-200 group-hover:opacity-100">+</span>
                    </span>
                    {/* URL bar */}
                    <span className="ml-4 flex-1 rounded border border-cream-400 bg-cream-50 px-3 py-1 text-[10px] tracking-[0.06em] text-ink-400">
                      diazlara.mx
                    </span>
                  </div>

                  {/* Page content preview */}
                  <div className="border border-cream-400 bg-cream-50 p-8 lg:p-10">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-ink-400">
                      Fiscal · Patrimonial · Legal
                    </p>
                    <h3 className="mt-5 max-w-[280px] font-serif text-[28px] font-normal leading-[1.08] tracking-[-0.038em]">
                      Estrategia fiscal premium
                      <span className="block italic">para empresarios.</span>
                    </h3>
                    <p className="mt-5 max-w-[300px] text-[13px] leading-[1.65] text-ink-500">
                      Defensa fiscal, dictamen, estructuras patrimoniales y opinión legal para empresas con operaciones reales.
                    </p>
                    <div className="mt-7">
                      <a
                        href="https://diazlara.mx/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[42px] cursor-pointer items-center bg-ink-900 px-6 text-[10px] uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-ink-600"
                      >
                        Solicitar consulta →
                      </a>
                    </div>

                    {/* Stats bar */}
                    <div className="mt-7 grid grid-cols-3 border-t border-cream-400 pt-6">
                      {[
                        ['Defensa', 'Fiscal'],
                        ['Estructuras', 'Legales'],
                        ['Dictamen', 'y Patrimonio'],
                      ].map(([val, label]) => (
                        <div key={val} className="border-r border-cream-300 px-4 last:border-r-0">
                          <p className="text-[13px] font-normal leading-none tracking-[-0.02em] text-ink-900">{val}</p>
                          <p className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-ink-400">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tag — moves with the float */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-cream-400" />
                  <p className="text-[9px] uppercase tracking-[0.24em] text-ink-400">Sitio independiente · diazlara.mx</p>
                  <span className="h-px flex-1 bg-cream-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 02 BRIDGE ───────────────────────────────── */}
      <section id="bridge" className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-20 pt-16 sm:px-8 lg:px-0 lg:pb-[92px] lg:pt-[88px]">
          <div ref={bridgeRef} className="hero-reveal">
            <h2 className="dl-bridge-title max-w-[780px] font-normal leading-[0.92] tracking-[-0.05em]">
              <span className="line-mask"><span>Dos sitios.</span></span>
              <span className="line-mask italic-late font-serif italic tracking-[-0.065em]">
                <span>Un mismo equipo.</span>
              </span>
              <span className="line-mask follow-late"><span>Cero confusión.</span></span>
            </h2>
          </div>

          <div ref={colsRef} className="stagger-grid mt-14 grid border-l border-t border-cream-400 lg:grid-cols-3">
            {columns.map((col, i) => (
              <div
                key={col.title}
                data-s={String(i)}
                className="border-b border-r border-cream-400 p-10 lg:p-12"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-400">{col.num} /</p>
                <h3 className="mt-6 font-serif text-[26px] font-normal leading-[1.08] tracking-[-0.04em]">
                  {col.title}
                </h3>
                <p className="mt-5 text-[14px] leading-[1.65] text-ink-500">{col.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 DECISION GATE ────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 pb-20 pt-16 sm:px-8 lg:px-0 lg:pb-[92px] lg:pt-[88px]">
          <div ref={gateRef} className="fade-up">
            <h2 className="dl-decision-title max-w-[700px] font-normal leading-[0.94] tracking-[-0.048em]">
              ¿En qué momento
              <span className="block font-serif italic tracking-[-0.062em]">cruzas el puente?</span>
            </h2>
          </div>

          <div
            ref={panelsRef}
            className="stagger-grid mt-12 grid gap-px bg-cream-400 lg:grid-cols-2"
          >
            {/* Left — Quédate aquí */}
            <div data-s="0" className="bg-cream-50 p-10 lg:p-14">
              <h3 className="dl-panel-title font-serif font-normal leading-[1.06] tracking-[-0.04em]">
                Quédate aquí si...
              </h3>
              <ul className="mt-9 space-y-5">
                {stayHere.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 text-[14px] leading-[1.55] text-ink-600"
                  >
                    <span className="mt-0.5 shrink-0 text-[10px] text-ink-300">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — Pasa al despacho */}
            <div data-s="1" className="bg-ink-900 p-10 lg:p-14">
              <h3 className="dl-panel-title font-serif font-normal leading-[1.06] tracking-[-0.04em] text-white">
                Pasa al despacho si...
              </h3>
              <ul className="mt-9 space-y-5">
                {goToDespacho.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-4 text-[14px] leading-[1.55] text-white/65"
                  >
                    <span className="mt-0.5 shrink-0 text-[10px] text-white/28">—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://diazlara.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex min-h-[48px] items-center bg-[#f3f0ea] px-7 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white"
              >
                Ir al despacho ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 04 IDENTITY ─────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-20 pt-16 sm:px-8 lg:px-0 lg:pb-[92px] lg:pt-[88px]">
          <div
            ref={bioRef}
            className="stagger-grid grid gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-[100px]"
          >
            <div data-s="0">
              <h2 className="dl-bio-title font-normal leading-[0.96] tracking-[-0.05em]">
                ¿Es el{' '}
                <span className="font-serif italic tracking-[-0.065em]">mismo</span>
                <span className="block">Diego Díaz?</span>
              </h2>
            </div>

            <div data-s="1" className="flex flex-col justify-center">
              <p className="text-[16px] leading-[1.72] text-ink-600">
                Sí. Diego Díaz es el fundador y socio director del despacho Díaz Lara. La firma se llama así por una decisión de marca: separar la figura pública del Diego que da contenido, de la firma profesional que atiende clientes.
              </p>
              <p className="mt-6 text-[16px] leading-[1.72] text-ink-600">
                Esa separación nos permite cuidar dos cosas. Por un lado, mantener un espacio de divulgación abierto y honesto, sin que parezca un escaparate. Por el otro, ofrecer un servicio profesional con la formalidad y los procesos que un despacho serio exige.
              </p>
              <p className="mt-6 text-[16px] leading-[1.72] text-ink-600">
                Cuando contratas a Díaz Lara, el criterio que se aplica a tu caso es exactamente el mismo del que escuchas hablar a Diego aquí.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 CTA ──────────────────────────────────── */}
      <section className="bg-[#080808] text-white">
        <div className="mx-auto flex min-h-[440px] max-w-[1184px] flex-col items-center justify-center px-5 py-20 sm:px-8 lg:min-h-[660px] lg:px-0 lg:py-[120px]">
          <div ref={ctaRef} className="hero-reveal flex w-full flex-col items-center text-center">
            <h2 className="dl-cta-title max-w-[860px] font-serif font-normal leading-[0.88] tracking-[-0.06em] text-[#f3f0ea]">
              <span className="line-mask"><span>Cruza</span></span>
              <span className="line-mask italic-late italic tracking-[-0.075em]">
                <span>el puente.</span>
              </span>
            </h2>
            <p className="hero-lede mx-auto mt-8 max-w-[520px] text-[17px] leading-[1.6] tracking-[-0.01em] text-white/60">
              Te llevamos al sitio del despacho. Ahí podrás conocer los servicios, ver casos y agendar una llamada con el equipo.
            </p>
            <div className="hero-lede mt-10 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
              <a
                href="https://diazlara.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[58px] items-center justify-center bg-[#f3f0ea] px-9 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white"
              >
                Ir a diazlara.mx ↗
              </a>
              <Link
                to="/"
                className="inline-flex min-h-[58px] items-center justify-center border border-white/25 px-9 text-[11px] uppercase tracking-[0.18em] text-white/70 transition-colors hover:border-white/60 hover:text-white"
              >
                Seguir aprendiendo con Diego →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
