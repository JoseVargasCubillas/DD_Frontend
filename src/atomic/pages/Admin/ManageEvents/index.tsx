import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as eventsApi from "@api/events.api";
import { useCreateEvent, useEvents, useUpdateEvent } from "@hooks/useEvents";
import type { Event } from "@t/index";

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
  capacity: "80",
  status: "upcoming",
  isFeatured: false,
  buttonText: "¡Estoy listo!",
  buttonUrl: "/eventos",
  titleColor: "#2C2C2C",
  buttonBackground: "#8B1538",
  buttonTextColor: "#FFFFFF",
};

const SEEDED_CALENDAR_EVENTS = [
  {
    id: "seed-formacion-equipos",
    title: "Formación de Equipos de Alto Impacto",
    slug: "formacion-equipos",
    shortDescription:
      "Un evento por mes durante todo 2026. Solo presencial, solo en español, solo para empresarios que decidieron dejar de pagar más impuestos de los necesarios.",
    description:
      "Formación para empresarios y líderes que quieren construir equipos de alto impacto, con dirección, cultura y cadencia operativa.",
    thumbnail: "",
    type: "conference",
    modality: "online",
    location: "Online",
    onlineUrl: "/eventos/formacion-equipos",
    startDate: "2026-05-28T09:07:00-06:00",
    endDate: "2026-05-28T17:00:00-06:00",
    price: 24800,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-revision-estrategica",
    title: "Revisión Estratégica de Cierre Semestral",
    slug: "revision-estrategica",
    shortDescription:
      "Diagnóstico fiscal con foco en decisiones críticas antes del segundo semestre.",
    description:
      "Un seminario para revisar decisiones fiscales, estructura y prioridades antes de entrar al segundo semestre.",
    thumbnail: "",
    type: "seminar",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/revision-estrategica",
    startDate: "2026-06-05T09:07:00-06:00",
    endDate: "2026-06-05T17:00:00-06:00",
    price: 4900,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-estrategia-fiscal",
    title: "Estrategia Fiscal Edición CDMX",
    slug: "estrategia-fiscal",
    shortDescription:
      "El evento emblema de Diego. Un día intensivo en CDMX con cierre de alto fiscal en mente.",
    description:
      "Un día intensivo para empresarios que quieren rediseñar su estrategia fiscal antes del cierre de año.",
    thumbnail: "",
    type: "seminar",
    modality: "in-person",
    location: "WTC CDMX",
    onlineUrl: "/eventos/estrategia-fiscal",
    startDate: "2026-08-28T09:00:00-06:00",
    endDate: "2026-08-28T18:00:00-06:00",
    price: 12400,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: true,
    agenda: [],
  },
  {
    id: "seed-equipos-creativos",
    title: "Equipos Creativos Cumbre Bajío",
    slug: "equipos-creativos",
    shortDescription:
      "Liderazgo, cultura y construcción de talento para equipos que necesitan dejar de resolver desde urgencias.",
    description:
      "Cumbre para crear equipos más autónomos, creativos y alineados con objetivos de negocio.",
    thumbnail: "",
    type: "conference",
    modality: "in-person",
    location: "Querétaro",
    onlineUrl: "/eventos/equipos-creativos",
    startDate: "2026-09-04T09:07:00-06:00",
    endDate: "2026-09-05T17:00:00-06:00",
    price: 18900,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-blindaje-patrimonial",
    title: "Blindaje Patrimonial Edición Norte",
    slug: "blindaje-patrimonial",
    shortDescription:
      "Riesgos, estructura y protección patrimonial para empresarios.",
    description:
      "Workshop sobre estructuras patrimoniales, riesgos y decisiones fiscales preventivas.",
    thumbnail: "",
    type: "workshop",
    modality: "in-person",
    location: "Monterrey",
    onlineUrl: "/eventos/blindaje-patrimonial",
    startDate: "2026-10-16T09:07:00-06:00",
    endDate: "2026-10-16T17:00:00-06:00",
    price: 32500,
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    instructor: "admin",
    isFeatured: false,
    agenda: [],
  },
  {
    id: "seed-estrategia-rockefeller",
    title: "Estrategia Rockefeller Cumbre Anual 2026",
    slug: "estrategia-rockefeller",
    shortDescription:
      "Tres días en CDMX. El evento más completo del año: estrategia fiscal, scalers, liderazgo y holding.",
    description:
      "La cumbre anual para revisar estrategia fiscal, dirección, liderazgo y estructura empresarial.",
    thumbnail: "",
    type: "conference",
    modality: "in-person",
    location: "CDMX",
    onlineUrl: "/eventos/estrategia-rockefeller",
    startDate: "2026-11-20T09:07:00-06:00",
    endDate: "2026-11-22T17:00:00-06:00",
    price: 48000,
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

const getEventId = (event: Event) => event.id ?? event._id ?? "";
const isSeedId = (id?: string) => Boolean(id?.startsWith("seed-"));
const isLocalId = (id?: string) => Boolean(id?.startsWith("local-"));

const loadStoredEvents = (): Event[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Event[]) : [];
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
  const apiEvents = useMemo(() => data?.data ?? [], [data?.data]);
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
              <div className="overflow-hidden rounded-xl border border-ink-900/15 bg-cream-100">
                {form.thumbnail ? (
                  <img
                    src={form.thumbnail}
                    alt={form.title}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-sm text-ink-400">
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
