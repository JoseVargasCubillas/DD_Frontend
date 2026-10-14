import { useId, useState, type FormEvent } from 'react';
import { formatCurrency } from '@utils/formatters';
import type { PromoCodeState } from '@hooks/usePromoCode';

const TagIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const CloseIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={className} aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

interface PromoCodeFieldProps {
  promo: PromoCodeState;
  // Una vez creado el PaymentIntent el monto ya está fijado en Stripe: el
  // código deja de poder cambiarse hasta recargar el checkout.
  locked?: boolean;
}

export const promoLabel = (promo: NonNullable<PromoCodeState['applied']>) =>
  promo.type === 'percentage' ? `${promo.value}% de descuento` : `${formatCurrency(promo.value)} de descuento`;

export default function PromoCodeField({ promo, locked = false }: PromoCodeFieldProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState('');
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const checking = promo.status === 'checking';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (checking) return;
    void promo.apply(code);
  };

  if (promo.applied) {
    const { applied } = promo;
    return (
      <div className="mt-2 border-t border-cream-400 pt-5" aria-live="polite">
        <div className="flex items-start gap-3 border border-ink-900/15 bg-cream-50 px-4 py-3.5">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center bg-ink-900 text-cream-50">
            <CheckIcon className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-baseline gap-x-2 text-[13px] text-ink-900">
              <span className="font-mono text-[12px] font-semibold tracking-[0.12em]">{applied.code}</span>
              <span className="text-ink-400">·</span>
              <span className="text-[12px] text-ink-500">{promoLabel(applied)}</span>
            </p>
            {applied.description && (
              <p className="mt-1 truncate font-serif text-[13px] italic text-ink-400">{applied.description}</p>
            )}
          </div>
          <p className="whitespace-nowrap font-serif text-[15px] text-ink-900">−{formatCurrency(applied.discount)}</p>
          {!locked && (
            <button
              type="button"
              onClick={() => { promo.remove(); setCode(''); setOpen(false); }}
              aria-label={`Quitar el código ${applied.code}`}
              className="-mr-1 flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center text-ink-300 transition-colors duration-200 hover:text-ink-900"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {locked && (
          <p className="mt-3 text-[11px] leading-[1.6] text-ink-400">
            Descuento aplicado al monto a pagar. Para cambiar el código, recarga esta página.
          </p>
        )}
      </div>
    );
  }

  if (locked) return null;

  if (!open) {
    return (
      <div className="mt-2 border-t border-cream-400 pt-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group inline-flex cursor-pointer items-center gap-2.5 text-[11px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-200 hover:text-ink-900"
        >
          <TagIcon className="h-4 w-4 text-ink-300 transition-colors duration-200 group-hover:text-ink-900" />
          <span className="border-b border-ink-900/20 pb-0.5 transition-colors duration-200 group-hover:border-ink-900">
            ¿Tienes un código de descuento?
          </span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-2 border-t border-cream-400 pt-5" noValidate>
      <label htmlFor={inputId} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-ink-300">
        <TagIcon className="h-3.5 w-3.5" />
        Código de descuento
      </label>
      <div className="mt-3 flex items-stretch border border-ink-900/20 bg-cream-50 transition-colors duration-200 focus-within:border-ink-900">
        <input
          id={inputId}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
          placeholder="EJ. BIENVENIDO10"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          autoFocus
          disabled={checking}
          aria-invalid={promo.status === 'error'}
          aria-describedby={promo.status === 'error' ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 font-mono text-[13px] tracking-[0.14em] text-ink-900 outline-none placeholder:font-sans placeholder:text-[11px] placeholder:tracking-[0.18em] placeholder:text-ink-300 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={checking || !code.trim()}
          className="flex min-w-[96px] cursor-pointer items-center justify-center bg-ink-900 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream-50 transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {checking ? 'Validando…' : 'Aplicar'}
        </button>
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-4" aria-live="polite">
        {promo.status === 'error' ? (
          <p id={errorId} role="alert" className="text-[12px] leading-[1.5] text-red-700">
            {promo.error}
          </p>
        ) : (
          <p className="text-[11px] leading-[1.5] text-ink-300">Se aplica al total antes de pagar.</p>
        )}
        <button
          type="button"
          onClick={() => { setOpen(false); setCode(''); promo.remove(); }}
          className="shrink-0 cursor-pointer text-[11px] uppercase tracking-[0.16em] text-ink-300 transition-colors duration-200 hover:text-ink-900"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

interface DiscountRowProps {
  promo: PromoCodeState;
}

// Fila "Descuento" para el bloque de totales del resumen.
export function DiscountRow({ promo }: DiscountRowProps) {
  if (!promo.applied) return null;
  return (
    <div className="flex items-baseline justify-between text-[13px] text-ink-700">
      <span className="flex items-center gap-2">
        Descuento
        <span className="font-mono text-[10px] tracking-[0.12em] text-ink-400">{promo.applied.code}</span>
      </span>
      <span className="font-serif">−{formatCurrency(promo.applied.discount)}</span>
    </div>
  );
}

interface TotalAmountProps {
  total: number;
  original?: number;
}

// Total grande del resumen; cuando hay descuento muestra tachado el original.
export function TotalAmount({ total, original }: TotalAmountProps) {
  const discounted = original !== undefined && original > total;
  return (
    <span className="flex flex-col items-end leading-none">
      {discounted && (
        <s className="mb-1 font-serif text-[14px] text-ink-300 decoration-ink-300/70">{formatCurrency(original)}</s>
      )}
      <span className="font-serif text-[34px]">{formatCurrency(total)}</span>
    </span>
  );
}
