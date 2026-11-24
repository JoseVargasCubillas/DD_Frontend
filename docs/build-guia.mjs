import { marked } from 'marked';
import fs from 'node:fs';
import path from 'node:path';

const [,, srcPath, outPath, mode = 'web'] = process.argv;
const md = fs.readFileSync(srcPath, 'utf8');
const isPrint = mode === 'print';

const slug = (t) => t.toLowerCase()
  .replace(/<[^>]+>/g, '')
  .replace(/[`*_]/g, '')
  .replace(/[^a-z0-9áéíóúñü\s-]/g, '')
  .trim().replace(/\s+/g, '-');

const renderer = new marked.Renderer();
renderer.code = ({ text, lang }) => {
  if (lang === 'mermaid') return `<figure class="diagram"><pre class="mermaid">${text}</pre></figure>`;
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  return `<pre class="code"><code>${esc}</code></pre>`;
};
renderer.heading = ({ text, depth, tokens }) => {
  const inner = marked.Parser.parseInline(tokens);
  const id = slug(text);
  if (depth === 1) return `<h1 id="${id}">${inner}</h1>`;
  if (depth === 2) {
    const m = text.match(/^(\d+)\.\s+(.*)$/);
    if (m) return `<section class="chapter"><h2 id="${id}"><span class="num">${m[1]}</span><span>${marked.Parser.parseInline(marked.Lexer.lexInline(m[2]))}</span></h2>`;
    return `<section class="chapter"><h2 id="${id}">${inner}</h2>`;
  }
  return `<h${depth} id="${id}">${inner}</h${depth}>`;
};
renderer.table = ({ header, rows }) => {
  const th = header.map(c => `<th>${marked.Parser.parseInline(c.tokens)}</th>`).join('');
  const trs = rows.map(r => `<tr>${r.map(c => `<td>${marked.Parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table></div>`;
};
renderer.blockquote = ({ tokens }) => `<aside class="callout">${marked.Parser.parse(tokens)}</aside>`;
renderer.hr = () => '';

marked.use({ renderer, gfm: true });
let body = marked.parse(md);
// close opened <section class="chapter"> blocks
const parts = body.split('<section class="chapter">');
body = parts[0] + parts.slice(1).map(p => `<section class="chapter">${p}</section>`).join('');
// the general map gets its own landscape page in print
body = body.replace('<figure class="diagram">', '<figure class="diagram big">');

// Pull title + intro callout out for the cover
const titleMatch = body.match(/<h1 id="[^"]*">(.*?)<\/h1>/);
const title = titleMatch ? titleMatch[1] : 'Documento';
body = body.replace(/<h1 id="[^"]*">.*?<\/h1>/, '');
const introMatch = body.match(/<aside class="callout">[\s\S]*?<\/aside>/);
const intro = introMatch ? introMatch[0] : '';
body = body.replace(intro, '');

const today = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });

const css = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600;700&display=swap');
:root{
  --cream:#f0ebe2; --cream-50:#faf8f5; --cream-100:#f5f0e8; --cream-300:#e8e0d4; --cream-400:#d4ccc0; --cream-500:#b8ae9f;
  --ink:#0a0a0a; --ink-600:#242424; --ink-500:#3d3d3d; --ink-400:#666; --ink-300:#888;
  --accent:#8a6d3b; --accent-soft:#efe6d3;
  --ok:#2f6f4e; --ok-soft:#e3f0e8; --warn:#9a6b12; --warn-soft:#faf0d6; --bad:#a23b3b; --bad-soft:#f7e1e1; --info:#2f5f8a; --info-soft:#e2ecf5;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--cream-50);color:var(--ink);font-family:Inter,"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:16px;line-height:1.65;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{font-family:"Libre Baskerville",Baskerville,Georgia,serif;font-weight:700;line-height:1.2;color:var(--ink);letter-spacing:-.01em}
a{color:var(--accent);text-decoration:none;border-bottom:1px solid var(--cream-400)}
a:hover{border-color:var(--accent)}
code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.86em;background:var(--cream-100);border:1px solid var(--cream-300);border-radius:4px;padding:.08em .4em;color:var(--ink-600)}
pre.code{background:var(--ink);color:#f5f0e8;padding:18px 22px;border-radius:10px;overflow:auto;font-size:.84rem;line-height:1.55}
pre.code code{background:none;border:0;color:inherit;padding:0}
strong{font-weight:600;color:var(--ink)}
em{color:var(--ink-500)}

/* layout */
.page{max-width:1120px;margin:0 auto;padding:0 32px 96px}
.cover{background:var(--ink);color:var(--cream);margin:0 -32px 56px;padding:88px 32px 72px;position:relative;overflow:hidden}
.cover::after{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(240,235,226,.14),transparent 70%)}
.cover-inner{max-width:1120px;margin:0 auto;position:relative}
.eyebrow{font-size:.78rem;letter-spacing:.22em;text-transform:uppercase;color:var(--cream-500);font-weight:600;margin-bottom:22px;display:flex;align-items:center;gap:12px}
.eyebrow::before{content:"";display:inline-block;width:36px;height:1px;background:var(--cream-500)}
.cover h1{color:var(--cream);font-size:clamp(2.2rem,5vw,3.6rem);margin:0 0 18px;max-width:18ch}
.cover .sub{color:var(--cream-400);font-size:1.15rem;max-width:62ch;line-height:1.6;font-family:"Libre Baskerville",Georgia,serif;font-style:italic}
.cover .meta{margin-top:40px;display:flex;flex-wrap:wrap;gap:12px}
.pill{border:1px solid rgba(240,235,226,.25);border-radius:999px;padding:6px 14px;font-size:.8rem;color:var(--cream-300)}
.cover .callout{background:rgba(240,235,226,.06);border:1px solid rgba(240,235,226,.14);border-left:3px solid var(--cream-500);color:var(--cream-300);margin-top:36px}
.cover .callout strong{color:var(--cream)}
.cover .callout a{color:var(--cream);border-color:rgba(240,235,226,.4)}
.cover .callout p{margin:.45em 0}

/* chapters */
.chapter{background:#fff;border:1px solid var(--cream-300);border-radius:16px;padding:40px 44px 28px;margin:0 0 28px;box-shadow:0 1px 2px rgba(10,10,10,.03),0 12px 32px -24px rgba(10,10,10,.18)}
.chapter h2{display:flex;align-items:baseline;gap:18px;font-size:1.75rem;margin:0 0 22px;padding-bottom:18px;border-bottom:1px solid var(--cream-300)}
.chapter h2 .num{font-family:Inter,sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.08em;color:var(--cream-50);background:var(--ink);border-radius:8px;min-width:38px;height:38px;display:inline-flex;align-items:center;justify-content:center;flex:none;transform:translateY(-4px)}
h3{font-size:1.22rem;margin:34px 0 12px;color:var(--ink);display:flex;align-items:center;gap:10px}
h3::before{content:"";width:6px;height:22px;border-radius:3px;background:var(--accent);flex:none}
h4{font-size:1rem;margin:22px 0 8px;font-family:Inter,sans-serif;font-weight:600;color:var(--ink-500);text-transform:uppercase;letter-spacing:.06em;font-size:.8rem}
p{margin:.7em 0}
ul,ol{padding-left:1.35em;margin:.6em 0}
li{margin:.3em 0}
li::marker{color:var(--accent);font-weight:600}
ol>li{padding-left:.2em}

/* TOC (chapter without number: "Índice") */
.chapter:first-of-type ol{columns:2;column-gap:40px;list-style:none;padding:0;counter-reset:toc}
.chapter:first-of-type ol>li{counter-increment:toc;break-inside:avoid;padding:9px 0 9px 44px;position:relative;border-bottom:1px dashed var(--cream-300);margin:0}
.chapter:first-of-type ol>li::before{content:counter(toc,decimal-leading-zero);position:absolute;left:0;top:9px;font-family:"Libre Baskerville",serif;font-weight:700;color:var(--accent);font-size:.95rem}
.chapter:first-of-type ol>li a{color:var(--ink);border:0;font-weight:500}
.chapter:first-of-type ol>li a:hover{color:var(--accent)}
.chapter:first-of-type ol ul{list-style:none;padding:6px 0 0;margin:0;font-size:.85rem;color:var(--ink-400)}
.chapter:first-of-type ol ul li{padding:1px 0;margin:0;border:0}

/* callouts */
.callout{background:var(--accent-soft);border-left:4px solid var(--accent);border-radius:0 10px 10px 0;padding:14px 20px;margin:20px 0;color:var(--ink-600)}
.callout p{margin:.4em 0}

/* tables */
.table-wrap{overflow:auto;margin:18px 0;border:1px solid var(--cream-300);border-radius:12px}
table{border-collapse:collapse;width:100%;font-size:.93rem}
thead th{background:var(--ink);color:var(--cream);text-align:left;padding:12px 16px;font-weight:600;font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;font-family:Inter,sans-serif}
tbody td{padding:12px 16px;border-top:1px solid var(--cream-300);vertical-align:top}
tbody tr:nth-child(even) td{background:var(--cream-50)}
tbody td:first-child{font-weight:600}
td code{white-space:nowrap}

/* diagrams */
.diagram{margin:26px 0;padding:22px;background:var(--cream-50);border:1px solid var(--cream-300);border-radius:12px;overflow:auto;position:relative}
.diagram::after{content:"desliza para ver completo →";position:absolute;right:14px;top:8px;font-size:.7rem;color:var(--ink-300);letter-spacing:.04em}
.diagram pre.mermaid{margin:0;display:flex;justify-content:center;font-family:Inter,sans-serif;min-width:max-content}
.diagram svg{height:auto}
.diagram:has(svg[style*="max-width"])::after{display:none}

/* status emoji lines in section 10 → badges */
li:has(> strong:first-child) strong:first-child{color:var(--ink)}

footer{margin-top:40px;text-align:center;color:var(--ink-300);font-size:.82rem;padding-top:28px;border-top:1px solid var(--cream-300)}

@media (max-width:760px){
  .page{padding:0 18px 64px}.cover{margin:0 -18px 32px;padding:64px 18px 48px}
  .chapter{padding:26px 22px 18px;border-radius:12px}
  .chapter:first-of-type ol{columns:1}
}
@media print{
  @page{size:A4;margin:14mm 12mm}
  @page wide{size:A4 landscape;margin:8mm}
  .diagram.big{page:wide;break-before:page;break-after:page;border:0;background:#fff;padding:0;margin:0}
  .diagram.big svg{max-height:190mm;width:100%}
  body{background:#fff;font-size:11.5px}
  .page{max-width:none;padding:0}
  .cover{margin:0 0 20px;padding:70px 48px;border-radius:14px;page-break-after:always;min-height:255mm;display:flex;align-items:center;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .cover::after{display:none}
  .chapter{box-shadow:none;break-inside:auto;page-break-inside:auto;padding:22px 24px 14px;margin-bottom:16px}
  .chapter:first-of-type{page-break-after:always}
  h2,h3{break-after:avoid}
  .diagram,.table-wrap,.callout{break-inside:avoid}
  .diagram svg{max-height:240mm;max-width:100%}
  .diagram pre.mermaid{min-width:0}
  .diagram::after{display:none}
  thead th,.chapter h2 .num,pre.code{-webkit-print-color-adjust:exact;print-color-adjust:exact}
  a{color:inherit;border:0}
}
`;

const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title.replace(/<[^>]+>/g,'')} — Diego Díaz · Díaz Lara</title>
<style>${css}</style>
</head>
<body>
<div class="page">
  <header class="cover">
    <div class="cover-inner">
      <div class="eyebrow">Ecosistema Diego Díaz · Díaz Lara · Consultoría</div>
      <h1>${title}</h1>
      <p class="sub">El mapa del tesoro: qué páginas tenemos, dónde viven, qué pasa por detrás cuando alguien deja su correo, compra, paga o agenda — y qué hacer cuando algo se ve raro.</p>
      <div class="meta">
        <span class="pill">Versión ${today}</span>
        <span class="pill">Para todo el equipo · sin tecnicismos</span>
        <span class="pill">4 plataformas · 1 servidor · HubSpot al centro</span>
      </div>
      ${intro}
    </div>
  </header>
  ${body}
  <footer>Documento generado desde <code>docs/GUIA-GENERAL-COMO-FUNCIONA-TODO.md</code> · ${today}. La versión técnica vive en <code>docs/ARQUITECTURA-VPS-Y-PLATAFORMAS.md</code>.</footer>
</div>
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({
    startOnLoad: false, theme: 'base', securityLevel: 'loose',
    flowchart: { curve: 'basis', htmlLabels: true, padding: 12, nodeSpacing: 36, rankSpacing: 48, useMaxWidth: ${isPrint} },
    themeVariables: {
      fontFamily: 'Inter, Helvetica, Arial, sans-serif', fontSize: '14px',
      primaryColor: '#f5f0e8', primaryTextColor: '#0a0a0a', primaryBorderColor: '#b8ae9f',
      secondaryColor: '#efe6d3', tertiaryColor: '#ffffff', lineColor: '#3d3d3d',
      clusterBkg: '#faf8f5', clusterBorder: '#d4ccc0', edgeLabelBackground: '#ffffff',
      titleColor: '#0a0a0a', nodeBorder: '#b8ae9f', mainBkg: '#f5f0e8'
    }
  });
  await mermaid.run({ querySelector: '.mermaid' });
  document.documentElement.dataset.ready = '1';
</script>
</body>
</html>`;

fs.writeFileSync(outPath, html);
console.log('wrote', outPath, (html.length/1024).toFixed(0)+'KB', 'print=' + isPrint);
