'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { IconArrow, IconCheck, IconClock, IconUsers, IconRuler, IconLayers, IconGear, IconChartLine, IconBox, IconReceipt } from '@/components/Icons';

type VideoItem = { title: string; desc: string; duration: string; ytId: string };
type ModuleData = { label: string; icon: React.ReactNode; color: string; videos: VideoItem[] };

const modules: ModuleData[] = [
  {
    label: 'Engenharia',
    icon: <IconRuler size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'Ficha técnica (BOM) multinível', desc: 'Como montar a estrutura de uma peça com matéria-prima, processos e tempos — a base que alimenta orçamento, compra e produção sem retrabalho.', duration: '4 min', ytId: 'YOUTUBE_ID_ENG_1' },
      { title: 'Roteiro de produção por operação', desc: 'Definição de cada etapa (corte, dobra, solda, pintura, montagem) com tempo-padrão, para o sistema calcular custo e capacidade.', duration: '3 min', ytId: 'YOUTUBE_ID_ENG_2' },
      { title: 'Da engenharia ao orçamento em 1 clique', desc: 'Veja a ficha técnica virar preço de venda automaticamente, com a margem que você definiu — sem digitar nada duas vezes.', duration: '3 min', ytId: 'YOUTUBE_ID_ENG_3' },
    ],
  },
  {
    label: 'Plano de Corte',
    icon: <IconLayers size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'Nesting de chapa de aço', desc: 'O algoritmo posiciona as peças na chapa para aproveitar o máximo de material. Veja a sobra cair antes mesmo de cortar.', duration: '4 min', ytId: 'YOUTUBE_ID_COR_1' },
      { title: 'Aproveitamento de MDF e fitas de borda', desc: 'Plano de corte de placa de MDF com cálculo de fita de borda e ferragens — o coração da precificação moveleira.', duration: '4 min', ytId: 'YOUTUBE_ID_COR_2' },
      { title: 'Controle de retalho e sobra', desc: 'Como o retalho aproveitável volta para o estoque e entra no próximo plano de corte, em vez de virar lixo.', duration: '3 min', ytId: 'YOUTUBE_ID_COR_3' },
    ],
  },
  {
    label: 'PCP & Produção',
    icon: <IconGear size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'Abertura e sequenciamento de OP', desc: 'Da carteira de pedidos às ordens de produção sequenciadas por máquina, respeitando capacidade e prazo de entrega.', duration: '5 min', ytId: 'YOUTUBE_ID_PCP_1' },
      { title: 'Apontamento de chão de fábrica por coletor', desc: 'O operador aponta início, fim e quantidade direto no coletor. Você acompanha cada OP em tempo real, sem papel.', duration: '3 min', ytId: 'YOUTUBE_ID_PCP_2' },
      { title: 'OEE e gargalo em tempo real', desc: 'Painel de eficiência por máquina mostrando onde está o gargalo antes que ele estoure o prazo do cliente.', duration: '4 min', ytId: 'YOUTUBE_ID_PCP_3' },
    ],
  },
  {
    label: 'Orçamento',
    icon: <IconChartLine size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'Precificação de peça sob medida', desc: 'Orçamento que calcula material, processo e mão de obra a partir da ficha técnica — preço certo, margem garantida.', duration: '4 min', ytId: 'YOUTUBE_ID_ORC_1' },
      { title: 'Proposta com aprovação digital', desc: 'Geração de proposta profissional, envio e aprovação eletrônica do cliente — com conversão direta em ordem de produção.', duration: '3 min', ytId: 'YOUTUBE_ID_ORC_2' },
      { title: 'Funil de vendas e follow-up', desc: 'CRM visual para não perder orçamento na gaveta: cada oportunidade com etapa, valor e próximo passo.', duration: '3 min', ytId: 'YOUTUBE_ID_ORC_3' },
    ],
  },
  {
    label: 'Estoque & Compras',
    icon: <IconBox size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'MRP: a OP que puxa a compra', desc: 'A necessidade de material da ordem de produção gera a sugestão de compra automaticamente — máquina não para por falta de chapa.', duration: '4 min', ytId: 'YOUTUBE_ID_EST_1' },
      { title: 'Matéria-prima, em processo e acabado', desc: 'Controle dos três estágios de estoque em um lugar, com rastreio de lote e localização de prateleira.', duration: '3 min', ytId: 'YOUTUBE_ID_EST_2' },
      { title: 'Inventário sem parar a fábrica', desc: 'Contagem assistida por coletor, divergência automática e ajuste rastreado. Inventário em horas, não em dias.', duration: '3 min', ytId: 'YOUTUBE_ID_EST_3' },
    ],
  },
  {
    label: 'Fiscal & Custos',
    icon: <IconReceipt size={18} />,
    color: 'text-moss-700 bg-moss-50',
    videos: [
      { title: 'NF-e da indústria em lote', desc: 'Emissão com regras tributárias por produto e estado, integrada à saída de produção — sem digitação manual.', duration: '3 min', ytId: 'YOUTUBE_ID_FIS_1' },
      { title: 'Bloco K e SPED automáticos', desc: 'Como o consumo e a produção registrados no sistema geram o Bloco K e o SPED Fiscal dentro do prazo, sem consultoria.', duration: '4 min', ytId: 'YOUTUBE_ID_FIS_2' },
      { title: 'Custo real por OP e por peça', desc: 'O fechamento de custo que mostra a margem real de cada produto — qual dá lucro e qual está sangrando o caixa.', duration: '3 min', ytId: 'YOUTUBE_ID_FIS_3' },
    ],
  },
];

function VideoCard({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);
  const isPlaceholder = video.ytId.startsWith('YOUTUBE_ID_');

  return (
    <div className="group rounded-2xl border border-line bg-bg overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-20px_rgba(20,32,26,.25)]">
      <div className="relative aspect-video bg-moss-900 overflow-hidden">
        {playing && !isPlaceholder ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${video.ytId}?autoplay=1`}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            {!isPlaceholder && (
              <img
                src={`https://img.youtube.com/vi/${video.ytId}/maxresdefault.jpg`}
                alt={video.title}
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            )}
            <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 ${isPlaceholder ? 'bg-moss-800/80' : 'bg-moss-900/40'}`}>
              {isPlaceholder ? (
                <div className="text-center px-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-300">Em breve</p>
                  <p className="mt-2 text-[13px] text-bg/70">Vídeo sendo gravado</p>
                </div>
              ) : (
                <button
                  onClick={() => setPlaying(true)}
                  className="grid h-14 w-14 place-items-center rounded-full bg-bg/90 text-moss-900 shadow-lg transition group-hover:scale-105 group-hover:bg-bg"
                  aria-label="Reproduzir"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M5 3.5l11 5.5-11 5.5z" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
        <span className="absolute bottom-2 right-2 rounded-md bg-ink/80 px-2 py-0.5 font-mono text-[10px] text-bg backdrop-blur">
          {video.duration}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl leading-snug text-ink">{video.title}</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{video.desc}</p>
      </div>
    </div>
  );
}

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* Hero */}
        <section className="grain relative overflow-hidden bg-moss-900 pb-20 pt-20 text-bg">
          <div
            className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(220,192,59,.2), transparent)' }}
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/80 transition hover:bg-bg/15"
            >
              ← Voltar ao site
            </Link>
            <h1 className="mt-8 font-serif text-[56px] leading-[0.98] tracking-tightest md:text-[72px]">
              Veja o VentureERP na sua
              <br />
              fábrica de{' '}
              <span className="italic text-mustard-300">verdade.</span>
            </h1>
            <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-bg/75">
              Chega de slide e promessa. Assista às demonstrações por módulo no seu ritmo — orçamento, plano de corte, ordem de produção, fiscal — e, quando quiser, agende uma conversa ao vivo com um especialista do seu setor.
            </p>
            <div className="mt-8 flex flex-wrap gap-5 font-mono text-[12px] text-bg/60">
              {['Sem compromisso', 'Sem cartão de crédito', 'Sem script de vendas'].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <IconCheck size={14} className="text-mustard-300" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Two demo types */}
        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recorded demo — mid-funnel entry */}
            <div className="card-accent flex flex-col rounded-[28px] border border-line bg-bg p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-mustard-300 text-moss-900">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
                    <path d="M4 3.5l15 7.5-15 7.5z" />
                  </svg>
                </span>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss-700">Demonstração gravada</span>
                  <p className="font-serif text-lg text-ink">Assista quando quiser</p>
                </div>
              </div>

              <h2 className="mt-6 font-serif text-4xl leading-tight text-ink">
                Explore módulo a módulo, no seu ritmo.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
                Vídeos curtos e objetivos mostrando cada funcionalidade rodando. Vá direto ao que interessa à sua fábrica — sem precisar falar com ninguém ainda.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                {modules.map((m, i) => (
                  <button
                    key={m.label}
                    onClick={() => {
                      setActiveTab(i);
                      document.getElementById('demos-gravadas')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2.5 text-left text-[13px] text-ink transition hover:border-moss-700 hover:text-moss-700"
                  >
                    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-moss-700 ${m.color}`}>
                      {m.icon}
                    </span>
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <button
                  onClick={() => document.getElementById('demos-gravadas')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 bg-transparent px-6 py-3.5 text-base text-ink transition hover:border-ink/50"
                >
                  Ver demonstrações por módulo
                  <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-3 text-center text-[11px] text-muted">
                  {modules.reduce((a, m) => a + m.videos.length, 0)} vídeos · {modules.length} módulos
                </p>
              </div>
            </div>

            {/* Live demo — bottom-funnel CTA */}
            <div className="card-accent flex flex-col rounded-[28px] border border-line bg-paper p-8 lg:p-10">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-moss-700 text-bg">
                  <IconUsers size={22} />
                </span>
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-moss-700">Demonstração ao vivo</span>
                  <p className="font-serif text-lg text-ink">Online · Personalizada</p>
                </div>
              </div>

              <h2 className="mt-6 font-serif text-4xl leading-tight text-ink">
                30 minutos com a sua fábrica na tela.
              </h2>
              <p className="mt-4 text-[15.5px] leading-relaxed text-muted">
                Um especialista do seu setor mostra o sistema rodando com cenários reais de metalúrgica ou moveleira. Você pergunta, ele responde ao vivo. Sem roteiro fechado.
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Demonstração personalizada para o seu setor e porte',
                  'Especialista que entende de chão de fábrica',
                  'Veja o custo real por peça calculado ao vivo',
                  'Traga seu encarregado e seu financeiro',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-ink">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-moss-700" />
                    {t}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center gap-3 rounded-xl border border-mustard-300/50 bg-mustard-50 px-4 py-3">
                <IconClock size={16} className="shrink-0 text-moss-700" />
                <p className="text-[13px] text-ink">
                  <strong>30 minutos</strong> · Videoconferência · Seg a sex, 9h–18h
                </p>
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/agendar"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss-700 px-6 py-3.5 text-base text-bg transition hover:bg-moss-800"
                >
                  Agendar demonstração ao vivo
                  <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <p className="mt-3 text-center text-[11px] text-muted">
                  Escolha o horário e receba a confirmação no e-mail
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recorded demos section */}
        <section id="demos-gravadas" className="border-t border-line bg-paper py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· demonstrações gravadas</span>
                <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink">
                  Cada módulo, em detalhe.
                </h2>
                <p className="mt-3 max-w-xl text-[15px] text-muted">
                  Clique no módulo que mais interessa à sua operação e assista no seu ritmo.
                </p>
              </div>
              <Link
                href="/agendar"
                className="inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-2.5 text-sm text-bg transition hover:bg-moss-800"
              >
                Prefere ao vivo? Agendar agora
                <IconArrow size={14} />
              </Link>
            </div>

            {/* Module tabs */}
            <div className="mt-8 flex flex-wrap gap-2">
              {modules.map((m, i) => (
                <button
                  key={m.label}
                  onClick={() => setActiveTab(i)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] transition ${
                    activeTab === i
                      ? 'border-moss-700 bg-moss-700 text-bg'
                      : 'border-line bg-bg text-ink hover:border-moss-700 hover:text-moss-700'
                  }`}
                >
                  <span className={activeTab === i ? 'text-mustard-300' : 'text-moss-700'}>
                    {m.icon}
                  </span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Videos grid */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {modules[activeTab].videos.map((v) => (
                <VideoCard key={v.ytId} video={v} />
              ))}
            </div>

            {/* CTA below videos */}
            <div className="mt-14 rounded-2xl border border-moss-800 bg-moss-900 p-8 text-bg md:p-10">
              <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-300">·· próximo passo</p>
                  <h3 className="mt-2 font-serif text-3xl">
                    Gostou do que viu? Veja com os números da sua fábrica.
                  </h3>
                  <p className="mt-2 text-[14px] text-bg/70">
                    A demonstração ao vivo é personalizada para os seus processos. Em 30 minutos você sabe se o VentureERP é o certo para você.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-3">
                  <Link
                    href="/agendar"
                    className="inline-flex items-center gap-2 rounded-full bg-mustard-300 px-6 py-3 text-sm font-medium text-moss-900 transition hover:bg-mustard-200"
                  >
                    Agendar demonstração <IconArrow size={15} />
                  </Link>
                  <Link
                    href="/#contato"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-bg/20 px-6 py-3 text-sm text-bg transition hover:border-bg/50"
                  >
                    Falar com o comercial <IconArrow size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
