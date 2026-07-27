import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Sections';
import { CuttingPlan } from '@/components/CuttingPlan';
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd';
import { RevealRoot } from '@/components/Extras';

const title = 'Plano de Corte e Aproveitamento de Material';
const description =
  'Plano de corte dentro do ERP: nesting de chapa de aço, MDF, barra, perfil, peça irregular e tecido. Retalho rastreado, baixa automática de estoque e custo no pedido certo. Calcule quanto a sua sobra custa por ano.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'plano de corte',
    'otimização de corte',
    'nesting de chapa',
    'plano de corte de MDF',
    'aproveitamento de chapa',
    'software de plano de corte',
    'corte de barra e perfil',
    'nesting de peça irregular',
    'encaixe de tecido e TNT',
    'controle de retalho',
    'redução de desperdício de matéria-prima',
  ],
  alternates: { canonical: '/plano-de-corte' },
  openGraph: {
    type: 'website',
    url: 'https://venturerp.com/plano-de-corte',
    title: `${title} · VentureERP`,
    description,
    siteName: 'VentureERP',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${title} · VentureERP`,
    description,
  },
};

export default function PlanoDeCortePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', path: '/' },
          { name: 'Plano de Corte', path: '/plano-de-corte' },
        ]}
      />
      <RevealRoot>
        <main className="relative">
          <Nav />
          {/* pt para o conteúdo não nascer embaixo do header fixo */}
          <div className="pt-16" />
          <CuttingPlan variant="full" />
          <Footer />
        </main>
      </RevealRoot>
    </>
  );
}
