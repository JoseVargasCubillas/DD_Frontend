import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { subscribeNewsletter, subscribeSatWaitlist } from '@api/leads.api';
import BookStack from '@molecules/BookStack';
import bookClaves from '../../../../assets/ddweb/libro-siete-claves-cobrar.png';
import bookSat from '../../../../assets/ddweb/libro-siete-secretos-sat.png';
import bookFiscalista from '../../../../assets/ddweb/libro-siete-secretos-fiscalista.png';
import diegoAuthor from '../../../../assets/ddweb/diego-lentes.jpg';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const mono = 'font-mono text-[10px] uppercase tracking-[0.34em] text-ink-900/45';
const border = 'border-ink-900/10';

const books = [
  {
    n: '01',
    slug: '7-secretos-fiscalista',
    label: 'Obra reciente',
    title: '7 Secretos de un fiscalista',
    subtitle: 'La mentalidad detrás de la estrategia fiscal moderna.',
    image: bookFiscalista,
    price: '$497 MXN',
    description:
      'Diego Díaz comparte cómo piensa un fiscalista cuando deja de reaccionar a problemas y empieza a diseñar arquitectura fiscal para empresas reales.',
  },
  {
    n: '02',
    slug: '7-secretos-sat',
    label: 'Best seller',
    title: 'Los 7 secretos que el SAT no quiere que conozcas',
    subtitle: 'El libro que volvió pública la conversación fiscal.',
    image: bookSat,
    price: '$497 MXN',
    description:
      'Una lectura directa para empresarios que necesitan entender los riesgos, los mitos y las decisiones que más cuestan antes de una revisión.',
  },
  {
    n: '03',
    slug: '7-claves-cobrar-empresa',
    label: 'Edición especial',
    title: '7 Claves para cobrar a tu empresa',
    subtitle: 'La jugada maestra que al SAT le encantaría prohibir.',
    image: bookClaves,
    price: '$497 MXN',
    description:
      'Una guía práctica para ordenar sueldos, dividendos, honorarios y retiros sin destruir el flujo de la empresa ni improvisar al cierre.',
  },
];

function ArrowButton({ children, to, dark = false }: { children: string; to: string; dark?: boolean }) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-11 items-center justify-center border px-6 text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-900 ${
        dark
          ? 'border-white bg-white text-ink-900 hover:bg-transparent hover:text-white focus-visible:outline-white'
          : 'border-ink-900 bg-ink-900 text-white hover:bg-transparent hover:text-ink-900'
      }`}
    >
      {children} <span className="ml-3">→</span>
    </Link>
  );
}

function BookCover3D({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="group mx-auto w-full max-w-[430px] cursor-pointer [perspective:1400px]">
      <div className="relative aspect-[0.66] w-full transition-transform duration-300 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-10deg)_rotateX(4deg)_translateY(-10px)]">
        <div className="absolute inset-0 translate-x-7 translate-y-7 bg-black/10 blur-2xl transition-all duration-300 group-hover:translate-x-10 group-hover:translate-y-10 group-hover:bg-black/16" />
        <img
          src={src}
          alt={alt}
          className={`relative z-10 h-full w-full border ${border} object-cover shadow-[0_24px_48px_rgba(0,0,0,0.18)] transition-shadow duration-300 group-hover:shadow-[0_36px_70px_rgba(0,0,0,0.28)]`}
        />
      </div>
    </div>
  );
}

export default function Books() {
  const [satWaitlistEmail, setSatWaitlistEmail] = useState('');
  const [satWaitlistSending, setSatWaitlistSending] = useState(false);
  const [satWaitlistDone, setSatWaitlistDone] = useState(false);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSending, setNewsletterSending] = useState(false);
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleSatWaitlistSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = satWaitlistEmail.trim();
    if (!value) {
      toast.error('Escribe tu correo para anotarte en la lista de espera.');
      return;
    }
    if (!EMAIL_RE.test(value)) {
      toast.error('Ese correo no parece válido.');
      return;
    }
    setSatWaitlistSending(true);
    try {
      await subscribeSatWaitlist(value);
      setSatWaitlistDone(true);
      setSatWaitlistEmail('');
      toast.success('Listo, te avisaremos en cuanto esté disponible.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No pudimos anotarte. Intenta de nuevo.');
    } finally {
      setSatWaitlistSending(false);
    }
  };

  const handleNewsletterSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = newsletterEmail.trim();
    if (!value) {
      toast.error('Escribe tu correo para suscribirte.');
      return;
    }
    if (!EMAIL_RE.test(value)) {
      toast.error('Ese correo no parece válido.');
      return;
    }
    setNewsletterSending(true);
    try {
      await subscribeNewsletter(value);
      setNewsletterDone(true);
      setNewsletterEmail('');
      toast.success('Listo, ya estás suscrito.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No pudimos suscribirte. Intenta de nuevo.');
    } finally {
      setNewsletterSending(false);
    }
  };

  return (
    <div className="bg-cream-200 text-ink-900">
      <section className="container-app min-h-[760px] border-b border-ink-900/10 py-10 sm:py-12 lg:min-h-[860px] lg:py-14">
        <div className={`${mono} flex justify-between gap-6 border-b border-ink-900/10 pb-7`}>
          <span>— Tres libros · Vol. I-III · 2018-2024</span>
          <span>Envío a todo México y LATAM</span>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.48fr_0.52fr] lg:items-start">
          <div className="lg:pt-7">
            <h1 className="font-serif text-[clamp(84px,9.9vw,142px)] font-normal leading-[0.83] tracking-[-0.075em]">
              Tres
              <br />
              libros.
              <br />
              Un
              <br />
              mismo
              <br />
              <em className="italic tracking-[-0.075em]">estratega.</em>
            </h1>

            <p className="mt-8 max-w-[430px] text-[15px] leading-[1.75] text-ink-900/62">
              Más de 50,000 lectores en México, Colombia, Perú y España. Los libros de Diego no son manuales de impuestos: son herramientas de decisión para empresarios que prefieren leer antes de pagar.
            </p>

            <div className="mt-8 grid w-full max-w-[445px] grid-cols-3 border border-ink-900/10">
              {[
                ['03', 'Libros', 'publicados'],
                ['50K+', 'Lectores', 'en LATAM'],
                ['04', 'Países', 'distribución'],
              ].map(([value, label, detail]) => (
                <div key={label} className="min-h-[78px] border-r border-ink-900/10 px-5 py-4 last:border-r-0">
                  <p className="font-serif text-[31px] leading-none tracking-[-0.04em]">{value}</p>
                  <p className="mt-2 font-mono text-[8px] uppercase leading-[1.35] tracking-[0.24em] text-ink-900/40">
                    {label}
                    <br />
                    {detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pt-[170px]">
            <BookStack />
          </div>
        </div>
      </section>

      <section id="biblioteca" className="container-app border-b border-ink-900/10 py-20 lg:py-28">
        <div className={`${mono} grid gap-4 border-b border-ink-900/10 pb-7 md:grid-cols-3`}>
          <span />
          <span>— Libro 01 / Vol. I</span>
          <span className="md:text-right">Publicado · Marzo 2018</span>
        </div>

        <div className="grid gap-14 pt-16 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:gap-24">
          <div className="lg:pt-16">
            <BookCover3D src={bookClaves} alt="7 Claves para cobrar a tu empresa" />
          </div>

          <div>
            <h2 className="max-w-[560px] font-serif text-[clamp(60px,6.7vw,98px)] leading-[0.9] tracking-[-0.07em]">
              7 Claves para
              <br />
              <em className="italic">cobrar</em> a tu
              <br />
              empresa.
            </h2>
            <p className="mt-8 max-w-[560px] text-[15px] leading-[1.8] text-ink-900/64">
              El primer libro de Diego. Una guía práctica sobre cómo extraer valor de tu empresa sin destruir su flujo, sin pelearte con tu contador, y sin meterte en problemas con el SAT. Pensado para empresarios entre 5 y 100 colaboradores.
            </p>

            <div className="mt-7 border border-ink-900/10 px-8 py-7">
              <p className={mono}>— Índice resumido · 7 capítulos</p>
              <div className="mt-5 divide-y divide-ink-900/10 text-[14px] leading-none">
                {[
                  ['Sueldo', 'sí, pero ¿cuánto y cómo?'],
                  ['El dividendo', 'cuándo sí y cuándo no'],
                  ['Honorarios cruzados entre socios'],
                  ['Renta de bienes del socio a la empresa'],
                  ['Préstamos: la ruta más malentendida'],
                  ['Asimilados a salario, sin abusar'],
                  ['El plan anual de retiros del socio'],
                ].map(([chapter, detail]) => (
                  <div key={chapter} className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]">
                    <span className="font-serif italic">{chapter}</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ['"Me ahorré tres reuniones con mi contador y una buena cantidad de dinero el primer trimestre."', 'Patricia Ortega · CEO Operadora Bajío'],
                ['"Por fin entendí qué firmo cada año fiscal."', 'Andrés Cuevas · Director financiero'],
              ].map(([quote, author]) => (
                <figure key={author} className="min-h-[150px] border border-ink-900/10 p-6">
                  <blockquote className="font-serif text-[18px] leading-[1.35] text-ink-900/78">{quote}</blockquote>
                  <figcaption className={`${mono} mt-6`}>— {author}</figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-5 border-t border-ink-900/10 pt-8 sm:flex-row sm:items-end">
              <div className="min-w-[130px]">
                <p className={mono}>Precio</p>
                <p className="mt-1 font-serif text-[44px] italic leading-none">$497</p>
                <p className="mt-1 text-[11px] tracking-[0.22em] text-ink-900/38">MXN · Envío incluido</p>
              </div>
              <ArrowButton to="/libros/7-claves-cobrar-empresa/checkout">Comprar libro</ArrowButton>
            </div>

            <div className={`${mono} mt-8 grid gap-3 border-t border-ink-900/10 pt-7 sm:grid-cols-2`}>
              <span>★ 288 páginas</span>
              <span>★ Pasta blanda</span>
              <span>★ Impreso en México</span>
              <span>★ ISBN 978-607-XX-XXXX</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app border-b border-ink-900/10 py-20 lg:py-28">
        <div className={`${mono} grid gap-4 border-b border-ink-900/10 pb-7 md:grid-cols-3`}>
          <span>— Libro 02 / Vol. II</span>
          <span>Publicado · Septiembre 2021</span>
          <span />
        </div>

        <div className="grid gap-14 pt-14 lg:grid-cols-[0.96fr_1fr] lg:items-center lg:gap-24">
          <div>
            <div className="inline-flex bg-ink-900 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.28em] text-white">
              ★ Agotado · Reimpresión 2026
            </div>
            <h2 className="mt-8 max-w-[560px] font-serif text-[clamp(56px,6.7vw,96px)] leading-[0.9] tracking-[-0.07em]">
              Los 7 secretos
              <br />
              que el <em className="italic">SAT</em>
              <br />
              no quiere que
              <br />
              sepas.
            </h2>
            <p className="mt-8 max-w-[560px] text-[15px] leading-[1.8] text-ink-900/64">
              El libro más vendido de Diego, y el que más controversia ha generado. Una lectura inteligente sobre el funcionamiento real de la autoridad fiscal mexicana, sus puntos ciegos y las herramientas que la propia ley te entrega. Tercera edición agotada en marzo 2026.
            </p>

            <div className="mt-8 max-w-[590px] bg-white/55 px-8 py-7">
              <p className={mono}>— Índice resumido · 7 capítulos</p>
              <div className="mt-5 divide-y divide-ink-900/10 text-[14px] leading-none">
                {[
                  ['El algoritmo', 'del SAT no es secreto, solo opaco'],
                  ['Lo que el Buzón Tributario', 'no es'],
                  ['Acuerdos conclusivos: tu carta oculta'],
                  ['Devoluciones automáticas: el secreto del PAE'],
                  ['El catálogo invisible de las "operaciones simuladas"'],
                  ['Cuándo conviene', 'auto-corregirte'],
                  ['Defensa fiscal sin abogado de litigio'],
                ].map(([chapter, detail]) => (
                  <div key={chapter} className="grid gap-2 py-3 sm:grid-cols-[210px_1fr]">
                    <span className="font-serif italic">{chapter}</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-7 max-w-[590px] border border-ink-900 px-8 py-7">
              <h3 className="font-serif text-[26px]">
                Lista de <em className="italic">espera</em> · Reimpresión 2026
              </h3>
              <p className="mt-3 max-w-[480px] text-[13px] leading-relaxed text-ink-900/62">
                Avísame cuando vuelva a estar disponible.
              </p>
              {satWaitlistDone ? (
                <p className="mt-5 border border-ink-900/15 bg-white px-5 py-4 text-[13px] text-ink-700">
                  ¡Listo! Te avisaremos por correo en cuanto esté disponible.
                </p>
              ) : (
                <form onSubmit={handleSatWaitlistSubmit} className="mt-5 flex border border-ink-900/15 bg-white">
                  <label className="sr-only" htmlFor="sat-waitlist-email">Correo electrónico</label>
                  <input
                    id="sat-waitlist-email"
                    type="email"
                    placeholder="tu@correo.com"
                    value={satWaitlistEmail}
                    onChange={(e) => setSatWaitlistEmail(e.target.value)}
                    disabled={satWaitlistSending}
                    className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm outline-none disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={satWaitlistSending}
                    className="bg-ink-900 px-6 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-ink-900/85 disabled:opacity-60"
                  >
                    {satWaitlistSending ? 'Enviando…' : 'Avisarme →'}
                  </button>
                </form>
              )}
            </div>

            <div className={`${mono} mt-8 grid max-w-[590px] gap-3 border-t border-ink-900/10 pt-7 sm:grid-cols-2`}>
              <span>★ 328 páginas</span>
              <span>★ Pasta dura</span>
              <span>★ 3 ediciones</span>
              <span>★ 24,000 ejemplares vendidos</span>
            </div>
          </div>

          <div className="lg:pt-20">
            <BookCover3D src={bookSat} alt="Los 7 secretos que el SAT no quiere que conozcas" />
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-white lg:py-28">
        <div className="container-app grid gap-16 lg:grid-cols-[0.96fr_1fr] lg:items-center lg:gap-24">
          <div className="lg:pt-16">
            <BookCover3D src={bookFiscalista} alt="7 Secretos de un fiscalista" />
          </div>

          <div>
            <div className="grid gap-4 border-b border-white/10 pb-7 font-mono text-[10px] uppercase tracking-[0.34em] text-white/38 md:grid-cols-2">
              <span>— Libro 03 / Vol. III</span>
              <span className="md:text-right">Publicado · Octubre 2024</span>
            </div>

            <h2 className="mt-8 max-w-[590px] font-serif text-[clamp(58px,6.7vw,98px)] leading-[0.9] tracking-[-0.07em]">
              7 Secretos
              <br />
              de un <em className="italic">fiscalista.</em>
            </h2>
            <p className="mt-8 max-w-[590px] text-[15px] leading-[1.8] text-white/62">
              El libro más reciente y posiblemente el más útil. Diego comparte la mentalidad detrás de 25 años de práctica: cómo piensa, cómo decide y cómo construye estrategia un fiscalista mexicano que asesora a empresas medianas y grandes. Premio Mejor Libro de Negocios LATAM 2025.
            </p>

            <div className="mt-8 border border-white/12 bg-white/[0.03] px-8 py-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/38">— Índice resumido · 7 capítulos</p>
              <div className="mt-5 divide-y divide-white/10 text-[14px] leading-none">
                {[
                  ['La arquitectura', 'antes que el truco'],
                  ['Por qué un cliente no es un caso'],
                  ['El método de los', 'tres folders'],
                  ['La pregunta que destraba toda asesoría'],
                  ['Cómo cobrar como estratega y no como contador'],
                  ['El año fiscal en cinco bloques'],
                  ['Construir un despacho que no dependa de ti'],
                ].map(([chapter, detail]) => (
                  <div key={chapter} className="grid gap-2 py-3 sm:grid-cols-[190px_1fr]">
                    <span className="font-serif italic text-white">{chapter}</span>
                    <span className="text-white/76">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {[
                ['"El libro que me hubiera ahorrado diez años de errores en mi despacho."', 'Luis Hernández · Socio fundador, HN Asociados'],
                ['"No es un manual: es una filosofía aplicada."', 'María de los Ángeles Soto · CPA'],
              ].map(([quote, author]) => (
                <figure key={author} className="min-h-[150px] border border-white/12 bg-white/[0.03] p-6">
                  <blockquote className="font-serif text-[18px] leading-[1.35] text-white/82">{quote}</blockquote>
                  <figcaption className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/38">— {author}</figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-9 flex flex-col gap-5 border-t border-white/10 pt-8 sm:flex-row sm:items-end">
              <div className="min-w-[130px]">
                <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/38">Precio</p>
                <p className="mt-1 font-serif text-[44px] italic leading-none">$497</p>
                <p className="mt-1 text-[11px] tracking-[0.22em] text-white/36">MXN · Envío incluido</p>
              </div>
              <ArrowButton to="/libros/7-secretos-fiscalista/checkout" dark>Comprar libro</ArrowButton>
            </div>

            <div className="mt-8 grid gap-3 border-t border-white/10 pt-7 font-mono text-[10px] uppercase tracking-[0.34em] text-white/38 sm:grid-cols-2">
              <span>★ 340 páginas</span>
              <span>★ Pasta dura · Tapa de lino</span>
              <span>★ Premio LATAM 2025</span>
              <span>★ Edición limitada firmada disponible</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink-900 py-20 text-white lg:py-28">
        <div className="container-app grid gap-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-24">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-white/38">— Oferta especial · Bundle completo · 04</p>
            <h2 className="mt-8 max-w-[430px] font-serif text-[clamp(64px,7.2vw,104px)] leading-[0.88] tracking-[-0.07em]">
              Los <em className="italic">tres</em>
              <br />
              juntos.
            </h2>
            <p className="mt-8 max-w-[520px] text-[15px] leading-[1.8] text-white/62">
              Edición especial con caja de lino impresa, dos libros y dedicatoria firmada por Diego a quien tú elijas.
            </p>

            <div className="mt-9 max-w-[560px] border border-white/12 bg-white/[0.03] p-8">
              <div className="divide-y divide-white/10 text-[15px] text-white/64">
                {[
                  ['7 Claves para cobrar a tu empresa', '$497'],
                  ['7 Secretos de un fiscalista', '$497'],
                  ['Suma individual', '$994'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-5 py-4 first:pt-0">
                    <span>{label}</span>
                    <span className="font-serif text-white/78">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-end justify-between gap-5 border-t border-white/25 pt-7">
                <p className="font-serif text-[32px] leading-none text-white/72">Bundle con caja firmada</p>
                <p className="font-serif text-[34px] italic leading-none text-[#b6894f]">$ 750</p>
              </div>

              <p className="mt-5 border-t border-white/10 pt-5 text-[12px] leading-[1.6] text-white/50">
                Incluye 2 libros impresos. "Los 7 secretos que el SAT no quiere que conozcas" está agotado — al comprar el bundle te anotamos en la lista de espera de su reimpresión 2026, sin costo adicional, y te lo enviamos en cuanto esté disponible.
              </p>
            </div>

            <div className="mt-8">
              <ArrowButton to="/libros/bundle-tres-libros/checkout" dark>Comprar bundle</ArrowButton>
            </div>
          </div>

          <div className="lg:pt-8">
            <BookStack dimSat />
          </div>
        </div>
      </section>

      <section className="container-app border-b border-ink-900/10 py-20 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:gap-24">
          <div>
            <p className={mono}>05 / Sobre el autor</p>
            <img
              src={diegoAuthor}
              alt="Diego Díaz, autor de los libros"
              className={`mt-12 aspect-[0.75] w-full max-w-[540px] border ${border} object-cover object-center`}
            />
          </div>

          <div>
            <div className="flex justify-end">
              <Link to="/acerca" className="text-[10px] font-bold uppercase tracking-[0.28em] underline underline-offset-4">
                Bio completa / Diego →
              </Link>
            </div>

            <p className={`${mono} mt-20`}>— El estratega detrás de los tres libros</p>
            <blockquote className="mt-7 max-w-[720px] font-serif text-[clamp(42px,5.4vw,74px)] leading-[1.02] tracking-[-0.06em]">
              "Escribo para que <em className="italic">menos empresarios</em> tengan que llamar a un fiscalista de <em className="italic">emergencia.</em>"
            </blockquote>
            <p className="mt-9 max-w-[590px] text-[15px] leading-[1.8] text-ink-900/62">
              Diego Díaz es contador público y especialista fiscal mexicano. Fundador y director de Díaz Lara Consultores. En 25 años de práctica ha asesorado a más de 1,800 empresas mexicanas y formado a +10,000 directivos en seminarios y eventos presenciales. Sus libros se leen en universidades de negocios de México, Colombia y Perú.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/acerca"
                className="inline-flex min-h-12 items-center justify-center border border-ink-900 px-7 text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-200 hover:bg-ink-900 hover:text-white"
              >
                Trayectoria completa →
              </Link>
              <Link
                to="/eventos"
                className="inline-flex min-h-12 items-center justify-center border border-ink-900 px-7 text-[10px] font-bold uppercase tracking-[0.28em] transition-colors duration-200 hover:bg-ink-900 hover:text-white"
              >
                Próximo evento →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-20 text-center lg:py-28">
        <p className={mono}>06 / Lectores</p>
        <h2 className="mx-auto mt-7 max-w-[720px] font-serif text-[clamp(48px,6vw,82px)] leading-[0.98] tracking-[-0.07em]">
          ¿Te gustó algo de lo
          <br />
          que <em className="italic">escribo?</em>
        </h2>
        <p className="mx-auto mt-7 max-w-[610px] text-[15px] leading-[1.75] text-ink-900/60">
          Cada domingo a las 7am mando una carta de tres minutos con un análisis nuevo, una estrategia y una recomendación de lectura. La reciben +38,000 empresarios. Sin spam, cancelación con un click.
        </p>
        {newsletterDone ? (
          <p className="mx-auto mt-9 max-w-[560px] border border-ink-900/15 bg-white/40 px-6 py-4 text-[13px] text-ink-700">
            ¡Gracias! Ya estás suscrito a la carta del domingo.
          </p>
        ) : (
          <form onSubmit={handleNewsletterSubmit} className="mx-auto mt-9 flex max-w-[560px] border border-ink-900 bg-white/30">
            <label className="sr-only" htmlFor="books-email">Correo electrónico</label>
            <input
              id="books-email"
              type="email"
              placeholder="tu@correo.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              disabled={newsletterSending}
              className="min-w-0 flex-1 bg-transparent px-6 py-4 text-sm outline-none placeholder:text-ink-900/42 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={newsletterSending}
              className="bg-ink-900 px-7 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-colors hover:bg-ink-900/85 disabled:opacity-60"
            >
              {newsletterSending ? 'Enviando…' : 'Suscribirme →'}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
