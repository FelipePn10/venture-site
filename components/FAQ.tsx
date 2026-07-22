'use client';

import { useState } from 'react';
import { IconMinus, IconPlus } from './Icons';
import { FAQ_ITEMS as items } from '@/lib/faq';

export const FAQ = () => {
  const [open, setOpen] = useState<number>(0);
  return (
    <section className="mx-auto max-w-5xl px-6 py-28 lg:px-10">
      <div className="reveal text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">·· perguntas frequentes</span>
        <h2 className="mt-3 font-serif text-5xl leading-[1.05] tracking-tight text-ink md:text-6xl">
          Tudo o que você queria <span className="italic text-moss-700">perguntar</span>.
        </h2>
      </div>

      <div className="reveal mt-12 divide-y divide-line border-y border-line" data-delay="1">
        {items.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q}>
              <button
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
                aria-expanded={isOpen}
              >
                <span className={`font-serif text-2xl leading-snug transition ${isOpen ? 'text-moss-700' : 'text-ink'}`}>{q}</span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition ${isOpen ? 'border-moss-700 bg-moss-700 text-bg' : 'border-line text-ink'}`}>
                  {isOpen ? <IconMinus size={16} /> : <IconPlus size={16} />}
                </span>
              </button>
              <div className="grid overflow-hidden transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <div className="min-h-0">
                  <p className="pb-7 pr-12 text-[15.5px] leading-relaxed text-muted">{a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
