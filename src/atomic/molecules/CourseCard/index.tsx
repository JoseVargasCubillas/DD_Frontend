import { Link } from 'react-router-dom';
import type { Course } from '@t/index';
import { resolveThumbnailUrl, onDriveThumbnailError } from '@utils/driveThumbnail';

interface CourseCardProps {
  course: Course;
  compact?: boolean;
}

const formatDuration = (minutes?: number) => {
  if (!minutes) return 'Duracion variable';
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${String(rest).padStart(2, '0')}min` : `${hours}h`;
};

const getLessonCount = (course: Course) =>
  course.totalLessons || course.lessons?.length || 0;

const getLevelLabel = (level?: Course['level']) => {
  if (level === 'beginner') return 'Inicial';
  if (level === 'advanced') return 'Avanzado';
  return 'Intermedio';
};

export default function CourseCard({ course, compact = false }: CourseCardProps) {
  const lessonCount = getLessonCount(course);
  const thumbnailSrc = resolveThumbnailUrl(course.thumbnail);
  const hasThumbnail = Boolean(thumbnailSrc);

  return (
    <Link
      to={`/cursos/${course.slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden border border-ink-900/10 bg-white text-ink-900 transition duration-300 hover:-translate-y-1 hover:border-ink-900/30 hover:shadow-[0_22px_54px_rgba(10,10,10,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/30"
    >
      <div className="relative aspect-video overflow-hidden bg-[linear-gradient(135deg,#e8e1d6,#111)]">
        {hasThumbnail ? (
          <img
            src={thumbnailSrc}
            alt={`Portada del curso ${course.title}`}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
            loading="lazy"
            onError={onDriveThumbnailError}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70">
              Portada pendiente
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/8 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-900">
            {course.category || 'Academia'}
          </span>
          {course.isFeatured && (
            <span className="rounded-full bg-ink-900 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white">
              Destacado
            </span>
          )}
        </div>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-5' : 'p-6'}`}>
        <h3 className="font-serif text-[clamp(25px,2.4vw,34px)] font-normal leading-[0.98] tracking-[-0.035em] text-ink-900">
          {course.title}
        </h3>
        <p className="mt-4 line-clamp-2 text-[14px] leading-[1.55] text-ink-600">
          {course.shortDescription || course.description || 'Curso importado desde Drive con sesiones en video y recursos de apoyo.'}
        </p>

        <div className="mt-5 grid grid-cols-3 border-y border-ink-900/10 py-4 text-center">
          <div className="border-r border-ink-900/10 px-2">
            <p className="font-serif text-[24px] leading-none">{lessonCount}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Sesiones</p>
          </div>
          <div className="border-r border-ink-900/10 px-2">
            <p className="font-serif text-[24px] leading-none">{formatDuration(course.totalDuration)}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Contenido</p>
          </div>
          <div className="px-2">
            <p className="font-serif text-[24px] leading-none">{course.rating ? course.rating.toFixed(1) : 'Nuevo'}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-400">Rating</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-500">
            {getLevelLabel(course.level)}
          </span>
          <span className="inline-flex min-h-10 items-center gap-3 border border-ink-900 px-4 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-900 transition-colors group-hover:bg-ink-900 group-hover:text-white">
            Ver curso <span aria-hidden="true">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
