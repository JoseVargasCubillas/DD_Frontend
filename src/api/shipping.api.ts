import { client } from './client';
import type { ShippingAddress, OrderItem, ApiResponse } from '@t/index';

export interface ShippingRateOption {
  carrier: string;
  carrierDescription: string;
  service: string;
  serviceDescription: string;
  deliveryEstimate: string;
  deliveryDays: number;
  totalPrice: number;
  currency: string;
}

export interface AddressCheck {
  errors: string[];
  warnings: string[];
}

// Verificación del domicilio antes del pago: `errors` bloquean, `warnings`
// piden confirmación. Si el servicio no responde se deja continuar (el
// servidor vuelve a validar al crear el pago).
export const validateAddress = (shipping: ShippingAddress): Promise<AddressCheck | null> =>
  client
    .post<ApiResponse<AddressCheck>>('/payments/validate-address', { shipping })
    .then((r) => r.data)
    .catch(() => null);

export interface PostalCodeResult {
  found: boolean;
  unavailable?: boolean;
  state?: string;
  city?: string;
  colonies?: string[];
}

export const lookupPostalCode = (postalCode: string): Promise<PostalCodeResult> =>
  client
    .get<ApiResponse<PostalCodeResult>>(`/payments/postal-code/${postalCode}`)
    .then((r) => r.data)
    .catch(() => ({ found: false, unavailable: true }));

export const quoteShipping = (items: OrderItem[], shipping: ShippingAddress): Promise<ShippingRateOption[]> =>
  client
    .post<ApiResponse<ShippingRateOption[]>>('/payments/shipping-quote', { items, shipping })
    .then((r) => r.data)
    .catch(() => []);
