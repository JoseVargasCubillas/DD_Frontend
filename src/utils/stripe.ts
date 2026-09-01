import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

export const hasStripePublishableKey =
  typeof stripePublishableKey === 'string' && stripePublishableKey.startsWith('pk_');

export const stripePromise = hasStripePublishableKey
  ? loadStripe(stripePublishableKey as string)
  : Promise.resolve(null);

export const stripeMissingKeyMessage =
  'Falta configurar VITE_STRIPE_PUBLISHABLE_KEY en el frontend. Agrega la llave publica pk_... y reinicia Vite.';
