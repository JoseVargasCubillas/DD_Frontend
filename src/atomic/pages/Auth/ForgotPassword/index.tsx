import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../../assets/home/012_home_main logo_DD.png';

interface ForgotPasswordFormData { email: string }

export default function ForgotPassword() {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<ForgotPasswordFormData>();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isForgotPasswordLoading) return;
    try {
      await forgotPassword(data.email.trim().toLowerCase());
    } finally {
      // Siempre mostramos confirmación, exista o no el correo (no revelamos datos de usuarios).
      setSent(true);
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
          — Recuperación
        </p>
        <h2 className="font-serif text-4xl leading-none tracking-tight text-ink-900">
          Recuperar <span className="italic font-normal">contraseña.</span>
        </h2>

        {sent ? (
          <>
            <p className="mb-9 mt-3.5 max-w-[400px] text-[13.5px] leading-[1.65] text-ink-800/85">
              Si <strong className="font-semibold text-ink-900">{getValues('email')}</strong> tiene una cuenta
              activa en la Academia, te enviamos un correo con instrucciones para restablecer tu contraseña.
              El enlace es válido durante 1 hora.
            </p>
            <div className="flex items-center justify-between border-t border-ink-900/10 pt-5 text-[11.5px] text-ink-600">
              <span>
                ¿No llegó?{' '}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="cursor-pointer border-b border-ink-900/30 text-ink-900 transition-colors hover:border-[#6b4f2a] hover:text-[#6b4f2a]"
                >
                  Intentar de nuevo
                </button>
              </span>
              <span className="font-serif italic text-ink-500">
                Soporte ·{' '}
                <a href="mailto:ti@diegodiaz.mx" className="not-italic text-ink-900 underline decoration-ink-900/30 underline-offset-2 hover:decoration-ink-900">
                  ti@diegodiaz.mx
                </a>
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="mb-9 mt-3.5 max-w-[400px] text-[13.5px] leading-[1.65] text-ink-800/85">
              Ingresa el correo con el que te registraste. Te enviaremos un enlace para crear una contraseña nueva.
            </p>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="ink-field mb-7 border-b border-ink-900/30 pb-1.5 pt-2.5">
                <label htmlFor="email" className="ink-label mb-2 block">— Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="lector@diegodiaz.mx"
                  className="w-full bg-transparent font-serif text-[17px] text-ink-900 outline-none placeholder:italic placeholder:text-ink-500"
                  {...register('email', {
                    required: 'Indica un correo',
                    pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Correo inválido' },
                  })}
                />
                {errors.email && (
                  <p className="mt-2 font-serif text-[11px] italic text-red-700">— {errors.email.message}</p>
                )}
              </div>

              <button type="submit" disabled={isForgotPasswordLoading} className="btn-broadsheet">
                {isForgotPasswordLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-3 animate-spin rounded-full border border-cream border-t-transparent" />
                    Enviando…
                  </span>
                ) : (
                  <>
                    Enviar instrucciones
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
