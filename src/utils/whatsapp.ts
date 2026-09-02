export const WHATSAPP_PHONE = "5214421143667";
export const WHATSAPP_DEFAULT_MESSAGE =
  "Hola Diego estoy navegando tu sitio web y tengo una duda";

/**
 * Construye un enlace a WhatsApp Web/App usando el número y mensaje
 * corporativos por defecto. Se puede sobreescribir el mensaje para
 * flujos concretos (ventas, lista de espera, prensa, etc.) manteniendo
 * el mismo número.
 */
export const waLink = (message: string = WHATSAPP_DEFAULT_MESSAGE): string =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

// ─── Click tracking ──────────────────────────────────────────────────────────

const ANON_ID_KEY = 'dd-anon-id';

const getAnonId = (): string => {
  if (typeof window === 'undefined') return '';
  try {
    let id = window.localStorage.getItem(ANON_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      window.localStorage.setItem(ANON_ID_KEY, id);
    }
    return id;
  } catch {
    return '';
  }
};

const getApiBase = (): string => {
  const env = (import.meta as unknown as { env?: Record<string, string> }).env;
  return env?.VITE_API_URL ?? 'http://localhost:5000/api/v1';
};

/**
 * Envía un ping al backend para registrar el click.
 * Usa `navigator.sendBeacon` cuando está disponible (sobrevive a la navegación
 * hacia WhatsApp Web / app móvil). Silencioso ante errores: nunca bloquea la UX.
 */
export const trackWaClick = (
  source: string,
  extra?: { message?: string; page?: string; meta?: Record<string, unknown> },
): void => {
  if (typeof window === 'undefined') return;
  const payload = {
    source,
    message: extra?.message,
    page: extra?.page ?? window.location.pathname,
    referrer: document.referrer || undefined,
    anonId: getAnonId(),
    meta: extra?.meta,
  };
  const url = `${getApiBase()}/analytics/wa-click`;
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      const ok = navigator.sendBeacon(url, blob);
      if (ok) return;
    }
    // Fallback keepalive fetch (no bloquea la navegación).
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => undefined);
  } catch {
    // silenciar: nunca romper el flujo del usuario
  }
};

/**
 * Devuelve un handler `onClick` para adjuntar a cualquier `<a href={waLink(...)}>`
 * que necesite trazabilidad.
 */
export const waClickHandler =
  (source: string, message?: string) =>
  (): void => {
    trackWaClick(source, { message });
  };
