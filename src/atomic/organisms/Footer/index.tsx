import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-auto">
      <div className="container-app py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="font-heading font-black text-2xl text-white">
            Diego<span className="text-brand-500">Díaz</span>
          </Link>
          <p className="text-gray-400 text-sm mt-3 max-w-xs">
            Estratega fiscal. Formación profesional en derecho fiscal y corporativo.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Plataforma</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            {[['Cursos', '/cursos'], ['Eventos', '/eventos'], ['Academia', '/academia'], ['Blog', '/blog']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="flex flex-col gap-2 text-sm text-gray-400">
            {[['Privacidad', '/privacidad'], ['Términos', '/terminos'], ['Contacto', '/contacto']].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-dark-600 py-4">
        <p className="text-center text-gray-500 text-xs">© {new Date().getFullYear()} Diego Díaz. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
