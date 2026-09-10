import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useReveal, useHeroReveal } from "@hooks/useReveal";
import { useCountUp } from "@hooks/useCountUp";
import { useEvents } from "@hooks/useEvents";
import type { Event as SiteEvent } from "@t/index";
import eventPersonaFisicaMoral from "../../../../assets/eventos/evento-persona-fisica-moral.png";
import eventMentalidadEmpresarial from "../../../../assets/eventos/evento-mentalidad-empresarial.png";
import eventSistemaProspeccion from "../../../../assets/eventos/evento-sistema-prospeccion-digital.png";
import eventTallerFiscal from "../../../../assets/eventos/evento-taller-estrategia-fiscal.png";
import eventMastermindPanama from "../../../../assets/eventos/evento-mastermind-panama.png";
import eventHolding from "../../../../assets/eventos/evento-holding.png";
import eventFiscalCdmx from "../../../../assets/eventos/evento-estrategia-fiscal-cdmx.png";
import eventCoaching from "../../../../assets/eventos/evento-coaching-liderazgo.png";
import eventFiscalMonterrey from "../../../../assets/eventos/evento-estrategia-fiscal-monterrey.png";
import eventRockefeller from "../../../../assets/eventos/evento-rockefeller.png";
import eventMaestriaEscenica from "../../../../assets/eventos/evento-maestria-escenica.png";
import eventBeneficiosRegimen from "../../../../assets/eventos/evento-beneficios-regimen-fiscal.png";
import eventRevisionEstrategica from "../../../../assets/eventos/evento-revision-estrategica-cdmx.png";

type EventTone = "cream" | "dark";

interface EventCard {
  eyebrow: string;
  title: string;
  titleSerif?: string;
  description: string;
  price: string;
  date: string;
  rawDate?: string;
  location: string;
  to: string;
  image?: string;
  tone?: EventTone;
  large?: boolean;
  cta?: string;
  isFeatured?: boolean;
  slug?: string;
}

const featuredCountdown = [
  ["15", "Eventos\nen 2026"],
  ["05", "Ciudades\nsede"],
  ["1,450", "Cupos\ntotales"],
];

const NEXT_EVENT_DATE = new Date("2026-08-28T09:07:00-06:00");

function getCountdown(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

const formatFilters = ["Todos", "Cumbre", "Seminario", "Workshop", "Webinar"];
const monthFilters = ["Todo el año", "Ago", "Sep", "Oct", "Nov", "Dic"];
const cityFilters = ["Todas", "CDMX", "Monterrey", "Panamá", "Zoom", "Online"];

const EVENT_CTA_SETTINGS_KEY = "dd-event-cta-settings";
const EVENT_STORAGE_KEY = "dd-admin-events";
const FEATURED_EVENT_SLUG_KEY = "dd-featured-event-slug";
const ENABLE_EVENT_API_SYNC = import.meta.env.VITE_EVENTS_API_SYNC !== "false";
const DEFAULT_CTA_SETTINGS = {
  salesPhone: "5214427475869",
  waitlistPhone: "5214427475869",
};
const DEPRECATED_EVENT_SLUGS = new Set([
  "formacion-equipos",
  "revision-estrategica",
  "estrategia-fiscal",
  "equipos-creativos",
  "blindaje-patrimonial",
  "estrategia-rockefeller",
]);

const LEGACY_PLACEHOLDER_PHONES = new Set(["5210000000000", "5218400001184"]);

const sanitizePhone = (phone: string | undefined | null): string => {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (!digits || LEGACY_PLACEHOLDER_PHONES.has(digits)) {
    return DEFAULT_CTA_SETTINGS.salesPhone;
  }
  return digits;
};

const loadCtaSettings = () => {
  if (typeof window === "undefined") return DEFAULT_CTA_SETTINGS;
  try {
    const raw = window.localStorage.getItem(EVENT_CTA_SETTINGS_KEY);
    const parsed = raw
      ? { ...DEFAULT_CTA_SETTINGS, ...JSON.parse(raw) }
      : DEFAULT_CTA_SETTINGS;
    const migrated = {
      ...parsed,
      salesPhone: sanitizePhone(parsed.salesPhone),
      waitlistPhone: sanitizePhone(parsed.waitlistPhone),
    };
    // Persistimos la migración para que el admin ya no vea el placeholder viejo.
    if (
      raw &&
      (parsed.salesPhone !== migrated.salesPhone ||
        parsed.waitlistPhone !== migrated.waitlistPhone)
    ) {
      window.localStorage.setItem(
        EVENT_CTA_SETTINGS_KEY,
        JSON.stringify(migrated),
      );
    }
    return migrated;
  } catch {
    return DEFAULT_CTA_SETTINGS;
  }
};

const whatsappHref = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

const toIcsDate = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

const createCalendarDownloadHref = (event?: EventCard | null) => {
  const start = event?.rawDate ? new Date(event.rawDate) : NEXT_EVENT_DATE;
  const safeStart = Number.isNaN(start.getTime()) ? NEXT_EVENT_DATE : start;
  const end = new Date(safeStart.getTime() + 8 * 60 * 60 * 1000);
  const summary = [event?.title, event?.titleSerif].filter(Boolean).join(" ");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Diego Diaz//Calendario Eventos 2026//ES
BEGIN:VEVENT
UID:${getEventCardSlug(event ?? eventGroups[0]?.events[0])}-2026@diegodiaz.mx
DTSTAMP:${toIcsDate(new Date())}
DTSTART:${toIcsDate(safeStart)}
DTEND:${toIcsDate(end)}
SUMMARY:${summary || "Evento Diego Diaz"}
LOCATION:${event?.location ?? ""}
DESCRIPTION:${event?.description ?? ""}
END:VEVENT
END:VCALENDAR`)}`;
};

const loadStoredEvents = (): SiteEvent[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = raw ? (JSON.parse(raw) as SiteEvent[]) : [];
    return events.filter((event) => !DEPRECATED_EVENT_SLUGS.has(event.slug));
  } catch {
    return [];
  }
};

const loadFeaturedEventSlug = () => {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(FEATURED_EVENT_SLUG_KEY) ?? "";
};

const TYPE_LABEL: Record<SiteEvent["type"], string> = {
  seminar: "Seminario",
  workshop: "Workshop",
  webinar: "Webinar",
  conference: "Conferencia",
};

const monthName = (date: Date, format: "short" | "long" = "long") =>
  new Intl.DateTimeFormat("es-MX", { month: format }).format(date);

const formatEventDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha por definir";
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatCurrency = (value: number) =>
  value <= 0
    ? "Gratis"
    : new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        maximumFractionDigits: 0,
      }).format(value);

const splitTitle = (title: string) => {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return { title, titleSerif: undefined };
  const midpoint = Math.ceil(words.length / 2);
  return {
    title: words.slice(0, midpoint).join(" "),
    titleSerif: words.slice(midpoint).join(" "),
  };
};

const isHoldingEvent = (event: Pick<SiteEvent, "slug" | "title">) =>
  event.slug.startsWith("holding") || event.title.trim().toLowerCase() === "holding";

const isTallerEstrategiaFiscalEvent = (event: Pick<SiteEvent, "slug" | "title">) =>
  event.slug.includes("taller-estrategia-fiscal") ||
  event.title.trim().toLowerCase().includes("taller de estrategia fiscal");

const cardFromApiEvent = (event: SiteEvent): EventCard => {
  const titleParts = splitTitle(event.title);
  const price = event.salePrice ?? event.price ?? 0;

  return {
    eyebrow: TYPE_LABEL[event.type] ?? event.type,
    title: titleParts.title,
    titleSerif: titleParts.titleSerif,
    description: event.shortDescription || event.description,
    price: formatCurrency(price),
    date: formatEventDate(event.startDate),
    rawDate: event.startDate,
    location:
      event.modality === "online"
        ? "Online"
        : event.location ||
          (event.modality === "hybrid" ? "Híbrido" : "Por definir"),
    to: isTallerEstrategiaFiscalEvent(event)
      ? "/eventos/estrategia-fiscal"
      : isHoldingEvent(event)
        ? "/eventos/holding"
        : event.onlineUrl || `/eventos/${event.slug}`,
    image: event.thumbnail,
    cta: event.status === "ongoing" ? "Entrar ahora" : "¡Estoy listo!",
    isFeatured: event.isFeatured,
    slug: event.slug,
  };
};

const getEventCardSlug = (event: EventCard) =>
  event.slug ||
  (() => {
    const parts = event.to.split("/").filter(Boolean);
    return parts[parts.length - 1] ?? "";
  })();

const isUpcomingEventCard = (event: EventCard) => {
  if (!event.rawDate) return true;
  const time = new Date(event.rawDate).getTime();
  return !Number.isNaN(time) && time >= Date.now();
};

const groupApiEvents = (events: SiteEvent[]) => {
  const visible = events
    .filter((event) => event.status !== "canceled" && !DEPRECATED_EVENT_SLUGS.has(event.slug))
    .sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );

  const grouped = visible.reduce<Record<string, EventCard[]>>((acc, event) => {
    const date = new Date(event.startDate);
    const key = Number.isNaN(date.getTime())
      ? "Fecha por definir"
      : `${monthName(date)} ${date.getFullYear()}`;
    acc[key] = [...(acc[key] ?? []), cardFromApiEvent(event)];
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, events]) => ({ month, events }));
};

const groupEventCards = (events: EventCard[]) => {
  const grouped = events.reduce<Record<string, EventCard[]>>((acc, event) => {
    const date = event.rawDate ? new Date(event.rawDate) : null;
    const key =
      date && !Number.isNaN(date.getTime())
        ? `${monthName(date)} ${date.getFullYear()}`
        : event.date || "Fecha por definir";
    acc[key] = [...(acc[key] ?? []), event];
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, events]) => ({ month, events }));
};

const mergeCalendarGroups = (
  baseGroups: Array<{ month: string; events: EventCard[] }>,
  dynamicGroups: Array<{ month: string; events: EventCard[] }>,
) => {
  const bySlug = new Map<string, EventCard>();

  baseGroups
    .flatMap((group) => group.events)
    .forEach((event) => bySlug.set(getEventCardSlug(event), event));

  dynamicGroups
    .flatMap((group) => group.events)
    .forEach((event) => bySlug.set(getEventCardSlug(event), event));

  const events = Array.from(bySlug.values()).sort((a, b) => {
    const first = a.rawDate ? new Date(a.rawDate).getTime() : Number.MAX_SAFE_INTEGER;
    const second = b.rawDate ? new Date(b.rawDate).getTime() : Number.MAX_SAFE_INTEGER;
    return first - second;
  });

  return groupEventCards(events);
};

const eventGroups: Array<{ month: string; events: EventCard[] }> = [
  {
    month: "Agosto 2026",
    events: [
      {
        eyebrow: "Webinar",
        title: "De persona física",
        titleSerif: "a moral",
        description:
          "Entrenamiento para decidir cuándo conviene migrar de persona física a persona moral y evitar errores fiscales desde la estructura.",
        price: "$0 MXN",
        date: "28 Agosto 2026",
        rawDate: "2026-08-28T09:07:00-06:00",
        location: "Zoom",
        image: eventPersonaFisicaMoral,
        slug: "de-persona-fisica-a-moral",
        isFeatured: true,
        to: "/eventos/de-persona-fisica-a-moral",
        cta: "¡Estoy listo!",
      },
    ],
  },
  {
    month: "Septiembre 2026",
    events: [
      {
        eyebrow: "Seminario",
        title: "Mentalidad",
        titleSerif: "Empresarial",
        description:
          "Sesión presencial para empresarios que quieren ordenar sus decisiones, números y dirección con una mentalidad más estratégica.",
        price: "$0 MXN",
        date: "3 Septiembre 2026",
        rawDate: "2026-09-03T09:07:00-06:00",
        location: "CDMX",
        image: eventMentalidadEmpresarial,
        slug: "mentalidad-empresarial",
        to: "/eventos/mentalidad-empresarial",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Cumbre",
        title: "Sistema de",
        titleSerif: "Prospección Digital",
        description:
          "Cumbre de dos días para diseñar un sistema de atracción y conversión de prospectos de alto valor.",
        price: "$0 MXN",
        date: "4 y 5 Septiembre 2026",
        rawDate: "2026-09-04T09:07:00-06:00",
        location: "CDMX",
        image: eventSistemaProspeccion,
        slug: "cumbre-sistema-prospeccion-digital",
        to: "/eventos/cumbre-sistema-prospeccion-digital",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Workshop",
        title: "Taller de",
        titleSerif: "Estrategia Fiscal",
        description:
          "Taller online para revisar estructura fiscal, riesgos y decisiones urgentes antes del cierre del año.",
        price: "$0 MXN",
        date: "11 Septiembre 2026",
        rawDate: "2026-09-11T09:07:00-06:00",
        location: "Online",
        image: eventTallerFiscal,
        slug: "taller-estrategia-fiscal-online-septiembre",
        to: "/eventos/estrategia-fiscal",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Mastermind",
        title: "Mastermind",
        titleSerif: "Panamá",
        description:
          "Encuentro intensivo en Panamá para empresarios que buscan estrategia, estructura y visión internacional.",
        price: "$0 MXN",
        date: "15 al 18 Septiembre 2026",
        rawDate: "2026-09-15T09:07:00-06:00",
        location: "Panamá",
        image: eventMastermindPanama,
        slug: "mastermind-panama",
        to: "/eventos/mastermind-panama",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Webinar",
        title: "Holding",
        titleSerif: undefined,
        description:
          "Sesión online sobre estructura holding, patrimonio y orden empresarial para proteger decisiones de largo plazo.",
        price: "$0 MXN",
        date: "22 Septiembre 2026",
        rawDate: "2026-09-22T09:07:00-06:00",
        location: "Zoom",
        image: eventHolding,
        slug: "holding-septiembre",
        to: "/eventos/holding",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Workshop",
        title: "Taller de",
        titleSerif: "Estrategia Fiscal",
        description:
          "Taller presencial en CDMX para ajustar tu estrategia fiscal con claridad antes del cierre del año.",
        price: "$0 MXN",
        date: "25 Septiembre 2026",
        rawDate: "2026-09-25T09:07:00-06:00",
        location: "CDMX",
        image: eventFiscalCdmx,
        slug: "taller-estrategia-fiscal-cdmx-septiembre",
        to: "/eventos/estrategia-fiscal",
        cta: "¡Estoy listo!",
      },
    ],
  },
  {
    month: "Octubre 2026",
    events: [
      {
        eyebrow: "Workshop",
        title: "Taller de",
        titleSerif: "Estrategia Fiscal",
        description:
          "Edición CDMX del taller de estrategia fiscal para empresarios que quieren cerrar el año con estructura.",
        price: "$0 MXN",
        date: "22 Octubre 2026",
        rawDate: "2026-10-22T09:07:00-06:00",
        location: "CDMX",
        image: eventFiscalCdmx,
        slug: "taller-estrategia-fiscal-cdmx-octubre",
        to: "/eventos/estrategia-fiscal",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Seminario",
        title: "Coaching para",
        titleSerif: "el Liderazgo",
        description:
          "Dos días para fortalecer dirección, criterio y liderazgo empresarial con herramientas de ejecución.",
        price: "$0 MXN",
        date: "23 y 24 Octubre 2026",
        rawDate: "2026-10-23T09:07:00-06:00",
        location: "CDMX",
        image: eventCoaching,
        slug: "coaching-para-el-liderazgo",
        to: "/eventos/coaching-para-el-liderazgo",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Webinar",
        title: "Holding",
        titleSerif: undefined,
        description:
          "Entrenamiento online para entender cuándo una holding sí suma y cuándo sólo complica la estructura.",
        price: "$0 MXN",
        date: "27 Octubre 2026",
        rawDate: "2026-10-27T09:07:00-06:00",
        location: "Zoom",
        image: eventHolding,
        slug: "holding-octubre",
        to: "/eventos/holding",
        cta: "¡Estoy listo!",
      },
    ],
  },
  {
    month: "Noviembre 2026",
    events: [
      {
        eyebrow: "Workshop",
        title: "Taller de",
        titleSerif: "Estrategia Fiscal",
        description:
          "Edición Monterrey del taller para empresarios que quieren claridad fiscal y decisiones accionables.",
        price: "$0 MXN",
        date: "6 Noviembre 2026",
        rawDate: "2026-11-06T09:07:00-06:00",
        location: "Monterrey",
        image: eventFiscalMonterrey,
        slug: "taller-estrategia-fiscal-monterrey",
        to: "/eventos/estrategia-fiscal",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Entrenamiento",
        title: "4E Código",
        titleSerif: "Rockefeller",
        description:
          "Entrenamiento de tres días para ordenar estrategia, ejecución y crecimiento con método.",
        price: "$0 MXN",
        date: "20 al 22 Noviembre 2026",
        rawDate: "2026-11-20T09:07:00-06:00",
        location: "CDMX",
        image: eventRockefeller,
        slug: "4e-codigo-rockefeller",
        to: "/eventos/4e-codigo-rockefeller",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Webinar",
        title: "Holding",
        titleSerif: undefined,
        description:
          "Nueva sesión online para revisar holding, partes relacionadas y decisiones patrimoniales.",
        price: "$0 MXN",
        date: "24 Noviembre 2026",
        rawDate: "2026-11-24T09:07:00-06:00",
        location: "Zoom",
        image: eventHolding,
        slug: "holding-noviembre",
        to: "/eventos/holding",
        cta: "¡Estoy listo!",
      },
    ],
  },
  {
    month: "Diciembre 2026",
    events: [
      {
        eyebrow: "Seminario",
        title: "Maestría",
        titleSerif: "Escénica",
        description:
          "Tres días para fortalecer comunicación, presencia y estructura de mensaje frente a audiencias empresariales.",
        price: "$0 MXN",
        date: "4 al 6 Diciembre 2026",
        rawDate: "2026-12-04T09:07:00-06:00",
        location: "CDMX",
        image: eventMaestriaEscenica,
        slug: "maestria-escenica",
        to: "/eventos/maestria-escenica",
        cta: "¡Estoy listo!",
      },
      {
        eyebrow: "Workshop",
        title: "Taller de",
        titleSerif: "Estrategia Fiscal",
        description:
          "Último taller online del año para cerrar decisiones fiscales y preparar la estructura del siguiente ciclo.",
        price: "$0 MXN",
        date: "10 Diciembre 2026",
        rawDate: "2026-12-10T09:07:00-06:00",
        location: "Online",
        image: eventTallerFiscal,
        slug: "taller-estrategia-fiscal-online-diciembre",
        to: "/eventos/estrategia-fiscal",
        cta: "¡Estoy listo!",
      },
    ],
  },
];

const SHOW_PAST_EDITIONS_SECTION = false;

const pastStats = [
  ["23", "Ediciones"],
  ["5,800+", "Asistentes"],
  ["96%", "Recomendación"],
];

const faqs = [
  {
    question: "¿Los eventos son presenciales u online?",
    answer:
      "El calendario combina eventos presenciales y sesiones online. Cada card indica su sede: CDMX, Monterrey, Panamá, Zoom u Online.",
  },
  {
    question: "¿Qué incluye el costo del boleto?",
    answer:
      "Incluye acceso al evento, material digital de trabajo, coffee break y la experiencia indicada en cada formato. Los accesos VIP pueden incluir material impreso y prioridad en Q&A.",
  },
  {
    question: "¿Puedo facturar como persona moral?",
    answer:
      "Sí. Al reservar puedes solicitar factura con tus datos fiscales. El equipo confirma el proceso antes de cerrar tu inscripción.",
  },
  {
    question: "¿Cuál es la política de cambios y cancelaciones?",
    answer:
      "Puedes transferir tu lugar a otra persona antes del evento. Los cambios de fecha quedan sujetos a disponibilidad y al tipo de boleto adquirido.",
  },
  {
    question: "¿Hay descuento para grupos o despachos?",
    answer:
      "Sí, existen condiciones especiales para equipos y despachos. Escríbenos por WhatsApp para revisar cuántas personas asistirían y qué formato conviene.",
  },
  {
    question: "¿Diego está presente en todo el evento?",
    answer:
      "Diego participa en los bloques principales de estrategia, cierre y preguntas. Algunos módulos pueden incluir especialistas invitados según la edición.",
  },
  {
    question: "¿Cómo elijo entre Seminario y Cumbre?",
    answer:
      "El seminario es más puntual e intensivo. La cumbre es una experiencia más amplia para estrategia, liderazgo y estructura empresarial.",
  },
  {
    question: "¿Hay tarifa Early Bird?",
    answer:
      "Sí. Algunas ediciones tienen tarifa anticipada por tiempo limitado o hasta agotar cupos. La vigencia aparece en cada evento.",
  },
];

function Placeholder({
  className = "",
  src,
  alt,
  fit = "contain",
}: {
  className?: string;
  src?: string;
  alt?: string;
  fit?: "cover" | "contain";
}) {
  const resolvedSrc = src || eventTallerFiscal;

  return (
    <img
      src={resolvedSrc}
      alt={alt ?? ""}
      loading="lazy"
      decoding="async"
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
    />
  );
}

function AgendaCard({
  event,
  compact = false,
}: {
  event: EventCard;
  compact?: boolean;
}) {
  return (
    <article className="card-lift group flex w-full min-w-0 flex-col border border-cream-400 bg-cream-50 transition-colors duration-200 hover:border-ink-900">
      <div className="p-4 pb-0">
        <Placeholder
          src={event.image}
          alt={event.title}
          className={
            compact
              ? "mx-auto aspect-square w-full bg-[#101010]"
              : "mx-auto aspect-square w-full bg-[#101010]"
          }
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col px-4 pb-4 pt-3">
        <div className="grid grid-cols-2 border-y border-ink-900 bg-cream-50">
          <div className="border-r border-ink-900 px-3 py-2.5">
            <p className="text-[8px] uppercase tracking-[0.24em] text-ink-400">
              Fecha
            </p>
            <p className="mt-1 font-serif text-[17px] leading-none tracking-[-0.025em] text-ink-900">
              {event.date}
            </p>
          </div>
          <div className="px-3 py-2.5 text-right">
            <p className="text-[8px] uppercase tracking-[0.24em] text-ink-400">
              Sede
            </p>
            <p className="mt-1 text-[12px] font-bold uppercase leading-none tracking-[0.12em] text-ink-900">
              {event.location}
            </p>
          </div>
        </div>
        <p className="mt-3.5 text-[10px] uppercase tracking-[0.2em] text-ink-400">
          {event.eyebrow}
        </p>
        <h3 className="mt-2 max-w-[280px] font-serif text-[25px] font-normal leading-[1.02] tracking-[-0.034em] sm:text-[27px]">
          {event.title}
          {event.titleSerif ? (
            <span className="block italic tracking-[-0.046em]">
              {event.titleSerif}
            </span>
          ) : null}
        </h3>
        <details className="mt-4 border-t border-cream-300 pt-2.5 text-[13px] leading-[1.55] text-ink-500">
          <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.16em] text-ink-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900">
            Ver descripción
          </summary>
          <p className="mt-3 max-w-[350px]">{event.description}</p>
        </details>
        <div className="mt-auto border-t border-cream-300 pt-3.5">
          <Link
            to={event.to}
            className="inline-flex min-h-10 w-full items-center justify-center border border-ink-900 px-5 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-ink-900 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            Más información
          </Link>
        </div>
      </div>
    </article>
  );
}

function AgendaFeature({
  event,
  imageSide = "top",
}: {
  event: EventCard;
  imageSide?: "top" | "right";
}) {
  return (
    <article
      className={`card-lift group grid min-h-[340px] border border-cream-400 bg-cream-50 transition-colors duration-200 hover:border-ink-900 ${
        imageSide === "right" ? "md:grid-cols-[minmax(0,1fr)_minmax(280px,390px)]" : ""
      }`}
    >
      {imageSide === "top" ? (
        <div className="m-5 mb-0 flex justify-center bg-[#101010] sm:m-6 sm:mb-0">
          <Placeholder
            src={event.image}
            alt={event.title}
            className="aspect-square w-full max-w-[460px]"
          />
        </div>
      ) : null}
      <div className="flex flex-col p-7">
        <div className="flex items-center justify-between gap-5 border-b border-cream-300 pb-3 text-[11px] uppercase tracking-[0.16em] text-ink-400">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
        <p className="mt-5 text-[10px] uppercase tracking-[0.2em] text-ink-400">
          {event.eyebrow}
        </p>
        <h3 className="mt-3 max-w-[560px] font-serif text-[32px] font-normal leading-[1.06] tracking-[-0.04em] sm:text-[40px]">
          {event.title}
          {event.titleSerif ? (
            <span className="italic tracking-[-0.048em]">
              {" "}
              {event.titleSerif}
            </span>
          ) : null}
        </h3>
        <details className="mt-5 border-t border-cream-300 pt-4 text-[15px] leading-[1.6] text-ink-500">
          <summary className="cursor-pointer list-none text-[10px] uppercase tracking-[0.16em] text-ink-900 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900">
            Ver descripción
          </summary>
          <p className="mt-3 max-w-[640px]">{event.description}</p>
        </details>
        <div className="mt-auto border-t border-cream-300 pt-5">
          <Link
            to={event.to}
            className="inline-flex min-h-11 w-full items-center justify-center bg-ink-900 px-5 text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink-900"
          >
            Más información
          </Link>
        </div>
      </div>
      {imageSide === "right" ? (
        <div className="m-5 mt-0 flex items-center justify-center bg-[#101010] md:m-6 md:ml-0">
          <Placeholder
            src={event.image}
            alt={event.title}
            className="aspect-square w-full max-w-[390px]"
          />
        </div>
      ) : null}
    </article>
  );
}

function AgendaPanel({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col justify-center border border-cream-400 bg-cream-200 p-6 sm:p-8 md:min-h-[392px] md:p-14">
      {children}
    </div>
  );
}

export default function Events() {
  const { data: eventsData } = useEvents({
    limit: 100,
    enabled: ENABLE_EVENT_API_SYNC,
  });
  const ctaSettings = useMemo(() => loadCtaSettings(), []);
  const [storedEvents, setStoredEvents] = useState<SiteEvent[]>(loadStoredEvents);
  const [featuredSlug, setFeaturedSlug] = useState(loadFeaturedEventSlug);
  const apiEvents = useMemo(() => {
    const bySlug = new Map<string, SiteEvent>();
    (eventsData?.data ?? []).forEach((event) => bySlug.set(event.slug, event));
    storedEvents.forEach((event) => bySlug.set(event.slug, event));
    return Array.from(bySlug.values());
  }, [eventsData?.data, storedEvents]);
  const dynamicGroups = useMemo(() => groupApiEvents(apiEvents), [apiEvents]);
  const calendarGroups = useMemo(
    () =>
      mergeCalendarGroups(eventGroups, dynamicGroups)
        .map((group) => ({
          ...group,
          events: group.events.filter(isUpcomingEventCard),
        }))
        .filter((group) => group.events.length > 0),
    [dynamicGroups],
  );
  const allCalendarEvents = calendarGroups.flatMap((group) => group.events);
  const featuredEvent =
    allCalendarEvents.find(
      (event) => featuredSlug && getEventCardSlug(event) === featuredSlug,
    ) ??
    allCalendarEvents.find((event) => event.isFeatured) ??
    null;
  const nextEvent =
    allCalendarEvents.find((event) => {
      if (!event.rawDate) return true;
      return new Date(event.rawDate).getTime() >= Date.now();
    }) ??
    featuredEvent ??
    allCalendarEvents[0] ??
    eventGroups[0]?.events[0];
  const nextEventTimestamp = nextEvent?.rawDate
    ? new Date(nextEvent.rawDate).getTime()
    : NEXT_EVENT_DATE.getTime();
  const calendarDownloadHref = useMemo(
    () => createCalendarDownloadHref(nextEvent),
    [nextEvent],
  );
  const [activeFormat, setActiveFormat] = useState(formatFilters[0]);
  const [activeMonth, setActiveMonth] = useState(monthFilters[0]);
  const [activeCity, setActiveCity] = useState(cityFilters[0]);
  const [activeFaq, setActiveFaq] = useState(0);
  const [query, setQuery] = useState("");
  const [countdown, setCountdown] = useState(() =>
    getCountdown(new Date(nextEventTimestamp)),
  );

  useEffect(() => {
    const refreshStoredEvents = () => {
      setStoredEvents(loadStoredEvents());
      setFeaturedSlug(loadFeaturedEventSlug());
    };
    window.addEventListener("storage", refreshStoredEvents);
    window.addEventListener("dd-events-updated", refreshStoredEvents);
    window.addEventListener("focus", refreshStoredEvents);
    return () => {
      window.removeEventListener("storage", refreshStoredEvents);
      window.removeEventListener("dd-events-updated", refreshStoredEvents);
      window.removeEventListener("focus", refreshStoredEvents);
    };
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#evento-principal") return;

    const id = window.setTimeout(() => {
      document
        .getElementById("evento-principal")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    setCountdown(getCountdown(new Date(nextEventTimestamp)));
    const id = setInterval(
      () => setCountdown(getCountdown(new Date(nextEventTimestamp))),
      1000,
    );
    return () => clearInterval(id);
  }, [nextEventTimestamp]);

  const heroRef = useHeroReveal();
  const countdownRef = useReveal();
  const pastStatsRef = useReveal();

  const countEvents = useCountUp(allCalendarEvents.length || 7);
  const countCities = useCountUp(
    new Set(allCalendarEvents.map((event) => event.location).filter(Boolean))
      .size || 5,
  );
  const countSpots = useCountUp(1450);

  const filteredGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return calendarGroups
      .map((group) => {
        const events = group.events.filter((event) => {
          const combinedText =
            `${event.eyebrow} ${event.title} ${event.titleSerif ?? ""} ${event.description} ${event.date} ${event.location}`.toLowerCase();
          const formatMatch =
            activeFormat === "Todos" ||
            combinedText.includes(activeFormat.toLowerCase());
          const monthMatch =
            activeMonth === "Todo el año" ||
            group.month.toLowerCase().startsWith(activeMonth.toLowerCase()) ||
            event.date.toLowerCase().includes(activeMonth.toLowerCase());
          const cityMatch =
            activeCity === "Todas" ||
            event.location.toLowerCase().includes(activeCity.toLowerCase()) ||
            combinedText.includes(activeCity.toLowerCase());
          const queryMatch =
            !normalizedQuery || combinedText.includes(normalizedQuery);

          return formatMatch && monthMatch && cityMatch && queryMatch;
        });

        return { ...group, events };
      })
      .filter((group) => group.events.length > 0);
  }, [activeCity, activeFormat, activeMonth, calendarGroups, query]);

  const totalEvents = calendarGroups.reduce(
    (total, group) => total + group.events.length,
    0,
  );
  const shownEvents = filteredGroups.reduce(
    (total, group) => total + group.events.length,
    0,
  );

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 pb-16 pt-16 sm:px-8 lg:px-0 lg:pb-[68px] lg:pt-[90px]">
          <div className="flex items-center justify-between border-b border-cream-400 pb-7 text-[10px] uppercase tracking-[0.24em] text-ink-400">
            <p>- Calendario 2026 · Vol. I</p>
            <p className="hidden sm:block">
              Última actualización · 21 Mayo 2026
            </p>
          </div>

          <div ref={heroRef} className="hero-reveal pt-12">
            <h1 className="events-calendar-hero max-w-[760px] font-serif font-normal leading-[0.77] tracking-[-0.065em]">
              <span className="line-mask">
                <span>Diego en</span>
              </span>
              <span className="line-mask italic-late italic tracking-[-0.075em]">
                <span>escena.</span>
              </span>
            </h1>
          </div>

          <div className="grid gap-10 pt-16 lg:grid-cols-[420px_minmax(0,540px)] lg:items-end lg:justify-between">
            <p className="max-w-[430px] text-[17px] leading-[1.5] tracking-[-0.01em] text-ink-600">
              Quince eventos a lo largo del año, en formato presencial y online.
              Cumbres, talleres y formaciones intensivas para empresarios
              mexicanos que deciden tomar el control de su estrategia fiscal.
            </p>

            <div
              ref={countdownRef}
              className="stagger-grid grid grid-cols-3 border border-cream-400 bg-cream-100"
            >
              {(
                [
                  [countEvents, "Eventos\nen 2026"],
                  [countCities, "Ciudades\nsede"],
                  [countSpots, "Cupos\ntotales"],
                ] as const
              ).map(([ref, label], i) => (
                <div
                  key={label}
                  data-s={String(i)}
                  className="min-h-[100px] border-r border-cream-400 px-3 py-5 last:border-r-0 sm:min-h-[132px] sm:px-6 sm:py-7 lg:px-8"
                >
                  <p className="font-serif text-[32px] font-normal leading-none tracking-[-0.055em] sm:text-[40px] lg:text-[46px]">
                    <span ref={ref} />
                  </p>
                  <p className="mt-3 whitespace-pre-line text-[9px] uppercase leading-[1.35] tracking-[0.22em] text-ink-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="evento-principal" className="scroll-mt-[98px] bg-[#080808] text-white">
        <div className="mx-auto grid max-w-[1184px] items-center gap-12 px-5 py-[84px] sm:px-8 lg:grid-cols-[minmax(360px,480px)_minmax(0,610px)] lg:gap-20 lg:px-0 lg:py-[112px]">
          <div className="mx-auto flex w-full max-w-[480px] items-center justify-center border border-white/10 bg-[#101010] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.34)] sm:p-4 lg:mx-0">
            <Placeholder
              src={nextEvent?.image}
              alt={nextEvent?.title}
              className="aspect-square w-full object-center text-white/28"
            />
          </div>
          <div className="flex flex-col justify-center lg:pt-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
              - {featuredEvent ? "Evento principal" : "Próximo evento"} · 01 de {String(totalEvents).padStart(2, "0")}
            </p>
            <h2 className="events-calendar-feature mt-7 max-w-[600px] font-serif font-normal leading-[0.81] tracking-[-0.06em]">
              {nextEvent?.title ?? "Próximo"}
              <span className="block italic tracking-[-0.07em]">
                {nextEvent?.titleSerif ?? "evento"}
              </span>
            </h2>
            <p className="mt-8 max-w-[560px] text-[16px] leading-[1.55] tracking-[-0.01em] text-white/68">
              {nextEvent?.description ??
                "Un día intensivo para empresarios que quieren rediseñar su estrategia fiscal antes del cierre de año."}
            </p>

            <div className="mt-9 grid max-w-[460px] grid-cols-2 border border-white/15">
              {[
                ["Fecha", nextEvent?.date ?? "Por definir"],
                ["Sede", nextEvent?.location ?? "Por definir"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-r border-white/15 px-6 py-5 last:border-r-0"
                >
                  <p className="text-[9px] uppercase tracking-[0.24em] text-white/45">
                    {label}
                  </p>
                  <p className="mt-4 font-serif text-[20px] leading-none text-white">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid max-w-[360px] grid-cols-4 gap-6">
              {(
                [
                  [String(countdown.days).padStart(2, "0"), "Días"],
                  [String(countdown.hours).padStart(2, "0"), "Horas"],
                  [String(countdown.mins).padStart(2, "0"), "Min"],
                  [String(countdown.secs).padStart(2, "0"), "Seg"],
                ] as [string, string][]
              ).map(([value, label]) => (
                <div key={label}>
                  <p className="font-serif text-[42px] leading-none tracking-[-0.05em]">
                    {value}
                  </p>
                  <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                to={nextEvent?.to ?? "/eventos"}
                className="inline-flex min-h-[48px] items-center bg-cream-50 px-7 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-white"
              >
                Más información <span className="ml-3">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-cream-400 bg-cream-100">
        <div className="mx-auto max-w-[1184px] px-5 py-8 sm:px-8 lg:px-0">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-serif text-[24px] font-normal leading-none tracking-[-0.035em]">
              Encuentra tu <span className="italic">evento.</span>
            </h2>
            <p className="hidden text-[10px] uppercase tracking-[0.24em] text-ink-400 lg:block">
              - Mostrando {shownEvents} de {totalEvents} eventos · Año 2026
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[280px_260px_230px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-400">
                Formato
              </p>
              <div className="flex flex-wrap gap-2">
                {formatFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveFormat(filter)}
                    className={`min-h-[44px] cursor-pointer border px-4 text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      activeFormat === filter
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-cream-400 text-ink-600 hover:border-ink-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-400">
                Mes
              </p>
              <div className="flex flex-wrap gap-2">
                {monthFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveMonth(filter)}
                    className={`min-h-[44px] cursor-pointer border px-4 text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      activeMonth === filter
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-cream-400 text-ink-600 hover:border-ink-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-400">
                Ciudad
              </p>
              <div className="flex flex-wrap gap-2">
                {cityFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setActiveCity(filter)}
                    className={`min-h-[44px] cursor-pointer border px-4 text-[9px] uppercase tracking-[0.16em] transition-colors ${
                      activeCity === filter
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-cream-400 text-ink-600 hover:border-ink-900"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-ink-400">
                Buscar
              </p>
              <div className="flex items-center gap-5">
                <input
                  aria-label="Buscar evento"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="min-h-[42px] w-full border border-cream-400 bg-cream-50 px-5 text-[14px] text-ink-700 outline-none transition-colors placeholder:text-ink-400 focus:border-ink-900"
                  placeholder="Nombre, ciudad, fecha..."
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveFormat(formatFilters[0]);
                    setActiveMonth(monthFilters[0]);
                    setActiveCity(cityFilters[0]);
                    setQuery("");
                  }}
                  className="shrink-0 cursor-pointer text-[10px] uppercase tracking-[0.2em] text-ink-500 underline underline-offset-4 hover:text-ink-900"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-50">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14 lg:px-0 lg:py-20">
          <div className="grid items-start gap-5 border-b border-cream-400 pb-7 md:grid-cols-[120px_minmax(0,1fr)_230px] md:gap-0 md:pb-10">
            <p className="text-[12px] uppercase leading-[1.35] tracking-[0.22em] text-ink-400">
              02 /<br />
              Calendario
            </p>
            <h2 className="events-agenda-title max-w-[680px] font-normal leading-[0.9] tracking-[-0.06em]">
              Siete escenarios.
              <span className="block">
                Un solo{" "}
                <span className="font-serif italic tracking-[-0.07em]">
                  estratega.
                </span>
              </span>
            </h2>
            <Link
              to="/contacto"
              className="mt-5 hidden justify-self-end border-b border-ink-900 pb-1 text-[11px] uppercase tracking-[0.18em] text-ink-500 hover:text-ink-900 md:inline-flex"
            >
              Suscríbete al calendario →
            </Link>
          </div>

          <div className="divide-y divide-cream-400">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => {
                return (
                  <div
                    key={group.month}
                    className="grid gap-5 py-8 sm:gap-7 sm:py-10 lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-10 lg:py-12"
                  >
                    <div className="flex items-start justify-between gap-5 lg:block">
                      <p className="text-[11px] uppercase tracking-[0.22em] text-ink-300">
                        Mes / 2026
                      </p>
                      <h3 className="events-agenda-month mt-0 whitespace-pre-line text-right font-serif italic leading-[1.04] tracking-[-0.042em] lg:mt-5 lg:text-left">
                        {group.month.replace(" ", "\n")}
                      </h3>
                    </div>

                    <div className="min-w-0">
                      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
                        {group.events.map((event) => (
                          <AgendaCard
                            key={`${group.month}-${event.title}`}
                            event={event}
                            compact
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="border border-cream-400 bg-cream-100 px-6 py-10 text-[16px] text-ink-500">
                No encontramos eventos con esos filtros. Prueba limpiar la
                búsqueda.
              </div>
            )}
          </div>

          <div className="hidden gap-9 border-t border-cream-400 py-16 lg:grid lg:grid-cols-2 lg:gap-12">
            <AgendaPanel>
              <p className="text-[12px] uppercase tracking-[0.2em] text-ink-400">
                25 Sep · Workshop
              </p>
              <h3 className="events-agenda-panel-title mt-8 max-w-[600px] font-serif leading-[1.04] tracking-[-0.044em]">
                ¿Eres <span className="italic">despacho?</span>
              </h3>
              <p className="mt-7 max-w-[560px] text-[16px] leading-[1.6] text-ink-500">
                Una formación para firmas que quieren dejar de operar desde
                urgencias fiscales.
              </p>
              <a
                href={whatsappHref(
                  ctaSettings.salesPhone,
                  "Hola Diego estoy navegando tu sitio web y tengo una duda",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-9 inline-flex min-h-[44px] w-fit items-center border border-ink-900 px-6 text-[11px] uppercase tracking-[0.16em]"
              >
                Habla con ventas →
              </a>
            </AgendaPanel>

            <AgendaPanel>
              <p className="text-[12px] uppercase tracking-[0.2em] text-ink-400">
                Lista de espera
              </p>
              <h3 className="events-agenda-small-panel-title mt-7 max-w-[360px] font-serif leading-[1.08] tracking-[-0.04em]">
                ¿Te interesa el siguiente{" "}
                <span className="italic">cohort?</span>
              </h3>
              <p className="mt-6 max-w-[350px] text-[14px] leading-[1.6] text-ink-500">
                Cuéntanos qué estás aplicando en 2026 y abrimos cupos
                prioritarios.
              </p>
              <a
                href={whatsappHref(
                  ctaSettings.waitlistPhone,
                  "Hola Diego estoy navegando tu sitio web y tengo una duda",
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex min-h-[44px] w-fit items-center border border-ink-900 px-5 text-[10px] uppercase tracking-[0.16em]"
              >
                Apúntame →
              </a>
            </AgendaPanel>
          </div>
        </div>
      </section>

      {SHOW_PAST_EDITIONS_SECTION ? (
        <section className="border-t border-cream-400 bg-cream-100">
          <div className="mx-auto grid max-w-[1360px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.86fr_1fr] lg:px-10">
            <div className="grid grid-cols-2 border border-cream-400">
              {[eventPersonaFisicaMoral, eventTallerFiscal, eventBeneficiosRegimen, eventRevisionEstrategica].map((image, index) => (
                <div key={index} className="border border-cream-400 bg-[#101010] p-2">
                  <Placeholder
                    src={image}
                    alt={`Edición pasada ${index + 1} de eventos Diego Díaz`}
                    className="aspect-square w-full"
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-400">
                03 / Ediciones pasadas
              </p>
              <h2 className="events-past-title mt-8 max-w-[590px] font-normal leading-[0.96] tracking-[-0.055em]">
                23 ediciones.
                <span className="block">
                  +5,800{" "}
                  <span className="font-serif italic tracking-[-0.07em]">
                    empresarios
                  </span>
                </span>
                <span className="block">en la sala.</span>
              </h2>
              <p className="mt-7 max-w-[560px] text-[14px] leading-[1.55] text-ink-500">
                Desde 2020, Diego ha formado empresarios en fiscalidad, liderazgo,
                cultura y dirección. Eventos con criterio, comunidad y resultados
                medibles.
              </p>
              <div
                ref={pastStatsRef}
                className="stagger-grid mt-9 grid max-w-[560px] grid-cols-3 border border-cream-400 bg-cream-50"
              >
                {pastStats.map(([value, label], i) => (
                  <div
                    key={label}
                    data-s={String(i)}
                    className="border-r border-cream-400 px-5 py-5 last:border-r-0"
                  >
                    <p className="text-[28px] leading-none tracking-[-0.04em]">
                      {value}
                    </p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-ink-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/eventos/estrategia-fiscal"
                  className="inline-flex min-h-[44px] items-center border border-ink-900 px-6 text-[10px] uppercase tracking-[0.2em]"
                >
                  Ver siguiente
                </Link>
                <Link
                  to="/contacto"
                  className="inline-flex min-h-[44px] items-center border border-cream-400 px-6 text-[10px] uppercase tracking-[0.2em] text-ink-500"
                >
                  Ser notificado
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#0b0b0b] text-white">
        <div className="mx-auto flex min-h-[440px] max-w-[1320px] flex-col items-center justify-center px-5 py-20 text-center sm:px-8 lg:min-h-[780px] lg:py-24 lg:px-10">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/28">
            04 / Voces de asistentes
          </p>
          <blockquote className="events-quote mx-auto mt-10 max-w-[1120px] font-serif font-normal leading-[1.05] tracking-[-0.045em] text-[#f3f0ea]">
            "Fui pensando que sería <span className="italic">otro</span>
            <span className="block italic">curso de impuestos.</span>
            <span className="block">Salí con una estrategia clara,</span>
            <span className="block">un plan a 90 días</span>
            <span className="block">y la calma de saber que estoy</span>
            <span className="block italic">haciéndolo bien."</span>
          </blockquote>
          <div className="mt-16 text-[10px] uppercase leading-[1.8] tracking-[0.22em] text-white/34">
            <p>- Patricia Salazar</p>
            <p>CEO · Distribuidora del Bajío · Edición Querétaro 2025</p>
          </div>
        </div>
      </section>

      <section className="border-t border-cream-400 bg-cream-50">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[360px_minmax(0,760px)] lg:gap-[132px] lg:px-10 lg:py-[136px]">
          <aside className="lg:pt-2">
            <p className="text-[10px] uppercase leading-[1.45] tracking-[0.24em] text-ink-400">
              05 /<span className="block">Preguntas</span>
            </p>
            <h2 className="events-faq-title mt-10 font-normal leading-[0.9] tracking-[-0.052em]">
              Preguntas
              <span className="block">que</span>
              <span className="block font-serif italic tracking-[-0.065em]">
                siempre
              </span>
              <span className="block">recibimos.</span>
            </h2>
            <p className="mt-8 max-w-[315px] text-[15px] leading-[1.58] text-ink-500">
              Lo que un empresario quiere saber antes de comprometer su agenda,
              su equipo y su inversión. Si tu pregunta no está aquí, escríbenos
              por WhatsApp.
            </p>
            <a
              href={whatsappHref(
                ctaSettings.salesPhone,
                "Hola Diego estoy navegando tu sitio web y tengo una duda",
              )}
              target="_blank"
              rel="noreferrer"
              className="mt-9 inline-flex min-h-[54px] items-center border border-ink-900 px-7 text-[11px] uppercase tracking-[0.18em] text-ink-900 transition-colors hover:bg-ink-900 hover:text-white"
            >
              WhatsApp directo <span className="ml-3">→</span>
            </a>
          </aside>

          <div className="border-t border-cream-400">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div key={faq.question} className="border-b border-cream-400">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? -1 : index)}
                    className="grid min-h-[86px] w-full cursor-pointer grid-cols-[44px_minmax(0,1fr)_28px] items-center gap-6 py-5 text-left transition-colors hover:text-ink-600"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif text-[16px] italic leading-none text-ink-300">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[22px] leading-[1.2] tracking-[-0.028em] text-ink-900">
                      {faq.question.includes("presenciales u online") ? (
                        <>
                          ¿Los eventos son{" "}
                          <span className="font-serif italic">
                            presenciales
                          </span>{" "}
                          u online?
                        </>
                      ) : faq.question.includes("política de cambios") ? (
                        <>
                          ¿Cuál es la política de{" "}
                          <span className="font-serif italic">
                            cambios y cancelaciones?
                          </span>
                        </>
                      ) : faq.question.includes("todo el evento") ? (
                        <>
                          ¿Diego está presente en{" "}
                          <span className="font-serif italic">todo</span> el
                          evento?
                        </>
                      ) : (
                        faq.question
                      )}
                    </span>
                    <span className="text-right text-[24px] font-light leading-none text-ink-700">
                      {isOpen ? "×" : "+"}
                    </span>
                  </button>
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[650px] pb-8 pl-10 pr-5 text-[14px] leading-[1.72] text-ink-500 lg:pl-[70px] lg:pr-10">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-cream-400 bg-cream-100 text-center">
        <div className="mx-auto flex min-h-[420px] max-w-[1040px] flex-col items-center justify-center px-5 py-20 sm:px-8 lg:min-h-[680px] lg:py-24">
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-400">
            06 / Cierre
          </p>
          <h2 className="events-cta-title mt-8 max-w-[940px] font-serif font-normal leading-[0.96] tracking-[-0.055em]">
            El año fiscal <span className="italic tracking-[-0.065em]">no</span>
            <span className="block">espera. Reserva</span>
            <span className="block">tu próximo escenario.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[540px] text-[17px] leading-[1.55] tracking-[-0.01em] text-ink-500">
            El próximo evento abre el calendario. Cada edición tiene cupos
            limitados y Diego no improvisa fechas adicionales. Si tu agenda lo
            permite, reserva ahora.
          </p>
          <div className="mt-12 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <Link
              to={nextEvent?.to ?? "/eventos/estrategia-fiscal"}
              className="inline-flex min-h-[58px] items-center justify-center border border-ink-900 bg-ink-900 px-9 text-[11px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-transparent hover:text-ink-900"
            >
              Reservar próximo evento <span className="ml-3">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
