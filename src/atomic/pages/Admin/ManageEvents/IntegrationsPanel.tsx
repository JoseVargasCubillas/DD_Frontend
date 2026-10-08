import toast from "react-hot-toast";
import { useIntegrationsStatus, useSyncEventCatalog, useSyncHubspot } from "@hooks/useIntegrations";
import { FALLBACK_CALENDAR_EVENTS } from "@utils/eventCalendar";

const formatWhen = (value: string | null | undefined) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Mexico_City",
  }).format(date);
};

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Panel de administración de boletos con HubSpot:
 *  - "Actualizar calendario": manda el calendario fijo del sitio al backend para
 *    que los boletos de HubSpot reconozcan las ediciones nuevas sin redesplegar.
 *  - "Sincronizar ahora": corre ya la revisión de negocios ganados en HubSpot
 *    (si no, se hace sola cada pocos minutos).
 */
export default function IntegrationsPanel() {
  const { data: status, isLoading, isError } = useIntegrationsStatus();
  const syncCatalog = useSyncEventCatalog();
  const syncHubspot = useSyncHubspot();

  const handleCatalog = () => {
    syncCatalog.mutate(FALLBACK_CALENDAR_EVENTS, {
      onSuccess: (r) => {
        const changes = r.added + r.updated + r.removed;
        toast.success(
          changes === 0
            ? `Calendario al día (${plural(r.count, "edición", "ediciones")})`
            : `Calendario actualizado: ${r.added} nuevas, ${r.updated} modificadas, ${r.removed} quitadas`,
        );
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo actualizar el calendario"),
    });
  };

  const handleHubspot = () => {
    syncHubspot.mutate(undefined, {
      onSuccess: (r) => {
        if (r.lockedByOther) {
          toast("Ya hay una sincronización en curso. Intenta de nuevo en un minuto.");
          return;
        }
        const parts = [
          plural(r.issued, "boleto emitido", "boletos emitidos"),
          `${r.skipped} omitidos`,
          `${r.pendingEvent} esperando evento`,
        ];
        toast.success(`HubSpot sincronizado: ${parts.join(" · ")}`);
      },
      onError: (err) => toast.error(err instanceof Error ? err.message : "No se pudo sincronizar con HubSpot"),
    });
  };

  const catalogWhen = formatWhen(status?.catalog.syncedAt);
  const hubspotWhen = formatWhen(status?.hubspot.lastRunAt);
  const hubspotEnabled = Boolean(status?.hubspot.enabled);

  return (
    <section
      aria-label="Boletos y HubSpot"
      className="mb-6 grid gap-4 rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm md:grid-cols-2"
    >
      <div className="flex flex-col justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Calendario para boletos</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Los boletos de HubSpot buscan aquí las ediciones del calendario. Actualízalo cuando agregues o cambies
            una edición.
          </p>
          <p className="mt-3 text-xs text-ink-500">
            {isLoading
              ? "Consultando…"
              : isError || !status
                ? "No se pudo consultar el estado."
                : status.catalog.source === "db"
                  ? `${plural(status.catalog.count, "edición", "ediciones")} · actualizado ${catalogWhen ?? "—"}${
                      status.catalog.syncedBy ? ` por ${status.catalog.syncedBy}` : ""
                    }`
                  : `Sin actualizar desde el panel · usa el calendario que viene con el servidor (${plural(
                      status.catalog.count,
                      "edición",
                      "ediciones",
                    )})`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCatalog}
          disabled={syncCatalog.isPending}
          className="min-h-11 self-start rounded-full border border-ink-900/15 bg-white px-5 text-sm font-semibold hover:bg-cream-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {syncCatalog.isPending ? "Actualizando..." : "Actualizar calendario"}
        </button>
      </div>

      <div className="flex flex-col justify-between gap-4 md:border-l md:border-ink-900/10 md:pl-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Boletos desde HubSpot</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            Cada vez que un asesor cierra un negocio con un producto presencial, se emite el boleto y se manda por
            correo. Se revisa solo
            {status ? ` cada ${Math.max(1, Math.round(status.hubspot.intervalSec / 60))} min` : ""}; aquí puedes
            forzarlo ahora.
          </p>
          <p className="mt-3 text-xs text-ink-500">
            {isLoading
              ? "Consultando…"
              : isError || !status
                ? "No se pudo consultar el estado."
                : !hubspotEnabled
                  ? "Desactivado en este servidor (en pausa o sin configurar)."
                  : `Activo · última revisión ${hubspotWhen ?? "—"} · ${plural(
                      status.hubspot.pendingEvent,
                      "pendiente esperando evento",
                      "pendientes esperando evento",
                    )}`}
          </p>
        </div>
        <button
          type="button"
          onClick={handleHubspot}
          disabled={syncHubspot.isPending || !hubspotEnabled}
          className="min-h-11 self-start rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {syncHubspot.isPending ? "Sincronizando..." : "Sincronizar ahora"}
        </button>
      </div>
    </section>
  );
}
