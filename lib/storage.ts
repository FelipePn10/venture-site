import { getSupabaseAdmin } from './supabase';

type PgError = { message: string; details?: string | null; hint?: string | null; code?: string | null };

function dbError(context: string, error: PgError): never {
  const parts = [error.message];
  if (error.details) parts.push(error.details);
  if (error.hint) parts.push(`dica: ${error.hint}`);
  if (error.code) parts.push(`código ${error.code}`);
  throw new Error(`${context}: ${parts.filter(Boolean).join(' · ')}`);
}

export type Lead = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  size: string;
  source?: string;
  // Qualificação vinda do formulário de marketing (LeadForm).
  role: string;
  segment: string;
  system: string;
  timeline: string;
  challenges: string[];
  message: string;
  utm: Record<string, string>;
  /** Consentimento LGPD: aceite explícito e o momento em que ocorreu. */
  consent: boolean;
  consentAt: string | null;
};

export type Contact = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type Schedule = {
  id: number;
  createdAt: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  segment: string;
  size: string;
  current: string;
  date: string;
  time: string;
  notes?: string;
};

// --- Mapeamento snake_case (DB) -> camelCase (app) ---
/* eslint-disable @typescript-eslint/no-explicit-any */
function mapLead(r: any): Lead {
  return {
    id: Number(r.id),
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    company: r.company ?? '',
    phone: r.phone ?? '',
    size: r.size ?? '',
    source: r.source ?? undefined,
    role: r.role ?? '',
    segment: r.segment ?? '',
    system: r.system ?? '',
    timeline: r.timeline ?? '',
    challenges: r.challenges ?? [],
    message: r.message ?? '',
    utm: r.utm ?? {},
    consent: r.consent ?? false,
    consentAt: r.consent_at ?? null,
  };
}

function mapContact(r: any): Contact {
  return {
    id: Number(r.id),
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    subject: r.subject,
    message: r.message,
  };
}

function mapSchedule(r: any): Schedule {
  return {
    id: Number(r.id),
    createdAt: r.created_at,
    name: r.name,
    email: r.email,
    company: r.company ?? '',
    phone: r.phone ?? '',
    segment: r.segment ?? '',
    size: r.size ?? '',
    current: r.current ?? '',
    date: r.date,
    time: r.time,
    notes: r.notes ?? undefined,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// --- Leads ---
export async function getLeads(): Promise<Lead[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('leads')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) dbError("Erro ao ler leads", error);
  return (data ?? []).map(mapLead);
}

/** Campos de qualificação são opcionais: nem toda origem de lead os coleta. */
type QualificationFields =
  | 'role'
  | 'segment'
  | 'system'
  | 'timeline'
  | 'challenges'
  | 'message'
  | 'utm'
  | 'consent'
  | 'consentAt';
export type LeadInput = Omit<Lead, 'id' | 'createdAt' | QualificationFields> &
  Partial<Pick<Lead, QualificationFields>>;

export async function addLead(input: LeadInput): Promise<Lead> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('leads')
    .insert({
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
      size: input.size,
      source: input.source ?? null,
      role: input.role ?? '',
      segment: input.segment ?? '',
      system: input.system ?? '',
      timeline: input.timeline ?? '',
      challenges: input.challenges ?? [],
      message: input.message ?? '',
      utm: input.utm ?? {},
      consent: input.consent ?? false,
      consent_at: input.consent ? new Date().toISOString() : null,
    })
    .select()
    .single();
  if (error) dbError("Erro ao salvar lead", error);
  return mapLead(data);
}

// --- Contatos ---
export async function getContacts(): Promise<Contact[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) dbError("Erro ao ler contatos", error);
  return (data ?? []).map(mapContact);
}

export async function addContact(input: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('contacts')
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
    })
    .select()
    .single();
  if (error) dbError("Erro ao salvar contato", error);
  return mapContact(data);
}

// --- Agendamentos ---
export async function getSchedules(): Promise<Schedule[]> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('schedules')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) dbError("Erro ao ler agendamentos", error);
  return (data ?? []).map(mapSchedule);
}

export async function addSchedule(input: Omit<Schedule, 'id' | 'createdAt'>): Promise<Schedule> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('schedules')
    .insert({
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone,
      segment: input.segment,
      size: input.size,
      current: input.current,
      date: input.date,
      time: input.time,
      notes: input.notes ?? null,
    })
    .select()
    .single();
  if (error) dbError("Erro ao salvar agendamento", error);
  return mapSchedule(data);
}

export async function isSlotTaken(date: string, time: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  const { data, error } = await sb
    .from('schedules')
    .select('id')
    .eq('date', date)
    .eq('time', time)
    .limit(1);
  if (error) dbError("Erro ao verificar horário", error);
  return (data?.length ?? 0) > 0;
}
