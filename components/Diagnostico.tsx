'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck, IconFlame, IconTree, IconCalendar } from './Icons';

/**
 * Diagnóstico de maturidade da operação.
 *
 * Cada resposta tem um peso (0 = já resolvido, 2 = ponto crítico). O resultado
 * é qualitativo de propósito: aponta ONDE a fábrica provavelmente perde margem,
 * sem prometer percentual de economia que não temos como medir daqui.
 */

type Option = { label: string; weight: 0 | 1 | 2 };
type Question = {
  id: string;
  area: string;
  question: string;
  options: Option[];
  /** Mostrado quando a resposta tem peso alto. */
  finding: string;
};

const QUESTIONS: Question[] = [
  {
    id: 'orcamento',
    area: 'Orçamento e precificação',
    question: 'Como você monta o preço de uma peça sob medida hoje?',
    options: [
      { label: 'Pela experiência de quem orça', weight: 2 },
      { label: 'Planilha com custos que atualizamos de vez em quando', weight: 2 },
      { label: 'Sistema, mas sem tempo de máquina e consumo real', weight: 1 },
      { label: 'Sistema com ficha técnica e custo de processo', weight: 0 },
    ],
    finding:
      'Seu preço não está amarrado ao custo real de processo. Isso costuma significar pedido perdido por preço alto ou pedido produzido no prejuízo — e você só descobre qual foi no fechamento.',
  },
  {
    id: 'corte',
    area: 'Aproveitamento de material',
    question: 'Como é definido o plano de corte de chapa ou MDF?',
    options: [
      { label: 'No olho, direto na máquina', weight: 2 },
      { label: 'Planilha ou desenho feito à mão', weight: 2 },
      { label: 'Software separado, sem ligação com o estoque', weight: 1 },
      { label: 'Nesting integrado à ficha técnica e ao estoque', weight: 0 },
    ],
    finding:
      'Sem nesting integrado, a sobra de material vira retalho que ninguém reaproveita. É onde a matéria-prima mais cara costuma escapar sem aparecer em nenhum relatório.',
  },
  {
    id: 'pcp',
    area: 'Controle de produção',
    question: 'Se eu perguntar agora onde está um pedido específico, como você responde?',
    options: [
      { label: 'Perguntando ao encarregado no chão de fábrica', weight: 2 },
      { label: 'Olhando a ficha em papel na prancheta', weight: 2 },
      { label: 'Planilha atualizada uma vez por dia', weight: 1 },
      { label: 'Painel em tempo real por posto de trabalho', weight: 0 },
    ],
    finding:
      'A informação de produção chega tarde demais para agir. Quando o atraso aparece, o prazo com o cliente já foi comprometido.',
  },
  {
    id: 'custo',
    area: 'Custo real por ordem',
    question: 'Você sabe a margem real de cada ordem de produção depois de fechada?',
    options: [
      { label: 'Não conseguimos calcular por ordem', weight: 2 },
      { label: 'Só no resultado consolidado do mês', weight: 2 },
      { label: 'Calculamos à mão para alguns pedidos', weight: 1 },
      { label: 'Sim, custo e margem por OP no sistema', weight: 0 },
    ],
    finding:
      'Sem margem por OP, não dá para saber qual produto sustenta a fábrica e qual drena caixa. Decisão de mix e de preço vira aposta.',
  },
  {
    id: 'fiscal',
    area: 'Fiscal industrial',
    question: 'Como o Bloco K e o SPED são fechados hoje?',
    options: [
      { label: 'O contador monta a partir do que enviamos', weight: 2 },
      { label: 'Planilha que alguém consolida todo mês', weight: 2 },
      { label: 'Sistema, mas com ajuste manual todo fechamento', weight: 1 },
      { label: 'Gerado automaticamente pela produção apontada', weight: 0 },
    ],
    finding:
      'Fechamento manual do Bloco K é retrabalho recorrente com exposição fiscal em cima — a informação declarada não nasce do que foi realmente produzido.',
  },
  {
    id: 'estoque',
    area: 'Estoque e compras',
    question: 'Com que frequência a produção para por falta de material?',
    options: [
      { label: 'Acontece com alguma frequência', weight: 2 },
      { label: 'Às vezes, e sempre pega de surpresa', weight: 2 },
      { label: 'Raramente, mas compramos com folga grande', weight: 1 },
      { label: 'Praticamente nunca — MRP puxa a compra da OP', weight: 0 },
    ],
    finding:
      'Ou a máquina para, ou você imobiliza caixa em estoque de segurança. Os dois casos são sintoma da necessidade de compra não estar ligada à ordem de produção.',
  },
];

const SEGMENTS = [
  { id: 'Metalúrgica', Icon: IconFlame },
  { id: 'Moveleira', Icon: IconTree },
  { id: 'Outro', Icon: IconCalendar },
];

type State = 'idle' | 'loading' | 'done' | 'error';

export const Diagnostico = () => {
  const [step, setStep] = useState(0);
  /** id da pergunta -> índice da opção escolhida. Única fonte de verdade. */
  const [chosen, setChosen] = useState<Record<string, number>>({});
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    segment: 'Metalúrgica',
    size: 'Até 50 funcionários',
  });

  const total = QUESTIONS.length;
  const isFormStep = step === total;

  const weightOf = (q: Question) =>
    chosen[q.id] !== undefined ? q.options[chosen[q.id]].weight : 0;

  const findings = useMemo(
    () => QUESTIONS.filter((q) => weightOf(q) >= 2),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chosen],
  );

  const score = useMemo(
    () => QUESTIONS.reduce((sum, q) => sum + weightOf(q), 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chosen],
  );

  const maturity =
    score >= 9
      ? {
          label: 'Operação apoiada em processo manual',
          body: 'A maior parte das decisões depende de planilha, papel ou da memória de alguém. É o cenário em que um ERP industrial costuma mudar mais coisa — e também o que exige mais cuidado na implantação.',
        }
      : score >= 5
        ? {
            label: 'Operação parcialmente informatizada',
            body: 'Você já tem sistema em parte do fluxo, mas as pontas não se conversam. O ganho aqui costuma vir de integrar o que já existe, não de trocar tudo.',
          }
        : {
            label: 'Operação já bem estruturada',
            body: 'Sua fábrica já controla o essencial. Faz sentido conversar sobre pontos específicos, e não sobre uma troca completa de sistema.',
          };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');

    const labelled = Object.fromEntries(
      QUESTIONS.map((q) => [
        q.question,
        chosen[q.id] !== undefined ? q.options[chosen[q.id]].label : 'Não respondido',
      ]),
    );

    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, answers: labelled }),
      });
      if (res.ok) {
        setState('done');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Não foi possível enviar. Tente novamente.');
        setState('error');
      }
    } catch {
      setErrorMsg('Falha de conexão. Tente novamente.');
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="rounded-[26px] border border-line bg-bg p-8 md:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-moss-700 text-bg">
          <IconCheck size={26} />
        </span>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-moss-700">
          ·· seu diagnóstico
        </p>
        <h2 className="mt-3 font-serif text-4xl leading-tight text-ink">{maturity.label}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{maturity.body}</p>

        {findings.length > 0 && (
          <>
            <p className="mt-9 font-serif text-2xl text-ink">
              Onde sua fábrica provavelmente perde margem hoje
            </p>
            <ul className="mt-5 space-y-5">
              {findings.map((f) => (
                <li key={f.id} className="rounded-xl border border-line bg-paper p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss-700">
                    {f.area}
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{f.finding}</p>
                </li>
              ))}
            </ul>
          </>
        )}

        <p className="mt-8 rounded-xl border border-line bg-paper p-5 text-[13px] leading-relaxed text-muted">
          Este diagnóstico é uma leitura qualitativa a partir das suas respostas — não é uma
          auditoria nem uma estimativa de economia. Para dimensionar ganho de verdade é preciso
          olhar os números da sua operação, o que fazemos na demonstração.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 rounded-full bg-moss-700 px-6 py-3.5 text-sm text-bg transition hover:bg-moss-800"
          >
            Agendar demonstração de 30 min <IconArrow size={16} />
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-sm text-ink transition hover:border-ink/50"
          >
            Ver a demonstração no meu ritmo
          </Link>
        </div>
        <p className="mt-4 text-[13px] text-muted">
          Recebemos suas respostas e vamos retomar o contato por{' '}
          <strong className="text-ink">{form.email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[26px] border border-line bg-bg p-6 md:p-8">
      {/* Progresso */}
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-moss-50">
          <div
            className="h-full rounded-full bg-moss-700 transition-all duration-300"
            style={{ width: `${((step + (isFormStep ? 1 : 0)) / (total + 1)) * 100}%` }}
          />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
          {isFormStep ? 'Último passo' : `${step + 1} de ${total}`}
        </span>
      </div>

      {!isFormStep && (
        <div className="mt-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-moss-700">
            {QUESTIONS[step].area}
          </p>
          <p className="mt-3 font-serif text-[27px] leading-snug text-ink">
            {QUESTIONS[step].question}
          </p>

          <div className="mt-6 space-y-2.5">
            {QUESTIONS[step].options.map((opt, i) => {
              const q = QUESTIONS[step];
              const sel = chosen[q.id] === i;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => {
                    setChosen((c) => ({ ...c, [q.id]: i }));
                    setTimeout(() => setStep((s) => s + 1), 180);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] transition ${
                    sel
                      ? 'border-moss-700 bg-moss-50 text-moss-800'
                      : 'border-line bg-paper text-ink hover:border-moss-700'
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${
                      sel ? 'border-moss-700 bg-moss-700 text-bg' : 'border-line'
                    }`}
                  >
                    {sel && <IconCheck size={12} />}
                  </span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-muted underline-offset-2 hover:text-ink hover:underline"
            >
              ← Voltar
            </button>
          )}
        </div>
      )}

      {isFormStep && (
        <form className="mt-7" onSubmit={submit}>
          <p className="font-serif text-[27px] leading-snug text-ink">
            Para onde enviamos seu diagnóstico?
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-muted">
            O resultado aparece na tela assim que você enviar.
          </p>

          <div className="mt-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Seu setor *
            </span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SEGMENTS.map(({ id, Icon }) => {
                const sel = form.segment === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, segment: id }))}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[12px] transition ${
                      sel
                        ? 'border-moss-700 bg-moss-50 text-moss-800'
                        : 'border-line bg-paper text-ink hover:border-moss-700'
                    }`}
                  >
                    <Icon size={20} className={sel ? 'text-moss-700' : 'text-muted'} />
                    {id}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Nome *
              </span>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Seu nome"
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                Empresa *
              </span>
              <input
                type="text"
                required
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                placeholder="Nome da empresa"
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                E-mail *
              </span>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="voce@empresa.com.br"
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                WhatsApp
              </span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              Porte
            </span>
            <select
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink focus:border-moss-700 focus:outline-none"
            >
              <option>Até 50 funcionários</option>
              <option>50 — 150 funcionários</option>
              <option>150 — 500 funcionários</option>
              <option>Mais de 500</option>
            </select>
          </label>

          {state === 'error' && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss-700 px-5 py-3.5 text-sm text-bg transition hover:bg-moss-800 disabled:opacity-60"
          >
            {state === 'loading' ? 'Gerando diagnóstico…' : 'Ver meu diagnóstico'}
            {state !== 'loading' && <IconArrow size={16} />}
          </button>

          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="mt-4 block font-mono text-[10px] uppercase tracking-[0.14em] text-muted underline-offset-2 hover:text-ink hover:underline"
          >
            ← Voltar
          </button>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">
            Seus dados são usados só para enviar o diagnóstico e falar sobre o VentureERP. Sem
            repasse a terceiros — veja a{' '}
            <Link href="/privacidade" className="underline underline-offset-2 hover:text-ink">
              política de privacidade
            </Link>
            .
          </p>
        </form>
      )}
    </div>
  );
};
