import type { Metadata } from 'next';
import { SectorPage, metalurgicas } from '@/components/SectorPage';
import { BreadcrumbJsonLd } from '@/components/BreadcrumbJsonLd';

const title = 'ERP para Metalúrgicas';
const description =
  'ERP para metalúrgicas: orçamento com custo real de corte, dobra e solda, plano de corte de chapa que reduz a sobra, ordem de produção apontada por posto e Bloco K automático.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'ERP para metalúrgica',
    'software para metalúrgica',
    'sistema para serralheria',
    'plano de corte de chapa de aço',
    'nesting de chapa',
    'custo de corte dobra e solda',
    'ordem de produção metalúrgica',
    'PCP metalúrgica',
    'Bloco K metalúrgica',
    'ficha técnica de peça metálica',
  ],
  alternates: { canonical: '/metalurgicas' },
  openGraph: {
    type: 'website',
    url: 'https://venturerp.com/metalurgicas',
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

export default function MetalurgicasPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Início', path: '/' },
          { name: 'ERP para Metalúrgicas', path: '/metalurgicas' },
        ]}
      />
      <SectorPage sector={metalurgicas} />
    </>
  );
}
