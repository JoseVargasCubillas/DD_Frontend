/**
 * Catálogo de flyers de eventos empaquetados en el sitio.
 *
 * El admin guarda en la BD una clave estable (`flyer:evento-holding`) en vez de
 * la URL del bundle (`/assets/evento-holding-C2Im5D_p.png`), porque el hash
 * cambia en cada build y esas rutas quedan rotas. `resolveEventThumbnail`
 * acepta la clave nueva, las URLs hasheadas antiguas (las repara por nombre)
 * y URLs externas/subidas (las deja tal cual).
 */
import eventPersonaFisicaMoral from '../../assets/eventos/evento-persona-fisica-moral.webp';
import eventMentalidadEmpresarial from '../../assets/eventos/evento-mentalidad-empresarial.webp';
import eventSistemaProspeccion from '../../assets/eventos/evento-sistema-prospeccion-digital.webp';
import eventTallerFiscal from '../../assets/eventos/evento-taller-estrategia-fiscal.webp';
import eventMastermindPanama from '../../assets/eventos/evento-mastermind-panama.webp';
import eventHolding from '../../assets/eventos/evento-holding.webp';
import eventFiscalCdmx from '../../assets/eventos/evento-estrategia-fiscal-cdmx.webp';
import eventCoaching from '../../assets/eventos/evento-coaching-liderazgo.webp';
import eventFiscalMonterrey from '../../assets/eventos/evento-estrategia-fiscal-monterrey.webp';
import eventRockefeller from '../../assets/eventos/evento-rockefeller.webp';
import eventRockefellerAlt from '../../assets/eventos/evento-rockefeller-alt.webp';
import eventMaestriaEscenica from '../../assets/eventos/evento-maestria-escenica.webp';
import eventBeneficiosRegimen from '../../assets/eventos/evento-beneficios-regimen-fiscal.webp';
import eventRevisionEstrategica from '../../assets/eventos/evento-revision-estrategica-cdmx.webp';
import event48a40Horas from '../assets/eventos/evento-48-a-40-horas.webp';
import eventTableroCeo from '../assets/eventos/evento-tablero-del-ceo.webp';
import eventReformaFiscal2027 from '../assets/eventos/evento-reforma-fiscal-2027.webp';

export const FLYER_PREFIX = 'flyer:';

export interface EventFlyer {
  /** Nombre del archivo sin extensión; es lo que se persiste como `flyer:<key>`. */
  key: string;
  label: string;
  src: string;
}

export const EVENT_FLYERS: EventFlyer[] = [
  { key: 'evento-persona-fisica-moral', label: 'Persona física a moral', src: eventPersonaFisicaMoral },
  { key: 'evento-mentalidad-empresarial', label: 'Mentalidad empresarial', src: eventMentalidadEmpresarial },
  { key: 'evento-sistema-prospeccion-digital', label: 'Prospección digital', src: eventSistemaProspeccion },
  { key: 'evento-taller-estrategia-fiscal', label: 'Taller estrategia fiscal', src: eventTallerFiscal },
  { key: 'evento-mastermind-panama', label: 'Mastermind Panamá', src: eventMastermindPanama },
  { key: 'evento-holding', label: 'Holding', src: eventHolding },
  { key: 'evento-estrategia-fiscal-cdmx', label: 'Estrategia fiscal CDMX', src: eventFiscalCdmx },
  { key: 'evento-coaching-liderazgo', label: 'Coaching liderazgo', src: eventCoaching },
  { key: 'evento-estrategia-fiscal-monterrey', label: 'Estrategia fiscal Monterrey', src: eventFiscalMonterrey },
  { key: 'evento-rockefeller', label: 'Código Rockefeller', src: eventRockefeller },
  { key: 'evento-rockefeller-alt', label: 'Código Rockefeller alternativa', src: eventRockefellerAlt },
  { key: 'evento-maestria-escenica', label: 'Maestría escénica', src: eventMaestriaEscenica },
  { key: 'evento-beneficios-regimen-fiscal', label: 'Beneficios régimen fiscal', src: eventBeneficiosRegimen },
  { key: 'evento-revision-estrategica-cdmx', label: 'Revisión estratégica CDMX', src: eventRevisionEstrategica },
  { key: 'evento-48-a-40-horas', label: 'De 48 a 40 horas', src: event48a40Horas },
  { key: 'evento-tablero-del-ceo', label: 'El Tablero del CEO', src: eventTableroCeo },
  { key: 'evento-reforma-fiscal-2027', label: 'Reforma Fiscal 2027', src: eventReformaFiscal2027 },
];

const flyerByKey = new Map(EVENT_FLYERS.map((f) => [f.key, f]));
const flyerBySrc = new Map(EVENT_FLYERS.map((f) => [f.src, f]));

export const flyerRef = (key: string): string => `${FLYER_PREFIX}${key}`;

/** Clave estable para una imagen del catálogo (por src del bundle o por clave). */
export const toFlyerRef = (value: string): string => {
  if (!value) return value;
  if (value.startsWith(FLYER_PREFIX)) return value;
  const byBundleSrc = flyerBySrc.get(value);
  if (byBundleSrc) return flyerRef(byBundleSrc.key);
  const hashed = matchHashedAsset(value);
  return hashed ? flyerRef(hashed.key) : value;
};

// `/assets/evento-holding-C2Im5D_p.png` → flyer `evento-holding` (hash de Vite: 8 chars [A-Za-z0-9_-]).
const matchHashedAsset = (value: string): EventFlyer | undefined => {
  const m = value.match(/\/assets\/(evento-[a-z0-9-]+?)-[A-Za-z0-9_-]{8}\.(?:png|jpe?g|webp)(?:\?.*)?$/i);
  return m ? flyerByKey.get(m[1].toLowerCase()) : undefined;
};

/**
 * Convierte lo guardado en `event.thumbnail` a una URL que sí carga.
 * Devuelve '' si no hay imagen utilizable (el consumidor decide el fallback).
 */
export const resolveEventThumbnail = (thumbnail?: string | null): string => {
  const value = (thumbnail ?? '').trim();
  if (!value) return '';
  if (value.startsWith(FLYER_PREFIX)) {
    return flyerByKey.get(value.slice(FLYER_PREFIX.length))?.src ?? '';
  }
  const hashed = matchHashedAsset(value);
  if (hashed) return hashed.src;
  return value;
};
