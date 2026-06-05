import { Link } from 'react-router-dom';
import Badge from '@atoms/Badge';
import type { Course } from '@t/index';
import { formatCurrency } from '@utils/formatters';

interface CourseCardProps { course: Course }

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link to={`/cursos/${course.slug}`} className="card group hover:border-brand-500 transition-all duration-300 block">
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.thumbnail || '/placeholder-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {course.isFeatured && (
          <div className="absolute top-2 left-2"><Badge label="Destacado" variant="info" /></div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Badge label={course.category} />
        <h3 className="font-semibold text-white line-clamp-2 group-hover:text-brand-400 transition-colors">
          {course.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2">{course.shortDescription}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            {course.salePrice ? (
              <>
                <span className="text-brand-400 font-bold">{formatCurrency(course.salePrice, course.currency)}</span>
                <span className="text-gray-500 text-sm line-through">{formatCurrency(course.price, course.currency)}</span>
              </>
            ) : (
              <span className="text-brand-400 font-bold">{formatCurrency(course.price, course.currency)}</span>
            )}
          </div>
          <span className="text-gray-400 text-sm">{course.totalLessons} lecciones</span>
        </div>
      </div>
    </Link>
  );
}
