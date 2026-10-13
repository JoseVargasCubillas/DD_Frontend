import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as emailApi from '@api/email.api';
import type { CampaignHistoryItem } from '@api/email.api';
import { buildPreviewDocument } from '@utils/emailPreview';

const PAGE_SIZE = 15;

const pct = (rate: number) => `${(rate * 100).toFixed(1)}%`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Evita pedir al servidor en cada tecla del buscador.
function useDebounced<T>(value: T, delayMs = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function MetricCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded border border-cream-300 bg-cream-50 px-4 py-3">
      <p className="text-[20px] font-bold leading-none text-ink-900">{value}</p>
      <p className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-ink-400">{label}</p>
      {hint && <p className="mt-1 text-[10px] text-ink-400">{hint}</p>}
    </div>
  );
}

function CampaignDrawer({ id, onClose }: { id: string; onClose: () => void }) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['email-campaign', id],
    queryFn: () => emailApi.getCampaignDetail(id),
  });

  const duplicate = () => {
    if (!data?.html) return;
    navigate('/admin/email', {
      state: { duplicate: { subject: data.subject, html: data.html, segment: data.segmentId } },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <aside
        className="h-full w-full max-w-[720px] overflow-y-auto bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">Detalle de campaña</p>
            <h2 className="mt-1 text-[20px] font-semibold leading-tight text-ink-900">{data?.subject ?? '…'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 border border-cream-400 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-600 hover:border-ink-600"
          >
            Cerrar
          </button>
        </div>

        {isLoading && <p className="mt-8 text-[13px] text-ink-400">Cargando…</p>}
        {isError && <p className="mt-8 text-[13px] text-red-600">No se pudo cargar la campaña.</p>}

        {data && (
          <div className="mt-6 space-y-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-ink-600 sm:grid-cols-3">
              <p><span className="block text-[10px] uppercase tracking-[0.16em] text-ink-400">Enviada</span>{formatDate(data.sentAt)}</p>
              <p><span className="block text-[10px] uppercase tracking-[0.16em] text-ink-400">Segmento</span>{data.segment}</p>
              <p><span className="block text-[10px] uppercase tracking-[0.16em] text-ink-400">Enviada por</span>{data.sentByName ?? '—'}</p>
              <p>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-ink-400">Contactos del segmento</span>
                {data.totalTargets}
              </p>
              <p>
                <span className="block text-[10px] uppercase tracking-[0.16em] text-ink-400">Aceptados por Mailchimp</span>
                {data.recipientCount}
                {data.syncErrors > 0 ? ` (${data.syncErrors} rechazados)` : ''}
              </p>
            </div>

            {data.status === 'sending' && (
              <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
                Esta campaña se está enviando en segundo plano. Las métricas aparecerán cuando termine.
              </p>
            )}
            {data.status === 'failed' && (
              <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                <strong>No se envió.</strong> {data.error ?? 'Ocurrió un error durante el envío.'}
              </p>
            )}

            {data.detail ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <MetricCard label="Enviados" value={data.detail.emailsSent} />
                <MetricCard
                  label="Aperturas únicas"
                  value={pct(data.detail.openRate)}
                  hint={`${data.detail.opens} personas · ${data.detail.opensTotal} aperturas`}
                />
                <MetricCard
                  label="Clics únicos"
                  value={pct(data.detail.clickRate)}
                  hint={`${data.detail.clicks} personas · ${data.detail.clicksTotal} clics`}
                />
                <MetricCard label="Bajas" value={data.detail.unsubscribed} />
                <MetricCard
                  label="Rebotes"
                  value={data.detail.bounces}
                  hint={`${data.detail.hardBounces} duros · ${data.detail.softBounces} suaves`}
                />
                <MetricCard label="Quejas de spam" value={data.detail.abuseReports} />
              </div>
            ) : (
              data.status === 'sent' && (
                <p className="rounded border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-700">
                  No hay métricas disponibles: Mailchimp aún no las genera o la campaña ya no existe allí.
                </p>
              )
            )}

            <div className="flex flex-wrap gap-2">
              {data.detail?.mailchimpUrl && (
                <a
                  href={data.detail.mailchimpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-[40px] items-center border border-cream-400 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 hover:border-ink-600 hover:text-ink-900"
                >
                  Ver en Mailchimp ↗
                </a>
              )}
              <button
                type="button"
                onClick={duplicate}
                disabled={!data.html}
                title={data.html ? 'Carga este correo en el editor' : 'Esta campaña no tiene el HTML guardado'}
                className="h-[40px] bg-ink-900 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-ink-700 disabled:opacity-40"
              >
                Duplicar campaña
              </button>
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">Correo enviado</p>
              {data.html ? (
                <iframe
                  title="Correo enviado"
                  sandbox=""
                  srcDoc={buildPreviewDocument(data.html)}
                  className="h-[520px] w-full border border-cream-300 bg-white"
                />
              ) : (
                <p className="rounded border border-cream-300 bg-cream-50 px-4 py-6 text-center text-[12px] text-ink-400">
                  El HTML no se guardó para esta campaña (se envió antes de que existiera esta función).
                </p>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}

export default function EmailHistory() {
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const q = useDebounced(search);

  // Al cambiar un filtro se vuelve a la primera página.
  useEffect(() => setPage(1), [q, segment, from, to]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['email-history', { page, q, segment, from, to }],
    queryFn: () => emailApi.getCampaignHistory({ page, limit: PAGE_SIZE, q, segment, from, to }),
    placeholderData: (previous) => previous,
    // Mientras haya un envío en proceso, se consulta su avance.
    refetchInterval: (query) => (query.state.data?.items.some((c) => c.status === 'sending') ? 4000 : false),
  });

  const hasFilters = Boolean(search || segment || from || to);
  const clearFilters = () => {
    setSearch('');
    setSegment('');
    setFrom('');
    setTo('');
  };

  return (
    <div className="mx-auto max-w-[1100px] space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/admin/email"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400 hover:text-ink-700"
          >
            ← Email campaigns
          </Link>
          <h1 className="mt-2 text-3xl font-semibold leading-none text-ink-900">Historial de campañas</h1>
          <p className="mt-2 text-[13px] text-ink-500">
            Envíos masivos por Mailchimp, con sus métricas y el correo enviado.
          </p>
        </div>
        {data && <p className="text-[12px] text-ink-500">{data.total} campañas</p>}
      </header>

      {/* Filtros */}
      <div className="grid gap-2 rounded border border-cream-300 bg-white p-4 sm:grid-cols-[1fr_200px_150px_150px_auto]">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por asunto…"
          className="h-[38px] border border-cream-300 bg-cream-50 px-3 text-[13px] placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
        />
        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className="h-[38px] border border-cream-300 bg-cream-50 px-2 text-[13px] text-ink-700"
        >
          <option value="">Todos los segmentos</option>
          {(data?.segments ?? []).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          aria-label="Desde"
          className="h-[38px] border border-cream-300 bg-cream-50 px-2 text-[13px] text-ink-700"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          aria-label="Hasta"
          className="h-[38px] border border-cream-300 bg-cream-50 px-2 text-[13px] text-ink-700"
        />
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasFilters}
          className="h-[38px] border border-cream-400 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-600 hover:border-ink-600 disabled:opacity-40"
        >
          Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className={`overflow-x-auto rounded border border-cream-300 bg-white transition-opacity ${isFetching ? 'opacity-70' : ''}`}>
        <table className="w-full min-w-[820px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-cream-300 bg-cream-50 text-[10px] uppercase tracking-[0.18em] text-ink-400">
              <th className="px-4 py-3 font-bold">Fecha</th>
              <th className="px-4 py-3 font-bold">Asunto</th>
              <th className="px-4 py-3 font-bold">Segmento</th>
              <th className="px-4 py-3 text-right font-bold">Enviados</th>
              <th className="px-4 py-3 text-right font-bold">Aperturas</th>
              <th className="px-4 py-3 text-right font-bold">Clics</th>
              <th className="px-4 py-3 text-right font-bold">Bajas</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-ink-400">Cargando…</td></tr>
            )}
            {isError && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-red-600">No se pudo cargar el historial.</td></tr>
            )}
            {data && data.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-400">
                  {hasFilters ? 'Ninguna campaña coincide con los filtros.' : 'Aún no hay campañas enviadas.'}
                </td>
              </tr>
            )}
            {data?.items.map((c: CampaignHistoryItem) => (
              <tr
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className="cursor-pointer border-b border-cream-200 last:border-b-0 hover:bg-cream-50"
              >
                <td className="whitespace-nowrap px-4 py-3 text-ink-500">{formatDate(c.sentAt)}</td>
                <td className="max-w-[280px] truncate px-4 py-3 font-semibold text-ink-900">{c.subject}</td>
                <td className="px-4 py-3 text-ink-600">{c.segment}</td>
                <td className="px-4 py-3 text-right text-ink-900">
                  {c.status === 'sending' ? (
                    <span className="font-bold text-amber-600">Enviando…</span>
                  ) : c.status === 'failed' ? (
                    <span className="font-bold text-red-600" title={c.error ?? undefined}>Fallida</span>
                  ) : (
                    c.recipientCount
                  )}
                </td>
                <td className="px-4 py-3 text-right text-ink-600">{c.report ? pct(c.report.openRate) : '—'}</td>
                <td className="px-4 py-3 text-right text-ink-600">{c.report ? pct(c.report.clickRate) : '—'}</td>
                <td className="px-4 py-3 text-right text-ink-600">{c.report ? c.report.unsubscribed : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {data && data.pages > 1 && (
        <div className="flex items-center justify-between text-[12px] text-ink-500">
          <span>Página {data.page} de {data.pages}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={data.page <= 1}
              className="h-[36px] border border-cream-400 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-600 hover:border-ink-600 disabled:opacity-40"
            >
              ← Anterior
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
              disabled={data.page >= data.pages}
              className="h-[36px] border border-cream-400 px-4 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-600 hover:border-ink-600 disabled:opacity-40"
            >
              Siguiente →
            </button>
          </div>
        </div>
      )}

      {selectedId && <CampaignDrawer id={selectedId} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
