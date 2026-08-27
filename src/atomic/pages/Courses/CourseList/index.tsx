import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '@molecules/CourseCard';
import Spinner from '@atoms/Spinner';
import { useCourses } from '@hooks/useCourses';
import type { Course } from '@t/index';
import { resolveThumbnailUrl, onDriveThumbnailError } from '@utils/driveThumbnail';

const getCourseId = (course: Course) => course.id ?? course._id ?? course.slug;

const getLessonCount = (course: Course) =>
  course.totalLessons || course.lessons?.length || 0;

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'Duracion variable';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${String(rest).padStart(2, '0')}min` : `${hours}h`;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export default function CourseList() {
  const { data, isLoading } = useCourses({ limit: 100 });
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const courses = data?.data ?? [];
  const categories = useMemo(() => {
    const unique = new Set(
      courses
        .map((course) => course.category?.trim())
        .filter((item): item is string => Boolean(item)),
    );
    return ['Todos', ...Array.from(unique)];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    const needle = normalize(search.trim());
    return courses.filter((course) => {
      const matchesCategory = category === 'Todos' || course.category === category;
      const haystack = normalize(
        [course.title, course.shortDescription, course.description, course.category, ...(course.tags ?? [])]
          .filter(Boolean)
          .join(' '),
      );
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [category, courses, search]);

  const featuredCourse = filteredCourses.find((course) => course.isFeatured) ?? filteredCourses[0];
  const secondaryCourses = featuredCourse
    ? filteredCourses.filter((course) => getCourseId(course) !== getCourseId(featuredCourse))
    : filteredCourses;

  return (
    <main className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400 bg-cream-100">
        <div className="container-app py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-end">
            <div>
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-400">
                Academia · Catálogo
              </p>
              <h1 className="font-serif text-[clamp(56px,8vw,112px)] font-normal leading-[0.9] tracking-[-0.055em]">
                Aprende por
                <span className="block italic tracking-[-0.07em]">curso.</span>
              </h1>
              <p className="mt-6 max-w-[640px] text-[17px] leading-[1.65] text-ink-600">
                Cada carpeta importada desde Drive se muestra como un curso. Las sesiones dentro de esa carpeta aparecen como videos del programa.
              </p>
            </div>

            <div className="grid grid-cols-3 border border-ink-900/10 bg-white">
              <div className="border-r border-ink-900/10 p-5">
                <p className="font-serif text-[42px] leading-none">{courses.length}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Cursos</p>
              </div>
              <div className="border-r border-ink-900/10 p-5">
                <p className="font-serif text-[42px] leading-none">
                  {courses.reduce((sum, course) => sum + getLessonCount(course), 0)}
                </p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Sesiones</p>
              </div>
              <div className="p-5">
                <p className="font-serif text-[42px] leading-none">{categories.length - 1}</p>
                <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Categorías</p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 border-t border-cream-400 pt-8 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-start">
            <label className="block">
              <span className="mb-2 block font-mono text-[9px] uppercase tracking-[0.24em] text-ink-400">
                Buscar
              </span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nombre del curso, tema o sesión..."
                className="min-h-12 w-full border border-ink-900/15 bg-white px-4 text-[15px] outline-none transition-colors placeholder:text-ink-300 focus:border-ink-900"
              />
            </label>
            <div>
              <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.24em] text-ink-400">
                Secciones
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={`min-h-10 cursor-pointer border px-4 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors ${
                      category === item
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-900/15 bg-white text-ink-600 hover:border-ink-900 hover:text-ink-900'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-app py-12 md:py-16">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="lg" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="border border-cream-400 bg-white p-10 text-center">
            <p className="font-serif text-[32px] leading-tight">No encontramos cursos con esos filtros.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('Todos');
              }}
              className="mt-6 min-h-11 border border-ink-900 px-5 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors hover:bg-ink-900 hover:text-white"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {featuredCourse && (
              <Link
                to={`/cursos/${featuredCourse.slug}`}
                className="group grid overflow-hidden border border-ink-900/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_58px_rgba(10,10,10,0.12)] lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)]"
              >
                <div className="relative min-h-[320px] overflow-hidden bg-ink-900">
                  {featuredCourse.thumbnail ? (
                    <img
                      src={resolveThumbnailUrl(featuredCourse.thumbnail)}
                      alt={`Portada del curso ${featuredCourse.title}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
                      onError={onDriveThumbnailError}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-white/55">
                      <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Portada pendiente</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="absolute left-6 top-6 bg-white px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-900">
                    Curso destacado
                  </span>
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">
                    {featuredCourse.category || 'Academia'}
                  </p>
                  <h2 className="mt-5 font-serif text-[clamp(42px,5vw,72px)] leading-[0.9] tracking-[-0.05em]">
                    {featuredCourse.title}
                  </h2>
                  <p className="mt-6 text-[16px] leading-[1.65] text-ink-600">
                    {featuredCourse.shortDescription || featuredCourse.description}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 border-y border-ink-900/10 py-5 sm:grid-cols-3">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {getLessonCount(featuredCourse)} sesiones
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {formatDuration(featuredCourse.totalDuration)}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      Acceso 24/7
                    </span>
                  </div>
                  <span className="mt-auto inline-flex min-h-12 w-fit items-center border border-ink-900 px-6 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors group-hover:bg-ink-900 group-hover:text-white">
                    Entrar al curso →
                  </span>
                </div>
              </Link>
            )}

            <div>
              <div className="mb-6 flex items-end justify-between gap-5 border-b border-cream-400 pb-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-400">
                    Biblioteca
                  </p>
                  <h2 className="mt-2 font-serif text-[42px] leading-none tracking-[-0.04em]">
                    Todos los cursos.
                  </h2>
                </div>
                <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-ink-400 md:block">
                  {filteredCourses.length} resultados
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {secondaryCourses.map((course) => (
                  <CourseCard key={getCourseId(course)} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
