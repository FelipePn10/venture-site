import { NextRequest, NextResponse } from 'next/server';
import { addLead } from '@/lib/storage';
import { getSupabaseAdmin } from '@/lib/supabase';
import { upsertContact } from '@/lib/hubspot';
import { HONEYPOT_FIELD, clientIp, isRateLimited, shouldSilentlyDrop } from '@/lib/antispam';
import nodemailer from 'nodemailer';

/**
 * "Desafio do plano de corte": o visitante manda o plano que ele usa hoje,
 * o time roda no motor do VentureERP e apresenta a comparação numa reunião.
 *
 * Diferente dos outros formulários, este recebe ARQUIVO — então tem duas
 * proteções a mais:
 *
 *  - allowlist por extensão + teto de tamanho, porque o mime-type que o
 *    navegador manda não é confiável (DXF costuma chegar como octet-stream);
 *  - bucket PRIVADO no Supabase Storage. O arquivo nunca fica público: o
 *    e-mail de notificação recebe uma URL assinada e temporária.
 *
 * O upload não pode derrubar a captura: se o Storage falhar, o lead ainda é
 * gravado e o time é avisado de que o arquivo se perdeu — é melhor um lead
 * sem anexo do que nenhum lead.
 */

export const maxDuration = 60;

/** Bucket privado; criado pelo supabase/schema.sql. */
const BUCKET = 'desafio-cortes';

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MB

/** Formatos que uma fábrica realmente manda — de DXF a foto do papel. */
const ALLOWED_EXT = new Set([
  'pdf', 'dxf', 'dwg', 'svg', 'nc', 'nc1', 'cnc', 'tap',
  'xls', 'xlsx', 'csv', 'txt', 'ods',
  'png', 'jpg', 'jpeg', 'webp', 'heic',
  'zip', 'rar',
]);

const extOf = (name: string) => (name.split('.').pop() || '').toLowerCase();

/** Remove acento/espaço/caminho do nome original antes de gravar no Storage. */
function safeName(name: string): string {
  const base = name.split(/[\\/]/).pop() || 'arquivo';
  return base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .slice(-80);
}

const row = (k: string, v: string) =>
  `<tr><td style="padding:8px;color:#666;border-bottom:1px solid #eee;vertical-align:top">${k}</td><td style="padding:8px;border-bottom:1px solid #eee">${v || '—'}</td></tr>`;

type Notify = {
  name: string;
  email: string;
  company: string;
  phone: string;
  segment: string;
  material: string;
  currentYield: string;
  notes: string;
  fileName: string;
  fileUrl: string;
  fileError: string;
};

/** Retorna true só quando o e-mail foi realmente despachado. */
async function notify(p: Notify): Promise<boolean> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn('[desafio] SMTP não configurado — nenhum e-mail enviado.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const anexo = p.fileUrl
    ? `<a href="${p.fileUrl}">${p.fileName}</a> <span style="color:#999">(link válido por 7 dias)</span>`
    : p.fileError
      ? `<span style="color:#b00">FALHA NO UPLOAD — pedir o arquivo por e-mail. (${p.fileError})</span>`
      : '<span style="color:#999">sem arquivo — o lead colou a lista de peças abaixo</span>';

  await transporter.sendMail({
    from: `"VentureERP · Desafio de Corte" <${SMTP_USER}>`,
    to: NOTIFICATION_EMAIL || SMTP_USER,
    replyTo: p.email,
    subject: `🔪 Desafio de plano de corte: ${p.company || p.name}`,
    html: `
      <h2 style="color:#14201A">Novo desafio de plano de corte</h2>
      <p style="font-size:14px;color:#444">Rodar no motor e apresentar a comparação na reunião. Prazo prometido no site: <strong>até 2 dias úteis</strong>.</p>
      <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px">
        ${row('Nome', `<strong>${p.name}</strong>`)}
        ${row('Empresa', p.company)}
        ${row('E-mail', `<a href="mailto:${p.email}">${p.email}</a>`)}
        ${row('WhatsApp', p.phone)}
        ${row('Setor', p.segment)}
        ${row('Material', p.material)}
        ${row('Aproveitamento atual declarado', p.currentYield)}
        ${row('Arquivo', anexo)}
        ${row('Lista de peças / observações', (p.notes || '').replace(/\n/g, '<br/>'))}
      </table>
      <p style="margin-top:24px"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin" style="background:#14201A;color:#fff;padding:10px 20px;border-radius:99px;text-decoration:none;font-size:13px">Ver todos os leads</a></p>
    `,
  });

  return true;
}

export async function POST(req: NextRequest) {
  // Upload é caro: limite mais apertado que o dos formulários de texto.
  if (isRateLimited(clientIp(req), { windowMs: 30 * 60 * 1000, max: 3 })) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
      { status: 429 },
    );
  }

  let data: FormData;
  try {
    data = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
  }

  const str = (k: string) => (data.get(k) as string | null)?.toString().trim() || '';

  const elapsedRaw = str('elapsedMs');
  const antispam = {
    [HONEYPOT_FIELD]: str(HONEYPOT_FIELD),
    elapsedMs: elapsedRaw ? Number(elapsedRaw) : undefined,
  };

  // Bot: responde sucesso para não ensiná-lo a se adaptar, mas nada é gravado.
  if (shouldSilentlyDrop(antispam)) {
    console.warn(`[desafio] Envio descartado (anti-bot). IP=${clientIp(req)} email=${str('email') || '—'}`);
    return NextResponse.json({ success: true });
  }

  const name = str('name');
  const email = str('email');
  const company = str('company');
  const phone = str('phone');
  const segment = str('segment');
  const material = str('material');
  const currentYield = str('currentYield');
  const notes = str('notes');

  if (!name || !email) {
    return NextResponse.json({ error: 'Nome e e-mail são obrigatórios' }, { status: 400 });
  }
  if (str('consent') !== 'true') {
    return NextResponse.json(
      { error: 'É preciso aceitar o uso dos seus dados para continuar.' },
      { status: 400 },
    );
  }

  // --- arquivo (opcional: quem não tem cola a lista de peças) ---
  const file = data.get('file');
  let fileName = '';
  let fileUrl = '';
  let filePath = '';
  let fileError = '';

  if (file instanceof File && file.size > 0) {
    fileName = file.name;

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'O arquivo passa de 15 MB. Compacte em .zip ou mande só o plano.' },
        { status: 400 },
      );
    }
    if (!ALLOWED_EXT.has(extOf(file.name))) {
      return NextResponse.json(
        { error: 'Formato não aceito. Use PDF, DXF, planilha, imagem ou .zip.' },
        { status: 400 },
      );
    }

    try {
      const stamp = new Date();
      const folder = `${stamp.getUTCFullYear()}-${String(stamp.getUTCMonth() + 1).padStart(2, '0')}`;
      filePath = `${folder}/${stamp.getTime()}-${Math.random().toString(36).slice(2, 8)}-${safeName(file.name)}`;

      const supabase = getSupabaseAdmin();
      const buffer = Buffer.from(await file.arrayBuffer());

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(filePath, buffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      });
      if (upErr) throw new Error(upErr.message);

      // Bucket é privado: o time acessa por link assinado e temporário.
      const { data: signed, error: signErr } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(filePath, 60 * 60 * 24 * 7);
      if (signErr) throw new Error(signErr.message);
      fileUrl = signed?.signedUrl || '';
    } catch (e) {
      // Nunca perder o lead por causa do anexo.
      fileError = e instanceof Error ? e.message : 'erro desconhecido';
      console.error('[desafio] Falha ao subir o arquivo:', fileError);
    }
  }

  if (!fileName && !notes) {
    return NextResponse.json(
      { error: 'Anexe o plano de corte ou descreva as peças que você corta.' },
      { status: 400 },
    );
  }

  const resumo = [
    '— Desafio do plano de corte —',
    material ? `Material: ${material}` : '',
    currentYield ? `Aproveitamento que ele declara hoje: ${currentYield}` : '',
    fileName
      ? `Arquivo enviado: ${fileName}${filePath ? ` (storage: ${BUCKET}/${filePath})` : ''}${
          fileError ? ' — FALHA NO UPLOAD, pedir por e-mail' : ''
        }`
      : 'Sem arquivo — lista de peças colada abaixo',
    notes ? `\nLista de peças / observações:\n${notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const [first, ...rest] = name.split(' ');

  // Três destinos independentes: um lead não pode ser perdido porque UM caiu.
  const results = await Promise.allSettled([
    addLead({
      name,
      email,
      company,
      phone,
      size: '',
      source: 'Home · Desafio do plano de corte',
      role: '',
      segment,
      system: '',
      timeline: '',
      challenges: ['Sobra de chapa / MDF'],
      message: resumo,
      utm: {},
      consent: true,
    }),
    upsertContact({
      email,
      firstname: first,
      lastname: rest.join(' '),
      phone,
      company,
      message: resumo,
    }),
    notify({ name, email, company, phone, segment, material, currentYield, notes, fileName, fileUrl, fileError }),
  ]);

  const [supabase, hubspot, mail] = results;
  const labels = ['Supabase', 'HubSpot', 'E-mail'];
  results.forEach((r, i) => {
    if (r.status === 'rejected') console.error(`[desafio] Falha em ${labels[i]}:`, r.reason);
  });

  const storedInSupabase = supabase.status === 'fulfilled';
  const storedInHubSpot = hubspot.status === 'fulfilled' && hubspot.value === true;
  const emailSent = mail.status === 'fulfilled' && mail.value === true;

  if (!storedInSupabase && !storedInHubSpot && !emailSent) {
    console.error(
      '[desafio] LEAD PERDIDO: nenhum destino registrou o envio. ' +
        'Verifique SUPABASE_SECRET_KEY, HUBSPOT_PRIVATE_APP_TOKEN e as variáveis SMTP.',
    );
    return NextResponse.json(
      { error: 'Não foi possível registrar seu envio. Tente novamente.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, fileStored: Boolean(fileUrl) });
}
