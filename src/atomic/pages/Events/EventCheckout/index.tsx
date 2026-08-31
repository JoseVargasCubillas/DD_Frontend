import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@store/cartStore';
import { createPaymentIntent } from '@api/payments.api';
import { formatCurrency } from '@utils/formatters';
import type { OrderItem } from '@t/index';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

interface PaymentFormProps {
  total: number;
  onSuccess: () => void;
}

function PaymentForm({ total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setPaying(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/eventos' },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message ?? 'Error al procesar el pago.');
        setPaying(false);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError((err as Error).message ?? 'Error al procesar el pago.');
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      <PaymentElement />
      {error && (
        <p className="border border-red-700 bg-red-950/40 px-4 py-3 text-[13px] text-red-300">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || paying}
        className="flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900 transition-opacity disabled:opacity-50"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          {paying ? 'Procesando…' : 'Pagar ahora →'}
        </span>
        <span className="font-serif text-[15px] italic">{formatCurrency(total)}</span>
      </button>
    </form>
  );
}

function ReceiptConfirmation({
  items,
  total,
  orderId,
  isDemo,
}: {
  items: OrderItem[];
  total: number;
  orderId: string;
  isDemo: boolean;
}) {
  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>EVENTOS</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Confirmado.</span>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Pago confirmado</span>
            <span className="inline-flex items-center gap-2 border border-ink-900/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Exitoso
            </span>
          </div>

          <h1 className="mt-10 font-serif text-[56px] leading-[0.9] tracking-[-0.03em] sm:text-[80px]">
            Tu lugar está <span className="italic">reservado.</span>
          </h1>
          <p className="mt-6 max-w-[560px] font-serif text-[16px] leading-[1.6] text-ink-500">
            Revisa tu correo para el recibo de tu compra. Nos vemos ahí.
          </p>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="border border-cream-400 bg-white p-8 sm:p-10">
            <div className="flex items-start justify-between border-b border-cream-400 pb-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Recibo</p>
                <p className="mt-2 font-serif text-[30px] italic leading-tight">
                  {items[0]?.title ?? 'Ticket'}
                </p>
              </div>
              <p className="text-right text-[11px] uppercase tracking-[0.18em] text-ink-300">
                Orden
                <br />
                <span className="font-serif text-[13px] normal-case tracking-normal text-ink-700">
                  #{orderId.slice(-8).toUpperCase()}
                </span>
              </p>
            </div>
            <div className="divide-y divide-cream-400">
              <div className="flex items-center justify-between py-5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Ticket</span>
                <span className="font-serif text-[15px] text-right">{items.map((i) => i.title).join(', ')}</span>
              </div>
              <div className="flex items-center justify-between py-5">
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Método de pago</span>
                <span className="font-serif text-[15px]">{isDemo ? 'Modo local (demo)' : 'Tarjeta bancaria · Stripe'}</span>
              </div>
            </div>
            <div className="flex items-baseline justify-between border-t border-ink-900/20 pt-6">
              <span className="font-serif text-[18px]">Total</span>
              <span className="font-serif text-[40px]">
                {formatCurrency(total)}
                <span className="ml-2 text-[13px] uppercase tracking-[0.18em] text-ink-300">MXN</span>
              </span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/eventos" className="btn-primary inline-flex">
              Ver todos los eventos →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EventCheckout() {
  const { items, total, clear } = useCartStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderTotal, setOrderTotal] = useState(0);
  const [confirmedItems, setConfirmedItems] = useState<OrderItem[]>([]);

  const canSubmitContact =
    name.trim().length >= 2 && /\S+@\S+\.\S+/.test(email.trim()) && phone.trim().length >= 10;

  const handleInitPayment = async () => {
    if (!canSubmitContact) return;
    setInitError('');
    setLoading(true);
    try {
      const result = await createPaymentIntent(items, undefined, {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });
      setClientSecret(result.clientSecret ?? '');
      setOrderId(result.orderId ?? '');
      setOrderTotal(result.total ?? total());
    } catch {
      setInitError('No se pudo iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setConfirmedItems(items);
    clear();
    setSuccess(true);
  };

  if (success) {
    return (
      <ReceiptConfirmation
        items={confirmedItems}
        total={orderTotal}
        orderId={orderId}
        isDemo={clientSecret.startsWith('demo_')}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream-50 text-ink-900">
        <div className="mx-auto max-w-[1184px] px-5 py-28 text-center sm:px-8 lg:px-0">
          <h1 className="font-serif text-[56px] leading-[0.9]">
            Checkout<span className="italic">.</span>
          </h1>
          <p className="mt-6 text-ink-400">No hay ningún ticket seleccionado.</p>
          <Link to="/eventos" className="btn-primary mt-8 inline-flex">
            Ver eventos →
          </Link>
        </div>
      </div>
    );
  }

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'night' as const,
          variables: {
            colorPrimary: '#f5f0e8',
            colorBackground: '#0a0a0a',
            colorText: '#f5f2ec',
            colorDanger: '#f87171',
            borderRadius: '0px',
          },
        },
      }
    : null;

  const subtotal = total() / 1.16;
  const tax = total() - subtotal;

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>EVENTOS</span>
          <span className="opacity-50">/</span>
          <span>PAGO ÚNICO</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Checkout.</span>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5 text-[10px] uppercase tracking-[0.24em] text-ink-300">
            <span>— Pago único · sin cuenta</span>
          </div>
          <h1 className="mt-8 font-serif text-[64px] leading-[0.85] tracking-[-0.03em] sm:text-[96px] lg:text-[128px]">
            Checkout<span className="italic">.</span>
          </h1>
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-ink-500">
            Un solo paso para asegurar tu lugar. No necesitas crear una cuenta — recibirás
            la confirmación de tu compra por correo.
          </p>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start">
            <div className="border border-cream-400 bg-cream-100 p-8 lg:p-10">
              <p className="border-b border-cream-400 pb-4 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                — Resumen del pedido
              </p>
              <div className="divide-y divide-cream-400">
                {items.map((item) => (
                  <div key={item.id ?? item.refId} className="flex items-start justify-between gap-3 py-5">
                    <div className="min-w-0">
                      <p className="font-serif text-[16px] leading-tight text-ink-900">{item.title}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ink-300">Pago único</p>
                    </div>
                    <p className="whitespace-nowrap font-serif text-[15px] text-ink-900">{formatCurrency(item.price)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-3 border-t border-cream-400 pt-6">
                <div className="flex items-baseline justify-between text-[13px] text-ink-500">
                  <span>Subtotal</span>
                  <span className="font-serif">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between text-[12px] text-ink-300">
                  <span>IVA (16%)</span>
                  <span className="font-serif">{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink-900/25 pt-4">
                  <span className="font-serif text-[16px]">Total</span>
                  <span className="font-serif text-[34px]">{formatCurrency(total())}</span>
                </div>
              </div>
            </div>

            <div className="bg-ink-900 p-8 text-cream-50 lg:p-10">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 text-[10px] uppercase tracking-[0.2em] text-white/55">
                <span>— Datos de pago</span>
                <span>Pasarela segura · SSL</span>
              </div>
              <h2 className="mt-8 font-serif text-[36px] italic">Pago.</h2>

              {initError && (
                <p className="mt-4 border border-red-700 bg-red-950/40 px-4 py-3 text-[13px] text-red-300">{initError}</p>
              )}

              {!clientSecret || !elementsOptions ? (
                <div className="mt-8 flex flex-col gap-5">
                  <div className="flex flex-col gap-4">
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">Nombre</span>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre completo"
                        className="border border-white/20 bg-white/5 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30 focus:border-white/50"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">Correo</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="border border-white/20 bg-white/5 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30 focus:border-white/50"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/55">Celular</span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="10 dígitos"
                        className="border border-white/20 bg-white/5 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/30 focus:border-white/50"
                      />
                    </label>
                  </div>
                  <p className="text-[13px] leading-[1.7] text-white/60">
                    Ahí te enviaremos el recibo de tu compra.
                  </p>
                  <button
                    onClick={handleInitPayment}
                    disabled={loading || !canSubmitContact}
                    className="flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900 transition-opacity disabled:opacity-50"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                      {loading ? 'Cargando…' : 'Continuar al pago →'}
                    </span>
                  </button>
                  <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/35">
                    Pagos seguros con Stripe
                  </div>
                </div>
              ) : clientSecret.startsWith('demo_') ? (
                <div className="mt-8">
                  <div className="border border-white/15 bg-white/5 px-4 py-3 text-[13px] text-white/70">
                    Modo local activo: se confirmará la compra sin contactar a Stripe.
                  </div>
                  <button
                    onClick={handleSuccess}
                    className="mt-6 flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Confirmar compra →</span>
                    <span className="font-serif text-[15px] italic">{formatCurrency(total())}</span>
                  </button>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <PaymentForm total={total()} onSuccess={handleSuccess} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
