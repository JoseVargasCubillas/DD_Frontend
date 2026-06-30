import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { createPaymentIntent } from '@api/payments.api';
import { subscribe } from '@api/subscriptions.api';
import { formatCurrency } from '@utils/formatters';
import Button from '@atoms/Button';
import Spinner from '@atoms/Spinner';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <PaymentElement />
      {error && (
        <p className="rounded-lg bg-red-950/50 border border-red-700 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}
      <Button type="submit" disabled={!stripe || paying} fullWidth>
        {paying ? 'Procesando...' : mode === 'subscription' ? 'Suscribirme ahora' : 'Pagar ' + formatCurrency(total)}
      </Button>
    </form>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, total, clear } = useCartStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [clientSecret, setClientSecret] = useState('' as string);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('' as string);
  const [success, setSuccess] = useState(false);

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
        const priceId = import.meta.env.VITE_STRIPE_PRICE_INICIATIVA_MENSUAL as string;
        const result = await subscribe({ priceId, plan: 'pro' });
        setClientSecret((result as Record<string, string>).clientSecret ?? '');
      } else {
        const result = await createPaymentIntent(items);
        setClientSecret((result as Record<string, string>).clientSecret ?? '');
      }
    } catch {
      setInitError('No se pudo iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    clear();
    return (
      <div className="container-app py-20 max-w-xl text-center">
        <div className="mb-6 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 text-3xl">
            &#10003;
          </span>
        </div>
        <h1 className="section-title mb-3">Pago exitoso</h1>
        <p className="text-gray-400 mb-8">
          {mode === 'subscription'
            ? 'Tu suscripcion a la Iniciativa Diego Diaz esta activa.'
            : 'Tu compra ha sido procesada correctamente.'}
        </p>
        <Button onClick={() => navigate('/mi-cuenta')}>Ir a mi cuenta</Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-app py-20 max-w-xl text-center">
        <h1 className="section-title mb-4">Checkout</h1>
        <p className="text-gray-400 mb-8">Tu carrito esta vacio.</p>
        <Button onClick={() => navigate('/cursos')}>Ver cursos</Button>
      </div>
    );
  }

  const elementsOptions = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: 'night' as const,
          variables: {
            colorPrimary: '#efc75a',
            colorBackground: '#1a1a1a',
            colorText: '#ffffff',
            colorDanger: '#f87171',
            borderRadius: '8px',
          },
        },
      }
    : null;

  return (
    <div className="container-app py-12 max-w-4xl">
      <h1 className="section-title mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Resumen
            </h2>
            <div className="divide-y divide-dark-600">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.type === 'subscription' ? 'Suscripcion mensual' : 'Pago unico'}
                    </p>
                    <p className="text-brand-400 text-sm font-semibold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  {!clientSecret && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-600 hover:text-red-400 text-xs shrink-0"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t border-dark-600 mt-3 pt-4 flex items-center justify-between">
              <span className="text-gray-400 text-sm">
                {mode === 'subscription' ? 'Total mensual' : 'Total'}
              </span>
              <span className="text-white font-bold text-lg">{formatCurrency(total())}</span>
            </div>
            {mode === 'subscription' && (
              <p className="text-xs text-gray-500 mt-2">
                Se renueva automaticamente cada mes. Cancela cuando quieras.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="card p-6">
            {!clientSecret || !elementsOptions ? (
              <div className="flex flex-col gap-4">
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Metodo de pago
                </h2>
                <p className="text-gray-400 text-sm">
                  Haz clic en continuar para ingresar los datos de tu tarjeta de forma segura a traves de Stripe.
                </p>
                {initError && (
                  <p className="rounded-lg bg-red-950/50 border border-red-700 px-4 py-3 text-sm text-red-300">
                    {initError}
                  </p>
                )}
                <Button onClick={handleInitPayment} disabled={loading} fullWidth>
                  {loading ? <Spinner size="sm" /> : 'Continuar al pago'}
                </Button>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Pagos seguros con Stripe
                </div>
              </div>
            ) : (
              <Elements stripe={stripePromise} options={elementsOptions}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Datos de pago
                </h2>
                <PaymentForm mode={mode} total={total()} onSuccess={() => setSuccess(true)} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
