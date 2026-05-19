import { useParams } from 'react-router-dom';
import Spinner from '@atoms/Spinner';
import { useLessons } from '@hooks/useCourses';

export default function CourseLesson() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const { data: lessons, isLoading } = useLessons(slug!);
  const lesson = lessons?.find((l) => l._id === lessonId);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!lesson) return <div className="text-center py-20 text-gray-400">Lección no encontrada.</div>;

  return (
    <div className="container-app py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">{lesson.title}</h1>
      {lesson.videoUrl && (
        <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
          <video src={lesson.videoUrl} controls className="w-full h-full" />
        </div>
      )}
      {lesson.content && (
        <div className="prose prose-invert max-w-none text-gray-300" dangerouslySetInnerHTML={{ __html: lesson.content }} />
      )}
    </div>
  );
}
