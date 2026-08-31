import { useParams, Link } from 'react-router-dom';
import { useSubscriptionReceipt } from '@hooks/useReceipt';
import { formatCurrency, formatDate } from '@utils/formatters';
import Spinner from '@atoms/Spinner';

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
      <div className="flex min-h-[60vh] items-center justify-center bg-cream-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="bg-cream-50 text-ink-900">
        <div className="mx-auto max-w-[1184px] px-5 py-28 text-center sm:px-8 lg:px-0">
          <h1 className="font-serif text-[56px] leading-[0.9]">
            Recibo<span className="italic">.</span>
          </h1>
          <p className="mt-6 text-ink-400">No encontramos este recibo. El enlace pudo haber expirado o el pago aún no se confirma.</p>
          <Link to="/" className="btn-primary mt-8 inline-flex">
            Ir al inicio →
          </Link>
        </div>
      </div>
    );
  }

  const statusLabel = STATUS_LABEL[receipt.status] ?? receipt.status;

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>ACADEMIA</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Recibo.</span>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Recibo de pago · Diego Díaz</span>
            <span className="inline-flex items-center gap-2 border border-ink-900/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-700">
              <span className={`h-2 w-2 rounded-full ${receipt.status === 'active' ? 'bg-green-600' : 'bg-ink-300'}`} />
              {statusLabel}
            </span>
          </div>
          <h1 className="mt-8 font-serif text-[56px] leading-[0.9] tracking-[-0.03em] sm:text-[80px]">
            {receipt.offerTitle}<span className="italic">.</span>
          </h1>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="border border-cream-400 bg-white p-8 sm:p-10">
              <div className="flex items-start justify-between border-b border-cream-400 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Facturado a</p>
                  <p className="mt-2 font-serif text-[24px] italic leading-tight">{receipt.customerName || 'Cliente'}</p>
                  <p className="mt-1 text-[13px] text-ink-400">{receipt.customerEmail}</p>
                </div>
                <p className="text-right text-[11px] uppercase tracking-[0.18em] text-ink-300">
                  Referencia
                  <br />
                  <span className="font-serif text-[13px] normal-case tracking-normal text-ink-700">
                    {receipt.reference.slice(0, 14)}…
                  </span>
                </p>
              </div>
              <div className="divide-y divide-cream-400">
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Plan</span>
                  <span className="font-serif text-[15px] text-right capitalize">{receipt.plan}</span>
                </div>
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Método de pago</span>
                  <span className="font-serif text-[15px]">{receipt.cardLabel || 'Tarjeta bancaria · Stripe'}</span>
                </div>
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Periodo actual</span>
                  <span className="font-serif text-[15px]">
                    {formatDate(receipt.currentPeriodStart)} — {formatDate(receipt.currentPeriodEnd)}
                  </span>
                </div>
                {receipt.nextChargeAt && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Próxima renovación</span>
                    <span className="font-serif text-[15px]">{formatDate(receipt.nextChargeAt)}</span>
                  </div>
                )}
                {receipt.cancelAtPeriodEnd && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Cancelación</span>
                    <span className="font-serif text-[15px]">Aplica al final del periodo actual</span>
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between border-t border-ink-900/20 pt-6">
                <span className="font-serif text-[18px]">Total pagado</span>
                <span className="font-serif text-[40px]">
                  {formatCurrency(receipt.amount, receipt.currency)}
                  <span className="ml-2 text-[13px] uppercase tracking-[0.18em] text-ink-300">{receipt.currency}</span>
                </span>
              </div>
              <p className="mt-8 border-t border-cream-400 pt-5 text-[12px] leading-[1.6] text-ink-400">
                Este recibo confirma tu pago. No sustituye un CFDI ante el SAT — si necesitas factura fiscal, escríbenos a{' '}
                <a href="mailto:servicios@diegodiaz.mx" className="underline">servicios@diegodiaz.mx</a>.
              </p>
            </div>

            <aside className="border border-ink-900 bg-cream-100 p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Empieza aquí</p>
              <h3 className="mt-4 font-serif text-[28px]">Portal de miembro.</h3>
              <p className="mt-4 text-[13px] leading-[1.7] text-ink-500">
                Inicia sesión con {receipt.customerEmail} para ver tu progreso, material descargable y gestionar tu suscripción.
              </p>
              <Link
                to="/mi-cuenta"
                className="mt-6 flex w-full items-center justify-between bg-ink-900 px-6 py-4 text-cream-50 transition-opacity hover:opacity-90"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Ir a mi cuenta</span>
                <span>→</span>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
