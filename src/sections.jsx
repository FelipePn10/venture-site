// All page sections — Nav, Hero, Trust, Pillars, Modules, Dashboard, Stats,
// Workflow, Testimonials, Pricing, FAQ, CTA, Footer.

const { useState, useEffect, useRef } = React;

// ─── Reveal-on-scroll hook ──────────────────────────────────────────────
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("in"),
        ),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

// ─── Brand mark ─────────────────────────────────────────────────────────
const Logo = ({ tone = "dark" }) => {
  const ink = tone === "dark" ? "#14201A" : "#FAF8EC";
  const acc = "#CBAB1F";
  return (
    <a href="#top" className="group flex items-center gap-2.5">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <path
          d="M4 5 L15 24 L26 5"
          fill="none"
          stroke={ink}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="15" cy="6" r="2.6" fill={acc} />
      </svg>
      <span
        className="font-serif text-2xl tracking-tight"
        style={{ color: ink }}
      >
        Venture<span style={{ color: acc }}>ERP</span>
      </span>
    </a>
  );
};

// ─── Navigation ─────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    ["Plataforma", "#plataforma"],
    ["Módulos", "#modulos"],
    ["Para quem", "#workflow"],
    ["Clientes", "#clientes"],
    ["Planos", "#planos"],
  ];
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled
          ? "border-b border-line/80 bg-bg/85 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          {links.map(([l, h]) => (
            <a key={l} href={h} className="relative transition hover:text-ink">
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-moss-700 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm text-ink/80 hover:text-ink md:inline"
          >
            Entrar
          </a>
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-full bg-moss-700 px-4 py-2 text-sm text-bg shadow-sm transition hover:bg-moss-800"
          >
            Falar com vendas
            <IconArrow
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper md:hidden"
            aria-label="Menu"
          >
            <span className="space-y-1.5">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <div className="space-y-3 px-6 py-5">
            {links.map(([l, h]) => (
              <a
                key={l}
                href={h}
                onClick={() => setOpen(false)}
                className="block text-base text-ink"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

// ─── Hero ────────────────────────────────────────────────────────────────
const Hero = () => (
  <section
    id="top"
    className="grain relative overflow-hidden pb-12 pt-32 md:pt-40"
  >
    {/* Decorative big asterisk */}
    <div className="pointer-events-none absolute -right-20 top-32 h-72 w-72 text-mustard-200/70">
      <Asterisk size="100%" />
    </div>

    <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-[1.05fr_1fr] lg:px-10">
      <div className="reveal">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
          <span className="h-1.5 w-1.5 rounded-full bg-moss-500 animate-pulse-soft" />
          Versão 2026 · acaba de chegar
        </span>

        <h1 className="mt-6 font-serif text-[64px] leading-[0.96] tracking-tightest text-ink md:text-[88px]">
          Eleve a gestão da sua empresa
          <br />.{" "}
          <span className="italic text-moss-700">
            <Squiggle />
            Para sempre.
          </span>
        </h1>

        <p className="mt-6 max-w-[560px] text-lg leading-relaxed text-muted">
          O VentureERP coloca finanças, fiscal, estoque, vendas e pessoas em uma
          plataforma só — com IA embarcada e operação em 37 dias. Para empresas
          que se cansaram de sistemas que não conversam.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-base text-bg transition hover:bg-moss-900"
          >
            Solicitar demonstração
            <IconArrow
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#plataforma"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-transparent px-6 py-3.5 text-base text-ink transition hover:border-ink/40"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-mustard-300 text-moss-800">
              <IconBolt size={14} />
            </span>
            Conhecer a plataforma
          </a>
        </div>

        {/* signal row */}
        <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
          {[
            ["2.4k+", "empresas ativas"],
            ["37 dias", "média de implantação"],
            ["99,98%", "uptime garantido"],
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

// ─── Trust bar ──────────────────────────────────────────────────────────
const Trust = () => {
  const logos = [
    "LATAM CARGO",
    "Veloso & Cia",
    "OLIVA",
    "Marésia",
    "BLUME",
    "PrismaTec",
    "SantaLuz",
    "PORTO REAL",
    "GRÃO",
    "Tikal",
    "MERIDIA",
    "Verde Mar",
  ];
  const row = [...logos, ...logos];
  return (
    <section className="border-y border-line bg-paper py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          De startups a grupos com 40 filiais — VentureERP roda a operação de
          mais de 2.400 empresas
        </p>
        <div className="mask-x mt-6 overflow-hidden">
          <div className="flex w-max animate-marquee gap-12 px-3">
            {row.map((n, i) => (
              <span
                key={i}
                className="font-serif text-2xl tracking-tight text-ink/55 whitespace-nowrap"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Pillars / Por que ───────────────────────────────────────────────────
const Pillars = () => {
  const items = [
    {
      n: "01",
      t: "Uma fonte de dados. Zero planilhas paralelas.",
      d: "Cada módulo lê e escreve no mesmo banco. Sem export-import entre sistemas, sem relatório que não bate, sem Excel sombra circulando pelo financeiro.",
      Icon: IconLink,
    },
    {
      n: "02",
      t: "IA que trabalha enquanto você dorme.",
      d: "Antecipa ruptura de estoque, projeta o caixa das próximas 12 semanas e detecta anomalias contábeis na origem. Você chega na segunda já sabendo o que decidir.",
      Icon: IconSpark,
    },
    {
      n: "03",
      t: "Conformidade que se atualiza sozinha.",
      d: "NF-e, NFS-e, SPED, Reinf, eSocial, DCTF. Nosso time fiscal acompanha publicações da Receita e SEFAZs — e entrega o layout antes do prazo de obrigatoriedade.",
      Icon: IconShield,
    },
  ];
  return (
    <section id="plataforma" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal grid items-end gap-8 md:grid-cols-2">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
            ·· plataforma
          </span>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Um ERP que parece feito por{" "}
            <span className="italic text-moss-700">quem usa</span> — não por
            quem vende.
          </h2>
        </div>
        <p className="text-lg leading-relaxed text-muted md:pl-8">
          Cada decisão de produto começa com gestores reais, em empresas reais.
          O resultado é um software que entrega o que promete, sem a fricção dos
          sistemas legados.
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

// ─── Modules ─────────────────────────────────────────────────────────────
const Modules = () => {
  const mods = [
    {
      slug: "financeiro",
      Icon: IconCoin,
      title: "Financeiro & Tesouraria",
      body: "Conciliação bancária automática via Open Finance, DRE em tempo real e fluxo de caixa projetado por IA. Fechamento contábil de 9 dias vira 3.",
      tags: ["Open Finance", "DRE", "Cash flow IA"],
      Mini: MiniFinance,
    },
    {
      slug: "estoque",
      Icon: IconBox,
      title: "Estoque & Logística",
      body: "Multi-armazém, leitura por coletor, WMS embarcado e ressuprimento sugerido por algoritmo. Dinheiro parado em SKU errado vira coisa do passado.",
      tags: ["WMS", "Multi-CD", "Coletor"],
      Mini: MiniInventory,
    },
    {
      slug: "vendas",
      Icon: IconChartLine,
      title: "Vendas & CRM",
      body: "Pipeline visual, proposta, contrato digital, faturamento em um clique e comissão calculada sozinha. Do primeiro contato à NF emitida sem trocar de tela.",
      tags: ["Pipeline", "Contratos", "Comissões"],
      Mini: MiniSales,
    },
    {
      slug: "fiscal",
      Icon: IconReceipt,
      title: "Fiscal & Tributário",
      body: "Emissão, recepção e arquivamento de NF-e, NFS-e, SPED e Reinf. Atualizações de layout entregues antes do prazo da Receita — zero corrida.",
      tags: ["NF-e", "SPED", "EFD"],
      Mini: MiniFiscal,
    },
    {
      slug: "rh",
      Icon: IconUsers,
      title: "RH & Folha",
      body: "Admissão digital, ponto eletrônico integrado, eSocial e folha que conhece sua convenção coletiva — e a do seu sindicato regional.",
      tags: ["eSocial", "Ponto", "Convenções"],
      Mini: MiniHR,
    },
    {
      slug: "bi",
      Icon: IconSpark,
      title: "Inteligência & BI",
      body: "Dashboards prontos por cargo, builder no-code de relatórios e alertas que chegam antes do problema — no Slack, e-mail ou WhatsApp.",
      tags: ["Dashboards", "Alertas", "Anomalias"],
      Mini: MiniBI,
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
              Seis módulos. Um&nbsp;cérebro{" "}
              <span className="italic text-moss-700">só</span>.
            </h2>
          </div>
          <a
            href="#cta"
            className="group inline-flex items-center gap-2 self-start rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink transition hover:border-ink/50"
          >
            Ver módulo a módulo{" "}
            <IconArrow
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mods.map(({ slug, Icon, title, body, tags, Mini }, i) => (
            <a
              key={title}
              href={`modulo.html?m=${slug}`}
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
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── Live dashboard band ────────────────────────────────────────────────
const Band = () => (
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
          ·· cockpit
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
          Toda a empresa em{" "}
          <span className="italic text-mustard-300">uma tela</span>.
        </h2>
        <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
          O Cockpit reúne os indicadores que importam — receita, caixa, ruptura,
          status fiscal — em um painel que muda conforme seu cargo e o seu
          calendário contábil.
        </p>
        <ul className="mt-8 space-y-3">
          {[
            "Drill-down em qualquer KPI até a transação que o originou.",
            "Alertas inteligentes por Slack, e-mail ou WhatsApp.",
            "Relatórios programados — diários, semanais, fechamento.",
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

      {/* Big mock dashboard */}
      <div className="reveal" data-delay="2">
        <div className="rounded-2xl border border-bg/15 bg-moss-800/60 p-4 backdrop-blur">
          <div className="flex items-center justify-between border-b border-bg/10 pb-3 text-[11px] font-mono text-bg/60">
            <span>Cockpit · CEO view</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-mustard-300 animate-pulse-soft" />
              sincronizado · 12s atrás
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ["Receita MRR", "R$ 4,21M", "+12%"],
              ["Caixa", "R$ 18,9M", "+R$ 320k"],
              ["NPS", "67", "+4 pts"],
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
                  Fluxo de caixa · 12 sem.
                </p>
                <p className="font-mono text-[10px] text-mustard-300">
                  projetado
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
                Alertas · 24h
              </p>
              <ul className="mt-3 space-y-3 text-[13px]">
                {[
                  ["Ruptura", "SKU 7821 em 4 dias", "#DCC03B"],
                  ["Atraso", "3 NF-e pendentes", "#9CB056"],
                  ["Anomalia", "Custo logístico +18%", "#DCC03B"],
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

// ─── Stats ───────────────────────────────────────────────────────────────
const Stats = () => {
  const stats = [
    {
      value: 47,
      suffix: "%",
      l: "menos tempo em fechamento contábil",
      s: "média entre clientes 6m+",
    },
    {
      value: 3.2,
      suffix: "×",
      decimals: 1,
      l: "mais rápido para emitir NF-e em lote",
      s: "vs. ERP legado",
    },
    {
      value: 1.8,
      prefix: "R$ ",
      suffix: "M",
      decimals: 1,
      l: "custo evitado em ruptura de estoque",
      s: "no primeiro ano",
    },
    {
      value: 37,
      suffix: " dias",
      l: "do contrato à operação plena",
      s: "implantação assistida",
    },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· resultados
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          Números que <span className="italic text-moss-700">os clientes</span>{" "}
          contam por nós.
        </h2>
      </div>

      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
        {stats.map((st, i) => (
          <div key={st.l} className="reveal bg-bg p-8" data-delay={i + 1}>
            <p className="font-serif text-[68px] leading-none tracking-tightest text-ink">
              <Counter
                value={st.value}
                prefix={st.prefix || ""}
                suffix={st.suffix || ""}
                decimals={st.decimals || 0}
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

// ─── Workflow / Como funciona ───────────────────────────────────────────
const Workflow = () => {
  const steps = [
    {
      n: "01",
      t: "Diagnóstico em 7 dias",
      d: "Mapeamos seus processos com nossa equipe de implantação. Você sai com um cronograma fechado, não com uma promessa.",
    },
    {
      n: "02",
      t: "Migração assistida",
      d: "Importamos histórico de notas, clientes, produtos e contratos. Validação em paralelo ao seu sistema atual — zero downtime na operação.",
    },
    {
      n: "03",
      t: "Ativação por módulos",
      d: "Um módulo por vez, com treinamento ao vivo. Sua equipe aprende usando, não em sala de aula.",
    },
    {
      n: "04",
      t: "Acompanhamento contínuo",
      d: "CSM dedicado, revisões trimestrais e roadmap aberto. Você cresce, a plataforma evolui junto.",
    },
  ];
  return (
    <section id="workflow" className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal grid items-end gap-6 md:grid-cols-[1.1fr_1fr]">
          <h2 className="font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
            Da decisão ao primeiro{" "}
            <span className="italic text-moss-700">DRE</span>: 37 dias.
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            Implantação não é um software; é um time. O nosso vem com você do
            primeiro kick-off até o quinto fechamento — e segue depois.
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

// ─── Testimonials ───────────────────────────────────────────────────────
const Testimonials = () => {
  const items = [
    {
      q: "Saímos de oito sistemas para um. O fechamento contábil que levava nove dias agora roda em três — e o CFO finalmente dorme durante a virada do mês.",
      n: "Renata Salazar",
      r: "CFO · Grupo Marésia",
      m: "320 colaboradores",
    },
    {
      q: "A IA de ressuprimento sozinha pagou o ERP em quatro meses. A gente tinha R$ 1,2M parado em SKU errado — não tem mais.",
      n: "Túlio Bandeira",
      r: "COO · OLIVA Casa",
      m: "12 lojas + e-commerce",
    },
    {
      q: "Implantação em 41 dias, sem queda na operação. O que mais me impressionou foi que o CSM da Venture entendia da minha indústria, não só do software.",
      n: "Aline Ferraz",
      r: "Diretora de Operações · Verde Mar Foods",
      m: "4 plantas industriais",
    },
  ];
  return (
    <section id="clientes" className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal grid items-end gap-6 md:grid-cols-[1fr_auto]">
        <h2 className="max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          O que diz quem <span className="italic text-moss-700">confiou</span> a
          operação à VentureERP.
        </h2>
        <div className="flex items-center gap-2 text-mustard-400">
          {[0, 1, 2, 3, 4].map((i) => (
            <IconStar key={i} size={20} />
          ))}
          <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
            4.9 · G2
          </span>
        </div>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <figure
            key={it.n}
            className="card-accent reveal flex h-full flex-col rounded-2xl border border-line bg-paper p-7"
            data-delay={i + 1}
          >
            <IconQuote size={26} className="text-mustard-400" />
            <blockquote className="mt-5 flex-1 font-serif text-[22px] leading-snug text-ink">
              "{it.q}"
            </blockquote>
            <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-moss-700 font-serif text-bg">
                {it.n
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="text-sm">
                <span className="block text-ink">{it.n}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                  {it.r}
                </span>
              </span>
              <span className="ml-auto font-mono text-[10px] text-muted">
                {it.m}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

// ─── Pricing ────────────────────────────────────────────────────────────
const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  const tiers = [
    {
      name: "Essencial",
      monthly: 1490,
      sub: "até 15 usuários",
      desc: "Para quem está saindo das planilhas e quer profissionalizar antes de escalar.",
      feats: [
        "Financeiro + Fiscal completos",
        "Estoque mono-armazém",
        "CRM básico",
        "5 dashboards prontos",
        "Suporte em horário comercial",
      ],
    },
    {
      name: "Crescimento",
      monthly: 3890,
      sub: "até 60 usuários",
      highlight: true,
      desc: "O plano que 7 em cada 10 clientes escolhem. Operação multi-filial sem complicação.",
      feats: [
        "Tudo do Essencial",
        "Multi-filial e multi-CD",
        "IA de ressuprimento",
        "BI builder + alertas",
        "CSM dedicado",
        "Integrações Open Finance",
      ],
    },
    {
      name: "Corporativo",
      custom: true,
      sub: "usuários ilimitados",
      desc: "Para grupos com múltiplas razões sociais, governança rigorosa e ambientes regulados.",
      feats: [
        "Tudo do Crescimento",
        "SSO + SCIM + audit trail",
        "Ambientes dedicados",
        "SLA 99,98% contratual",
        "Diretor de conta sênior",
        "Roadmap co-criado",
      ],
    },
  ];
  const fmt = (n) => n.toLocaleString("pt-BR");
  return (
    <section id="planos" className="bg-moss-900 py-28 text-bg">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mustard-300">
            ·· planos
          </span>
          <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight md:text-6xl">
            Preço claro. Implantação{" "}
            <span className="italic text-mustard-300">sem surpresas</span>.
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-bg/75">
            Sem licenças por usuário escondidas, sem contrato de 5 anos. Pague
            pelo que usa, expanda quando crescer.
          </p>

          <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-bg/15 bg-moss-800/40 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-[13px] transition ${!annual ? "bg-bg text-ink" : "text-bg/75 hover:text-bg"}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] transition ${annual ? "bg-bg text-ink" : "text-bg/75 hover:text-bg"}`}
            >
              Anual{" "}
              <span className="rounded-full bg-mustard-300 px-1.5 py-0.5 text-[10px] font-mono text-moss-900">
                −15%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <article
              key={t.name}
              className={`reveal flex h-full flex-col rounded-2xl border p-8 transition ${
                t.highlight
                  ? "border-mustard-300 bg-bg text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,.5)]"
                  : "border-bg/15 bg-moss-800/40"
              }`}
              data-delay={i + 1}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-3xl">{t.name}</h3>
                {t.highlight && (
                  <span className="rounded-full bg-moss-700 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mustard-300">
                    mais escolhido
                  </span>
                )}
              </div>
              <p
                className={`mt-3 text-[14px] leading-relaxed ${t.highlight ? "text-muted" : "text-bg/75"}`}
              >
                {t.desc}
              </p>
              <div className="mt-7 flex items-baseline gap-2">
                {!t.custom && (
                  <span
                    className={`font-mono text-sm ${t.highlight ? "text-muted" : "text-bg/60"}`}
                  >
                    R$
                  </span>
                )}
                <span className="font-serif text-6xl tracking-tight">
                  {t.custom
                    ? "Sob medida"
                    : fmt(annual ? Math.round(t.monthly * 0.85) : t.monthly)}
                </span>
                {!t.custom && (
                  <span
                    className={`text-sm ${t.highlight ? "text-muted" : "text-bg/60"}`}
                  >
                    / mês
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[13px] ${t.highlight ? "text-muted" : "text-bg/60"}`}
              >
                {t.custom
                  ? t.sub
                  : annual
                    ? `cobrado anualmente · ${t.sub}`
                    : `cobrado mensalmente · ${t.sub}`}
              </span>
              <a
                href="#cta"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm transition ${
                  t.highlight
                    ? "bg-ink text-bg hover:bg-moss-900"
                    : "border border-bg/25 text-bg hover:border-bg/55"
                }`}
              >
                {t.price === "Sob medida"
                  ? "Falar com especialista"
                  : "Solicitar demonstração"}
                <IconArrow size={16} />
              </a>
              <ul
                className={`mt-7 space-y-2.5 border-t pt-5 text-[14px] ${t.highlight ? "border-line text-ink" : "border-bg/10 text-bg/85"}`}
              >
                {t.feats.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <IconCheck
                      size={16}
                      className={`mt-0.5 shrink-0 ${t.highlight ? "text-moss-700" : "text-mustard-300"}`}
                    />
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

// ─── FAQ ────────────────────────────────────────────────────────────────
const FAQ = () => {
  const items = [
    [
      "Em quanto tempo minha empresa estará rodando?",
      "A média é 37 dias do kick-off até a operação plena. Empresas mono-filial costumam ir mais rápido (~25 dias); operações com múltiplas razões sociais e integrações fiscais complexas chegam a 60 dias. Em todos os casos, você recebe um cronograma fechado na primeira semana.",
    ],
    [
      "Como funciona a migração dos dados?",
      "Nosso time de Data Migration importa histórico de notas, clientes, produtos, contratos e movimentações financeiras. Validamos em paralelo ao seu sistema atual e só fazemos o cutover com sua aprovação — zero downtime na operação.",
    ],
    [
      "VentureERP integra com meu banco e meios de pagamento?",
      "Sim. Suportamos Open Finance nativo (Itaú, Bradesco, BB, Santander, Inter, BTG, e mais 40+ instituições), além de gateways como Pagar.me, Stone, Cielo, Adyen e Iugu. Conciliação bancária é automática.",
    ],
    [
      "E quanto à conformidade fiscal? Vocês acompanham mudanças?",
      "Temos uma equipe fiscal dedicada que acompanha publicações da Receita, SEFAZs estaduais e MTE. Atualizações de layout (NF-e, SPED, eSocial, Reinf) são publicadas antes do prazo de obrigatoriedade — você não precisa fazer nada.",
    ],
    [
      "Posso começar com poucos módulos e expandir?",
      "Recomendamos. A implantação por módulos (Financeiro → Fiscal → Estoque → Vendas → RH) reduz risco e acelera a adoção. Cada módulo é cobrado separadamente; você expande quando fizer sentido para o negócio.",
    ],
    [
      "Qual a estrutura de suporte?",
      "Plano Crescimento e Corporativo têm CSM dedicado, com revisões trimestrais. Suporte técnico via chat (resposta < 5min em horário comercial), e-mail e telefone. Plano Corporativo inclui SLA contratual de 99,98% e diretor de conta sênior.",
    ],
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
      <div className="reveal text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· perguntas frequentes
        </span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          Tudo o que você queria{" "}
          <span className="italic text-moss-700">perguntar</span>.
        </h2>
      </div>

      <div
        className="reveal mt-12 divide-y divide-line border-y border-line"
        data-delay="1"
      >
        {items.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={`font-serif text-2xl leading-snug transition ${isOpen ? "text-moss-700" : "text-ink"}`}
                >
                  {q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${isOpen ? "border-moss-700 bg-moss-700 text-bg" : "border-line text-ink"}`}
                >
                  {isOpen ? <IconMinus size={16} /> : <IconPlus size={16} />}
                </span>
              </button>
              <div
                className="grid overflow-hidden transition-[grid-template-rows] duration-500"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0">
                  <p className="pb-7 pr-12 text-[15.5px] leading-relaxed text-muted">
                    {a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─── Final CTA ──────────────────────────────────────────────────────────
const CTA = () => (
  <section
    id="cta"
    className="grain relative mx-auto max-w-7xl overflow-hidden px-6 pb-28 lg:px-10"
  >
    <div className="relative overflow-hidden rounded-[28px] border border-moss-800 bg-moss-900 p-10 text-bg md:p-16">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(220,192,59,.25), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(155,176,86,.18), transparent)",
        }}
      />

      <div className="relative grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
        <div>
          <Sticker className="bg-mustard-300 text-moss-800 border-mustard-400">
            <IconLeaf size={14} /> agende sua demo
          </Sticker>
          <h2 className="mt-6 font-serif text-5xl leading-[1] tracking-tightest md:text-7xl">
            Pronto para tirar sua empresa
            <br />
            das <span className="italic text-mustard-300">planilhas</span>?
          </h2>
          <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-bg/75">
            Em 30 minutos um especialista mostra a plataforma rodando com dados
            parecidos com os seus. Sem PowerPoint, sem promessa vazia.
          </p>
        </div>

        <form
          className="rounded-2xl border border-bg/15 bg-moss-800/50 p-6 backdrop-blur"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bg/60">
              Nome
            </span>
            <input
              type="text"
              placeholder="Como podemos te chamar?"
              className="mt-1.5 w-full rounded-lg border border-bg/15 bg-moss-900/60 px-3 py-2.5 text-sm text-bg placeholder:text-bg/40 focus:border-mustard-300 focus:outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bg/60">
              E-mail corporativo
            </span>
            <input
              type="email"
              placeholder="voce@empresa.com.br"
              className="mt-1.5 w-full rounded-lg border border-bg/15 bg-moss-900/60 px-3 py-2.5 text-sm text-bg placeholder:text-bg/40 focus:border-mustard-300 focus:outline-none"
            />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-bg/60">
              Tamanho da empresa
            </span>
            <select className="mt-1.5 w-full rounded-lg border border-bg/15 bg-moss-900/60 px-3 py-2.5 text-sm text-bg focus:border-mustard-300 focus:outline-none">
              <option>Até 50 funcionários</option>
              <option>50 — 200 funcionários</option>
              <option>200 — 1.000 funcionários</option>
              <option>Mais de 1.000</option>
            </select>
          </label>
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mustard-300 px-5 py-3 text-sm font-medium text-moss-900 transition hover:bg-mustard-200">
            Agendar demonstração
            <IconArrow size={16} />
          </button>
          <p className="mt-3 text-center text-[11px] text-bg/55">
            Resposta em até 4h úteis · LGPD-compliant
          </p>
        </form>
      </div>
    </div>
  </section>
);

// ─── Footer ─────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="border-t border-line bg-paper">
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-muted">
            VentureERP · o sistema operacional das empresas brasileiras. Feito
            por gente que cresceu rodando operação de verdade.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconLeaf size={16} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconGlobe size={16} />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-line bg-bg text-ink">
              <IconLink size={16} />
            </span>
          </div>
        </div>
        {[
          [
            "Plataforma",
            [
              ["Financeiro", "modulo.html?m=financeiro"],
              ["Estoque", "modulo.html?m=estoque"],
              ["Vendas & CRM", "modulo.html?m=vendas"],
              ["Fiscal", "modulo.html?m=fiscal"],
              ["RH & Folha", "modulo.html?m=rh"],
              ["BI & Inteligência", "modulo.html?m=bi"],
            ],
          ],
          [
            "Empresa",
            [
              ["Sobre nós", "#"],
              ["Carreiras (12)", "#"],
              ["Imprensa", "#"],
              ["Parceiros", "#"],
              ["Cases", "cases.html"],
            ],
          ],
          [
            "Recursos",
            [
              ["Documentação", "#"],
              ["Status do sistema", "status.html"],
              ["Comunidade", "#"],
              ["Roadmap aberto", "#"],
              ["Contato", "#"],
            ],
          ],
        ].map(([t, ls]) => (
          <div key={t}>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss-700">
              {t}
            </p>
            <ul className="mt-4 space-y-2.5 text-[14px] text-ink/85">
              {ls.map(([l, h]) => (
                <li key={l}>
                  <a href={h} className="transition hover:text-moss-700">
                    {l}
                  </a>
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
            Uma carta por mês, do nosso time fiscal e de produto.
          </p>
          <p className="mt-2 text-[14px] text-muted">
            Mudanças na legislação, novidades de roadmap e cases reais. Sem
            spam.
          </p>
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="voce@empresa.com.br"
            className="flex-1 rounded-full border border-line bg-paper px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
          />
          <button className="inline-flex items-center gap-2 rounded-full bg-moss-800 px-5 py-3 text-sm text-bg transition hover:bg-moss-900">
            Inscrever <IconArrow size={14} />
          </button>
        </form>
      </div>

      <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8 text-[12px] text-muted">
        <span>
          © 2026 VentureERP Tecnologia S.A. · CNPJ 00.000.000/0001-00 · São
          Paulo, BR
        </span>
        <span className="flex gap-5">
          <a href="#">Privacidade</a>
          <a href="#">Termos</a>
          <a href="#">LGPD</a>
          <a href="#">Segurança</a>
        </span>
      </div>

      {/* Big wordmark */}
      <div className="mt-12 select-none overflow-hidden">
        <p
          aria-hidden="true"
          className="font-serif text-[clamp(80px,18vw,260px)] leading-[0.85] tracking-tightest text-ink/8"
          style={{ color: "rgba(20,32,26,.07)" }}
        >
          VentureERP<span style={{ color: "rgba(203,171,31,.32)" }}>.</span>
        </p>
      </div>
    </div>
  </footer>
);

// expose
Object.assign(window, {
  useReveal,
  Logo,
  Nav,
  Hero,
  Trust,
  Pillars,
  Modules,
  Band,
  Stats,
  Workflow,
  Testimonials,
  Pricing,
  FAQ,
  CTA,
  Footer,
});
