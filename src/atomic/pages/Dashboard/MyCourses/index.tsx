import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as usersApi from '@api/users.api';
import { useCourse, useCourses } from '@hooks/useCourses';
import { useSubscription } from '@hooks/useSubscription';
import type { Course, Lesson } from '@t/index';
import { resolveThumbnailUrl, onDriveThumbnailError } from '@utils/driveThumbnail';

type EnrolledCourse = Course | string;
type ModuleLike = { title: string; order?: number; lessons: Lesson[] };
type ModuleInput = { id?: string; _id?: string; title?: string; order?: number; lessons?: Lesson[] };
type LessonInput = Lesson & { moduleId?: string };

type ProgressShape = Partial<Course> & {
  progress?: number;
  completionPercentage?: number;
  completedLessons?: string[];
  lessonProgress?: Record<string, boolean | { completed?: boolean }>;
  modules?: ModuleInput[];
};

type CourseMediaShape = Course & {
  coverImage?: string;
  cover?: string;
  image?: string;
  thumbnailUrl?: string;
};

const isCourse = (course: EnrolledCourse): course is Course =>
  typeof course === 'object' && course !== null;

const getCourseId = (course: Course) => course.id ?? course._id ?? course.slug;
const getLessonId = (lesson?: Lesson) => lesson?._id ?? lesson?.id;
const getEnrollmentId = (course: EnrolledCourse) =>
  typeof course === 'string' ? course : getCourseId(course);
const getCourseCover = (course?: Course) => {
  if (!course) return '';
  const media = course as CourseMediaShape;
  const raw = media.thumbnail || media.thumbnailUrl || media.coverImage || media.cover || media.image || '';
  return resolveThumbnailUrl(raw);
};

const naturalCompare = (a?: string, b?: string) =>
  (a ?? '').localeCompare(b ?? '', 'es', { numeric: true, sensitivity: 'base' });

const sortLessons = (lessons: Lesson[] = []) =>
  [...lessons].sort((a, b) => {
    const oa = a.order ?? 0;
    const ob = b.order ?? 0;
    if (oa !== ob) return oa - ob;
    return naturalCompare(a.title, b.title);
  });

const getModuleId = (module?: ModuleInput) => module?._id ?? module?.id;

const getCourseModules = (course?: Course): ModuleLike[] => {
  if (!course) return [];
  const lessons = sortLessons(course.lessons ?? []);
  const modules = (course as ProgressShape).modules;
  if (Array.isArray(modules) && modules.length > 0) {
    return [...modules]
      .sort((a, b) => {
        const oa = a.order ?? 0;
        const ob = b.order ?? 0;
        if (oa !== ob) return oa - ob;
        return naturalCompare(a.title, b.title);
      })
      .map((module, index) => {
        const moduleId = getModuleId(module);
        const embeddedLessons = sortLessons(module.lessons ?? []);
        const moduleLessons = embeddedLessons.length
          ? embeddedLessons
          : moduleId
            ? lessons.filter((lesson) => String((lesson as LessonInput).moduleId ?? '') === String(moduleId))
            : [];

        return {
          title: module.title || `Modulo ${index + 1}`,
          order: module.order,
          lessons: moduleLessons,
        };
      });
  }

  return lessons.length ? [{ title: 'Contenido del curso', lessons }] : [];
};

const getLessonCount = (course?: Course) => {
  if (!course) return 0;
  const moduleLessons = getCourseModules(course).reduce((total, module) => total + module.lessons.length, 0);
  return moduleLessons || course.totalLessons || course.lessons?.length || 0;
};

const getModuleDuration = (module: ModuleLike) =>
  module.lessons.reduce((sum, lesson) => sum + (lesson.duration ?? 0), 0);

const getCourseTotalDuration = (course?: Course) => {
  if (!course) return 0;
  const modules = getCourseModules(course);
  const summed = modules.reduce((sum, m) => sum + getModuleDuration(m), 0);
  return summed || course.totalDuration || 0;
};

const getFirstLesson = (course?: Course) =>
  getCourseModules(course).flatMap((module) => module.lessons)[0];

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'Duración variable';
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

const getCompletedLessonCount = (course: Course) => {
  const data = course as ProgressShape;
  if (Array.isArray(data.completedLessons)) return data.completedLessons.length;
  if (data.lessonProgress) {
    return Object.values(data.lessonProgress).filter((item) =>
      typeof item === 'boolean' ? item : Boolean(item?.completed),
    ).length;
  }
  return 0;
};

const getProgressPercent = (course: Course) => {
  const data = course as ProgressShape;
  if (typeof data.progress === 'number') return Math.max(0, Math.min(100, Math.round(data.progress)));
  if (typeof data.completionPercentage === 'number') {
    return Math.max(0, Math.min(100, Math.round(data.completionPercentage)));
  }
  const total = getLessonCount(course);
  return total ? Math.round((getCompletedLessonCount(course) / total) * 100) : 0;
};

const getSectionLabel = (course: Course) => {
  const category = course.category?.trim();
  if (!category) return 'Academia';
  return category;
};

export default function MyCourses() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });
  const { data: coursesData, isLoading: isCoursesLoading } = useCourses({ includeAll: true, limit: 200 });
  const { subscription } = useSubscription();
  const [search, setSearch] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const enrolledCourses = (profile?.enrolledCourses ?? []) as EnrolledCourse[];
  const assignedIds = new Set(enrolledCourses.map(getEnrollmentId).filter(Boolean));
  const directCourses = enrolledCourses.filter(isCourse);
  const catalogCourses = coursesData?.data ?? [];
  const hasAcademyAccess = subscription?.status === 'active' || subscription?.status === 'trialing';

  const courses = useMemo(() => {
    const map = new Map<string, Course>();
    if (hasAcademyAccess) {
      catalogCourses
        .filter((course) => course.status !== 'archived')
        .forEach((course) => {
          const id = getCourseId(course);
          if (id) map.set(id, course);
        });
      directCourses.forEach((course) => {
        const id = getCourseId(course);
        if (!id) return;
        map.set(id, { ...(map.get(id) ?? {}), ...course } as Course);
      });
    } else {
      directCourses.forEach((course) => {
        const id = getCourseId(course);
        if (id) map.set(id, course);
      });
      catalogCourses.forEach((course) => {
        const ids = [course.id, course._id, course.slug].filter(Boolean);
        if (!ids.some((id) => assignedIds.has(id!))) return;
        const id = getCourseId(course);
        if (id) map.set(id, course);
      });
    }
    // Ocultamos cursos "vacíos" (0 o negativas lecciones) — corresponden a cursos
    // de prueba que quedaron creados en la base pero sin contenido de Drive.
    return Array.from(map.values())
      .filter((course) => getLessonCount(course) > 0)
      .sort((a, b) => naturalCompare(a.title, b.title));
  }, [catalogCourses, directCourses, assignedIds, hasAcademyAccess]);

  const filteredCourses = useMemo(() => {
    const needle = normalize(search.trim());
    if (!needle) return courses;
    return courses.filter((course) =>
      normalize([course.title, course.shortDescription, course.description, course.category, ...(course.tags ?? [])].filter(Boolean).join(' ')).includes(needle),
    );
  }, [courses, search]);

  useEffect(() => {
    if (!filteredCourses.length) {
      setSelectedCourseId('');
      return;
    }
    if (!filteredCourses.some((course) => getCourseId(course) === selectedCourseId)) {
      setSelectedCourseId(getCourseId(filteredCourses[0]) || '');
    }
  }, [filteredCourses, selectedCourseId]);

  const selectedCourseBase = filteredCourses.find((course) => getCourseId(course) === selectedCourseId) ?? filteredCourses[0];
  const { data: selectedCourseDetail } = useCourse(selectedCourseBase?.slug ?? '');
  const selectedCourse = selectedCourseDetail ?? selectedCourseBase;
  const selectedCourseCover = getCourseCover(selectedCourse);
  const selectedModules = getCourseModules(selectedCourse);
  const firstLesson = getFirstLesson(selectedCourse);
  const firstLessonId = getLessonId(firstLesson);
  const progress = selectedCourse ? getProgressPercent(selectedCourse) : 0;

  // Accordion state para el Contenido del curso estilo Udemy.
  // Cuando cambia de curso: si sólo hay un módulo lo abrimos, si hay varios los
  // dejamos todos colapsados como en Udemy.
  const [openModules, setOpenModules] = useState<Set<number>>(() => new Set([0]));
  useEffect(() => {
    setOpenModules(selectedModules.length <= 1 ? new Set([0]) : new Set());
  }, [selectedCourseId, selectedModules.length]);
  const toggleModule = (idx: number) => {
    setOpenModules((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };
  const allExpanded = selectedModules.length > 0 && openModules.size >= selectedModules.length;
  const toggleAll = () => {
    if (allExpanded) setOpenModules(new Set());
    else setOpenModules(new Set(selectedModules.map((_, i) => i)));
  };
  const completedLessons = selectedCourse ? getCompletedLessonCount(selectedCourse) : 0;
  const loadingLibrary = isLoading || isCoursesLoading;

  return (
    <div className="mx-auto max-w-[1280px] space-y-8">
      <header className="grid gap-6 border-b border-ink-900/10 pb-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-400">Mi cuenta · Academia</p>
          <h1 className="mt-4 font-serif text-[clamp(48px,7vw,88px)] font-normal leading-[0.9] tracking-[-0.055em] text-ink-900">
            Mis cursos.
          </h1>
          <p className="mt-5 max-w-[720px] text-[16px] leading-[1.65] text-ink-600">
            Tu biblioteca personal muestra solo los cursos asignados a tu cuenta, con sus sesiones disponibles y acceso directo a cada lección.
          </p>
        </div>
        <label className="block rounded-[28px] border border-ink-900/10 bg-white p-3 shadow-[0_18px_45px_rgba(10,10,10,0.05)]">
          <span className="mb-2 block px-2 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-400">Buscar curso</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nombre, tema o sesión..."
            className="min-h-12 w-full rounded-[18px] border border-ink-900/10 bg-cream-50 px-4 text-[15px] outline-none transition-colors placeholder:text-ink-300 focus:border-ink-900"
          />
        </label>
      </header>

      {loadingLibrary && <p className="font-serif italic text-ink-600">Cargando cursos...</p>}

      {!loadingLibrary && courses.length === 0 && (
        <div className="rounded-[28px] border border-cream-400 bg-white p-8 text-ink-600">
          Aún no tienes cursos asignados. Si compraste Academia y no ves contenido, escribe a{' '}
          <a href="mailto:academia@diegodiaz.mx" className="text-ink-900 underline decoration-ink-900/40 underline-offset-2 hover:decoration-ink-900">
            academia@diegodiaz.mx
          </a>.
        </div>
      )}

      {!loadingLibrary && courses.length > 0 && filteredCourses.length === 0 && (
        <div className="rounded-[28px] border border-cream-400 bg-white p-8 text-center">
          <p className="font-serif text-[30px] leading-tight">No encontramos cursos con esa búsqueda.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-5 min-h-11 rounded-full border border-ink-900 px-5 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-ink-900 hover:text-white"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {selectedCourse && (
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
          <aside className="rounded-[30px] border border-ink-900/10 bg-white p-4 shadow-[0_20px_60px_rgba(10,10,10,0.06)] lg:sticky lg:top-28 lg:self-start">
            <div className="mb-4 flex items-center justify-between px-2 pt-2">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-400">Biblioteca</p>
                <p className="mt-1 text-sm text-ink-500">{filteredCourses.length} cursos</p>
              </div>
              <span className="rounded-full bg-ink-900 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white">Cliente</span>
            </div>
            <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
              {filteredCourses.map((course) => {
                const courseId = getCourseId(course);
                const isSelected = courseId === getCourseId(selectedCourse);
                const courseProgress = getProgressPercent(course);
                return (
                  <button
                    key={courseId}
                    type="button"
                    onClick={() => setSelectedCourseId(courseId || '')}
                    className={`group grid w-full grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-[22px] p-2 text-left transition-colors ${
                      isSelected ? 'bg-ink-900 text-white' : 'hover:bg-cream-100'
                    }`}
                  >
                    <div className="aspect-video overflow-hidden rounded-[16px] bg-ink-900">
                      {getCourseCover(course) ? (
                        <img src={getCourseCover(course)} alt={`Portada ${course.title}`} className="h-full w-full object-contain" loading="lazy" onError={onDriveThumbnailError} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="grid h-full place-items-center bg-gradient-to-br from-ink-900 to-[#2d211a]">
                          <span className="font-serif text-[22px] leading-none text-white/40">
                            {(course.title || 'DD').slice(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 py-1">
                      <p className={`truncate font-serif text-[18px] leading-none ${isSelected ? 'text-white' : 'text-ink-900'}`}>{course.title}</p>
                      <p className={`mt-1 font-mono text-[8px] uppercase tracking-[0.14em] ${isSelected ? 'text-white/55' : 'text-ink-400'}`}>
                        {getLessonCount(course)} lecciones · {courseProgress}%
                      </p>
                      <div className={`mt-2 h-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-ink-900/10'}`}>
                        <div className="h-full rounded-full bg-[#6b4f2a]" style={{ width: `${courseProgress}%` }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="overflow-hidden rounded-[34px] border border-ink-900/10 bg-white shadow-[0_24px_70px_rgba(10,10,10,0.07)]">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
              <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-ink-900 via-[#241a13] to-[#0a0806] lg:aspect-auto lg:min-h-[320px]">
                {selectedCourseCover && (
                  <img
                    src={selectedCourseCover}
                    alt={`Portada del curso ${selectedCourse.title}`}
                    className="absolute inset-0 h-full w-full object-contain"
                    onError={onDriveThumbnailError}
                    referrerPolicy="no-referrer"
                  />
                )}
                {!selectedCourseCover && (
                  <>
                    <div
                      className="absolute inset-0 opacity-[0.08]"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 20% 20%, #fff 0, transparent 40%), radial-gradient(circle at 80% 60%, #6b4f2a 0, transparent 45%)',
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-white/50">
                        {getSectionLabel(selectedCourse)} · Curso
                      </p>
                      <p className="mt-3 font-serif text-[36px] leading-[0.95] tracking-[-0.045em] text-white sm:text-[44px]">
                        {selectedCourse.title}
                      </p>
                    </div>
                  </>
                )}
                {selectedCourseCover && (
                  <>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-900/80 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/70">
                        {getSectionLabel(selectedCourse)}
                      </p>
                      <p className="mt-2 line-clamp-2 font-serif text-[26px] leading-tight text-white sm:text-[32px]">
                        {selectedCourse.title}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col border-t border-ink-900/10 p-6 lg:border-l lg:border-t-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">Tu avance</p>
                <div className="mt-4 rounded-[24px] border border-ink-900/10 bg-cream-50 p-6 text-center">
                  <p className="font-serif text-[64px] leading-none tracking-[-0.06em]">{progress}%</p>
                  <p className="mt-2 text-sm text-ink-500">
                    {completedLessons} de {getLessonCount(selectedCourse)} lecciones
                  </p>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink-900/10">
                    <div className="h-full rounded-full bg-[#6b4f2a] transition-[width] duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-[18px] border border-ink-900/10 p-4">
                    <p className="font-serif text-[28px] leading-none">{getLessonCount(selectedCourse)}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Lecciones</p>
                  </div>
                  <div className="rounded-[18px] border border-ink-900/10 p-4">
                    <p className="font-serif text-[15px] leading-tight">{formatDuration(getCourseTotalDuration(selectedCourse))}</p>
                    <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Duración</p>
                  </div>
                </div>
                {firstLesson && firstLessonId && (
                  <Link
                    to={`/cursos/${selectedCourse.slug}/leccion/${firstLessonId}`}
                    className="mt-5 inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full bg-ink-900 px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#6b4f2a]"
                  >
                    {progress > 0 ? 'Continuar curso' : 'Empezar curso'} →
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-8 border-t border-ink-900/10 p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-8">
              <div>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">Contenido del curso</p>
                    <h3 className="mt-2 font-serif text-[32px] leading-none tracking-[-0.04em]">Temario.</h3>
                    <p className="mt-2 text-sm text-ink-500">
                      {selectedModules.length} {selectedModules.length === 1 ? 'módulo' : 'módulos'} · {getLessonCount(selectedCourse)} lecciones · {formatDuration(getCourseTotalDuration(selectedCourse))}
                    </p>
                  </div>
                  {selectedModules.length > 1 && (
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="cursor-pointer rounded-full border border-ink-900/15 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-700 transition-colors hover:border-ink-900 hover:bg-ink-900 hover:text-white"
                    >
                      {allExpanded ? 'Colapsar todo' : 'Expandir todo'}
                    </button>
                  )}
                </div>

                {selectedModules.length === 0 && (
                  <div className="rounded-[24px] border border-ink-900/10 bg-cream-50 p-6 text-ink-500">
                    Este curso todavía no tiene lecciones publicadas.
                  </div>
                )}

                <div className="overflow-hidden rounded-[20px] border border-ink-900/12 bg-white">
                  {selectedModules.map((module, moduleIndex) => {
                    const isOpen = openModules.has(moduleIndex);
                    const moduleDuration = getModuleDuration(module);
                    return (
                      <div key={`${module.title}-${moduleIndex}`} className={moduleIndex > 0 ? 'border-t border-ink-900/10' : ''}>
                        <button
                          type="button"
                          onClick={() => toggleModule(moduleIndex)}
                          className="group flex w-full cursor-pointer items-center justify-between gap-4 bg-cream-50 px-5 py-4 text-left transition-colors hover:bg-cream-100"
                          aria-expanded={isOpen}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              className={`shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                              aria-hidden="true"
                            >
                              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="min-w-0">
                              <p className="truncate font-serif text-[18px] font-semibold leading-tight text-ink-900">
                                {module.title}
                              </p>
                              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-500">
                                Módulo {moduleIndex + 1}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-500">
                            {module.lessons.length} {module.lessons.length === 1 ? 'lección' : 'lecciones'}
                            {moduleDuration > 0 && ` · ${formatDuration(moduleDuration)}`}
                          </span>
                        </button>

                        {isOpen && (
                          <ul className="divide-y divide-ink-900/8 bg-white">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const lessonId = getLessonId(lesson);
                              const to = lessonId
                                ? `/cursos/${selectedCourse.slug}/leccion/${lessonId}`
                                : `/cursos/${selectedCourse.slug}`;
                              return (
                                <li key={lessonId ?? `${module.title}-${lessonIndex}`}>
                                  <Link
                                    to={to}
                                    className="group grid cursor-pointer grid-cols-[24px_minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 transition-colors hover:bg-cream-50"
                                  >
                                    <span
                                      className="grid size-6 place-items-center rounded-full bg-ink-900/5 text-ink-700 transition-colors group-hover:bg-ink-900 group-hover:text-white"
                                      aria-hidden="true"
                                    >
                                      <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor"><path d="M2 1l7 4-7 4V1z" /></svg>
                                    </span>
                                    <div className="min-w-0">
                                      <p className="truncate text-[14px] text-ink-800 group-hover:text-ink-900">
                                        {lesson.title}
                                      </p>
                                    </div>
                                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-400">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="rounded-[24px] border border-ink-900/10 bg-cream-50 p-5 lg:sticky lg:top-28 lg:self-start">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">Descripción</p>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-600">
                  {selectedCourse.shortDescription || selectedCourse.description || 'Curso disponible en tu cuenta con sesiones importadas desde Drive.'}
                </p>
                <div className="mt-6 border-t border-ink-900/10 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">Categoría</p>
                  <p className="mt-2 font-serif text-[22px] leading-none">{getSectionLabel(selectedCourse)}</p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
