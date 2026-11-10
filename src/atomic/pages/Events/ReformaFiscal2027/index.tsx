import HubspotForm from "@molecules/HubspotForm";
import { HUBSPOT_FORMS } from "@utils/hubspotForms";
import { useEventEdition } from "@hooks/useNextCalendarEvent";
import {
  formatEventDateLabel,
  formatEventFormatLabel,
  formatEventTimeLabel,
  isReformaFiscalEvent,
} from "@utils/eventCalendar";

const HERO_IMAGE = "/event-media/reforma-fiscal-2027-hero.webp";
const PRICE_LABEL = "$2,997 MXN";
const WHATSAPP_URL =
  "https://wa.me/525584001184?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20la%20Masterclass%20Reforma%20Fiscal%202027.";
const BUY_SECTION_ID = "comprar";

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
  red: "border-[#e04b2f] bg-[#b3261e] text-white shadow-[0_0_0_4px_rgba(224,75,47,0.18),0_6px_18px_rgba(224,75,47,0.35)]",
};

const RED_ROW_CLASS =
  "relative -mx-5 bg-[#e04b2f]/[0.08] px-5 sm:-mx-6 sm:px-6 before:absolute before:inset-y-3 before:left-0 before:w-[3px] before:bg-[#e04b2f]";

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
  // Edición vigente (API/admin o fallback): fecha, hora y modalidad reales.
  const edition = useEventEdition(isReformaFiscalEvent);
  const editionDate = edition
    ? formatEventDateLabel(edition.startDate, edition.endDate)
    : "17 de noviembre de 2026";
  const editionTime = edition ? formatEventTimeLabel(edition.startDate) : "18:00";
  const editionFormat = edition
    ? formatEventFormatLabel(edition.modality, edition.location)
    : "Online en vivo · Zoom";

  // Fiel al diseño original: todos los CTAs llevan al formulario de registro.
  const scrollToBuy = () => {
    document.getElementById(BUY_SECTION_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const startCheckout = scrollToBuy;

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
        <h2 className="max-w-[820px] font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
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
          <div className="rounded-3xl border-2 border-[#b3261e]/40 bg-[#fdf1ee] p-8 md:col-span-3">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-[#b3261e] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              Alto impacto
            </p>
            <p className="mt-4 font-serif text-6xl leading-none text-[#b3261e]">50%</p>
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
          <h2 className="max-w-[760px] font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Los 11 cambios, <span className="text-[#d9b97d]">uno por uno.</span>
          </h2>

          <ol className="mt-12 divide-y divide-cream-100/10 border-y border-cream-100/10">
            {TEMARIO.map((item) => (
              <li
                key={item.n}
                className={`grid gap-3 py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center sm:gap-6 ${
                  item.tone === "red" ? RED_ROW_CLASS : ""
                }`}
              >
                <span className={`font-serif text-2xl ${item.tone === "red" ? "text-[#ff8a70]" : "text-[#d9b97d]"}`}>
                  {item.n}
                </span>
                <span className={`text-lg leading-snug ${item.tone === "red" ? "font-semibold text-white" : ""}`}>
                  {item.title}
                </span>
                <span
                  className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${TAG_CLASS[item.tone]}`}
                >
                  {item.tone === "red" && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                    </span>
                  )}
                  {item.tone === "red" ? item.tag.replace(/^●\s*/, "") : item.tag}
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
        <h2 className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
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

      {/* Comprar — fiel al diseño original: precio + formulario en línea */}
      <section
        id={BUY_SECTION_ID}
        className="relative overflow-hidden bg-ink-900 py-24 text-cream-100 scroll-mt-16 lg:py-36"
      >
        <div className="pointer-events-none absolute -bottom-60 -left-52 h-[720px] w-[720px] rounded-full bg-[#b4966e]/20 blur-3xl" />
        <div className="relative mx-auto max-w-[1312px] px-5 sm:px-8 lg:px-12">
          <h2 className="max-w-[1000px] font-serif text-[clamp(2.75rem,8vw,5.25rem)] leading-[1.02] tracking-tight">
            Entra preparado
            <br />
            al <span className="italic text-[#d9b97d]">2027.</span>
          </h2>
          <p className="mt-7 max-w-[760px] text-lg leading-relaxed text-cream-100/80 sm:text-xl">
            La reforma ya se aprobó. Lo único que decides ahora es si llegas al 1 de enero
            leyéndola a ciegas, o si llegas con la jugada sobre la mesa.
          </p>

          <div className="mt-12 grid items-center gap-8 border-y border-cream-100/20 py-10 sm:grid-cols-[1fr_auto] sm:gap-10">
            <div>
              <span className="mb-3 block text-[10.5px] font-medium uppercase tracking-[0.3em] text-cream-100/60">
                Masterclass · Reforma Fiscal 2027
              </span>
              <span className="font-serif text-2xl leading-snug sm:text-3xl">
                Acceso completo · <span className="italic text-[#d9b97d]">grabación incluida.</span>
              </span>
            </div>
            <div className="sm:text-right">
              <span className="mb-2 block text-[10.5px] font-medium uppercase tracking-[0.3em] text-cream-100/55">
                MXN · Pago único
              </span>
              <div className="text-[clamp(3.5rem,9vw,6.5rem)] font-bold leading-none tracking-[-0.05em]">
                <span className="mr-1 align-top text-[0.4em] text-[#d9b97d]">$</span>
                2,997
                <span className="ml-1 text-[0.3em] text-cream-100/55">.00</span>
              </div>
            </div>
          </div>

          <div className="rf-form mt-8">
            <HubspotForm
              portalId={HUBSPOT_FORMS.reformaFiscal2027.portalId}
              formId={HUBSPOT_FORMS.reformaFiscal2027.formId}
            />
          </div>

          <p className="mt-7 font-serif text-[15px] italic text-cream-100/60">
            Cupos limitados · Grabación disponible por 30 días · Factura disponible al momento.
          </p>
        </div>
        <style>{`
          /* HubSpot (render hsfc) inyecta wrapper con fondo blanco, bordes y barra
             de progreso; se neutraliza para que el formulario viva sobre el fondo
             negro con inputs subrayados, como en el diseño original. */
          .rf-form .dd-hs-form,
          .rf-form .hsfc-Form,
          .rf-form .hsfc-Step,
          .rf-form .hsfc-Step__Content,
          .rf-form .hsfc-Row,
          .rf-form .hsfc-NavigationRow {
            background:transparent !important; box-shadow:none !important; border:0 !important;
            padding:0 !important; margin:0 !important; width:100% !important; max-width:none !important;
          }
          .rf-form .hsfc-Step__Content { display:grid !important; grid-template-columns:1fr 1fr; gap:28px 24px !important; }
          .rf-form .hsfc-Row { display:contents !important; }
          .rf-form .hsfc-Row:nth-child(5) > *,
          .rf-form .hsfc-NavigationRow { grid-column:1 / -1; }
          @media (max-width:640px){ .rf-form .hsfc-Step__Content { grid-template-columns:1fr; } }
          .rf-form .hsfc-ProgressBar { display:none !important; }
          .rf-form .hsfc-FieldLabel,
          .rf-form .hsfc-FieldLabel span {
            color:rgba(245,242,236,0.6) !important; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif !important;
            font-size:10px !important; font-weight:600 !important; letter-spacing:0.28em !important; text-transform:uppercase !important;
          }
          .rf-form .hsfc-FieldLabel { display:block; margin:0 0 8px !important; }
          .rf-form .hsfc-FieldLabel__RequiredIndicator { color:#d9b97d !important; }
          .rf-form .hsfc-TextInput,
          .rf-form .hsfc-TextareaInput,
          .rf-form .hsfc-DropdownInput {
            background:transparent !important; color:#f5f2ec !important; font-family:'Libre Baskerville',Baskerville,Georgia,serif !important;
            font-size:22px !important; letter-spacing:-0.01em !important; line-height:1.3 !important;
            border:0 !important; border-bottom:1px solid rgba(245,242,236,0.32) !important; border-radius:0 !important;
            padding:14px 2px !important; box-shadow:none !important; width:100% !important; outline:none !important; height:auto !important;
          }
          .rf-form .hsfc-TextInput::placeholder { color:rgba(245,242,236,0.32) !important; font-style:italic; }
          .rf-form .hsfc-TextInput:focus { border-bottom-color:#d9b97d !important; }
          .rf-form .hsfc-PhoneInput { display:flex !important; align-items:stretch !important; gap:10px; background:transparent !important; border:0 !important; box-shadow:none !important; padding:0 !important; }
          .rf-form .hsfc-PhoneInput__FlagAndCaret {
            display:flex; align-items:center; gap:6px; background:transparent !important; border:0 !important;
            border-bottom:1px solid rgba(245,242,236,0.32) !important; border-radius:0 !important; padding:0 6px !important; color:#f5f2ec !important;
          }
          .rf-form .hsfc-PhoneInput__FlagAndCaret__Caret { border-top-color:#f5f2ec !important; color:#f5f2ec !important; filter:invert(1); }
          .rf-form .hsfc-DropdownOptions { background:#17130f !important; color:#f5f2ec !important; border:1px solid rgba(245,242,236,0.2) !important; }
          .rf-form .hsfc-DropdownOptions * { color:#f5f2ec !important; }
          .rf-form .hsfc-DropdownOptions input { background:transparent !important; border-bottom:1px solid rgba(245,242,236,0.32) !important; }
          .rf-form .hsfc-NavigationRow { display:flex !important; flex-direction:column; align-items:flex-start; gap:12px; margin-top:12px !important; }
          .rf-form .hsfc-NavigationRow__Buttons { justify-content:flex-start !important; width:100%; }
          .rf-form .hsfc-Button {
            display:inline-flex !important; align-items:center; justify-content:center; width:auto !important;
            background:#f5f2ec !important; background-image:none !important; color:#0a0a0a !important; border:1px solid #f5f2ec !important; border-radius:0 !important;
            min-height:64px !important; padding:0 40px !important; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif !important;
            font-size:12px !important; font-weight:600 !important; letter-spacing:0.26em !important; text-transform:uppercase !important;
            cursor:pointer; transition:all .3s ease;
          }
          .rf-form .hsfc-Button:hover { background:#ece7dd !important; border-color:#ece7dd !important; transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,0,0,0.35); }
          .rf-form .hsfc-NavigationRow__Alerts,
          .rf-form .hsfc-ErrorAlert,
          .rf-form .hsfc-FieldError,
          .rf-form .hsfc-ErrorMessage {
            color:#e07d64 !important; background:transparent !important; border:0 !important; padding:0 !important;
            font-family:'Libre Baskerville',Baskerville,Georgia,serif !important; font-style:italic !important;
            font-size:13px !important; text-transform:none !important; letter-spacing:0 !important;
          }
          .rf-form .hsfc-RichText, .rf-form .hsfc-RichText *, .rf-form .hsfc-LegalConsent, .rf-form .hsfc-LegalConsent * {
            color:rgba(245,242,236,0.55) !important; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif !important;
            font-size:10.5px !important; letter-spacing:0.08em !important; line-height:1.5;
          }
          .rf-form .hsfc-RichText a, .rf-form .hsfc-LegalConsent a { color:#d9b97d !important; text-decoration:underline; text-underline-offset:3px; }
          .rf-form .hsfc-SuccessMessage, .rf-form .hsfc-ThankYou, .rf-form .hsfc-Step--thankyou {
            color:#f5f2ec !important; background:rgba(138,106,61,0.18) !important; border:1px solid #d9b97d !important;
            padding:28px 32px !important; font-family:'Libre Baskerville',Baskerville,Georgia,serif; font-size:17px; line-height:1.5;
          }
          .rf-form .hsfc-SuccessMessage *, .rf-form .hsfc-ThankYou * { color:#f5f2ec !important; }
        `}</style>
      </section>
      {/* CTA fija móvil */}
      <div className="sticky bottom-0 z-30 flex items-center justify-between gap-4 border-t border-cream-100/15 bg-[#17130f] px-5 py-3 lg:hidden">
        <span className="text-[10px] uppercase tracking-[0.2em] text-cream-100/80">
          17 Nov · <strong className="font-serif text-sm italic normal-case tracking-normal text-[#d9b97d]">{PRICE_LABEL}</strong>
        </span>
        <button
          type="button"
          onClick={startCheckout}
          className="inline-flex min-h-[44px] items-center justify-center bg-[#d9b97d] px-5 text-[10px] font-semibold uppercase tracking-[0.24em] text-ink-900"
        >
          Reservar lugar →
        </button>
      </div>
    </main>
  );
}
