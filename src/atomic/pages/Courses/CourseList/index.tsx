import CourseCard from '@molecules/CourseCard';
import Spinner from '@atoms/Spinner';
import { useCourses } from '@hooks/useCourses';
import satDigital from '../../../../../assets/ddweb/sat-cumplimiento-digital.jpg';

export default function CourseList() {
  const { data, isLoading } = useCourses();

  return (
    <div className="bg-cream-50 text-ink-900">
      <section className="border-b border-cream-400">
        <div className="container-app grid gap-10 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.32em] text-ink-400">
              Academia · Cursos
            </p>
            <h1 className="section-title">
              Formación fiscal
              <span className="block font-serif italic font-normal">para decidir mejor.</span>
            </h1>
            <p className="mt-6 max-w-[620px] text-[16px] leading-relaxed text-ink-600">
              Explora cursos sobre reforma fiscal 2026, CFDI, deducciones,
              defensa SAT, nómina, estrategia patrimonial y herramientas
              empresariales aplicadas.
            </p>
          </div>
          <div className="overflow-hidden border border-cream-400 bg-white">
            <img
              src={satDigital}
              alt="Cumplimiento digital ante el SAT"
              className="h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="container-app py-12">
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((course) => <CourseCard key={course.id ?? course._id} course={course} />)}
        </div>
      )}
      </section>
    </div>
  );
}
