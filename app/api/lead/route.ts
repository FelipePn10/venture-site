import { NextRequest, NextResponse } from 'next/server';
import { addLead } from '@/lib/storage';
import { upsertContact } from '@/lib/hubspot';
import nodemailer from 'nodemailer';

type Payload = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: string;
  segment?: string;
  size?: string;
  system?: string;
  timeline?: string;
  challenges?: string[];
  message?: string;
  consent?: boolean;
  source?: string;
  utm?: Record<string, string>;
};

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee;vertical-align:top">${k}</td><td style="padding:8px;border-bottom:1px solid #eee">${v || '—'}</td></tr>`;

/** Retorna true só quando o e-mail foi realmente despachado. */
async function notify(p: Payload): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[lead] SMTP não configurado — nenhum e-mail enviado.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const utm = Object.entries(p.utm || {})
    .map(([k, v]) => `${k}=${v}`)
    .join(' · ');

  await transporter.sendMail({
    from: `"VentureERP Leads" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    replyTo: p.email,
    subject: `🎯 Novo lead: ${p.company || p.name} — ${p.segment || 'setor não informado'}`,
    html: `
      <h2 style="color:#14201A">Novo lead no VentureERP</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        ${row('Nome', `<strong>${p.name}</strong>`)}
        ${row('Empresa', p.company || '')}
        ${row('Cargo', p.role || '')}
        ${row('Setor', p.segment || '')}
        ${row('Porte', p.size || '')}
        ${row('E-mail', `<a href="mailto:${p.email}">${p.email}</a>`)}
        ${row('WhatsApp', p.phone || '')}
        ${row('Sistema atual', p.system || '')}
        ${row('Prazo', p.timeline || '')}
        ${row('Dores', (p.challenges || []).join(', '))}
        ${row('Mensagem', (p.message || '').replace(/\n/g, '<br/>'))}
        ${row('Origem', p.source || 'Site')}
        ${row('Campanha', utm)}
      </table>
      <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="background:#14201A;color:#fff;padding:10px 20px;border-radius:99px;text-decoration:none;font-size:13px">Ver todos os leads</a></p>
    `,
  });

  return true;
}

export async function POST(req: NextRequest) {
  let p: Payload;
  try {
    p = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
  }

  if (!p.name || !p.email) {
    return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 });
  }

  // O checkbox no navegador não é garantia — sem aceite explícito aqui, não
  // gravamos nem sincronizamos nada (LGPD art. 8º, §2º).
  if (p.consent !== true) {
    return NextResponse.json(
      { error: 'É preciso aceitar o uso dos seus dados para continuar.' },
      { status: 400 },
    );
  }

  const [first, ...rest] = p.name.trim().split(' ');

  // Três destinos independentes. Um lead não pode ser perdido porque UM deles
  // caiu, então gravamos onde der e só devolvemos erro se nenhum registrar.
  const results = await Promise.allSettled([
    addLead({
      name: p.name,
      email: p.email,
      company: p.company || '',
      phone: p.phone || '',
      size: p.size || '',
      source: p.source || 'Site',
      role: p.role || '',
      segment: p.segment || '',
      system: p.system || '',
      timeline: p.timeline || '',
      challenges: p.challenges || [],
      message: p.message || '',
      utm: p.utm || {},
      consent: true,
    }),
    upsertContact({
      email: p.email,
      firstname: first,
      lastname: rest.join(' '),
      phone: p.phone,
      company: p.company,
      jobtitle: p.role,
      // Propriedades padrão do HubSpot; as customizadas precisam existir no portal.
      message: [
        p.message,
        p.challenges?.length ? `Dores: ${p.challenges.join(', ')}` : '',
        p.system ? `Sistema atual: ${p.system}` : '',
        p.timeline ? `Prazo: ${p.timeline}` : '',
        p.segment ? `Setor: ${p.segment}` : '',
        p.size ? `Porte: ${p.size}` : '',
        p.source ? `Origem: ${p.source}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    }),
    notify(p),
  ]);

  const [supabase, hubspot, email] = results;
  const labels = ['Supabase', 'HubSpot', 'E-mail'];
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[lead] Falha em ${labels[i]}:`, r.reason);
  });

  // HubSpot e e-mail viram no-op sem credencial, então "não lançou erro" não é
  // prova de que o lead foi registrado. Só conta quem confirmou a gravação.
  const storedInSupabase = supabase.status === 'fulfilled';
  const storedInHubSpot = hubspot.status === 'fulfilled' && hubspot.value === true;
  const emailSent = email.status === 'fulfilled' && email.value === true;

  if (!storedInSupabase && !storedInHubSpot && !emailSent) {
    console.error(
      '[lead] LEAD PERDIDO: nenhum destino registrou o envio. ' +
        'Verifique SUPABASE_SECRET_KEY, HUBSPOT_PRIVATE_APP_TOKEN e as variáveis SMTP.',
    );
    return NextResponse.json(
      { error: 'Não foi possível registrar seu contato. Tente novamente.' },
      { status: 500 },
    );
  }

  if (!storedInSupabase) {
    console.warn('[lead] Supabase indisponível — lead registrado apenas nos outros destinos.');
  }

  return NextResponse.json({ success: true });
}
