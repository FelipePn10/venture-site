import { getLeads, getContacts, getSchedules } from '@/lib/storage';
import Link from 'next/link';

function fmt(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function fmtDay(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
}

export default function AdminPage({ searchParams }: { searchParams: { key?: string } }) {
  const adminKey = process.env.ADMIN_KEY || 'venture2025';
  const authorized = searchParams.key === adminKey;

  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm rounded-2xl border border-line bg-paper p-8">
          <h1 className="font-serif text-3xl text-ink">Painel Admin</h1>
          <p className="mt-2 text-sm text-muted">Acesse com a chave de administrador.</p>
          <form className="mt-6" action="" method="get">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Chave de acesso</span>
              <input
                name="key"
                type="password"
                placeholder="Digite a chave"
                className="mt-1.5 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-ink focus:border-moss-700 focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full rounded-full bg-moss-800 py-2.5 text-sm text-bg transition hover:bg-moss-900"
            >
              Entrar
            </button>
          </form>
          <p className="mt-4 text-center text-[11px] text-muted">
            Acesso restrito. Defina uma chave forte na variável de ambiente{' '}
            <code className="font-mono">ADMIN_KEY</code>.
          </p>
        </div>
      </div>
    );
  }

  const leads = getLeads().reverse();
  const contacts = getContacts().reverse();
  const schedules = getSchedules()
    .slice()
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

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
          <div className="flex gap-3 text-sm text-muted">
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{schedules.length}</strong> demos agendadas
            </span>
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{leads.length}</strong> leads
            </span>
            <span className="rounded-full border border-line bg-paper px-4 py-1.5">
              <strong className="text-ink">{contacts.length}</strong> mensagens
            </span>
          </div>
        </div>

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

        {/* Leads */}
        <div className="mt-10">
          <h2 className="font-serif text-2xl text-ink">Leads — Pedidos de Demo</h2>
          {leads.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Nenhum lead ainda. Quando alguém preencher o formulário, aparecerá aqui.</p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Empresa</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Tamanho</th>
                    <th className="px-4 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l, i) => (
                    <tr key={l.id} className={`border-b border-line/60 ${i % 2 === 0 ? 'bg-bg' : 'bg-paper/40'}`}>
                      <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${l.email}`} className="text-moss-700 hover:underline">{l.email}</a>
                      </td>
                      <td className="px-4 py-3 text-ink">{l.company || '—'}</td>
                      <td className="px-4 py-3">
                        {l.phone ? (
                          <a href={`tel:${l.phone}`} className="text-moss-700 hover:underline">{l.phone}</a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-muted">{l.size || '—'}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-muted">{fmt(l.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        <div className="mt-16 rounded-xl border border-line bg-paper p-5 text-[12px] text-muted">
          <strong className="text-ink">Como configurar notificações por e-mail:</strong> Crie um arquivo <code className="font-mono">.env.local</code> com{' '}
          <code className="font-mono">SMTP_HOST</code>, <code className="font-mono">SMTP_USER</code>, <code className="font-mono">SMTP_PASS</code> e{' '}
          <code className="font-mono">NOTIFICATION_EMAIL</code>. Veja <code className="font-mono">.env.local.example</code> para referência.
        </div>
      </div>
    </div>
  );
}
