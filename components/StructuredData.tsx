import { SITE, SITE_URL } from "@/lib/site";
import { FAQ_ITEMS } from "@/lib/faq";

/**
 * Dados estruturados (Schema.org / JSON-LD) para SEO. Ajuda o Google a exibir
 * rich snippets: cartão de organização, caixa de busca do site, software e
 * as perguntas frequentes expansíveis no resultado da busca.
 *
 * Renderizado uma vez no layout raiz (server component — vai no HTML inicial,
 * sem depender de JS do cliente nem de consentimento de cookies).
 */
export function StructuredData() {
  const graph = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE.name,
      legalName: SITE.legalName,
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
      email: SITE.email,
      description: SITE.description,
      ...(SITE.sameAs.length ? { sameAs: SITE.sameAs } : {}),
      areaServed: { "@type": "Country", name: "Brasil" },
      knowsAbout: [
        "ERP industrial",
        "Metalurgia",
        "Indústria moveleira",
        "Planejamento e controle da produção",
        "Fiscal industrial (Bloco K, SPED)",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE.name,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: SITE.name,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "ERP",
      operatingSystem: "Web, Android, iOS",
      description: SITE.description,
      url: SITE_URL,
      inLanguage: "pt-BR",
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        priceCurrency: "BRL",
        price: "0",
        description:
          "Proposta sob medida conforme o porte da fábrica, número de usuários e módulos. Preço definido após a primeira reunião.",
      },
      featureList: [
        "Ficha técnica (BOM) multinível",
        "Plano de corte / nesting de chapa e MDF",
        "Ordem de produção e PCP",
        "Custo real por peça e por ordem",
        "Fiscal industrial: Bloco K, SPED, NF-e",
        "Estoque e compras com MRP",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ];

  const json = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
