import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../../assets/home/012_home_main logo_DD.png';

interface LoginFormData { email: string; password: string }

const HEADLINE = 'Bienvenido';

export default function Login() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [showPwd, setShowPwd] = useState(false);
  const onSubmit = (data: LoginFormData) => {
    if (isLoading) return;
    login(data);
  };

  return (
    <div className="academia-hero relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 text-cream sm:px-10 lg:px-16">
      <span className="academia-watermark" aria-hidden="true">Academia.</span>

      {/* Marca + volver al sitio */}
      <Link to="/" className="absolute left-6 top-6 z-10 sm:left-10 sm:top-8">
        <img src={logoDD} alt="Diego Díaz" className="h-7 object-contain brightness-0 invert" />
      </Link>
      <Link
        to="/"
        className="absolute right-6 top-6 z-10 text-[10px] uppercase tracking-[0.32em] text-cream/60 transition-colors hover:text-cream sm:right-10 sm:top-8"
      >
        ← Volver al sitio
      </Link>

      <div className="relative z-10 grid w-full max-w-[1180px] items-center gap-20 lg:grid-cols-[1fr_520px]">
        {/* ===== Bienvenida ===== */}
        <div className="auth-paper-l max-w-lg pr-5">
          <p className="mb-8 flex items-center gap-2 border-b border-cream/20 pb-5 text-[10.5px] font-medium uppercase tracking-[0.3em] text-cream/55">
            <span className="text-[#8a6a3d]">— 00</span> Miembros
          </p>

          <h1
            className="headline-stagger font-serif text-[clamp(2.8rem,6.5vw,5rem)] leading-[0.96] tracking-tight text-cream"
            aria-label={`${HEADLINE} a la Academia.`}
          >
            {HEADLINE.split('').map((ch, i) => (
              <span key={i} aria-hidden="true" style={{ animationDelay: `${300 + i * 55}ms` }}>
                {ch === ' ' ? ' ' : ch}
              </span>
            ))}
            <span
              className="mt-1 block font-normal italic text-cream text-[clamp(1.4rem,3.2vw,2.2rem)]"
              style={{ animation: 'letter-rise 800ms var(--ease-out) 900ms both' }}
            >
              a la Academia.
            </span>
          </h1>

          <p className="col-fade mt-7 max-w-[44ch] font-sans text-[15px] leading-[1.7] text-cream/78" style={{ animationDelay: '1100ms' }}>
            La plataforma de streaming <strong className="font-medium text-cream">especializada</strong> con
            formación fiscal, contable y patrimonial. Accede con las credenciales que recibiste por correo.
          </p>
        </div>

        {/* ===== Tarjeta de acceso ===== */}
        <div className="auth-paper-r relative w-full border border-ink-900/10 bg-cream-100 px-9 py-11 text-ink-900 shadow-[0_40px_100px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.22)] sm:px-12 sm:py-12">
          <p className="mb-3.5 text-[10.5px] font-medium uppercase tracking-[0.3em] text-[#6b4f2a]">
            — Suscriptores
          </p>
          <h2 className="font-serif text-4xl leading-none tracking-tight text-ink-900">
            Iniciar <span className="italic font-normal">sesión.</span>
          </h2>
          <p className="mb-9 mt-3.5 max-w-[400px] text-[13.5px] leading-[1.65] text-ink-800/85">
            Ingresa tus credenciales para acceder a la edición vigente y todas las secciones activas.
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="ink-field mb-5 border-b border-ink-900/30 pb-1.5 pt-2.5">
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

            {/* Password */}
            <div className="ink-field mb-6 border-b border-ink-900/30 pb-1.5 pt-2.5">
              <label htmlFor="password" className="ink-label mb-2 block">— Contraseña</label>
              <div className="flex items-center gap-3">
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full flex-1 bg-transparent font-serif text-[17px] text-ink-900 outline-none placeholder:italic placeholder:text-ink-500"
                  {...register('password', { required: 'Indica tu contraseña' })}
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

            <div className="mb-7 flex items-center justify-between">
              <label className="flex cursor-pointer select-none items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-800">
                <input type="checkbox" className="h-4 w-4 accent-ink-900" />
                Recordarme
              </label>
              <Link
                to="/recuperar-contrasena"
                className="border-b border-ink-900/30 font-serif text-[13px] italic text-ink-900 transition-colors hover:border-[#6b4f2a] hover:text-[#6b4f2a]"
              >
                ¿Olvidaste tu clave?
              </Link>
            </div>

            <button type="submit" disabled={isLoading} className="btn-broadsheet">
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="h-3 w-3 animate-spin rounded-full border border-cream border-t-transparent" />
                  Verificando…
                </span>
              ) : (
                <>
                  Acceder a la edición
                  <span className="arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-ink-900/10 pt-5 text-[11.5px] text-ink-600">
            <span>
              ¿No tienes cuenta?{' '}
              <Link to="/academia#academy-pricing" className="border-b border-ink-900/30 text-ink-900 transition-colors hover:border-[#6b4f2a] hover:text-[#6b4f2a]">
                Comprar acceso →
              </Link>
            </span>
            <span className="font-serif italic text-ink-500">
              Soporte ·{' '}
              <a href="mailto:ti@diegodiaz.mx" className="not-italic text-ink-900 underline decoration-ink-900/30 underline-offset-2 hover:decoration-ink-900">
                ti@diegodiaz.mx
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
