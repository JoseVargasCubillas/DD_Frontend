import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { client } from '@api/client';

interface NewAccountForm {
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export default function ManageAccounts() {
  const [form, setForm] = useState<NewAccountForm>({ name: '', email: '', role: 'user' });

  const create = useMutation({
    mutationFn: (payload: NewAccountForm) =>
      client.post<{ success: boolean; data: { tempPassword?: string } }>('/auth/admin/users', payload),
    onSuccess: (r) => {
      toast.success('Cuenta creada. Contraseña temporal enviada al correo.');
      if (r?.data?.tempPassword) console.info('Temp password (dev):', r.data.tempPassword);
      setForm({ name: '', email: '', role: 'user' });
    },
    onError: (e: Error) => toast.error(e.message ?? 'No se pudo crear la cuenta'),
  });

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <header className="border-b border-cream-400 pb-4">
        <p className="section-label text-ink-500">Sección · Accesos</p>
        <h1 className="font-heading text-3xl font-bold mt-1">Crear cuenta de cliente</h1>
        <p className="font-serif italic text-ink-500 text-sm mt-1">
          Solo el administrador puede emitir credenciales. El cliente recibirá su contraseña por correo.
        </p>
      </header>

      <form onSubmit={(e) => { e.preventDefault(); create.mutate(form); }} className="bg-white border border-cream-300 p-8 flex flex-col gap-5">
        <label className="flex flex-col gap-1.5">
          <span className="section-label text-ink-700">Nombre completo</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-cream" placeholder="Carolina Flores Amador" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="section-label text-ink-700">Correo electrónico</span>
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-cream" placeholder="cliente@correo.com" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="section-label text-ink-700">Rol</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as NewAccountForm['role'] })} className="input-cream">
            <option value="user">Cliente</option>
            <option value="admin">Administrador</option>
          </select>
        </label>

        <p className="text-xs text-ink-500 font-serif italic">
          Se generará una contraseña temporal segura y se enviará al correo del cliente.
          Podrá cambiarla desde su perfil.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" disabled={create.isPending} className="btn-primary">
            {create.isPending ? 'Creando…' : 'Crear y enviar credenciales'}
          </button>
        </div>
      </form>
    </div>
  );
}
