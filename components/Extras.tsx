'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { IconArrow, IconBolt, IconLeaf } from './Icons';

export const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
};

export const RevealRoot = ({ children }: { children: React.ReactNode }) => {
  useReveal();
  return <>{children}</>;
};

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
};

export const Counter = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1800 }: CounterProps) => {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setN(value * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);
  const formatted =
    decimals === 0 ? Math.round(n).toLocaleString('pt-BR') : n.toFixed(decimals).replace('.', ',');
  return (
    <span ref={ref}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export const FloatingCTA = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const fn = () =>
      setVis(
        window.scrollY > 700 &&
          window.scrollY < document.body.scrollHeight - window.innerHeight - 600
      );
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div
      className={`fixed bottom-6 right-6 z-30 flex items-center gap-2 transition-all duration-500 ${
        vis ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <a
        href="/demo"
        className="flex items-center gap-2 rounded-full border border-moss-700 bg-bg px-4 py-2.5 text-sm text-moss-700 shadow-[0_8px_24px_-8px_rgba(20,32,26,.3)] transition hover:bg-moss-50"
      >
        Ver demo
        <IconArrow size={13} />
      </a>
      <a
        href="/agendar"
        className="flex items-center gap-2.5 rounded-full border border-moss-800 bg-moss-900 px-4 py-2.5 text-sm text-bg shadow-[0_20px_40px_-15px_rgba(20,32,26,.5)] transition hover:bg-moss-800"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-mustard-300 text-moss-800">
          <IconBolt size={12} />
        </span>
        Agendar demo
        <IconArrow size={13} />
      </a>
    </div>
  );
};

export const CookieBanner = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem('venture-cookies')) setVis(true);
    }, 1200);
    return () => clearTimeout(t);
  }, []);
  const accept = () => {
    localStorage.setItem('venture-cookies', 'ok');
    window.dispatchEvent(new Event('venture-consent'));
    setVis(false);
  };
  const refuse = () => {
    localStorage.setItem('venture-cookies', 'no');
    window.dispatchEvent(new Event('venture-consent'));
    setVis(false);
  };
  if (!vis) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto flex max-w-2xl flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper p-4 shadow-[0_30px_60px_-30px_rgba(20,32,26,.4)] md:bottom-6 md:left-6 md:right-auto md:flex-nowrap">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-moss-50 text-moss-700">
        <IconLeaf size={16} />
      </span>
      <p className="flex-1 text-[13px] leading-snug text-ink">
        Usamos cookies para personalizar a experiência e medir o que funciona. Veja a{' '}
        <Link href="/privacidade" className="underline hover:text-moss-700">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="flex gap-2">
        <button
          onClick={refuse}
          className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-[12px] text-ink/80 transition hover:text-ink"
        >
          Rejeitar
        </button>
        <button
          onClick={accept}
          className="rounded-full bg-moss-800 px-3.5 py-1.5 text-[12px] text-bg transition hover:bg-moss-900"
        >
          Aceitar todos
        </button>
      </div>
    </div>
  );
};
