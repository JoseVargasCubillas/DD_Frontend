import { useAuthStore } from '@store/authStore';
import { useCourses } from '@hooks/useCourses';
import CourseCard from '@molecules/CourseCard';

export default function UserDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Bienvenido, {user?.name}</h1>
        <p className="text-gray-400 mt-1">Este es tu panel de aprendizaje.</p>
      </div>
    </div>
  );
}
