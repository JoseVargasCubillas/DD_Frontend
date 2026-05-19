import { useParams, Link } from 'react-router-dom';
import { useCourse } from '@hooks/useCourses';
import Spinner from '@atoms/Spinner';
import Button from '@atoms/Button';
import Badge from '@atoms/Badge';
import { formatCurrency } from '@utils/formatters';

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: course, isLoading } = useCourse(slug!);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!course) return <div className="container-app py-20 text-center text-gray-400">Curso no encontrado.</div>;

  const instructor = typeof course.instructor === 'object' ? course.instructor : null;

  return (
    <div className="container-app py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Badge label={course.category} />
        <h1 className="text-3xl font-heading font-bold text-white">{course.title}</h1>
        <p className="text-gray-300">{course.description}</p>
        {course.whatYouLearn.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Lo que aprenderás</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {course.whatYouLearn.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-gray-300"><span className="text-brand-400 shrink-0">✓</span>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <aside className="lg:col-span-1">
        <div className="card p-6 flex flex-col gap-4 sticky top-20">
          <img src={course.thumbnail || '/placeholder-course.jpg'} alt={course.title} className="rounded-lg w-full aspect-video object-cover" />
          <div>
            {course.salePrice ? (
              <><span className="text-3xl font-bold text-brand-400">{formatCurrency(course.salePrice)}</span><span className="ml-2 text-gray-500 line-through text-sm">{formatCurrency(course.price)}</span></>
            ) : (
              <span className="text-3xl font-bold text-brand-400">{formatCurrency(course.price)}</span>
            )}
          </div>
          <Button fullWidth>Inscribirme ahora</Button>
          <div className="text-sm text-gray-400 space-y-1">
            <p>{course.totalLessons} lecciones · {course.totalDuration} min</p>
            {instructor && <p>Instructor: {instructor.name}</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
