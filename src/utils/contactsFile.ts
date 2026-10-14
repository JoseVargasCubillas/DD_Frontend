/**
 * Lee contactos (correo + nombre) desde un CSV/TSV/TXT o desde texto pegado.
 *
 * Reconoce:
 *  - Con encabezados: columnas `correo`/`email` (obligatoria), `nombre`/`name` y `apellido`.
 *  - Sin encabezados: detecta solo la columna del correo; la primera otra columna
 *    con texto se toma como nombre.
 *  - Una lista de correos separados por coma, punto y coma, espacios o saltos de línea.
 *  - El formato "Nombre <correo@dominio.com>".
 */

export interface ContactRow {
  email: string;
  name: string;
}

export interface ParsedContacts {
  valid: ContactRow[];
  // Texto de las filas que no tienen un correo válido.
  invalid: string[];
  // Correos repetidos que se ignoraron.
  duplicates: number;
  withName: number;
}

const EMAIL_RE = /^[^\s@,;<>()"']+@[^\s@,;<>()"']+\.[^\s@,;<>()"']+$/;
const ANGLE_RE = /^(.*?)\s*<\s*([^<>\s]+@[^<>\s]+)\s*>$/;

const norm = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const EMAIL_HEADERS = new Set([
  'email', 'e mail', 'mail', 'correo', 'correo electronico', 'email address', 'direccion de correo', 'e-mail address',
]);
const NAME_HEADERS = new Set([
  'nombre', 'nombres', 'name', 'first name', 'firstname', 'nombre completo', 'full name', 'fullname', 'contacto', 'cliente',
]);
const LAST_HEADERS = new Set(['apellido', 'apellidos', 'last name', 'lastname', 'surname']);

/** Quita la marca de orden de bytes que agrega Excel al exportar CSV. */
const stripBom = (text: string): string => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);

/** Elige el separador más usado en las primeras líneas (coma, punto y coma o tabulador). */
const detectDelimiter = (text: string): string => {
  const sample = text.split(/\r?\n/).filter((l) => l.trim()).slice(0, 5).join('\n');
  const counts = [',', ';', '\t'].map((d) => ({ d, n: sample.split(d).length - 1 }));
  const best = counts.sort((a, b) => b.n - a.n)[0];
  return best.n > 0 ? best.d : ',';
};

/** Divide en filas y celdas respetando comillas (con separadores y saltos de línea dentro). */
const parseDelimited = (text: string, delimiter: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cell += ch;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === delimiter) {
      row.push(cell);
      cell = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }
  row.push(cell);
  rows.push(row);

  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some((c) => c !== ''));
};

/** Extrae `{ email, name }` de una celda: "correo", o "Nombre <correo>". */
const emailFromCell = (cell: string): ContactRow | null => {
  const angle = cell.match(ANGLE_RE);
  if (angle && EMAIL_RE.test(angle[2])) return { email: angle[2].toLowerCase(), name: angle[1].replace(/^"|"$/g, '').trim() };
  return EMAIL_RE.test(cell) ? { email: cell.toLowerCase(), name: '' } : null;
};

const looksLikeNumber = (value: string): boolean => /^[\d\s()+.-]+$/.test(value);

export const parseContacts = (rawText: string): ParsedContacts => {
  const text = stripBom(rawText);
  const rows = parseDelimited(text, detectDelimiter(text));

  const result: ParsedContacts = { valid: [], invalid: [], duplicates: 0, withName: 0 };
  const byEmail = new Map<string, ContactRow>();

  const add = (contact: ContactRow) => {
    const existing = byEmail.get(contact.email);
    if (existing) {
      result.duplicates++;
      if (!existing.name && contact.name) existing.name = contact.name;
      return;
    }
    byEmail.set(contact.email, contact);
    result.valid.push(contact);
  };

  // ¿La primera fila es un encabezado? (nombres de columna y ningún correo)
  const first = rows[0] ?? [];
  const headerNorm = first.map(norm);
  const hasHeader =
    first.length > 0 &&
    !first.some((c) => emailFromCell(c)) &&
    headerNorm.some((h) => EMAIL_HEADERS.has(h));

  if (hasHeader) {
    const emailIdx = headerNorm.findIndex((h) => EMAIL_HEADERS.has(h));
    const nameIdx = headerNorm.findIndex((h) => NAME_HEADERS.has(h));
    const lastIdx = headerNorm.findIndex((h) => LAST_HEADERS.has(h));

    for (const row of rows.slice(1)) {
      const parsed = emailFromCell(row[emailIdx] ?? '');
      if (!parsed) {
        result.invalid.push((row[emailIdx] ?? '').trim() || '(correo vacío)');
        continue;
      }
      const name = [nameIdx >= 0 ? row[nameIdx] : '', lastIdx >= 0 ? row[lastIdx] : '']
        .map((p) => (p ?? '').trim())
        .filter(Boolean)
        .join(' ');
      add({ email: parsed.email, name: name || parsed.name });
    }
  } else {
    for (const row of rows) {
      const found: ContactRow[] = [];
      const others: string[] = [];

      for (const cell of row) {
        const direct = emailFromCell(cell);
        if (direct) {
          found.push(direct);
          continue;
        }
        // Una celda con varios correos juntos ("a@x.com b@x.com; c@x.com").
        const tokens = cell.split(/[\s,;]+/).filter(Boolean);
        const parsedTokens = tokens.map((t) => emailFromCell(t));
        if (tokens.length > 0 && parsedTokens.every(Boolean)) {
          parsedTokens.forEach((p) => found.push(p!));
        } else if (cell) {
          others.push(cell);
        }
      }

      if (found.length === 0) {
        result.invalid.push(row.join(' ').slice(0, 80));
        continue;
      }
      // Algo que parece un correo pero está mal escrito ("foo@") no se pierde en silencio.
      others.filter((c) => c.includes('@')).forEach((c) => result.invalid.push(c.slice(0, 80)));

      if (found.length === 1) {
        // Nombre: la primera otra celda con texto que no sea un teléfono ni un correo a medias.
        const nameCell = others.find((c) => !looksLikeNumber(c) && !c.includes('@'));
        add({ email: found[0].email, name: found[0].name || nameCell || '' });
      } else {
        found.forEach((c) => add(c));
      }
    }
  }

  result.withName = result.valid.filter((c) => c.name).length;
  return result;
};

const csvCell = (value: string): string => (/[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** Una línea por contacto ("correo, nombre") para mostrarlos y editarlos en el cuadro de texto. */
export const contactsToText = (contacts: ContactRow[]): string =>
  contacts.map((c) => (c.name ? `${c.email}, ${csvCell(c.name)}` : c.email)).join('\n');

/** Lee un archivo como texto; si no es UTF-8 válido (Excel antiguo) usa Windows-1252. */
export const readTextFile = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
  } catch {
    return new TextDecoder('windows-1252').decode(buffer);
  }
};

export const CONTACTS_TEMPLATE_CSV = 'correo,nombre\nana@ejemplo.com,Ana López\njuan@ejemplo.com,Juan Pérez\n';
