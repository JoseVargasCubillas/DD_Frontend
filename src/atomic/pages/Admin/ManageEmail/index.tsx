import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as emailApi from '@api/email.api';
import type { BroadcastPayload, ContactPreview } from '@api/email.api';

// ── Tipos ─────────────────────────────────────────────────────
type Segment = 'all' | 'subscribed' | 'customers' | 'leads';

interface SegmentOption {
  id: Segment;
  label: string;
  description: string;
}

const SEGMENT_OPTIONS: SegmentOption[] = [
  { id: 'subscribed', label: 'Suscritos a marketing', description: 'Contactos con opt-in activo' },
  { id: 'customers', label: 'Clientes', description: 'Compraron al menos una vez' },
  { id: 'leads', label: 'Leads', description: 'Registrados sin compra' },
  { id: 'all', label: 'Todos los contactos', description: 'Toda la base de datos activa' },
];

// ── Historial en localStorage (mock — sin backend de logs) ────
interface SentLog {
  id: string;
  subject: string;
  segment: string;
  sent: number;
  sentAt: string;
}

const LOGS_KEY = 'dd-email-logs';
const loadLogs = (): SentLog[] => {
  try {
    return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
  } catch {
    return [];
  }
};
const saveLogs = (logs: SentLog[]) =>
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs.slice(0, 50)));

// ── Componentes menores ───────────────────────────────────────
function CountBadge({ count, label }: { count?: number; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded border border-cream-300 bg-cream-50 px-5 py-3 text-center">
      <span className="text-[22px] font-bold text-ink-900">{count ?? '—'}</span>
      <span className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-ink-400">{label}</span>
    </div>
  );
}

// ── Página ────────────────────────────────────────────────────
export default function ManageEmail() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState<Segment>('all');
  const [showContacts, setShowContacts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [logs, setLogs] = useState<SentLog[]>(loadLogs);
  const [showConfirm, setShowConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: segments } = useQuery({
    queryKey: ['email-segments'],
    queryFn: emailApi.getSegments,
    staleTime: 60 * 1000,
  });

  const { data: contactList = [] } = useQuery<ContactPreview[]>({
    queryKey: ['email-contacts', segment],
    queryFn: () => emailApi.getSegmentContacts(segment),
    staleTime: 30 * 1000,
  });

  const broadcastMutation = useMutation({
    mutationFn: (payload: BroadcastPayload) => emailApi.sendBroadcast(payload),
    onSuccess: (result) => {
      toast.success(`✓ ${result.sent} correos enviados${result.failed > 0 ? ` (${result.failed} fallidos)` : ''}`);
      const newLog: SentLog = {
        id: crypto.randomUUID(),
        subject,
        segment: SEGMENT_OPTIONS.find((s) => s.id === segment)?.label ?? segment,
        sent: result.sent,
        sentAt: new Date().toISOString(),
      };
      const updated = [newLog, ...logs];
      setLogs(updated);
      saveLogs(updated);
      setSubject('');
      setBody('');
      setShowConfirm(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al enviar');
      setShowConfirm(false);
    },
  });

  const selectedSegmentOption = SEGMENT_OPTIONS.find((s) => s.id === segment)!;
  const recipientCount =
    segment === 'all'
      ? segments?.all
      : segment === 'subscribed'
      ? segments?.subscribed
      : segment === 'customers'
      ? segments?.customers
      : segments?.leads;

  const canSend = subject.trim().length > 0 && body.trim().length > 0;

  // ── Helpers de formato en textarea ─────────────────────────
  const insertFormat = (tag: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.substring(start, end);
    const replacement = selected
      ? `<${tag}>${selected}</${tag}>`
      : `<${tag}></${tag}>`;
    const newBody = body.substring(0, start) + replacement + body.substring(end);
    setBody(newBody);
    setTimeout(() => {
      ta.selectionStart = start + `<${tag}>`.length;
      ta.selectionEnd = start + `<${tag}>`.length + selected.length;
      ta.focus();
    }, 0);
  };

  const previewHtml = body
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />');

  return (
    <div className="mx-auto max-w-[1100px] space-y-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <header>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold leading-none text-ink-900">Email Campaigns</h1>
            <p className="mt-2 text-[13px] text-ink-500">Envía broadcasts a segmentos de tu base de contactos.</p>
          </div>
        </div>
      </header>

      {/* ── Estadísticas rápidas ─────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <CountBadge count={segments?.all} label="Total contactos" />
        <CountBadge count={segments?.subscribed} label="Suscritos" />
        <CountBadge count={segments?.customers} label="Clientes" />
        <CountBadge count={segments?.leads} label="Leads" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

        {/* ── Compositor ──────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="rounded border border-cream-300 bg-white">

            {/* Segment selector */}
            <div className="border-b border-cream-300 p-5">
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
                Destinatarios
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SEGMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSegment(opt.id)}
                    className={`flex flex-col items-start gap-1 rounded border p-3 text-left transition-colors ${
                      segment === opt.id
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-cream-300 bg-cream-50 text-ink-700 hover:border-ink-400'
                    }`}
                  >
                    <span className="text-[12px] font-semibold leading-tight">{opt.label}</span>
                    <span className={`text-[10px] leading-tight ${segment === opt.id ? 'text-white/55' : 'text-ink-400'}`}>
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                {recipientCount !== undefined && (
                  <p className="text-[11px] text-ink-500">
                    Este mensaje llegará a{' '}
                    <strong className="text-ink-900">{recipientCount} contactos</strong>.
                  </p>
                )}
                {contactList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowContacts((v) => !v)}
                    className="text-[10px] uppercase tracking-[0.16em] text-ink-400 underline underline-offset-2 hover:text-ink-700"
                  >
                    {showContacts ? 'Ocultar' : 'Ver lista'}
                  </button>
                )}
              </div>
              {showContacts && contactList.length > 0 && (
                <div className="mt-3 max-h-[200px] overflow-y-auto rounded border border-cream-300 bg-cream-50">
                  {contactList.map((c) => (
                    <div key={c.email} className="flex items-center justify-between border-b border-cream-200 px-4 py-2 last:border-b-0">
                      <span className="text-[12px] font-medium text-ink-700">{c.name}</span>
                      <span className="text-[11px] text-ink-400">{c.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Asunto */}
            <div className="border-b border-cream-300 p-5">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
                Asunto
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Escribe el asunto del correo…"
                className="w-full border border-cream-300 bg-cream-50 px-4 py-2.5 text-[14px] placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
              />
            </div>

            {/* Cuerpo */}
            <div className="p-5">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
                  Contenido
                </label>
                {/* Barra de formato simple */}
                <div className="flex gap-1">
                  {[
                    { label: 'B', tag: 'strong', title: 'Negrita' },
                    { label: 'I', tag: 'em', title: 'Cursiva' },
                    { label: 'H2', tag: 'h2', title: 'Título' },
                    { label: 'P', tag: 'p', title: 'Párrafo' },
                  ].map(({ label, tag, title }) => (
                    <button
                      key={tag}
                      title={title}
                      onClick={() => insertFormat(tag)}
                      className="flex h-7 w-8 items-center justify-center border border-cream-300 text-[11px] font-bold text-ink-500 hover:border-ink-400 hover:text-ink-900"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                ref={textareaRef}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={14}
                placeholder="Escribe el cuerpo del correo. Puedes usar HTML básico o Markdown (**negrita**)."
                className="w-full resize-y border border-cream-300 bg-cream-50 px-4 py-3 font-mono text-[13px] leading-relaxed placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
              />
              <p className="mt-2 text-[10px] text-ink-300">
                Soporta HTML. **texto** = negrita.
              </p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPreview((v) => !v)}
              disabled={!body.trim()}
              className="h-[40px] border border-cream-400 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:border-ink-600 hover:text-ink-900 disabled:opacity-40"
            >
              {showPreview ? 'Ocultar' : 'Vista previa'}
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canSend || broadcastMutation.isPending}
              className="h-[40px] bg-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-700 disabled:opacity-40"
            >
              {broadcastMutation.isPending ? 'Enviando…' : `Enviar a ${recipientCount ?? '…'} contactos →`}
            </button>
          </div>

          {/* Preview */}
          {showPreview && body.trim() && (
            <div className="rounded border border-cream-300 bg-white">
              <div className="border-b border-cream-300 px-5 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">Vista previa</p>
                <p className="mt-1 text-[14px] font-semibold text-ink-900">{subject || '(Sin asunto)'}</p>
              </div>
              <div
                className="prose prose-sm max-w-none p-5 text-ink-700"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>
          )}
        </div>

        {/* ── Historial ─────────────────────────────────────── */}
        <aside className="space-y-4">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-400">Historial enviados</h2>

          {logs.length === 0 ? (
            <div className="rounded border border-cream-300 bg-cream-50 px-5 py-10 text-center">
              <p className="text-[13px] text-ink-300">Sin envíos aún.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <div key={log.id} className="rounded border border-cream-300 bg-white p-4">
                  <p className="text-[13px] font-semibold leading-tight text-ink-900 line-clamp-1">{log.subject}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-ink-400">
                    <span>{log.segment}</span>
                    <span className="text-green-600 font-bold">{log.sent} enviados</span>
                  </div>
                  <p className="mt-1.5 text-[9px] text-ink-300">
                    {new Date(log.sentAt).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tips */}
          <div className="rounded border border-amber-200 bg-amber-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Tips de entregabilidad</p>
            <ul className="mt-3 space-y-2 text-[11px] text-amber-700/80">
              <li>→ Evita palabras como "gratis" o "urgente" en el asunto.</li>
              <li>→ Incluye siempre un enlace de cancelación.</li>
              <li>→ Segmenta para aumentar la tasa de apertura.</li>
              <li>→ Prueba con un segmento pequeño antes del envío masivo.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* ── Modal de confirmación ────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-[440px] rounded bg-white p-8 shadow-xl">
            <h3 className="text-[18px] font-bold text-ink-900">¿Confirmar envío?</h3>
            <p className="mt-3 text-[14px] text-ink-600">
              Se enviara <strong className="text-ink-900">{subject}</strong> a{' '}
              <strong className="text-ink-900">{recipientCount ?? '...'} contactos</strong>{' '}
              del segmento <strong className="text-ink-900">{selectedSegmentOption.label}</strong>.
            </p>
            <p className="mt-2 text-[12px] text-ink-400">Esta accion no se puede deshacer.</p>
            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-[40px] border border-cream-400 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 hover:border-ink-600"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  broadcastMutation.mutate({
                    subject,
                    html: previewHtml,
                    segment,
                  })
                }
                disabled={broadcastMutation.isPending}
                className="flex-1 h-[40px] bg-ink-900 text-[11px] font-bold uppercase tracking-[0.18em] text-white hover:bg-ink-700 disabled:opacity-60"
              >
                {broadcastMutation.isPending ? 'Enviando...' : 'Enviar ahora'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
