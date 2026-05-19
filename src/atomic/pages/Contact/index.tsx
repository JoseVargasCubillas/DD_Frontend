import Button from '@atoms/Button';
import FormField from '@molecules/FormField';
import { useForm } from 'react-hook-form';

interface ContactFormData { name: string; email: string; message: string }

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();
  const onSubmit = (data: ContactFormData) => { console.log(data); reset(); };

  return (
    <div className="container-app py-12 max-w-lg">
      <h1 className="section-title mb-8">Contacto</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormField label="Nombre" placeholder="Tu nombre" error={errors.name?.message} {...register('name', { required: 'Campo requerido' })} />
        <FormField label="Correo" type="email" placeholder="tu@email.com" error={errors.email?.message} {...register('email', { required: 'Campo requerido' })} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-300">Mensaje</label>
          <textarea className="input-base min-h-[120px] resize-y" placeholder="Escribe tu mensaje..." {...register('message', { required: 'Campo requerido' })} />
        </div>
        <Button type="submit" fullWidth>Enviar mensaje</Button>
      </form>
    </div>
  );
}
