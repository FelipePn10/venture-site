import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Web App Manifest — habilita "adicionar à tela inicial", define nome, tema e
 * cores da marca. Ajuda em PWA e em como o site aparece ao ser salvo.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.shortTitle,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8EC",
    theme_color: "#14201A",
    lang: "pt-BR",
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
    ],
  };
}
