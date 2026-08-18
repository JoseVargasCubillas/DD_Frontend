import { Link } from 'react-router-dom';
import diegoPasarela from '../../../../../assets/ddweb/diego-pasarela.jpg';
import satDigital from '../../../../../assets/ddweb/sat-cumplimiento-digital.jpg';
import recibos from '../../../../../assets/ddweb/recibos-deducibles.jpg';
import equipoUnido from '../../../../../assets/ddweb/equipo-unido.jpg';
import blindaje from '../../../../../assets/ddweb/blindaje-digital.jpg';
import reforma from '../../../../../assets/ddweb/reforma-fiscal-2026.jpg';
import alianza from '../../../../../assets/ddweb/alianza-empresarial.jpg';
import inmobiliario from '../../../../../assets/ddweb/inmobiliario-construccion.jpg';
import sefCdmx from '../../../../../assets/ddweb/SEF.jpg';

const border = 'border-ink-900/10';
const mono = 'font-mono text-[11px] uppercase tracking-[0.18em] text-ink-900/45';

const posts = [
  {
    title: 'Cómo cobrarte un dividendo sin meterte en problemas',
    image: recibos,
    tag: 'Estrategia fiscal',
    date: '14 May · 6 min',
    excerpt: 'Tres rutas legales para retirar utilidades de tu empresa, con sus tasas efectivas reales. Incluye plantilla.',
  },
  {
    title: 'El equipo no renunció: nunca lo construiste',
    image: equipoUnido,
    tag: 'Liderazgo',
    date: '07 May · 11 min',
    excerpt: 'Ensayo sobre rotación, cultura y el costo oculto de no tener un sistema de talento. A propósito del caso Remax 2026.',
  },
  {
    title: 'Cómo resolvimos un bloqueo de certificado en cuatro días',
    image: blindaje,
    tag: 'Casos reales',
    date: '30 Abr · 9 min',
    excerpt: 'Cronología paso a paso de un caso real con empresa de +1,000 colaboradores. Los oficios, las llamadas, los movimientos clave.',
  },
  {
    title: 'Reforma fiscal 2026: lo que sí impacta a las PyMEs',
    image: reforma,
    tag: 'SAT & reformas',
    date: '23 Abr · 7 min',
    excerpt: 'Resumen ejecutivo de los cambios que más impactan a empresarios con facturación entre $20M y $200M.',
  },
  {
    title: 'Honorarios cruzados entre socios: la guía completa',
    image: alianza,
    tag: 'Estrategia fiscal',
    date: '16 Abr · 8 min',
    excerpt: 'Cuándo conviene, cuándo no, y cómo documentarlo para que resista una revisión del SAT. Incluye plantilla.',
  },
  {
    title: 'La arquitectura antes que el truco',
    image: inmobiliario,
    tag: 'Ensayo largo',
    date: '09 Abr · 18 min',
    excerpt: 'Ensayo de 4,200 palabras sobre por qué los empresarios mexicanos confunden táctica con estrategia y por qué pagan caro.',
  },
];

const mostRead = [
  ['"El SAT no es tu enemigo"', 'Versión texto del video viral', '12,050 lecturas · 6 min'],
  ['Holding o fideicomiso: guía comparativa con casos', '8,910 lecturas · 12 min'],
  ['"Tres preguntas que nunca hago en una primera junta"', '7,150 lecturas · 6 min'],
  ['El método de los tres folders', 'Cómo organizar tu defensa fiscal', '6,440 lecturas · 9 min'],
];

const territories = [
  ['I', 'Estrategia fiscal', 'El núcleo del trabajo. Cómo se construye una posición fiscal sólida para una empresa mexicana: dividendos, deducciones, vehículos.', '62 ensayos'],
  ['II', 'SAT & reformas', 'Análisis al día de criterios, oficios, jurisprudencia y reformas. Lo que cambia, cuándo entra en vigor, a quién impacta.', '48 ensayos'],
  ['III', 'Liderazgo empresarial', 'Construir empresa también es construir equipo. Ensayos sobre cultura, sucesión, talento y mentalidad estratégica.', '31 ensayos'],
  ['IV', 'Casos reales', 'Cronologías paso a paso de casos resueltos. Nombres cambiados, números reales. Lo más cercano a un behind the scenes fiscal.', '24 ensayos'],
  ['V', 'Ensayos largos', 'Textos de 4,000+ palabras. Filosofía del oficio, mentalidad, errores aprendidos, el por qué detrás del cómo.', '19 ensayos'],
];

export default function BlogList() {
  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="container-app pt-8">
        <div className={`grid gap-4 border-b ${border} pb-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900/45 md:grid-cols-4`}>
          <span>* Vol. III · 2026</span>
          <span>Publicado los miércoles · 06:00 CDMX</span>
          <span>184 ensayos publicados desde 2019</span>
          <span className="md:text-right">Edición · Viernes 22 Mayo 2026</span>
        </div>

        <div className={`border-b ${border} py-12 text-center lg:py-14`}>
          <h1 className="font-serif text-[clamp(58px,10vw,142px)] font-normal leading-[0.82] tracking-[-0.06em]">
            El <em className="font-normal">Estratega</em> Diario
          </h1>
        </div>

        <div className="grid items-center gap-8 py-6 lg:grid-cols-[460px_1fr_260px]">
          <p className="max-w-[450px] font-serif text-[16px] italic leading-[1.45] text-ink-900/58">
            Análisis semanal del SAT, las reformas y la mentalidad estratégica del empresario mexicano.
            Por Diego Díaz y editores invitados.
          </p>
          <div className="hidden lg:block" />
          <form className={`flex h-11 border ${border} bg-cream-50`}>
            <input
              aria-label="Buscar ensayos en el blog"
              placeholder="Buscar ensayos, autores, temas..."
              className="min-w-0 flex-1 bg-transparent px-4 text-[12px] outline-none placeholder:text-ink-900/40"
            />
          </form>
        </div>
      </section>

      <section className="border-y border-ink-900/70">
        <div className="container-app grid gap-12 py-14 lg:grid-cols-[0.98fr_0.72fr] lg:items-center lg:py-20">
          <img
            src={diegoPasarela}
            alt="Diego Díaz en pasarela corporativa"
            className="h-[360px] w-full object-cover md:h-[440px] lg:h-[510px]"
          />
          <article className="max-w-[520px] lg:pl-5">
            <p className="inline-flex bg-ink-900 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
              * Destacado de la semana
            </p>
            <p className={`${mono} mt-6`}>— Estrategia fiscal · análisis profundo</p>
            <h2 className="mt-5 font-serif text-[clamp(45px,5.4vw,78px)] font-normal leading-[0.91] tracking-[-0.055em]">
              El SAT no es <em className="font-normal">tu enemigo.</em><br />Es un <em className="font-normal">algoritmo</em> mal entendido.
            </h2>
            <p className="mt-7 max-w-[500px] font-serif text-[18px] italic leading-[1.48] text-ink-900/62">
              "Llevo veinticinco años en esto. Los empresarios que más rápido cambian su carga fiscal son los que dejan de tratar al SAT como persona. Te explico por qué."
            </p>
            <div className={`mt-7 flex flex-wrap gap-x-5 gap-y-2 border-y ${border} py-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/48`}>
              <span>— Diego Díaz</span>
              <span>22 May 2026</span>
              <span>14 min lectura</span>
              <span>+4,208 lectores</span>
            </div>
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link to="/blog/sat-algoritmo" className="bg-ink-900 px-6 py-5 text-center font-mono text-[11px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink-900/85">
                Leer ensayo completo →
              </Link>
              <button type="button" className={`border ${border} px-6 py-5 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors hover:bg-ink-900 hover:text-white`}>
                Guardar para después
              </button>
            </div>
          </article>
        </div>

        <div className="border-t border-ink-900/10">
          <div className="container-app flex flex-wrap items-center justify-between gap-5 py-5">
            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900/45">
              <Link to="/blog" className="border-b border-ink-900 text-ink-900">Todas 184</Link>
              <Link to="/blog">Estrategia fiscal 62</Link>
              <Link to="/blog">SAT & reformas 48</Link>
              <Link to="/blog">Liderazgo empresarial 31</Link>
              <Link to="/blog">Casos reales 24</Link>
              <Link to="/blog">Ensayos largos 19</Link>
            </div>
            <button type="button" className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900/55">
              — Orden · Más reciente ↓
            </button>
          </div>
        </div>
      </section>

      <section className="container-app grid gap-12 border-t border-ink-900/10 py-16 lg:grid-cols-[minmax(0,1fr)_310px]">
        <main>
          <div className={`flex items-end justify-between border-b ${border} pb-6`}>
            <h2 className="font-serif text-[34px] font-normal leading-none">
              Publicados <em className="font-normal">este mes.</em>
            </h2>
            <span className={mono}>14 ensayos · Mayo 2026</span>
          </div>

          <article className={`border-b ${border} py-9`}>
            <img src={satDigital} alt="Cumplimiento digital del SAT" className="h-[330px] w-full object-cover" />
            <div className="pt-6">
              <p className={mono}>— SAT & reformas · esta semana</p>
              <h3 className="mt-4 max-w-[860px] font-serif text-[clamp(38px,4.7vw,58px)] font-normal leading-[0.95] tracking-[-0.045em]">
                El nuevo criterio del SAT sobre <em className="font-normal">opinión de cumplimiento 32-D</em>: qué cambió, a quién aplica.
              </h3>
              <p className="mt-5 max-w-[720px] font-serif text-[16px] italic leading-[1.55] text-ink-900/62">
                "Si tu RFC aparece con semáforo sin opinión y nadie te explicó por qué, este ensayo te va a aclarar.
                Te explico el cambio de criterio interno del SAT y cómo se está aplicando con dos casos reales de empresarios que ya están en proceso."
              </p>
              <div className={`mt-6 grid gap-3 border-t ${border} pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/45 sm:grid-cols-4`}>
                <span>— Diego Díaz</span>
                <span>21 May 2026</span>
                <span>8 min lectura</span>
                <span>1,840 lectores</span>
              </div>
            </div>
          </article>

          <div className="grid gap-x-6 md:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.title} to="/blog" className={`group border-b ${border} py-7`}>
                <img src={post.image} alt={post.title} className="h-[220px] w-full object-cover transition duration-300 group-hover:grayscale" />
                <div className="mt-5 flex items-center justify-between gap-4">
                  <p className={mono}>— {post.tag}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/40">{post.date}</p>
                </div>
                <h3 className="mt-3 font-serif text-[26px] font-normal leading-[1.02] tracking-[-0.035em]">
                  {post.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.65] text-ink-900/58">{post.excerpt}</p>
                <p className={`mt-5 border-t ${border} pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/60`}>
                  — Diego Díaz
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-2 border-t border-ink-900/10 pt-9">
            {['←', '1', '2', '3', '4', '...', '28', 'Siguiente →'].map((item) => (
              <button
                key={item}
                type="button"
                className={`min-h-11 border px-4 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                  item === '1'
                    ? 'border-ink-900 bg-ink-900 text-white'
                    : `${border} text-ink-900/60 hover:border-ink-900 hover:bg-ink-900 hover:text-white`
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </main>

        <aside className="space-y-7 lg:pt-0">
          <div className="bg-ink-900 p-6 text-white">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">— Próximo evento</p>
            <h3 className="mt-5 font-serif text-[30px] leading-[0.95]">
              Estrategia <em className="font-normal">Fiscal</em><br />Edición CDMX
            </h3>
            <img src={sefCdmx} alt="Seminario Estrategia Fiscal CDMX" className="mt-5 aspect-square w-full object-cover" />
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">15 Jun 2026 · WTC CDMX</p>
            <div className="mt-4 grid grid-cols-4 border border-white/15">
              {['24 días', '11 hrs', '42 min', '17 seg'].map((item) => (
                <div key={item} className="border-r border-white/15 p-3 text-center last:border-r-0">
                  <span className="block font-serif text-[22px] leading-none">{item.split(' ')[0]}</span>
                  <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">{item.split(' ')[1]}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-[1.55] text-white/62">
              23 cupos disponibles de 80. Early bird vigente hasta el 30 de mayo.
            </p>
            <Link to="/eventos" className="mt-5 block bg-white px-5 py-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-ink-900 transition-colors hover:bg-cream-200">
              Reservar lugar →
            </Link>
          </div>

          <div className={`border ${border} p-6`}>
            <p className={mono}>— Newsletter</p>
            <h3 className="font-serif text-[26px] leading-none">Carta del domingo.</h3>
            <p className="mt-4 text-[13px] leading-[1.65] text-ink-900/58">
              Cada domingo a las 7am: un análisis, una estrategia y una decisión que puedes tomar el lunes.
            </p>
            <div className={`mt-5 flex border ${border}`}>
              <input aria-label="Correo para carta del domingo" placeholder="tu@correo.com" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-[12px] outline-none" />
              <button className="bg-ink-900 px-4 font-mono text-[9px] uppercase tracking-[0.14em] text-white" type="button">
                Suscribir
              </button>
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-900/45">— Sin spam · cancelación con un click · Vol. 184</p>
          </div>

          <div className={`border ${border} p-6`}>
            <p className={mono}>— Lo más leído del mes</p>
            <div className="mt-7 space-y-0">
              {mostRead.map(([title, subtitle, meta]) => (
                <Link key={title} to="/blog" className={`block border-b ${border} py-6 last:border-b-0`}>
                  <h4 className="max-w-[160px] font-serif text-[20px] leading-[1.08]">
                    {title.includes('enemigo') ? (
                      <>
                        "El SAT<br />no es <em className="font-normal">tu enemigo</em>"
                      </>
                    ) : title.includes('folders') ? (
                      <>
                        El método de<br />los <em className="font-normal">tres folders</em>
                      </>
                    ) : title}
                  </h4>
                  <p className="mt-3 text-[12px] leading-[1.45] text-ink-900/55">{subtitle}</p>
                  <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-900/40">{meta}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className={`border ${border} p-6`}>
            <p className={mono}>— Archivos por año</p>
            {[
              ['2026', '42'],
              ['2025', '58'],
              ['2024', '44'],
              ['2023', '40'],
            ].map(([year, count]) => (
              <Link key={year} to="/blog" className={`flex justify-between border-b ${border} py-4 font-serif text-[20px] last:border-b-0`}>
                <span>{year}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-900/40">{count}</span>
              </Link>
            ))}
          </div>
        </aside>
      </section>

      <section className="border-t border-ink-900/10 bg-cream-100 py-24 lg:py-32">
        <div className="container-app">
          <div className={`grid items-center gap-10 border-b ${border} pb-10 lg:grid-cols-[92px_1fr_auto]`}>
            <span className="font-mono text-[12px] uppercase leading-[1.35] tracking-[0.16em] text-ink-900/45">
              02 /<br />Categorías
            </span>
            <h2 className="max-w-[900px] font-serif text-[clamp(46px,6vw,78px)] font-normal leading-[0.93] tracking-[-0.05em]">
              Cinco <em className="font-normal">territorios.</em><br />Cinco modos de leer este blog.
            </h2>
            <Link to="/blog" className="justify-self-start border-b border-ink-900 pb-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-900 transition-opacity hover:opacity-60 lg:justify-self-end">
              Explorar archivo completo →
            </Link>
          </div>

          <div className="mt-16 grid border border-ink-900/14 bg-cream-50 md:grid-cols-2 lg:grid-cols-5">
            {territories.map(([number, title, body, count]) => (
              <Link
                key={title}
                to="/blog"
                className={`group flex min-h-[295px] flex-col border-b border-ink-900/10 p-8 transition-colors hover:bg-ink-900 hover:text-white md:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0 ${border}`}
              >
                <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-900/38 transition-colors group-hover:text-white/50">— {number}</p>
                <h3 className="mt-7 font-serif text-[clamp(28px,2.6vw,36px)] font-normal leading-[0.98] tracking-[-0.035em]">
                  {title.includes('fiscal') ? (
                    <>Estrategia <em className="font-normal">fiscal</em></>
                  ) : title.includes('&') ? (
                    <>SAT <span className="font-serif">&</span> <em className="font-normal">reformas</em></>
                  ) : title.includes('empresarial') ? (
                    <>Liderazgo<br /><em className="font-normal">empresarial</em></>
                  ) : title.includes('reales') ? (
                    <>Casos <em className="font-normal">reales</em></>
                  ) : (
                    <>Ensayos <em className="font-normal">largos</em></>
                  )}
                </h3>
                <p className="mt-5 text-[14px] leading-[1.55] text-ink-900/58 transition-colors group-hover:text-white/64">{body}</p>
                <div className={`mt-auto flex items-center justify-between border-t ${border} pt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-900 transition-colors group-hover:border-white/15 group-hover:text-white`}>
                  <span>{count}</span>
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
