import { useParams, Link } from 'react-router-dom';
import { useSubscriptionReceipt } from '@hooks/useReceipt';
import { formatCurrency, formatDate } from '@utils/formatters';
import Spinner from '@atoms/Spinner';
import {
  ReceiptShell,
  AmountBand,
  ConfirmationPanel,
  DetailRows,
  LinkButton,
  ReceiptNotFound,
} from '@molecules/ReceiptLayout';

const STATUS_LABEL: Record<string, string> = {
  active: 'Activa',
  trialing: 'En prueba',
  past_due: 'Pago vencido',
  canceled: 'Cancelada',
};

export default function Receipt() {
  const { id } = useParams<{ id: string }>();
  const { data: receipt, isLoading, isError } = useSubscriptionReceipt(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream-100">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !receipt) return <ReceiptNotFound />;

  const statusLabel = STATUS_LABEL[receipt.status] ?? receipt.status;
  const isPaid = receipt.status !== 'canceled';

  return (
    <ReceiptShell
      eyebrow="Recibo de pago · Diego Díaz"
      badge={statusLabel}
      badgeTone={isPaid ? 'good' : 'muted'}
      title={receipt.offerTitle}
      lead={`Gracias, ${receipt.customerName || 'cliente'}. Conserva esta información como referencia de tu suscripción.`}
      footerMeta={{ left: `Ref. ${receipt.reference.slice(0, 10)}…`, right: formatDate(receipt.currentPeriodStart) }}
    >
      <AmountBand label="Monto pagado" value={`${formatCurrency(receipt.amount, receipt.currency)} ${receipt.currency}`} />

      <ConfirmationPanel
        label={isPaid ? 'Suscripción activa' : 'Suscripción cancelada'}
        tag="Academia+ · anual"
        value={
          <>
            Plan <span className="italic">{receipt.plan}</span>
          </>
        }
        description={
          receipt.cancelAtPeriodEnd
            ? 'Tu suscripción sigue activa y da acceso hasta el final del periodo actual — la cancelación ya está programada.'
            : 'Tu suscripción quedó activa. Conserva esta información como referencia de tu registro.'
        }
      />

      <DetailRows
        rows={[
          ['Correo', receipt.customerEmail],
          ...(receipt.customerPhone ? ([['Teléfono', receipt.customerPhone]] as [string, string][]) : []),
          ['Monto', `${formatCurrency(receipt.amount, receipt.currency)} ${receipt.currency}`],
          ['Método', receipt.cardLabel || 'Tarjeta bancaria · Stripe'],
          ...(receipt.nextChargeAt
            ? ([['Próximo cobro', formatDate(receipt.nextChargeAt)]] as [string, string][])
            : []),
          ['Referencia', receipt.reference],
        ]}
      />

      <div className="mt-6">
        <LinkButton to="/mi-cuenta" label="Ir a mi cuenta" detail={receipt.customerEmail} dark />
      </div>
    </ReceiptShell>
  );
}
