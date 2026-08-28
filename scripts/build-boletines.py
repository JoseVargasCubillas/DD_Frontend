# -*- coding: utf-8 -*-
"""
Convierte los boletines fiscales (PDFs → .txt en .tmp-boletines/) a un
StaticBlogPost[] en src/data/boletines.generated.ts con formato limpio:

- Repara errores de OCR/extracción (palabras con espacios internos: "com ún"
  → "común", "e n su" → "en su", "dete cción" → "detección").
- Elimina la nota-disclaimer legal que aparece repetida en cada boletín.
- Detecta encabezados en MAYÚSCULAS, listas con viñetas (•, ✓, ×, ➢),
  enumeraciones con letras (a), b), c)) y con números (1., 2., 3.).
- Selecciona la portada según el tema (assets/ddweb/*).

Uso:
    python scripts/build-boletines.py
"""
import os, re, json, sys, unicodedata

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, ".tmp-boletines")
OUT = os.path.join(ROOT, "src", "data", "boletines.generated.ts")

# --------------------------------------------------------------------------
# Limpieza
# --------------------------------------------------------------------------

FOOTER_RE = re.compile(
    r"contacto@diegodiaz\.mx|Colinas del Cimatario|C\.P\.\s*\d+|Quer[eé]taro, Quer[eé]taro",
    re.I,
)

# El disclaimer que se repite cada 2-3 páginas en varios boletines.
DISCLAIMER_PATTERNS = [
    r"Este bolet[ií]n tiene fines informativos.{0,400}?(?:jur[ií]dico o fiscal\.?|jur[ií]dico\-fiscal\.?)",
    r"El presente documento tiene [^.]{0,200}car[aá]cter informativo[^.]{0,300}\.",
]

DATE_RE = re.compile(r"(\d{1,2}) de ([a-záéíóú]+)(?:,)? (?:de\s*)?(\d{4})", re.I)
MONTHS = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "setiembre": 9,
    "octubre": 10, "noviembre": 11, "diciembre": 12,
}

# palabras con acento posicionadas después de espacio-partido intra-palabra
# ej: "com ún" -> "común", "revisi ón" -> "revisión", "dete cción" -> "detección"
# Regla: si tenemos secuencia "[letra_latina]+ [1-3 letras con acento][letra_latina]*"
# y unir da una palabra plausible, unir.
_ACCENT_START = "áéíóúñÁÉÍÓÚÑ"

def fix_broken_words(text):
    # Reemplazos hardcoded para artefactos de OCR conocidos (más seguro que
    # una regla genérica que pueda pegar palabras válidas como "por única").
    fixes = [
        (r"\bcom\s+ún\b", "común"),
        (r"\brevisi\s+ón\b", "revisión"),
        (r"\brevi\s+sión\b", "revisión"),
        (r"\bdete\s*cci[oó]n\b", "detección"),
        (r"\bact\s+ividades?\b", "actividades"),
        (r"\bactividade\s+s\b", "actividades"),
        (r"\bre\s+conocida\b", "reconocida"),
        (r"\bcompa\s*ñ[ií]as?\b", "compañías"),
        (r"\bt[eé]rm\s+inos\b", "términos"),
        (r"\bp\s*roceso\b", "proceso"),
        (r"\bp\s*roces\s*os\b", "procesos"),
        (r"\bproces\s+os\b", "procesos"),
        (r"\bpermit\s+ir\b", "permitir"),
        (r"\bidentifi\s+caci[oó]n\b", "identificación"),
        (r"\binusuales?\b", "inusuales"),
        (r"\bfracc\s*\.\s*", "fracc. "),
        # "e n su empresa" -> "en su empresa" (sólo cuando le sigue art/pron)
        (r"\be\s+n\s+(su|la|el|los|las|un|una|nuestro|nuestra|este|esta|ese|esa)\b", r"en \1"),
        # espacios antes de puntuación
        (r"\s+([,;\.:])", r"\1"),
        # espacios múltiples
        (r"[ \t]+", " "),
    ]
    for pat, rep in fixes:
        text = re.sub(pat, rep, text, flags=re.I)
    return text


def strip_disclaimers(text):
    for p in DISCLAIMER_PATTERNS:
        text = re.sub(p, "", text, flags=re.I | re.S)
    return text


def strip_footer_lines(lines):
    return [ln for ln in lines if not FOOTER_RE.search(ln)]


def slugify(txt):
    t = "".join(
        c for c in unicodedata.normalize("NFD", txt.lower())
        if unicodedata.category(c) != "Mn"
    )
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:80]


def extract_date(text):
    m = DATE_RE.search(text)
    if not m:
        return None
    d, mth, y = m.group(1), m.group(2).lower(), m.group(3)
    mn = MONTHS.get(mth)
    if not mn:
        return None
    return f"{y}-{mn:02d}-{int(d):02d}"


def looks_like_heading(ln):
    """Heurística: título de sección en MAYÚSCULAS."""
    s = ln.strip()
    if len(s) < 4 or len(s) > 140:
        return False
    letters = [c for c in s if c.isalpha()]
    if not letters:
        return False
    upper = sum(1 for c in letters if c.isupper())
    return upper / len(letters) > 0.7


# --------------------------------------------------------------------------
# Título del boletín (limpio, no truncado)
# --------------------------------------------------------------------------

TITLE_OVERRIDES = {
    "reforma_a_la_ley_antilavado_2025": "Reforma a la Ley Antilavado 2025",
    "boletin_fiscal_reforma_ley_antilavado": "Reforma a la Ley Antilavado 2025: qué cambia para tu empresa",
    "5_omisiones_corporativas_que_pueden_poner_en_riesgo_tu_empresa":
        "5 omisiones corporativas que pueden poner en riesgo tu empresa",
    "boleti_n_fiscal_defense_file": "Defense File: el expediente que salva tu empresa en una auditoría",
    "boleti_n_fiscal_actos_de_fiscalizacio_n_visita_domiciliaria":
        "Actos de fiscalización: cómo enfrentar una visita domiciliaria del SAT",
    "contabilidad_electronica_2025": "Contabilidad electrónica 2025: obligaciones y errores comunes",
    "cumplimiento_contexto_y_pro_ximos_pasos_en_materia_de_fiscalidad_internacional":
        "Fiscalidad internacional 2025: cumplimiento, contexto y próximos pasos",
    "deduccion_de_automoviles": "Deducción de automóviles: los cambios que impactan a socios y directivos",
    "deducciones_autorizadas": "Deducciones autorizadas: guía práctica para empresas",
    "diferencias_clave_entre_prestamos_aportaciones_y_aumentos_de_capital":
        "Diferencias clave entre préstamos, aportaciones y aumentos de capital",
    "errores_comunes_que_invalidan_deducciones":
        "Errores comunes que invalidan tus deducciones (y cómo evitarlos)",
    "esti_mulos_fiscales_en_me_xico_2025": "Estímulos fiscales en México 2025",
    "fechas_clave_para_cumplimiento": "Fechas clave del cumplimiento fiscal en México",
    "participacion_de_los_trabajadores_en_las_utilidades_ptu":
        "PTU: participación de los trabajadores en las utilidades",
    "reformas_2025": "Reformas fiscales 2025: qué cambió y a quién impacta",
    "retenciones_de_iva_e_isr": "Retenciones de IVA e ISR: quién, cuánto y cuándo",
    "revision_del_cumplimiento_en_repse_y_sus_efectos_fiscales":
        "REPSE 2025: cumplimiento y efectos fiscales de la subcontratación",
    "riesgos_fiscales_por_diferencias_entre_ingresos_declarados_y_cfdi_s_1":
        "Riesgos fiscales: diferencias entre ingresos declarados y CFDI",
    "vigilancia_profunda": "Vigilancia profunda del SAT: cómo detectarla y responder",
}


def _normalize_key(s):
    """Normaliza para lookup: minúsculas, sin acentos, sólo [a-z0-9_]."""
    t = "".join(
        c for c in unicodedata.normalize("NFD", s.lower())
        if unicodedata.category(c) != "Mn"
    )
    t = re.sub(r"[^a-z0-9]+", "_", t).strip("_")
    return t


_TITLE_OVERRIDES_NORM = None


def resolve_title(fname_stem):
    global _TITLE_OVERRIDES_NORM
    if _TITLE_OVERRIDES_NORM is None:
        _TITLE_OVERRIDES_NORM = {
            _normalize_key(k): v for k, v in TITLE_OVERRIDES.items()
        }
    key = _normalize_key(fname_stem)
    if key in _TITLE_OVERRIDES_NORM:
        return _TITLE_OVERRIDES_NORM[key]
    # Búsqueda parcial: encontrar un override cuyo key esté contenido
    for k, v in _TITLE_OVERRIDES_NORM.items():
        if k in key or key in k:
            return v
    return None


# --------------------------------------------------------------------------
# Portada según tema (assets locales)
# --------------------------------------------------------------------------

def image_key_for(fname, title):
    t = (fname + " " + title).lower()
    if "antilavado" in t or "lfpiorpi" in t:
        return "antilavado"  # blindaje-digital
    if "cfdi" in t or "ingresos declarados" in t:
        return "cfdi"  # sat-cumplimiento-digital
    if "automóvil" in t or "automoviles" in t or "autom_vil" in t:
        return "auto"  # equipo unido as generic
    if "deducc" in t:
        return "deducciones"  # recibos-deducibles
    if "iva" in t or "isr" in t or "retenci" in t:
        return "retenciones"  # recibos-deducibles
    if "contabilidad" in t and "electr" in t:
        return "contabilidad"  # sat-cumplimiento-digital
    if "estimulo" in t or "estímulo" in t or "esti_mulo" in t:
        return "estimulos"  # reforma
    if "ptu" in t or "utilidades" in t or "participaci" in t:
        return "ptu"  # equipo-unido
    if "vigilancia" in t:
        return "vigilancia"  # sat-cumplimiento-digital
    if "repse" in t:
        return "repse"  # inmobiliario-construccion
    if "visita" in t or "fiscalizaci" in t or "defense" in t:
        return "fiscalizacion"  # blindaje-digital
    if "omisiones" in t or "corporativ" in t:
        return "corporativo"  # equipo-unido
    if "prestamos" in t or "préstamos" in t or "aportaciones" in t or "capital" in t:
        return "capital"  # alianza-empresarial
    if "fiscalidad internacional" in t:
        return "internacional"  # alianza-empresarial
    if "fechas" in t and "clave" in t:
        return "calendario"  # diego-ajedrez
    if "reforma" in t:
        return "reformas"  # reforma-fiscal-2026
    return "generic"  # reforma-fiscal-2026


IMAGE_IMPORTS = {
    "antilavado":     ("blindajeDigital",     "blindaje-digital.jpg"),
    "cfdi":           ("satDigital",          "sat-cumplimiento-digital.jpg"),
    "auto":           ("recibos",             "recibos-deducibles.jpg"),
    "deducciones":    ("recibos",             "recibos-deducibles.jpg"),
    "retenciones":    ("recibos",             "recibos-deducibles.jpg"),
    "contabilidad":   ("satDigital",          "sat-cumplimiento-digital.jpg"),
    "estimulos":      ("reformaCover",       "reforma-fiscal-2026.jpg"),
    "ptu":            ("equipoUnido",         "equipo-unido.jpg"),
    "vigilancia":     ("satDigital",          "sat-cumplimiento-digital.jpg"),
    "repse":          ("inmobiliario",        "inmobiliario-construccion.jpg"),
    "fiscalizacion":  ("blindajeDigital",     "blindaje-digital.jpg"),
    "corporativo":    ("equipoUnido",         "equipo-unido.jpg"),
    "capital":        ("alianza",             "alianza-empresarial.jpg"),
    "internacional":  ("alianza",             "alianza-empresarial.jpg"),
    "calendario":     ("diegoAjedrez",        "diego-ajedrez.jpg"),
    "reformas":       ("reformaCover",       "reforma-fiscal-2026.jpg"),
    "generic":        ("reformaCover",       "reforma-fiscal-2026.jpg"),
}


# --------------------------------------------------------------------------
# Categoría / tags
# --------------------------------------------------------------------------

def category_for(fname, title):
    t = (fname + " " + title).lower()
    if "antilavado" in t or "lfpiorpi" in t:
        return ("SAT & reformas", ["Antilavado", "Cumplimiento", "SAT"])
    if "reformas 2025" in t or "reformas_2025" in t:
        return ("SAT & reformas", ["Reforma fiscal", "SAT", "2025"])
    if "reforma" in t:
        return ("SAT & reformas", ["Reforma fiscal", "SAT"])
    if "cfdi" in t or "ingresos declarados" in t:
        return ("Estrategia fiscal", ["CFDI", "SAT", "Riesgo fiscal"])
    if "autom" in t and ("vil" in t or "viles" in t):
        return ("Estrategia fiscal", ["Deducciones", "Automóviles", "ISR"])
    if "deducc" in t:
        return ("Estrategia fiscal", ["Deducciones", "ISR", "SAT"])
    if "iva" in t or "isr" in t or "retenci" in t:
        return ("Estrategia fiscal", ["Retenciones", "IVA", "ISR"])
    if "contabilidad" in t and "electr" in t:
        return ("SAT & reformas", ["Contabilidad electrónica", "SAT"])
    if "estimulo" in t or "estímulo" in t or "esti_mulo" in t:
        return ("Estrategia fiscal", ["Estímulos fiscales", "ISR"])
    if "ptu" in t or "utilidades" in t:
        return ("Liderazgo empresarial", ["PTU", "Nómina", "LFT"])
    if "vigilancia" in t:
        return ("SAT & reformas", ["SAT", "Vigilancia profunda"])
    if "repse" in t:
        return ("SAT & reformas", ["REPSE", "Subcontratación"])
    if "visita" in t or "fiscalizaci" in t:
        return ("Casos reales", ["Fiscalización", "SAT", "Defensa"])
    if "omisiones" in t or "corporativ" in t:
        return ("Liderazgo empresarial", ["Corporativo", "LGSM"])
    if "prestamos" in t or "préstamos" in t or "aportaciones" in t or "capital" in t:
        return ("Estrategia fiscal", ["Capital", "Aportaciones", "ISR"])
    if "fiscalidad internacional" in t:
        return ("Estrategia fiscal", ["Fiscalidad internacional", "OCDE"])
    if "fechas" in t and "clave" in t:
        return ("SAT & reformas", ["Calendario fiscal", "Cumplimiento"])
    if "defense" in t or "defensa" in t:
        return ("Casos reales", ["Defensa fiscal", "SAT"])
    return ("Estrategia fiscal", ["Estrategia fiscal", "SAT"])


# --------------------------------------------------------------------------
# HTML
# --------------------------------------------------------------------------

def esc(s):
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;")
             .replace('"', "&quot;"))

BULLET_PREFIX = re.compile(r"^\s*[•\-\*✓✗×➢◆▪●]\s+")
LETTER_ITEM = re.compile(r"^\s*([a-h])\)\s+(.*)")
NUMBER_ITEM = re.compile(r"^\s*(\d{1,2})\.\s+(.+)")
ROMAN_ITEM = re.compile(r"^\s*([IVX]{1,4})\.\s+(.+)")


def normalize_block(block):
    lines = [l.strip() for l in block.split("\n") if l.strip()]
    return lines


def block_to_html(lines):
    """Convierte un bloque (lista de líneas) en un fragmento HTML."""
    if not lines:
        return ""

    # Heading si UNA sola línea en mayúsculas
    if len(lines) == 1 and looks_like_heading(lines[0]):
        title_line = lines[0].strip().strip(":").rstrip(".")
        return f"<h2>{esc(title_line.title())}</h2>"

    # Encabezado seguido de párrafo: "N. TÍTULO EN MAYÚSCULAS: contenido"
    m = re.match(r"^(\d+\.\s+)([A-ZÁÉÍÓÚÑ ,]{5,})[:\.]?\s*$", lines[0])
    if m:
        heading = m.group(2).strip().rstrip(":").rstrip(".")
        rest = lines[1:]
        rest_html = block_to_html(rest) if rest else ""
        return f"<h2>{esc(heading.title())}</h2>\n{rest_html}"

    # Lista con letras a) b) c)
    letter_lines = [LETTER_ITEM.match(l) for l in lines]
    if letter_lines[0] and sum(1 for x in letter_lines if x) >= max(2, len(lines) - 1):
        items = []
        cur = None
        for l in lines:
            mm = LETTER_ITEM.match(l)
            if mm:
                if cur:
                    items.append(cur)
                cur = mm.group(2).strip()
            else:
                if cur is None:
                    cur = l
                else:
                    cur += " " + l.strip()
        if cur:
            items.append(cur)
        return "<ol type=\"a\">" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ol>"

    # Lista con bullets/checks
    if all(BULLET_PREFIX.match(l) for l in lines) and len(lines) > 1:
        items = [BULLET_PREFIX.sub("", l).strip() for l in lines]
        return "<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul>"

    # Lista numerada
    num_matches = [NUMBER_ITEM.match(l) for l in lines]
    if num_matches[0] and sum(1 for x in num_matches if x) >= max(2, len(lines) - 1):
        items = []
        cur = None
        for l in lines:
            mm = NUMBER_ITEM.match(l)
            if mm:
                if cur:
                    items.append(cur)
                cur = mm.group(2).strip()
            else:
                cur = (cur + " " + l.strip()) if cur else l.strip()
        if cur:
            items.append(cur)
        return "<ol>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ol>"

    # Lista con romanos
    roman_matches = [ROMAN_ITEM.match(l) for l in lines]
    if roman_matches[0] and sum(1 for x in roman_matches if x) >= max(2, len(lines) - 1):
        items = []
        for l in lines:
            mm = ROMAN_ITEM.match(l)
            if mm:
                items.append(mm.group(2).strip())
            elif items:
                items[-1] += " " + l.strip()
        return "<ol type=\"I\">" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ol>"

    # Párrafo con negrita en encabezado "FRASE FUERTE: resto"
    joined = " ".join(lines)
    m2 = re.match(r"^([A-ZÁÉÍÓÚÑ][A-ZÁÉÍÓÚÑ ,]{6,60}):\s*(.+)$", joined)
    if m2:
        head, body = m2.group(1), m2.group(2)
        return f"<p><strong>{esc(head.title())}:</strong> {esc(body)}</p>"

    return "<p>" + esc(joined) + "</p>"


def text_to_html(text):
    blocks = [b for b in re.split(r"\n\s*\n", text) if b.strip()]
    html = []
    for b in blocks:
        lines = normalize_block(b)
        if not lines:
            continue
        # partir bloques que mezclan heading en línea y contenido:
        # "SECCIÓN EN MAYÚSCULAS línea1 línea2 …" → separar
        if len(lines) > 1 and looks_like_heading(lines[0]) and not looks_like_heading(lines[1]):
            html.append(f"<h2>{esc(lines[0].strip().rstrip(':').title())}</h2>")
            html.append(block_to_html(lines[1:]))
            continue
        html.append(block_to_html(lines))
    # post: agrupar párrafos consecutivos que empiezan con letra a) b) c)
    #       en una sola lista <ol type="a">
    html = group_letter_paragraphs(html)
    return "\n".join(x for x in html if x.strip())


PARA_LETTER = re.compile(r"^<p>([a-h])\)\s*(.+?)</p>$", re.S)


def group_letter_paragraphs(html_blocks):
    out = []
    buf = []
    def flush():
        nonlocal buf
        if len(buf) >= 2:
            items = "".join(f"<li>{x}</li>" for x in buf)
            out.append(f"<ol type=\"a\">{items}</ol>")
        else:
            for x in buf:
                out.append(f"<p>{x}</p>")
        buf = []
    for block in html_blocks:
        m = PARA_LETTER.match(block.strip())
        if m:
            buf.append(m.group(2).strip())
        else:
            flush()
            out.append(block)
    flush()
    return out


# --------------------------------------------------------------------------
# Excerpt
# --------------------------------------------------------------------------

def build_excerpt(text, title):
    for p in re.split(r"\n\s*\n", text):
        clean = " ".join(l.strip() for l in p.split("\n")).strip()
        if not clean:
            continue
        if looks_like_heading(clean):
            continue
        if title and title.lower()[:30] in clean.lower() and len(clean) < 220:
            continue
        if len(clean) < 100:
            continue
        return clean[:260].rsplit(" ", 1)[0].rstrip(".,;:") + "…"
    return title


# --------------------------------------------------------------------------
# Proceso principal
# --------------------------------------------------------------------------

def process_file(path, fname):
    with open(path, "r", encoding="utf-8") as fh:
        raw = fh.read()

    lines = strip_footer_lines(raw.split("\n"))
    text = "\n".join(lines)
    text = strip_disclaimers(text)
    text = fix_broken_words(text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()

    stem = os.path.splitext(fname)[0]
    override_title = resolve_title(stem)
    date = extract_date(text) or "2025-01-15"

    title = override_title or stem.replace("_", " ").strip().title()
    title = re.sub(r"\bBolet[ií]n Fiscal\b", "", title, flags=re.I).strip()
    if not title:
        title = "Boletín fiscal"
    title = title[0].upper() + title[1:]

    slug = slugify(title)
    excerpt = build_excerpt(text, title)

    html = text_to_html(text)
    # borrar cualquier heading duplicado con el título al inicio
    if html.startswith("<h2>"):
        first_close = html.find("</h2>")
        first = html[4:first_close]
        if first.lower().strip() in title.lower():
            html = html[first_close + 5 :].lstrip()

    words = len(re.findall(r"\w+", text))
    read_min = max(4, round(words / 200))

    cat, tags = category_for(fname, title)
    img_key = image_key_for(fname, title)

    return {
        "slug": slug,
        "title": title,
        "tag": cat,
        "publishedAt": date,
        "readTimeMin": read_min,
        "excerpt": excerpt,
        "tags": tags,
        "html": html,
        "img_key": img_key,
    }


def main():
    if not os.path.isdir(SRC):
        print(f"No existe {SRC}", file=sys.stderr)
        sys.exit(1)

    posts = []
    seen = set()
    for fn in sorted(os.listdir(SRC)):
        if not fn.endswith(".txt") or fn.startswith("_"):
            continue
        p = process_file(os.path.join(SRC, fn), fn)
        base = p["slug"]
        i = 2
        while p["slug"] in seen:
            p["slug"] = f"{base}-{i}"; i += 1
        seen.add(p["slug"])
        posts.append(p)

    posts.sort(key=lambda x: x["publishedAt"], reverse=True)

    def js_str(s):
        return "`" + s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"

    used_vars = {}
    for k in sorted(set(p["img_key"] for p in posts)):
        var, filename = IMAGE_IMPORTS[k]
        used_vars[var] = filename  # dedupe por variable
    import_lines = [
        f"import {var} from '../../assets/ddweb/{filename}';"
        for var, filename in sorted(used_vars.items())
    ]

    var_map = {k: IMAGE_IMPORTS[k][0] for k in set(p["img_key"] for p in posts)}

    out = [
        "// AUTOGENERADO desde los boletines de MM (ver scripts/build-boletines.py).",
        "// No edites este archivo directamente; regenera con `python scripts/build-boletines.py`.",
        "",
        "import type { StaticBlogPost } from './blogPosts';",
        *import_lines,
        "",
        "const AUTHOR = {",
        "  name: 'Equipo de Consultoría Diego Díaz',",
        "  role: 'Boletines fiscales · edición Diego Díaz',",
        "} as const;",
        "",
        "export const BOLETINES_MM_POSTS: StaticBlogPost[] = [",
    ]
    for p in posts:
        out.append("  {")
        out.append(f"    slug: '{p['slug']}',")
        out.append(f"    title: {js_str(p['title'])},")
        out.append(f"    tag: '{p['tag']}',")
        out.append(f"    publishedAt: '{p['publishedAt']}',")
        out.append(f"    readTimeMin: {p['readTimeMin']},")
        out.append(f"    excerpt: {js_str(p['excerpt'])},")
        out.append(f"    image: {var_map[p['img_key']]},")
        out.append("    author: AUTHOR,")
        out.append(f"    tags: {json.dumps(p['tags'], ensure_ascii=False)},")
        out.append(f"    html: {js_str(p['html'])},")
        out.append("  },")
    out.append("];")
    out.append("")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(out))
    print(f"Wrote {len(posts)} posts to {OUT}")


if __name__ == "__main__":
    main()
