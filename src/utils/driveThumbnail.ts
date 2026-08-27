// Google Drive URL helper para portadas/imágenes.
//
// Google fue rotando qué endpoints sirven imágenes hotlinkeables desde <img>:
//  - `https://drive.google.com/uc?id=FILE_ID`           -> DEPRECATED, ahora redirige a un
//                                                          interstitial de "Descargar" en vez
//                                                          de servir el binario.
//  - `https://drive.google.com/file/d/FILE_ID/view`      -> es HTML, no imagen.
//  - `https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600`
//                                                       -> SIRVE la miniatura (jpg) OK.
//  - `https://lh3.googleusercontent.com/d/FILE_ID=w1600` -> alterna CDN (a veces falla en
//                                                          cross-origin, así que la usamos
//                                                          solo como fallback).
//
// Este helper toma CUALQUIER URL de Drive y devuelve la variante `thumbnail?id=...`
// que sí carga en <img>. Deja pasar URLs no-Drive intactas.

const DRIVE_FILE_ID_REGEXES: RegExp[] = [
  /\/file\/d\/([a-zA-Z0-9_-]{10,})/i,        // .../file/d/FILE_ID/...
  /[?&]id=([a-zA-Z0-9_-]{10,})/i,             // ?id=FILE_ID  o  &id=FILE_ID
  /\/d\/([a-zA-Z0-9_-]{10,})/i,               // .../d/FILE_ID/...
  /googleusercontent\.com\/d\/([a-zA-Z0-9_-]{10,})/i,
];

function extractDriveFileId(url: string): string | null {
  for (const re of DRIVE_FILE_ID_REGEXES) {
    const m = url.match(re);
    if (m?.[1]) return m[1];
  }
  return null;
}

/**
 * Devuelve una URL que sí carga como `<img src>`. Para Google Drive
 * fuerza el endpoint `thumbnail?id=FILE_ID&sz=w{size}` (el único que
 * sigue sirviendo miniatura hotlinkeable). Si no es Drive, devuelve
 * la URL sin cambios. Si es vacía o inválida, devuelve string vacío.
 */
export function resolveThumbnailUrl(url?: string | null, size = 1600): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Data-URLs y blobs pasan tal cual.
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;

  const isDrive = /drive\.google\.com|googleusercontent\.com/i.test(trimmed);
  if (!isDrive) return trimmed;

  const fileId = extractDriveFileId(trimmed);
  if (!fileId) return trimmed;

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/** Fallback en `<img onError>`: prueba el CDN lh3 como último recurso. */
export function fallbackDriveThumbnailUrl(url?: string | null, size = 1600): string {
  if (!url) return '';
  const fileId = extractDriveFileId(url);
  if (!fileId) return '';
  return `https://lh3.googleusercontent.com/d/${fileId}=w${size}`;
}

/**
 * Handler listo para `<img onError>` que rota drive.google.com/thumbnail
 * -> lh3.googleusercontent.com. Sólo intenta el fallback una vez (usa
 * el atributo `data-drive-fallback` para evitar loops).
 */
export function onDriveThumbnailError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
) {
  const img = event.currentTarget;
  if (img.dataset.driveFallback === '1') return;
  const fb = fallbackDriveThumbnailUrl(img.src);
  if (!fb || fb === img.src) return;
  img.dataset.driveFallback = '1';
  img.src = fb;
}
