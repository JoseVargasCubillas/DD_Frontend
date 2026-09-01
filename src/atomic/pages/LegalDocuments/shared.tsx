import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type LegalSection = {
  id: string;
  eyebrow?: string;
  title: string;
  body?: string[];
  bullets?: string[];
};

export type FaqCategory = {
  id: string;
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
};

function useAccepted(storageKey?: string) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!storageKey) return;
    setAccepted(window.localStorage.getItem(storageKey) === 'true');
  }, [storageKey]);

  const accept = () => {
    if (storageKey) window.localStorage.setItem(storageKey, 'true');
    setAccepted(true);
  };

  return { accepted, accept };
}

export function LegalHeader({
  label,
  title,
  italic,
  intro,
  meta,
}: {
  label: string;
  title: string;
  italic?: string;
  intro: string;
  meta?: { label: string; value: string }[];
}) {
  return (
    <header className="container-app border-b border-ink-900/15 py-16 md:py-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-500">{label}</p>
      <h1 className="mt-5 max-w-[840px] text-[clamp(42px,6.2vw,78px)] font-bold leading-[0.95] tracking-[-0.045em] text-ink-900">
        {title}
        {italic ? (
          <>
            {' '}
            <em className="font-serif font-normal italic tracking-[-0.02em] text-[#6b5637]">
              {italic}
            </em>
          </>
        ) : null}
      </h1>
      <p className="mt-8 max-w-[720px] border-l-2 border-ink-900 pl-6 font-serif text-[18px] italic leading-[1.65] text-ink-700 md:text-[20px]">
        {intro}
      </p>
      {meta?.length ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {meta.map((item) => (
            <div key={item.label} className="border-t border-ink-900/20 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">
                {item.label}
              </p>
              <p className="mt-1 text-[13px] font-bold text-ink-800">{item.value}</p>
            </div>
          ))}
        </div>
      ) : null}
    </header>
  );
}

export function LegalIndex({ sections }: { sections: LegalSection[] }) {
  return (
    <nav className="container-app py-8" aria-label="Indice del documento">
      <div className="grid border-y border-ink-900/20 py-6 sm:grid-cols-2">
        {sections.map((section, index) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="group flex min-h-11 items-center justify-between gap-6 border-b border-transparent py-2 text-[13px] transition-colors hover:border-ink-900/20"
          >
            <span className="font-bold text-ink-900">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-right text-ink-500 transition-colors group-hover:text-ink-900">
              {section.title}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function LegalBody({ sections }: { sections: LegalSection[] }) {
  return (
    <section className="container-app pb-20">
      <div className="mx-auto max-w-[980px]">
        {sections.map((section, index) => (
          <article
            key={section.id}
            id={section.id}
            className="grid scroll-mt-28 gap-6 border-t border-ink-900/15 py-9 md:grid-cols-[220px_minmax(0,1fr)]"
          >
            <div>
              <p className="font-bold text-[15px] text-ink-900">
                {String(index + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">
                {section.eyebrow ?? section.title}
              </p>
            </div>
            <div className="max-w-[720px]">
              <h2 className="font-serif text-[24px] leading-tight tracking-[-0.015em] text-ink-900 md:text-[30px]">
                {section.title}
              </h2>
              {section.body?.map((paragraph) => (
                <p key={paragraph} className="mt-5 text-[15px] leading-[1.8] text-ink-700">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-5 grid gap-2 border-l border-ink-900/20 pl-5">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="text-[14px] leading-[1.7] text-ink-700">
                      {bullet}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SectionKicker({
  label,
  index,
  total,
}: {
  label: string;
  index: number;
  total: number;
}) {
  return (
    <div className="mt-16 mb-8 flex items-center gap-4 first:mt-0">
      <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-500">
        {label}
      </span>
      <div className="h-px flex-1 bg-ink-900/20" />
      <span className="shrink-0 font-mono text-[11px] text-ink-300">
        {String(index).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

export function LegalClause({
  id,
  number,
  subtitle,
  children,
}: {
  id: string;
  number: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className="grid scroll-mt-28 gap-5 border-t border-ink-900/15 py-9 md:grid-cols-[200px_minmax(0,1fr)] md:gap-8"
    >
      <div>
        <p className="font-bold text-[16px] tracking-[-0.01em] text-ink-900">{number}</p>
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
          {subtitle}
        </p>
      </div>
      <div className="max-w-[700px] space-y-4 text-[15px] leading-[1.8] text-ink-700">
        {children}
      </div>
    </article>
  );
}

export function PullQuote({ children }: { children: ReactNode }) {
  return (
    <div className="border-l-[3px] border-ink-900 bg-cream-100 px-6 py-5 md:px-8">
      <p className="font-serif text-[17px] italic leading-[1.6] text-ink-900">{children}</p>
    </div>
  );
}

export function BankBlock({
  title,
  rows,
}: {
  title: string;
  rows: { key: string; value: string }[];
}) {
  return (
    <div className="max-w-[520px] border-l-[3px] border-ink-900 bg-cream-100 px-6 py-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-500">{title}</p>
      <div className="mt-3 divide-y divide-ink-900/15">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between gap-4 py-2 text-[13px]">
            <span className="text-ink-500">{row.key}</span>
            <span className="text-right font-mono font-bold text-ink-900">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SubBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-2">
      <p className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-500">
        {title}
      </p>
      {children}
    </div>
  );
}

export function NumberedList({ items }: { items: ReactNode[] }) {
  return (
    <ol className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-[14.5px] leading-[1.65] text-ink-700">
          <span className="shrink-0 font-bold text-ink-900">{index + 1}.</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

export function LetteredList({ items }: { items: { mark: string; text: string }[] }) {
  return (
    <div className="flex max-w-[720px] flex-col gap-6">
      {items.map((item) => (
        <div key={item.mark} className="grid grid-cols-[32px_1fr] gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-[1.5px] border-ink-900 text-[12px] font-bold text-ink-900">
            {item.mark}
          </span>
          <p className="pt-1 text-[15px] leading-[1.7] text-ink-900">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

export function SignatureBlock({ roles }: { roles: string[] }) {
  return (
    <div className="grid gap-12 sm:grid-cols-2">
      {roles.map((role) => (
        <div key={role} className="pt-14">
          <div className="mb-3 h-px bg-ink-900" />
          <p className="text-[13px] font-bold uppercase tracking-[0.06em] text-ink-900">{role}</p>
        </div>
      ))}
    </div>
  );
}

export function AcceptancePanel({
  storageKey,
  documentName,
}: {
  storageKey: string;
  documentName: string;
}) {
  const { accepted, accept } = useAccepted(storageKey);

  return (
    <section className="border-t border-ink-900/15 bg-cream-100">
      <div className="container-app flex flex-col gap-5 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-500">
            Confirmacion
          </p>
          <p className="mt-2 max-w-[640px] text-[15px] leading-[1.65] text-ink-700">
            {accepted
              ? `Ya aceptaste ${documentName} en este navegador.`
              : `Confirma que leiste y aceptas ${documentName}.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={accept}
            className="min-h-11 cursor-pointer border border-ink-900 bg-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-ink-900 focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
          >
            {accepted ? 'Aceptado' : 'Aceptar'}
          </button>
          <Link
            to="/contacto"
            className="inline-flex min-h-11 cursor-pointer items-center border border-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-ink-900 focus:ring-offset-2"
          >
            Tengo dudas
          </Link>
        </div>
      </div>
    </section>
  );
}

export function FaqPageShell({ categories }: { categories: FaqCategory[] }) {
  const total = useMemo(
    () => categories.reduce((count, category) => count + category.items.length, 0),
    [categories],
  );

  return (
    <main className="bg-cream-200 text-ink-900">
      <LegalHeader
        label="Ayuda · Diego Diaz"
        title="Preguntas"
        italic="frecuentes"
        intro="Antes de escribirle a un asesor, seguro alguna de estas respuestas te ayuda a avanzar."
        meta={[
          { label: 'Categorias', value: String(categories.length).padStart(2, '0') },
          { label: 'Respuestas', value: String(total).padStart(2, '0') },
          { label: 'Soporte', value: 'Contacto directo' },
        ]}
      />

      <nav className="container-app py-8" aria-label="Categorias de preguntas">
        <div className="flex flex-wrap gap-3 border-y border-ink-900/20 py-6">
          {categories.map((category, index) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="inline-flex min-h-11 items-center gap-3 border border-ink-900 px-4 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors hover:bg-ink-900 hover:text-white"
            >
              <span className="font-mono">{String(index + 1).padStart(2, '0')}</span>
              {category.title}
            </a>
          ))}
        </div>
      </nav>

      <section className="container-app pb-20">
        <div className="mx-auto max-w-[980px]">
          {categories.map((category, categoryIndex) => (
            <section key={category.id} id={category.id} className="scroll-mt-28 py-8">
              <div className="grid items-center gap-4 md:grid-cols-[220px_minmax(0,1fr)_auto]">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
                  {String(categoryIndex + 1).padStart(2, '0')} / {category.title}
                </p>
                <div className="hidden h-px bg-ink-900/15 md:block" />
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
                  {category.items.length} preguntas
                </p>
              </div>
              <div className="mt-5 border-b border-ink-900/15">
                {category.items.map((item, itemIndex) => (
                  <details
                    key={item.question}
                    className="group border-t border-ink-900/15"
                    open={categoryIndex === 0 && itemIndex === 0}
                  >
                    <summary className="flex min-h-[76px] cursor-pointer list-none items-start justify-between gap-6 py-6 marker:hidden">
                      <span className="grid gap-1 md:grid-cols-[64px_minmax(0,1fr)]">
                        <span className="font-serif text-[20px] italic text-ink-400">
                          {String(itemIndex + 1).padStart(2, '0')}.
                        </span>
                        <span className="font-serif text-[24px] leading-tight tracking-[-0.015em] text-ink-900 md:text-[30px]">
                          {item.question}
                        </span>
                      </span>
                      <span className="relative mt-2 h-5 w-5 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-5 before:bg-ink-900 after:absolute after:left-1/2 after:top-0 after:h-5 after:w-px after:bg-ink-900 group-open:after:hidden" />
                    </summary>
                    <p className="pb-8 pl-0 text-[15px] leading-[1.8] text-ink-600 md:pl-16">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
