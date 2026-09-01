import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuthStore } from '@store/authStore';
import { useBook } from '@hooks/useBooks';
import { createPaymentIntent } from '@api/payments.api';
import { quoteShipping, type ShippingRateOption } from '@api/shipping.api';
import { formatCurrency } from '@utils/formatters';
import { hasStripePublishableKey, stripeMissingKeyMessage, stripePromise } from '@utils/stripe';
import Spinner from '@atoms/Spinner';
import NotFound from '@pages/NotFound';
import type { ShippingAddress, OrderItem } from '@t/index';
import bookClaves from '../../../../../assets/ddweb/libro-siete-claves-cobrar.png';
import bookSat from '../../../../../assets/ddweb/libro-siete-secretos-sat.png';
import bookFiscalista from '../../../../../assets/ddweb/libro-siete-secretos-fiscalista.png';

const MEXICAN_STATES = [
  'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche', 'Chiapas',
  'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
  'Guerrero', 'Hidalgo', 'Jalisco', 'Estado de México', 'Michoacán', 'Morelos',
  'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
  'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala',
  'Veracruz', 'Yucatán', 'Zacatecas',
];

const emptyShipping: ShippingAddress = {
  fullName: '',
  phone: '',
  street: '',
  colony: '',
  postalCode: '',
  city: '',
  state: 'Ciudad de México',
  references: '',
};

const BOOK_SLUG_ALIASES: Record<string, string> = {
  '7-claves-cobrar-empresa': '7-claves-para-cobrar-a-tu-empresa',
};

const BUNDLE_SLUG = 'bundle-tres-libros';

function BundleCovers() {
  return (
    <div className="flex h-[150px] shrink-0 items-stretch gap-2">
      <div className="flex gap-1 overflow-hidden border border-ink-900/10 bg-cream-50 shadow-[10px_14px_28px_rgba(10,10,10,0.14)]">
        <img
          src={bookClaves}
          alt="Portada 7 Claves para cobrar a tu empresa"
          className="h-full w-[58px] object-cover"
        />
        <img
          src={bookFiscalista}
          alt="Portada 7 Secretos de un fiscalista"
          className="h-full w-[58px] object-cover"
        />
      </div>
      <div className="relative w-[58px] shrink-0 overflow-hidden border border-ink-900/10 bg-cream-50 opacity-60 grayscale">
        <img
          src={bookSat}
          alt="Portada Los 7 secretos que el SAT no quiere que conozcas — no disponible, lista de espera"
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-x-0 bottom-0 bg-ink-900/85 px-1 py-1 text-center text-[6.5px] font-bold uppercase leading-tight tracking-[0.08em] text-white">
          Lista de espera
        </span>
      </div>
    </div>
  );
}

function BundleShippingNote() {
  return (
    <div className="mt-4 border border-ink-900/15 bg-white px-5 py-4">
      <p className="text-[10px] uppercase tracking-[0.2em] text-ink-300">— Se envían 2 libros</p>
      <ul className="mt-2 space-y-1 text-[13px] leading-[1.5] text-ink-600">
        <li>· 7 Claves para cobrar a tu empresa</li>
        <li>· 7 Secretos de un fiscalista</li>
      </ul>
      <p className="mt-3 text-[12px] leading-[1.6] text-ink-400">
        "Los 7 secretos que el SAT no quiere que conozcas" está agotado. Con esta compra quedas anotado en la lista de espera de su reimpresión 2026, sin costo adicional, y te lo enviaremos en cuanto esté disponible.
      </p>
    </div>
  );
}

const FALLBACK_COVERS: Record<string, string> = {
  '7-claves-para-cobrar-a-tu-empresa': bookClaves,
  '7-claves-cobrar-empresa': bookClaves,
  '7-secretos-sat': bookSat,
  '7-secretos-fiscalista': bookFiscalista,
};

interface Field {
  label: string;
  name: keyof ShippingAddress;
  placeholder: string;
  type?: string;
}

function ShippingField({
  field, value, onChange,
}: { field: Field; value: string; onChange: (name: keyof ShippingAddress, value: string) => void }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[10px] uppercase tracking-[0.2em] text-ink-300">— {field.label}</span>
      <input
        type={field.type ?? 'text'}
        required={field.name !== 'references'}
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange(field.name, e.target.value)}
        className="input-cream rounded-none font-serif text-[18px]"
      />
    </label>
  );
}

interface PaymentFormProps {
  total: number;
  onSuccess: () => void;
}

function BookPaymentForm({ total, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setError('');
    setPaying(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + '/mi-cuenta?pago=exitoso' },
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
        <p className="border border-red-700 bg-red-950/40 px-4 py-3 text-[13px] text-red-300">{error}</p>
      )}
      <button
        type="submit"
        disabled={!stripe || paying}
        className="flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900 disabled:opacity-50"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
          {paying ? 'Procesando…' : 'Comprar libro ahora →'}
        </span>
        <span className="font-serif text-[15px] italic">{formatCurrency(total)}</span>
      </button>
    </form>
  );
}

const SHIPPING_FIELDS: Field[] = [
  { label: 'Nombre completo', name: 'fullName', placeholder: 'Quien recibe' },
  { label: 'Teléfono de contacto', name: 'phone', placeholder: '+52 · 55 · 0000 · 0000', type: 'tel' },
  { label: 'Calle y número', name: 'street', placeholder: 'Av. Presidente Masaryk 123' },
  { label: 'Colonia', name: 'colony', placeholder: 'Polanco V Sección' },
  { label: 'Código postal', name: 'postalCode', placeholder: '11560' },
  { label: 'Ciudad', name: 'city', placeholder: 'Ciudad de México' },
];

export default function BookCheckout() {
  const { slug } = useParams<{ slug: string }>();
  const normalizedSlug = slug ? BOOK_SLUG_ALIASES[slug] ?? slug : slug;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: book, isLoading, isError } = useBook(normalizedSlug);

  const [quantity, setQuantity] = useState(1);
  const [shipping, setShipping] = useState<ShippingAddress>(emptyShipping);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [initError, setInitError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [finalTotal, setFinalTotal] = useState(0);
  const [shippingRates, setShippingRates] = useState<ShippingRateOption[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRateOption | null>(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesFetched, setRatesFetched] = useState(false);
  const [guestEmail, setGuestEmail] = useState('');

  const needsGuestContact = !isAuthenticated;
  const canSubmitShipping = !needsGuestContact || /\S+@\S+\.\S+/.test(guestEmail.trim());

  if (isLoading) {
    return (
      <div className="flex justify-center bg-cream-50 py-32">
        <Spinner />
      </div>
    );
  }

  if (isError || !book) {
    return <NotFound mode={isError ? 'error' : 'not-found'} />;
  }

  const isBundle = book.slug === BUNDLE_SLUG;
  const coverSrc = book.coverImage || FALLBACK_COVERS[book.slug] || FALLBACK_COVERS[slug ?? ''] || bookClaves;
  const subtotal = book.price * quantity;
  // El envío ya está incluido en el precio del libro — se paga con el saldo
  // de la cuenta de Envia, nunca se le cobra aparte al cliente.
  const shippingCost = 0;
  const tax = 0;
  const total = subtotal + shippingCost + tax;
  const bookItems: OrderItem[] = [
    { type: 'product', refId: book._id ?? book.id ?? book.slug, title: book.title, price: book.price, quantity },
  ];

  const updateShipping = (name: keyof ShippingAddress, value: string) =>
    setShipping((current) => ({ ...current, [name]: value }));

  const handleContinueToPayment = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmitShipping) return;
    setStep('payment');
    setLoadingRates(true);
    try {
      const rates = await quoteShipping(bookItems, shipping);
      setShippingRates(rates);
      setSelectedRate(rates[0] ?? null);
    } finally {
      setLoadingRates(false);
      setRatesFetched(true);
    }
  };

  const handleInitPayment = async () => {
    setInitError('');
    setLoading(true);
    try {
      const result = await createPaymentIntent(
        bookItems,
        shipping,
        needsGuestContact ? { name: shipping.fullName.trim(), email: guestEmail.trim(), phone: shipping.phone.trim() } : undefined,
        selectedRate ? { carrier: selectedRate.carrier, service: selectedRate.service } : undefined,
      );
      setClientSecret(result.clientSecret ?? '');
      setOrderId(result.orderId ?? '');
      setFinalTotal(result.total ?? total);
    } catch (error) {
      setInitError((error as Error).message || 'No se pudo iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-cream-50 text-ink-900">
        <section className="border-b border-cream-400 bg-cream-50">
          <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
            <span>LIBROS</span>
            <span className="opacity-50">/</span>
            <span>Checkout</span>
            <span className="opacity-50">/</span>
            <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Confirmado.</span>
          </div>
        </section>

        <section className="border-b border-cream-400 bg-cream-50">
          <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
            <div className="flex items-center justify-between border-b border-cream-400 pb-5">
              <span className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Pago confirmado · pedido en proceso</span>
              <span className="inline-flex items-center gap-2 border border-ink-900/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-700">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Exitoso
              </span>
            </div>
            <h1 className="mt-10 font-serif text-[56px] leading-[0.9] tracking-[-0.03em] sm:text-[80px]">
              Va en <span className="italic">camino.</span>
            </h1>
            <p className="mt-6 max-w-[560px] font-serif text-[16px] leading-[1.6] text-ink-500">
              {isBundle
                ? 'Gracias por tu compra. Estamos preparando tus 2 ejemplares para enviarlos a la dirección que nos diste.'
                : `Gracias por tu compra. Estamos preparando tu ejemplar de "${book.title}" para enviarlo a la dirección que nos diste.`}
            </p>
            {isBundle && (
              <div className="mt-6 max-w-[560px]">
                <BundleShippingNote />
              </div>
            )}
          </div>
        </section>

        <section className="bg-cream-50">
          <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <div className="border border-cream-400 bg-white p-8 sm:p-10">
                <div className="flex items-start justify-between border-b border-cream-400 pb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Recibo del pedido</p>
                    <p className="mt-2 font-serif text-[30px] italic leading-tight">{book.title}</p>
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
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Cantidad</span>
                    <span className="font-serif text-[15px]">{quantity} · {book.format}</span>
                  </div>
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Envío a</span>
                    <span className="font-serif text-[15px] text-right">{shipping.city}, {shipping.state}</span>
                  </div>
                  <div className="flex items-center justify-between py-5">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-ink-300">Método de pago</span>
                    <span className="font-serif text-[15px]">
                      {clientSecret.startsWith('demo_') ? 'Modo local (demo)' : 'Tarjeta bancaria · Stripe'}
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink-900/20 pt-6">
                  <span className="font-serif text-[18px]">Total</span>
                  <span className="font-serif text-[40px]">
                    {formatCurrency(finalTotal || total)}
                    <span className="ml-2 text-[13px] uppercase tracking-[0.18em] text-ink-300">MXN</span>
                  </span>
                </div>
              </div>

              <aside className="border border-ink-900 bg-cream-100 p-8">
                <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">— Envío nacional</p>
                <h3 className="mt-4 font-serif text-[28px]">3 a 5 días hábiles.</h3>
                <p className="mt-4 text-[13px] leading-[1.7] text-ink-500">
                  Te avisaremos por correo en cuanto tengamos el número de guía. También puedes verlo en tu recibo — solo tarda unos minutos en aparecer.
                </p>
                <Link
                  to={`/recibo/pedido/${orderId}`}
                  className="mt-6 flex w-full items-center justify-between bg-ink-900 px-6 py-4 text-cream-50 transition-opacity hover:opacity-90"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Ver recibo y guía →</span>
                </Link>
              </aside>
            </div>
          </div>
        </section>
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

  return (
    <div className="bg-cream-50 text-ink-900">
      {/* ── Breadcrumb ─────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto flex max-w-[1184px] items-center gap-3 px-5 py-6 text-[10.5px] uppercase tracking-[0.24em] text-ink-300 sm:px-8 lg:px-0">
          <span>LIBROS</span>
          <span className="opacity-50">/</span>
          <span>{book.title}</span>
          <span className="opacity-50">/</span>
          <span className="font-serif italic text-[13px] normal-case tracking-normal text-ink-900">Checkout.</span>
        </div>
      </section>

      {/* ── Hero ───────────────────────────────────── */}
      <section className="border-b border-cream-400 bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-14 sm:px-8 lg:px-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cream-400 pb-5 text-[10px] uppercase tracking-[0.24em] text-ink-300">
            <span>— Pago único · sin renovación</span>
            <span>Envío nacional · 3 a 5 días hábiles</span>
          </div>
          <h1 className="mt-8 font-serif text-[64px] leading-[0.85] tracking-[-0.03em] sm:text-[96px] lg:text-[128px]">
            Checkout<span className="italic">.</span>
          </h1>
          <p className="mt-6 max-w-[640px] text-[16px] leading-[1.7] text-ink-500">
            Un solo paso para asegurar tu ejemplar. Recibirás confirmación y número de guía por correo al completar tu compra.
          </p>
        </div>
      </section>

      {/* ── Grid: resumen + envío/pago ─────────────── */}
      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1184px] px-5 py-16 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[440px_minmax(0,1fr)] lg:items-start">
            {/* Aside — resumen del pedido */}
            <div className="border border-cream-400 bg-cream-100 p-8 lg:p-10">
              <div className="flex items-center justify-between border-b border-cream-400 pb-4 text-[10px] uppercase tracking-[0.24em] text-ink-300">
                <span>— Resumen del pedido</span>
                <span>Pago único</span>
              </div>

              <div className="flex gap-5 border-b border-cream-400 py-6">
                {isBundle ? (
                  <BundleCovers />
                ) : (
                  <div className="h-[150px] w-[100px] shrink-0 overflow-hidden border border-ink-900/10 bg-cream-50 shadow-[10px_14px_28px_rgba(10,10,10,0.14)]">
                    <img
                      src={coverSrc}
                      alt={`Portada de ${book.title}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-serif text-[24px] leading-[1.05] tracking-[-0.02em] text-ink-900">{book.title}</p>
                  <p className="mt-2 text-[13px] italic text-ink-400">{book.author} · {book.year}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[9.5px] uppercase tracking-[0.16em] text-ink-500">
                    <span className="border border-cream-400 px-2 py-1">{book.format}</span>
                    <span className="border border-cream-400 px-2 py-1">{book.pages} pág</span>
                    <span className="border border-cream-400 px-2 py-1">{book.language}</span>
                  </div>
                </div>
              </div>

              {isBundle && <BundleShippingNote />}

              <div className="flex items-center justify-between border-b border-cream-400 py-5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink-300">— Cantidad</span>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    aria-label="Restar"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-8 w-8 items-center justify-center border border-cream-400 text-ink-500 hover:border-ink-900 hover:text-ink-900"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-serif text-[16px]">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Sumar"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-8 w-8 items-center justify-center border border-cream-400 text-ink-500 hover:border-ink-900 hover:text-ink-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-2 space-y-3 border-t border-cream-400 pt-6">
                <div className="flex items-baseline justify-between text-[13px] text-ink-500">
                  <span>Subtotal</span>
                  <span className="font-serif">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-baseline justify-between text-[12px] text-ink-300">
                  <span>Envío</span>
                  <span className="font-serif">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex items-baseline justify-between text-[12px] text-ink-300">
                  <span>IVA (16%)</span>
                  <span className="font-serif">{formatCurrency(tax)}</span>
                </div>
                <div className="flex items-baseline justify-between border-t border-ink-900/25 pt-4">
                  <span className="font-serif text-[16px]">Total</span>
                  <span className="font-serif text-[34px]">{formatCurrency(total)}</span>
                </div>
              </div>
              <p className="mt-6 border-t border-cream-400 pt-5 text-[12px] leading-[1.6] text-ink-400">
                Pago único · no recurrente. Envío nacional en 3 a 5 días hábiles.
              </p>
            </div>

            {/* Panel — envío / pago */}
            <div className="bg-ink-900 p-8 text-cream-50 lg:p-10">
              <div className="flex items-center justify-between border-b border-white/15 pb-4 text-[10px] uppercase tracking-[0.2em] text-white/55">
                <span>— Envío y pago</span>
                <span>Pasarela segura · SSL</span>
              </div>

              {/* Step tabs */}
              <div className="mt-8 flex items-center gap-8 border-b border-white/15 pb-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center border text-[11px] ${
                      step === 'payment' ? 'border-white/30 bg-white/10' : 'border-cream-50 bg-cream-50 text-ink-900'
                    }`}
                  >
                    1
                  </span>
                  <span className="text-[13px]">Envío</span>
                </div>
                <div className="h-px flex-1 bg-white/15" />
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center border text-[11px] ${
                      step === 'payment' ? 'border-cream-50 bg-cream-50 text-ink-900' : 'border-white/30 text-white/50'
                    }`}
                  >
                    2
                  </span>
                  <span className={`text-[13px] ${step === 'payment' ? '' : 'text-white/50'}`}>Pago</span>
                </div>
              </div>

              {step === 'shipping' ? (
                <form onSubmit={handleContinueToPayment} className="mt-8">
                  <h2 className="font-serif text-[36px] italic">Envío.</h2>
                  <p className="mt-2 text-[13px] text-white/55">
                    {needsGuestContact ? 'A dónde llega tu ejemplar. No necesitas crear una cuenta.' : 'A dónde llega tu ejemplar.'}
                  </p>

                  {needsGuestContact && (
                    <label className="mt-6 flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">— Correo</span>
                      <input
                        type="email"
                        required
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="tucorreo@ejemplo.com"
                        className="input-cream rounded-none border-white/25 bg-transparent font-serif text-[18px] text-cream-50 placeholder:text-white/35"
                      />
                      <span className="text-[11px] text-white/45">Ahí te enviaremos la confirmación y el número de guía.</span>
                    </label>
                  )}

                  <div className="mt-8 grid gap-6 sm:grid-cols-2 [&_input]:bg-transparent [&_input]:text-cream-50 [&_input]:border-white/25 [&_input::placeholder]:text-white/35 [&_label>span]:text-white/45">
                    {SHIPPING_FIELDS.map((field) => (
                      <div key={field.name} className={field.name === 'street' ? 'sm:col-span-2' : ''}>
                        <ShippingField field={field} value={shipping[field.name] ?? ''} onChange={updateShipping} />
                      </div>
                    ))}

                    <label className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">— Estado</span>
                      <select
                        value={shipping.state}
                        onChange={(e) => updateShipping('state', e.target.value)}
                        className="input-cream rounded-none border-white/25 bg-transparent font-serif text-[18px] text-cream-50"
                      >
                        {MEXICAN_STATES.map((s) => (
                          <option key={s} value={s} className="text-ink-900">
                            {s}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="sm:col-span-2">
                      <ShippingField
                        field={{ label: 'Referencias · opcional', name: 'references', placeholder: 'Entre calles, portón, indicaciones' }}
                        value={shipping.references ?? ''}
                        onChange={updateShipping}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmitShipping}
                    className="mt-8 flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900 disabled:opacity-50"
                  >
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Continuar a pago →</span>
                  </button>
                </form>
              ) : (
                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-[36px] italic">Tarjeta.</h2>
                    <div className="flex gap-3">
                      {['VISA', 'MASTER', 'AMEX'].map((brand) => (
                        <span key={brand} className="border border-white/25 px-2.5 py-1 text-[9.5px] tracking-[0.16em] text-white/65">
                          {brand}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep('shipping')}
                    className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/45 hover:text-white/80"
                  >
                    ← Editar envío
                  </button>

                  {initError && (
                    <p className="mt-4 border border-red-700 bg-red-950/40 px-4 py-3 text-[13px] text-red-300">{initError}</p>
                  )}

                  {!clientSecret || !elementsOptions ? (
                    <div className="mt-6 flex flex-col gap-5">
                      {loadingRates ? (
                        <div className="flex items-center gap-3 text-[13px] text-white/60">
                          <Spinner size="sm" />
                          Cotizando envío con paqueterías…
                        </div>
                      ) : shippingRates.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                            — Elige tu paquetería · envío incluido
                          </span>
                          {shippingRates.map((rate) => {
                            const isSelected = selectedRate?.carrier === rate.carrier && selectedRate?.service === rate.service;
                            return (
                              <button
                                key={`${rate.carrier}-${rate.service}`}
                                type="button"
                                onClick={() => setSelectedRate(rate)}
                                className={`flex items-center justify-between border px-4 py-3 text-left transition-colors ${
                                  isSelected ? 'border-cream-50 bg-white/10' : 'border-white/20 hover:border-white/40'
                                }`}
                              >
                                <span>
                                  <span className="block text-[13px] font-semibold">
                                    {rate.carrierDescription} · {rate.serviceDescription}
                                  </span>
                                  <span className="block text-[11px] text-white/50">Llega en {rate.deliveryEstimate}</span>
                                </span>
                                <span className="font-serif text-[13px] italic text-white/70">Incluido</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        ratesFetched && (
                          <p className="border border-white/15 bg-white/5 px-4 py-3 text-[13px] text-white/60">
                            No encontramos paqueterías disponibles para tu dirección en este momento — el envío se coordinará manualmente.
                          </p>
                        )
                      )}
                      <p className="text-[13px] leading-[1.7] text-white/60">
                        Haz clic en continuar para ingresar los datos de tu tarjeta de forma segura a través de Stripe.
                      </p>
                      <button
                        onClick={handleInitPayment}
                        disabled={loading || loadingRates}
                        className="flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900 disabled:opacity-50"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                          {loading ? 'Cargando…' : 'Continuar al pago →'}
                        </span>
                        <span className="font-serif text-[15px] italic">{formatCurrency(total)}</span>
                      </button>
                    </div>
                  ) : !hasStripePublishableKey ? (
                    <div className="mt-6 border border-red-700 bg-red-950/40 px-4 py-3 text-[13px] text-red-300">
                      {stripeMissingKeyMessage}
                    </div>
                  ) : clientSecret.startsWith('demo_') ? (
                    <div className="mt-6">
                      <div className="border border-white/15 bg-white/5 px-4 py-3 text-[13px] text-white/70">
                        Modo local activo: se confirmará tu pedido sin contactar a Stripe.
                      </div>
                      <button
                        onClick={() => setSuccess(true)}
                        className="mt-6 flex w-full items-center justify-between bg-cream-50 px-7 py-5 text-ink-900"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.18em]">Comprar libro ahora →</span>
                        <span className="font-serif text-[15px] italic">{formatCurrency(finalTotal || total)}</span>
                      </button>
                    </div>
                  ) : (
                    <Elements stripe={stripePromise} options={elementsOptions}>
                      <BookPaymentForm total={finalTotal || total} onSuccess={() => setSuccess(true)} />
                    </Elements>
                  )}

                  <p className="mt-8 border-t border-white/15 pt-6 text-[12.5px] leading-[1.7] text-white/60">
                    Tu ejemplar se envía a domicilio en 3 a 5 días hábiles. Recibirás confirmación y número de guía por correo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
