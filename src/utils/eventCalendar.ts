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
  Partial<Pick<SiteEvent, "modality" | "endDate">>;

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
      "Taller online para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    description:
      "Taller online para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    location: "Online",
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
      "Último taller online del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
    description:
      "Último taller online del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
    location: "Online",
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

export const mergeCalendarEventSources = (
  ...sources: Array<CalendarEventSummary[]>
) => {
  const bySlug = new Map<string, CalendarEventSummary>();
  sources.flat().forEach((event) => {
    if (DEPRECATED_EVENT_SLUGS.has(event.slug)) return;
    bySlug.set(event.slug, event);
  });
  return Array.from(bySlug.values());
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

export const getCalendarEventPath = (
  event?: Pick<CalendarEventSummary, "slug" | "title" | "onlineUrl"> | null,
) => {
  if (!event) return "/eventos";
  const title = event.title.trim().toLowerCase();
  if (
    event.slug.includes("taller-estrategia-fiscal") ||
    title.includes("taller de estrategia fiscal")
  ) {
    return "/eventos/estrategia-fiscal";
  }
  if (event.slug.startsWith("holding") || title === "holding") return "/eventos/holding";
  if (event.onlineUrl?.startsWith("/")) return event.onlineUrl;
  return `/eventos/${event.slug}`;
};
