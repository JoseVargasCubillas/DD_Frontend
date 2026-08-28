# -*- coding: utf-8 -*-
"""
Convierte los boletines fiscales (PDFs → .txt en .tmp-boletines/) en un
archivo TypeScript con la lista `BOLETINES_MM_POSTS: StaticBlogPost[]`
para consumirla desde `src/data/blogPosts.ts`.

Uso:
    python scripts/build-boletines.py
"""
import os, re, json, sys
sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, ".tmp-boletines")
OUT = os.path.join(ROOT, "src", "data", "boletines.generated.ts")

FOOTER_RE = re.compile(
    r"contacto@diegodiaz\.mx|Colinas del Cimatario|C\.P\.\s*\d+|Quer[eé]taro, Quer[eé]taro",
    re.I,
)
DATE_RE = re.compile(r"(\d{1,2}) de ([a-záéíóú]+)(?:,)? (?:de\s*)?(\d{4})", re.I)
MONTHS = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4, "mayo": 5, "junio": 6,
    "julio": 7, "agosto": 8, "septiembre": 9, "setiembre": 9,
    "octubre": 10, "noviembre": 11, "diciembre": 12,
}


def slugify(txt):
    t = txt.lower()
    t = re.sub(r"[áàä]", "a", t)
    t = re.sub(r"[éèë]", "e", t)
    t = re.sub(r"[íìï]", "i", t)
    t = re.sub(r"[óòö]", "o", t)
    t = re.sub(r"[úùü]", "u", t)
    t = t.replace("ñ", "n")
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t[:80]


def strip_footer(lines):
    return [ln for ln in lines if not FOOTER_RE.search(ln)]


def extract_date(text):
    m = DATE_RE.search(text)
    if not m:
        return None
    d, mth, y = m.group(1), m.group(2).lower(), m.group(3)
    mn = MONTHS.get(mth)
    if not mn:
        return None
    return f"{y}-{mn:02d}-{int(d):02d}"


def looks_title(ln):
    if len(ln) < 6 or len(ln) > 160:
        return False
    letters = [c for c in ln if c.isalpha()]
    if not letters:
        return False
    upper = sum(1 for c in letters if c.isupper())
    return upper / len(letters) > 0.6


def find_title(lines, fallback):
    for ln in lines[:60]:
        s = ln.strip()
        if not s:
            continue
        low = s.lower()
        if "boletín" in low or "boletin" in low:
            continue
        if looks_title(s):
            return s.title()
    return fallback


def esc(s):
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def blocks_to_html(text):
    raw_blocks = [b.strip() for b in re.split(r"\n\s*\n", text) if b.strip()]
    html = []
    for block in raw_blocks:
        lines = [l.strip() for l in block.split("\n") if l.strip()]
        if not lines:
            continue
        first = lines[0]
        if re.match(r"^\d+\.\s+[A-ZÁÉÍÓÚÑ ]{4,}", first) or (
            looks_title(first) and len(lines) == 1
        ):
            html.append(f"<h2>{esc(first)}</h2>")
            rest = lines[1:]
            if rest:
                html.append("<p>" + esc(" ".join(rest)) + "</p>")
            continue
        is_list = all(
            re.match(r"^[•\-\*✓✗×➢◆▪●]\s+", l) or re.match(r"^[IVX]+\.\s", l)
            for l in lines
        )
        if is_list and len(lines) > 1:
            items = [re.sub(r"^[•\-\*✓✗×➢◆▪●IVX\.]+\s+", "", l) for l in lines]
            html.append("<ul>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ul>")
            continue
        if all(re.match(r"^\d+\.\s+", l) for l in lines) and len(lines) > 1:
            items = [re.sub(r"^\d+\.\s+", "", l) for l in lines]
            html.append("<ol>" + "".join(f"<li>{esc(x)}</li>" for x in items) + "</ol>")
            continue
        html.append("<p>" + esc(" ".join(lines)) + "</p>")
    return "\n".join(html)


def category_for(fname, title):
    t = (fname + " " + title).lower()
    if "antilavado" in t:
        return ("SAT & reformas", ["Antilavado", "Cumplimiento", "SAT"])
    if "reformas_2025" in t or "reformas 2025" in t:
        return ("SAT & reformas", ["Reforma fiscal", "SAT", "2025"])
    if "reforma" in t:
        return ("SAT & reformas", ["Reforma fiscal", "SAT"])
    if "cfdi" in t or "ingresos declarados" in t:
        return ("Estrategia fiscal", ["CFDI", "SAT", "Riesgo fiscal"])
    if "automóviles" in t or "automoviles" in t:
        return ("Estrategia fiscal", ["Deducciones", "Automóviles", "ISR"])
    if "deducc" in t or "deducibles" in t:
        return ("Estrategia fiscal", ["Deducciones", "ISR", "SAT"])
    if "iva" in t or "isr" in t or "retencion" in t:
        return ("Estrategia fiscal", ["Retenciones", "IVA", "ISR"])
    if "contabilidad" in t and "electr" in t:
        return ("SAT & reformas", ["Contabilidad electrónica", "SAT"])
    if "estimulos" in t or "estímulos" in t or "esti_mulos" in t:
        return ("Estrategia fiscal", ["Estímulos fiscales", "ISR"])
    if "ptu" in t or "utilidades" in t:
        return ("Liderazgo empresarial", ["PTU", "Nómina", "LFT"])
    if "vigilancia" in t:
        return ("SAT & reformas", ["SAT", "Vigilancia profunda"])
    if "repse" in t:
        return ("SAT & reformas", ["REPSE", "Subcontratación"])
    if "visita domiciliaria" in t or "fiscalizaci" in t:
        return ("Casos reales", ["Fiscalización", "SAT", "Defensa"])
    if "omisiones corporativas" in t or "corporativ" in t:
        return ("Liderazgo empresarial", ["Corporativo", "LGSM"])
    if "prestamos" in t or "préstamos" in t or "aportaciones" in t or "capital" in t:
        return ("Estrategia fiscal", ["Capital", "Aportaciones", "ISR"])
    if "fiscalidad internacional" in t:
        return ("Estrategia fiscal", ["Fiscalidad internacional", "OCDE"])
    if "fechas clave" in t:
        return ("SAT & reformas", ["Calendario fiscal", "Cumplimiento"])
    if "defense" in t or "defensa" in t:
        return ("Casos reales", ["Defensa fiscal", "SAT"])
    return ("Estrategia fiscal", ["Estrategia fiscal", "SAT"])


def process_file(path, fname):
    with open(path, "r", encoding="utf-8") as fh:
        raw = fh.read()
    raw = raw.replace("\ufffd", " ")
    lines = strip_footer([l for l in raw.split("\n")])
    text = "\n".join(lines)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text).strip()

    title = find_title(
        text.split("\n"),
        fname.replace("_", " ").rsplit(".", 1)[0],
    )
    title = re.sub(r"\s+", " ", title).strip().rstrip(":").rstrip(".")
    title = re.sub(r"\bBolet[ií]n Fiscal\b", "", title, flags=re.I).strip()
    if len(title) < 5:
        title = fname.replace("_", " ")
    title = title[0].upper() + title[1:]
    slug = slugify(title)

    date = extract_date(text) or "2025-01-15"

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", text) if p.strip()]
    excerpt = ""
    for p in paragraphs:
        clean = " ".join(l.strip() for l in p.split("\n"))
        if title.lower() in clean.lower() and len(clean) < 200:
            continue
        if looks_title(clean) and len(clean) < 200:
            continue
        if len(clean) > 140:
            excerpt = clean[:280].rsplit(" ", 1)[0].rstrip(".,;:") + "…"
            break
    if not excerpt and paragraphs:
        excerpt = paragraphs[0][:260] + "…"

    words = len(re.findall(r"\w+", text))
    read_min = max(4, round(words / 200))

    html = blocks_to_html(text)
    html = re.sub(r"^\s*<h2>[^<]{0,180}</h2>\s*", "", html, count=1)

    cat, tags = category_for(fname, title)
    return {
        "slug": slug,
        "title": title,
        "tag": cat,
        "publishedAt": date,
        "readTimeMin": read_min,
        "excerpt": excerpt.replace('"', "'"),
        "tags": tags,
        "html": html,
    }


def main():
    if not os.path.isdir(SRC):
        print(f"No existe {SRC}. Extrae primero los PDFs a .txt.", file=sys.stderr)
        sys.exit(1)
    posts = []
    seen = set()
    for fn in sorted(os.listdir(SRC)):
        if not fn.endswith(".txt") or fn.startswith("_"):
            continue
        p = process_file(os.path.join(SRC, fn), fn)
        base_slug = p["slug"]
        i = 2
        while p["slug"] in seen:
            p["slug"] = f"{base_slug}-{i}"
            i += 1
        seen.add(p["slug"])
        posts.append(p)

    posts.sort(key=lambda x: x["publishedAt"], reverse=True)

    def js_string(s):
        return "`" + s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"

    lines_out = [
        "// AUTOGENERADO desde los boletines de MM (ver scripts/build-boletines.py).",
        "// No edites este archivo directamente; regenera con `python scripts/build-boletines.py`.",
        "",
        "import type { StaticBlogPost } from './blogPosts';",
        "import defaultCover from '../../assets/ddweb/reforma-fiscal-2026.jpg';",
        "",
        "const AUTHOR = {",
        "  name: 'Equipo de Consultoría Diego Díaz',",
        "  role: 'Boletines fiscales · edición Diego Díaz',",
        "} as const;",
        "",
        "export const BOLETINES_MM_POSTS: StaticBlogPost[] = [",
    ]
    for p in posts:
        lines_out.append("  {")
        lines_out.append(f"    slug: '{p['slug']}',")
        lines_out.append(f"    title: {js_string(p['title'])},")
        lines_out.append(f"    tag: '{p['tag']}',")
        lines_out.append(f"    publishedAt: '{p['publishedAt']}',")
        lines_out.append(f"    readTimeMin: {p['readTimeMin']},")
        lines_out.append(f"    excerpt: {js_string(p['excerpt'])},")
        lines_out.append("    image: defaultCover,")
        lines_out.append("    author: AUTHOR,")
        lines_out.append(f"    tags: {json.dumps(p['tags'], ensure_ascii=False)},")
        lines_out.append(f"    html: {js_string(p['html'])},")
        lines_out.append("  },")
    lines_out.append("];")
    lines_out.append("")

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(lines_out))
    print(f"Wrote {len(posts)} posts to {OUT}")


if __name__ == "__main__":
    main()
