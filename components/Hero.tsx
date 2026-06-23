"use client";

import Link from "next/link";
import { Asterisk, HeroArtwork, Squiggle } from "./Illustrations";
import { IconArrow, IconBolt } from "./Icons";

export const Hero = () => (
  <section
    id="top"
    className="grain relative overflow-hidden pb-12 pt-32 md:pt-40"
  >
    <div className="pointer-events-none absolute -right-20 top-32 h-72 w-72 text-mustard-200/70">
      <Asterisk size="100%" />
    </div>

    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr] lg:px-10">
      <div className="reveal">
        <span className="inline-flex items-center gap-2 rounded-full border border-moss-200 bg-moss-50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-moss-700">
          <span className="h-1.5 w-1.5 rounded-full bg-moss-500 animate-pulse" />
          ERP para metalúrgicas e moveleiras
        </span>
        <h1 className="mt-6 font-serif text-[58px] leading-[0.96] tracking-tightest text-ink md:text-[82px]">
          Chega de orçar peça
          <br />
          no escuro e{" "}
          <span className="italic text-moss-700">
            <Squiggle />
            perder na sobra.
          </span>
        </h1>

        <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-muted">
          Do orçamento ao chão de fábrica: ficha técnica, plano de corte de chapa
          e MDF, ordem de produção, custo real por peça e fiscal industrial
          (Bloco K) — tudo em um sistema só. Feito para quem vive de produção sob
          medida.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base text-bg transition hover:bg-moss-900"
          >
            Agendar demonstração
            <IconArrow
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/demo"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-transparent px-6 py-3.5 text-base text-ink transition hover:border-ink/40"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-mustard-300 text-moss-800">
              <IconBolt size={14} />
            </span>
            Ver o sistema funcionando
          </Link>
        </div>

        <p className="mt-4 text-[13px] text-muted">
          Planos a partir de{" "}
          <Link href="/#planos" className="text-moss-700 underline-offset-2 hover:underline">
            R$ 1.267/mês
          </Link>{" "}
          · sem licença por usuário · implantação assistida em 30 dias.
        </p>

        <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
          {[
            ["30 dias", "do contrato ao chão de fábrica"],
            ["−31%", "de sobra de chapa e MDF"],
            ["100%", "Bloco K e SPED em dia"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-serif text-3xl text-ink">{n}</dt>
              <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                {l}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="reveal" data-delay="2">
        <HeroArtwork />
      </div>
    </div>
  </section>
);
