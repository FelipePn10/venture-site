/**
 * Marca VentureERP — o "V" facetado, em vetor.
 *
 * Fonte única: o componente <LogoMark>, a imagem social (OpenGraph) e os PNGs
 * de ícone (app/icon.png, app/apple-icon.png, public/favicon.png, img/FAVICON.png)
 * saem todos destes mesmos paths, no viewBox 512×512. Assim o ícone da empresa
 * e o favicon do site nunca divergem.
 *
 * As cores são as do site: três facetas na escala moss e a faceta de luz em
 * mustard — o mesmo amarelo do "ERP" no logotipo.
 */
export const MARK_PATHS = {
  light:
    'M30 65L58 65L119 72L139 79L166 97L188 121L203 144L259 274L311 161L332 127L356 100L375 87L420 70L454 65L483 65L373 345L344 397L315 429L280 448L242 451L222 445L207 436L181 409L158 374L134 325Z',
  mid: 'M30 65L58 65L119 72L139 79L166 97L188 121L203 144L259 274L291 201L332 127L365 93L402 77L403 268L400 276L391 298L367 311L340 317L324 316L304 310L282 297L263 279L280 319L284 366L276 416L266 439L257 450L237 450L207 436L185 414L162 381L134 325Z',
  deep: 'M30 65L103 69L139 79L160 92L180 111L208 154L260 275L203 432L175 401L143 345Z',
  darkest: 'M30 65L58 65L119 72L139 79L166 97L188 121L203 144L259 276L123 297Z',
} as const;

/** Ramp para fundo claro (padrão) e para fundo escuro. */
export const MARK_COLORS = {
  dark: { darkest: '#17220C', deep: '#324512', mid: '#5D7822', light: '#DCC03B' },
  light: { darkest: '#5D7822', deep: '#7B9335', mid: '#BCC885', light: '#E8D670' },
} as const;
