import { NextRequest, NextResponse } from 'next/server';
import { addLead } from '@/lib/storage';
import { upsertContact } from '@/lib/hubspot';
import nodemailer from 'nodemailer';

type Payload = {
  name: string;
  email: string;
  company: string;
  phone: string;
  segment: string;
  size: string;
  answers: Record<string, string>;
};

/** Retorna true só quando o e-mail foi realmente despachado. */
async function notify(p: Payload): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[diagnostico] SMTP não configurado — nenhum e-mail enviado.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = Object.entries(p.answers)
    .map(
      ([q, a]) =>
        `<tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee;vertical-align:top">${q}</td><td style="padding:8px;border-bottom:1px solid #eee">${a}</td></tr>`,
    )
    .join('');

  await transporter.sendMail({
    from: `"VentureERP Diagnóstico" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    replyTo: p.email,
    subject: `🔍 Diagnóstico: ${p.company} (${p.segment})`,
    html: `
      <h2 style="color:#324512">Novo diagnóstico preenchido</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Nome</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${p.name}</strong></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee">${p.company}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Setor</td><td style="padding:8px;border-bottom:1px solid #eee">${p.segment}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Porte</td><td style="padding:8px;border-bottom:1px solid #eee">${p.size}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${p.email}">${p.email}</a></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">WhatsApp</td><td style="padding:8px;border-bottom:1px solid #eee">${p.phone}</td></tr>
        ${rows}
      </table>
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

  const [first, ...rest] = p.name.trim().split(' ');

  // Três destinos independentes. Um lead não pode ser perdido porque UM deles
  // caiu — então gravamos onde der e só devolvemos erro se todos falharem.
  const results = await Promise.allSettled([
    addLead({
      name: p.name,
      email: p.email,
      company: p.company || '',
      phone: p.phone || '',
      size: p.size || '',
      source: `Diagnóstico · ${p.segment || 'não informado'}`,
    }),
    upsertContact({
      email: p.email,
      firstname: first,
      lastname: rest.join(' '),
      phone: p.phone,
      company: p.company,
    }),
    notify(p),
  ]);

  const [supabase, hubspot, email] = results;
  const labels = ['Supabase', 'HubSpot', 'E-mail'];
  results.forEach((r, i) => {
    if (r.status === 'rejected') {
      console.error(`[diagnostico] Falha em ${labels[i]}:`, r.reason);
    }
  });

  // Atenção: HubSpot e e-mail viram no-op quando falta credencial. Por isso não
  // basta "não lançou erro" — só conta como registrado quando o destino
  // confirmou que gravou de fato. Caso contrário o lead sumiria em silêncio
  // enquanto o usuário vê "enviado com sucesso".
  const storedInSupabase = supabase.status === 'fulfilled';
  const storedInHubSpot = hubspot.status === 'fulfilled' && hubspot.value === true;
  const emailSent = email.status === 'fulfilled' && email.value === true;

  if (!storedInSupabase && !storedInHubSpot && !emailSent) {
    console.error(
      '[diagnostico] LEAD PERDIDO: nenhum destino registrou o envio. ' +
        'Verifique SUPABASE_SECRET_KEY, HUBSPOT_PRIVATE_APP_TOKEN e as variáveis SMTP.',
    );
    return NextResponse.json(
      { error: 'Não foi possível enviar o diagnóstico. Tente novamente.' },
      { status: 500 },
    );
  }

  if (!storedInSupabase) {
    console.warn('[diagnostico] Supabase indisponível — lead registrado apenas nos outros destinos.');
  }

  return NextResponse.json({ success: true });
}
