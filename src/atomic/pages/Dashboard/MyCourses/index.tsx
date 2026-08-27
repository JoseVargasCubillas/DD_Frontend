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

const sortLessons = (lessons: Lesson[] = []) =>
  [...lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const getModuleId = (module?: ModuleInput) => module?._id ?? module?.id;

const getCourseModules = (course?: Course): ModuleLike[] => {
  if (!course) return [];
  const lessons = sortLessons(course.lessons ?? []);
  const modules = (course as ProgressShape).modules;
  if (Array.isArray(modules) && modules.length > 0) {
    return [...modules]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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
      return Array.from(map.values());
    }

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
    return Array.from(map.values());
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
  const selectedLessons = selectedModules.flatMap((module) => module.lessons);
  const firstLesson = getFirstLesson(selectedCourse);
  const firstLessonId = getLessonId(firstLesson);
  const progress = selectedCourse ? getProgressPercent(selectedCourse) : 0;
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
                    <div className="aspect-video overflow-hidden rounded-[16px] bg-ink-900/90">
                      {getCourseCover(course) ? (
                        <img src={getCourseCover(course)} alt={`Portada ${course.title}`} className="h-full w-full object-contain" loading="lazy" onError={onDriveThumbnailError} referrerPolicy="no-referrer" />
                      ) : (
                        <div className="grid h-full place-items-center font-mono text-[8px] uppercase tracking-[0.18em] text-white/50">DD</div>
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
            <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="relative grid min-h-[300px] place-items-center bg-ink-900 p-4 lg:min-h-[420px]">
                {selectedCourseCover ? (
                  <img src={selectedCourseCover} alt={`Portada del curso ${selectedCourse.title}`} className="max-h-full w-full object-contain" onError={onDriveThumbnailError} referrerPolicy="no-referrer" />
                ) : (
                  <div className="grid h-full place-items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Portada pendiente</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col border-t border-ink-900/10 p-6 lg:border-l lg:border-t-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">{getSectionLabel(selectedCourse)}</p>
                <h2 className="mt-3 font-serif text-[clamp(30px,4vw,44px)] leading-[0.95] tracking-[-0.045em] text-ink-900">
                  {selectedCourse.title}
                </h2>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">Tu avance</p>
                <div className="mt-5 grid place-items-center rounded-[28px] border border-ink-900/10 bg-cream-50 p-8 text-center">
                  <p className="font-serif text-[72px] leading-none tracking-[-0.06em]">{progress}%</p>
                  <p className="mt-2 text-sm text-ink-500">{completedLessons} de {getLessonCount(selectedCourse)} lecciones completadas</p>
                  <div className="mt-5 h-2 w-full rounded-full bg-ink-900/10">
                    <div className="h-full rounded-full bg-[#6b4f2a]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-[20px] border border-ink-900/10 p-4">
                    <p className="font-serif text-[34px] leading-none">{getLessonCount(selectedCourse)}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Lecciones</p>
                  </div>
                  <div className="rounded-[20px] border border-ink-900/10 p-4">
                    <p className="font-serif text-[34px] leading-none">{formatDuration(selectedCourse.totalDuration)}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Duración</p>
                  </div>
                </div>
                {firstLesson && firstLessonId && (
                  <Link
                    to={`/cursos/${selectedCourse.slug}/leccion/${firstLessonId}`}
                    className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-ink-900 px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#6b4f2a]"
                  >
                    Entrar al curso →
                  </Link>
                )}
              </div>
            </div>

            <div className="grid gap-8 border-t border-ink-900/10 p-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:p-8">
              <div>
                {selectedLessons.length > 0 && (
                  <div className="mb-8 rounded-[28px] border border-ink-900/10 bg-ink-900 p-5 text-white">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/50">Acceso rápido</p>
                        <h3 className="mt-1 font-serif text-[32px] leading-none tracking-[-0.04em]">Videos del curso.</h3>
                      </div>
                      <span className="hidden rounded-full border border-white/20 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/60 md:inline-flex">
                        {selectedLessons.length} videos
                      </span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      {selectedLessons.slice(0, 4).map((lesson, index) => {
                        const lessonId = getLessonId(lesson);
                        return (
                          <Link
                            key={lessonId ?? `${lesson.title}-${index}`}
                            to={lessonId ? `/cursos/${selectedCourse.slug}/leccion/${lessonId}` : `/cursos/${selectedCourse.slug}`}
                            className="grid min-h-[62px] grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border border-white/10 bg-white/5 px-3 py-2 transition-colors hover:bg-white hover:text-ink-900"
                          >
                            <span className="grid size-8 place-items-center rounded-full border border-current font-mono text-[9px]">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="truncate text-sm font-medium">{lesson.title}</span>
                            <span className="font-mono text-[9px] uppercase tracking-[0.16em]">Ver video</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-400">Temario</p>
                    <h3 className="mt-2 font-serif text-[36px] leading-none tracking-[-0.04em]">Contenido del curso.</h3>
                  </div>
                  <p className="hidden text-sm text-ink-500 md:block">{selectedModules.length} módulos</p>
                </div>

                <div className="space-y-4">
                  {selectedModules.length === 0 && (
                    <div className="rounded-[24px] border border-ink-900/10 bg-cream-50 p-6 text-ink-500">
                      Este curso todavía no tiene lecciones publicadas.
                    </div>
                  )}

                  {selectedModules.map((module, moduleIndex) => (
                    <article key={`${module.title}-${moduleIndex}`} className="overflow-hidden rounded-[26px] border border-ink-900/10 bg-cream-50">
                      <div className="flex items-center justify-between gap-4 border-b border-ink-900/10 px-5 py-4">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-400">Módulo {moduleIndex + 1}</p>
                          <h4 className="mt-1 font-serif text-[24px] leading-none">{module.title}</h4>
                        </div>
                        <span className="rounded-full border border-ink-900/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-500">
                          {module.lessons.length} sesiones
                        </span>
                      </div>
                      <div className="divide-y divide-ink-900/10">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const lessonId = getLessonId(lesson);
                          return (
                            <Link
                              key={lessonId ?? `${module.title}-${lessonIndex}`}
                              to={lessonId ? `/cursos/${selectedCourse.slug}/leccion/${lessonId}` : `/cursos/${selectedCourse.slug}`}
                              className="grid min-h-[76px] grid-cols-[42px_minmax(0,1fr)] items-center gap-4 px-5 py-3 transition-colors hover:bg-white md:grid-cols-[42px_minmax(0,1fr)_auto]"
                            >
                              <span className="grid size-9 place-items-center rounded-full border border-ink-900/10 bg-white font-mono text-[10px] text-ink-500">
                                {String(lessonIndex + 1).padStart(2, '0')}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[15px] font-medium text-ink-900">{lesson.title}</p>
                                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">
                                  {lesson.mediaType || 'video'} · {formatDuration(lesson.duration)}
                                </p>
                              </div>
                              <span className="col-span-2 inline-flex w-fit rounded-full bg-ink-900 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white md:col-span-1">
                                Reproducir video
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <aside className="rounded-[28px] border border-ink-900/10 bg-cream-50 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">Descripción</p>
                <p className="mt-4 text-[15px] leading-[1.65] text-ink-600">
                  {selectedCourse.shortDescription || selectedCourse.description || 'Curso disponible en tu cuenta con sesiones importadas desde Drive.'}
                </p>
                <div className="mt-6 border-t border-ink-900/10 pt-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-400">Categoria</p>
                  <p className="mt-2 font-serif text-[24px] leading-none">{getSectionLabel(selectedCourse)}</p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
