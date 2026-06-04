import CourseCard from '@molecules/CourseCard';
import Spinner from '@atoms/Spinner';
import { useCourses } from '@hooks/useCourses';

export default function CourseList() {
  const { data, isLoading } = useCourses();

  return (
    <div className="container-app py-12">
      <h1 className="section-title mb-8">Cursos</h1>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((course) => <CourseCard key={course.id ?? course._id} course={course} />)}
        </div>
      )}
    </div>
  );
}
