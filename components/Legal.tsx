import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { Footer } from './Sections';
import { legal } from '@/lib/legal';

const docs: [string, string][] = [
  ['Privacidade', '/privacidade'],
  ['Central LGPD', '/lgpd'],
  ['Termos de Uso', '/termos'],
  ['Segurança', '/seguranca'],
];

export function LegalShell({
  title,
  lead,
  current,
  children,
}: {
  title: string;
  lead: string;
  current: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo />
          <Link href="/" className="text-sm text-muted hover:text-ink">
            ← Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
          ·· documentos legais
        </span>
        <h1 className="mt-3 font-serif text-5xl leading-[1.02] tracking-tightest text-ink md:text-6xl">
          {title}
        </h1>
        <p className="mt-5 text-[17px] leading-relaxed text-muted">{lead}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Última atualização: {legal.atualizacao}
        </p>

        {/* Navegação entre documentos */}
        <nav className="mt-8 flex flex-wrap gap-2">
          {docs.map(([l, h]) => {
            const active = l === current;
            return (
              <Link
                key={h}
                href={h}
                className={`rounded-full border px-4 py-1.5 text-[13px] transition ${
                  active
                    ? 'border-moss-700 bg-moss-700 text-bg'
                    : 'border-line bg-paper text-ink hover:border-moss-700 hover:text-moss-700'
                }`}
              >
                {l}
              </Link>
            );
          })}
        </nav>

        <div className="mt-12 space-y-10">{children}</div>

        {/* Aviso */}
        <div className="mt-16 rounded-2xl border border-line bg-paper p-6 text-[13px] leading-relaxed text-muted">
          <p>
            Este documento foi elaborado em conformidade com a Lei nº 13.709/2018 (LGPD), o
            Marco Civil da Internet (Lei nº 12.965/2014) e o Código de Defesa do Consumidor
            (Lei nº 8.078/1990). Em caso de dúvidas, fale com nosso Encarregado:{' '}
            <a href={`mailto:${legal.emailPrivacidade}`} className="text-moss-700 hover:underline">
              {legal.emailPrivacidade}
            </a>
            .
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}

export function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="scroll-mt-24">
      <h2 className="font-serif text-2xl leading-snug text-ink md:text-3xl">
        <span className="mr-2 font-mono text-base text-moss-700">{n}.</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[15.5px] leading-relaxed text-ink/85">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5">{children}</ul>;
}

export function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[15.5px] leading-relaxed text-ink/85">
      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mustard-400" />
      <span>{children}</span>
    </li>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-ink">{children}</strong>;
}
