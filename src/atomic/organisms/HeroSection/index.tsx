import { Link } from 'react-router-dom';
import heroImage from '../../../../assets/001_home_foto_DD.png';

export default function HeroSection() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="bg-cream-200">
      <div className="container-app">

        {/* Breadcrumb / dateline */}
        <div className="flex items-center justify-between py-5 border-b border-cream-400 text-[11px] text-ink-400 tracking-[0.05em]">
          <div className="flex items-center gap-3">
            <span>— Estrategia fiscal</span>
            <span>·</span>
            <span>Conferencista</span>
            <span>·</span>
            <span>Autor</span>
          </div>
          <span>— {formattedDate}</span>
        </div>

        {/* Hero content */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 xl:gap-20 items-start pt-14 pb-16">

          {/* Left — texto */}
          <div className="space-y-8">
            <h1 className="text-[clamp(52px,7vw,88px)] leading-[1.0] tracking-[-0.02em] text-ink-900">
              <span className="font-normal">La </span>
              <span className="font-black">Estrategia Fiscal</span>
              <br />
              <span className="font-light">que tu contador</span>
              <br />
              <span className="font-light">no se atreve a darte.</span>
            </h1>

            <p className="text-[15px] text-ink-500 leading-relaxed max-w-sm">
              Diego Díaz capacita, ayuda y apoya empresarios a tomar el control de su carga fiscal.
              Más de 25 años, 3 libros publicados y +10,000 directivos formados.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/eventos" className="btn-primary">
                Asegurar mi lugar →
              </Link>
              <Link to="/acerca" className="btn-secondary">
                Conoce a Diego
              </Link>
            </div>
          </div>

          {/* Right — foto */}
          <div className="overflow-hidden bg-stone-200 aspect-[3/4] lg:aspect-auto lg:h-[520px]">
            <img
              src={heroImage}
              alt="Diego Díaz"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
