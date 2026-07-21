/**
 * Integração server-side com o HubSpot CRM.
 *
 * O script de rastreamento (components/HubSpot.tsx) só registra navegação e
 * depende do aceite de cookies. Para o contato existir no CRM mesmo quando o
 * visitante recusa cookies, o envio de formulário é espelhado aqui pela API.
 *
 * Requer HUBSPOT_PRIVATE_APP_TOKEN (Private App com escopo crm.objects.contacts.write).
 * Sem o token, as funções viram no-op — o formulário continua funcionando e
 * gravando no Supabase.
 */

const API = 'https://api.hubapi.com';

export type HubSpotContact = {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  /** Propriedades customizadas já criadas no portal. */
  [key: string]: string | undefined;
};

function token() {
  return process.env.HUBSPOT_PRIVATE_APP_TOKEN;
}

async function call(path: string, method: string, body: unknown) {
  const t = token();
  if (!t) return null;

  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${t}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return res;
}

/**
 * Cria o contato ou atualiza o existente (identificado pelo e-mail).
 *
 * Retorna `true` apenas quando o contato realmente chegou ao CRM. Sem token
 * configurado retorna `false` — quem chama precisa distinguir "não enviei"
 * de "enviei com sucesso", senão um lead some sem ninguém perceber.
 */
export async function upsertContact(props: HubSpotContact): Promise<boolean> {
  if (!token()) {
    console.warn('[hubspot] HUBSPOT_PRIVATE_APP_TOKEN ausente — contato não sincronizado.');
    return false;
  }

  // Remove chaves vazias — o HubSpot rejeita string vazia em alguns tipos.
  const properties = Object.fromEntries(
    Object.entries(props).filter(([, v]) => v !== undefined && v !== ''),
  );

  try {
    const created = await call('/crm/v3/objects/contacts', 'POST', { properties });
    if (!created) return false;
    if (created.ok) return true;

    // 409 = contato já existe com esse e-mail. Atualiza em vez de duplicar.
    if (created.status === 409) {
      const updated = await call(
        `/crm/v3/objects/contacts/${encodeURIComponent(props.email)}?idProperty=email`,
        'PATCH',
        { properties },
      );
      if (updated && updated.ok) return true;
      if (updated) {
        console.error('[hubspot] Falha ao atualizar contato:', updated.status, await updated.text());
      }
      return false;
    }

    console.error('[hubspot] Falha ao criar contato:', created.status, await created.text());
    return false;
  } catch (e) {
    console.error('[hubspot] Erro de rede ao sincronizar contato:', e);
    return false;
  }
}
