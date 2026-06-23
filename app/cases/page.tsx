import Link from 'next/link';
import { Logo } from '@/components/Logo';

export const metadata = { title: 'Case Tecnofer · VentureERP' };

const metrics: { n: string; l: string }[] = [
  { n: '−19%', l: 'de desperdício de matéria-prima' },
  { n: '+22%', l: 'de performance na fabricação' },
  { n: '37%', l: 'dos processos manuais automatizados' },
];

const before: [string, string][] = [
  ['Antes', 'Planilhas soltas e sistemas legados que não conversavam entre si.'],
  ['Antes', 'Ordens de produção dependiam de retrabalho manual a cada etapa.'],
  ['Antes', 'Matéria-prima se perdia sem ninguém medir quanta chapa virava sobra.'],
];

const after: [string, string][] = [
  ['Depois', 'Orçamento ligado ao chão de fábrica em um sistema só.'],
  ['Depois', 'Ordens de produção reorganizadas e acompanhadas em tempo real.'],
  ['Depois', 'Consumo de material medido — desperdício caiu e a margem subiu.'],
];

export default function CasesPage() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-ink">← Voltar</Link>
        </div>
      </header>

      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-24">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· case</span>
        <h1 className="mt-3 max-w-3xl font-serif text-7xl leading-[1] tracking-tightest">
          Uma metalúrgica de verdade. <em className="text-moss-700">Resultados de verdade.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] text-muted">
          Como a Tecnofer trocou a planilha e os sistemas legados pelo VentureERP — e o que mudou no chão de fábrica.
          Números informados pelo próprio cliente.
        </p>
      </section>

      {/* Case em destaque */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <article className="overflow-hidden rounded-3xl border border-line bg-paper">
          {/* Cabeçalho do case */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line px-8 py-7 md:px-12">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-moss-700 font-serif text-2xl text-bg">
                TF
              </span>
              <div>
                <p className="font-serif text-3xl leading-none text-ink">Tecnofer</p>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  Indústria metalúrgica · 50 colaboradores
                </p>
              </div>
            </div>
            <span className="rounded-full bg-mustard-300 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-moss-900">
              cliente VentureERP
            </span>
          </div>

          {/* Métricas */}
          <div className="grid gap-px border-b border-line bg-line md:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.l} className="bg-bg p-8 text-center md:text-left">
                <p className="font-serif text-6xl leading-none tracking-tightest text-ink">{m.n}</p>
                <p className="mt-3 text-[14px] leading-snug text-muted">{m.l}</p>
              </div>
            ))}
          </div>

          {/* Narrativa + citação */}
          <div className="grid gap-10 px-8 py-10 md:grid-cols-[1.2fr_1fr] md:px-12 md:py-12">
            <div>
              <h2 className="font-serif text-3xl leading-tight text-ink">
                Da planilha ao chão de fábrica no controle.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-muted">
                A Tecnofer tocava a produção entre planilhas soltas e sistemas legados que não conversavam entre si.
                Cada ordem de produção dependia de retrabalho manual, e a matéria-prima se perdia no caminho — sem
                ninguém enxergar quanta chapa virava sobra.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">
                Com o VentureERP, a fábrica reorganizou as ordens de produção, ligou o orçamento ao chão de fábrica e
                automatizou as rotinas que viviam em planilha. O desperdício de matéria-prima caiu 19%, a performance de
                fabricação subiu 22% e mais de um terço dos processos manuais virou automático.
              </p>

              <blockquote className="mt-7 border-l-2 border-mustard-400 pl-5 font-serif text-2xl leading-snug italic text-ink">
                "Saímos das planilhas e dos sistemas legados e botamos a fábrica no controle. A produção ficou
                organizada, a matéria-prima rende mais e o que era trabalho manual virou processo automático."
              </blockquote>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                Rulian · Diretor, Tecnofer
              </p>
            </div>

            {/* Antes / Depois */}
            <div className="space-y-3">
              {before.map(([, txt], i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line bg-bg p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted">Antes</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink/70">{txt}</p>
                  </div>
                  <div className="rounded-xl border border-moss-200 bg-moss-50 p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-moss-700">Depois</p>
                    <p className="mt-1.5 text-[13px] leading-snug text-ink">{after[i][1]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
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
