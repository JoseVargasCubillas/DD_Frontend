import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as eventsApi from '@api/events.api';
import Spinner from '@atoms/Spinner';
import { formatDate, formatCurrency } from '@utils/formatters';
import type { Event as SiteEvent } from '@t/index';

const EVENT_STORAGE_KEY = 'dd-admin-events';

function loadStoredEvent(slug: string | undefined): SiteEvent | null {
  if (!slug) return null;
  try {
    const raw = window.localStorage.getItem(EVENT_STORAGE_KEY);
    const events = (raw ? JSON.parse(raw) : []) as SiteEvent[];
    return events.find((e) => e.slug === slug) ?? null;
  } catch {
    return null;
  }
}

const MODALITY: Record<SiteEvent['modality'], string> = {
  'in-person': 'Presencial',
  online: 'Online',
  hybrid: 'Hibrido',
};

const TYPE: Record<SiteEvent['type'], string> = {
  seminar: 'Seminario',
  workshop: 'Taller',
  webinar: 'Webinar',
  conference: 'Conferencia',
};

// Derive computed values outside JSX to avoid TS 5.9 TSX parser issues
function deriveInfo(ev: SiteEvent) {
  const sd = new Date(ev.startDate);
  const ed = new Date(ev.endDate);
  const sameDay = sd.toDateString() === ed.toDateString();

  const dateLabel = sameDay
    ? formatDate(ev.startDate, 'EEEE dd MMMM yyyy')
    : formatDate(ev.startDate, 'dd MMM') + ' al ' + formatDate(ev.endDate, 'dd MMM yyyy');

  const timeLabel = sameDay
    ? formatDate(ev.startDate, 'HH:mm') + ' - ' + formatDate(ev.endDate, 'HH:mm')
    : '';

  const isFree = ev.price === 0;
  const spotsLeft = ev.capacity > 0 ? ev.capacity - ev.registeredCount : null;
  const soldOut = spotsLeft !== null && spotsLeft <= 0;
  const isOnline = ev.modality === 'online';
  const locationText = isOnline ? 'Sesion en linea' : ev.location || 'Por confirmar';
  const displayPrice = ev.salePrice != null && ev.salePrice > 0 ? ev.salePrice : ev.price;
  const priceLabel = isFree ? 'Gratuito' : formatCurrency(displayPrice);
  const eventId = ev._id || ev.id || '';
  const ctaLink = (!isFree && eventId) ? '/checkout?event=' + eventId : undefined;
  const hasAgenda = Array.isArray(ev.agenda) && ev.agenda.length > 0;

  return { dateLabel, timeLabel, locationText, priceLabel, isFree, spotsLeft, soldOut, ctaLink, hasAgenda };
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-r border-cream-300 px-5 py-4 last:border-r-0">
      <span className="text-[9px] uppercase tracking-[0.22em] text-ink-300">{label}</span>
      <span className="text-[13px] font-semibold">{value}</span>
    </div>
  );
}

interface CtaProps { registered: boolean; soldOut: boolean; loading: boolean; ctaLink: string | undefined; dark: boolean; onRegister: () => void; }

function CtaBtn(p: CtaProps) {
  const b = 'inline-flex h-[48px] min-w-[200px] items-center justify-center gap-2 px-8 text-[11px] font-bold uppercase tracking-[0.2em] transition-colors';
  const filled = p.dark ? b + ' bg-white text-ink-900 hover:bg-cream-100' : b + ' bg-ink-900 text-white hover:bg-ink-700';
  const outline = p.dark ? b + ' border border-white text-white hover:bg-white hover:text-ink-900' : b + ' border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-white';
  if (p.registered) {
    return (
      <span className={filled}>
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Registrado
      </span>
    );
  }
  if (p.soldOut) { return <Link to="/contacto" className={outline}>Lista de espera</Link>; }
  if (p.ctaLink) { return <Link to={p.ctaLink} className={filled}>Comprar entrada</Link>; }
  const label = p.loading ? 'Enviando...' : 'Registrarme gratis';
  return <button type="button" onClick={p.onRegister} className={filled}>{label}</button>;
}

export default function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();
  const [registered, setRegistered] = useState(false);

  const localEvent = useMemo(() => loadStoredEvent(slug), [slug]);
  const { data: apiEvent, isLoading } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventsApi.getEventBySlug(slug!),
    enabled: Boolean(slug) && !localEvent,
    staleTime: 300_000,
  });

  const event: SiteEvent | null = localEvent ?? apiEvent ?? null;
  const info = useMemo(() => (event ? deriveInfo(event) : null), [event]);

  const registerMutation = useMutation({
    mutationFn: () => eventsApi.registerToEvent(event!._id ?? event!.id!),
    onSuccess: () => { setRegistered(true); queryClient.invalidateQueries({ queryKey: ['event', slug] }); },
  });

  const handleRegister = () => { registerMutation.mutate(); };

  if (isLoading && !event) {
    return <div className="flex min-h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  }

  if (!event || !info) {
    return (
      <div className="container-app py-24 text-center">
        <p className="font-serif text-[24px] italic text-ink-300">Evento no encontrado.</p>
        <Link to="/eventos" className="mt-8 inline-block text-[11px] uppercase tracking-[0.2em] text-ink-500 underline underline-offset-4">
          Ver todos los eventos
        </Link>
      </div>
    );
  }

  const { dateLabel, timeLabel, locationText, priceLabel, spotsLeft, soldOut, ctaLink, hasAgenda } = info;

  const infoCells = [
    { label: 'Fecha', value: dateLabel },
    timeLabel ? { label: 'Horario', value: timeLabel } : null,
    { label: 'Lugar', value: locationText },
    { label: 'Precio', value: priceLabel },
    spotsLeft !== null ? { label: 'Lugares', value: soldOut ? 'Agotado' : spotsLeft + ' disponibles' } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const detailRows = [
    { label: 'Tipo', value: TYPE[event.type] },
    { label: 'Modalidad', value: MODALITY[event.modality] },
    event.location ? { label: 'Ubicacion', value: event.location } : null,
    { label: 'Inicio', value: formatDate(event.startDate, 'dd MMMM yyyy - HH:mm') },
    { label: 'Cierre', value: formatDate(event.endDate, 'dd MMMM yyyy - HH:mm') },
    event.registeredCount > 0 ? { label: 'Registrados', value: event.registeredCount + ' personas' } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const ctaP: CtaProps = { registered, soldOut, loading: registerMutation.isPending, ctaLink, dark: false, onRegister: handleRegister };

  return (
    <div className="bg-cream-50 text-ink-900">

      {/* Hero */}
      <section className="border-b border-cream-400 bg-cream-200">
        <div className="container-app py-12 lg:py-16">
          <div className="mb-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-ink-400">
            <Link to="/eventos" className="hover:text-ink-900">Eventos</Link>
            <span>/</span>
            <span>{TYPE[event.type]}</span>
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start">
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                <span className="border border-ink-900/30 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-ink-500">{TYPE[event.type]}</span>
                <span className="border border-ink-900/30 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-ink-500">{MODALITY[event.modality]}</span>
                {event.isFeatured && <span className="bg-ink-900 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-white">Destacado</span>}
              </div>
              <h1 className="text-[clamp(36px,6vw,80px)] font-bold leading-[0.88] tracking-[-0.035em]">{event.title}</h1>
              {event.shortDescription && (
                <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-ink-600">{event.shortDescription}</p>
              )}
              <div className="mt-8 grid grid-cols-2 border border-cream-400 bg-white sm:grid-cols-4">
                {infoCells.map((c) => <InfoCell key={c.label} label={c.label} value={c.value} />)}
              </div>
              <div className="mt-8 lg:hidden"><CtaBtn {...ctaP} /></div>
            </div>

            <div className="lg:sticky lg:top-24">
              {event.thumbnail
                ? <img src={event.thumbnail} alt={event.title} className="aspect-[4/3] w-full object-cover" />
                : <div className="flex aspect-[4/3] w-full items-center justify-center bg-ink-200 text-[10px] uppercase tracking-[0.24em] text-ink-300">Imagen proxima</div>
              }
              <div className="mt-5 hidden border border-cream-400 bg-white p-6 lg:block">
                <div className="mb-5 flex items-end justify-between">
                  <p className="font-serif text-[38px] italic leading-none tracking-[-0.05em]">{priceLabel}</p>
                  {spotsLeft !== null && !soldOut && (
                    <p className="text-[11px] uppercase tracking-[0.16em] text-ink-400">{spotsLeft} lugares</p>
                  )}
                </div>
                <CtaBtn {...ctaP} />
                <p className="mt-3 text-center text-[10px] uppercase tracking-[0.16em] text-ink-300">Sin cargos ocultos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Descripcion */}
      {event.description && (
        <section className="border-b border-cream-400 bg-cream-50">
          <div className="container-app py-14 lg:py-18">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
              <div>
                <p className="section-label mb-7">Acerca del evento</p>
                <div className="space-y-4">
                  {event.description.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-[16px] leading-relaxed text-ink-600">{para}</p>
                  ))}
                </div>
              </div>
              <aside className="border border-cream-400 bg-white">
                {detailRows.map((row, i) => (
                  <div key={row.label} className={i < detailRows.length - 1 ? 'border-b border-cream-300 px-6 py-4' : 'px-6 py-4'}>
                    <p className="text-[9px] uppercase tracking-[0.22em] text-ink-300">{row.label}</p>
                    <p className="mt-1 text-[14px] font-semibold">{row.value}</p>
                  </div>
                ))}
              </aside>
            </div>
          </div>
        </section>
      )}

      {/* Agenda */}
      {hasAgenda && (
        <section className="border-b border-cream-400 bg-cream-100">
          <div className="container-app py-14 lg:py-18">
            <p className="section-label mb-9">Agenda del evento</p>
            <div className="max-w-[720px] divide-y divide-cream-400 border-y border-cream-400">
              {event.agenda.map((item, i) => (
                <div key={i} className="grid grid-cols-[100px_minmax(0,1fr)] gap-6 py-5">
                  <span className="pt-0.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-ink-400">{item.time}</span>
                  <div>
                    <p className="text-[16px] font-semibold">{item.topic}</p>
                    {item.speaker && <p className="mt-1 text-[12px] uppercase tracking-[0.14em] text-ink-400">{item.speaker}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="bg-ink-900 text-white">
        <div className="container-app py-16 lg:py-20">
          <div className="flex flex-col items-center text-center">
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">Reserva tu lugar</p>
            <h2 className="mx-auto mt-6 max-w-[560px] font-serif text-[clamp(32px,5vw,60px)] font-normal leading-[0.92] tracking-[-0.055em]">
              {soldOut ? 'Este evento esta agotado.' : 'No pierdas tu lugar.'}
            </h2>
            {!soldOut && <p className="mt-4 text-[15px] text-white/50">{dateLabel} - {locationText}</p>}
            <div className="mt-10"><CtaBtn {...ctaP} dark /></div>
            <Link to="/eventos" className="mt-6 text-[10px] uppercase tracking-[0.22em] text-white/35 underline underline-offset-4 hover:text-white/60">
              Ver todos los eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
