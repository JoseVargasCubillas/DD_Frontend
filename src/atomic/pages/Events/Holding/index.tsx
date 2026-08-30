import { useNavigate } from "react-router-dom";
import { useCartStore } from "@store/cartStore";
import type { OrderItem } from "@t/index";
import holdingPoster from "../../../../../assets/eventos/evento-holding.png";

const HOLDING_CHECKOUT_ITEM: OrderItem & { id: string } = {
  id: "event-holding-masterclass-2026",
  type: "event",
  refId: "holding-masterclass-2026",
  title: "Holding · El legado de los empresarios",
  price: 4997,
  quantity: 1,
  currency: "MXN",
  paymentType: "one_time",
};

const problemCards = [
  {
    title: "Fiscalización",
    italic: "agresiva.",
    body:
      "El SAT implementa Big Data, Machine Learning e IA para detectar irregularidades. Las revisiones son más frecuentes y sofisticadas que nunca.",
  },
  {
    title: "Certificados",
    italic: "bloqueados.",
    body:
      "Empresas quedan paralizadas sin poder facturar por restricciones de CSD. Sin facturación, no hay operación.",
  },
  {
    title: "Cuentas",
    italic: "inmovilizadas.",
    body:
      "Bloqueos bancarios repentinos por UIF, SAT o IMSS afectan el flujo de efectivo y pueden paralizar tu negocio.",
  },
  {
    title: "Patrimonio",
    italic: "expuesto.",
    body:
      "Tener todo en una sola empresa significa que cualquier contingencia pone en riesgo todos tus activos.",
  },
  {
    title: "Sucesión",
    italic: "sin plan.",
    body:
      "Sin estructura adecuada, heredar tu empresa significa una carga fiscal brutal para tus herederos.",
  },
  {
    title: "Carga fiscal",
    italic: "excesiva.",
    body:
      "Pagando más impuestos de lo necesario por no tener la estructura corporativa correcta.",
  },
];

const syllabus = [
  {
    title: "Riesgos jurídico-fiscales",
    italic: "2026.",
    description:
      "Entiende las nuevas reglas del juego. El SAT ha cambiado su estrategia y debes estar preparado.",
    items: [
      "Plan Maestro de Fiscalización 2026 del SAT.",
      "Combate a facturas falsas: qué hacer si te señalan.",
      "Restricción y cancelación de CSD: cómo evitarlo.",
      "Bloqueo de cuentas bancarias: causas y soluciones.",
      "Visitas domiciliarias express: 24 días que pueden cambiar todo.",
      "Nuevos delitos fiscales y responsabilidad de socios.",
    ],
  },
  {
    title: "Estructura",
    italic: "Holding.",
    description:
      "La estrategia que usan los empresarios más sofisticados para proteger su patrimonio y optimizar impuestos.",
    items: [
      "Qué es un Holding y por qué lo necesitas.",
      "Protección patrimonial: separa riesgos de activos.",
      "Cómo diseñar tu estructura corporativa ideal.",
      "Beneficios fiscales del Holding: reglas, límites y escenarios.",
      "Planeación sucesoria eficiente.",
      "Casos prácticos y estructuras reales.",
    ],
  },
  {
    title: "Diagnóstico del",
    italic: "empresario.",
    description:
      "Evalúa dónde estás parado y qué necesitas hacer para preparar tu empresa para el futuro.",
    items: [
      "Salud financiera de tu empresa.",
      "Nivel de profesionalización del dueño.",
      "Predictibilidad del negocio.",
      "Orden patrimonial personal.",
      "Gobernanza familiar y empresarial.",
      "Plan de acción personalizado.",
    ],
  },
];

const metaItems = [
  ["Fecha", "Martes 22 de septiembre."],
  ["Modalidad", "Vía online."],
  ["Cupo", "Limitado."],
];

function SectionHeader({
  title,
  italic,
  body,
  tag,
  dark = false,
}: {
  title: string;
  italic?: string;
  body?: string;
  tag: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`grid gap-8 border-b pb-8 lg:grid-cols-[minmax(0,720px)_auto] ${
        dark ? "border-white/20" : "border-cream-400"
      }`}
    >
      <div>
        <h2
          className={`font-serif text-[42px] font-normal leading-[1.02] tracking-[-0.035em] sm:text-[56px] lg:text-[64px] ${
            dark ? "text-cream-100" : "text-ink-900"
          }`}
        >
          {title}
          {italic ? (
            <>
              {" "}
              <span className="italic">{italic}</span>
            </>
          ) : null}
        </h2>
        {body ? (
          <p
            className={`mt-5 max-w-[680px] text-[15px] leading-[1.7] sm:text-[16px] ${
              dark ? "text-cream-200/75" : "text-ink-500"
            }`}
          >
            {body}
          </p>
        ) : null}
      </div>
      <p
        className={`text-left text-[10px] font-bold uppercase leading-[1.7] tracking-[0.24em] lg:pt-4 lg:text-right ${
          dark ? "text-cream-200/55" : "text-ink-400"
        }`}
      >
        {tag}
      </p>
    </div>
  );
}

export default function HoldingLanding() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clear);

  const scrollToInvestment = () => {
    document.getElementById("holding-asegura-tu-lugar")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const startHoldingCheckout = () => {
    clearCart();
    addItem(HOLDING_CHECKOUT_ITEM);
    navigate("/eventos/checkout");
  };

  return (
    <main className="overflow-hidden bg-cream-100 text-ink-900">
      <section className="relative overflow-hidden bg-ink-900 text-cream-100">
        <div className="border-b border-cream-100 bg-cream-100 px-5 py-4 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-ink-900 sm:px-8">
          Cupos limitados <span className="mx-3 text-ink-400">.</span> Blinda
          tu patrimonio
        </div>
        <div className="pointer-events-none absolute right-[-18%] top-[-24%] h-[620px] w-[620px] rounded-full bg-[#8a6a3d]/20 blur-3xl" />
        <div className="mx-auto grid max-w-[1312px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-16 lg:px-12 lg:py-24 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <div className="mb-10 flex flex-col gap-3 border-b border-cream-100/20 pb-5 text-[10px] font-bold uppercase tracking-[0.28em] text-cream-200/55 sm:flex-row sm:items-center sm:justify-between">
              <span>. Masterclass exclusiva 2026</span>
              <span>Vol. II . Legado</span>
            </div>
            <h1 className="font-serif text-[86px] font-normal leading-[0.9] tracking-[-0.05em] text-cream-100 sm:text-[132px] lg:text-[180px] xl:text-[200px]">
              Holding<span className="italic">.</span>
            </h1>
            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.32em] text-cream-200/65">
              - El legado de los empresarios
            </p>
            <p className="mt-10 max-w-[650px] text-[16px] leading-[1.75] text-cream-200/80">
              Protege tu patrimonio, estructura tu empresa y construye un legado
              que trascienda. Descubre las estrategias fiscales y estructuras que
              los empresarios exitosos están implementando en 2026.
            </p>

            <div className="mt-10 grid gap-6 border-y border-cream-100/20 py-6 sm:grid-cols-3">
              {metaItems.map(([label, value]) => (
                <div key={label}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-cream-200/50">
                    - {label}
                  </p>
                  <p className="mt-2 font-serif text-[18px] italic text-cream-100">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={scrollToInvestment}
              className="mt-9 inline-flex min-h-12 items-center justify-center border border-cream-100 bg-cream-100 px-7 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-900 transition hover:-translate-y-0.5 hover:bg-cream-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-100"
            >
              Asegura tu lugar ahora <span className="ml-4 font-serif italic">→</span>
            </button>
          </div>

          <div className="self-center lg:self-end">
            <div className="border border-cream-100/20 bg-ink-800 p-4 shadow-[0_32px_90px_rgba(0,0,0,0.45)]">
              <img
                src={holdingPoster}
                alt="Evento Holding de Diego Díaz"
                className="aspect-square w-full object-contain"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1312px]">
          <SectionHeader
            title="Reconoces estos problemas"
            italic="en tu empresa?"
            body="El 2026 trae reglas fiscales más agresivas. Tu empresa puede estar en riesgo y muchos empresarios todavía no lo están viendo con claridad."
            tag={"El riesgo real\nen 2026"}
          />
        </div>
        <div className="mx-auto mt-14 grid max-w-[1312px] border border-cream-400 bg-cream-400 sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map((card, index) => (
            <article
              key={card.title}
              className="group min-h-[252px] border-cream-400 bg-cream-100 p-7 transition duration-300 hover:-translate-y-1 hover:bg-cream-200 sm:p-9"
              style={{ transitionDelay: `${Math.min(index * 45, 180)}ms` }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#6b4f2a]">
                0{index + 1}
              </p>
              <h3 className="mt-7 font-serif text-[28px] font-normal leading-[1.08] tracking-[-0.025em] transition-colors group-hover:text-[#6b4f2a]">
                {card.title} <span className="italic">{card.italic}</span>
              </h3>
              <p className="mt-5 text-[14px] leading-[1.65] text-ink-500">
                {card.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 text-center sm:px-8 lg:px-12 lg:pb-32">
        <div className="mx-auto max-w-[980px]">
          <h2 className="font-serif text-[42px] font-normal leading-[1.05] tracking-[-0.035em] sm:text-[58px] lg:text-[66px]">
            No dejes que estos problemas destruyan lo que tanto{" "}
            <span className="italic">te costó construir.</span>
          </h2>
          <p className="mt-5 font-serif text-[18px] italic text-ink-500">
            Inscríbete ahora y descubre cómo protegerte.
          </p>
          <button
            type="button"
            onClick={scrollToInvestment}
            className="mt-9 inline-flex min-h-12 items-center justify-center bg-ink-900 px-8 text-[11px] font-bold uppercase tracking-[0.22em] text-cream-100 transition hover:-translate-y-0.5 hover:bg-[#6b4f2a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            Asegura tu lugar ahora <span className="ml-4 font-serif italic">→</span>
          </button>
        </div>
      </section>

      <section className="bg-ink-900 px-5 py-20 text-cream-100 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1312px]">
          <SectionHeader
            title="Temario"
            italic="."
            body="Un temario completo diseñado para transformar la manera en que proteges y estructuras tu patrimonio empresarial."
            tag={"Tres bloques\nsecuenciales"}
            dark
          />

          <div className="mt-14 border border-cream-100/20">
            {syllabus.map((block, index) => (
              <article
                key={block.title}
                className="grid gap-9 border-b border-cream-100/20 bg-ink-900 p-7 transition-colors last:border-b-0 hover:bg-ink-700 sm:p-10 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] lg:gap-16 lg:p-12"
              >
                <div>
                  <p className="font-serif text-[58px] leading-none tracking-[-0.04em] text-cream-100">
                    0{index + 1}
                  </p>
                  <h3 className="mt-8 font-serif text-[32px] font-normal leading-[1.08] tracking-[-0.03em] text-cream-100 sm:text-[40px]">
                    {block.title} <span className="italic">{block.italic}</span>
                  </h3>
                  <p className="mt-5 max-w-[440px] text-[14px] leading-[1.7] text-cream-200/70">
                    {block.description}
                  </p>
                </div>
                <ul className="border-t border-cream-100/20">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="border-b border-cream-100/15 py-3 text-[14px] leading-[1.55] text-cream-200/85 transition-colors hover:text-cream-100"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        id="holding-asegura-tu-lugar"
        className="scroll-mt-24 bg-ink-700 px-5 py-24 text-center text-cream-100 sm:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-[1120px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-cream-200/55">
            - Inversión . Único pago
          </p>
          <h2 className="mt-8 font-serif text-[48px] font-normal leading-[0.96] tracking-[-0.035em] sm:text-[72px] lg:text-[96px]">
            Asegura tu <span className="italic">lugar hoy.</span>
          </h2>
          <p className="mt-10 font-serif text-[76px] leading-none tracking-[-0.055em] sm:text-[140px] lg:text-[190px]">
            <span className="mr-3 align-[0.65em] font-sans text-[18px] font-bold uppercase tracking-[0.26em] text-cream-200/55">
              MXN
            </span>
            $4,997
          </p>
          <button
            type="button"
            onClick={startHoldingCheckout}
            className="mt-11 inline-flex min-h-14 items-center justify-center bg-cream-100 px-9 text-[12px] font-bold uppercase tracking-[0.24em] text-ink-900 transition hover:-translate-y-0.5 hover:bg-cream-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-100"
          >
            Inscribirme ahora <span className="ml-4 font-serif italic">→</span>
          </button>
          <p className="mt-7 font-serif text-[15px] italic text-cream-200/55">
            - Acceso completo . material descargable . sesión en vivo.
          </p>
        </div>
      </section>
    </main>
  );
}
