/**
 * Fonte única de verdade dos dados institucionais e de SEO do site.
 * Usado por metadata, sitemap, robots, JSON-LD e imagem social — mude aqui
 * e o site inteiro acompanha.
 */

export const SITE_URL = "https://venturerp.com";

export const SITE = {
  name: "VentureERP",
  legalName: "VentureERP",
  url: SITE_URL,
  /** título curto usado como base das páginas */
  shortTitle: "VentureERP — ERP para Metalúrgicas e Moveleiras",
  description:
    "Do orçamento ao chão de fábrica: ficha técnica, plano de corte de chapa e MDF, ordem de produção, custo real por peça e fiscal industrial (Bloco K) em um sistema só.",
  /** frase de venda curta para OpenGraph */
  tagline: "O ERP de produção sob medida para a indústria de metal e madeira.",
  email: "contato@venturerp.com",
  locale: "pt_BR",
  keywords: [
    "ERP para metalúrgica",
    "ERP para moveleira",
    "software de produção sob medida",
    "plano de corte de chapa",
    "nesting de MDF",
    "ficha técnica industrial",
    "ordem de produção",
    "custo real por peça",
    "Bloco K",
    "SPED fiscal industrial",
    "PCP chão de fábrica",
    "MRP indústria",
  ],
  /** perfis sociais — preencha as URLs reais quando existirem */
  sameAs: [] as string[],
} as const;

/**
 * Rotas públicas indexáveis (para o sitemap). Rotas de app/painel
 * (/admin, /demo restrito) e APIs ficam de fora.
 */
export const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/metalurgicas", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/moveleiras", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/diagnostico", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/agendar", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/cases", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/status", priority: 0.3, changeFrequency: "weekly" as const },
  { path: "/privacidade", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/termos", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/lgpd", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/seguranca", priority: 0.3, changeFrequency: "yearly" as const },
];

/** slugs dos módulos (espelha app/modulo/[slug]/page.tsx) */
export const MODULE_SLUGS = [
  "engenharia",
  "corte",
  "pcp",
  "orcamento",
  "estoque",
  "fiscal",
];
