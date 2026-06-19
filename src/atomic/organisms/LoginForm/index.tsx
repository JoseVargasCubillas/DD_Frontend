import { useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';

interface LoginFormData { email: string; password: string; remember: boolean }

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  return (
    <div className="w-full max-w-md mx-auto md:mx-0">
      <p className="section-label mb-2">Sección · Acceso</p>
      <h2 className="font-heading text-3xl md:text-4xl font-bold leading-tight">
        Bienvenido de vuelta
      </h2>
      <p className="font-serif italic text-ink-500 mt-1">Continúa donde lo dejaste.</p>

      <hr className="my-6 border-ink-300" />

      <form onSubmit={handleSubmit((data) => login({ email: data.email, password: data.password }))} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="section-label text-ink-700">Correo electrónico</label>
          <input id="email" type="email" autoComplete="email" placeholder="tu@correo.com"
            className={`input-cream ${errors.email ? 'border-red-600' : ''}`}
            {...register('email', { required: 'Ingresa tu correo', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Correo inválido' } })} />
          {errors.email && <span className="text-red-700 text-xs mt-1">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="section-label text-ink-700">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" placeholder="••••••••"
            className={`input-cream ${errors.password ? 'border-red-600' : ''}`}
            {...register('password', { required: 'Ingresa tu contraseña' })} />
          {errors.password && <span className="text-red-700 text-xs mt-1">{errors.password.message}</span>}
        </div>

        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-ink-600">
            <input type="checkbox" className="w-4 h-4 accent-ink-900 cursor-pointer" {...register('remember')} />
            <span className="uppercase tracking-[0.2em]">Recuérdame</span>
          </label>
          <a href="#" className="link-grow uppercase tracking-[0.2em] text-ink-600 hover:text-ink-900">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit" disabled={isLoading} className="btn-primary w-full mt-2">
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Acceder a la academia</>
          )}
        </button>

        <p className="text-center text-xs text-ink-500 mt-2 font-serif italic">
          Las cuentas se emiten al adquirir una suscripción.<br />
          Recibirás tus credenciales por correo.
        </p>
      </form>
    </div>
  );
}

