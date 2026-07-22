import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

/**
 * Imagem social (1200×630) gerada na marca VentureERP. É o que aparece ao
 * compartilhar o link no WhatsApp, LinkedIn, Slack, etc. Serve tanto para
 * OpenGraph quanto para Twitter (twitter-image.tsx reexporta este arquivo).
 */
export const alt = SITE.shortTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#FAF8EC";
const INK = "#14201A";
const GOLD = "#CBAB1F";
const MOSS = "#465D18";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 30 30">
            <path
              d="M4 5 L15 24 L26 5"
              fill="none"
              stroke={INK}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="15" cy="6" r="2.6" fill={GOLD} />
          </svg>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 600, color: INK }}>
            Venture<span style={{ color: GOLD }}>ERP</span>
          </div>
        </div>

        {/* Título */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 68,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: "-0.02em",
              maxWidth: 940,
            }}
          >
            <span>O ERP de produção sob medida para&nbsp;</span>
            <span style={{ color: MOSS }}>metalúrgicas e moveleiras.</span>
          </div>
          <div style={{ fontSize: 30, color: "#5F6A5C", maxWidth: 900 }}>
            Ficha técnica · plano de corte · ordem de produção · custo real por
            peça · Bloco K.
          </div>
        </div>

        {/* Rodapé */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `2px solid #DCD6B8`,
            paddingTop: 28,
          }}
        >
          <div style={{ fontSize: 26, color: INK }}>venturerp.com</div>
          <div
            style={{
              fontSize: 22,
              color: GOLD,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
            }}
          >
            Do orçamento ao chão de fábrica
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
