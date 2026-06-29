import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useOrders } from "@hooks/usePayments";
import { useUsers } from "@hooks/useUsers";
import type { Order, User } from "@t/index";

type SalesTab =
  | "overview"
  | "transactions"
  | "subscriptions"
  | "payment-plans"
  | "disputes";

interface SalesTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  title: string;
  email: string;
  customer: string;
  contactId?: string;
  date: string;
  status: "completed" | "refunded" | "failed";
  items: Order["items"];
  subscriptionId?: string;
}

interface SubscriptionRow {
  id: string;
  amount: number;
  currency: string;
  status: "active" | "canceled";
  nextPayment: string;
  email: string;
  offer: string;
  createdAt: string;
}

type SalesRange =
  | "today"
  | "7d"
  | "30d"
  | "month"
  | "3m"
  | "6m"
  | "2026"
  | "2025"
  | "all";

interface RangeOption {
  label: string;
  value: SalesRange;
}

const SALES_TABS: Array<[SalesTab, string]> = [
  ["overview", "Resumen"],
  ["transactions", "Transacciones"],
  ["subscriptions", "Suscripciones"],
  ["payment-plans", "Planes de pago"],
  ["disputes", "Disputas"],
];

const REVENUE_RANGES: RangeOption[] = [
  { label: "Hoy", value: "today" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
];

const OFFER_RANGES: RangeOption[] = [
  { label: "Este mes", value: "month" },
  { label: "3 meses", value: "3m" },
  { label: "2026", value: "2026" },
  { label: "Todo", value: "all" },
];

const CUSTOMER_RANGES: RangeOption[] = [
  { label: "6 meses", value: "6m" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "Todo", value: "all" },
];

export default function SalesPayments() {
  const [params, setParams] = useSearchParams();
  const tabParam = params.get("tab");
  const [search, setSearch] = useState("");
  const { data: orders = [], isLoading: isLoadingOrders } = useOrders();
  const { data: contactsResponse } = useUsers({ limit: 500 });
  const contacts = contactsResponse?.data ?? [];
  const transactions = useMemo(() => {
    return ordersToTransactions(orders, contacts);
  }, [orders, contacts]);
  const subscriptions = useMemo(
    () => deriveSubscriptions(transactions),
    [transactions],
  );
  const activeTab = isSalesTab(tabParam) ? tabParam : "overview";
  const changeTab = (tab: SalesTab) =>
    tab === "overview" ? setParams({}) : setParams({ tab });

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-7">
        <h1 className="font-serif text-4xl text-ink-900">Pagos</h1>
        <nav
          className="mt-5 flex gap-5 overflow-x-auto"
          aria-label="Secciones de pagos"
        >
          {SALES_TABS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => changeTab(value)}
              className={`min-h-11 shrink-0 cursor-pointer border-b-2 text-sm transition-colors ${
                activeTab === value
                  ? "border-ink-900 font-semibold text-ink-900"
                  : "border-transparent text-ink-600 hover:text-ink-900"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === "overview" && (
        <PaymentsOverview
          transactions={transactions}
          subscriptions={subscriptions}
          isLoading={isLoadingOrders}
        />
      )}
      {activeTab === "transactions" && (
        <TransactionsTab
          transactions={transactions}
          search={search}
          setSearch={setSearch}
        />
      )}
      {activeTab === "subscriptions" && (
        <SubscriptionsTab
          subscriptions={subscriptions}
          search={search}
          setSearch={setSearch}
        />
      )}
      {activeTab === "payment-plans" && (
        <EmptySalesState
          search={search}
          setSearch={setSearch}
          title="Aún no hay planes de pago"
          description="Cuando tus clientes compren ofertas con plan de pagos, aparecerán aquí."
          searchPlaceholder="Buscar planes de pago..."
          filters
        />
      )}
      {activeTab === "disputes" && (
        <EmptySalesState
          search={search}
          setSearch={setSearch}
          title="No hay pagos disputados"
          description="Los pagos autorizados en disputa aparecerán aquí."
          searchPlaceholder="Buscar disputas..."
          filters
          exportButton
        />
      )}
    </div>
  );
}

function PaymentsOverview({
  transactions,
  subscriptions,
  isLoading,
}: {
  transactions: SalesTransaction[];
  subscriptions: SubscriptionRow[];
  isLoading: boolean;
}) {
  const [revenueRange, setRevenueRange] = useState<SalesRange>("30d");
  const [offerRange, setOfferRange] = useState<SalesRange>("month");
  const [customerRange, setCustomerRange] = useState<SalesRange>("6m");
  const completedTransactions = transactions.filter(
    (item) => item.status === "completed",
  );
  const revenueTransactions = filterTransactionsByRange(
    completedTransactions,
    revenueRange,
  );
  const offerTransactions = filterTransactionsByRange(
    completedTransactions,
    offerRange,
  );
  const customerTransactions = filterTransactionsByRange(
    completedTransactions,
    customerRange,
  );
  const grossRevenue = revenueTransactions.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const customers = summarizeCustomers(customerTransactions);
  const topOffers = summarizeOffers(offerTransactions);
  const chartData = buildRevenueSeries(
    revenueTransactions,
    getRangeDays(revenueRange),
  );
  const selectedRevenueLabel = getRangeLabel(REVENUE_RANGES, revenueRange);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="border-b border-ink-900/10 p-7">
          <select className="min-h-11 rounded-lg border border-ink-900/20 bg-white px-4 text-sm">
            <option>Ingresos brutos</option>
            <option>Ingresos netos</option>
          </select>
        </div>
        <div className="p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="font-serif text-3xl font-semibold">
                {formatMoney(grossRevenue, "MXN")}
              </p>
              <select className="min-h-10 rounded-lg border border-ink-900/20 bg-white px-3 text-sm">
                <option>MXN</option>
                <option>USD</option>
              </select>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select className="min-h-10 rounded-lg border border-ink-900/20 bg-white px-3 text-sm">
                <option>Diario</option>
                <option>Semanal</option>
                <option>Mensual</option>
              </select>
              <div className="overflow-hidden rounded-lg border border-ink-900/20 text-sm">
                {REVENUE_RANGES.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRevenueRange(option.value)}
                    aria-pressed={revenueRange === option.value}
                    className={`min-h-10 cursor-pointer px-4 transition-colors ${
                      revenueRange === option.value
                        ? "bg-ink-900 text-cream"
                        : "bg-white hover:bg-cream-100"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="Elegir fechas"
                className="flex min-h-10 w-11 cursor-pointer items-center justify-center rounded-lg border border-ink-900/20"
              >
                <CalendarIcon />
              </button>
            </div>
          </div>
          <RevenueChart data={chartData} />
          {isLoading && (
            <p className="mt-3 text-sm text-ink-500">Cargando pagos reales…</p>
          )}
          {!isLoading && transactions.length === 0 && (
            <p className="mt-3 text-sm text-ink-500">
              Aún no hay pagos registrados desde el backend.
            </p>
          )}
          <div className="mt-4 text-right">
            <Link to="?tab=transactions" className="text-sm underline">
              Ver transacciones
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-4">
        <MetricCard
          title="Transacciones"
          value={String(revenueTransactions.length)}
          note={selectedRevenueLabel}
          to="?tab=transactions"
        />
        <MetricCard
          title="Suscripciones"
          value={String(subscriptions.length)}
          note="Suscripciones activas"
          to="?tab=subscriptions"
        />
        <MetricCard
          title="Planes de pago"
          value="0"
          note="Planes activos"
          to="?tab=payment-plans"
        />
        <MetricCard
          title="Disputas"
          value="0"
          note="Necesitan respuesta"
          to="?tab=disputes"
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel
          title="Ofertas más vendidas"
          footer={
            <Link to="/admin/productos" className="text-sm underline">
              Ver ofertas
            </Link>
          }
        >
          <PillFilters
            options={OFFER_RANGES}
            active={offerRange}
            onChange={setOfferRange}
          />
          <TopOffers offers={topOffers} />
        </Panel>
        <Panel
          title="Mejores clientes"
          footer={
            <Link to="/admin/contactos" className="text-sm underline">
              Ver contactos
            </Link>
          }
        >
          <PillFilters
            options={CUSTOMER_RANGES}
            active={customerRange}
            onChange={setCustomerRange}
          />
          <TopCustomers customers={customers} />
        </Panel>
      </div>

      <Panel
        title="Transacciones recientes"
        footer={
          <Link to="?tab=transactions" className="text-sm underline">
            Todas las transacciones
          </Link>
        }
      >
        <SimpleTransactionsTable
          transactions={revenueTransactions.slice(0, 10)}
        />
      </Panel>
    </div>
  );
}

function TransactionsTab({
  transactions,
  search,
  setSearch,
}: {
  transactions: SalesTransaction[];
  search: string;
  setSearch: (value: string) => void;
}) {
  const filtered = filterTransactions(transactions, search);
  return (
    <Panel>
      <Toolbar
        search={search}
        setSearch={setSearch}
        placeholder="Buscar transacciones..."
        filters
        exportButton
      />
      <SimpleTransactionsTable transactions={filtered} detailed />
    </Panel>
  );
}

function SubscriptionsTab({
  subscriptions,
  search,
  setSearch,
}: {
  subscriptions: SubscriptionRow[];
  search: string;
  setSearch: (value: string) => void;
}) {
  const filtered = subscriptions.filter(
    (item) =>
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.offer.toLowerCase().includes(search.toLowerCase()),
  );
  const monthlyRecurringRevenue = subscriptions.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const newLast30Days = subscriptions.filter(
    (item) => daysBetween(new Date(item.createdAt), new Date()) <= 30,
  ).length;
  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard
          title="Ingresos recurrentes mensuales"
          value={formatMoney(monthlyRecurringRevenue, "MXN")}
          note="MXN"
        />
        <MetricCard
          title="Nuevas suscripciones · últimos 30 días"
          value={String(newLast30Days)}
          note=""
        />
        <MetricCard title="Canceladas · últimos 30 días" value="0" note="" />
      </div>
      <Panel>
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm">
            Mostrando <strong>1–{filtered.length}</strong> de{" "}
            <strong>{subscriptions.length}</strong> suscripciones
          </p>
          <Toolbar
            search={search}
            setSearch={setSearch}
            placeholder="Buscar suscripciones..."
            filters
            compact
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-900/15 text-xs text-ink-600">
                <th className="py-3 font-medium">Monto</th>
                <th className="py-3 font-medium">Estado</th>
                <th className="py-3 font-medium">Siguiente pago</th>
                <th className="py-3 font-medium">Email</th>
                <th className="py-3 font-medium">Oferta</th>
                <th className="py-3 font-medium">Creada</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-ink-900/8 last:border-0"
                >
                  <td className="py-5 font-semibold">
                    {formatMoney(item.amount, item.currency)}
                  </td>
                  <td className="py-5">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                      Activa
                    </span>
                  </td>
                  <td className="py-5">{formatDate(item.nextPayment)}</td>
                  <td className="py-5 text-ink-600">{item.email}</td>
                  <td className="py-5 text-ink-600">{item.offer}</td>
                  <td className="py-5 text-ink-600">
                    {formatDateTime(item.createdAt)}
                  </td>
                  <td className="py-5 text-right">•••</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination />
      </Panel>
    </div>
  );
}

function EmptySalesState({
  search,
  setSearch,
  title,
  description,
  searchPlaceholder,
  filters,
  exportButton,
}: {
  search: string;
  setSearch: (value: string) => void;
  title: string;
  description: string;
  searchPlaceholder: string;
  filters?: boolean;
  exportButton?: boolean;
}) {
  return (
    <Panel>
      <Toolbar
        search={search}
        setSearch={setSearch}
        placeholder={searchPlaceholder}
        filters={filters}
        exportButton={exportButton}
      />
      <div className="flex min-h-72 flex-col items-center justify-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-300 text-white">
          <WalletIcon large />
        </div>
        <h2 className="mt-5 font-serif text-2xl text-ink-900">{title}</h2>
        <p className="mt-3 text-sm text-ink-500">{description}</p>
        <button type="button" className="mt-6 text-sm underline">
          Más información
        </button>
      </div>
    </Panel>
  );
}

function Toolbar({
  search,
  setSearch,
  placeholder,
  filters,
  exportButton,
  compact,
}: {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
  filters?: boolean;
  exportButton?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 ${compact ? "" : "mb-8 justify-end"}`}
    >
      <label className="relative block w-full max-w-sm">
        <span className="sr-only">{placeholder}</span>
        <MiniSearchIcon />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder={placeholder}
          className="min-h-11 w-full rounded-lg border border-ink-900/20 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-ink-900"
        />
      </label>
      {filters && (
        <button
          type="button"
          className="relative min-h-11 rounded-full border border-ink-900/20 px-4 text-sm"
        >
          Filtros
          <span className="absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[11px] text-cream">
            1
          </span>
        </button>
      )}
      {exportButton && (
        <button
          type="button"
          className="min-h-11 rounded-full border border-ink-900/20 px-4 text-sm"
        >
          Exportar
        </button>
      )}
      <button
        type="button"
        aria-label="Más opciones"
        className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/20"
      >
        •••
      </button>
    </div>
  );
}

function Panel({
  title,
  children,
  footer,
}: {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm">
      {title && <h2 className="font-serif text-xl text-ink-900">{title}</h2>}
      <div className={title ? "mt-5" : ""}>{children}</div>
      {footer && (
        <div className="mt-5 flex items-center justify-between text-xs text-ink-500">
          {footer}
          <span>Actualizado 12:35 PM</span>
        </div>
      )}
    </section>
  );
}

function MetricCard({
  title,
  value,
  note,
  to,
}: {
  title: string;
  value: string;
  note: string;
  to?: string;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-semibold">{title}</p>
        {to && (
          <span className="rounded-full bg-ink-900/6 px-2.5 py-1 text-[11px] font-semibold text-ink-600 transition-colors group-hover:bg-ink-900 group-hover:text-cream">
            Abrir
          </span>
        )}
      </div>
      <div className="mt-3 flex items-end gap-2">
        <strong className="font-serif text-3xl">{value}</strong>
        {note && <span className="pb-1 text-xs text-ink-500">{note}</span>}
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className="group block rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ink-900/25 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/40 motion-reduce:hover:translate-y-0"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
      {content}
    </div>
  );
}

function SimpleTransactionsTable({
  transactions,
  detailed,
}: {
  transactions: SalesTransaction[];
  detailed?: boolean;
}) {
  if (transactions.length === 0) {
    return (
      <div className="flex min-h-48 items-center justify-center text-sm text-ink-500">
        No hay transacciones para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-ink-900/15 text-xs text-ink-600">
            <th className="py-3 font-medium">Monto</th>
            <th className="py-3 font-medium">Título</th>
            {detailed && <th className="py-3 font-medium">Cliente</th>}
            <th className="py-3 font-medium">Fecha</th>
            {detailed && <th className="py-3" />}
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr
              key={item.id}
              className="border-b border-ink-900/8 last:border-0"
            >
              <td className="py-5 font-semibold">
                {formatMoney(item.amount, item.currency)}
              </td>
              <td className="py-5 text-ink-700">{item.title}</td>
              {detailed && (
                <td className="py-5 text-ink-600">
                  <strong className="block text-ink-900">
                    {item.customer}
                  </strong>
                  {item.email}
                </td>
              )}
              <td className="py-5 text-ink-600">{formatDate(item.date)}</td>
              {detailed && <td className="py-5 text-right">•••</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RevenueChart({
  data,
}: {
  data: Array<{ label: string; value: number; date: string }>;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartWidth = 828;
  const chartLeft = 52;
  const chartBottom = 220;
  const chartHeight = 185;
  const safeLength = Math.max(data.length - 1, 1);
  const chartPoints = data.map((item, index) => {
    const x = chartLeft + (index / safeLength) * chartWidth;
    const y = chartBottom - (item.value / maxValue) * chartHeight;
    return { ...item, x, y };
  });
  const points = chartPoints
    .map((item) => `${item.x.toFixed(1)},${item.y.toFixed(1)}`)
    .join(" ");
  const startLabel = data[0]?.label ?? "";
  const endLabel = data[data.length - 1]?.label ?? "";
  const activePoint =
    activeIndex !== null ? chartPoints[activeIndex] : undefined;
  const tooltipWidth = activePoint
    ? Math.max(104, activePoint.label.length * 7 + 86)
    : 0;
  const tooltipX = activePoint
    ? Math.min(Math.max(activePoint.x + 12, 64), 890 - tooltipWidth)
    : 0;
  const tooltipY = activePoint
    ? Math.min(Math.max(activePoint.y + 18, 36), 206)
    : 0;

  const handlePointerMove = (event: MouseEvent<SVGSVGElement>) => {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const scaleX = 900 / rect.width;
    const cursorX = (event.clientX - rect.left) * scaleX;
    const boundedX = Math.min(
      Math.max(cursorX, chartLeft),
      chartLeft + chartWidth,
    );
    const ratio = (boundedX - chartLeft) / chartWidth;
    const nearestIndex = Math.round(ratio * safeLength);
    setActiveIndex(Math.min(Math.max(nearestIndex, 0), data.length - 1));
  };

  return (
    <div className="mt-10 h-72">
      <svg
        viewBox="0 0 900 260"
        className="h-full w-full cursor-crosshair overflow-visible"
        role="img"
        aria-label="Gráfica interactiva de ingresos"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => setActiveIndex(null)}
      >
        <text x="0" y="28" className="fill-ink-400 text-[12px]">
          {formatMoney(maxValue, "MXN")}
        </text>
        <text x="0" y="222" className="fill-ink-400 text-[12px]">
          {formatMoney(0, "MXN")}
        </text>
        <line
          x1={chartLeft}
          y1={chartBottom}
          x2={chartLeft + chartWidth}
          y2={chartBottom}
          stroke="#d8d1c7"
        />
        <rect
          x={chartLeft}
          y="20"
          width={chartWidth}
          height="210"
          fill="transparent"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#1177ff"
          strokeWidth="2.5"
        />
        {chartPoints.map((item, index) => {
          if (item.value <= 0) return null;
          const isActive = activeIndex === index;
          return (
            <circle
              key={item.date}
              cx={item.x}
              cy={item.y}
              r={isActive ? "6" : "3"}
              className={
                isActive
                  ? "fill-[#1177ff] stroke-ink-900"
                  : "fill-white stroke-[#1177ff]"
              }
              strokeWidth={isActive ? "3" : "2"}
              onMouseEnter={() => setActiveIndex(index)}
            />
          );
        })}
        {activePoint && (
          <g aria-hidden="true">
            <line
              x1={activePoint.x}
              y1="20"
              x2={activePoint.x}
              y2={chartBottom}
              stroke="#2f2d2a"
              strokeWidth="1"
              opacity="0.25"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r="6"
              fill="#1177ff"
              stroke="#111"
              strokeWidth="3"
            />
            <rect
              x={tooltipX}
              y={tooltipY}
              width={tooltipWidth}
              height="32"
              rx="8"
              fill="#2f2d2a"
            />
            <text
              x={tooltipX + 10}
              y={tooltipY + 20}
              className="fill-cream text-[12px]"
            >
              <tspan>{activePoint.label}: </tspan>
              <tspan fontWeight="700">
                {formatChartTooltipMoney(activePoint.value)}
              </tspan>
            </text>
          </g>
        )}
        <text x="34" y="238" className="fill-ink-400 text-[12px]">
          {startLabel}
        </text>
        <text x="850" y="238" className="fill-ink-400 text-[12px]">
          {endLabel}
        </text>
      </svg>
    </div>
  );
}

function PillFilters({
  options,
  active,
  onChange,
}: {
  options: RangeOption[];
  active: SalesRange;
  onChange: (value: SalesRange) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={active === option.value}
          className={`min-h-8 cursor-pointer rounded-full px-4 text-xs font-semibold transition-colors ${
            active === option.value
              ? "bg-ink-900 text-cream"
              : "bg-ink-900/6 text-ink-900 hover:bg-ink-900/10"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function TopOffers({ offers }: { offers: ReturnType<typeof summarizeOffers> }) {
  if (offers.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center text-sm text-ink-500">
        No hay ventas reales de ofertas todavía.
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {offers.slice(0, 5).map((offer, index) => (
        <div
          key={offer.title}
          className="flex items-center justify-between gap-4 rounded-xl border border-ink-900/10 p-4"
        >
          <div>
            <p className="text-sm font-semibold text-ink-900">
              {index + 1}. {offer.title}
            </p>
            <p className="text-xs text-ink-500">
              {offer.sales} venta{offer.sales === 1 ? "" : "s"}
            </p>
          </div>
          <strong>{formatMoney(offer.total, "MXN")}</strong>
        </div>
      ))}
    </div>
  );
}

function TopCustomers({
  customers,
}: {
  customers: ReturnType<typeof summarizeCustomers>;
}) {
  const top = customers.slice(0, 4);
  if (top.length === 0) {
    return (
      <div className="flex min-h-72 items-center justify-center text-sm text-ink-500">
        No hay clientes con pagos reales todavía.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid gap-4 text-center sm:grid-cols-3">
        {top.slice(0, 3).map((customer, index) => (
          <div key={customer.email}>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-ink-900/20 bg-white">
              <UserIcon />
            </div>
            <p className="mt-2 truncate text-sm font-semibold">
              {customer.name}
            </p>
            <p className="truncate text-xs text-ink-500">{customer.email}</p>
            <p className="mt-1 font-semibold">
              {formatMoney(customer.total, "MXN")}
            </p>
            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-300 text-[11px]">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
      {top[3] && (
        <div className="mt-6 flex items-center justify-between border-t border-ink-900/10 py-4 text-sm">
          <span>4</span>
          <span className="flex items-center gap-3">
            <UserIcon /> {top[3].name}
          </span>
          <strong>{formatMoney(top[3].total, "MXN")}</strong>
        </div>
      )}
    </div>
  );
}

function Pagination() {
  return (
    <div className="mt-6 flex justify-end gap-3">
      <button type="button" className="h-10 w-10 rounded-full text-ink-400">
        ‹
      </button>
      <button type="button" className="h-10 w-10 rounded-full bg-ink-900/5">
        1
      </button>
      <button type="button" className="h-10 w-10 rounded-full text-ink-400">
        ›
      </button>
    </div>
  );
}

function ordersToTransactions(
  orders: Order[],
  contacts: User[],
): SalesTransaction[] {
  return orders
    .slice()
    .sort(
      (a, b) =>
        new Date(b.paidAt || b.createdAt).getTime() -
        new Date(a.paidAt || a.createdAt).getTime(),
    )
    .map((order) => {
      const orderId = String(order._id || order.id || crypto.randomUUID());
      const contact = resolveOrderContact(order, contacts);
      return {
        id: order.paymentIntentId || orderId,
        orderId,
        amount: Number(order.total || 0),
        currency: order.currency || "MXN",
        title: order.items?.map((item) => item.title).join(", ") || "Compra",
        email: contact.email,
        customer: contact.name,
        contactId: contact.id,
        date: order.paidAt || order.createdAt,
        status: mapOrderStatus(order.status),
        items: order.items || [],
        subscriptionId: order.subscriptionId,
      };
    });
}

function filterTransactionsByRange(
  transactions: SalesTransaction[],
  range: SalesRange,
) {
  if (range === "all") return transactions;

  const now = new Date();
  const start = new Date(now);

  if (range === "today") {
    start.setHours(0, 0, 0, 0);
    return transactions.filter((item) => new Date(item.date) >= start);
  }

  if (range === "7d" || range === "30d" || range === "3m" || range === "6m") {
    start.setDate(now.getDate() - (getRangeDays(range) - 1));
    start.setHours(0, 0, 0, 0);
    return transactions.filter((item) => new Date(item.date) >= start);
  }

  if (range === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    return transactions.filter((item) => new Date(item.date) >= start);
  }

  const year = Number(range);
  return transactions.filter(
    (item) => new Date(item.date).getFullYear() === year,
  );
}

function getRangeDays(range: SalesRange) {
  if (range === "today") return 1;
  if (range === "7d") return 7;
  if (range === "30d") return 30;
  if (range === "3m") return 90;
  if (range === "6m") return 180;
  if (range === "month") return new Date().getDate();
  return 365;
}

function getRangeLabel(options: RangeOption[], value: SalesRange) {
  return options.find((option) => option.value === value)?.label ?? "Periodo";
}

function filterTransactions(transactions: SalesTransaction[], search: string) {
  const query = search.trim().toLowerCase();
  return query
    ? transactions.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.customer.toLowerCase().includes(query),
      )
    : transactions;
}

function summarizeCustomers(transactions: SalesTransaction[]) {
  const map = new Map<
    string,
    { name: string; email: string; total: number; contactId?: string }
  >();
  transactions.forEach((item) => {
    const key = item.contactId || item.email || item.customer;
    const current = map.get(key) ?? {
      name: item.customer,
      email: item.email,
      total: 0,
      contactId: item.contactId,
    };
    current.total += item.amount;
    map.set(key, current);
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function summarizeOffers(transactions: SalesTransaction[]) {
  const map = new Map<
    string,
    { title: string; total: number; sales: number }
  >();
  transactions.forEach((transaction) => {
    const items = transaction.items.length
      ? transaction.items
      : [
          {
            title: transaction.title,
            price: transaction.amount,
            quantity: 1,
            type: "order",
            refId: transaction.orderId,
          },
        ];
    items.forEach((item) => {
      const title = item.title || "Oferta sin nombre";
      const current = map.get(title) ?? { title, total: 0, sales: 0 };
      current.total += Number(item.price || 0) * Number(item.quantity || 1);
      current.sales += Number(item.quantity || 1);
      map.set(title, current);
    });
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

function deriveSubscriptions(
  transactions: SalesTransaction[],
): SubscriptionRow[] {
  const recurringMap = new Map<string, SalesTransaction[]>();

  transactions
    .filter((item) => item.status === "completed")
    .forEach((item) => {
      const key =
        item.subscriptionId || `${item.contactId || item.email}:${item.title}`;
      const current = recurringMap.get(key) ?? [];
      current.push(item);
      recurringMap.set(key, current);
    });

  return Array.from(recurringMap.entries())
    .filter(([, items]) => items[0]?.subscriptionId || items.length >= 2)
    .map(([key, items]) => {
      const sorted = items.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      return {
        id: first.subscriptionId || key,
        amount: last.amount,
        currency: last.currency,
        status: "active" as const,
        nextPayment: addDays(last.date, estimateIntervalDays(sorted)),
        email: last.email,
        offer: last.title,
        createdAt: first.date,
      };
    });
}

function buildRevenueSeries(transactions: SalesTransaction[], days: number) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const buckets = new Map<string, number>();
  Array.from({ length: days }).forEach((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    buckets.set(toDateKey(date), 0);
  });

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = toDateKey(date);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) || 0) + transaction.amount);
    }
  });

  return Array.from(buckets.entries()).map(([date, value]) => ({
    date,
    value,
    label: new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));
}

function resolveOrderContact(order: Order, contacts: User[]) {
  const embeddedUser =
    typeof order.user === "object"
      ? order.user
      : typeof order.customer === "object"
        ? order.customer
        : undefined;
  const relatedId =
    getUserId(embeddedUser) ||
    order.userId ||
    order.customerId ||
    order.contactId ||
    (typeof order.user === "string" ? order.user : undefined) ||
    (typeof order.customer === "string" ? order.customer : undefined);
  const relatedEmail =
    order.customerEmail ||
    embeddedUser?.email ||
    findStringValue(order, ["email", "customer_email"]);
  const relatedName =
    order.customerName ||
    embeddedUser?.name ||
    findStringValue(order, ["name", "customer_name"]);
  const contact = contacts.find((item) => {
    const id = getUserId(item);
    return (
      (relatedId && id === relatedId) ||
      (relatedEmail && item.email?.toLowerCase() === relatedEmail.toLowerCase())
    );
  });

  return {
    id: contact ? getUserId(contact) : relatedId,
    name: contact?.name || relatedName || "Cliente no asociado",
    email: contact?.email || relatedEmail || "sin-email",
  };
}

function mapOrderStatus(status: Order["status"]): SalesTransaction["status"] {
  if (status === "refunded") return "refunded";
  if (status === "completed") return "completed";
  return "failed";
}

function getUserId(user?: User) {
  return user?._id || user?.id;
}

function findStringValue(source: unknown, keys: string[]) {
  if (!source || typeof source !== "object") return undefined;
  const record = source as Record<string, unknown>;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function estimateIntervalDays(items: SalesTransaction[]) {
  if (items.length < 2) return 30;
  const last = new Date(items[items.length - 1].date);
  const prev = new Date(items[items.length - 2].date);
  const diff = Math.max(daysBetween(prev, last), 1);
  return diff;
}

function addDays(value: string, days: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function daysBetween(start: Date, end: Date) {
  return Math.floor(
    Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );
}

function toDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function isSalesTab(value: string | null): value is SalesTab {
  return SALES_TABS.some(([tab]) => tab === value);
}

function formatMoney(amount: number, currency: string) {
  return `${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${currency}`;
}

function formatChartTooltipMoney(amount: number) {
  return `${amount.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} $`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function MiniSearchIcon() {
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

function CalendarIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path strokeLinecap="round" d="M8 3v4m8-4v4M4 10h16" />
    </svg>
  );
}

function WalletIcon({ large = false }: { large?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className={large ? "h-10 w-10" : "h-5 w-5"}
    >
      <path d="M5 7h14v11H5z" />
      <path d="M7 7V5h10v2" />
      <circle cx="15" cy="12.5" r="1.5" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-5 w-5"
    >
      <circle cx="12" cy="8" r="3" />
      <path strokeLinecap="round" d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  );
}
