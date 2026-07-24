/**
 * Proteção anti-bot para formulários públicos (lead, diagnóstico, contato…).
 *
 * Três camadas independentes, todas server-side — o navegador nunca é a
 * fonte de verdade, já que um bot pode fazer POST direto no endpoint sem
 * passar pelo React:
 *
 *   1. Honeypot   — campo invisível que só um bot preenche.
 *   2. Time-trap  — humano não preenche o formulário em milissegundos.
 *   3. Rate-limit — trava flood do mesmo IP numa janela de tempo.
 *
 * As duas primeiras devolvem uma resposta de sucesso "falsa" para o cliente
 * (ver shouldSilentlyDrop): o bot acha que passou e não tenta se adaptar,
 * enquanto nada é gravado nem notificado.
 */

/** Nome do campo-armadilha. Precisa bater com o hidden input no formulário. */
export const HONEYPOT_FIELD = 'website';

/** Tempo mínimo (ms) entre carregar o formulário e enviar. */
const MIN_FILL_MS = 2500;

/** Payload mínimo que toda submissão de formulário carrega para a checagem. */
export type AntiSpamFields = {
  /** Honeypot: deve chegar vazio/ausente num envio humano. */
  [HONEYPOT_FIELD]?: string;
  /** Milissegundos que o usuário levou entre abrir e enviar o formulário. */
  elapsedMs?: number;
};

/**
 * true quando o envio é claramente de bot e deve ser descartado em silêncio
 * (responder sucesso, mas não gravar nada).
 */
export function shouldSilentlyDrop(p: AntiSpamFields): boolean {
  // Honeypot preenchido → bot.
  if (typeof p[HONEYPOT_FIELD] === 'string' && p[HONEYPOT_FIELD]!.trim() !== '') {
    return true;
  }
  // Tempo ausente (POST direto, sem passar pelo form) ou rápido demais → bot.
  if (typeof p.elapsedMs !== 'number' || !Number.isFinite(p.elapsedMs) || p.elapsedMs < MIN_FILL_MS) {
    return true;
  }
  return false;
}

// ── Rate-limit em memória ────────────────────────────────────────────────
// Simples e sem dependência: guarda os timestamps recentes por IP. Roda bem
// no Fluid Compute (instâncias reaproveitadas); não é 100% preciso entre
// instâncias distintas, mas é suficiente para conter flood num site B2B.

type Hits = number[];
const buckets = new Map<string, Hits>();

/** Janela e teto padrão: no máximo 5 envios por IP a cada 10 minutos. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

/** Extrai o IP do cliente atrás do proxy da Vercel. */
export function clientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]!.trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** true quando o IP estourou o limite e a requisição deve ser barrada (429). */
export function isRateLimited(
  ip: string,
  { windowMs = WINDOW_MS, max = MAX_HITS }: { windowMs?: number; max?: number } = {},
): boolean {
  const now = Date.now();
  const cutoff = now - windowMs;
  const recent = (buckets.get(ip) || []).filter((t) => t > cutoff);
  recent.push(now);
  buckets.set(ip, recent);

  // Limpeza oportunista para o Map não crescer sem limite.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => t <= cutoff)) buckets.delete(k);
    }
  }

  return recent.length > max;
}
