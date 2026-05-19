import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormField from '@molecules/FormField';
import Button from '@atoms/Button';
import { useAuth } from '@hooks/useAuth';

interface RegisterFormData { name: string; email: string; password: string; confirm: string }

export default function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();

  return (
    <form onSubmit={handleSubmit(({ name, email, password }) => registerUser({ name, email, password }))} className="flex flex-col gap-5 w-full max-w-sm">
      <FormField label="Nombre completo" placeholder="Tu nombre" error={errors.name?.message}
        {...register('name', { required: 'Campo requerido' })} />
      <FormField label="Correo electrónico" type="email" placeholder="tu@email.com" error={errors.email?.message}
        {...register('email', { required: 'Campo requerido' })} />
      <FormField label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" error={errors.password?.message}
        {...register('password', { required: 'Campo requerido', minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
      <FormField label="Confirmar contraseña" type="password" placeholder="Repite tu contraseña" error={errors.confirm?.message}
        {...register('confirm', { validate: (v) => v === watch('password') || 'Las contraseñas no coinciden' })} />
      <Button type="submit" fullWidth isLoading={isLoading}>Crear cuenta</Button>
      <p className="text-center text-gray-400 text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to="/iniciar-sesion" className="text-brand-400 hover:underline">Inicia sesión</Link>
      </p>
    </form>
  );
}
