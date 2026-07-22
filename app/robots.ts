import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Gera /robots.txt. Libera o site para indexação, bloqueia áreas privadas
 * (painel, APIs, demo restrito) e aponta o sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/demo"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
