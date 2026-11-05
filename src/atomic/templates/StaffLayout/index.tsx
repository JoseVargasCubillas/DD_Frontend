import { Outlet } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import logoDD from "../../../../assets/home/012_home_main logo_DD.png";

// Layout mínimo para el personal de entrada: sin menú del panel admin.
export default function StaffLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream text-ink-900">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-900/15 bg-cream/90 px-4 py-3 backdrop-blur-sm sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src={logoDD} alt="Diego Díaz" className="h-8 object-contain" />
          <p className="hidden text-[10px] uppercase tracking-[0.4em] text-ink-700 sm:block">Check-in</p>
        </div>
        <div className="flex min-w-0 items-center gap-3">
          {user && <span className="truncate text-xs font-semibold text-ink-900">{user.name}</span>}
          <button
            type="button"
            onClick={logout}
            className="shrink-0 cursor-pointer border border-ink-900/20 px-3 py-2 text-[10px] uppercase tracking-[0.28em] text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
          >
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
