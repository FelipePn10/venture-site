'use client';

import { useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck } from './Icons';

type Tier = {
  name: string;
  monthly?: number;
  custom?: boolean;
  sub: string;
  highlight?: boolean;
  desc: string;
  feats: string[];
};

const tiers: Tier[] = [
  {
    name: 'Oficina', monthly: 1490, sub: 'até 15 usuários',
    desc: 'Saindo da planilha e do caderno de produção? Comece aqui. O essencial para orçar certo e controlar a produção — sem pagar pelo que não vai usar.',
    feats: ['Orçamento + Ficha técnica (BOM)', 'Plano de corte de chapa/MDF', 'Ordem de produção e apontamento', 'Fiscal: NF-e + Bloco K', '5 dashboards de chão de fábrica']
  },
  {
    name: 'Fábrica', monthly: 3890, sub: 'até 60 usuários', highlight: true,
    desc: 'O plano que 7 em cada 10 indústrias escolhem. Multi-célula, custo real por OP e um CSM que entende de produção e realmente aparece.',
    feats: ['Tudo do Oficina', 'Nesting otimizado de material', 'Custo real por OP e por peça', 'MRP de matéria-prima', 'OEE e gargalo em tempo real', 'CSM dedicado da indústria']
  },
  {
    name: 'Grupo Industrial', custom: true, sub: 'usuários ilimitados',
    desc: 'Para grupos com múltiplas plantas, várias razões sociais e governança rigorosa. Para quem não aceita resposta de ticket como suporte.',
    feats: ['Tudo do Fábrica', 'Multi-planta e multi-CNPJ', 'SSO + audit trail', 'Ambientes dedicados', 'SLA 99,98% contratual', 'Diretor de conta sênior']
  }
];

const fmt = (n: number) => n.toLocaleString('pt-BR');

export const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  return (
    <section id="planos" className="bg-moss-900 py-28 text-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mustard-300">·· planos</span>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Preço claro. Implantação <span className="italic text-mustard-300">sem surpresas</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-bg/75">
            Sem licença por usuário escondida no contrato. Sem renovação automática em 5 anos. Pague pelo que usa — expanda quando a fábrica crescer.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-bg/15 bg-moss-800/40 p-1">
            <button onClick={() => setAnnual(false)} className={`rounded-full px-4 py-1.5 text-[13px] transition ${!annual ? 'bg-bg text-ink' : 'text-bg/75 hover:text-bg'}`}>Mensal</button>
            <button onClick={() => setAnnual(true)} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] transition ${annual ? 'bg-bg text-ink' : 'text-bg/75 hover:text-bg'}`}>
              Anual <span className="rounded-full bg-mustard-300 px-1.5 py-0.5 text-[10px] font-mono text-moss-900">−15%</span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <article
              key={t.name}
              className={`reveal flex h-full flex-col rounded-2xl border p-8 transition ${
                t.highlight ? 'border-mustard-300 bg-bg text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,.5)]' : 'border-bg/15 bg-moss-800/40'
              }`}
              data-delay={i + 1}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl">{t.name}</h3>
                {t.highlight && (
                  <span className="rounded-full bg-moss-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mustard-300">mais escolhido</span>
                )}
              </div>
              <p className={`mt-3 text-[14px] leading-relaxed ${t.highlight ? 'text-muted' : 'text-bg/75'}`}>{t.desc}</p>
              <div className="mt-7 flex items-baseline gap-2">
                {!t.custom && <span className={`font-mono text-sm ${t.highlight ? 'text-muted' : 'text-bg/60'}`}>R$</span>}
                <span className="font-serif text-6xl tracking-tight">
                  {t.custom ? 'Sob medida' : fmt(annual ? Math.round(t.monthly! * 0.85) : t.monthly!)}
                </span>
                {!t.custom && <span className={`text-sm ${t.highlight ? 'text-muted' : 'text-bg/60'}`}>/ mês</span>}
              </div>
              <span className={`mt-1 text-[13px] ${t.highlight ? 'text-muted' : 'text-bg/60'}`}>
                {t.custom ? t.sub : annual ? `cobrado anualmente · ${t.sub}` : `cobrado mensalmente · ${t.sub}`}
              </span>
              <Link
                href="/agendar"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition ${
                  t.highlight ? 'bg-ink text-bg hover:bg-moss-900' : 'border border-bg/25 text-bg hover:border-bg/55'
                }`}
              >
                {t.custom ? 'Falar com especialista' : 'Agendar demonstração'}
                <IconArrow size={16} />
              </Link>
              <ul className={`mt-7 space-y-2.5 border-t pt-5 text-[14px] ${t.highlight ? 'border-line text-ink' : 'border-bg/10 text-bg/85'}`}>
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <IconCheck size={16} className={`mt-0.5 shrink-0 ${t.highlight ? 'text-moss-700' : 'text-mustard-300'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
