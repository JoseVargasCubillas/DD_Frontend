import { Link } from 'react-router-dom';
import { useHeroReveal, useReveal } from '@hooks/useReveal';
import diegoHero from '../../../../assets/ddweb/figma-diego-hero.png';
import equipoDiazLara from '../../../../assets/ddweb/equipo-diaz-lara-escaleras.jpg';

const mono = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45';
const border = 'border-ink-900/10';

const milestones = [
  ['1999', 'Inicio profesional como contador junior en despacho local.', 'Querétaro'],
  ['2014', 'Primer acuerdo conclusivo en defensa de un cliente — agencia de viajes.', 'Hito histórico'],
  ['2018', 'Publica su primer libro: "Los 7 secretos que el SAT no quiere que conozcas".', 'Best seller'],
  ['2022', 'Díaz Lara recibe la Cruz de Malta por Latin American Quality Awards.', 'Galardón continental'],
  ['2024', 'Certificación Great Place to Work® en Díaz Lara Consultores.', 'Cultura validada'],
  ['2026', 'Meta declarada: capacitar a 100,000 empresarios al cierre de 2032.', 'En curso'],
];

const stats = [
  ['25', 'Años de trayectoria profesional'],
  ['10K+', 'Empresarios capacitados en eventos y Academia'],
  ['03', 'Libros publicados sobre estrategia fiscal mexicana'],
  ['18+', 'Medios de prensa nacional e internacional'],
];

const press = [
  ['Forbes', '"Top 20 power minds: líderes que impulsaron 2025."', '04 / 2026'],
  ['Milenio', '"Diego Díaz: éxito empresarial volátil y sustentable."', '03 / 2026'],
  ['Excélsior', '"Diego Díaz cuestiona el crecimiento acelerado."', '02 / 2026'],
  ['Radio Fórmula', '"La obsesión por crecer rápido y quebrar empresas en todo el mundo."', '04 / 2026'],
  ['El País', '"Crecer no siempre es la parte difícil."', '03 / 2026'],
  ['Semana', '"La etapa clave del crecimiento empresarial que no se puede dejar de lado."', '02 / 2026'],
];

export default function About() {
  const heroRef = useHeroReveal();
  const heroImageRef = useReveal<HTMLDivElement>(0.05);
  const storyRef = useReveal<HTMLElement>(0.12);
  const milestonesRef = useReveal<HTMLDivElement>(0.08);
  const statsRef = useReveal<HTMLDivElement>(0.08);
  const firmRef = useReveal<HTMLDivElement>(0.12);
  const pressRef = useReveal<HTMLDivElement>(0.08);
  const speakerRef = useReveal<HTMLDivElement>(0.12);

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="container-app py-12 lg:py-16 xl:py-20">
        <div className={`${mono} flex flex-wrap justify-between gap-4 border-b ${border} pb-6`}>
          <span>— Sobre Diego · Bio extendida</span>
          <span>Vol. 01 · 2026</span>
        </div>
        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,680px)_minmax(420px,1fr)] xl:items-center xl:gap-16">
          <div ref={heroRef} className="hero-reveal self-start xl:pt-6">
            <p className={mono}>— El estratega fiscal</p>
            <h1 className="mt-6 max-w-[620px] font-sans text-[clamp(68px,9vw,128px)] font-light leading-[0.86] tracking-[-0.06em]">
              <span className="line-mask"><span>Diego</span></span>
              <span className="line-mask font-serif italic tracking-[-0.07em]"><span>Díaz.</span></span>
            </h1>
            <p className="hero-lede mt-8 max-w-[540px] border-l border-[#6b4f2a]/55 pl-6 font-serif text-[clamp(21px,2.4vw,28px)] italic leading-snug text-ink-900/68">
              "El arquitecto de soluciones donde otros ven sólo problemas tributarios."
            </p>
          </div>
          <div ref={heroImageRef} className="fade-up xl:flex xl:justify-end" style={{ transitionDelay: '260ms' }}>
            <img
              src={diegoHero}
              alt="Diego Díaz"
              className={`aspect-[2731/4096] w-full max-w-[460px] border ${border} object-cover shadow-[0_28px_70px_rgba(0,0,0,0.08)] xl:max-h-[680px] xl:max-w-[520px]`}
            />
          </div>
        </div>
      </section>

      <section ref={storyRef} className="fade-up container-app py-24">
        <div className={`grid items-end gap-8 border-b ${border} pb-10 lg:grid-cols-[120px_minmax(0,780px)_160px]`}>
          <span className={mono}>01 /<br />Trayectoria</span>
          <h2 className="max-w-[760px] text-[clamp(54px,7.6vw,104px)] font-light leading-[0.9] tracking-[-0.065em]">
            La <span className="font-serif italic">historia</span>
            <span className="block">detrás del fiscalista.</span>
          </h2>
          <span className={`${mono} justify-self-start lg:justify-self-end`}>Lectura · 4 min</span>
        </div>
        <div className="mt-20 grid gap-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-24">
          <aside>
            <p className={mono}>— Cita destacada</p>
            <blockquote className={`mt-8 max-w-[430px] border-l border-ink-900/45 pl-7 font-serif text-[clamp(30px,3vw,42px)] leading-[0.98] tracking-[-0.055em] text-ink-900`}>
              "Entendí que la estrategia fiscal no es contabilidad: es arquitectura, es crecimiento, y es protección para tu patrimonio."
            </blockquote>
            <p className={`${mono} mt-12`}>— Especialización</p>
            <p className="mt-6 max-w-[460px] text-[14px] leading-[1.8] text-ink-900/75">
              Contaduría · Finanzas · Derecho corporativo · Defensa fiscal · Holdings · Precios de transferencia · Liderazgo empresarial · Cultura organizacional.
            </p>
          </aside>
          <article className="max-w-[720px] font-serif text-[22px] leading-[1.55] tracking-[-0.015em] text-ink-900/86">
            <p className="first-letter:float-left first-letter:mr-4 first-letter:font-serif first-letter:text-[112px] first-letter:leading-[0.76] first-letter:text-ink-900">
              Diego Díaz fue formado en los fundamentos—Contaduría y Finanzas—pero su trayectoria se distingue por un giro conceptual. Con especializaciones en derecho corporativo, fiscal y estrategia tributaria, Diego identificó tempranamente que la contaduría trasciende el cumplimiento administrativo: es un instrumento de transformación estratégica.
            </p>
            <p className="mt-8">
              Su punto de inflexión ocurrió en 2014, cuando logró el primer acuerdo conclusivo en defensa de una agencia de viajes en un proceso fiscal complejo. Ese caso estableció un precedente en la jurisprudencia que hoy consultan otros estrategas. Pero lo que define a Díaz no es la confrontación con la autoridad: es la capacidad de diseñar estructuras que nunca llegan al conflicto.
            </p>
            <p className={`${mono} mt-10`}>Obra</p>
            <p className="mt-5">
              Su segundo libro, "7 Secretos de un Fiscalista", sintetiza años de experiencia en un lenguaje accesible para decisores. Fue un cambio de audiencia intencional: dejó de escribir para colegas y comenzó a dirigirse a empresarios que toman decisiones financieras sin comprender el costo fiscal implícito de cada movimiento.
            </p>
            <p className={`${mono} mt-10`}>Presente</p>
            <p className="mt-5">
              Hoy, Díaz opera en tres espacios convergentes: como conferencista en foros empresariales; como autor de 3 libros en la materia; y como director fundador de Díaz Lara | Firma de Estrategia Empresarial, la firma que atiende a más de mil empresas.
            </p>
          </article>
        </div>
      </section>

      <section className="bg-cream-100 py-24">
        <div className="container-app">
          <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
            <span>02 / Hitos</span>
            <span>1999 · 2026</span>
          </div>
          <h2 className="mt-10 font-serif text-[clamp(54px,8vw,104px)] leading-[0.95] tracking-[-0.06em]">Veinticinco años, seis momentos.</h2>
          <div ref={milestonesRef} className={`stagger-grid mt-16 grid border ${border} bg-white md:grid-cols-2 lg:grid-cols-6`}>
            {milestones.map(([year, body, tag], i) => {
              const isFeatured = year === '2022';

              return (
              <article
                key={year}
                data-s={String(i)}
                className={`group relative min-h-[320px] border-b ${border} p-7 transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-within:border-ink-900 focus-within:bg-ink-900 focus-within:text-white md:border-r lg:border-b-0`}
              >
                <span className="absolute right-5 top-6 h-1.5 w-1.5 rounded-full bg-ink-900/45 transition-colors duration-300 group-hover:bg-white group-focus-within:bg-white" />
                <p className="font-serif text-[54px] italic leading-none text-ink-900 transition-colors duration-300 group-hover:text-white group-focus-within:text-white">{isFeatured ? '2025' : year}</p>
                <p className="mt-10 text-[16px] leading-relaxed text-ink-900/70 transition-colors duration-300 group-hover:font-serif group-hover:italic group-hover:leading-tight group-hover:text-white group-focus-within:font-serif group-focus-within:italic group-focus-within:leading-tight group-focus-within:text-white">{body}</p>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45 transition-colors duration-300 group-hover:text-white group-focus-within:text-white">— {tag}</p>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-app py-24">
        <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
          <span>03 / En cifras</span>
          <span>Actualizado · 05/2026</span>
        </div>
        <h2 className="mt-10 font-serif text-[clamp(54px,8vw,104px)] leading-[0.95] tracking-[-0.06em]">El trabajo, en números.</h2>
        <div ref={statsRef} className={`stagger-grid mt-16 grid border ${border} bg-white md:grid-cols-2 lg:grid-cols-4`}>
          {stats.map(([value, label], i) => (
            <div key={label} data-s={String(i)} className={`border-b ${border} p-10 transition-colors duration-300 hover:bg-cream-100 md:border-r lg:border-b-0`}>
              <p className="font-serif text-[84px] italic leading-none text-[#6b4f2a]">{value}</p>
              <p className="mt-6 text-[20px] leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink-900 py-24 text-white">
        <div ref={firmRef} className="stagger-grid container-app grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <img data-s="0" src={equipoDiazLara} alt="Equipo Díaz Lara" className="aspect-[4/3] w-full object-cover opacity-90" />
          <div data-s="1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">04 / Firma</p>
            <h2 className="mt-6 font-serif text-[72px] leading-none tracking-[-0.06em]">Fundador de Díaz Lara.</h2>
            <p className="mt-7 max-w-[560px] text-[20px] leading-relaxed text-white/70">
              La firma integra estrategia empresarial, defensa fiscal y cultura organizacional para empresas mexicanas que necesitan claridad antes de ejecutar.
            </p>
            <Link to="/despacho" className="mt-8 inline-block cursor-pointer border border-white/25 px-7 py-4 text-sm font-medium transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink-900">
              Conocer la firma →
            </Link>
          </div>
        </div>
      </section>

      <section className="container-app py-24">
        <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
          <span>06 / Prensa</span>
          <span>Última cobertura</span>
        </div>
        <h2 className="mt-10 font-serif text-[clamp(54px,8vw,104px)] leading-[0.95] tracking-[-0.06em]">Diego en medios.</h2>
        <div ref={pressRef} className={`stagger-grid mt-14 grid border ${border} bg-white md:grid-cols-2 lg:grid-cols-3`}>
          {press.map(([source, title, date], i) => (
            <article key={`${source}-${date}`} data-s={String(i)} className={`group min-h-[240px] cursor-pointer border-b ${border} p-8 transition-colors duration-300 hover:bg-cream-100 md:border-r`}>
              <p className={mono}>— {source}</p>
              <h3 className="mt-8 font-serif text-[28px] leading-tight tracking-[-0.04em]">{title}</h3>
              <div className={`mt-8 flex justify-between border-t ${border} pt-4 ${mono}`}>
                <span>{date}</span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">Leer ↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-cream-100 py-24">
        <div ref={speakerRef} className="stagger-grid container-app grid gap-12 lg:grid-cols-2 lg:items-center">
          <div data-s="0">
            <p className={mono}>07 / Para organizadores</p>
            <h2 className="mt-6 font-serif text-[72px] leading-none tracking-[-0.06em]">¿Buscas a Diego para tu evento?</h2>
            <p className="mt-7 max-w-[580px] text-[20px] leading-relaxed text-ink-900/65">
              Diego participa cada año en cumbres empresariales, foros fiscales y entrevistas para medios. Descarga el dossier para conocer agenda, requerimientos técnicos y portafolio de conferencias.
            </p>
            <a href="/assets/home/DDMedia Kit.pdf" className="mt-8 inline-block cursor-pointer bg-ink-900 px-7 py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-700">
              Descargar dossier ↓
            </a>
          </div>
          <div data-s="1" className={`border ${border} bg-white p-10 transition-shadow duration-300 hover:shadow-[0_24px_70px_-40px_rgba(10,10,10,0.45)]`}>
            <div className={`grid h-20 w-16 place-items-center border ${border} font-serif text-[34px]`}>PDF</div>
            <p className={`${mono} mt-8`}>— DOSSIER DE CONFERENCISTA · 2026</p>
            <h3 className="mt-6 font-serif text-[48px] leading-tight tracking-[-0.05em]">Press kit + bio + portafolio de conferencias.</h3>
            <div className={`mt-8 flex justify-between border-t ${border} pt-5 ${mono}`}>
              <span>12 PÁG · ESP/ENG</span>
              <span>4.2 MB ↓</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
