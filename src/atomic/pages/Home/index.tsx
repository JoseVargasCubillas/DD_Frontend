import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import HeroSection from '@organisms/HeroSection';
import { useEvents } from '@hooks/useEvents';
import Spinner from '@atoms/Spinner';

// Assets
import imgEstrategia    from '../../../../assets/002_home_Estrategia_DD.png';
import imgFormacion     from '../../../../assets/003_home_Formacion_DD.png';
import imgRevision      from '../../../../assets/004_home_Revision_DD.png';
import imgCreativos     from '../../../../assets/005_home_creativos_DD.png';
import imgRockefeller   from '../../../../assets/006_home_rockefeller_DD.png';
import imgBio           from '../../../../assets/007_home_bios_DD.png';
import imgGuia          from '../../../../assets/010_home_guía_DD.png';
import logoAzteca       from '../../../../assets/008_home_logo1_DD.png';
import logoLider        from '../../../../assets/009_home_logo2_DD.png';
import logoMilenio      from '../../../../assets/010_home_logo3_DD.png';
import logoExcelsior    from '../../../../assets/010_home_logo4_DD.png';
import logoTeleformula  from '../../../../assets/010_home_logo5_DD.png';
import logoSemanario    from '../../../../assets/010_home_logo6_DD.png';
import videoSEF         from '../../../../assets/VIDEO SEF vertical web.mp4';

/* ─────────────────────────────── Countdown ──── */
function useCountdown(targetDate: Date) {
  const calc = () => {
    const diff = targetDate.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000)  / 60000),
      seconds: Math.floor((diff % 60000)    / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return time;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[clamp(36px,5vw,56px)] font-black text-white leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[9px] uppercase tracking-[0.3em] text-ink-300 mt-1">{label}</span>
    </div>
  );
}

/* ─────────────────────────────── Static events ─ */
const STATIC_EVENTS = [
  {
    id: 'cdmx',
    featured: true,
    image: imgEstrategia,
    date: '09 Jul',
    location: 'CDMX',
    type: 'Seminario',
    duration: '1 día',
    titleLine1: 'Estrategia Fiscal',
    titleLine2: 'CDMX',
    status: 'available',        // available | limited | sold-out
    slug: '/eventos',
  },
  {
    id: 'formacion',
    featured: false,
    image: imgFormacion,
    date: '29-30 May',
    location: '',
    type: 'Cumbre',
    duration: '2 días',
    titleLine1: 'Formacion de',
    titleLine2: 'Equipos',
    status: 'limited',
    slug: '/eventos',
  },
  {
    id: 'revision',
    featured: false,
    image: imgRevision,
    date: '4 Jun',
    location: '',
    type: 'Workshop',
    duration: '',
    titleLine1: 'Revisión',
    titleLine2: 'Estratégica',
    status: 'available',
    slug: '/eventos',
  },
  {
    id: 'creativos',
    featured: false,
    image: imgCreativos,
    date: '4, 5 Sep',
    location: '',
    type: 'Cumbre',
    duration: '2 días',
    titleLine1: 'Equipos',
    titleLine2: 'Creativos',
    status: 'available',
    slug: '/eventos',
  },
  {
    id: 'rockefeller',
    featured: false,
    image: imgRockefeller,
    date: '20, 25 Nov',
    location: '',
    type: 'Cumbre',
    duration: '3 días',
    titleLine1: 'Estrategia',
    titleLine2: 'Rockefeller',
    status: 'available',
    slug: '/eventos',
  },
];

const MEDIA_LOGOS = [
  { src: logoAzteca,      alt: 'Azteca' },
  { src: logoLider,       alt: 'Líder' },
  { src: logoMilenio,     alt: 'Milenio' },
  { src: logoExcelsior,   alt: 'Excélsior' },
  { src: logoTeleformula, alt: 'Telefórmula' },
  { src: logoSemanario,   alt: 'Semanario' },
];

const SERVICES = [
  {
    id: 'academia',
    label: 'Suscripción anual',
    title: 'Academia',
    desc: '+200 horas de cursos fiscales especializados, sesiones y masterclasses mensuales, con contenido nuevo cada semana.',
    cta: 'Capacítate',
    link: '/academia',
    dark: false,
  },
  {
    id: 'libros',
    label: 'Compra única',
    title: 'Libros',
    desc: 'Tres obras sobre estrategia fiscal mexicana. Más de 50,000 lectores en LATAM. Envío a todo el país.',
    cta: 'Ver biblioteca',
    link: '/recursos',
    dark: false,
  },
  {
    id: 'diazlara',
    label: 'Más servicios',
    title: 'Díaz Lara',
    desc: '¿Tu empresa necesita asesoría fiscal corporativa? Conoce la firma que Diego fundó: certificada GPTW® y Cruz de Malta',
    cta: 'Visitar diazlara.mx',
    link: '/contacto',
    dark: true,
  },
];

const TESTIMONIALS = [
  {
    quote: '"Sus libros me abrieron los ojos. Ahora entiendo cómo funciona realmente el SAT… y duermo mejor por las noches."',
    author: 'Roberto Mendoza',
    role: 'Director General — Metal Industries',
  },
  {
    quote: '"Pensé que ya lo sabía todo sobre deducibilidad. Diego me demostró que estaba dejando el 30% sobre la mesa cada año."',
    author: 'Gabriela Torres',
    role: 'CEO — Grupo Alianza',
  },
];

/* ═══════════════════════════════════════════════ */
export default function Home() {
  const { data: eventsData, isLoading: isEventsLoading } = useEvents({ limit: 1, status: 'upcoming' });
  const nextEvent = eventsData?.data?.[0];

  // Fecha objetivo del próximo evento (09 Jul 2026)
  const eventTarget = nextEvent?.startDate
    ? new Date(nextEvent.startDate)
    : new Date('2026-07-09T09:00:00');
  const countdown = useCountdown(eventTarget);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true); }
  };

  const featured   = STATIC_EVENTS[0];
  const smallCards = STATIC_EVENTS.slice(1);

  return (
    <div>
      {/* ── 01 Hero ─────────────────────────────── */}
      <HeroSection />

      {/* ── 02 Próximo Evento (dark) ─────────────── */}
      <section className="bg-ink-900">
        <div className="container-app py-20">
          <div className="grid lg:grid-cols-[0.55fr_0.45fr] gap-12 xl:gap-20 items-center">

            {/* Video */}
            <div className="relative aspect-[9/16] max-w-xs mx-auto lg:mx-0 overflow-hidden bg-ink-800 cursor-pointer"
                 onClick={toggleVideo}>
              <video
                ref={videoRef}
                src={videoSEF}
                className="w-full h-full object-cover"
                playsInline
                loop
              />
              {/* Overlay */}
              {!playing && (
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  <p className="text-white text-[15px] font-light leading-snug max-w-[200px]">
                    Lo primero que te enseñamos es cómo
                  </p>
                  <p className="text-white text-[15px] font-light leading-snug">
                    cobrarle a tu empresa.
                  </p>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center bg-black/30">
                      <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event info */}
            <div className="space-y-7">
              <p className="section-label-inv">01 / Próximo evento</p>

              <div>
                <h2 className="text-[clamp(36px,5vw,52px)] font-normal text-white leading-tight">
                  Estrategia Fiscal
                </h2>
                <h2 className="text-[clamp(36px,5vw,52px)] font-serif italic text-white leading-tight">
                  Edición CDMX
                </h2>
              </div>

              <p className="text-[14px] text-ink-300 leading-relaxed max-w-sm">
                Un día intensivo para empresarios que quieren rediseñar su estrategia fiscal antes del cierre del año. Solo 80 cupos por edición.
              </p>

              {/* Meta */}
              <div className="grid grid-cols-3 gap-4 border-t border-ink-700 pt-6">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ink-400 mb-1">Fecha</p>
                  <p className="text-white text-sm font-medium">09 Jul 2026</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ink-400 mb-1">Sede</p>
                  <p className="text-white text-sm font-medium">CDMX</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-ink-400 mb-1">Cupos</p>
                  <p className="text-white text-sm font-medium">
                    <span className="text-xl font-black">23</span>
                    <span className="text-ink-400"> /100</span>
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-end gap-6 border-t border-ink-700 pt-6">
                <CountdownUnit value={countdown.days}    label="días"    />
                <CountdownUnit value={countdown.hours}   label="horas"   />
                <CountdownUnit value={countdown.minutes} label="min"     />
                <CountdownUnit value={countdown.seconds} label="seg"     />
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link to="/eventos" className="btn-primary-inv">
                  Reservar mi lugar →
                </Link>
                <span className="text-[10px] text-ink-400 uppercase tracking-[0.2em]">
                  Cierra el 14-Jul
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 03 Calendario ───────────────────────── */}
      <section className="bg-cream-200 py-20">
        <div className="container-app">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-label mb-3">02 / Calendario</p>
              <h2 className="section-title">
                Todos los <strong className="font-black">escenarios.</strong><br />
                Con toda la estrategia.
              </h2>
            </div>
            <Link to="/eventos" className="text-[11px] uppercase tracking-[0.3em] text-ink-400 hover:text-ink-900 transition-colors">
              Ver todos →
            </Link>
          </div>

          {/* Grid asimétrico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ gridTemplateRows: 'auto' }}>

            {/* Tarjeta grande */}
            <Link
              to={featured.slug}
              className="group md:row-span-2 flex flex-col overflow-hidden border border-cream-400 hover:border-ink-400 transition-colors bg-white"
            >
              <div className="flex-1 overflow-hidden min-h-[260px] md:min-h-0">
                <img
                  src={featured.image}
                  alt={featured.titleLine1}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.25em] text-ink-400">
                  <span>{featured.date}</span>
                  {featured.location && <><span>·</span><span>{featured.location}</span></>}
                  <span>·</span>
                  <span>{featured.type}</span>
                  {featured.duration && <><span>·</span><span>{featured.duration}</span></>}
                </div>
                <div>
                  <p className="text-lg font-normal text-ink-900 leading-tight">{featured.titleLine1}</p>
                  <p className="text-lg font-serif italic text-ink-900 leading-tight">{featured.titleLine2}</p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className={featured.status === 'limited' ? 'badge-limited' : 'badge-avail'}>
                    {featured.status === 'limited' ? 'Cupos limitados' :
                     featured.status === 'sold-out' ? 'Agotado' : 'Cupos disponibles'}
                  </span>
                  <span className="w-8 h-8 border border-ink-900 flex items-center justify-center text-ink-900 text-sm group-hover:bg-ink-900 group-hover:text-white transition-colors">
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Tarjetas pequeñas */}
            {smallCards.map((ev) => (
              <Link
                key={ev.id}
                to={ev.slug}
                className="group flex flex-col overflow-hidden border border-cream-400 hover:border-ink-400 transition-colors bg-white"
              >
                <div className="overflow-hidden h-40">
                  <img
                    src={ev.image}
                    alt={ev.titleLine1}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.25em] text-ink-400">
                    <span>{ev.date}</span>
                    <span>·</span>
                    <span>{ev.type}</span>
                    {ev.duration && <><span>·</span><span>{ev.duration}</span></>}
                  </div>
                  <div>
                    <p className="text-sm font-normal text-ink-900 leading-tight">{ev.titleLine1}</p>
                    <p className="text-sm font-serif italic text-ink-900 leading-tight">{ev.titleLine2}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className={ev.status === 'limited' ? 'badge-limited' : 'badge-avail'}>
                      {ev.status === 'limited' ? 'Cupos limitados' :
                       ev.status === 'sold-out' ? 'Agotado' : 'Disponible'}
                    </span>
                    <span className="w-7 h-7 border border-ink-900 flex items-center justify-center text-ink-900 text-xs group-hover:bg-ink-900 group-hover:text-white transition-colors">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Bio Diego ────────────────────────── */}
      <section className="bg-cream-200 py-20 border-t border-cream-400">
        <div className="container-app">
          <div className="grid lg:grid-cols-[0.45fr_0.55fr] gap-12 xl:gap-20 items-start">

            {/* Foto */}
            <div className="overflow-hidden aspect-[3/4]">
              <img
                src={imgBio}
                alt="Diego Díaz"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Texto */}
            <div className="space-y-8 lg:pt-4">
              <p className="section-label">03 / Diego</p>

              <h2 className="text-[clamp(28px,3.5vw,44px)] font-normal leading-tight text-ink-900">
                El <strong className="font-black">experto</strong> detrás<br />
                de las decisiones
              </h2>

              <blockquote className="text-[clamp(20px,2.5vw,28px)] font-serif italic leading-snug text-ink-900 max-w-md border-l-0">
                "En el laberinto tributario, <em>Diego</em> diseña soluciones donde otros ven problemas"
              </blockquote>

              <p className="text-[13px] text-ink-500 leading-relaxed max-w-md">
                Licenciado en Contaduría y Finanzas, especializado en derecho corporativo y estrategia fiscal.
                En 2024 escribió historia con el primer acuerdo conclusivo en defensa de una agencia de viajes.
                Resolvió en 4 días hábiles el bloqueo de certificado de una empresa de +1,000 empleados.
              </p>

              {/* Stats */}
              <div className="flex items-end gap-8 pt-2">
                {[
                  { val: '25',   label: 'Años de\ntrayectoria' },
                  { val: '10k+', label: 'Empresarios\ncapacitados' },
                  { val: '03',   label: 'Libros\npublicados' },
                  { val: '18+',  label: 'Medios de\nprensa' },
                ].map(({ val, label }) => (
                  <div key={val} className="flex flex-col gap-1">
                    <span className="text-[clamp(28px,4vw,40px)] font-black text-ink-900 leading-none">{val}</span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-ink-400 whitespace-pre-line">{label}</span>
                  </div>
                ))}
              </div>

              <Link to="/acerca" className="btn-secondary">
                Leer la trayectoria completa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 05 Prensa / Logos ───────────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-14">
        <div className="container-app">
          <p className="section-label text-center mb-8">04 / Prensa — Como se ha visto en</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {MEDIA_LOGOS.map((logo) => (
              <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="h-7 md:h-8 object-contain opacity-70 hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Guía SAT (dark) ──────────────────── */}
      <section className="bg-ink-900 py-20">
        <div className="container-app">
          <div className="grid lg:grid-cols-[1fr_0.7fr] gap-16 items-center">

            <div className="space-y-7">
              <p className="section-label-inv">05 / Lectura recomendada</p>

              <h2 className="text-[clamp(32px,4.5vw,56px)] font-normal leading-tight text-white">
                Hoy te regalamos.<br />
                <em className="font-serif italic">La mejor guía para</em><br />
                <em className="font-serif italic">blindarte del SAT.</em>
              </h2>

              <p className="text-[13px] text-ink-300 leading-relaxed max-w-sm">
                Descarga gratuita. Recibe la guía en tu email en menos de un minuto.
                Sin spam, y cancelación con un click.
              </p>

              <form className="flex flex-col sm:flex-row gap-0 max-w-md" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="input-base flex-1"
                  aria-label="Correo electrónico"
                />
                <button type="submit" className="btn-primary-inv whitespace-nowrap">
                  Descargar
                </button>
              </form>

              <div className="flex items-center gap-6 text-[9px] uppercase tracking-[0.25em] text-ink-400 pt-2">
                <span>40 páginas</span>
                <span>·</span>
                <span>PDF</span>
                <span>·</span>
                <span>Versión 2026</span>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <img
                src={imgGuia}
                alt="Guía para blindarte del SAT"
                className="w-full max-w-[320px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 Ecosistema ───────────────────────── */}
      <section className="bg-cream-200 py-20 border-t border-cream-400">
        <div className="container-app">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="section-label mb-3">06 / Ecosistema</p>
              <h2 className="section-title">
                <strong className="font-black">Tres</strong> caminos.<br />
                Con dirección <em className="font-serif italic font-normal">estratégica.</em>
              </h2>
            </div>
            <Link to="/recursos" className="text-[11px] uppercase tracking-[0.3em] text-ink-400 hover:text-ink-900 transition-colors">
              Ver todo →
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-0 border border-cream-400 divide-y lg:divide-y-0 lg:divide-x divide-cream-400">
            {SERVICES.map((s) => (
              <div
                key={s.id}
                className={`p-8 flex flex-col gap-5 ${s.dark ? 'bg-ink-900' : 'bg-white'}`}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-[9px] uppercase tracking-[0.3em] ${s.dark ? 'text-ink-400' : 'text-ink-400'}`}>
                    {s.label}
                  </span>
                  <span className={`text-[9px] uppercase tracking-[0.2em] ${s.dark ? 'text-ink-600' : 'text-ink-200'}`}>
                    {s.id === 'academia' ? '1.' : s.id === 'libros' ? '2.' : '3.'}
                  </span>
                </div>

                <h3 className={`text-[clamp(22px,2.5vw,28px)] font-serif italic font-normal ${s.dark ? 'text-white' : 'text-ink-900'}`}>
                  {s.title}
                </h3>

                <p className={`text-[13px] leading-relaxed flex-1 ${s.dark ? 'text-ink-300' : 'text-ink-500'}`}>
                  {s.desc}
                </p>

                <Link
                  to={s.link}
                  className={`flex items-center justify-between text-[10px] uppercase tracking-[0.25em] pt-4 border-t group ${
                    s.dark ? 'border-ink-700 text-ink-300 hover:text-white' : 'border-cream-400 text-ink-500 hover:text-ink-900'
                  }`}
                >
                  <span>{s.cta}</span>
                  <span className={`w-7 h-7 border flex items-center justify-center group-hover:bg-ink-900 group-hover:text-white group-hover:border-ink-900 transition-colors ${
                    s.dark ? 'border-ink-600 text-ink-400' : 'border-cream-400 text-ink-500'
                  }`}>
                    →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 08 Testimonios ──────────────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-24">
        <div className="container-app">
          <div className="flex items-start justify-between mb-4">
            <p className="section-label">07 / Voces</p>
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink-400">
              0{testimonialIdx + 1} / 0{TESTIMONIALS.length} Testimonios
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-center py-12">
            <blockquote
              className="text-[clamp(22px,3.5vw,40px)] font-normal leading-tight text-ink-900 cursor-pointer"
              onClick={() => setTestimonialIdx((i) => (i + 1) % TESTIMONIALS.length)}
            >
              {TESTIMONIALS[testimonialIdx].quote.split('…').map((part, i, arr) =>
                i < arr.length - 1
                  ? <span key={i}>{part}<em className="font-serif italic">…</em></span>
                  : <span key={i}>{part}</span>
              )}
            </blockquote>

            <div className="mt-10 space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-900 font-semibold">
                {TESTIMONIALS[testimonialIdx].author}
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-ink-400">
                {TESTIMONIALS[testimonialIdx].role}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === testimonialIdx ? 'bg-ink-900' : 'bg-ink-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 09 Para empresas / CTA ──────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-20">
        <div className="container-app">
          <p className="section-label text-center mb-8">08 / Para empresas</p>

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-[clamp(28px,4vw,50px)] font-normal leading-tight text-ink-900">
              ¿Tu <strong className="font-black">empresa</strong> necesita<br />
              una <em className="font-serif italic font-normal">estrategia fiscal</em><br />
              de alto nivel?
            </h2>

            <p className="text-[13px] text-ink-500 leading-relaxed max-w-md mx-auto">
              Diego es fundador y director de Díaz Lara, su firma fiscal. Es facilitador
              de temas empresariales, fiscales y jurídicos.
            </p>

            <div className="flex items-center justify-center gap-6 py-2">
              {['Great Place to Work', 'Cruz de Malta', 'Latin American Quality Awards'].map((cert) => (
                <span key={cert} className="text-[8px] uppercase tracking-[0.25em] text-ink-400">{cert}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link to="/academia" className="btn-primary">
                Ir a la capacitación →
              </Link>
              <Link to="/contacto" className="btn-secondary">
                Ir a Díaz Lara
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
