import { useParams } from 'react-router-dom';
import { useOrderReceipt } from '@hooks/useReceipt';
import { formatCurrency, formatDate } from '@utils/formatters';
import Spinner from '@atoms/Spinner';
import { ReceiptShell, AmountBand, ConfirmationPanel, DetailRows, LinkButton, ReceiptNotFound } from '@molecules/ReceiptLayout';

export default function ReceiptOrder() {
  const { id } = useParams<{ id: string }>();
  const { data: receipt, isLoading, isError } = useOrderReceipt(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !receipt) return <ReceiptNotFound />;

  const ticketTitle = receipt.items.map((i) => i.title).join(', ');
  const eventFormat = receipt.items.map((i) => i.eventFormat).filter(Boolean).join(', ');
  const eventDate = receipt.items.map((i) => i.eventDate).filter(Boolean).join(', ');

  return (
    <ReceiptShell
      eyebrow="Recibo de pago · Diego Díaz"
      badge="Pagado"
      badgeTone="good"
      title={ticketTitle}
      lead={`Gracias, ${receipt.customerName || 'cliente'}. Conserva esta información como referencia de tu compra.`}
      footerMeta={{
        left: `Orden #${receipt.id.slice(-8).toUpperCase()}`,
        right: receipt.paidAt ? formatDate(receipt.paidAt) : '',
      }}
    >
      <AmountBand label="Monto pagado" value={`${formatCurrency(receipt.total, receipt.currency)} ${receipt.currency}`} />

      <ConfirmationPanel
        label="Compra confirmada"
        tag="Ticket · pago único"
        value={<span className="italic">{ticketTitle}</span>}
        description="Tu lugar quedó reservado. Conserva esta información como referencia de tu compra."
      />

      <DetailRows
        rows={[
          [receipt.items.length > 1 ? 'Artículos' : 'Producto', ticketTitle],
          ...(eventFormat ? ([['Formato', eventFormat]] as [string, string][]) : []),
          ...(eventDate ? ([['Fecha', eventDate]] as [string, string][]) : []),
          ['Correo', receipt.customerEmail],
          ['Monto', `${formatCurrency(receipt.total, receipt.currency)} ${receipt.currency}`],
          ...(receipt.tax > 0 ? ([['IVA', `${formatCurrency(receipt.tax, receipt.currency)} ${receipt.currency}`]] as [string, string][]) : []),
          ...(receipt.shippingCost > 0
            ? ([['Envío', `${formatCurrency(receipt.shippingCost, receipt.currency)} ${receipt.currency}`]] as [string, string][])
            : []),
          ...(receipt.shippingCarrier
            ? ([['Paquetería', receipt.shippingCarrier.toUpperCase()]] as [string, string][])
            : []),
          ...(receipt.shippingTrackingNumber
            ? ([['Número de guía', receipt.shippingTrackingNumber]] as [string, string][])
            : []),
          ['Referencia', receipt.reference],
        ]}
      />

      {receipt.tickets && receipt.tickets.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-300">— Tus boletos</span>
            <span className="font-serif text-[13px] italic text-ink-400">
              {receipt.tickets.length === 1 ? '1 boleto' : `${receipt.tickets.length} boletos`}
            </span>
          </div>
          <div className="border border-cream-400 bg-white">
            {receipt.tickets.map((ticket) => (
              <div
                key={ticket.folio}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-cream-400 px-5 py-4 last:border-0 sm:px-6"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[14px] font-bold tracking-[0.14em] text-ink-900">{ticket.folio}</p>
                  <p className="truncate text-[12px] text-ink-400">{ticket.attendeeName}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] ${
                    ticket.status === 'used'
                      ? 'bg-amber-50 text-amber-800'
                      : ticket.status === 'void'
                        ? 'bg-red-50 text-red-800'
                        : 'bg-emerald-50 text-emerald-800'
                  }`}
                >
                  {ticket.status === 'used' ? 'Utilizado' : ticket.status === 'void' ? 'Anulado' : 'Válido'}
                </span>
                <a
                  href={ticket.url}
                  className="text-[11px] font-bold uppercase tracking-[0.18em] text-ink-900 underline-offset-4 hover:underline"
                >
                  Ver boleto →
                </a>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[12px] leading-[1.6] text-ink-400">Presenta el código QR de cada boleto en la entrada del evento.</p>
        </div>
      )}

      {receipt.shippingTrackingNumber && (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {receipt.shippingTrackUrl && (
            <div className="flex-1">
              <LinkButton href={receipt.shippingTrackUrl} label="Rastrear envío" detail={receipt.shippingTrackingNumber} dark />
            </div>
          )}
          {receipt.shippingLabelUrl && (
            <div className="flex-1">
              <LinkButton href={receipt.shippingLabelUrl} label="Descargar guía (PDF)" />
            </div>
          )}
        </div>
      )}
    </ReceiptShell>
  );
}
