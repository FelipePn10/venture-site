import { SITE_URL } from "@/lib/site";

/**
 * Dado estruturado de trilha de navegação (BreadcrumbList / Schema.org).
 * Faz o Google exibir a trilha "Início › Setor › Página" no resultado da
 * busca em vez da URL crua — melhora a aparência e a taxa de clique.
 *
 * Server component: vai no HTML inicial, sem depender de JS nem de consentimento.
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
