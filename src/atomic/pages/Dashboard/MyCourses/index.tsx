import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as usersApi from '@api/users.api';
import { getActiveSubscription } from '@api/subscriptions.api';
import { usePackages } from '@hooks/usePackages';
import { useCourses } from '@hooks/useCourses';
import type { Course } from '@t/index';

type EnrolledCourse = Course | string;

const isCourse = (course: EnrolledCourse): course is Course =>
  typeof course === 'object' && course !== null;

export default function MyCourses() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });
  const { data: subscription } = useQuery({
    queryKey: ['subscription', 'active'],
    queryFn: getActiveSubscription,
  });
  const { data: packages = [] } = usePackages();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const allCourses = coursesData?.data ?? [];

  // Paquete activo del cliente (si tiene suscripción vigente)
  const activePackage = useMemo(() => {
    if (!subscription || subscription.status !== 'active') return null;
    if (!subscription.package) return null;
    return packages.find((p) => p._id === subscription.package) ?? null;
  }, [subscription, packages]);

  const enrolled = ((profile?.enrolledCourses ?? []) as EnrolledCourse[]).filter(isCourse);

  const courses: Course[] = useMemo(() => {
    // Si el paquete incluye todos los cursos, mostramos el catálogo completo.
    if (activePackage?.benefits?.allCourses) return allCourses;
    // Si el paquete tiene courseIds explícitos, mostramos esos + los enrolled.
    if (activePackage && activePackage.courseIds.length > 0) {
      const ids = new Set(activePackage.courseIds);
      const fromPkg = allCourses.filter((c) => ids.has(String(c._id || c.id)));
      const merged = new Map<string, Course>();
      [...fromPkg, ...enrolled].forEach((c) => merged.set(String(c._id || c.id), c));
      return [...merged.values()];
    }
    return enrolled;
  }, [activePackage, allCourses, enrolled]);

  return (
    <div className="space-y-10">
      <header className="border-b border-cream-400 pb-8">
        <p className="text-[10px] uppercase tracking-[0.3em] text-ink-300">Tu biblioteca</p>
        <h1 className="mt-5 font-serif text-[clamp(48px,7vw,82px)] font-normal leading-[0.92] tracking-[-0.055em] text-ink-900">
          Mis
          <span className="block italic tracking-[-0.07em]">cursos.</span>
        </h1>
        <p className="mt-5 text-[16px] leading-[1.6] text-ink-500">
          {courses.length} {courses.length === 1 ? 'curso disponible' : 'cursos disponibles'} en tu cuenta.
        </p>
        {activePackage && (
          <p className="mt-2 text-[11px] uppercase tracking-[0.28em] text-ink-500">
            — Paquete activo: <b className="text-ink-900">{activePackage.name}</b>
            {activePackage.benefits?.allCourses ? ' · Acceso a todos los cursos' : ''}
          </p>
        )}
      </header>

      {isLoading && <p className="font-serif italic text-ink-600">Cargando...</p>}
      {!isLoading && courses.length === 0 && (
        <div className="border border-cream-400 bg-cream-100 p-8 text-ink-600">
          Aún no tienes cursos asignados. Si compraste uno y no lo ves, escribe a{' '}
          <a href="mailto:academia@diegodiaz.mx" className="text-ink-900 underline decoration-ink-900/40 underline-offset-2 hover:decoration-ink-900">
            academia@diegodiaz.mx
          </a>.
        </div>
      )}

      <div className="divide-y divide-cream-400 border-y border-cream-400">
        {courses.map((course, index) => (
          <Link
            key={course.id ?? course._id}
            to={`/cursos/${course.slug}`}
            className="grid gap-6 py-8 transition-colors hover:bg-cream-100 md:grid-cols-[180px_minmax(0,1fr)_140px_36px] md:items-center"
          >
            <div className="flex items-start">
              <span className="font-serif text-[72px] italic leading-[0.8] tracking-[-0.08em] text-ink-900">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="ml-2 font-serif text-[22px] italic leading-none text-[#78562a]">VO</span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-ink-300">{course.category || 'Academia'}</p>
              <h2 className="mt-3 font-serif text-[32px] font-normal leading-[1] tracking-[-0.045em] text-ink-900">
                {course.title}
              </h2>
              <p className="mt-3 max-w-[680px] text-[15px] leading-[1.55] text-ink-500">{course.shortDescription}</p>
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-ink-400 md:text-right">
              {course.totalLessons || course.lessons?.length || 0} lecciones
            </div>
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-900 text-[13px] text-ink-900">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
