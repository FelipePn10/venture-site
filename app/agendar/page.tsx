import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { HubSpotMeetings } from '@/components/HubSpot';
import { LeadForm } from '@/components/LeadForm';
import { IconCheck, IconClock, IconUsers, IconGear, IconArrow, IconQuote } from '@/components/Icons';

export const metadata = {
  title: 'Agendar demonstração · VentureERP para Metalúrgicas e Moveleiras',
  description:
    'Agende uma demonstração de 30 minutos do VentureERP com um especialista do seu setor. Veja orçamento de peça, plano de corte e ordem de produção rodando de verdade.',
};

const promises = [
  {
    Icon: IconClock,
    t: '30 minutos, direto ao ponto',
    d: 'Sem apresentação de slides. Você diz suas três maiores dores e a gente mostra o sistema resolvendo cada uma, ao vivo.',
  },
  {
    Icon: IconUsers,
    t: 'Especialista do seu setor',
    d: 'Quem te atende entende de chão de fábrica metalúrgico ou moveleiro — não é vendedor lendo roteiro.',
  },
  {
    Icon: IconGear,
    t: 'Com cenários reais',
    d: 'Orçamento de peça sob medida, aproveitamento de chapa ou MDF, acompanhamento da produção e custo real. Tudo funcionando.',
  },
];

export default function AgendarPage() {
  return (
    <>
      <Nav />
      <main className="pt-20">
        {/* Faixa escura: contexto e expectativa */}
        <section className="grain relative overflow-hidden bg-moss-900 pb-20 pt-16 text-bg">
          <div
            className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full"
            style={{ background: 'radial-gradient(closest-side, rgba(220,192,59,.2), transparent)' }}
          />
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-bg/15 bg-bg/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-bg/80 transition hover:bg-bg/15"
            >
              ← Voltar ao site
            </Link>

            <div className="mt-8 grid items-start gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <h1 className="font-serif text-[52px] leading-[0.98] tracking-tightest md:text-[64px]">
                  Veja o sistema
                  <br />
                  <span className="italic text-mustard-300">na sua fábrica.</span>
                </h1>
                <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
                  Escolha o melhor horário abaixo. Em 30 minutos você vê o VentureERP rodando com a
                  realidade de uma metalúrgica ou moveleira como a sua.
                </p>

                <div className="mt-8 flex flex-wrap gap-4 font-mono text-[12px] text-bg/60">
                  {['Sem custo', 'Sem cartão de crédito', 'Sem script de vendas'].map((t) => (
                    <span key={t} className="flex items-center gap-1.5">
                      <IconCheck size={14} className="text-mustard-300" />
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
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
            </div>
          </div>
        </section>

        {/* Faixa clara: o calendário respira em fundo próprio, sem brigar com o embed */}
        <section className="border-b border-line bg-paper py-16">
          <div className="mx-auto max-w-4xl px-6 lg:px-10">
            <div className="text-center">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
                ·· escolha o horário
              </span>
              <h2 className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">
                Quando fica bom para você?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-muted">
                A confirmação e o lembrete chegam automaticamente no seu e-mail, com o link da
                chamada.
              </p>
            </div>

            <div className="mt-10 overflow-hidden rounded-[26px] border border-line bg-bg p-2 shadow-sm md:p-4">
              <HubSpotMeetings />
            </div>
          </div>
        </section>

        {/* Caminho alternativo, para quem não quer escolher horário agora */}
        <section className="py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:px-10">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-moss-700">
                ·· prefere que a gente ligue?
              </span>
              <h2 className="mt-3 font-serif text-4xl leading-[1.05] tracking-tight text-ink md:text-5xl">
                Sem horário livre que sirva?
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-muted">
                Preencha ao lado com o contexto da sua fábrica e a gente encontra um horário junto
                com você. Quanto mais você contar aqui, mais a primeira conversa rende — chegamos já
                sabendo o que mostrar.
              </p>

              <figure className="mt-9 rounded-2xl border border-line bg-paper p-6">
                <IconQuote size={24} className="text-mustard-400" />
                <blockquote className="mt-4 font-serif text-[19px] leading-snug text-ink">
                  “Na demo mostraram o sistema reorganizando nossas ordens de produção e cortando o
                  desperdício de matéria-prima na hora. Ali eu entendi que não era papo de vendedor.”
                </blockquote>
                <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                  Rulian · Diretor, Tecnofer — metalúrgica, 50 colaboradores
                </figcaption>
              </figure>

              <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl border border-line bg-paper px-5 py-4">
                <p className="text-[14px] text-ink">
                  Ainda não quer falar com ninguém?
                </p>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 text-[14px] text-moss-700 underline-offset-2 hover:underline"
                >
                  Ver a demonstração gravada <IconArrow size={14} />
                </Link>
              </div>
            </div>

            <LeadForm
              source="Página Agendar"
              title="Conte sobre a sua fábrica"
              subtitle="Retornamos em até um dia útil com um especialista do seu setor e algumas opções de horário."
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
