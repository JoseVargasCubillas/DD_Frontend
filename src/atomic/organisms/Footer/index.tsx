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

      {/* Certificaciones — presentación editorial */}
      <div className="border-t border-ink-800 bg-gradient-to-b from-ink-900 to-ink-950">
        <div className="container-app py-16 lg:py-20">
          {/* Encabezado tipo periódico */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 bg-ink-600" />
              <span className="font-mono text-[10px] uppercase tracking-[0.45em] text-ink-400">
                Distinciones 2025 – 2026
              </span>
              <div className="h-px w-16 bg-ink-600" />
            </div>
            <h3 className="font-serif italic text-[28px] md:text-[34px] leading-tight text-white">
              Reconocimientos que respaldan
              <br />
              nuestro trabajo
            </h3>
            <p className="text-[12px] text-ink-400 mt-3 max-w-md mx-auto tracking-wide">
              Certificaciones internacionales que avalan la cultura y la excelencia profesional de la firma.
            </p>
          </div>

          {/* Sellos sobre pedestal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Great Place to Work */}
            <figure className="group relative bg-ink-800/40 border border-ink-700/60 hover:border-ink-500 transition-all duration-300 p-8 text-center">
              <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.35em] text-ink-500">01</span>
              <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.35em] text-ink-500">MX</span>
              <div className="flex items-center justify-center h-40 mb-6">
                <img
                  src={gptwBadge}
                  alt="Great Place to Work Certificada · México · Sept 2025 – Sept 2026"
                  className="h-40 w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="pt-6 border-t border-ink-700/70">
                <p className="text-[9px] uppercase tracking-[0.4em] text-ink-500 mb-2">Certificada</p>
                <p className="font-serif text-[20px] leading-tight text-white">
                  Great Place to Work<sup className="text-[10px] align-super ml-0.5">®</sup>
                </p>
                <p className="text-[11px] text-ink-400 mt-1.5 tracking-wide">
                  Septiembre 2025 &mdash; Septiembre 2026
                </p>
              </div>
            </figure>

            {/* Latin American Excellence in Law — Silver Seal */}
            <figure className="group relative bg-ink-800/40 border border-ink-700/60 hover:border-ink-500 transition-all duration-300 p-8 text-center">
              <span className="absolute top-4 left-4 font-mono text-[9px] uppercase tracking-[0.35em] text-ink-500">02</span>
              <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.35em] text-ink-500">LATAM</span>
              <div className="flex items-center justify-center h-40 mb-6">
                <img
                  src={latinBadge}
                  alt="Latin American Excellence in Law Awards — Silver Seal 2025"
                  className="h-40 w-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              </div>
              <div className="pt-6 border-t border-ink-700/70">
                <p className="text-[9px] uppercase tracking-[0.4em] text-ink-500 mb-2">Galardonada</p>
                <p className="font-serif text-[20px] leading-tight text-white">
                  Latin American Excellence
                  <span className="block text-ink-300 text-[15px] italic mt-0.5">in Law Awards</span>
                </p>
                <p className="text-[11px] text-ink-400 mt-1.5 tracking-wide">
                  Silver Seal &middot; Edici&oacute;n 2025
                </p>
              </div>
            </figure>
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
