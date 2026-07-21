'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck } from './Icons';
import { maskPhoneBR, phoneDigits } from '@/lib/phone';

/**
 * Formulário de marketing do VentureERP.
 *
 * Qualifica o lead com o que o time comercial precisa saber ANTES da primeira
 * reunião — cargo, porte, sistema atual, desafio e prazo de decisão — já que a
 * proposta só é montada depois desse encontro.
 *
 * Campos obrigatórios são poucos de propósito: nome, e-mail, empresa, setor e
 * consentimento. O resto qualifica sem criar barreira de preenchimento.
 */

const ROLES = [
  'Diretoria / Proprietário',
  'Gerência industrial / PCP',
  'Engenharia / Projetos',
  'TI',
  'Financeiro / Controladoria',
  'Outro',
];

const SEGMENTS = ['Metalúrgica', 'Moveleira', 'Outro setor'];

const SIZES = [
  'Até 20 funcionários',
  '20 — 50 funcionários',
  '50 — 150 funcionários',
  '150 — 500 funcionários',
  'Mais de 500',
];

const SYSTEMS = [
  'Planilhas e papel',
  'ERP genérico (não industrial)',
  'ERP industrial que não atende',
  'Sistema próprio / legado',
  'Nenhum sistema',
];

const TIMELINES = [
  'Quero resolver agora',
  'Nos próximos 3 meses',
  'Nos próximos 6 meses',
  'Ainda pesquisando',
];

const CHALLENGES = [
  'Orçamento e precificação',
  'Sobra de chapa / MDF',
  'Controle de produção (PCP)',
  'Custo real por peça',
  'Bloco K / SPED',
  'Estoque e compras',
];

type State = 'idle' | 'loading' | 'ok' | 'error';

export type LeadFormProps = {
  /** Identifica de onde veio o lead (aparece no CRM e no e-mail). */
  source: string;
  /** Pré-seleciona o setor nas páginas de metalúrgicas e moveleiras. */
  defaultSegment?: string;
  title?: string;
  subtitle?: string;
  className?: string;
};

export const LeadForm = ({
  source,
  defaultSegment,
  title = 'Fale com um especialista do seu setor',
  subtitle = 'Conte como sua fábrica trabalha hoje. Retornamos com um especialista que entende de chão de fábrica — não com um vendedor lendo roteiro.',
  className = '',
}: LeadFormProps) => {
  const [state, setState] = useState<State>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [utm, setUtm] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: '',
    segment: defaultSegment && SEGMENTS.includes(defaultSegment) ? defaultSegment : '',
    size: '',
    system: '',
    timeline: '',
    message: '',
    consent: false,
  });
  const [challenges, setChallenges] = useState<string[]>([]);

  // Guarda a origem da campanha para o lead chegar atribuído no CRM.
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

  const toggleChallenge = (c: string) =>
    setChallenges((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg('É preciso aceitar o uso dos seus dados para continuar.');
      setState('error');
      return;
    }
    // WhatsApp é opcional, mas se preenchido precisa estar completo (10 ou 11 dígitos).
    if (form.phone && phoneDigits(form.phone) < 10) {
      setErrorMsg('O WhatsApp parece incompleto. Confira o DDD e o número.');
      setState('error');
      return;
    }
    setState('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, challenges, source, utm }),
      });
      if (res.ok) {
        setState('ok');
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

  if (state === 'ok') {
    return (
      <div className={`rounded-[26px] border border-line bg-bg p-8 text-center md:p-10 ${className}`}>
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss-700 text-bg">
          <IconCheck size={30} />
        </span>
        <h3 className="mt-6 font-serif text-3xl text-ink">Recebemos seu contato</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Um especialista do setor{' '}
          {form.segment ? <strong className="text-ink">{form.segment.toLowerCase()}</strong> : 'da sua fábrica'}{' '}
          retorna em até um dia útil pelo e-mail{' '}
          <strong className="text-ink">{form.email}</strong>.
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-muted">
          Se preferir adiantar, escolha você mesmo o melhor horário:
        </p>
        <Link
          href="/agendar"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-3 text-sm text-bg transition hover:bg-moss-800"
        >
          Agendar demonstração de 30 min <IconArrow size={15} />
        </Link>
      </div>
    );
  }

  const field =
    'mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none';
  const label = 'font-mono text-[10px] uppercase tracking-[0.16em] text-muted';

  return (
    <form onSubmit={submit} className={`rounded-[26px] border border-line bg-bg p-6 md:p-8 ${className}`}>
      <h3 className="font-serif text-3xl leading-snug text-ink">{title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted">{subtitle}</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Nome *</span>
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
          <span className={label}>Empresa *</span>
          <input
            type="text"
            required
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="Nome da empresa"
            className={field}
          />
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>E-mail corporativo *</span>
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
          <span className={label}>WhatsApp</span>
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

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Setor *</span>
          <select
            required
            value={form.segment}
            onChange={(e) => setForm((f) => ({ ...f, segment: e.target.value }))}
            className={field}
          >
            <option value="">Selecione…</option>
            {SEGMENTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>Seu cargo</span>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            className={field}
          >
            <option value="">Selecione…</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={label}>Porte da fábrica</span>
          <select
            value={form.size}
            onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            className={field}
          >
            <option value="">Selecione…</option>
            {SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className={label}>O que usa hoje</span>
          <select
            value={form.system}
            onChange={(e) => setForm((f) => ({ ...f, system: e.target.value }))}
            className={field}
          >
            <option value="">Selecione…</option>
            {SYSTEMS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5">
        <span className={label}>Onde mais dói hoje? (pode marcar mais de um)</span>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {CHALLENGES.map((c) => {
            const sel = challenges.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleChallenge(c)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] transition ${
                  sel
                    ? 'border-moss-700 bg-moss-50 text-moss-800'
                    : 'border-line bg-paper text-ink hover:border-moss-700'
                }`}
              >
                {sel && <IconCheck size={13} />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-5 block">
        <span className={label}>Prazo para resolver</span>
        <select
          value={form.timeline}
          onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
          className={field}
        >
          <option value="">Selecione…</option>
          {TIMELINES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>

      <label className="mt-4 block">
        <span className={label}>Quer contar mais alguma coisa? (opcional)</span>
        <textarea
          rows={3}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Ex.: temos 3 células de produção e o orçamento hoje leva 2 dias para sair…"
          className={`${field} resize-none`}
        />
      </label>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
          className="mt-0.5 h-4 w-4 shrink-0 accent-moss-700"
        />
        <span className="text-[13px] leading-relaxed text-muted">
          Autorizo o VentureERP a usar meus dados para entrar em contato sobre o sistema. Sem
          repasse a terceiros, e você pode pedir a exclusão a qualquer momento — veja a{' '}
          <Link href="/privacidade" className="underline underline-offset-2 hover:text-ink">
            política de privacidade
          </Link>
          .
        </span>
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
        {state === 'loading' ? 'Enviando…' : 'Falar com um especialista'}
        {state !== 'loading' && <IconArrow size={16} />}
      </button>

      <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        Retorno em até 1 dia útil · Sem compromisso
      </p>
    </form>
  );
};
