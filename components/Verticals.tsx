'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck, IconFlame, IconTree } from './Icons';

type Vertical = {
  id: string;
  label: string;
  href: string;
  Icon: typeof IconFlame;
  title: string;
  body: string;
  feats: string[];
  /**
   * Painel lateral. Só usamos números quando existe um cliente real por trás
   * deles — hoje isso vale para a metalúrgica (Tecnofer). Na moveleira o painel
   * descreve o que o sistema faz, sem inventar métrica.
   */
  proof:
    | { kind: 'case'; client: string; context: string; stats: [string, string][] }
    | { kind: 'capabilities'; title: string; items: string[] };
};

const verticals: Vertical[] = [
  {
    id: 'metalurgica',
    label: 'Metalúrgica',
    href: '/metalurgicas',
    Icon: IconFlame,
    title: 'Da chapa cortada à estrutura entregue.',
    body: 'Orçamento com custo real de corte, dobra, solda, usinagem e pintura. Plano de corte de chapa que reduz a sobra, ordem de produção apontada por posto e Bloco K gerado sozinho. Tudo amarrado à ficha técnica da peça.',
    proof: {
      kind: 'case',
      client: 'Tecnofer',
      context: 'Metalúrgica · 50 colaboradores',
      stats: [
        ['−19%', 'de desperdício de matéria-prima'],
        ['+22%', 'de performance na fabricação'],
        ['37%', 'dos processos manuais automatizados'],
      ],
    },
    feats: ['Plano de corte de chapa (nesting)', 'Custo de dobra, solda e usinagem', 'Ordem de produção por posto', 'Apontamento por coletor', 'Sucata e retalho controlados', 'Bloco K · SPED Fiscal']
  },
  {
    id: 'moveleira',
    label: 'Moveleira',
    href: '/moveleiras',
    Icon: IconTree,
    title: 'Do projeto sob medida ao móvel expedido.',
    body: 'Precificação de móvel planejado com chapa de MDF, ferragens e fitas de borda na ficha técnica. Plano de corte que aproveita cada placa, controle de produção por ambiente e expedição sem peça faltando no romaneio.',
    proof: {
      kind: 'capabilities',
      title: 'O que o sistema faz',
      items: [
        'Calcula o aproveitamento da placa antes de cortar',
        'Precifica o projeto com ferragens e fitas de borda inclusas',
        'Transforma o projeto aprovado em ordem de produção',
        'Confere o romaneio antes de a carga sair',
      ],
    },
    feats: ['Plano de corte de MDF (nesting)', 'Ficha técnica com ferragens e fitas', 'Precificação de móvel planejado', 'Produção por ambiente/pedido', 'Romaneio e expedição conferidos', 'Integração com projeto/marcenaria']
  }
];

export const Verticals = () => {
  const [active, setActive] = useState('metalurgica');
  const v = verticals.find((x) => x.id === active)!;
  return (
    <section id="setores" className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal grid items-end gap-8 md:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· para o seu setor</span>
            <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              Feito para a forma como <span className="italic text-moss-700">a sua fábrica</span> produz.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted md:pl-8">
            Metalúrgica e moveleira têm fluxos diferentes — material, processo e regra fiscal próprios. O VentureERP entrega cada um no padrão do setor, não um genérico maquiado.
          </p>
        </div>

        <div className="reveal mt-12 inline-flex flex-wrap gap-2 rounded-full border border-line bg-bg p-1.5" data-delay="1">
          {verticals.map((vt) => {
            const sel = active === vt.id;
            return (
              <button
                key={vt.id}
                onClick={() => setActive(vt.id)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition ${
                  sel ? 'bg-moss-800 text-bg' : 'text-ink/70 hover:text-ink'
                }`}
              >
                <vt.Icon size={16} className={sel ? 'text-mustard-300' : 'text-moss-700'} />
                {vt.label}
              </button>
            );
          })}
        </div>

        <div key={v.id} className="mt-10 grid animate-pop-in gap-10 rounded-2xl border border-line bg-bg p-8 md:grid-cols-[1.1fr_1fr] md:p-12">
          <div>
            <h3 className="font-serif text-4xl leading-tight text-ink md:text-5xl">{v.title}</h3>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">{v.body}</p>
            <ul className="mt-7 grid grid-cols-2 gap-2.5">
              {v.feats.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[14px] text-ink/85">
                  <IconCheck size={16} className="mt-0.5 shrink-0 text-moss-700" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-paper p-7">
            {v.proof.kind === 'case' ? (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  resultado de um cliente
                </p>
                <p className="mt-2 font-serif text-2xl leading-none text-ink">{v.proof.client}</p>
                <p className="mt-1 text-[13px] text-muted">{v.proof.context}</p>
                <div className="mt-5 space-y-6">
                  {v.proof.stats.map(([n, l]) => (
                    <div key={l} className="border-b border-line pb-5 last:border-0 last:pb-0">
                      <p className="font-serif text-5xl leading-none tracking-tightest text-ink">{n}</p>
                      <p className="mt-2 text-[14px] text-muted">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-5 text-[12px] leading-relaxed text-muted">
                  Números medidos na operação da {v.proof.client}. Resultados variam conforme porte,
                  mix de produtos e processos de cada fábrica.
                </p>
              </>
            ) : (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                  {v.proof.title}
                </p>
                <ul className="mt-5 space-y-4">
                  {v.proof.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 border-b border-line pb-4 text-[15px] leading-snug text-ink/85 last:border-0 last:pb-0"
                    >
                      <IconCheck size={16} className="mt-0.5 shrink-0 text-moss-700" />
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link
              href={v.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-3 text-sm text-bg transition hover:bg-moss-800"
            >
              Ver a solução para {v.label.toLowerCase()}s <IconArrow size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
