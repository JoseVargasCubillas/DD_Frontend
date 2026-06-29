import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsers, useAdminCreateUser, useAssignTag, useRemoveTag, useSendPassword } from '@hooks/useUsers';
import { useTags } from '@hooks/useTags';
import type { User, Tag } from '@t/index';

export default function ManageContacts() {
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const { data, isLoading } = useUsers({ page, limit: 25, search, tagId: tagFilter, role: 'user' });
  const { data: tags = [] } = useTags();

  const contacts = data?.data ?? [];
  const pagination = data?.pagination;
  const selected = useMemo(() => contacts.find((c) => (c._id || c.id) === selectedId), [contacts, selectedId]);

  return (
    <div>
      <header className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-3">Comunidad</p>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink-900 leading-none">Contactos</h1>
            <p className="text-sm text-ink-600 mt-3">
              Gestiona a tus clientes: asigna etiquetas, paquetes y abre el expediente completo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowAdd(true)} className="btn-broadsheet">
              + Añadir contacto
            </button>
          </div>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por nombre o correo..."
            className="ink-input"
          />
        </div>
        <select
          value={tagFilter ?? ''}
          onChange={(e) => { setTagFilter(e.target.value || undefined); setPage(1); }}
          className="ink-input max-w-xs cursor-pointer"
        >
          <option value="">Filtrar por etiqueta</option>
          {tags.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
        </select>
        <p className="ml-auto text-[10px] uppercase tracking-[0.32em] text-ink-500">
          {pagination?.total ?? 0} contactos
        </p>
      </div>

      {/* Tabla */}
      <div className="border border-ink-900/15 bg-cream-100">
        <div className="grid grid-cols-[1.6fr_1.4fr_1fr_0.9fr_1fr_40px] gap-4 px-5 py-3 border-b border-ink-900/15 text-[10px] uppercase tracking-[0.32em] text-ink-500">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Marketing</span>
          <span>Valor</span>
          <span>Añadido</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando…</p>
        ) : contacts.length === 0 ? (
          <p className="p-12 text-center text-sm text-ink-500">Sin contactos.</p>
        ) : (
          contacts.map((c) => {
            const id = String(c._id || c.id);
            const isSel = id === selectedId;
            return (
              <button
                key={id}
                onClick={() => setSelectedId(id)}
                className={`w-full grid grid-cols-[1.6fr_1.4fr_1fr_0.9fr_1fr_40px] gap-4 px-5 py-4 text-left border-b border-ink-900/10 last:border-0 cursor-pointer transition-colors items-center ${
                  isSel ? 'bg-cream-200' : 'hover:bg-cream-200/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-xs shrink-0">
                    {c.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{c.name}</p>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-ink-500">
                      {c.role === 'admin' ? 'Admin' : c.contactStatus === 'customer' ? 'Cliente' : 'Lead'}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-ink-700 truncate">{c.email}</span>
                <span className={`text-[10px] uppercase tracking-[0.24em] ${c.marketingStatus === 'subscribed' ? 'text-emerald-700' : 'text-ink-500'}`}>
                  {c.marketingStatus === 'subscribed' ? 'Suscrito' : c.marketingStatus === 'unsubscribed' ? 'Baja' : '—'}
                </span>
                <span className="text-sm text-ink-700">$0.00</span>
                <span className="text-xs text-ink-600">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                </span>
                <span className="text-ink-400 text-xs">›</span>
              </button>
            );
          })
        )}
      </div>

      {/* Paginación */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-5 text-[10px] uppercase tracking-[0.28em] text-ink-600">
          <span>Pág. {pagination.page} de {pagination.pages}</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1.5 border border-ink-900/20 hover:border-ink-900 disabled:opacity-30 cursor-pointer"
            >Anterior</button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1.5 border border-ink-900/20 hover:border-ink-900 disabled:opacity-30 cursor-pointer"
            >Siguiente</button>
          </div>
        </div>
      )}

      {selected && (
        <ContactDrawer
          contact={selected}
          tags={tags}
          onClose={() => setSelectedId(null)}
        />
      )}

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
function ContactDrawer({ contact, tags, onClose }: { contact: User; tags: Tag[]; onClose: () => void }) {
  const id = String(contact._id || contact.id);
  const navigate = useNavigate();
  const assign = useAssignTag();
  const remove = useRemoveTag();
  const sendPwd = useSendPassword();

  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const userTagIds = contact.tagIds ?? [];
  const userTags = tags.filter((t) => userTagIds.includes(t._id));
  const available = tags.filter((t) => !userTagIds.includes(t._id));

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-ink-900/40" onClick={onClose} />
      <aside
        className="w-full max-w-md bg-cream border-l border-ink-900/15 shadow-2xl overflow-y-auto"
        style={{ animation: 'paper-unfold-right 360ms ease-out both' }}
      >
        <div className="px-6 py-4 border-b border-ink-900/15 flex items-center justify-between">
          <Link to={`/admin/contactos/${id}`} className="text-[10px] uppercase tracking-[0.32em] text-ink-700 hover:text-ink-900 underline underline-offset-4">
            Abrir perfil completo →
          </Link>
          <button onClick={onClose} className="text-ink-500 hover:text-ink-900 cursor-pointer text-lg">×</button>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-ink-900 text-cream flex items-center justify-center font-serif text-xl">
              {contact.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="font-serif text-2xl text-ink-900 truncate">{contact.name}</h2>
              <button
                onClick={() => navigator.clipboard.writeText(contact.email)}
                className="text-sm text-ink-600 hover:text-ink-900 truncate cursor-pointer"
                title="Copiar correo"
              >
                {contact.email} ⧉
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button onClick={() => navigate(`/admin/contactos/${id}`)} className="flex-1 text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 py-2 cursor-pointer">
              Editar
            </button>
            <button onClick={() => sendPwd.mutate(id)} disabled={sendPwd.isPending} className="flex-1 text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 py-2 cursor-pointer disabled:opacity-50">
              Enviar clave
            </button>
            <button onClick={() => document.getElementById('drawer-tag-select')?.focus()} className="flex-1 text-[10px] uppercase tracking-[0.28em] border border-ink-900/20 hover:border-ink-900 py-2 cursor-pointer">
              Etiqueta
            </button>
          </div>

          <dl className="border-y border-ink-900/15 divide-y divide-ink-900/10">
            {[
              ['Valor de por vida', '$0.00'],
              ['Total ofertas', '0'],
              ['Total productos', String(contact.enrolledCourses?.length ?? 0)],
              ['Último ingreso', contact.lastLogin ? new Date(contact.lastLogin).toLocaleDateString('es-MX') : '—'],
              ['Total ingresos', String(contact.signInCount ?? 0)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 text-sm">
                <dt className="text-ink-600">{k}</dt>
                <dd className="text-ink-900 font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mb-1">Estado contacto</p>
              <span className="inline-block px-2 py-0.5 bg-ink-900 text-cream text-[10px] uppercase tracking-[0.24em]">
                {contact.contactStatus === 'customer' ? 'Cliente' : contact.contactStatus === 'churned' ? 'Inactivo' : 'Lead'}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mb-1">Marketing</p>
              <p className="text-ink-900">{contact.marketingStatus === 'subscribed' ? 'Suscrito' : '—'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mb-1">Añadido</p>
              <p className="text-ink-900">{new Date(contact.createdAt).toLocaleDateString('es-MX')}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-ink-500 mb-1">Opt-in</p>
              <p className="text-ink-900">{contact.isEmailVerified ? 'Verificado' : 'Pendiente'}</p>
            </div>
          </div>

          <div className="mt-7">
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500 mb-2">Etiquetas</p>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {userTags.length === 0 && <span className="text-xs text-ink-500">Sin etiquetas</span>}
              {userTags.map((t) => (
                <span key={t._id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-cream-200 border border-ink-900/15 text-[10px] uppercase tracking-[0.24em]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                  {t.name}
                  <button
                    onClick={() => remove.mutate({ userId: id, tagId: t._id })}
                    className="text-ink-500 hover:text-ink-900 cursor-pointer ml-1"
                  >×</button>
                </span>
              ))}
            </div>
            <select
              id="drawer-tag-select"
              onChange={(e) => {
                if (e.target.value) {
                  assign.mutate({ userId: id, tagId: e.target.value });
                  e.target.value = '';
                }
              }}
              className="ink-input text-xs cursor-pointer"
            >
              <option value="">Asignar etiqueta…</option>
              {available.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
function AddContactModal({ onClose }: { onClose: () => void }) {
  const create = useAdminCreateUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-cream border border-ink-900/20 shadow-xl p-7" style={{ animation: 'paper-unfold 320ms ease-out both' }}>
        <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Comunidad</p>
        <h3 className="font-serif text-2xl text-ink-900 mb-1">Añadir contacto</h3>
        <p className="text-sm text-ink-600 mb-6">Generaremos una clave temporal y se enviará por correo.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({ name, email, role }, { onSuccess: onClose });
          }}
          className="space-y-4"
        >
          <div>
            <label className="ink-label">Nombre completo</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="ink-input" />
          </div>
          <div>
            <label className="ink-label">Correo</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="ink-input" />
          </div>
          <div>
            <label className="ink-label">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value as 'user' | 'admin')} className="ink-input cursor-pointer">
              <option value="user">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 text-[10px] uppercase tracking-[0.3em] border border-ink-900/20 hover:border-ink-900 py-2.5 cursor-pointer">
              Cancelar
            </button>
            <button type="submit" disabled={create.isPending} className="btn-broadsheet flex-1 disabled:opacity-50">
              {create.isPending ? 'Creando…' : 'Crear contacto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
