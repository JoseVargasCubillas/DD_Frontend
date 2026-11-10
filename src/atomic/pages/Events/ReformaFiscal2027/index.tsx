import { useNavigate } from "react-router-dom";
import { useCartStore } from "@store/cartStore";
import { useEventEdition } from "@hooks/useNextCalendarEvent";
import {
  formatEventDateLabel,
  formatEventFormatLabel,
  formatEventTimeLabel,
  isReformaFiscalEvent,
} from "@utils/eventCalendar";
import type { OrderItem } from "@t/index";

const HERO_IMAGE = "/event-media/reforma-fiscal-2027-hero.webp";
const PRICE = 2997;
const PRICE_LABEL = "$2,997 MXN";
const WHATSAPP_URL =
  "https://wa.me/525584001184?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20la%20Masterclass%20Reforma%20Fiscal%202027.";
const BUY_SECTION_ID = "reforma-fiscal-comprar";

const CHECKOUT_ITEM: OrderItem & { id: string } = {
  id: "event-reforma-fiscal-2027",
  type: "event",
  refId: "reforma-fiscal-2027",
  title: "Masterclass Reforma Fiscal 2027",
  price: PRICE,
  quantity: 1,
  currency: "MXN",
  paymentType: "one_time",
};

type TagTone = "neutral" | "accent" | "red";

const TEMARIO: Array<{ n: string; title: string; tag: string; tone: TagTone }> = [
  { n: "01", title: "RESICO PF. Límite de $5 millones y actualización de tablas", tag: "Personas físicas", tone: "neutral" },
  { n: "02", title: "RESICO PF. Reincorporación al régimen", tag: "Personas físicas", tone: "neutral" },
  { n: "03", title: "RESICO PM. Límite de $50 millones y régimen opcional", tag: "Personas morales", tone: "neutral" },
  { n: "04", title: "RESICO PM. Reincorporación al régimen", tag: "Personas morales", tone: "neutral" },
  { n: "05", title: "RESICO PM. Nuevos porcentajes de deducción de inversiones y reglas transitorias", tag: "★ Nueva mecánica", tone: "accent" },
  { n: "06", title: "Nuevo mecanismo de limitación de deducciones y excepciones", tag: "● Alto impacto", tone: "red" },
  { n: "07", title: "Restricción de pérdidas fiscales al 50% y disposiciones transitorias", tag: "● Alto impacto", tone: "red" },
  { n: "08", title: "Nuevos factores de coeficientes de utilidad para pagos provisionales", tag: "Pagos provisionales", tone: "neutral" },
  { n: "09", title: "Derogación del Régimen Opcional para Grupos de Sociedades", tag: "● Deroga", tone: "red" },
  { n: "10", title: "Programa de regularización de créditos fiscales", tag: "★ Ventana única", tone: "accent" },
  { n: "11", title: "Reducción de multas por autocorrección", tag: "★ Oportunidad", tone: "accent" },
];

const TAG_CLASS: Record<TagTone, string> = {
  neutral: "border-cream-100/20 text-cream-100/60",
  accent: "border-[#c9a76a]/50 text-[#d9b97d]",
  red: "border-[#c0614a]/50 text-[#e07d64]",
};

const Eyebrow = ({ children, light = false }: { children: React.ReactNode; light?: boolean }) => (
  <p
    className={`text-[10px] font-bold uppercase tracking-[0.28em] ${
      light ? "text-cream-100/55" : "text-ink-500"
    }`}
  >
    {children}
  </p>
);

export default function ReformaFiscal2027Landing() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const clearCart = useCartStore((state) => state.clear);

  // Edición vigente (API/admin o fallback): fecha, hora y modalidad reales.
  const edition = useEventEdition(isReformaFiscalEvent);
  const editionDate = edition
    ? formatEventDateLabel(edition.startDate, edition.endDate)
    : "17 de noviembre de 2026";
  const editionTime = edition ? formatEventTimeLabel(edition.startDate) : "18:00";
  const editionFormat = edition
    ? formatEventFormatLabel(edition.modality, edition.location)
    : "Online en vivo · Zoom";

  const scrollToBuy = () => {
    document.getElementById(BUY_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const startCheckout = () => {
    clearCart();
    addItem({
      ...CHECKOUT_ITEM,
      eventDate: `${editionDate} · ${editionTime} h`,
      ...(edition && {
        eventId: String(edition.id ?? edition._id ?? "") || undefined,
        eventSlug: edition.slug,
      }),
      eventFormat: editionFormat,
    });
    navigate("/eventos/checkout");
  };

  return (
    <main className="overflow-hidden bg-cream-100 text-ink-900">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-ink-900/10 bg-cream-100 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.28em] text-ink-700 sm:px-8">
        <span>Diego Díaz · Estratega fiscal</span>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-ink-900/20 px-3 py-1.5 transition-colors hover:bg-ink-900 hover:text-cream-100"
        >
          Preguntar
        </a>
      </div>

      {/* Hero */}
      <section className="relative isolate min-h-[88vh] overflow-hidden bg-ink-900 text-cream-100">
        <img
          src={HERO_IMAGE}
          alt="Portada de la Masterclass Reforma Fiscal 2027"
          className="absolute inset-0 h-full w-full object-cover object-center"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/40" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-[1312px] flex-col px-5 py-10 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-cream-100/15 pb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/60">
            <span className="text-[#d9b97d]">●</span>
            <span>En vivo</span>
            <span className="text-cream-100/30">·</span>
            <span>Masterclass</span>
            <span className="text-cream-100/30">·</span>
            <span>{editionDate}</span>
            <span className="text-cream-100/30">·</span>
            <span>Cupos limitados</span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-16 lg:max-w-[760px]">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#c9a76a]/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-[#d9b97d]">
              ★ Reforma Fiscal
            </span>
            <h1 className="font-serif text-[clamp(3rem,10vw,7.5rem)] leading-[0.92] tracking-tight">
              Reforma Fiscal
              <br />
              <span className="text-[#d9b97d]">2027.</span>
            </h1>
            <p className="mt-8 max-w-[560px] text-lg leading-relaxed text-cream-100/80 sm:text-xl">
              Once cambios aprobados que van a tocar tu bolsillo en enero. Y la mayoría de las
              empresas aún no sabe cómo prepararse.
            </p>

            <dl className="mt-10 grid max-w-[560px] grid-cols-1 gap-5 border-t border-cream-100/15 pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/50">Fecha</dt>
                <dd className="mt-1 font-serif text-lg">{editionDate}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/50">Hora</dt>
                <dd className="mt-1 font-serif text-lg">{editionTime} h CDMX</dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/50">Modalidad</dt>
                <dd className="mt-1 font-serif text-lg">{editionFormat}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={startCheckout}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-cream-100 px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-ink-900 transition-colors hover:bg-[#d9b97d]"
              >
                Reservar mi lugar
              </button>
              <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-cream-100/60">
                Inversión única · {PRICE_LABEL}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contexto */}
      <section id="contexto" className="mx-auto max-w-[1312px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Eyebrow>01 · Contexto</Eyebrow>
        <h2 className="mt-4 max-w-[820px] font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Después de las fusiones y eliminaciones, quedan{" "}
          <span className="text-[#8a6a3d]">11 cambios.</span>
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="space-y-6 text-lg leading-relaxed text-ink-700">
            <p className="text-xl text-ink-900 sm:text-2xl">
              El paquete fiscal 2027 ya pasó por el Congreso. Lo que queda no es una propuesta:
              es ley vigente a partir del 1 de enero.
            </p>
            <p>
              Cambian los límites de RESICO para personas físicas y morales, se restringe la
              deducción de pérdidas fiscales, aparece un nuevo mecanismo para limitar deducciones y
              se deroga el régimen opcional para grupos de sociedades.
            </p>
            <p>
              Cada uno de esos puntos tiene reglas transitorias con fecha de corte. Quien las
              conozca en noviembre puede acomodar su cierre de año; quien las descubra en abril ya
              pagó la diferencia.
            </p>
            <p>
              En esta masterclass vamos cambio por cambio, con la jugada concreta que corresponde
              a cada uno y el calendario para ejecutarla antes del 31 de diciembre.
            </p>
          </div>
          <blockquote className="self-start border-l-4 border-[#8a6a3d] pl-6 font-serif text-2xl leading-snug text-ink-900 sm:text-3xl">
            “Lo que se aprobó no está a debate. Lo único que decides ahora es si llegas preparado.”
          </blockquote>
        </div>

        {/* Bento */}
        <div className="mt-16 grid gap-4 md:grid-cols-6">
          <div className="rounded-3xl bg-ink-900 p-8 text-cream-100 md:col-span-3 md:row-span-2">
            <Eyebrow light>Reformas aprobadas</Eyebrow>
            <p className="mt-6 font-serif text-[clamp(4rem,12vw,8rem)] leading-none text-[#d9b97d]">11+</p>
            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/55">
              Vigencia 01 · Ene · 2027
            </p>
            <p className="mt-3 max-w-[360px] text-cream-100/80">
              Once cambios al CFF, LISR y LIVA. El paquete fiscal más denso de los últimos 5 años.
            </p>
          </div>
          <div className="rounded-3xl border border-ink-900/10 bg-cream-50 p-8 md:col-span-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#8a3d2a]">● Alto impacto</p>
            <p className="mt-4 font-serif text-6xl leading-none">50%</p>
            <p className="mt-4 text-ink-700">
              Nuevo tope a pérdidas fiscales. Lo que arrastras ya no se compensa igual.
            </p>
          </div>
          <div className="rounded-3xl border border-ink-900/10 bg-cream-50 p-8 md:col-span-2">
            <Eyebrow>Fecha</Eyebrow>
            <p className="mt-4 font-serif text-5xl leading-none">17</p>
            <p className="mt-2 font-serif text-xl">Noviembre 2026</p>
            <p className="mt-1 text-sm text-ink-500">{editionTime} h CDMX</p>
          </div>
          <div className="flex flex-col justify-between rounded-3xl bg-[#8a6a3d] p-8 text-cream-100 md:col-span-1">
            <Eyebrow light>Inversión</Eyebrow>
            <p className="mt-4 font-serif text-4xl leading-none">$2,997</p>
            <button
              type="button"
              onClick={startCheckout}
              className="mt-6 rounded-full bg-cream-100 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-cream-100"
            >
              Reservar
            </button>
          </div>
          <div className="rounded-3xl border border-ink-900/10 bg-cream-50 p-8 md:col-span-6">
            <p className="font-serif text-2xl leading-snug sm:text-3xl">
              “Mientras unos descubren la reforma en abril con su declaración, otros ya la
              implementaron en diciembre, y ahorraron la diferencia.”
            </p>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-ink-500">
              Diego Díaz · Estratega fiscal
            </p>
          </div>
        </div>
      </section>

      {/* Temario */}
      <section id="temario" className="bg-ink-900 py-20 text-cream-100 lg:py-28">
        <div className="mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <Eyebrow light>02 · Temario</Eyebrow>
          <h2 className="mt-4 max-w-[760px] font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Los 11 cambios, <span className="text-[#d9b97d]">uno por uno.</span>
          </h2>

          <ol className="mt-12 divide-y divide-cream-100/10 border-y border-cream-100/10">
            {TEMARIO.map((item) => (
              <li
                key={item.n}
                className="grid gap-3 py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:gap-6"
              >
                <span className="font-serif text-2xl text-[#d9b97d]">{item.n}</span>
                <span className="text-lg leading-snug">{item.title}</span>
                <span
                  className={`w-fit rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${TAG_CLASS[item.tone]}`}
                >
                  {item.tag}
                </span>
              </li>
            ))}
            <li className="grid gap-3 py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
              <span className="font-serif text-2xl text-[#d9b97d]">+</span>
              <span className="text-lg leading-snug">Q&amp;A en vivo con Diego</span>
              <span className="w-fit rounded-full border border-cream-100/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cream-100/60">
                Cierre
              </span>
            </li>
          </ol>
        </div>
      </section>

      {/* Sesión */}
      <section id="sesion" className="mx-auto max-w-[1312px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <Eyebrow>03 · La sesión</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Once reformas. <span className="text-[#8a6a3d]">Cero relleno.</span>
        </h2>
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-ink-900/10 bg-ink-900/10 sm:grid-cols-3">
          {[
            ["Fecha", editionDate],
            ["Hora", `${editionTime} h · Ciudad de México`],
            ["Formato", `${editionFormat} · Grabación incluida`],
          ].map(([label, value]) => (
            <div key={label} className="bg-cream-50 p-8">
              <Eyebrow>{label}</Eyebrow>
              <p className="mt-3 font-serif text-2xl leading-snug">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA intermedio */}
      <section className="border-y border-ink-900/10 bg-cream-50">
        <div className="mx-auto flex max-w-[1312px] flex-col items-start gap-8 px-5 py-16 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:max-w-[640px]">
            El 1 de enero no avisa. <span className="text-[#8a3d2a]">La reforma tampoco.</span>
          </h2>
          <button
            type="button"
            onClick={scrollToBuy}
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-ink-900 px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-cream-100 transition-colors hover:bg-[#8a6a3d]"
          >
            Asegurar mi lugar
          </button>
        </div>
      </section>

      {/* Comprar */}
      <section
        id={BUY_SECTION_ID}
        className="mx-auto max-w-[1312px] scroll-mt-24 px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
      >
        <Eyebrow>04 · Reserva</Eyebrow>
        <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Entra preparado <span className="text-[#8a6a3d]">al 2027.</span>
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="rounded-3xl bg-ink-900 p-8 text-cream-100 sm:p-10">
            <Eyebrow light>Acceso completo · grabación incluida</Eyebrow>
            <p className="mt-6 font-serif text-[clamp(3rem,8vw,5.5rem)] leading-none">
              $2,997<span className="text-3xl text-cream-100/60">.00</span>
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.28em] text-cream-100/55">
              MXN · Pago único
            </p>
            <ul className="mt-8 space-y-3 text-cream-100/80">
              <li>· Masterclass en vivo con los 11 cambios y sus reglas transitorias.</li>
              <li>· Q&amp;A en vivo con Diego Díaz.</li>
              <li>· Grabación disponible por 30 días.</li>
              <li>· Factura disponible al momento.</li>
            </ul>
            <button
              type="button"
              onClick={startCheckout}
              className="mt-10 inline-flex min-h-[56px] w-full items-center justify-center rounded-full bg-cream-100 px-8 text-[11px] font-bold uppercase tracking-[0.24em] text-ink-900 transition-colors hover:bg-[#d9b97d] sm:w-auto"
            >
              Reservar mi lugar · {PRICE_LABEL}
            </button>
            <p className="mt-4 text-sm text-cream-100/60">
              Pago seguro con tarjeta. Recibes tu boleto QR y el acceso por correo al instante.
            </p>
          </div>

          <aside className="flex flex-col justify-between rounded-3xl border border-ink-900/10 bg-cream-50 p-8">
            <div>
              <Eyebrow>¿Tienes dudas?</Eyebrow>
              <p className="mt-4 font-serif text-2xl leading-snug">
                Escríbenos por WhatsApp y te ayudamos con tu registro o factura.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-full border border-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.24em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-cream-100"
            >
              Preguntar por WhatsApp
            </a>
          </aside>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-[0.28em] text-ink-500">
          Cupos limitados · Grabación disponible por 30 días · Factura disponible al momento.
        </p>
      </section>

      {/* CTA fija móvil */}
      <div className="sticky bottom-0 z-30 border-t border-ink-900/10 bg-cream-100/95 px-5 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={startCheckout}
          className="flex min-h-[48px] w-full items-center justify-center rounded-full bg-ink-900 text-[11px] font-bold uppercase tracking-[0.24em] text-cream-100"
        >
          Reservar mi lugar · {PRICE_LABEL}
        </button>
      </div>
    </main>
  );
}
