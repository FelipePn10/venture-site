import { getLeads, getContacts, getSchedules, type Lead, type Contact, type Schedule } from '@/lib/storage';
import { isAdminAuthed, adminConfigured } from '@/lib/auth';
import { AdminLogin, AdminLogout } from '@/components/AdminLogin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmt(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function fmtDay(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

function Tag({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[12px] ${
        accent ? 'border-moss-200 bg-moss-50 text-moss-800' : 'border-line bg-bg text-muted'
      }`}
    >
      {children}
    </span>
  );
}

export default async function AdminPage() {
  if (!isAdminAuthed()) {
    return <AdminLogin configured={adminConfigured()} />;
  }

  const [leadsR, contactsR, schedulesR] = await Promise.allSettled([
    getLeads(),
    getContacts(),
    getSchedules(),
  ]);

  const errMsg = (r: PromiseRejectedResult) =>
    r.reason instanceof Error ? r.reason.message : 'Falha ao carregar.';

  const leads: Lead[] = leadsR.status === 'fulfilled' ? leadsR.value.reverse() : [];
  const contacts: Contact[] = contactsR.status === 'fulfilled' ? contactsR.value.reverse() : [];
  const schedules: Schedule[] =
    schedulesR.status === 'fulfilled'
      ? schedulesR.value.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      : [];

  const loadErrors = [
    leadsR.status === 'rejected' ? `Leads — ${errMsg(leadsR)}` : null,
    contactsR.status === 'rejected' ? `Mensagens — ${errMsg(contactsR)}` : null,
    schedulesR.status === 'rejected' ? `Agendamentos — ${errMsg(schedulesR)}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-bg px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700 hover:underline">
              ← Voltar ao site
            </Link>
            <h1 className="mt-2 font-serif text-4xl text-ink">Painel de Leads</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{schedules.length}</strong> demos agendadas
            </span>
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{leads.length}</strong> leads
            </span>
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{contacts.length}</strong> mensagens
            </span>
            <AdminLogout />
          </div>
        </div>

        {loadErrors.length > 0 && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-red-700">
            <strong>Falha ao carregar parte dos dados.</strong>
            <ul className="mt-2 list-disc pl-5">
              {loadErrors.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="mt-2 text-[12px]">
              Em geral é transitório (cache de schema da Supabase logo após criar tabelas) — recarregue em alguns segundos.
              Persistindo, verifique <code className="font-mono">SUPABASE_URL</code> e{' '}
              <code className="font-mono">SUPABASE_SECRET_KEY</code>.
            </p>
          </div>
        )}

        {/* Demonstrações agendadas */}
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Demonstrações Agendadas</h2>
          {schedules.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhuma demo agendada ainda. Quando alguém agendar em /agendar, aparecerá aqui.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <th className="px-4 py-3">Quando</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Setor</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Porte</th>
                    <th className="px-4 py-3">Sistema atual</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s, i) => (
                    <tr key={s.id} className={`border-b border-line/60 ${i % 2 === 0 ? 'bg-bg' : 'bg-paper/40'}`}>
                      <td className="px-4 py-3 font-medium text-ink">
                        <span className="capitalize">{fmtDay(s.date)}</span> · {s.time}
                      </td>
                      <td className="px-4 py-3 text-ink">{s.company || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-line bg-bg px-2.5 py-0.5 font-mono text-[10px] text-moss-700">{s.segment}</span>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${s.email}`} className="text-moss-700 hover:underline">{s.name}</a>
                        {s.phone && (
                          <a href={`https://wa.me/${s.phone.replace(/\D/g, '')}`} className="ml-2 text-[11px] text-muted hover:text-moss-700">{s.phone}</a>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">{s.size || '—'}</td>
                      <td className="px-4 py-3 text-muted">{s.current || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Leads — com toda a qualificação coletada no formulário */}
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-ink">Leads — Formulário & Diagnóstico</h2>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhum lead ainda. Quando alguém preencher o formulário, aparecerá aqui.</p>
          ) : (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {leads.map((l) => {
                const utmPairs = Object.entries(l.utm || {}).filter(([, v]) => v);
                return (
                  <div key={l.id} className="rounded-2xl border border-line bg-paper p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="font-medium text-ink">{l.name}</span>
                        {l.role && <span className="ml-2 text-[13px] text-muted">· {l.role}</span>}
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px]">
                          <a href={`mailto:${l.email}`} className="text-moss-700 hover:underline">{l.email}</a>
                          {l.phone && (
                            <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} className="text-muted hover:text-moss-700">{l.phone}</a>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-muted">{fmt(l.createdAt)}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {l.company && <Tag>{l.company}</Tag>}
                      {l.segment && <Tag accent>{l.segment}</Tag>}
                      {l.size && <Tag>{l.size}</Tag>}
                      {l.system && <Tag>Usa: {l.system}</Tag>}
                      {l.timeline && <Tag>Prazo: {l.timeline}</Tag>}
                    </div>

                    {l.challenges.length > 0 && (
                      <div className="mt-3">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">Dores</span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {l.challenges.map((c) => (
                            <span key={c} className="rounded-full bg-mustard-50 px-2.5 py-0.5 text-[12px] text-moss-800">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {l.message && (
                      <p className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-bg px-3 py-2 text-[13px] leading-relaxed text-muted">{l.message}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                      {l.source && <span className="font-mono">origem: {l.source}</span>}
                      {utmPairs.length > 0 && (
                        <span className="font-mono">{utmPairs.map(([k, v]) => `${k.replace('utm_', '')}=${v}`).join(' · ')}</span>
                      )}
                      <a
                        href={`mailto:${l.email}`}
                        className="ml-auto rounded-full border border-line bg-bg px-3 py-1 text-ink transition hover:border-moss-700 hover:text-moss-700"
                      >
                        Responder
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Contacts */}
        <div className="mt-14">
          <h2 className="font-serif text-2xl text-ink">Mensagens de Contato</h2>
          {contacts.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhuma mensagem ainda.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="font-medium text-ink">{c.name}</span>
                      <a href={`mailto:${c.email}`} className="ml-2 text-moss-700 hover:underline">{c.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-line bg-bg px-2.5 py-0.5 font-mono text-[10px] text-muted">{c.subject}</span>
                      <span className="font-mono text-[11px] text-muted">{fmt(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-muted">{c.message}</p>
                  <a
                    href={`mailto:${c.email}?subject=Re: ${encodeURIComponent(c.subject)}`}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-4 py-1.5 text-[12px] text-ink transition hover:border-moss-700 hover:text-moss-700"
                  >
                    Responder por e-mail
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
