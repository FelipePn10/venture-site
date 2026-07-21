import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { IconArrow, IconCheck, IconQuote, IconFlame, IconTree } from '@/components/Icons';
import { LeadForm } from '@/components/LeadForm';

export type SectorCase = {
  client: string;
  context: string;
  quote: string;
  author: string;
  stats: [string, string][];
};

export type Sector = {
  slug: string;
  label: string;
  /** Singular, para frases como "uma metalúrgica". */
  singular: string;
  Icon: typeof IconFlame;
  h1: string;
  h1Accent: string;
  intro: string;
  pains: { t: string; d: string }[];
  solutions: { t: string; d: string }[];
  /** Fluxo da fábrica, etapa a etapa, no vocabulário do setor. */
  flow: { step: string; t: string; d: string }[];
  /** Módulos do ERP que mais importam neste setor. */
  modules: { name: string; slug: string; d: string }[];
  /** Perguntas que só aparecem neste setor. */
  faq: [string, string][];
  /** Só preenchido quando existe cliente real no setor. */
  proof?: SectorCase;
  /** Usado quando ainda não há case no setor — sem inventar métrica. */
  proofFallback?: { title: string; body: string };
};

export const metalurgicas: Sector = {
  slug: 'metalurgicas',
  label: 'Metalúrgicas',
  singular: 'metalúrgica',
  Icon: IconFlame,
  h1: 'ERP para',
  h1Accent: 'metalúrgicas.',
  intro:
    'Da chapa que entra no galpão à estrutura que sai na carreta. Orçamento com custo real de corte, dobra, solda e pintura, plano de corte que reduz a sobra e Bloco K gerado sozinho — tudo puxado da mesma ficha técnica.',
  pains: [
    {
      t: 'O orçamento é um chute com margem de segurança',
      d: 'Sem tempo de máquina e consumo real de chapa na conta, ou você perde o pedido no preço ou descobre no fim do mês que produziu no prejuízo.',
    },
    {
      t: 'A sobra de chapa vira caçamba',
      d: 'Corte planejado no olho deixa retalho grande demais para descartar e pequeno demais para a próxima peça. O aço mais caro é o que você joga fora.',
    },
    {
      t: 'Ninguém sabe onde está o pedido',
      d: 'A OP está "na produção" — mas em qual posto, há quanto tempo, e vai atrasar? A resposta costuma vir do encarregado, de memória.',
    },
    {
      t: 'Bloco K é uma corrida contra o prazo',
      d: 'Fechar o livro de produção e estoque a partir de planilha é retrabalho garantido todo mês, com risco fiscal em cima.',
    },
  ],
  solutions: [
    {
      t: 'Orçamento pelo custo real do processo',
      d: 'Corte, dobra, solda, usinagem e pintura com tempo-padrão por operação. O preço sai da ficha técnica, não do histórico.',
    },
    {
      t: 'Plano de corte (nesting) de chapa',
      d: 'O sistema calcula o melhor aproveitamento da chapa e mostra a sobra antes de cortar. Retalho aproveitável volta controlado ao estoque.',
    },
    {
      t: 'OP apontada por posto',
      d: 'Apontamento por coletor Android, OEE por máquina e turno, e o gargalo visível antes de virar atraso na entrega.',
    },
    {
      t: 'Fiscal industrial automático',
      d: 'NF-e, Bloco K e SPED gerados a partir do que foi realmente produzido e consumido, com regra tributária por produto e UF.',
    },
  ],
  flow: [
    {
      step: '01',
      t: 'Chega o pedido de uma peça sob medida',
      d: 'O vendedor monta o orçamento puxando a ficha técnica: chapa, espessura, tempo de corte, dobra, solda, usinagem e pintura. O preço sai com a margem já calculada, não no chute.',
    },
    {
      step: '02',
      t: 'Aprovado, vira ordem de produção',
      d: 'O orçamento aprovado abre a OP com o roteiro de operações e os tempos-padrão por posto. Nada é redigitado — o que foi vendido é o que entra na fábrica.',
    },
    {
      step: '03',
      t: 'O plano de corte otimiza a chapa',
      d: 'O nesting calcula o melhor aproveitamento antes de qualquer corte. Você vê a sobra na tela, e o retalho aproveitável volta ao estoque identificado, não para a caçamba.',
    },
    {
      step: '04',
      t: 'O chão de fábrica aponta em tempo real',
      d: 'Cada posto aponta início e fim pelo coletor. Você acompanha OEE por máquina e turno, e o gargalo aparece enquanto dá tempo de remanejar.',
    },
    {
      step: '05',
      t: 'Fecha com custo real e fiscal em dia',
      d: 'Material e mão de obra apontados fecham o custo real da OP. O Bloco K e o SPED saem do que foi de fato produzido e consumido.',
    },
  ],
  modules: [
    {
      name: 'Engenharia & Ficha Técnica',
      slug: 'engenharia',
      d: 'BOM multinível com roteiro, tempos por operação e anexo de DXF.',
    },
    {
      name: 'Plano de Corte',
      slug: 'corte',
      d: 'Nesting de chapa de aço com controle de retalho e exportação para a máquina.',
    },
    {
      name: 'PCP & Chão de Fábrica',
      slug: 'pcp',
      d: 'OP por posto, apontamento por coletor, OEE e gargalo em tempo real.',
    },
    {
      name: 'Fiscal Industrial',
      slug: 'fiscal',
      d: 'NF-e, Bloco K e SPED gerados da produção apontada, com regra por UF.',
    },
  ],
  faq: [
    [
      'O sistema calcula o custo de dobra, solda e usinagem separadamente?',
      'Sim. Cada operação do roteiro tem tempo-padrão e custo próprio — corte, dobra, solda, usinagem, pintura, tratamento. O custo da peça é a soma do material pela ficha técnica mais o processo real, não um percentual aplicado por cima.',
    ],
    [
      'Dá para exportar o plano de corte para a máquina?',
      'Sim. O nesting gera o arquivo para a máquina de corte e as etiquetas por peça. O consumo de chapa e o retorno de retalho baixam no estoque automaticamente.',
    ],
    [
      'Como fica o controle de sucata e retalho?',
      'O retalho aproveitável entra no estoque com dimensão e localização, e fica disponível para o próximo plano de corte. A sucata é apontada separadamente, então você enxerga quanto de aço virou perda de fato.',
    ],
    [
      'Atende estrutura metálica com montagem em obra?',
      'Atende. A ordem de produção acompanha o romaneio de expedição por etapa da obra, e o apontamento distingue o que foi fabricado do que já foi enviado para montagem.',
    ],
  ],
  proof: {
    client: 'Tecnofer',
    context: 'Metalúrgica · 50 colaboradores',
    quote:
      'Trocamos planilhas e sistemas legados pelo VentureERP e reorganizamos as ordens de produção. O desperdício de matéria-prima caiu, a fábrica passou a render mais e boa parte do trabalho manual virou processo automático.',
    author: 'Rulian · Diretor, Tecnofer',
    stats: [
      ['−19%', 'de desperdício de matéria-prima'],
      ['+22%', 'de performance na fabricação'],
      ['37%', 'dos processos manuais automatizados'],
    ],
  },
};

export const moveleiras: Sector = {
  slug: 'moveleiras',
  label: 'Moveleiras',
  singular: 'moveleira',
  Icon: IconTree,
  h1: 'ERP para',
  h1Accent: 'moveleiras.',
  intro:
    'Do projeto sob medida ao móvel expedido. Precificação com MDF, ferragens e fitas de borda na ficha técnica, plano de corte que aproveita cada placa e romaneio conferido antes de a carga sair.',
  pains: [
    {
      t: 'O projeto sai mais caro do que foi vendido',
      d: 'Ferragem, fita de borda e acessório entram depois da venda. A margem que parecia boa some na hora de produzir.',
    },
    {
      t: 'Sobra de MDF sem controle',
      d: 'Cada placa mal aproveitada é dinheiro parado no galpão — e retalho que ninguém sabe se dá para usar no próximo ambiente.',
    },
    {
      t: 'O projeto aprovado é redigitado na produção',
      d: 'O que foi vendido é recadastrado à mão para virar ordem de produção. Cada redigitação é uma chance de peça errada.',
    },
    {
      t: 'Falta peça na entrega',
      d: 'A carga sai, o montador chega na casa do cliente e falta uma porta. Volta de caminhão é prejuízo e cliente irritado.',
    },
  ],
  solutions: [
    {
      t: 'Precificação de móvel planejado',
      d: 'MDF, ferragens, fitas de borda e acessórios na ficha técnica desde o orçamento. O preço já nasce com o custo inteiro.',
    },
    {
      t: 'Plano de corte (nesting) de MDF',
      d: 'Otimização por espessura e cor, com o aproveitamento da placa visível antes do corte e etiqueta gerada por peça.',
    },
    {
      t: 'Do projeto à OP sem redigitar',
      d: 'O projeto aprovado vira ordem de produção direto, organizada por ambiente e por pedido.',
    },
    {
      t: 'Romaneio conferido na expedição',
      d: 'A carga só fecha com todas as peças do ambiente conferidas — a falta aparece no galpão, não na casa do cliente.',
    },
  ],
  flow: [
    {
      step: '01',
      t: 'O projeto sob medida vira orçamento',
      d: 'Ambiente por ambiente, com MDF, ferragens, fitas de borda, corrediças e acessórios já na ficha técnica. O preço nasce com o custo inteiro, não só com a chapa.',
    },
    {
      step: '02',
      t: 'Aprovado, vira ordem de produção',
      d: 'O projeto aprovado abre a OP organizada por ambiente e por pedido. Ninguém redigita o que o projetista já desenhou.',
    },
    {
      step: '03',
      t: 'O plano de corte aproveita cada placa',
      d: 'Nesting otimizado por espessura e cor, com etiqueta por peça e cálculo de fita de borda. Você vê o aproveitamento da placa antes de mandar cortar.',
    },
    {
      step: '04',
      t: 'A produção anda por ambiente',
      d: 'Corte, coladeira, usinagem e montagem apontados por etapa. Dá para saber que o quarto do cliente está pronto e a cozinha ainda não.',
    },
    {
      step: '05',
      t: 'A expedição confere o romaneio',
      d: 'A carga só fecha com todas as peças do ambiente conferidas. A falta aparece no galpão, não na casa do cliente com o montador parado.',
    },
  ],
  modules: [
    {
      name: 'Engenharia & Ficha Técnica',
      slug: 'engenharia',
      d: 'Ficha com MDF, ferragens, fitas e acessórios; variações e produtos configuráveis.',
    },
    {
      name: 'Plano de Corte',
      slug: 'corte',
      d: 'Nesting de MDF por espessura e cor, com fita de borda calculada e etiqueta por peça.',
    },
    {
      name: 'Orçamento & Vendas',
      slug: 'orcamento',
      d: 'Precificação de planejado por ambiente, proposta com aprovação digital e funil de vendas.',
    },
    {
      name: 'Estoque & Compras',
      slug: 'estoque',
      d: 'MRP que puxa placa e ferragem da OP, com retalho aproveitável controlado.',
    },
  ],
  faq: [
    [
      'O sistema calcula fita de borda e ferragens no orçamento?',
      'Calcula. Fita de borda entra por metro conforme as faces do painel, e ferragens, corrediças e puxadores entram pela ficha técnica do módulo. É justamente onde a margem do planejado costuma escapar quando o orçamento é feito só pela chapa.',
    ],
    [
      'Dá para integrar com o software de projeto da marcenaria?',
      'A ficha técnica aceita importação da lista de peças e permite anexar o projeto. O grau de automação depende do software que você usa hoje — é um dos pontos que checamos na demonstração, com o seu arquivo real.',
    ],
    [
      'Como funciona a produção por ambiente?',
      'Cada ambiente do projeto (cozinha, dormitório, closet) vira um agrupamento dentro da ordem de produção. Você acompanha o andamento por ambiente e expede quando o ambiente inteiro está pronto, evitando entrega pela metade.',
    ],
    [
      'O nesting considera cor e veio da chapa?',
      'Sim. A otimização separa por espessura, cor e padrão, e respeita a orientação do veio quando a peça exige. Chapas de padrões diferentes não são misturadas no mesmo plano de corte.',
    ],
  ],
  proofFallback: {
    title: 'Ainda não temos um case publicado no setor moveleiro',
    body:
      'Nosso case documentado hoje é de uma metalúrgica. Preferimos dizer isso a estampar números de moveleiras que não medimos. O sistema atende os dois setores — e na demonstração mostramos o fluxo moveleiro rodando com a realidade da sua fábrica, para você julgar por conta própria.',
  },
};

export const SectorPage = ({ sector }: { sector: Sector }) => (
  <>
    <Nav />
    <main className="pt-20">
      <section className="grain relative overflow-hidden bg-moss-900 pb-24 pt-16 text-bg">
        <div
          className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(220,192,59,.2), transparent)' }}
        />
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/80 transition hover:bg-bg/15"
          >
            ← Voltar ao site
          </Link>

          <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mustard-300">
                <sector.Icon size={16} /> para {sector.label.toLowerCase()}
              </span>
              <h1 className="mt-4 font-serif text-[52px] leading-[0.98] tracking-tightest md:text-[68px]">
                {sector.h1}
                <br />
                <span className="italic text-mustard-300">{sector.h1Accent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-bg/75">{sector.intro}</p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/diagnostico"
                  className="inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3.5 text-sm text-moss-900 transition hover:bg-mustard-400"
                >
                  Fazer o diagnóstico gratuito <IconArrow size={16} />
                </Link>
                <Link
                  href="/agendar"
                  className="inline-flex items-center gap-2 rounded-full border border-bg/25 px-6 py-3.5 text-sm text-bg transition hover:border-bg/60"
                >
                  Agendar demonstração
                </Link>
              </div>
            </div>

            {sector.proof ? (
              <figure className="rounded-2xl border border-bg/15 bg-moss-800/50 p-7">
                <IconQuote size={26} className="text-mustard-300" />
                <blockquote className="mt-4 font-serif text-[21px] leading-snug text-bg">
                  “{sector.proof.quote}”
                </blockquote>
                <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/55">
                  {sector.proof.author}
                </figcaption>
                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-bg/15 pt-5">
                  {sector.proof.stats.map(([n, l]) => (
                    <div key={l}>
                      <p className="font-serif text-3xl leading-none text-mustard-300">{n}</p>
                      <p className="mt-1.5 text-[12px] leading-snug text-bg/65">{l}</p>
                    </div>
                  ))}
                </div>
              </figure>
            ) : (
              sector.proofFallback && (
                <div className="rounded-2xl border border-bg/15 bg-moss-800/50 p-7">
                  <p className="font-serif text-[21px] leading-snug text-bg">
                    {sector.proofFallback.title}
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-bg/70">
                    {sector.proofFallback.body}
                  </p>
                  <Link
                    href="/cases"
                    className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-mustard-300 underline-offset-4 hover:underline"
                  >
                    Ver o case que temos <IconArrow size={14} />
                  </Link>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· o problema
          </span>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
            O que trava uma {sector.singular} hoje.
          </h2>
        </div>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
          {sector.pains.map((p) => (
            <div key={p.t} className="bg-bg p-8">
              <p className="font-serif text-2xl leading-snug text-ink">{p.t}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
              ·· como o VentureERP resolve
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
              Feito no padrão do seu setor,{' '}
              <span className="italic text-moss-700">não um genérico maquiado</span>.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sector.solutions.map((s) => (
              <div key={s.t} className="rounded-2xl border border-line bg-bg p-8">
                <IconCheck size={20} className="text-moss-700" />
                <p className="mt-4 font-serif text-2xl leading-snug text-ink">{s.t}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fluxo da fábrica, etapa a etapa */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· do pedido à entrega
          </span>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
            Como o VentureERP acompanha{' '}
            <span className="italic text-moss-700">o seu fluxo</span>.
          </h2>
        </div>

        <ol className="mt-12 space-y-px overflow-hidden rounded-2xl border border-line bg-line">
          {sector.flow.map((f) => (
            <li key={f.step} className="grid gap-4 bg-bg p-8 md:grid-cols-[auto_1fr_1.4fr] md:items-start md:gap-8">
              <span className="font-mono text-[13px] text-moss-700">{f.step}</span>
              <p className="font-serif text-2xl leading-snug text-ink">{f.t}</p>
              <p className="text-[15px] leading-relaxed text-muted">{f.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Módulos que mais importam neste setor */}
      <section className="bg-paper py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
              ·· módulos
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
              O que pesa mais numa {sector.singular}.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {sector.modules.map((m) => (
              <Link
                key={m.slug}
                href={`/modulo/${m.slug}`}
                className="group rounded-2xl border border-line bg-bg p-7 transition hover:border-moss-700"
              >
                <p className="font-serif text-2xl leading-snug text-ink">{m.name}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-muted">{m.d}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-moss-700">
                  Ver o módulo{' '}
                  <IconArrow size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ do setor */}
      <section className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <div className="text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· dúvidas de quem produz
          </span>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
            Perguntas específicas do setor.
          </h2>
        </div>
        <dl className="mt-12 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-bg">
          {sector.faq.map(([q, a]) => (
            <div key={q} className="p-7 md:p-8">
              <dt className="font-serif text-xl leading-snug text-ink md:text-2xl">{q}</dt>
              <dd className="mt-3 text-[15px] leading-relaxed text-muted">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Conversão: diagnóstico + formulário */}
      <section className="border-t border-line bg-paper py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:px-10">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
              ·· próximo passo
            </span>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
              Vamos olhar a sua{' '}
              <span className="italic text-moss-700">{sector.singular}</span>?
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">
              Preencha ao lado e um especialista do setor retorna em até um dia útil. Se preferir
              começar sozinho, o diagnóstico leva 2 minutos e já aponta onde a operação costuma
              perder margem.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/diagnostico"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm text-ink transition hover:border-ink/50"
              >
                Fazer o diagnóstico <IconArrow size={15} />
              </Link>
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 text-sm text-ink transition hover:border-ink/50"
              >
                Agendar demonstração
              </Link>
            </div>

            <ul className="mt-9 space-y-3">
              {[
                'Especialista que entende de chão de fábrica',
                'Demonstração com cenários da sua operação',
                'Proposta só depois da primeira conversa',
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[15px] text-ink/85">
                  <IconCheck size={16} className="mt-1 shrink-0 text-moss-700" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <LeadForm
            source={`Página ${sector.label}`}
            defaultSegment={sector.label === 'Metalúrgicas' ? 'Metalúrgica' : 'Moveleira'}
            title={`Fale com um especialista em ${sector.singular}s`}
            subtitle="Conte como sua fábrica trabalha hoje. Quanto mais contexto, mais útil é a primeira conversa."
          />
        </div>
      </section>
    </main>
    <Footer />
  </>
);
