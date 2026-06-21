import { NextRequest, NextResponse } from 'next/server';
import { addLead, getLeads } from '@/lib/storage';
import nodemailer from 'nodemailer';

async function sendNotification(lead: ReturnType<typeof addLead> extends Promise<infer T> ? T : ReturnType<typeof addLead>) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"VentureERP Leads" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    subject: `🎯 Novo lead: ${lead.name} — ${lead.company}`,
    html: `
      <h2 style="color:#14201A">Novo lead no VentureERP</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Nome</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${lead.name}</strong></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${lead.email}">${lead.email}</a></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee">${lead.company}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Telefone</td><td style="padding:8px;border-bottom:1px solid #eee">${lead.phone}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Tamanho</td><td style="padding:8px;border-bottom:1px solid #eee">${lead.size}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Origem</td><td style="padding:8px;border-bottom:1px solid #eee">${lead.source || 'Site'}</td></tr>
        <tr><td style="padding:8px;color:#666">Data</td><td style="padding:8px">${new Date(lead.createdAt).toLocaleString('pt-BR')}</td></tr>
      </table>
      <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="background:#14201A;color:#fff;padding:10px 20px;border-radius:99px;text-decoration:none;font-size:13px">Ver todos os leads</a></p>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, size, source } = body;
    if (!name || !email) return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 });

    const lead = addLead({ name, email, company: company || '', phone: phone || '', size: size || '', source });

    sendNotification(lead).catch(() => {});

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const adminKey = process.env.ADMIN_KEY || 'venture2025';
  if (key !== adminKey) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  return NextResponse.json(getLeads());
}
