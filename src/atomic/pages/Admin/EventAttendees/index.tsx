import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  useAddAttendee,
  useDeleteAttendee,
  useEventAttendees,
  useReactivateAttendee,
  useUndoCheckIn,
  useVoidAttendee,
} from '@hooks/useTickets';
import { formatDate, formatDateShort, formatTimeCdmx } from '@utils/formatters';
import Spinner from '@atoms/Spinner';
import type { AdminTicket } from '@t/index';

type Filter = 'all' | 'checkedIn' | 'pending' | 'void';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'checkedIn', label: 'Asistieron' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'void', label: 'Bajas' },
];

function originLabel(ticket: AdminTicket): string {
  if (ticket.source === 'manual') return 'Alta manual';
  if (ticket.source !== 'hubspot') return 'Compra web';
  return ticket.advisorName ? `Asesor: ${ticket.advisorName}` : 'Asesor (sin asignar)';
}

function StatusCell({ ticket }: { ticket: AdminTicket }) {
  if (ticket.accessType === 'online' && ticket.status === 'valid') {
    return <span className="inline-flex rounded-full bg-sky-100 px-2.5 py-0.5 text-xs font-semibold text-sky-800">Inscrito online</span>;
  }
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

function RowActions({
  ticket,
  busy,
  onUndo,
  onVoid,
  onReactivate,
  onDelete,
}: {
  ticket: AdminTicket;
  busy: boolean;
  onUndo: (t: AdminTicket) => Promise<void>;
  onVoid: (t: AdminTicket) => Promise<void>;
  onReactivate: (t: AdminTicket) => Promise<void>;
  onDelete: (t: AdminTicket) => Promise<void>;
}) {
  const link = 'text-xs font-semibold hover:underline disabled:opacity-50';
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 md:justify-end">
      {ticket.status === 'used' && (
        <button type="button" onClick={() => void onUndo(ticket)} disabled={busy} className={`${link} text-red-700`}>
          Deshacer check-in
        </button>
      )}
      {ticket.status === 'valid' && (
        <button type="button" onClick={() => void onVoid(ticket)} disabled={busy} className={`${link} text-red-700`}>
          Dar de baja
        </button>
      )}
      {ticket.status === 'void' && (
        <button type="button" onClick={() => void onReactivate(ticket)} disabled={busy} className={`${link} text-emerald-700`}>
          Reactivar
        </button>
      )}
      {ticket.source === 'manual' && ticket.status !== 'used' && (
        <button type="button" onClick={() => void onDelete(ticket)} disabled={busy} className={`${link} text-ink-500`}>
          Eliminar
        </button>
      )}
    </div>
  );
}

function AddAttendeeModal({ eventId, eventTitle, onClose }: { eventId: string; eventTitle: string; onClose: () => void }) {
  const add = useAddAttendee(eventId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [ticketType, setTicketType] = useState<'General' | 'VIP'>('General');
  const [sendEmail, setSendEmail] = useState(true);

  const submit = async (force = false): Promise<void> => {
    try {
      const result = await add.mutateAsync({
        name,
        email,
        phone: phone || undefined,
        amount: Number(amount) || 0,
        ticketType,
        sendEmail,
        force,
      });
      if (result.emailError) toast.error(`Quedó registrado, pero el correo falló: ${result.emailError}`);
      else toast.success(result.emailSent ? 'Asistente agregado y correo enviado' : 'Asistente agregado');
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'No se pudo agregar al asistente';
      // Duplicado: el servidor avisa y el admin decide si es otra persona con el mismo nombre.
      if (!force && /ya está inscrito/i.test(message) && window.confirm(`${message}\n\n¿Agregarlo de todos modos?`)) {
        await submit(true);
        return;
      }
      toast.error(message);
    }
  };

  const field =
    'mt-1 min-h-11 w-full rounded-xl border border-ink-900/15 bg-cream-50 px-4 text-sm focus:border-ink-900 focus:outline-none';
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Agregar asistente"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Agregar asistente</p>
        <h2 className="mt-1 font-serif text-2xl leading-tight">{eventTitle}</h2>
        <p className="mt-2 text-xs text-ink-500">
          Si el evento es presencial se emite un boleto con QR; si es online, un enlace de un solo uso al grupo de WhatsApp.
        </p>

        <label className="mt-4 block text-xs font-semibold text-ink-600">
          Nombre del asistente
          <input required value={name} onChange={(e) => setName(e.target.value)} className={field} autoFocus />
        </label>
        <label className="mt-3 block text-xs font-semibold text-ink-600">
          Correo (aquí llega el acceso)
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
        </label>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="block text-xs font-semibold text-ink-600">
            Teléfono (opcional)
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={field} />
          </label>
          <label className="block text-xs font-semibold text-ink-600">
            Precio (0 = cortesía)
            <input type="number" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} className={field} />
          </label>
        </div>
        <label className="mt-3 block text-xs font-semibold text-ink-600">
          Tipo de boleto (presencial)
          <select value={ticketType} onChange={(e) => setTicketType(e.target.value as 'General' | 'VIP')} className={field}>
            <option value="General">General</option>
            <option value="VIP">VIP</option>
          </select>
        </label>
        <label className="mt-4 flex items-center gap-2 text-sm text-ink-700">
          <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
          Enviar el acceso por correo
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full border border-ink-900/15 px-5 text-sm font-semibold hover:bg-cream-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={add.isPending}
            className="min-h-11 rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:opacity-50"
          >
            {add.isPending ? 'Agregando…' : 'Agregar'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EventAttendees() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error, dataUpdatedAt } = useEventAttendees(id);
  const undo = useUndoCheckIn();
  const voidMutation = useVoidAttendee();
  const reactivate = useReactivateAttendee();
  const remove = useDeleteAttendee();
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const tickets = useMemo(() => {
    const list = data?.tickets ?? [];
    const q = search.trim().toLowerCase();
    return list.filter((t) => {
      if (filter === 'checkedIn' && t.status !== 'used') return false;
      if (filter === 'pending' && t.status !== 'valid') return false;
      if (filter === 'void' && t.status !== 'void') return false;
      if (!q) return true;
      return [t.attendeeName, t.attendeeEmail, t.folio, originLabel(t)].some((v) => v?.toLowerCase().includes(q));
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

  const runAction = async (action: () => Promise<unknown>, ok: string, fail: string) => {
    try {
      await action();
      toast.success(ok);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : fail);
    }
  };

  const handleVoid = async (ticket: AdminTicket) => {
    const what =
      ticket.accessType === 'online' ? 'Su enlace al grupo dejará de funcionar.' : 'Su QR dejará de ser válido en el escáner.';
    if (!window.confirm(`¿Dar de baja a ${ticket.attendeeName} (${ticket.folio})? ${what} Puedes reactivarlo después.`)) return;
    await runAction(() => voidMutation.mutateAsync(ticket.folio), 'Dado de baja', 'No se pudo dar de baja');
  };

  const handleReactivate = async (ticket: AdminTicket) => {
    await runAction(() => reactivate.mutateAsync(ticket.folio), 'Reactivado', 'No se pudo reactivar');
  };

  const handleDelete = async (ticket: AdminTicket) => {
    if (!window.confirm(`¿Eliminar definitivamente a ${ticket.attendeeName} (${ticket.folio})? No se puede deshacer.`)) return;
    await runAction(() => remove.mutateAsync(ticket.folio), 'Eliminado', 'No se pudo eliminar');
  };

  const busy = undo.isPending || voidMutation.isPending || reactivate.isPending || remove.isPending;

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
  // Eventos online (Holding / SEF Online): solo lista de inscritos, sin QR ni check-in.
  const onlineOnly = total > 0 && data.tickets.every((t) => t.accessType === 'online');
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
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="inline-flex min-h-11 items-center rounded-full border border-ink-900 bg-white px-5 text-sm font-semibold hover:bg-cream-200"
          >
            + Agregar asistente
          </button>
          {!onlineOnly && (
            <Link
              to="/admin/eventos/check-in"
              className="inline-flex min-h-11 items-center rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
            >
              Escanear QR
            </Link>
          )}
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

      {onlineOnly ? (
        <section className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Inscritos online</p>
          <p className="mt-1 font-serif text-3xl leading-none">
            {total} <span className="text-base font-sans text-ink-600">inscritos</span>
          </p>
        </section>
      ) : (
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
      )}

      <section className="mt-6 rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-ink-900/10 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, correo, folio o asesor"
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
                    <th className="px-4 py-3">Origen / Asesor</th>
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
                      <td className="px-4 py-3 text-ink-600">{originLabel(t)}</td>
                      <td className="px-4 py-3">
                        <StatusCell ticket={t} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RowActions ticket={t} busy={busy} onUndo={handleUndo} onVoid={handleVoid} onReactivate={handleReactivate} onDelete={handleDelete} />
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
                  <p className="mt-1 text-xs text-ink-500">{originLabel(t)}</p>
                  <div className="mt-3">
                    <RowActions ticket={t} busy={busy} onUndo={handleUndo} onVoid={handleVoid} onReactivate={handleReactivate} onDelete={handleDelete} />
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {adding && id && <AddAttendeeModal eventId={id} eventTitle={data.event.title} onClose={() => setAdding(false)} />}
    </div>
  );
}
