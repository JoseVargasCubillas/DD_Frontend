import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import HeroSection from '@organisms/HeroSection';
import AnimateIn from '@atoms/AnimateIn';
import { useEvents } from '@hooks/useEvents';
import { useInView } from '@hooks/useInView';

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
function useCountdown(targetMs: number) {
  const calc = () => {
    const diff = targetMs - Date.now();
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
  }, [targetMs]);
  return time;
}

/* ─────────────────────────────── Counter ──── */
function useCountUp(target: number, enabled: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setCount(0); // reset so it replays next time
      return;
    }
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - p) ** 3; // ease-out cubic
      setCount(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [enabled, target]);
  return count;
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-start">
      <span className="text-[clamp(36px,5vw,56px)] font-bold text-white leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-[11px] uppercase tracking-[0.3em] text-ink-300 mt-1">{label}</span>
    </div>
  );
}

/* ─────────────────────────────── Book 3D tilt ── */
function BookTilt({ src, alt, imgClassName }: { src: string; alt: string; imgClassName: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef  = useRef(0);

  const applyTilt = useCallback((cx: number, cy: number) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = ((cx - rect.left) / rect.width  - 0.5) * 2;
      const y = ((cy - rect.top)  / rect.height - 0.5) * 2;
      const rotY =  x * 14;
      const rotX = -y * 10;
      el.style.transition = 'transform 80ms linear, filter 80ms linear';
      el.style.transform  = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      el.style.filter     = `drop-shadow(${-rotY * 0.8}px ${rotX * 0.8 + 14}px 24px rgba(0,0,0,0.5))`;
    });
  }, []);

  const resetTilt = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const el = wrapRef.current;
    if (!el) return;
    el.style.transition = 'transform 600ms cubic-bezier(.2,.8,.2,1), filter 600ms cubic-bezier(.2,.8,.2,1)';
    el.style.transform  = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.filter     = 'drop-shadow(0px 8px 24px rgba(0,0,0,0.3))';
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={wrapRef}
      className="cursor-pointer select-none"
      style={{ willChange: 'transform, filter', filter: 'drop-shadow(0px 8px 24px rgba(0,0,0,0.3))' }}
      onMouseMove={(e) => applyTilt(e.clientX, e.clientY)}
      onMouseLeave={resetTilt}
      onTouchMove={(e) => { const t = e.touches[0]; if (t) applyTilt(t.clientX, t.clientY); }}
      onTouchEnd={resetTilt}
    >
      <img src={src} alt={alt} className={imgClassName} />
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
    link: 'https://diazlara.mx/',
    dark: true,
  },
];

const TESTIMONIALS = [
  {
    author: 'Roberto Mendoza',
    role: 'Director General — Metal Industries',
    richQuote: (
      <>
        "Sus libros me <em className="font-serif italic">abrieron</em> los ojos.
        Ahora entiendo <strong className="font-bold">cómo funciona</strong> realmente
        el SAT… <em className="font-serif italic">y duermo mejor por las noches.</em>"
      </>
    ),
  },
  {
    author: 'Gabriela Torres',
    role: 'CEO — Grupo Alianza',
    richQuote: (
      <>
        "Pensé que ya lo sabía todo sobre <em className="font-serif italic">deducibilidad.</em>
        {' '}Diego me demostró que estaba dejando el{' '}
        <strong className="font-bold">30%</strong> sobre la mesa{' '}
        <em className="font-serif italic">cada año.</em>"
      </>
    ),
  },
];

/* ═══════════════════════════════════════════════ */
export default function Home() {
  const { data: eventsData } = useEvents({ limit: 1, status: 'upcoming' });
  const nextEvent = eventsData?.data?.[0];

  // Fecha objetivo del próximo evento (09 Jul 2026)
  const eventTargetMs = useMemo(
    () => nextEvent?.startDate
      ? new Date(nextEvent.startDate).getTime()
      : new Date('2026-07-09T09:00:00').getTime(),
    [nextEvent?.startDate],
  );
  const countdown = useCountdown(eventTargetMs);

  // Demo 07 — counter animation for bio stats
  const { ref: statsRef, inView: statsInView } = useInView(0.3);
  const c25 = useCountUp(25, statsInView);
  const c10 = useCountUp(10, statsInView);
  const c3  = useCountUp(3,  statsInView);
  const c18 = useCountUp(18, statsInView);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInViewRef = useRef(false);
  const videoHasGestureRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialFading, setTestimonialFading] = useState(false);

  const changeTestimonial = useCallback((next: number) => {
    setTestimonialFading(true);
    setTimeout(() => {
      setTestimonialIdx(next);
      setTestimonialFading(false);
    }, 200);
  }, []);

  const playVideoWithSound = useCallback((fallbackToMuted = false) => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.defaultMuted = false;
    video.volume = 1;

    video.play().then(() => setPlaying(true)).catch(() => {
      if (!fallbackToMuted) {
        setPlaying(!video.paused);
        return;
      }

      video.muted = true;
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    });
  }, []);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    videoHasGestureRef.current = true;

    if (playing && !video.paused && !video.muted) {
      video.pause();
      video.muted = true;
      setPlaying(false);
      return;
    }

    playVideoWithSound(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        const isVideoInView = entry.isIntersecting && entry.intersectionRatio >= 0.55;
        videoInViewRef.current = isVideoInView;

        if (isVideoInView) {
          playVideoWithSound(!videoHasGestureRef.current);
        } else {
          video.pause();
          video.muted = true;
          setPlaying(false);
        }
      },
      { threshold: [0, 0.55, 0.8] },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [playVideoWithSound]);

  useEffect(() => {
    const unlockVideoAudio = (event: Event) => {
      const videoBox = videoRef.current?.parentElement;
      const target = event.target;

      videoHasGestureRef.current = true;
      if (target && videoBox?.contains(target as Node)) return;

      if (videoInViewRef.current) playVideoWithSound(false);
    };

    window.addEventListener('pointerdown', unlockVideoAudio, { passive: true });
    window.addEventListener('touchstart', unlockVideoAudio, { passive: true });
    window.addEventListener('wheel', unlockVideoAudio, { passive: true });
    window.addEventListener('keydown', unlockVideoAudio);

    return () => {
      window.removeEventListener('pointerdown', unlockVideoAudio);
      window.removeEventListener('touchstart', unlockVideoAudio);
      window.removeEventListener('wheel', unlockVideoAudio);
      window.removeEventListener('keydown', unlockVideoAudio);
    };
  }, [playVideoWithSound]);

  const featured   = STATIC_EVENTS[0];
  const smallCards = STATIC_EVENTS.slice(1);

  return (
    <div>
      {/* ── 01 Hero ─────────────────────────────── */}
      <HeroSection />

      {/* ── 02 Próximo Evento (dark) ─────────────── */}
      <section className="bg-ink-900">
        <div className="container-app py-16 md:py-20">
          <div className="grid lg:grid-cols-[0.55fr_0.45fr] gap-10 lg:gap-12 xl:gap-20 items-center">

            {/* Video */}
            <AnimateIn variant="slide-right" className="flex justify-center">
            <div className="relative aspect-[4/5] w-full max-w-[430px] overflow-hidden bg-black cursor-pointer"
                 onClick={toggleVideo}>
              <video
                ref={videoRef}
                src={videoSEF}
                className="w-full h-full object-contain"
                autoPlay
                muted
                playsInline
                loop
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
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
            </AnimateIn>

            {/* Event info */}
            <AnimateIn variant="slide-left" delay={150}>
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
              <div className="grid sm:grid-cols-3 border border-ink-700 divide-y sm:divide-y-0 sm:divide-x divide-ink-700">
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-1">Fecha</p>
                  <p className="text-white text-sm">09 Jul 2026</p>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-1">Sede</p>
                  <p className="text-white text-sm">CDMX</p>
                </div>
                <div className="p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-ink-500 mb-1">Cupos</p>
                  <p className="text-white text-sm">
                    <span className="text-xl font-normal">23</span>
                    <span className="text-ink-400"> /100</span>
                  </p>
                </div>
              </div>

              {/* Countdown */}
              <div className="grid grid-cols-2 sm:flex sm:items-end gap-6 border-t border-ink-700 pt-6">
                <CountdownUnit value={countdown.days}    label="días"    />
                <CountdownUnit value={countdown.hours}   label="horas"   />
                <CountdownUnit value={countdown.minutes} label="min"     />
                <CountdownUnit value={countdown.seconds} label="seg"     />
              </div>

              <div className="flex flex-wrap items-center gap-5 pt-2">
                <Link to="/eventos" className="btn-primary-inv">
                  Reservar mi lugar →
                </Link>
                <span className="text-[11px] text-ink-400 uppercase tracking-[0.2em]">
                  Cierra el 14-Jul
                </span>
              </div>
            </div>
            </AnimateIn>
        </div>
        </div>
      </section>

      {/* ── 03 Calendario ───────────────────────── */}
      <section className="bg-cream-200 py-16 md:py-20">
        <div className="container-app">
          <AnimateIn className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
            <div>
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400 leading-none">02 /</p>
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400">Calendario</p>
              </div>
              <h2 className="section-title">
                Todos los <strong className="font-bold">escenarios.</strong><br />
                Con toda la estrategia.
              </h2>
            </div>
            <Link to="/eventos" className="text-[11px] uppercase tracking-[0.3em] text-ink-400 hover:text-ink-900 transition-colors underline decoration-1 underline-offset-4">
              Ver todos →
            </Link>
          </AnimateIn>

          {/* Grid asimétrico */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ gridTemplateRows: 'auto' }}>

            {/* Tarjeta grande */}
            <AnimateIn variant="fade-up" delay={0} className="md:row-span-2 flex flex-col">
            <Link
              to={featured.slug}
              className="group flex-1 flex flex-col overflow-hidden border border-cream-400 hover:border-ink-400 hover:-translate-y-1.5 transition-[transform,border-color] duration-[400ms] bg-white"
            >
              <div className="flex-1 overflow-hidden min-h-[260px] md:min-h-0">
                <img
                  src={featured.image}
                  alt={featured.titleLine1}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-ink-400">
                  <span>{featured.date}</span>
                  {featured.location && <><span>·</span><span>{featured.location}</span></>}
                  <span>·</span>
                  <span>{featured.type}</span>
                  {featured.duration && <><span>·</span><span>{featured.duration}</span></>}
                </div>
                <div>
                  <p className="text-[22px] font-normal text-ink-900 leading-tight">{featured.titleLine1}</p>
                  <p className="text-[22px] font-serif italic text-ink-900 leading-tight">{featured.titleLine2}</p>
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
            </AnimateIn>

            {/* Tarjetas pequeñas */}
            {smallCards.map((ev, i) => (
              <AnimateIn key={ev.id} variant="fade-up" delay={100 + i * 80}>
              <Link
                to={ev.slug}
                className="group flex flex-col overflow-hidden border border-cream-400 hover:border-ink-400 hover:-translate-y-1.5 transition-[transform,border-color] duration-[400ms] bg-white h-full"
              >
                <div className="overflow-hidden h-40">
                  <img
                    src={ev.image}
                    alt={ev.titleLine1}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-ink-400">
                    <span>{ev.date}</span>
                    <span>·</span>
                    <span>{ev.type}</span>
                    {ev.duration && <><span>·</span><span>{ev.duration}</span></>}
                  </div>
                  <div>
                    <p className="text-[17px] font-normal text-ink-900 leading-tight">{ev.titleLine1}</p>
                    <p className="text-[17px] font-serif italic text-ink-900 leading-tight">{ev.titleLine2}</p>
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
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 04 Bio Diego ────────────────────────── */}
      <section className="bg-cream-200 py-16 md:py-20 border-t border-cream-400">
        <div className="container-app">

          {/* Cabecera full-width */}
          <AnimateIn className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12">
            <div>
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400 leading-none">03 /</p>
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400">Diego</p>
              </div>
              <h2 className="section-title">
                El <strong className="font-bold">experto</strong> detrás<br />
                de las decisiones
              </h2>
            </div>
            <Link to="/acerca" className="text-[11px] uppercase tracking-[0.3em] text-ink-400 hover:text-ink-900 transition-colors underline decoration-1 underline-offset-4">
              Bio completa →
            </Link>
          </AnimateIn>

          {/* Grid: foto | contenido */}
          <div className="grid lg:grid-cols-[0.45fr_0.55fr] gap-12 xl:gap-20 items-start">

            {/* Foto */}
            <AnimateIn variant="slide-right" className="overflow-hidden aspect-[3/4]">
              <img
                src={imgBio}
                alt="Diego Díaz"
                className="w-full h-full object-cover object-top"
              />
            </AnimateIn>

            {/* Texto */}
            <AnimateIn variant="slide-left" delay={120}>
            <div className="space-y-8 lg:pt-4">

              <blockquote className="text-[clamp(24px,3vw,40px)] font-normal leading-snug text-ink-900">
                "En el laberinto tributario,{' '}
                <em className="font-serif italic">Diego diseña</em>
                {' '}soluciones donde otros ven problemas"
              </blockquote>

              <p className="text-[13px] text-ink-500 leading-relaxed max-w-md">
                Licenciado en Contaduría y Finanzas, especializado en derecho corporativo y estrategia fiscal.
                En 2024 escribió historia con el primer acuerdo conclusivo en defensa de una agencia de viajes.
                Resolvió en 4 días hábiles el bloqueo de certificado de una empresa de +1,000 empleados.
              </p>

              {/* Stats — Demo 07 counter animation */}
              <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 border border-cream-400">
                {[
                  { display: String(c25),                  label: 'Años de\ntrayectoria' },
                  { display: `${c10}k+`,                   label: 'Empresarios\ncapacitados' },
                  { display: String(c3).padStart(2, '0'),  label: 'Libros\npublicados' },
                  { display: `${c18}+`,                    label: 'Medios\nde prensa' },
                ].map(({ display, label }, idx) => (
                  <div
                    key={label}
                    className={`flex flex-col gap-1 p-4 border-cream-400 ${
                      idx % 2 === 0 ? 'border-r' : ''
                    } ${
                      idx < 2 ? 'border-b sm:border-b-0' : ''
                    } sm:border-r ${idx === 3 ? 'sm:border-r-0' : ''}`}
                  >
                    <span className="text-[clamp(26px,3.5vw,44px)] font-normal text-ink-900 leading-none tabular-nums">{display}</span>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-ink-400 whitespace-pre-line mt-2 leading-snug">{label}</span>
                  </div>
                ))}
              </div>

              <Link to="/acerca" className="btn-secondary">
                Leer la trayectoria completa
              </Link>
            </div>
          </AnimateIn>
        </div>
        </div>
      </section>

      {/* ── 05 Prensa / Logos ───────────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-12 overflow-hidden">
        <AnimateIn className="container-app mb-8">
          <p className="section-label text-center">04 / Prensa — Como se ha visto en</p>
        </AnimateIn>
        <div className="relative overflow-hidden max-w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-cream-200 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-cream-200 to-transparent z-10" />
          <div
            className="flex items-center gap-16 md:gap-20 w-max will-change-transform"
            style={{ animation: 'marquee 22s linear infinite' }}
          >
            {[...MEDIA_LOGOS, ...MEDIA_LOGOS].map((logo, i) => (
              <img
                key={i}
                src={logo.src}
                alt={logo.alt}
                className="h-7 md:h-8 object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 06 Guía SAT (dark) ──────────────────── */}
      <section className="bg-ink-900 overflow-hidden">
        <div className="container-app relative min-h-[720px] pt-8 pb-20 lg:min-h-[805px] lg:pt-2 lg:pb-0">
          <div className="relative z-10 max-w-[820px] pt-10 lg:pt-[68px]">

            <AnimateIn variant="slide-right">
            <div>
              <p className="section-label-inv">05 / Lectura recomendada</p>

              <h2 className="mt-14 text-[clamp(44px,6vw,82px)] font-normal leading-[1.08] text-white">
                Hoy te regalamos.<br />
                <em className="font-serif italic">La mejor guía para</em><br />
                <em className="font-serif italic">blindarte del SAT.</em>
              </h2>

              <p className="mt-14 text-[clamp(16px,1.4vw,21px)] text-ink-100 leading-[1.25] max-w-[760px]">
                Descarga gratuita. Recibe la guía en tu email en menos de un minuto.
                Sin spam, y cancelación con un click.
              </p>

              <form className="mt-16 flex flex-col sm:flex-row gap-0 max-w-[760px]" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="input-base flex-1 h-[60px] bg-ink-800/70 border-ink-700 px-7 text-[16px]"
                  aria-label="Correo electrónico"
                />
                <button type="submit" className="btn-primary-inv h-[60px] px-9 whitespace-nowrap">
                  Descargar
                </button>
              </form>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-ink-400">
                <span className="whitespace-nowrap">40 páginas</span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">PDF</span>
                <span aria-hidden="true">·</span>
                <span className="whitespace-nowrap">Versión 2026</span>
              </div>
            </div>
            </AnimateIn>

          </div>

          {/* Outer div owns the absolute position + vertical centering */}
          <div className="mt-10 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:right-[-65px] xl:right-[-85px] z-0">
            <AnimateIn variant="fade-in" delay={200}>
              <div className="flex justify-center lg:justify-end">
                <BookTilt
                  src={imgGuia}
                  alt="Guía para blindarte del SAT"
                  imgClassName="w-full max-w-[420px] lg:max-w-[540px] xl:max-w-[600px] object-contain"
                />
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* ── 07 Ecosistema ───────────────────────── */}
      <section className="bg-cream-200 py-16 md:py-20 border-t border-cream-400">
        <div className="container-app">
          <AnimateIn className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-10">
            <div>
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400 leading-none">06 /</p>
                <p className="text-[11px] uppercase tracking-[0.35em] text-ink-400">Ecosistema</p>
              </div>
              <h2 className="section-title">
                <strong className="font-bold">Tres</strong> caminos.<br />
                Con dirección <em className="font-serif italic font-normal">estratégica.</em>
              </h2>
            </div>
            <Link to="/recursos" className="text-[11px] uppercase tracking-[0.3em] text-ink-400 hover:text-ink-900 transition-colors underline decoration-1 underline-offset-4">
              Ver todo →
            </Link>
          </AnimateIn>

          <div className="grid lg:grid-cols-3 gap-0 border border-cream-400 divide-y lg:divide-y-0 lg:divide-x divide-cream-400">
            {SERVICES.map((s, idx) => {
              const ctaClass = `flex items-center justify-between gap-4 text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.25em] pt-4 border-t group cursor-pointer ${
                s.dark ? 'border-ink-700 text-ink-300 hover:text-white' : 'border-cream-400 text-ink-500 hover:text-ink-900'
              }`;
              const arrowClass = `w-7 h-7 shrink-0 rounded-full border flex items-center justify-center group-hover:bg-ink-900 group-hover:text-white group-hover:border-ink-900 transition-colors ${
                s.dark ? 'border-ink-600 text-ink-400' : 'border-ink-400 text-ink-500'
              }`;
              const ctaContent = <><span className="min-w-0 leading-relaxed">{s.cta}</span><span className={arrowClass}>→</span></>;
              return (
                <AnimateIn key={s.id} variant="fade-up" delay={idx * 100} className="flex">
                <div className={`p-6 sm:p-8 flex flex-col gap-5 flex-1 hover:-translate-y-1.5 transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)] ${s.dark ? 'bg-ink-900' : 'bg-white'}`}>
                  <div className="flex items-start justify-between">
                    <span className="text-[11px] uppercase tracking-[0.3em] text-ink-400">{s.label}</span>
                    <span className={`text-[11px] uppercase tracking-[0.2em] ${s.dark ? 'text-ink-600' : 'text-ink-200'}`}>{idx + 1}.</span>
                  </div>

                  <h3 className={`text-[clamp(22px,2.5vw,28px)] font-serif italic font-normal ${s.dark ? 'text-white' : 'text-ink-900'}`}>
                    {s.title}
                  </h3>

                  <p className={`text-[13px] leading-relaxed flex-1 ${s.dark ? 'text-ink-300' : 'text-ink-500'}`}>
                    {s.desc}
                  </p>

                  {s.link.startsWith('http') ? (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className={ctaClass}>{ctaContent}</a>
                  ) : (
                    <Link to={s.link} className={ctaClass}>{ctaContent}</Link>
                  )}
                </div>
                </AnimateIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 08 Testimonios ──────────────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-16 md:py-24">
        <div className="container-app">
          <div className="flex flex-col items-center gap-2 mb-12 md:mb-16">
            <p className="section-label">07 / Voces</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-400">
              0{testimonialIdx + 1} / 0{TESTIMONIALS.length} Testimonios
            </p>
          </div>

          <div
            className="transition-opacity duration-200"
            style={{ opacity: testimonialFading ? 0 : 1 }}
          >
            <blockquote className="text-[clamp(26px,4vw,48px)] font-normal leading-tight text-ink-900 max-w-5xl text-center mx-auto">
              {TESTIMONIALS[testimonialIdx].richQuote}
            </blockquote>

            <div className="mt-10 space-y-1 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-ink-900 font-semibold">
                {TESTIMONIALS[testimonialIdx].author}
              </p>
              <p className="text-[11px] uppercase tracking-[0.25em] text-ink-400">
                {TESTIMONIALS[testimonialIdx].role}
              </p>
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                aria-label={`Testimonio ${i + 1}`}
                onClick={() => changeTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer ${
                  i === testimonialIdx ? 'bg-ink-900' : 'bg-ink-300 hover:bg-ink-500'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── 09 Para empresas / CTA ──────────────── */}
      <section className="bg-cream-200 border-t border-cream-400 py-16 md:py-24">
        <div className="container-app">
          <p className="section-label text-center mb-10">08 / Para empresas</p>

          <AnimateIn className="text-center max-w-3xl mx-auto space-y-7">
            <h2 className="text-[clamp(30px,8vw,60px)] font-normal leading-tight text-ink-900">
              ¿Tu <strong className="font-bold">empresa</strong> necesita<br />
              una <em className="font-serif italic font-normal">estrategia fiscal</em><br />
              de alto nivel?
            </h2>

            <p className="text-[13px] text-ink-500 leading-relaxed max-w-md mx-auto">
              Diego es fundador y director de Díaz Lara, su firma fiscal. Es facilitador
              de temas empresariales, fiscales y jurídicos.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 py-2">
              {['Great Place to Work', 'Cruz de Malta', 'Latin American Quality Awards'].map((cert) => (
                <span key={cert} className="text-[11px] uppercase tracking-[0.25em] text-ink-400">{cert}</span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link to="/academia" className="btn-primary">
                Ir a la capacitación →
              </Link>
              <a href="https://diazlara.mx/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Ir a Díaz Lara
              </a>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  );
}
