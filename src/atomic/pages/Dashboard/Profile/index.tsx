import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import * as usersApi from '@api/users.api';
import { useUpdateProfile } from '@hooks/useUsers';
import { useAuthStore } from '@store/authStore';

interface ProfileFormData { name: string; phone: string; bio: string }

export default function Profile() {
  const fallback = useAuthStore((s) => s.user);
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersApi.getProfile,
  });
  const update = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<ProfileFormData>({
    defaultValues: { name: fallback?.name ?? '', phone: '', bio: '' },
  });

  useEffect(() => {
    if (profile) {
      reset({ name: profile.name ?? '', phone: profile.phone ?? '', bio: profile.bio ?? '' });
    }
  }, [profile, reset]);

  const onSubmit = (form: ProfileFormData) => update.mutate(form);

  return (
    <div className="max-w-2xl space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-700 mb-2">Tu cuenta</p>
        <h1 className="font-serif text-4xl text-ink-900">Perfil</h1>
        <p className="font-serif italic text-ink-600 mt-1">
          Mantén tus datos actualizados para recibir avisos editoriales.
        </p>
      </header>
      <div className="h-px bg-ink-900/30" />

      <div className="bg-cream-100 border border-ink-900/15 p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-2xl">
          {(profile?.name ?? fallback?.name ?? 'D').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-serif text-xl text-ink-900">{profile?.name ?? fallback?.name}</p>
          <p className="text-xs text-ink-600 font-serif italic">{profile?.email ?? fallback?.email}</p>
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-700 mt-1">{profile?.role ?? fallback?.role}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="ink-field">
          <label className="ink-label">Nombre completo</label>
          <input type="text" className="ink-input" disabled={isLoading} {...register('name', { required: true })} />
        </div>

        <div className="ink-field">
          <label className="ink-label">Teléfono</label>
          <input type="tel" className="ink-input" placeholder="+52 55 0000 0000" disabled={isLoading} {...register('phone')} />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.32em] text-ink-700 mb-2">Sobre ti</p>
          <textarea
            className="w-full bg-transparent border border-ink-900/20 focus:border-ink-900 font-serif p-3 min-h-[120px] resize-y outline-none transition-colors"
            placeholder="Una breve presentación…"
            disabled={isLoading}
            {...register('bio')}
          />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={!isDirty || update.isPending}
            className="btn-broadsheet w-auto px-8"
          >
            {update.isPending ? 'Guardando…' : 'Guardar cambios →'}
          </button>
          {!isDirty && <span className="text-[10px] uppercase tracking-[0.3em] text-ink-500 font-serif italic">sin cambios</span>}
        </div>
      </form>
    </div>
  );
}

