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
