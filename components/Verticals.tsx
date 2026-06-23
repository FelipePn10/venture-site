'use client';

import { useState } from 'react';
import { IconCheck, IconFlame, IconTree } from './Icons';

type Vertical = {
  id: string;
  label: string;
  Icon: typeof IconFlame;
  title: string;
  body: string;
  stats: [string, string][];
  feats: string[];
};

const verticals: Vertical[] = [
  {
    id: 'metalurgica',
    label: 'Metalúrgica',
    Icon: IconFlame,
    title: 'Da chapa cortada à estrutura entregue.',
    body: 'Orçamento com custo real de corte, dobra, solda, usinagem e pintura. Plano de corte de chapa que reduz a sobra, ordem de produção apontada por posto e Bloco K gerado sozinho. Tudo amarrado à ficha técnica da peça.',
    stats: [['−34%', 'sobra de chapa de aço'], ['2,8×', 'mais rápido para orçar'], ['100%', 'Bloco K e SPED em dia']],
    feats: ['Plano de corte de chapa (nesting)', 'Custo de dobra, solda e usinagem', 'Ordem de produção por posto', 'Apontamento por coletor', 'Sucata e retalho controlados', 'Bloco K · SPED Fiscal']
  },
  {
    id: 'moveleira',
    label: 'Moveleira',
    Icon: IconTree,
    title: 'Do projeto sob medida ao móvel expedido.',
    body: 'Precificação de móvel planejado com chapa de MDF, ferragens e fitas de borda na ficha técnica. Plano de corte que aproveita cada placa, controle de produção por ambiente e expedição sem peça faltando no romaneio.',
    stats: [['−41%', 'sobra de MDF'], ['+22%', 'margem por projeto'], ['1 clique', 'do projeto à OP']],
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
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">resultados médios · 12 meses</p>
            <div className="mt-5 space-y-6">
              {v.stats.map(([n, l]) => (
                <div key={l} className="border-b border-line pb-5 last:border-0 last:pb-0">
                  <p className="font-serif text-5xl leading-none tracking-tightest text-ink">{n}</p>
                  <p className="mt-2 text-[14px] text-muted">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
