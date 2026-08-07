import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../../../assets/home/001_home_foto_DD.png';
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
        <div className="relative pt-10 md:pt-12 pb-12 lg:min-h-[1120px] lg:pb-0">
          {/* Demo 01 — word-by-word mask reveal, replays on scroll */}
          <h1
            className="max-w-[1240px] leading-[0.96] tracking-[-0.035em] text-ink-900"
            style={{ fontSize: 'clamp(64px, 8.15vw, 118px)' }}
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
              <span
                className="inline-block font-serif font-normal tracking-normal"
                style={{ fontSize: 'clamp(68px, 7.8vw, 112px)', lineHeight: 0.94 }}
              >
                no se atreve a darte.
              </span>
            </WordMask>
          </h1>

          <div className="mt-10 grid items-start gap-12 lg:block">
            {/* Body text */}
            <div style={bodyStyle(200)} className="space-y-8 lg:ml-0 lg:max-w-[520px]">
              <p className="text-[15px] text-ink-500 leading-relaxed max-w-sm">
                Diego D&iacute;az capacita, ayuda y apoya empresarios a tomar
                el control de su carga fiscal. M&aacute;s de 20 a&ntilde;os, 3 libros
                publicados y +10,000 directivos formados.
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
              className="flex items-start justify-center lg:absolute lg:left-[66.3%] lg:top-[430px] lg:block lg:w-[420px]"
            >
              <img
                src={heroImage}
                alt="Diego Diaz, estratega fiscal"
                className="aspect-[420/630] w-full max-w-[420px] object-cover object-[50%_48%] mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
