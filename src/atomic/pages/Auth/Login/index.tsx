import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import logoDD from '../../../../../assets/home/012_home_main logo_DD.png';

interface LoginFormData { email: string; password: string }

const TODAY = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const HEADLINE = 'Bienvenido';

// Pequeño párrafo "editorial" para llenar la columna izquierda con sensación de periódico.
const LEDE =
  'Ediciones diarias con estrategia fiscal, formación de alto nivel y la dirección financiera que tu empresa necesita. Esta es la sala de redacción.';
const COLUMN =
  'En esta edición: nuevos módulos de planeación patrimonial, casos prácticos del despacho Díaz Lara y un análisis exclusivo sobre el ejercicio fiscal vigente. Acceda con sus credenciales para continuar la lectura.';

export default function Login() {
  const { login, isLoading } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Cintilla superior ───────────────────────── */}
      <div className="border-b border-ink-900/20 bg-cream-200/60 backdrop-blur-sm">
        <div className="container-app flex items-center justify-between py-2.5 text-[10px] uppercase tracking-[0.32em] text-ink-700">
          <span className="hidden md:inline">Vol. XII · No. 248 · Edición Digital</span>
          <span className="capitalize">{TODAY}</span>
          <Link to="/" className="hover:text-ink-900 transition-colors">← Volver al sitio</Link>
        </div>
      </div>

      {/* ── Cuerpo principal: 2 columnas tipo periódico ── */}
      <div className="flex-1 grid lg:grid-cols-[1.15fr_1fr] xl:grid-cols-[1.3fr_1fr]">
        {/* ===== Columna izquierda: el periódico ===== */}
        <section className="auth-paper-l relative px-6 sm:px-10 lg:px-14 py-10 lg:py-14 border-b lg:border-b-0 lg:border-r border-ink-900/15">
          {/* Masthead */}
          <div className="flex items-center justify-between mb-4">
            <img
              src={logoDD}
              alt="Diego Díaz"
              className="h-10 lg:h-12 object-contain ink-blot"
              style={{ animationDelay: '120ms' }}
            />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500">Academia</p>
              <p className="font-serif italic text-sm text-ink-700">la edición de los expertos</p>
            </div>
          </div>

          <span className="ink-rule thick block mb-2" />
          <span className="ink-rule delay-1 block mb-10" />

          {/* Sección + headline animado letra-a-letra */}
          <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-6">
            Sala de Redacción · Acceso
          </p>

          <h1
            className="headline-stagger font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] tracking-tight text-ink-900 mb-8"
            aria-label={HEADLINE}
          >
            {HEADLINE.split('').map((ch, i) => (
              <span
                key={i}
                aria-hidden="true"
                style={{ animationDelay: `${300 + i * 55}ms` }}
              >
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
            <span
              className="block italic font-normal text-ink-700 text-[clamp(1.5rem,3.5vw,2.5rem)] mt-2"
              style={{ animation: 'letter-rise 800ms var(--ease-out) 900ms both' }}
            >
              a la Academia
            </span>
          </h1>

          {/* Lede con drop-cap */}
          <p className="drop-cap font-serif text-lg lg:text-xl leading-[1.65] text-ink-800 max-w-[52ch] mb-10 col-fade" style={{ animationDelay: '1100ms' }}>
            {LEDE}
          </p>

          <span className="ink-rule delay-2 block mb-8 text-ink-900/30" />

          {/* Columnas inferiores tipo periódico */}
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl">
            <div className="col-fade" style={{ animationDelay: '1300ms' }}>
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700 mb-2">En esta edición</p>
              <span className="ink-rule delay-3 block mb-3" />
              <p className="font-serif text-sm leading-[1.7] text-ink-700">{COLUMN}</p>
            </div>
            <div className="col-fade space-y-3" style={{ animationDelay: '1450ms' }}>
              <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700 mb-2">Secciones</p>
              <span className="ink-rule delay-3 block mb-3" />
              <ul className="font-serif text-sm leading-[1.9] text-ink-800">
                <li className="flex justify-between border-b border-ink-900/10 py-1">
                  <span>Estrategia Fiscal</span><span className="italic text-ink-500">pág. 02</span>
                </li>
                <li className="flex justify-between border-b border-ink-900/10 py-1">
                  <span>Formación Patrimonial</span><span className="italic text-ink-500">pág. 07</span>
                </li>
                <li className="flex justify-between border-b border-ink-900/10 py-1">
                  <span>Casos Díaz Lara</span><span className="italic text-ink-500">pág. 14</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>Editorial · Diego Díaz</span><span className="italic text-ink-500">pág. 21</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===== Columna derecha: el formulario ===== */}
        <section className="auth-paper-r relative bg-white/70 px-6 sm:px-10 lg:px-14 py-10 lg:py-14 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-3">
              Suscriptores
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-ink-900 mb-2">
              Iniciar sesión
            </h2>
            <p className="font-serif italic text-ink-600 text-sm mb-10">
              Acceda con las credenciales que recibió por correo.
            </p>

            <span className="ink-rule mb-10 text-ink-900/40" />

            <form onSubmit={handleSubmit((d) => login(d))} className="space-y-7">
              {/* Email */}
              <div className="ink-field">
                <label htmlFor="email" className="ink-label block mb-1">Correo</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="lector@diegodiaz.mx"
                  className="ink-input"
                  {...register('email', {
                    required: 'Indique un correo',
                    pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Correo inválido' },
                  })}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-700 mt-2 font-serif italic">— {errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="ink-field">
                <label htmlFor="password" className="ink-label block mb-1">Contraseña</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="ink-input pr-16"
                    {...register('password', { required: 'Indique su contraseña' })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-[0.28em] text-ink-600 hover:text-ink-900 transition-colors cursor-pointer"
                    aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPwd ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-700 mt-2 font-serif italic">— {errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-ink-600">
                <label className="flex items-center gap-2 cursor-pointer hover:text-ink-900 transition-colors">
                  <input type="checkbox" className="accent-ink-900 w-3.5 h-3.5" />
                  Recordarme
                </label>
                <Link to="#" className="hover:text-ink-900 transition-colors">¿Olvidó su clave?</Link>
              </div>

              <button type="submit" disabled={isLoading} className="btn-broadsheet mt-2">
                {isLoading ? (
                  <span className="flex items-center gap-3">
                    <span className="w-3 h-3 border border-cream border-t-transparent rounded-full animate-spin" />
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

            {/* Footer del formulario */}
            <div className="mt-12">
              <span className="ink-rule block mb-4 text-ink-900/30" />
              <p className="font-serif italic text-[13px] text-ink-600 leading-relaxed">
                Las suscripciones son emitidas por el equipo editorial. Si aún no
                cuenta con acceso, escriba a{' '}
                <a href="mailto:academia@diegodiaz.mx" className="text-ink-900 underline decoration-ink-900/40 underline-offset-2 hover:decoration-ink-900">
                  academia@diegodiaz.mx
                </a>.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Pie del periódico ────────────────────────── */}
      <div className="border-t border-ink-900/15 bg-cream-200/60">
        <div className="container-app py-3 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-ink-600">
          <span>© Diego Díaz · Todos los derechos reservados</span>
          <span className="hidden sm:inline">Impreso digitalmente en CDMX</span>
        </div>
      </div>
    </div>
  );
}
