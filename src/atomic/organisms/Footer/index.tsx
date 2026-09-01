import { Link } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { subscribeNewsletter } from '@api/leads.api';
import logoFooter from '../../../../assets/home/012_home_footerlogo_DD.png';
import logoDiegoWatermark from '../../../../assets/home/010_home_logo_fotter2_DD.png';
import gptwBadge from '../../../../assets/certifications/gptw.png';
import latinBadge from '../../../../assets/certifications/latin-excellence.png';

const NEWSLETTER_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      toast.error('Escribe tu correo para suscribirte.');
      return;
    }
    if (!NEWSLETTER_EMAIL_RE.test(value)) {
      toast.error('Ese correo no parece válido.');
      return;
    }

    setSubscribing(true);
    try {
      await subscribeNewsletter(value);
      setSubscribed(true);
      setEmail('');
      toast.success('Listo, ya estás suscrito.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No pudimos suscribirte. Intenta de nuevo.';
      toast.error(message);
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-ink-900 mt-auto">

      {/* Watermark — imagen real del logo condensado, centrada como en el mockup */}
      <div className="overflow-hidden select-none pointer-events-none w-full h-[220px] md:h-[250px] flex items-center justify-center px-8 md:px-12">
        <img
          src={logoDiegoWatermark}
          alt=""
          className="w-full max-w-[1040px] max-h-[180px] md:max-h-[195px] object-contain block"
          style={{ filter: 'invert(1)', opacity: 0.11 }}
        />
      </div>

      <div className="container-app pb-16 border-t border-ink-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 pt-12">

          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <img src={logoFooter} alt="Diego Diaz" className="h-12 object-contain brightness-0 invert" />
            <p className="font-serif text-[20px] text-ink-300 leading-snug max-w-[180px]">
              El &eacute;xito, ama la preparaci&oacute;n.
            </p>
            {subscribed ? (
              <p className="text-[12px] uppercase tracking-[0.2em] text-ink-300 border border-ink-700 px-3 py-2.5 min-h-[44px] flex items-center">
                ¡Gracias! Ya estás suscrito.
              </p>
            ) : (
              <form className="flex flex-col sm:flex-row gap-0" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={subscribing}
                  className="flex-1 bg-transparent border border-ink-700 text-white text-[12px] px-3 py-2.5 focus:outline-none focus:border-ink-400 placeholder-ink-600 min-w-0 min-h-[44px] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-transparent border border-t-0 sm:border-t sm:border-l-0 border-ink-700 text-ink-300 text-[11px] uppercase tracking-[0.2em] px-4 min-h-[44px] hover:bg-ink-800 hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {subscribing ? 'Enviando…' : 'Suscribirme'}
                </button>
              </form>
            )}
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">Explora</h5>
            <ul className="space-y-3">
              {[['Diego','/acerca'],['Prensa','/prensa#prensa'],['Blog','/blog'],['Recursos','/recursos']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">Productos</h5>
            <ul className="space-y-3">
              {[['Eventos','/eventos'],['Academia','/academia'],['Libros','/libros']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">Ecosistema</h5>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://diazlara.mx/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-ink-300 hover:text-white transition-colors"
                >
                  D&iacute;az Lara
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">Contacto</h5>
            <p className="max-w-[190px] text-[14px] leading-relaxed text-ink-300">
              ¿Tienes alguna duda?{' '}
              <Link
                to="/contacto#contacto"
                className="font-bold text-white underline decoration-[#d8c19a] decoration-1 underline-offset-4 transition-colors hover:text-[#d8c19a]"
              >
                Contáctanos
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Certificaciones — franja compacta */}
      <div className="border-t border-ink-800">
        <div className="container-app py-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500 shrink-0">
              Distinciones 2025 – 2026
            </span>
            <div className="hidden md:block h-14 w-px bg-ink-800" />
            <div className="flex items-center gap-8 md:gap-10">
              <div className="flex items-center gap-4">
                <img
                  src={gptwBadge}
                  alt="Great Place to Work Certificada · México · Sept 2025 – Sept 2026"
                  className="h-20 w-auto object-contain"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <p className="font-serif text-[16px] text-white">Great Place to Work<sup className="text-[9px] ml-0.5">®</sup></p>
                  <p className="text-[11px] text-ink-400 mt-0.5">Certificada · Sept 2025 – Sept 2026</p>
                </div>
              </div>
              <div className="h-16 w-px bg-ink-800" />
              <div className="flex items-center gap-4">
                <img
                  src={latinBadge}
                  alt="Latin American Excellence in Law Awards — Silver Seal 2025"
                  className="h-20 w-20 object-contain"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <p className="font-serif text-[16px] text-white">Latin American Excellence <span className="italic text-ink-300">in Law</span></p>
                  <p className="text-[11px] text-ink-400 mt-0.5">Silver Seal · Edici&oacute;n 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-ink-800 py-4">
        <div className="container-app flex flex-wrap items-center justify-start sm:justify-end gap-6">
          {[['Privacidad','/privacidad'],['Términos','/terminos'],['FAQ','/faq']].map(([label, to]) => (
            <Link key={to} to={to} className="text-[11px] uppercase tracking-[0.25em] text-ink-500 hover:text-ink-300 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
