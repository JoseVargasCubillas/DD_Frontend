// Mock data temporal mientras se conecta el backend.
// TODO: reemplazar cada selector por llamada al API (ver rutas en comentarios).

export type Tag = { id: string; name: string; contactsCount: number };

export type ContactStatus = 'Customer' | 'Lead' | 'Subscriber';

export type Contact = {
  id: string;
  name: string;
  email: string;
  status: ContactStatus;
  marketingStatus: 'Subscribed' | 'Never subscribed' | 'Unsubscribed';
  lifetimeValue: number;
  addedDate: string;       // ISO
  lastActivity: string | null;
  totalSignIns: number;
  lastSignIn: string | null;
  totalOffers: number;
  totalProducts: number;
  tags: string[];          // tag ids
  optIn: 'Confirmed' | 'Unconfirmed';
};

export type OfferPackage = {
  id: string;
  name: string;
  durationDays: number;    // paquete de tiempo
  price: number;
  currency: 'MXN' | 'USD';
  productIds: string[];    // cursos incluidos
  active: boolean;
};

export type SubscriptionRow = {
  id: string;
  contactId: string;
  contactName: string;
  contactEmail: string;
  offerId: string;
  offerName: string;
  status: 'Active' | 'Pending deactivation' | 'Expired' | 'Granted';
  startDate: string;
  endDate: string;
  remainingDays: number;
};

export type Product = {
  id: string;
  title: string;
  thumbnail: string;       // url o placeholder
  members: number;
  createdAt: string;
  type: 'Evergreen course' | 'Cohort' | 'Membership';
  status: 'Published' | 'Draft';
};

export type Lesson = {
  id: string;
  title: string;
  durationMin: number;
  published: boolean;
};

export type Module = {
  id: string;
  number: number;
  title: string;
  published: boolean;
  lessons: Lesson[];
};

// ─── Seed data ────────────────────────────────────────────

export const MOCK_TAGS: Tag[] = [
  { id: 't1',  name: '7 FORMAS PARA COBRAR A TU EMPRESA',     contactsCount: 0   },
  { id: 't2',  name: 'APRENDE LOS HÁBITOS DE ROCKEFELLER',    contactsCount: 0   },
  { id: 't3',  name: 'BÁSICOS FISCALES GRATIS 48HRS',         contactsCount: 24  },
  { id: 't4',  name: 'Básicos Fiscales para emprendedores',   contactsCount: 0   },
  { id: 't5',  name: 'BÁSICOS FISCALES Waitlist',             contactsCount: 0   },
  { id: 't6',  name: 'CAPACITACIÓN DE ESTRATEGIA FISCAL',     contactsCount: 0   },
  { id: 't7',  name: 'CAPACITACIÓN ONLINE ESTRATEGIA FISCAL', contactsCount: 0   },
  { id: 't8',  name: 'EL ARTE DE LEVANTAR CAPITAL Waitlist',  contactsCount: 0   },
  { id: 't9',  name: 'Leads campañas',                        contactsCount: 190 },
  { id: 't10', name: 'leads campañas 2',                      contactsCount: 195 },
  { id: 't11', name: 'Leads campañas 3',                      contactsCount: 180 },
  { id: 't12', name: 'leads campañas 4',                      contactsCount: 193 },
  { id: 't13', name: 'leads campañas 5',                      contactsCount: 192 },
  { id: 't14', name: 'Leads campañas 6',                      contactsCount: 918 },
  { id: 't15', name: 'leads campañas 7',                      contactsCount: 944 },
  { id: 't16', name: 'MASTERCLASS: EL ARTE DE VENDER',        contactsCount: 307 },
];

export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1',  name: 'Carolina Flores Amador',       email: 'c_flores_26@hotmail.com',           status: 'Customer',   marketingStatus: 'Never subscribed', lifetimeValue: 0,    addedDate: '2026-06-01', lastActivity: '2026-06-17', totalSignIns: 6, lastSignIn: '2026-06-16', totalOffers: 1, totalProducts: 4, tags: ['t3'],  optIn: 'Unconfirmed' },
  { id: 'c2',  name: 'Ramiro García Cantu',          email: 'ramiro@conexpert.com.mx',           status: 'Customer',   marketingStatus: 'Never subscribed', lifetimeValue: 0,    addedDate: '2026-05-29', lastActivity: '2026-05-29', totalSignIns: 2, lastSignIn: '2026-05-29', totalOffers: 1, totalProducts: 2, tags: ['t14'], optIn: 'Confirmed' },
  { id: 'c3',  name: 'Fabián Muzuzu',                email: 'finanzas@grupowavemx.com',          status: 'Lead',       marketingStatus: 'Subscribed',       lifetimeValue: 0,    addedDate: '2026-05-29', lastActivity: '2026-06-03', totalSignIns: 0, lastSignIn: null,         totalOffers: 0, totalProducts: 0, tags: ['t15'], optIn: 'Confirmed' },
  { id: 'c4',  name: 'Ernesto Rodríguez Anaya',      email: 'erodriguez@upc.tax',                status: 'Customer',   marketingStatus: 'Never subscribed', lifetimeValue: 1200, addedDate: '2026-05-29', lastActivity: '2026-06-09', totalSignIns: 4, lastSignIn: '2026-06-09', totalOffers: 2, totalProducts: 3, tags: ['t14','t16'], optIn: 'Confirmed' },
  { id: 'c5',  name: 'Cesar Mauricio Valencia',      email: 'cmauriciovs@gmail.com',             status: 'Subscriber', marketingStatus: 'Subscribed',       lifetimeValue: 0,    addedDate: '2026-05-29', lastActivity: '2026-05-29', totalSignIns: 0, lastSignIn: null,         totalOffers: 0, totalProducts: 0, tags: ['t13'], optIn: 'Confirmed' },
  { id: 'c6',  name: 'Susana Morales Rodríguez',     email: 'susanamoralesrod@gmail.com',        status: 'Lead',       marketingStatus: 'Never subscribed', lifetimeValue: 0,    addedDate: '2026-05-29', lastActivity: '2026-06-03', totalSignIns: 0, lastSignIn: null,         totalOffers: 0, totalProducts: 0, tags: ['t11'], optIn: 'Unconfirmed' },
  { id: 'c7',  name: 'Nadia Mendoza Herrera',        email: 'nmendoza@jardinesdesantacruz.com',  status: 'Customer',   marketingStatus: 'Subscribed',       lifetimeValue: 4800, addedDate: '2026-05-26', lastActivity: null,         totalSignIns: 12,lastSignIn: '2026-06-12', totalOffers: 1, totalProducts: 5, tags: ['t14','t16'], optIn: 'Confirmed' },
  { id: 'c8',  name: 'Marcos Ernesto Coronado',      email: 'mcoronado.courses@gmail.com',       status: 'Customer',   marketingStatus: 'Subscribed',       lifetimeValue: 2400, addedDate: '2026-05-25', lastActivity: '2026-05-31', totalSignIns: 8, lastSignIn: '2026-05-31', totalOffers: 2, totalProducts: 4, tags: ['t9','t10'],  optIn: 'Confirmed' },
  { id: 'c9',  name: 'Flor Azalia Contreras',        email: 'finanzas@acmindustrias.com',        status: 'Lead',       marketingStatus: 'Subscribed',       lifetimeValue: 0,    addedDate: '2026-05-25', lastActivity: '2026-06-18', totalSignIns: 0, lastSignIn: null,         totalOffers: 0, totalProducts: 0, tags: ['t12'], optIn: 'Confirmed' },
  { id: 'c10', name: 'Cristina Elizabeth Ocampo',    email: 'facturamau@hotmail.com',            status: 'Subscriber', marketingStatus: 'Subscribed',       lifetimeValue: 0,    addedDate: '2026-05-25', lastActivity: null,         totalSignIns: 0, lastSignIn: null,         totalOffers: 0, totalProducts: 0, tags: ['t9'],  optIn: 'Confirmed' },
];

export const MOCK_OFFERS: OfferPackage[] = [
  { id: 'o1', name: 'MM 2026 (90 días)',    durationDays: 90,  price: 0,     currency: 'MXN', productIds: ['p1','p2','p3'], active: true  },
  { id: 'o2', name: 'Inmuebles (1 mes)',    durationDays: 30,  price: 0,     currency: 'MXN', productIds: ['p4'],            active: true  },
  { id: 'o3', name: 'MM (30 Días)',         durationDays: 30,  price: 1500,  currency: 'MXN', productIds: ['p1'],            active: true  },
  { id: 'o4', name: 'Mastermind 6 meses',   durationDays: 180, price: 7500,  currency: 'MXN', productIds: ['p1','p2'],       active: true  },
  { id: 'o5', name: 'Mastermind anual',     durationDays: 365, price: 12000, currency: 'MXN', productIds: ['p1','p2','p3','p4'], active: true },
];

export const MOCK_SUBSCRIPTIONS: SubscriptionRow[] = [
  { id: 's1', contactId: 'c1', contactName: 'Carolina Flores Amador',  contactEmail: 'c_flores_26@hotmail.com',    offerId: 'o4', offerName: 'Mastermind 6 meses', status: 'Active',               startDate: '2026-06-01', endDate: '2026-12-01', remainingDays: 165 },
  { id: 's2', contactId: 'c2', contactName: 'Ramiro García Cantu',     contactEmail: 'ramiro@conexpert.com.mx',    offerId: 'o3', offerName: 'MM (30 Días)',       status: 'Pending deactivation', startDate: '2026-05-29', endDate: '2026-06-28', remainingDays: 9   },
  { id: 's3', contactId: 'c4', contactName: 'Ernesto Rodríguez Anaya', offerId: 'o5', offerName: 'Mastermind anual',                                contactEmail: 'erodriguez@upc.tax',          status: 'Active',               startDate: '2026-05-29', endDate: '2027-05-29', remainingDays: 344 },
  { id: 's4', contactId: 'c7', contactName: 'Nadia Mendoza Herrera',   offerId: 'o1', offerName: 'MM 2026 (90 días)',                              contactEmail: 'nmendoza@jardinesdesantacruz.com', status: 'Granted',         startDate: '2026-05-26', endDate: '2026-08-24', remainingDays: 66  },
  { id: 's5', contactId: 'c8', contactName: 'Marcos Ernesto Coronado', offerId: 'o3', offerName: 'MM (30 Días)',                                   contactEmail: 'mcoronado.courses@gmail.com', status: 'Expired',              startDate: '2026-04-25', endDate: '2026-05-25', remainingDays: 0   },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', title: 'OTRAS CAPACITACIONES',              thumbnail: '', members: 835, createdAt: '2022-05-31', type: 'Evergreen course', status: 'Published' },
  { id: 'p2', title: 'CAPACITACIONES TEMAS ESPECIALIZADOS', thumbnail: '', members: 895, createdAt: '2024-02-29', type: 'Evergreen course', status: 'Published' },
  { id: 'p3', title: 'ENTREVISTAS CON LOS EXPERTOS',      thumbnail: '', members: 693, createdAt: '2024-08-22', type: 'Evergreen course', status: 'Published' },
  { id: 'p4', title: 'SEMINARIO: BENEFICIOS FISCALES',    thumbnail: '', members: 0,   createdAt: '2024-09-10', type: 'Evergreen course', status: 'Draft'     },
  { id: 'p5', title: 'PREGUNTAS Y RESPUESTAS',            thumbnail: '', members: 393, createdAt: '2024-09-10', type: 'Evergreen course', status: 'Published' },
  { id: 'p6', title: 'MASTERCLASS: EL ARTE DE VENDER',    thumbnail: '', members: 307, createdAt: '2025-03-12', type: 'Evergreen course', status: 'Published' },
  { id: 'p7', title: 'HOLDING',                           thumbnail: '', members: 0,   createdAt: '2025-05-28', type: 'Evergreen course', status: 'Draft'     },
];

// Outline para Producto p1 (referencia: imagen "OTRAS CAPACITACIONES" con 9 módulos)
export const MOCK_OUTLINE: Record<string, Module[]> = {
  p1: [
    { id: 'm1', number: 1, title: 'MÓDULO 1', published: true,  lessons: [
      { id: 'l1', title: 'Carta Porte',           durationMin: 42, published: true },
      { id: 'l2', title: 'Introducción al CFDI 4.0', durationMin: 61, published: true },
    ]},
    { id: 'm2', number: 2, title: 'MÓDULO 2', published: true,  lessons: [
      { id: 'l3', title: 'CFDI 4.0',                            durationMin: 38, published: true },
      { id: 'l4', title: '3 Estrategias fiscales y sus riesgos', durationMin: 55, published: true },
    ]},
    { id: 'm3', number: 3, title: 'MÓDULO 3', published: true,  lessons: [
      { id: 'l5', title: 'Aumenta tu deducciones',         durationMin: 47, published: true },
      { id: 'l6', title: 'Clasifica a tus colaboradores',  durationMin: 36, published: true },
      { id: 'l7', title: 'Transforma la mercancía en gasto', durationMin: 52, published: true },
    ]},
    { id: 'm4', number: 4, title: 'MÓDULO 4', published: true,  lessons: [
      { id: 'l8',  title: 'Formas de cobrar a tu empresa',                 durationMin: 41, published: true },
      { id: 'l9',  title: 'Tu Hombre Clave, un ahorro deducible',          durationMin: 33, published: true },
      { id: 'l10', title: 'Control de impuestos y flujo de efectivo.',     durationMin: 49, published: true },
      { id: 'l11', title: 'Inteligencia en inversiones',                   durationMin: 58, published: true },
    ]},
    { id: 'm5', number: 5, title: 'MÓDULO 5', published: true,  lessons: [
      { id: 'l12', title: 'Deduce tus terrenos',  durationMin: 44, published: true },
      { id: 'l13', title: 'Multas ilegales del SAT', durationMin: 39, published: true },
    ]},
    { id: 'm6', number: 6, title: 'MÓDULO 6', published: true,  lessons: [
      { id: 'l14', title: 'Deducciones de automóviles y sus letras chiquitas', durationMin: 51, published: true },
      { id: 'l15', title: 'Estrategias para tu defensa fiscal',                durationMin: 47, published: true },
      { id: 'l16', title: '¿Cómo cobrar a tu empresa? y qué es eso de partes relacionadas', durationMin: 53, published: true },
    ]},
    { id: 'm7', number: 7, title: 'MÓDULO 7', published: true,  lessons: [
      { id: 'l17', title: 'Multas ilegales',                                       durationMin: 36, published: true },
      { id: 'l18', title: 'La Estrategia Fiscal que todos deberíamos aprovechar',  durationMin: 49, published: true },
    ]},
    { id: 'm8', number: 8, title: 'MÓDULO 8', published: true,  lessons: [
      { id: 'l19', title: '¿Cómo cuadripliqué mis ingresos en plena pandemia?', durationMin: 62, published: true },
    ]},
    { id: 'm9', number: 9, title: 'MÓDULO 9', published: true,  lessons: [
      { id: 'l20', title: 'Webinar: Negligencia Médica (Colaboracion con Lex Group)', durationMin: 71, published: true },
    ]},
  ],
};

// ─── Selectors (simulan async para useQuery) ───────────────
const delay = <T>(value: T, ms = 200) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));

export const fetchContacts        = () => delay(MOCK_CONTACTS);    // TODO: GET /contacts
export const fetchTags            = () => delay(MOCK_TAGS);        // TODO: GET /tags
export const fetchOffers          = () => delay(MOCK_OFFERS);      // TODO: GET /offers
export const fetchSubscriptions   = () => delay(MOCK_SUBSCRIPTIONS); // TODO: GET /subscriptions
export const fetchProducts        = () => delay(MOCK_PRODUCTS);    // TODO: GET /products
export const fetchOutline         = (productId: string) => delay(MOCK_OUTLINE[productId] ?? []);
export const fetchContact         = (id: string) =>
  delay(MOCK_CONTACTS.find((c) => c.id === id) ?? null);
