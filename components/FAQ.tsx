'use client';

import { useState } from 'react';
import { IconMinus, IconPlus } from './Icons';

const items: [string, string][] = [
  ['O VentureERP serve para metalúrgica e moveleira de qualquer porte?', 'Sim. Atendemos desde a serralheria/marcenaria que está saindo da planilha até grupos industriais com várias plantas. O sistema é o mesmo software de produção sob medida, com plano de corte, ficha técnica e Bloco K — o que muda é o plano contratado. Comece pela demonstração em /demo para ver na sua realidade.'],
  ['Como funciona o plano de corte (nesting) de chapa e MDF?', 'Você cadastra a peça na ficha técnica e o sistema gera automaticamente o melhor aproveitamento da chapa de aço ou da placa de MDF, mostrando a sobra antes de cortar. Na prática, é menos retalho virando lixo e menos compra de material. É o módulo que mais rápido se paga — clientes reduzem de 11% para 4% de sobra.'],
  ['Vocês calculam o custo real por peça e por ordem de produção?', 'Sim. O custo puxa material (pela ficha técnica), processo (dobra, solda, usinagem, pintura, fitas, ferragens) e mão de obra apontada na OP. Você sabe a margem de cada peça no ato do orçamento e o custo real acumulado enquanto a OP roda — não só no fechamento do mês.'],
  ['O sistema gera o Bloco K e o SPED da indústria?', 'Gera. Como o consumo de matéria-prima e a produção ficam registrados no próprio sistema, o Bloco K (livro de produção e estoque) e o SPED Fiscal saem automaticamente, dentro do prazo. Nossa equipe fiscal acompanha as mudanças da Receita e dos SEFAZs — você não descobre obrigação nova pelo noticiário.'],
  ['Qual a diferença entre a demonstração gravada e a ao vivo?', 'A demonstração gravada (/demo) são vídeos curtos por módulo — orçamento, plano de corte, ordem de produção, fiscal — que você assiste no seu ritmo, sem falar com vendedor. A ao vivo é personalizada: um especialista do seu setor mostra o sistema com cenários da sua fábrica e responde em tempo real. Recomendamos ver a gravada primeiro e depois agendar a ao vivo em /agendar.'],
  ['Como é a migração sem parar a produção?', 'Nosso time importa o cadastro de produtos, a estrutura (BOM), clientes, estoque e histórico. Validamos tudo em paralelo ao seu sistema atual e só fazemos o cutover com sua aprovação. A fábrica não para, nenhum dado se perde. A média é 37 dias do contrato ao chão de fábrica operando.'],
  ['Qual a estrutura de suporte depois da implantação?', 'Os planos Fábrica e Grupo Industrial têm CSM dedicado que entende de produção, com revisões trimestrais. Suporte via chat (resposta < 5 min em horário comercial), e-mail e WhatsApp. O Grupo Industrial inclui SLA contratual de 99,98% e diretor de conta sênior — alguém que conhece sua fábrica pelo nome, não pelo número do ticket.'],
];

export const FAQ = () => {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
      <div className="reveal text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· perguntas frequentes</span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          Tudo o que você queria <span className="italic text-moss-700">perguntar</span>.
        </h2>
      </div>

      <div className="reveal mt-12 divide-y divide-line border-y border-line" data-delay="1">
        {items.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className={`font-serif text-2xl leading-snug transition ${isOpen ? 'text-moss-700' : 'text-ink'}`}>{q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${isOpen ? 'border-moss-700 bg-moss-700 text-bg' : 'border-line text-ink'}`}>
                  {isOpen ? <IconMinus size={16} /> : <IconPlus size={16} />}
                </span>
              </button>
              <div className="grid overflow-hidden transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div className="min-h-0">
                  <p className="pb-7 pr-12 text-[15.5px] leading-relaxed text-muted">{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
