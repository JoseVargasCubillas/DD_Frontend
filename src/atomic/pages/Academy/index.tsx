import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@store/cartStore';

type CardTone = 'dark' | 'warm' | 'light';

interface AcademyCard {
  title: string;
  author?: string;
  eyebrow?: string;
  meta: string;
  tone?: CardTone;
}

const trainingCards: AcademyCard[] = [
  { title: 'Comunicación estratégica.', author: 'Óscar Capistrán', eyebrow: 'Curso · 5 sesiones', meta: 'Empresarial', tone: 'dark' },
  { title: '3 claves para cobrar.', author: 'Jessica Tapia', eyebrow: 'Curso · 8 sesiones', meta: 'Fiscal', tone: 'dark' },
  { title: 'Tu asistente de IA.', author: 'Mauricio Beltrán', eyebrow: 'Curso · 6 sesiones', meta: 'Otro', tone: 'dark' },
  { title: 'Beneficiario controlador.', author: 'Seminario Clúster D Diego Díaz', eyebrow: 'Curso · 6 sesiones', meta: 'Fiscal', tone: 'dark' },
];

const interviewCards: AcademyCard[] = [
  { title: 'Entrevista ex-recaudador SAT.', author: 'Lic. Castillejos', meta: 'Fiscal', tone: 'dark' },
  { title: 'Valuación de intangibles.', author: 'Patricia Galván', meta: 'Fiscal', tone: 'dark' },
  { title: 'Holding trinacional.', author: 'Patricia Galván', meta: 'Fiscal', tone: 'warm' },
  { title: 'Verdades ocultas del SAT.', author: 'Entrevista privada', meta: 'Fiscal', tone: 'warm' },
  { title: 'Estructuras internacionales.', author: 'Lic. Javier Mendoza', meta: 'Fiscal', tone: 'dark' },
];

const optimizationModules = [
  {
    number: '1',
    suffix: 'ER',
    title: 'CFDI 4.0',
    description: 'Estructuración del comprobante. Casos prácticos por giro. Riesgos comunes y rutas de defensa frente al SAT.',
  },
  {
    number: '2',
    suffix: 'DO',
    title: 'Estrategias y sus riesgos.',
    description: 'Tres estrategias fiscales aplicadas, con análisis honesto de los riesgos y zonas grises de cada una.',
  },
  {
    number: '3',
    suffix: 'ER',
    title: 'Aumenta tus deducciones.',
    description: 'Clasificación correcta de colaboraciones. Transformación de mercancía en gasto deducible. Casos por sector.',
  },
  {
    number: '4',
    suffix: 'TO',
    title: 'Formas de cobrar.',
    description: 'Tu hombre clave, ahorro deducible, control de impuestos y flujo de efectivo. Inteligencia en inversiones.',
  },
  {
    number: '5',
    suffix: 'TO',
    title: 'Deduce tus terrenos.',
    description: 'Multas ilegales del SAT. Defensa patrimonial específica. Cómo dar protección con carga individual del costo.',
  },
];

const salesCards: AcademyCard[] = [
  { title: '¿Qué es una venta?', author: 'Diego Díaz', eyebrow: 'El arte de vender · Lección 01', meta: 'Empresarial', tone: 'light' },
  { title: 'Proceso de ventas.', author: 'Diego Díaz', eyebrow: 'El arte de vender · Lección 02', meta: 'Empresarial', tone: 'light' },
  { title: 'Necesidades del cliente.', author: 'Diego Díaz', eyebrow: 'El arte de vender · Lección 03', meta: 'Empresarial', tone: 'light' },
  { title: 'Preguntas tipo sí.', author: 'Diego Díaz', eyebrow: 'El arte de vender · Lección 04', meta: 'Empresarial', tone: 'light' },
  { title: 'Derribando creencias.', author: 'Diego Díaz', eyebrow: 'El arte de vender · Lección 05', meta: 'Empresarial', tone: 'light' },
];

const questionCards: AcademyCard[] = [
  {
    title: 'Q&A deducciones.',
    author: 'Deducciones, inversiones, tipos de regímenes y sus alcances.',
    eyebrow: 'Sesión · 01',
    meta: 'Fiscal · 1h 42min',
    tone: 'dark',
  },
  {
    title: 'Q&A nómina.',
    author: 'Nómina, tasa de interés y cómo cobrarle a tu empresa.',
    eyebrow: 'Sesión · 02',
    meta: 'Fiscal · 2h 08min',
    tone: 'dark',
  },
  {
    title: 'Q&A terrenos.',
    author: 'Casas deducibles y creación de capital.',
    eyebrow: 'Sesión · 03',
    meta: 'Fiscal · 1h 58min',
    tone: 'dark',
  },
];

function SectionHeader({
  kicker,
  title,
  italic,
  description,
  inverted = false,
}: {
  kicker?: string;
  title: string;
  italic?: string;
  description: string;
  inverted?: boolean;
}) {
  return (
    <header className={`border-b pb-8 ${inverted ? 'border-white/15' : 'border-ink-900/12'}`}>
      {kicker && (
        <p className={`mb-5 text-[10px] uppercase tracking-[0.32em] ${inverted ? 'text-white/35' : 'text-ink-300'}`}>
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif text-[38px] font-normal leading-[0.98] tracking-[-0.045em] md:text-[54px] ${
          inverted ? 'text-cream-50' : 'text-ink-900'
        }`}
      >
        {title}
        {italic && <span className="italic tracking-[-0.06em]"> {italic}</span>}
      </h2>
      <p className={`mt-4 max-w-[720px] text-[15px] leading-[1.58] ${inverted ? 'text-white/62' : 'text-ink-600'}`}>
        {description}
      </p>
    </header>
  );
}

function CourseCard({ card, compact = false }: { card: AcademyCard; compact?: boolean }) {
  const isDark = card.tone === 'dark';
  const isWarm = card.tone === 'warm';

  return (
    <article className="group grid min-h-[238px] grid-rows-[minmax(118px,1fr)_auto] border border-ink-900/12 bg-cream-50">
      <div
        className={`relative overflow-hidden p-5 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_35%_34%,#423b32_0%,#171717_44%,#070707_100%)] text-white'
            : isWarm
              ? 'bg-[radial-gradient(circle_at_52%_42%,#4b3926_0%,#181411_58%,#0d0c0b_100%)] text-white'
              : 'bg-[#e2dbce] text-ink-700'
        }`}
      >
        <p className={`text-[8px] uppercase tracking-[0.28em] ${isDark || isWarm ? 'text-white/35' : 'text-ink-400'}`}>
          {card.eyebrow ?? 'Curso · Disponible'}
        </p>
        <div className="absolute bottom-5 right-5 h-[2px] w-9 bg-current opacity-70" />
        {!compact && <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />}
      </div>
      <div className="flex min-h-[92px] flex-col justify-between px-4 py-4">
        <div>
          <h3 className="font-serif text-[17px] leading-[1.08] tracking-[-0.035em] text-ink-900">
            {card.title.includes('.') ? (
              <>
                {card.title.replace('.', '')}
                <span className="italic">.</span>
              </>
            ) : (
              card.title
            )}
          </h3>
          {card.author && <p className="mt-1 font-serif text-[10px] italic leading-snug text-ink-500">{card.author}</p>}
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-ink-900/10 pt-3 text-[8px] uppercase tracking-[0.22em] text-ink-500">
          <span>{card.meta}</span>
          <span>Entrar -</span>
        </div>
      </div>
    </article>
  );
}

export default function Academy() {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const startAcademyCheckout = () => {
    addItem({
      id: 'subscription-academia-business',
      type: 'subscription',
      refId: 'off_academia_mensual',
      title: 'Academia Business',
      price: 1999,
      quantity: 1,
    });
    navigate('/checkout');
  };

  return (
    <div className="bg-[#f4f0e8] text-ink-900">
      <section className="px-6 py-14 md:py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1120px] items-center gap-12 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-[72px]">
          <div className="relative aspect-square bg-[radial-gradient(circle_at_35%_42%,#51483d_0%,#201f1c_42%,#0a0a0a_100%)]">
            <div className="absolute bottom-9 left-8 text-[9px] font-semibold uppercase leading-[1.8] tracking-[0.34em] text-white/52">
              Diego Díaz Lara
              <span className="block">Estrategia fiscal · CDMX</span>
            </div>
          </div>

          <div>
            <h1 className="font-serif text-[68px] font-normal leading-[0.9] tracking-[-0.055em] text-ink-900 md:text-[104px] lg:text-[126px]">
              Academia.
            </h1>
            <p className="mt-7 max-w-[590px] text-[17px] leading-[1.55] text-ink-700">
              La plataforma de streaming especializada que permite acceder a cientos de lecciones en video impartidas por los mejores
              expertos fiscales y contables del país.
            </p>
            <p className="mt-5 max-w-[620px] text-[17px] leading-[1.55] text-ink-700">
              Planificación fiscal, contabilidad empresarial, obligaciones tributarias, auditorías, finanzas corporativas, cumplimiento
              normativo, estrategias de optimización. Disponibles en cualquier momento desde tu computadora o celular.
            </p>
            <button type="button" onClick={startAcademyCheckout} className="btn-primary mt-8">
              Iniciar suscripción -
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-16 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeader
            title="Capacitaciones, temas"
            italic="especializados."
            description="Cursos en video estructurados por los expertos invitados al programa. Cinco a doce sesiones por curso, con material descargable y casos aplicados."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {trainingCards.map((card) => (
              <CourseCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 pt-8 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeader
            title="Entrevista con los"
            italic="expertos."
            description="Conversaciones cerradas con figuras de la fiscalidad mexicana. Sin grabación pública, sólo para suscriptores activos."
          />
          <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-5">
            {interviewCards.map((card) => (
              <CourseCard key={card.title} card={card} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#070707] px-6 py-20 text-white lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeader
            title="Optimización fiscal"
            italic="empresarial."
            description="Programa secuencial de cinco módulos. Cada uno con sesiones aplicadas, material descargable y caso de cohorte. Cohortes cerradas de máximo dieciséis empresarios."
            inverted
          />

          <div className="mt-12 grid border-l border-t border-white/12 md:grid-cols-2 lg:grid-cols-5">
            {optimizationModules.map((module) => (
              <article key={module.number} className="min-h-[292px] border-b border-r border-white/12 p-5">
                <div className="flex items-start gap-1 font-serif text-white">
                  <span className="text-[54px] leading-none tracking-[-0.06em]">{module.number}</span>
                  <span className="mt-3 text-[14px] italic uppercase tracking-[-0.02em] text-[#c4a66a]">{module.suffix}</span>
                </div>
                <p className="mt-5 text-[8px] uppercase tracking-[0.28em] text-white/35">Módulo</p>
                <h3 className="mt-4 font-serif text-[20px] leading-[1.06] tracking-[-0.04em] text-white">{module.title}</h3>
                <p className="mt-4 text-[11px] leading-[1.55] text-white/48">{module.description}</p>
                <div className="mt-8 flex items-center justify-between border-t border-white/12 pt-4 text-[8px] uppercase tracking-[0.22em] text-white/40">
                  <span>Entrar</span>
                  <span>-</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeader
            title="El arte de"
            italic="vender."
            description="Serie de seis lecciones impartidas por Diego Díaz. La venta no es persuasión: es claridad sobre lo que ofreces y para quién."
          />
          <div className="mt-10 grid gap-0 md:grid-cols-2 lg:grid-cols-5">
            {salesCards.map((card) => (
              <CourseCard key={card.title} card={card} compact />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#e5decf] px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionHeader
            title="Preguntas, y sus"
            italic="respuestas."
            description="Sesiones grabadas donde Diego responde dudas del cohorte en vivo. Tres sesiones disponibles este trimestre."
          />
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {questionCards.map((card) => (
              <CourseCard key={card.title} card={card} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
