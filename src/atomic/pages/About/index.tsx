import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useHeroReveal, useReveal } from '@hooks/useReveal';
import LeadCaptureModal from '@molecules/LeadCaptureModal';
import { requestMediaKit } from '@api/leads.api';
import diegoHero from '../../../../assets/ddweb/figma-diego-hero.png';
import equipoDiazLara from '../../../../assets/ddweb/equipo-diaz-lara-escaleras.jpg';
import logoLider from '../../../../assets/home/008_home_logo1_DD.png';
import logoExcelsior from '../../../../assets/home/009_home_logo2_DD.png';
import logoTeleformula from '../../../../assets/home/010_home_logo3_DD.png';
import logoMilenio from '../../../../assets/home/010_home_logo4_DD.png';
import logoSemana from '../../../../assets/home/010_home_logo5_DD.png';
import logoFeedspot from '../../../../assets/home/010_home_logo6_DD.png';
import logoForbes from '../../../../assets/home/010_home_logo8_DD.png';
import logoMundoEjecutivo from '../../../../assets/home/010_home_logo9_DD.png';
import logoElPais from '../../../../assets/home/010_home_logo10_DD.png';
import logoDiarioLasAmericas from '../../../../assets/home/010_home_logo11_DD.png';
import logoPersono from '../../../../assets/home/010_home_logo14_DD.png';
import logoAztecaJalisco from '../../../../assets/home/010_home_logo15_DD.png';
import logoCronica from '../../../../assets/home/010_home_logo16_DD.png';
import logoDineroEnImagen from '../../../../assets/home/010_home_logo17_DD.png';
import logoYoutube from '../../../../assets/home/logo-youtube.svg';
import logoQualityMagazine from '../../../../assets/home/logo-quality-magazine.svg';
import logoDiarioQueretaro from '../../../../assets/home/logo-diario-queretaro.svg';

const mono = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45';
const border = 'border-ink-900/10';

const milestones = [
  ['2006', 'Inicio profesional como contador junior en despacho local.', 'Querétaro'],
  ['2014', 'Primer acuerdo conclusivo en defensa de un cliente — agencia de viajes.', 'Hito histórico'],
  ['2018', 'Publica su primer libro: "Los 7 secretos que el SAT no quiere que conozcas".', 'Best seller'],
  ['2022', 'Díaz Lara recibe la Cruz de Malta por Latin American Quality Awards.', 'Galardón continental'],
  ['2024', 'Certificación Great Place to Work® en Díaz Lara Consultores.', 'Cultura validada'],
  ['2026', 'Meta declarada: capacitar a 100,000 empresarios al cierre de 2032.', 'En curso'],
];

const stats = [
  ['20', 'Años de trayectoria profesional'],
  ['10K+', 'Empresarios capacitados en eventos y Academia'],
  ['03', 'Libros publicados sobre estrategia fiscal mexicana'],
  ['18+', 'Medios de prensa nacional e internacional'],
];

const press = [
  {
    source: 'Líder Empresarial',
    title: 'Estrategia fiscal: clave para hacer negocio en México',
    summary: 'Una lectura sobre la estrategia fiscal como ventaja para empresas mexicanas que buscan crecer con orden y estructura.',
    href: 'https://www.liderempresarial.com/estrategia-fiscal-clave-negocio-mexico/',
    logo: logoLider,
  },
  {
    source: 'Líder Empresarial',
    title: 'Diego Díaz: arquitectura fiscal inteligente',
    summary: 'Perfil sobre la metodología de Diego: capacitación, asesoría estratégica y estructuras fiscales diseñadas para proteger el crecimiento.',
    href: 'https://www.liderempresarial.com/diego-diaz-arquitectura-fiscal-inteligente/',
    logo: logoLider,
  },
  {
    source: 'Líder Empresarial',
    title: 'Estrategias fiscales que transforman empresas',
    summary: 'Artículo enfocado en cómo la estrategia fiscal deja de ser trámite y se convierte en una herramienta de transformación empresarial.',
    href: 'https://www.liderempresarial.com/diego-diaz-estrategias-fiscales-que-transforman-empresas/',
    logo: logoLider,
  },
  {
    source: 'Diario de Querétaro',
    title: 'Las siete claves para cobrar a tu empresa',
    summary: 'Reseña del libro que traduce decisiones fiscales complejas en una guía práctica para emprendedores y empresarios.',
    href: 'https://oem.com.mx/diariodequeretaro/cultura/las-siete-claves-para-cobrar-a-tu-empresa-una-guia-para-emprendedores-y-empresarios-23230197',
    logo: logoDiarioQueretaro,
  },
  {
    source: 'PERSONO',
    title: 'Estrategias fiscales efectivas de Diego Díaz',
    summary: 'Entrevista sobre optimización fiscal, ética, tecnología y planeación tributaria sostenible para empresas en crecimiento.',
    href: 'https://persono.mx/blog/finanzas/diego-diaz/',
    logo: logoPersono,
  },
  {
    source: 'Forbes Argentina',
    title: 'Top 20 power minds: líderes que impulsaron 2025',
    summary: 'Mención editorial dentro de una conversación regional sobre liderazgo, innovación y mentes que impulsan nuevas formas de construir empresa.',
    href: 'https://www.forbesargentina.com/innovacion/top-20-power-minds-lideres-impulsaron-2025-disruptivo-n43409',
    logo: logoForbes,
  },
  {
    source: 'YouTube',
    title: 'Inversiones inmobiliarias',
    summary: 'Participación en video donde Diego comparte criterios fiscales y empresariales aplicados a decisiones patrimoniales e inmobiliarias.',
    href: 'https://youtu.be/S3iv-kwg59E?si=paSB-jghjY5349Wm',
    logo: logoYoutube,
  },
  {
    source: 'Líder Empresarial',
    title: 'Nearshoring con fricción',
    summary: 'Análisis del contexto económico de México y las condiciones que las empresas deberán considerar para sostener oportunidades de crecimiento.',
    href: 'https://www.liderempresarial.com/nearshoring-con-friccion-lo-que-mexico-gano-en-2025-y-lo-que-se-juega-en-2026/',
    logo: logoLider,
  },
  {
    source: 'Mundo Ejecutivo',
    title: 'Estructura, protección y visión',
    summary: 'Cobertura sobre la visión fiscal de Diego: diseñar estructuras que protejan patrimonio, ordenen decisiones y sostengan expansión.',
    href: 'https://mundoejecutivocdmx.com/uncategorized/estructura-proteccion-y-vision-la-estrategia-fiscal-de-diego-diaz/',
    logo: logoMundoEjecutivo,
  },
  {
    source: 'La Crónica de Hoy',
    title: 'Sostener el crecimiento empresarial sin riesgos fiscales',
    summary: 'Artículo sobre por qué crecer no basta: la permanencia requiere arquitectura legal, financiera y fiscal antes de acelerar.',
    href: 'https://www.cronica.com.mx/nacional/2026/02/06/diego-diaz-y-la-clave-para-sostener-el-crecimiento-empresarial-sin-riesgos-fiscales/',
    logo: logoCronica,
  },
  {
    source: 'TV Azteca Jalisco',
    title: 'Crecimiento empresarial y estabilidad en los negocios',
    summary: 'Nota sobre el papel de la estrategia fiscal para convertir crecimiento en estabilidad empresarial de largo plazo.',
    href: 'https://www.aztecajalisco.com/social-y/diego-diaz-estratega-fiscal-jalisco-crecimiento-empresarial-estabilidad-negocios/',
    logo: logoAztecaJalisco,
  },
  {
    source: 'Dinero en Imagen',
    title: 'Diego Díaz cuestiona el crecimiento acelerado',
    summary: 'Cobertura sobre liderazgo empresarial más humano y estructuras que priorizan permanencia sobre velocidad.',
    href: 'https://www.dineroenimagen.com/empresas/diego-diaz-cuestiona-el-crecimiento-acelerado-y-apuesta-por-un-liderazgo-empresarial-mas',
    logo: logoDineroEnImagen,
  },
  {
    source: 'Quality Magazine',
    title: 'Edición 296',
    summary: 'Aparición editorial asociada a trayectoria, liderazgo y visión empresarial desde la estrategia fiscal.',
    href: 'https://qualitymagazine.org/edicion-296/',
    logo: logoQualityMagazine,
  },
  {
    source: 'Excélsior',
    title: 'Dinero · edición impresa',
    summary: 'Referencia en la edición impresa de Dinero, sección económica de Excélsior.',
    href: 'https://impreso.excelsior.com.mx/Periodico/flip-dinero/18-02-2026/portada.pdf',
    logo: logoExcelsior,
  },
  {
    source: 'Milenio',
    title: 'El éxito empresarial no es volátil, es sustentable',
    summary: 'Artículo sobre pasar del crecimiento reactivo a un modelo sustentable, medible y protegido desde la estructura.',
    href: 'https://www.milenio.com/estilo/diego-diaz-exito-empresarial-volatil-sustentable',
    logo: logoMilenio,
  },
  {
    source: 'Semana',
    title: 'La etapa clave del crecimiento empresarial',
    summary: 'Cobertura regional sobre la etapa donde las empresas deben ordenar estructura, liderazgo y visión para crecer sin fragilidad.',
    href: 'https://www.semana.com/economia/emprendimiento/articulo/esta-es-la-etapa-clave-del-crecimiento-empresarial-que-no-se-puede-dejar-de-lado/202645/',
    logo: logoSemana,
  },
  {
    source: 'El País',
    title: 'Crecer no siempre es la parte difícil',
    summary: 'Mirada empresarial sobre el verdadero reto posterior al crecimiento: sostenerlo con decisiones, estructura y disciplina.',
    href: 'https://www.elpais.com.co/economia/crecer-no-siempre-es-la-parte-dificil-una-mirada-empresarial-1524.html',
    logo: logoElPais,
  },
  {
    source: 'Radio Fórmula',
    title: 'La obsesión por crecer rápido quiebra empresas',
    summary: 'Nota sobre la importancia de diseñar el crecimiento con claridad interna antes de perseguir velocidad de expansión.',
    href: 'https://www.radioformula.com.mx/estilo-de-vida/diego-diaz-la-obsesion-por-crecer-rapido-y-quiebra-empresas-en-todo-el-mundo-20260406-0010.html',
    logo: logoTeleformula,
  },
  {
    source: 'Diario Las Américas',
    title: 'El estratega que está cambiando la forma de hacer empresa en México',
    summary: 'Perfil internacional sobre Diego y su enfoque para convertir estrategia fiscal en una forma distinta de construir empresa.',
    href: 'https://www.diariolasamericas.com/el-estratega-que-esta-cambiando-la-forma-hacer-empresa-mexico-diego-diaz-n5390319',
    logo: logoDiarioLasAmericas,
  },
  {
    source: 'Feedspot',
    title: 'Podcasts de finanzas en México',
    summary: 'Referencia en directorio de podcasts financieros, útil para ubicar conversaciones y apariciones de educación empresarial.',
    href: 'https://podcast.feedspot.com/podcasts_finanzas_mexico/',
    logo: logoFeedspot,
  },
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
  const [showAllPress, setShowAllPress] = useState(false);
  const [mediaKitOpen, setMediaKitOpen] = useState(false);
  const visiblePress = showAllPress ? press : press.slice(0, 8);

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
            <h1 className="mt-6 max-w-[720px] font-sans text-[clamp(92px,12vw,168px)] font-light leading-[0.86] tracking-[-0.065em] [font-family:Helvetica,Arial,sans-serif]">
              <span className="line-mask font-bold"><span>Diego</span></span>
              <span className="line-mask"><span>Díaz.</span></span>
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
            <span>2006 · 2026</span>
          </div>
          <h2 className="mt-10 font-serif text-[clamp(54px,8vw,104px)] leading-[0.95] tracking-[-0.06em]">Veinte años, seis momentos.</h2>
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

      <section id="prensa" className="container-app py-24">
        <div className={`${mono} flex justify-between border-b ${border} pb-8`}>
          <span>06 / Prensa</span>
          <span>{press.length} apariciones verificadas</span>
        </div>
        <h2 className="mt-10 font-serif text-[clamp(54px,8vw,104px)] leading-[0.95] tracking-[-0.06em]">Diego en medios.</h2>
        <div ref={pressRef} className={`stagger-grid mt-14 grid border-l border-t ${border} bg-white md:grid-cols-2 lg:grid-cols-4`}>
          {visiblePress.map((item, i) => (
            <article key={`${item.source}-${item.title}`} data-s={String(i % 8)} className={`group flex min-h-[300px] flex-col justify-between border-b border-r ${border} p-8 transition-colors duration-300 hover:bg-cream-100`}>
              <div>
                <p className={mono}>
                  {String(i + 1).padStart(2, '0')} / {press.length}
                </p>
                <div className="mt-7 flex h-14 items-center">
                  <img
                    src={item.logo}
                    alt={item.source}
                    className="max-h-10 max-w-[150px] object-contain grayscale transition duration-300 group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-8 font-serif text-[26px] leading-[1.08] tracking-[-0.04em] text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-5 text-[14px] leading-[1.65] tracking-[-0.01em] text-ink-900/58">
                  {item.summary}
                </p>
              </div>
              <div className={`mt-8 flex items-center justify-between border-t ${border} pt-5 ${mono}`}>
                <span>{item.source}</span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-ink-900 transition-transform duration-200 group-hover:translate-x-1"
                >
                  {item.source === 'YouTube' ? 'Ver video ↗' : 'Leer artículo ↗'}
                </a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <button
            type="button"
            onClick={() => setShowAllPress((current) => !current)}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center border border-ink-900 px-8 font-mono text-[11px] font-bold uppercase tracking-[0.18em] transition-colors duration-200 hover:bg-ink-900 hover:text-white"
            aria-expanded={showAllPress}
          >
            {showAllPress ? 'Ver menos ↑' : `Ver más cobertura (${press.length - visiblePress.length}) ↓`}
          </button>
        </div>
      </section>

      <section className="bg-cream-100 py-24">
        <div ref={speakerRef} className="stagger-grid container-app grid gap-12 lg:grid-cols-2 lg:items-center">
          <div data-s="0">
            <p className={mono}>07 / Kit editorial & prensa</p>
            <h2 className="mt-6 font-serif text-[72px] leading-none tracking-[-0.06em]">Media kit de Diego Díaz.</h2>
            <p className="mt-7 max-w-[580px] text-[20px] leading-relaxed text-ink-900/65">
              Descarga el kit oficial con biografía, fotografías en alta, logotipos, líneas editoriales y la trayectoria pública de Diego. Pensado para redacciones, editoriales, universidades y organizaciones que preparan una publicación, entrevista o colaboración.
            </p>
            <button
              type="button"
              onClick={() => setMediaKitOpen(true)}
              className="mt-8 inline-block cursor-pointer bg-ink-900 px-7 py-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-700"
            >
              Descargar media kit ↓
            </button>
          </div>
          <div data-s="1" className={`border ${border} bg-white p-10 transition-shadow duration-300 hover:shadow-[0_24px_70px_-40px_rgba(10,10,10,0.45)]`}>
            <div className={`grid h-20 w-16 place-items-center border ${border} font-serif text-[34px]`}>PDF</div>
            <p className={`${mono} mt-8`}>— MEDIA KIT · 2026</p>
            <h3 className="mt-6 font-serif text-[48px] leading-tight tracking-[-0.05em]">Bio, fotografías, logotipos y líneas editoriales.</h3>
            <div className={`mt-8 flex justify-between border-t ${border} pt-5 ${mono}`}>
              <span>USO EDITORIAL · ESP/ENG</span>
              <span>PDF ↓</span>
            </div>
          </div>
        </div>
      </section>
      <LeadCaptureModal
        open={mediaKitOpen}
        onClose={() => setMediaKitOpen(false)}
        resource="media-kit"
        requirePhone
        submit={requestMediaKit}
        fallbackDownloadUrl="https://github.com/JoseVargasCubillas/DD_Frontend/releases/download/media-v1/DDMedia-Kit.pdf"
        fallbackFilename="Diego-Diaz-Media-Kit.pdf"
      />
    </div>
  );
}
