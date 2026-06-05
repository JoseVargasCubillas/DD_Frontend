import { useCourses } from '@hooks/useCourses';
import Spinner from '@atoms/Spinner';
import Button from '@atoms/Button';

export default function ManageCourses() {
  const { data, isLoading } = useCourses({ status: 'all' });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Gestionar cursos</h1>
        <Button size="sm">+ Nuevo curso</Button>
      </div>
      {isLoading ? <Spinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-dark-700 text-gray-400">
              <tr>{['Título', 'Categoría', 'Precio', 'Estado', 'Acciones'].map((h) => <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-dark-600">
              {data?.data.map((course) => (
                <tr key={course.id ?? course._id} className="text-gray-300 hover:bg-dark-700 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{course.title}</td>
                  <td className="px-4 py-3">{course.category}</td>
                  <td className="px-4 py-3">${course.price}</td>
                  <td className="px-4 py-3">{course.status}</td>
                  <td className="px-4 py-3"><Button size="sm" variant="ghost">Editar</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
