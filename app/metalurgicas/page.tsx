import { SectorPage, metalurgicas } from '@/components/SectorPage';

export const metadata = {
  title: 'ERP para Metalúrgicas · VentureERP',
  description:
    'ERP para metalúrgicas: orçamento com custo real de corte, dobra e solda, plano de corte de chapa que reduz a sobra, ordem de produção apontada por posto e Bloco K automático.',
};

export default function MetalurgicasPage() {
  return <SectorPage sector={metalurgicas} />;
}
