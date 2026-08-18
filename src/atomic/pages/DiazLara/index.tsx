import { Link } from 'react-router-dom';
import { useHeroReveal, useReveal } from '@hooks/useReveal';

const mono = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45';
const border = 'border-ink-900/10';

const ideas = [
  {
    n: '01',
    title: 'Aquí aprendes.',
    body: 'En diegodiaz.mx encuentras contenido gratuito, eventos, academia y la voz pública de Diego. Es quien te enseña acerca del mundo contable, jurídico y financiero.',
  },
  {
    n: '02',
    title: 'Allá te atienden.',
    body: 'En diazlara.mx opera la firma. Es donde se contratan los servicios profesionales: defensa, dictamen, estructuras y patrimonial.',
  },
  {
    n: '03',
    title: 'Mismo estándar.',
    body: 'Diego Díaz lidera la firma. Lo que escuchas aquí es aplicado y respaldado por metodologías en cada caso. Solo cambia el canal.',
  },
];

const here = [
  'Quieres tener bases fiscales, contables y jurídicas',
  'Te interesa ser parte de la academia o un evento',
  'Quieres leer y mantenerte actualizado',
  'Necesitas un diagnóstico inicial',
  'Eres un profesional que quieres especializarte',
];

const there = [
  'Recibiste cartas o requerimientos del SAT',
  'Necesitas diseñar una estructura legal',
  'Vas a hacer una operación corporativa',
  'Quieres una opinión legal por escrito',
  'Buscas blindar tu patrimonio',
];

export default function DiazLara() {
  const heroRef = useHeroReveal();
  const cardRef = useReveal<HTMLDivElement>(0.05);

  return (
    <div className="bg-cream-50 text-ink-900">
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

            <div
              ref={cardRef}
              className="fade-up lg:pt-16"
              style={{ transitionDelay: '500ms' }}
            >
              <div className="dl-card-float">
                <div className="dl-card-window shadow-[0_32px_80px_-12px_rgba(10,10,10,0.13)]">
                  <div className="group flex cursor-default items-center gap-2 border border-b-0 border-cream-400 bg-cream-200 px-5 py-3.5">
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#FF5F57]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#930000] opacity-0 transition-opacity duration-200 group-hover:opacity-100">x</span>
                    </span>
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#FFBD2E]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#875800] opacity-0 transition-opacity duration-200 group-hover:opacity-100">-</span>
                    </span>
                    <span className="relative h-3 w-3 rounded-full bg-cream-400 transition-colors duration-200 group-hover:bg-[#28C840]">
                      <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold leading-none text-[#006d14] opacity-0 transition-opacity duration-200 group-hover:opacity-100">+</span>
                    </span>
                    <span className="ml-4 flex-1 rounded border border-cream-400 bg-cream-50 px-3 py-1 text-[10px] tracking-[0.06em] text-ink-400">
                      diazlara.mx
                    </span>
                  </div>

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

      <section id="bridge" className="container-app py-24">
        <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
          <span>- 02 / Cómo funciona</span>
          <span>El ecosistema en tres ideas</span>
        </div>
        <h2 className="mt-10 max-w-[1050px] text-[clamp(54px,8vw,104px)] font-light leading-[0.95] tracking-[-0.06em]">
          Dos sitios. Un mismo equipo. Cero confusión.
        </h2>
        <div className={`mt-14 grid border-t ${border} lg:grid-cols-3`}>
          {ideas.map((item) => (
            <div key={item.n} className={`border-b ${border} py-12 lg:border-b-0 lg:border-r lg:last:border-r-0 lg:px-10`}>
              <p className={mono}>— {item.n}</p>
              <h3 className="mt-6 text-[34px] tracking-[-0.04em]">{item.title}</h3>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-900/65">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 py-24">
        <div className="container-app">
          <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
            <span>- 03 / Diferencias</span>
            <span>Qué resuelve cada uno</span>
          </div>
          <h2 className="mt-10 max-w-[860px] text-[clamp(48px,7vw,96px)] font-light leading-[0.95] tracking-[-0.06em]">
            ¿En qué momento <span className="font-serif italic text-[#6b4f2a]">necesitas de una firma fiscal</span>?
          </h2>
          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            {[
              ['— Aquí · diegodiaz.mx', 'Quédate aquí si...', 'Buscas formación, comunidad y entender tu situación antes de contratar a nadie.', here, 'Ver academia', '/academia'],
              ['— Allá · diazlara.mx', 'Pasa a nuestra oficina si...', 'Ya tienes claro que necesitas un equipo profesional ejecutando contigo.', there, 'Ir a diazlara.mx ↗', 'https://diazlara.mx'],
            ].map(([eyebrow, title, body, items, cta, href]) => (
              <div key={title as string} className={`border ${border} bg-white p-9 lg:p-12`}>
                <p className={mono}>{eyebrow as string}</p>
                <h3 className="mt-4 font-serif text-[44px] leading-tight tracking-[-0.05em]">{title as string}</h3>
                <p className="mt-4 max-w-[480px] text-[18px] leading-relaxed text-ink-900/65">{body as string}</p>
                <ul className="mt-8 space-y-4 text-[17px] text-ink-900/75">
                  {(items as string[]).map((item) => (
                    <li key={item}>→ {item}</li>
                  ))}
                </ul>
                {(href as string).startsWith('http') ? (
                  <a className="mt-10 inline-block border-b border-ink-900 pb-1 text-sm font-medium" href={href as string} target="_blank" rel="noreferrer">
                    {cta as string}
                  </a>
                ) : (
                  <Link className="mt-10 inline-block border-b border-ink-900 pb-1 text-sm font-medium" to={href as string}>
                    {cta as string}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-app grid gap-16 py-24 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className={mono}>— 04 / Identidad</p>
          <h2 className="mt-8 max-w-[520px] font-serif text-[72px] leading-[0.95] tracking-[-0.06em]">
            ¿Es el mismo Diego Díaz?
          </h2>
        </div>
        <div className="max-w-[560px] text-[20px] leading-relaxed text-ink-900/68">
          <p>
            <strong className="text-ink-900">Sí.</strong> Esa separación nos permite cuidar dos cosas. Por un lado, mantener un espacio de divulgación abierto y honesto, sin que parezca un escaparate.
          </p>
          <p className="mt-6">
            Por el otro, ofrecer un servicio profesional con la formalidad y los procesos que un despacho serio exige. Cuando contratas a Díaz Lara, el criterio que se aplica a tu caso es exactamente el mismo del que escuchas hablar a Diego aquí.
          </p>
        </div>
      </section>

      <section className="bg-ink-900 py-28 text-white">
        <div className="container-app text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">— 05 / Visita el despacho · diazlara.mx</p>
          <h2 className="mt-8 font-serif text-[clamp(72px,12vw,160px)] italic leading-none tracking-[-0.08em]">Cruza el puente.</h2>
          <p className="mx-auto mt-8 max-w-[620px] text-[20px] leading-relaxed text-white/70">
            Te llevamos al sitio del despacho. Ahí podrás conocer los servicios, ver casos y agendar una llamada con el equipo.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <a href="https://diazlara.mx" target="_blank" rel="noreferrer" className="bg-white px-7 py-4 text-sm font-medium text-ink-900">
              Ir a diazlara.mx ↗
            </a>
            <Link to="/contacto" className="border border-white/25 px-7 py-4 text-sm font-medium">
              Mejor agendar con Diego
            </Link>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">— Se abrirá en una pestaña nueva · https://diazlara.mx</p>
        </div>
      </section>
    </div>
  );
}
