import { useEffect } from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

/**
 * ErrorBoundary del router. Captura:
 *  - Errores de importación dinámica (chunk hashes obsoletos tras un deploy).
 *    El navegador tiene HTML viejo referenciando JS que ya no existe; hacemos
 *    un reload duro una sola vez para tomar el HTML fresco.
 *  - Cualquier otro error de una ruta, mostrando fallback + link a Home en
 *    lugar del error crudo de React Router.
 */
export default function RouterErrorBoundary() {
  const error = useRouteError();

  const message =
    (error as { message?: string })?.message ??
    (isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : "");

  const isChunkError =
    typeof message === "string" &&
    (message.includes("dynamically imported module") ||
      message.includes("Loading chunk") ||
      message.includes("Failed to fetch") ||
      (error as { name?: string })?.name === "ChunkLoadError");

  useEffect(() => {
    if (!isChunkError) return;
    // Evita loops si el reload no resuelve.
    const key = "dd-chunk-reload";
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    window.location.reload();
  }, [isChunkError]);

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="max-w-md text-center space-y-6">
        <p className="text-[11px] uppercase tracking-[0.32em] text-ink-500">
          Error inesperado
        </p>
        <h1 className="text-[clamp(28px,4vw,40px)] font-serif italic leading-tight">
          {isChunkError
            ? "Estamos actualizando la aplicación"
            : "Algo salió mal cargando esta sección"}
        </h1>
        <p className="text-sm text-ink-600">
          {isChunkError
            ? "Recargando para tomar la versión más reciente…"
            : "Puedes volver al inicio o intentarlo de nuevo en unos segundos."}
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-secondary cursor-pointer"
          >
            Reintentar
          </button>
          <Link to="/" className="btn-primary">
            Ir a inicio →
          </Link>
        </div>
      </div>
    </main>
  );
}
