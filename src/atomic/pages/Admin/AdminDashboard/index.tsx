export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Panel de administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[['Cursos', '—'], ['Usuarios', '—'], ['Eventos', '—'], ['Ingresos', '—']].map(([label, val]) => (
          <div key={label} className="card p-5">
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-2xl font-bold text-white mt-1">{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
