import { useEffect } from 'react';

/**
 * Embed reutilizable del HubSpot Forms Developer API.
 *
 * HubSpot inyecta su propio markup dentro de `.hs-form-html`; los estilos
 * `.dd-hs-form` alinean ese markup con el look editorial del sitio (labels
 * en caja negra, inputs con underline, botón ink → clay hover, mensajes de
 * error en italic serif). El script global se carga una sola vez por portal.
 *
 * Uso:
 *   <HubspotForm portalId="49215056" formId="559c571f-..." />
 *
 * Todos los formularios de las landings usan el mismo portal 49215056.
 */

const scriptSrc = (portalId: string) =>
  `https://js.hsforms.net/forms/embed/developer/${portalId}.js`;

const useHubspotEmbed = (portalId: string) => {
  useEffect(() => {
    const id = `hs-form-embed-${portalId}`;
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.src = scriptSrc(portalId);
    script.defer = true;
    document.body.appendChild(script);
  }, [portalId]);
};

export type HubspotFormProps = {
  portalId: string;
  formId: string;
  region?: string;
  className?: string;
};

export default function HubspotForm({
  portalId,
  formId,
  region = 'na1',
  className,
}: HubspotFormProps) {
  useHubspotEmbed(portalId);
  return (
    <>
      <div
        className={`hs-form-html dd-hs-form ${className ?? ''}`.trim()}
        data-region={region}
        data-form-id={formId}
        data-portal-id={portalId}
      />
      <style>{`
        .dd-hs-form form { display:flex; flex-direction:column; gap:22px; }
        .dd-hs-form .hs-form-field { display:flex; flex-direction:column; }
        .dd-hs-form label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #6b6258;
          margin-bottom: 8px;
        }
        .dd-hs-form .hs-form-required { color: #6b4f2a; margin-left: 4px; }
        .dd-hs-form input[type="text"],
        .dd-hs-form input[type="email"],
        .dd-hs-form input[type="tel"],
        .dd-hs-form input[type="number"],
        .dd-hs-form select,
        .dd-hs-form textarea {
          font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
          font-size: 16px;
          font-style: italic;
          color: #0a0a0a;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(10,10,10,0.25);
          border-radius: 0;
          padding: 10px 2px 12px;
          transition: border-color .25s ease;
          width: 100%;
        }
        .dd-hs-form input:focus,
        .dd-hs-form select:focus,
        .dd-hs-form textarea:focus { border-bottom-color: #0a0a0a; outline: none; }
        .dd-hs-form input::placeholder,
        .dd-hs-form textarea::placeholder { color: #6b6258; font-style: italic; }
        .dd-hs-form select {
          appearance: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%236b4f2a' d='M1 1.5 6 6.5 11 1.5'/></svg>");
          background-repeat: no-repeat;
          background-position: right 4px center;
          padding-right: 24px;
        }
        .dd-hs-form ul.hs-error-msgs { list-style: none; padding: 0; margin: 8px 0 0; }
        .dd-hs-form .hs-error-msg,
        .dd-hs-form .hs-error-msgs label {
          font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
          font-style: italic;
          font-size: 13px;
          color: #a13a1a;
          text-transform: none;
          letter-spacing: 0;
          margin: 0;
        }
        .dd-hs-form .hs-form-booleancheckbox-display,
        .dd-hs-form .legal-consent-container label {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 12px;
          letter-spacing: 0.02em;
          text-transform: none;
          color: #3a342d;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          line-height: 1.55;
        }
        .dd-hs-form input[type="checkbox"] { accent-color: #0a0a0a; margin-top: 2px; }
        .dd-hs-form .hs-submit { margin-top: 6px; }
        .dd-hs-form .hs-button, .dd-hs-form input[type="submit"] {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 56px;
          padding: 0 34px;
          background: #0a0a0a;
          color: #f5efe4;
          border: 1px solid #0a0a0a;
          border-radius: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .3s ease;
        }
        .dd-hs-form .hs-button:hover, .dd-hs-form input[type="submit"]:hover {
          background: #6b4f2a;
          border-color: #6b4f2a;
          transform: translateY(-1px);
        }
        .dd-hs-form .submitted-message {
          font-family: 'Libre Baskerville', Baskerville, Georgia, serif;
          font-size: 17px;
          line-height: 1.5;
          color: #0a0a0a;
        }
      `}</style>
    </>
  );
}
