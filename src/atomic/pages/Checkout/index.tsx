import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { createPaymentIntent } from '@api/payments.api';
import { subscribe } from '@api/subscriptions.api';
import { formatCurrency, formatDate } from '@utils/formatters';
import type { OrderItem } from '@t/index';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string);

type CheckoutMode = 'subscription' | 'one_time';

function detectMode(items: { type?: string }[]): CheckoutMode {
  return items.some((i) => i.type === 'subscription') ? 'subscription' : 'one_time';
}

interface PaymentFormProps {
  mode: CheckoutMode;
  total: number;
  onSuccess: () => void;
}

function PaymentForm({ mode, total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('' as string);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setPaying(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/mi-cuenta?pago=exitoso',
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'Error al procesar el pago.');
      setPaying(false);
    } else {
      onSuccess();
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
          {paying ? 'Procesando…' : mode === 'subscription' ? 'Suscribirme ahora →' : 'Pagar ahora →'}
        </span>
        <span className="font-serif text-[15px] italic">{formatCurrency(total)}</span>
      </button>
    </form>
  );
}

interface OrderSummary {
  mode: CheckoutMode;
  items: OrderItem[];
  total: number;
  orderId: string;
}

function OrderConfirmation({ order, paymentLabel }: { order: OrderSummary; paymentLabel: string }) {
  const isSubscription = order.mode === 'subscription';
  const nextRenewal = new Date();
  nextRenewal.setMonth(nextRenewal.getMonth() + 1);

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>{isSubscription ? 'ACADEMIA' : 'CURSOS'}</span>
          <span className="opacity-50">/</span>
          <span>Checkout</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Confirmado.</span>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5">
            <span className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Pago confirmado · acceso activado</span>
            <span className="inline-flex items-center gap-2 border border-ink-900/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-700">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Exitoso
            </span>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start">
            <h1 className="font-serif text-[56px] leading-[0.9] tracking-[-0.03em] sm:text-[80px]">
              Estás <span className="italic">dentro.</span>
            </h1>
            <aside className="pt-2">
              <p className="font-serif text-[16px] leading-[1.6] text-ink-500">
                Tu {isSubscription ? 'suscripción' : 'compra'} ya está activa. Revisa tu correo para el recibo y los siguientes pasos.
              </p>
              <p className="mt-6 font-serif text-[16px] leading-[1.6] text-ink-500">
                Bienvenido{isSubscription ? ' a la Academia' : ''}. Es un honor tenerte del otro lado.
              </p>
              <p className="mt-6 font-serif text-[22px] italic text-ink-900">
                Diego Díaz<span className="ml-2 text-[13px] not-italic uppercase tracking-[0.18em] text-ink-300">— del otro lado</span>
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="border border-cream-400 bg-white p-8 sm:p-10">
              <div className="flex items-start justify-between border-b border-cream-400 pb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Recibo del pedido</p>
                  <p className="mt-2 font-serif text-[30px] italic leading-tight">
                    {order.items[0]?.title ?? 'Pedido'}
                  </p>
                </div>
                <p className="text-right text-[11px] uppercase tracking-[0.18em] text-ink-300">
                  Orden
                  <br />
                  <span className="font-serif text-[13px] normal-case tracking-normal text-ink-700">
                    #{order.orderId.slice(-8).toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="divide-y divide-cream-400">
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Producto</span>
                  <span className="font-serif text-[15px] text-right">{order.items.map((i) => i.title).join(', ')}</span>
                </div>
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Método de pago</span>
                  <span className="font-serif text-[15px]">{paymentLabel}</span>
                </div>
                {isSubscription && (
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Próxima renovación</span>
                    <span className="font-serif text-[15px]">{formatDate(nextRenewal)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-5">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Factura CFDI</span>
                  <span className="font-serif text-[15px]">Disponible en tu portal</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between border-t border-ink-900/20 pt-6">
                <span className="font-serif text-[18px]">Total {isSubscription ? 'anual' : ''}</span>
                <span className="font-serif text-[40px]">
                  {formatCurrency(order.total)}
                  <span className="ml-2 text-[13px] uppercase tracking-[0.18em] text-ink-300">MXN</span>
                </span>
              </div>
            </div>

            <aside className="border border-ink-900 bg-cream-100 p-8">
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Empieza aquí</p>
              <h3 className="mt-4 font-serif text-[28px]">Portal de miembro.</h3>
              <p className="mt-4 text-[13px] leading-[1.7] text-ink-500">
                Accede a tu cuenta para ver tu progreso, material descargable y próximas sesiones.
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

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clear } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [clientSecret, setClientSecret] = useState('' as string);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('' as string);
  const [success, setSuccess] = useState(false);
  const [order, setOrder] = useState<OrderSummary | null>(null);

  const mode = detectMode(items);

  if (!isAuthenticated) {
    navigate('/iniciar-sesion?redirect=/checkout');
    return null;
  }

  const handleInitPayment = async () => {
    setInitError('');
    setLoading(true);
    try {
      if (mode === 'subscription') {
        const subscriptionItem = items.find((item) => item.type === 'subscription') ?? items[0];
        const result = await subscribe({
          plan: subscriptionItem?.refId?.replace('off_academia_', '') || 'plus',
          item: {
            type: 'offer',
            refId: subscriptionItem?.refId,
            quantity: subscriptionItem?.quantity ?? 1,
          },
        });
        setClientSecret((result as Record<string, string>).clientSecret ?? '');
        const subscription = (result as { subscription?: { _id?: string; id?: string } }).subscription;
        setOrder({ mode, items, total: total(), orderId: subscription?._id ?? subscription?.id ?? '' });
      } else {
        const result = await createPaymentIntent(items);
        setClientSecret(result.clientSecret ?? '');
        setOrder({ mode, items, total: result.total ?? total(), orderId: result.orderId ?? '' });
      }
    } catch {
      setInitError('No se pudo iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setOrder((current) => current ?? { mode, items, total: total(), orderId: '' });
    setSuccess(true);
  };

  if (success && order) {
    clear();
    const paymentLabel = clientSecret.startsWith('demo_') ? 'Modo local (demo)' : 'Tarjeta bancaria · Stripe';
    return <OrderConfirmation order={order} paymentLabel={paymentLabel} />;
  }

  if (items.length === 0) {
    return (
      <div className="bg-cream-50 text-ink-900">
        <div className="mx-auto max-w-[1184px] px-5 py-28 text-center sm:px-8 lg:px-0">
          <h1 className="font-serif text-[56px] leading-[0.9]">
            Checkout<span className="italic">.</span>
          </h1>
          <p className="mt-6 text-ink-400">Tu carrito está vacío.</p>
          <Link to="/cursos" className="btn-primary mt-8 inline-flex">
            Ver cursos →
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

  const breadcrumbCategory = mode === 'subscription' ? 'ACADEMIA' : 'CURSOS';
  const subtotal = total() / 1.16;
  const tax = total() - subtotal;

  return (
    <div className="bg-cream-50 text-ink-900">
      {/* ── Breadcrumb ─────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>{breadcrumbCategory}</span>
          <span className="opacity-50">/</span>
          <span>{mode === 'subscription' ? 'SUSCRIPCIÓN' : 'PAGO ÚNICO'}</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">
            Checkout{mode === 'subscription' ? ' · Academia+' : ''}.
          </span>
        </div>
      </section>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex items-center justify-between border-b border-cream-400 pb-5 text-[10px] uppercase tracking-[0.24em] text-ink-300">
            <span>— {mode === 'subscription' ? 'Suscripción · Academia+' : 'Pago único · sin renovación'}</span>
            {mode === 'subscription' && <span>Renovación anual</span>}
          </div>
          <h1 className="mt-8 font-serif text-[64px] leading-[0.85] tracking-[-0.03em] sm:text-[96px] lg:text-[128px]">
            Checkout<span className="italic">.</span>
          </h1>
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-ink-500">
            {mode === 'subscription'
              ? 'Un solo paso para acceder al programa completo. Suscripción con renovación automática, cancelable desde tu portal en cualquier momento.'
              : 'Un solo paso para asegurar tu acceso. Recibirás la confirmación y los datos de acceso por correo al completar tu compra.'}
          </p>
        </div>
      </section>

      {/* ── Grid: resumen + pago ───────────────────── */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start">
            {/* Aside — resumen del pedido */}
            <div className="border border-cream-400 bg-cream-100 p-8 lg:p-10">
              <p className="border-b border-cream-400 pb-4 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                — Resumen del pedido
              </p>
              <div className="divide-y divide-cream-400">
                {items.map((item) => (
                  <div key={item.id ?? item.refId} className="flex items-start justify-between gap-3 py-5">
                    <div className="min-w-0">
                      <p className="font-serif text-[16px] leading-tight text-ink-900">{item.title}</p>
                      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ink-300">
                        {item.type === 'subscription' ? 'Suscripción anual' : 'Pago único'}
                      </p>
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
                  <span className="font-serif text-[16px]">Total {mode === 'subscription' ? 'anual' : ''}</span>
                  <span className="font-serif text-[34px]">{formatCurrency(total())}</span>
                </div>
              </div>
              {mode === 'subscription' && (
                <p className="mt-6 border-t border-cream-400 pt-5 font-serif text-[13px] italic leading-[1.55] text-ink-400">
                  Se renueva automáticamente cada año. Puedes cancelar cuando quieras desde el portal de miembro — la cancelación aplica al ciclo siguiente.
                </p>
              )}
            </div>

            {/* Panel de pago — oscuro */}
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
                  <p className="text-[13px] leading-[1.7] text-white/60">
                    Haz clic en continuar para ingresar los datos de tu tarjeta de forma segura a través de Stripe.
                  </p>
                  <button
                    onClick={handleInitPayment}
                    disabled={loading}
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
                    Modo local activo: se confirmará el acceso sin contactar a Stripe.
                  </div>
                  <button
                    onClick={handleSuccess}
                    className="mt-6 flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                      {mode === 'subscription' ? 'Activar suscripción →' : 'Confirmar compra →'}
                    </span>
                    <span className="font-serif text-[15px] italic">{formatCurrency(total())}</span>
                  </button>
                </div>
              ) : (
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <PaymentForm mode={mode} total={total()} onSuccess={handleSuccess} />
                </Elements>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
