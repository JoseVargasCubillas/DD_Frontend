import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as eventsApi from "@api/events.api";
import { useCreateEvent, useEvents, useUpdateEvent } from "@hooks/useEvents";
import type { Event } from "@t/index";
import eventPersonaFisicaMoral from "../../../../../assets/eventos/evento-persona-fisica-moral.png";
import eventMentalidadEmpresarial from "../../../../../assets/eventos/evento-mentalidad-empresarial.png";
import eventSistemaProspeccion from "../../../../../assets/eventos/evento-sistema-prospeccion-digital.png";
import eventTallerFiscal from "../../../../../assets/eventos/evento-taller-estrategia-fiscal.png";
import eventMastermindPanama from "../../../../../assets/eventos/evento-mastermind-panama.png";
import eventHolding from "../../../../../assets/eventos/evento-holding.png";
import eventFiscalCdmx from "../../../../../assets/eventos/evento-estrategia-fiscal-cdmx.png";
import eventCoaching from "../../../../../assets/eventos/evento-coaching-liderazgo.png";
import eventFiscalMonterrey from "../../../../../assets/eventos/evento-estrategia-fiscal-monterrey.png";
import eventRockefeller from "../../../../../assets/eventos/evento-rockefeller.png";
import eventRockefellerAlt from "../../../../../assets/eventos/evento-rockefeller-alt.png";
import eventMaestriaEscenica from "../../../../../assets/eventos/evento-maestria-escenica.png";
import eventBeneficiosRegimen from "../../../../../assets/eventos/evento-beneficios-regimen-fiscal.png";
import eventRevisionEstrategica from "../../../../../assets/eventos/evento-revision-estrategica-cdmx.png";

type EventForm = {
  id?: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  type: Event["type"];
  modality: Event["modality"];
  location: string;
  onlineUrl: string;
  startDate: string;
  endDate: string;
  price: string;
  currency: string;
  paymentType: Event["paymentType"];
  stripePriceId: string;
  capacity: string;
  status: Event["status"];
  isFeatured: boolean;
  buttonText: string;
  buttonUrl: string;
  titleColor: string;
  buttonBackground: string;
  buttonTextColor: string;
};

type EventCtaSettings = {
  salesPhone: string;
  waitlistPhone: string;
};

const EVENT_CTA_SETTINGS_KEY = "dd-event-cta-settings";
const EVENT_STORAGE_KEY = "dd-admin-events";
const FEATURED_EVENT_SLUG_KEY = "dd-featured-event-slug";
const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== "false";

const DEFAULT_CTA_SETTINGS: EventCtaSettings = {
  salesPhone: "5210000000000",
  waitlistPhone: "5210000000000",
};
const DEPRECATED_EVENT_SLUGS = new Set([
  "formacion-equipos",
  "revision-estrategica",
  "estrategia-fiscal",
  "equipos-creativos",
  "blindaje-patrimonial",
  "estrategia-rockefeller",
]);

const DEFAULT_FORM: EventForm = {
  title: "Nuevo evento",
  slug: "nuevo-evento",
  shortDescription: "Describe brevemente este evento.",
  description: "Agrega aquí la descripción completa del evento.",
  thumbnail: "",
  type: "seminar",
  modality: "in-person",
  location: "CDMX",
  onlineUrl: "",
  startDate: "2026-09-26T09:07",
  endDate: "2026-09-26T17:00",
  price: "0",
  currency: "MXN",
  paymentType: "one_time",
  stripePriceId: "",
  capacity: "80",
  status: "upcoming",
  isFeatured: false,
  buttonText: "¡Estoy listo!",
  buttonUrl: "/eventos",
  titleColor: "#2C2C2C",
  buttonBackground: "#8B1538",
  buttonTextColor: "#FFFFFF",
};

const EVENT_IMAGE_OPTIONS = [
  { label: "Persona física a moral", src: eventPersonaFisicaMoral },
  { label: "Mentalidad empresarial", src: eventMentalidadEmpresarial },
  { label: "Prospección digital", src: eventSistemaProspeccion },
  { label: "Taller estrategia fiscal", src: eventTallerFiscal },
  { label: "Mastermind Panamá", src: eventMastermindPanama },
  { label: "Holding", src: eventHolding },
  { label: "Estrategia fiscal CDMX", src: eventFiscalCdmx },
  { label: "Coaching liderazgo", src: eventCoaching },
  { label: "Estrategia fiscal Monterrey", src: eventFiscalMonterrey },
  { label: "Código Rockefeller", src: eventRockefeller },
  { label: "Código Rockefeller alternativa", src: eventRockefellerAlt },
  { label: "Maestría escénica", src: eventMaestriaEscenica },
  { label: "Beneficios régimen fiscal", src: eventBeneficiosRegimen },
  { label: "Revisión estratégica CDMX", src: eventRevisionEstrategica },
];

const SEEDED_CALENDAR_EVENTS = [
  {
    id: "seed-de-persona-fisica-a-moral",
    title: "De Persona Física a Moral",
    slug: "de-persona-fisica-a-moral",
    shortDescription:
      "Entrenamiento para decidir cuándo conviene migrar de persona física a persona moral.",
    description:
      "Entrenamiento para decidir cuándo conviene migrar de persona física a persona moral y evitar errores fiscales desde la estructura.",
    thumbnail: eventPersonaFisicaMoral,
    type: "webinar",
    modality: "online",
    location: "Zoom",
    onlineUrl: "/eventos/de-persona-fisica-a-moral",
    startDate: "2026-08-28T09:07:00-06:00",
    endDate: "2026-08-28T11:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: true,
    agenda: [],
  },
  {
    id: "seed-mentalidad-empresarial",
    title: "Mentalidad Empresarial",
    slug: "mentalidad-empresarial",
    shortDescription:
      "Sesión presencial para empresarios que quieren ordenar sus decisiones, números y dirección.",
    description:
      "Sesión presencial para empresarios que quieren ordenar sus decisiones, números y dirección con una mentalidad más estratégica.",
    thumbnail: eventMentalidadEmpresarial,
    type: "seminar",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/mentalidad-empresarial",
    startDate: "2026-09-03T09:07:00-06:00",
    endDate: "2026-09-03T17:00:00-06:00",
    price: 0,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-cumbre-sistema-prospeccion-digital",
    title: "Cumbre: Sistema de Prospección Digital",
    slug: "cumbre-sistema-prospeccion-digital",
    shortDescription:
      "Cumbre de dos días para diseñar un sistema de atracción y conversión de prospectos.",
    description:
      "Cumbre de dos días para diseñar un sistema de atracción y conversión de prospectos de alto valor.",
    thumbnail: eventSistemaProspeccion,
    type: "conference",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/cumbre-sistema-prospeccion-digital",
    startDate: "2026-09-04T09:07:00-06:00",
    endDate: "2026-09-05T17:00:00-06:00",
    price: 0,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-taller-estrategia-fiscal-online-septiembre",
    title: "Taller de Estrategia Fiscal",
    slug: "taller-estrategia-fiscal-online-septiembre",
    shortDescription:
      "Taller online para revisar estructura fiscal, riesgos y decisiones urgentes.",
    description:
      "Taller online para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
    thumbnail: eventTallerFiscal,
    type: "workshop",
    modality: "online",
    location: "Online",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-09-11T09:07:00-06:00",
    endDate: "2026-09-11T13:00:00-06:00",
    price: 0,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-mastermind-panama",
    title: "Mastermind Panamá",
    slug: "mastermind-panama",
    shortDescription:
      "Encuentro intensivo en Panamá para empresarios con visión internacional.",
    description:
      "Encuentro intensivo en Panamá para empresarios que buscan estrategia, estructura y visión internacional.",
    thumbnail: eventMastermindPanama,
    type: "conference",
    modality: "in-person",
    location: "Panamá",
    onlineUrl: "/eventos/mastermind-panama",
    startDate: "2026-09-15T09:07:00-06:00",
    endDate: "2026-09-18T17:00:00-06:00",
    price: 0,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-holding-septiembre",
    title: "Holding",
    slug: "holding-septiembre",
    shortDescription:
      "Sesión online sobre estructura holding, patrimonio y orden empresarial.",
    description:
      "Sesión online sobre estructura holding, patrimonio y orden empresarial para proteger decisiones de largo plazo.",
    thumbnail: eventHolding,
    type: "webinar",
    modality: "online",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-09-22T09:07:00-06:00",
    endDate: "2026-09-22T11:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-taller-estrategia-fiscal-cdmx-septiembre",
    title: "Taller de Estrategia Fiscal",
    slug: "taller-estrategia-fiscal-cdmx-septiembre",
    shortDescription:
      "Taller presencial en CDMX para ajustar tu estrategia fiscal antes del cierre.",
    description:
      "Taller presencial en CDMX para ajustar tu estrategia fiscal con claridad antes del cierre del año.",
    thumbnail: eventFiscalCdmx,
    type: "workshop",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-09-25T09:07:00-06:00",
    endDate: "2026-09-25T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-taller-estrategia-fiscal-cdmx-octubre",
    title: "Taller de Estrategia Fiscal",
    slug: "taller-estrategia-fiscal-cdmx-octubre",
    shortDescription:
      "Edición CDMX del taller de estrategia fiscal para cerrar el año con estructura.",
    description:
      "Edición CDMX del taller de estrategia fiscal para empresarios que quieren cerrar el año con estructura.",
    thumbnail: eventFiscalCdmx,
    type: "workshop",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-10-22T09:07:00-06:00",
    endDate: "2026-10-22T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-coaching-para-el-liderazgo",
    title: "Coaching para el Liderazgo",
    slug: "coaching-para-el-liderazgo",
    shortDescription:
      "Dos días para fortalecer dirección, criterio y liderazgo empresarial.",
    description:
      "Dos días para fortalecer dirección, criterio y liderazgo empresarial con herramientas de ejecución.",
    thumbnail: eventCoaching,
    type: "seminar",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/coaching-para-el-liderazgo",
    startDate: "2026-10-23T09:07:00-06:00",
    endDate: "2026-10-24T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-holding-octubre",
    title: "Holding",
    slug: "holding-octubre",
    shortDescription:
      "Entrenamiento online para entender cuándo una holding sí suma.",
    description:
      "Entrenamiento online para entender cuándo una holding sí suma y cuándo sólo complica la estructura.",
    thumbnail: eventHolding,
    type: "webinar",
    modality: "online",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-10-27T09:07:00-06:00",
    endDate: "2026-10-27T11:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-taller-estrategia-fiscal-monterrey",
    title: "Taller de Estrategia Fiscal",
    slug: "taller-estrategia-fiscal-monterrey",
    shortDescription:
      "Edición Monterrey del taller para empresarios que quieren claridad fiscal.",
    description:
      "Edición Monterrey del taller para empresarios que quieren claridad fiscal y decisiones accionables.",
    thumbnail: eventFiscalMonterrey,
    type: "workshop",
    modality: "in-person",
    location: "Monterrey",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-11-06T09:07:00-06:00",
    endDate: "2026-11-06T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-4e-codigo-rockefeller",
    title: "4E Código Rockefeller",
    slug: "4e-codigo-rockefeller",
    shortDescription:
      "Entrenamiento de tres días para ordenar estrategia, ejecución y crecimiento.",
    description:
      "Entrenamiento de tres días para ordenar estrategia, ejecución y crecimiento con método.",
    thumbnail: eventRockefeller,
    type: "conference",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/4e-codigo-rockefeller",
    startDate: "2026-11-20T09:07:00-06:00",
    endDate: "2026-11-22T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-holding-noviembre",
    title: "Holding",
    slug: "holding-noviembre",
    shortDescription:
      "Nueva sesión online para revisar holding, partes relacionadas y patrimonio.",
    description:
      "Nueva sesión online para revisar holding, partes relacionadas y decisiones patrimoniales.",
    thumbnail: eventHolding,
    type: "webinar",
    modality: "online",
    location: "Zoom",
    onlineUrl: "/eventos/holding",
    startDate: "2026-11-24T09:07:00-06:00",
    endDate: "2026-11-24T11:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-maestria-escenica",
    title: "Maestría Escénica",
    slug: "maestria-escenica",
    shortDescription:
      "Tres días para fortalecer comunicación, presencia y estructura de mensaje.",
    description:
      "Tres días para fortalecer comunicación, presencia y estructura de mensaje frente a audiencias empresariales.",
    thumbnail: eventMaestriaEscenica,
    type: "seminar",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/maestria-escenica",
    startDate: "2026-12-04T09:07:00-06:00",
    endDate: "2026-12-06T17:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-taller-estrategia-fiscal-online-diciembre",
    title: "Taller de Estrategia Fiscal",
    slug: "taller-estrategia-fiscal-online-diciembre",
    shortDescription:
      "Último taller online del año para preparar la estructura del siguiente ciclo.",
    description:
      "Último taller online del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
    thumbnail: eventTallerFiscal,
    type: "workshop",
    modality: "online",
    location: "Online",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-12-10T09:07:00-06:00",
    endDate: "2026-12-10T13:00:00-06:00",
    price: 0,
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
] satisfies Event[];

const INPUT_CLASS =
  "min-h-11 w-full rounded-xl border border-ink-900/15 bg-white px-3 text-sm outline-none transition-colors focus:border-ink-900";

const TYPE_LABEL: Record<Event["type"], string> = {
  seminar: "Seminario",
  workshop: "Workshop",
  webinar: "Webinar",
  conference: "Conferencia",
};

const MODALITY_LABEL: Record<Event["modality"], string> = {
  "in-person": "Presencial",
  online: "Online",
  hybrid: "Híbrido",
};

const STATUS_LABEL: Record<Event["status"], string> = {
  upcoming: "Publicado",
  ongoing: "En vivo",
  finished: "Finalizado",
  canceled: "Oculto",
};

const PAYMENT_TYPE_LABEL = {
  free: "Gratis",
  one_time: "Pago unico",
  subscription: "Suscripcion",
} as const;

const getEventId = (event: Event) => event.id ?? event._id ?? "";
const isSeedId = (id?: string) => Boolean(id?.startsWith("seed-"));
const isLocalId = (id?: string) => Boolean(id?.startsWith("local-"));

const loadStoredEvents = (): Event[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as Event[]) : [];
    return events.filter((event) => !DEPRECATED_EVENT_SLUGS.has(event.slug));
  } catch {
    return [];
  }
};

const saveStoredEvents = (events: Event[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("dd-events-updated"));
};

const saveFeaturedEventSlug = (slug: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FEATURED_EVENT_SLUG_KEY, slug);
  window.dispatchEvent(new Event("dd-events-updated"));
};

const setStoredEvents = (events: Event[]) => {
  try {
    saveStoredEvents(events);
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.name === "QuotaExceededError") {
      toast.error("La imagen es demasiado pesada para guardarse localmente. Intenta con una imagen más ligera.");
      return false;
    }
    toast.error("No se pudo guardar el evento localmente.");
    return false;
  }
};

const loadCtaSettings = (): EventCtaSettings => {
  if (typeof window === "undefined") return DEFAULT_CTA_SETTINGS;
  try {
    const raw = window.localStorage.getItem(EVENT_CTA_SETTINGS_KEY);
    return raw
      ? { ...DEFAULT_CTA_SETTINGS, ...JSON.parse(raw) }
      : DEFAULT_CTA_SETTINGS;
  } catch {
    return DEFAULT_CTA_SETTINGS;
  }
};

const saveCtaSettings = (settings: EventCtaSettings) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EVENT_CTA_SETTINGS_KEY, JSON.stringify(settings));
};

const toDateTimeInput = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const toSlug = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const formatVisibleDate = (value: string) =>
  new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
  }).format(new Date(value));

const formatTime = (value: string) =>
  new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const compressImageFile = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxSize = 1200;
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("No se pudo procesar la imagen."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.78));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la imagen."));
    };

    image.src = objectUrl;
  });

const formFromEvent = (event: Event): EventForm => ({
  id: getEventId(event),
  title: event.title,
  slug: event.slug,
  shortDescription: event.shortDescription,
  description: event.description,
  thumbnail: event.thumbnail,
  type: event.type,
  modality: event.modality,
  location: event.location,
  onlineUrl: event.onlineUrl,
  startDate: toDateTimeInput(event.startDate),
  endDate: toDateTimeInput(event.endDate),
  price: String(event.salePrice ?? event.price ?? 0),
  currency: event.currency || "MXN",
  paymentType: event.paymentType || (Number(event.price || 0) > 0 ? "one_time" : "free"),
  stripePriceId: event.stripePriceId || "",
  capacity: String(event.capacity ?? 80),
  status: event.status,
  isFeatured: Boolean(event.isFeatured),
  buttonText: "¡Estoy listo!",
  buttonUrl: event.onlineUrl || `/eventos/${event.slug}`,
  titleColor: "#2C2C2C",
  buttonBackground: "#8B1538",
  buttonTextColor: "#FFFFFF",
});

const buildPayload = (form: EventForm): Partial<Event> => ({
  title: form.title,
  slug: form.slug || toSlug(form.title),
  shortDescription: form.shortDescription,
  description: form.description,
  thumbnail: form.thumbnail,
  type: form.type,
  modality: form.modality,
  location: form.location,
  onlineUrl: form.buttonUrl || form.onlineUrl,
  startDate: new Date(form.startDate).toISOString(),
  endDate: new Date(form.endDate || form.startDate).toISOString(),
  price: Number(form.price) || 0,
  currency: form.currency,
  paymentType: form.paymentType,
  stripePriceId: form.stripePriceId,
  capacity: Number(form.capacity) || 0,
  registeredCount: 0,
  status: form.status,
  isFeatured: form.isFeatured,
  agenda: [],
});

const eventFromForm = (form: EventForm, id: string): Event => ({
  id,
  title: form.title,
  slug: form.slug || toSlug(form.title),
  shortDescription: form.shortDescription,
  description: form.description,
  thumbnail: form.thumbnail,
  type: form.type,
  modality: form.modality,
  location: form.location,
  onlineUrl: form.buttonUrl || form.onlineUrl,
  startDate: new Date(form.startDate).toISOString(),
  endDate: new Date(form.endDate || form.startDate).toISOString(),
  price: Number(form.price) || 0,
  currency: form.currency,
  paymentType: form.paymentType,
  stripePriceId: form.stripePriceId,
  capacity: Number(form.capacity) || 0,
  registeredCount: 0,
  status: form.status,
  instructor: "admin",
  isFeatured: form.isFeatured,
  agenda: [],
});

export default function ManageEvents() {
  const { data, isLoading } = useEvents({
    limit: 100,
    enabled: ENABLE_EVENT_API_SYNC,
  });
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const apiEvents = useMemo(
    () => (data?.data ?? []).filter((event) => !DEPRECATED_EVENT_SLUGS.has(event.slug)),
    [data?.data],
  );
  const [localEvents, setLocalEvents] = useState<Event[]>(loadStoredEvents);
  const events = useMemo(() => {
    const bySlug = new Map<string, Event>();
    SEEDED_CALENDAR_EVENTS.forEach((event) => bySlug.set(event.slug, event));
    apiEvents.forEach((event) => bySlug.set(event.slug, event));
    localEvents.forEach((event) => bySlug.set(event.slug, event));
    return Array.from(bySlug.values()).sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }, [apiEvents, localEvents]);
  const [selectedId, setSelectedId] = useState<string>("new");
  const [form, setForm] = useState<EventForm>(DEFAULT_FORM);
  const [ctaSettings, setCtaSettings] = useState(loadCtaSettings);

  useEffect(() => {
    if (selectedId === "new") return;
    const selected = events.find((event) => getEventId(event) === selectedId);
    if (selected) setForm(formFromEvent(selected));
  }, [events, selectedId]);

const selectedIsNew = selectedId === "new";
  const selectedIsSeed = isSeedId(form.id);
  const selectedIsLocal = isLocalId(form.id);
  const isSaving = createEvent.isPending || updateEvent.isPending;

  const update = <K extends keyof EventForm>(key: K, value: EventForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setFeaturedEventLocally = (nextForm: EventForm) => {
    const featuredSlug = nextForm.slug || toSlug(nextForm.title);
    const featuredEvent = eventFromForm(
      { ...nextForm, slug: featuredSlug, isFeatured: true },
      nextForm.id && !isSeedId(nextForm.id)
        ? nextForm.id
        : `local-${featuredSlug}`,
    );

    setLocalEvents((current) => {
      const nextLocalEvents = [
        ...current
          .filter((event) => event.slug !== featuredEvent.slug)
          .map((event) => ({ ...event, isFeatured: false })),
        featuredEvent,
      ];
      if (!setStoredEvents(nextLocalEvents)) return current;
      return nextLocalEvents;
    });
    saveFeaturedEventSlug(featuredEvent.slug);
    toast.success("Evento principal actualizado");
  };

  const updateCta = <K extends keyof EventCtaSettings>(
    key: K,
    value: EventCtaSettings[K],
  ) => {
    setCtaSettings((current) => ({ ...current, [key]: value }));
  };

  const addEvent = () => {
    setSelectedId("new");
    setForm({
      ...DEFAULT_FORM,
      title: `Nuevo evento ${events.length + 1}`,
      slug: `nuevo-evento-${events.length + 1}`,
    });
  };

  const save = async () => {
    saveCtaSettings(ctaSettings);

    try {
      const payload = buildPayload(form);
      const payloadSlug = String(payload.slug ?? toSlug(form.title));

      if (ENABLE_EVENT_API_SYNC) {
        const existingApiEvent = apiEvents.find((event) => event.slug === payloadSlug);
        const existingApiId = existingApiEvent ? getEventId(existingApiEvent) : "";
        const shouldCreate =
          selectedIsNew || (!existingApiId && (selectedIsSeed || selectedIsLocal || !form.id));

        const savedEvent = shouldCreate
          ? await createEvent.mutateAsync(payload)
          : await updateEvent.mutateAsync({
              id: existingApiId || form.id || payloadSlug,
              data: payload,
            });
        const savedId = getEventId(savedEvent);
        const nextLocalEvents = localEvents.filter(
          (event) => event.slug !== savedEvent.slug && getEventId(event) !== savedId,
        );

        setStoredEvents(nextLocalEvents);
        setLocalEvents(nextLocalEvents);
        if (savedId) setSelectedId(savedId);
        setForm(formFromEvent(savedEvent));
        if (savedEvent.isFeatured) saveFeaturedEventSlug(savedEvent.slug);
        toast.success(
          savedEvent.isFeatured
            ? "Evento principal actualizado en base de datos"
            : "Evento guardado en base de datos",
        );
        return;
      }

      const localId =
        form.id && !selectedIsSeed
          ? form.id
          : `local-${String(payload.slug ?? toSlug(form.title))}`;
      const localEvent = eventFromForm(form, localId);
      const nextLocalEvents = [
        ...localEvents
          .filter((event) => event.slug !== localEvent.slug)
          .map((event) =>
            localEvent.isFeatured ? { ...event, isFeatured: false } : event,
          ),
        localEvent,
      ];
      if (!setStoredEvents(nextLocalEvents)) return;
      setLocalEvents(nextLocalEvents);
      setSelectedId(localId);
      setForm(formFromEvent(localEvent));
      if (localEvent.isFeatured) {
        saveFeaturedEventSlug(localEvent.slug);
      }
      toast.success(
        localEvent.isFeatured
          ? "Evento principal actualizado"
          : "Evento actualizado",
      );
    } catch {
      toast.error("No se pudo guardar el evento");
    }
  };

  const saveOnlyCtas = () => {
    saveCtaSettings(ctaSettings);
    toast.success("CTAs de asesor actualizados");
  };

  const hideSelected = async () => {
    if (!form.id) return;

    if (ENABLE_EVENT_API_SYNC) {
      try {
        const payload = { ...buildPayload(form), status: "canceled" as const };
        const payloadSlug = String(payload.slug ?? toSlug(form.title));
        const existingApiEvent = apiEvents.find((event) => event.slug === payloadSlug);
        const existingApiId = existingApiEvent ? getEventId(existingApiEvent) : "";
        const savedEvent =
          existingApiId || (!selectedIsSeed && !selectedIsLocal && form.id)
            ? await updateEvent.mutateAsync({
                id: existingApiId || form.id,
                data: payload,
              })
            : await createEvent.mutateAsync(payload);
        const savedId = getEventId(savedEvent);
        const nextLocalEvents = localEvents.filter(
          (event) => event.slug !== savedEvent.slug && getEventId(event) !== savedId,
        );
        setStoredEvents(nextLocalEvents);
        setLocalEvents(nextLocalEvents);
        if (savedId) setSelectedId(savedId);
        setForm(formFromEvent(savedEvent));
        toast.success("Evento oculto en base de datos");
      } catch {
        toast.error("No se pudo ocultar el evento");
      }
      return;
    }

    const hiddenEvent = eventFromForm(
      { ...form, status: "canceled" },
      selectedIsSeed ? `local-${form.slug || toSlug(form.title)}` : form.id,
    );
    const nextLocalEvents = [
      ...localEvents.filter((event) => event.slug !== hiddenEvent.slug),
      hiddenEvent,
    ];
    if (!setStoredEvents(nextLocalEvents)) return;
    setLocalEvents(nextLocalEvents);
    setSelectedId(getEventId(hiddenEvent));
    setForm(formFromEvent(hiddenEvent));
    toast.success("Evento oculto");
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    try {
      if (ENABLE_EVENT_API_SYNC) {
        const uploaded = await eventsApi.uploadEventImage(file);
        update("thumbnail", uploaded.url);
        toast.success("Imagen subida al servidor");
        return;
      }

      const compressed = await compressImageFile(file);
      update("thumbnail", compressed);
      toast.success("Imagen cargada localmente");
    } catch {
      toast.error("No se pudo cargar la imagen");
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] bg-cream text-ink-900">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500">
            Productos / Eventos
          </p>
          <h1 className="mt-2 font-serif text-5xl leading-none">
            Calendario de Eventos
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
            Administra desde aquí los bloques que alimentan la página pública de
            eventos. Cambia fecha, imagen, lugar, botón y publicación sin tocar
            el código fuente.
          </p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={isSaving}
          className="min-h-11 rounded-full bg-ink-900 px-6 text-sm font-semibold text-cream disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
      </header>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">
                Sección
              </p>
              <h2 className="mt-1 text-xl font-semibold">
                Calendario de Eventos
              </h2>
            </div>
            <button
              type="button"
              onClick={save}
              className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold"
            >
              Guardar
            </button>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-ink-400">
            Bloques
          </p>
          <div className="mt-3 space-y-1">
            {isLoading ? (
              <p className="py-8 text-center text-sm text-ink-500">
                Cargando eventos...
              </p>
            ) : null}
            {events.map((event) => {
              const id = getEventId(event);
              const isActive = id === selectedId;
              const hidden = event.status === "canceled";

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedId(id)}
                  className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm transition-colors ${
                    isActive
                      ? "bg-ink-900/[0.07] font-semibold text-ink-900"
                      : "text-ink-700 hover:bg-cream-200"
                  }`}
                >
                  <MegaphoneIcon />
                  <span className="min-w-0 flex-1 truncate">{event.title}</span>
                  {isSeedId(id) ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Base
                    </span>
                  ) : null}
                  {event.isFeatured ? (
                    <span className="rounded-full bg-ink-900 px-2 py-0.5 text-[10px] font-semibold text-white">
                      Principal
                    </span>
                  ) : null}
                  {hidden ? <EyeOffIcon /> : null}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addEvent}
            className="mt-5 flex min-h-10 items-center gap-2 text-sm font-semibold text-brand-600"
          >
            <PlusIcon /> Añadir evento
          </button>

          {!selectedIsNew && (
            <button
              type="button"
              onClick={hideSelected}
              className="mt-8 flex min-h-10 items-center gap-2 text-sm text-red-600"
            >
              <TrashIcon /> Ocultar bloque
            </button>
          )}

          <div className="mt-8 rounded-2xl border border-ink-900/10 bg-cream-100 p-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">
              CTAs de asesor
            </p>
            <p className="mt-2 text-xs leading-relaxed text-ink-600">
              Estos no son eventos. Sólo controlan a qué WhatsApp mandan los
              botones editoriales de ventas y lista de espera.
            </p>
            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold">
                Habla con ventas
              </span>
              <input
                value={ctaSettings.salesPhone}
                onChange={(event) =>
                  updateCta("salesPhone", event.target.value)
                }
                placeholder="521XXXXXXXXXX"
                className={INPUT_CLASS}
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-xs font-semibold">Apúntame</span>
              <input
                value={ctaSettings.waitlistPhone}
                onChange={(event) =>
                  updateCta("waitlistPhone", event.target.value)
                }
                placeholder="521XXXXXXXXXX"
                className={INPUT_CLASS}
              />
            </label>
            <button
              type="button"
              onClick={saveOnlyCtas}
              className="mt-4 min-h-10 w-full rounded-full bg-ink-900 px-4 text-sm font-semibold text-cream"
            >
              Guardar CTAs
            </button>
          </div>
        </aside>

        <main className="rounded-2xl border border-ink-900/10 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink-400">
                Bloque
              </p>
              <h2 className="mt-1 font-serif text-3xl">Evento</h2>
            </div>
            <a
              href="/eventos"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-semibold transition-colors hover:border-ink-900"
            >
              Ver sección sincronizada ↗
            </a>
          </div>

          <div className="mt-6 grid gap-x-6 gap-y-5 lg:grid-cols-2">
            <Field label="Fecha sistema">
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(event) => update("startDate", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Imagen del evento">
              <div className="overflow-hidden rounded-xl border border-ink-900/15 bg-[#101010] p-3">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt={form.title}
                    className="aspect-square w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-sm text-white/45">
                    Imagen pendiente
                  </div>
                )}
              </div>
              <div className="mt-3 grid gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => readFile(event.target.files?.[0])}
                  className="text-sm"
                />
                <input
                  value={form.thumbnail}
                  onChange={(event) => update("thumbnail", event.target.value)}
                  placeholder="URL de imagen"
                  className={INPUT_CLASS}
                />
              </div>
              <div className="mt-4 rounded-xl border border-ink-900/10 bg-white p-3">
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-400">
                  Galería de assets
                </p>
                <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 xl:grid-cols-4">
                  {EVENT_IMAGE_OPTIONS.map((option) => {
                    const selected = form.thumbnail === option.src;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => update("thumbnail", option.src)}
                        className={`group overflow-hidden rounded-lg border bg-[#101010] p-1 text-left transition ${
                          selected
                            ? "border-[#8B1538] ring-2 ring-[#8B1538]/20"
                            : "border-ink-900/10 hover:border-ink-900/40"
                        }`}
                        title={option.label}
                      >
                        <img
                          src={option.src}
                          alt={option.label}
                          className="aspect-square w-full object-contain transition duration-200 group-hover:scale-[1.02]"
                        />
                        <span className="block truncate bg-white px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Field>

            <Field label="Título">
              <input
                value={form.title}
                onChange={(event) => {
                  update("title", event.target.value);
                  if (selectedIsNew) update("slug", toSlug(event.target.value));
                }}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Slug">
              <input
                value={form.slug}
                onChange={(event) => update("slug", toSlug(event.target.value))}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Fecha visible">
              <input
                value={form.startDate ? formatVisibleDate(form.startDate) : ""}
                readOnly
                className={`${INPUT_CLASS} bg-cream-100`}
              />
            </Field>

            <Field label="Hora">
              <input
                value={form.startDate ? formatTime(form.startDate) : ""}
                readOnly
                className={`${INPUT_CLASS} bg-cream-100`}
              />
            </Field>

            <Field label="Lugar">
              <input
                value={form.location}
                onChange={(event) => update("location", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Tipo">
              <select
                value={form.type}
                onChange={(event) =>
                  update("type", event.target.value as Event["type"])
                }
                className={INPUT_CLASS}
              >
                {Object.entries(TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Modalidad">
              <select
                value={form.modality}
                onChange={(event) =>
                  update("modality", event.target.value as Event["modality"])
                }
                className={INPUT_CLASS}
              >
                {Object.entries(MODALITY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Tipo de cobro">
              <select
                value={form.paymentType}
                onChange={(event) =>
                  update("paymentType", event.target.value as Event["paymentType"])
                }
                className={INPUT_CLASS}
              >
                {Object.entries(PAYMENT_TYPE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Precio">
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => update("price", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Moneda">
              <input
                value={form.currency}
                onChange={(event) =>
                  update("currency", event.target.value.toUpperCase().slice(0, 3))
                }
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Stripe Price ID">
              <input
                value={form.stripePriceId}
                onChange={(event) => update("stripePriceId", event.target.value)}
                placeholder="price_..."
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Enlace botón">
              <input
                value={form.buttonUrl}
                onChange={(event) => update("buttonUrl", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Texto botón">
              <input
                value={form.buttonText}
                onChange={(event) => update("buttonText", event.target.value)}
                className={INPUT_CLASS}
              />
            </Field>

            <Field label="Estado">
              <select
                value={form.status}
                onChange={(event) =>
                  update("status", event.target.value as Event["status"])
                }
                className={INPUT_CLASS}
              >
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>

            <label className="flex items-center justify-between gap-3 rounded-xl border border-ink-900/10 px-4 py-3 text-sm">
              <span>
                <span className="block font-semibold">Evento principal</span>
                <span className="mt-1 block text-xs text-ink-500">
                  Se pintará en la sección negra grande de la landing pública.
                </span>
              </span>
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(event) => {
                  const checked = event.target.checked;
                  const nextForm = { ...form, isFeatured: checked };
                  setForm(nextForm);
                  if (checked && !ENABLE_EVENT_API_SYNC) {
                    setFeaturedEventLocally(nextForm);
                  }
                }}
              />
            </label>

            <div className="grid grid-cols-3 gap-3">
              <ColorField
                label="Color título"
                value={form.titleColor}
                onChange={(value) => update("titleColor", value)}
              />
              <ColorField
                label="Fondo botón"
                value={form.buttonBackground}
                onChange={(value) => update("buttonBackground", value)}
              />
              <ColorField
                label="Texto botón"
                value={form.buttonTextColor}
                onChange={(value) => update("buttonTextColor", value)}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-ink-600">{label}</span>
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs text-ink-500">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-ink-900/15 px-2 py-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-7 w-7"
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-xs outline-none"
        />
      </div>
    </label>
  );
}

function MegaphoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M4 14v-4l11-4v12L4 14Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M7 14l2 5h3l-2-4"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.8 2.8"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M9.9 5.2A9.6 9.6 0 0 1 12 5c5 0 8.5 4.3 9.5 7- .4 1.1-1.4 2.6-2.8 3.9M6.6 6.7C4.5 8.1 3.1 10.2 2.5 12c1 2.7 4.5 7 9.5 7 1.4 0 2.7-.3 3.8-.9"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeWidth="1.8" d="M12 5v14M5 12h14" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="h-4 w-4"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3"
      />
    </svg>
  );
}
