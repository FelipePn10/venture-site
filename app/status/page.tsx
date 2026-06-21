import Link from 'next/link';
import { Logo } from '@/components/Logo';

const services: [string, string][] = [
  ['App Web · venturerp.com', '99,98%'],
  ['API Pública', '99,99%'],
  ['Emissão NF-e (todas SEFAZs)', '99,94%'],
  ['SPED & Bloco K', '99,97%'],
  ['PCP & Apontamento (coletor)', '99,99%'],
  ['Plano de Corte & Nesting', '99,99%'],
  ['Mobile · iOS + Android', '100%']
];

const incidents = [
  ['28 abr · resolvido em 12min', 'Latência elevada na emissão de NF-e (SP)', 'menor'],
  ['11 abr · janela programada', 'Manutenção em readonly — banco principal', 'programado'],
  ['02 mar · resolvido em 4min', 'Falha pontual no webhook de Open Finance (Itaú)', 'menor']
];

export const metadata = { title: 'Status · VentureERP' };

// Deterministic uptime bar so SSR/CSR render identically (no hydration mismatch).
const uptimeBars = (seed: number) =>
  Array.from({ length: 90 }).map((_, i) => {
    const v = Math.sin(seed * 13 + i * 7);
    return v > 0.97 ? 'warn' : '';
  });

export default function StatusPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-ink">← Voltar para o site</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center gap-3">
          <span className="grid h-3 w-3 place-items-center rounded-full bg-moss-500">
            <span className="h-3 w-3 animate-ping rounded-full bg-moss-500 opacity-60"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">tudo operacional</span>
        </div>
        <h1 className="mt-4 font-serif text-6xl leading-[1] tracking-tight">Status do sistema</h1>
        <p className="mt-4 max-w-2xl text-[17px] text-muted">
          Operação em tempo real dos serviços VentureERP. Histórico de 90 dias.
        </p>

        <div className="mt-12 grid gap-3 rounded-2xl border border-line bg-paper p-6">
          <div className="flex items-baseline justify-between border-b border-line pb-3">
            <span className="font-serif text-2xl">Componentes</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">90 dias · uptime acumulado</span>
          </div>
          {services.map(([n, up], idx) => (
            <div key={n} className="grid grid-cols-[1.4fr_3fr_auto] items-center gap-6 border-b border-line/60 py-3 last:border-0">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-moss-500"></span>
                <span className="text-[14px] text-ink">{n}</span>
              </div>
              <div className="grid grid-cols-[repeat(90,minmax(0,1fr))] gap-[2px]">
                {uptimeBars(idx + 1).map((cls, i) => (
                  <span key={i} className={`h-6 rounded-[2px] ${cls === 'warn' ? 'bg-mustard-400' : 'bg-moss-500'}`} />
                ))}
              </div>
              <span className="font-mono text-[11px] text-moss-700">{up}</span>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-line bg-paper p-6">
          <p className="font-serif text-2xl">Incidentes recentes</p>
          <ul className="mt-4 divide-y divide-line text-[14px]">
            {incidents.map(([d, t, sev], i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{d}</span>
                <span className="text-ink">{t}</span>
                <span className={`ml-auto rounded-full px-2 py-0.5 font-mono text-[10px] text-moss-800 ${sev === 'menor' ? 'bg-mustard-300/40' : 'bg-moss-50'}`}>
                  {sev}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="border-t border-line bg-paper py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-[12px] text-muted">
          <span>© 2026 VentureERP Tecnologia S.A.</span>
          <span className="flex gap-5">
            <Link href="/">Site</Link>
            <Link href="/privacidade" className="hover:text-moss-700">Privacidade</Link>
            <Link href="/termos" className="hover:text-moss-700">Termos</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
