import { client } from './client';
import type { Order, OrderItem, ShippingAddress, ApiResponse } from '@t/index';

export interface AppliedPromotion {
  promotionId: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  discount: number;
}

interface PaymentIntentResult {
  clientSecret: string;
  orderId: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  promotion: AppliedPromotion | null;
}

export interface OrderQuote {
  subtotal: number;
  discount: number;
  total: number;
  promotion: AppliedPromotion | null;
}

const checkoutRefs = (items: OrderItem[]) =>
  items.map((item) => ({
    type: item.type,
    refId: item.refId,
    title: item.title,
    price: item.price,
    quantity: item.quantity ?? 1,
    // Sólo texto de presentación (el precio lo fija el backend): fecha y formato de la edición.
    eventDate: item.eventDate,
    eventFormat: item.eventFormat,
    eventId: item.eventId,
    eventSlug: item.eventSlug,
  }));

export const createPaymentIntent = (
  items: OrderItem[],
  shipping?: ShippingAddress,
  customer?: { name: string; email: string; phone: string },
  shippingSelection?: { carrier: string; service: string },
  promoCode?: string,
) =>
  client
    .post<ApiResponse<PaymentIntentResult>>('/payments/intent', {
      items: checkoutRefs(items),
      shipping,
      customer,
      shippingSelection,
      promoCode: promoCode || undefined,
    })
    .then((r) => r.data);

// Cotiza el pedido con precios del catálogo del backend y, si se manda un
// código, valida que aplique y devuelve el descuento resultante.
export const quoteOrder = (items: OrderItem[], promoCode?: string): Promise<OrderQuote> =>
  client
    .post<ApiResponse<OrderQuote>>('/payments/quote', { items: checkoutRefs(items), promoCode: promoCode || undefined })
    .then((r) => r.data);

// Avisa al backend que Stripe ya cobro; el backend lo verifica contra Stripe.
// Best effort: complementa al webhook (que sigue siendo la fuente principal).
export const confirmPaymentIntent = (paymentIntentId: string) =>
  client
    .post<ApiResponse<{ status: string }>>('/payments/confirm', { paymentIntentId })
    .then((r) => r.data);

export const getOrders = (): Promise<Order[]> =>
  client.get<ApiResponse<Order[]>>('/payments/orders').then((r) => r.data);

export const listAllOrders = (): Promise<Order[]> =>
  client
    .get<ApiResponse<Order[]>>('/payments/admin/orders')
    .then((r) => r.data);

export const deleteOrder = (id: string): Promise<{ id: string }> =>
  client
    .delete<ApiResponse<{ id: string }>>(`/payments/admin/orders/${id}`)
    .then((r) => r.data);

export interface OrderReceipt {
  id: string;
  items: { title: string; price: number; quantity: number; eventDate?: string; eventFormat?: string }[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  customerName: string;
  customerEmail: string;
  paidAt: string | null;
  reference: string;
  shippingCarrier: string;
  shippingTrackingNumber: string;
  shippingLabelUrl: string;
  shippingTrackUrl: string;
  tickets?: { folio: string; url: string; attendeeName: string; status: 'valid' | 'used' | 'void' }[];
}

export const getOrderReceipt = (id: string): Promise<OrderReceipt> =>
  client.get<ApiResponse<OrderReceipt>>(`/receipts/order/${id}`).then((r) => r.data);
