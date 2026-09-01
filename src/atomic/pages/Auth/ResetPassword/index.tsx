import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../../assets/home/012_home_main logo_DD.png';

interface ResetPasswordFormData { password: string; confirmPassword: string }

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const email = searchParams.get('email') ?? '';
  const { resetPassword, isResetPasswordLoading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>();
  const [showPwd, setShowPwd] = useState(false);
  const [linkError, setLinkError] = useState('');

  const linkIsMissing = !token || !email;

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (isResetPasswordLoading) return;
    setLinkError('');
    try {
      await resetPassword({ token, email, password: data.password });
      toast.success('Contraseña actualizada. Ya puedes iniciar sesión.');
      navigate('/iniciar-sesion');
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : 'El enlace no es válido o ya expiró.');
    }
  };

  return (
    <div className="academia-hero relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 text-cream sm:px-10 lg:px-16">
      <span className="academia-watermark" aria-hidden="true">Academia.</span>

      <Link to="/" className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8">
        <img src={logoDD} alt="Diego Díaz" className="h-7 object-contain brightness-0 invert" />
      </Link>
      <Link
        to="/iniciar-sesion"
        className="absolute right-6 top-6 z-10 text-[10px] uppercase tracking-[0.32em] text-cream/60 transition-colors hover:text-cream sm:right-10 sm:top-8"
      >
        ← Volver a iniciar sesión
      </Link>

      <div className="auth-paper-r relative z-10 w-full max-w-md border border-ink-900/10 bg-cream-100 px-9 py-11 text-ink-900 shadow-[0_40px_100px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.22)] sm:px-12 sm:py-12">
        <p className="mb-3.5 text-[10.5px] font-medium uppercase tracking-[0.3em] text-[#6b4f2a]">
          — Nueva contraseña
        </p>
        <h2 className="font-serif text-4xl leading-none tracking-tight text-ink-900">
          Restablecer <span className="italic font-normal">contraseña.</span>
        </h2>

        {linkIsMissing ? (
          <>
            <p className="mb-9 mt-3.5 max-w-[400px] text-[13.5px] leading-[1.65] text-ink-800/85">
              Este enlace no es válido. Solicita uno nuevo para restablecer tu contraseña.
            </p>
            <Link to="/recuperar-contrasena" className="btn-broadsheet inline-flex">
              Solicitar enlace
              <span className="arrow">→</span>
            </Link>
          </>
        ) : (
          <>
            <p className="mb-9 mt-3.5 max-w-[400px] text-[13.5px] leading-[1.65] text-ink-800/85">
              Crea una contraseña nueva para <strong className="font-semibold text-ink-900">{email}</strong>.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="ink-field mb-5 border-b border-ink-900/30 pb-1.5 pt-2.5">
                <label htmlFor="password" className="ink-label mb-2 block">— Nueva contraseña</label>
                <div className="flex items-center gap-3">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full flex-1 bg-transparent font-serif text-[17px] text-ink-900 outline-none placeholder:italic placeholder:text-ink-500"
                    {...register('password', {
                      required: 'Indica una contraseña',
                      minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="shrink-0 cursor-pointer border border-ink-900/15 px-2 py-1 text-[9.5px] font-medium uppercase tracking-[0.2em] text-ink-500 transition-colors hover:border-ink-900 hover:text-ink-900"
                  >
                    {showPwd ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.password.message}</p>
                )}
              </div>

              <div className="ink-field mb-7 border-b border-ink-900/30 pb-1.5 pt-2.5">
                <label htmlFor="confirmPassword" className="ink-label mb-2 block">— Confirmar contraseña</label>
                <input
                  id="confirmPassword"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full bg-transparent font-serif text-[17px] text-ink-900 outline-none placeholder:italic placeholder:text-ink-500"
                  {...register('confirmPassword', {
                    required: 'Confirma tu contraseña',
                    validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.confirmPassword.message}</p>
                )}
              </div>

              {linkError && (
                <p className="mb-6 font-serif text-[12.5px] italic text-red-700">— {linkError}</p>
              )}

              <button type="submit" disabled={isResetPasswordLoading} className="btn-broadsheet">
                {isResetPasswordLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-3 animate-spin rounded-full border border-cream border-t-transparent" />
                    Guardando…
                  </span>
                ) : (
                  <>
                    Guardar contraseña
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
