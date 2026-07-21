-- ====================================================
-- VentureERP — esquema de dados (Supabase / Postgres)
-- Como aplicar: Supabase Dashboard → SQL Editor → New query
--               → cole tudo abaixo → Run.
-- ====================================================

-- Leads (pedidos de demonstração / boletim)
create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text not null default '',
  phone       text not null default '',
  size        text not null default '',
  source      text
);
create index if not exists leads_created_at_idx on public.leads (created_at);

-- Campos de qualificação do formulário de marketing (LeadForm).
-- Idempotente: rodar de novo não quebra nada.
alter table public.leads add column if not exists role       text not null default '';
alter table public.leads add column if not exists segment    text not null default '';
alter table public.leads add column if not exists system     text not null default '';
alter table public.leads add column if not exists timeline   text not null default '';
alter table public.leads add column if not exists challenges text[] not null default '{}';
alter table public.leads add column if not exists message    text not null default '';
-- Origem de campanha (utm_*, referrer) para atribuição.
alter table public.leads add column if not exists utm        jsonb not null default '{}'::jsonb;
-- Prova de consentimento (LGPD art. 8º): o titular aceitou e quando.
alter table public.leads add column if not exists consent    boolean not null default false;
alter table public.leads add column if not exists consent_at timestamptz;

-- Mensagens do formulário de contato
create table if not exists public.contacts (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null
);
create index if not exists contacts_created_at_idx on public.contacts (created_at);

-- Demonstrações agendadas
create table if not exists public.schedules (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text not null default '',
  phone       text not null default '',
  segment     text not null default 'Não informado',
  size        text not null default '',
  "current"   text not null default '',
  date        text not null,
  time        text not null,
  notes       text,
  unique (date, time)
);
create index if not exists schedules_date_idx on public.schedules (date);

-- ----------------------------------------------------
-- Segurança: ativa Row Level Security e NÃO cria policies
-- para a chave pública (anon/publishable). O servidor acessa
-- via service_role, que bypassa o RLS. Resultado: a chave
-- pública não consegue ler nem escrever — dados protegidos
-- por padrão, sem rota de vazamento pelo front.
-- ----------------------------------------------------
alter table public.leads     enable row level security;
alter table public.contacts  enable row level security;
alter table public.schedules enable row level security;
