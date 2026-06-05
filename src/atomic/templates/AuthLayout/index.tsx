import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center px-4">
      <Link to="/" className="font-heading font-bold text-3xl text-white mb-8">
        Diego<span className="text-brand-500">Díaz</span>
      </Link>
      <div className="w-full max-w-sm bg-dark-800 border border-dark-600 rounded-2xl p-8">
        <Outlet />
      </div>
    </div>
  );
}
