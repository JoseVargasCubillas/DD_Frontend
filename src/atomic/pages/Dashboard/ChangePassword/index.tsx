import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as authApi from '@api/auth.api';
import { useAuthStore } from '@store/authStore';

interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const forced = searchParams.get('forzado') === '1';

  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);

  const [showPwd, setShowPwd] = useState(false);
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ChangePasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const mutation = useMutation({
    mutationFn: authApi.changePassword,
    retry: 0,
    onSuccess: () => {
      toast.success('Tu contraseña fue actualizada correctamente.');
      if (user) {
        const stored = useAuthStore.getState();
        setAuth({
          user: { ...user, mustChangePassword: false },
          accessToken: stored.accessToken ?? '',
          refreshToken: stored.refreshToken ?? '',
        });
      }
      reset();
      navigate(user?.role === 'admin' ? '/admin' : '/mi-cuenta');
    },
    onError: (err: unknown) => {
      setServerError(err instanceof Error ? err.message : 'No se pudo actualizar la contraseña.');
    },
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    if (mutation.isPending) return;
    setServerError('');
    mutation.mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Seguridad</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink-900">
          {forced ? <>Actualiza tu <span className="italic">contraseña.</span></> : <>Cambiar <span className="italic">contraseña.</span></>}
        </h1>
        <p className="font-serif italic text-ink-600 mt-1">
          {forced
            ? 'Antes de continuar, sustituye la contraseña temporal que te enviamos por una personal.'
            : 'Elige una contraseña nueva de al menos 8 caracteres.'}
        </p>
      </header>
      <div className="h-px bg-ink-900/30" />

      {forced && (
        <div className="border border-ink-900/25 bg-cream-100 p-4 text-sm text-ink-800">
          <p className="font-serif italic">
            Ingresaste con una contraseña temporal enviada por correo. Por seguridad, define una contraseña personal antes de continuar navegando la plataforma.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="ink-field">
          <label className="ink-label" htmlFor="currentPassword">Contraseña actual</label>
          <input
            id="currentPassword"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            className="ink-input"
            placeholder="••••••••"
            {...register('currentPassword', { required: 'Indica tu contraseña actual' })}
          />
          {errors.currentPassword && (
            <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.currentPassword.message}</p>
          )}
        </div>

        <div className="ink-field">
          <label className="ink-label" htmlFor="newPassword">Nueva contraseña</label>
          <input
            id="newPassword"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            className="ink-input"
            placeholder="••••••••"
            {...register('newPassword', {
              required: 'Indica una contraseña nueva',
              minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              validate: (value) => value !== watch('currentPassword') || 'La nueva contraseña debe ser distinta a la actual',
            })}
          />
          {errors.newPassword && (
            <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.newPassword.message}</p>
          )}
        </div>

        <div className="ink-field">
          <label className="ink-label" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
          <input
            id="confirmPassword"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
            className="ink-input"
            placeholder="••••••••"
            {...register('confirmPassword', {
              required: 'Confirma tu nueva contraseña',
              validate: (value) => value === watch('newPassword') || 'Las contraseñas no coinciden',
            })}
          />
          {errors.confirmPassword && (
            <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.confirmPassword.message}</p>
          )}
        </div>

        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-ink-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={showPwd}
            onChange={(e) => setShowPwd(e.target.checked)}
            className="w-4 h-4 accent-ink-900 cursor-pointer"
          />
          Mostrar contraseñas
        </label>

        {serverError && (
          <p className="font-serif text-[13px] italic text-red-700">— {serverError}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-broadsheet w-auto px-8"
          >
            {mutation.isPending ? 'Guardando…' : 'Guardar contraseña →'}
          </button>
          {!forced && (
            <Link to="/mi-cuenta/perfil" className="text-[10px] uppercase tracking-[0.3em] text-ink-500 hover:text-ink-900 font-serif italic">
              ← Volver al perfil
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
