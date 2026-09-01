create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  whatsapp text not null,
  email text,
  answers jsonb not null,
  utm jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  page_url text,
  lead_score integer not null,
  classification text not null check (classification in ('HOT','WARM','COLD')),
  created_at timestamptz not null default now()
);

create index leads_classification_idx on public.leads (classification);
create index leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;
-- Sem policies públicas de propósito: só a service_role key (usada exclusivamente
-- no servidor) consegue ler ou escrever aqui. O anon key não acessa nada.
