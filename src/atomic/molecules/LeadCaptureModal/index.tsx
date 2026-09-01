import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

type Resource = 'media-kit' | 'sat-guide' | 'estrategia-fiscal-dossier' | 'downloadable-resource';

interface Props {
  open: boolean;
  onClose: () => void;
  resource: Resource;
  submit: (email: string, name?: string, phone?: string) => Promise<{ downloadUrl?: string } | void | unknown>;
  title?: string;
  description?: string;
  submitLabel?: string;
  requireName?: boolean;
  requirePhone?: boolean;
  fallbackDownloadUrl?: string;
  fallbackFilename?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LeadCaptureModal({
  open,
  onClose,
  resource,
  submit,
  title,
  description,
  submitLabel,
  requireName = false,
  requirePhone = false,
  fallbackDownloadUrl,
  fallbackFilename,
}: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setName('');
      setPhone('');
      setBusy(false);
      setSent(false);
    }
  }, [open]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const cleanEmail = email.trim();
      if (!EMAIL_RE.test(cleanEmail)) {
        toast.error('Escribe un correo válido.');
        return;
      }
      const cleanName = name.trim();
      if (requireName && cleanName.length < 2) {
        toast.error('Escribe tu nombre.');
        return;
      }
      const cleanPhone = phone.trim();
      if (requirePhone && cleanPhone.length < 8) {
        toast.error('Escribe un número de teléfono válido.');
        return;
      }
      setBusy(true);
      try {
        const result = (await submit(
          cleanEmail,
          cleanName || undefined,
          cleanPhone || undefined,
        )) as
          | { downloadUrl?: string }
          | undefined;
        setSent(true);
        toast.success('Listo. Revisa tu bandeja de entrada.');
        const url = result?.downloadUrl ?? fallbackDownloadUrl;
        if (url) {
          const link = document.createElement('a');
          link.href = url;
          if (fallbackFilename) link.download = fallbackFilename;
          link.rel = 'noopener noreferrer';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No pudimos procesar tu solicitud.';
        toast.error(message);
      } finally {
        setBusy(false);
      }
    },
    [email, name, phone, requireName, requirePhone, submit, fallbackDownloadUrl, fallbackFilename],
  );

  if (!open) return null;

  const defaults: Record<Resource, { title: string; description: string; submit: string }> = {
    'media-kit': {
      title: 'Descarga el Media Kit',
      description:
        'Déjanos tu correo y te enviamos el kit editorial (bio, fotografías en alta, logotipos y líneas editoriales). También lo abrimos ahora mismo en tu navegador.',
      submit: 'Enviar y descargar',
    },
    'sat-guide': {
      title: 'Recibe la Guía para blindarte del SAT',
      description: 'Te enviamos el PDF a tu correo en menos de un minuto. Sin spam.',
      submit: 'Enviar guía',
    },
    'estrategia-fiscal-dossier': {
      title: 'Recibe el dossier de Estrategia Fiscal',
      description:
        'Déjanos tus datos y te enviamos el dossier oficial del seminario a tu correo.',
      submit: 'Enviar dossier',
    },
    'downloadable-resource': {
      title: 'Recibe el recurso',
      description:
        'Déjanos tu correo y te enviamos el material a tu bandeja. También abriremos la descarga al terminar.',
      submit: 'Enviar y descargar',
    },
  };
  const copy = defaults[resource];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-900/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[520px] border border-ink-900/10 bg-cream-50 p-8 shadow-[0_36px_80px_-40px_rgba(10,10,10,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-500">
              — Descarga editorial
            </p>
            <h3 className="mt-3 font-serif text-[32px] leading-[1.05] tracking-[-0.03em] text-ink-900">
              {title ?? copy.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer text-2xl leading-none text-ink-500 hover:text-ink-900"
          >
            ×
          </button>
        </div>

        <p className="mt-5 text-[14px] leading-[1.6] text-ink-700">
          {description ?? copy.description}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <div>
            <label
              htmlFor="lead-name"
              className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-ink-500"
            >
              Nombre {requireName ? '*' : '(opcional)'}
            </label>
            <input
              id="lead-name"
              type="text"
              required={requireName}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={busy}
              placeholder="Tu nombre"
              className="w-full border border-ink-900/15 bg-white px-4 py-3 text-[15px] text-ink-900 focus:border-ink-900 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="lead-phone"
              className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-ink-500"
            >
              Número {requirePhone ? '*' : '(opcional)'}
            </label>
            <input
              id="lead-phone"
              type="tel"
              required={requirePhone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              disabled={busy}
              placeholder="Tu número"
              className="w-full border border-ink-900/15 bg-white px-4 py-3 text-[15px] text-ink-900 focus:border-ink-900 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="lead-email"
              className="mb-1 block text-[11px] uppercase tracking-[0.18em] text-ink-500"
            >
              Correo electrónico *
            </label>
            <input
              id="lead-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={busy}
              placeholder="tu@correo.com"
              className="w-full border border-ink-900/15 bg-white px-4 py-3 text-[15px] text-ink-900 focus:border-ink-900 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center bg-ink-900 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink-700 disabled:opacity-70"
          >
            {busy ? 'Enviando…' : sent ? 'Enviar de nuevo' : (submitLabel ?? copy.submit)}
          </button>
          {sent && (
            <p className="mt-3 text-[12px] text-ink-500">
              Enviado a {email}. Revisa también la carpeta de promociones.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
