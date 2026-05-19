import { useAuthStore } from '@store/authStore';
import Button from '@atoms/Button';
import FormField from '@molecules/FormField';
import { useForm } from 'react-hook-form';

interface ProfileFormData { name: string; phone: string; bio: string }

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const { register, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: { name: user?.name ?? '' },
  });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-bold text-white">Mi perfil</h1>
      <form onSubmit={handleSubmit(console.log)} className="flex flex-col gap-4">
        <FormField label="Nombre" {...register('name')} />
        <FormField label="Teléfono" {...register('phone')} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Bio</label>
          <textarea className="input-base resize-y min-h-[80px]" {...register('bio')} />
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </div>
  );
}
