import { useMemo, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useCourses } from "@hooks/useCourses";
import { useOrders } from "@hooks/usePayments";
import type { Course, Order } from "@t/index";

type PricingTab = "offers" | "upsells";
type StatusFilter = "published" | "draft" | "all";

interface UpsellRecord {
  id: string;
  offerId: string;
  name: string;
  price: number;
  currency: string;
  status: "published" | "draft";
  createdAt: string;
  thumbnail: string;
}

interface OfferRecord {
  id: string;
  courseId: string;
  title: string;
  status: "draft" | "published";
  products: number;
  price: number;
  currency: string;
  paymentType: "free" | "one_time";
  thumbnail: string;
  courseTitle: string;
  checkoutPath: string;
}

interface OfferMetrics {
  qtySold: number;
  netRevenue: number;
  purchasesLast30: number;
  netRevenueLast30: number;
  netRevenueAllTime: number;
  salesSeries: Array<{ date: string; label: string; value: number }>;
  purchasesSeries: Array<{ date: string; label: string; value: number }>;
}

export default function SalesPricing() {
  const [params, setParams] = useSearchParams();
  const activeTab = params.get("tab") === "upsells" ? "upsells" : "offers";
  const statsOfferId = params.get("stats");
  const [filter, setFilter] = useState<StatusFilter>("published");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsells, setUpsells] = useState<UpsellRecord[]>(() =>
    loadJson<UpsellRecord[]>("dd-sales-upsells", []),
  );
  const { data: coursesResponse } = useCourses({
    status: "",
    includeAll: true,
  });
  const { data: orders = [] } = useOrders();
  const courses = coursesResponse?.data ?? [];
  const offers = useMemo(() => collectOffers(courses), [courses]);
  const selectedOffer = offers.find((offer) => offer.id === statsOfferId);
  const offerMetrics = useMemo(
    () => buildOfferMetrics(offers, orders),
    [offers, orders],
  );

  if (selectedOffer) {
    return (
      <OfferStatsView
        offer={selectedOffer}
        metrics={offerMetrics.get(selectedOffer.id) ?? emptyOfferMetrics()}
        onBack={() => setParams({})}
      />
    );
  }

  const filteredOffers = offers.filter((offer) => {
    const matchesStatus = filter === "all" || offer.status === filter;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      offer.title.toLowerCase().includes(query) ||
      offer.courseTitle.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const last30Purchases = sumMetrics(offerMetrics, "purchasesLast30");
  const last30Revenue = sumMetrics(offerMetrics, "netRevenueLast30");
  const allTimeRevenue = sumMetrics(offerMetrics, "netRevenueAllTime");
  const saveUpsells = (next: UpsellRecord[]) => {
    setUpsells(next);
    localStorage.setItem("dd-sales-upsells", JSON.stringify(next));
  };

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-ink-900">Precios</h1>
          <nav className="mt-5 flex gap-5" aria-label="Secciones de precios">
            {[
              ["offers", "Ofertas"],
              ["upsells", "Upsells"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setParams(value === "offers" ? {} : { tab: value })
                }
                className={`min-h-10 cursor-pointer border-b-2 text-sm font-semibold ${
                  activeTab === value
                    ? "border-ink-900 text-ink-900"
                    : "border-transparent text-ink-600 hover:text-ink-900"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>
        {activeTab === "upsells" ? (
          <button
            type="button"
            onClick={() => setShowUpsellModal(true)}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
          >
            <span aria-hidden="true">＋</span> Nuevo upsell
          </button>
        ) : (
          <Link
            to="/admin/productos"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
          >
            <span aria-hidden="true">＋</span> Nueva oferta
          </Link>
        )}
      </header>

      {activeTab === "upsells" ? (
        <>
          <UpsellsView
            upsells={upsells}
            search={search}
            setSearch={setSearch}
          />
          {showUpsellModal && (
            <NewUpsellModal
              offers={offers}
              onClose={() => setShowUpsellModal(false)}
              onCreate={(upsell) => {
                saveUpsells([...upsells, upsell]);
                toast.success("Upsell creado");
                setShowUpsellModal(false);
              }}
            />
          )}
        </>
      ) : (
        <>
          <section className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-7 text-center shadow-sm md:grid-cols-3">
            <StatBlock
              label="Compras"
              sublabel="Últimos 30 días"
              value={String(last30Purchases)}
            />
            <StatBlock
              label="Ingresos netos"
              sublabel="Últimos 30 días"
              value={formatCompactMoney(last30Revenue)}
            />
            <StatBlock
              label="Ingresos netos"
              sublabel="Todo el tiempo"
              value={formatCompactMoney(allTimeRevenue)}
            />
          </section>

          <section className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
            <div className="flex gap-5">
              {[
                ["published", "Publicadas"],
                ["draft", "Borrador"],
                ["all", "Todas"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value as StatusFilter)}
                  className={`min-h-10 cursor-pointer border-b-2 text-sm font-semibold ${
                    filter === value
                      ? "border-ink-900 text-ink-900"
                      : "border-transparent text-ink-600 hover:text-ink-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <label className="relative mt-7 block">
              <SearchIcon />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar..."
                className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-ink-900"
              />
            </label>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                  <tr className="border-b border-ink-900/15 text-xs text-ink-600">
                    <th className="w-32 py-4" />
                    <th className="py-4 font-medium">Título de oferta</th>
                    <th className="py-4 font-medium">Productos</th>
                    <th className="py-4 font-medium">Precio</th>
                    <th className="py-4 font-medium">Vendidas</th>
                    <th className="py-4 font-medium">Ingresos netos</th>
                    <th className="py-4 font-medium">Estado</th>
                    <th className="py-4 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOffers.map((offer) => {
                    const metrics =
                      offerMetrics.get(offer.id) ?? emptyOfferMetrics();
                    return (
                      <OfferRow
                        key={offer.id}
                        offer={offer}
                        metrics={metrics}
                        openMenu={openMenu}
                        setOpenMenu={setOpenMenu}
                        onStats={() => setParams({ stats: offer.id })}
                      />
                    );
                  })}
                </tbody>
              </table>
              {filteredOffers.length === 0 && (
                <div className="py-16 text-center text-sm text-ink-500">
                  No hay ofertas con estos filtros.
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function OfferRow({
  offer,
  metrics,
  openMenu,
  setOpenMenu,
  onStats,
}: {
  offer: OfferRecord;
  metrics: OfferMetrics;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  onStats: () => void;
}) {
  const isMenuOpen = openMenu === offer.id;
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ left: number; top: number } | null>(null);
  const link = `${window.location.origin}/checkout?offer=${encodeURIComponent(offer.id)}`;
  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    toast.success("Copiado al portapapeles");
  };
  const toggleMenu = () => {
    if (isMenuOpen) {
      setOpenMenu(null);
      return;
    }
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 224;
      setMenuPosition({
        left: Math.max(16, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 16)),
        top: rect.bottom + 8,
      });
    }
    setOpenMenu(offer.id);
  };

  return (
    <tr className="border-b border-ink-900/10 last:border-0">
      <td className="py-4">
        <div className="flex h-14 w-28 items-center justify-center rounded-lg bg-ink-900/6">
          {offer.thumbnail ? (
            <img
              src={offer.thumbnail}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <ImageIcon />
          )}
        </div>
      </td>
      <td className="py-4 font-medium text-ink-700">{offer.title}</td>
      <td className="py-4">{offer.products}</td>
      <td className="py-4">{formatOfferPrice(offer)}</td>
      <td className="py-4">{metrics.qtySold}</td>
      <td className="py-4">
        {formatMoney(metrics.netRevenue, offer.currency)}
      </td>
      <td className="py-4">
        <button
          type="button"
          className="rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
        >
          {offer.status === "published" ? "Publicada" : "Borrador"}⌄
        </button>
      </td>
      <td className="relative py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <IconAction label="Obtener link" onClick={copyLink}>
            <LinkIcon />
          </IconAction>
          <IconAction label="Vista previa" asLink to={offer.checkoutPath}>
            <EyeIcon />
          </IconAction>
          <IconAction label="Estadísticas" onClick={onStats}>
            <BarsIcon />
          </IconAction>
          <button
            type="button"
            ref={menuButtonRef}
            onClick={toggleMenu}
            className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-600 hover:bg-ink-900/6 hover:text-ink-900"
            aria-label="Más"
          >
            <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-3 py-2 text-xs font-semibold text-cream group-hover:block">
              Más
            </span>
            <DotsIcon />
          </button>
        </div>
        {isMenuOpen && (
          <MoreMenu
            offer={offer}
            position={menuPosition}
            onClose={() => setOpenMenu(null)}
            onCopy={copyLink}
            onStats={onStats}
          />
        )}
      </td>
    </tr>
  );
}

function MoreMenu({
  offer,
  onClose,
  onCopy,
  onStats,
  position,
}: {
  offer: OfferRecord;
  onClose: () => void;
  onCopy: () => void;
  onStats: () => void;
  position: { left: number; top: number } | null;
}) {
  const itemClass =
    "flex min-h-10 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-ink-600 hover:bg-ink-900/6";
  return (
    <div
      className="fixed z-[100] w-56 overflow-hidden rounded-xl border border-ink-900/10 bg-white py-2 text-left shadow-xl"
      style={{ left: position?.left ?? 16, top: position?.top ?? 16 }}
    >
      <button type="button" className={itemClass} onClick={onCopy}>
        <LinkIcon /> Obtener link
      </button>
      <Link className={itemClass} to={offer.checkoutPath} onClick={onClose}>
        <EyeIcon /> Vista previa
      </Link>
      <button
        type="button"
        className={itemClass}
        onClick={() => {
          toast.success("Oferta duplicada");
          onClose();
        }}
      >
        <DuplicateIcon /> Duplicar
      </button>
      <button
        type="button"
        className={itemClass}
        onClick={() => {
          toast.success("Exportación preparada");
          onClose();
        }}
      >
        <DownloadIcon /> Exportar
      </button>
      <button type="button" className={itemClass} onClick={onStats}>
        <BarsIcon /> Estadísticas
      </button>
      <div className="mt-2 border-t border-ink-900/10 pt-2">
        <button
          type="button"
          className="flex min-h-10 w-full cursor-pointer items-center gap-3 px-4 text-left text-sm text-red-600 hover:bg-red-50"
          onClick={() => {
            toast.success("Opción de eliminar lista");
            onClose();
          }}
        >
          <TrashIcon /> Eliminar
        </button>
      </div>
    </div>
  );
}

function OfferStatsView({
  offer,
  metrics,
  onBack,
}: {
  offer: OfferRecord;
  metrics: OfferMetrics;
  onBack: () => void;
}) {
  const [salesRange, setSalesRange] = useState("7");
  const [purchaseRange, setPurchaseRange] = useState("7");
  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <button
        type="button"
        onClick={onBack}
        className="text-sm font-semibold text-ink-600 underline"
      >
        ← Volver a precios
      </button>
      <h1 className="font-serif text-4xl text-ink-900">
        Estadísticas de oferta
      </h1>
      <section className="grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-7 text-center shadow-sm md:grid-cols-3">
        <StatBlock
          label="Compras"
          sublabel="Últimos 30 días"
          value={String(metrics.purchasesLast30)}
        />
        <StatBlock
          label="Ingresos netos"
          sublabel="Últimos 30 días"
          value={formatCompactMoney(metrics.netRevenueLast30)}
        />
        <StatBlock
          label="Ingresos netos"
          sublabel="Todo el tiempo"
          value={formatCompactMoney(metrics.netRevenueAllTime)}
        />
      </section>

      <ChartCard
        title="Ventas totales"
        color="#22c55e"
        label="MXN"
        valuePrefix="MXN"
        data={metrics.salesSeries}
        range={salesRange}
        setRange={setSalesRange}
      />
      <ChartCard
        title="Compras totales"
        color="#06b6d4"
        label="Número de compras"
        data={metrics.purchasesSeries}
        range={purchaseRange}
        setRange={setPurchaseRange}
      />
    </div>
  );
}

function ChartCard({
  title,
  color,
  label,
  data,
  range,
  setRange,
  valuePrefix,
}: {
  title: string;
  color: string;
  label: string;
  data: Array<{ date: string; label: string; value: number }>;
  range: string;
  setRange: (range: string) => void;
  valuePrefix?: string;
}) {
  const days = Number(range);
  const visible = data.slice(-days);
  return (
    <section className="rounded-2xl border border-ink-900/10 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <select
          value={range}
          onChange={(event) => setRange(event.target.value)}
          className="min-h-11 w-72 max-w-full rounded-lg border border-ink-900/20 bg-white px-4 text-sm"
        >
          <option value="7">Últimos 7 días</option>
          <option value="30">Últimos 30 días</option>
          <option value="90">Últimos 90 días</option>
        </select>
      </div>
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-500">
        <span
          className="inline-block h-3 w-10 border"
          style={{ backgroundColor: `${color}55`, borderColor: color }}
        />
        {label}
      </div>
      <MiniLineChart data={visible} color={color} valuePrefix={valuePrefix} />
    </section>
  );
}

function MiniLineChart({
  data,
  color,
  valuePrefix,
}: {
  data: Array<{ date: string; label: string; value: number }>;
  color: string;
  valuePrefix?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = 45 + (index / Math.max(data.length - 1, 1)) * 780;
    const y = 180 - (item.value / max) * 145;
    return { ...item, x, y };
  });
  const activePoint = active !== null ? points[active] : undefined;
  const onMove = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) * 860) / rect.width;
    const ratio = Math.min(Math.max((x - 45) / 780, 0), 1);
    setActive(Math.round(ratio * Math.max(points.length - 1, 1)));
  };
  return (
    <svg
      viewBox="0 0 860 220"
      className="mt-6 h-72 w-full cursor-crosshair"
      onMouseMove={onMove}
      onMouseLeave={() => setActive(null)}
      role="img"
      aria-label="Gráfica de oferta"
    >
      {[35, 107, 180].map((y) => (
        <line key={y} x1="45" y1={y} x2="825" y2={y} stroke="#e7e1d8" />
      ))}
      <line x1="45" y1="35" x2="45" y2="180" stroke="#ddd5ca" />
      <polyline
        points={points.map((item) => `${item.x},${item.y}`).join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {points.map((item, index) => (
        <circle
          key={item.date}
          cx={item.x}
          cy={item.y}
          r={active === index ? "5" : "3"}
          fill={color}
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
      {points.map((item, index) => (
        <text
          key={item.date}
          x={item.x - 16}
          y="202"
          className="fill-ink-500 text-[11px]"
        >
          {index === 0 || index === points.length - 1 || points.length <= 8
            ? item.label
            : ""}
        </text>
      ))}
      {activePoint && (
        <g>
          <rect
            x={activePoint.x - 35}
            y={activePoint.y - 34}
            width="86"
            height="34"
            rx="6"
            fill="#2f2d2a"
          />
          <text
            x={activePoint.x - 29}
            y={activePoint.y - 20}
            className="fill-cream text-[11px]"
          >
            {activePoint.label}
          </text>
          <text
            x={activePoint.x - 29}
            y={activePoint.y - 7}
            className="fill-cream text-[11px] font-bold"
          >
            {valuePrefix
              ? `${valuePrefix}$${activePoint.value}`
              : activePoint.value}
          </text>
        </g>
      )}
    </svg>
  );
}

function StatBlock({
  label,
  sublabel,
  value,
}: {
  label: string;
  sublabel: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-base font-medium leading-tight">
        {label}
        <br />
        {sublabel}
      </p>
      <strong className="mt-4 block font-serif text-3xl">{value}</strong>
    </div>
  );
}

function UpsellsView({
  upsells,
  search,
  setSearch,
}: {
  upsells: UpsellRecord[];
  search: string;
  setSearch: (value: string) => void;
}) {
  const filtered = upsells.filter((upsell) =>
    upsell.name.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const purchasesLast30 = 0;
  const grossRevenueLast30 = upsells.reduce(() => 0, 0);
  const averageConversion = 0;

  return (
    <div className="space-y-5">
      <section className="grid gap-5 md:grid-cols-3">
        <MetricPanel
          title="Ingresos brutos · últimos 30 días"
          value={formatMoney(grossRevenueLast30, "MXN")}
        />
        <MetricPanel
          title="Tasa promedio de conversión · últimos 30 días"
          value={`${averageConversion.toFixed(1)}%`}
        />
        <MetricPanel
          title="Compras · últimos 30 días"
          value={String(purchasesLast30)}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-900/10 p-5">
          <label className="relative block w-full max-w-sm">
            <SearchIcon />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar..."
              className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-ink-900"
            />
          </label>
          <button className="min-h-11 rounded-full border border-ink-900/20 px-5 text-sm font-semibold">
            Filtro
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 bg-cream-100/50 text-xs text-ink-600">
                <th className="py-4 pl-4 font-medium">Nombre</th>
                <th className="py-4 font-medium">Ofertas</th>
                <th className="py-4 font-medium">Precio</th>
                <th className="py-4 font-medium">Ingresos netos</th>
                <th className="py-4 font-medium">Conversión</th>
                <th className="py-4 font-medium">Compras</th>
                <th className="py-4 pr-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((upsell) => (
                <tr key={upsell.id} className="border-b border-ink-900/10">
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-ink-900/6">
                        {upsell.thumbnail ? (
                          <img
                            src={upsell.thumbnail}
                            alt=""
                            className="h-full w-full rounded-lg object-cover"
                          />
                        ) : null}
                      </div>
                      <span className="max-w-xs truncate font-medium">
                        {upsell.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4">1</td>
                  <td className="py-4">
                    {formatMoney(upsell.price, upsell.currency)} pago único
                  </td>
                  <td className="py-4">{formatMoney(0, upsell.currency)}</td>
                  <td className="py-4">0.00%</td>
                  <td className="py-4">0</td>
                  <td className="py-4 pr-4">
                    <span className="rounded-full border border-emerald-400 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ● Publicado
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-14 text-center text-sm text-ink-500">
              Aún no hay upsells creados.
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-6 text-sm">
        <span>
          Mostrando{" "}
          <strong>
            {filtered.length ? "1" : "0"}–{filtered.length}
          </strong>{" "}
          de <strong>{upsells.length}</strong> resultados
        </span>
        <label className="flex items-center gap-3">
          Mostrar
          <select className="min-h-10 rounded-full border border-ink-900/20 bg-white px-4">
            <option>25</option>
            <option>50</option>
          </select>
          por página
        </label>
      </div>

      <div className="text-center">
        <button className="rounded-full border border-ink-900/20 bg-white px-5 py-2.5 text-sm">
          Conocer más sobre Upsells ↗
        </button>
      </div>
    </div>
  );
}

function NewUpsellModal({
  offers,
  onClose,
  onCreate,
}: {
  offers: OfferRecord[];
  onClose: () => void;
  onCreate: (upsell: UpsellRecord) => void;
}) {
  const [offerId, setOfferId] = useState("");
  const [name, setName] = useState("");
  const selectedOffer = offers.find((offer) => offer.id === offerId);
  const canContinue = offerId && name.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink-900/45 px-4 py-16 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl">Nuevo upsell</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-600">
              Un upsell es una oferta extra que se muestra después del checkout
              para aumentar el valor del pedido. Una vez creado, puedes
              reutilizarlo en múltiples ofertas.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="h-9 w-9 rounded-full text-xl hover:bg-ink-900/6"
          >
            ×
          </button>
        </div>

        <label className="mt-6 block text-sm font-semibold">
          Elegir una oferta
          <select
            value={offerId}
            onChange={(event) => setOfferId(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-ink-900/30 bg-white px-3"
          >
            <option value="">Elegir una opción</option>
            {offers.map((offer) => (
              <option key={offer.id} value={offer.id}>
                {offer.title}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-5 block text-sm font-semibold">
          Nombre
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-ink-900/20 px-3"
          />
          <span className="mt-2 block text-xs font-normal text-ink-500">
            Este nombre es solo para organización y no será visible para los
            clientes.
          </span>
        </label>

        <div className="mt-7 flex items-center justify-between gap-4">
          <button type="button" className="text-sm underline">
            Más información
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-ink-900/20 px-5 py-2.5 text-sm"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!canContinue}
              onClick={() => {
                if (!selectedOffer) return;
                onCreate({
                  id: crypto.randomUUID(),
                  offerId: selectedOffer.id,
                  name: name.trim(),
                  price: selectedOffer.price,
                  currency: selectedOffer.currency,
                  status: "published",
                  createdAt: new Date().toISOString(),
                  thumbnail: selectedOffer.thumbnail,
                });
              }}
              className="rounded-full bg-ink-900 px-5 py-2.5 text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:bg-ink-900/10 disabled:text-ink-400"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricPanel({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold underline decoration-dotted underline-offset-4">
        {title}
      </p>
      <strong className="mt-2 block font-serif text-2xl">{value}</strong>
    </div>
  );
}

function IconAction({
  label,
  children,
  onClick,
  asLink,
  to,
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  asLink?: boolean;
  to?: string;
}) {
  const className =
    "group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-600 hover:bg-ink-900/6 hover:text-ink-900";
  const tooltip = (
    <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink-900 px-3 py-2 text-xs font-semibold text-cream group-hover:block">
      {label}
    </span>
  );
  if (asLink && to) {
    return (
      <Link to={to} className={className}>
        {tooltip}
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {tooltip}
      {children}
    </button>
  );
}

function collectOffers(courses: Course[]): OfferRecord[] {
  return courses.flatMap((course) => {
    const courseId = course._id || course.id || course.slug;
    const stored = loadJson<
      Array<
        Partial<OfferRecord> & {
          access?: string;
          paymentType?: "free" | "one_time";
          price?: number;
        }
      >
    >(`dd-course-offers-${courseId}`, []);
    const rawOffers = stored.length
      ? stored
      : [
          {
            id: `default-${courseId}`,
            title: course.title,
            status: "published" as const,
            paymentType: Number(course.price) > 0 ? "one_time" : "free",
            price: Number(course.price) || 0,
            currency: course.currency || "MXN",
            thumbnail: course.thumbnail,
          },
        ];
    return rawOffers.map((offer) => ({
      id: String(offer.id || crypto.randomUUID()),
      courseId,
      title: String(offer.title || course.title),
      status: offer.status === "draft" ? "draft" : "published",
      products: 1,
      price: Number(offer.price || 0),
      currency: String(offer.currency || course.currency || "MXN"),
      paymentType:
        offer.paymentType === "free"
          ? "free"
          : Number(offer.price || course.price) > 0
            ? "one_time"
            : "free",
      thumbnail: String(offer.thumbnail || course.thumbnail || ""),
      courseTitle: course.title,
      checkoutPath: `/checkout?offer=${encodeURIComponent(String(offer.id || courseId))}`,
    }));
  });
}

function buildOfferMetrics(offers: OfferRecord[], orders: Order[]) {
  const map = new Map<string, OfferMetrics>();
  offers.forEach((offer) => map.set(offer.id, emptyOfferMetrics()));
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  orders
    .filter((order) => order.status === "completed")
    .forEach((order) => {
      const orderDate = new Date(order.paidAt || order.createdAt);
      order.items?.forEach((item) => {
        const offer = offers.find(
          (candidate) =>
            item.refId === candidate.id ||
            item.refId === candidate.courseId ||
            item.title === candidate.title ||
            item.title === candidate.courseTitle,
        );
        if (!offer) return;
        const metrics = map.get(offer.id) ?? emptyOfferMetrics();
        const quantity = Number(item.quantity || 1);
        const revenue = Number(item.price || order.total || 0) * quantity;
        metrics.qtySold += quantity;
        metrics.netRevenue += revenue;
        metrics.netRevenueAllTime += revenue;
        if (orderDate >= thirtyDaysAgo) {
          metrics.purchasesLast30 += quantity;
          metrics.netRevenueLast30 += revenue;
        }
        addToSeries(metrics.salesSeries, orderDate, revenue);
        addToSeries(metrics.purchasesSeries, orderDate, quantity);
        map.set(offer.id, metrics);
      });
    });
  return map;
}

function emptyOfferMetrics(): OfferMetrics {
  return {
    qtySold: 0,
    netRevenue: 0,
    purchasesLast30: 0,
    netRevenueLast30: 0,
    netRevenueAllTime: 0,
    salesSeries: buildEmptySeries(30),
    purchasesSeries: buildEmptySeries(30),
  };
}

function buildEmptySeries(days: number) {
  const now = new Date();
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (days - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: 0,
    };
  });
}

function addToSeries(
  series: Array<{ date: string; label: string; value: number }>,
  date: Date,
  value: number,
) {
  const key = date.toISOString().slice(0, 10);
  const bucket = series.find((item) => item.date === key);
  if (bucket) bucket.value += value;
}

function sumMetrics(
  metrics: Map<string, OfferMetrics>,
  key: keyof Pick<
    OfferMetrics,
    "purchasesLast30" | "netRevenueLast30" | "netRevenueAllTime"
  >,
) {
  return Array.from(metrics.values()).reduce(
    (sum, item) => sum + Number(item[key]),
    0,
  );
}

function formatOfferPrice(offer: OfferRecord) {
  if (offer.paymentType === "free" || offer.price === 0) return "Gratis";
  return `${formatMoney(offer.price, offer.currency)}${
    offer.title.toLowerCase().includes("mensual") ? " cada mes" : ""
  }`;
}

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function formatCompactMoney(amount: number) {
  return `MEX$${amount.toLocaleString("es-MX", {
    maximumFractionDigits: 0,
  })}`;
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m16 16 4 4" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-6 w-6"
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m7 17 4-4 3 3 2-2 2 3" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"
      />
      <path
        strokeLinecap="round"
        d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

function BarsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M5 19V9m7 10V5m7 14v-7" />
      <path d="M3 19h18" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <rect x="8" y="8" width="11" height="11" rx="2" />
      <path d="M5 16H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-4 w-4"
    >
      <path d="M5 7h14M9 7V5h6v2m-8 0 1 13h8l1-13" />
    </svg>
  );
}
