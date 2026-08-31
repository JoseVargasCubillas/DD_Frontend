import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

// Recrea, en la página web, el mismo lenguaje visual de los correos
// transaccionales (ver emailShell/amountBand/confirmationPanel/linkButton en
// DD_Backend/src/atomic/organisms/services/email.service.ts): panel negro de
// portada, barra de monto, tarjeta de confirmación con cifra en serif grande,
// tabla de filas con borde, y el mismo cierre editorial.

interface ReceiptShellProps {
  eyebrow: string;
  badge?: string;
  badgeTone?: 'good' | 'muted';
  title: string;
  lead: string;
  footerMeta?: { left: string; right: string };
  children: ReactNode;
}

export function ReceiptShell({ eyebrow, badge, badgeTone = 'good', title, lead, footerMeta, children }: ReceiptShellProps) {
  return (
    <div className="bg-cream-100 text-ink-900">
      <div className="h-2 bg-ink-900" />

      <section className="bg-ink-900 text-cream-50">
        <div className="mx-auto max-w-[760px] px-6 py-14 sm:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-100">— {eyebrow}</span>
            {badge && (
              <span
                className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] ${
                  badgeTone === 'good' ? 'border-white/15 text-emerald-200' : 'border-white/15 text-ink-100'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${badgeTone === 'good' ? 'bg-emerald-400' : 'bg-ink-100'}`} />
                {badge}
              </span>
            )}
          </div>
          <h1 className="mt-5 font-serif text-[42px] leading-[1.05] sm:text-[56px]">
            {title}
            <span className="italic">.</span>
          </h1>
          <p className="mt-5 max-w-[520px] text-[15px] leading-[1.7] text-ink-100">{lead}</p>
        </div>
      </section>

      <section className="bg-cream-100">
        <div className="mx-auto max-w-[760px] px-6 py-10 sm:px-10">{children}</div>
      </section>

      <section className="border-t border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[760px] px-6 py-8 sm:px-10">
          {footerMeta && (
            <div className="flex items-center justify-between border-b border-cream-400 pb-6 text-[11px] uppercase tracking-[0.18em] text-ink-300">
              <span>{footerMeta.left}</span>
              <span className="font-serif text-[13px] italic normal-case tracking-normal text-ink-500">{footerMeta.right}</span>
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-serif text-[20px] text-ink-900">El éxito ama la preparación.</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink-300">— Diego Díaz</span>
          </div>
          <p className="mt-4 text-[12px] leading-[1.6] text-ink-400">
            Este recibo confirma tu pago. No sustituye un CFDI ante el SAT — si necesitas factura fiscal, escríbenos a{' '}
            <a href="mailto:servicios@diegodiaz.mx" className="underline">
              servicios@diegodiaz.mx
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

export function AmountBand({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-6 flex items-center justify-between bg-ink-900 px-6 py-5 sm:px-7">
      <span className="text-[10px] uppercase tracking-[0.24em] text-ink-100">— {label}</span>
      <span className="font-serif text-[28px] text-cream-50 sm:text-[30px]">{value}</span>
    </div>
  );
}

interface ConfirmationPanelProps {
  label: string;
  tag?: string;
  value: ReactNode;
  description: string;
}

export function ConfirmationPanel({ label, tag, value, description }: ConfirmationPanelProps) {
  return (
    <div className="bg-ink-900 px-6 py-7 text-cream-50 sm:px-7">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.3em] text-ink-100">— {label}</span>
        {tag && <span className="font-serif text-[12px] italic text-ink-100">{tag}</span>}
      </div>
      <div className="mt-3 font-serif text-[30px] leading-[1.08] sm:text-[34px]">{value}</div>
      <p className="mt-3 text-[14px] leading-[1.6] text-ink-100">{description}</p>
    </div>
  );
}

export function DetailRows({ rows }: { rows: [string, string][] }) {
  return (
    <div className="border border-cream-400 bg-white">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center gap-3 border-b border-cream-400 px-5 py-4 last:border-0 sm:px-6">
          <span className="w-[38%] shrink-0 text-[10px] uppercase tracking-[0.2em] text-ink-300 sm:w-[30%]">{label}</span>
          <span className="text-[14px] font-bold leading-[1.4] text-ink-900">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function LinkButton({ to, label, detail, dark }: { to: string; label: string; detail?: string; dark?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between border px-6 py-4 transition-opacity hover:opacity-90 ${
        dark ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-cream-400 bg-white text-ink-900'
      }`}
    >
      <span className="text-[11px] font-bold uppercase tracking-[0.18em]">{label}</span>
      {detail && (
        <span className={`font-serif text-[13px] italic ${dark ? 'text-ink-100' : 'text-ink-400'}`}>{detail} →</span>
      )}
    </Link>
  );
}

export function ReceiptNotFound() {
  return (
    <div className="bg-cream-100 text-ink-900">
      <div className="mx-auto max-w-[760px] px-6 py-28 text-center sm:px-10">
        <h1 className="font-serif text-[48px] leading-[0.95]">
          Recibo<span className="italic">.</span>
        </h1>
        <p className="mt-6 text-ink-400">No encontramos este recibo. El enlace pudo haber expirado o el pago aún no se confirma.</p>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          Ir al inicio →
        </Link>
      </div>
    </div>
  );
}
