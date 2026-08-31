import { useParams, Link } from 'react-router-dom';
import { useOrderReceipt } from '@hooks/useReceipt';
import { formatCurrency, formatDate } from '@utils/formatters';
import Spinner from '@atoms/Spinner';

export default function ReceiptOrder() {
  const { id } = useParams<{ id: string }>();
  const { data: receipt, isLoading, isError } = useOrderReceipt(id);

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

  const ticketTitle = receipt.items.map((i) => i.title).join(', ');

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>COMPRA</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Recibo.</span>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Recibo de pago · Diego Díaz</span>
            <span className="inline-flex items-center gap-2 border border-ink-900/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Pagado
            </span>
          </div>
          <h1 className="mt-8 font-serif text-[56px] leading-[0.9] tracking-[-0.03em] sm:text-[80px]">
            {ticketTitle}<span className="italic">.</span>
          </h1>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
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
              {receipt.items.map((item, idx) => (
                <div key={idx} className="flex items-start justify-between gap-3 py-5">
                  <div>
                    <p className="font-serif text-[15px] leading-tight text-ink-900">{item.title}</p>
                    {item.quantity > 1 && <p className="mt-1 text-[11px] text-ink-300">Cantidad: {item.quantity}</p>}
                  </div>
                  <p className="whitespace-nowrap font-serif text-[15px]">{formatCurrency(item.price * item.quantity, receipt.currency)}</p>
                </div>
              ))}
              {receipt.paidAt && (
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Fecha de pago</span>
                  <span className="font-serif text-[15px]">{formatDate(receipt.paidAt)}</span>
                </div>
              )}
            </div>
            <div className="space-y-3 border-t border-cream-400 pt-6">
              <div className="flex items-baseline justify-between text-[13px] text-ink-500">
                <span>Subtotal</span>
                <span className="font-serif">{formatCurrency(receipt.subtotal, receipt.currency)}</span>
              </div>
              {receipt.tax > 0 && (
                <div className="flex items-baseline justify-between text-[12px] text-ink-300">
                  <span>IVA</span>
                  <span className="font-serif">{formatCurrency(receipt.tax, receipt.currency)}</span>
                </div>
              )}
              {receipt.shippingCost > 0 && (
                <div className="flex items-baseline justify-between text-[12px] text-ink-300">
                  <span>Envío</span>
                  <span className="font-serif">{formatCurrency(receipt.shippingCost, receipt.currency)}</span>
                </div>
              )}
              <div className="flex items-baseline justify-between border-t border-ink-900/20 pt-4">
                <span className="font-serif text-[18px]">Total pagado</span>
                <span className="font-serif text-[40px]">
                  {formatCurrency(receipt.total, receipt.currency)}
                  <span className="ml-2 text-[13px] uppercase tracking-[0.18em] text-ink-300">{receipt.currency}</span>
                </span>
              </div>
            </div>
            <p className="mt-8 border-t border-cream-400 pt-5 text-[12px] leading-[1.6] text-ink-400">
              Este recibo confirma tu pago. No sustituye un CFDI ante el SAT — si necesitas factura fiscal, escríbenos a{' '}
              <a href="mailto:servicios@diegodiaz.mx" className="underline">servicios@diegodiaz.mx</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
