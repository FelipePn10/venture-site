// Extra sections: Counter, Compare, Verticals, Compliance, Press,
// FloatingCTA, CookieBanner, OrganicDivider, Newsletter.

const { useState: useS2, useEffect: useE2, useRef: useR2 } = React;

// ─── Animated number counter ─────────────────────────────────────────────
const Counter = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1800 }) => {
  const [n, setN] = React.useState(0);
  const ref = React.useRef(null);
  const started = React.useRef(false);
  React.useEffect(() => {
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(value * eased);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const formatted = decimals === 0
    ? Math.round(n).toLocaleString('pt-BR')
    : n.toFixed(decimals).replace('.', ',');
  return <span ref={ref}>{prefix}{formatted}{suffix}</span>;
};

// ─── Organic SVG divider (wavy edge) ─────────────────────────────────────
const OrganicDivider = ({ color = '#F4F1DF', flip = false }) => (
  <div className={`relative h-[60px] w-full overflow-hidden ${flip ? 'rotate-180' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
      <path d="M0 30 C 240 0, 480 60, 720 30 S 1200 0, 1440 30 L 1440 60 L 0 60 Z" fill={color} />
    </svg>
  </div>
);

// ─── Comparison table — VentureERP vs ERP legado vs planilhas ───────────
const Compare = () => {
  const rows = [
    ['Tempo até operar', '37 dias',          '8–18 meses',        'Imediato (e caro)'],
    ['Atualização fiscal', 'Automática',      'Sob demanda · paga', 'Você que se vire'],
    ['Custo total em 3 anos', 'Previsível',  'Escala com o caos', 'Tempo perdido vira dinheiro'],
    ['Dado único',     'Sim, nativo',        'Múltiplos bancos',   'Cada planilha, uma versão'],
    ['IA embarcada',   'Sim',                'Add-on caro',        'Não'],
    ['Suporte BR',     'CSM dedicado',        'Ticket no exterior', 'Você mesmo'],
    ['Compliance LGPD','Certificado',         'Depende do parceiro', 'Improvável']
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
      <div className="reveal max-w-3xl">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· comparativo</span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          O que você ganha trocando <span className="italic text-moss-700">o de sempre</span> pelo VentureERP.
        </h2>
      </div>

      <div className="reveal mt-14 overflow-hidden rounded-2xl border border-line bg-bg" data-delay="1">
        <div className="grid grid-cols-[1.3fr_1.2fr_1fr_1fr] border-b border-line bg-paper text-[12px] font-mono uppercase tracking-[0.16em] text-muted">
          <div className="px-6 py-4"></div>
          <div className="relative px-6 py-4 text-moss-700">
            <span className="absolute -top-3 left-6 rounded-full bg-moss-700 px-2.5 py-0.5 text-[10px] text-bg">recomendado</span>
            VentureERP
          </div>
          <div className="px-6 py-4">ERP legado</div>
          <div className="px-6 py-4">Planilhas</div>
        </div>

        {rows.map(([label, v, l, p], i) => (
          <div key={label} className={`grid grid-cols-[1.3fr_1.2fr_1fr_1fr] items-center text-[15px] ${i % 2 === 0 ? 'bg-bg' : 'bg-paper/50'}`}>
            <div className="border-b border-line/60 px-6 py-5 font-medium text-ink">{label}</div>
            <div className="border-b border-line/60 bg-moss-50/60 px-6 py-5">
              <span className="inline-flex items-center gap-2 text-moss-700">
                <IconCheck size={16} /> {v}
              </span>
            </div>
            <div className="border-b border-line/60 px-6 py-5 text-muted">{l}</div>
            <div className="border-b border-line/60 px-6 py-5 text-muted">{p}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ─── Verticals tabs ──────────────────────────────────────────────────────
const Verticals = () => {
  const verticals = [
    {
      id: 'industria', label: 'Indústria',
      title: 'Da matéria-prima ao SPED, sem retrabalho.',
      body: 'MRP, controle de produção, apontamento de chão-de-fábrica, custo por ordem e integração direta com balança e CLP. Auditoria fiscal pronta no fim do mês.',
      stats: [['28%', 'redução de OEE perdido'], ['4×', 'mais rápido fechamento de OP'], ['R$ 4,2M', 'evitado em retrabalho/ano']],
      feats: ['MRP & MPS', 'Apontamento por coletor', 'Custo por ordem em tempo real', 'Integração CLP/IoT', 'Bloco K · SPED Fiscal']
    },
    {
      id: 'varejo', label: 'Varejo',
      title: 'Loja física e online, mesmo estoque.',
      body: 'PDV nativo, omnichannel real (estoque único entre lojas e e-commerce), e-commerce conectado a Shopify/VTEX/Tray, fidelidade e cupons. Ruptura prevista por SKU.',
      stats: [['+19%', 'sell-out médio'], ['−42%', 'ruptura em SKU-A'], ['1 clique', 'fechamento de caixa']],
      feats: ['PDV offline-first', 'Omnichannel real', 'E-commerce nativo', 'Fidelidade & cashback', 'Ressuprimento por IA']
    },
    {
      id: 'servicos', label: 'Serviços',
      title: 'Projeto, hora apontada, fatura emitida.',
      body: 'Gestão de projetos, apontamento de horas, contratos recorrentes, faturamento por marco e NFS-e em todos os municípios. Margem real por projeto, em tempo real.',
      stats: [['96%', 'das horas faturadas'], ['12 dias', 'menos no DSO'], ['100%', 'NFS-e municípios BR']],
      feats: ['Projetos & marcos', 'Time tracking', 'Contratos recorrentes', 'NFS-e nacional', 'Margem por cliente']
    },
    {
      id: 'distribuicao', label: 'Distribuição',
      title: 'Da entrada da carga ao caminhão na rota.',
      body: 'WMS embarcado, separação por onda, expedição com torre de controle, roteirização e MDFe automática. Multi-CD com regras de fiscalidade por estado.',
      stats: [['−31%', 'tempo de separação'], ['98,7%', 'on-time delivery'], ['Multi-CD', 'em 1 ambiente']],
      feats: ['WMS por onda', 'MDFe & CTe', 'Roteirização', 'Torre de controle', 'Fiscal multi-UF']
    }
  ];
  const [active, setActive] = useS2('industria');
  const v = verticals.find((x) => x.id === active);
  return (
    <section className="bg-paper py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="reveal grid items-end gap-8 md:grid-cols-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· para o seu setor</span>
            <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
              Feito para a forma como <span className="italic text-moss-700">o seu</span> negócio funciona.
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted md:pl-8">
            Não é o mesmo software com outro nome. Cada vertical tem fluxos,
            relatórios e regras fiscais próprias — entregues no padrão do setor.
          </p>
        </div>

        {/* tabs */}
        <div className="reveal mt-12 flex flex-wrap gap-2 rounded-full border border-line bg-bg p-1.5" data-delay="1">
          {verticals.map((vt) => (
            <button
              key={vt.id}
              onClick={() => setActive(vt.id)}
              className={`rounded-full px-5 py-2.5 text-sm transition ${
                active === vt.id ? 'bg-moss-800 text-bg' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {vt.label}
            </button>
          ))}
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

// ─── Press / "Visto em" + awards ────────────────────────────────────────
const Press = () => (
  <section className="border-y border-line bg-bg py-12">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 lg:px-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">visto em</p>
      <div className="flex flex-1 flex-wrap items-center justify-around gap-8">
        {['Exame','Valor Econômico','Estadão','Pequenas Empresas & Grandes Negócios','InfoMoney','Folha'].map((p) => (
          <span key={p} className="font-serif text-xl tracking-tight text-ink/55">{p}</span>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-full border border-mustard-400 bg-mustard-50 px-4 py-1.5">
        <IconStar size={14} className="text-mustard-500" />
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss-800">Top 10 SaaS B2B · 2025</span>
      </div>
    </div>
  </section>
);

// ─── Compliance / Security badges ───────────────────────────────────────
const Compliance = () => {
  const items = [
    { k: 'LGPD',         d: 'Certificada · DPO interno' },
    { k: 'ISO 27001',    d: 'Sistema de gestão de segurança' },
    { k: 'SOC 2 Type II',d: 'Auditoria anual independente' },
    { k: 'PCI DSS',      d: 'Para fluxo de pagamentos' },
    { k: 'Backup 3-2-1', d: 'RPO 5min · RTO 1h' },
    { k: 'TLS 1.3 + AES-256', d: 'Em trânsito e em repouso' }
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
      <div className="reveal grid items-end gap-6 md:grid-cols-[1.3fr_1fr]">
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          Sua operação é crítica. <span className="italic text-moss-700">Tratamos como tal.</span>
        </h2>
        <p className="text-[16px] leading-relaxed text-muted">
          Infraestrutura em nuvem brasileira, redundância multi-zona, criptografia ponta-a-ponta e auditoria contínua.
        </p>
      </div>

      <div className="reveal mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3 lg:grid-cols-6" data-delay="1">
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
        <a href="status.html" className="ml-auto inline-flex items-center gap-1.5 text-moss-700 hover:underline">
          Status do sistema <IconArrow size={14} />
        </a>
      </div>
    </section>
  );
};

// ─── Floating CTA pill (appears after 600px scroll) ─────────────────────
const FloatingCTA = () => {
  const [vis, setVis] = useS2(false);
  useE2(() => {
    const fn = () => setVis(window.scrollY > 700 && window.scrollY < document.body.scrollHeight - window.innerHeight - 600);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <a
      href="#cta"
      className={`fixed bottom-6 right-6 z-30 flex items-center gap-3 rounded-full border border-moss-800 bg-moss-900 px-5 py-3 text-sm text-bg shadow-[0_20px_40px_-15px_rgba(20,32,26,.5)] transition-all duration-500 ${
        vis ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span className="grid h-7 w-7 place-items-center rounded-full bg-mustard-300 text-moss-800">
        <IconBolt size={14} />
      </span>
      Falar com vendas
      <IconArrow size={14} />
    </a>
  );
};

// ─── Cookie / LGPD banner ───────────────────────────────────────────────
const CookieBanner = () => {
  const [vis, setVis] = useS2(false);
  useE2(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem('venture-cookies')) setVis(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  const accept = () => { localStorage.setItem('venture-cookies', 'ok'); setVis(false); };
  const refuse = () => { localStorage.setItem('venture-cookies', 'no'); setVis(false); };
  if (!vis) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-4 shadow-[0_30px_60px_-30px_rgba(20,32,26,.4)] md:bottom-6 md:left-6 md:right-auto md:flex-nowrap">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-moss-50 text-moss-700">
        <IconLeaf size={16} />
      </span>
      <p className="flex-1 text-[13px] leading-snug text-ink">
        Usamos cookies para personalizar a experiência e medir o que funciona. Tudo conforme a <a href="#" className="underline">LGPD</a>.
      </p>
      <div className="flex gap-2">
        <button onClick={refuse} className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-[12px] text-ink/80 transition hover:text-ink">Rejeitar</button>
        <button onClick={accept} className="rounded-full bg-moss-800 px-3.5 py-1.5 text-[12px] text-bg transition hover:bg-moss-900">Aceitar todos</button>
      </div>
    </div>
  );
};

Object.assign(window, {
  Counter, OrganicDivider, Compare, Verticals, Press, Compliance, FloatingCTA, CookieBanner
});
