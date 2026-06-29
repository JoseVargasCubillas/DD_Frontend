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

interface MenuItem {
  to: string;
  label: string;
  group: string;
  end?: boolean;
}

const MENU: MenuItem[] = [
  { to: "/admin", label: "Inicio", group: "General", end: true },
  { to: "/admin/contactos", label: "Contactos", group: "Comunidad" },
];

const GROUPS = ["General", "Comunidad"] as const;

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

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [productsOpen, setProductsOpen] = useState(true);
  const [salesOpen, setSalesOpen] = useState(true);
  const isProductRoute =
    location.pathname === "/admin/productos" ||
    location.pathname.startsWith("/admin/cursos") ||
    location.pathname.startsWith("/admin/eventos") ||
    location.pathname.startsWith("/admin/blog");
  const isSalesRoute = location.pathname.startsWith("/admin/ventas");

  return (
    <div className="min-h-screen bg-cream text-ink-900 flex">
      {/* ── Sidebar editorial ─────────────────────────── */}
      <aside className="w-64 shrink-0 bg-cream-100 border-r border-ink-900/15 flex flex-col">
        {/* Masthead */}
        <Link to="/" className="px-6 py-6 border-b border-ink-900/15 block">
          <img
            src={logoDD}
            alt="Diego Díaz"
            className="h-9 object-contain mb-2"
          />
          <p className="text-[9px] uppercase tracking-[0.4em] text-ink-700">
            Panel admin
          </p>
        </Link>

        {/* Navegación agrupada */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {GROUPS.map((group, index) => (
            <div key={group}>
              {index === 1 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setProductsOpen((open) => !open)}
                    aria-expanded={productsOpen}
                    aria-controls="admin-products-menu"
                    className={`flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 ${
                      isProductRoute
                        ? "text-ink-900"
                        : "text-ink-700 hover:bg-cream-200/60 hover:text-ink-900"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-4 w-4 shrink-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.3 7.7 7.7 4.4 7.7-4.4M12 12.1V21"
                      />
                    </svg>
                    <span className="flex-1">Productos</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${productsOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 12 4-4 4 4"
                      />
                    </svg>
                  </button>

                  {productsOpen && (
                    <ul
                      id="admin-products-menu"
                      className="mt-1 space-y-0.5 pl-7"
                    >
                      {PRODUCT_ITEMS.map((item) => (
                        <li key={item.label}>
                          {"to" in item ? (
                            <NavLink
                              to={item.to}
                              end={item.to === "/admin/productos"}
                              className={({ isActive }) =>
                                `flex min-h-10 items-center rounded-lg px-3 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 ${
                                  isActive
                                    ? "bg-ink-900/[0.07] font-semibold text-ink-900"
                                    : "text-ink-600 hover:bg-cream-200/70 hover:text-ink-900"
                                }`
                              }
                            >
                              {item.label}
                            </NavLink>
                          ) : (
                            <span
                              className="flex min-h-10 cursor-default items-center rounded-lg px-3 text-[13px] text-ink-400"
                              title="Disponible próximamente"
                            >
                              {item.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {index === 1 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setSalesOpen((open) => !open)}
                    aria-expanded={salesOpen}
                    aria-controls="admin-sales-menu"
                    className={`flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-lg px-3 text-left text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 ${
                      isSalesRoute
                        ? "text-ink-900"
                        : "text-ink-700 hover:bg-cream-200/60 hover:text-ink-900"
                    }`}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      className="h-4 w-4 shrink-0"
                    >
                      <rect x="4" y="6" width="16" height="12" rx="2" />
                      <path strokeLinecap="round" d="M7 10h10M7 14h5" />
                    </svg>
                    <span className="flex-1">Ventas</span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${salesOpen ? "rotate-180" : ""}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m6 12 4-4 4 4"
                      />
                    </svg>
                  </button>
                  {salesOpen && (
                    <ul id="admin-sales-menu" className="mt-1 space-y-0.5 pl-7">
                      {SALES_ITEMS.map((item) => (
                        <li key={item.label}>
                          {"to" in item ? (
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                `flex min-h-10 items-center rounded-lg px-3 text-[13px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 ${
                                  isActive
                                    ? "bg-ink-900/[0.07] font-semibold text-ink-900"
                                    : "text-ink-600 hover:bg-cream-200/70 hover:text-ink-900"
                                }`
                              }
                            >
                              {item.label}
                            </NavLink>
                          ) : (
                            <span
                              className="flex min-h-10 cursor-default items-center rounded-lg px-3 text-[13px] text-ink-400"
                              title="Disponible próximamente"
                            >
                              {item.label}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              <div key={group} className="mb-6">
                <p className="px-3 mb-2 text-[9px] uppercase tracking-[0.4em] text-ink-500">
                  {group}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {MENU.filter((m) => m.group === group).map(
                    ({ to, label, end }) => (
                      <li key={to}>
                        <NavLink
                          to={to}
                          end={end}
                          className={({ isActive }) =>
                            `block px-3 py-2 text-[12px] uppercase tracking-[0.18em] transition-colors border-l-2 ${
                              isActive
                                ? "border-ink-900 bg-cream-200 text-ink-900 font-semibold"
                                : "border-transparent text-ink-600 hover:text-ink-900 hover:bg-cream-200/60"
                            }`
                          }
                        >
                          {label}
                        </NavLink>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer del sidebar */}
        <div className="border-t border-ink-900/15 px-4 py-4">
          {user && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-ink-900 truncate">
                  {user.name}
                </p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500">
                  {user.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 transition-colors py-2 border border-ink-900/20 hover:border-ink-900 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Contenido ─────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-cream/90 backdrop-blur-sm border-b border-ink-900/15 px-8 py-3 flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700">
            Panel admin ·{" "}
            {new Date().toLocaleDateString("es-MX", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-600">
              En línea
            </span>
          </div>
        </div>

        <div className="p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
