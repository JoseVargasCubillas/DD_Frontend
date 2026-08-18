import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useUsers, useAdminCreateUser, useAssignTag, useRemoveTag, useSendPassword, useImportContacts } from '@hooks/useUsers';
import { useCreateTag, useDeleteTag, useTags, useUpdateTag } from '@hooks/useTags';
import { useCourses } from '@hooks/useCourses';
import { useEvents } from '@hooks/useEvents';
import type { ImportContactInput, ImportContactsResult } from '@api/users.api';
import type { User, Tag, Course } from '@t/index';

export default function ManageContacts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'tags' ? 'tags' : 'contacts';
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [segment, setSegment] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sort, setSort] = useState('added_newest');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading } = useUsers({ page, limit: pageSize, search, tagId: tagFilter, role: 'user', sort, segment });
  const { data: tags = [] } = useTags();

  const contacts = data?.data ?? [];
  const pagination = data?.pagination;
  const selected = useMemo(() => contacts.find((c) => (c._id || c.id) === selectedId), [contacts, selectedId]);
  const activeTag = tags.find((tag) => tag._id === tagFilter);
  const selectedCount = allSelected ? (pagination?.total ?? 0) : selectedIds.length;
  const visibleIds = contacts.map((contact) => String(contact._id || contact.id));
  const allVisibleSelected = allSelected || (visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id)));

  const toggleAllVisible = (checked: boolean) => {
    setAllSelected(checked);
    setSelectedIds(checked ? visibleIds : []);
  };

  const toggleContact = (id: string, checked: boolean) => {
    setAllSelected(false);
    setSelectedIds((current) => checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id));
  };

  const showContacts = (nextTagId?: string) => {
    setSearchParams({});
    setTagFilter(nextTagId);
    setPage(1);
  };

  const showTags = () => setSearchParams({ tab: 'tags' });

  return (
    <div className="mx-auto max-w-[1180px]">
      <header className="mb-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold leading-none text-ink-900">Contacts</h1>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-ink-900/40 text-[10px] text-ink-600">?</span>
            </div>
            <nav className="mt-7 flex items-center gap-6 text-sm font-semibold">
              <button
                type="button"
                onClick={() => showContacts()}
                className={`pb-4 ${activeTab === 'contacts' ? 'border-b-2 border-ink-900 text-ink-900' : 'text-ink-800 hover:text-ink-900'}`}
              >
                All Contacts
              </button>
              <button
                type="button"
                onClick={showTags}
                className={`pb-4 ${activeTab === 'tags' ? 'border-b-2 border-ink-900 text-ink-900' : 'text-ink-800 hover:text-ink-900'}`}
              >
                Manage tags
              </button>
            </nav>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAddMenuOpen((open) => !open)}
              className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-[#2f2f2f] px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-ink-900"
            >
              <span className="text-lg leading-none">+</span>
              Add contacts
            </button>
            {addMenuOpen && (
              <div className="absolute right-0 top-12 z-20 w-60 overflow-hidden rounded-xl border border-ink-900/10 bg-white py-2 text-sm shadow-lg">
                <button
                  type="button"
                  onClick={() => { setShowImport(true); setAddMenuOpen(false); }}
                  className="block min-h-11 w-full cursor-pointer px-6 text-left text-ink-900 hover:bg-ink-50"
                >
                  Import CSV
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAdd(true); setAddMenuOpen(false); }}
                  className="block min-h-11 w-full cursor-pointer px-6 text-left text-ink-900 hover:bg-ink-50"
                >
                  Add Single Contact
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activeTab === 'tags' ? (
        <ManageTagsTab tags={tags} onSelectTag={(tagId) => showContacts(tagId)} />
      ) : (
      <section className="rounded-2xl border border-ink-900/10 bg-white px-5 py-7 shadow-sm">
        <div className="mb-8 flex flex-wrap items-center gap-5">
          <SegmentsDropdown
            value={segment}
            onChange={(next) => {
              setSegment(next);
              setTagFilter(undefined);
              setPage(1);
            }}
          />
          <div className="relative min-w-[260px] flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500">⌕</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search Contacts..."
              className="h-10 w-full rounded-lg border border-ink-900/20 bg-white pl-10 pr-4 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-500 focus:border-[#8b8cf6]"
            />
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-ink-900/20 bg-white px-4 text-sm text-ink-900 transition-colors hover:border-ink-900"
          >
            <span className="text-base leading-none">≛</span>
            Filters
          </button>
        </div>

        {filtersOpen && <KajabiFiltersPanel tags={tags} />}

        {(tagFilter || segment) && (
          <div className="mb-6 flex items-center gap-3 text-sm">
            <span className="inline-flex min-h-6 items-center gap-1 rounded-full bg-[#eeeeee] px-3 text-xs font-medium text-ink-800">
              1 Filters
              <button
                type="button"
                onClick={() => { setTagFilter(undefined); setSegment(''); setPage(1); }}
                className="cursor-pointer text-ink-600 hover:text-ink-900"
                aria-label="Clear filters"
              >
                ×
              </button>
            </span>
            <button type="button" className="cursor-pointer text-xs font-semibold text-ink-800 hover:text-ink-900">
              Save as Segment
            </button>
            {activeTag && <span className="text-xs text-ink-500">Tag: {activeTag.name}</span>}
          </div>
        )}

        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-ink-900">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) => toggleAllVisible(event.target.checked)}
              className="h-4 w-4 cursor-pointer rounded border-ink-900/20 accent-[#7977f2]"
            />
            {selectedCount > 0
              ? `Selected ${selectedCount} contacts`
              : `Displaying ${contacts.length ? ((page - 1) * pageSize) + 1 : 0}-${Math.min(page * pageSize, pagination?.total ?? contacts.length)} of ${pagination?.total ?? 0} contacts`}
          </label>
          {selectedCount > 0 && <BulkActionsDropdown />}
          <div className="flex items-center gap-5">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="h-10 w-10 cursor-pointer rounded-lg border border-ink-900/15 text-lg text-ink-500 hover:border-ink-900 disabled:cursor-default disabled:opacity-40">←</button>
            <button disabled={Boolean(pagination && page >= pagination.pages)} onClick={() => setPage((p) => p + 1)} className="h-10 w-10 cursor-pointer rounded-lg border border-ink-900/20 text-lg text-ink-700 hover:border-ink-900 disabled:cursor-default disabled:opacity-40">→</button>
            <MenuSelect
              value={`${pageSize} / page`}
              options={[
                { label: '25 / page', value: '25' },
                { label: '50 / page', value: '50' },
                { label: '100 / page', value: '100' },
              ]}
              onSelect={(value) => { setPageSize(Number(value)); setPage(1); }}
              widthClass="w-32"
            />
            <MenuSelect
              value="Sort"
              options={SORT_OPTIONS}
              onSelect={(value) => { setSort(value); setPage(1); }}
              widthClass="w-56"
              menuAlign="right"
            />
          </div>
        </div>

        <div className="grid grid-cols-[28px_42px_1.45fr_1.2fr_1fr_0.7fr_0.8fr_0.8fr_28px] gap-3 border-b border-ink-900/15 px-3 py-4 text-sm font-semibold text-ink-900">
          <span />
          <span />
          <span>Nombre</span>
          <span>Correo</span>
          <span>Email Marketing</span>
          <span>Lifetime Value</span>
          <span>Added date</span>
          <span>Last activity</span>
          <span />
        </div>

        {isLoading ? (
          <p className="p-8 text-sm text-ink-500">Cargando...</p>
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
                className={`grid w-full grid-cols-[28px_42px_1.45fr_1.2fr_1fr_0.7fr_0.8fr_0.8fr_28px] items-center gap-3 px-3 py-5 text-left text-sm transition-colors ${
                  isSel ? 'bg-[#eeeeee]' : 'hover:bg-[#f2f2f2]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={allSelected || selectedIds.includes(id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(event) => toggleContact(id, event.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-ink-900/20 accent-[#7977f2]"
                  aria-label={`Seleccionar ${c.name}`}
                />
                <div className="relative h-8 w-8 rounded-full bg-ink-50 text-ink-900">
                  <svg className="absolute left-2 top-1.5 h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z" />
                  </svg>
                  <span className="absolute bottom-0 right-0 flex h-3 w-3 items-center justify-center rounded-full bg-[#242424] text-[8px] text-white">✓</span>
                </div>
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink-900">{c.name}</p>
                  <p className="text-[11px] text-ink-500 md:hidden">{c.email}</p>
                </div>
                <span className="truncate text-ink-700">{c.email}</span>
                <span className="truncate text-ink-600">
                  {c.marketingStatus === 'subscribed' ? 'Subscribed' : c.marketingStatus === 'unsubscribed' ? 'Unsubscribed' : 'Never subscribed'}
                </span>
                <span className="text-ink-700">0,00 $</span>
                <span className="text-ink-600">
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </span>
                <span className="text-ink-600">
                  {c.lastLogin ? new Date(c.lastLogin).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                </span>
                <span className="text-center text-lg text-ink-900">...</span>
              </button>
            );
          })
        )}
      </section>
      )}

      {selected && (
        <ContactDrawer
          contact={selected}
          tags={tags}
          onClose={() => setSelectedId(null)}
        />
      )}

      {showAdd && <AddContactModal onClose={() => setShowAdd(false)} />}
      {showImport && <ImportContactsModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
const SEGMENTS = [
  { label: 'All Contacts', value: '' },
  { label: 'Customers', value: 'customers' },
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Hard Bounced', value: 'hard_bounced' },
];

function SegmentsDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = SEGMENTS.find((segment) => segment.value === value) ?? SEGMENTS[0];
  const visible = SEGMENTS.filter((segment) => segment.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative w-44">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-ink-900/20 bg-white px-4 text-left text-sm font-semibold text-ink-900 outline-none focus:border-[#b8b8ff]"
      >
        {value ? selected.label : 'Segments'}
        <span className="text-ink-500">⌄</span>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-40 w-56 overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-lg">
          <label className="flex h-9 items-center gap-2 border-b border-ink-900/10 px-3 text-sm text-ink-500">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find..."
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-500"
            />
          </label>
          <div className="py-2">
            {visible.map((segment) => (
              <button
                key={segment.label}
                type="button"
                onClick={() => { onChange(segment.value); setOpen(false); setQuery(''); }}
                className={`block min-h-9 w-full cursor-pointer px-5 text-left text-sm hover:bg-[#eeeeee] ${value === segment.value ? 'font-semibold text-ink-900' : 'text-ink-600'}`}
              >
                {segment.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ManageTagsTab({ tags, onSelectTag }: { tags: Tag[]; onSelectTag: (tagId: string) => void }) {
  const create = useCreateTag();
  const update = useUpdateTag();
  const remove = useDeleteTag();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-[#2f2f2f] px-5 text-sm font-semibold text-white hover:bg-ink-900"
        >
          Add tag
        </button>
      </div>
      <section className="rounded-2xl border border-ink-900/10 bg-white shadow-sm">
        <div className="border-b border-ink-900/10 p-4">
          <label className="flex h-10 max-w-sm items-center gap-2 rounded-lg border border-ink-900/20 px-3 text-sm text-ink-500">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-500"
            />
          </label>
        </div>
        <div className="grid grid-cols-[1fr_160px_52px] border-b border-ink-900/10 bg-[#fafafa] px-4 py-4 text-sm font-medium text-ink-900">
          <span>Name ^</span>
          <span>Contacts</span>
          <span />
        </div>
        {filteredTags.length === 0 ? (
          <p className="p-10 text-center text-sm text-ink-500">No tags found.</p>
        ) : (
          filteredTags.map((tag) => (
            <div key={tag._id} className="relative grid grid-cols-[1fr_160px_52px] items-center border-b border-ink-900/10 px-4 py-5 text-sm last:border-b-0 hover:z-10 hover:bg-[#f7f7f7]">
              <p className="truncate font-medium text-ink-900">{tag.name}</p>
              <button
                type="button"
                onClick={() => onSelectTag(tag._id)}
                className="w-fit cursor-pointer text-left text-ink-900 underline-offset-2 hover:underline"
              >
                {tag.contactsCount ?? 0}
              </button>
              <TagRowMenu
                onEdit={() => setEditing(tag)}
                onDelete={() => {
                  if (confirm(`Delete tag "${tag.name}"?`)) remove.mutate(tag._id);
                }}
              />
            </div>
          ))
        )}
      </section>
      {showAdd && (
        <TagModal
          title="Add Contact Tag"
          onClose={() => setShowAdd(false)}
          onSave={(name) => create.mutate({ name }, { onSuccess: () => setShowAdd(false) })}
        />
      )}
      {editing && (
        <TagModal
          title="Edit Contact Tag"
          initialName={editing.name}
          onClose={() => setEditing(null)}
          onSave={(name) => update.mutate({ id: editing._id, data: { name } }, { onSuccess: () => setEditing(null) })}
        />
      )}
    </>
  );
}

function TagRowMenu({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="h-9 w-9 cursor-pointer rounded-full text-lg text-ink-700 hover:bg-[#eeeeee]"
        aria-label="Tag actions"
      >
        ...
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-[80] w-28 overflow-hidden rounded-lg border border-ink-900/10 bg-white py-1 text-sm shadow-lg">
          <button type="button" onClick={onEdit} className="block min-h-9 w-full cursor-pointer px-4 text-left text-ink-900 hover:bg-[#eeeeee]">Edit</button>
          <button type="button" onClick={onDelete} className="block min-h-9 w-full cursor-pointer px-4 text-left text-red-600 hover:bg-red-50">Delete</button>
        </div>
      )}
    </div>
  );
}

function TagModal({
  title,
  initialName = '',
  onClose,
  onSave,
}: {
  title: string;
  initialName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(initialName);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-[#242424]">{title}</h3>
          <button type="button" onClick={onClose} className="min-h-10 min-w-10 cursor-pointer text-2xl" aria-label="Close tag modal">×</button>
        </div>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-lg border border-[#d6d6d6] px-4 text-sm outline-none focus:border-[#8b8cf6]"
          autoFocus
        />
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="min-h-10 cursor-pointer rounded-full border border-[#d6d6d6] px-5 text-sm font-medium text-[#555]">Cancel</button>
          <button
            type="button"
            onClick={() => name.trim() && onSave(name.trim())}
            disabled={!name.trim()}
            className="min-h-10 cursor-pointer rounded-full bg-[#2f2f2f] px-5 text-sm font-semibold text-white disabled:cursor-default disabled:bg-[#eeeeee] disabled:text-[#aaa]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: 'Name A-Z', value: 'name_asc' },
  { label: 'Name Z-A', value: 'name_desc' },
  { label: 'Email A-Z', value: 'email_asc' },
  { label: 'Email Z-A', value: 'email_desc' },
  { label: 'Lifetime Value (most first)', value: 'lifetime_most' },
  { label: 'Lifetime Value (least first)', value: 'lifetime_least' },
  { label: 'Added date (oldest first)', value: 'added_oldest' },
  { label: 'Added date (newest first)', value: 'added_newest' },
  { label: 'Last activity (oldest first)', value: 'last_activity_oldest' },
  { label: 'Last activity (newest first)', value: 'last_activity_newest' },
];

function MenuSelect({
  value,
  options,
  onSelect,
  widthClass = 'w-40',
  menuAlign = 'left',
}: {
  value: string;
  options: Array<{ label: string; value: string; disabled?: boolean; destructive?: boolean }>;
  onSelect: (value: string) => void;
  widthClass?: string;
  menuAlign?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${widthClass}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-ink-900/20 bg-white px-4 text-sm font-medium text-ink-900 outline-none hover:border-ink-900 focus:border-[#b8b8ff]"
      >
        <span className="truncate">{value}</span>
        <span className="text-ink-500">⌄</span>
      </button>
      {open && (
        <div className={`absolute top-11 z-40 min-w-full overflow-hidden rounded-lg border border-ink-900/10 bg-white py-2 shadow-lg ${menuAlign === 'right' ? 'right-0' : 'left-0'}`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={option.disabled}
              onClick={() => {
                if (option.disabled) return;
                onSelect(option.value);
                setOpen(false);
              }}
              className={`block min-h-9 w-full cursor-pointer whitespace-nowrap px-4 text-left text-sm hover:bg-[#eeeeee] disabled:cursor-not-allowed disabled:text-ink-400 ${
                option.destructive ? 'text-red-600' : 'text-ink-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function BulkActionsDropdown() {
  const [open, setOpen] = useState(false);
  const sections = [
    {
      title: 'OFFERS',
      items: ['Grant offer', 'Revoke offer'],
    },
    {
      title: 'EMAILS',
      items: ['Subscribe to Email Sequence', 'Unsubscribe from Email Sequence'],
    },
    {
      title: 'EMAIL MARKETING CONSENT',
      items: ['Unsubscribe from all Email Marketing'],
    },
    {
      title: 'EVENTS',
      items: ['Register to Event', 'Deregister from Event'],
    },
    {
      title: 'TAGS',
      items: ['Add tag', 'Remove tag'],
    },
  ];

  return (
    <div className="relative -ml-2 w-56">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-[#b8b8ff] bg-white px-4 text-sm font-semibold text-ink-900 outline-none"
      >
        Bulk Actions
        <span className="text-ink-500">⌄</span>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-40 max-h-96 w-72 overflow-y-auto rounded-lg border border-ink-900/10 bg-white py-3 shadow-lg">
          {sections.map((section) => (
            <div key={section.title} className="px-3 pb-3">
              <p className="px-2 pb-2 text-[11px] font-bold text-ink-400">{section.title}</p>
              {section.items.map((item) => (
                <button key={item} type="button" className="block min-h-9 w-full cursor-pointer rounded-md px-3 text-left text-sm text-ink-900 hover:bg-[#eeeeee]">
                  {item}
                </button>
              ))}
            </div>
          ))}
          <div className="border-t border-ink-900/10 px-3 py-2">
            <button type="button" className="block min-h-9 w-full cursor-pointer rounded-md px-3 text-left text-sm text-ink-900 hover:bg-[#eeeeee]">Export</button>
            <button type="button" disabled className="block min-h-9 w-full cursor-not-allowed rounded-md px-3 text-left text-sm text-ink-400">Merge contacts</button>
          </div>
          <div className="border-t border-ink-900/10 px-3 pt-2">
            <button type="button" className="block min-h-9 w-full cursor-pointer rounded-md px-3 text-left text-sm text-red-600 hover:bg-red-50">Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
type FilterCategoryKey =
  | 'assessment'
  | 'contacts'
  | 'coupon'
  | 'customers'
  | 'customFields'
  | 'defaultFields'
  | 'emailActivity'
  | 'emailBroadcast'
  | 'emailEngagement'
  | 'emailSequence'
  | 'events'
  | 'forms'
  | 'lifetimeValue'
  | 'emailMarketing'
  | 'newsletter'
  | 'offers'
  | 'products'
  | 'tags';

type FilterValueType = 'none' | 'days' | 'list' | 'money' | 'text' | 'unavailable';

interface KajabiFilterCategory {
  key: FilterCategoryKey;
  label: string;
  icon: string;
  conditionals: string[];
  valueType: FilterValueType;
  unavailableText?: string;
  values?: string[];
}

const DAY_VALUES = ['7 Days', '15 Days', '30 Days', '60 Days', '90 Days', '365 days', 'All time'];
const CUSTOM_FIELD_VALUES = [
  '¿Tienes sociedades constituidas?',
  'Apellido Materno',
  'Apellido Paterno',
  'Cantidad de empleados',
  'Cargo',
  'Código de anfitrión (Tu RFC)',
  'Código de asesor',
  'Códigodel Asesor',
  'Cuenta clabe bancaria',
  'Giro de Negocio',
  'No. de cuenta',
  'Nombre de tu asesor comercial',
  'Nombre de tu asesor comercial:',
  'Nombre del banco',
  'Nombre(s)',
  'Régimen',
  'RFC (13 Caracteres)',
  'Tu pago de impuestos está entre:',
];
const DEFAULT_FIELD_CONDITIONALS = [
  'Name contains',
  'Email contains',
  'SMS Mobile Phone Number contains',
  'Address contains',
  'Address line 2 contains',
  'City contains',
  'State contains',
  'Country contains',
  'Postal code contains',
];
const COUPON_VALUES = ['ASESORIADD', 'DD20', 'Diego Diaz 20%', 'DD20 afiliados', 'Descuento', 'Descuento 20%', '20% descuento', 'SEMINARIO10'];
const FORM_VALUES = [
  '13 Enero - TU ESTRATEGIA FISCA...',
  '1 Abril 2025 - Holding',
  '28 de febrero de 2025 - CDMX',
  '3 Claves 48 Hrs - Form comp',
  '3 Claves 48 Hrs - Form simple',
  '7 FORMAS PARA COBRAR A TU E...',
  '90 días - 7 FORMAS PARA COBRA...',
  '90 días - EL ARTE DE LEVANTAR ...',
  'Anfitriones reg - este no',
  'APRENDE LOS HÁBITOS DE ROCK...',
];
const ASSESSMENT_VALUES = ['INTELIGENCIA FINANCIERA'];

function KajabiFiltersPanel({ tags }: { tags: Tag[] }) {
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const { data: eventsData } = useEvents({ limit: 200 });
  const courses = coursesData?.data ?? [];
  const events = eventsData?.data ?? [];
  const [categoryKey, setCategoryKey] = useState<FilterCategoryKey>('contacts');
  const [conditional, setConditional] = useState('');
  const [value, setValue] = useState('');

  const categories: KajabiFilterCategory[] = [
    { key: 'assessment', label: 'Assessment', icon: '◎', conditionals: ['Completed', 'Passed', 'Failed'], valueType: 'list', values: ASSESSMENT_VALUES },
    { key: 'contacts', label: 'Contacts', icon: '♙', conditionals: ['Contact was added', 'Contact was not added', 'Is hidden'], valueType: 'days' },
    { key: 'coupon', label: 'Coupon', icon: '◌', conditionals: ['Coupon used'], valueType: 'list', values: COUPON_VALUES },
    { key: 'customers', label: 'Customers', icon: '♙', conditionals: ['Customer was active', 'Customer was not active', 'Customer joined in last', 'Is Customer'], valueType: 'days' },
    { key: 'customFields', label: 'Custom Fields', icon: '▣', conditionals: CUSTOM_FIELD_VALUES, valueType: 'text' },
    { key: 'defaultFields', label: 'Default Fields', icon: '▤', conditionals: DEFAULT_FIELD_CONDITIONALS, valueType: 'text' },
    {
      key: 'emailActivity',
      label: 'Email Activity',
      icon: '▥',
      conditionals: ['Was delivered', 'Was not sent', 'Was opened', 'Was not opened', 'Was clicked', 'Was not clicked', 'Hard bounced delivery in last 365 days'],
      valueType: 'none',
    },
    { key: 'emailBroadcast', label: 'Email Broadcast', icon: '▱', conditionals: [], valueType: 'unavailable', unavailableText: 'No Email Broadcast available' },
    { key: 'emailEngagement', label: 'Email Engagement', icon: '✉', conditionals: ['Healthy Contacts', 'Passive Contacts', 'Unengaged Contacts', 'Inactive Contacts'], valueType: 'none' },
    { key: 'emailSequence', label: 'Email Sequence', icon: '◷', conditionals: ['Subscribed to', 'Not subscribed to'], valueType: 'unavailable', unavailableText: 'No Email Sequence available' },
    { key: 'events', label: 'Events', icon: '□', conditionals: ['Registered to', 'Not registered to'], valueType: 'list', values: events.map((event) => event.title) },
    { key: 'forms', label: 'Forms', icon: '▯', conditionals: ['Submitted', 'Not submitted'], valueType: 'list', values: FORM_VALUES },
    { key: 'lifetimeValue', label: 'Lifetime Value', icon: '$', conditionals: ['Greater than', 'Less than', 'Equal to'], valueType: 'money' },
    {
      key: 'emailMarketing',
      label: 'Email Marketing',
      icon: '▢',
      conditionals: ['Subscribed', 'Never subscribed', 'Unsubscribed', 'Manually unsubscribed', 'Opted out', 'Hard bounced', 'Marked spam'],
      valueType: 'days',
    },
    { key: 'newsletter', label: 'Newsletter', icon: '▱', conditionals: ['Subscribed to', 'Not subscribed to'], valueType: 'unavailable', unavailableText: 'No Newsletter available' },
    { key: 'offers', label: 'Offers', icon: '◇', conditionals: ['Owns', 'Does not own', 'Previously owned', 'Canceling'], valueType: 'list', values: courses.map((course) => course.title) },
    { key: 'products', label: 'Products', icon: '⬡', conditionals: ['Has', 'Does not have', 'Previously owned'], valueType: 'list', values: courses.map((course) => course.title) },
    { key: 'tags', label: 'Tags', icon: '#', conditionals: ['Has any', 'Has all', 'Does not have'], valueType: 'list', values: tags.map((tag) => tag.name) },
  ];
  const category = categories.find((item) => item.key === categoryKey) ?? categories[1];
  const hasConditionals = category.conditionals.length > 0;

  const setCategory = (next: FilterCategoryKey) => {
    setCategoryKey(next);
    setConditional('');
    setValue('');
  };

  return (
    <div className="relative z-10 mb-6 w-full max-w-[640px] rounded-xl border border-ink-900/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-900">Filtering by:</p>
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-ink-900/30 text-xs text-ink-500">?</span>
      </div>
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_28px]">
        <select
          value={categoryKey}
          onChange={(event) => setCategory(event.target.value as FilterCategoryKey)}
          className="h-10 cursor-pointer rounded-lg border border-[#b8b8ff] bg-white px-4 text-sm text-ink-900 outline-none"
        >
          {categories.map((item) => <option key={item.key} value={item.key}>{item.icon} {item.label}</option>)}
        </select>
        <select
          value={conditional}
          onChange={(event) => { setConditional(event.target.value); setValue(''); }}
          disabled={!hasConditionals}
          className="h-10 cursor-pointer rounded-lg border border-ink-900/15 bg-white px-4 text-sm text-ink-700 outline-none disabled:cursor-not-allowed disabled:text-ink-300"
        >
          <option value="">Conditional...</option>
          {category.conditionals.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <KajabiFilterValueInput category={category} value={value} onChange={setValue} />
        <button type="button" className="h-10 cursor-pointer text-red-500 hover:text-red-700" aria-label="Eliminar filtro">⌫</button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button type="button" className="min-h-10 cursor-pointer text-sm font-medium text-ink-500 hover:text-ink-900">+ Add filter</button>
        <button type="button" className="min-h-10 cursor-pointer px-3 text-sm font-semibold text-ink-500 hover:text-ink-900">Apply Filters</button>
      </div>
    </div>
  );
}

function KajabiFilterValueInput({
  category,
  value,
  onChange,
}: {
  category: KajabiFilterCategory;
  value: string;
  onChange: (value: string) => void;
}) {
  if (category.valueType === 'unavailable') {
    return (
      <div className="flex h-10 items-center justify-center rounded-lg border border-ink-900/10 bg-white px-3 text-xs font-medium text-red-500">
        {category.unavailableText}
      </div>
    );
  }

  if (category.valueType === 'none') {
    return (
      <select disabled className="h-10 cursor-not-allowed rounded-lg border border-ink-900/10 bg-white px-4 text-sm text-ink-300 outline-none">
        <option>Value...</option>
      </select>
    );
  }

  if (category.valueType === 'money') {
    return (
      <label className="flex h-10 items-center rounded-lg border border-ink-900/15 bg-white focus-within:border-[#b8b8ff]">
        <span className="px-3 text-sm text-ink-600">$</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="decimal"
          className="h-full min-w-0 flex-1 bg-transparent text-sm outline-none"
        />
        <span className="px-3 text-xs text-ink-500">USD</span>
      </label>
    );
  }

  if (category.valueType === 'text') {
    return (
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Value..."
        className="h-10 rounded-lg border border-ink-900/15 bg-white px-4 text-sm text-ink-900 outline-none placeholder:text-ink-500 focus:border-[#b8b8ff]"
      />
    );
  }

  const options = category.valueType === 'days' ? DAY_VALUES : category.values ?? [];
  return (
    <FilterSearchSelect
      value={value}
      onChange={onChange}
      placeholder="Value..."
      options={options}
      searchable={category.valueType === 'list'}
    />
  );
}

function FilterSearchSelect({
  value,
  onChange,
  placeholder,
  options,
  searchable,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const filtered = options.filter((option) => option.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-lg border border-ink-900/15 bg-white px-4 text-left text-sm text-ink-900 outline-none focus:border-[#b8b8ff]"
      >
        <span className={value ? 'truncate' : 'text-ink-500'}>{value || placeholder}</span>
        <span className="text-ink-500">⌄</span>
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-30 w-full min-w-56 overflow-hidden rounded-lg border border-ink-900/10 bg-white shadow-lg">
          {searchable && (
            <label className="flex h-9 items-center gap-2 border-b border-ink-900/10 px-3 text-sm text-ink-500">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Find..."
                className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-ink-500"
              />
            </label>
          )}
          <div className="max-h-72 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-ink-500">No options available</p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => { onChange(option); setOpen(false); setQuery(''); }}
                  className={`block min-h-9 w-full cursor-pointer truncate px-4 text-left text-sm hover:bg-[#eeeeee] ${value === option ? 'bg-[#eeeeee]' : ''}`}
                >
                  {searchable && <span className="mr-2 inline-block h-3 w-3 rounded border border-ink-900/20 align-middle" />}
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
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
function ImportContactsModal({ onClose }: { onClose: () => void }) {
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const importMutation = useImportContacts();
  const [fileName, setFileName] = useState('');
  const [contacts, setContacts] = useState<ImportContactInput[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ImportContactsResult | null>(null);
  const [error, setError] = useState('');

  const mappedCount = products.filter((product) => mappings[product]).length;
  const customersCount = contacts.filter((contact) => contact.products.length > 0).length;

  useEffect(() => {
    if (!products.length || !courses.length) return;
    setMappings((current) => {
      const suggestions = autoMapProducts(products, courses);
      return Object.fromEntries(products.map((product) => [product, current[product] || suggestions[product] || '']));
    });
  }, [courses, products]);

  const loadFile = async (file: File) => {
    setError('');
    setResult(null);
    setFileName(file.name);
    try {
      const rows = await readContactsFile(file);
      const parsed = rows.map(mapKajabiRow).filter((row): row is ImportContactInput => Boolean(row?.email));
      const productNames = Array.from(new Set(parsed.flatMap((row) => row.products))).sort((a, b) => a.localeCompare(b, 'es'));

      setContacts(parsed);
      setProducts(productNames);
      setMappings(autoMapProducts(productNames, courses));
      if (!parsed.length) setError('No encontré contactos con email en el archivo.');
    } catch (err) {
      setContacts([]);
      setProducts([]);
      setMappings({});
      setError(err instanceof Error ? err.message : 'No se pudo leer el archivo.');
    }
  };

  const submitImport = () => {
    const productMappings = Object.fromEntries(
      Object.entries(mappings)
        .filter(([, courseId]) => Boolean(courseId))
        .map(([product, courseId]) => [product, [courseId]]),
    );

    importMutation.mutate(
      { contacts, productMappings },
      { onSuccess: (data) => setResult(data) },
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-ink-900/40 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-cream border border-ink-900/20 shadow-xl" style={{ animation: 'paper-unfold 320ms ease-out both' }}>
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-ink-900/15 bg-cream px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-ink-500 mb-2">Importación Kajabi</p>
            <h3 className="font-serif text-3xl text-ink-900 leading-none">Importar contactos</h3>
            <p className="mt-2 max-w-2xl text-sm text-ink-600">
              Sube tu archivo CSV, XLS o XLSX. Los productos de Kajabi se usarán para segmentar y otorgar acceso a cursos.
            </p>
          </div>
          <button onClick={onClose} className="min-h-11 min-w-11 cursor-pointer text-2xl text-ink-500 hover:text-ink-900" aria-label="Cerrar importación">×</button>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="space-y-4">
            <label htmlFor="contacts-import-file" className="block cursor-pointer border border-dashed border-ink-900/30 bg-cream-100 p-6 transition-colors hover:border-ink-900">
              <span className="block text-[10px] uppercase tracking-[0.32em] text-ink-500">Archivo de contactos</span>
              <span className="mt-3 block font-serif text-2xl text-ink-900">{fileName || 'Seleccionar archivo'}</span>
              <span className="mt-2 block text-sm text-ink-600">Formatos permitidos: .csv, .xls, .xlsx</span>
              <input
                id="contacts-import-file"
                type="file"
                accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void loadFile(file);
                }}
              />
            </label>

            {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <div className="grid grid-cols-3 border border-ink-900/15 bg-cream-100 text-center">
              {[
                ['Contactos', contacts.length],
                ['Clientes', customersCount],
                ['Productos', products.length],
              ].map(([label, value]) => (
                <div key={label} className="border-r border-ink-900/10 px-3 py-4 last:border-r-0">
                  <p className="font-serif text-3xl text-ink-900">{value}</p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-ink-500">{label}</p>
                </div>
              ))}
            </div>

            {contacts.length > 0 && (
              <div className="border border-ink-900/15 bg-cream-100">
                <div className="border-b border-ink-900/10 px-4 py-3 text-[10px] uppercase tracking-[0.28em] text-ink-500">
                  Vista previa
                </div>
                <div className="max-h-56 overflow-y-auto divide-y divide-ink-900/10">
                  {contacts.slice(0, 8).map((contact) => (
                    <div key={contact.email} className="px-4 py-3">
                      <p className="text-sm font-semibold text-ink-900">{contact.name}</p>
                      <p className="text-xs text-ink-600">{contact.email}</p>
                      <p className="mt-1 text-[11px] text-ink-500">{contact.products.join(', ') || 'Sin producto'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.32em] text-ink-500">Mapeo de accesos</p>
                <h4 className="font-serif text-2xl text-ink-900">Productos Kajabi → cursos</h4>
              </div>
              <p className="text-xs text-ink-500">{mappedCount} de {products.length} mapeados</p>
            </div>

            <div className="max-h-[360px] overflow-y-auto border border-ink-900/15 bg-cream-100">
              {products.length === 0 ? (
                <p className="p-8 text-center text-sm text-ink-500">Carga un archivo para ver productos.</p>
              ) : (
                products.map((product) => (
                  <div key={product} className="grid gap-3 border-b border-ink-900/10 p-4 last:border-b-0 md:grid-cols-[1fr_1fr] md:items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-900">{product}</p>
                      <p className="text-xs text-ink-500">Se creará etiqueta de segmento para este producto.</p>
                    </div>
                    <select
                      value={mappings[product] ?? ''}
                      onChange={(e) => setMappings((current) => ({ ...current, [product]: e.target.value }))}
                      className="ink-input cursor-pointer text-sm"
                    >
                      <option value="">Sin curso asociado</option>
                      {courses.map((course) => (
                        <option key={course._id || course.id} value={String(course._id || course.id)}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              )}
            </div>

            {result && (
              <div className="border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <p className="font-semibold">Importación completada</p>
                <p className="mt-1">
                  {result.summary.created} creados, {result.summary.updated} actualizados, {result.summary.skipped} omitidos.
                </p>
                {result.results.some((row) => row.tempPassword) && (
                  <button
                    type="button"
                    onClick={() => downloadImportCredentials(result)}
                    className="mt-3 min-h-11 cursor-pointer border border-emerald-700 px-4 text-[10px] uppercase tracking-[0.24em] text-emerald-900 hover:bg-emerald-100"
                  >
                    Descargar accesos
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-ink-900/15 pt-4">
              <button type="button" onClick={onClose} className="min-h-11 cursor-pointer border border-ink-900/20 px-5 text-[10px] uppercase tracking-[0.28em] hover:border-ink-900">
                Cerrar
              </button>
              <button
                type="button"
                onClick={submitImport}
                disabled={contacts.length === 0 || importMutation.isPending}
                className="btn-broadsheet disabled:opacity-50"
              >
                {importMutation.isPending ? 'Importando...' : 'Importar contactos'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────
function AddContactModal({ onClose }: { onClose: () => void }) {
  const create = useAdminCreateUser();
  const { data: tags = [] } = useTags();
  const { data: coursesData } = useCourses({ includeAll: true, limit: 200 } as any);
  const courses = coursesData?.data ?? [];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [grantOffers, setGrantOffers] = useState(false);
  const [addTags, setAddTags] = useState(false);
  const [subscribeMarketing, setSubscribeMarketing] = useState(false);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const name = `${firstName} ${lastName}`.trim();
  const canSave = Boolean(name && email);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-6">
      <div className="w-full max-w-[560px] rounded-2xl bg-white p-6 shadow-2xl" style={{ animation: 'paper-unfold 260ms ease-out both' }}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-semibold text-[#242424]">New Contact</h3>
          <button type="button" onClick={onClose} className="min-h-11 min-w-11 cursor-pointer text-2xl text-[#242424]" aria-label="Close new contact">×</button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!canSave) return;
            create.mutate({
              name,
              email,
              role: 'user',
              courseIds: grantOffers ? selectedCourseIds : [],
              tagIds: addTags ? selectedTagIds : [],
              marketingStatus: subscribeMarketing ? 'subscribed' : 'never_subscribed',
            }, { onSuccess: onClose });
          }}
          className="space-y-5"
        >
          <div>
            <label htmlFor="new-contact-first" className="mb-2 block text-sm font-semibold text-[#242424]">First Name</label>
            <input
              id="new-contact-first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="h-11 w-full rounded-lg border border-[#d6d6d6] bg-white px-4 text-sm outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#8b8cf6]"
            />
          </div>
          <div>
            <label htmlFor="new-contact-last" className="mb-2 block text-sm font-semibold text-[#242424]">Last Name</label>
            <input
              id="new-contact-last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="h-11 w-full rounded-lg border border-[#d6d6d6] bg-white px-4 text-sm outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#8b8cf6]"
            />
          </div>
          <div>
            <label htmlFor="new-contact-email" className="mb-2 block text-sm font-semibold text-[#242424]">Email</label>
            <input
              id="new-contact-email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="h-11 w-full rounded-lg border border-[#d6d6d6] bg-white px-4 text-sm outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#8b8cf6]"
            />
          </div>

          <div className="space-y-4 rounded-2xl border border-ink-900/5 bg-white p-5 shadow-sm">
            <KajabiToggle checked={grantOffers} onChange={setGrantOffers} label="Grant offers" />
            {grantOffers && (
              <KajabiPicker
                label="Select offers"
                searchLabel="Find..."
                items={courses.map((course) => ({ id: String(course._id || course.id), label: course.title }))}
                selectedIds={selectedCourseIds}
                onChange={setSelectedCourseIds}
              />
            )}

            <KajabiToggle checked={addTags} onChange={setAddTags} label="Add tags" />
            {addTags && (
              <KajabiPicker
                label="Select tags"
                searchLabel="Type to search or add tags..."
                items={tags.map((tag) => ({ id: tag._id, label: tag.name }))}
                selectedIds={selectedTagIds}
                onChange={setSelectedTagIds}
              />
            )}

            <KajabiToggle checked={subscribeMarketing} onChange={setSubscribeMarketing} label="Subscribe to marketing emails" />
          </div>

          <div className="flex justify-end gap-3 pt-1">
            <button type="button" onClick={onClose} className="min-h-11 cursor-pointer rounded-full border border-[#d6d6d6] px-5 text-sm font-medium text-[#555] hover:border-[#9f9f9f]">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSave || create.isPending}
              className="min-h-11 cursor-pointer rounded-full bg-[#242424] px-6 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-default disabled:bg-[#eeeeee] disabled:text-[#aaa]"
            >
              {create.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function KajabiToggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-3 text-sm text-[#242424]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border-[#cfcfcf] accent-[#7977f2]"
      />
      {label}
    </label>
  );
}

function KajabiPicker({
  label,
  searchLabel,
  items,
  selectedIds,
  onChange,
}: {
  label: string;
  searchLabel: string;
  items: Array<{ id: string; label: string }>;
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState('');
  const visibleItems = items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  };

  return (
    <div className="pl-6">
      <div className="rounded-lg border border-[#b8b8ff] bg-white">
        <button type="button" className="flex h-11 w-full cursor-pointer items-center justify-between px-4 text-left text-sm text-[#242424]">
          <span>{selectedIds.length ? `${selectedIds.length} selected` : label}</span>
          <span className="text-lg text-[#555]">⌄</span>
        </button>
        <div className="border-t border-[#e5e5e5]">
          <label className="flex h-9 items-center gap-2 border-b border-[#e5e5e5] px-4 text-sm text-[#777]">
            <span>⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchLabel}
              className="h-full flex-1 bg-transparent outline-none placeholder:text-[#777]"
            />
          </label>
          <div className="max-h-60 overflow-y-auto py-2">
            {visibleItems.length === 0 ? (
              <p className="px-4 py-3 text-sm text-[#777]">No options available</p>
            ) : (
              visibleItems.map((item) => (
                <label key={item.id} className="flex min-h-9 cursor-pointer items-center gap-3 px-4 text-sm text-[#242424] hover:bg-[#f1f1f1]">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggle(item.id)}
                    className="h-4 w-4 cursor-pointer rounded border-[#cfcfcf] accent-[#7977f2]"
                  />
                  <span className="truncate">{item.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

type ContactRow = Record<string, string | number | undefined>;

async function readContactsFile(file: File): Promise<ContactRow[]> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'xls' || ext === 'xlsx') {
    const XLSX = await import('xlsx');
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    return XLSX.utils.sheet_to_json<ContactRow>(sheet, { defval: '' });
  }

  const text = await file.text();
  return parseCsv(text);
}

function parseCsv(text: string): ContactRow[] {
  const rows: string[][] = [];
  let current = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(current);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      current = '';
      continue;
    }

    current += char;
  }

  row.push(current);
  if (row.some((cell) => cell.trim())) rows.push(row);

  const [headers = [], ...body] = rows;
  return body.map((cells) =>
    Object.fromEntries(headers.map((header, index) => [header.trim(), cells[index]?.trim() ?? ''])),
  );
}

function mapKajabiRow(row: ContactRow): ImportContactInput | null {
  const email = valueOf(row, ['Email', 'Email (email)', 'email']).toLowerCase();
  if (!email) return null;

  const name =
    valueOf(row, ['Name', 'Nombre completo (name)', 'Nombre completo']) ||
    [valueOf(row, ['First Name', 'Nombre(s) (custom_11)']), valueOf(row, ['Last Name'])].filter(Boolean).join(' ') ||
    email.split('@')[0];

  return {
    name,
    email,
    phone: valueOf(row, ['Teléfono (phone_number)', 'Mobile Phone Number (mobile_phone_number)', 'phone']),
    products: splitList(valueOf(row, ['Products', 'Producto', 'Productos'])),
    tags: splitList(valueOf(row, ['Tags', 'Etiquetas'])),
    createdAt: parseKajabiDate(valueOf(row, ['Created At', 'Member Created At'])),
    lastLogin: parseKajabiDate(valueOf(row, ['Last Sign In At', 'Last Activity'])),
    signInCount: Number(valueOf(row, ['Sign In Count']) || 0),
    sourceId: valueOf(row, ['ID', 'Member ID', 'External User ID']),
  };
}

function valueOf(row: ContactRow, keys: string[]): string {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim()) return String(value).trim();
  }
  return '';
}

function splitList(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/\s*(?:\||;|,)\s*/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function parseKajabiDate(value: string): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function normalizeMatch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function autoMapProducts(products: string[], courses: Course[]): Record<string, string> {
  return Object.fromEntries(
    products.map((product) => {
      const normalizedProduct = normalizeMatch(product);
      const match = courses.find((course) => {
        const normalizedTitle = normalizeMatch(course.title);
        return normalizedTitle === normalizedProduct ||
          normalizedTitle.includes(normalizedProduct) ||
          normalizedProduct.includes(normalizedTitle);
      });
      return [product, match ? String(match._id || match.id) : ''];
    }),
  );
}

function downloadImportCredentials(result: ImportContactsResult) {
  const rows = [
    ['Nombre', 'Email', 'Contraseña temporal', 'Productos', 'Estado'],
    ...result.results
      .filter((row) => row.tempPassword)
      .map((row) => [row.name, row.email, row.tempPassword ?? '', row.products.join(' | '), row.status]),
  ];

  const csv = rows.map((row) => row.map(escapeCsvCell).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'accesos-contactos-kajabi.csv';
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(value: string): string {
  const safe = value ?? '';
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}
