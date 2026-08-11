import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoFooter from '../../../../assets/home/012_home_footerlogo_DD.png';
import logoDiegoWatermark from '../../../../assets/home/010_home_logo_fotter2_DD.png';

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

      <div className="border-t border-ink-800">
        <div className="container-app py-10">
          <div className="flex items-center gap-6 mb-6">
            <span className="text-[10px] uppercase tracking-[0.4em] text-ink-400 shrink-0">
              Certificaciones &amp; Reconocimientos
            </span>
            <div className="h-px flex-1 bg-ink-800" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Great Place to Work */}
            <div className="flex items-center gap-5 border border-ink-700 bg-ink-800/40 px-5 py-4 hover:border-ink-500 transition-colors">
              <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 text-white" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="24" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
                <path d="M32 14 L36 26 L48 26 L38 33 L42 46 L32 38 L22 46 L26 33 L16 26 L28 26 Z" fill="currentColor" />
                <text x="32" y="58" textAnchor="middle" fontFamily="serif" fontSize="4.5" fill="currentColor" letterSpacing="0.8">CERTIFIED</text>
              </svg>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.35em] text-ink-500 mb-1">Certificada</p>
                <p className="font-serif text-[18px] leading-tight text-white">Great Place to Work</p>
                <p className="text-[11px] text-ink-400 mt-0.5">Cultura empresarial certificada</p>
              </div>
            </div>

            {/* Latin American Excellence — Cruz de Malta */}
            <div className="flex items-center gap-5 border border-ink-700 bg-ink-800/40 px-5 py-4 hover:border-ink-500 transition-colors">
              <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 text-white" aria-hidden="true">
                <circle cx="32" cy="32" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
                {/* Cruz de Malta: 4 puntas triangulares desde el centro */}
                <g fill="currentColor">
                  {/* Norte */}
                  <path d="M32 12 L26 26 L32 24 L38 26 Z" />
                  {/* Sur */}
                  <path d="M32 52 L26 38 L32 40 L38 38 Z" />
                  {/* Oeste */}
                  <path d="M12 32 L26 26 L24 32 L26 38 Z" />
                  {/* Este */}
                  <path d="M52 32 L38 26 L40 32 L38 38 Z" />
                </g>
                <circle cx="32" cy="32" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <div className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.35em] text-ink-500 mb-1">Galardonada</p>
                <p className="font-serif text-[18px] leading-tight text-white">Latin American Excellence</p>
                <p className="text-[11px] text-ink-400 mt-0.5">Cruz de Malta &middot; LAQI</p>
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
