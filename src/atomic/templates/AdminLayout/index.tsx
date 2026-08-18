import { useState } from "react";
import {
  Outlet,
  NavLink,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import logoDD from "../../../../assets/home/012_home_main logo_DD.png";

const PRODUCT_ITEMS = [
  { label: "Todos los productos", to: "/admin/productos" },
  { label: "Cursos", to: "/admin/cursos" },
  { label: "Eventos", to: "/admin/eventos" },
  { label: "Blog", to: "/admin/blog" },
  { label: "Podcasts" },
] as const;

const SALES_ITEMS = [
  { label: "Pagos", to: "/admin/ventas/pagos" },
  { label: "Precios", to: "/admin/ventas/precios" },
  { label: "Carrito", to: "/admin/ventas/carrito" },
  { label: "Facturas" },
  { label: "Cupones" },
  { label: "Afiliados" },
] as const;

const MARKETING_ITEMS = [
  { label: "Email campaigns", to: "/admin/email" },
] as const;

const subLinkClass = (isActive: boolean) =>
  "flex min-h-10 items-center rounded-lg px-3 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 " +
  (isActive
    ? "bg-ink-900/[0.07] font-semibold text-ink-900"
    : "text-ink-600 hover:bg-cream-200/70 hover:text-ink-900");

const chevronClass = (open: boolean) =>
  "h-4 w-4 transition-transform duration-200 motion-reduce:transition-none " +
  (open ? "rotate-180" : "");

const sectionBtnClass = (active: boolean) =>
  "flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 " +
  (active
    ? "text-ink-900"
    : "text-ink-700 hover:bg-cream-200/60 hover:text-ink-900");

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={chevronClass(open)}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 12 4-4 4 4" />
  </svg>
);

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const [marketingOpen, setMarketingOpen] = useState(true);

  const isProductRoute =
    location.pathname === "/admin/productos" ||
    location.pathname.startsWith("/admin/cursos") ||
    location.pathname.startsWith("/admin/eventos") ||
    location.pathname.startsWith("/admin/blog");
  const isSalesRoute = location.pathname.startsWith("/admin/ventas");
  const isMarketingRoute = location.pathname.startsWith("/admin/email");

  return (
    <div className="min-h-screen bg-cream text-ink-900 flex">
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-cream-100 border-r border-ink-900/15 flex flex-col">
        {/* Masthead */}
        <Link to="/" className="px-6 py-6 border-b border-ink-900/15 block">
          <img src={logoDD} alt="Diego Díaz" className="h-9 object-contain mb-2" />
          <p className="text-[9px] uppercase tracking-[0.4em] text-ink-700">Panel admin</p>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">

          {/* Inicio — siempre primero */}
          <div className="mb-4">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                "block px-3 py-2 text-[12px] uppercase tracking-[0.18em] transition-colors border-l-2 " +
                (isActive
                  ? "border-ink-900 bg-cream-200 text-ink-900 font-semibold"
                  : "border-transparent text-ink-600 hover:text-ink-900 hover:bg-cream-200/60")
              }
            >
              Inicio
            </NavLink>
          </div>

          {/* Contactos — link directo (manage tags vive dentro de la vista) */}
          <div className="mb-4">
            <NavLink
              to="/admin/contactos"
              className={({ isActive }) =>
                "flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 " +
                (isActive
                  ? "bg-ink-900/[0.07] text-ink-900"
                  : "text-ink-700 hover:bg-cream-200/60 hover:text-ink-900")
              }
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Contactos
            </NavLink>
          </div>

          {/* Productos */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setProductsOpen((o) => !o)}
              aria-expanded={productsOpen}
              aria-controls="admin-products-menu"
              className={sectionBtnClass(isProductRoute)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.3 7.7 7.7 4.4 7.7-4.4M12 12.1V21" />
              </svg>
              <span className="flex-1">Productos</span>
              <Chevron open={productsOpen} />
            </button>
            {productsOpen && (
              <ul id="admin-products-menu" className="mt-1 space-y-0.5 pl-7">
                {PRODUCT_ITEMS.map((item) => (
                  <li key={item.label}>
                    {"to" in item ? (
                      <NavLink
                        to={item.to}
                        end={item.to === "/admin/productos"}
                        className={({ isActive }) => subLinkClass(isActive)}
                      >
                        {item.label}
                      </NavLink>
                    ) : (
                      <span className="flex min-h-10 cursor-default items-center rounded-lg px-3 text-[13px] text-ink-400" title="Disponible próximamente">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Ventas */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setSalesOpen((o) => !o)}
              aria-expanded={salesOpen}
              aria-controls="admin-sales-menu"
              className={sectionBtnClass(isSalesRoute)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0">
                <rect x="4" y="6" width="16" height="12" rx="2" />
                <path strokeLinecap="round" d="M7 10h10M7 14h5" />
              </svg>
              <span className="flex-1">Ventas</span>
              <Chevron open={salesOpen} />
            </button>
            {salesOpen && (
              <ul id="admin-sales-menu" className="mt-1 space-y-0.5 pl-7">
                {SALES_ITEMS.map((item) => (
                  <li key={item.label}>
                    {"to" in item ? (
                      <NavLink to={item.to} className={({ isActive }) => subLinkClass(isActive)}>
                        {item.label}
                      </NavLink>
                    ) : (
                      <span className="flex min-h-10 cursor-default items-center rounded-lg px-3 text-[13px] text-ink-400" title="Disponible próximamente">
                        {item.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Marketing */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setMarketingOpen((o) => !o)}
              aria-expanded={marketingOpen}
              aria-controls="admin-marketing-menu"
              className={sectionBtnClass(isMarketingRoute)}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="flex-1">Marketing</span>
              <Chevron open={marketingOpen} />
            </button>
            {marketingOpen && (
              <ul id="admin-marketing-menu" className="mt-1 space-y-0.5 pl-7">
                {MARKETING_ITEMS.map((item) => (
                  <li key={item.label}>
                    <NavLink to={item.to} className={({ isActive }) => subLinkClass(isActive)}>
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-ink-900/15 px-4 py-4">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-900 truncate">{user.name}</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 transition-colors py-2 border border-ink-900/20 hover:border-ink-900 cursor-pointer"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-ink-900/15 px-8 py-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">Panel admin</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-600">En linea</span>
          </div>
        </div>
        <div className="p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
