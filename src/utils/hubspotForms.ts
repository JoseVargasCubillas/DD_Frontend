/**
 * Registry central de formularios HubSpot por landing.
 *
 * Cada landing del sitio tiene su PROPIO formulario en HubSpot (portal 49215056).
 * Este archivo es la unica fuente de verdad de los form IDs — cuando quieras
 * cambiar el form de una landing, cambialo aqui.
 *
 * Uso:
 *   import { HUBSPOT_FORMS } from '@utils/hubspotForms';
 *   <HubspotForm portalId={HUBSPOT_FORMS.holding.portalId} formId={HUBSPOT_FORMS.holding.formId} />
 *
 * Entries con `landing: null` estan RESERVADAS: el form existe en HubSpot pero
 * su landing aun no se ha construido. NO borrar — cuando se cree la landing,
 * asignar la ruta y consumirla en el nuevo componente.
 */

export const HUBSPOT_PORTAL_ID = "49215056";

export type HubspotFormEntry = {
  /** ID del formulario en HubSpot (embed developer API). */
  formId: string;
  /** Portal HubSpot que aloja el form. */
  portalId: string;
  /** Region del portal. Default 'na1'. */
  region: string;
  /** Ruta de la landing que lo consume, o null si aun no tiene landing. */
  landing: string | null;
  /** URL de preview de HubSpot para revisar el form fuera del sitio. */
  previewUrl: string;
  /** Notas internas. */
  notes?: string;
};

export const HUBSPOT_FORMS = {
  emprendedorVsCeo: {
    formId: "5057ba2a-b64d-4073-967d-2c61c652dc77",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: "/eventos/emprendedor-vs-ceo",
    previewUrl: "https://taukw.share.hsforms.com/2UFe6KrZNQHOWfSxhxlLcdw",
  },
  holding: {
    formId: "559c571f-dbee-4945-81f8-1329f8d41ffe",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: "/eventos/holding",
    previewUrl: "https://taukw.share.hsforms.com/2VZxXH9vuSUWB-BMp-NQf_g",
  },
  estrategiaFiscal: {
    formId: "650e06f8-3f73-48b9-9b2c-e9d8b64dd128",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: "/eventos/estrategia-fiscal",
    previewUrl: "https://taukw.share.hsforms.com/2ZQ4G-D9zSLmbLOnYtk3RKA",
  },
  comoCobrarComoCeo: {
    formId: "c1169b79-18f9-4138-a777-d156f1b0b227",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: "/eventos/como-cobrar-como-ceo",
    previewUrl: "https://taukw.share.hsforms.com/2wRabeRj5QTind9FW8bCyJw",
  },

  // ==================================================
  // RESERVADOS — landings aun no construidas.
  // No borrar. Cuando exista la landing, poblar `landing` y consumir aqui.
  // ==================================================

  revisionEstrategica: {
    formId: "20f99a01-77b2-4622-8341-b304b5beae32",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: null,
    previewUrl: "https://taukw.share.hsforms.com/2IPmaAXeyRiKDQbMEtb6uMg",
    notes:
      "Reservado para la landing de 'Revisión estratégica'. El evento hoy solo existe como tarjeta del calendario (slug: revision-estrategica).",
  },
  rockefeller: {
    formId: "2fe02947-b452-4695-89c3-fb08c97055d2",
    portalId: HUBSPOT_PORTAL_ID,
    region: "na1",
    landing: null,
    previewUrl: "https://taukw.share.hsforms.com/2L-ApR7RSRpWJw_sIyXBV0g",
    notes:
      "Reservado para la landing de '4E Código Rockefeller'. El evento hoy solo existe como tarjeta del calendario (slug: 4e-codigo-rockefeller).",
  },
} as const satisfies Record<string, HubspotFormEntry>;

export type HubspotFormKey = keyof typeof HUBSPOT_FORMS;

/** Devuelve solo los forms que ya estan conectados a una landing. */
export const getActiveHubspotForms = (): HubspotFormEntry[] =>
  Object.values(HUBSPOT_FORMS).filter((entry) => entry.landing !== null);

/** Devuelve los forms reservados sin landing (para inventario/admin). */
export const getPendingHubspotForms = (): HubspotFormEntry[] =>
  Object.values(HUBSPOT_FORMS).filter((entry) => entry.landing === null);
