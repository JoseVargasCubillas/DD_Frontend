import { Outlet, ScrollRestoration } from 'react-router-dom';
import Navbar from '@organisms/Navbar';
import Footer from '@organisms/Footer';
import GlobalMotion from '@organisms/GlobalMotion';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-200">
      <ScrollRestoration />
      <GlobalMotion />
      <Navbar />
      <main className="flex-1" data-motion-root>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
