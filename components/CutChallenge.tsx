'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconCheck, IconShield, IconBolt } from './Icons';
import { maskPhoneBR, phoneDigits } from '@/lib/phone';
import { HONEYPOT_FIELD } from '@/lib/antispam';
import { trackConversion } from '@/lib/track';

/**
 * "Desafio do plano de corte" — o mecanismo de prova do funil.
 *
 * Inverte o ônus da prova: em vez de o site alegar ganho, o visitante manda o
 * plano que ele usa hoje, o time roda no motor do VentureERP e a comparação é
 * apresentada numa reunião. Quem envia um plano de corte tem operação de corte
 * real — é o lead mais qualificado que a página consegue produzir.
 *
 * Três decisões deliberadas de copy/UX:
 *
 * 1. Aceita QUALQUER formato, incluindo foto do papel, e oferece a saída de
 *    colar a lista de peças. Exigir formato específico derruba a conversão.
 * 2. Admite explicitamente que podemos perder ("se o seu plano já estiver
 *    melhor, a gente mostra isso também"). O público deste bloco é o cético;
 *    honestidade converte mais que garantia — e a epic do produto proíbe
 *    alegar superioridade sem benchmark reproduzível.
 * 3. O resultado só é apresentado na reunião. É o gate que transforma
 *    curiosidade em agenda.
 */

const MATERIAIS = [
  'Chapa de aço',
  'MDF e madeira',
  'Barra, tubo e perfil',
  'Tecido, TNT e couro',
  'Outro material',
];

/** Setor enviado ao CRM conforme o material escolhido. */
const SEGMENTO: Record<string, string> = {
  'Chapa de aço': 'Metalúrgica',
  'MDF e madeira': 'Moveleira',
  'Barra, tubo e perfil': 'Metalúrgica',
  'Tecido, TNT e couro': 'Outro setor',
  'Outro material': 'Outro setor',
};

const MAX_MB = 15;

const ACCEPT =
  '.pdf,.dxf,.dwg,.svg,.nc,.nc1,.cnc,.tap,.xls,.xlsx,.csv,.txt,.ods,.png,.jpg,.jpeg,.webp,.heic,.zip,.rar';

const passos = [
  {
    n: '01',
    t: 'Você manda como estiver',
    d: 'O PDF do software que você usa, o DXF, a planilha, ou uma foto do papel do encarregado. Não tem arquivo? Cola a lista de peças.',
  },
  {
    n: '02',
    t: 'A gente roda no motor',
    d: 'As suas peças, o seu estoque, as suas regras — kerf, veio, refile. O mesmo motor que roda dentro do ERP, sem maquiagem.',
  },
  {
    n: '03',
    t: 'Você vê a comparação',
    d: 'Numa reunião de 30 minutos, o seu mapa e o nosso lado a lado: material consumido, sobra aproveitável e o que acontece depois do corte.',
  },
];

export const CutChallenge = () => {
  const [step, setStep] = useState<'form' | 'done'>('form');
  const [semArquivo, setSemArquivo] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [sending, setSending] = useState(false);
  const [erro, setErro] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    material: 'Chapa de aço',
    currentYield: '',
    notes: '',
    consent: false,
  });

  const mountedAt = useRef(Date.now());
  const [honeypot, setHoneypot] = useState('');

  // Libera a URL do objeto? Não criamos nenhuma — só guardamos o File.
  useEffect(() => {
    if (semArquivo) setFile(null);
  }, [semArquivo]);

  const pick = (f: File | null) => {
    if (!f) return;
    if (f.size > MAX_MB * 1024 * 1024) {
      setErro(`O arquivo passa de ${MAX_MB} MB. Compacte em .zip ou mande só o plano.`);
      return;
    }
    setErro('');
    setFile(f);
    setSemArquivo(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErro('É preciso aceitar o uso dos seus dados para continuar.');
      return;
    }
    if (!file && !form.notes.trim()) {
      setErro('Anexe o plano de corte ou descreva as peças que você corta.');
      return;
    }
    if (form.phone && phoneDigits(form.phone) < 10) {
      setErro('O WhatsApp parece incompleto. Confira o DDD e o número.');
      return;
    }

    setSending(true);
    setErro('');

    const body = new FormData();
    body.append('name', form.name);
    body.append('company', form.company);
    body.append('email', form.email);
    body.append('phone', form.phone);
    body.append('material', form.material);
    body.append('segment', SEGMENTO[form.material] || 'Outro setor');
    body.append('currentYield', form.currentYield);
    body.append('notes', form.notes);
    body.append('consent', 'true');
    body.append(HONEYPOT_FIELD, honeypot);
    body.append('elapsedMs', String(Date.now() - mountedAt.current));
    if (file) body.append('file', file);

    try {
      const res = await fetch('/api/desafio', { method: 'POST', body });
      if (res.ok) {
        setStep('done');
        trackConversion('lead', {
          source: 'desafio-plano-de-corte',
          material: form.material,
          com_arquivo: Boolean(file),
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
    'mt-1.5 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted focus:border-moss-700 focus:outline-none';
  const lbl = 'font-mono text-[10px] uppercase tracking-[0.16em] text-muted';

  return (
    <div className="overflow-hidden rounded-2xl border border-mustard-300/40 bg-bg text-ink">
      <div className="grid lg:grid-cols-[1fr_1fr]">
        {/* ------------------------- argumento ------------------------- */}
        <div className="border-b border-line p-8 md:p-12 lg:border-b-0 lg:border-r">
          <span className="inline-flex items-center gap-2 rounded-full bg-moss-900 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-mustard-200">
            <IconBolt size={12} /> o desafio
          </span>

          <h3 className="mt-5 font-serif text-4xl leading-[1.08] tracking-tight text-ink md:text-[52px]">
            Não acredite em nós.{' '}
            <span className="italic text-moss-700">Mande o seu plano de corte.</span>
          </h3>

          <p className="mt-5 text-[16px] leading-relaxed text-muted">
            Você acabou de ver a nossa conta. Agora faça o teste com o material que sai da sua
            fábrica: mande um plano de corte que você usou de verdade e a gente roda no motor do
            VentureERP. Na reunião você vê os dois lado a lado.
          </p>

          <div className="mt-9 space-y-6">
            {passos.map((p) => (
              <div key={p.n} className="flex gap-5">
                <span className="font-mono text-[13px] leading-none text-mustard-500">{p.n}</span>
                <div className="border-b border-line pb-6 last:border-0 last:pb-0">
                  <p className="font-serif text-[22px] leading-tight text-ink">{p.t}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{p.d}</p>
                </div>
              </div>
            ))}
          </div>

          {/* A frase que derruba a guarda do cético — e que a política de
              claims do produto exige que seja verdadeira. */}
          <div className="mt-8 rounded-xl border border-moss-200 bg-moss-50 p-5">
            <p className="text-[15px] leading-relaxed text-moss-800">
              <strong className="font-medium">E se o seu plano já estiver melhor que o nosso?</strong>{' '}
              A gente te mostra isso também. Não vendemos percentual — mostramos o resultado, seja
              ele qual for.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-2.5 text-[13px] leading-relaxed text-muted">
            <IconShield size={16} className="mt-0.5 shrink-0 text-moss-700" />
            <span>
              O seu arquivo é usado só para essa simulação, fica em armazenamento privado, não é
              compartilhado com ninguém e é apagado quando você pedir. Se preferir, tire os nomes de
              cliente antes de enviar — só precisamos das medidas.
            </span>
          </div>
        </div>

        {/* -------------------------- formulário ------------------------- */}
        <div className="p-8 md:p-12">
          {step === 'form' ? (
            <form onSubmit={submit}>
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

              {/* ---- dropzone ---- */}
              {!semArquivo && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pick(e.dataTransfer.files?.[0] || null);
                  }}
                  className={`rounded-xl border-2 border-dashed p-7 text-center transition ${
                    dragging
                      ? 'border-moss-700 bg-moss-50'
                      : file
                        ? 'border-moss-500 bg-moss-50'
                        : 'border-line bg-paper'
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT}
                    className="sr-only"
                    onChange={(e) => pick(e.target.files?.[0] || null)}
                  />

                  {file ? (
                    <div>
                      <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-moss-700 text-bg">
                        <IconCheck size={20} />
                      </span>
                      <p className="mt-3 break-all font-serif text-[19px] leading-tight text-ink">
                        {file.name}
                      </p>
                      <p className="mt-1 text-[12px] text-muted">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (inputRef.current) inputRef.current.value = '';
                        }}
                        className="mt-3 text-[12px] text-muted underline underline-offset-2 hover:text-ink"
                      >
                        trocar arquivo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="font-serif text-[22px] leading-tight text-ink">
                        Arraste o plano de corte aqui
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">
                        PDF, DXF, planilha, programa da máquina ou até uma foto do papel — tanto
                        faz. Até {MAX_MB} MB.
                      </p>
                      <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-moss-700 px-4 py-2.5 text-[13px] text-moss-700 transition hover:bg-moss-50"
                      >
                        Escolher arquivo
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={() => setSemArquivo((v) => !v)}
                className="mt-3 text-[13px] text-muted underline underline-offset-2 transition hover:text-ink"
              >
                {semArquivo
                  ? '← Tenho um arquivo para anexar'
                  : 'Não tenho arquivo — quero digitar a lista de peças'}
              </button>

              {/* ---- dados ---- */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
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

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={lbl}>Material do plano *</span>
                  <select
                    required
                    value={form.material}
                    onChange={(e) => setForm((f) => ({ ...f, material: e.target.value }))}
                    className={field}
                  >
                    {MATERIAIS.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className={lbl}>Aproveitamento de hoje</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.currentYield}
                    onChange={(e) => setForm((f) => ({ ...f, currentYield: e.target.value }))}
                    placeholder="Ex.: 82% — ou deixe em branco"
                    className={field}
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className={lbl}>
                  {semArquivo ? 'Lista de peças e estoque *' : 'Quer explicar alguma coisa? (opcional)'}
                </span>
                <textarea
                  rows={semArquivo ? 6 : 3}
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder={
                    semArquivo
                      ? 'Peças: perna 720 mm x 8, travessa 1200 mm x 4…\nEstoque: barra 6000 mm x 5, retalho 2300 mm x 1\nEspessura da serra, refile, veio…'
                      : 'Ex.: esse plano é de um pedido recorrente; a chapa é 2440x1220 e a serra tira 4 mm.'
                  }
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
                  Autorizo o VentureERP a usar meus dados e o arquivo enviado para montar essa
                  comparação e entrar em contato. Sem repasse a terceiros — veja a{' '}
                  <Link href="/privacidade" className="underline underline-offset-2 hover:text-ink">
                    política de privacidade
                  </Link>
                  .
                </span>
              </label>

              {erro && (
                <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                  {erro}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-moss-900 px-5 py-4 text-sm font-medium text-bg transition hover:bg-moss-800 disabled:opacity-60"
              >
                {sending ? 'Enviando o plano…' : 'Aceitar o desafio'}
                {!sending && <IconArrow size={16} />}
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                Resposta em até 2 dias úteis · Sem custo · Sem compromisso
              </p>
            </form>
          ) : (
            <div className="flex h-full flex-col justify-center text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss-900 text-mustard-300">
                <IconCheck size={30} />
              </span>
              <h4 className="mt-6 font-serif text-4xl leading-tight text-ink">Desafio aceito.</h4>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                Recebemos {file ? <strong className="text-ink">{file.name}</strong> : 'a sua lista de peças'}.
                Vamos rodar no motor em até 2 dias úteis.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">
                O resultado é apresentado ao vivo, com o seu mapa e o nosso lado a lado — assim você
                pergunta o que quiser enquanto a gente mexe nos parâmetros. Escolha o melhor
                horário:
              </p>
              <Link
                href="/agendar"
                className="mx-auto mt-7 inline-flex items-center gap-2 rounded-full bg-moss-900 px-6 py-3.5 text-sm font-medium text-bg transition hover:bg-moss-800"
              >
                Escolher o horário da apresentação <IconArrow size={15} />
              </Link>
              <p className="mt-4 text-[12px] leading-relaxed text-muted">
                Se preferir, respondemos por e-mail combinando o horário — mas quem escolhe agora
                costuma ver o resultado antes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
