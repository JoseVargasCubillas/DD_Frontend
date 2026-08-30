import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import armchair404 from "../../../../assets/errors/404-armchair.png";

const notFoundLines = [
  <>
    Toda estrategia empieza cuando entiendes <em>dónde estás parado</em>. Aquí no
    estás parado en ningún lado.
  </>,
  <>El SAT no encontraría esta URL ni con Big Data. Nosotros tampoco.</>,
  <>
    Perdiste el enlace, no el patrimonio. <em>Todavía</em>.
  </>,
  <>
    Buscaste una ruta que no está en el CFDI. Pasa. Regresa al inicio y
    volvemos a empezar el ejercicio.
  </>,
  <>El buzón tributario tampoco tiene noticias de esta página.</>,
  <>
    Puedes <em>deducir</em> muchas cosas. Esta página no es una de ellas.
  </>,
  <>
    Deducimos que buscabas otra cosa. <em>También deducimos que ya no está</em>.
  </>,
  <>
    Los enlaces también se heredan mal. Este se quedó{" "}
    <em>sin sucesor designado</em>.
  </>,
  <>
    Si esto te sacó de tu ruta, imagínate una revisión del SAT.{" "}
    <em>Vámonos por partes</em>.
  </>,
];

type NotFoundProps = {
  mode?: "not-found" | "error";
  message?: string;
};

export default function NotFound({ mode = "not-found", message }: NotFoundProps) {
  const location = useLocation();
  const [phraseIndex] = useState(() =>
    Math.floor(Math.random() * notFoundLines.length),
  );
  const isError = mode === "error";

  const errorPhrase = useMemo(
    () =>
      Math.abs(
        Array.from(message || location.pathname || "error").reduce(
          (total, char) => total + char.charCodeAt(0),
          0,
        ),
      ) % notFoundLines.length,
    [location.pathname, message],
  );

  const visiblePhrase = isError ? notFoundLines[errorPhrase] : notFoundLines[phraseIndex];

  return (
    <section className="relative isolate min-h-[calc(100vh-96px)] overflow-hidden bg-white text-ink-900">
      <img
        src={armchair404}
        alt="Sillón negro frente al número 404"
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-auto w-[1120px] max-w-none -translate-x-1/2 -translate-y-1/2 select-none object-contain sm:w-[1280px] lg:w-[1440px] xl:w-[1680px]"
        draggable={false}
      />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-[1440px] flex-col items-center px-6 py-12 text-center sm:py-16 lg:px-10">
        <p className="mt-[7vh] text-[10px] font-bold uppercase tracking-[0.34em] text-ink-400 sm:mt-[10vh]">
          {isError ? "Error de aplicación" : "Página no encontrada"}
        </p>

        <div className="mt-[12vh] flex w-full max-w-[760px] flex-col items-center sm:mt-[11vh] lg:mt-[12vh]">
          <p
            key={`${isError ? "error" : "not-found"}-${isError ? errorPhrase : phraseIndex}`}
            className="max-w-[760px] animate-[hero-fade_500ms_var(--ease-out)_both] text-balance font-sans text-[clamp(30px,3.25vw,46px)] font-bold leading-[1.06] tracking-[-0.035em] text-ink-900 [&_em]:font-serif [&_em]:font-normal [&_em]:italic"
          >
            {visiblePhrase}
          </p>

          <div className="mt-8 flex w-full max-w-[240px] flex-col items-stretch justify-center sm:items-center">
            <Link to="/" className="btn-primary min-w-[180px]">
              Volver al inicio <span className="arrow">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-auto flex w-full max-w-[1120px] items-center justify-between border-t border-ink-900/10 pt-4 text-[10px] font-bold uppercase tracking-[0.28em] text-ink-300">
          <span>{isError ? "Recuperación" : "Ruta perdida"}</span>
          <span className="max-w-[42vw] truncate">{location.pathname}</span>
        </div>
      </div>
    </section>
  );
}
