import { useCourses } from '@hooks/useCourses';
import CourseCard from '@molecules/CourseCard';
import Spinner from '@atoms/Spinner';

export default function MyCourses() {
  const { data, isLoading } = useCourses();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-white">Mis cursos</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data?.data.map((course) => <CourseCard key={course.id ?? course._id} course={course} />)}
        </div>
      )}
    </div>
  );
}
