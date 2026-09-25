import type { Event as SiteEvent } from "@t/index";

export const EVENT_STORAGE_KEY = "dd-admin-events";

export type CalendarEventSummary = Pick<
  SiteEvent,
  | "title"
  | "slug"
  | "shortDescription"
  | "description"
  | "location"
  | "onlineUrl"
  | "startDate"
  | "capacity"
  | "registeredCount"
  | "status"
> &
  Partial<Pick<SiteEvent, "modality" | "endDate" | "thumbnail" | "type" | "id" | "_id" | "whatsappOnly">>;

export const FALLBACK_CALENDAR_EVENTS: CalendarEventSummary[] = [
  {
    title: "De persona física a moral",
    slug: "de-persona-fisica-a-moral",
    shortDescription:
      "Entrenamiento para decidir cuándo conviene migrar de persona física a persona moral y evitar errores fiscales desde la estructura.",
    description:
      "Entrenamiento para decidir cuándo conviene migrar de persona física a persona moral y evitar errores fiscales desde la estructura.",
    location: "Zoom",
    onlineUrl: "/eventos/de-persona-fisica-a-moral",
    startDate: "2026-08-28T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Mentalidad empresarial",
    slug: "mentalidad-empresarial",
    shortDescription:
      "Sesión presencial para empresarios que quieren ordenar sus decisiones, números y dirección con una mentalidad más estratégica.",
    description:
      "Sesión presencial para empresarios que quieren ordenar sus decisiones, números y dirección con una mentalidad más estratégica.",
    location: "CDMX",
    onlineUrl: "/eventos/mentalidad-empresarial",
    startDate: "2026-09-03T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Cumbre: sistema de prospección digital",
    slug: "cumbre-sistema-prospeccion-digital",
    shortDescription:
      "Cumbre de dos días para diseñar un sistema de atracción y conversión de prospectos de alto valor.",
    description:
      "Cumbre de dos días para diseñar un sistema de atracción y conversión de prospectos de alto valor.",
    location: "CDMX",
    onlineUrl: "/eventos/cumbre-sistema-prospeccion-digital",
    startDate: "2026-09-04T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-online-septiembre",
    shortDescription:
      "Taller online por Zoom para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    description:
      "Taller online por Zoom para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    location: "Zoom",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-09-11T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Mastermind Panamá",
    slug: "mastermind-panama",
    shortDescription:
      "Encuentro intensivo en Panamá para empresarios que buscan estrategia, estructura y visión internacional.",
    description:
      "Encuentro intensivo en Panamá para empresarios que buscan estrategia, estructura y visión internacional.",
    location: "Panamá",
    onlineUrl: "/eventos/mastermind-panama",
    startDate: "2026-09-15T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Holding",
    slug: "holding-septiembre",
    shortDescription:
      "Sesión online sobre estructura holding, patrimonio y orden empresarial para proteger decisiones de largo plazo.",
    description:
      "Sesión online sobre estructura holding, patrimonio y orden empresarial para proteger decisiones de largo plazo.",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-09-22T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-cdmx-septiembre",
    shortDescription:
      "Taller presencial en CDMX para ajustar tu estrategia fiscal con claridad antes del cierre del año.",
    description:
      "Taller presencial en CDMX para ajustar tu estrategia fiscal con claridad antes del cierre del año.",
    location: "CDMX",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-09-25T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-online-octubre",
    shortDescription:
      "Taller online por Zoom para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    description:
      "Taller online por Zoom para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    location: "Zoom",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-10-16T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-cdmx-octubre",
    shortDescription:
      "Edición CDMX del taller de estrategia fiscal para empresarios que quieren cerrar el año con estructura.",
    description:
      "Edición CDMX del taller de estrategia fiscal para empresarios que quieren cerrar el año con estructura.",
    location: "CDMX",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-10-22T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Coaching para el liderazgo",
    slug: "coaching-para-el-liderazgo",
    shortDescription:
      "Dos días para fortalecer dirección, criterio y liderazgo empresarial con herramientas de ejecución.",
    description:
      "Dos días para fortalecer dirección, criterio y liderazgo empresarial con herramientas de ejecución.",
    location: "CDMX",
    onlineUrl: "/eventos/coaching-para-el-liderazgo",
    startDate: "2026-10-23T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Holding",
    slug: "holding-octubre",
    shortDescription:
      "Entrenamiento online para entender cuándo una holding sí suma y cuándo sólo complica la estructura.",
    description:
      "Entrenamiento online para entender cuándo una holding sí suma y cuándo sólo complica la estructura.",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-10-27T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-monterrey",
    shortDescription:
      "Edición Monterrey del taller para empresarios que quieren claridad fiscal y decisiones accionables.",
    description:
      "Edición Monterrey del taller para empresarios que quieren claridad fiscal y decisiones accionables.",
    location: "Monterrey",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-11-06T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "El emprendedor vs. el CEO",
    slug: "emprendedor-vs-ceo-noviembre",
    shortDescription:
      "Clase gratuita por Zoom sobre la mentalidad y el tablero del CEO para dueños de empresa que quieren dirigir en lugar de operar.",
    description:
      "Clase gratuita por Zoom sobre la mentalidad y el tablero del CEO para dueños de empresa que quieren dirigir en lugar de operar.",
    location: "Zoom",
    onlineUrl: "/eventos/emprendedor-vs-ceo",
    startDate: "2026-11-10T19:00:00-06:00",
    capacity: 500,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "4E Código Rockefeller",
    slug: "4e-codigo-rockefeller",
    shortDescription:
      "Entrenamiento de tres días para ordenar estrategia, ejecución y crecimiento con método.",
    description:
      "Entrenamiento de tres días para ordenar estrategia, ejecución y crecimiento con método.",
    location: "CDMX",
    onlineUrl: "/eventos/4e-codigo-rockefeller",
    startDate: "2026-11-20T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Holding",
    slug: "holding-noviembre",
    shortDescription:
      "Nueva sesión online para revisar holding, partes relacionadas y decisiones patrimoniales.",
    description:
      "Nueva sesión online para revisar holding, partes relacionadas y decisiones patrimoniales.",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-11-24T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
  {
    title: "Maestría escénica",
    slug: "maestria-escenica",
    shortDescription:
      "Tres días para fortalecer comunicación, presencia y estructura de mensaje frente a audiencias empresariales.",
    description:
      "Tres días para fortalecer comunicación, presencia y estructura de mensaje frente a audiencias empresariales.",
    location: "CDMX",
    onlineUrl: "/eventos/maestria-escenica",
    startDate: "2026-12-04T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "in-person",
  },
  {
    title: "Taller de estrategia fiscal",
    slug: "taller-estrategia-fiscal-online-diciembre",
    shortDescription:
      "Último taller online por Zoom del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
    description:
      "Último taller online por Zoom del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
    location: "Zoom",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-12-10T09:07:00-06:00",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    modality: "online",
  },
];

const DEPRECATED_EVENT_SLUGS = new Set([
  "formacion-equipos",
  "revision-estrategica",
  "estrategia-fiscal",
  "equipos-creativos",
  "blindaje-patrimonial",
  "estrategia-rockefeller",
]);

export const loadStoredCalendarEvents = (): CalendarEventSummary[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as CalendarEventSummary[]) : [];
    return events.filter((event) => !DEPRECATED_EVENT_SLUGS.has(event.slug));
  } catch {
    return [];
  }
};

export const getCalendarEventTime = (event: Pick<CalendarEventSummary, "startDate">) => {
  const time = new Date(event.startDate).getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
};

export const isUpcomingCalendarEvent = (
  event: Pick<CalendarEventSummary, "startDate" | "status">,
  now = Date.now(),
) => {
  if (event.status === "canceled" || event.status === "finished") return false;
  const time = new Date(event.startDate).getTime();
  return !Number.isNaN(time) && time >= now;
};

const normalizeTitle = (value: string) =>
  (value || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

// Misma edición = mismo título y mismo día (CDMX), aunque el slug difiera:
// un evento creado en el admin a partir de uno del calendario no debe duplicarlo.
export const calendarEventKey = (title: string, startDate: string | Date) => {
  const date = new Date(startDate);
  const day = Number.isNaN(date.getTime())
    ? String(startDate)
    : new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City" }).format(date);
  return `${day}|${normalizeTitle(title)}`;
};

// Las fuentes van de menor a mayor prioridad (fallback, API, admin local): ante
// el mismo slug, o la misma edición (título + día), gana la última.
export const mergeCalendarEventSources = (
  ...sources: Array<CalendarEventSummary[]>
) => {
  const bySlug = new Map<string, CalendarEventSummary>();
  sources.flat().forEach((event) => {
    if (DEPRECATED_EVENT_SLUGS.has(event.slug)) return;
    bySlug.set(event.slug, event);
  });
  const byEdition = new Map<string, CalendarEventSummary>();
  Array.from(bySlug.values()).forEach((event) => {
    byEdition.set(calendarEventKey(event.title, event.startDate), event);
  });
  return Array.from(byEdition.values());
};

export const getNextUpcomingCalendarEvent = (
  events: CalendarEventSummary[],
  now = Date.now(),
) =>
  events
    .filter((event) => isUpcomingCalendarEvent(event, now))
    .sort((first, second) => getCalendarEventTime(first) - getCalendarEventTime(second))[0];

export const isEstrategiaFiscalEvent = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl">,
) => {
  const slug = (event.slug || "").toLowerCase();
  const title = (event.title || "").toLowerCase();
  const onlineUrl = (event.onlineUrl || "").toLowerCase();
  return (
    slug.includes("estrategia-fiscal") ||
    title.includes("estrategia fiscal") ||
    onlineUrl.includes("/estrategia-fiscal")
  );
};

export const getNextEstrategiaFiscalEvent = (
  events: CalendarEventSummary[],
  now = Date.now(),
) => getNextUpcomingCalendarEvent(events.filter(isEstrategiaFiscalEvent), now);

export const VENUE_TO_BE_CONFIRMED = "Sede por confirmar";

// Sólo se conoce la sede de la próxima edición presencial de Estrategia
// Fiscal; las presenciales posteriores todavía no tienen sede definida, así
// que no se debe mostrar la ciudad que traigan por defecto.
export const hasConfirmedVenue = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl" | "modality" | "startDate" | "status">,
  events: CalendarEventSummary[],
  now = Date.now(),
) => {
  if (event.modality === "online" || !isEstrategiaFiscalEvent(event)) return true;
  const nextInPerson = getNextUpcomingCalendarEvent(
    events.filter((item) => isEstrategiaFiscalEvent(item) && item.modality !== "online"),
    now,
  );
  return nextInPerson?.slug === event.slug;
};

export const ONLINE_PLATFORM_LABEL = "Zoom";

// Los eventos online se transmiten por Zoom: si la sede viene vacía o
// genérica ("Online"), se muestra la plataforma.
export const getCalendarEventLocation = (
  event: CalendarEventSummary,
  events: CalendarEventSummary[],
  now = Date.now(),
) => {
  if (event.modality === "online") {
    const location = (event.location || "").trim();
    return !location || /^online$/i.test(location) ? ONLINE_PLATFORM_LABEL : location;
  }
  return hasConfirmedVenue(event, events, now) ? event.location : VENUE_TO_BE_CONFIRMED;
};

// "Viernes 16 de octubre de 2026"; con fecha de fin en otro día, un rango:
// "4 al 5 de septiembre de 2026".
export const formatEventDateLabel = (value: string | Date, endValue?: string | Date | null) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tz = "America/Mexico_City";
  const part = (d: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat("es-MX", { ...options, timeZone: tz }).format(d);

  const end = endValue ? new Date(endValue) : null;
  if (end && !Number.isNaN(end.getTime())) {
    const dayKey = (d: Date) => part(d, { day: "numeric", month: "numeric", year: "numeric" });
    if (dayKey(end) !== dayKey(date)) {
      const sameMonth =
        part(date, { month: "numeric", year: "numeric" }) === part(end, { month: "numeric", year: "numeric" });
      return sameMonth
        ? `${part(date, { day: "numeric" })} al ${part(end, { day: "numeric" })} de ${part(end, { month: "long" })} de ${part(end, { year: "numeric" })}`
        : `${part(date, { day: "numeric", month: "long" })} al ${part(end, { day: "numeric", month: "long" })} de ${part(end, { year: "numeric" })}`;
    }
  }

  const label = part(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).replace(",", "");
  return label.charAt(0).toUpperCase() + label.slice(1);
};

const mexicoCityPart = (date: Date, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("es-MX", { ...options, timeZone: "America/Mexico_City" }).format(date);

// "09:00" (24 h, hora de CDMX).
export const formatEventTimeLabel = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return mexicoCityPart(date, { hour: "2-digit", minute: "2-digit", hour12: false });
};

// "23 de octubre de 2026 · 09:00"
export const formatEventDateTimeLabel = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${mexicoCityPart(date, { day: "numeric", month: "long", year: "numeric" })} · ${formatEventTimeLabel(date)}`;
};

// "23 oct"
export const formatEventShortDate = (value: string | Date) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return mexicoCityPart(date, { day: "numeric", month: "short" }).replace(".", "");
};

// "Online · Zoom" / "Presencial · CDMX" / "Híbrido · CDMX".
export const formatEventFormatLabel = (
  modality: CalendarEventSummary["modality"],
  location: string,
) => {
  if (modality === "online") return `Online · ${ONLINE_PLATFORM_LABEL}`;
  const label = modality === "hybrid" ? "Híbrido" : "Presencial";
  return location ? `${label} · ${location}` : label;
};

export const isEmprendedorVsCeoEvent = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl">,
) => {
  const slug = (event.slug || "").toLowerCase();
  const title = (event.title || "").toLowerCase();
  const onlineUrl = (event.onlineUrl || "").toLowerCase();
  return (
    slug.includes("emprendedor-vs-ceo") ||
    slug.includes("tablero-del-ceo") ||
    title.includes("emprendedor vs") ||
    title.includes("tablero del ceo") ||
    onlineUrl.includes("/emprendedor-vs-ceo") ||
    onlineUrl.includes("/tablero-del-ceo")
  );
};

export const getNextEmprendedorVsCeoEvent = (
  events: CalendarEventSummary[],
  now = Date.now(),
) => getNextUpcomingCalendarEvent(events.filter(isEmprendedorVsCeoEvent), now);

export const isRockefellerEvent = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl">,
) => {
  const slug = (event.slug || "").toLowerCase();
  const title = (event.title || "").toLowerCase();
  const onlineUrl = (event.onlineUrl || "").toLowerCase();
  return (
    slug.includes("rockefeller") ||
    slug.includes("4e-codigo") ||
    title.includes("rockefeller") ||
    title.includes("código rockefeller") ||
    title.includes("codigo rockefeller") ||
    onlineUrl.includes("/rockefeller") ||
    onlineUrl.includes("/4e-codigo-rockefeller")
  );
};

export const isHoldingEvent = (event: Pick<CalendarEventSummary, "slug" | "title">) =>
  (event.slug || "").toLowerCase().startsWith("holding") ||
  (event.title || "").trim().toLowerCase() === "holding";

export const isProspeccionDigitalEvent = (event: Pick<CalendarEventSummary, "slug" | "title">) =>
  (event.slug || "").toLowerCase().includes("prospeccion") ||
  (event.title || "").toLowerCase().includes("prospección digital");

export const getNextRockefellerEvent = (
  events: CalendarEventSummary[],
  now = Date.now(),
) => getNextUpcomingCalendarEvent(events.filter(isRockefellerEvent), now);

// Clasifica un evento del calendario en una etiqueta de formato ("Seminario",
// "Cumbre", etc.) a partir de su slug/título — la misma taxonomía que ya se
// usa a mano en la página de Eventos, centralizada aquí para reutilizarla
// donde haga falta mostrar el calendario de forma automática (p. ej. Home).
const EVENT_TYPE_LABELS: Record<string, string> = {
  seminar: "Seminario",
  workshop: "Workshop",
  webinar: "Webinar",
  conference: "Cumbre",
};

export const getCalendarEventType = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "type">,
): string => {
  // Eventos reales (API/admin) ya traen su tipo real capturado — se usa tal
  // cual en vez de adivinar por palabras clave.
  if (event.type && EVENT_TYPE_LABELS[event.type]) {
    return EVENT_TYPE_LABELS[event.type];
  }

  const key = `${event.slug || ""} ${event.title || ""}`.toLowerCase();

  if (key.includes("taller-estrategia-fiscal") || key.includes("taller de estrategia fiscal")) return "Workshop";
  if (key.includes("mastermind")) return "Mastermind";
  if (key.includes("prospeccion") || key.includes("prospección") || key.includes("cumbre")) return "Cumbre";
  if (key.includes("rockefeller") || key.includes("4e")) return "Entrenamiento";
  if (key.includes("coaching") || key.includes("liderazgo")) return "Seminario";
  if (key.includes("maestria") || key.includes("maestría") || key.includes("escenica") || key.includes("escénica")) return "Seminario";
  if (key.includes("mentalidad")) return "Seminario";
  if (key.includes("holding") || key.includes("persona-fisica") || key.includes("persona física")) return "Webinar";
  if (key.includes("como-cobrar") || key.includes("como cobrar")) return "Seminario";
  if (key.includes("emprendedor-vs-ceo") || key.includes("tablero-del-ceo") || key.includes("emprendedor vs")) return "Webinar";
  return "Evento";
};

export const getCalendarEventStatus = (
  event: Pick<CalendarEventSummary, "capacity" | "registeredCount">,
): "available" | "limited" | "sold-out" => {
  const capacity = Math.max(Number(event.capacity || 0), 0);
  const registered = Math.max(Number(event.registeredCount || 0), 0);
  if (capacity <= 0) return "available";
  const remaining = capacity - registered;
  if (remaining <= 0) return "sold-out";
  if (remaining <= Math.max(Math.round(capacity * 0.15), 5)) return "limited";
  return "available";
};

// Número de WhatsApp para eventos que aún no tienen landing propia.
const EVENT_WHATSAPP_PHONE = "5214421143667";

// Eventos que se atienden por WhatsApp en vez de tener landing: se decide en
// el admin con la casilla "Atender solo por WhatsApp" (event.whatsappOnly).
export const isWhatsAppOnlyEvent = (event: { whatsappOnly?: boolean }) =>
  event.whatsappOnly === true;

// Sólo Estrategia Fiscal / Holding / Como Cobrar tienen landing diseñada a
// mano. Cualquier otro evento sólo tiene landing real si existe de verdad en
// el backend (viene de la API o lo creó el admin, por eso trae id/_id) — de
// lo contrario mandar a `/eventos/:slug` mostraría una página rota.
export const hasDedicatedCalendarLanding = (
  event: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl" | "id" | "_id" | "whatsappOnly">,
) => {
  if (isWhatsAppOnlyEvent(event)) return false;
  if (isEstrategiaFiscalEvent(event)) return true;
  if (isEmprendedorVsCeoEvent(event)) return true;
  if (isRockefellerEvent(event)) return true;
  const slug = (event.slug || "").toLowerCase();
  const title = event.title.trim().toLowerCase();
  if (slug.startsWith("holding") || title === "holding") return true;
  if (
    slug.includes("como-cobrar") ||
    title.includes("como cobrar") ||
    title.includes("cobrar como ceo")
  ) {
    return true;
  }
  return Boolean(event.id || event._id);
};

export const getEventWhatsAppLink = (event: Pick<CalendarEventSummary, "title">) => {
  const message = `Hola, vengo de la página web y estoy interesado en el evento ${event.title}.`;
  return `https://wa.me/${EVENT_WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
};

// Resuelve a dónde debe apuntar el botón de un evento del calendario: su
// landing real si existe, o WhatsApp con el nombre del evento si no.
export const getCalendarEventAction = (
  event?: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl" | "id" | "_id" | "whatsappOnly"> | null,
): { type: "internal" | "whatsapp"; href: string } => {
  if (!event) return { type: "internal", href: "/eventos" };
  if (hasDedicatedCalendarLanding(event)) {
    return { type: "internal", href: getCalendarEventPath(event) };
  }
  return { type: "whatsapp", href: getEventWhatsAppLink(event) };
};

export const getCalendarEventPath = (
  event?: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl"> | null,
) => {
  if (!event) return "/eventos";
  const title = event.title.trim().toLowerCase();
  if (isEstrategiaFiscalEvent(event)) {
    // ?evento fija qué edición (online / presencial) abre la landing; sin él
    // la landing muestra la próxima por fecha.
    return event.slug
      ? `/eventos/estrategia-fiscal?evento=${encodeURIComponent(event.slug)}`
      : "/eventos/estrategia-fiscal";
  }
  if (
    event.slug.includes("emprendedor-vs-ceo") ||
    event.slug.includes("tablero-del-ceo") ||
    title.includes("emprendedor vs") ||
    title.includes("tablero del ceo")
  ) {
    return "/eventos/emprendedor-vs-ceo";
  }
  if (
    event.slug.includes("como-cobrar") ||
    title.includes("como cobrar") ||
    title.includes("cobrar como ceo")
  ) {
    return "/eventos/como-cobrar-como-ceo";
  }
  if (
    event.slug.includes("rockefeller") ||
    event.slug.includes("4e-codigo") ||
    title.includes("rockefeller") ||
    title.includes("código rockefeller") ||
    title.includes("codigo rockefeller")
  ) {
    return "/eventos/rockefeller";
  }
  if (event.slug.startsWith("holding") || title === "holding") {
    return event.slug
      ? `/eventos/holding?evento=${encodeURIComponent(event.slug)}`
      : "/eventos/holding";
  }
  if (event.onlineUrl?.startsWith("/")) return event.onlineUrl;
  return `/eventos/${event.slug}`;
};
