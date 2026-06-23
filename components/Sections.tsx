"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconArrow,
  IconArrowOut,
  IconCheck,
  IconShield,
  IconReceipt,
  IconBox,
  IconChartLine,
  IconQuote,
  IconGlobe,
  IconBolt,
  IconPhone,
  IconMail,
  IconCalendar,
  IconGear,
  IconRuler,
  IconLayers,
  IconFactory,
  IconFlame,
  IconTree,
} from "./Icons";
import {
  MiniFinance,
  MiniInventory,
  MiniSales,
  MiniFiscal,
  MiniHR,
  MiniBI,
} from "./Illustrations";
import { Counter } from "./Extras";
import { Scheduler } from "./Scheduler";
import { legal } from "@/lib/legal";

export const Trust = () => {
  const creds = [
    "Bloco K & SPED nativos",
    "Nesting de chapa e MDF",
    "Custo real por OP",
    "Ordem de produção no coletor",
    "MRP de matéria-prima",
    "Implantação assistida",
  ];
  return (
    <section className="border-y border-line bg-paper py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Tudo o que uma indústria precisa — em um sistema só
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {creds.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 font-serif text-lg tracking-tight text-ink/70"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Problem = () => {
  const pains = [
    {
      Icon: IconChartLine,
      t: "Orçamento no chute",
      d: "Você precifica peça sob medida no Excel, sem saber o custo real de material, processo e mão de obra. Aí fecha venda que dava prejuízo.",
    },
    {
      Icon: IconLayers,
      t: "Sobra de chapa e MDF",
      d: "Cada plano de corte feito no olho deixa retalho que vira lixo. No fim do ano, é caminhão de dinheiro indo pra caçamba.",
    },
    {
      Icon: IconGear,
      t: "Ordem de produção perdida",
      d: "O cliente liga perguntando o pedido e ninguém sabe em que máquina está. Quadro branco, papel e WhatsApp não são controle de chão de fábrica.",
    },
    {
      Icon: IconReceipt,
      t: "Custo por peça é um mistério",
      d: "No fechamento, você descobre que o mês foi fraco — mas não sabe qual produto deu lucro e qual sangrou a margem.",
    },
    {
      Icon: IconBox,
      t: "Máquina parada por falta de material",
      d: "Sem MRP ligado à produção, a matéria-prima acaba no meio da OP. Operador parado é o desperdício mais caro da fábrica.",
    },
    {
      Icon: IconShield,
      t: "Medo do Bloco K e do SPED",
      d: "A obrigação fiscal da indústria exige rastrear consumo e produção. Sem sistema, é torcer para a auditoria não bater na porta.",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· você reconhece isso?
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          A fábrica produz.{" "}
          <span className="italic text-moss-700">O dinheiro vaza</span> sem
          ninguém ver.
        </h2>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Não falta esforço no seu chão de fábrica — falta controle. Esses são os
          seis vazamentos que mais corroem a margem de metalúrgicas e moveleiras.
        </p>
      </div>

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        {pains.map(({ Icon, t, d }, i) => (
          <article
            key={t}
            className="reveal bg-bg p-7"
            data-delay={(i % 3) + 1}
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-mustard-50 text-mustard-500">
              <Icon size={22} />
            </span>
            <h3 className="mt-5 font-serif text-2xl leading-tight text-ink">
              {t}
            </h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{d}</p>
          </article>
        ))}
      </div>

      <div className="reveal mt-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl border border-moss-200 bg-moss-50 px-7 py-6">
        <p className="max-w-xl font-serif text-2xl leading-snug text-ink">
          E se cada uma dessas dores tivesse o número exato — e a solução — na sua
          frente?
        </p>
        <Link
          href="/agendar"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-moss-700 px-6 py-3.5 text-base text-bg transition hover:bg-moss-800"
        >
          Quero ver na prática
          <IconArrow
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
};

export const Pillars = () => {
  const items = [
    {
      n: "01",
      t: "Orçou certo, produziu no preço.",
      d: "A precificação puxa a ficha técnica real — material, processo, dobra, solda, pintura, usinagem e mão de obra. Você dá o preço em minutos e entra na produção sabendo a margem de cada peça.",
      Icon: IconRuler,
    },
    {
      n: "02",
      t: "Cada chapa e cada placa rende mais.",
      d: "O plano de corte otimiza o aproveitamento de chapa de aço e MDF automaticamente. Menos retalho, menos compra de material, mais peça saindo da mesma matéria-prima.",
      Icon: IconLayers,
    },
    {
      n: "03",
      t: "Chão de fábrica em tempo real.",
      d: "Cada ordem de produção apontada por coletor: você sabe onde está cada pedido, qual máquina é o gargalo e o custo real acumulado — sem esperar o fim do mês para descobrir.",
      Icon: IconGear,
    },
  ];
  return (
    <section id="plataforma" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal grid items-end gap-8 md:grid-cols-2">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· a plataforma
          </span>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Um ERP feito para{" "}
            <span className="italic text-moss-700">quem fabrica</span> — não para
            quem só vende software.
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-muted md:pl-8">
          O VentureERP nasceu dentro de metalúrgicas e moveleiras de verdade.
          Cada tela entende ordem de produção, ficha técnica e aproveitamento de
          material — porque foi desenhada por quem já apanhou desses problemas.
        </p>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
        {items.map(({ n, t, d, Icon }, i) => (
          <article
            key={n}
            className="card-accent reveal group bg-bg p-8 transition hover:bg-paper"
            data-delay={i + 1}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-[0.18em] text-muted">
                {n}
              </span>
              <Icon
                size={24}
                className="text-moss-700 transition-transform group-hover:rotate-[8deg]"
              />
            </div>
            <h3 className="mt-10 font-serif text-3xl leading-tight text-ink">
              {t}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{d}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export const Modules = () => {
  const mods = [
    {
      slug: "engenharia",
      Icon: IconRuler,
      title: "Engenharia & Ficha Técnica",
      body: "Estrutura de produto (BOM) multinível, roteiro de produção e tempos por operação. A mesma ficha alimenta o orçamento, a compra e o chão de fábrica.",
      tags: ["BOM multinível", "Roteiro", "Tempos"],
      Mini: MiniBI,
    },
    {
      slug: "corte",
      Icon: IconLayers,
      title: "Plano de Corte & Aproveitamento",
      body: "Nesting automático de chapa de aço e MDF que reduz a sobra. Veja o aproveitamento de cada placa antes de cortar e pare de jogar dinheiro na caçamba.",
      tags: ["Nesting", "Chapa & MDF", "Menos sobra"],
      Mini: MiniInventory,
    },
    {
      slug: "pcp",
      Icon: IconGear,
      title: "PCP & Chão de Fábrica",
      body: "Ordem de produção, sequenciamento por máquina, apontamento por coletor e OEE. Saiba onde está cada pedido e qual posto é o gargalo, em tempo real.",
      tags: ["Ordem de produção", "Apontamento", "OEE"],
      Mini: MiniSales,
    },
    {
      slug: "orcamento",
      Icon: IconChartLine,
      title: "Orçamento & Vendas",
      body: "Precificação de peça sob medida com custo real, proposta com aprovação digital e CRM de funil. Do orçamento à NF emitida sem refazer cadastro.",
      tags: ["Precificação", "Proposta", "CRM"],
      Mini: MiniFinance,
    },
    {
      slug: "estoque",
      Icon: IconBox,
      title: "Estoque & Compras",
      body: "Matéria-prima, produto em processo e acabado num só lugar. MRP liga a necessidade da OP direto ao pedido de compra — máquina não para por falta de material.",
      tags: ["MRP", "Matéria-prima", "Compras"],
      Mini: MiniHR,
    },
    {
      slug: "fiscal",
      Icon: IconReceipt,
      title: "Fiscal Industrial & Custos",
      body: "NF-e, Bloco K, SPED e custo real por OP gerados automaticamente. Conformidade da indústria sem consultoria — e a margem de cada peça na palma da mão.",
      tags: ["NF-e", "Bloco K", "Custo por OP"],
      Mini: MiniFiscal,
    },
  ];
  return (
    <section id="modulos" className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
              ·· módulos
            </span>
            <h2 className="mt-3 max-w-2xl font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              Do desenho à NF.{" "}
              <span className="italic text-moss-700">Um sistema só</span>.
            </h2>
          </div>
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink transition hover:border-ink/50"
          >
            Ver tudo em uma demo{" "}
            <IconArrow
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mods.map(({ slug, Icon, title, body, tags, Mini }, i) => (
            <Link
              key={title}
              href={`/modulo/${slug}`}
              className="card-accent reveal group block rounded-2xl border border-line bg-bg p-7 transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(20,32,26,.4)]"
              data-delay={(i % 3) + 1}
            >
              <div className="flex items-start justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-moss-50 text-moss-700">
                  <Icon size={22} />
                </span>
                <IconArrowOut
                  size={18}
                  className="text-muted opacity-0 transition group-hover:opacity-100"
                />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-ink">{title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-muted">
                {body}
              </p>
              <div className="mt-5">
                <Mini />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-[10px] text-moss-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Compare = () => {
  const rows: [string, string, string, string][] = [
    ["Orçamento de peça sob medida", "Minutos, com ficha técnica real", "Horas no Excel, no chute", "Não calcula processo"],
    ["Sobra de chapa e MDF", "Plano de corte otimizado", "No olho do operador", "Não tem nesting"],
    ["Custo real por peça", "Em tempo real, por OP", "Estimado no fim do mês", "Rateio genérico"],
    ["Ordem de produção", "Apontada no chão de fábrica", "Quadro branco e papel", "Módulo caro à parte"],
    ["Bloco K e SPED", "Gerados automaticamente", "Risco de multa", "Depende de consultoria"],
    ["Tempo até operar", "30 dias", "—", "8 a 18 meses"],
    ["Feito para indústria", "Sim, nativo", "Não", "Adaptado de outro setor"],
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· comparativo
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          O que você{" "}
          <span className="italic text-moss-700">perde todo mês</span> na
          planilha e no ERP genérico.
        </h2>
      </div>

      <div
        className="reveal mt-14 overflow-hidden rounded-2xl border border-line bg-bg"
        data-delay="1"
      >
        <div className="grid grid-cols-[1.3fr_1.2fr_1fr_1fr] border-b border-line bg-paper text-[12px] font-mono uppercase tracking-[0.16em] text-muted">
          <div className="px-6 py-4"></div>
          <div className="relative px-6 pb-4 pt-7 text-moss-700">
            <span className="absolute left-6 top-2 rounded-full bg-moss-700 px-2.5 py-0.5 text-[10px] text-bg">
              recomendado
            </span>
            VentureERP
          </div>
          <div className="px-6 py-4">Planilhas</div>
          <div className="px-6 py-4">ERP genérico</div>
        </div>

        {rows.map(([label, v, l, p], i) => (
          <div
            key={label}
            className={`grid grid-cols-[1.3fr_1.2fr_1fr_1fr] items-center text-[15px] ${i % 2 === 0 ? "bg-bg" : "bg-paper/50"}`}
          >
            <div className="border-b border-line/60 px-6 py-5 font-medium text-ink">
              {label}
            </div>
            <div className="border-b border-line/60 bg-moss-50/60 px-6 py-5">
              <span className="inline-flex items-center gap-2 text-moss-700">
                <IconCheck size={16} /> {v}
              </span>
            </div>
            <div className="border-b border-line/60 px-6 py-5 text-muted">
              {l}
            </div>
            <div className="border-b border-line/60 px-6 py-5 text-muted">
              {p}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Band = () => (
  <section className="relative overflow-hidden bg-moss-900 py-28 text-bg">
    <div
      className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, rgba(220,192,59,.18), transparent)",
      }}
    />
    <div
      className="pointer-events-none absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full"
      style={{
        background:
          "radial-gradient(closest-side, rgba(155,176,86,.16), transparent)",
      }}
    />

    <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1fr_1.2fr] lg:px-10">
      <div className="reveal">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mustard-300">
          ·· painel de produção
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Todo o chão de fábrica em{" "}
          <span className="italic text-mustard-300">uma tela</span>.
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
          Ordens em produção, OEE por máquina, aproveitamento de material e
          atrasos — atualizados a cada apontamento. Você decide olhando o número
          real, não o relato do encarregado.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Saiba o status de cada OP e quando o pedido fica pronto.",
            "Veja o gargalo da fábrica antes que ele estoure o prazo.",
            "Custo real acumulado por ordem, peça e cliente — em tempo real.",
          ].map((t) => (
            <li
              key={t}
              className="flex items-start gap-3 text-[15px] text-bg/85"
            >
              <IconCheck
                size={18}
                className="mt-0.5 shrink-0 text-mustard-300"
              />
              {t}
            </li>
          ))}
        </ul>
      </div>

      <div className="reveal" data-delay="2">
        <div className="rounded-2xl border border-bg/15 bg-moss-800/60 p-4 backdrop-blur">
          <div className="flex items-center justify-between border-b border-bg/10 pb-3 text-[11px] font-mono text-bg/60">
            <span>Painel · Produção</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-mustard-300 animate-pulse-soft" />
              último apontamento · 12s atrás
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["OPs em produção", "37", "+5"],
              ["OEE médio", "82%", "+6 pts"],
              ["Sobra de material", "4,1%", "−2,3 pts"],
            ].map(([l, v, d]) => (
              <div
                key={l}
                className="rounded-lg border border-bg/10 bg-moss-900/70 p-3"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/55">
                  {l}
                </p>
                <p className="mt-1 font-serif text-2xl">{v}</p>
                <p className="mt-1 font-mono text-[10px] text-mustard-300">
                  {d}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-5 gap-3">
            <div className="col-span-3 rounded-lg border border-bg/10 bg-moss-900/70 p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/55">
                  Aproveitamento de material · 12 sem.
                </p>
                <p className="font-mono text-[10px] text-mustard-300">
                  subindo
                </p>
              </div>
              <svg viewBox="0 0 400 130" className="mt-2 w-full">
                {[20, 50, 80, 110].map((y, i) => (
                  <line
                    key={i}
                    x1="0"
                    x2="400"
                    y1={y}
                    y2={y}
                    stroke="rgba(255,255,255,.08)"
                  />
                ))}
                <path
                  d="M0 90 L36 80 L72 88 L108 65 L144 72 L180 50 L216 56 L252 38 L288 44 L324 24 L360 30 L400 18"
                  fill="none"
                  stroke="#DCC03B"
                  strokeWidth="2.2"
                />
                <path
                  d="M0 90 L36 80 L72 88 L108 65 L144 72 L180 50 L216 56 L252 38 L288 44 L324 24 L360 30 L400 18 L400 130 L0 130 Z"
                  fill="rgba(220,192,59,.18)"
                />
                <path
                  d="M252 38 L288 44 L324 24 L360 30 L400 18"
                  fill="none"
                  stroke="#9CB056"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
            </div>
            <div className="col-span-2 rounded-lg border border-bg/10 bg-moss-900/70 p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/55">
                Alertas · agora
              </p>
              <ul className="mt-3 space-y-3 text-[13px]">
                {[
                  ["Gargalo", "Dobradeira 02 sobrecarregada", "#DCC03B"],
                  ["Atraso", "OP 4821 — 2 dias", "#9CB056"],
                  ["Material", "Chapa #16 abaixo do mínimo", "#DCC03B"],
                ].map(([k, m, c]) => (
                  <li key={m} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: c }}
                    />
                    <span>
                      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-bg/55">
                        {k}
                      </span>
                      <span className="text-bg/90">{m}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const DemoBand = () => (
  <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
    <div className="grid items-center gap-10 rounded-[28px] border border-line bg-paper p-8 md:grid-cols-[1.1fr_1fr] md:p-14">
      <div className="reveal">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· veja antes de decidir
        </span>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
          Não acredite na promessa.{" "}
          <span className="italic text-moss-700">Veja o sistema rodando.</span>
        </h2>
        <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted">
          Gravamos demonstrações curtas de cada módulo — orçamento, plano de
          corte, ordem de produção, fiscal. Assista no seu ritmo, sem falar com
          vendedor, e chegue à conversa já sabendo o que perguntar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 rounded-full bg-moss-700 px-6 py-3.5 text-base text-bg transition hover:bg-moss-800"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-mustard-300 text-moss-900">
              <IconBolt size={14} />
            </span>
            Assistir demonstração
          </Link>
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-base text-ink transition hover:border-ink/50"
          >
            Prefiro ao vivo <IconArrow size={16} />
          </Link>
        </div>
      </div>

      <div className="reveal grid grid-cols-2 gap-3" data-delay="1">
        {[
          { Icon: IconChartLine, t: "Orçamento de peça", d: "4 min" },
          { Icon: IconLayers, t: "Plano de corte", d: "3 min" },
          { Icon: IconGear, t: "Ordem de produção", d: "5 min" },
          { Icon: IconReceipt, t: "Bloco K & fiscal", d: "3 min" },
        ].map(({ Icon, t, d }) => (
          <Link
            key={t}
            href="/demo"
            className="group rounded-2xl border border-line bg-bg p-5 transition hover:-translate-y-0.5 hover:border-moss-700"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-moss-50 text-moss-700">
                <Icon size={20} />
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-mustard-300 text-moss-900 transition group-hover:scale-105">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <path d="M4 2.5l8 4.5-8 4.5z" />
                </svg>
              </span>
            </div>
            <p className="mt-4 font-serif text-lg leading-tight text-ink">{t}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {d} · demonstração
            </p>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export const Stats = () => {
  const stats = [
    {
      value: 19,
      prefix: "−",
      suffix: "%",
      l: "de desperdício de matéria-prima",
      s: "estimativa baseada na Tecnofer",
    },
    {
      value: 22,
      prefix: "+",
      suffix: "%",
      l: "de performance na fabricação",
      s: "projeção a partir de cliente real",
    },
    {
      value: 37,
      suffix: "%",
      l: "dos processos manuais automatizados",
      s: "estimativa baseada na Tecnofer",
    },
    {
      value: 30,
      suffix: " dias",
      l: "da assinatura ao chão de fábrica operando",
      s: "implantação 100% assistida",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· projeção de resultados
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          O que sua fábrica{" "}
          <span className="italic text-moss-700">para de perder</span> com o
          VentureERP.
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          Estimativas baseadas nos resultados reais da Tecnofer. Os números
          variam conforme o porte, o mix de produtos e os processos de cada
          fábrica.
        </p>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {stats.map((st, i) => (
          <div key={st.l} className="reveal bg-bg p-8" data-delay={i + 1}>
            <p className="font-serif text-[68px] leading-none tracking-tightest text-ink">
              <Counter
                value={st.value}
                prefix={st.prefix || ""}
                suffix={st.suffix || ""}
              />
            </p>
            <p className="mt-4 text-[15px] leading-snug text-ink">{st.l}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {st.s}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export const Workflow = () => {
  const steps = [
    {
      n: "01",
      t: "Diagnóstico do chão de fábrica",
      d: "Em 7 dias mapeamos seus processos, máquinas e fichas técnicas com nossa equipe de implantação. Você sai com cronograma fechado — não com promessa no ar.",
    },
    {
      n: "02",
      t: "Migração sem parar a produção",
      d: "Importamos cadastro de produtos, estrutura (BOM), clientes, estoque e histórico. Validamos em paralelo ao seu sistema atual. Máquina não para, dado não se perde.",
    },
    {
      n: "03",
      t: "Ativação por área",
      d: "Orçamento → produção → fiscal, uma área por vez, com treinamento no próprio posto de trabalho. Sua equipe aprende usando — não sentada numa sala com manual.",
    },
    {
      n: "04",
      t: "Parceiro de longo prazo",
      d: "CSM que entende de indústria, revisões trimestrais e roadmap transparente. A fábrica cresce, o sistema cresce junto — sem abandono depois da virada.",
    },
  ];
  return (
    <section id="workflow" className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal grid items-end gap-6 md:grid-cols-[1.1fr_1fr]">
          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Do contrato à primeira{" "}
            <span className="italic text-moss-700">OP no preço</span>: 30 dias.
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            Implantação não é só software — é um time dentro da sua fábrica. Do
            kick-off ao primeiro mês fechado no custo certo. E não vai embora
            depois que o contrato assina.
          </p>
        </div>

        <ol className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ n, t, d }, i) => (
            <li
              key={n}
              className="reveal relative bg-bg p-8"
              data-delay={i + 1}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-[0.16em] text-moss-700">
                  {n}
                </span>
                {i < steps.length - 1 && (
                  <IconArrow size={20} className="text-mustard-400" />
                )}
              </div>
              <h3 className="mt-8 font-serif text-2xl leading-tight text-ink">
                {t}
              </h3>
              <p className="mt-3 text-[14.5px] leading-relaxed text-muted">
                {d}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export const Testimonials = () => {
  const metrics: [string, string][] = [
    ["−19%", "de desperdício de matéria-prima"],
    ["+22%", "de performance na fabricação"],
    ["37%", "dos processos automatizados"],
  ];
  return (
    <section id="cliente" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· cliente
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          Uma metalúrgica de verdade.{" "}
          <span className="italic text-moss-700">Resultados de verdade.</span>
        </h2>
      </div>

      <div
        className="reveal mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-[1.3fr_1fr]"
        data-delay="1"
      >
        <figure className="bg-bg p-9 md:p-12">
          <IconQuote size={30} className="text-mustard-400" />
          <blockquote className="mt-6 font-serif text-[26px] leading-snug text-ink md:text-[30px]">
            "Trocamos planilhas e sistemas legados pelo VentureERP e
            reorganizamos as ordens de produção. O desperdício de matéria-prima
            caiu, a fábrica passou a render mais e boa parte do trabalho manual
            virou processo automático."
          </blockquote>
          <figcaption className="mt-8 flex items-center gap-3 border-t border-line pt-6">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-moss-700 font-serif text-bg">
              R
            </span>
            <span className="text-sm">
              <span className="block text-ink">Rulian · Diretor</span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Tecnofer · Indústria metalúrgica · 50 colaboradores
              </span>
            </span>
          </figcaption>
        </figure>

        <div className="grid bg-bg">
          {metrics.map(([n, l], i) => (
            <div
              key={l}
              className={`flex flex-col justify-center p-8 ${
                i < metrics.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <p className="font-serif text-5xl tracking-tight text-ink">{n}</p>
              <p className="mt-2 text-[14px] leading-snug text-muted">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Compliance = () => {
  const items = [
    { k: "Bloco K", d: "Livro de produção e estoque" },
    { k: "SPED Fiscal", d: "EFD gerado pelo sistema" },
    { k: "LGPD", d: "Encarregado (DPO) nomeado" },
    { k: "HTTPS / TLS", d: "Tráfego criptografado em trânsito" },
    { k: "Acesso restrito", d: "Painel sob autenticação" },
    { k: "Resposta a incidentes", d: "Conforme art. 48 da LGPD" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="reveal grid items-end gap-6 md:grid-cols-[1.3fr_1fr]">
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          Sua produção é crítica.{" "}
          <span className="italic text-moss-700">Tratamos como tal.</span>
        </h2>
        <p className="text-[16px] leading-relaxed text-muted">
          Conformidade fiscal da indústria de série — Bloco K e SPED — sobre
          infraestrutura em nuvem com criptografia em trânsito e acesso restrito.
          Tratamos seus dados conforme a LGPD, com Encarregado nomeado e{" "}
          <Link href="/seguranca" className="text-moss-700 underline-offset-2 hover:underline">
            política de segurança
          </Link>{" "}
          transparente.
        </p>
      </div>

      <div
        className="reveal mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6"
        data-delay="1"
      >
        {items.map(({ k, d }) => (
          <div key={k} className="bg-bg p-5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-moss-50 text-moss-700">
              <IconShield size={18} />
            </span>
            <p className="mt-4 font-serif text-lg text-ink">{k}</p>
            <p className="mt-1 text-[12px] leading-snug text-muted">{d}</p>
          </div>
        ))}
      </div>

      <div className="reveal mt-6 flex flex-wrap items-center gap-4 rounded-xl border border-line bg-paper px-5 py-4 text-[13px] text-muted">
        <span className="grid h-2 w-2 place-items-center rounded-full bg-moss-500 animate-pulse-soft"></span>
        Todos os sistemas operacionais.
        <Link
          href="/status"
          className="ml-auto inline-flex items-center gap-1.5 text-moss-700 hover:underline"
        >
          Status do sistema <IconArrow size={14} />
        </Link>
      </div>
    </section>
  );
};

export const CTA = () => (
  <section
    id="cta"
    className="grain relative mx-auto max-w-7xl overflow-hidden px-6 pb-28 lg:px-10"
  >
    <div className="relative overflow-hidden rounded-[28px] border border-moss-800 bg-moss-900 p-8 text-bg md:p-14">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(220,192,59,.25), transparent)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(155,176,86,.18), transparent)" }}
      />

      <div className="relative grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mustard-400 bg-mustard-300 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-moss-800">
            <IconFactory size={14} /> 30 minutos que mudam a fábrica
          </span>
          <h2 className="mt-6 font-serif text-5xl leading-[1] tracking-tightest md:text-6xl">
            Pronto para tirar a fábrica
            <br />
            do <span className="italic text-mustard-300">escuro</span>?
          </h2>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
            Escolha o horário ao lado. Um especialista do seu setor mostra o
            VentureERP resolvendo as suas dores reais — orçamento, sobra de
            material e ordem de produção. Sem PowerPoint, sem script.
          </p>
          <ul className="mt-7 space-y-2.5">
            {[
              "Demonstração com cenários da sua indústria",
              "Veja o custo real por peça calculado ao vivo",
              "Traga seu encarregado e seu financeiro",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-[14.5px] text-bg/85">
                <IconCheck size={15} className="shrink-0 text-mustard-300" />
                {t}
              </li>
            ))}
          </ul>
          <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/55">
            Sem custo · Sem compromisso · Confirmação imediata
          </p>
        </div>

        <Scheduler source="Home · CTA final" />
      </div>
    </div>
  </section>
);

export const ContactSection = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "Dúvida comercial", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <section id="contato" className="border-t border-line bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div className="reveal">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· contato</span>
            <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              Prefere falar com a gente{" "}
              <span className="italic text-moss-700">diretamente</span>?
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-muted">
              Comercial, parcerias ou suporte — nossa equipe responde em até 1 dia útil. Se quiser, já deixe agendada uma demonstração.
            </p>

            <div className="mt-10 space-y-5">
              {[
                {
                  Icon: IconMail,
                  label: "E-mail comercial",
                  value: "contato@venturerp.com",
                  href: "mailto:contato@venturerp.com",
                },
                {
                  Icon: IconPhone,
                  label: "WhatsApp",
                  value: "+55 (44) 99180-5405",
                  href: "https://wa.me/5544991805405",
                },
                {
                  Icon: IconCalendar,
                  label: "Agendar demonstração",
                  value: "Escolha o melhor horário",
                  href: "/agendar",
                },
              ].map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-xl border border-line bg-bg p-4 transition hover:border-moss-700"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-moss-50 text-moss-700 transition group-hover:bg-moss-100">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{label}</p>
                    <p className="mt-0.5 text-[15px] text-ink">{value}</p>
                  </div>
                  <IconArrow size={16} className="ml-auto text-muted opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
                </a>
              ))}
            </div>
          </div>

          <div className="reveal" data-delay="1">
            {state === "ok" ? (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-line bg-bg p-10 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-moss-50 text-moss-700">
                  <IconCheck size={24} />
                </span>
                <h3 className="font-serif text-2xl text-ink">Mensagem enviada!</h3>
                <p className="max-w-xs text-[14px] text-muted">Recebemos sua mensagem e retornaremos em até 1 dia útil no e-mail informado.</p>
              </div>
            ) : (
              <form
                className="rounded-2xl border border-line bg-bg p-7"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Nome *</span>
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={form.name}
                      onChange={(e) => setForm((f: typeof form) => ({ ...f, name: e.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">E-mail *</span>
                    <input
                      type="email"
                      required
                      placeholder="voce@empresa.com.br"
                      value={form.email}
                      onChange={(e) => setForm((f: typeof form) => ({ ...f, email: e.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
                    />
                  </label>
                </div>
                <label className="mt-4 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Assunto</span>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm((f: typeof form) => ({ ...f, subject: e.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-moss-700 focus:outline-none"
                  >
                    <option>Dúvida comercial</option>
                    <option>Proposta / Orçamento</option>
                    <option>Suporte técnico</option>
                    <option>Parceria</option>
                    <option>Imprensa</option>
                    <option>Outro</option>
                  </select>
                </label>
                <label className="mt-4 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Mensagem *</span>
                  <textarea
                    required
                    rows={4}
                    placeholder="Conta um pouco sobre sua fábrica e como podemos ajudar…"
                    value={form.message}
                    onChange={(e) => setForm((f: typeof form) => ({ ...f, message: e.target.value }))}
                    className="mt-1.5 w-full resize-none rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
                  />
                </label>
                {state === "error" && (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                    Algo deu errado. Tente novamente ou nos envie um e-mail diretamente.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={state === "loading"}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss-800 px-5 py-3 text-sm text-bg transition hover:bg-moss-900 disabled:opacity-60"
                >
                  {state === "loading" ? "Enviando…" : "Enviar mensagem"}
                  {state !== "loading" && <IconArrow size={15} />}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

const footerCols: [string, [string, string][]][] = [
  [
    "Plataforma",
    [
      ["Engenharia & Ficha Técnica", "/modulo/engenharia"],
      ["Plano de Corte", "/modulo/corte"],
      ["PCP & Chão de Fábrica", "/modulo/pcp"],
      ["Orçamento & Vendas", "/modulo/orcamento"],
      ["Estoque & Compras", "/modulo/estoque"],
      ["Fiscal Industrial", "/modulo/fiscal"],
    ],
  ],
  [
    "Empresa",
    [
      ["A plataforma", "/#plataforma"],
      ["Para o seu setor", "/#setores"],
      ["Planos", "/#planos"],
      ["Cases", "/cases"],
      ["Implantação", "/#workflow"],
    ],
  ],
  [
    "Recursos",
    [
      ["Agendar demonstração", "/agendar"],
      ["Ver demonstração", "/demo"],
      ["Módulos", "/#modulos"],
      ["Status do sistema", "/status"],
      ["Contato", "/#contato"],
    ],
  ],
];

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Assinante do boletim", email, source: "Boletim mensal" }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "ok") {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-moss-200 bg-moss-50 px-5 py-4">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-moss-700 text-bg">
          <IconCheck size={18} />
        </span>
        <p className="text-[14px] text-ink">
          Inscrição confirmada! Você receberá o próximo boletim em <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <form className="flex items-center gap-2" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="voce@empresa.com.br"
        className="flex-1 rounded-full border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-moss-800 px-5 py-3 text-sm text-bg transition hover:bg-moss-900 disabled:opacity-60"
      >
        {state === "loading" ? "Enviando…" : "Inscrever"}
        {state !== "loading" && <IconArrow size={14} />}
      </button>
    </form>
  );
}

export const Footer = () => (
  <footer className="border-t border-line bg-paper">
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
              <path
                d="M4 5 L15 24 L26 5"
                fill="none"
                stroke="#14201A"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="15" cy="6" r="2.6" fill="#CBAB1F" />
            </svg>
            <span className="font-serif text-2xl tracking-tight text-ink">
              Venture<span style={{ color: "#CBAB1F" }}>ERP</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">
            O ERP das metalúrgicas e moveleiras brasileiras que decidiram
            produzir com controle. Feito por quem entende de chão de fábrica —
            não só de software.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconFlame size={16} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconTree size={16} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconGlobe size={16} />
            </span>
          </div>
        </div>
        {footerCols.map(([t, ls]) => (
          <div key={t}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss-700">
              {t}
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-ink/85">
              {ls.map(([l, h]) => (
                <li key={l}>
                  <Link href={h} className="transition hover:text-moss-700">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-10 rounded-2xl border border-line bg-bg p-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss-700">
            ·· boletim mensal
          </p>
          <p className="mt-2 font-serif text-3xl leading-tight text-ink">
            Um e-mail por mês que vale a leitura.
          </p>
          <p className="mt-2 text-[14px] text-muted">
            Mudanças na legislação fiscal da indústria, novidades de produto e
            cases reais de metalúrgicas e moveleiras. Escrito por quem opera.
          </p>
        </div>
        <NewsletterForm />
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8 text-[12px] text-muted">
        <span>
          © 2026 {legal.nomeFantasia} · CNPJ {legal.cnpj} · Maringá/PR, BR
        </span>
        <span className="flex gap-5">
          <Link href="/privacidade" className="hover:text-moss-700">Privacidade</Link>
          <Link href="/termos" className="hover:text-moss-700">Termos</Link>
          <Link href="/lgpd" className="hover:text-moss-700">LGPD</Link>
          <Link href="/seguranca" className="hover:text-moss-700">Segurança</Link>
        </span>
      </div>

      <div className="mt-12 select-none overflow-hidden">
        <p
          aria-hidden="true"
          className="font-serif text-[clamp(80px,18vw,260px)] leading-[0.85] tracking-tightest"
          style={{ color: "rgba(20,32,26,.07)" }}
        >
          VentureERP<span style={{ color: "rgba(203,171,31,.32)" }}>.</span>
        </p>
      </div>
    </div>
  </footer>
);
