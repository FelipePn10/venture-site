import type { MetadataRoute } from "next";
import { SITE_URL, STATIC_ROUTES, MODULE_SLUGS } from "@/lib/site";
import { motores } from "@/lib/motores";

/**
 * Gera /sitemap.xml com todas as páginas públicas: rotas estáticas + uma
 * entrada por módulo (/modulo/[slug]) e por motor de cálculo (/motor/[slug]).
 * Mantém o Google ciente da estrutura completa do site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const moduleEntries: MetadataRoute.Sitemap = MODULE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/modulo/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const motorEntries: MetadataRoute.Sitemap = Object.keys(motores).map((slug) => ({
    url: `${SITE_URL}/motor/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...moduleEntries, ...motorEntries];
}
