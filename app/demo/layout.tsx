import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Demonstração por módulo · VentureERP',
  description:
    'Assista às demonstrações do VentureERP por módulo — orçamento, plano de corte, ordem de produção e fiscal — no seu ritmo, ou agende uma demonstração ao vivo.',
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
