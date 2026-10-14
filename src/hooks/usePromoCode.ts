import { useCallback, useEffect, useRef, useState } from 'react';
import { quoteOrder, type AppliedPromotion } from '@api/payments.api';
import type { OrderItem } from '@t/index';

export type PromoStatus = 'idle' | 'checking' | 'applied' | 'error';

export interface PromoCodeState {
  status: PromoStatus;
  applied: AppliedPromotion | null;
  error: string;
  discount: number;
  apply: (code: string) => Promise<void>;
  remove: () => void;
}

const itemsKey = (items: OrderItem[]) =>
  items.map((i) => `${i.type}:${i.refId}:${i.quantity ?? 1}`).join('|');

// Valida códigos de descuento contra el backend (precios autoritativos del
// catálogo) y vuelve a cotizar si el pedido cambia mientras hay uno aplicado.
export const usePromoCode = (items: OrderItem[]): PromoCodeState => {
  const [status, setStatus] = useState<PromoStatus>('idle');
  const [applied, setApplied] = useState<AppliedPromotion | null>(null);
  const [error, setError] = useState('');
  const requestId = useRef(0);
  const key = itemsKey(items);

  const apply = useCallback(
    async (code: string) => {
      const clean = code.trim().toUpperCase();
      if (!clean) return;
      const id = ++requestId.current;
      setStatus('checking');
      setError('');
      try {
        const quote = await quoteOrder(items, clean);
        if (id !== requestId.current) return;
        if (!quote.promotion) throw new Error('Código inválido');
        setApplied(quote.promotion);
        setStatus('applied');
      } catch (err) {
        if (id !== requestId.current) return;
        setApplied(null);
        setStatus('error');
        setError((err as Error).message || 'No pudimos validar el código.');
      }
    },
    // `key` resume el contenido de items; evita re-crear apply en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const remove = useCallback(() => {
    requestId.current += 1;
    setApplied(null);
    setError('');
    setStatus('idle');
  }, []);

  const appliedCode = applied?.code;
  useEffect(() => {
    if (!appliedCode) return;
    void apply(appliedCode);
    // Sólo cuando cambia el pedido; `apply` ya depende de `key`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { status, applied, error, discount: applied?.discount ?? 0, apply, remove };
};
