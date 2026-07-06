import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";

const now = () => new Date().toISOString();

function slugify(value) {
  return String(value || "item")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90) || `item-${Date.now()}`;
}

function id(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState() {
  const adminId = "usr_admin";
  const userId = "usr_demo";
  const courseId = "crs_fiscal_2026";
  const moduleId = "mod_intro";
  const lessonId = "les_bienvenida";
  const createdAt = now();

  return {
    users: [
      {
        _id: adminId,
        id: adminId,
        name: "Admin Academia",
        email: "admin@diegodiaz.mx",
        password: "admin123",
        role: "admin",
        avatar: "",
        phone: "",
        bio: "",
        plan: "enterprise",
        enrolledCourses: [courseId],
        tagIds: [],
        notes: "",
        contactStatus: "customer",
        marketingStatus: "subscribed",
        signInCount: 0,
        isActive: true,
        isEmailVerified: true,
        createdAt,
      },
      {
        _id: userId,
        id: userId,
        name: "Alumno Demo",
        email: "alumno@diegodiaz.mx",
        password: "demo123",
        role: "user",
        avatar: "",
        phone: "",
        bio: "",
        plan: "pro",
        enrolledCourses: [courseId],
        tagIds: [],
        notes: "",
        contactStatus: "customer",
        marketingStatus: "subscribed",
        signInCount: 0,
        isActive: true,
        isEmailVerified: true,
        createdAt,
      },
    ],
    courses: [
      {
        _id: courseId,
        id: courseId,
        title: "Estrategia Fiscal 2026",
        slug: "estrategia-fiscal-2026",
        description: "Programa base de Academia para aprender estrategia fiscal mexicana con criterio empresarial.",
        shortDescription: "Estrategia fiscal aplicada para empresarios y contadores.",
        thumbnail: "",
        previewVideo: "",
        price: 2499,
        salePrice: 1999,
        currency: "MXN",
        category: "Academia",
        tags: ["fiscal", "empresa"],
        level: "advanced",
        status: "published",
        instructor: adminId,
        totalDuration: 42,
        totalLessons: 1,
        enrolledCount: 2,
        rating: 5,
        isFeatured: true,
        requirements: [],
        whatYouLearn: ["Diseñar estructuras fiscales sanas", "Identificar riesgos comunes", "Crear una ruta de optimización"],
        createdAt,
        courseType: "evergreen",
        primaryColor: "#171717",
        accentColor: "#78562a",
      },
    ],
    modules: [
      {
        _id: moduleId,
        id: moduleId,
        courseId,
        title: "Bienvenida",
        slug: "bienvenida",
        description: "Primeros pasos dentro de la Academia.",
        order: 1,
        lessonIds: [lessonId],
        isPublished: true,
        createdAt,
      },
    ],
    lessons: [
      {
        _id: lessonId,
        id: lessonId,
        title: "Cómo usar la Academia",
        slug: "como-usar-la-academia",
        course: courseId,
        moduleId,
        order: 1,
        description: "Recorrido inicial por el contenido y la forma de estudiar.",
        videoUrl: "",
        duration: 42,
        content: "<p>Bienvenido a la Academia. Esta lección confirma que el flujo de cursos, módulos y lecciones está conectado.</p>",
        resources: [{ name: "Guía de inicio", url: "https://diegodiaz.mx" }],
        isPreview: true,
        isFree: true,
        mediaType: "none",
        isPublished: true,
        commentsVisibility: "visible",
      },
    ],
    tags: [
      { _id: "tag_cliente", id: "tag_cliente", name: "Cliente", slug: "cliente", color: "#78562a", description: "Cliente activo", contactsCount: 2, createdAt },
    ],
    packages: [],
    promotions: [],
    offers: [
      {
        _id: "off_academia_mensual",
        id: "off_academia_mensual",
        title: "Academia Business",
        slug: "academia-business",
        description: "Acceso mensual a la Academia.",
        type: "standard",
        status: "published",
        price: 1999,
        currency: "MXN",
        content: [{ courseId, access: "full", moduleIds: [] }],
        assignedUserIds: [adminId, userId],
        startsAt: null,
        expiresAt: null,
        createdAt,
      },
    ],
    blog: [],
    orders: [],
    subscriptions: [],
    comments: [],
    emailLogs: [],
    webhookEvents: [],
  };
}

function createStore(filePath) {
  function read() {
    if (!fs.existsSync(filePath)) {
      const seed = defaultState();
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
      return seed;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    return { ...defaultState(), ...JSON.parse(raw || "{}") };
  }

  function write(state) {
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
  }

  return {
    get: () => clone(read()),
    set: (state) => write(state),
    update: (fn) => {
      const state = read();
      const result = fn(state) ?? state;
      write(result);
      return clone(result);
    },
  };
}

function publicUser(user, state, populateCourses = false) {
  const { password, ...safe } = user;
  const tags = (safe.tagIds || []).map((tagId) => state.tags.find((tag) => tag._id === tagId)).filter(Boolean);
  const enrolledCourses = populateCourses
    ? (safe.enrolledCourses || []).map((courseId) => hydrateCourse(state, state.courses.find((course) => course._id === courseId))).filter(Boolean)
    : safe.enrolledCourses || [];
  return { ...safe, tags, enrolledCourses };
}

function hydrateCourse(state, course) {
  if (!course) return null;
  const lessons = state.lessons
    .filter((lesson) => lesson.course === course._id)
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
  return {
    ...course,
    id: course._id,
    totalLessons: lessons.length || course.totalLessons || 0,
    totalDuration: lessons.reduce((sum, lesson) => sum + Number(lesson.duration || 0), 0) || course.totalDuration || 0,
    lessons,
  };
}

function resolveCourse(state, value) {
  return state.courses.find((entry) => entry.slug === value || entry._id === value || entry.id === value) || null;
}

function resolveLesson(state, courseId, lessonId) {
  if (!lessonId) return null;
  return state.lessons.find((entry) => entry.course === courseId && (entry._id === lessonId || entry.id === lessonId)) || null;
}

function publicComment(state, comment) {
  const author = state.users.find((user) => user._id === comment.userId || user.id === comment.userId);
  const lesson = comment.lessonId ? state.lessons.find((entry) => entry._id === comment.lessonId || entry.id === comment.lessonId) : null;
  return {
    ...comment,
    id: comment._id,
    author: author ? publicUser(author, state) : null,
    lesson: lesson ? { id: lesson._id, _id: lesson._id, title: lesson.title, order: lesson.order } : null,
  };
}

function tokenFor(userId) {
  return Buffer.from(JSON.stringify({ userId, issuedAt: Date.now() })).toString("base64url");
}

function userFromToken(state, req) {
  const header = req.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token, "base64url").toString("utf8"));
    return state.users.find((user) => user._id === payload.userId) || null;
  } catch {
    return null;
  }
}

function requireUser(store, req, res) {
  const state = store.get();
  const user = userFromToken(state, req);
  if (!user) {
    res.status(401).json({ success: false, message: "Sesion requerida" });
    return null;
  }
  return { state, user };
}

function paginate(items, req) {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(200, Math.max(1, Number(req.query.limit || 100)));
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);
  return { success: true, data, pagination: { total: items.length, page, pages: Math.max(1, Math.ceil(items.length / limit)) } };
}

function upsertById(collection, item) {
  const index = collection.findIndex((entry) => entry._id === item._id || entry.id === item._id);
  if (index >= 0) collection[index] = { ...collection[index], ...item, id: item._id };
  else collection.push({ ...item, id: item._id });
}

function hasStripeSecret() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.startsWith("sk_"));
}

function stripeAmount(value) {
  return Math.max(50, Math.round(Number(value || 0) * 100));
}

function appendStripeParam(params, key, value) {
  if (value === undefined || value === null || value === "") return;
  params.append(key, String(value));
}

async function stripeRequest(pathname, params) {
  if (!hasStripeSecret()) throw new Error("STRIPE_SECRET_KEY no configurada");

  const res = await fetch(`https://api.stripe.com/v1${pathname}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error?.message || `Stripe error ${res.status}`);
  }
  return data;
}

async function createStripePaymentIntent({ amount, currency, user, orderId }) {
  const params = new URLSearchParams();
  appendStripeParam(params, "amount", stripeAmount(amount));
  appendStripeParam(params, "currency", String(currency || "MXN").toLowerCase());
  appendStripeParam(params, "automatic_payment_methods[enabled]", "true");
  appendStripeParam(params, "metadata[userId]", user._id);
  appendStripeParam(params, "metadata[orderId]", orderId);
  appendStripeParam(params, "receipt_email", user.email);
  return stripeRequest("/payment_intents", params);
}

async function createStripeCustomer(user) {
  const params = new URLSearchParams();
  appendStripeParam(params, "name", user.name);
  appendStripeParam(params, "email", user.email);
  appendStripeParam(params, "metadata[userId]", user._id);
  return stripeRequest("/customers", params);
}

async function createStripeSubscription({ user, plan }) {
  const priceId =
    process.env.STRIPE_PRICE_ACADEMIA ||
    process.env.STRIPE_PRICE_INICIATIVA_MENSUAL ||
    process.env.VITE_STRIPE_PRICE_INICIATIVA_MENSUAL;

  if (!priceId?.startsWith("price_")) {
    throw new Error("Configura STRIPE_PRICE_ACADEMIA=price_...");
  }

  const customer = await createStripeCustomer(user);
  const params = new URLSearchParams();
  appendStripeParam(params, "customer", customer.id);
  appendStripeParam(params, "items[0][price]", priceId);
  appendStripeParam(params, "payment_behavior", "default_incomplete");
  appendStripeParam(params, "payment_settings[save_default_payment_method]", "on_subscription");
  appendStripeParam(params, "expand[]", "latest_invoice.payment_intent");
  appendStripeParam(params, "metadata[userId]", user._id);
  appendStripeParam(params, "metadata[plan]", plan || "pro");
  return stripeRequest("/subscriptions", params);
}

function verifyStripeSignature(req) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret?.startsWith("whsec_")) return true;

  const signature = req.get("stripe-signature") || "";
  const timestamp = signature
    .split(",")
    .map((part) => part.split("="))
    .find(([key]) => key === "t")?.[1];
  const expected = signature
    .split(",")
    .map((part) => part.split("="))
    .find(([key]) => key === "v1")?.[1];

  if (!timestamp || !expected || !req.rawBody) return false;

  const signedPayload = `${timestamp}.${req.rawBody.toString("utf8")}`;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(expected));
  } catch {
    return false;
  }
}

function createCrudRoutes(app, API_BASE, store, name, defaults, listShape = "array") {
  app.get(`${API_BASE}/${name}`, (_req, res) => {
    const state = store.get();
    const rows = state[name] || [];
    res.json(listShape === "paginated" ? paginate(rows, _req) : { success: true, data: rows });
  });

  app.post(`${API_BASE}/${name}`, (req, res) => {
    const state = store.update((draft) => {
      const item = { ...defaults(req.body, draft), ...req.body };
      item._id = item._id || id(name.slice(0, 3));
      item.id = item._id;
      item.slug = item.slug || slugify(item.title || item.name || item.code);
      item.createdAt = item.createdAt || now();
      draft[name].push(item);
    });
    res.status(201).json({ success: true, data: state[name][state[name].length - 1] });
  });

  app.get(`${API_BASE}/${name}/:id`, (req, res) => {
    const state = store.get();
    const item = (state[name] || []).find((entry) => entry._id === req.params.id || entry.id === req.params.id || entry.slug === req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Registro no encontrado" });
    res.json({ success: true, data: item });
  });

  app.put(`${API_BASE}/${name}/:id`, (req, res) => {
    let updated = null;
    store.update((draft) => {
      const item = draft[name].find((entry) => entry._id === req.params.id || entry.id === req.params.id);
      if (!item) return;
      Object.assign(item, req.body, { id: item._id });
      updated = item;
    });
    if (!updated) return res.status(404).json({ success: false, message: "Registro no encontrado" });
    res.json({ success: true, data: updated });
  });

  app.delete(`${API_BASE}/${name}/:id`, (req, res) => {
    store.update((draft) => {
      draft[name] = draft[name].filter((entry) => entry._id !== req.params.id && entry.id !== req.params.id);
    });
    res.status(204).send();
  });
}

export function installAcademyApi(app, API_BASE, rootDir) {
  const store = createStore(path.join(rootDir, "server", "academy-data.json"));

  app.post(`${API_BASE}/auth/login`, (req, res) => {
    const state = store.get();
    const user = state.users.find((entry) => entry.email.toLowerCase() === String(req.body.email || "").toLowerCase());
    if (!user || user.password !== req.body.password || !user.isActive) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }
    store.update((draft) => {
      const stored = draft.users.find((entry) => entry._id === user._id);
      stored.signInCount = Number(stored.signInCount || 0) + 1;
      stored.lastLogin = now();
    });
    const accessToken = tokenFor(user._id);
    res.json({ success: true, data: { user: publicUser(user, state), accessToken, refreshToken: accessToken } });
  });

  app.post(`${API_BASE}/auth/register`, (req, res) => {
    let created;
    const state = store.update((draft) => {
      if (draft.users.some((user) => user.email.toLowerCase() === String(req.body.email || "").toLowerCase())) return;
      const userId = id("usr");
      created = {
        _id: userId,
        id: userId,
        name: req.body.name || "Usuario",
        email: req.body.email,
        password: req.body.password,
        role: "user",
        avatar: "",
        phone: "",
        bio: "",
        plan: "free",
        enrolledCourses: [],
        tagIds: [],
        notes: "",
        contactStatus: "lead",
        marketingStatus: "never_subscribed",
        signInCount: 1,
        isActive: true,
        isEmailVerified: true,
        lastLogin: now(),
        createdAt: now(),
      };
      draft.users.push(created);
    });
    if (!created) return res.status(409).json({ success: false, message: "El correo ya existe" });
    const accessToken = tokenFor(created._id);
    res.status(201).json({ success: true, data: { user: publicUser(created, state), accessToken, refreshToken: accessToken } });
  });

  app.post(`${API_BASE}/auth/refresh`, (req, res) => {
    const state = store.get();
    const user = userFromToken(state, { get: () => `Bearer ${req.body.refreshToken}` });
    if (!user) return res.status(401).json({ success: false, message: "Refresh invalido" });
    const accessToken = tokenFor(user._id);
    res.json({ success: true, data: { accessToken, refreshToken: accessToken } });
  });

  app.get(`${API_BASE}/auth/me`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    res.json({ success: true, data: publicUser(session.user, session.state, true) });
  });

  app.post(`${API_BASE}/auth/admin/users`, (req, res) => {
    const tempPassword = Math.random().toString(36).slice(2, 10);
    let created;
    store.update((draft) => {
      const userId = id("usr");
      created = {
        _id: userId,
        id: userId,
        name: req.body.name,
        email: req.body.email,
        password: tempPassword,
        role: req.body.role || "user",
        avatar: "",
        phone: "",
        bio: "",
        plan: "free",
        enrolledCourses: req.body.courseIds || [],
        tagIds: req.body.tagIds || [],
        notes: "",
        contactStatus: "lead",
        marketingStatus: req.body.marketingStatus || "never_subscribed",
        signInCount: 0,
        isActive: true,
        isEmailVerified: true,
        createdAt: now(),
      };
      draft.users.push(created);
    });
    res.status(201).json({ success: true, data: { user: publicUser(created, store.get()), tempPassword } });
  });

  app.get(`${API_BASE}/users`, (req, res) => {
    const state = store.get();
    const query = String(req.query.search || "").toLowerCase();
    let users = state.users.map((user) => publicUser(user, state));
    if (query) users = users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(query));
    if (req.query.role) users = users.filter((user) => user.role === req.query.role);
    res.json(paginate(users, req));
  });

  app.get(`${API_BASE}/users/profile`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    res.json({ success: true, data: publicUser(session.user, session.state, true) });
  });

  app.put(`${API_BASE}/users/profile`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === session.user._id);
      Object.assign(updated, req.body);
    });
    res.json({ success: true, data: publicUser(updated, state, true) });
  });

  app.get(`${API_BASE}/users/:id`, (req, res) => {
    const state = store.get();
    const user = state.users.find((entry) => entry._id === req.params.id || entry.id === req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    const orders = state.orders.filter((order) => order.userId === user._id || order.customerId === user._id);
    res.json({ success: true, data: { ...publicUser(user, state, true), orders } });
  });

  app.put(`${API_BASE}/users/:id`, (req, res) => {
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === req.params.id || user.id === req.params.id);
      if (updated) Object.assign(updated, req.body);
    });
    if (!updated) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, data: publicUser(updated, state, true) });
  });

  app.patch(`${API_BASE}/users/:id/toggle`, (req, res) => {
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === req.params.id || user.id === req.params.id);
      if (updated) updated.isActive = !updated.isActive;
    });
    if (!updated) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({ success: true, data: publicUser(updated, state, true) });
  });

  app.post(`${API_BASE}/users/:id/tags`, (req, res) => {
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === req.params.id);
      if (updated && req.body.tagId && !updated.tagIds.includes(req.body.tagId)) updated.tagIds.push(req.body.tagId);
    });
    res.json({ success: true, data: publicUser(updated, state).tags });
  });

  app.delete(`${API_BASE}/users/:id/tags/:tagId`, (req, res) => {
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === req.params.id);
      if (updated) updated.tagIds = updated.tagIds.filter((tagId) => tagId !== req.params.tagId);
    });
    res.json({ success: true, data: publicUser(updated, state).tags });
  });

  app.put(`${API_BASE}/users/:id/notes`, (req, res) => {
    let updated;
    const state = store.update((draft) => {
      updated = draft.users.find((user) => user._id === req.params.id);
      if (updated) updated.notes = req.body.notes || "";
    });
    res.json({ success: true, data: publicUser(updated, state, true) });
  });

  app.post(`${API_BASE}/users/:id/send-password`, (_req, res) => {
    res.json({ success: true, data: { tempPassword: "demo123" } });
  });

  app.post(`${API_BASE}/users/import`, (req, res) => {
    const contacts = req.body.contacts || [];
    let created = 0;
    let updated = 0;
    const results = [];
    store.update((draft) => {
      for (const contact of contacts) {
        let user = draft.users.find((entry) => entry.email.toLowerCase() === String(contact.email || "").toLowerCase());
        const courseIds = Object.entries(req.body.productMappings || {})
          .filter(([product]) => (contact.products || []).includes(product))
          .flatMap(([, ids]) => ids);
        if (user) {
          updated += 1;
          Object.assign(user, contact);
          user.enrolledCourses = Array.from(new Set([...(user.enrolledCourses || []), ...courseIds]));
          results.push({ email: user.email, name: user.name, status: "updated", userId: user._id, products: contact.products || [], courseIds, unmatchedProducts: [] });
        } else {
          created += 1;
          const userId = id("usr");
          user = { ...defaultState().users[1], _id: userId, id: userId, email: contact.email, name: contact.name, password: "demo123", enrolledCourses: courseIds, createdAt: contact.createdAt || now() };
          draft.users.push(user);
          results.push({ email: user.email, name: user.name, status: "created", userId, tempPassword: "demo123", products: contact.products || [], courseIds, unmatchedProducts: [] });
        }
      }
    });
    res.json({ success: true, data: { summary: { total: contacts.length, created, updated, skipped: 0, products: Object.keys(req.body.productMappings || {}).length, unmatchedProducts: [] }, results } });
  });

  app.get(`${API_BASE}/courses`, (req, res) => {
    const state = store.get();
    const search = String(req.query.search || "").toLowerCase();
    let courses = state.courses.map((course) => hydrateCourse(state, course));
    if (!req.query.includeAll) courses = courses.filter((course) => course.status === "published");
    if (req.query.status) courses = courses.filter((course) => course.status === req.query.status);
    if (search) courses = courses.filter((course) => `${course.title} ${course.description}`.toLowerCase().includes(search));
    if (req.query.category) courses = courses.filter((course) => course.category === req.query.category);
    res.json(paginate(courses, req));
  });

  app.get(`${API_BASE}/courses/admin/:id`, (req, res) => {
    const state = store.get();
    const course = state.courses.find((entry) => entry._id === req.params.id || entry.id === req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Curso no encontrado" });
    const modules = state.modules.filter((module) => module.courseId === course._id).map((module) => ({ ...module, lessons: state.lessons.filter((lesson) => lesson.moduleId === module._id) }));
    res.json({ success: true, data: { ...hydrateCourse(state, course), modules } });
  });

  app.get(`${API_BASE}/courses/:courseId/comments`, (req, res) => {
    const state = store.get();
    const course = resolveCourse(state, req.params.courseId);
    const courseKeys = new Set([req.params.courseId, course?._id, course?.id, course?.slug].filter(Boolean));

    const lessonId = req.query.lessonId ? String(req.query.lessonId) : "";
    const lesson = course && lessonId ? resolveLesson(state, course._id, lessonId) : null;
    const lessonKeys = new Set([lessonId, lesson?._id, lesson?.id, lesson?.slug].filter(Boolean));
    let comments = (state.comments || []).filter((comment) => courseKeys.has(comment.courseId));
    if (lessonId) {
      comments = comments.filter((comment) => lessonKeys.has(comment.lessonId));
    }
    comments = comments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    res.json({ success: true, data: comments.map((comment) => publicComment(state, comment)) });
  });

  app.post(`${API_BASE}/courses/:courseId/comments`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;

    const course = resolveCourse(session.state, req.params.courseId);
    const resolvedCourseId = course?._id || req.params.courseId;

    const body = String(req.body.body || req.body.content || "").trim();
    if (!body) return res.status(400).json({ success: false, message: "Comentario requerido" });

    const lessonId = req.body.lessonId ? String(req.body.lessonId) : "";
    let lesson = null;
    if (course && lessonId) {
      lesson = resolveLesson(session.state, course._id, lessonId);
      if (lesson && (lesson.commentsVisibility === "hidden" || lesson.commentsVisibility === "locked")) {
        return res.status(403).json({ success: false, message: "Comentarios cerrados para esta leccion" });
      }
    }

    let created;
    const state = store.update((draft) => {
      draft.comments = draft.comments || [];
      created = {
        _id: id("com"),
        id: "",
        courseId: resolvedCourseId,
        lessonId: lesson?._id || lessonId,
        userId: session.user._id,
        body,
        status: "published",
        createdAt: now(),
        updatedAt: now(),
      };
      created.id = created._id;
      draft.comments.push(created);
    });

    res.status(201).json({ success: true, data: publicComment(state, created) });
  });

  app.delete(`${API_BASE}/courses/:courseId/comments/:commentId`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;

    const comment = (session.state.comments || []).find((entry) => entry._id === req.params.commentId || entry.id === req.params.commentId);
    if (!comment) return res.status(404).json({ success: false, message: "Comentario no encontrado" });
    if (comment.userId !== session.user._id && session.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "No puedes eliminar este comentario" });
    }

    store.update((draft) => {
      draft.comments = (draft.comments || []).filter((entry) => entry._id !== req.params.commentId && entry.id !== req.params.commentId);
    });
    res.status(204).send();
  });

  app.get(`${API_BASE}/courses/:slug`, (req, res) => {
    const state = store.get();
    const course = state.courses.find((entry) => entry.slug === req.params.slug || entry._id === req.params.slug || entry.id === req.params.slug);
    if (!course) return res.status(404).json({ success: false, message: "Curso no encontrado" });
    res.json({ success: true, data: hydrateCourse(state, course) });
  });

  app.post(`${API_BASE}/courses`, (req, res) => {
    let created;
    store.update((draft) => {
      const courseId = id("crs");
      created = {
        _id: courseId,
        id: courseId,
        title: req.body.title || "Nuevo curso",
        slug: req.body.slug || slugify(req.body.title || "nuevo-curso"),
        description: req.body.description || "",
        shortDescription: req.body.shortDescription || req.body.description || "",
        thumbnail: req.body.thumbnail || "",
        previewVideo: "",
        price: Number(req.body.price || 0),
        currency: req.body.currency || "MXN",
        category: req.body.category || "Academia",
        tags: req.body.tags || [],
        level: req.body.level || "beginner",
        status: req.body.status || "draft",
        instructor: "usr_admin",
        totalDuration: 0,
        totalLessons: 0,
        enrolledCount: 0,
        rating: 0,
        isFeatured: Boolean(req.body.isFeatured),
        requirements: req.body.requirements || [],
        whatYouLearn: req.body.whatYouLearn || [],
        createdAt: now(),
        courseType: req.body.courseType || "evergreen",
        primaryColor: req.body.primaryColor || "#171717",
        accentColor: req.body.accentColor || "#0a0a0a",
      };
      draft.courses.push(created);
    });
    res.status(201).json({ success: true, data: hydrateCourse(store.get(), created) });
  });

  app.put(`${API_BASE}/courses/:id`, (req, res) => {
    let updated;
    store.update((draft) => {
      updated = draft.courses.find((course) => course._id === req.params.id || course.id === req.params.id);
      if (updated) Object.assign(updated, req.body, { id: updated._id, slug: req.body.slug || updated.slug || slugify(req.body.title) });
    });
    if (!updated) return res.status(404).json({ success: false, message: "Curso no encontrado" });
    res.json({ success: true, data: hydrateCourse(store.get(), updated) });
  });

  app.delete(`${API_BASE}/courses/:id`, (req, res) => {
    store.update((draft) => {
      draft.courses = draft.courses.filter((course) => course._id !== req.params.id && course.id !== req.params.id);
      draft.modules = draft.modules.filter((module) => module.courseId !== req.params.id);
      draft.lessons = draft.lessons.filter((lesson) => lesson.course !== req.params.id);
      draft.comments = (draft.comments || []).filter((comment) => comment.courseId !== req.params.id);
    });
    res.json({ success: true, data: { message: "Curso eliminado" } });
  });

  app.get(`${API_BASE}/courses/:courseId/lessons`, (req, res) => {
    const state = store.get();
    res.json({ success: true, data: state.lessons.filter((lesson) => lesson.course === req.params.courseId).sort((a, b) => a.order - b.order) });
  });

  app.get(`${API_BASE}/courses/:courseId/lessons/:lessonId`, (req, res) => {
    const state = store.get();
    const lesson = state.lessons.find((entry) => entry.course === req.params.courseId && (entry._id === req.params.lessonId || entry.id === req.params.lessonId));
    if (!lesson) return res.status(404).json({ success: false, message: "Leccion no encontrada" });
    res.json({ success: true, data: lesson });
  });

  app.put(`${API_BASE}/courses/:courseId/lessons/:lessonId`, (req, res) => {
    let updated;
    store.update((draft) => {
      updated = draft.lessons.find((lesson) => lesson._id === req.params.lessonId || lesson.id === req.params.lessonId);
      if (updated) Object.assign(updated, req.body, { id: updated._id });
    });
    res.json({ success: true, data: updated });
  });

  app.delete(`${API_BASE}/courses/:courseId/lessons/:lessonId`, (req, res) => {
    store.update((draft) => {
      draft.lessons = draft.lessons.filter((lesson) => lesson._id !== req.params.lessonId && lesson.id !== req.params.lessonId);
      draft.comments = (draft.comments || []).filter((comment) => comment.lessonId !== req.params.lessonId);
    });
    res.status(204).send();
  });

  app.get(`${API_BASE}/courses/:courseId/modules`, (req, res) => {
    const state = store.get();
    res.json({ success: true, data: state.modules.filter((module) => module.courseId === req.params.courseId).sort((a, b) => a.order - b.order) });
  });

  app.post(`${API_BASE}/courses/:courseId/modules`, (req, res) => {
    let created;
    store.update((draft) => {
      created = { _id: id("mod"), id: "", courseId: req.params.courseId, title: req.body.title || "Modulo", slug: slugify(req.body.title), description: req.body.description || "", order: draft.modules.filter((module) => module.courseId === req.params.courseId).length + 1, lessonIds: [], isPublished: true, createdAt: now() };
      created.id = created._id;
      draft.modules.push(created);
    });
    res.status(201).json({ success: true, data: created });
  });

  app.post(`${API_BASE}/courses/:courseId/modules/reorder`, (req, res) => {
    let modules;
    store.update((draft) => {
      for (const [index, moduleId] of (req.body.orderedIds || []).entries()) {
        const module = draft.modules.find((entry) => entry._id === moduleId);
        if (module) module.order = index + 1;
      }
      modules = draft.modules.filter((module) => module.courseId === req.params.courseId).sort((a, b) => a.order - b.order);
    });
    res.json({ success: true, data: modules });
  });

  app.put(`${API_BASE}/modules/:id`, (req, res) => {
    let updated;
    store.update((draft) => {
      updated = draft.modules.find((module) => module._id === req.params.id);
      if (updated) Object.assign(updated, req.body, { id: updated._id });
    });
    res.json({ success: true, data: updated });
  });

  app.delete(`${API_BASE}/modules/:id`, (req, res) => {
    store.update((draft) => {
      draft.modules = draft.modules.filter((module) => module._id !== req.params.id);
      draft.lessons = draft.lessons.filter((lesson) => lesson.moduleId !== req.params.id);
    });
    res.status(204).send();
  });

  app.get(`${API_BASE}/modules/:moduleId/lessons`, (req, res) => {
    const state = store.get();
    res.json({ success: true, data: state.lessons.filter((lesson) => lesson.moduleId === req.params.moduleId).sort((a, b) => a.order - b.order) });
  });

  app.post(`${API_BASE}/modules/:moduleId/lessons`, (req, res) => {
    let created;
    store.update((draft) => {
      const module = draft.modules.find((entry) => entry._id === req.params.moduleId);
      if (!module) return;
      created = { _id: id("les"), id: "", title: req.body.title || "Nueva leccion", slug: slugify(req.body.title), course: module.courseId, moduleId: module._id, order: draft.lessons.filter((lesson) => lesson.moduleId === module._id).length + 1, description: req.body.description || "", videoUrl: req.body.videoUrl || "", duration: Number(req.body.duration || 0), content: req.body.content || "", resources: req.body.resources || [], isPreview: false, isFree: false, mediaType: req.body.mediaType || "none", isPublished: true, commentsVisibility: "visible" };
      created.id = created._id;
      draft.lessons.push(created);
      module.lessonIds.push(created._id);
    });
    if (!created) return res.status(404).json({ success: false, message: "Modulo no encontrado" });
    res.status(201).json({ success: true, data: created });
  });

  app.post(`${API_BASE}/courses/import/drive/preview`, (_req, res) => {
    res.json({ success: true, data: { rootFolders: 1, rootVideos: 0, courses: [{ title: "Curso importado desde Drive", modules: 1, lessons: 1 }] } });
  });

  app.post(`${API_BASE}/courses/import/drive`, (req, res) => {
    const incoming = req.body.courses?.length ? req.body.courses : [{ title: "Curso importado desde Drive", description: req.body.folderUrl || "", modules: [{ title: "Modulo 1", lessons: [{ title: "Leccion 1" }] }] }];
    let createdCourses = 0;
    let createdModules = 0;
    let createdLessons = 0;
    store.update((draft) => {
      if (req.body.resetExisting) {
        draft.courses = [];
        draft.modules = [];
        draft.lessons = [];
      }
      for (const inputCourse of incoming) {
        const courseId = id("crs");
        draft.courses.push({ ...defaultState().courses[0], _id: courseId, id: courseId, title: inputCourse.title, slug: slugify(inputCourse.title), description: inputCourse.description || "", shortDescription: inputCourse.description || "", status: req.body.status || "draft", createdAt: now(), enrolledCount: 0 });
        createdCourses += 1;
        for (const inputModule of inputCourse.modules || []) {
          const moduleId = id("mod");
          draft.modules.push({ _id: moduleId, id: moduleId, courseId, title: inputModule.title, slug: slugify(inputModule.title), description: "", order: createdModules + 1, lessonIds: [], isPublished: true, createdAt: now() });
          createdModules += 1;
          for (const inputLesson of inputModule.lessons || []) {
            const lessonId = id("les");
            draft.lessons.push({ ...defaultState().lessons[0], _id: lessonId, id: lessonId, title: inputLesson.title, slug: slugify(inputLesson.title), course: courseId, moduleId, order: createdLessons + 1, videoUrl: inputLesson.videoUrl || "", resources: inputLesson.resources || [] });
            createdLessons += 1;
          }
        }
      }
    });
    res.json({ success: true, data: { createdCourses, updatedCourses: 0, resetCourses: req.body.resetExisting ? 1 : 0, createdModules, createdLessons, skippedLessons: 0 } });
  });

  createCrudRoutes(app, API_BASE, store, "tags", (body) => ({ name: body.name || "Etiqueta", color: body.color || "#78562a", description: body.description || "", contactsCount: 0 }), "array");
  createCrudRoutes(app, API_BASE, store, "packages", (body) => ({ name: body.name || "Paquete", description: "", price: 0, currency: "MXN", courseIds: [], durationDays: 30, isActive: true, isFeatured: false }), "array");
  createCrudRoutes(app, API_BASE, store, "promotions", (body) => ({ code: body.code || "PROMO", description: "", type: "percentage", value: 0, scope: "all", targetId: "", expiresAt: null, maxUses: 0, usedCount: 0, isActive: true }), "array");
  createCrudRoutes(app, API_BASE, store, "offers", (body) => ({ title: body.title || "Oferta", description: "", type: "standard", status: "draft", price: 0, currency: "MXN", content: [], assignedUserIds: [], startsAt: null, expiresAt: null }), "array");
  createCrudRoutes(app, API_BASE, store, "blog", (body) => ({ title: body.title || "Post", content: "", excerpt: "", thumbnail: "", author: "usr_admin", category: "General", tags: [], status: "draft", readTime: 1, viewsCount: 0, isFeatured: false, seo: { metaTitle: "", metaDescription: "", keywords: [] } }), "paginated");

  app.get(`${API_BASE}/blog/:slug`, (req, res) => {
    const state = store.get();
    const post = state.blog.find((entry) => entry.slug === req.params.slug || entry._id === req.params.slug);
    if (!post) return res.status(404).json({ success: false, message: "Post no encontrado" });
    res.json({ success: true, data: post });
  });

  app.post(`${API_BASE}/packages/assign/:userId`, (req, res) => {
    let user;
    store.update((draft) => {
      user = draft.users.find((entry) => entry._id === req.params.userId);
      const pkg = draft.packages.find((entry) => entry._id === req.body.packageId);
      if (user && pkg) user.enrolledCourses = Array.from(new Set([...(user.enrolledCourses || []), ...(pkg.courseIds || [])]));
    });
    res.json({ success: true, data: { userId: req.params.userId, packageId: req.body.packageId } });
  });

  app.post(`${API_BASE}/offers/:offerId/assign`, (req, res) => {
    let offer;
    store.update((draft) => {
      offer = draft.offers.find((entry) => entry._id === req.params.offerId || entry.id === req.params.offerId);
      if (offer) offer.assignedUserIds = Array.from(new Set([...(offer.assignedUserIds || []), ...(req.body.userIds || [])]));
    });
    res.json({ success: true, data: offer });
  });

  app.delete(`${API_BASE}/offers/:offerId/users/:userId`, (req, res) => {
    let offer;
    store.update((draft) => {
      offer = draft.offers.find((entry) => entry._id === req.params.offerId || entry.id === req.params.offerId);
      if (offer) offer.assignedUserIds = (offer.assignedUserIds || []).filter((userId) => userId !== req.params.userId);
    });
    res.json({ success: true, data: offer });
  });

  app.get(`${API_BASE}/subscriptions/active`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    const subscription = session.state.subscriptions.find((entry) => entry.user === session.user._id && entry.status === "active") || null;
    res.json({ success: true, data: subscription });
  });

  app.post(`${API_BASE}/subscriptions`, async (req, res, next) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    try {
      if (hasStripeSecret()) {
        const stripeSubscription = await createStripeSubscription({
          user: session.user,
          plan: req.body.plan || "pro",
        });
        const paymentIntent = stripeSubscription.latest_invoice?.payment_intent;
        let subscription;
        store.update((draft) => {
          subscription = {
            _id: stripeSubscription.id,
            id: stripeSubscription.id,
            stripeSubscriptionId: stripeSubscription.id,
            stripeCustomerId: stripeSubscription.customer,
            user: session.user._id,
            plan: req.body.plan || "pro",
            status: stripeSubscription.status === "active" ? "active" : "trialing",
            currentPeriodEnd: stripeSubscription.current_period_end
              ? new Date(stripeSubscription.current_period_end * 1000).toISOString()
              : new Date(Date.now() + 30 * 86400000).toISOString(),
            cancelAtPeriodEnd: Boolean(stripeSubscription.cancel_at_period_end),
          };
          upsertById(draft.subscriptions, subscription);
        });
        res.json({
          success: true,
          data: {
            ...subscription,
            clientSecret: paymentIntent?.client_secret || "",
          },
        });
        return;
      }

      let subscription;
      store.update((draft) => {
        const courseIds = draft.courses.filter((course) => course.status === "published").map((course) => course._id);
        const user = draft.users.find((entry) => entry._id === session.user._id);
        user.plan = req.body.plan || "pro";
        user.enrolledCourses = Array.from(new Set([...(user.enrolledCourses || []), ...courseIds]));
        subscription = { _id: id("sub"), id: "", user: user._id, plan: user.plan, status: "active", currentPeriodEnd: new Date(Date.now() + 30 * 86400000).toISOString(), cancelAtPeriodEnd: false };
        subscription.id = subscription._id;
        draft.subscriptions.push(subscription);
      });
      res.json({ success: true, data: { ...subscription, clientSecret: "demo_subscription_active" } });
    } catch (error) {
      next(error);
    }
  });

  app.post(`${API_BASE}/subscriptions/cancel`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    let subscription = null;
    store.update((draft) => {
      subscription = draft.subscriptions.find((entry) => entry.user === session.user._id && entry.status === "active");
      if (subscription) {
        subscription.status = "canceled";
        subscription.cancelAtPeriodEnd = true;
      }
    });
    res.json({ success: true, data: subscription });
  });

  app.post(`${API_BASE}/payments/intent`, async (req, res, next) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    try {
      const items = req.body.items || [];
      const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1), 0);
      const orderId = id("ord");

      if (hasStripeSecret()) {
        const paymentIntent = await createStripePaymentIntent({
          amount: total,
          currency: items[0]?.currency || "MXN",
          user: session.user,
          orderId,
        });
        store.update((draft) => {
          const user = draft.users.find((entry) => entry._id === session.user._id);
          const order = {
            _id: orderId,
            id: orderId,
            user: user._id,
            userId: user._id,
            customerId: user._id,
            customerName: user.name,
            customerEmail: user.email,
            items,
            total,
            currency: "MXN",
            status: "pending",
            paymentProvider: "stripe",
            paymentIntentId: paymentIntent.id,
            createdAt: now(),
          };
          draft.orders.push(order);
        });
        res.json({ success: true, data: { clientSecret: paymentIntent.client_secret, orderId } });
        return;
      }

      let order;
      store.update((draft) => {
        const user = draft.users.find((entry) => entry._id === session.user._id);
        for (const item of items) {
          if (item.type === "course" && item.refId && !user.enrolledCourses.includes(item.refId)) user.enrolledCourses.push(item.refId);
        }
        order = { _id: orderId, id: orderId, user: user._id, userId: user._id, customerId: user._id, customerName: user.name, customerEmail: user.email, items, total, currency: "MXN", status: "completed", paymentProvider: "demo", paymentIntentId: `demo_${orderId}`, paidAt: now(), createdAt: now() };
        draft.orders.push(order);
      });
      res.json({ success: true, data: { clientSecret: `demo_${order._id}`, orderId: order._id } });
    } catch (error) {
      next(error);
    }
  });

  app.get(`${API_BASE}/payments/orders`, (req, res) => {
    const session = requireUser(store, req, res);
    if (!session) return;
    const orders = session.user.role === "admin" ? session.state.orders : session.state.orders.filter((order) => order.userId === session.user._id);
    res.json({ success: true, data: orders });
  });

  app.post(`${API_BASE}/email/broadcast`, (req, res) => {
    const state = store.update((draft) => {
      draft.emailLogs.unshift({ _id: id("eml"), id: "", ...req.body, sent: draft.users.length, failed: 0, createdAt: now() });
    });
    res.json({ success: true, data: { sent: state.users.length, failed: 0, total: state.users.length } });
  });

  app.get(`${API_BASE}/email/segments`, (_req, res) => {
    const state = store.get();
    res.json({ success: true, data: { all: state.users.length, subscribed: state.users.filter((user) => user.marketingStatus === "subscribed").length, customers: state.users.filter((user) => user.contactStatus === "customer").length, leads: state.users.filter((user) => user.contactStatus === "lead").length } });
  });

  app.get(`${API_BASE}/email/contacts`, (req, res) => {
    const state = store.get();
    const segment = req.query.segment;
    let users = state.users;
    if (segment === "subscribed") users = users.filter((user) => user.marketingStatus === "subscribed");
    if (segment === "customers") users = users.filter((user) => user.contactStatus === "customer");
    if (segment === "leads") users = users.filter((user) => user.contactStatus === "lead");
    res.json({ success: true, data: users.map((user) => ({ name: user.name, email: user.email })) });
  });

  app.post(`${API_BASE}/stripe/webhook`, (req, res) => {
    if (!verifyStripeSignature(req)) {
      res.status(400).json({ success: false, message: "Firma de Stripe invalida" });
      return;
    }

    const event = req.body || {};
    const type = event.type || "unknown";
    const object = event.data?.object || event.related_object || {};

    store.update((draft) => {
      draft.webhookEvents = draft.webhookEvents || [];
      draft.webhookEvents.unshift({
        _id: event.id || id("evt"),
        id: event.id || id("evt"),
        type,
        livemode: Boolean(event.livemode),
        receivedAt: now(),
        objectId: object.id || "",
      });
      draft.webhookEvents = draft.webhookEvents.slice(0, 100);

      if (type === "payment_intent.succeeded") {
        const order = draft.orders.find((entry) => entry.paymentIntentId === object.id);
        if (order) {
          order.status = "completed";
          order.paidAt = now();
        }
      }

      if (type === "payment_intent.payment_failed") {
        const order = draft.orders.find((entry) => entry.paymentIntentId === object.id);
        if (order) order.status = "failed";
      }

      if (type === "charge.refunded") {
        const order = draft.orders.find((entry) => entry.paymentIntentId === object.payment_intent);
        if (order) order.status = "refunded";
      }

      if (
        type === "customer.subscription.created" ||
        type === "customer.subscription.updated"
      ) {
        const userId = object.metadata?.userId || object.metadata?.user_id || "usr_demo";
        const plan = object.metadata?.plan || "pro";
        const subscriptionId = object.id || id("sub");
        const status = object.status === "canceled" ? "canceled" : "active";
        const existing = draft.subscriptions.find((entry) => entry._id === subscriptionId || entry.stripeSubscriptionId === subscriptionId);
        const subscription = {
          _id: existing?._id || subscriptionId,
          id: existing?.id || subscriptionId,
          stripeSubscriptionId: subscriptionId,
          user: userId,
          plan,
          status,
          currentPeriodEnd: object.current_period_end
            ? new Date(object.current_period_end * 1000).toISOString()
            : new Date(Date.now() + 30 * 86400000).toISOString(),
          cancelAtPeriodEnd: Boolean(object.cancel_at_period_end),
        };
        upsertById(draft.subscriptions, subscription);
      }

      if (type === "customer.subscription.deleted") {
        const subscription = draft.subscriptions.find((entry) => entry._id === object.id || entry.stripeSubscriptionId === object.id);
        if (subscription) {
          subscription.status = "canceled";
          subscription.cancelAtPeriodEnd = true;
        }
      }

      if (type === "invoice.payment_succeeded") {
        const subscription = draft.subscriptions.find((entry) => entry.stripeSubscriptionId === object.subscription);
        if (subscription) subscription.status = "active";
      }

      if (type === "invoice.payment_failed") {
        const subscription = draft.subscriptions.find((entry) => entry.stripeSubscriptionId === object.subscription);
        if (subscription) subscription.status = "past_due";
      }

      if (type === "checkout.session.completed") {
        const userId = object.metadata?.userId || object.metadata?.user_id || "usr_demo";
        const courseIds = String(object.metadata?.courseIds || object.metadata?.course_ids || "")
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
        const user = draft.users.find((entry) => entry._id === userId || entry.id === userId);
        if (user && courseIds.length) {
          user.enrolledCourses = Array.from(new Set([...(user.enrolledCourses || []), ...courseIds]));
        }
      }
    });

    res.json({ received: true, type });
  });

  app.get(`${API_BASE}/stripe/webhook/events`, (_req, res) => {
    const state = store.get();
    res.json({ success: true, data: state.webhookEvents || [] });
  });
}
