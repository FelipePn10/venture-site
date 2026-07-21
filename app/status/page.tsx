import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata = { title: 'Status · VentureERP' };

// O status precisa refletir o estado atual, não uma versão em cache.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const BACKEND_URL = process.env.BACKEND_HEALTH_URL || 'http://localhost:5070';

type Health = 'up' | 'down' | 'unknown';

type Component = {
  name: string;
  detail: string;
  state: Health;
};

async function probe(path: string, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, {
      cache: 'no-store',
      signal: controller.signal,
    });
    const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    return { ok: res.ok, body };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function readStatus(): Promise<Component[]> {
  const [live, ready] = await Promise.all([probe('/health/live'), probe('/health/ready')]);

  const api: Health = live === null ? 'unknown' : live.ok ? 'up' : 'down';

  // A readiness só reporta o banco quando a própria API responde. Se a API está
  // inalcançável não sabemos o estado do banco — e dizer "up" seria inventar.
  let database: Health = 'unknown';
  if (ready !== null) {
    database = ready.body?.database === 'up' ? 'up' : 'down';
  }

  return [
    {
      name: 'API · core-api',
      detail: 'Serviço que responde às requisições do sistema',
      state: api,
    },
    {
      name: 'Banco de dados',
      detail: 'Conexão verificada a cada consulta a esta página',
      state: database,
    },
  ];
}

const LABEL: Record<Health, string> = {
  up: 'operacional',
  down: 'fora do ar',
  unknown: 'indisponível',
};

const DOT: Record<Health, string> = {
  up: 'bg-moss-500',
  down: 'bg-red-500',
  unknown: 'bg-mustard-400',
};

const TEXT: Record<Health, string> = {
  up: 'text-moss-700',
  down: 'text-red-600',
  unknown: 'text-mustard-500',
};

export default async function StatusPage() {
  const components = await readStatus();
  const checkedAt = new Date();

  const overall: Health = components.some((c) => c.state === 'down')
    ? 'down'
    : components.some((c) => c.state === 'unknown')
      ? 'unknown'
      : 'up';

  const headline =
    overall === 'up'
      ? 'Tudo operacional'
      : overall === 'down'
        ? 'Instabilidade detectada'
        : 'Não foi possível verificar';

  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← Voltar para o site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-3">
          <span className={`relative grid h-3 w-3 place-items-center rounded-full ${DOT[overall]}`}>
            {overall === 'up' && (
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-moss-500 opacity-60" />
            )}
          </span>
          <span className={`font-mono text-[11px] uppercase tracking-[0.2em] ${TEXT[overall]}`}>
            {LABEL[overall]}
          </span>
        </div>

        <h1 className="mt-4 font-serif text-6xl leading-[1] tracking-tight">{headline}</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Verificação feita agora, direto nos serviços do VentureERP. Esta página consulta o
          sistema a cada carregamento — não mostra um valor salvo.
        </p>

        <div className="mt-12 grid gap-3 rounded-2xl border border-line bg-paper p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
            <span className="font-serif text-2xl">Componentes</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
              verificado às{' '}
              {checkedAt.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Sao_Paulo',
              })}{' '}
              (Brasília)
            </span>
          </div>

          {components.map((c) => (
            <div
              key={c.name}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-line/60 py-4 last:border-0"
            >
              <div className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[c.state]}`} />
                <span>
                  <span className="block text-[15px] text-ink">{c.name}</span>
                  <span className="mt-0.5 block text-[13px] text-muted">{c.detail}</span>
                </span>
              </div>
              <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${TEXT[c.state]}`}>
                {LABEL[c.state]}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-6">
          <p className="font-serif text-2xl">Histórico</p>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-muted">
            Ainda não publicamos histórico de disponibilidade nem registro de incidentes. Estamos
            montando o monitoramento contínuo — quando houver medição acumulada, o histórico de 90
            dias aparece aqui. Enquanto isso, esta página mostra apenas o estado atual, que é o que
            conseguimos verificar de fato.
          </p>
          <p className="mt-4 text-[14px] text-muted">
            Problema em produção?{' '}
            <a
              href="mailto:contato@venturerp.com"
              className="text-moss-700 underline-offset-2 hover:underline"
            >
              contato@venturerp.com
            </a>
          </p>
        </div>
      </main>

      <footer className="border-t border-line bg-paper py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-[12px] text-muted">
          <span>© 2026 VentureERP Tecnologia S.A.</span>
          <span className="flex gap-5">
            <Link href="/">Site</Link>
            <Link href="/privacidade" className="hover:text-moss-700">
              Privacidade
            </Link>
            <Link href="/termos" className="hover:text-moss-700">
              Termos
            </Link>
          </span>
        </div>
      </footer>
    </>
  );
}
