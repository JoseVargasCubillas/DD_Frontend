import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as usersApi from '@api/users.api';
import { useAuthStore } from '@store/authStore';
import type { Course, User } from '@t/index';

type EnrolledCourse = Course | string;

type AcademyItem = {
  title: string;
  author: string;
  category: string;
  sessions: string;
  description?: string;
  href: string;
  moduleNumber?: string;
  moduleSuffix?: string;
};

const isCourse = (course: EnrolledCourse): course is Course =>
  typeof course === 'object' && course !== null;

const getInstructorName = (instructor: Course['instructor']) => {
  if (typeof instructor === 'string') return instructor || 'Diego Diaz';
  return (instructor as Pick<User, 'name'> | undefined)?.name ?? 'Diego Diaz';
};

const fallbackCourses: AcademyItem[] = [
  {
    title: 'Comunicacion estrategica.',
    author: 'Oscar Cayetano',
    category: 'Empresarial',
    sessions: '8 sesiones',
    href: '/mi-cuenta/cursos',
  },
  {
    title: '3 claves para cobrar.',
    author: 'Jessica Tapia',
    category: 'Fiscal',
    sessions: '5 sesiones',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Tu asistente de IA.',
    author: 'Mauricio Bojorquez',
    category: 'Otro',
    sessions: '6 sesiones',
    href: '/mi-cuenta/cursos',
  },
];

const interviews: AcademyItem[] = [
  {
    title: 'Entrevista ex-recaudador SAT.',
    author: 'Lic. Castillejos',
    category: 'Fiscal',
    sessions: '28 min',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Valuacion de intangibles.',
    author: 'Patricio Galvan',
    category: 'Fiscal',
    sessions: '42 min',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Holding trinacional.',
    author: 'Patricio Galvan',
    category: 'Fiscal',
    sessions: '35 min',
    href: '/mi-cuenta/cursos',
  },
];

const modules: AcademyItem[] = [
  {
    title: 'CFDI 4.0.',
    author: 'Diego Diaz',
    category: 'Modulo 01',
    sessions: 'Fiscal',
    description: 'Estructuracion del comprobante y casos practicos para detectar riesgos comunes.',
    href: '/mi-cuenta/cursos',
    moduleNumber: '1',
    moduleSuffix: 'ER',
  },
  {
    title: 'Estrategias y sus riesgos.',
    author: 'Diego Diaz',
    category: 'Modulo 02',
    sessions: 'Fiscal',
    description: 'Tres estrategias aplicadas con analisis honesto de riesgos y zonas grises.',
    href: '/mi-cuenta/cursos',
    moduleNumber: '2',
    moduleSuffix: 'DO',
  },
  {
    title: 'Aumenta tus deducciones.',
    author: 'Diego Diaz',
    category: 'Modulo 03',
    sessions: 'Fiscal',
    description: 'Clasificacion correcta de colaboraciones y transformacion de gasto deducible.',
    href: '/mi-cuenta/cursos',
    moduleNumber: '3',
    moduleSuffix: 'ER',
  },
];

const salesLessons: AcademyItem[] = [
  {
    title: '¿Qué es una venta?',
    author: 'Diego Diaz',
    category: 'El arte de vender',
    sessions: 'Leccion 01',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Proceso de ventas.',
    author: 'Diego Diaz',
    category: 'El arte de vender',
    sessions: 'Leccion 02',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Necesidades del cliente.',
    author: 'Diego Diaz',
    category: 'El arte de vender',
    sessions: 'Leccion 03',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Preguntas tipo si.',
    author: 'Diego Diaz',
    category: 'El arte de vender',
    sessions: 'Leccion 04',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Derribando creencias.',
    author: 'Diego Diaz',
    category: 'El arte de vender',
    sessions: 'Leccion 05',
    href: '/mi-cuenta/cursos',
  },
];

const qas: AcademyItem[] = [
  {
    title: 'Q&A deducciones.',
    author: 'Sesion 01',
    category: 'Fiscal',
    sessions: '1h 42min',
    description: 'Deducciones, inversiones, tipos de regimenes y sus alcances.',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Q&A nomina.',
    author: 'Sesion 02',
    category: 'Fiscal',
    sessions: '2h 08min',
    description: 'Nomina, tasa de interes y como cobrarle a tu empresa.',
    href: '/mi-cuenta/cursos',
  },
  {
    title: 'Q&A terrenos.',
    author: 'Sesion 03',
    category: 'Fiscal',
    sessions: '1h 58min',
    description: 'Casas deducibles y creacion de capital.',
    href: '/mi-cuenta/cursos',
  },
];

function SectionTitle({
  label,
  title,
  italic,
  copy,
  dark = false,
}: {
  label: string;
  title: string;
  italic: string;
  copy: string;
  dark?: boolean;
}) {
  return (
    <div>
      <p className={`mb-3 text-[10px] uppercase tracking-[0.4em] ${dark ? 'text-white/45' : 'text-ink-700'}`}>{label}</p>
      <h2 className={`font-serif text-[clamp(1.9rem,4vw,3rem)] leading-[1] tracking-tight ${dark ? 'text-white' : 'text-ink-900'}`}>
        {title} <span className="italic">{italic}</span>
      </h2>
      <p className={`mt-3 max-w-2xl font-serif text-base italic ${dark ? 'text-white/60' : 'text-ink-600'}`}>{copy}</p>
      <div className={`mt-5 h-px ${dark ? 'bg-white/15' : 'bg-ink-900/20'}`} />
    </div>
  );
}

function AcademyCard({ item, dark = false }: { item: AcademyItem; dark?: boolean }) {
  return (
    <Link
      to={item.href}
      className={`group block border transition-colors cursor-pointer ${
        dark
          ? 'border-white/15 bg-[#0b0b0b] hover:bg-cream-100'
          : 'border-ink-900/15 bg-cream-100 hover:border-ink-900'
      }`}
    >
      <div className={`p-5 ${dark ? 'text-white group-hover:text-ink-900' : 'text-ink-900'}`}>
        <p className={`mb-8 text-[10px] uppercase tracking-[0.3em] ${dark ? 'text-white/45 group-hover:text-ink-600' : 'text-ink-600'}`}>
          {item.category} · {item.sessions}
        </p>
        <h3 className="font-serif text-2xl leading-none tracking-tight">
          {item.title}
        </h3>
        <p className={`mt-2 font-serif text-sm italic ${dark ? 'text-white/55 group-hover:text-ink-600' : 'text-ink-600'}`}>
          {item.author}
        </p>
        {item.description && (
          <p className={`mt-5 text-sm leading-relaxed ${dark ? 'text-white/55 group-hover:text-ink-600' : 'text-ink-600'}`}>
            {item.description}
          </p>
        )}
        <p className={`mt-6 border-t pt-4 text-[10px] uppercase tracking-[0.3em] transition-all group-hover:tracking-[0.42em] ${
          dark ? 'border-white/15 text-white/50 group-hover:border-ink-900/20 group-hover:text-ink-900' : 'border-ink-900/15 text-ink-700'
        }`}>
          Entrar -
        </p>
      </div>
    </Link>
  );
}

function ModuleCard({ item }: { item: AcademyItem }) {
  return (
    <Link
      to={item.href}
      className="group flex min-h-[292px] flex-col border-b border-r border-white/12 bg-[#0b0b0b] p-6 text-white transition-colors hover:bg-[#101010] md:p-7"
    >
      <div className="flex items-start gap-1 font-serif">
        <span className="text-[58px] leading-none tracking-[-0.06em] md:text-[66px]">{item.moduleNumber}</span>
        <span className="mt-3 text-[14px] italic uppercase tracking-[-0.02em] text-[#c4a66a]">{item.moduleSuffix}</span>
      </div>

      <p className="mt-4 text-[9px] uppercase tracking-[0.3em] text-white/35">
        {item.category} · {item.sessions}
      </p>

      <h3 className="mt-6 font-serif text-[24px] leading-[0.98] tracking-[-0.045em] text-white">
        {item.title}
      </h3>
      <p className="mt-2 font-serif text-sm italic leading-none text-white/55">{item.author}</p>

      {item.description && (
        <p className="mt-7 flex-1 text-sm leading-relaxed text-white/55">{item.description}</p>
      )}

      <p className="mt-8 flex items-center justify-between border-t border-white/12 pt-4 text-[10px] uppercase tracking-[0.3em] text-white/45 transition-colors group-hover:text-white/70">
        <span>Entrar</span>
        <span>-</span>
      </p>
    </Link>
  );
}

function SalesLessonCard({ item }: { item: AcademyItem }) {
  return (
    <Link
      to={item.href}
      className="group grid min-h-[150px] grid-rows-[66px_1fr] border-b border-r border-ink-900/10 bg-cream-100 transition-colors hover:bg-cream-50"
    >
      <div className="bg-[#e2dbce] px-5 py-4">
        <p className="text-[8px] uppercase tracking-[0.28em] text-ink-500">
          {item.category}
          <span className="block mt-1">{item.sessions}</span>
        </p>
      </div>
      <div className="flex flex-col justify-between px-5 py-4">
        <div>
          <h3 className="font-serif text-[17px] leading-[1.05] tracking-[-0.035em] text-ink-900">{item.title}</h3>
          <p className="mt-1 font-serif text-[10px] italic text-ink-500">{item.author}</p>
        </div>
        <p className="mt-4 flex items-center justify-between border-t border-ink-900/10 pt-3 text-[8px] uppercase tracking-[0.24em] text-ink-500 transition-colors group-hover:text-ink-900">
          <span>Empresarial</span>
          <span>-</span>
        </p>
      </div>
    </Link>
  );
}

function QuestionCard({ item }: { item: AcademyItem }) {
  return (
    <Link to={item.href} className="group block bg-cream-50 transition-colors hover:bg-white">
      <div className="min-h-[140px] bg-[#080808] px-5 py-6 text-white">
        <p className="text-[8px] uppercase tracking-[0.3em] text-white/35">{item.author}</p>
        <h3 className="mt-5 font-serif text-[24px] leading-none tracking-[-0.04em] text-white">{item.title}</h3>
        {item.description && (
          <p className="mt-5 max-w-[260px] font-serif text-[16px] italic leading-[1.05] tracking-[-0.035em] text-white/82">
            {item.description}
          </p>
        )}
      </div>
      <p className="flex items-center justify-between px-5 py-4 text-[8px] uppercase tracking-[0.24em] text-ink-600">
        <span>{item.category} · {item.sessions}</span>
        <span>Entrar -</span>
      </p>
    </Link>
  );
}

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });

  const courses = ((profile?.enrolledCourses ?? []) as EnrolledCourse[]).filter(isCourse);
  const visibleCourses: AcademyItem[] =
    courses.length > 0
      ? courses.slice(0, 3).map((course) => ({
          title: course.title,
          author: getInstructorName(course.instructor),
          category: course.category || 'Academia',
          sessions: `${course.totalLessons || course.lessons?.length || 0} sesiones`,
          href: `/cursos/${course.slug}`,
        }))
      : fallbackCourses;

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
        <div className="aspect-[1/0.86] bg-[radial-gradient(circle_at_35%_35%,#4a4236,#181818_56%,#0b0b0b)] p-6">
          <div className="flex h-full flex-col justify-end">
            <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-white/55">
              Diego Diaz Lara
            </p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.32em] text-white/45">
              Estratega fiscal · CDMX
            </p>
          </div>
        </div>

        <div>
          <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-ink-700">
            Portada · Tu academia
          </p>
          <h1 className="font-serif text-[clamp(3rem,7vw,5.75rem)] leading-[0.92] tracking-tight text-ink-900">
            Academia.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-700">
            La plataforma de streaming especializada que permite acceder a lecciones en video impartidas por expertos fiscales y contables.
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-700">
            Buen dia, <span className="font-serif italic">{user?.name?.split(' ')[0] ?? 'lector'}</span>. Continua tu avance, revisa las sesiones destacadas y entra a los contenidos disponibles.
          </p>
        </div>
      </section>

      <section>
        <SectionTitle
          label="Capacitaciones"
          title="Temas"
          italic="especializados."
          copy="Cursos en video estructurados por expertos invitados al programa."
        />
        {isLoading && <p className="mt-5 font-serif italic text-ink-600">Cargando ediciones...</p>}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {visibleCourses.map((item) => (
            <AcademyCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section>
        <SectionTitle
          label="Entrevistas"
          title="Conversaciones con"
          italic="expertos."
          copy="Sesiones cerradas con especialistas de la fiscalidad mexicana."
        />
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {interviews.map((item) => (
            <AcademyCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#0b0b0b] px-6 py-16 text-white md:px-10">
        <div className="mx-auto max-w-[1120px]">
          <SectionTitle
            dark
            label="Programa"
            title="Optimizacion fiscal"
            italic="empresarial."
            copy="Programa secuencial con modulos aplicados, material descargable y casos de cohorte."
          />
          <div className="mt-8 grid grid-cols-1 border-l border-t border-white/12 md:grid-cols-3">
            {modules.map((item) => (
              <ModuleCard key={item.title} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle
          label="Ventas"
          title="El arte de"
          italic="vender."
          copy="Serie de seis lecciones impartidas por Diego Diaz. La venta no es persuasion: es claridad sobre lo que ofreces y para quien."
        />
        <div className="mt-8 grid grid-cols-1 border-l border-t border-ink-900/10 sm:grid-cols-2 lg:grid-cols-5">
          {salesLessons.map((item) => (
            <SalesLessonCard key={item.title} item={item} />
          ))}
        </div>
      </section>

      <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-[#e5ded0] px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1120px]">
        <SectionTitle
          label="Preguntas"
          title="Preguntas, y sus"
          italic="respuestas."
          copy="Sesiones grabadas donde Diego responde dudas del cohorte en vivo. Tres sesiones disponibles este trimestre."
        />
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          {qas.map((item) => (
            <QuestionCard key={item.title} item={item} />
          ))}
        </div>
        </div>
      </section>
    </div>
  );
}
