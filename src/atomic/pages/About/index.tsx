import { Link } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReveal, useHeroReveal } from '@hooks/useReveal';
import { useCountUp } from '@hooks/useCountUp';
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
import logoDiegoDiaz from '../../../../assets/home/012_home_main logo_DD.png';
import mediaKitPdf from '../../../../assets/home/DDMedia Kit.pdf';
import logoYoutube from '../../../../assets/home/logo-youtube.svg';
import logoQualityMagazine from '../../../../assets/home/logo-quality-magazine.svg';
import logoDiarioQueretaro from '../../../../assets/home/logo-diario-queretaro.svg';

const milestones = [
  {
    year: '1999',
    body: 'Inicio profesional como contador junior en despacho local.',
    tag: 'Querétaro',
  },
  {
    year: '2014',
    body: 'Primer acuerdo conclusivo en defensa de un cliente — agencia de viajes.',
    tag: 'Hito histórico',
    italicYear: true,
  },
  {
    year: '2018',
    body: 'Publica su primer libro: "Los 7 secretos que el SAT no quiere que conozcas".',
    tag: 'Best seller',
  },
  {
    year: '2022',
    body: 'Díaz Lara recibe la Cruz de Malta por Latin American Quality Awards.',
    tag: 'Galardón continental',
  },
  {
    year: '2024',
    body: 'Certificación Great Place to Work® en Díaz Lara Consultores.',
    tag: 'Cultura validada',
  },
  {
    year: '2026',
    body: 'Meta declarada: capacitar a 100,000 empresarios al cierre de 2032.',
    tag: 'En curso',
    italicYear: true,
  },
];

const stats = [
  { value: '20',   label: 'Años de trayectoria profesional' },
  { value: '10K+', label: 'Empresarios capacitados en eventos y academia' },
  { value: '03',   label: 'Libros publicados sobre estrategia fiscal mexicana' },
  { value: '18+',  label: 'Medios de prensa nacional e internacional' },
];

const books = [
  {
    number: '01',
    title:    'Los 7 secretos que el SAT no quiere que conozcas',
    subtitle: 'Los siete secretos que el SAT no quiere que conozcas',
    meta: 'Libro · 2018',
    detail: 'Estrategia fiscal para empresarios',
    action: 'Agotado',
  },
  {
    number: '02',
    title:    '7 secretos de un fiscalista',
    subtitle: '7 secretos de un fiscalista.',
    meta: 'Libro · 2021',
    detail: 'Planeación fiscal aplicada',
    action: 'Comprar',
  },
  {
    number: '03',
    title:    '7 claves para cobrar a tu empresa',
    subtitle: '7 claves para cobrar a tu empresa.',
    meta: 'Libro · 2024',
    detail: 'Guía para dueños de negocio',
    action: 'Comprar',
  },
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

function SectionMeta({
  index,
  label,
  right,
  dark = false,
}: {
  index: string;
  label: string;
  right?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`grid border-b pb-7 text-[10px] uppercase tracking-[0.24em] md:grid-cols-[120px_minmax(0,1fr)_180px] ${
        dark ? 'border-white/10 text-white/30' : 'border-cream-400 text-ink-300'
      }`}
    >
      <p>
        {index} /<span className="block">{label}</span>
      </p>
      <span />
      {right && (
        <p className="mt-3 text-left md:mt-0 md:text-right">{right}</p>
      )}
    </div>
  );
}

function ImagePlaceholder({
  className = '',
  label = 'Imagen pendiente',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center text-[10px] uppercase tracking-[0.24em] ${className}`}
    >
      [ {label} ]
    </div>
  );
}

function BookCardTilt({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);

  const applyTilt = useCallback((cx: number, cy: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((cx - rect.left) / rect.width - 0.5) * 2;
      const y = ((cy - rect.top) / rect.height - 0.5) * 2;
      const rotY = x * 12;
      const rotX = -y * 9;
      el.style.transition = 'transform 80ms linear, filter 80ms linear';
      el.style.transform = `perspective(760px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0) scale(1.025)`;
      el.style.filter = `drop-shadow(${-rotY * 0.7}px ${rotX * 0.7 + 14}px 24px rgba(0,0,0,0.45))`;
    });
  }, []);

  const resetTilt = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = wrapRef.current;
    if (!el) return;
    el.style.transition = 'transform 520ms cubic-bezier(.2,.8,.2,1), filter 520ms cubic-bezier(.2,.8,.2,1)';
    el.style.transform = 'perspective(760px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.filter = 'drop-shadow(10px 10px 0 rgba(10,10,10,0.08))';
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={wrapRef}
      className="cursor-pointer select-none"
      style={{ willChange: 'transform, filter', filter: 'drop-shadow(10px 10px 0 rgba(10,10,10,0.08))' }}
      onMouseMove={(e) => applyTilt(e.clientX, e.clientY)}
      onMouseLeave={resetTilt}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) applyTilt(t.clientX, t.clientY); }}
      onTouchEnd={resetTilt}
    >
      {children}
    </div>
  );
}

export default function About() {
  const heroRef      = useHeroReveal();
  const milestonesRef = useReveal();
  const statsRef     = useReveal();
  const booksRef     = useReveal();
  const count20Ref   = useCountUp(20);
  const count18Ref   = useCountUp(18);
  const [showAllPress, setShowAllPress] = useState(false);
  const visiblePress = showAllPress ? press : press.slice(0, 8);

  return (
    <div className="bg-cream-50 text-ink-900">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1200px] px-5 pb-20 pt-14 sm:px-8 lg:px-0 lg:pb-[92px] lg:pt-[72px]">

          <div className="flex items-center justify-between border-b border-cream-400 pb-8 text-[10px] uppercase tracking-[0.28em] text-ink-300">
            <p>- Sobre Diego · Bio extendida</p>
            <p>Vol. 01 · 2026</p>
          </div>

          <div className="grid gap-12 pt-12 lg:grid-cols-[minmax(0,560px)_510px] lg:items-start lg:justify-between lg:pt-[58px]">
            <div ref={heroRef} className="hero-reveal relative z-10 pt-8 lg:pt-[118px]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-300">- El estratega fiscal</p>
              <h1 className="about-hero-title mt-6 font-serif font-normal leading-[0.82] tracking-[-0.06em]">
                <span className="line-mask"><span>Diego</span></span>
                <span className="line-mask italic-late italic tracking-[-0.07em]"><span>Díaz.</span></span>
              </h1>
              <p className="mt-8 font-serif text-[34px] italic leading-none tracking-[-0.045em] text-[#7a6546]">~ DD</p>
              <p className="hero-lede mt-9 max-w-[510px] font-serif text-[22px] italic leading-[1.36] tracking-[-0.035em] text-ink-500">
                Llevas años haciendo bien tu negocio. ¿Y si ahora hablamos de hacerlo rentable desde lo fiscal?
              </p>
            </div>

            <div className="relative z-10 justify-self-end border border-cream-400 bg-[#eee9df]">
              <div className="absolute right-8 top-8 h-px w-[70px] bg-cream-400" />
              <ImagePlaceholder
                className="h-[635px] w-full min-w-0 max-w-[510px] bg-transparent px-8 text-ink-300 sm:w-[510px]"
                label="retrato principal · 4:5 · b/n"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 01 Trayectoria ───────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:px-0 lg:py-[122px]">
          <div className="grid items-end gap-10 border-b border-cream-400 pb-7 lg:grid-cols-[112px_minmax(0,760px)_1fr]">
            <div className="text-[10px] uppercase leading-[1.45] tracking-[0.28em] text-ink-300">
              <p>01 /</p>
              <p>Trayectoria</p>
            </div>
            <h2 className="about-section-title max-w-[760px] font-normal leading-[0.9] tracking-[-0.055em]">
              La{' '}
              <span className="font-serif italic tracking-[-0.065em]">historia</span>
              <span className="block">detrás del fiscalista.</span>
            </h2>
            <p className="justify-self-start text-[10px] uppercase tracking-[0.28em] text-ink-300 lg:justify-self-end">
              Lectura · 4 min
            </p>
          </div>

          <div className="grid gap-16 pt-16 lg:grid-cols-[438px_minmax(0,620px)] lg:gap-[110px]">
            <aside className="pt-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-300">- Cita destacada</p>
              <blockquote className="mt-10 max-w-[390px] border-l border-ink-500 pl-7 font-serif text-[28px] leading-[1.08] tracking-[-0.045em] text-ink-800">
                "Entendí que la estrategia fiscal no es contabilidad: es arquitectura, es crecimiento, y es protección para tu patrimonio."
              </blockquote>
              <div className="mt-16">
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-300">- Especialización</p>
                <p className="mt-8 max-w-[390px] text-[13px] leading-[1.85] tracking-[-0.01em] text-ink-500">
                  Contaduría · Finanzas · Derecho corporativo · Defensa fiscal · Holdings · Precios de transferencia · Liderazgo empresarial · Cultura organizacional.
                </p>
              </div>
            </aside>
            <div style={{ display: 'none' }} aria-hidden="true">
              <h2 className="about-section-title font-normal leading-[0.92] tracking-[-0.055em]">
                La{' '}
                <span className="font-serif italic tracking-[-0.065em]">historia</span>
                <span className="block">detrás del fiscalista.</span>
              </h2>
              <blockquote className="mt-16 border-l-2 border-ink-900 pl-6 font-serif text-[18px] italic leading-[1.42] tracking-[-0.02em] text-ink-700">
                "Entendí que la estrategia fiscal no es contabilidad: es arquitectura, es crecimiento, y es protección para tu patrimonio."
              </blockquote>
              <p className="mt-8 text-[10px] uppercase leading-[1.85] tracking-[0.22em] text-ink-400">
                Defensa fiscal · Holding · Transformación · Liderazgo empresarial
              </p>
            </div>

            <article className="space-y-6 font-serif text-[17px] leading-[1.68] tracking-[-0.018em] text-ink-500">
              <p className="about-dropcap">
                Diego Díaz fue formado en los fundamentos—Contaduría y Finanzas—pero su trayectoria se distingue por un giro conceptual. Con especializaciones en derecho corporativo, fiscal y estrategia tributaria, Diego identificó tempranamente que la contaduría trasciende el cumplimiento administrativo: es un instrumento de transformación estratégica.
              </p>
              <p>
                Su punto de inflexión ocurrió en 2014, cuando logró el primer acuerdo conclusivo en defensa de una agencia de viajes en un proceso fiscal complejo. Ese caso estableció un precedente en la jurisprudencia que hoy consultan otros estrategas. Pero lo que define a Díaz no es la confrontación con la autoridad: es la capacidad de diseñar estructuras que nunca llegan al conflicto.
              </p>
              <p>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-ink-300">Obra</span>
                <span className="mt-3 block">
                  Su segundo libro, "7 Secretos de un fiscalista", sintetiza años de experiencia en un lenguaje accesible para decisores. Fue un cambio de audiencia intencional: dejó de escribir para colegas y comenzó a dirigirse a empresarios que toman decisiones financieras sin comprender el costo fiscal implícito de cada movimiento.
                </span>
              </p>
              <p>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-ink-300">Presente</span>
                <span className="mt-3 block">
                  Hoy, Díaz opera en tres espacios convergentes: como conferencista en foros empresariales; como autor de 3 libros en la materia; y como director fundador de Díaz Lara Consultores, la firma que atiende a más de mil empresas.
                </span>
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── 02 Momentos ──────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 lg:px-0 lg:py-[118px]">
          <SectionMeta index="02" label="Hitos" right="1999 · 2026" />
          <h2 className="about-section-title mt-14 font-normal leading-[0.94] tracking-[-0.055em]">
            Experiencia respaldada
            <span className="block">
              con hechos{' '}
              <span className="font-serif italic tracking-[-0.065em]">clave.</span>
            </span>
          </h2>

          {/* stagger-grid: border-l border-t on wrapper + border-r border-b on each cell */}
          <div
            ref={milestonesRef}
            className="stagger-grid mt-16 grid border-l border-t border-cream-400 bg-cream-50 md:grid-cols-3 lg:grid-cols-6"
          >
            {milestones.map((milestone, i) => {
              return (
                <div
                  key={milestone.year}
                  data-s={String(i)}
                  tabIndex={0}
                  className="group relative flex min-h-[255px] cursor-pointer flex-col justify-between border-b border-r border-cream-400 bg-cream-50 p-8 text-ink-900 transition-colors duration-300 hover:border-ink-900 hover:bg-ink-900 hover:text-white focus-visible:border-ink-900 focus-visible:bg-ink-900 focus-visible:text-white focus-visible:outline-none"
                >
                  <span className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full bg-ink-300 transition-colors duration-300 group-hover:bg-white group-focus-visible:bg-white" />
                  <p className={`font-serif text-[54px] leading-none tracking-[-0.055em] ${milestone.italicYear ? 'italic' : ''}`}>
                    {milestone.year}
                  </p>
                  <div>
                    <p className="font-serif text-[18px] italic leading-[1.15] tracking-[-0.025em] text-ink-700 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                      {milestone.body}
                    </p>
                    <p className="mt-5 text-[9px] uppercase tracking-[0.24em] text-ink-300 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
                      - {milestone.tag}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 03 Números ───────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-24 sm:px-8 lg:px-0">
          <div className="grid items-end gap-10 border-b border-cream-400 pb-8 lg:grid-cols-[112px_minmax(0,760px)_1fr]">
            <div className="text-[10px] uppercase leading-[1.45] tracking-[0.28em] text-ink-300">
              <p>03 /</p>
              <p>En cifras</p>
            </div>
            <h2 className="about-section-title max-w-[760px] font-normal leading-[0.9] tracking-[-0.055em]">
              El trabajo,
              <span className="block">
                en{' '}
                <span className="font-serif italic tracking-[-0.065em]">números.</span>
              </span>
            </h2>
            <p className="justify-self-start text-[10px] uppercase tracking-[0.28em] text-ink-300 lg:justify-self-end">
              Actualizado · 05/2026
            </p>
          </div>
          <h2 className="hidden">
            El trabajo,
            <span className="block">
              en{' '}
              <span className="font-serif italic tracking-[-0.065em]">números.</span>
            </span>
          </h2>

          <div
            ref={statsRef}
            className="fade-up mt-20 grid border-l border-t border-cream-400 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map(({ value, label }) => (
              <div key={value} className="flex min-h-[220px] flex-col justify-center border-b border-r border-cream-400 px-9 py-10">
                <p className={`font-serif text-[78px] leading-none tracking-[-0.055em] ${value === '10K+' ? 'italic' : ''}`}>
                  {value === '20' ? (
                    <span ref={count20Ref}>20</span>
                  ) : value === '18+' ? (
                    <><span ref={count18Ref}>18</span>+</>
                  ) : (
                    value
                  )}
                </p>
                <p className="mt-5 max-w-[165px] text-[10px] uppercase leading-[1.55] tracking-[0.22em] text-ink-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Firma ─────────────────────────────────────────── */}
      <section className="bg-[#0b0b0b] text-white">
        <div className="mx-auto max-w-[1184px] px-5 py-24 sm:px-8 lg:px-0 lg:py-[118px]">
          <div className="grid items-end gap-10 border-b border-white/12 pb-9 lg:grid-cols-[112px_minmax(0,760px)_1fr]">
            <div className="text-[10px] uppercase leading-[1.45] tracking-[0.28em] text-white/35">
              <p>04 /</p>
              <p>Díaz Lara</p>
            </div>
            <h2 className="about-section-title max-w-[760px] font-normal leading-[0.9] tracking-[-0.055em]">
              Fundador
              <span className="block">
                de{' '}
                <span className="font-serif italic tracking-[-0.065em]">la firma.</span>
              </span>
            </h2>
            <a
              href="https://diazlara.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="justify-self-start text-[10px] uppercase tracking-[0.28em] text-white/40 transition-colors hover:text-white lg:justify-self-end"
            >
              diazlara.mx ↗
            </a>
          </div>

          <div className="grid gap-12 pt-20 lg:grid-cols-[540px_minmax(0,545px)] lg:gap-[86px]">
            <ImagePlaceholder
              className="min-h-[650px] bg-[linear-gradient(135deg,#1d1d1d,#282828)] text-white/20"
              label="Equipo Díaz Lara · 4:5 · b/n"
            />
            <div className="flex flex-col justify-center">
              <h2 className="hidden">
                Fundador
                <span className="block">
                  de{' '}
                  <span className="font-serif italic tracking-[-0.065em]">la firma.</span>
                </span>
              </h2>
              <h3 className="font-serif text-[52px] leading-[0.9] tracking-[-0.05em]">
                Díaz Lara
                <span className="block italic">Consultores</span>
              </h3>
              <p className="mt-9 max-w-[520px] font-serif text-[18px] leading-[1.62] tracking-[-0.015em] text-white/62">
                Diego es fundador y director de Díaz Lara Consultores, firma especializada en estrategia fiscal, defensa SAT, blindaje patrimonial y estructuras holding. Hoy atiende a empresas con operaciones nacionales e internacionales.
              </p>
              <p className="mt-7 max-w-[520px] font-serif text-[18px] leading-[1.62] tracking-[-0.015em] text-white/62">
                La firma cuenta con dos distinciones que validan su cultura y excelencia operacional.
              </p>
              <div className="mt-8 grid max-w-[540px] grid-cols-2 border border-white/15">
                <div className="border-r border-white/15 p-7">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">- Cultura</p>
                  <p className="mt-5 font-serif text-[23px] leading-[1.15]"><span className="italic">Great Place</span><br />to Work®</p>
                </div>
                <div className="p-7">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">- Excelencia</p>
                  <p className="mt-5 font-serif text-[23px] leading-[1.15]">Cruz de<br /><span className="italic">Malta</span></p>
                </div>
              </div>
              <a
                href="https://diazlara.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-inv mt-9 w-fit cursor-pointer"
              >
                Visitar diazlara.mx ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Biblioteca ────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-24 sm:px-8 lg:px-0">
          <SectionMeta index="05" label="Bibliografía" right="+50,000 lectores" />
          <h2 className="about-section-title mt-14 font-normal leading-[0.94] tracking-[-0.055em]">
            Tres libros.
            <span className="block">
              Tres{' '}
              <span className="font-serif italic tracking-[-0.065em]">conversaciones.</span>
            </span>
          </h2>

          <div
            ref={booksRef}
            className="stagger-grid mt-16 grid gap-10 md:grid-cols-3"
          >
            {books.map(({ number, title, subtitle, meta, detail, action }, i) => (
              <article key={number} data-s={String(i)} className="group">
                <BookCardTilt>
                  <div className="flex aspect-[0.75] flex-col justify-between bg-[linear-gradient(145deg,#171717,#292929)] p-8 text-white">
                    <p className="font-serif text-[21px] italic leading-[1.12] tracking-[-0.025em] text-white/88">
                      "{subtitle}"
                    </p>
                    <p className="font-serif text-[82px] leading-none tracking-[-0.055em] text-white/92">{number}</p>
                  </div>
                </BookCardTilt>
                <p className="mt-6 text-[10px] uppercase tracking-[0.26em] text-ink-300">
                  - {meta}
                </p>
                <h3 className="mt-4 min-h-[70px] border-b border-cream-400 pb-5 font-serif text-[26px] leading-[1.02] tracking-[-0.045em]">
                  {title}
                </h3>
                <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-ink-300">
                  <span>{detail}</span>
                  <span className="font-bold text-ink-700 transition-transform duration-200 group-hover:translate-x-1">
                    {action} →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Prensa ────────────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 py-24 sm:px-8 lg:px-0">
          <SectionMeta index="06" label="Cobertura" right={`${press.length} apariciones verificadas`} />
          <h2 className="about-section-title mt-14 font-normal leading-[0.94] tracking-[-0.055em]">
            Diego en
            <span className="block">
              la{' '}
              <span className="font-serif italic tracking-[-0.065em]">prensa.</span>
            </span>
          </h2>

          <div
            className="mt-16 grid border-l border-t border-cream-400 bg-cream-50 md:grid-cols-2 lg:grid-cols-4"
          >
            {visiblePress.map((item, i) => (
              <article
                key={item.title}
                className="group flex min-h-[210px] cursor-pointer flex-col justify-between border-b border-r border-cream-400 p-8 transition-colors duration-200 hover:bg-cream-100"
              >
                <div>
                  <p className="mb-5 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                    {String(i + 1).padStart(2, '0')} / {press.length}
                  </p>
                  <div className="flex h-14 items-center">
                    <img
                      src={item.logo}
                      alt={item.source}
                      className="max-h-10 max-w-[150px] object-contain grayscale"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-6 font-serif text-[24px] leading-[1.08] tracking-[-0.035em] text-ink-800">
                    {item.title}
                  </h3>
                  <p className="mt-5 text-[13px] leading-[1.7] tracking-[-0.01em] text-ink-500">
                    {item.summary}
                  </p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-cream-400 pt-5 text-[10px] uppercase tracking-[0.24em]">
                  <span className="text-ink-300">{item.source}</span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-ink-700 transition-transform duration-200 group-hover:translate-x-1"
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
              className="btn-secondary cursor-pointer"
              aria-expanded={showAllPress}
            >
              {showAllPress ? 'Ver menos ↑' : `Ver más cobertura (${press.length - visiblePress.length}) ↓`}
            </button>
          </div>
        </div>
      </section>

      {/* ── 07 Conferencista ─────────────────────────────────── */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-24 sm:px-8 lg:px-0">
          <SectionMeta index="07" label="Para organizadores" right="Eventos · medios · academia" />
          <h2 className="about-section-title mt-14 border-b border-cream-400 pb-8 font-normal leading-[0.9] tracking-[-0.055em]">
            Diego está listo
            <span className="block">
              para compartir su{' '}
              <span className="font-serif italic tracking-[-0.065em]">experiencia.</span>
            </span>
          </h2>
          <div className="grid gap-12 pt-16 lg:grid-cols-[minmax(0,560px)_500px] lg:items-center lg:gap-[120px]">
            <div>
              <h2 className="hidden">
                Diego está listo
                <span className="block">
                  para compartir su{' '}
                  <span className="font-serif italic tracking-[-0.065em]">experiencia.</span>
                </span>
              </h2>
              <h3 className="font-serif text-[56px] leading-[0.92] tracking-[-0.055em]">
                Conferencista &amp;
                <span className="block italic">mentor.</span>
              </h3>
              <p className="mt-9 max-w-[560px] font-serif text-[18px] leading-[1.62] tracking-[-0.015em] text-ink-500">
                Diego no solo practica la estrategia fiscal: la enseña. Participa anualmente en cumbres empresariales, foros fiscales y espacios de formación ejecutiva, pero su disponibilidad va más allá de los auditorios corporativos.
              </p>
              <p className="mt-7 max-w-[560px] font-serif text-[18px] leading-[1.62] tracking-[-0.015em] text-ink-500">
                Cree que el conocimiento acumulado debe circular. Por eso está disponible para eventos corporativos, congresos de cámaras, programas de radio y podcast—y también para espacios académicos, universidades y iniciativas con jóvenes emprendedores que recién comienzan.
              </p>
              <p className="mt-7 max-w-[560px] font-serif text-[18px] leading-[1.62] tracking-[-0.015em] text-ink-500">
                Su propuesta es simple: no dicta desde la cátedra; comparte desde la cancha. Sus conferencias son diagnósticos, no discursos. Trae casos reales, estructuras vivas y la experiencia de tres décadas traducida en decisiones que importan.
              </p>
              <Link to="/contacto" className="btn-primary mt-10">
                Invitar a Diego →
              </Link>
            </div>

            <aside className="group relative overflow-hidden border border-ink-700 bg-cream-50 p-8 transition-colors duration-300 hover:bg-white lg:p-10">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full border border-cream-400 transition-transform duration-300 group-hover:translate-x-8 group-hover:-translate-y-8" />
              <div className="absolute bottom-8 right-8 hidden h-px w-24 bg-ink-700/25 lg:block" />

              <div className="relative z-10 flex items-start justify-between gap-6">
                <div className="flex h-[70px] w-[92px] items-center justify-center border border-ink-700 bg-cream-50 px-4">
                  <img
                    src={logoDiegoDiaz}
                    alt="Diego Díaz"
                    className="max-h-10 w-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="max-w-[150px] text-right text-[9px] uppercase leading-[1.65] tracking-[0.24em] text-ink-300">
                  Media kit · prensa · escenarios
                </p>
              </div>

              <div className="relative z-10 mt-10">
                <p className="text-[10px] uppercase leading-[1.75] tracking-[0.24em] text-ink-300">
                  - DD Media Kit · 2026
                </p>
                <h3 className="mt-5 max-w-[360px] font-serif text-[42px] leading-[0.92] tracking-[-0.055em] text-ink-900">
                  Diego Díaz
                  <span className="block italic">para medios.</span>
                </h3>
                <p className="mt-6 max-w-[360px] border-b border-cream-400 pb-7 text-[13px] leading-[1.75] tracking-[-0.01em] text-ink-500">
                  Información editorial para entrevistas, conferencias, podcast y cobertura de prensa: biografía, temas sugeridos, enfoque profesional y datos de contacto.
                </p>
              </div>

              <div className="relative z-10 mt-8 flex flex-col gap-3 border-t border-cream-400 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-[10px] uppercase tracking-[0.22em] text-ink-300">
                  Corporativo · académico · medios
                </span>
                <a
                  href={mediaKitPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center border border-ink-800 px-5 text-[10px] font-bold uppercase tracking-[0.22em] text-ink-800 transition-colors duration-200 hover:bg-ink-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900"
                >
                  Ver media kit →
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

    </div>
  );
}
