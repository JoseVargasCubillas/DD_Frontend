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
              {[['Diego','/acerca'],['Prensa','/prensa'],['Blog','/blog'],['Recursos','/recursos']].map(([label, to]) => (
                <li key={to}><Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] uppercase tracking-[0.3em] text-ink-400 font-normal">Productos</h5>
            <ul className="space-y-3">
              {[['Eventos','/eventos'],['Academia','/academia'],['Libros','/recursos']].map(([label, to]) => (
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
            <ul className="space-y-3">
              {[['WhatsApp','#'],['Email','#'],['Oficina','#'],['IG','#'],['LI','#'],['YT','#'],['TT','#']].map(([label, href]) => (
                <li key={label}><a href={href} className="text-[13px] text-ink-300 hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
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
