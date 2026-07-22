import type { Metadata } from 'next';
import { SectorPage, moveleiras } from '@/components/SectorPage';

const title = 'ERP para Moveleiras';
const description =
  'ERP para moveleiras: precificação de móvel planejado com MDF, ferragens e fitas de borda, plano de corte que aproveita cada placa, produção por ambiente e romaneio conferido.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'ERP para moveleira',
    'software para marcenaria',
    'sistema para móveis planejados',
    'plano de corte de MDF',
    'nesting de MDF',
    'otimização de chapa de MDF',
    'precificação de móvel planejado',
    'controle de fita de borda e ferragens',
    'produção por ambiente',
    'romaneio de móveis',
  ],
  alternates: { canonical: '/moveleiras' },
  openGraph: {
    type: 'website',
    url: 'https://venturerp.com/moveleiras',
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

export default function MoveleirasPage() {
  return <SectorPage sector={moveleiras} />;
}
