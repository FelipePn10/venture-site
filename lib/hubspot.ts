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

// ---------------------------------------------------------------------------
// Leitura para o painel /admin
//
// Funções de consulta ao CRM. Nunca lançam: numa falha de rede ou token
// ausente retornam lista vazia, para o painel degradar em vez de quebrar.
// ---------------------------------------------------------------------------

async function get(path: string) {
  const t = token();
  if (!t) return null;
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${t}` },
      // O painel é force-dynamic; sempre queremos o estado atual do CRM.
      cache: 'no-store',
    });
    if (!res.ok) {
      console.error('[hubspot] GET falhou:', path, res.status);
      return null;
    }
    return res.json();
  } catch (e) {
    console.error('[hubspot] Erro de rede em GET:', path, e);
    return null;
  }
}

export type CrmContact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  jobtitle: string;
  createdAt: string;
};

export type CrmMeeting = {
  id: string;
  title: string;
  start: string;
  end: string;
  location: string;
  outcome: string;
  /** Contatos associados (nome + e-mail resolvidos). */
  contacts: { name: string; email: string }[];
};

/**
 * Contatos mais recentes do CRM (inclui quem agendou reunião e quem preencheu
 * o site). Usa o endpoint de SEARCH porque o de listagem ignora `sorts` e
 * devolveria os contatos fora de ordem.
 */
export async function getHubSpotContacts(limit = 50): Promise<CrmContact[]> {
  const props = ['email', 'firstname', 'lastname', 'phone', 'company', 'jobtitle', 'createdate'];
  const res = await call('/crm/v3/objects/contacts/search', 'POST', {
    sorts: [{ propertyName: 'createdate', direction: 'DESCENDING' }],
    properties: props,
    limit,
  });
  const data = res && res.ok ? await res.json() : null;
  if (!data?.results) return [];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.results.map((r: any) => {
    const p = r.properties || {};
    const name = [p.firstname, p.lastname].filter(Boolean).join(' ').trim();
    return {
      id: r.id,
      name: name || p.email || 'Sem nome',
      email: p.email || '',
      phone: p.phone || '',
      company: p.company || '',
      jobtitle: p.jobtitle || '',
      createdAt: p.createdate || r.createdAt || '',
    };
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/**
 * Reuniões do CRM (as demos agendadas pelo link do HubSpot), da mais recente
 * para a mais antiga, com os contatos associados já resolvidos em nome/e-mail.
 */
export async function getHubSpotMeetings(limit = 50): Promise<CrmMeeting[]> {
  const props = [
    'hs_meeting_title',
    'hs_meeting_start_time',
    'hs_meeting_end_time',
    'hs_meeting_location',
    'hs_meeting_outcome',
  ];
  // O endpoint de listagem ignora `sorts`, então ordenamos no código (abaixo).
  // Ele é usado em vez do search porque só a listagem retorna as associações.
  const data = await get(
    `/crm/v3/objects/meetings?limit=${limit}&properties=${props.join(',')}&associations=contacts`,
  );
  if (!data?.results) return [];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  // Mais recentes primeiro (por horário de início).
  data.results.sort((a: any, b: any) =>
    (b.properties?.hs_meeting_start_time || '').localeCompare(a.properties?.hs_meeting_start_time || ''),
  );

  // Junta todos os IDs de contato associados para resolver nome/e-mail num lote só.
  const contactIds = new Set<string>();
  for (const m of data.results) {
    for (const c of m.associations?.contacts?.results || []) contactIds.add(c.id);
  }

  const nameById = new Map<string, { name: string; email: string }>();
  if (contactIds.size > 0) {
    const batch = await call('/crm/v3/objects/contacts/batch/read', 'POST', {
      properties: ['firstname', 'lastname', 'email'],
      inputs: [...contactIds].map((id) => ({ id })),
    });
    const body = batch && batch.ok ? await batch.json() : null;
    for (const r of body?.results || []) {
      const p = r.properties || {};
      const name = [p.firstname, p.lastname].filter(Boolean).join(' ').trim();
      nameById.set(r.id, { name: name || p.email || 'Sem nome', email: p.email || '' });
    }
  }

  return data.results.map((m: any) => {
    const p = m.properties || {};
    const contacts = (m.associations?.contacts?.results || [])
      .map((c: any) => nameById.get(c.id))
      .filter(Boolean) as { name: string; email: string }[];
    return {
      id: m.id,
      title: p.hs_meeting_title || 'Reunião',
      start: p.hs_meeting_start_time || '',
      end: p.hs_meeting_end_time || '',
      location: p.hs_meeting_location || '',
      outcome: p.hs_meeting_outcome || '',
      contacts,
    };
  });
  /* eslint-enable @typescript-eslint/no-explicit-any */
}
