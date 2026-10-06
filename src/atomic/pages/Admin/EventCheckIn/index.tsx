import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Html5Qrcode } from 'html5-qrcode';
import { useCheckInTicket } from '@hooks/useTickets';
import { formatTimeCdmx } from '@utils/formatters';
import type { TicketCheckInResult } from '@t/index';

const SCANNER_ELEMENT_ID = 'dd-qr-reader';
const SCAN_COOLDOWN_MS = 2500;
const FOLIO_REGEX = /^DD-[A-Z0-9]{2,8}-[A-Z0-9]{4,10}$/i;

interface ScanEntry {
  id: number;
  at: Date;
  folio: string;
  result: TicketCheckInResult['result'] | 'error';
  name?: string;
  eventTitle?: string;
  checkedInAt?: string | null;
  eventId?: string;
  message?: string;
}

// Extrae { folio, t } de una URL /boleto/:folio?t=SIG o de un folio plano.
function parseScan(raw: string): { folio: string; t?: string } | null {
  const text = raw.trim();
  if (!text) return null;

  try {
    const url = new URL(text);
    const match = url.pathname.match(/\/boleto\/([^/]+)/i);
    if (match) {
      return { folio: decodeURIComponent(match[1]).toUpperCase(), t: url.searchParams.get('t') ?? undefined };
    }
  } catch {
    // no es URL
  }

  if (FOLIO_REGEX.test(text)) return { folio: text.toUpperCase() };
  return null;
}

const RESULT_STYLE: Record<ScanEntry['result'], { title: string; bg: string; text: string; icon: string }> = {
  ok: { title: 'Asistencia registrada', bg: 'bg-emerald-600', text: 'text-white', icon: '✅' },
  alreadyUsed: { title: 'Ya se registró', bg: 'bg-amber-500', text: 'text-ink-900', icon: '⚠️' },
  invalid: { title: 'Boleto no válido', bg: 'bg-red-600', text: 'text-white', icon: '⛔' },
  void: { title: 'Boleto anulado', bg: 'bg-red-700', text: 'text-white', icon: '🚫' },
  error: { title: 'Error al verificar', bg: 'bg-ink-700', text: 'text-white', icon: '❗' },
};

const RESULT_BADGE: Record<ScanEntry['result'], string> = {
  ok: 'bg-emerald-100 text-emerald-800',
  alreadyUsed: 'bg-amber-100 text-amber-800',
  invalid: 'bg-red-100 text-red-800',
  void: 'bg-red-100 text-red-800',
  error: 'bg-ink-50 text-ink-700',
};

export default function EventCheckIn() {
  const checkIn = useCheckInTicket();
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualFolio, setManualFolio] = useState('');
  const [current, setCurrent] = useState<ScanEntry | null>(null);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [okCount, setOkCount] = useState(0);

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanRef = useRef<{ text: string; at: number }>({ text: '', at: 0 });
  const busyRef = useRef(false);
  const entryIdRef = useRef(0);

  const cameraSupported = useMemo(
    () => typeof navigator !== 'undefined' && Boolean(navigator.mediaDevices?.getUserMedia) && (window.isSecureContext ?? true),
    [],
  );

  const pushEntry = useCallback((entry: Omit<ScanEntry, 'id' | 'at'>) => {
    entryIdRef.current += 1;
    const full: ScanEntry = { ...entry, id: entryIdRef.current, at: new Date() };
    setCurrent(full);
    setHistory((prev) => [full, ...prev].slice(0, 10));
    if (entry.result === 'ok') setOkCount((n) => n + 1);
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(entry.result === 'ok' ? 100 : [60, 40, 60]);
    }
  }, []);

  const processCode = useCallback(
    async (rawText: string) => {
      const now = Date.now();
      if (busyRef.current) return;
      if (lastScanRef.current.text === rawText && now - lastScanRef.current.at < SCAN_COOLDOWN_MS) return;
      lastScanRef.current = { text: rawText, at: now };

      const parsed = parseScan(rawText);
      if (!parsed) {
        pushEntry({ folio: rawText.slice(0, 40), result: 'invalid', message: 'El código no corresponde a un boleto.' });
        return;
      }

      busyRef.current = true;
      try {
        const data = await checkIn.mutateAsync(parsed);
        pushEntry({
          folio: data.ticket?.folio ?? parsed.folio,
          result: data.result,
          name: data.ticket?.attendeeName,
          eventTitle: data.ticket?.eventTitle,
          checkedInAt: data.ticket?.checkedInAt,
          eventId: data.ticket?.eventId,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'No se pudo verificar el boleto';
        toast.error(message);
        pushEntry({ folio: parsed.folio, result: 'error', message });
      } finally {
        busyRef.current = false;
      }
    },
    [checkIn, pushEntry],
  );

  const processRef = useRef(processCode);
  useEffect(() => {
    processRef.current = processCode;
  }, [processCode]);

  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;
    scannerRef.current = null;
    if (scanner) {
      try {
        if (scanner.isScanning) await scanner.stop();
        scanner.clear();
      } catch {
        // ignorar errores al detener
      }
    }
    setCameraOn(false);
  }, []);

  const startCamera = useCallback(async () => {
    if (!cameraSupported) {
      setCameraError('La cámara requiere HTTPS o localhost y un navegador compatible.');
      return;
    }
    setCameraError(null);
    try {
      const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID, { verbose: false });
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
        (decodedText) => {
          void processRef.current(decodedText);
        },
        () => {
          // frames sin QR: ignorar
        },
      );
      setCameraOn(true);
    } catch (err) {
      scannerRef.current = null;
      const message = err instanceof Error ? err.message : String(err);
      setCameraError(
        /permission|denied|NotAllowed/i.test(message)
          ? 'Permiso de cámara denegado. Habilítalo en el navegador e inténtalo de nuevo.'
          : `No se pudo iniciar la cámara: ${message}`,
      );
      setCameraOn(false);
    }
  }, [cameraSupported]);

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, [stopCamera]);

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    const value = manualFolio.trim();
    if (!value) return;
    lastScanRef.current = { text: '', at: 0 };
    void processCode(value);
    setManualFolio('');
  };

  const style = current ? RESULT_STYLE[current.result] : null;

  return (
    <div className="min-h-[calc(100vh-96px)] bg-cream text-ink-900">
      <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">Eventos / Check-in</p>
          <h1 className="mt-2 font-serif text-4xl leading-none sm:text-5xl">Escáner de boletos</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            Apunta la cámara al código QR del boleto. Cada lectura registra la asistencia y muestra el resultado al
            instante.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-ink-900/10 bg-white px-5 py-3 text-center shadow-sm">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Registrados</p>
            <p className="mt-1 font-serif text-3xl leading-none">{okCount}</p>
          </div>
          <Link
            to="/admin/eventos"
            className="min-h-11 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-semibold hover:bg-cream-200"
          >
            Eventos
          </Link>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Cámara</h2>
            <button
              type="button"
              onClick={() => (cameraOn ? void stopCamera() : void startCamera())}
              className={`min-h-11 rounded-full px-5 text-sm font-semibold ${
                cameraOn ? 'border border-red-200 bg-red-50 text-red-700' : 'bg-ink-900 text-cream'
              }`}
            >
              {cameraOn ? 'Detener cámara' : 'Iniciar cámara'}
            </button>
          </div>

          {!cameraSupported && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Tu navegador no permite acceder a la cámara aquí. El escáner requiere HTTPS (o localhost). Puedes usar el
              ingreso manual del folio.
            </p>
          )}
          {cameraError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{cameraError}</p>
          )}

          <div
            id={SCANNER_ELEMENT_ID}
            className={`w-full overflow-hidden rounded-2xl bg-ink-900 ${cameraOn ? 'mt-4 min-h-[280px]' : 'h-0'}`}
          />
          {!cameraOn && (
            <div className="mt-4 flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-900/15 bg-cream-100 text-center">
              <p className="text-sm text-ink-500">La cámara está apagada.</p>
              <p className="mt-1 text-xs text-ink-400">Pulsa «Iniciar cámara» para escanear.</p>
            </div>
          )}

          <form onSubmit={submitManual} className="mt-6">
            <label htmlFor="manual-folio" className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-ink-500">
              Ingreso manual
            </label>
            <div className="flex gap-2">
              <input
                id="manual-folio"
                value={manualFolio}
                onChange={(e) => setManualFolio(e.target.value.toUpperCase())}
                placeholder="DD-COAC-7K3M9Q"
                autoComplete="off"
                className="min-h-11 flex-1 rounded-xl border border-ink-900/15 bg-cream-50 px-4 font-mono text-sm uppercase tracking-wider focus:border-ink-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={checkIn.isPending || !manualFolio.trim()}
                className="min-h-11 rounded-xl bg-ink-900 px-5 text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checkIn.isPending ? 'Verificando…' : 'Registrar'}
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-6">
          <div
            aria-live="polite"
            className={`rounded-2xl p-6 shadow-sm transition-colors ${style ? `${style.bg} ${style.text}` : 'border border-ink-900/10 bg-white'}`}
          >
            {current && style ? (
              <>
                <p className="text-[10px] uppercase tracking-[0.3em] opacity-80">Último escaneo</p>
                <p className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
                  {style.icon} {style.title}
                </p>
                {current.name && <p className="mt-4 text-xl font-semibold">{current.name}</p>}
                <p className="mt-1 font-mono text-sm tracking-wider opacity-90">{current.folio}</p>
                {current.eventTitle && <p className="mt-1 text-sm opacity-90">{current.eventTitle}</p>}
                {current.result === 'alreadyUsed' && current.checkedInAt && (
                  <p className="mt-3 text-sm font-semibold">Registrado a las {formatTimeCdmx(current.checkedInAt)} (CDMX)</p>
                )}
                {current.message && <p className="mt-3 text-sm opacity-90">{current.message}</p>}
                {current.eventId && (
                  <Link
                    to={`/admin/eventos/${current.eventId}/asistentes`}
                    className="mt-5 inline-flex min-h-10 items-center rounded-full bg-white/20 px-4 text-sm font-semibold backdrop-blur hover:bg-white/30"
                  >
                    Ver asistentes →
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">Último escaneo</p>
                <p className="mt-2 text-sm text-ink-500">Aún no se ha leído ningún boleto.</p>
              </>
            )}
          </div>

          <div className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Últimas lecturas</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-ink-500">Las lecturas de esta sesión aparecerán aquí.</p>
            ) : (
              <ul className="mt-3 divide-y divide-ink-900/5">
                {history.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-3 py-3">
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${RESULT_BADGE[entry.result]}`}>
                      {RESULT_STYLE[entry.result].title}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{entry.name ?? entry.folio}</p>
                      {entry.name && <p className="truncate font-mono text-xs text-ink-500">{entry.folio}</p>}
                    </div>
                    <span className="shrink-0 text-xs text-ink-400">{formatTimeCdmx(entry.at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
