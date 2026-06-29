import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  // El layout solo provee el lienzo cream; la página Login arma su propio periódico.
  return (
    <div className="min-h-screen bg-cream text-ink-900 overflow-hidden">
      <Outlet />
    </div>
  );
}

