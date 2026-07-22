/**
 * Disparo de eventos de CONVERSÃO para o Google Analytics 4 e o Meta Pixel.
 *
 * Seguro por design: window.gtag e window.fbq só existem depois do aceite no
 * banner de cookies (LGPD). Antes disso cada chamada é um no-op silencioso —
 * então dá para chamar sem verificar consentimento, e o rastreamento nunca
 * quebra o envio do formulário.
 *
 * Usa os nomes de eventos RECOMENDADOS de cada plataforma, para que você possa
 * marcá-los como "evento-chave" (GA4) e como conversão otimizável (Meta Ads).
 */

type ConversionType = 'lead' | 'diagnostico' | 'contato' | 'agendamento';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// Evento recomendado do GA4 para cada conversão.
const GA_EVENT: Record<ConversionType, string> = {
  lead: 'generate_lead',
  diagnostico: 'generate_lead',
  contato: 'contact',
  agendamento: 'schedule',
};

// Evento padrão do Meta Pixel para cada conversão.
const PIXEL_EVENT: Record<ConversionType, string> = {
  lead: 'Lead',
  diagnostico: 'Lead',
  contato: 'Contact',
  agendamento: 'Schedule',
};

export function trackConversion(
  type: ConversionType,
  params: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', GA_EVENT[type], { lead_type: type, ...params });
    window.fbq?.('track', PIXEL_EVENT[type], params);
  } catch {
    /* rastreamento nunca deve interromper o fluxo do usuário */
  }
}
