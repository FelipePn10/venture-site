import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { IconCheck } from '@/components/Icons';
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd';
import { SITE_URL } from '@/lib/site';

type Module = {
  title: string;
  body: string;
  feats: string[];
  conn: string[];
  kpis: [string, string][];
};

const modules: Record<string, Module> = {
  engenharia: {
    title: 'Engenharia & Ficha Técnica.',
    body: 'Estrutura de produto (BOM) multinível, roteiro de produção e tempos por operação. A mesma ficha técnica alimenta o orçamento, a compra de material e o chão de fábrica — sem cadastrar nada duas vezes.',
    feats: ['Ficha técnica (BOM) multinível', 'Roteiro de produção por operação', 'Tempos-padrão por etapa', 'Variações e produtos configuráveis', 'Versionamento de engenharia', 'Cálculo de peso e consumo de material', 'Anexos de desenho e DXF'],
    conn: ['Orçamento → preço puxado da ficha técnica', 'Plano de corte → consumo de chapa/MDF', 'PCP → roteiro vira ordem de produção', 'Compras → necessidade de matéria-prima'],
    kpis: [['1 clique', 'da ficha ao orçamento'], ['Zero', 'recadastro de produto'], ['Multinível', 'estrutura de produto']]
  },
  corte: {
    title: 'Plano de Corte & Aproveitamento.',
    body: 'Nesting automático de chapa de aço e MDF que reduz a sobra. Veja o aproveitamento de cada placa antes de cortar e pare de jogar matéria-prima na caçamba.',
    feats: ['Nesting automático de chapa e MDF', 'Aproveitamento por plano de corte', 'Cálculo de fita de borda e ferragens', 'Controle de retalho aproveitável', 'Otimização por espessura e cor', 'Geração de etiqueta de peça', 'Exportação para máquina de corte'],
    conn: ['Engenharia → consumo da ficha técnica', 'Estoque → baixa de chapa e retorno de retalho', 'PCP → corte vira etapa da OP', 'Custos → matéria-prima real por peça'],
    kpis: [['Menos sobra', 'de MDF e chapa'], ['+ peças', 'na mesma matéria-prima', ], ['Antes de cortar', 'você vê o aproveitamento']]
  },
  pcp: {
    title: 'PCP & Chão de Fábrica.',
    body: 'Ordem de produção, sequenciamento por máquina, apontamento por coletor e OEE. Saiba onde está cada pedido e qual posto é o gargalo, em tempo real — não no fim do mês.',
    feats: ['Ordem de produção a partir do pedido', 'Sequenciamento por máquina e capacidade', 'Apontamento por coletor (Android)', 'OEE e produtividade por posto', 'Identificação de gargalo em tempo real', 'Refugo e retrabalho controlados', 'Painel de status por OP'],
    conn: ['Engenharia → roteiro e tempos', 'Orçamento → pedido vira OP', 'Estoque → consumo e produção apontados', 'Custos → mão de obra real por ordem'],
    kpis: [['Tempo real', 'status de cada OP'], ['OEE', 'por máquina e turno'], ['Gargalo', 'visível antes do atraso']]
  },
  orcamento: {
    title: 'Orçamento & Vendas.',
    body: 'Precificação de peça sob medida com custo real, proposta com aprovação digital e CRM de funil. Do orçamento à NF emitida sem refazer cadastro — e sem orçamento na gaveta.',
    feats: ['Precificação por ficha técnica real', 'Margem-alvo por produto e cliente', 'Proposta com aprovação digital', 'Funil de vendas (CRM) visual', 'Conversão de orçamento em OP', 'Tabelas de preço e descontos por alçada', 'Histórico de propostas por cliente'],
    conn: ['Engenharia → custo de material e processo', 'PCP → orçamento aprovado abre a OP', 'Fiscal → NF emitida na conversão', 'Custos → margem real vs. orçada'],
    kpis: [['Mais rápido', 'para montar o orçamento'], ['+ margem', 'com preço no custo certo'], ['1 clique', 'do orçamento à produção']]
  },
  estoque: {
    title: 'Estoque & Compras.',
    body: 'Matéria-prima, produto em processo e acabado num só lugar. O MRP liga a necessidade da OP direto ao pedido de compra — máquina não para por falta de material.',
    feats: ['MRP: necessidade da OP gera a compra', 'Três estágios: MP, em processo, acabado', 'Leitura por coletor (Android/iOS)', 'Rastreio de lote e localização', 'Controle de retalho aproveitável', 'Inventário cíclico assistido', 'Cotação e pedido de compra'],
    conn: ['Engenharia → lista de material da peça', 'Plano de corte → baixa e retorno de retalho', 'PCP → consumo apontado na OP', 'Fiscal → entrada de NF de compra'],
    kpis: [['MRP', 'necessidade vira pedido de compra'], ['Menos ruptura', 'de matéria-prima'], ['Retalho', 'controlado e reaproveitado']]
  },
  fiscal: {
    title: 'Fiscal Industrial & Custos.',
    body: 'NF-e, Bloco K, SPED e custo real por OP gerados automaticamente. Conformidade da indústria sem consultoria — e a margem de cada peça na palma da mão.',
    feats: ['NF-e e NFC-e da indústria', 'Bloco K · livro de produção e estoque', 'SPED Fiscal e Contribuições', 'Custo real por OP e por peça', 'Manifesto MDFe e CTe', 'Regras tributárias por produto e UF', 'Atualização de layout antes do prazo'],
    conn: ['Vendas → NF emitida na conversão', 'PCP → produção e consumo no Bloco K', 'Estoque → entrada/saída sincronizada', 'Orçamento → margem real vs. orçada'],
    kpis: [['Automático', 'Bloco K e SPED'], ['Multi-UF', 'regras tributárias por produto'], ['Por OP', 'custo e margem reais']]
  }
};

export const generateStaticParams = () =>
  Object.keys(modules).map((slug) => ({ slug }));

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const m = modules[params.slug];
  if (!m) return { title: 'Módulo' };

  // O template do layout ("%s · VentureERP") já adiciona o sufixo — aqui vai só
  // o nome limpo do módulo, sem duplicar a marca.
  const clean = m.title.replace(/\.$/, '');
  const description =
    m.body.length > 160 ? `${m.body.slice(0, 157).trimEnd()}…` : m.body;
  const url = `${SITE_URL}/modulo/${params.slug}`;

  return {
    title: clean,
    description,
    keywords: [
      clean,
      ...m.feats.slice(0, 6),
      'ERP para metalúrgica',
      'ERP para moveleira',
    ],
    alternates: { canonical: `/modulo/${params.slug}` },
    openGraph: {
      type: 'article',
      url,
      title: `${clean} · VentureERP`,
      description,
      siteName: 'VentureERP',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${clean} · VentureERP`,
      description,
    },
  };
}

export default function ModulePage({ params }: { params: { slug: string } }) {
  const m = modules[params.slug];
  if (!m) notFound();

  const clean = m.title.replace(/\.$/, '');

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', path: '/' },
          { name: 'Módulos', path: '/#modulos' },
          { name: clean, path: `/modulo/${params.slug}` },
        ]}
      />
      <header className="border-b border-line bg-bg/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/#modulos" className="text-sm text-muted hover:text-ink">← Todos os módulos</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-20">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· módulo</span>
        <h1 className="mt-3 font-serif text-7xl leading-[1] tracking-tightest">
          {m.title.replace('.', '')}<span style={{ color: '#CBAB1F' }}>.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted">{m.body}</p>

        <div className="mt-10 flex gap-3">
          <Link href="/agendar" className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-bg hover:bg-moss-900">
            Agendar demonstração →
          </Link>
          <Link href="/demo" className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm hover:border-ink/50">
            Ver funcionando
          </Link>
        </div>

        <section className="mt-20 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-4xl leading-tight">O que está incluso</h2>
            <ul className="mt-6 space-y-3 text-[16px]">
              {m.feats.map((f) => (
                <li key={f} className="flex items-start gap-3 border-b border-line/60 pb-3">
                  <IconCheck size={18} className="mt-1 shrink-0 text-moss-700" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-4xl leading-tight">Como conversa com os outros módulos</h2>
            <ul className="mt-6 space-y-3 text-[16px]">
              {m.conn.map((c) => (
                <li key={c} className="flex items-start gap-3 border-b border-line/60 pb-3">
                  <span className="mt-2 h-1 w-3 shrink-0 bg-mustard-400"></span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-line bg-paper p-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">·· em campo</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight">Resultados típicos no primeiro ano</h2>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {m.kpis.map(([n, l]) => (
              <div key={l} className="bg-bg p-7">
                <p className="font-serif text-[60px] leading-none tracking-tightest">{n}</p>
                <p className="mt-3 text-[14px] text-muted">{l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl bg-moss-900 p-12 text-bg">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="max-w-2xl font-serif text-5xl leading-tight">
              Quer ver <em className="text-mustard-300">esse módulo</em> rodando com seus dados?
            </h2>
            <Link href="/agendar" className="inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3 text-[14px] text-moss-900 transition hover:bg-mustard-400">
              Agendar demo →
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
