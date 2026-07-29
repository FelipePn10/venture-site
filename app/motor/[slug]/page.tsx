import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { IconArrow, IconCheck } from '@/components/Icons';
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';
import { motores, NAV_MOTORES } from '@/lib/motores';

/**
 * Página de um motor de cálculo.
 *
 * Difere da página de módulo de propósito: módulo responde "o que está
 * incluso", motor responde "como o sistema decide". Por isso a estrutura é
 * entrada → passos → saída, e não uma lista de recursos. Sem KPI numérico —
 * nenhum desses cálculos tem número medido em cliente (ver política de claims).
 */

export const generateStaticParams = () =>
  Object.keys(motores).map((slug) => ({ slug }));

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const m = motores[params.slug];
  if (!m) return { title: 'Motor de cálculo' };

  // O template do layout ("%s · VentureERP") já põe o sufixo da marca.
  const clean = m.title.replace(/\.$/, '');
  const description = m.question;
  const url = `${SITE_URL}/motor/${params.slug}`;

  return {
    title: clean,
    description,
    keywords: [clean, m.nav, ...m.entra.slice(0, 4), 'ERP para metalúrgica', 'ERP para moveleira'],
    alternates: { canonical: `/motor/${params.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: `${clean} · VentureERP`,
      description,
      siteName: 'VentureERP',
      locale: 'pt_BR',
    },
    twitter: { card: 'summary_large_image', title: `${clean} · VentureERP`, description },
  };
}

export default function MotorPage({ params }: { params: { slug: string } }) {
  const m = motores[params.slug];
  if (!m) notFound();

  const clean = m.title.replace(/\.$/, '');
  const outros = NAV_MOTORES.filter((o) => o.href !== `/motor/${params.slug}`);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', path: '/' },
          { name: 'Motores de cálculo', path: '/#diferenciais' },
          { name: clean, path: `/motor/${params.slug}` },
        ]}
      />

      <header className="sticky top-0 z-30 border-b border-line bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          {/* Não há índice de motores: a grade "os outros motores" no rodapé faz esse papel. */}
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← Início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· motor de cálculo
        </span>
        <h1 className="mt-3 font-serif text-6xl leading-[1] tracking-tightest md:text-7xl">
          {m.title.replace(/\.$/, '')}
          <span style={{ color: '#CBAB1F' }}>.</span>
        </h1>

        <p className="mt-8 max-w-3xl font-serif text-[26px] leading-snug text-ink md:text-[32px]">
          {m.question}
        </p>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-muted">{m.body}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bg transition hover:bg-moss-900"
          >
            Agendar demonstração
            <IconArrow size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/diagnostico"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm transition hover:border-ink/50"
          >
            Diagnóstico gratuito
          </Link>
        </div>

        {/* Entrada → decisão → saída: o esqueleto que diferencia esta página da de módulo. */}
        <section className="mt-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
            ·· como ele decide
          </p>
          <h2 className="mt-3 max-w-3xl font-serif text-4xl leading-tight md:text-5xl">
            Passo a passo, sem caixa fechada.
          </h2>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {m.passos.map(([t, d], i) => (
              <li key={t} className="bg-bg p-8">
                <span className="font-mono text-[11px] tracking-[0.16em] text-moss-700">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 font-serif text-2xl leading-tight text-ink">{t}</h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/*
          O exemplo é o que faz o visitante entender de verdade — ele acompanha a
          conta linha a linha e chega sozinho na conclusão. Vem logo depois dos
          passos, enquanto o raciocínio ainda está fresco.
        */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-line bg-paper">
          <div className="grid gap-10 p-8 md:grid-cols-[1fr_1.05fr] md:p-12">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
                ·· um exemplo
              </p>
              <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-4xl">
                {m.exemplo.titulo}
              </h2>
              <ol className="mt-8 space-y-4">
                {m.exemplo.passos.map((p, i) => (
                  <li key={p} className="flex gap-4">
                    <span className="mt-0.5 font-mono text-[11px] tracking-[0.14em] text-moss-700">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[15.5px] leading-relaxed text-ink/85">{p}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-line bg-bg p-8 md:p-10">
              <span className="h-1 w-10 bg-mustard-400" />
              {/* Texto de fecho ficou longo de propósito — o tamanho recua para não virar parede. */}
              <p className="mt-6 font-serif text-[20px] leading-[1.4] text-ink md:text-[23px]">
                {m.exemplo.fecho}
              </p>
              <p className="mt-8 border-t border-line pt-5 text-[12.5px] leading-relaxed text-muted">
                Exemplo ilustrativo para mostrar o raciocínio do cálculo. Os
                números são inventados para a explicação — não são resultado
                medido em cliente.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              O que o cálculo leva em conta
            </h2>
            <ul className="mt-6 space-y-3 text-[15.5px]">
              {m.entra.map((e) => (
                <li key={e} className="flex items-start gap-3 border-b border-line/60 pb-3">
                  <IconCheck size={18} className="mt-1 shrink-0 text-moss-700" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">O que você recebe</h2>
            <ul className="mt-6 space-y-3 text-[15.5px]">
              {m.saida.map((s) => (
                <li key={s} className="flex items-start gap-3 border-b border-line/60 pb-3">
                  <span className="mt-2.5 h-1 w-3 shrink-0 bg-mustard-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/*
          A camada profunda. Fica depois de exemplo/entrada/saída de propósito:
          quem chega aqui já entendeu o motor e agora está avaliando o produto,
          então vale detalhe que assustaria no topo da página.
        */}
        <section className="mt-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
            ·· por dentro
          </p>
          <div className="mt-3 grid items-end gap-6 md:grid-cols-[1.1fr_1fr]">
            <h2 className="max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
              Tudo o que esse cálculo faz.
            </h2>
            <p className="text-[16px] leading-relaxed text-muted md:pl-8">
              Todo ERP diz que tem esse cálculo — a diferença nunca esteve no
              nome. Ela aparece nos casos difíceis: a mesma peça usada em cinco
              produtos ao mesmo tempo, o feriado no meio da semana planejada, a
              regra que só a sua fábrica tem. É isso que está aberto abaixo.
            </p>
          </div>

          <div className="mt-14">
            {m.detalhes.map(({ grupo, itens }, i) => (
              <div
                key={grupo}
                className={`grid gap-6 border-t border-line py-10 md:grid-cols-[minmax(0,17rem)_1fr] md:gap-12 ${
                  i === m.detalhes.length - 1 ? 'border-b' : ''
                }`}
              >
                <div className="md:sticky md:top-24 md:self-start">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-moss-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 font-serif text-2xl leading-tight text-ink md:text-[28px]">
                    {grupo}
                  </h3>
                </div>
                <ul className="space-y-4">
                  {itens.map((it) => (
                    <li key={it} className="flex gap-3.5 text-[15.5px] leading-relaxed text-ink/85">
                      <span className="mt-2.5 h-1 w-3 shrink-0 bg-mustard-400" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-8 text-[13.5px] leading-relaxed text-muted">
            Falta alguma coisa que a sua fábrica faz de um jeito próprio?{' '}
            <Link
              href="/diagnostico"
              className="text-moss-700 underline decoration-moss-200 underline-offset-4 transition hover:decoration-moss-700"
            >
              Descreva no diagnóstico
            </Link>{' '}
            — o que a operação de um cliente precisa entra na fila de desenvolvimento.
          </p>
        </section>

        <section className="mt-20 rounded-3xl border border-line bg-paper p-8 md:p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
            ·· não roda sozinho
          </p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
            De onde vêm os dados e para onde vai o resultado.
          </h2>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
            {m.conn.map((c) => (
              <li key={c} className="bg-bg p-6 text-[15px] leading-snug">
                {c}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
            ·· os outros motores
          </p>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {outros.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group bg-bg p-6 transition hover:bg-paper"
              >
                <p className="font-serif text-xl leading-tight text-ink">{o.label}</p>
                <p className="mt-2 text-[13.5px] leading-snug text-muted">{o.hint}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-moss-700">
                  Ver
                  <IconArrow size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-moss-900 p-10 text-bg md:p-12">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
              Quer ver <em className="text-mustard-300">esse cálculo</em> rodando com os números da sua fábrica?
            </h2>
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3 text-[14px] text-moss-900 transition hover:bg-mustard-400"
            >
              Agendar demo
              <IconArrow size={14} />
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
