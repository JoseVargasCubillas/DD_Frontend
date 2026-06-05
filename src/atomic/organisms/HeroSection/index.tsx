import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../../../assets/001_home_foto_DD.png';
import { useInView } from '@hooks/useInView';

const EASE_OUT = 'cubic-bezier(.2,.8,.2,1)';
const EASE_CURTAIN = 'cubic-bezier(.7,0,.3,1)';

function WordMask({ children, delay, visible }: { children: ReactNode; delay: number; visible: boolean }) {
  return (
    <span className="word-mask">
      <span
        style={{
          display: 'inline-block',
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          transition: visible
            ? `transform 800ms ${EASE_OUT} ${delay}ms`
            : 'transform 0ms', // instant reset — happens off-screen
        }}
      >
        {children}
      </span>
    </span>
  );
}

export default function HeroSection() {
  const { ref: heroRef, inView } = useInView(0.1);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bodyStyle = (delay: number) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'none' : 'translateY(32px)',
    transition: inView
      ? `opacity 900ms ${EASE_OUT} ${delay}ms, transform 900ms ${EASE_OUT} ${delay}ms`
      : 'opacity 0ms, transform 0ms',
  });

  return (
    <section className="bg-cream-200">
      <div ref={heroRef} className="container-app">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-5 border-b border-cream-400 text-[11px] text-ink-400 tracking-[0.05em]">
          <div className="flex flex-wrap items-center gap-3">
            <span>&mdash; Estrategia fiscal</span>
            <span className="text-ink-300">&middot;</span>
            <span>Conferencista</span>
            <span className="text-ink-300">&middot;</span>
            <span>Autor</span>
          </div>
          <span>&mdash; {formattedDate}</span>
        </div>

        <div className="pt-14 md:pt-[72px] pb-12 lg:pb-9">
          {/* Demo 01 — word-by-word mask reveal, replays on scroll */}
          <h1
            className="max-w-[1120px] leading-[0.98] tracking-[-0.03em] text-ink-900"
            style={{ fontSize: 'clamp(52px, 8.2vw, 108px)' }}
          >
            <WordMask delay={0}   visible={inView}><span className="font-normal">La</span></WordMask>
            {' '}
            <WordMask delay={80}  visible={inView}><span className="font-bold">Estrategia</span></WordMask>
            {' '}
            <WordMask delay={160} visible={inView}><span className="font-bold">Fiscal</span></WordMask>
            <br />
            <WordMask delay={280} visible={inView}><span className="font-light">que</span></WordMask>
            {' '}
            <WordMask delay={360} visible={inView}><span className="font-light">tu</span></WordMask>
            {' '}
            <WordMask delay={440} visible={inView}><span className="font-light">contador</span></WordMask>
            <br />
            <WordMask delay={580} visible={inView}>
              <span className="font-serif font-normal tracking-normal">no se atreve a darte.</span>
            </WordMask>
          </h1>

          <div className="mt-10 grid lg:grid-cols-[minmax(0,520px)_minmax(360px,420px)] gap-10 lg:gap-16 items-start justify-between">
            {/* Body text */}
            <div style={bodyStyle(200)} className="space-y-8">
              <p className="text-[15px] text-ink-500 leading-relaxed max-w-sm">
                Diego D&iacute;az capacita, ayuda y apoya empresarios a tomar el control
                de su carga fiscal. M&aacute;s de 25 a&ntilde;os, 3 libros publicados y
                +10,000 directivos formados.
              </p>

              {/* Actions */}
              <div style={bodyStyle(380)} className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                <Link to="/eventos" className="btn-primary whitespace-nowrap px-6">
                  Asegurar mi lugar &rarr;
                </Link>
                <Link to="/acerca" className="btn-secondary whitespace-nowrap px-6">
                  Conoce a Diego
                </Link>
              </div>
            </div>

            {/* Hero image */}
            <div
              style={{
                opacity: inView ? 1 : 0,
                transition: inView
                  ? `opacity 1100ms ${EASE_CURTAIN} 100ms`
                  : 'opacity 0ms',
              }}
              className="flex items-start justify-center lg:justify-end"
            >
              <img
                src={heroImage}
                alt="Diego Diaz"
                className="w-full max-w-[380px] lg:w-[clamp(360px,32vw,420px)] lg:max-w-full h-auto object-contain mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
