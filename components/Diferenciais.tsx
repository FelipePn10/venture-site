import Link from 'next/link';
import {
  IconArrow,
  IconBox,
  IconCheck,
  IconLink,
  IconReceipt,
  IconScissors,
  IconShield,
  IconSpark,
  IconUsers,
} from './Icons';

/**
 * Diferenciais — ocupa o lugar da antiga seção "para o seu setor", que repetia
 * quase palavra por palavra o SectorPicker do topo. Aqui a pergunta é outra:
 * por que o VentureERP e não o ERP genérico + um software de corte avulso.
 *
 * Metade dos itens é produto (o que o motor de corte faz de verdade — famílias
 * de material, rastreabilidade, reserva e auditoria) e metade é relação: como a
 * fábrica influencia o roadmap, quem acompanha a obrigação fiscal e quem atende
 * o telefone. Implantação, migração e treinamento ficam de fora de propósito —
 * são a seção Workflow, logo abaixo.
 */

/** As quatro famílias de material que o motor de corte trata sob o mesmo contrato. */
const familias: [string, string][] = [
  ['Barra, tubo e perfil', 'Corte linear com refile de ponta e espessura de serra descontada a cada corte.'],
  ['Chapa e MDF', 'Corte guilhotinado pronto para a seccionadora, com veio respeitado e fita de borda somada.'],
  ['Formas livres', 'Laser e plasma pelo contorno real da peça, girando em qualquer ângulo para intertravar.'],
  ['Rolo e tecido', 'Largura real de cada rolo, encaixe e enfesto — com defeito do tecido tratado como restrição.'],
];

const diferenciais = [
  {
    Icon: IconLink,
    t: 'A rastreabilidade sobrevive ao corte',
    d: 'Cada sobra volta à prateleira como retalho identificado, carregando a corrida e o certificado da matéria-prima de origem. Meses depois, a peça entregue ainda aponta para o lote de aço que a originou.',
  },
  {
    Icon: IconBox,
    t: 'O plano já sabe o que tem no pátio',
    d: 'Software de corte avulso pede que você liste as barras e chapas disponíveis — e essa lista já nasce velha. Aqui o plano é calculado sobre o estoque real, retalhos inclusos, e ao ser firmado dá baixa sozinho com custo, lote e ordem de produção. Sem redigitação e sem dois planos contando com a mesma chapa.',
  },
  {
    Icon: IconShield,
    t: 'Você abre o plano e vê a conta',
    d: 'Plano firmado vira uma revisão que ninguém mais altera — e que você reabre quando quiser. Dentro dela está tudo o que entrou no cálculo: as peças, as barras e retalhos usados, a espessura de serra, o refile, o critério que escolheu aquele encaixe e as alternativas que ficaram para trás. Conferir o corte de seis meses atrás é abrir a revisão — não reconstituir o que foi feito.',
  },
  {
    Icon: IconSpark,
    t: 'O roadmap tem a sua fábrica dentro',
    d: 'O que a sua operação precisa entra na fila de desenvolvimento e é entregue. Você não passa anos esperando que um comitê distante decida priorizar o jeito como a sua indústria trabalha.',
  },
  {
    Icon: IconReceipt,
    t: 'A obrigação fiscal é acompanhada por gente',
    d: 'Nossa equipe fiscal segue as mudanças da Receita e dos SEFAZs e ajusta o sistema antes de virar problema seu. Você não descobre obrigação nova pelo noticiário nem pela multa.',
  },
  {
    Icon: IconUsers,
    t: 'Quem atende entende de produção',
    d: 'Chat, e-mail e WhatsApp com um CSM que sabe o que é uma ordem de produção travada — não um atendente lendo script e pedindo para reiniciar o programa.',
  },
];

export const Diferenciais = () => (
  <section id="diferenciais" className="scroll-mt-24 bg-paper py-28">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="reveal grid items-end gap-6 md:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· diferenciais
          </span>
          {/* text-balance evita o "faz." sozinho na terceira linha no desktop. */}
          <h2 className="mt-3 text-balance font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            O que um ERP genérico não faz pela sua fábrica,{' '}
            <span className="italic text-moss-700">o VentureERP faz.</span>
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-muted md:pl-8">
          A alternativa de sempre é um ERP administrativo mais um software de
          corte avulso, com planilha no meio para os dois conversarem. Aqui o
          corte, o estoque, a produção e o fiscal são o mesmo sistema — e a
          diferença aparece no que cada um deles sabe sobre o outro.
        </p>
      </div>

      {/* Diferencial-âncora: o motor de corte. Os outros seis sustentam. */}
      <div
        className="reveal mt-14 grid gap-10 rounded-2xl border border-line bg-bg p-8 md:grid-cols-[1.05fr_1fr] md:p-12"
        data-delay="1"
      >
        <div>
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-moss-50 text-moss-700">
            <IconScissors size={24} />
          </span>
          <h3 className="mt-6 font-serif text-4xl leading-[1.08] text-ink md:text-[42px]">
            Um motor de corte industrial dentro do ERP.
          </h3>
          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            Não é um otimizador de chapa colado por integração: é o mesmo
            sistema que já conhece a sua ficha técnica, o seu estoque e as suas
            ordens. O plano nasce das ordens de produção, junta várias ordens do
            mesmo material para aproveitar melhor a chapa, e devolve o mapa em
            PDF, SVG e DXF — direto para a máquina.
          </p>
          <p className="mt-4 text-[16px] leading-relaxed text-muted">
            E ele trata as quatro famílias de material sob o mesmo contrato, com
            as restrições reais de cada uma:
          </p>
          <Link
            href="/plano-de-corte"
            className="group mt-7 inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-3 text-sm text-bg transition hover:bg-moss-800"
          >
            Ver o plano de corte por dentro
            <IconArrow size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line">
          {familias.map(([t, d]) => (
            <li key={t} className="bg-paper p-6">
              <p className="flex items-center gap-2.5 font-serif text-xl leading-none text-ink">
                <IconCheck size={17} className="shrink-0 text-moss-700" />
                {t}
              </p>
              <p className="mt-2.5 pl-[27px] text-[14px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {diferenciais.map(({ Icon, t, d }, i) => (
          <div key={t} className="reveal bg-bg p-8" data-delay={(i % 3) + 1}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-moss-50 text-moss-700">
              <Icon size={18} />
            </span>
            <h3 className="mt-5 font-serif text-2xl leading-tight text-ink">{t}</h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{d}</p>
          </div>
        ))}
      </div>

      <p className="reveal mt-7 text-center text-[14px] leading-relaxed text-muted" data-delay="2">
        Quer ver isso no material que a sua fábrica corta?{' '}
        <Link
          href="/agendar"
          className="inline-flex items-center gap-1.5 text-moss-700 underline decoration-moss-200 underline-offset-4 transition hover:decoration-moss-700"
        >
          Agende uma demonstração
          <IconArrow size={14} />
        </Link>{' '}
        e leve uma peça sua para a gente planejar ao vivo.
      </p>
    </div>
  </section>
);
