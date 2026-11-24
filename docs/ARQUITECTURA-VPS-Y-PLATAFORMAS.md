# Arquitectura del VPS y de las plataformas — grafo de procesos

> **Para quién es esto:** un colaborador promedio (marketing, ventas, soporte o un dev nuevo) que necesita entender *qué hay*, *dónde vive* y *cómo fluye* la información entre las plataformas de Diego Díaz / Díaz Lara.
> **Cómo leerlo:** empieza por el nivel 0 (el servidor), baja al nivel 1 (dominios y plataformas) y después entra al detalle de cada plataforma y sus procesos. Los diagramas son Mermaid: GitHub y la app de Copilot los renderizan solos.
> **Fuente:** inventario real del VPS (nginx, pm2, cron, MySQL) y lectura del código de los repos `DD_Frontend`, `DD_Backend`, `diazlara-backend`, `DiazLaraweb`, `Consultoria`, `Consultoria_backend` y `ranking-asesores`. Fecha: 2026‑11‑24. El servidor de Minecraft queda fuera de alcance por petición expresa.

---

## Índice

0. [Nivel 0 — El VPS](#nivel-0--el-vps)
1. [Nivel 1 — Dominios, hosting y plataformas](#nivel-1--dominios-hosting-y-plataformas)
2. [Plataforma A — Diego Díaz (diegodiaz.mx)](#plataforma-a--diego-díaz-diegodiazmx)
   - A1 Mapa del sitio · A2 Captación de leads · A3 HubSpot · A4 Email marketing (Mailchimp + SMTP) · A5 Pagos Stripe · A6 Eventos, boletos y check‑in · A7 Academia · A8 Cuentas · A9 Blog · A10 WhatsApp · A11 Reportes a Google Sheets · A12 Workers automáticos · A13 Panel admin
3. [Plataforma B — Díaz Lara Consultores (diazlara.mx)](#plataforma-b--díaz-lara-consultores-diazlaramx)
4. [Plataforma C — Consultoría interna (fiscalista-mx.com)](#plataforma-c--consultoría-interna-fiscalista-mxcom)
5. [Plataforma D — Ranking de asesores (ranking.diazlara.mx)](#plataforma-d--ranking-de-asesores-rankingdiazlaramx)
6. [Cómo se conectan las plataformas entre sí](#cómo-se-conectan-las-plataformas-entre-sí)
7. [Servicios externos (tabla rápida)](#servicios-externos-tabla-rápida)
8. [Operación: despliegues, tareas programadas y respaldos](#operación-despliegues-tareas-programadas-y-respaldos)
9. [Riesgos y pendientes detectados](#riesgos-y-pendientes-detectados)

---

## Nivel 0 — El VPS

**Servidor:** `82.25.95.236` · Ubuntu 25.04 · 4 vCPU · 15 GB RAM · 193 GB disco (19 % usado).
**Qué hace:** recibe todo el tráfico HTTPS en **nginx**, lo reparte a 4 procesos Node administrados por **PM2**, guarda datos en **MySQL** local y corre tareas programadas con **cron**. Los certificados SSL los renueva **Certbot**; **fail2ban** y **Monarx** protegen el acceso.

```mermaid
flowchart TB
    Internet(("Internet")) -->|"443 / 80"| NGINX["nginx<br/>reverse proxy + SSL (Certbot)"]

    subgraph VPS["VPS 82.25.95.236 — Ubuntu 25.04"]
        NGINX
        subgraph PM2["PM2 (procesos Node 22)"]
            DDAPI["dd-academia-backend<br/>:5010<br/>/var/www/dd-academia-backend"]
            DLAPI["diazlara-backend<br/>:3000<br/>/var/www/diazlara-backend"]
            CONSAPI["api_ddl (Consultoria_backend)<br/>:4000<br/>/home/ubuntu/ddl_backend"]
            CONSFE["frontend_ddl (vite dev)<br/>:5173 — detenido, ver riesgos"]
        end
        STATIC1["/var/www/ranking-asesores<br/>(HTML estático)"]
        STATIC2["/home/ubuntu/ddl_front/Consultoria/dist<br/>(React compilado)"]
        MYSQL[("MySQL 127.0.0.1:3306<br/>dd_academia · consultoria_db")]
        CRON["cron<br/>03:00 backup MySQL<br/>08:30 reporte leads → Sheets"]
        RUNNER["GitHub Actions runner<br/>(self-hosted, repos Consultoria / Consultoria_backend)"]
        SEC["fail2ban (sshd) · Monarx · Docker (sin contenedores)"]
    end

    NGINX -->|"api.diegodiaz.mx"| DDAPI
    NGINX -->|"api.diazlara.mx"| DLAPI
    NGINX -->|"fiscalista-mx.com/api/"| CONSAPI
    NGINX -->|"fiscalista-mx.com/"| STATIC2
    NGINX -->|"ranking.diazlara.mx"| STATIC1

    DDAPI --> MYSQL
    CONSAPI --> MYSQL
    DLAPI -->|"MySQL remoto Hostinger<br/>31.97.208.13 · u233477720_diazlara"| REMOTEDB[("MySQL Hostinger")]
    CRON --> MYSQL
    CRON --> DDAPI
    RUNNER -->|"git pull + build"| CONSAPI
    RUNNER -->|"vite build"| STATIC2
```

**Resumen por puerto**

| Puerto | Proceso PM2 | Repo | Dominio público |
|---|---|---|---|
| 5010 | `dd-academia-backend` | `JoseVargasCubillas/DD_Backend` | `api.diegodiaz.mx` (`api.consultoresddl.com.mx` deshabilitado, ver riesgos) |
| 3000 | `diazlara-backend` | `JoseVargasCubillas/diazlara-backend` | `api.diazlara.mx` |
| 4000 | `api_ddl` | `JoseVargasCubillas/Consultoria_backend` | `fiscalista-mx.com/api/` |
| 5173 | `frontend_ddl` (`npm run dev`, **detenido**) | `JoseVargasCubillas/Consultoria` | — (nginx sirve el `dist/` estático, no este puerto) |
| 80/443 estático | nginx | `ranking-asesores` | `ranking.diazlara.mx` |

---

## Nivel 1 — Dominios, hosting y plataformas

No todo vive en el VPS: los **frontends de Diego Díaz y Díaz Lara están en Hostinger** (hosting web con auto‑deploy desde GitHub); el VPS aloja sus APIs. `fiscalista-mx.com` pasa por **Cloudflare** antes de llegar al VPS.

```mermaid
flowchart LR
    subgraph DNS["Dominios"]
        D1["diegodiaz.mx / www"]
        D2["api.diegodiaz.mx"]
        D3["diazlara.mx / www"]
        D4["api.diazlara.mx"]
        D5["fiscalista-mx.com / www"]
        D6["ranking.diazlara.mx"]
        D7["api.consultoresddl.com.mx<br/>(deshabilitado)"]
    end

    subgraph HOSTINGER["Hostinger (hosting web)"]
        H1["DD_Frontend (React)<br/>deploy automático al hacer push a main"]
        H2["DiazLaraweb (React landing)"]
        H3[("MySQL Hostinger<br/>u233477720_diazlara")]
    end

    subgraph CF["Cloudflare"]
        C1["Proxy / CDN"]
    end

    subgraph VPSBOX["VPS 82.25.95.236"]
        V1["dd-academia-backend :5010"]
        V2["diazlara-backend :3000"]
        V3["Consultoria_backend :4000 + Consultoria dist"]
        V4["ranking-asesores (estático)"]
    end

    subgraph SAAS["Servicios externos"]
        S1["HubSpot CRM"]
        S2["Mailchimp"]
        S3["Stripe"]
        S4["Gmail SMTP"]
        S5["Google Sheets / Drive / Calendar / Meet"]
        S6["WhatsApp: Whapi + Meta Cloud API"]
        S7["Envía (paquetería)"]
        S8["Cloudinary"]
        S9["n8n cloud (diaz-lara.app.n8n.cloud)"]
        S10["OpenAI (opcional)"]
    end

    D1 --> H1 --> D2 --> V1
    D3 --> H2 -.->|"formulario embebido"| S1
    D4 --> V2
    D5 --> C1 --> V3
    D6 --> V4 --> S9 --> S1
    D7 -.->|"antes"| V1
    V2 --> H3

    V1 --> S1 & S2 & S3 & S4 & S5 & S6 & S7 & S8 & S10
    V2 --> S1 & S4 & S5 & S6
    V3 --> S1 & S4 & S5 & S6
    V2 -->|"127.0.0.1:4000"| V3
```

**Las cuatro plataformas**

| Letra | Plataforma | Para qué sirve | Frontend | Backend | Base de datos |
|---|---|---|---|---|---|
| **A** | **Diego Díaz** | Marca personal: eventos, Academia (cursos), libros, blog, captación de leads, marketing | `diegodiaz.mx` (Hostinger) | `api.diegodiaz.mx` (VPS :5010) | `dd_academia` (VPS) |
| **B** | **Díaz Lara Consultores** | Landing del despacho + API para agendar sesiones estratégicas con consultores | `diazlara.mx` (Hostinger) | `api.diazlara.mx` (VPS :3000) | `u233477720_diazlara` (Hostinger) |
| **C** | **Consultoría interna** | Sistema operativo del despacho: clientes, pipeline HubSpot, tareas, documentos, sesiones, portal de cliente, podio | `fiscalista-mx.com` (Cloudflare → VPS) | `fiscalista-mx.com/api` (VPS :4000) | `consultoria_db` (VPS) |
| **D** | **Ranking de asesores** | Pantalla/tablero en vivo con ranking de ventas desde HubSpot | `ranking.diazlara.mx` (VPS estático) | n8n cloud (webhooks) | — |

---

## Plataforma A — Diego Díaz (diegodiaz.mx)

**Stack:** React 18 + Vite + TypeScript (Tailwind, React Router, TanStack Query, Zustand) en el frontend; Node + Express + TypeScript en el backend; MySQL con tablas `id + data(JSON)`.
**Deploy:** frontend → push a `main` en `DD_Frontend` y Hostinger compila y publica (~3‑4 min). Backend → push a `main` en `DD_Backend` y después `git pull && npm install && npm run build && pm2 restart dd-academia-backend` en el VPS.

### A1 · Mapa del sitio público

```mermaid
flowchart TB
    subgraph PUBLICO["Páginas públicas (MainLayout)"]
        HOME["/ Home<br/>video hero · countdown próximo evento · Guía SAT"]
        ABOUT["/acerca · /diego · /prensa<br/>About + Media Kit"]
        EVENTOS["/eventos (calendario)"]
        LANDINGS["Landings de evento<br/>/eventos/estrategia-fiscal/:sede<br/>/eventos/holding · /eventos/tablero-del-ceo<br/>/eventos/rockefeller · /eventos/revision-estrategica<br/>/eventos/reforma-fiscal-2027 · /eventos/prospeccion-digital<br/>/eventos/como-cobrar"]
        EVDET["/eventos/:slug detalle genérico"]
        EVCHK["/eventos/checkout"]
        ACAD["/academia (planes Entrepreneur / Business / Master)"]
        CURSOS["/cursos · /cursos/:slug"]
        LIBROS["/libros · /libros/:slug/checkout"]
        BLOG["/blog · /blog/:slug"]
        DESPACHO["/despacho · /diaz-lara"]
        RECURSOS["/recursos (descargables)"]
        CONTACTO["/contacto"]
        LEGAL["/terminos · /privacidad · /faq<br/>/legal/… (Díaz Lara, aceptación obligatoria)"]
        RECIBOS["/recibo/:id · /recibo/pedido/:id · /boleto/:folio"]
    end
    subgraph AUTH["Cuenta"]
        LOGIN["/iniciar-sesion · /registro<br/>/recuperar-contrasena · /restablecer-contrasena"]
        MICUENTA["/mi-cuenta (cursos, perfil, contraseña)<br/>/cursos/:slug/leccion/:lessonId"]
    end
    subgraph STAFF["Staff / Admin"]
        CHECKIN["/check-in (escáner QR)"]
        ADMIN["/admin/* (ver A13)"]
        ENVIOS["/envios-asesores/:token (asesores de envío)"]
    end
    HOME --> LANDINGS --> EVCHK
    EVENTOS --> EVDET
    ACAD --> CHK["/checkout"]
    CURSOS --> CHK
    LOGIN --> MICUENTA
```

### A2 · Captación de leads (descargables, newsletter, dossiers)

Cualquier “dame tu correo y te mando X” sigue el mismo camino. El componente reutilizable del frontend es `LeadCaptureModal`.

```mermaid
flowchart TD
    U(["Visitante"]) --> F["Formulario en la web<br/>(LeadCaptureModal / Newsletter / Lista de espera)"]
    F -->|"POST /api/v1/leads/…"| R{"Fuente del lead"}
    R -->|"sat-guide"| S1["Guía Blindaje SAT (PDF 8 MB adjunto)"]
    R -->|"media-kit"| S2["Media Kit (enlace a GitHub Release)"]
    R -->|"estrategia-fiscal-dossier"| S3["Dossiers Seminario presencial + Capacitación online (2 PDF)"]
    R -->|"resource"| S4["Centro de Recursos (descargable por clave)"]
    R -->|"newsletter"| S5["Suscripción newsletter (correo de bienvenida)"]
    R -->|"sat-waitlist"| S6["Lista de espera"]

    S1 & S2 & S3 & S4 & S5 & S6 --> CAP["lead.service → captureLead()<br/>dedupe por correo · guarda fuente, nombre, teléfono, meta"]
    CAP --> DB[("tabla leads")]
    CAP --> HS["hubspot-contact.service → syncContactToHubspot()<br/>(si HUBSPOT_CONTACT_SYNC_ENABLED)"]
    HS --> HUB["HubSpot: contacto creado/actualizado"]
    CAP --> MAIL{"¿SMTP disponible y bajo el tope diario?"}
    MAIL -->|"sí"| SEND["email.service → Gmail SMTP<br/>correo con adjunto / enlace"]
    MAIL -->|"no"| Q["email_queue_jobs<br/>(reintento prioritario)"]
    Q --> SEND
    CAP --> RESP["Respuesta al navegador:<br/>downloadUrl + extraDownloadUrls"]
    RESP --> DL["Descarga inmediata (fallback)<br/>GET /api/v1/leads/download/:key"]
    CAP -.-> SEG["Queda disponible en segmentos de<br/>Email / WhatsApp marketing (A4, A10)"]
    CAP -.-> REP["Cuenta en el reporte diario a Sheets (A11)"]
```

**Además:** cada clic en un botón de WhatsApp del sitio se registra con `POST /api/v1/analytics/wa-click` (tabla `wa_clicks`) y se consulta en el admin.

### A3 · HubSpot (CRM) — dos direcciones

```mermaid
flowchart LR
    subgraph OUT["Plataforma → HubSpot (alta de contactos)"]
        L["Lead capturado (A2)"] --> SC["syncContactToHubspot()"]
        REG["Registro de cuenta (A8)"] --> SC
        CHKO["Intento de compra abandonado<br/>(checkout sin pagar > 24 h)"] --> AW["startAbandonedCheckoutWorker()<br/>corre diario ~10:00"] --> SC
        SC --> HSC["Contacto en HubSpot"]
    end

    subgraph IN["HubSpot → Plataforma (ventas del equipo)"]
        ASESOR(["Asesor cierra negocio<br/>pipeline + etapa 'closedwon'"]) --> POLL["startHubspotSyncWorker()<br/>polling cada 5 min (HUBSPOT_POLL_INTERVAL_SEC)"]
        POLL --> READ["Lee deal + line items + contacto + propietario"]
        READ --> MATCH{"¿Producto reconocido<br/>y edición en events / event_catalog?"}
        MATCH -->|"no"| PEND["Queda pendiente en hubspot_sync<br/>(reintento siguiente ciclo)"]
        MATCH -->|"evento presencial"| TK["ticket.service → boleto con QR<br/>event_tickets · ref hubspot:deal:item"]
        MATCH -->|"evento online (Holding, SEF Online)"| INV["event-group.service → invitación<br/>single-use a grupo WhatsApp"]
        TK --> EM["Correo con boleto QR al contacto<br/>(copia al asesor opcional)"]
        TK --> SH["attendance-sheet.service → fila en Google Sheets"]
        INV --> EM2["Correo con enlace al grupo"]
        POLL --> CUR[("hubspot_sync: cursor + idempotencia")]
    end

    MANUAL["Admin: POST /api/v1/integrations/hubspot/sync<br/>o npm run hubspot:sync"] --> POLL
```

### A4 · Email marketing — Mailchimp + SMTP

Hay **dos canales de correo** y es importante no confundirlos:

| Canal | Para qué | Tope |
|---|---|---|
| **Gmail SMTP (nodemailer)** | Transaccionales (boletos, recibos, descargables, bienvenida) y envíos masivos pequeños desde el admin | ~1 950/día total; `EMAIL_BULK_DAILY_CAP` = 1 800 para masivos; se reservan ~150 para transaccionales |
| **Mailchimp** | Campañas masivas a la audiencia “Diego Díaz – Estrategia Fiscal” y segmentos que ya viven allá | Según plan Mailchimp |

```mermaid
flowchart TD
    ADM(["Admin en /admin/email (ManageEmail)"]) --> SEG["Elige segmento<br/>GET /api/v1/email/segments"]
    SEG --> TIPOS["Segmentos locales:<br/>leads por fuente (guía SAT, media kit, dossiers, recursos)<br/>suscriptores newsletter · suscritos Academia (opt‑in)<br/>compradores (órdenes) · asistentes a eventos<br/>descargables elegidos<br/>— o —<br/>audiencia / segmento de Mailchimp<br/>GET /audiences · /audiences/:id/segments"]
    TIPOS --> TEST["POST /api/v1/email/test (correo de prueba)"]
    TIPOS --> BC["POST /api/v1/email/broadcast"]
    BC --> CAMP["email-campaign.service<br/>registra en email_campaigns<br/>(una campaña activa a la vez)"]
    CAMP --> CH{"Canal"}
    CH -->|"segmento local"| QUEUE["email-queue.service<br/>email_queue_jobs · respeta tope diario<br/>transaccionales primero"]
    QUEUE --> SMTP["Gmail SMTP"]
    CH -->|"audiencia Mailchimp"| MC["mailchimp.service<br/>crea y envía campaña en Mailchimp"]
    MC --> MCAPI["Mailchimp API"]
    MCAPI -->|"baja / rebote"| WH["Webhook GET|POST /api/v1/email/webhooks/mailchimp<br/>(firma + secreto en URL)"]
    WH --> UNSUB["Marca lead como dado de baja<br/>→ se excluye de todos los segmentos"]
    CAMP --> HIST["Historial /admin/email/historial<br/>GET /campaigns/history · /queue-status"]
    RESTART["Reinicio del servidor"] --> REC["recoverInterruptedCampaigns()<br/>marca interrumpidas y pide revisar Mailchimp"]
```

### A5 · Pagos con Stripe (cursos, Academia, eventos, libros)

```mermaid
flowchart TD
    U(["Comprador"]) --> SEL["Elige producto<br/>plan Academia · evento (General/VIP) · libro · curso"]
    SEL --> CODE["Código de descuento (opcional)<br/>promotions / offers"]
    CODE --> QUOTE["POST /api/v1/payments/quote<br/>payment.service arma líneas + descuentos"]
    QUOTE -->|"libros"| SHIPQ["POST /shipping-quote · /validate-address<br/>GET /postal-code/:cp (Envía)"]
    QUOTE --> INTENT["POST /api/v1/payments/intent<br/>crea PaymentIntent en Stripe + fila en orders (pendiente)"]
    INTENT --> CARD["Stripe Elements en /checkout o /eventos/checkout"]
    CARD -->|"éxito"| WH["Stripe → POST /api/v1/payments/webhook<br/>payment_intent.succeeded"]
    CARD -->|"éxito (respaldo)"| CONF["POST /api/v1/payments/confirm"]
    CARD -->|"abandona"| ABAN["Se marca intento incompleto<br/>→ worker diario lo sube a HubSpot (A3)"]
    WH & CONF --> DONE["confirmPayment() — idempotente<br/>orders: pagado"]

    DONE --> T{"Tipo de producto"}
    T -->|"Academia / curso"| ACC["grantAcademiaAccess()<br/>subscriptions · acceso a cursos del paquete"]
    ACC --> WAINV["Business / Master:<br/>invitación single-use a grupo WhatsApp"]
    ACC --> RCPT["Recibo /recibo/:id + correo"]
    T -->|"evento presencial"| TICK["ticket.service: 1 boleto QR por asiento<br/>event_tickets"]
    TICK --> TMAIL["Correo con boletos · /boleto/:folio"]
    TICK --> SHEET["Fila en Google Sheets de asistencia"]
    T -->|"evento online"| GRP["event-group.service: invitación a grupo WhatsApp<br/>event_group_invites"]
    T -->|"libro"| LBL["generateOrderShippingLabelIfNeeded()<br/>shipping.service → Envía: guía + tracking"]
    LBL --> SHIP["shipments · aviso por WhatsApp Cloud API<br/>(admin, asesor, cliente)"]
    SHIP --> TRACK["startShipmentTrackingWorker()<br/>refresca estatus de la guía"]
    DONE --> ORD["Recibo de pedido /recibo/pedido/:id<br/>admin: GET /payments/admin/orders"]
```

### A6 · Eventos, boletos y check‑in

```mermaid
flowchart LR
    subgraph ORIGEN["Origen del boleto"]
        W["Compra web (A5)"]
        H["Venta HubSpot (A3)"]
        M["Alta manual del admin<br/>POST /api/v1/events/:id/assign"]
    end
    W & H & M --> T["event_tickets<br/>folio · QR · tipo General/VIP · asesor · edición"]
    T --> MAIL["Correo con boleto QR"]
    T --> SH["Google Sheets: pestaña por evento<br/>(ATTENDANCE_SHEET_ID)"]
    T --> PUB["/boleto/:folio (página pública)<br/>GET /api/v1/tickets/:folio · /:folio/qr.png"]

    subgraph DIA["Día del evento"]
        STAFF(["Staff en /check-in o /admin/eventos/check-in"]) --> SCAN["Escanea QR (html5-qrcode)"]
        SCAN --> CI["POST /api/v1/tickets/check-in"]
        CI --> UPD["Boleto: asistió + hora"]
        UPD --> SH2["Sheets: ✅ Asistió + hora + color"]
        CI -.->|"deshacer"| UNDO["Admin revierte check-in"]
    end

    subgraph CAL["Calendario y landings"]
        CAT["event_catalog + events<br/>(ediciones, sedes, fechas)"] --> FE["/eventos y landings por sede<br/>useNextCalendarEvent()"]
        CAT --> H
    end
    ADM(["Admin /admin/eventos"]) --> CAT
    ADM --> ATT["/admin/eventos/:id/asistentes<br/>attendee-admin.service"]
```

### A7 · Academia (planes, cursos, expiración)

```mermaid
flowchart TD
    PLAN["Planes (packages): Entrepreneur · Business · Master<br/>usePackages() con fallback local"] --> BUY["Compra one-time (A5)"]
    BUY --> SUB["subscriptions: acceso + vigencia"]
    ADMAS["Admin: POST /api/v1/packages/assign/:userId<br/>(acceso manual)"] --> SUB
    SUB --> CUR["Cursos → módulos → lecciones<br/>/api/v1/courses · /:id/modules · /:id/lessons<br/>progreso por lección · comentarios"]
    SUB -->|"Business / Master"| WA["whatsapp-invite.service<br/>GET /api/v1/academia/whatsapp/:token<br/>enlace single-use al grupo"]
    EXP["startPackageExpirationWorker()"] --> REM["Recordatorios 7 días y 1 día antes"]
    EXP --> REV["Al vencer: revoca cursos del paquete<br/>(solo compras pagadas, no accesos manuales)"]
    DRIVE["Admin: importar curso desde Google Drive<br/>POST /courses/import/drive/preview · /import/drive"] --> CUR
    CLOUD["Portadas / imágenes → Cloudinary (storage.service)"] --> CUR
```

### A8 · Cuentas y autenticación

```mermaid
flowchart LR
    REG["POST /api/v1/auth/register"] --> USR[("users · rol user/admin")]
    REG --> HS["syncContactToHubspot()"]
    LOGIN["POST /auth/login"] --> JWT["JWT access + refresh<br/>(persistido en localStorage dd-auth)"]
    JWT -->|"401"| REFRESH["POST /auth/refresh (reintento automático del cliente)"]
    FORGOT["POST /auth/forgot-password → correo"] --> RESET["POST /auth/reset-password"]
    ADMU["Admin: POST /auth/admin/users<br/>crea cuenta y envía credenciales por correo"] --> USR
    JWT --> GUARD["ProtectedRoute (/mi-cuenta)<br/>AdminRoute (/admin, role === admin)"]
```

### A9 · Blog

```mermaid
flowchart LR
    STATIC["Posts estáticos en el frontend<br/>(boletines fiscales MM + escritos a mano)"] --> LIST["/blog · /blog/:slug"]
    API["GET /api/v1/blog · /:slug (blog_posts)"] --> LIST
    ADM(["Admin /admin/blog"]) --> CRUD["POST / PUT / DELETE /api/v1/blog"]
    ADM --> GEN["POST /blog/drafts/generate"]
    GEN --> AI{"¿OPENAI_API_KEY?"}
    AI -->|"sí"| OAI["OpenAI Chat Completions"]
    AI -->|"no"| TPL["Plantilla determinista"]
    OAI & TPL --> DRAFT["Borradores (blog_posts, estado draft)"]
    DRAFT --> PUBL["POST /blog/drafts/:id/publish"] --> API
```

### A10 · WhatsApp (tres usos distintos)

```mermaid
flowchart TD
    subgraph BROADCAST["1. Difusión masiva (Whapi)"]
        ADM(["Admin /admin/whatsapp"]) --> SEGW["GET /api/v1/whatsapp/segments · /contacts"]
        SEGW --> BCW["POST /api/v1/whatsapp/broadcast"]
        BCW --> WHAPI["Whapi (número de WhatsApp de la marca)"]
    end
    subgraph TPL["2. Plantillas oficiales (Meta Cloud API)"]
        SHIPEV["Eventos de envío (A5): aprobado, rechazado, entregado, incidente"] --> WCS["whatsapp-cloud.service → sendWhatsappTemplate()"]
        WCS --> META["WhatsApp Cloud API (WHATSAPP_TPL_*)"]
    end
    subgraph LINKS["3. Enlaces single-use a grupos"]
        ACADG["Academia Business / Master"] --> TOK1["/api/v1/academia/whatsapp/:token"]
        EVG["Eventos online (Holding, SEF Online)"] --> TOK2["/api/v1/event-groups/:token"]
        TOK1 & TOK2 --> JOIN["Redirige al enlace del grupo y quema el token"]
    end
    CLICK["Botón WhatsApp del sitio<br/>(waLink → 52 1 442 747 5869)"] --> AN["POST /api/v1/analytics/wa-click (métrica)"]
```

### A11 · Reportes a Google Sheets

```mermaid
flowchart LR
    CRON["cron VPS 08:30<br/>npm run report:sheet-sync"] --> SCRIPT["src/scripts/daily-sheet-report.ts"]
    SCRIPT --> SVC["leads-report.service → syncLeadsReportToSheet()"]
    SVC --> AGG["Agrega: leads por descargable (Guía SAT, Recursos, dossiers…)<br/>suscriptores newsletter · total por descarga<br/>histórico ORG DD · intentos de compra / eventos"]
    AGG --> SA["Service Account Google (GOOGLE_SA_KEY_FILE)"]
    SA --> SHEET["Google Sheet 'Reporte descargables' (ID fijo)<br/>+ marca de última actualización"]
    TICKETS["Boletos y check-ins (A6)"] --> ASVC["attendance-sheet.service"] --> SA --> SHEET2["Google Sheet de asistencia<br/>(ATTENDANCE_SHEET_ID, pestaña por evento)"]
    SCRIPT --> LOG["/var/log/dd-sheet-report.log"]
```

### A12 · Workers automáticos del backend (arrancan con `server.ts`)

| Worker | Qué hace | Frecuencia |
|---|---|---|
| `startEmailQueueWorker()` | Despacha `email_queue_jobs` respetando topes diarios; transaccionales primero | continuo (intervalo interno) |
| `startPackageExpirationWorker()` | Recordatorios 7d/1d y revocación de paquetes vencidos | diario |
| `startHubspotSyncWorker()` | Polling de negocios ganados en HubSpot → boletos / invitaciones | cada 5 min |
| `startAbandonedCheckoutWorker()` | Sube a HubSpot intentos de compra abandonados > 24 h | diario ~10:00 |
| `startShipmentTrackingWorker()` | Actualiza tracking de guías Envía | intervalo interno |
| `recoverInterruptedCampaigns()` | Al arrancar, marca campañas de email interrumpidas | al inicio |
| cron externo `report:sheet-sync` | Reporte de leads a Sheets (A11) | 08:30 diario |

### A13 · Panel admin (`/admin/*`) → endpoints

| Pantalla | Ruta | Backend principal |
|---|---|---|
| Dashboard | `/admin` | resumen |
| Cursos / productos | `/admin/cursos`, `/admin/cursos/:id`, `/admin/cursos/:id/avance`, `/admin/comentarios` | `/courses`, `/modules`, `/lessons`, comentarios |
| Contactos (contactos · etiquetas · leads) | `/admin/contactos`, `/admin/contactos/:id`, `/admin/etiquetas` | `/leads`, `/leads/unified`, `/users`, `/tags` |
| Eventos | `/admin/eventos`, `/admin/eventos/check-in`, `/admin/eventos/:id/asistentes` | `/events`, `/tickets`, `/integrations/event-catalog`, `/event-groups` |
| Ventas | `/admin/ventas`, `/admin/ventas/pagos`, `/admin/ventas/carrito` | `/payments/admin/orders`, `/receipts` |
| Envíos | `/admin/envios`, `/envios-asesores/:token` | `/shipments` |
| Suscripciones / paquetes / ofertas / promociones | `/admin/suscripciones`, `/admin/promociones` | `/subscriptions`, `/packages`, `/offers`, `/promotions` |
| Email | `/admin/email`, `/admin/email/historial` | `/email/*` (A4) |
| WhatsApp | `/admin/whatsapp` | `/whatsapp/*` (A10) |
| Blog | `/admin/blog` | `/blog/*` (A9) |
| Usuarios | `/admin/usuarios` | `/users`, `/auth/admin/users` |

**Tablas de `dd_academia`:** `users, courses, modules, lessons, events, event_catalog, event_tickets, event_group_invites, orders, subscriptions, packages, offers, promotions, tags, books, blog_posts, course_comments, leads, wa_clicks, email_campaigns, email_queue_jobs, hubspot_sync, shipments, shipping_advisors`.

---

## Plataforma B — Díaz Lara Consultores (diazlara.mx)

**Qué es:** la landing del despacho (`DiazLaraweb`, React/Vite, en Hostinger) y una API (`diazlara-backend`, Express/TS, VPS :3000, MySQL **remoto en Hostinger**) que captura solicitudes, califica leads, agenda sesiones estratégicas con consultores en Google Calendar/Meet y avisa por correo y WhatsApp. Es el **puente** entre el marketing (HubSpot) y la operación interna (Plataforma C).

```mermaid
flowchart TD
    V(["Visitante en diazlara.mx"]) --> LAND["Landing: servicios · equipo · testimonios · FAQ<br/>bloque 'Asesoría Inicial 2026'"]
    LAND --> HSF["Formulario embebido de HubSpot<br/>(portal 49215056)"]
    HSF --> HUB["HubSpot: contacto / formulario"]
    LAND -.->|"alternativa configurable VITE_BOOKING_ENDPOINT"| BOOK["POST /api/sessions/bookings → createLead()"]
    EXT["Otros orígenes (Consultoría C, scripts)"] --> LEADS["POST /api/leads · GET /api/leads/:id"]
    BOOK & LEADS --> DB1[("CLIENTES · LEADS_EN_ESPERA")]

    subgraph CONSULTOR["Consultor autenticado (JWT, rol consultant)"]
        AV["GET /api/availability/consultants<br/>/:id/slots?date · /:id/calendar?days<br/>slotCalculatorService + Google Calendar free/busy"]
        AV --> APT["POST /api/appointments<br/>crea CITAS · evento en Google Calendar · enlace Meet"]
        APT --> NOTIF["NotificationService<br/>email SMTP (plantillas en BD) + WhatsApp Whapi"]
        NOTIF --> C1["Confirmación al cliente"]
        APT --> QUAL["POST /api/qualifications<br/>CALIFICACIONES: score, estatus comercial"]
        QUAL --> HSQ["hubspotService.syncQualification()<br/>actualiza contacto en HubSpot"]
        QUAL --> LEADUPD["Actualiza LEADS_EN_ESPERA / CLIENTES"]
        APT --> CONS["ConsultoriaIntegrationService<br/>→ http://127.0.0.1:4000 (Plataforma C)<br/>sendMeetLinkToConsultoria()"]
        CONS -->|"falla"| RETRYF["logs/consultoria-sync-failures.jsonl"]
        MGMT["GET/PATCH/DELETE /api/appointments/:id<br/>estado · cancelación"] --> NOTIF
    end

    subgraph JOBS["Tareas programadas (node-cron)"]
        J1["*/10 min: recordatorios de cita pendientes<br/>(email + WhatsApp)"]
        J2["02:15 diario: reintenta notificaciones fallidas<br/>(y sync Consultoría — no verificado)"]
    end
    J2 --> RETRYF

    subgraph WEBHOOKS["Webhooks entrantes"]
        WH1["POST /api/webhooks/whapi (x-webhook-secret)<br/>estatus / mensajes entrantes → handleStatusCallback()"]
        WH2["POST /api/webhooks/twilio (alias)"]
        WH3["POST /api/webhooks/hubspot (solo responde OK)"]
    end

    ADMIN["POST /api/admin/login · /profile<br/>aprobación de leads · diagnósticos · integración Consultoría"] --> DB1
    FEADV["Frontend: AdvisorPortal · DiagnosticoForm"] --> ADMIN
```

**Plantillas (seed:templates):** email → confirmación, recordatorio, cancelación, seguimiento post‑sesión; WhatsApp → confirmación, recordatorio, cancelación.
**Tablas principales:** `CLIENTES`, `CONSULTORES`, `CITAS`, `CALIFICACIONES`, `LEADS_EN_ESPERA`, disponibilidad/bloqueos, notificaciones y plantillas (esquema exacto vigente: no verificado en el repo).
**Deploy:** backend → `git pull && npm run build && pm2 restart diazlara-backend`. Frontend → Hostinger (proveedor inferido por DNS `*.cdn.hstgr.net`).

---

## Plataforma C — Consultoría interna (fiscalista-mx.com)

**Qué es:** el sistema operativo del despacho. Importa negocios de HubSpot, los convierte en clientes/empresas/servicios, mueve un tablero de etapas sincronizado con el pipeline de HubSpot, dispara automatizaciones por WhatsApp/correo en cada etapa, agenda sesiones con consultores, maneja documentos, checklists, diagnósticos fiscales, ISR, planes de acción, facturación, un portal para el cliente y el “Podio” (ranking de asesores).
**Stack:** React + Vite + MUI/PrimeReact (frontend `Consultoria`), Express + Sequelize + Socket.IO (backend `Consultoria_backend`), MySQL `consultoria_db` local.
**Deploy:** GitHub Actions con **runner self‑hosted en el VPS** (`actions.runner.*` y `github-runner-consultoria.service`): al hacer push, el runner hace `git pull`, compila y reinicia `api_ddl` / regenera `dist/`.

```mermaid
flowchart TD
    subgraph ENTRADA["Entrada de clientes"]
        HUB["HubSpot: deals con producto que cumple HUBSPOT_PRODUCT_FILTER"] --> SYNC["HubspotScheduler → runHubspotSync()<br/>cada HUBSPOT_SYNC_INTERVAL_MINUTES"]
        SYNC --> CREATE["createClientFromDeal()<br/>Company + Client + ClientService<br/>dedupe por contacto / email / teléfono"]
        SYNC --> LINK["linkClientsToDeals() · pollDealStages()"]
        LINK --> STAGES["hubspot_pipeline_stages = columnas del tablero<br/>(syncPipelineStagesFromHubspot)"]
        DL["Plataforma B (diazlara-backend)<br/>rutas /external (leads, citas, enlace Meet)"] --> CREATE
    end

    subgraph AUTOM["Automatizaciones por etapa (StageAutomationScheduler, cada 5 min)"]
        STAGES --> EV["StageAutomationEvent (eventos con demora)"]
        EV --> ACT["Acciones del catálogo:<br/>bienvenida · solicitud de documentos · recordatorios doc 1/2<br/>confirmación de recepción · actualización de revisión<br/>confirmación / recordatorio de sesión 24h y 1h<br/>evaluación sesión 1/2/final · aviso y seguimiento de entregable<br/>aviso de propuesta + seguimientos · reactivación estancado<br/>contrato pendiente (jefe) · contrato enviado (cliente) · nuevo cliente cerrado"]
        ACT --> WAC["WhatsApp Cloud API (plantillas WHATSAPP_TEMPLATE_*)"]
        ACT --> MAILC["Correo SMTP"]
        ACT --> TASKS["Tareas internas (Task) + notificaciones Socket.IO"]
        ACT --> LOGA["StageAutomationLog"]
        OFF["STAGE_AUTOMATIONS_DISABLED=true apaga todo"] -.-> EV
    end

    subgraph SESIONES["Sesiones con consultores"]
        SS["/session-scheduling: GET consultores · agenda · busy · google-events<br/>POST book · cancel/:leadId"] --> SLOT["SlotCalculatorService (slots 15/30/60 min,<br/>disponibilidad semanal, bloqueos, citas)"]
        SLOT --> GCAL["Google Calendar (cuentas en GOOGLE_CALENDAR_ACCOUNTS) + Meet"]
        SS -->|"puente"| DLB["diazlara-backend (Plataforma B)"]
        WR["WhatsappReminderScheduler<br/>recordatorio WHATSAPP_REMINDER_HOURS_BEFORE antes"] --> WAC
    end

    subgraph OPERACION["Operación diaria (frontend fiscalista-mx.com)"]
        R1["/dashboard · /clientes · /servicios · /asesores<br/>/admin/jerarquias · /admin/servicios"]
        R2["/hubspot/clientes · /hubspot/sesiones · /etapas/dashboard<br/>/admin/automatizaciones-etapas"]
        R3["/documentos · /tareas · /reportes · /grabaciones<br/>/metodologias/dashboard · /asesorias/*"]
        R4["Checklists · diagnósticos · diagnóstico fiscal<br/>tablas ISR · cálculos ISR · KPIs · facturación · billing"]
        R5["/notificaciones (campanita, Socket.IO en tiempo real)"]
    end

    subgraph PORTAL["Portal del cliente"]
        P1["/portal/login → /portal<br/>tareas · expediente · metodologías · documentos<br/>evaluación (/evaluacion/:token) · notificaciones"]
    end

    subgraph PODIO["Podio (ranking de asesores)"]
        GS["Google Sheet 'Matriz 2026'"] --> PS["sincronizarPodio() (programado)<br/>tablas podio_* · PodioSyncRun"]
        PS --> PUBR["GET /podio/public/ranking (sin login, pantalla TV)"]
        PS --> PRIV["/podio (interno)"]
    end

    CREATE --> R1
    R1 --> P1
```

**Roles:** administradores, consultores/asesores con jerarquía (`AsesorHierarchy`), `ASESOR_VENTAS` (acceso completo a HubSpot, lectura de clientes, subida de documentos) y clientes del portal.
**Workers (`setInterval`):** HubSpot sync (`HUBSPOT_SYNC_INTERVAL_MINUTES`), automatizaciones de etapa (5 min), recordatorios WhatsApp (`WHATSAPP_REMINDER_CHECK_INTERVAL_MINUTES`), tareas, Podio.
**Modelos clave:** `User, Profile, Client, Company, Service, ClientService, ClientConsultor, Task, Notification, ActionPlan, Folder, Document, ClientFile, Facturacion, ClientBilling, ClientMonitoring, Methodology*, FiscalDiagnosis*, ISRRateTable, ClientISRCalculation, AsesorHierarchy*, HubspotPipelineStage, HubspotPipelineDeal, StageAutomation*, Podio*, SessionEvaluation, Client*Checklist, ClientHours, Video, SecurityEvent, BlacklistedToken`.

---

## Plataforma D — Ranking de asesores (ranking.diazlara.mx)

Sin backend propio: HTML/JS compilado con Vite (React + React Query + Recharts + Three.js) servido por nginx. Los datos vienen de **n8n cloud** (`diaz-lara.app.n8n.cloud/webhook/...`), que consulta la API de HubSpot y devuelve un dataset optimizado de deals.

```mermaid
flowchart LR
    TV(["Pantalla / navegador"]) --> NG["nginx → /var/www/ranking-asesores"]
    NG --> APP["App React (React Query, refresco periódico)"]
    APP -->|"GET webhook"| N8N["n8n cloud<br/>workflow 'hubspot_deals_dataset_optimizado'"]
    N8N --> HUB["HubSpot API v3: deals, owners, montos"]
    N8N --> APP
    APP --> UI["Ranking, gráficas, avatares 3D"]
    SRC["/var/www/ranking-src (código fuente + workflow JSON n8n)"] -.->|"npm run build → copiar dist"| NG
```

---

## Cómo se conectan las plataformas entre sí

```mermaid
flowchart LR
    A["A · diegodiaz.mx<br/>marketing, eventos, Academia"]
    B["B · diazlara.mx<br/>sesiones estratégicas"]
    C["C · fiscalista-mx.com<br/>operación del despacho"]
    D["D · ranking.diazlara.mx"]
    HUB[("HubSpot CRM<br/>contactos · deals · pipeline")]

    A -->|"leads, registros, carritos abandonados → contactos"| HUB
    HUB -->|"deals ganados → boletos / grupos"| A
    B -->|"calificación de lead → contacto"| HUB
    B -->|"formulario embebido"| HUB
    HUB -->|"deals filtrados → clientes y etapas"| C
    B -->|"127.0.0.1:4000 · leads, citas, Meet"| C
    C -->|"puente /session-scheduling"| B
    HUB -->|"vía n8n"| D
    A -.->|"página /despacho y legales de Díaz Lara"| B
```

**En una frase:** HubSpot es el **centro**. A lo alimenta con leads y consume sus ventas; B califica y agenda; C opera al cliente a partir de los deals; D solo lo lee para mostrar el ranking.

---

## Servicios externos (tabla rápida)

| Servicio | Lo usa | Para qué | Variables |
|---|---|---|---|
| **HubSpot** | A, B, C, D | CRM central: contactos, deals, pipeline, formularios | `HUBSPOT_*` |
| **Mailchimp** | A | Campañas masivas + webhook de bajas | `MAILCHIMP_*` |
| **Stripe** | A | Pagos (PaymentIntent + webhook) | `STRIPE_*` |
| **Gmail SMTP (nodemailer)** | A, B, C | Transaccionales y envíos pequeños | `MAIL_*` / `SMTP_*` |
| **Whapi** | A, B, C | WhatsApp desde el número de la marca (difusión, confirmaciones, webhook) | `WHAPI_*` |
| **WhatsApp Cloud API (Meta)** | A, C | Plantillas oficiales (envíos, etapas, recordatorios) | `WHATSAPP_*` |
| **Google Sheets** | A, C | Reporte diario de leads, asistencia a eventos, Matriz Podio | `GOOGLE_SA_KEY_FILE`, `ATTENDANCE_SHEET_ID` |
| **Google Calendar / Meet** | B, C | Agenda de consultores, enlaces Meet | `GOOGLE_SERVICE_ACCOUNT_JSON`, `GOOGLE_CALENDAR_*` |
| **Google Drive** | A | Importar cursos (videos, portadas) | `GOOGLE_DRIVE_API_KEY` |
| **Cloudinary** | A | Imágenes optimizadas | `CLOUDINARY_*` |
| **Envía** | A | Guías y tracking de libros | `ENVIA_*` |
| **OpenAI** | A (opcional) | Borradores de blog | `OPENAI_API_KEY` |
| **n8n cloud** | D | Webhooks con dataset de HubSpot | — |
| **GitHub Releases `media-v1`** | A | Videos pesados y Media Kit (75 MB) | — |
| **Hostinger** | A, B | Hosting de frontends + MySQL de B | — |
| **Cloudflare** | C | DNS/proxy de fiscalista-mx.com | — |

---

## Operación: despliegues, tareas programadas y respaldos

```mermaid
flowchart TD
    subgraph DEPLOY["Despliegues"]
        FE_A["DD_Frontend: push a main → Hostinger compila y publica (3‑4 min)"]
        BE_A["DD_Backend: push a main → en VPS: git pull · npm install · npm run build · pm2 restart dd-academia-backend"]
        BE_B["diazlara-backend: git pull · build · pm2 restart diazlara-backend"]
        C_ALL["Consultoria / Consultoria_backend: push → GitHub Actions → runner self-hosted en VPS"]
        D_ALL["ranking-asesores: build local en /var/www/ranking-src → copiar a /var/www/ranking-asesores"]
    end
    subgraph CRONS["Tareas programadas del VPS"]
        K1["03:00 — mysql_backup.sh: dump comprimido de consultoria_db y dd_academia<br/>→ /root/backups/mysql (retiene 14 días)"]
        K2["08:30 — report:sheet-sync (A11)"]
        K3["certbot renew (SSL) · docker prune · monarx-update"]
    end
    subgraph INAPP["Workers dentro de las apps"]
        W1["A: cola email · expiración paquetes · HubSpot 5 min · carritos abandonados · tracking envíos"]
        W2["B: recordatorios */10 min · reintentos 02:15"]
        W3["C: HubSpot sync · automatizaciones 5 min · recordatorios WhatsApp · Podio · tareas"]
    end
```

---

## Riesgos y pendientes detectados

| # | Hallazgo | Impacto | Sugerencia |
|---|---|---|---|
| 1 | ✅ **Resuelto 2026‑11‑24.** El backup nocturno solo respaldaba `consultoria_db`. Ahora `/root/backups/mysql_backup.sh` respalda **ambas** bases comprimidas (`*.sql.gz`, 14 días de retención); `dd_academia` usa las credenciales del `.env` del backend con `--no-defaults`. Verificado: 24 tablas en el dump. | — | Pendiente aún: copiar los dumps **fuera del VPS** (Drive/S3/Hostinger). |
| 2 | ✅ **Resuelto 2026‑11‑24.** `api.consultoresddl.com.mx` apuntaba a `:5010`. Sin referencias en código y sin tráfico real (1 bot en logs) → site deshabilitado (sigue en `sites-available` por si se necesita). | — | Si el dominio se retoma, reactivar el site apuntando al backend correcto. |
| 3 | ✅ **Resuelto 2026‑11‑24.** `frontend_ddl` (Vite dev en :5173) detenido en PM2 y guardado (`pm2 save`); nginx no lo usaba. Reversible con `pm2 start frontend_ddl`. | — | — |
| 4 | La BD de Díaz Lara vive en MySQL remoto de Hostinger (`31.97.208.13`): latencia y dependencia de un segundo proveedor. | Medio | Documentar credenciales/respaldo en Hostinger o migrar a MySQL del VPS. |
| 5 | Docker está instalado sin contenedores (solo crons de prune). | Bajo | Eliminar si no hay plan de uso. |
| 6 | Puntos marcados “no verificado” en B y C (esquema exacto de tablas de B, endpoint exacto de `external` en C, intervalos de Podio). | Doc | Completar cuando se toque ese código. |

---

### Glosario mínimo

- **Lead:** persona que dejó su correo/teléfono a cambio de un descargable, newsletter o solicitud; todavía no compra.
- **Deal / negocio:** oportunidad de venta en HubSpot; cuando se marca ganada, A emite boletos y C crea el cliente.
- **Pipeline / etapa:** columnas del proceso comercial en HubSpot; C las copia como tablero y dispara automatizaciones.
- **Boleto (ticket):** acceso a evento con folio y QR; se valida con el escáner en el check‑in.
- **Invitación single‑use:** enlace que solo funciona una vez para entrar a un grupo de WhatsApp.
- **PM2:** administrador que mantiene vivos los procesos Node en el VPS.
- **nginx:** la “puerta de entrada” que decide a qué proceso mandar cada dominio.
