begin;

create extension if not exists pgcrypto;

create type public.complaint_category as enum ('pothole','garbage','open_drain','broken_streetlight','water_leakage','road_damage','traffic_signal','flooding','sewage','other');
create type public.complaint_priority as enum ('critical','high','medium','low');
create type public.complaint_status as enum ('submitted','triaged','assigned','in_progress','resolution_submitted','resolved_pending_verification','verification_pending','resolved','verification_failed','sla_breached','rejected','reopened');
create type public.department_code as enum ('roads','sanitation','water','drainage','electrical','traffic','public_safety');
create type public.evidence_kind as enum ('initial','resolution');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('citizen','officer','admin')),
  department_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.departments (
  code public.department_code primary key,
  name text not null unique,
  description text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create sequence public.complaint_reference_seq start 1021;
create function public.next_complaint_reference() returns text language sql volatile as $$
  select 'CT-' || nextval('public.complaint_reference_seq')::text
$$;

create table public.complaints (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default public.next_complaint_reference() check (reference ~ '^CT-[0-9]+$'),
  title text not null check (char_length(title) between 3 and 120),
  description text not null check (char_length(description) between 10 and 3000),
  category public.complaint_category not null,
  secondary_categories public.complaint_category[] not null default '{}',
  status public.complaint_status not null default 'submitted',
  priority public.complaint_priority not null,
  priority_score smallint not null check (priority_score between 0 and 100),
  priority_breakdown jsonb not null check (jsonb_typeof(priority_breakdown) = 'object'),
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  address text not null check (char_length(address) between 3 and 300),
  reporter_id text not null,
  analysis jsonb not null check (jsonb_typeof(analysis) = 'object'),
  decision jsonb not null check (jsonb_typeof(decision) = 'object'),
  duplicate_of uuid references public.complaints(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.complaint_ai_analysis (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null unique references public.complaints(id) on delete cascade,
  provider text not null,
  model text not null,
  image_analysis jsonb not null check (jsonb_typeof(image_analysis) = 'object'),
  confidence double precision not null check (confidence between 0 and 1),
  created_at timestamptz not null default now()
);

create table public.complaint_decisions (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null unique references public.complaints(id) on delete cascade,
  decision jsonb not null check (jsonb_typeof(decision) = 'object'),
  priority_score smallint not null check (priority_score between 0 and 100),
  priority_level public.complaint_priority not null,
  sla_due_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  status public.complaint_status not null,
  note text not null check (char_length(note) between 2 and 1000),
  actor_id text not null,
  created_at timestamptz not null default now()
);

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  department public.department_code not null references public.departments(code),
  assignee_id text not null,
  assigned_by text not null,
  created_at timestamptz not null default now()
);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null references public.complaints(id) on delete cascade,
  kind public.evidence_kind not null,
  url text not null,
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','image/svg+xml')),
  size_bytes integer not null check (size_bytes > 0 and size_bytes <= 8000000),
  latitude double precision check (latitude between -90 and 90),
  longitude double precision check (longitude between -180 and 180),
  created_at timestamptz not null default now(),
  check ((latitude is null) = (longitude is null))
);

create table public.verification (
  id uuid primary key default gen_random_uuid(),
  complaint_id uuid not null unique references public.complaints(id) on delete cascade,
  visual_score smallint not null check (visual_score between 0 and 100),
  gps_distance_meters double precision not null check (gps_distance_meters >= 0),
  confidence double precision not null check (confidence between 0 and 1),
  passed boolean not null,
  notes text[] not null default '{}',
  source text not null check (source in ('openrouter','deterministic_fallback','demo_seed')),
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  complaint_id uuid references public.complaints(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 160),
  message text not null check (char_length(message) between 1 and 1000),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create view public.complaint_status_history as select * from public.status_history;
create view public.resolution_evidence as select * from public.evidence where kind = 'resolution';
create view public.verification_results as select * from public.verification;

create index complaints_created_at_idx on public.complaints(created_at desc);
create index complaints_status_priority_idx on public.complaints(status, priority);
create index complaints_category_idx on public.complaints(category);
create index complaints_location_idx on public.complaints(latitude, longitude);
create index status_history_complaint_idx on public.status_history(complaint_id, created_at);
create index assignments_complaint_idx on public.assignments(complaint_id, created_at);
create index evidence_complaint_idx on public.evidence(complaint_id, created_at);
create index notifications_user_idx on public.notifications(user_id, created_at desc);

create function public.set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger complaints_set_updated_at before update on public.complaints for each row execute function public.set_updated_at();

alter table public.users enable row level security;
alter table public.departments enable row level security;
alter table public.complaints enable row level security;
alter table public.complaint_ai_analysis enable row level security;
alter table public.complaint_decisions enable row level security;
alter table public.status_history enable row level security;
alter table public.assignments enable row level security;
alter table public.evidence enable row level security;
alter table public.verification enable row level security;
alter table public.notifications enable row level security;

create policy users_self_read on public.users for select to authenticated using (id = auth.uid());
create policy users_self_update on public.users for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy departments_public_read on public.departments for select using (active);
create policy complaints_public_read on public.complaints for select using (true);
create policy ai_analysis_public_read on public.complaint_ai_analysis for select using (true);
create policy complaint_decisions_public_read on public.complaint_decisions for select using (true);
create policy history_public_read on public.status_history for select using (true);
create policy assignments_public_read on public.assignments for select using (true);
create policy evidence_public_read on public.evidence for select using (true);
create policy verification_public_read on public.verification for select using (true);
create policy notifications_owner_read on public.notifications for select using (user_id = auth.uid()::text);
create policy complaints_authenticated_insert on public.complaints for insert to authenticated with check (reporter_id = auth.uid()::text);
create policy history_authenticated_insert on public.status_history for insert to authenticated with check (true);
create policy assignments_authenticated_write on public.assignments for all to authenticated using (true) with check (true);
create policy evidence_authenticated_insert on public.evidence for insert to authenticated with check (true);
create policy verification_authenticated_write on public.verification for all to authenticated using (true) with check (true);
create policy notifications_owner_update on public.notifications for update to authenticated using (user_id = auth.uid()::text) with check (user_id = auth.uid()::text);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
('complaint-images', 'complaint-images', true, 8000000, array['image/jpeg','image/png','image/webp']),
('resolution-images', 'resolution-images', true, 8000000, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy civic_images_public_read on storage.objects for select using (bucket_id in ('complaint-images','resolution-images'));
create policy civic_images_authenticated_upload on storage.objects for insert to authenticated with check (bucket_id in ('complaint-images','resolution-images'));
create policy civic_images_owner_update on storage.objects for update to authenticated using (bucket_id in ('complaint-images','resolution-images') and owner_id = auth.uid()::text) with check (bucket_id in ('complaint-images','resolution-images') and owner_id = auth.uid()::text);

commit;
