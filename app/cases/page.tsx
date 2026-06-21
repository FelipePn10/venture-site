import Link from 'next/link';
import { Logo } from '@/components/Logo';

type Case = {
  badge: string;
  title: string;
  italic: string;
  body: string;
  quote: string;
  author: string;
  kpis: [string, string][];
  flip?: boolean;
};

const cases: Case[] = [
  {
    badge: 'metalúrgica · 140 colaboradores',
    title: 'Metalúrgica Aço Forte: ',
    italic: 'orçar no custo certo.',
    body: 'Fabricante de estruturas metálicas que orçava no Excel, no feeling do encarregado. Peça complexa demorava horas para precificar — e nem sempre cobria o custo real de corte, dobra e solda. Em 35 dias, a ficha técnica passou a calcular o preço sozinha. A margem que era 8% subiu para 19%, vendendo o mesmo volume.',
    quote: 'Parei de orçar no chute. O preço sai com o custo real de chapa, dobra e solda — e a margem dobrou.',
    author: 'Marcos Ferraz · Diretor, Metalúrgica Aço Forte',
    kpis: [['8% → 19%', 'margem média por peça'], ['2,8×', 'mais rápido para orçar'], ['100%', 'Bloco K e SPED em dia']]
  },
  {
    badge: 'moveleira · fábrica + 3 lojas',
    title: 'Móveis Bertotti: ',
    italic: 'a sobra de MDF que virou móvel.',
    body: 'Marcenaria de móveis planejados que perdia chapa de MDF em cada projeto cortado no olho. A sobra batia 11% — caminhão de retalho indo para a caçamba todo mês. Com o plano de corte automático, o aproveitamento disparou e a sobra caiu para 4%. O módulo se pagou no primeiro trimestre.',
    quote: 'O plano de corte sozinho pagou o sistema. É chapa que antes virava lixo e agora vira móvel vendido.',
    author: 'Cláudia Bertotti · Sócia, Móveis Bertotti',
    kpis: [['11% → 4%', 'sobra de MDF'], ['+22%', 'margem por projeto'], ['1 trimestre', 'para o módulo se pagar']],
    flip: true
  },
  {
    badge: 'metalúrgica · 2 plantas',
    title: 'Inox Sul: ',
    italic: 'o prazo que deixou de ser aposta.',
    body: 'Duas plantas, dezenas de ordens de produção simultâneas e nenhuma visibilidade de chão de fábrica. Quando o cliente ligava, ninguém sabia em que máquina estava o pedido. Com apontamento por coletor e painel de OEE, cada OP passou a ter status em tempo real — e o gargalo aparece antes de estourar o prazo.',
    quote: 'Agora abro o painel e vejo todas as OPs e o gargalo na hora. O prazo de entrega deixou de ser aposta.',
    author: 'Rafael Nunes · Gerente de Produção, Inox Sul',
    kpis: [['Tempo real', 'status de cada OP'], ['−27%', 'atraso de entrega'], ['OEE', 'visível por máquina e turno']]
  }
];

export const metadata = { title: 'Cases · VentureERP' };

export default function CasesPage() {
  return (
    <>
      <header className="border-b border-line bg-bg/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-ink">← Voltar</Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· cases</span>
        <h1 className="mt-3 max-w-3xl font-serif text-7xl leading-[1] tracking-tightest">
          Histórias reais. <em className="text-moss-700">Mudanças mensuráveis.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] text-muted">
          Empresas que trocaram o ERP — e o jeito de operar — com a VentureERP. Métricas auditadas pelo cliente.
        </p>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-6 pb-24">
        {cases.map((c, i) => (
          <article key={i} className={`grid gap-10 rounded-3xl border border-line p-10 ${c.flip ? 'md:grid-cols-[1fr_1.2fr]' : 'md:grid-cols-[1.2fr_1fr]'} ${i % 2 === 0 ? 'bg-paper' : 'bg-bg'}`}>
            {c.flip && <KpiCard kpis={c.kpis} />}
            <div>
              <span className="rounded-full bg-moss-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bg">{c.badge}</span>
              <h2 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight">
                {c.title}<em className="text-moss-700">{c.italic}</em>
              </h2>
              <p className="mt-5 text-[16px] text-muted">{c.body}</p>
              <blockquote className="mt-6 border-l-2 border-mustard-400 pl-5 font-serif text-2xl leading-snug italic text-ink">
                "{c.quote}"
              </blockquote>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{c.author}</p>
            </div>
            {!c.flip && <KpiCard kpis={c.kpis} />}
          </article>
        ))}
      </section>

      <section className="bg-moss-900 py-20 text-bg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6">
          <h3 className="font-serif text-5xl leading-tight">Pronto para virar o próximo case?</h3>
          <Link href="/agendar" className="inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3 text-[14px] text-moss-900 transition hover:bg-mustard-400">
            Agendar demonstração →
          </Link>
        </div>
      </section>
    </>
  );
}

function KpiCard({ kpis }: { kpis: [string, string][] }) {
  return (
    <div className="rounded-2xl border border-line bg-bg p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">resultados · 12 meses</p>
      <div className="mt-5 space-y-6">
        {kpis.map(([n, l]) => (
          <div key={l} className="border-b border-line pb-5 last:border-0 last:pb-0">
            <p className="font-serif text-6xl leading-none tracking-tightest">{n}</p>
            <p className="mt-2 text-[14px] text-muted">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
