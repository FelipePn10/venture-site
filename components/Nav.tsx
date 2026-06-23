'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { IconArrow } from './Icons';

const links: [string, string][] = [
  ['Plataforma', '/#plataforma'],
  ['Módulos', '/#modulos'],
  ['Implantação', '/#workflow'],
  ['Setores', '/#setores'],
  ['Planos', '/#planos'],
  ['Demo', '/demo'],
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
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
        <nav className="hidden items-center gap-8 text-sm text-ink/80 md:flex">
          {links.map(([l, h]) => (
            h.startsWith('/') ? (
              <Link key={l} href={h} className={`relative transition hover:text-ink ${l === 'Demo' ? 'font-medium text-moss-700' : ''}`}>
                {l}
              </Link>
            ) : (
              <a key={l} href={h} className="relative transition hover:text-ink">
                {l}
              </a>
            )
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/#contato" className="hidden text-sm text-ink/80 hover:text-ink md:inline">Contato</Link>
          <Link
            href="/agendar"
            className="group inline-flex items-center gap-2 rounded-full bg-moss-700 px-4 py-2 text-sm text-bg shadow-sm transition hover:bg-moss-800"
          >
            Agendar demo
            <IconArrow size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-paper md:hidden"
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
        <div className="border-t border-line bg-bg md:hidden">
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
