import { getLeads, getContacts, type Lead, type Contact } from '@/lib/storage';
import {
  getHubSpotContacts,
  getHubSpotMeetings,
  type CrmContact,
  type CrmMeeting,
} from '@/lib/hubspot';
import { isAdminAuthed, adminConfigured } from '@/lib/auth';
import { AdminLogin, AdminLogout } from '@/components/AdminLogin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function fmt(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

/** Data/hora de reunião no fuso de Brasília, a partir de um ISO em UTC. */
function fmtMeeting(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo',
  });
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

function SectionTitle({ children, count }: { children: React.ReactNode; count?: number }) {
  return (
    <div className="flex items-baseline gap-3">
      <h2 className="font-serif text-2xl text-ink">{children}</h2>
      {count !== undefined && (
        <span className="font-mono text-[12px] text-muted">{count}</span>
      )}
    </div>
  );
}

export default async function AdminPage() {
  if (!isAdminAuthed()) {
    return <AdminLogin configured={adminConfigured()} />;
  }

  const [leadsR, contactsR, meetingsR, crmR] = await Promise.allSettled([
    getLeads(),
    getContacts(),
    getHubSpotMeetings(100),
    getHubSpotContacts(100),
  ]);

  const errMsg = (r: PromiseRejectedResult) =>
    r.reason instanceof Error ? r.reason.message : 'Falha ao carregar.';

  const leads: Lead[] = leadsR.status === 'fulfilled' ? leadsR.value.slice().reverse() : [];
  const contacts: Contact[] = contactsR.status === 'fulfilled' ? contactsR.value.slice().reverse() : [];
  const meetings: CrmMeeting[] = meetingsR.status === 'fulfilled' ? meetingsR.value : [];
  const crmContacts: CrmContact[] = crmR.status === 'fulfilled' ? crmR.value : [];

  const loadErrors = [
    leadsR.status === 'rejected' ? `Leads (Supabase) — ${errMsg(leadsR)}` : null,
    contactsR.status === 'rejected' ? `Mensagens (Supabase) — ${errMsg(contactsR)}` : null,
    meetingsR.status === 'rejected' ? `Reuniões (HubSpot) — ${errMsg(meetingsR)}` : null,
    crmR.status === 'rejected' ? `Contatos (HubSpot) — ${errMsg(crmR)}` : null,
  ].filter(Boolean) as string[];

  const stats = [
    ['reuniões', meetings.length],
    ['leads do site', leads.length],
    ['contatos no CRM', crmContacts.length],
    ['mensagens', contacts.length],
  ] as const;

  return (
    <div className="min-h-screen bg-bg px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Cabeçalho */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700 hover:underline"
            >
              ← Voltar ao site
            </Link>
            <h1 className="mt-2 font-serif text-4xl text-ink">Painel</h1>
          </div>
          <AdminLogout />
        </div>

        {/* Resumo */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map(([label, n]) => (
            <div key={label} className="rounded-2xl border border-line bg-paper px-5 py-4">
              <p className="font-serif text-3xl text-ink">{n}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>

        {loadErrors.length > 0 && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[13px] text-red-700">
            <strong>Parte dos dados não carregou.</strong>
            <ul className="mt-2 list-disc pl-5">
              {loadErrors.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="mt-2 text-[12px]">
              Costuma ser transitório. Persistindo, confira as variáveis do Supabase
              (<code className="font-mono">SUPABASE_SECRET_KEY</code>) e do HubSpot
              (<code className="font-mono">HUBSPOT_PRIVATE_APP_TOKEN</code>).
            </p>
          </div>
        )}

        {/* Reuniões agendadas (HubSpot) */}
        <div className="mt-12">
          <SectionTitle count={meetings.length}>Demonstrações Agendadas</SectionTitle>
          <p className="mt-1 text-[13px] text-muted">Reuniões marcadas pelo calendário do HubSpot.</p>
          {meetings.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Nenhuma reunião agendada ainda. Quando alguém marcar em /agendar, aparece aqui.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <th className="px-4 py-3">Quando</th>
                    <th className="px-4 py-3">Título</th>
                    <th className="px-4 py-3">Contato</th>
                    <th className="px-4 py-3">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((m, i) => (
                    <tr key={m.id} className={`border-b border-line/60 ${i % 2 === 0 ? 'bg-bg' : 'bg-paper/40'}`}>
                      <td className="whitespace-nowrap px-4 py-3 font-medium capitalize text-ink">
                        {fmtMeeting(m.start)}
                      </td>
                      <td className="px-4 py-3 text-muted">{m.title}</td>
                      <td className="px-4 py-3">
                        {m.contacts.length === 0
                          ? '—'
                          : m.contacts.map((c) => (
                              <a
                                key={c.email || c.name}
                                href={c.email ? `mailto:${c.email}` : undefined}
                                className="mr-2 text-moss-700 hover:underline"
                              >
                                {c.name}
                              </a>
                            ))}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full border border-line bg-bg px-2.5 py-0.5 font-mono text-[10px] text-muted">
                          {m.outcome || 'agendada'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Leads do site (Supabase) — com toda a qualificação */}
        <div className="mt-12">
          <SectionTitle count={leads.length}>Leads do Site</SectionTitle>
          <p className="mt-1 text-[13px] text-muted">Formulário e diagnóstico preenchidos no site.</p>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              Nenhum lead ainda. Quando alguém preencher o formulário, aparece aqui.
            </p>
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
                          <a href={`mailto:${l.email}`} className="text-moss-700 hover:underline">
                            {l.email}
                          </a>
                          {l.phone && (
                            <a
                              href={`https://wa.me/${l.phone.replace(/\D/g, '')}`}
                              className="text-muted hover:text-moss-700"
                            >
                              {l.phone}
                            </a>
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
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                          Dores
                        </span>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {l.challenges.map((c) => (
                            <span
                              key={c}
                              className="rounded-full bg-mustard-50 px-2.5 py-0.5 text-[12px] text-moss-800"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {l.message && (
                      <p className="mt-3 whitespace-pre-wrap rounded-lg border border-line bg-bg px-3 py-2 text-[13px] leading-relaxed text-muted">
                        {l.message}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                      {l.source && <span className="font-mono">origem: {l.source}</span>}
                      {utmPairs.length > 0 && (
                        <span className="font-mono">
                          {utmPairs.map(([k, v]) => `${k.replace('utm_', '')}=${v}`).join(' · ')}
                        </span>
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

        {/* Contatos no CRM (HubSpot) */}
        <div className="mt-12">
          <SectionTitle count={crmContacts.length}>Contatos no CRM</SectionTitle>
          <p className="mt-1 text-[13px] text-muted">
            Todos os contatos do HubSpot — inclui quem agendou reunião e quem preencheu o site.
          </p>
          {crmContacts.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhum contato no CRM ainda.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Cargo</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Criado</th>
                  </tr>
                </thead>
                <tbody>
                  {crmContacts.map((c, i) => (
                    <tr key={c.id} className={`border-b border-line/60 ${i % 2 === 0 ? 'bg-bg' : 'bg-paper/40'}`}>
                      <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                      <td className="px-4 py-3">
                        {c.email ? (
                          <a href={`mailto:${c.email}`} className="text-moss-700 hover:underline">
                            {c.email}
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink">{c.company || '—'}</td>
                      <td className="px-4 py-3 text-muted">{c.jobtitle || '—'}</td>
                      <td className="px-4 py-3 text-muted">{c.phone || '—'}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-[11px] text-muted">
                        {fmt(c.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mensagens de contato (Supabase) */}
        <div className="mt-12 pb-8">
          <SectionTitle count={contacts.length}>Mensagens de Contato</SectionTitle>
          {contacts.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhuma mensagem ainda.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {contacts.map((c) => (
                <div key={c.id} className="rounded-2xl border border-line bg-paper p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="font-medium text-ink">{c.name}</span>
                      <a href={`mailto:${c.email}`} className="ml-2 text-moss-700 hover:underline">
                        {c.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border border-line bg-bg px-2.5 py-0.5 font-mono text-[10px] text-muted">
                        {c.subject}
                      </span>
                      <span className="font-mono text-[11px] text-muted">{fmt(c.createdAt)}</span>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-[14px] leading-relaxed text-muted">
                    {c.message}
                  </p>
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
