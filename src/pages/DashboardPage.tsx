import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Inbox, Mail, Plus, Search, Send, Trash2, Users, X } from 'lucide-react';
import { Client, EXAMPLE_CLIENTS } from '../data/siteData';
import { getStoredInquiries, Inquiry } from '../utils/forms';
import { Link } from '../utils/router';
import { Logo } from '../components/Logo';
import { buttonClass, Choice, Field, inputClass } from '../components/ui';
import { opts, Select } from '../components/Select';

const STORE = 'an_clients';
const TYPES = ['Buyer', 'Seller', 'Buyer & Seller', 'Past client'] as const;
const FILTERS = ['All', ...TYPES] as const;

function loadClients(): Client[] {
  try {
    const saved = localStorage.getItem(STORE);
    return saved ? JSON.parse(saved) : EXAMPLE_CLIENTS;
  } catch {
    return EXAMPLE_CLIENTS;
  }
}

/**
 * Private client manager: keep a contact list and email a group in one go.
 * Data is stored in this browser. A hosted CRM (e.g. Follow Up Boss, or a
 * WordPress CRM plugin) can replace this once the site is live.
 */
export function DashboardPage() {
  const [clients, setClients] = useState<Client[]>(loadClients);
  const [inquiries] = useState<Inquiry[]>(getStoredInquiries);
  const [tab, setTab] = useState<'clients' | 'inbox'>('clients');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All');
  const [selected, setSelected] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ name: '', email: '', phone: '', notes: '', type: 'Buyer' as Client['type'] });
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('Hi {first name},\n\n');

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(clients));
    } catch {
      /* ignore */
    }
  }, [clients]);

  const visible = useMemo(
    () =>
      clients.filter(
        (c) =>
          (filter === 'All' || c.type === filter) &&
          `${c.name} ${c.email} ${c.notes}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [clients, filter, query],
  );

  const recipients = clients.filter((c) => selected.includes(c.id));
  const allVisibleSelected = visible.length > 0 && visible.every((c) => selected.includes(c.id));

  const toggleAll = () =>
    setSelected((s) =>
      allVisibleSelected ? s.filter((id) => !visible.some((c) => c.id === id)) : [...new Set([...s, ...visible.map((c) => c.id)])],
    );

  const addClient = (e: React.FormEvent) => {
    e.preventDefault();
    setClients((c) => [{ ...draft, id: `c${Date.now()}`, added: new Date().toISOString().slice(0, 10) }, ...c]);
    setDraft({ name: '', email: '', phone: '', notes: '', type: 'Buyer' });
    setAdding(false);
  };

  const sendHref = () => {
    const text = body.replace(/\{first name\}/g, recipients.length === 1 ? recipients[0].name.split(' ')[0] : 'there');
    return `mailto:?bcc=${encodeURIComponent(recipients.map((r) => r.email).join(','))}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-30 border-b border-stone bg-paper/90 backdrop-blur">
        <div className="wrap flex h-16 items-center justify-between">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Back to site
          </Link>
        </div>
      </header>

      <main className="wrap py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-medium tracking-[-0.03em]">Clients</h1>
            <p className="mt-1 text-muted">Keep your contacts in one place and message a group at once.</p>
          </div>
          <div className="inline-flex rounded-full bg-white p-1 shadow-sm">
            {[
              { k: 'clients' as const, l: `Clients (${clients.length})`, Icon: Users },
              { k: 'inbox' as const, l: `Website inquiries (${inquiries.length})`, Icon: Inbox },
            ].map(({ k, l, Icon }) => (
              <button
                key={k}
                type="button"
                onClick={() => setTab(k)}
                className={`flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium ${tab === k ? 'bg-ink text-white' : 'text-muted'}`}
              >
                <Icon className="h-4 w-4" /> {l}
              </button>
            ))}
          </div>
        </div>

        {tab === 'inbox' ? (
          <div className="mt-8 space-y-3">
            {inquiries.length === 0 && (
              <p className="rounded-2xl bg-white p-8 text-center text-muted">No inquiries yet. Form submissions from the website will appear here.</p>
            )}
            {inquiries.map((q) => (
              <div key={q.id} className="rounded-2xl bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{q.source}</p>
                  <p className="text-sm text-muted">{new Date(q.receivedAt).toLocaleString()}</p>
                </div>
                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {Object.entries(q.fields)
                    .filter(([, v]) => v)
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <dt className="capitalize text-muted">{k}:</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="rounded-3xl bg-white p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <span className="sr-only">Search clients</span>
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, email or notes" className={`${inputClass} pl-10`} />
                </label>
                <button type="button" onClick={() => setAdding(true)} className={buttonClass('dark')}>
                  <Plus className="h-4 w-4" /> Add client
                </button>
              </div>
              <div className="mt-4">
                <Choice options={FILTERS} value={filter} onChange={setFilter} name="Client type" />
              </div>

              {adding && (
                <form onSubmit={addClient} className="mt-6 grid gap-4 rounded-2xl bg-sand p-5 sm:grid-cols-2">
                  <div className="flex items-center justify-between sm:col-span-2">
                    <p className="font-medium">New client</p>
                    <button type="button" onClick={() => setAdding(false)} aria-label="Cancel">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <Field label="Name">
                    <input required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Email">
                    <input required type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputClass} />
                  </Field>
                  <Field label="Phone">
                    <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className={inputClass} />
                  </Field>
                  <div>
                    <span className="mb-2 block text-sm font-medium text-ink">Type</span>
                    <Select label="Client type" value={draft.type} onChange={(v) => setDraft({ ...draft, type: v as Client['type'] })} options={opts([...TYPES])} />
                  </div>
                  <Field label="Notes" className="sm:col-span-2">
                    <input value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className={inputClass} />
                  </Field>
                  <button type="submit" className={buttonClass('dark', 'sm:col-span-2 sm:justify-self-start')}>
                    Save client
                  </button>
                </form>
              )}

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="text-muted">
                    <tr className="border-b border-stone">
                      <th className="w-10 py-3">
                        <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} aria-label="Select all" className="h-4 w-4 accent-ink" />
                      </th>
                      <th className="py-3 font-medium">Name</th>
                      <th className="py-3 font-medium">Type</th>
                      <th className="py-3 font-medium">Notes</th>
                      <th className="py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((c) => (
                      <tr key={c.id} className="border-b border-stone/70">
                        <td className="py-4">
                          <input
                            type="checkbox"
                            checked={selected.includes(c.id)}
                            onChange={() => setSelected((s) => (s.includes(c.id) ? s.filter((i) => i !== c.id) : [...s, c.id]))}
                            aria-label={`Select ${c.name}`}
                            className="h-4 w-4 accent-ink"
                          />
                        </td>
                        <td className="py-4">
                          <p className="font-medium">{c.name}</p>
                          <p className="text-muted">{c.email}</p>
                        </td>
                        <td className="py-4">
                          <span className="rounded-full bg-sand px-2.5 py-1 text-xs font-medium">{c.type}</span>
                        </td>
                        <td className="max-w-[260px] py-4 text-muted">{c.notes}</td>
                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setClients((all) => all.filter((x) => x.id !== c.id));
                              setSelected((s) => s.filter((i) => i !== c.id));
                            }}
                            aria-label={`Delete ${c.name}`}
                            className="rounded-full p-2 text-muted hover:bg-sand hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {visible.length === 0 && <p className="py-10 text-center text-muted">No clients found.</p>}
              </div>
            </div>

            <aside className="h-fit rounded-3xl bg-ink p-6 text-white lg:sticky lg:top-24">
              <p className="flex items-center gap-2 font-medium">
                <Mail className="h-4 w-4" /> Message clients
              </p>
              <p className="mt-1 text-sm text-white/60">
                {recipients.length ? `${recipients.length} selected` : 'Select clients from the list.'}
              </p>
              <div className="mt-5 space-y-3">
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="h-12 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-[15px] placeholder:text-white/40 focus:border-white focus:outline-none"
                />
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full resize-none rounded-xl border border-white/15 bg-white/5 p-4 text-[15px] placeholder:text-white/40 focus:border-white focus:outline-none"
                />
              </div>
              <a
                href={recipients.length ? sendHref() : undefined}
                aria-disabled={!recipients.length}
                className={buttonClass('light', `mt-4 w-full ${recipients.length ? '' : 'pointer-events-none opacity-40'}`)}
              >
                <Send className="h-4 w-4" /> Open in email app
              </a>
              <p className="mt-3 text-xs leading-relaxed text-white/40">
                Opens your email app with everyone in BCC so clients don’t see each other’s addresses.
              </p>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
