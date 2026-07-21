import Link from 'next/link';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { Diagnostico } from '@/components/Diagnostico';
import { IconClock, IconCheck, IconGear } from '@/components/Icons';

export const metadata = {
  title: 'Diagnóstico gratuito · VentureERP para Metalúrgicas e Moveleiras',
  description:
    'Responda 6 perguntas sobre a sua fábrica e descubra onde a operação provavelmente perde margem hoje: orçamento, aproveitamento de material, controle de produção, custo por ordem, fiscal e estoque.',
};

const points = [
  { Icon: IconClock, t: '2 minutos', d: 'Seis perguntas de múltipla escolha sobre como a sua fábrica trabalha hoje.' },
  { Icon: IconGear, t: 'Sobre a sua operação', d: 'Orçamento, corte, produção, custo por OP, fiscal e estoque — o fluxo inteiro.' },
  { Icon: IconCheck, t: 'Resultado na hora', d: 'O diagnóstico aparece na tela ao enviar. Sem esperar contato de vendedor.' },
];

export default function DiagnosticoPage() {
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
                Onde sua fábrica
                <br />
                <span className="italic text-mustard-300">perde margem?</span>
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-bg/75">
                Seis perguntas sobre como a sua operação funciona hoje. No fim, você recebe uma
                leitura dos pontos onde metalúrgicas e moveleiras costumam perder dinheiro sem
                perceber.
              </p>

              <div className="mt-9 space-y-5">
                {points.map(({ Icon, t, d }) => (
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

              <p className="mt-9 max-w-md rounded-2xl border border-bg/15 bg-moss-800/50 p-5 text-[14px] leading-relaxed text-bg/70">
                É uma leitura qualitativa a partir do que você responder — não é auditoria nem
                promessa de economia. Para dimensionar ganho de verdade precisamos olhar os números
                da sua operação junto com você.
              </p>
            </div>

            <div className="lg:sticky lg:top-24">
              <Diagnostico />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
