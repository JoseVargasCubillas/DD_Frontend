import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as emailApi from '@api/email.api';
import { buildPreviewDocument } from '@utils/emailPreview';
import type { BroadcastPayload, BroadcastResult, ContactPreview } from '@api/email.api';

// ── Tipos ─────────────────────────────────────────────────────
type Segment =
  | 'all'
  | 'subscribed'
  | 'customers'
  | 'leads'
  | 'newsletter-leads'
  | 'guide-leads'
  | 'lead-source:guia-blindaje-sat'
  | 'lead-source:iniciativa-fiscal-2027'
  | 'custom';

interface SegmentOption {
  id: Segment;
  label: string;
  description: string;
}

const SEGMENT_OPTIONS: SegmentOption[] = [
  { id: 'subscribed', label: 'Suscritos Academia', description: 'Cuentas de la plataforma con opt-in activo (no es lo mismo que Mailing)' },
  { id: 'customers', label: 'Clientes', description: 'Compraron al menos una vez' },
  { id: 'leads', label: 'Leads (usuarios)', description: 'Cuentas sin compra' },
  { id: 'newsletter-leads', label: 'Suscriptores Mailing', description: 'Correos del footer, blog y formularios de mailing (no es lo mismo que Academia)' },
  { id: 'lead-source:guia-blindaje-sat', label: 'Leads · Guía SAT', description: 'Descargaron la guía desde el Home' },
  { id: 'lead-source:iniciativa-fiscal-2027', label: 'Leads · Iniciativa Fiscal 2027', description: 'Descargaron el documento de Iniciativa Fiscal 2027' },
  { id: 'guide-leads', label: 'Leads editoriales', description: 'Descargas de recursos y media kit' },
  { id: 'all', label: 'Todos los contactos', description: 'Toda la base de datos activa' },
  { id: 'custom', label: 'Destinatarios personalizados', description: 'Pega los correos a los que quieres enviar' },
];

const pct = (rate: number) => `${(rate * 100).toFixed(1)}%`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_CUSTOM = 500;
// Debe coincidir con la frase y el umbral que valida el servidor.
const MASS_PHRASE = 'ENVIAR A TODOS';
const MASS_THRESHOLD = 1000;
const MAX_TEST = 5;

// "a@x.com, b@y.com\nc@z.com" -> correos únicos en minúsculas, separando los inválidos.
const parseEmails = (text: string): { valid: string[]; invalid: string[] } => {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const raw of text.split(/[\s,;]+/)) {
    const email = raw.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    (EMAIL_RE.test(email) ? valid : invalid).push(email);
  }
  return { valid, invalid };
};

// Una plantilla HTML pegada ya trae su propia estructura: no hay que convertir
// cada salto de línea en <br>, que rompería tablas, estilos y espaciados.
const looksLikeHtmlDocument = (html: string) =>
  /<(!doctype|html|head|body|style|table|div|section|center)\b/i.test(html);

// **negrita** -> <strong>, sin tocar las etiquetas de Mailchimp (*|FNAME|*),
// cuyos asteriscos pegados (|**|) se confundirían con Markdown.
const applyMarkdownBold = (text: string): string => {
  const tags: string[] = [];
  const protectedText = text.replace(/\*\|[^*\n]*?\|\*/g, (tag) => {
    tags.push(tag);
    return `${tags.length - 1}`;
  });
  return protectedText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/(\d+)/g, (_m, i) => tags[Number(i)]);
};


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
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [segment, setSegment] = useState<Segment>('all');

  useEffect(() => {
    const urlSegment = searchParams.get('segment');
    if (!urlSegment) return;
    const known = SEGMENT_OPTIONS.some((opt) => opt.id === urlSegment);
    if (known) {
      setSegment(urlSegment as Segment);
      searchParams.delete('segment');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  // "Duplicar campaña" desde el historial: llega por el estado de la navegación.
  useEffect(() => {
    const duplicate = (location.state as {
      duplicate?: { subject: string; html: string; segment: string };
    } | null)?.duplicate;
    if (!duplicate) return;

    setSubject(duplicate.subject);
    setBody(duplicate.html);
    if (SEGMENT_OPTIONS.some((opt) => opt.id === duplicate.segment && opt.id !== 'custom')) {
      setSegment(duplicate.segment as Segment);
    }
    // `id` evita el aviso doble que genera React StrictMode en desarrollo.
    toast.success('Campaña cargada. Revisa el contenido y el segmento antes de enviar.', {
      id: 'campaign-duplicated',
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const [showContacts, setShowContacts] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [customText, setCustomText] = useState('');
  const [testToText, setTestToText] = useState('');
  // Destino del envío: tu base de datos web, o una audiencia que ya vive en Mailchimp.
  const [source, setSource] = useState<'web' | 'mailchimp'>('web');
  const [audienceId, setAudienceId] = useState('');
  const [audienceSegmentId, setAudienceSegmentId] = useState<number | null>(null);
  const [confirmPhrase, setConfirmPhrase] = useState('');
  // Visor de los contactos de la audiencia de Mailchimp elegida.
  const [showAudienceMembers, setShowAudienceMembers] = useState(false);
  const [memberPage, setMemberPage] = useState(1);
  const [memberSearchInput, setMemberSearchInput] = useState('');
  const [memberSearch, setMemberSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();

  const { data: logs = [] } = useQuery({
    queryKey: ['email-campaigns'],
    queryFn: emailApi.getCampaigns,
    staleTime: 60 * 1000,
    // Mientras haya un envío en proceso, se consulta su avance.
    refetchInterval: (query) => (query.state.data?.some((c) => c.status === 'sending') ? 4000 : false),
  });

  const {
    data: audiences = [],
    isError: audiencesFailed,
    isLoading: audiencesLoading,
  } = useQuery({
    queryKey: ['email-audiences'],
    queryFn: emailApi.getAudiences,
    enabled: source === 'mailchimp',
    staleTime: 60 * 1000,
  });

  const {
    data: membersPage,
    isFetching: membersLoading,
    isError: membersFailed,
  } = useQuery({
    queryKey: ['email-audience-members', audienceId, audienceSegmentId, memberPage, memberSearch],
    queryFn: () =>
      emailApi.getAudienceMembers(audienceId, {
        segmentId: audienceSegmentId,
        page: memberPage,
        limit: 50,
        q: memberSearch,
      }),
    enabled: source === 'mailchimp' && Boolean(audienceId) && showAudienceMembers,
    placeholderData: (previous) => previous,
    staleTime: 60 * 1000,
  });

  const { data: audienceSegments = [], isLoading: audienceSegmentsLoading } = useQuery({
    queryKey: ['email-audience-segments', audienceId],
    queryFn: () => emailApi.getAudienceSegments(audienceId),
    enabled: source === 'mailchimp' && Boolean(audienceId),
    staleTime: 60 * 1000,
  });

  const { data: segments } = useQuery({
    queryKey: ['email-segments'],
    queryFn: emailApi.getSegments,
    staleTime: 60 * 1000,
  });

  const { data: contactList = [] } = useQuery<ContactPreview[]>({
    queryKey: ['email-contacts', segment],
    queryFn: () => emailApi.getSegmentContacts(segment),
    staleTime: 30 * 1000,
    enabled: source === 'web' && segment !== 'custom',
  });

  const broadcastMutation = useMutation({
    mutationFn: (payload: BroadcastPayload) => emailApi.sendBroadcast(payload),
    onSuccess: (result) => {
      toast.success(
        result.status === 'sending'
          ? `Campaña en proceso: se enviará a ${result.total} contactos. Sigue el estado en el historial.`
          : `✓ Campaña enviada a ${result.sent} contactos`,
      );
      queryClient.invalidateQueries({ queryKey: ['email-campaigns'] });
      setSubject('');
      setBody('');
      setConfirmPhrase('');
      setShowConfirm(false);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Error al enviar');
      setConfirmPhrase('');
      setShowConfirm(false);
    },
  });

  const [dryRunResult, setDryRunResult] = useState<BroadcastResult | null>(null);

  const testMutation = useMutation({
    mutationFn: (payload: emailApi.TestPayload) => emailApi.sendTest(payload),
    onSuccess: (result) => toast.success(`Prueba enviada a ${result.sentTo.join(', ')}`),
    onError: (err: Error) => toast.error(err.message || 'No se pudo enviar la prueba'),
  });

  const dryRunMutation = useMutation({
    mutationFn: (payload: BroadcastPayload) => emailApi.sendBroadcast({ ...payload, dryRun: true }),
    onSuccess: (result) => setDryRunResult(result),
    onError: (err: Error) => {
      setDryRunResult(null);
      toast.error(err.message || 'No se pudo validar la campaña');
    },
  });

  const selectedSegmentOption = SEGMENT_OPTIONS.find((s) => s.id === segment)!;
  const customParsed = parseEmails(customText);
  const testParsed = parseEmails(testToText);
  const webRecipientCount =
    segment === 'custom'
      ? customParsed.valid.length
      : segment === 'all'
      ? segments?.all
      : segment === 'subscribed'
      ? segments?.subscribed
      : segment === 'customers'
      ? segments?.customers
      : segment === 'leads'
      ? segments?.leads
      : segment === 'newsletter-leads'
      ? segments?.newsletterLeads
      : segment === 'guide-leads'
      ? segments?.guideLeads
      : segment === 'lead-source:guia-blindaje-sat'
      ? segments?.guiaSat
      : segment === 'lead-source:iniciativa-fiscal-2027'
      ? segments?.iniciativaFiscal2027
      : contactList.length;

  const selectedAudience = audiences.find((a) => a.id === audienceId);
  const selectedAudienceSegment = audienceSegments.find((s) => s.id === audienceSegmentId);
  const mailchimpCount =
    audienceSegmentId !== null ? selectedAudienceSegment?.memberCount : selectedAudience?.memberCount;
  const recipientCount = source === 'mailchimp' ? mailchimpCount : webRecipientCount;

  const destinationLabel =
    source === 'mailchimp'
      ? `${selectedAudience?.name ?? 'Audiencia de Mailchimp'} · ${selectedAudienceSegment?.name ?? 'Toda la audiencia'}`
      : selectedSegmentOption.label;

  // Envíos masivos: el servidor también exige la frase, esto solo la pide en pantalla.
  const needsPhrase =
    source === 'mailchimp'
      ? audienceSegmentId === null || (mailchimpCount ?? 0) > MASS_THRESHOLD
      : segment === 'all';
  const phraseOk = !needsPhrase || confirmPhrase.trim() === MASS_PHRASE;

  const customOk =
    source !== 'web' ||
    segment !== 'custom' ||
    (customParsed.valid.length > 0 &&
      customParsed.valid.length <= MAX_CUSTOM &&
      customParsed.invalid.length === 0);
  const destinationOk = source === 'web' || (Boolean(audienceId) && (mailchimpCount ?? 0) > 0);
  const testOk = testParsed.invalid.length === 0 && testParsed.valid.length <= MAX_TEST;
  const canSend = subject.trim().length > 0 && body.trim().length > 0 && customOk && destinationOk;

  // Carga a la caja de personalizados los correos de un segmento existente.
  const loadFromSegment = async (id: string) => {
    if (!id) return;
    try {
      const contacts = await emailApi.getSegmentContacts(id);
      const merged = parseEmails(`${customText}\n${contacts.map((c) => c.email).join('\n')}`).valid;
      setCustomText(merged.join('\n'));
      toast.success(`${contacts.length} contactos cargados`);
    } catch (err) {
      toast.error((err as Error).message || 'No se pudo cargar el segmento');
    }
  };

  const basePayload = (): BroadcastPayload =>
    source === 'mailchimp'
      ? {
          subject,
          html: previewHtml,
          segment: 'mailchimp',
          segmentLabel: destinationLabel,
          source: 'mailchimp',
          audienceId,
          audienceSegmentId,
        }
      : {
          subject,
          html: previewHtml,
          segment,
          segmentLabel: selectedSegmentOption.label,
          source: 'web',
          ...(segment === 'custom' ? { emails: customParsed.valid } : {}),
        };

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

  const boldApplied = applyMarkdownBold(body);
  const previewHtml = looksLikeHtmlDocument(body) ? boldApplied : boldApplied.replace(/\n/g, '<br />');
  const previewDocument = buildPreviewDocument(previewHtml);

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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <CountBadge count={segments?.all} label="Total contactos" />
        <CountBadge count={segments?.subscribed} label="Suscritos Academia" />
        <CountBadge count={segments?.customers} label="Clientes" />
        <CountBadge count={segments?.leads} label="Leads usuarios" />
        <CountBadge count={segments?.newsletterLeads} label="Suscriptores Mailing" />
        <CountBadge count={segments?.guiaSat} label="Leads Guía SAT" />
        <CountBadge count={segments?.iniciativaFiscal2027} label="Leads Iniciativa 2027" />
        <CountBadge count={segments?.guideLeads} label="Leads editoriales" />
      </div>
      <p className="-mt-4 text-[11px] text-ink-400">
        Nota: "Suscritos Academia" (cuentas de la plataforma) y "Suscriptores Mailing" (newsletter) son audiencias distintas — no se suman.
      </p>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">

        {/* ── Compositor ──────────────────────────────────────── */}
        <div className="space-y-5">
          <div className="rounded border border-cream-300 bg-white">

            {/* Segment selector */}
            <div className="border-b border-cream-300 p-5">
              <label className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-ink-400">
                Destinatarios
              </label>

              {/* Origen: tu base de datos web o una audiencia que ya vive en Mailchimp */}
              <div className="mb-3 flex gap-1">
                {([
                  { id: 'web', label: 'Contactos de la web' },
                  { id: 'mailchimp', label: 'Audiencia de Mailchimp' },
                ] as const).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSource(opt.id)}
                    className={`h-8 border px-4 text-[10px] font-bold uppercase tracking-[0.16em] ${
                      source === opt.id
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-cream-300 text-ink-500 hover:border-ink-400'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {source === 'mailchimp' && (
                <div className="space-y-3">
                  {audiencesFailed && (
                    <p className="text-[12px] text-red-600">No se pudieron cargar las audiencias de Mailchimp.</p>
                  )}
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-ink-400">Audiencia</label>
                      <select
                        value={audienceId}
                        onChange={(e) => {
                          setAudienceId(e.target.value);
                          setAudienceSegmentId(null);
                          setMemberPage(1);
                          setMemberSearch('');
                          setMemberSearchInput('');
                        }}
                        className="h-[40px] w-full border border-cream-300 bg-cream-50 px-2 text-[13px] text-ink-700"
                      >
                        <option value="">{audiencesLoading ? 'Cargando…' : 'Elige una audiencia…'}</option>
                        {audiences.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name} — {a.memberCount.toLocaleString('es-MX')} suscritos{a.isWebAudience ? ' (web)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-[10px] uppercase tracking-[0.16em] text-ink-400">
                        Segmento o etiqueta
                      </label>
                      <select
                        value={audienceSegmentId ?? ''}
                        onChange={(e) => {
                          setAudienceSegmentId(e.target.value ? Number(e.target.value) : null);
                          setMemberPage(1);
                          setMemberSearch('');
                          setMemberSearchInput('');
                        }}
                        disabled={!audienceId || audienceSegmentsLoading}
                        className="h-[40px] w-full border border-cream-300 bg-cream-50 px-2 text-[13px] text-ink-700 disabled:opacity-50"
                      >
                        <option value="">
                          Toda la audiencia
                          {selectedAudience ? ` (${selectedAudience.memberCount.toLocaleString('es-MX')})` : ''}
                        </option>
                        {audienceSegments.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.type === 'static' ? 'Etiqueta' : 'Segmento'}: {s.name} ({s.memberCount.toLocaleString('es-MX')})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {audienceId && audienceSegmentId === null && (
                    <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                      Elegiste <strong>toda la audiencia</strong>. Para enviar tendrás que escribir "{MASS_PHRASE}".
                    </p>
                  )}
                  {(mailchimpCount ?? 0) > 5000 && (
                    <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                      Es una lista grande. Si no la has usado en meses, envía primero a un segmento pequeño para
                      cuidar la reputación de tu dominio.
                    </p>
                  )}
                </div>
              )}

              {source === 'web' && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
              )}
              <div className="mt-3 flex items-center gap-3">
                {recipientCount !== undefined && (
                  <p className="text-[11px] text-ink-500">
                    Este mensaje llegará a{' '}
                    <strong className="text-ink-900">{recipientCount.toLocaleString('es-MX')} contactos</strong>.
                  </p>
                )}
                {source === 'mailchimp' && audienceId && (
                  <button
                    type="button"
                    onClick={() => setShowAudienceMembers((v) => !v)}
                    className="text-[10px] uppercase tracking-[0.16em] text-ink-400 underline underline-offset-2 hover:text-ink-700"
                  >
                    {showAudienceMembers ? 'Ocultar' : 'Ver lista'}
                  </button>
                )}
                {source === 'web' && contactList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowContacts((v) => !v)}
                    className="text-[10px] uppercase tracking-[0.16em] text-ink-400 underline underline-offset-2 hover:text-ink-700"
                  >
                    {showContacts ? 'Ocultar' : 'Ver lista'}
                  </button>
                )}
              </div>
              {source === 'web' && segment === 'custom' && (
                <div className="mt-3 space-y-2">
                  <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    rows={5}
                    placeholder={'correo1@ejemplo.com\ncorreo2@ejemplo.com\n(uno por línea, o separados por coma)'}
                    className="w-full resize-y border border-cream-300 bg-cream-50 px-4 py-3 font-mono text-[12px] leading-relaxed placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="text-ink-500">
                      <strong className="text-ink-900">{customParsed.valid.length}</strong> correos válidos
                      {customParsed.valid.length > MAX_CUSTOM && (
                        <span className="ml-2 font-bold text-red-600">Máximo {MAX_CUSTOM} por envío</span>
                      )}
                      {customParsed.invalid.length > 0 && (
                        <span className="ml-2 font-bold text-red-600">
                          Inválidos: {customParsed.invalid.slice(0, 3).join(', ')}
                          {customParsed.invalid.length > 3 ? '…' : ''}
                        </span>
                      )}
                    </span>
                    <select
                      value=""
                      onChange={(e) => void loadFromSegment(e.target.value)}
                      className="border border-cream-300 bg-white px-2 py-1 text-[11px] text-ink-600"
                    >
                      <option value="">Cargar correos de un segmento…</option>
                      {SEGMENT_OPTIONS.filter((o) => o.id !== 'custom').map((o) => (
                        <option key={o.id} value={o.id}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <p className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                    Los correos que no estén en tu base se subirán a Mailchimp. Úsalo solo con personas que ya
                    aceptaron recibir tus correos. Quienes se dieron de baja se excluyen automáticamente.
                  </p>
                </div>
              )}
              {source === 'mailchimp' && audienceId && showAudienceMembers && (
                <div className="mt-3 rounded border border-cream-300 bg-cream-50">
                  {audienceSegmentId === null && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setMemberPage(1);
                        setMemberSearch(memberSearchInput.trim());
                      }}
                      className="flex gap-2 border-b border-cream-300 p-3"
                    >
                      <input
                        type="text"
                        value={memberSearchInput}
                        onChange={(e) => setMemberSearchInput(e.target.value)}
                        placeholder="Buscar un correo en la audiencia…"
                        className="h-[34px] flex-1 border border-cream-300 bg-white px-3 text-[12px] placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="h-[34px] border border-cream-400 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-600 hover:border-ink-600"
                      >
                        Buscar
                      </button>
                      {memberSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            setMemberSearch('');
                            setMemberSearchInput('');
                            setMemberPage(1);
                          }}
                          className="h-[34px] px-2 text-[10px] uppercase tracking-[0.16em] text-ink-400 underline"
                        >
                          Limpiar
                        </button>
                      )}
                    </form>
                  )}

                  <div className={`max-h-[260px] overflow-y-auto ${membersLoading ? 'opacity-60' : ''}`}>
                    {membersFailed && (
                      <p className="px-4 py-6 text-center text-[12px] text-red-600">
                        No se pudo cargar la lista de Mailchimp.
                      </p>
                    )}
                    {!membersFailed && membersPage && membersPage.members.length === 0 && (
                      <p className="px-4 py-6 text-center text-[12px] text-ink-400">
                        {memberSearch ? 'Ningún contacto coincide con la búsqueda.' : 'No hay contactos para mostrar.'}
                      </p>
                    )}
                    {!membersFailed && !membersPage && (
                      <p className="px-4 py-6 text-center text-[12px] text-ink-400">Cargando…</p>
                    )}
                    {membersPage?.members.map((m) => (
                      <div
                        key={m.email}
                        className="flex items-center justify-between gap-3 border-b border-cream-200 px-4 py-2 last:border-b-0"
                      >
                        <span className="truncate text-[12px] font-medium text-ink-700">{m.name || '—'}</span>
                        <span className="flex items-center gap-2 text-[11px] text-ink-400">
                          {m.status !== 'subscribed' && (
                            <span className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] uppercase text-red-600">
                              {m.status}
                            </span>
                          )}
                          {m.email}
                        </span>
                      </div>
                    ))}
                  </div>

                  {membersPage && !memberSearch && (
                    <div className="flex items-center justify-between border-t border-cream-300 px-4 py-2 text-[11px] text-ink-500">
                      <span>
                        {membersPage.total.toLocaleString('es-MX')} contactos · página {membersPage.page} de{' '}
                        {membersPage.pages.toLocaleString('es-MX')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setMemberPage((p) => Math.max(1, p - 1))}
                          disabled={membersPage.page <= 1}
                          className="h-[28px] border border-cream-400 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-600 hover:border-ink-600 disabled:opacity-40"
                        >
                          ← Anterior
                        </button>
                        <button
                          type="button"
                          onClick={() => setMemberPage((p) => Math.min(membersPage.pages, p + 1))}
                          disabled={membersPage.page >= membersPage.pages}
                          className="h-[28px] border border-cream-400 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-600 hover:border-ink-600 disabled:opacity-40"
                        >
                          Siguiente →
                        </button>
                      </div>
                    </div>
                  )}
                  {memberSearch && (
                    <p className="border-t border-cream-300 px-4 py-2 text-[10px] text-ink-400">
                      Resultados de la búsqueda (máx. 10).
                    </p>
                  )}
                </div>
              )}
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

          {/* Destinatarios del correo de prueba */}
          <div>
            <input
              type="text"
              value={testToText}
              onChange={(e) => setTestToText(e.target.value)}
              placeholder="Enviar prueba a (opcional, máx. 5 correos separados por coma). Vacío = tu correo"
              className="w-full border border-cream-300 bg-cream-50 px-4 py-2 text-[12px] placeholder:text-ink-300 focus:border-ink-400 focus:outline-none"
            />
            {!testOk && (
              <p className="mt-1 text-[11px] font-bold text-red-600">
                {testParsed.invalid.length > 0
                  ? `Correo inválido: ${testParsed.invalid[0]}`
                  : `Máximo ${MAX_TEST} correos de prueba`}
              </p>
            )}
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
              onClick={() =>
                testMutation.mutate({
                  subject,
                  html: previewHtml,
                  ...(testParsed.valid.length ? { to: testParsed.valid } : {}),
                })
              }
              disabled={!subject.trim() || !body.trim() || !testOk || testMutation.isPending}
              title="Te envía el correo solo a ti, sin tocar a ningún contacto"
              className="h-[40px] border border-cream-400 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:border-ink-600 hover:text-ink-900 disabled:opacity-40"
            >
              {testMutation.isPending ? 'Enviando…' : 'Enviar prueba'}
            </button>
            <button
              onClick={() => {
                setDryRunResult(null);
                dryRunMutation.mutate(basePayload());
              }}
              disabled={!canSend || dryRunMutation.isPending}
              title="Valida la campaña con Mailchimp sin enviar nada"
              className="h-[40px] border border-cream-400 px-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 transition-colors hover:border-ink-600 hover:text-ink-900 disabled:opacity-40"
            >
              {dryRunMutation.isPending ? 'Validando…' : 'Validar'}
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={!canSend || broadcastMutation.isPending}
              className="h-[40px] bg-ink-900 px-6 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ink-700 disabled:opacity-40"
            >
              {broadcastMutation.isPending ? 'Enviando…' : `Enviar a ${recipientCount ?? '…'} contactos →`}
            </button>
          </div>

          {/* Resultado de la validación (dry run) */}
          {dryRunResult && (
            <div
              className={`rounded border p-4 text-[12px] ${
                dryRunResult.ready ? 'border-green-300 bg-green-50 text-green-800' : 'border-red-300 bg-red-50 text-red-800'
              }`}
            >
              <p className="font-bold">
                {dryRunResult.ready ? '✓ Lista para enviar' : '✕ Mailchimp no permitiría enviar aún'} — llegaría a{' '}
                {dryRunResult.recipientCount ?? 0} de {dryRunResult.total} contactos
                {dryRunResult.failed > 0 ? ` (${dryRunResult.failed} rechazados por Mailchimp)` : ''}
                {dryRunResult.excluded ? ` (${dryRunResult.excluded} excluidos por baja)` : ''}. No se envió nada.
              </p>
              <ul className="mt-2 space-y-1">
                {(dryRunResult.checklist ?? [])
                  .filter((item) => item.type !== 'success')
                  .map((item) => (
                    <li key={`${item.heading}-${item.details}`}>
                      → <strong>{item.heading}:</strong> {item.details}
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Preview */}
          {showPreview && body.trim() && (
            <div className="rounded border border-cream-300 bg-white">
              <div className="border-b border-cream-300 px-5 py-3">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-400">Vista previa</p>
                <p className="mt-1 text-[14px] font-semibold text-ink-900">{subject || '(Sin asunto)'}</p>
              </div>
              <div className="flex items-center justify-between border-b border-cream-300 bg-cream-50 px-5 py-2">
                <p className="text-[10px] text-ink-400">
                  Las etiquetas de Mailchimp (*|FNAME|*…) se muestran con datos de ejemplo.
                </p>
                <div className="flex gap-1">
                  {(['desktop', 'mobile'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPreviewMode(mode)}
                      className={`h-7 border px-3 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        previewMode === mode
                          ? 'border-ink-900 bg-ink-900 text-white'
                          : 'border-cream-300 text-ink-500 hover:border-ink-400'
                      }`}
                    >
                      {mode === 'desktop' ? 'Escritorio' : 'Móvil'}
                    </button>
                  ))}
                </div>
              </div>
              {/* iframe aislado y sin scripts: el correo se renderiza como en un cliente real */}
              <div className="flex justify-center bg-cream-100 p-4">
                <iframe
                  title="Vista previa del correo"
                  sandbox=""
                  srcDoc={previewDocument}
                  style={{ width: previewMode === 'mobile' ? 375 : '100%', maxWidth: '100%' }}
                  className="h-[640px] border border-cream-300 bg-white transition-[width]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Historial ─────────────────────────────────────── */}
        <aside className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-400">Historial enviados</h2>
            <Link
              to="/admin/email/historial"
              className="text-[10px] uppercase tracking-[0.16em] text-ink-400 underline underline-offset-2 hover:text-ink-700"
            >
              Ver todo
            </Link>
          </div>

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
                    {log.status === 'sending' ? (
                      <span className="font-bold text-amber-600">Enviando…</span>
                    ) : log.status === 'failed' ? (
                      <span className="font-bold text-red-600">Fallida</span>
                    ) : (
                      <span className="text-green-600 font-bold">{log.recipientCount} enviados</span>
                    )}
                  </div>
                  {log.status === 'failed' && log.error && (
                    <p className="mt-1.5 text-[10px] leading-snug text-red-600">{log.error}</p>
                  )}
                  {log.report && (
                    <p className="mt-1.5 text-[10px] text-ink-500">
                      {pct(log.report.openRate)} aperturas · {log.report.clicks} clics · {log.report.unsubscribed} bajas
                    </p>
                  )}
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
              Se enviará <strong className="text-ink-900">{subject}</strong> a{' '}
              <strong className="text-ink-900">{recipientCount ?? '...'} contactos</strong>{' '}
              de <strong className="text-ink-900">{destinationLabel}</strong>.
            </p>
            <p className="mt-2 text-[12px] text-ink-400">Esta acción no se puede deshacer.</p>

            {needsPhrase && (
              <div className="mt-5 rounded border border-red-200 bg-red-50 p-4">
                <p className="text-[12px] font-bold text-red-700">Envío masivo</p>
                <p className="mt-1 text-[12px] text-red-700">
                  Va a llegar a una audiencia completa o muy grande. Para continuar escribe{' '}
                  <strong>{MASS_PHRASE}</strong>.
                </p>
                <input
                  type="text"
                  value={confirmPhrase}
                  onChange={(e) => setConfirmPhrase(e.target.value)}
                  placeholder={MASS_PHRASE}
                  autoComplete="off"
                  className="mt-3 h-[38px] w-full border border-red-300 bg-white px-3 text-[13px] uppercase tracking-[0.1em] placeholder:text-red-300 focus:border-red-500 focus:outline-none"
                />
              </div>
            )}

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => {
                  setConfirmPhrase('');
                  setShowConfirm(false);
                }}
                className="flex-1 h-[40px] border border-cream-400 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-600 hover:border-ink-600"
              >
                Cancelar
              </button>
              <button
                onClick={() =>
                  broadcastMutation.mutate({
                    ...basePayload(),
                    ...(needsPhrase ? { confirmation: confirmPhrase.trim() } : {}),
                  })
                }
                disabled={broadcastMutation.isPending || !phraseOk}
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
