import { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTicket } from '@hooks/useTickets';
import { ApiError } from '@api/client';
import { formatCurrency, formatDate, formatDateTimeCdmx } from '@utils/formatters';
import Spinner from '@atoms/Spinner';
import type { PublicTicket, TicketStatus } from '@t/index';

const STATUS_STYLE: Record<TicketStatus, { label: string; className: string; dot: string }> = {
  valid: { label: 'Válido', className: 'border-emerald-200 bg-emerald-50 text-emerald-800', dot: 'bg-emerald-500' },
  used: { label: 'Ya utilizado ✅', className: 'border-amber-200 bg-amber-50 text-amber-800', dot: 'bg-amber-500' },
  void: { label: 'Anulado', className: 'border-red-200 bg-red-50 text-red-800', dot: 'bg-red-500' },
};

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-cream-400 py-3 last:border-0">
      <span className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-ink-300">{label}</span>
      <span className={`text-right text-[14px] font-bold leading-[1.4] text-ink-900 ${mono ? 'font-mono tracking-wider' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function TicketInvalid({ reason }: { reason: 'forbidden' | 'notFound' | 'error' }) {
  const copy =
    reason === 'forbidden'
      ? 'El enlace de este boleto no es auténtico o fue modificado. Verifica que lo abriste desde tu correo de confirmación.'
      : reason === 'notFound'
        ? 'No encontramos un boleto con este folio. Revisa que el enlace esté completo o consulta tu correo de confirmación.'
        : 'No pudimos cargar el boleto en este momento. Intenta de nuevo en unos minutos.';

  return (
    <div className="bg-cream-100 text-ink-900">
      <div className="mx-auto max-w-[560px] px-6 py-24 text-center sm:px-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink-300">— Boleto · Diego Díaz</span>
        <h1 className="mt-5 font-serif text-[44px] leading-[0.95]">
          Boleto no válido<span className="italic">.</span>
        </h1>
        <p className="mt-6 text-[15px] leading-[1.7] text-ink-400">{copy}</p>
        <p className="mt-4 text-[13px] text-ink-400">
          ¿Necesitas ayuda? Escríbenos a{' '}
          <a href="mailto:servicios@diegodiaz.mx" className="underline">
            servicios@diegodiaz.mx
          </a>
          .
        </p>
        <Link to="/eventos" className="btn-primary mt-8 inline-flex">
          Ver eventos →
        </Link>
      </div>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: PublicTicket }) {
  const status = STATUS_STYLE[ticket.status] ?? STATUS_STYLE.valid;
  const isUsed = ticket.status === 'used';
  const isVoid = ticket.status === 'void';

  return (
    <div className="bg-cream-100 text-ink-900">
      <div className="h-2 bg-ink-900 print-hidden" />
      <div className="mx-auto max-w-[520px] px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-6 text-center print-hidden">
          <span className="text-[10px] uppercase tracking-[0.3em] text-ink-300">— Boleto de acceso · Diego Díaz</span>
          <h1 className="mt-3 font-serif text-[34px] leading-[1.05] sm:text-[40px]">
            Tu lugar está confirmado<span className="italic">.</span>
          </h1>
          <p className="mt-3 text-[14px] leading-[1.7] text-ink-400">Presenta este código en la entrada del evento.</p>
        </div>

        <article
          id="ticket-print-root"
          className={`overflow-hidden rounded-[22px] border border-cream-400 bg-[#fbf8f1] shadow-[0_24px_60px_-30px_rgba(10,9,8,0.35)] ${
            isVoid ? 'opacity-90 grayscale-[0.4]' : ''
          }`}
        >
          <header className="bg-ink-900 px-6 py-6 text-cream-50 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink-100">— Evento</span>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${status.className}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <h2 className="mt-3 font-serif text-[26px] leading-[1.1] sm:text-[30px]">{ticket.eventTitle}</h2>
            <p className="mt-2 text-[13px] text-ink-100">
              {ticket.eventDate}
              {ticket.eventFormat ? ` · ${ticket.eventFormat}` : ''}
            </p>
          </header>

          <section className="relative px-6 pb-8 pt-8 text-center sm:px-8">
            <div className="mx-auto inline-block rounded-2xl border border-cream-400 bg-white p-4 shadow-sm">
              <img
                src={ticket.qrUrl}
                alt={`Código QR del boleto ${ticket.folio}`}
                width={240}
                height={240}
                className="block h-[240px] w-[240px]"
              />
            </div>
            <p className="mt-5 text-[10px] uppercase tracking-[0.3em] text-ink-300">Folio</p>
            <p className="mt-1 font-mono text-[26px] font-bold tracking-[0.18em] text-ink-900 sm:text-[30px]">{ticket.folio}</p>

            {isUsed && ticket.checkedInAt && (
              <p className="mt-4 inline-block rounded-full bg-amber-50 px-4 py-2 text-[12px] font-semibold text-amber-800">
                Registrado el {formatDateTimeCdmx(ticket.checkedInAt)}
              </p>
            )}
            {isVoid && (
              <p className="mt-4 inline-block rounded-full bg-red-50 px-4 py-2 text-[12px] font-semibold text-red-800">
                Este boleto fue anulado y no permite el acceso.
              </p>
            )}
          </section>

          {/* Línea troquelada */}
          <div className="relative flex items-center">
            <span className="absolute -left-3 h-6 w-6 rounded-full border border-cream-400 bg-cream-100" />
            <span className="mx-6 flex-1 border-t-2 border-dashed border-cream-400 sm:mx-8" />
            <span className="absolute -right-3 h-6 w-6 rounded-full border border-cream-400 bg-cream-100" />
          </div>

          <section className="px-6 py-6 sm:px-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-300">— Asistente</p>
            <p className="mt-2 font-serif text-[24px] leading-[1.1] text-ink-900">{ticket.attendeeName}</p>

            <div className="mt-5">
              <Row label="Evento" value={ticket.eventTitle} />
              {ticket.eventDate && <Row label="Fecha" value={ticket.eventDate} />}
              {ticket.eventFormat && <Row label="Formato / Sede" value={ticket.eventFormat} />}
              {ticket.seatTotal > 1 && <Row label="Asiento" value={`Boleto ${ticket.seatIndex} de ${ticket.seatTotal}`} />}
              <Row label="Monto" value={`${formatCurrency(ticket.amount, ticket.currency)} ${ticket.currency}`} />
              {ticket.purchasedAt && <Row label="Compra" value={formatDate(ticket.purchasedAt)} />}
              {(ticket.orderLabel || ticket.orderReference) && <Row label="Referencia" value={ticket.orderLabel || ticket.orderReference} mono />}
            </div>

            <p className="mt-6 text-center text-[12px] leading-[1.6] text-ink-400">
              Presenta este código en la entrada del evento. Boleto personal e intransferible.
            </p>
          </section>
        </article>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row print-hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex flex-1 items-center justify-between border border-ink-900 bg-ink-900 px-6 py-4 text-cream-50 transition-opacity hover:opacity-90"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Guardar / Imprimir</span>
            <span className="font-serif text-[13px] italic text-ink-100">PDF →</span>
          </button>
          {ticket.orderReference && (
            <Link
              to={`/recibo/pedido/${ticket.orderReference}`}
              className="flex flex-1 items-center justify-between border border-cream-400 bg-white px-6 py-4 text-ink-900 transition-opacity hover:opacity-90"
            >
              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Ver recibo</span>
              <span className="font-serif text-[13px] italic text-ink-400">→</span>
            </Link>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-baseline justify-between gap-3 border-t border-cream-400 pt-6 print-hidden">
          <span className="font-serif text-[18px] text-ink-900">El éxito ama la preparación.</span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-300">— Diego Díaz</span>
        </div>
      </div>
    </div>
  );
}

export default function Ticket() {
  const { folio } = useParams<{ folio: string }>();
  const [searchParams] = useSearchParams();
  const t = searchParams.get('t') ?? undefined;
  const { data: ticket, isLoading, isError, error } = useTicket(folio, t);

  useEffect(() => {
    document.body.classList.add('dd-ticket-print');
    return () => document.body.classList.remove('dd-ticket-print');
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !ticket) {
    const status = error instanceof ApiError ? error.status : 0;
    return <TicketInvalid reason={status === 403 ? 'forbidden' : status === 404 ? 'notFound' : 'error'} />;
  }

  return <TicketCard ticket={ticket} />;
}
