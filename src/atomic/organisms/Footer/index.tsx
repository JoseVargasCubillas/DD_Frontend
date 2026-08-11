import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoFooter from '../../../../assets/home/012_home_footerlogo_DD.png';
import logoDiegoWatermark from '../../../../assets/home/010_home_logo_fotter2_DD.png';
import gptwBadge from '../../../../assets/certifications/gptw.png';
import latinBadge from '../../../../assets/certifications/latin-excellence.png';

export default function Footer() {
  const [email, setEmail] = useState('');

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
            <form className="flex flex-col sm:flex-row gap-0" onSubmit={(e) => { e.preventDefault(); setEmail(''); }}>
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border border-ink-700 text-white text-[12px] px-3 py-2.5 focus:outline-none focus:border-ink-400 placeholder-ink-600 min-w-0 min-h-[44px]"
              />
              <button
                type="submit"
                className="bg-transparent border border-t-0 sm:border-t sm:border-l-0 border-ink-700 text-ink-300 text-[11px] uppercase tracking-[0.2em] px-4 min-h-[44px] hover:bg-ink-800 hover:text-white transition-colors"
              >
                Suscribirme
              </button>
            </form>
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
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">
              <Link to="/contacto" className="transition-colors hover:text-white">
                Contacto
              </Link>
            </h5>
            <ul className="space-y-3">
              {[['WhatsApp','#'],['Email','#'],['Oficina','#'],['IG','#'],['LI','#'],['YT','#'],['TT','#']].map(([label, href]) => (
                <li key={label}><a href={href} className="text-[13px] text-ink-300 hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Certificaciones — franja compacta */}
      <div className="border-t border-ink-800">
        <div className="container-app py-5">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-ink-500 shrink-0">
              Distinciones 2025 – 2026
            </span>
            <div className="hidden md:block h-8 w-px bg-ink-800" />
            <div className="flex items-center gap-6 md:gap-8">
              <div className="flex items-center gap-3">
                <img
                  src={gptwBadge}
                  alt="Great Place to Work Certificada · México · Sept 2025 – Sept 2026"
                  className="h-12 w-auto object-contain"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <p className="font-serif text-[13px] text-white">Great Place to Work<sup className="text-[8px] ml-0.5">®</sup></p>
                  <p className="text-[10px] text-ink-500">Certificada · Sept 2025 – Sept 2026</p>
                </div>
              </div>
              <div className="h-10 w-px bg-ink-800" />
              <div className="flex items-center gap-3">
                <img
                  src={latinBadge}
                  alt="Latin American Excellence in Law Awards — Silver Seal 2025"
                  className="h-12 w-12 object-contain"
                  loading="lazy"
                />
                <div className="leading-tight">
                  <p className="font-serif text-[13px] text-white">Latin American Excellence <span className="italic text-ink-300">in Law</span></p>
                  <p className="text-[10px] text-ink-500">Silver Seal · Edici&oacute;n 2025</p>
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
