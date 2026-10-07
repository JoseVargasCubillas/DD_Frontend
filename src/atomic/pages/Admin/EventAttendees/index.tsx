import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useEventAttendees, useUndoCheckIn } from '@hooks/useTickets';
import { formatDate, formatDateShort, formatTimeCdmx } from '@utils/formatters';
import Spinner from '@atoms/Spinner';
import type { AdminTicket } from '@t/index';

type Filter = 'all' | 'checkedIn' | 'pending';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'checkedIn', label: 'Asistieron' },
  { key: 'pending', label: 'Pendientes' },
];

function StatusCell({ ticket }: { ticket: AdminTicket }) {
  if (ticket.status === 'used') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
        ✓ Asistió{ticket.checkedInAt ? ` ${formatTimeCdmx(ticket.checkedInAt)}` : ''}
      </span>
    );
  }
  if (ticket.status === 'void') {
    return <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-800">Anulado</span>;
  }
  return <span className="inline-flex rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-semibold text-ink-600">Pendiente</span>;
}

export default function EventAttendees() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, dataUpdatedAt } = useEventAttendees(id);
  const undo = useUndoCheckIn();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const tickets = useMemo(() => {
    const list = data?.tickets ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((t) => {
      if (filter === 'checkedIn' && t.status !== 'used') return false;
      if (filter === 'pending' && t.status !== 'valid') return false;
      if (!q) return true;
      return [t.attendeeName, t.attendeeEmail, t.folio].some((v) => v?.toLowerCase().includes(q));
    });
  }, [data?.tickets, filter, search]);

  const handleUndo = async (ticket: AdminTicket) => {
    if (!window.confirm(`¿Deshacer el check-in de ${ticket.attendeeName} (${ticket.folio})?`)) return;
    try {
      await undo.mutateAsync(ticket.folio);
      toast.success('Check-in deshecho');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo deshacer el check-in');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-[calc(100vh-96px)] bg-cream text-ink-900">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">Eventos / Asistentes</p>
        <h1 className="mt-2 font-serif text-4xl leading-none">No se pudo cargar</h1>
        <p className="mt-3 text-sm text-ink-600">{error instanceof Error ? error.message : 'Error al obtener los asistentes.'}</p>
        <Link to="/admin/eventos" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream">
          Volver a eventos
        </Link>
      </div>
    );
  }

  const { total, checkedIn } = data.summary;
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-cream text-ink-900">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">Eventos / Asistentes</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-5xl">{data.event.title}</h1>
          <p className="mt-2 text-sm text-ink-600">{data.event.dateLabel || (data.event.startDate ? formatDate(data.event.startDate) : '')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/eventos/check-in"
            className="inline-flex min-h-11 items-center rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
          >
            Escanear QR
          </Link>
          {data.sheetUrl && (
            <a
              href={data.sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-ink-900/15 bg-white px-5 text-sm font-semibold hover:bg-cream-200"
            >
              Abrir Google Sheet ↗
            </a>
          )}
        </div>
      </header>

      <section className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Asistencia</p>
            <p className="mt-1 font-serif text-3xl leading-none">
              {checkedIn} <span className="text-ink-400">/ {total}</span>{' '}
              <span className="text-base font-sans text-ink-600">asistieron</span>
            </p>
          </div>
          <p className="text-xs text-ink-400">
            {pct}% · actualizado {dataUpdatedAt ? formatTimeCdmx(new Date(dataUpdatedAt)) : ''} · se refresca cada 15 s
          </p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-300">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-ink-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo o folio"
            className="min-h-11 w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 text-sm focus:border-ink-900 focus:outline-none sm:max-w-sm"
          />
          <div className="flex gap-1 rounded-full bg-cream-100 p-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`min-h-9 rounded-full px-4 text-sm font-semibold transition-colors ${
                  filter === f.key ? 'bg-ink-900 text-cream' : 'text-ink-600 hover:bg-cream-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {tickets.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-500">No hay boletos que coincidan.</p>
        ) : (
          <>
            {/* Tabla (desktop) */}
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-600">
                  <tr>
                    <th className="px-4 py-3">Nombre</th>
                    <th className="px-4 py-3">Correo</th>
                    <th className="px-4 py-3">Folio</th>
                    <th className="px-4 py-3">Compra</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-900/5">
                  {tickets.map((t) => (
                    <tr key={t.folio} className="hover:bg-cream-50">
                      <td className="px-4 py-3 font-semibold">
                        {t.attendeeName}
                        {t.seatTotal > 1 && <span className="ml-2 text-xs text-ink-400">({t.seatIndex}/{t.seatTotal})</span>}
                      </td>
                      <td className="px-4 py-3 text-ink-600">{t.attendeeEmail}</td>
                      <td className="px-4 py-3 font-mono text-xs tracking-wider">{t.folio}</td>
                      <td className="px-4 py-3 text-ink-600">{t.purchasedAt ? formatDateShort(t.purchasedAt) : '—'}</td>
                      <td className="px-4 py-3">
                        <StatusCell ticket={t} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {t.status === 'used' && (
                          <button
                            type="button"
                            onClick={() => void handleUndo(t)}
                            disabled={undo.isPending}
                            className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-50"
                          >
                            Deshacer check-in
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards (móvil) */}
            <ul className="divide-y divide-ink-900/5 md:hidden">
              {tickets.map((t) => (
                <li key={t.folio} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{t.attendeeName}</p>
                      <p className="truncate text-xs text-ink-500">{t.attendeeEmail}</p>
                    </div>
                    <StatusCell ticket={t} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-500">
                    <span className="font-mono tracking-wider">{t.folio}</span>
                    <span>{t.purchasedAt ? formatDateShort(t.purchasedAt) : ''}</span>
                  </div>
                  {t.status === 'used' && (
                    <button
                      type="button"
                      onClick={() => void handleUndo(t)}
                      disabled={undo.isPending}
                      className="mt-3 text-xs font-semibold text-red-700 disabled:opacity-50"
                    >
                      Deshacer check-in
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
