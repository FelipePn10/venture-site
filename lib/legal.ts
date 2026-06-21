/**
 * Fonte única dos dados legais usados nas páginas /privacidade, /termos,
 * /lgpd e /seguranca. Preencha os campos marcados com [COLCHETES] com os
 * dados REAIS da empresa antes de publicar. Tudo o que estiver entre
 * colchetes é placeholder e deve ser substituído.
 *
 * ⚠️ Minutas para revisão jurídica. Não constituem aconselhamento legal.
 */
export const legal = {
  // --- Identificação do controlador (pessoa jurídica) ---
  razaoSocial: 'VENTURE ERP DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA LTDA',
  nomeFantasia: 'VentureERP',
  cnpj: '65.733.923/0001-06',
  endereco: 'Rua Yutaka Shima, 93, Maringá/PR, Brasil',

  // --- Encarregado pelo Tratamento de Dados (DPO) — LGPD art. 41 ---
  encarregado: 'Felipe Panosso',
  emailPrivacidade: 'contato@venturerp.com',

  // --- Contato geral / domínio ---
  emailContato: 'contato@venturerp.com',
  dominio: 'venturerp.com',
  site: 'https://venturerp.com',

  // --- Foro de eleição (Termos de Uso) ---
  foro: 'Comarca de Maringá/PR',

  // --- Datas ---
  atualizacao: '20 de junho de 2026',
  atualizacaoISO: '2026-06-20',

  // --- Operadores / subprocessadores (compartilhamento e transferência internacional) ---
  operadores: [
    {
      nome: 'Provedor de hospedagem em nuvem (ex.: Vercel/Netlify e respectivos provedores de infraestrutura)',
      finalidade: 'Hospedagem do site e armazenamento dos dados enviados pelos formulários',
      local: 'Pode estar localizado fora do Brasil (ex.: Estados Unidos / União Europeia)',
    },
    {
      nome: 'Google LLC (e-mail SMTP / Gmail e Google Analytics)',
      finalidade: 'Envio das notificações e confirmações por e-mail e métricas de audiência do site',
      local: 'Estados Unidos',
    },
    {
      nome: 'Meta Platforms, Inc. (Meta Pixel)',
      finalidade: 'Mensuração e otimização de campanhas de marketing',
      local: 'Estados Unidos',
    },
  ],
} as const;
