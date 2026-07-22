import { ImageResponse } from "next/og";

/**
 * Ícone/favicon gerado na marca — o "V" chevron com o ponto dourado sobre o
 * verde-musgo escuro da identidade.
 */
export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#14201A",
          borderRadius: 96,
        }}
      >
        <svg width="300" height="300" viewBox="0 0 30 30">
          <path
            d="M4 5 L15 24 L26 5"
            fill="none"
            stroke="#FAF8EC"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="6" r="2.6" fill="#CBAB1F" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
