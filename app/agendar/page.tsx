import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { Scheduler } from '@/components/Scheduler';
import { IconCheck, IconClock, IconUsers, IconGear, IconArrow } from '@/components/Icons';

export const metadata = {
  title: 'Agendar demonstração · VentureERP para Metalúrgicas e Moveleiras',
  description:
    'Agende uma demonstração de 30 minutos do VentureERP com um especialista do seu setor. Veja orçamento de peça, plano de corte e ordem de produção rodando de verdade.',
};

const promises = [
  { Icon: IconClock, t: '30 minutos, direto ao ponto', d: 'Sem PowerPoint. Você diz suas 3 maiores dores e a gente mostra o sistema resolvendo cada uma — ao vivo.' },
  { Icon: IconUsers, t: 'Especialista do seu setor', d: 'Quem te atende entende de chão de fábrica metalúrgico ou moveleiro — não é vendedor lendo roteiro.' },
  { Icon: IconGear, t: 'Com cenários reais', d: 'Orçamento de peça sob medida, aproveitamento de chapa/MDF, apontamento de OP e custo real. Tudo funcionando.' },
];

export default function AgendarPage() {
  return (
    <>
      <Nav />
      <main className="pt-20">
        <section className="grain relative overflow-hidden bg-moss-900 pb-24 pt-16 text-bg">
          <div
            className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(220,192,59,.2), transparent)' }}
          />
          <div className="mx-auto grid max-w-7xl items-start gap-12 px-6 lg:grid-cols-[1fr_1.05fr] lg:px-10">
            <div className="lg:pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/80 transition hover:bg-bg/15"
              >
                ← Voltar ao site
              </Link>
              <h1 className="mt-8 font-serif text-[52px] leading-[0.98] tracking-tightest md:text-[68px]">
                Agende sua
                <br />
                <span className="italic text-mustard-300">demonstração.</span>
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
                Escolha o melhor horário e veja, em 30 minutos, o VentureERP rodando com a realidade de uma metalúrgica ou moveleira como a sua.
              </p>

              <div className="mt-9 space-y-5">
                {promises.map(({ Icon, t, d }) => (
                  <div key={t} className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-moss-800 text-mustard-300">
                      <Icon size={20} />
                    </span>
                    <div>
                      <p className="font-serif text-lg text-bg">{t}</p>
                      <p className="mt-0.5 text-[14px] leading-relaxed text-bg/65">{d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4 font-mono text-[12px] text-bg/60">
                {['Sem custo', 'Sem cartão de crédito', 'Sem script de vendas'].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <IconCheck size={14} className="text-mustard-300" />
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-9 rounded-2xl border border-bg/15 bg-moss-800/50 p-5">
                <p className="font-serif text-[19px] leading-snug text-bg">
                  “Na demo mostraram o sistema reorganizando nossas ordens de produção e cortando o desperdício de matéria-prima na hora. Ali eu entendi que não era papo de vendedor.”
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/55">
                  Rulian · Diretor, Tecnofer — metalúrgica, 50 colaboradores
                </p>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <Scheduler source="Página Agendar" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-paper px-6 py-5">
            <p className="text-[15px] text-ink">
              Ainda não quer falar com a gente? Veja primeiro a <strong>demonstração no seu ritmo</strong>.
            </p>
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm text-ink transition hover:border-ink/50"
            >
              Ver demonstração por módulo <IconArrow size={15} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
