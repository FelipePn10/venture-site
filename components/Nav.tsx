'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { IconArrow } from './Icons';
import { DEMO_VIDEOS_ENABLED } from '@/lib/flags';
import { NAV_MOTORES } from '@/lib/motores';

/**
 * O item "Plano de corte" saiu daqui e virou a primeira linha do menu
 * "Motores de cálculo" — ele é um dos oito cálculos que o sistema faz, não uma
 * categoria à parte. A seção de plano de corte na home, logo abaixo de
 * ·· módulos, continua onde estava.
 */
const links: [string, string][] = [
  ['Módulos', '/#modulos'],
  ['Diferenciais', '/#diferenciais'],
  ['Metalúrgicas', '/metalurgicas'],
  ['Moveleiras', '/moveleiras'],
  ['Diagnóstico', '/diagnostico'],
  // Volta ao menu quando a demonstração gravada for publicada.
  ...(DEMO_VIDEOS_ENABLED ? ([['Demo', '/demo']] as [string, string][]) : []),
];

/** Seta do disclosure — pequena o bastante para não competir com o rótulo. */
const Chevron = ({ open }: { open: boolean }) => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    aria-hidden="true"
    className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
  >
    <path d="M1.5 3.5 5 7l3.5-3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/**
 * Menu dos motores de cálculo.
 *
 * Abre no hover (é assim que o visitante espera) mas também no foco pelo
 * teclado e no clique — quem navega por Tab ou está no touch precisa dos três
 * caminhos. Escape fecha e devolve o foco ao gatilho.
 */
const MotoresMenu = () => {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onClickOut = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOut);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOut);
    };
  }, [open]);

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 transition hover:text-ink ${
          open ? 'text-ink' : ''
        }`}
      >
        Motores de cálculo
        <Chevron open={open} />
      </button>

      <div
        className={`absolute left-1/2 top-full z-50 w-[min(34rem,calc(100vw-3rem))] -translate-x-1/2 pt-4 transition ${
          open ? 'visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_30px_60px_-30px_rgba(20,32,26,.45)]">
          <p className="border-b border-line bg-paper px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
            as contas que o sistema faz por você
          </p>
          <ul className="grid sm:grid-cols-2">
            {NAV_MOTORES.map(({ label, hint, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="group flex h-full flex-col justify-start gap-1 border-b border-line/60 px-5 py-3.5 transition hover:bg-paper sm:odd:border-r"
                >
                  <span className="flex items-center gap-1.5 text-[14px] leading-snug text-ink">
                    {label}
                    <IconArrow
                      size={12}
                      className="text-moss-700 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="text-[12.5px] leading-snug text-muted">{hint}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [motoresOpen, setMotoresOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? 'border-b border-line/80 bg-bg/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Logo />
        {/* gap menor no lg: além dos links, a barra carrega um menu suspenso. */}
        <nav className="hidden items-center gap-4 text-sm text-ink/80 lg:flex xl:gap-5">
          {links.map(([l, h], i) => (
            <Fragment key={l}>
              {h.startsWith('/') ? (
                <Link href={h} className={`relative transition hover:text-ink ${l === 'Demo' ? 'font-medium text-moss-700' : ''}`}>
                  {l}
                </Link>
              ) : (
                <a href={h} className="relative transition hover:text-ink">
                  {l}
                </a>
              )}
              {/* Os motores entram logo depois de Diferenciais. */}
              {i === 1 && <MotoresMenu />}
            </Fragment>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {/*
            "Motores de cálculo" é bem mais largo que o "Plano de corte" que
            substituiu, e no lg a barra passou a encostar no botão. Contato só
            reaparece no xl — continua no rodapé e no âncora #contato.
          */}
          <Link href="/#contato" className="hidden text-sm text-ink/80 hover:text-ink xl:inline">Contato</Link>
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 rounded-full bg-moss-700 px-4 py-2 text-sm text-bg shadow-sm transition hover:bg-moss-800"
          >
            Agendar demo
            <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper lg:hidden"
            aria-label="Menu"
          >
            <span className="space-y-1.5">
              <span className="block h-px w-4 bg-ink" />
              <span className="block h-px w-4 bg-ink" />
            </span>
          </button>
        </div>
      </div>
      {open && (
        <div className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-line bg-bg lg:hidden">
          <div className="space-y-3 px-6 py-5">
            {links.map(([l, h]) => (
              h.startsWith('/') ? (
                <Link key={l} href={h} onClick={() => setOpen(false)} className={`block text-base text-ink ${l === 'Demo' ? 'font-medium text-moss-700' : ''}`}>
                  {l}
                </Link>
              ) : (
                <a key={l} href={h} onClick={() => setOpen(false)} className="block text-base text-ink">
                  {l}
                </a>
              )
            ))}

            {/* No mobile o menu vira acordeão: oito linhas abertas empurrariam o resto para fora da tela. */}
            <div>
              <button
                type="button"
                aria-expanded={motoresOpen}
                onClick={() => setMotoresOpen((v) => !v)}
                className="flex w-full items-center gap-2 text-base text-ink"
              >
                Motores de cálculo
                <Chevron open={motoresOpen} />
              </button>
              {motoresOpen && (
                <ul className="mt-3 space-y-3 border-l border-line pl-4">
                  {NAV_MOTORES.map(({ label, hint, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => {
                          setMotoresOpen(false);
                          setOpen(false);
                        }}
                        className="block"
                      >
                        <span className="block text-[15px] leading-snug text-ink">{label}</span>
                        <span className="block text-[12.5px] leading-snug text-muted">{hint}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <Link href="/#contato" onClick={() => setOpen(false)} className="block text-base text-ink">
              Contato
            </Link>
            <Link href="/agendar" onClick={() => setOpen(false)} className="block text-base font-medium text-moss-700">
              Agendar demonstração →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
