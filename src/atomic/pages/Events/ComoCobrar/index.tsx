import { Link } from "react-router-dom";
import heroBackground from "../../../../../assets/eventos/fondo-como-cobrar-ceo.png";

const blocks = [
  {
    roman: "I",
    title: "Por qué la mayoría de los empresarios",
    italic: "cobra mal.",
    items: [
      "Qué está pasando realmente en tu estructura de cobro.",
      "Por qué es más común de lo que parece.",
      "Errores que generan contingencias fiscales sin saberlo.",
      "Cómo documentarlo correctamente para blindarte.",
    ],
  },
  {
    roman: "II",
    title: "Lo que realmente pasa cuando",
    italic: "cobras mal.",
    items: [
      "Impactos fiscales que normalmente no se ven hasta que es tarde.",
      "Consecuencias patrimoniales y financieras reales.",
      "Deducciones estratégicas que sí funcionan para personas físicas.",
      "Gastos que suelen mal aplicarse y cómo corregirlos.",
    ],
  },
  {
    roman: "III",
    title: "Por qué el cómo cobras",
    italic: "sí importa.",
    items: [
      "Cómo influye directamente en tu liquidez real.",
      "Sistema de estructura fiscal empresarial.",
      "Empresa operativa, de servicios y patrimonial: diferencias clave.",
    ],
  },
  {
    roman: "IV",
    title: "Formas legales de cobrar",
    italic: "de tu empresa.",
    items: [
      "Asimilados, honorarios, dividendos y su uso correcto.",
      "Obligaciones reales que nadie explica.",
      "Criterio estratégico antes que recetas genéricas.",
      "Cuándo y cómo documentarlo para blindarte.",
    ],
  },
  {
    roman: "V",
    title: "Por qué algunos pagan",
    italic: "más que otros.",
    items: [
      "Aunque estén en la misma industria y facturen niveles similares.",
      "Señales de que necesitas optimización ahora.",
      "Cuándo hay socios o familiares en la estructura.",
      "Cuándo el riesgo patrimonial personal aumenta.",
    ],
  },
];

const faqs = [
  {
    question: "¿Para quién es esta masterclass?",
    answer:
      "Para dueños de empresa, socios y directivos que quieren entender cómo cobrarle a su negocio sin improvisar fiscalmente.",
  },
  {
    question: "¿Necesito ser contador?",
    answer:
      "No. La sesión está pensada para empresarios. Diego traduce la estructura fiscal a decisiones claras y aplicables.",
  },
  {
    question: "¿Se verá algo legal o solo fiscal?",
    answer:
      "Ambas cosas. La forma en que cobras toca impuestos, contratos, sociedad, patrimonio y evidencia documental.",
  },
  {
    question: "¿Habrá material de apoyo?",
    answer:
      "Sí. La idea es que salgas con una lectura clara de tu situación y de los siguientes pasos que debes revisar.",
  },
];

function SectionKicker({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div className="grid gap-4 border-b border-current/15 pb-5 text-[9px] font-bold uppercase leading-[1.6] tracking-[0.32em] text-current/45 sm:grid-cols-[1fr_auto]">
      <p>{left}</p>
      <p className="sm:text-right">{right}</p>
    </div>
  );
}

export default function ComoCobrarLanding() {
  return (
    <main className="overflow-hidden bg-cream-100 text-ink-900">
      <section className="relative isolate min-h-[calc(100vh-96px)] overflow-hidden bg-[#062d36] text-cream-50">
        <img
          src={heroBackground}
          alt="Empresario tocando una interfaz digital"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#03171d]/95 via-[#05242c]/82 to-[#03171d]/35" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-[#03171d] to-transparent" />

        <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-[1344px] flex-col px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
          <SectionKicker
            left="- Masterclass gratuita . Estrategia patrimonial"
            right="Online . En vivo . Cupo limitado"
          />

          <div className="flex flex-1 items-center py-16 lg:py-20">
            <div className="max-w-[1020px]">
              <p className="mb-8 text-[10px] font-bold uppercase tracking-[0.34em] text-cream-200/60">
                - Cómo cobrarle a tu empresa
              </p>
              <h1 className="max-w-[980px] text-[clamp(74px,10.4vw,160px)] font-bold uppercase leading-[0.78] tracking-[-0.075em] text-cream-50">
                Cómo{" "}
                <span className="font-serif font-normal italic normal-case tracking-[-0.09em]">
                  cobrar?
                </span>
                <span className="block font-serif text-[clamp(42px,6vw,86px)] font-normal italic normal-case leading-[1.02] tracking-[-0.06em] text-[#b89761]">
                  como CEO.
                </span>
              </h1>
              <p className="mt-8 max-w-[650px] text-[clamp(18px,2vw,24px)] font-normal leading-[1.35] tracking-[-0.025em] text-cream-100/84">
                Una sesión para empresarios que quieren rediseñar la relación
                entre ellos, su empresa y el dinero que realmente pueden tocar.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#registro"
                  className="inline-flex min-h-12 items-center justify-center bg-cream-50 px-7 text-[11px] font-bold uppercase tracking-[0.22em] text-ink-900 transition hover:-translate-y-0.5 hover:bg-cream-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-50"
                >
                  Quiero mi lugar <span className="ml-4 font-serif italic">→</span>
                </a>
                <Link
                  to="/eventos"
                  className="inline-flex min-h-12 items-center justify-center border border-cream-50/70 px-7 text-[11px] font-bold uppercase tracking-[0.22em] text-cream-50 transition hover:-translate-y-0.5 hover:bg-cream-50 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream-50"
                >
                  Ver calendario <span className="ml-4 font-serif italic">→</span>
                </Link>
                <p className="text-[9px] uppercase tracking-[0.3em] text-cream-200/45">
                  - Sin tecnicismos . Con criterio fiscal
                </p>
              </div>
            </div>
          </div>

          <div className="grid border border-cream-50/20 bg-[#03171d]/55 backdrop-blur-sm sm:grid-cols-3">
            {[
              ["Formato", "Masterclass en vivo"],
              ["Duración", "90 minutos"],
              ["Acceso", "Registro gratuito"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border-b border-cream-50/20 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-cream-200/45">
                  - {label}
                </p>
                <p className="mt-3 font-serif text-[18px] italic text-cream-50">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-200 px-5 py-20 text-center sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1030px]">
          <h2 className="font-serif text-[clamp(40px,5.3vw,70px)] font-normal leading-[1.05] tracking-[-0.045em]">
            Estás generando dinero, pero no necesariamente sabes cuánto puedes{" "}
            <span className="italic">retirar sin meterte en problemas.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[760px] text-[17px] leading-[1.75] text-ink-500">
            Eso no siempre es un problema de ventas. Muchas veces es un problema
            de estructura: cómo cobras, cómo documentas y qué tan separada está
            tu empresa de tu patrimonio personal.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1344px]">
          <SectionKicker left="01 / Programa" right="5 bloques secuenciales" />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,820px)_minmax(300px,430px)] lg:items-end lg:gap-12">
            <div className="min-w-0 overflow-visible">
              <h2 className="max-w-[820px] font-serif text-[clamp(48px,7vw,86px)] font-normal leading-[0.94] tracking-[-0.055em]">
                <span className="block">5 bloques.</span>
                <span className="block">Una transformación</span>
                <span className="block italic">completa.</span>
              </h2>
            </div>
            <p className="max-w-[420px] text-[16px] leading-[1.75] text-ink-500 lg:ml-auto">
              Cada bloque está diseñado para darte herramientas aplicables al
              día siguiente. Sin teoría vacía y sin casos genéricos.
            </p>
          </div>

          <div className="mt-12 min-w-0 border border-cream-400 bg-cream-400">
            {blocks.map((block) => (
              <article
                key={block.roman}
                className="group grid gap-7 border-b border-cream-400 bg-cream-100 p-7 text-ink-900 transition-colors duration-300 last:border-b-0 hover:bg-ink-900 hover:text-cream-50 md:grid-cols-[80px_minmax(0,280px)_minmax(0,1fr)] md:p-8 lg:grid-cols-[96px_minmax(280px,360px)_minmax(0,1fr)] lg:p-9"
              >
                <p className="font-serif text-[56px] italic leading-none text-[#765b32] transition-colors group-hover:text-cream-50">
                  {block.roman}
                </p>
                <h3 className="max-w-[360px] font-serif text-[clamp(25px,2.4vw,34px)] font-normal leading-[1.02] tracking-[-0.04em] transition-colors group-hover:text-cream-50">
                  {block.title} <span className="italic">{block.italic}</span>
                </h3>
                <ul className="min-w-0 border-t border-current/15 text-[15px] leading-[1.55] text-ink-600 transition-colors group-hover:text-cream-100">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="border-b border-current/20 py-3.5 last:border-b-0 group-hover:border-cream-50/25"
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

      <section className="bg-ink-900 px-5 py-20 text-cream-50 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1184px]">
          <SectionKicker left="02 / Criterio" right="Fiscal . Patrimonial . Operativo" />
          <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-center">
            <blockquote className="font-serif text-[clamp(38px,5.1vw,72px)] font-normal leading-[1.08] tracking-[-0.05em]">
              Puedes facturar millones y aun así cobrarte de una forma que te
              deje <span className="italic text-[#b89761]">expuesto.</span>
            </blockquote>
            <div className="border border-cream-50/20 p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-cream-200/45">
                - Lo que vas a entender
              </p>
              <p className="mt-6 text-[16px] leading-[1.75] text-cream-100/75">
                La sesión te ayuda a distinguir entre retirar dinero,
                remunerarte, distribuir utilidades y proteger patrimonio. El
                punto no es pagar menos a ciegas: es cobrar con estructura.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1184px]">
          <SectionKicker left="03 / FAQ" right="Preguntas frecuentes" />
          <div className="mt-12 grid gap-10 lg:grid-cols-[360px_minmax(0,1fr)]">
            <div>
              <h2 className="font-serif text-[clamp(46px,5.5vw,76px)] font-normal leading-[0.94] tracking-[-0.055em]">
                Dudas que siempre{" "}
                <span className="italic">recibimos.</span>
              </h2>
              <p className="mt-6 text-[15px] leading-[1.7] text-ink-500">
                Si tienes otra pregunta, puedes escribirnos desde contacto y el
                equipo te responde por el canal oficial.
              </p>
              <Link to="/contacto" className="btn-secondary mt-8 inline-flex">
                Contactar →
              </Link>
            </div>
            <div className="border-y border-cream-400">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  open={index === 0 ? true : undefined}
                  className="group border-b border-cream-400 last:border-b-0"
                >
                  <summary className="grid cursor-pointer list-none grid-cols-[48px_minmax(0,1fr)_24px] gap-4 py-6 [&::-webkit-details-marker]:hidden">
                    <span className="font-serif text-[20px] italic text-ink-300">
                      {String(index + 1).padStart(2, "0")}.
                    </span>
                    <span className="font-serif text-[clamp(22px,2.4vw,30px)] leading-[1.12] tracking-[-0.045em]">
                      {faq.question}
                    </span>
                    <span className="text-right text-[22px] text-ink-400">
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">-</span>
                    </span>
                  </summary>
                  <p className="pb-7 pl-16 pr-8 text-[14px] leading-[1.65] text-ink-500">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="registro"
        className="scroll-mt-24 border-t border-cream-400 bg-cream-200 px-5 py-24 text-center sm:px-8 lg:px-12 lg:py-32"
      >
        <div className="mx-auto max-w-[960px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-ink-300">
            04 / Registro
          </p>
          <h2 className="mt-7 font-serif text-[clamp(56px,7vw,96px)] font-normal leading-[0.94] tracking-[-0.06em]">
            Reserva tu <span className="italic">lugar.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[620px] text-[16px] leading-[1.75] text-ink-500">
            De momento dejamos esta landing almacenada como pieza independiente.
            Cuando el evento exista en calendario, este bloque puede conectarse
            al formulario o checkout definitivo sin rehacer el diseño.
          </p>
          <div className="mx-auto mt-10 grid max-w-[620px] gap-3 border border-cream-400 bg-cream-50 p-5 sm:grid-cols-[1fr_auto]">
            <input
              aria-label="Correo para registro"
              placeholder="tu correo"
              className="min-h-12 border border-cream-400 bg-white px-4 text-[14px] outline-none placeholder:text-ink-300 focus:border-ink-900"
            />
            <Link
              to="/contacto"
              className="inline-flex min-h-12 items-center justify-center bg-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#765b32]"
            >
              Pedir acceso →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
