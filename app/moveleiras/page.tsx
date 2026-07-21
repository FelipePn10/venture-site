import { SectorPage, moveleiras } from '@/components/SectorPage';

export const metadata = {
  title: 'ERP para Moveleiras · VentureERP',
  description:
    'ERP para moveleiras: precificação de móvel planejado com MDF, ferragens e fitas de borda, plano de corte que aproveita cada placa, produção por ambiente e romaneio conferido.',
};

export default function MoveleirasPage() {
  return <SectorPage sector={moveleiras} />;
}
