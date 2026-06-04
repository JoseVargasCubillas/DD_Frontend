import { Outlet } from 'react-router-dom';
import Navbar from '@organisms/Navbar';
import Footer from '@organisms/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
