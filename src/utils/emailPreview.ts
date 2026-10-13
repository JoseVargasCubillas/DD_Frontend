// Solo para vistas previas en el panel: Mailchimp resuelve estas etiquetas al enviar.
export const applyPreviewMergeTags = (html: string): string =>
  html
    .replace(/\*\|IF:FNAME\|\*([\s\S]*?)(?:\*\|ELSE:\|\*[\s\S]*?)?\*\|END:IF\|\*/g, '$1')
    .replace(/\*\|FNAME\|\*/g, 'Nombre')
    .replace(/\*\|LNAME\|\*/g, 'Apellido')
    .replace(/\*\|UNSUB\|\*/g, '#')
    .replace(/\*\|ARCHIVE\|\*/g, '#');

// Documento completo para un iframe `sandbox`: respeta un HTML propio y, si es
// solo un fragmento, lo envuelve con viewport y tipografía base de correo.
export const buildPreviewDocument = (html: string): string => {
  const resolved = applyPreviewMergeTags(html);
  if (/<html[\s>]/i.test(resolved)) return resolved;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2a2622;">${resolved}</body></html>`;
};
