'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck, IconClock, IconCalendar, IconFlame, IconTree } from './Icons';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

type DayOption = { value: string; weekday: string; day: number; month: string };

function nextBusinessDays(count: number): DayOption[] {
  const out: DayOption[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 1); // a partir de amanhã
  while (out.length < count) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      out.push({
        value: `${y}-${m}-${day}`,
        weekday: WEEKDAYS[dow],
        day: d.getDate(),
        month: MONTHS[d.getMonth()],
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return out;
}

const segments = [
  { id: 'Metalúrgica', label: 'Metalúrgica', Icon: IconFlame },
  { id: 'Moveleira', label: 'Moveleira', Icon: IconTree },
  { id: 'Outro', label: 'Outro setor', Icon: IconCalendar },
];

type State = 'form' | 'loading' | 'ok' | 'error';

export const Scheduler = ({ source = 'Agendador' }: { source?: string }) => {
  const days = useMemo(() => nextBusinessDays(10), []);
  const [step, setStep] = useState<1 | 2>(1);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [taken, setTaken] = useState<string[]>([]);
  const [state, setState] = useState<State>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    segment: 'Metalúrgica',
    size: 'Até 50 funcionários',
    current: '',
    notes: '',
  });

  // Busca horários já reservados na data escolhida
  useEffect(() => {
    if (!date) return;
    let active = true;
    fetch(`/api/schedule?date=${date}`)
      .then((r) => r.json())
      .then((rows: { date: string; time: string }[]) => {
        if (active) setTaken(rows.map((r) => r.time));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [date]);

  const selectedDay = days.find((d) => d.value === date);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, date, time, source }),
      });
      if (res.ok) {
        setState('ok');
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || 'Não foi possível concluir. Tente novamente.');
        if (res.status === 409) {
          setStep(1);
          setTime('');
        }
        setState('error');
      }
    } catch {
      setErrorMsg('Falha de conexão. Tente novamente.');
      setState('error');
    }
  };

  if (state === 'ok') {
    return (
      <div className="rounded-[26px] border border-line bg-bg p-8 text-center md:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss-700 text-bg">
          <IconCheck size={30} />
        </span>
        <h3 className="mt-6 font-serif text-3xl text-ink">Demonstração agendada!</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          {selectedDay && (
            <>
              <strong className="text-ink">
                {selectedDay.weekday}, {selectedDay.day} de {selectedDay.month}
              </strong>{' '}
              às <strong className="text-ink">{time}</strong>.{' '}
            </>
          )}
          Enviamos a confirmação e o link de acesso para <strong className="text-ink">{form.email}</strong>.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-moss-700 px-5 py-3 text-sm text-bg transition hover:bg-moss-800"
          >
            Enquanto isso, veja a demonstração <IconArrow size={15} />
          </Link>
        </div>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Sem custo · Sem compromisso · 30 minutos
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[26px] border border-line bg-bg p-6 md:p-8">
      {/* Progresso */}
      <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.14em]">
        <span className={`flex items-center gap-1.5 ${step === 1 ? 'text-moss-700' : 'text-muted'}`}>
          <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${step === 1 ? 'bg-moss-700 text-bg' : 'bg-moss-50 text-moss-700'}`}>1</span>
          Agenda
        </span>
        <span className="h-px w-6 bg-line" />
        <span className={`flex items-center gap-1.5 ${step === 2 ? 'text-moss-700' : 'text-muted'}`}>
          <span className={`grid h-5 w-5 place-items-center rounded-full text-[10px] ${step === 2 ? 'bg-moss-700 text-bg' : 'bg-moss-50 text-moss-700'}`}>2</span>
          Seus dados
        </span>
      </div>

      {step === 1 && (
        <div className="mt-6">
          <p className="flex items-center gap-2 font-serif text-2xl text-ink">
            <IconCalendar size={22} className="text-moss-700" /> Escolha o melhor dia
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {days.map((d) => {
              const sel = d.value === date;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => {
                    setDate(d.value);
                    setTime('');
                  }}
                  className={`rounded-xl border px-2 py-3 text-center transition ${
                    sel ? 'border-moss-700 bg-moss-700 text-bg' : 'border-line bg-paper text-ink hover:border-moss-700'
                  }`}
                >
                  <span className={`block font-mono text-[10px] uppercase tracking-[0.12em] ${sel ? 'text-mustard-300' : 'text-muted'}`}>
                    {d.weekday}
                  </span>
                  <span className="mt-0.5 block font-serif text-2xl leading-none">{d.day}</span>
                  <span className={`block text-[10px] ${sel ? 'text-bg/70' : 'text-muted'}`}>{d.month}</span>
                </button>
              );
            })}
          </div>

          <div className={`mt-6 transition ${date ? 'opacity-100' : 'pointer-events-none opacity-40'}`}>
            <p className="flex items-center gap-2 font-serif text-2xl text-ink">
              <IconClock size={20} className="text-moss-700" /> Horário {selectedDay && <span className="font-sans text-sm text-muted">· {selectedDay.weekday} {selectedDay.day}/{selectedDay.month}</span>}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
              {TIME_SLOTS.map((t) => {
                const isTaken = taken.includes(t);
                const sel = t === time;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={isTaken}
                    onClick={() => setTime(t)}
                    className={`rounded-lg border py-2.5 text-sm transition ${
                      isTaken
                        ? 'cursor-not-allowed border-line bg-paper text-muted line-through opacity-50'
                        : sel
                          ? 'border-moss-700 bg-moss-700 text-bg'
                          : 'border-line bg-paper text-ink hover:border-moss-700'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              Fuso de Brasília (GMT-3) · Seg a sex
            </p>
          </div>

          <button
            type="button"
            disabled={!date || !time}
            onClick={() => setStep(2)}
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm text-bg transition hover:bg-moss-900 disabled:opacity-40"
          >
            Continuar <IconArrow size={16} />
          </button>
        </div>
      )}

      {step === 2 && (
        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-moss-200 bg-moss-50 px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] text-moss-800">
              <IconCalendar size={16} className="text-moss-700" />
              {selectedDay && (
                <strong>
                  {selectedDay.weekday}, {selectedDay.day} de {selectedDay.month} · {time}
                </strong>
              )}
            </span>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss-700 underline-offset-2 hover:underline"
            >
              Alterar
            </button>
          </div>

          <div className="mt-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Seu setor *</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {segments.map(({ id, label, Icon }) => {
                const sel = form.segment === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, segment: id }))}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-[12px] transition ${
                      sel ? 'border-moss-700 bg-moss-50 text-moss-800' : 'border-line bg-paper text-ink hover:border-moss-700'
                    }`}
                  >
                    <Icon size={20} className={sel ? 'text-moss-700' : 'text-muted'} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Nome *</span>
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Empresa *</span>
              <input
                type="text"
                required
                placeholder="Nome da empresa"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">E-mail *</span>
              <input
                type="email"
                required
                placeholder="voce@empresa.com.br"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">WhatsApp *</span>
              <input
                type="tel"
                required
                placeholder="(11) 99999-9999"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Porte</span>
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
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">Sistema atual</span>
              <input
                type="text"
                placeholder="Planilhas, ERP X…"
                value={form.current}
                onChange={(e) => setForm((f) => ({ ...f, current: e.target.value }))}
                className="mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">O que você mais quer ver na demo? (opcional)</span>
            <textarea
              rows={2}
              placeholder="Ex.: orçamento de peça sob medida, plano de corte de chapa, controle de OP…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              className="mt-1.5 w-full resize-none rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none"
            />
          </label>

          {state === 'error' && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={state === 'loading'}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss-700 px-5 py-3.5 text-sm text-bg transition hover:bg-moss-800 disabled:opacity-60"
          >
            {state === 'loading' ? 'Confirmando…' : 'Confirmar agendamento'}
            {state !== 'loading' && <IconArrow size={16} />}
          </button>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
            Sem custo · Sem compromisso · Confirmação imediata por e-mail
          </p>
        </form>
      )}
    </div>
  );
};
