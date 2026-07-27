'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  IconArrow,
  IconCheck,
  IconFlame,
  IconTree,
  IconRuler,
  IconScissors,
  IconLayers,
  IconBolt,
  IconBox,
  IconGear,
  IconShield,
  IconReceipt,
} from './Icons';
import { CutSimulator } from './CutSimulator';
import { CutChallenge } from './CutChallenge';

/* ------------------------------------------------------------------ *
 * Dados dos mapas de corte.
 *
 * Cada demo é um plano ilustrativo no formato que o módulo realmente
 * devolve: peças posicionadas na chapa/barra/rolo, sobra reaproveitável
 * (retalho) marcada em amarelo e o resto como perda. Os percentuais são
 * os do próprio desenho — não são promessa de resultado, e o rodapé da
 * seção deixa isso explícito.
 * ------------------------------------------------------------------ */

type Rect = { x: number; y: number; w: number; h: number; tone?: 0 | 1 };
type Poly = { d: string; tx: number; ty: number; rot?: number; tone?: 0 | 1 };
type Disc = { cx: number; cy: number; r: number; tone?: 0 | 1 };

type Demo = {
  id: string;
  label: string;
  Icon: typeof IconFlame;
  material: string;
  headline: string;
  blurb: string;
  view: { w: number; h: number };
  boards: Rect[];
  pieces: Rect[];
  polys?: Poly[];
  discs?: Disc[];
  remnants?: Rect[];
  defects?: Rect[];
  /** Rótulos desenhados sobre o mapa (usado nas barras, para nomear cada peça de estoque). */
  labels?: { x: number; y: number; text: string }[];
  grain?: 'v' | 'h';
  stats: { yield: number; reuse: number; scrap: number };
  scrapLabel: string;
  bullets: string[];
};

/** Cantoneira em L usada no exemplo de corte a laser. */
const L_BRACKET = 'M0,0 H380 V140 H140 V460 H0 Z';

const demos: Demo[] = [
  {
    id: 'chapa',
    label: 'Chapa de aço',
    Icon: IconFlame,
    material: 'Chapa 2.400 × 1.200 mm · corte guilhotinado',
    headline: 'Seis peças e uma sobra que volta para a prateleira.',
    blurb:
      'O sistema encaixa as peças respeitando a espessura da serra e o refile da borda, e ainda decide onde deixar a sobra — grande o bastante para virar retalho de estoque em vez de sucata.',
    view: { w: 2400, h: 1200 },
    boards: [{ x: 0, y: 0, w: 2400, h: 1200 }],
    pieces: [
      { x: 0, y: 0, w: 800, h: 700, tone: 0 },
      { x: 810, y: 0, w: 800, h: 700, tone: 1 },
      { x: 1620, y: 0, w: 760, h: 700, tone: 0 },
      { x: 0, y: 710, w: 600, h: 490, tone: 1 },
      { x: 610, y: 710, w: 600, h: 490, tone: 0 },
      { x: 1220, y: 710, w: 500, h: 490, tone: 1 },
    ],
    remnants: [{ x: 1730, y: 710, w: 650, h: 490 }],
    stats: { yield: 86.3, reuse: 11.4, scrap: 2.3 },
    scrapLabel: 'perda real',
    bullets: [
      'Desconta a espessura do disco/serra entre cada corte',
      'Prefere gastar um retalho antes de abrir chapa nova',
      'Devolve o mapa em PDF, SVG e DXF para a seccionadora',
    ],
  },
  {
    id: 'mdf',
    label: 'MDF & moveleiro',
    Icon: IconTree,
    material: 'Chapa 2.750 × 1.830 mm · com veio',
    headline: 'O veio da madeira manda — e o sistema obedece.',
    blurb:
      'Peça com veio aparente não pode ser girada só para fechar melhor a conta. O plano respeita a direção da fibra, calcula a fita de borda de cada lado encapado e joga esse custo na ordem certa.',
    view: { w: 2750, h: 1830 },
    boards: [{ x: 0, y: 0, w: 2750, h: 1830 }],
    grain: 'v',
    pieces: [
      { x: 10, y: 15, w: 800, h: 1800, tone: 0 },
      { x: 820, y: 15, w: 800, h: 1800, tone: 1 },
      { x: 1630, y: 15, w: 500, h: 900, tone: 1 },
      { x: 1630, y: 925, w: 500, h: 880, tone: 0 },
      { x: 2140, y: 15, w: 590, h: 600, tone: 0 },
      { x: 2140, y: 625, w: 590, h: 600, tone: 1 },
    ],
    remnants: [{ x: 2140, y: 1235, w: 590, h: 580 }],
    stats: { yield: 89.0, reuse: 6.9, scrap: 4.1 },
    scrapLabel: 'perda real',
    bullets: [
      'Não gira a peça quando o veio é aparente',
      'Soma fita de borda e ferragens no custo do ambiente',
      'Etiqueta peça por peça, por pedido e por ambiente',
    ],
  },
  {
    id: 'barra',
    label: 'Barra, tubo e perfil',
    Icon: IconRuler,
    material: 'Barras de 6.000 mm + um retalho de 2.300 mm',
    headline: 'Ele abre o retalho de 2,3 m antes de tocar na barra nova.',
    blurb:
      'Estoque de barra nunca é uniforme: tem barra inteira, tem ponta de 2 metros, tem sobra de ontem. O motor testa todas as combinações e escolhe a que consome menos material comprado.',
    view: { w: 6000, h: 1820 },
    boards: [
      { x: 0, y: 110, w: 6000, h: 420 },
      { x: 0, y: 720, w: 6000, h: 420 },
      { x: 0, y: 1330, w: 2300, h: 420 },
    ],
    labels: [
      { x: 0, y: 70, text: 'Barra nova · 6.000 mm' },
      { x: 0, y: 680, text: 'Barra nova · 6.000 mm' },
      { x: 0, y: 1290, text: 'Retalho do estoque · 2.300 mm' },
    ],
    pieces: [
      { x: 0, y: 110, w: 1450, h: 420, tone: 0 },
      { x: 1453, y: 110, w: 1450, h: 420, tone: 1 },
      { x: 2906, y: 110, w: 1450, h: 420, tone: 0 },
      { x: 4359, y: 110, w: 1200, h: 420, tone: 1 },
      { x: 0, y: 720, w: 1200, h: 420, tone: 1 },
      { x: 1203, y: 720, w: 1200, h: 420, tone: 0 },
      { x: 2406, y: 720, w: 720, h: 420, tone: 1 },
      { x: 3129, y: 720, w: 720, h: 420, tone: 0 },
      { x: 3852, y: 720, w: 720, h: 420, tone: 1 },
      { x: 4575, y: 720, w: 720, h: 420, tone: 0 },
      { x: 0, y: 1330, w: 720, h: 420, tone: 1 },
      { x: 723, y: 1330, w: 720, h: 420, tone: 0 },
      { x: 1446, y: 1330, w: 720, h: 420, tone: 1 },
    ],
    remnants: [
      { x: 5562, y: 110, w: 438, h: 420 },
      { x: 5298, y: 720, w: 702, h: 420 },
    ],
    stats: { yield: 90.8, reuse: 8.0, scrap: 1.2 },
    scrapLabel: 'perda real',
    bullets: [
      'Estoque heterogêneo: barra inteira, ponta e retalho juntos',
      'Refile de ponta e espessura de corte já descontados',
      'A sobra acima do mínimo volta etiquetada para o estoque',
    ],
  },
  {
    id: 'irregular',
    label: 'Peça irregular',
    Icon: IconScissors,
    material: 'Chapa 3.000 × 1.500 mm · laser / plasma',
    headline: 'Peça dentro de peça: o furo de uma vira material da outra.',
    blurb:
      'Em corte a laser e plasma a peça não é um retângulo. O motor gira a peça em qualquer ângulo, encaixa uma no vazio da outra e aproveita até o buraco central da cantoneira.',
    view: { w: 1720, h: 860 },
    boards: [{ x: 0, y: 0, w: 1720, h: 860 }],
    polys: [
      { d: L_BRACKET, tx: 30, ty: 30, tone: 0 },
      { d: L_BRACKET, tx: 425, ty: 30, tone: 1 },
      { d: L_BRACKET, tx: 820, ty: 30, tone: 0 },
      { d: L_BRACKET, tx: 1215, ty: 30, tone: 1 },
    ],
    discs: [
      { cx: 315, cy: 302, r: 88, tone: 1 },
      { cx: 710, cy: 302, r: 88, tone: 0 },
      { cx: 1105, cy: 302, r: 88, tone: 1 },
      { cx: 1500, cy: 302, r: 88, tone: 0 },
    ],
    pieces: [
      { x: 210, y: 400, w: 190, h: 80, tone: 1 },
      { x: 605, y: 400, w: 190, h: 80, tone: 0 },
      { x: 1000, y: 400, w: 190, h: 80, tone: 1 },
      { x: 1395, y: 400, w: 190, h: 80, tone: 0 },
      { x: 30, y: 505, w: 500, h: 100, tone: 1 },
      { x: 545, y: 505, w: 500, h: 100, tone: 0 },
      { x: 1060, y: 505, w: 560, h: 100, tone: 1 },
      { x: 30, y: 620, w: 390, h: 110, tone: 0 },
      { x: 435, y: 620, w: 390, h: 110, tone: 1 },
      { x: 840, y: 620, w: 390, h: 110, tone: 0 },
      { x: 1245, y: 620, w: 390, h: 110, tone: 1 },
      { x: 30, y: 745, w: 780, h: 105, tone: 1 },
      { x: 830, y: 745, w: 780, h: 105, tone: 0 },
    ],
    stats: { yield: 72.8, reuse: 0, scrap: 27.2 },
    scrapLabel: 'esqueleto (sucata)',
    bullets: [
      'Rotação livre — a peça entra na diagonal quando compensa',
      'Encaixa peça pequena dentro do vazio da peça grande',
      'Sequência de corte e programa prontos para a máquina',
    ],
  },
  {
    id: 'tecido',
    label: 'Tecido, TNT e couro',
    Icon: IconLayers,
    material: 'Rolo de 1.600 mm · encaixe (marker)',
    headline: 'Desvia da falha do rolo e ainda mantém o par espelhado.',
    blurb:
      'Material flexível tem pelo, estampa, tonalidade e defeito no meio do rolo. O encaixe respeita tudo isso, mantém pares esquerdo/direito casados e ainda registra a ponta de rolo que sobrou.',
    view: { w: 1600, h: 1050 },
    boards: [{ x: 0, y: 0, w: 1600, h: 1050 }],
    grain: 'h',
    defects: [{ x: 690, y: 330, w: 180, h: 100 }],
    pieces: [
      { x: 20, y: 20, w: 500, h: 420, tone: 0 },
      { x: 540, y: 20, w: 500, h: 420, tone: 1 },
      { x: 1060, y: 20, w: 520, h: 300, tone: 0 },
      { x: 1060, y: 340, w: 520, h: 300, tone: 1 },
      { x: 20, y: 460, w: 640, h: 260, tone: 1 },
      { x: 20, y: 740, w: 640, h: 260, tone: 0 },
      { x: 680, y: 450, w: 340, h: 230, tone: 0 },
      { x: 680, y: 700, w: 400, h: 300, tone: 1 },
      { x: 1100, y: 660, w: 380, h: 220, tone: 0 },
    ],
    remnants: [{ x: 1100, y: 900, w: 480, h: 140 }],
    stats: { yield: 80.6, reuse: 4.0, scrap: 15.4 },
    scrapLabel: 'perda real',
    bullets: [
      'Contorna falhas mapeadas no rolo antes de posicionar',
      'Pares espelhados, pelo e sentido da estampa preservados',
      'Ponta de rolo volta rastreada por lote e tonalidade',
    ],
  },
];

/* ---------------------------- helpers ---------------------------- */

const useInView = <T extends HTMLElement>(threshold = 0.25) => {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setSeen(true)),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, seen };
};

/** Sobe de 0 até `value` quando `run` vira true. Reinicia a cada `key`. */
const useCountUp = (value: number, run: boolean, key: string, duration = 1400) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, run, key, duration]);
  return n;
};

const pct = (n: number) => n.toFixed(1).replace('.', ',');

/* --------------------------- o mapa ------------------------------ */

const CutMap = ({ demo, play }: { demo: Demo; play: boolean }) => {
  const { w, h } = demo.view;
  // ordem de entrada das peças: de cima para baixo, da esquerda para a direita
  const ordered = useMemo(() => {
    const all: { kind: 'rect' | 'poly' | 'disc'; i: number; y: number; x: number }[] = [];
    demo.pieces.forEach((p, i) => all.push({ kind: 'rect', i, y: p.y, x: p.x }));
    demo.polys?.forEach((p, i) => all.push({ kind: 'poly', i, y: p.ty, x: p.tx }));
    demo.discs?.forEach((d, i) => all.push({ kind: 'disc', i, y: d.cy, x: d.cx }));
    all.sort((a, b) => a.y - b.y || a.x - b.x);
    const step = Math.min(90, 1500 / Math.max(all.length, 1));
    const map = new Map<string, number>();
    all.forEach((it, k) => map.set(`${it.kind}-${it.i}`, k * step));
    return map;
  }, [demo]);

  const delay = (kind: string, i: number) => ordered.get(`${kind}-${i}`) ?? 0;
  const lastDelay = useMemo(() => Math.max(0, ...Array.from(ordered.values())), [ordered]);
  const fill = (tone?: 0 | 1) => (tone === 1 ? '#BCC885' : '#9AAE56');
  const anim = (kind: string, i: number) =>
    play
      ? ({ animationDelay: `${delay(kind, i)}ms` } as const)
      : ({ opacity: 0 } as const);

  return (
    <div className="relative flex h-[280px] items-center overflow-hidden rounded-xl border border-line bg-paper p-3 sm:h-[360px] sm:p-4 lg:h-[420px]">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-full w-full"
        role="img"
        aria-label={`Mapa de corte ilustrativo — ${demo.label}`}
      >
        {/* matéria-prima */}
        {demo.boards.map((b, i) => (
          <rect
            key={`b-${i}`}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill="#EBE7CE"
            stroke="#C9C2A0"
            strokeWidth={Math.max(w, h) / 500}
          />
        ))}

        {/* nome de cada peça de estoque (barras) */}
        {demo.labels?.map((l, i) => (
          <text
            key={`lb-${i}`}
            x={l.x}
            y={l.y}
            fontSize={h / 26}
            fill="#5F6A5C"
            fontFamily="ui-monospace, monospace"
          >
            {l.text}
          </text>
        ))}

        {/* direção do veio / sentido do rolo */}
        {demo.grain === 'v' &&
          Array.from({ length: 22 }).map((_, i) => (
            <line
              key={`g-${i}`}
              x1={(w / 22) * i + w / 44}
              y1={6}
              x2={(w / 22) * i + w / 44}
              y2={h - 6}
              stroke="#C9C2A0"
              strokeWidth={w / 900}
              opacity={0.55}
            />
          ))}
        {demo.grain === 'h' &&
          Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`g-${i}`}
              x1={6}
              y1={(h / 16) * i + h / 32}
              x2={w - 6}
              y2={(h / 16) * i + h / 32}
              stroke="#C9C2A0"
              strokeWidth={h / 700}
              opacity={0.55}
            />
          ))}

        {/* falha mapeada no rolo — o encaixe passa longe dela */}
        {demo.defects?.map((d, i) => (
          <g key={`d-${i}`}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              fill="#A8563A"
              opacity={0.22}
              stroke="#A8563A"
              strokeWidth={w / 380}
              strokeDasharray={`${w / 130} ${w / 190}`}
            />
            <text
              x={d.x + d.w / 2}
              y={d.y + d.h / 2 + w / 130}
              textAnchor="middle"
              fontSize={w / 42}
              fill="#8C4028"
              fontFamily="ui-monospace, monospace"
            >
              falha
            </text>
          </g>
        ))}

        {/* peças retangulares */}
        {demo.pieces.map((p, i) => (
          <rect
            key={`p-${i}`}
            className="piece-in"
            style={anim('rect', i)}
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            rx={Math.max(w, h) / 400}
            fill={fill(p.tone)}
            stroke="#465D18"
            strokeWidth={Math.max(w, h) / 640}
          />
        ))}

        {/* peças de contorno livre */}
        {demo.polys?.map((p, i) => (
          <path
            key={`pl-${i}`}
            className="piece-in"
            style={anim('poly', i)}
            d={p.d}
            transform={`translate(${p.tx} ${p.ty})${p.rot ? ` rotate(${p.rot})` : ''}`}
            fill={fill(p.tone)}
            stroke="#465D18"
            strokeWidth={Math.max(w, h) / 640}
          />
        ))}

        {/* peças redondas encaixadas no vazio das outras */}
        {demo.discs?.map((d, i) => (
          <circle
            key={`c-${i}`}
            className="piece-in"
            style={anim('disc', i)}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill={fill(d.tone)}
            stroke="#465D18"
            strokeWidth={Math.max(w, h) / 640}
          />
        ))}

        {/* sobra que vira retalho de estoque */}
        {demo.remnants?.map((r, i) => (
          <g key={`r-${i}`}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={Math.max(w, h) / 400}
              fill="#F2E8B0"
              stroke="#CBAB1F"
              strokeWidth={Math.max(w, h) / 560}
              strokeDasharray={`${Math.max(w, h) / 90} ${Math.max(w, h) / 140}`}
              className={play ? 'piece-in' : undefined}
              style={play ? { animationDelay: `${lastDelay + 280}ms` } : { opacity: 0 }}
            />
          </g>
        ))}
      </svg>

      {/* varredura da serra */}
      {play && (
        <span
          key={demo.id}
          aria-hidden
          className="cut-scan pointer-events-none absolute inset-y-3 w-px bg-mustard-400 shadow-[0_0_18px_4px_rgba(203,171,31,.45)]"
        />
      )}
    </div>
  );
};

/* ------------------- comparação motor guloso × nosso ------------------- */

const Comparison = () => {
  const { ref, seen } = useInView<HTMLDivElement>(0.35);
  const rows = [
    { name: 'Conta gulosa (o caminho comum)', val: 83.3, mm: '12.000 mm de barra', tone: 'muted' as const },
    { name: 'Motor do VentureERP', val: 90.9, mm: '11.000 mm de barra', tone: 'good' as const },
  ];
  return (
    <div
      ref={ref}
      className="grid gap-8 rounded-2xl border border-moss-700/60 bg-moss-800/40 p-7 md:p-9 lg:grid-cols-[1fr_1fr] lg:gap-14"
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-200">
          o mesmo pedido, dois métodos
        </p>
        <h3 className="mt-3 font-serif text-3xl leading-tight text-bg md:text-[34px]">
          A mesma lista de peças. Uma barra inteira de diferença.
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-bg/70">
          A maioria dos otimizadores encaixa peça por peça, na ordem, e para quando &quot;deu
          certo&quot;. O nosso testa combinações de padrões de corte até achar a que consome menos
          material — e só publica o plano depois de conferir peça por peça se ele é executável.
        </p>
        <p className="mt-6 text-[12px] leading-relaxed text-bg/45">
          Caso de teste do nosso próprio motor, registrado no conjunto de testes versionado do
          produto (estoque heterogêneo: 2 barras de 6 m e 1 de 5 m). É um exemplo de laboratório,
          não uma média de mercado.
        </p>
      </div>

      <div className="space-y-6 lg:self-center">
        {rows.map((r, i) => (
          <div key={r.name}>
            <div className="flex items-baseline justify-between gap-4">
              <span className={`text-[14px] ${r.tone === 'good' ? 'text-bg' : 'text-bg/60'}`}>
                {r.name}
              </span>
              <span
                className={`font-serif text-2xl leading-none tracking-tight ${
                  r.tone === 'good' ? 'text-mustard-200' : 'text-bg/60'
                }`}
              >
                {pct(r.val)}%
              </span>
            </div>
            <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-moss-900/70">
              <div
                className={`bar-fill h-full rounded-full ${
                  r.tone === 'good'
                    ? 'bg-gradient-to-r from-moss-300 to-mustard-300'
                    : 'bg-moss-600'
                }`}
                style={{
                  width: seen ? `${r.val}%` : 0,
                  animationDelay: `${i * 220}ms`,
                }}
              />
            </div>
            <p className="mt-1.5 text-[12px] text-bg/45">{r.mm}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ------------------------- seção completa ------------------------ */

const diffs = [
  {
    Icon: IconBox,
    title: 'Sobra com nome e sobrenome',
    body: 'Cada retalho vira uma peça de estoque de verdade: com etiqueta, medida, lote de origem, certificado e custo. No próximo pedido, ele aparece na lista antes da chapa nova.',
  },
  {
    Icon: IconLayers,
    title: 'Um corte para vários pedidos',
    body: 'Em vez de cortar pedido a pedido, o sistema junta a necessidade de várias ordens do mesmo material e corta tudo junto. É aí que a sobra some.',
  },
  {
    Icon: IconShield,
    title: 'Ninguém corta a mesma sobra duas vezes',
    body: 'Quando o plano é publicado, o material fica reservado na hora. Dois planejadores não conseguem prometer a mesma chapa — e o estoque nunca fica negativo.',
  },
  {
    Icon: IconGear,
    title: 'Sai pronto para a máquina',
    body: 'Mapa em PDF e SVG para o operador, DXF para a seccionadora ou o laser, a sequência de cortes na ordem certa e o agendamento na máquina.',
  },
  {
    Icon: IconReceipt,
    title: 'Custo no pedido certo',
    body: 'A chapa consumida, o retalho gerado e até a fita de borda são rateados para cada ordem de produção. Você descobre a margem da peça, não só a do mês.',
  },
  {
    Icon: IconBolt,
    title: 'Do plano à baixa, sem digitação',
    body: 'Aprovou o plano, o estoque baixa, o retalho entra, a ordem de produção recebe o custo e a rastreabilidade do lote sobrevive ao corte. Tudo em uma operação só.',
  },
];

type Variant = 'home' | 'full';

/**
 * `home`  → só o essencial: cabeçalho, mapa interativo, comparação e uma ponte
 *           para a página dedicada. A home é enxuta de propósito (mesma regra
 *           de /metalurgicas e /moveleiras) — a seção inteira aqui prenderia o
 *           visitante e ele nunca chegaria ao resto do funil.
 * `full`   → a experiência completa, em /plano-de-corte: soma diferenciais,
 *           diagnóstico de sobra, o desafio e a faixa de materiais.
 */
export const CuttingPlan = ({ variant = 'home' }: { variant?: Variant }) => {
  const full = variant === 'full';
  const [active, setActive] = useState(demos[0].id);
  const demo = demos.find((d) => d.id === active)!;
  const { ref, seen } = useInView<HTMLDivElement>(0.2);
  const [runId, setRunId] = useState(0);

  // replay a cada troca de material (e na primeira vez que a seção aparece)
  useEffect(() => {
    if (seen) setRunId((n) => n + 1);
  }, [seen, active]);

  const play = seen;
  const y = useCountUp(demo.stats.yield, play, `${demo.id}-${runId}-y`);
  const r = useCountUp(demo.stats.reuse, play, `${demo.id}-${runId}-r`);
  const s = useCountUp(demo.stats.scrap, play, `${demo.id}-${runId}-s`);

  return (
    <section
      id="plano-de-corte"
      className="grain relative overflow-hidden bg-moss-900 py-28 text-bg"
    >
      {/* brilho de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-moss-700/40 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 h-[440px] w-[440px] rounded-full bg-mustard-400/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        {/* ---------------------------- cabeçalho ---------------------------- */}
        <div className="reveal grid items-end gap-8 md:grid-cols-[1.15fr_1fr]">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-mustard-200">
              ·· o que quase nenhum ERP faz
            </span>
            {full ? (
              <h1 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-bg md:text-[68px]">
                O plano de corte que{' '}
                <span className="italic text-mustard-200">pensa na sobra</span> antes de cortar.
              </h1>
            ) : (
              <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-bg md:text-[68px]">
                O plano de corte que{' '}
                <span className="italic text-mustard-200">pensa na sobra</span> antes de cortar.
              </h2>
            )}
          </div>
          <p className="text-lg leading-relaxed text-bg/70">
            Todo mundo promete &quot;otimização de corte&quot;. Quase todo mundo entrega um desenho
            bonito e para por aí. Aqui o plano nasce dentro do ERP: puxa a demanda das ordens,
            enxerga o retalho que está na prateleira, reserva o material, baixa o estoque e devolve
            o custo para o pedido certo.
          </p>
        </div>

        {/* ------------------------- mapa interativo ------------------------- */}
        <div ref={ref} className="reveal mt-14" data-delay="1">
          <div className="inline-flex flex-wrap gap-2 rounded-full border border-moss-700/70 bg-moss-800/50 p-1.5">
            {demos.map((d) => {
              const sel = active === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => setActive(d.id)}
                  aria-pressed={sel}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[13px] transition sm:px-5 sm:text-sm ${
                    sel ? 'bg-bg text-moss-900' : 'text-bg/65 hover:text-bg'
                  }`}
                >
                  <d.Icon size={15} className={sel ? 'text-moss-700' : 'text-mustard-200'} />
                  {d.label}
                </button>
              );
            })}
          </div>

          <div className="mt-6 grid gap-6 rounded-2xl border border-moss-700/60 bg-moss-800/40 p-5 md:p-8 lg:grid-cols-[1.45fr_1fr]">
            {/* mapa */}
            <div key={`${demo.id}-${runId}`} className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-bg/50">
                  {demo.material}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-bg/50">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-moss-300" /> peça
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-mustard-100" /> retalho
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[3px] bg-surface" /> perda
                  </span>
                </div>
              </div>
              <CutMap demo={demo} play={play} />
            </div>

            {/* painel */}
            <div className="flex flex-col">
              <h3 className="font-serif text-[28px] leading-tight text-bg md:text-[32px]">
                {demo.headline}
              </h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bg/70">{demo.blurb}</p>

              <div className="mt-7 grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-mustard-300/30 bg-mustard-300/10 p-4">
                  <p className="font-serif text-[30px] leading-none tracking-tight text-mustard-200">
                    {pct(y)}%
                  </p>
                  <p className="mt-2 text-[11px] leading-tight text-bg/55">aproveitamento</p>
                </div>
                <div className="rounded-xl border border-moss-700/60 bg-moss-900/40 p-4">
                  <p className="font-serif text-[30px] leading-none tracking-tight text-bg">
                    {pct(r)}%
                  </p>
                  <p className="mt-2 text-[11px] leading-tight text-bg/55">volta como retalho</p>
                </div>
                <div className="rounded-xl border border-moss-700/60 bg-moss-900/40 p-4">
                  <p className="font-serif text-[30px] leading-none tracking-tight text-bg/70">
                    {pct(s)}%
                  </p>
                  <p className="mt-2 text-[11px] leading-tight text-bg/55">{demo.scrapLabel}</p>
                </div>
              </div>

              <ul className="mt-7 space-y-3">
                {demo.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-[14px] leading-snug text-bg/80">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-mustard-200" />
                    {b}
                  </li>
                ))}
              </ul>

              <p className="mt-auto pt-6 text-[12px] leading-relaxed text-bg/40">
                Plano ilustrativo, no mesmo formato que o sistema gera. Os percentuais são os deste
                desenho — o resultado na sua fábrica depende do mix de peças e do estoque.
              </p>
            </div>
          </div>
        </div>

        {/* ------------------------- comparação ------------------------- */}
        <div className="reveal mt-6" data-delay="2">
          <Comparison />
        </div>

        {/* Ponte da home: leva quem se interessou para a página dedicada, em
            vez de esticar a home com o funil inteiro. */}
        {!full && (
          <div
            className="reveal mt-6 grid gap-8 rounded-2xl border border-mustard-300/30 bg-mustard-300/10 p-8 md:grid-cols-[1.2fr_auto] md:items-center md:p-10"
            data-delay="1"
          >
            <div>
              <h3 className="font-serif text-3xl leading-tight text-bg md:text-[36px]">
                Quer fazer a conta com os números da sua fábrica?
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-bg/70">
                Na página do plano de corte você calcula quanto a sua sobra custa por ano — e pode
                mandar um plano que você usa hoje para a gente rodar no motor e comparar.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:min-w-[240px]">
              <Link
                href="/plano-de-corte"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mustard-300 px-6 py-3.5 text-sm font-medium text-moss-900 transition hover:bg-mustard-200"
              >
                Calcular a minha sobra
                <IconArrow size={15} />
              </Link>
              <Link
                href="/plano-de-corte#desafio"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-moss-600 px-6 py-3.5 text-sm text-bg/80 transition hover:border-mustard-300 hover:text-bg"
              >
                Mandar o meu plano de corte
                <IconArrow size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* ---------------------- diferenciais ---------------------- */}
        {full && (
        <div className="reveal mt-24" data-delay="1">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_1fr]">
            <h3 className="font-serif text-4xl leading-[1.1] tracking-tight text-bg md:text-5xl">
              A diferença não está no desenho.{' '}
              <span className="italic text-mustard-200">Está no que acontece depois dele.</span>
            </h3>
            <p className="text-[16px] leading-relaxed text-bg/65 md:pl-6">
              Um otimizador solto te dá um mapa. Você ainda vai digitar a baixa, anotar o retalho em
              um caderno e descobrir o custo no fim do mês. Aqui o plano é parte do ERP — e por isso
              ele fecha o ciclo sozinho.
            </p>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-moss-700/60 bg-moss-700/60 sm:grid-cols-2 lg:grid-cols-3">
            {diffs.map((d) => (
              <div
                key={d.title}
                className="group bg-moss-900 p-7 transition-colors duration-500 hover:bg-moss-800"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-moss-800 text-mustard-200 transition-colors duration-500 group-hover:bg-mustard-300 group-hover:text-moss-900">
                  <d.Icon size={18} />
                </span>
                <h4 className="mt-5 font-serif text-[24px] leading-tight text-bg">{d.title}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-bg/65">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
        )}

        {/* --------------- diagnóstico + desafio (página) --------------- */}
        {full && (
          <div className="reveal mt-24" data-delay="1">
            <CutSimulator />
          </div>
        )}
        {full && (
          <div id="desafio" className="reveal mt-6 scroll-mt-24" data-delay="1">
            <CutChallenge />
          </div>
        )}

        {/* -------------------- materiais + CTA -------------------- */}
        {full && (
        <div className="reveal mt-20 rounded-2xl border border-moss-700/60 bg-moss-800/40 p-8 md:p-12" data-delay="2">
          <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-200">
                o mesmo motor, material por material
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  'Chapa de aço',
                  'Chapa galvanizada',
                  'Alumínio',
                  'MDF e MDP',
                  'Compensado',
                  'Barra e vergalhão',
                  'Tubo e perfil',
                  'Acrílico',
                  'Vidro',
                  'Tecido',
                  'TNT',
                  'Couro',
                  'Espuma',
                  'Borracha',
                ].map((m) => (
                  <span
                    key={m}
                    className="rounded-full border border-moss-700/70 bg-moss-900/50 px-3.5 py-1.5 text-[13px] text-bg/70"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:min-w-[260px]">
              <Link
                href="/agendar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-mustard-300 px-6 py-3.5 text-sm font-medium text-moss-900 transition hover:bg-mustard-200"
              >
                Ver o plano de corte rodando
                <IconArrow size={15} />
              </Link>
              <Link
                href="/modulo/corte"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-moss-600 px-6 py-3.5 text-sm text-bg/80 transition hover:border-mustard-300 hover:text-bg"
              >
                Detalhes do módulo
                <IconArrow size={15} />
              </Link>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};
