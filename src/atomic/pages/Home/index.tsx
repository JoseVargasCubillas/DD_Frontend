import HeroSection from '@organisms/HeroSection';
import { useCourses } from '@hooks/useCourses';
import CourseCard from '@molecules/CourseCard';
import Spinner from '@atoms/Spinner';

export default function Home() {
  const { data, isLoading } = useCourses({ limit: 3 });

  return (
    <div>
      <HeroSection />
      <section className="container-app py-16">
        <h2 className="section-title mb-8">Cursos destacados</h2>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((course) => <CourseCard key={course._id} course={course} />)}
          </div>
        )}
      </section>
    </div>
  );
}
