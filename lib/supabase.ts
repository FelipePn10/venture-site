import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com a SERVICE ROLE — uso EXCLUSIVO no servidor
 * (route handlers e server components). A service role bypassa o RLS,
 * então esta chave NUNCA pode ir para o cliente: por isso não usa o
 * prefixo NEXT_PUBLIC_.
 */
let cached: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  // Aceita os dois nomes: o novo "secret key" (sb_secret_...) ou a service_role legada.
  const serviceKey =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Supabase não configurado. Defina SUPABASE_URL (ou NEXT_PUBLIC_SUPABASE_URL) e SUPABASE_SECRET_KEY no ambiente.',
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
