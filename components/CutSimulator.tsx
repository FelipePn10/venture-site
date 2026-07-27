'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck, IconFlame, IconTree, IconRuler, IconLayers } from './Icons';
import { maskPhoneBR, phoneDigits } from '@/lib/phone';
import { HONEYPOT_FIELD } from '@/lib/antispam';
import { trackConversion } from '@/lib/track';

/**
 * Diagnóstico de sobra — a versão "com skin in the game" do simulador.
 *
 * Duas decisões deliberadas:
 *
 * 1. Ele NÃO promete ganho. Toda a conta é aritmética sobre números que o
 *    próprio visitante informa: quanto compra, quanto aproveita hoje e qual
 *    meta ele considera possível. O site nunca sugere o percentual de melhora —
 *    quem move o slider da meta é o lead. Isso mantém a política de claims do
 *    projeto (só a Tecnofer tem número comprovado) e, na prática, convence
 *    mais: o número que dói é o dele, não o nosso.
 *
 * 2. O resultado aparece na hora, sem pedir e-mail. O que é trocado por
 *    contato é a etapa seguinte — rodar um plano de corte com as peças reais
 *    da fábrica dele na demonstração. Gate no número seria atrito; gate no
 *    aprofundamento é oferta.
 */

const MATERIALS = [
  {
    id: 'aco',
    label: 'Chapa de aço',
    Icon: IconFlame,
    unitOne: 'chapa',
    unitMany: 'chapas',
    price: 1200,
    segment: 'Metalúrgica',
    hint: 'Pegue uma chapa: quanto dela sai como peça boa? O resto é sobra.',
  },
  {
    id: 'mdf',
    label: 'MDF e madeira',
    Icon: IconTree,
    unitOne: 'chapa',
    unitMany: 'chapas',
    price: 320,
    segment: 'Moveleira',
    hint: 'Pegue uma placa: quanto dela vira peça do móvel? O resto é sobra.',
  },
  {
    id: 'perfil',
    label: 'Barra, tubo e perfil',
    Icon: IconRuler,
    unitOne: 'barra',
    unitMany: 'barras',
    price: 190,
    segment: 'Metalúrgica',
    hint: 'Pegue uma barra de 6 m: quantos metros viram peça? O resto é ponta.',
  },
  {
    id: 'flex',
    label: 'Tecido, TNT e couro',
    Icon: IconLayers,
    unitOne: 'rolo',
    unitMany: 'rolos',
    price: 850,
    segment: 'Outro setor',
    hint: 'Pegue um rolo: quanto dele vira peça cortada? O resto é sobra.',
  },
] as const;

type MaterialId = (typeof MATERIALS)[number]['id'];
type Step = 'calc' | 'form' | 'done';

const brl = (n: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));

/** Slider com rótulo e valor à direita. */
const Slider = ({
  id,
  label,
  value,
  display,
  min,
  max,
  step = 1,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step?: number;
  onChange: (n: number) => void;
  help?: string;
}) => (
  <div>
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <label htmlFor={id} className="text-[14px] leading-snug text-bg/70">
        {label}
      </label>
      <span className="font-serif text-xl leading-none text-bg tabular-nums">{display}</span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="mt-3 w-full accent-mustard-300"
    />
    {help && <p className="mt-2 text-[12px] leading-snug text-bg/40">{help}</p>}
  </div>
);

export const CutSimulator = () => {
  const [step, setStep] = useState<Step>('calc');

  // --- entradas do diagnóstico ---
  const [material, setMaterial] = useState<MaterialId>('aco');
  const [gasto, setGasto] = useState(180); // em milhares de reais / mês
  const [hoje, setHoje] = useState(80); // aproveitamento atual (%)
  const [meta, setMeta] = useState(88); // meta que o lead considera possível (%)
  const [preco, setPreco] = useState(1200); // preço médio da unidade de material

  const mat = MATERIALS.find((m) => m.id === material)!;

  // Trocar de material reposiciona o preço de referência (o lead ajusta depois).
  useEffect(() => {
    setPreco(mat.price);
  }, [mat.price]);

  // A meta nunca pode ficar abaixo do aproveitamento atual.
  useEffect(() => {
    setMeta((m) => (m <= hoje ? Math.min(97, hoje + 5) : m));
  }, [hoje]);

  const calc = useMemo(() => {
    const gastoMes = gasto * 1000;
    const sobraMes = gastoMes * (1 - hoje / 100);
    const recuperavelMes = gastoMes * Math.max(0, (meta - hoje) / 100);
    const porPonto = gastoMes / 100;
    const unidadesMes = preco > 0 ? recuperavelMes / preco : 0;
    const emJogoAno = recuperavelMes * 12;
    return { gastoMes, sobraMes, recuperavelMes, porPonto, unidadesMes, emJogoAno };
  }, [gasto, hoje, meta, preco]);

  // --- captura do lead ---
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [sending, setSending] = useState(false);
  const [erro, setErro] = useState('');
  const mountedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((k) => {
      const v = p.get(k);
      if (v) found[k] = v;
    });
    if (document.referrer) found.referrer = document.referrer;
    setUtm(found);
  }, []);

  /** O resumo vai junto do lead: o comercial abre o e-mail já sabendo o cenário. */
  const resumo = [
    `— Diagnóstico de sobra preenchido pelo próprio lead —`,
    `Material: ${mat.label}`,
    `Compra de matéria-prima: ${brl(calc.gastoMes)} / mês`,
    `Aproveitamento que ele declara hoje: ${hoje}%`,
    `Meta que ele considera possível: ${meta}%`,
    `Sobra atual estimada: ${brl(calc.sobraMes)} / mês`,
    `Diferença até a meta: ${brl(calc.recuperavelMes)} / mês (${brl(
      calc.recuperavelMes * 12,
    )} / ano)`,
    `Equivale a ~${calc.unidadesMes.toFixed(1)} ${mat.unitMany}/mês a ${brl(preco)} cada`,
    `Total em jogo por ano: ${brl(calc.emJogoAno)}`,
  ].join('\n');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErro('É preciso aceitar o uso dos seus dados para continuar.');
      return;
    }
    if (form.phone && phoneDigits(form.phone) < 10) {
      setErro('O WhatsApp parece incompleto. Confira o DDD e o número.');
      return;
    }
    setSending(true);
    setErro('');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          company: form.company,
          email: form.email,
          phone: form.phone,
          segment: mat.segment,
          challenges: ['Sobra de chapa / MDF'],
          message: resumo,
          consent: true,
          source: 'Home · Diagnóstico de sobra (plano de corte)',
          utm,
          [HONEYPOT_FIELD]: honeypot,
          elapsedMs: Date.now() - mountedAt.current,
        }),
      });
      if (res.ok) {
        setStep('done');
        trackConversion('lead', {
          source: 'simulador-plano-de-corte',
          material: mat.id,
          valor_anual_em_jogo: Math.round(calc.emJogoAno),
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || 'Não foi possível enviar. Tente novamente.');
      }
    } catch {
      setErro('Falha de conexão. Tente novamente.');
    } finally {
      setSending(false);
    }
  };

  const field =
    'mt-1.5 w-full rounded-lg border border-moss-700 bg-moss-900/60 px-3 py-2.5 text-sm text-bg placeholder:text-bg/35 focus:border-mustard-300 focus:outline-none';
  const lbl = 'font-mono text-[10px] uppercase tracking-[0.16em] text-bg/60';

  return (
    <div className="rounded-2xl border border-moss-700/60 bg-moss-800/40 p-7 md:p-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        {/* ----------------------- coluna das perguntas ----------------------- */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-200">
            30 segundos · com os seus números
          </p>
          <h3 className="mt-3 font-serif text-3xl leading-tight text-bg md:text-[38px]">
            Quanto a sua sobra custa por ano?
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-bg/65">
            Ninguém precisa acreditar em número de fornecedor. Preencha com a realidade da sua
            fábrica — a conta é feita na sua frente, e você mesmo define a meta.
          </p>

          {/*
            Material: é a primeira decisão do diagnóstico, então precisa ser
            impossível de não ver. Cartão em grade (não chip solto), fundo
            sólido no não-selecionado para as opções se destacarem do card
            escuro, e amarelo CHEIO no selecionado — o estado translúcido
            anterior mal se distinguia dos demais.
          */}
          <div className="mt-8">
            <div className="flex items-baseline justify-between gap-3">
              <span className={lbl}>O que você mais corta</span>
              <span className="text-[12px] text-bg/45">escolha 1</span>
            </div>
            <div role="radiogroup" aria-label="O que você mais corta" className="mt-3 grid grid-cols-2 gap-2.5">
              {MATERIALS.map((m) => {
                const sel = material === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="radio"
                    aria-checked={sel}
                    onClick={() => setMaterial(m.id)}
                    className={`flex items-center gap-3 rounded-xl border-2 px-3.5 py-3 text-left text-[14px] leading-tight transition ${
                      sel
                        ? 'border-mustard-300 bg-mustard-300 font-medium text-moss-900 shadow-[0_10px_24px_-12px_rgba(220,192,59,.7)]'
                        : 'border-moss-600 bg-moss-900/70 text-bg/90 hover:border-mustard-300/60 hover:bg-moss-900'
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                        sel ? 'bg-moss-900 text-mustard-200' : 'bg-moss-800 text-mustard-200'
                      }`}
                    >
                      <m.Icon size={16} />
                    </span>
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-7">
            <Slider
              id="sim-gasto"
              label="Quanto você compra de matéria-prima por mês"
              value={gasto}
              display={brl(gasto * 1000)}
              min={10}
              max={2000}
              step={10}
              onChange={setGasto}
            />

            <Slider
              id="sim-hoje"
              label="Quanto da sua matéria-prima vira peça boa hoje"
              value={hoje}
              display={`${hoje}%`}
              min={50}
              max={95}
              onChange={setHoje}
              help={mat.hint}
            />

            <Slider
              id="sim-meta"
              label="Até onde você acha que dá para chegar"
              value={meta}
              display={`${meta}%`}
              min={Math.min(hoje + 1, 97)}
              max={97}
              onChange={setMeta}
              help="Você define a meta. O VentureERP não promete percentual — mostramos o plano e você confere no seu próprio lote."
            />

            <Slider
              id="sim-preco"
              label={`Preço médio de 1 ${mat.unitOne} que você compra`}
              value={preco}
              display={brl(preco)}
              min={50}
              max={4000}
              step={10}
              onChange={setPreco}
              help="Ajuste para o preço que você paga hoje — é só para traduzir o valor em material."
            />
          </div>
        </div>

        {/* ------------------------ coluna do resultado ----------------------- */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          {step === 'calc' && (
            <div className="rounded-2xl border border-moss-700/60 bg-moss-900/60 p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bg/45">
                a sua conta, agora
              </p>

              <div className="mt-6 border-b border-moss-700/60 pb-6">
                <p className="text-[13px] text-bg/55">
                  Dos {brl(calc.gastoMes)} que você compra por mês, isto não vira peça:
                </p>
                <p className="mt-2 font-serif text-[44px] leading-none tracking-tightest text-bg tabular-nums">
                  {brl(calc.sobraMes)}
                </p>
                <p className="mt-2 text-[13px] text-bg/45">
                  {brl(calc.sobraMes * 12)} por ano em material que você pagou e não virou produto.
                </p>
              </div>

              <div className="border-b border-moss-700/60 py-6">
                <p className="text-[13px] text-bg/55">
                  Chegando a {meta}% de aproveitamento, você recupera:
                </p>
                <p className="mt-2 font-serif text-[44px] leading-none tracking-tightest text-mustard-200 tabular-nums">
                  {brl(calc.recuperavelMes)}
                  <span className="ml-2 font-sans text-[15px] tracking-normal text-bg/45">
                    /mês
                  </span>
                </p>
                <p className="mt-2 text-[13px] text-bg/45">
                  ≈ {calc.unidadesMes.toFixed(1)}{' '}
                  {calc.unidadesMes < 2 ? mat.unitOne : mat.unitMany} por mês que você deixa de
                  comprar. Cada ponto percentual vale {brl(calc.porPonto)}/mês.
                </p>
              </div>

              <div className="rounded-xl border border-mustard-300/40 bg-mustard-300/10 p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-200">
                  em jogo por ano
                </p>
                <p className="mt-2 font-serif text-[40px] leading-none tracking-tightest text-mustard-200 tabular-nums">
                  {brl(calc.emJogoAno)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mustard-300 px-5 py-3.5 text-sm font-medium text-moss-900 transition hover:bg-mustard-200"
              >
                Ver isso com as minhas peças
                <IconArrow size={16} />
              </button>
              <p className="mt-3 text-center text-[12px] leading-relaxed text-bg/40">
                Na demonstração, rodamos um plano de corte com um lote real da sua fábrica e
                comparamos com o que você corta hoje.
              </p>
            </div>
          )}

          {step === 'form' && (
            <form
              onSubmit={submit}
              className="rounded-2xl border border-moss-700/60 bg-moss-900/60 p-7"
            >
              {/* Honeypot: invisível para humanos, preenchido por bots. */}
              <div
                aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
              >
                <label>
                  Não preencha este campo
                  <input
                    type="text"
                    name={HONEYPOT_FIELD}
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => setStep('calc')}
                className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/45 transition hover:text-bg/80"
              >
                ← voltar para a conta
              </button>

              <h4 className="mt-4 font-serif text-[28px] leading-tight text-bg">
                Vamos rodar isso com as suas peças.
              </h4>
              <p className="mt-3 text-[14px] leading-relaxed text-bg/60">
                Você traz uma lista de peças e o estoque que tem hoje. A gente monta o plano de
                corte na sua frente e você compara com o aproveitamento atual. Sem apresentação de
                slides.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={lbl}>Nome *</span>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Seu nome"
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={lbl}>Empresa *</span>
                    <input
                      type="text"
                      required
                      value={form.company}
                      onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                      placeholder="Nome da fábrica"
                      className={field}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className={lbl}>E-mail corporativo *</span>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="voce@empresa.com.br"
                      className={field}
                    />
                  </label>
                  <label className="block">
                    <span className={lbl}>WhatsApp</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={16}
                      value={form.phone}
                      onChange={(e) => setForm((f) => ({ ...f, phone: maskPhoneBR(e.target.value) }))}
                      placeholder="(11) 99999-9999"
                      className={field}
                    />
                  </label>
                </div>
              </div>

              {/* O lead vê exatamente o que segue junto com o contato dele. */}
              <div className="mt-5 rounded-xl border border-moss-700/60 bg-moss-800/50 p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bg/45">
                  vai junto com o seu contato
                </p>
                <ul className="mt-3 space-y-1.5 text-[13px] text-bg/70">
                  <li className="flex justify-between gap-4">
                    <span className="text-bg/50">Material</span>
                    <span>{mat.label}</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-bg/50">Aproveitamento hoje → meta</span>
                    <span>
                      {hoje}% → {meta}%
                    </span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span className="text-bg/50">Em jogo por ano</span>
                    <span className="text-mustard-200">{brl(calc.emJogoAno)}</span>
                  </li>
                </ul>
              </div>

              <label className="mt-5 flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-mustard-300"
                />
                <span className="text-[12.5px] leading-relaxed text-bg/55">
                  Autorizo o VentureERP a usar meus dados para entrar em contato sobre o sistema.
                  Sem repasse a terceiros, e você pode pedir a exclusão a qualquer momento — veja a{' '}
                  <Link href="/privacidade" className="underline underline-offset-2 hover:text-bg">
                    política de privacidade
                  </Link>
                  .
                </span>
              </label>

              {erro && (
                <p className="mt-4 rounded-lg border border-[#A8563A]/50 bg-[#A8563A]/15 px-3 py-2 text-[12px] text-[#F0C0AC]">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-mustard-300 px-5 py-3.5 text-sm font-medium text-moss-900 transition hover:bg-mustard-200 disabled:opacity-60"
              >
                {sending ? 'Enviando…' : 'Quero ver o plano com as minhas peças'}
                {!sending && <IconArrow size={16} />}
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-bg/40">
                Retorno em até 1 dia útil · Sem compromisso
              </p>
            </form>
          )}

          {step === 'done' && (
            <div className="rounded-2xl border border-moss-700/60 bg-moss-900/60 p-8 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mustard-300 text-moss-900">
                <IconCheck size={30} />
              </span>
              <h4 className="mt-6 font-serif text-3xl text-bg">Diagnóstico registrado</h4>
              <p className="mt-3 text-[15px] leading-relaxed text-bg/65">
                Um especialista retoma exatamente estes números com você em até um dia útil pelo{' '}
                <strong className="text-bg">{form.email}</strong>. Separe uma lista de peças e o
                que você tem de estoque — é com isso que a gente monta o plano na reunião.
              </p>
              <Link
                href="/agendar"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-mustard-300 px-5 py-3 text-sm font-medium text-moss-900 transition hover:bg-mustard-200"
              >
                Escolher o horário agora <IconArrow size={15} />
              </Link>
            </div>
          )}

          <p className="mt-5 text-[12px] leading-relaxed text-bg/40">
            Esta conta usa apenas os valores que você informou acima. O VentureERP não promete
            percentual de ganho: o resultado depende do seu mix de peças, do estoque e de como a
            fábrica corta hoje.
          </p>
        </div>
      </div>
    </div>
  );
};
