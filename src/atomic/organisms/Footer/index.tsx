import { Link } from 'react-router-dom';
import { useState } from 'react';
import logoFooter from '../../../../assets/012_home_footerlogo_DD.png';

const LINKS = {
  explorar: [
    { label: 'Diego',     to: '/acerca'   },
    { label: 'Prensa',    to: '/prensa'   },
    { label: 'Blog',      to: '/blog'     },
    { label: 'Recursos',  to: '/recursos' },
  ],
  productos: [
    { label: 'Eventos',   to: '/eventos'  },
    { label: 'Academia',  to: '/academia' },
    { label: 'Libros',    to: '/recursos' },
  ],
  ecosistema: [
    { label: 'Díaz Lara', to: '/contacto' },
  ],
  contacto: [
    { label: 'WhatsApp',  to: '#' },
    { label: 'Email',     to: '#' },
    { label: 'Oficina',   to: '#' },
    { label: 'IG',        to: '#' },
    { label: 'LI',        to: '#' },
    { label: 'YT',        to: '#' },
    { label: 'TT',        to: '#' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="bg-ink-900 mt-auto">

      {/* Watermark */}
      <div className="overflow-hidden select-none pointer-events-none">
        <p
          className="text-ink-800 font-black text-center leading-none whitespace-nowrap"
          style={{ fontSize: 'clamp(80px, 14vw, 180px)', letterSpacing: '-0.03em' }}
        >
          DIEGO DÍAZ
        </p>
      </div>

      {/* Main footer grid */}
      <div className="container-app pb-16 border-t border-ink-700">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10 pt-12">

          {/* Marca + newsletter */}
          <div className="col-span-2 md:col-span-1 space-y-5">
            <img src={logoFooter} alt="Diego Díaz" className="h-12 object-contain brightness-0 invert" />
            <p className="text-[12px] text-ink-400 leading-relaxed">
              El éxito, ama la preparación.
            </p>
            <form
              className="flex gap-0"
              onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
            >
              <input
                type="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent border border-ink-700 text-white text-[11px] px-3 py-2.5 focus:outline-none focus:border-ink-400 placeholder-ink-600 min-w-0"
              />
              <button
                type="submit"
                className="bg-transparent border border-l-0 border-ink-700 text-ink-300 text-[10px] uppercase tracking-[0.2em] px-4 hover:bg-ink-800 hover:text-white transition-colors"
              >
                Suscribirme
              </button>
            </form>
          </div>

          {/* Explorar */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-ink-400 font-normal">Explora</h5>
            <ul className="space-y-3">
              {LINKS.explorar.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-ink-400 font-normal">Productos</h5>
            <ul className="space-y-3">
              {LINKS.productos.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosistema */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-ink-400 font-normal">Ecosistema</h5>
            <ul className="space-y-3">
              {LINKS.ecosistema.map(({ label, to }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase tracking-[0.3em] text-ink-400 font-normal">Contacto</h5>
            <ul className="space-y-3">
              {LINKS.contacto.map(({ label, to }) => (
                <li key={`${to}-${label}`}>
                  <Link to={to} className="text-[13px] text-ink-300 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ink-800 py-4">
        <div className="container-app flex flex-wrap items-center justify-end gap-6">
          {[
            { label: 'Privacidad',  to: '/privacidad' },
            { label: 'Términos',    to: '/terminos'   },
            { label: 'FAQ',         to: '/faq'        },
          ].map(({ label, to }) => (
            <Link key={to} to={to} className="text-[10px] uppercase tracking-[0.25em] text-ink-500 hover:text-ink-300 transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
