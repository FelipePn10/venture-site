import { NextRequest, NextResponse } from 'next/server';
import { addContact, getContacts } from '@/lib/storage';
import nodemailer from 'nodemailer';

async function sendContactNotification(contact: ReturnType<typeof addContact>) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return;

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"VentureERP Contato" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    replyTo: contact.email,
    subject: `📩 Nova mensagem: ${contact.subject} — ${contact.name}`,
    html: `
      <h2 style="color:#14201A">Nova mensagem via site</h2>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">De</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${contact.name}</strong> &lt;${contact.email}&gt;</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Assunto</td><td style="padding:8px;border-bottom:1px solid #eee">${contact.subject}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Data</td><td style="padding:8px;border-bottom:1px solid #eee">${new Date(contact.createdAt).toLocaleString('pt-BR')}</td></tr>
        <tr><td style="padding:8px;color:#666;vertical-align:top">Mensagem</td><td style="padding:8px;white-space:pre-wrap">${contact.message}</td></tr>
      </table>
    `,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;
    if (!name || !email || !message) return NextResponse.json({ error: 'Campos obrigatórios incompletos' }, { status: 400 });

    const contact = addContact({ name, email, subject: subject || 'Contato geral', message });

    sendContactNotification(contact).catch(() => {});

    return NextResponse.json({ success: true, id: contact.id });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get('key');
  const adminKey = process.env.ADMIN_KEY || 'venture2025';
  if (key !== adminKey) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

  return NextResponse.json(getContacts());
}
