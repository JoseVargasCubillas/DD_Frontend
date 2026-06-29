import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import mysql from "mysql2/promise";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.backend") });
dotenv.config({ path: path.join(rootDir, ".env") });

const env = process.env;
const PORT = Number(env.PORT || 4000);
const API_PREFIX = env.API_PREFIX || "api";
const API_BASE = `/${API_PREFIX}/v1`;
const uploadDir = path.resolve(rootDir, env.UPLOAD_DIR || "./uploads");
const databaseName = env.DB_DATABASE || "consultoria_db";

fs.mkdirSync(uploadDir, { recursive: true });

const app = express();

const corsOrigins = (env.CORS_ORIGIN || env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(uploadDir));

const dbConnectionConfig = {
  host: env.DB_HOST || "localhost",
  port: Number(env.DB_PORT || 3306),
  user: env.DB_USERNAME || "root",
  password: env.DB_PASSWORD || "",
};

const pool = mysql.createPool({
  ...dbConnectionConfig,
  database: env.DB_DATABASE || "consultoria_db",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

const eventColumns = `
  id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  short_description TEXT NULL,
  description LONGTEXT NULL,
  thumbnail LONGTEXT NULL,
  type ENUM('seminar','workshop','webinar','conference') NOT NULL DEFAULT 'seminar',
  modality ENUM('in-person','online','hybrid') NOT NULL DEFAULT 'in-person',
  location VARCHAR(255) NULL,
  online_url TEXT NULL,
  start_date DATETIME NOT NULL,
  end_date DATETIME NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  sale_price DECIMAL(12,2) NULL,
  capacity INT UNSIGNED NOT NULL DEFAULT 0,
  registered_count INT UNSIGNED NOT NULL DEFAULT 0,
  status ENUM('upcoming','ongoing','finished','canceled') NOT NULL DEFAULT 'upcoming',
  instructor VARCHAR(255) NOT NULL DEFAULT 'admin',
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  agenda JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
`;

async function ensureDatabase() {
  const bootstrap = await mysql.createConnection(dbConnectionConfig);
  const safeDatabaseName = databaseName.replace(/`/g, "``");
  await bootstrap.query(`CREATE DATABASE IF NOT EXISTS \`${safeDatabaseName}\``);
  await bootstrap.end();
  await pool.query(`CREATE TABLE IF NOT EXISTS events (${eventColumns})`);
}

function toIso(value) {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function toMysqlDate(value) {
  const date = new Date(value);
  const safeDate = Number.isNaN(date.getTime()) ? new Date() : date;
  return safeDate.toISOString().slice(0, 19).replace("T", " ");
}

function publicUrl(req, filePath) {
  const normalized = filePath.split(path.sep).join("/");
  return `${req.protocol}://${req.get("host")}/${normalized}`;
}

function mapEvent(row) {
  return {
    id: String(row.id),
    _id: String(row.id),
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    shortDescription: row.short_description || "",
    thumbnail: row.thumbnail || "",
    type: row.type,
    modality: row.modality,
    location: row.location || "",
    onlineUrl: row.online_url || "",
    startDate: toIso(row.start_date),
    endDate: toIso(row.end_date),
    price: Number(row.price || 0),
    salePrice: row.sale_price == null ? undefined : Number(row.sale_price),
    capacity: Number(row.capacity || 0),
    registeredCount: Number(row.registered_count || 0),
    status: row.status,
    instructor: row.instructor || "admin",
    isFeatured: Boolean(row.is_featured),
    agenda: typeof row.agenda === "string" ? JSON.parse(row.agenda || "[]") : row.agenda || [],
    createdAt: toIso(row.created_at),
  };
}

function normalizeEventPayload(body) {
  return {
    title: String(body.title || "Nuevo evento"),
    slug: String(body.slug || body.title || "nuevo-evento")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80),
    short_description: body.shortDescription || body.short_description || "",
    description: body.description || "",
    thumbnail: body.thumbnail || "",
    type: body.type || "seminar",
    modality: body.modality || "in-person",
    location: body.location || "",
    online_url: body.onlineUrl || body.online_url || "",
    start_date: toMysqlDate(body.startDate || body.start_date || new Date()),
    end_date: toMysqlDate(body.endDate || body.end_date || body.startDate || new Date()),
    price: Number(body.price || 0),
    sale_price: body.salePrice ?? body.sale_price ?? null,
    capacity: Number(body.capacity || 0),
    registered_count: Number(body.registeredCount || body.registered_count || 0),
    status: body.status || "upcoming",
    instructor: typeof body.instructor === "string" ? body.instructor : "admin",
    is_featured: body.isFeatured || body.is_featured ? 1 : 0,
    agenda: JSON.stringify(body.agenda || []),
  };
}

const storage = multer.diskStorage({
  destination(_req, _file, callback) {
    const eventsDir = path.join(uploadDir, "events");
    fs.mkdirSync(eventsDir, { recursive: true });
    callback(null, eventsDir);
  },
  filename(_req, file, callback) {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeName = path
      .basename(file.originalname || "event-image", ext)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    callback(null, `${Date.now()}-${safeName || "event-image"}${ext || ".jpg"}`);
  },
});

const upload = multer({ storage });

app.get(`${API_BASE}/health`, (_req, res) => {
  res.json({ success: true, data: { ok: true } });
});

app.post(`${API_BASE}/uploads/events`, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: "Archivo requerido" });
    return;
  }

  const relativePath = path.relative(rootDir, req.file.path);
  res.json({
    success: true,
    data: {
      url: publicUrl(req, relativePath),
      filename: req.file.filename,
      size: req.file.size,
      mimeType: req.file.mimetype,
    },
  });
});

app.get(`${API_BASE}/events`, async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(200, Math.max(1, Number(req.query.limit || 100)));
    const offset = (page - 1) * limit;
    const status = req.query.status ? String(req.query.status) : "";

    const where = status ? "WHERE status = :status" : "";
    const params = { status, limit, offset };
    const [countRows] = await pool.execute(
      `SELECT COUNT(*) AS total FROM events ${where}`,
      params,
    );
    const [rows] = await pool.execute(
      `SELECT * FROM events ${where} ORDER BY start_date ASC LIMIT :limit OFFSET :offset`,
      params,
    );
    const total = Number(countRows[0]?.total || 0);

    res.json({
      success: true,
      data: rows.map(mapEvent),
      pagination: { total, page, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    next(error);
  }
});

app.get(`${API_BASE}/events/:slug`, async (req, res, next) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM events WHERE slug = :slug LIMIT 1", {
      slug: req.params.slug,
    });
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Evento no encontrado" });
      return;
    }
    res.json({ success: true, data: mapEvent(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.post(`${API_BASE}/events`, async (req, res, next) => {
  try {
    const event = normalizeEventPayload(req.body);
    if (event.is_featured) {
      await pool.execute("UPDATE events SET is_featured = 0");
    }

    const [result] = await pool.execute(
      `INSERT INTO events (
        title, slug, short_description, description, thumbnail, type, modality,
        location, online_url, start_date, end_date, price, sale_price, capacity,
        registered_count, status, instructor, is_featured, agenda
      ) VALUES (
        :title, :slug, :short_description, :description, :thumbnail, :type, :modality,
        :location, :online_url, :start_date, :end_date, :price, :sale_price, :capacity,
        :registered_count, :status, :instructor, :is_featured, :agenda
      )`,
      event,
    );

    const [rows] = await pool.execute("SELECT * FROM events WHERE id = :id", {
      id: result.insertId,
    });
    res.status(201).json({ success: true, data: mapEvent(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.put(`${API_BASE}/events/:id`, async (req, res, next) => {
  try {
    const event = normalizeEventPayload(req.body);
    if (event.is_featured) {
      await pool.execute("UPDATE events SET is_featured = 0 WHERE id <> :id", {
        id: req.params.id,
      });
    }

    await pool.execute(
      `UPDATE events SET
        title = :title,
        slug = :slug,
        short_description = :short_description,
        description = :description,
        thumbnail = :thumbnail,
        type = :type,
        modality = :modality,
        location = :location,
        online_url = :online_url,
        start_date = :start_date,
        end_date = :end_date,
        price = :price,
        sale_price = :sale_price,
        capacity = :capacity,
        registered_count = :registered_count,
        status = :status,
        instructor = :instructor,
        is_featured = :is_featured,
        agenda = :agenda
      WHERE id = :id`,
      { ...event, id: req.params.id },
    );

    const [rows] = await pool.execute("SELECT * FROM events WHERE id = :id", {
      id: req.params.id,
    });
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Evento no encontrado" });
      return;
    }
    res.json({ success: true, data: mapEvent(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.post(`${API_BASE}/events/:id/register`, async (req, res, next) => {
  try {
    await pool.execute(
      "UPDATE events SET registered_count = registered_count + 1 WHERE id = :id",
      { id: req.params.id },
    );
    const [rows] = await pool.execute("SELECT * FROM events WHERE id = :id", {
      id: req.params.id,
    });
    if (!rows.length) {
      res.status(404).json({ success: false, message: "Evento no encontrado" });
      return;
    }
    res.json({ success: true, data: mapEvent(rows[0]) });
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({
    success: false,
    message: error?.message || "Error interno del servidor",
  });
});

ensureDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API local lista en http://localhost:${PORT}${API_BASE}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo inicializar la base de datos:", error);
    process.exit(1);
  });
