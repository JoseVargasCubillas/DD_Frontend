import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '@store/cartStore';
import { createPaymentIntent } from '@api/payments.api';
import { subscribe, type CheckoutCustomerInfo } from '@api/subscriptions.api';
import * as eventsApi from '@api/events.api';
import { listOffers } from '@api/offers.api';
import { formatCurrency } from '@utils/formatters';
import type { OrderItem } from '@t/index';
import Button from '@atoms/Button';
import Spinner from '@atoms/Spinner';

const stripePublishableKey = String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');
const stripePromise = stripePublishableKey.startsWith('pk_')
  ? loadStripe(stripePublishableKey)
  : Promise.resolve(null);

type CheckoutMode = 'subscription' | 'one_time';

function detectMode(items: { type?: string }[]): CheckoutMode {
  return items.some((i) => i.type === 'subscription' || (i as OrderItem).paymentType === 'subscription') ? 'subscription' : 'one_time';
}

interface PaymentFormProps {
  mode: CheckoutMode;
  total: number;
  customer: CheckoutCustomerInfo;
  onSuccess: () => void;
}

function PaymentForm({ mode, total, customer, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('' as string);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setPaying(true);

    try {
      const submitResult = await elements.submit();
      if (submitResult.error) {
        setError(submitResult.error.message ?? 'Revisa los datos de pago.');
        setPaying(false);
        return;
      }

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout?pago=exitoso',
          payment_method_data: {
            billing_details: {
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
            },
          },
        },
        redirect: 'if_required',
      });

      if (result.error) {
        setError(result.error.message ?? 'Error al procesar el pago.');
        setPaying(false);
        return;
      }

      const status = result.paymentIntent?.status;
      if (!status || ['succeeded', 'processing', 'requires_capture'].includes(status)) {
        onSuccess();
        setPaying(false);
        return;
      }

      setError('El pago no se pudo confirmar. Revisa el metodo de pago e intenta de nuevo.');
      setPaying(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stripe no pudo confirmar el pago. Intenta de nuevo.');
      setPaying(false);
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

function DemoPaymentForm({ mode, total, onSuccess }: PaymentFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-200">
        Modo local activo: se confirmara el acceso sin contactar a Stripe.
      </div>
      <Button type="button" onClick={onSuccess} fullWidth>
        {mode === 'subscription' ? 'Activar suscripcion demo' : 'Confirmar compra demo ' + formatCurrency(total)}
      </Button>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get('pago');
  const routeEventId = searchParams.get('event');
  const routeOfferId = searchParams.get('offer');
  const { items, removeItem, clear } = useCartStore();

  const [clientSecret, setClientSecret] = useState('' as string);
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('' as string);
  const [success, setSuccess] = useState(paymentStatus === 'exitoso');
  const [customer, setCustomer] = useState<CheckoutCustomerInfo>({
    name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (success) clear();
  }, [clear, success]);

  const shouldLoadRouteItem = items.length === 0;
  const { data: routeEvent, isLoading: loadingRouteEvent } = useQuery({
    queryKey: ['checkout-event', routeEventId],
    queryFn: () => eventsApi.getEventBySlug(routeEventId!),
    enabled: shouldLoadRouteItem && Boolean(routeEventId),
  });
  const { data: offers = [], isLoading: loadingRouteOffer } = useQuery({
    queryKey: ['checkout-offers'],
    queryFn: listOffers,
    enabled: shouldLoadRouteItem && Boolean(routeOfferId),
  });
  const routeOffer = useMemo(
    () => offers.find((offer) => (offer._id || offer.id || offer.slug) === routeOfferId),
    [offers, routeOfferId],
  );
  const routeItem = useMemo<OrderItem | null>(() => {
    if (routeEvent) {
      const price = routeEvent.salePrice != null && routeEvent.salePrice > 0 ? routeEvent.salePrice : routeEvent.price;
      return {
        type: 'event',
        refId: routeEvent._id || routeEvent.id || routeEvent.slug || '',
        title: routeEvent.title,
        price,
        quantity: 1,
        currency: routeEvent.currency || 'MXN',
        paymentType: routeEvent.paymentType || (price > 0 ? 'one_time' : 'free'),
      };
    }

    if (routeOffer) {
      return {
        type: 'offer',
        refId: routeOffer._id || routeOffer.id || routeOffer.slug || '',
        title: routeOffer.title,
        price: routeOffer.price,
        quantity: 1,
        currency: routeOffer.currency || 'MXN',
        paymentType: routeOffer.paymentType || (routeOffer.price > 0 ? 'one_time' : 'free'),
        plan: routeOffer.plan,
      };
    }

    return null;
  }, [routeEvent, routeOffer]);
  const checkoutItems = items.length > 0 ? items : routeItem ? [routeItem] : [];
  const checkoutTotal = checkoutItems.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const mode = detectMode(checkoutItems);
  const customerComplete = customer.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(customer.email) && customer.phone.trim().length >= 8;

  const updateCustomer = (field: keyof CheckoutCustomerInfo, value: string) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const handleInitPayment = async () => {
    setInitError('');
    if (!customerComplete) {
      setInitError('Ingresa nombre, correo electronico y telefono para continuar.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'subscription') {
        const subscriptionItem = checkoutItems.find((item) => item.paymentType === 'subscription' || item.type === 'subscription');
        if (!subscriptionItem) throw new Error('No se encontro la suscripcion seleccionada.');
        const result = await subscribe({
          item: {
            type: subscriptionItem.type,
            refId: subscriptionItem.refId,
            quantity: subscriptionItem.quantity,
          },
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
          },
        });
        setClientSecret(result.clientSecret ?? '');
      } else {
        const result = await createPaymentIntent(checkoutItems);
        setClientSecret(result.clientSecret ?? '');
      }
    } catch (error) {
      setInitError(error instanceof Error ? error.message : 'No se pudo iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

  if (shouldLoadRouteItem && (loadingRouteEvent || loadingRouteOffer)) {
    return (
      <div className="container-app flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (checkoutItems.length === 0) {
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
              {checkoutItems.map((item) => (
                <div key={`${item.type}:${item.refId}`} className="flex items-start justify-between gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-snug truncate">{item.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.paymentType === 'subscription' || item.type === 'subscription' ? 'Suscripcion mensual' : 'Pago unico'}
                    </p>
                    <p className="text-brand-400 text-sm font-semibold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  {!clientSecret && items.length > 0 && (
                    <button
                      onClick={() => removeItem((item as OrderItem & { id?: string }).id ?? item.refId)}
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
              <span className="text-white font-bold text-lg">{formatCurrency(checkoutTotal)}</span>
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
                <div className="grid gap-3">
                  <label className="grid gap-1 text-sm text-gray-300">
                    Nombre completo
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(event) => updateCustomer('name', event.target.value)}
                      disabled={loading}
                      className="min-h-11 rounded-lg border border-dark-600 bg-dark-800 px-3 text-white outline-none transition-colors focus:border-brand-500"
                      placeholder="Nombre y apellidos"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-gray-300">
                    Correo electronico
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(event) => updateCustomer('email', event.target.value)}
                      disabled={loading}
                      className="min-h-11 rounded-lg border border-dark-600 bg-dark-800 px-3 text-white outline-none transition-colors focus:border-brand-500"
                      placeholder="tu@correo.com"
                    />
                  </label>
                  <label className="grid gap-1 text-sm text-gray-300">
                    Telefono
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(event) => updateCustomer('phone', event.target.value)}
                      disabled={loading}
                      className="min-h-11 rounded-lg border border-dark-600 bg-dark-800 px-3 text-white outline-none transition-colors focus:border-brand-500"
                      placeholder="+52 55 0000 0000"
                    />
                  </label>
                </div>
                {initError && (
                  <p className="rounded-lg bg-red-950/50 border border-red-700 px-4 py-3 text-sm text-red-300">
                    {initError}
                  </p>
                )}
                <Button onClick={handleInitPayment} disabled={loading || !customerComplete} fullWidth>
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
            ) : clientSecret.startsWith('demo_') ? (
              <>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Confirmacion local
                </h2>
                <DemoPaymentForm mode={mode} total={checkoutTotal} customer={customer} onSuccess={() => setSuccess(true)} />
              </>
            ) : !stripePublishableKey.startsWith('pk_') ? (
              <p className="rounded-lg bg-red-950/50 border border-red-700 px-4 py-3 text-sm text-red-300">
                Falta configurar VITE_STRIPE_PUBLISHABLE_KEY con una llave publica valida de Stripe.
              </p>
            ) : (
              <Elements stripe={stripePromise} options={elementsOptions}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Datos de pago
                </h2>
                <PaymentForm mode={mode} total={checkoutTotal} customer={customer} onSuccess={() => setSuccess(true)} />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
