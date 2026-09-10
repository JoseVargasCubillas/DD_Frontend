import { useMemo, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as whatsappApi from '@api/whatsapp.api';

type Segment =
  | 'all'
  | 'subscribed'
  | 'customers'
  | 'leads'
  | 'newsletter-leads'
  | 'guide-leads'
  | 'lead-source:guia-blindaje-sat'
  | 'lead-source:iniciativa-fiscal-2027';

interface SegmentOption {
  id: Segment;
  label: string;
  description: string;
}

const SEGMENT_OPTIONS: SegmentOption[] = [
  { id: 'subscribed', label: 'Suscritos Academia', description: 'Cuentas con opt-in y telefono' },
  { id: 'customers', label: 'Clientes', description: 'Compraron al menos una vez' },
  { id: 'leads', label: 'Leads (usuarios)', description: 'Cuentas sin compra' },
  { id: 'newsletter-leads', label: 'Suscriptores Mailing', description: 'Correos del footer, blog y formularios' },
  { id: 'lead-source:guia-blindaje-sat', label: 'Leads · Guia SAT', description: 'Descargaron la guia desde el Home' },
  { id: 'lead-source:iniciativa-fiscal-2027', label: 'Leads · Iniciativa Fiscal 2027', description: 'Descargaron el documento de Iniciativa Fiscal 2027' },
  { id: 'guide-leads', label: 'Leads editoriales', description: 'Descargas de recursos y media kit' },
  { id: 'all', label: 'Todos los contactos', description: 'Toda la base de datos activa' },
];

const MAX_MESSAGE_LEN = 4000;

function CountBadge({ count, label }: { count?: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-cream-300 bg-cream-50 px-5 py-3 text-center">
      <span className="text-[22px] font-bold text-ink-900">{count ?? '—'}</span>
      <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-ink-400">{label}</span>
    </div>
  );
}

export default function ManageWhatsApp() {
  const [segment, setSegment] = useState<Segment>('subscribed');
  const [message, setMessage] = useState<string>('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const segmentsQ = useQuery({
    queryKey: ['whatsapp', 'segments'],
    queryFn: whatsappApi.getSegments,
  });

  const contactsQ = useQuery({
    queryKey: ['whatsapp', 'contacts', segment],
    queryFn: () => whatsappApi.getSegmentContacts(segment),
    enabled: Boolean(segment),
  });

  const totalForSegment = useMemo(() => {
    const s = segmentsQ.data;
    if (!s) return undefined;
    if (segment === 'all') return s.all;
    if (segment === 'subscribed') return s.subscribed;
    if (segment === 'customers') return s.customers;
    if (segment === 'leads') return s.leads;
    if (segment === 'newsletter-leads') return s.newsletterLeads;
    if (segment === 'lead-source:guia-blindaje-sat') return s.guiaSat;
    if (segment === 'lead-source:iniciativa-fiscal-2027') return s.iniciativaFiscal2027;
    if (segment === 'guide-leads') return s.guideLeads;
    return undefined;
  }, [segment, segmentsQ.data]);

  const broadcast = useMutation({
    mutationFn: whatsappApi.sendBroadcast,
    onSuccess: (result) => {
      toast.success(
        `Enviados ${result.sent}/${result.total}` +
          (result.failed ? ` · ${result.failed} fallaron` : '') +
          (result.skipped ? ` · ${result.skipped} sin telefono` : ''),
      );
      setConfirmOpen(false);
    },
    onError: (err: Error) => toast.error(err.message || 'No se pudo enviar el broadcast.'),
  });

  const trimmed = message.trim();
  const canSend =
    Boolean(segmentsQ.data?.configured) &&
    trimmed.length > 0 &&
    trimmed.length <= MAX_MESSAGE_LEN &&
    Boolean(totalForSegment && totalForSegment > 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-400">Marketing</p>
        <h1 className="mt-2 font-serif text-3xl leading-tight text-ink-900 sm:text-4xl">
          Broadcast por WhatsApp
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
          Envia un mensaje a todos los contactos con telefono en el segmento elegido. Se manda
          desde el numero oficial de Whapi que ya usa la Consultoria. Personaliza con{' '}
          <code className="rounded bg-cream-200 px-1 py-0.5 text-[12px]">{'{{name}}'}</code> para
          insertar el nombre del contacto.
        </p>
        {segmentsQ.data && !segmentsQ.data.configured && (
          <p className="mt-4 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            WhatsApp aun no esta configurado en el servidor. Falta la variable{' '}
            <code>WHAPI_TOKEN</code> en el .env del backend.
          </p>
        )}
      </header>

      <section className="mb-8 grid gap-3 grid-cols-2 sm:grid-cols-4">
        <CountBadge count={segmentsQ.data?.all} label="Total con tel" />
        <CountBadge count={segmentsQ.data?.subscribed} label="Suscritos" />
        <CountBadge count={segmentsQ.data?.customers} label="Clientes" />
        <CountBadge count={segmentsQ.data?.leads} label="Leads" />
      </section>

      <section className="mb-8">
        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Segmento
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {SEGMENT_OPTIONS.map((opt) => {
            const selected = segment === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSegment(opt.id)}
                className={`cursor-pointer rounded-lg border p-4 text-left transition-colors duration-200 ${
                  selected
                    ? 'border-ink-900 bg-ink-900/[0.05]'
                    : 'border-cream-300 hover:border-ink-900/40'
                }`}
              >
                <p className="text-sm font-semibold text-ink-900">{opt.label}</p>
                <p className="mt-1 text-xs text-ink-500">{opt.description}</p>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-ink-500">
          Destinatarios con telefono en <strong>{SEGMENT_OPTIONS.find((s) => s.id === segment)?.label}</strong>:{' '}
          <strong className="text-ink-900">{totalForSegment ?? '—'}</strong>
        </p>
      </section>

      <section className="mb-8">
        <label htmlFor="wa-msg" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-500">
          Mensaje
        </label>
        <textarea
          id="wa-msg"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          maxLength={MAX_MESSAGE_LEN}
          placeholder={'Hola {{name}}, te comparto...'}
          className="w-full rounded-lg border border-cream-300 bg-white px-4 py-3 text-sm text-ink-900 focus:border-ink-900 focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink-500">
          <span>Formato de texto plano. WhatsApp soporta *negrita*, _cursiva_ y ~tachado~.</span>
          <span>
            {message.length} / {MAX_MESSAGE_LEN}
          </span>
        </div>
      </section>

      <section className="mb-8">
        <details className="rounded-lg border border-cream-300 bg-cream-50 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-ink-900">
            Vista previa de destinatarios ({contactsQ.data?.length ?? 0})
          </summary>
          <div className="mt-3 max-h-64 overflow-y-auto">
            {contactsQ.isLoading ? (
              <p className="text-xs text-ink-500">Cargando…</p>
            ) : contactsQ.data?.length ? (
              <ul className="space-y-1 text-xs text-ink-700">
                {contactsQ.data.slice(0, 50).map((c) => (
                  <li key={`${c.phone}-${c.email ?? ''}`}>
                    {c.name || '(sin nombre)'} · {c.phone}
                    {c.email ? ` · ${c.email}` : ''}
                  </li>
                ))}
                {contactsQ.data.length > 50 && (
                  <li className="italic text-ink-400">…y {contactsQ.data.length - 50} mas</li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-ink-500">Sin destinatarios con telefono en este segmento.</p>
            )}
          </div>
        </details>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!canSend}
          onClick={() => setConfirmOpen(true)}
          className="cursor-pointer rounded-lg bg-ink-900 px-6 py-3 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Enviar broadcast
        </button>
      </div>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="font-serif text-2xl text-ink-900">Confirmar envio</h2>
            <p className="mt-3 text-sm text-ink-700">
              Se enviaran <strong>{totalForSegment}</strong> mensajes por WhatsApp al segmento{' '}
              <strong>{SEGMENT_OPTIONS.find((s) => s.id === segment)?.label}</strong>. Esta accion
              no se puede deshacer.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="cursor-pointer rounded-lg border border-cream-300 px-4 py-2 text-sm text-ink-700 hover:bg-cream-100"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={broadcast.isPending}
                onClick={() => broadcast.mutate({ message: trimmed, segment })}
                className="cursor-pointer rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
              >
                {broadcast.isPending ? 'Enviando…' : 'Confirmar y enviar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
