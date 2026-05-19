import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormField from '@molecules/FormField';
import Button from '@atoms/Button';
import { useAuth } from '@hooks/useAuth';

interface LoginFormData { email: string; password: string }

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  return (
    <form onSubmit={handleSubmit((data) => login(data))} className="flex flex-col gap-5 w-full max-w-sm">
      <FormField label="Correo electrónico" type="email" placeholder="tu@email.com"
        error={errors.email?.message} {...register('email', { required: 'Campo requerido' })} />
      <FormField label="Contraseña" type="password" placeholder="••••••••"
        error={errors.password?.message} {...register('password', { required: 'Campo requerido' })} />
      <Button type="submit" fullWidth isLoading={isLoading}>Iniciar sesión</Button>
      <p className="text-center text-gray-400 text-sm">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="text-brand-400 hover:underline">Regístrate</Link>
      </p>
    </form>
  );
}
