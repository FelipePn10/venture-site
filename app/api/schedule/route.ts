import { NextRequest, NextResponse } from 'next/server';
import { addSchedule, getSchedules, isSlotTaken, type Schedule } from '@/lib/storage';
import nodemailer from 'nodemailer';

function transporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function fmtDate(iso: string) {
  // iso = YYYY-MM-DD
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

async function notify(s: Schedule) {
  const t = transporter();
  if (!t) return;
  const { SMTP_USER, NOTIFICATION_EMAIL } = process.env;
  const quando = `${fmtDate(s.date)} às ${s.time}`;

  // Aviso para o time comercial
  await t.sendMail({
    from: `"VentureERP Agenda" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    replyTo: s.email,
    subject: `📅 Demo agendada: ${s.company} (${s.segment}) — ${quando}`,
    html: `
      <h2 style="color:#324512">Nova demonstração agendada</h2>
      <p style="font-size:16px"><strong>${quando}</strong></p>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Nome</td><td style="padding:8px;border-bottom:1px solid #eee"><strong>${s.name}</strong></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Empresa</td><td style="padding:8px;border-bottom:1px solid #eee">${s.company}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Segmento</td><td style="padding:8px;border-bottom:1px solid #eee">${s.segment}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">E-mail</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${s.email}">${s.email}</a></td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">WhatsApp</td><td style="padding:8px;border-bottom:1px solid #eee">${s.phone}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Porte</td><td style="padding:8px;border-bottom:1px solid #eee">${s.size}</td></tr>
        <tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee">Sistema atual</td><td style="padding:8px;border-bottom:1px solid #eee">${s.current || '—'}</td></tr>
        <tr><td style="padding:8px;color:#666;vertical-align:top">Observações</td><td style="padding:8px;white-space:pre-wrap">${s.notes || '—'}</td></tr>
      </table>
      <p style="margin-top:20px"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="background:#324512;color:#fff;padding:10px 20px;border-radius:99px;text-decoration:none;font-size:13px">Ver no painel</a></p>
    `,
  }).catch(() => {});

  // Confirmação para o lead
  await t.sendMail({
    from: `"VentureERP" <${SMTP_USER}>`,
    to: s.email,
    subject: `✅ Sua demonstração do VentureERP está agendada — ${quando}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px">
        <h2 style="color:#324512">Demonstração confirmada, ${s.name.split(' ')[0]}!</h2>
        <p style="font-size:15px;color:#333">Reservamos um especialista no setor de <strong>${s.segment.toLowerCase()}</strong> para te mostrar o VentureERP rodando com cenários reais da sua operação.</p>
        <div style="border:1px solid #DCD6B8;border-radius:14px;padding:18px;margin:18px 0;background:#F4F1DF">
          <p style="margin:0;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px">Quando</p>
          <p style="margin:6px 0 0;font-size:18px;color:#14201A"><strong>${quando}</strong></p>
          <p style="margin:10px 0 0;font-size:13px;color:#666">Duração: 30 minutos · Online (enviaremos o link de acesso por e-mail e WhatsApp)</p>
        </div>
        <p style="font-size:14px;color:#333">Para a conversa render, pense nas suas 3 maiores dores hoje — orçamento de peça, sobra de chapa/MDF, controle de OP, prazo de entrega. A gente mostra como resolver cada uma.</p>
        <p style="font-size:13px;color:#888;margin-top:24px">Precisa remarcar? Responda este e-mail. Até lá!<br/>Equipe VentureERP</p>
      </div>
    `,
  }).catch(() => {});
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, phone, segment, size, current, date, time, notes } = body;

    if (!name || !email || !date || !time) {
      return NextResponse.json({ error: 'Nome, e-mail, data e horário são obrigatórios' }, { status: 400 });
    }
    if (isSlotTaken(date, time)) {
      return NextResponse.json({ error: 'Esse horário acabou de ser reservado. Escolha outro.' }, { status: 409 });
    }

    const schedule = addSchedule({
      name,
      email,
      company: company || '',
      phone: phone || '',
      segment: segment || 'Não informado',
      size: size || '',
      current: current || '',
      date,
      time,
      notes: notes || '',
    });

    notify(schedule).catch(() => {});

    return NextResponse.json({ success: true, id: schedule.id });
  } catch {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Lista horários já reservados (para desabilitar no front). Apenas date+time, sem dados pessoais.
  const date = req.nextUrl.searchParams.get('date');
  const key = req.nextUrl.searchParams.get('key');

  if (key) {
    const adminKey = process.env.ADMIN_KEY || 'venture2025';
    if (key !== adminKey) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    return NextResponse.json(getSchedules());
  }

  const taken = getSchedules()
    .filter((s) => !date || s.date === date)
    .map((s) => ({ date: s.date, time: s.time }));
  return NextResponse.json(taken);
}
