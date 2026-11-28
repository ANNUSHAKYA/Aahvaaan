-- ==============================================================================
-- Aahvaaan by Vow & Vision - Phase 5A Migration: Supabase Database & Auth
-- File: supabase/migrations/001_init.sql
-- Idempotent: Safe to run on fresh or existing databases
-- ==============================================================================

-- 0. Extensions & Utilities
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- Helper function to generate safe, non-guessable random alphanumeric slugs
create or replace function public.generate_random_slug(length int)
returns text
language sql
as $$
  select string_agg(substr('23456789abcdefghjkmnpqrstuvwxyz', floor(random() * 32 + 1)::int, 1), '')
  from generate_series(1, length);
$$;

-- Helper function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ==============================================================================
-- 1. TABLES & SCHEMA ALIGNMENT
-- ==============================================================================

-- 1.1 Profiles (linked 1:1 to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists created_at timestamptz not null default now();

-- 1.2 Templates Catalog
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  price_inr integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.templates add column if not exists slug text;
alter table public.templates add column if not exists name text;
alter table public.templates add column if not exists price_inr integer;
alter table public.templates add column if not exists is_active boolean default true;
alter table public.templates add column if not exists created_at timestamptz not null default now();

-- Ensure existing templates have slug and relax legacy NOT NULL columns
do $$
begin
  -- Backfill slug with id if null
  update public.templates
  set slug = id::text
  where slug is null or slug = '';

  -- Relax legacy NOT NULL columns if table was created in an older schema
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'collection') then
    alter table public.templates alter column collection drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'category') then
    alter table public.templates alter column category drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'short_description') then
    alter table public.templates alter column short_description drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'description') then
    alter table public.templates alter column description drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'design_direction') then
    alter table public.templates alter column design_direction drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'image_url') then
    alter table public.templates alter column image_url drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'palette') then
    alter table public.templates alter column palette drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'colors') then
    alter table public.templates alter column colors drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'theme_styles') then
    alter table public.templates alter column theme_styles drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'starting_price') then
    alter table public.templates alter column starting_price drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'templates' and column_name = 'price_display') then
    alter table public.templates alter column price_display drop not null;
  end if;

  -- Ensure unique constraint on templates.slug
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.templates'::regclass
      and contype = 'u'
      and conname like '%slug%'
  ) and not exists (
    select 1 from pg_indexes
    where schemaname = 'public'
      and tablename = 'templates'
      and indexdef like '%UNIQUE%slug%'
  ) then
    begin
      alter table public.templates add constraint templates_slug_unique unique (slug);
    exception when others then
      null;
    end;
  end if;

  -- Ensure templates.id has a default generator if legacy table had no default
  begin
    alter table public.templates alter column id set default gen_random_uuid()::text;
  exception when others then
    begin
      alter table public.templates alter column id set default gen_random_uuid();
    exception when others then
      null;
    end;
  end;
end $$;

-- 1.3 Invitations
create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  slug text unique not null default public.generate_random_slug(10),
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  couple_names jsonb not null default '{"bride": "", "groom": ""}'::jsonb,
  wedding_date date,
  events jsonb not null default '[]'::jsonb,
  venue_name text,
  venue_address text,
  maps_url text,
  photos jsonb not null default '[]'::jsonb,
  music_choice text,
  family_note text,
  published_at timestamptz,
  edit_window_ends_at timestamptz,
  live_updates_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure all columns exist on invitations in case table was created previously
do $$
begin
  -- If host_id exists and owner_id does not, rename or sync
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'host_id')
     and not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'owner_id') then
    alter table public.invitations rename column host_id to owner_id;
  end if;
end $$;

alter table public.invitations add column if not exists owner_id uuid references public.profiles(id) on delete cascade;
alter table public.invitations add column if not exists template_id uuid references public.templates(id) on delete set null;
alter table public.invitations add column if not exists slug text default public.generate_random_slug(10);
alter table public.invitations add column if not exists status text default 'draft';
alter table public.invitations add column if not exists couple_names jsonb default '{"bride": "", "groom": ""}'::jsonb;
alter table public.invitations add column if not exists wedding_date date;
alter table public.invitations add column if not exists events jsonb default '[]'::jsonb;
alter table public.invitations add column if not exists venue_name text;
alter table public.invitations add column if not exists venue_address text;
alter table public.invitations add column if not exists maps_url text;
alter table public.invitations add column if not exists photos jsonb default '[]'::jsonb;
alter table public.invitations add column if not exists music_choice text;
alter table public.invitations add column if not exists music_meta jsonb;
alter table public.invitations add column if not exists family_note text;
alter table public.invitations add column if not exists published_at timestamptz;
alter table public.invitations add column if not exists edit_window_ends_at timestamptz;
alter table public.invitations add column if not exists live_updates_used integer default 0;
alter table public.invitations add column if not exists extra_named_links integer not null default 0;
alter table public.invitations add column if not exists extra_live_updates integer not null default 0;
alter table public.invitations add column if not exists editing_locked boolean not null default false;
alter table public.invitations add column if not exists expiry_reminder_sent_at timestamptz;
alter table public.invitations add column if not exists rsvp_digest_enabled boolean not null default false;
alter table public.invitations add column if not exists created_at timestamptz not null default now();
alter table public.invitations add column if not exists updated_at timestamptz not null default now();

-- Relax legacy NOT NULL columns if table was created in an older schema
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'bride_name') then
    alter table public.invitations alter column bride_name drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'groom_name') then
    alter table public.invitations alter column groom_name drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'location') then
    alter table public.invitations alter column location drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'venue') then
    alter table public.invitations alter column venue drop not null;
  end if;
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'invitations' and column_name = 'wedding_date') then
    alter table public.invitations alter column wedding_date drop not null;
  end if;
end $$;

-- 1.4 Invitation Drafts
create table if not exists public.invitation_drafts (
  invitation_id uuid primary key references public.invitations(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.invitation_drafts add column if not exists data jsonb not null default '{}'::jsonb;
alter table public.invitation_drafts add column if not exists updated_at timestamptz not null default now();

-- 1.5 Guests (Named Links)
create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  display_name text not null,
  slug text unique not null default public.generate_random_slug(12),
  max_party_size integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.guests add column if not exists invitation_id uuid references public.invitations(id) on delete cascade;
alter table public.guests add column if not exists display_name text;
alter table public.guests add column if not exists slug text default public.generate_random_slug(12);
alter table public.guests add column if not exists max_party_size integer default 1;
alter table public.guests add column if not exists created_at timestamptz not null default now();

-- 1.6 RSVPs
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  name text not null,
  attending boolean not null,
  party_size integer not null default 1,
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps add column if not exists invitation_id uuid references public.invitations(id) on delete cascade;
alter table public.rsvps add column if not exists guest_id uuid references public.guests(id) on delete set null;
alter table public.rsvps add column if not exists name text;
alter table public.rsvps add column if not exists attending boolean;
alter table public.rsvps add column if not exists party_size integer default 1;
alter table public.rsvps add column if not exists events_attending jsonb default '[]'::jsonb;
alter table public.rsvps add column if not exists meal_preference text;
alter table public.rsvps add column if not exists message text;
alter table public.rsvps add column if not exists created_at timestamptz not null default now();
alter table public.rsvps add column if not exists updated_at timestamptz not null default now();

create unique index if not exists idx_rsvps_invitation_guest_unique
  on public.rsvps(invitation_id, guest_id)
  where guest_id is not null;

-- 1.6b RSVP Rate Limits (hashed IP + timestamp, no raw IPs stored)
create table if not exists public.rsvp_rate_limits (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvp_rate_limits_lookup
  on public.rsvp_rate_limits(invitation_id, ip_hash, created_at);

alter table public.rsvp_rate_limits enable row level security;

-- 1.7 Views (analytics tracking)
create table if not exists public.views (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  device text,
  created_at timestamptz not null default now()
);

alter table public.views add column if not exists invitation_id uuid references public.invitations(id) on delete cascade;
alter table public.views add column if not exists guest_id uuid references public.guests(id) on delete set null;
alter table public.views add column if not exists device text;
alter table public.views add column if not exists created_at timestamptz not null default now();

-- 1.8 Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  invitation_id uuid references public.invitations(id) on delete set null,
  amount_inr integer not null,
  status text not null default 'created' check (status in ('created', 'paid', 'failed')),
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists owner_id uuid references public.profiles(id) on delete cascade;
alter table public.orders add column if not exists invitation_id uuid references public.invitations(id) on delete set null;
alter table public.orders add column if not exists amount_inr integer;
alter table public.orders add column if not exists status text default 'created';
alter table public.orders add column if not exists order_type text not null default 'publish';
alter table public.orders add column if not exists addon_quantity integer not null default 0;
alter table public.orders add column if not exists admin_note text;
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;
alter table public.orders add column if not exists created_at timestamptz not null default now();

-- 1.9 Admin Audit Logs (server-only access)
create table if not exists public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null,
  order_id uuid references public.orders(id) on delete set null,
  action text not null,
  note text,
  created_at timestamptz not null default now()
);

-- 1.10 Music Library Tracks (commercial distribution requires license_confirmed = true)
create table if not exists public.music_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text,
  movie_or_album text,
  category text not null,
  duration_seconds integer not null default 0,
  audio_url text not null,
  cover_url text,
  license_type text not null default 'original' check (license_type in ('original', 'licensed', 'royalty_free')),
  license_confirmed boolean not null default false,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.music_tracks enable row level security;

drop policy if exists "Public can view published licensed music tracks" on public.music_tracks;
create policy "Public can view published licensed music tracks"
  on public.music_tracks for select
  to public
  using (is_published = true and license_confirmed = true);

-- Seed 3 royalty-free starter tracks if empty
insert into public.music_tracks (id, title, artist, movie_or_album, category, duration_seconds, audio_url, license_type, license_confirmed, is_published, is_featured)
select gen_random_uuid(), v.title, v.artist, v.movie_or_album, v.category, v.duration_seconds, v.audio_url, 'royalty_free', true, true, v.is_featured
from (values
  ('Royal Shehnai & Sitar', 'Aahvaaan Ensemble', 'Traditional Heritage', 'Traditional Indian Music', 120, '/templates/mor-pankh/media/music.mp3', true),
  ('Auspicious Flute Raag', 'Aahvaaan Ensemble', 'Classical Instrumentals', 'Bollywood Instrumentals', 135, '/templates/mor-pankh/media/music.mp3', true),
  ('Palace Courtyard Melody', 'Aahvaaan Ensemble', 'Wedding Melodies', 'Wedding Classics', 110, '/templates/mor-pankh/media/music.mp3', false)
) as v(title, artist, movie_or_album, category, duration_seconds, audio_url, is_featured)
where not exists (select 1 from public.music_tracks);

-- Private bucket for customer-uploaded wedding music & public bucket for admin library
insert into storage.buckets (id, name, public)
values ('invitation-music', 'invitation-music', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('music-library', 'music-library', true)
on conflict (id) do nothing;

drop policy if exists "Owners can upload own invitation music" on storage.objects;
create policy "Owners can upload own invitation music"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'invitation-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can view own invitation music" on storage.objects;
create policy "Owners can view own invitation music"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'invitation-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Owners can delete own invitation music" on storage.objects;
create policy "Owners can delete own invitation music"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'invitation-music'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

alter table public.admin_audit_logs enable row level security;

-- Triggers for updated_at
drop trigger if exists set_invitations_updated_at on public.invitations;
create trigger set_invitations_updated_at
  before update on public.invitations
  for each row execute function public.handle_updated_at();

drop trigger if exists set_invitation_drafts_updated_at on public.invitation_drafts;
create trigger set_invitation_drafts_updated_at
  before update on public.invitation_drafts
  for each row execute function public.handle_updated_at();

-- Auto-create profile trigger on auth.users signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  )
  on conflict (id) do update
  set
    full_name = coalesce(nullif(excluded.full_name, ''), profiles.full_name),
    phone = coalesce(nullif(excluded.phone, ''), profiles.phone);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 2. ROW LEVEL SECURITY (RLS) - IDEMPOTENT WITH DROP POLICY IF EXISTS
-- ==============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.templates enable row level security;
alter table public.invitations enable row level security;
alter table public.invitation_drafts enable row level security;
alter table public.guests enable row level security;
alter table public.rsvps enable row level security;
alter table public.views enable row level security;
alter table public.orders enable row level security;

-- Revoke direct anon access from sensitive tables
revoke all on public.invitations from anon;
revoke all on public.invitation_drafts from anon;
revoke all on public.guests from anon;
revoke all on public.rsvps from anon;
revoke all on public.views from anon;
revoke all on public.orders from anon;

-- 2.1 Profiles Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- 2.2 Templates Policies (Public catalog view)
drop policy if exists "Anyone can view active templates" on public.templates;
drop policy if exists "Templates are viewable by everyone" on public.templates;
create policy "Anyone can view active templates"
  on public.templates for select
  to public
  using (is_active = true);

-- 2.3 Invitations Policies (Owners only - anon uses get_public_invitation)
drop policy if exists "Owners can view own invitations" on public.invitations;
drop policy if exists "Hosts can view own invitations" on public.invitations;
create policy "Owners can view own invitations"
  on public.invitations for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Owners can insert own invitations" on public.invitations;
drop policy if exists "Hosts can insert own invitations" on public.invitations;
create policy "Owners can insert own invitations"
  on public.invitations for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Owners can update own invitations" on public.invitations;
drop policy if exists "Hosts can update own invitations" on public.invitations;
create policy "Owners can update own invitations"
  on public.invitations for update
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Owners can delete own invitations" on public.invitations;
drop policy if exists "Hosts can delete own invitations" on public.invitations;
create policy "Owners can delete own invitations"
  on public.invitations for delete
  to authenticated
  using (owner_id = auth.uid());

-- 2.4 Invitation Drafts Policies
drop policy if exists "Owners can view own invitation drafts" on public.invitation_drafts;
create policy "Owners can view own invitation drafts"
  on public.invitation_drafts for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_drafts.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can insert own invitation drafts" on public.invitation_drafts;
create policy "Owners can insert own invitation drafts"
  on public.invitation_drafts for insert
  to authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_drafts.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can update own invitation drafts" on public.invitation_drafts;
create policy "Owners can update own invitation drafts"
  on public.invitation_drafts for update
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_drafts.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can delete own invitation drafts" on public.invitation_drafts;
create policy "Owners can delete own invitation drafts"
  on public.invitation_drafts for delete
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = invitation_drafts.invitation_id
        and i.owner_id = auth.uid()
    )
  );

-- 2.5 Guests Policies (Owners only)
drop policy if exists "Owners can view own guests" on public.guests;
create policy "Owners can view own guests"
  on public.guests for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = guests.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can insert own guests" on public.guests;
create policy "Owners can insert own guests"
  on public.guests for insert
  to authenticated
  with check (
    exists (
      select 1 from public.invitations i
      where i.id = guests.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can update own guests" on public.guests;
create policy "Owners can update own guests"
  on public.guests for update
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = guests.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can delete own guests" on public.guests;
create policy "Owners can delete own guests"
  on public.guests for delete
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = guests.invitation_id
        and i.owner_id = auth.uid()
    )
  );

-- 2.6 RSVPs Policies (Owners can view; anon inserts through submit_rsvp RPC only)
drop policy if exists "Owners can view RSVPs for their invitations" on public.rsvps;
create policy "Owners can view RSVPs for their invitations"
  on public.rsvps for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = rsvps.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can update RSVPs for their invitations" on public.rsvps;
create policy "Owners can update RSVPs for their invitations"
  on public.rsvps for update
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = rsvps.invitation_id
        and i.owner_id = auth.uid()
    )
  );

drop policy if exists "Owners can delete RSVPs for their invitations" on public.rsvps;
create policy "Owners can delete RSVPs for their invitations"
  on public.rsvps for delete
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = rsvps.invitation_id
        and i.owner_id = auth.uid()
    )
  );

-- 2.7 Views Policies (Owners can view analytics; anon inserts through track_view RPC only)
drop policy if exists "Owners can view analytics views for their invitations" on public.views;
create policy "Owners can view analytics views for their invitations"
  on public.views for select
  to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.id = views.invitation_id
        and i.owner_id = auth.uid()
    )
  );

-- 2.8 Orders Policies (Owners view & create own orders)
drop policy if exists "Owners can view own orders" on public.orders;
create policy "Owners can view own orders"
  on public.orders for select
  to authenticated
  using (owner_id = auth.uid());

drop policy if exists "Owners can insert own orders" on public.orders;
create policy "Owners can insert own orders"
  on public.orders for insert
  to authenticated
  with check (owner_id = auth.uid());

drop policy if exists "Owners can update own orders" on public.orders;
create policy "Owners can update own orders"
  on public.orders for update
  to authenticated
  using (owner_id = auth.uid());

-- ==============================================================================
-- 3. SECURE RPC FUNCTIONS FOR PUBLIC ACCESS
-- ==============================================================================

-- Drop any previous overloaded versions to avoid PostgREST PGRST203 ambiguity
drop function if exists public.get_public_invitation(text, text);
drop function if exists public.get_public_invitation(text);

-- 3.1 get_public_invitation: Safe read-only access for published invitations
create or replace function public.get_public_invitation(
  p_slug text,
  p_guest_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  v_guest jsonb := null;
begin
  -- If guest slug is provided, look up guest details
  if p_guest_slug is not null and trim(p_guest_slug) <> '' then
    select jsonb_build_object(
      'id', g.id,
      'display_name', g.display_name,
      'slug', g.slug,
      'max_party_size', g.max_party_size
    )
    into v_guest
    from public.guests g
    join public.invitations i on i.id = g.invitation_id
    where i.slug = p_slug and g.slug = trim(p_guest_slug);
  end if;

  select jsonb_build_object(
    'id', i.id,
    'slug', i.slug,
    'status', i.status,
    'couple_names', i.couple_names,
    'wedding_date', i.wedding_date,
    'events', i.events,
    'venue_name', i.venue_name,
    'venue_address', i.venue_address,
    'maps_url', i.maps_url,
    'photos', i.photos,
    'music_choice', i.music_choice,
    'music_meta', i.music_meta,
    'family_note', i.family_note,
    'published_at', i.published_at,
    'guest', v_guest,
    'template', case
      when t.id is not null then jsonb_build_object(
        'slug', t.slug,
        'name', t.name
      )
      else null
    end
  )
  into result
  from public.invitations i
  left join public.templates t on t.id::text = i.template_id::text
  where i.slug = p_slug
    and i.status in ('published', 'archived');

  return result;
end;
$$;

grant execute on function public.get_public_invitation(text, text) to anon, authenticated;

-- 3.1b get_public_guest: Safe read-only lookup by guest.slug for /n/[slug]
drop function if exists public.get_public_guest(text);

create or replace function public.get_public_guest(
  p_guest_slug text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if p_guest_slug is null or trim(p_guest_slug) = '' then
    return null;
  end if;

  select jsonb_build_object(
    'id', i.id,
    'slug', i.slug,
    'status', i.status,
    'couple_names', i.couple_names,
    'wedding_date', i.wedding_date,
    'events', i.events,
    'venue_name', i.venue_name,
    'venue_address', i.venue_address,
    'maps_url', i.maps_url,
    'photos', i.photos,
    'music_choice', i.music_choice,
    'music_meta', i.music_meta,
    'family_note', i.family_note,
    'published_at', i.published_at,
    'guest', jsonb_build_object(
      'id', g.id,
      'display_name', g.display_name,
      'slug', g.slug,
      'max_party_size', g.max_party_size
    ),
    'template', case
      when t.id is not null then jsonb_build_object(
        'slug', t.slug,
        'name', t.name
      )
      else null
    end
  )
  into result
  from public.guests g
  join public.invitations i on i.id = g.invitation_id
  left join public.templates t on t.id::text = i.template_id::text
  where g.slug = trim(p_guest_slug)
    and i.status in ('published', 'archived')
  limit 1;

  return result;
end;
$$;

grant execute on function public.get_public_guest(text) to anon, authenticated;

-- 3.2 submit_rsvp: Anonymous/Guest RSVP submission validating invitation slug, status & party size
drop function if exists public.submit_rsvp(text, text, boolean, integer, text, text);
drop function if exists public.submit_rsvp(text, text, boolean, integer, text, text, jsonb, text);

create or replace function public.submit_rsvp(
  p_invitation_slug text,
  p_name text,
  p_attending boolean,
  p_party_size integer default 1,
  p_message text default null,
  p_guest_slug text default null,
  p_events_attending jsonb default '[]'::jsonb,
  p_meal_preference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation_id uuid;
  v_edit_window_ends_at timestamptz;
  v_guest_id uuid := null;
  v_guest_name text := null;
  v_max_party integer := 10;
  v_rsvp_id uuid;
  v_is_update boolean := false;
begin
  -- Validate published invitation
  select id, edit_window_ends_at
  into v_invitation_id, v_edit_window_ends_at
  from public.invitations
  where slug = p_invitation_slug
    and status = 'published';

  if v_invitation_id is null then
    return jsonb_build_object(
      'success', false,
      'error', 'Invitation not found or not published'
    );
  end if;

  if v_edit_window_ends_at is not null and v_edit_window_ends_at < now() then
    return jsonb_build_object(
      'success', false,
      'error', 'RSVP window has closed for this invitation.'
    );
  end if;

  -- Validate guest slug if passed (named link)
  if p_guest_slug is not null and trim(p_guest_slug) <> '' then
    select id, display_name, max_party_size
    into v_guest_id, v_guest_name, v_max_party
    from public.guests
    where slug = trim(p_guest_slug)
      and invitation_id = v_invitation_id;

    if v_guest_id is null then
      return jsonb_build_object(
        'success', false,
        'error', 'Guest link is invalid for this invitation.'
      );
    end if;
  end if;

  -- Validate party size
  if p_party_size is null or p_party_size < 1 or p_party_size > coalesce(v_max_party, 10) then
    return jsonb_build_object(
      'success', false,
      'error', format('Party size must be between 1 and %s.', coalesce(v_max_party, 10))
    );
  end if;

  if v_guest_id is not null then
    -- Named link: upsert one row per guest (locked to guest.display_name)
    insert into public.rsvps (
      invitation_id,
      guest_id,
      name,
      attending,
      party_size,
      events_attending,
      meal_preference,
      message,
      updated_at
    ) values (
      v_invitation_id,
      v_guest_id,
      v_guest_name,
      p_attending,
      p_party_size,
      coalesce(p_events_attending, '[]'::jsonb),
      nullif(trim(coalesce(p_meal_preference, '')), ''),
      left(nullif(trim(coalesce(p_message, '')), ''), 300),
      now()
    )
    on conflict (invitation_id, guest_id) where guest_id is not null
    do update set
      attending = excluded.attending,
      party_size = excluded.party_size,
      events_attending = excluded.events_attending,
      meal_preference = excluded.meal_preference,
      message = excluded.message,
      updated_at = now()
    returning id, (xmax <> 0) into v_rsvp_id, v_is_update;
  else
    -- Open link: always create a new row
    insert into public.rsvps (
      invitation_id,
      guest_id,
      name,
      attending,
      party_size,
      events_attending,
      meal_preference,
      message
    ) values (
      v_invitation_id,
      null,
      left(trim(p_name), 80),
      p_attending,
      p_party_size,
      coalesce(p_events_attending, '[]'::jsonb),
      nullif(trim(coalesce(p_meal_preference, '')), ''),
      left(nullif(trim(coalesce(p_message, '')), ''), 300)
    )
    returning id into v_rsvp_id;
  end if;

  return jsonb_build_object(
    'success', true,
    'rsvp_id', v_rsvp_id,
    'is_update', v_is_update
  );
end;
$$;

grant execute on function public.submit_rsvp(text, text, boolean, integer, text, text, jsonb, text) to anon, authenticated;

-- 3.2b check_rsvp_rate_limit: Max 5 submissions per hour per hashed IP per invitation
create or replace function public.check_rsvp_rate_limit(
  p_invitation_slug text,
  p_ip_hash text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation_id uuid;
  v_recent_count integer;
begin
  select id into v_invitation_id
  from public.invitations
  where slug = p_invitation_slug
    and status = 'published';

  if v_invitation_id is null then
    return false;
  end if;

  select count(*) into v_recent_count
  from public.rsvp_rate_limits
  where invitation_id = v_invitation_id
    and ip_hash = p_ip_hash
    and created_at > now() - interval '1 hour';

  if v_recent_count >= 5 then
    return false;
  end if;

  insert into public.rsvp_rate_limits (invitation_id, ip_hash)
  values (v_invitation_id, p_ip_hash);

  return true;
end;
$$;

grant execute on function public.check_rsvp_rate_limit(text, text) to anon, authenticated;

-- Enable Supabase Realtime for rsvps
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'rsvps'
  ) then
    alter publication supabase_realtime add table public.rsvps;
  end if;
exception when others then
  null;
end $$;

-- 3.3 track_view: Anonymous page view tracking validating invitation slug
create or replace function public.track_view(
  p_invitation_slug text,
  p_device text default 'unknown',
  p_guest_slug text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invitation_id uuid;
  v_guest_id uuid := null;
  v_view_id uuid;
begin
  -- Validate published invitation
  select id into v_invitation_id
  from public.invitations
  where slug = p_invitation_slug
    and status = 'published';

  if v_invitation_id is null then
    return jsonb_build_object(
      'success', false,
      'error', 'Invitation not found or not published'
    );
  end if;

  -- Validate guest slug if passed
  if p_guest_slug is not null and trim(p_guest_slug) <> '' then
    select id into v_guest_id
    from public.guests
    where slug = trim(p_guest_slug)
      and invitation_id = v_invitation_id;
  end if;

  insert into public.views (
    invitation_id,
    guest_id,
    device
  ) values (
    v_invitation_id,
    v_guest_id,
    coalesce(p_device, 'unknown')
  )
  returning id into v_view_id;

  return jsonb_build_object(
    'success', true,
    'view_id', v_view_id
  );
end;
$$;

grant execute on function public.track_view(text, text, text) to anon, authenticated;

-- 3.4 get_invitation_analytics: Owner-only analytics summary, daily views, device split & guest activity
drop function if exists public.get_invitation_analytics(uuid);

create or replace function public.get_invitation_analytics(
  p_invitation_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner_id uuid;
  v_total_views integer;
  v_unique_visitors integer;
  v_named_opened integer;
  v_named_total integer;
  v_replied_count integer;
  v_views_by_day jsonb;
  v_device_split jsonb;
  v_guest_activity jsonb;
begin
  select owner_id into v_owner_id
  from public.invitations
  where id = p_invitation_id;

  if v_owner_id is null or v_owner_id <> auth.uid() then
    return null;
  end if;

  select count(*) into v_total_views
  from public.views
  where invitation_id = p_invitation_id;

  select count(distinct coalesce(guest_id::text, 'open_' || date_trunc('hour', created_at)::text || '_' || coalesce(device, 'unknown')))
  into v_unique_visitors
  from public.views
  where invitation_id = p_invitation_id;

  select count(*) into v_named_total
  from public.guests
  where invitation_id = p_invitation_id;

  select count(distinct guest_id) into v_named_opened
  from public.views
  where invitation_id = p_invitation_id
    and guest_id is not null;

  select count(*) into v_replied_count
  from public.rsvps
  where invitation_id = p_invitation_id;

  select coalesce(jsonb_agg(row_to_json(d) order by d.day), '[]'::jsonb)
  into v_views_by_day
  from (
    select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day,
           count(*) as views
    from public.views
    where invitation_id = p_invitation_id
      and created_at >= now() - interval '30 days'
    group by 1
  ) d;

  select coalesce(jsonb_agg(row_to_json(s)), '[]'::jsonb)
  into v_device_split
  from (
    select coalesce(nullif(device, ''), 'unknown') as device,
           count(*) as count
    from public.views
    where invitation_id = p_invitation_id
    group by 1
  ) s;

  select coalesce(jsonb_agg(row_to_json(ga) order by ga.created_at), '[]'::jsonb)
  into v_guest_activity
  from (
    select g.id,
           g.display_name,
           g.slug,
           g.created_at,
           coalesce(v.view_count, 0) as view_count,
           v.last_opened_at,
           case
             when r.id is null then 'pending'
             when r.attending then 'attending'
             else 'declined'
           end as rsvp_status
    from public.guests g
    left join (
      select guest_id, count(*) as view_count, max(created_at) as last_opened_at
      from public.views
      where invitation_id = p_invitation_id and guest_id is not null
      group by guest_id
    ) v on v.guest_id = g.id
    left join public.rsvps r on r.guest_id = g.id and r.invitation_id = p_invitation_id
    where g.invitation_id = p_invitation_id
  ) ga;

  return jsonb_build_object(
    'total_views', v_total_views,
    'unique_visitors', v_unique_visitors,
    'named_opened', v_named_opened,
    'named_total', v_named_total,
    'replied_count', v_replied_count,
    'views_by_day', v_views_by_day,
    'device_split', v_device_split,
    'guest_activity', v_guest_activity
  );
end;
$$;

grant execute on function public.get_invitation_analytics(uuid) to authenticated;

-- 3.4 publish_invitation: Publishing copies draft -> invitations
create or replace function public.publish_invitation(p_invitation_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_draft jsonb;
  v_owner_id uuid;
  v_live_updates integer;
begin
  select owner_id, live_updates_used into v_owner_id, v_live_updates
  from public.invitations
  where id = p_invitation_id;

  if v_owner_id is null or v_owner_id <> auth.uid() then
    return jsonb_build_object('success', false, 'error', 'Unauthorized');
  end if;

  select data into v_draft
  from public.invitation_drafts
  where invitation_id = p_invitation_id;

  if v_draft is null then
    return jsonb_build_object('success', false, 'error', 'Draft not found');
  end if;

  update public.invitations
  set
    status = 'published',
    couple_names = coalesce(v_draft->'couple_names', couple_names),
    wedding_date = coalesce((v_draft->>'wedding_date')::date, wedding_date),
    events = coalesce(v_draft->'events', events),
    venue_name = coalesce(v_draft->>'venue_name', venue_name),
    venue_address = coalesce(v_draft->>'venue_address', venue_address),
    maps_url = coalesce(v_draft->>'maps_url', maps_url),
    photos = coalesce(v_draft->'photos', photos),
    music_choice = coalesce(v_draft->>'music_choice', music_choice),
    family_note = coalesce(v_draft->>'family_note', family_note),
    published_at = coalesce(published_at, now()),
    edit_window_ends_at = coalesce(edit_window_ends_at, now() + interval '9 months'),
    live_updates_used = case when published_at is not null then coalesce(v_live_updates, 0) + 1 else coalesce(v_live_updates, 0) end,
    updated_at = now()
  where id = p_invitation_id;

  return jsonb_build_object('success', true);
end;
$$;

grant execute on function public.publish_invitation(uuid) to authenticated;

-- ==============================================================================
-- 4. STORAGE CONFIGURATION & RLS
-- ==============================================================================

-- Storage bucket for private wedding invitation photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'invitation-photos',
  'invitation-photos',
  false,
  3145728, -- 3 MB limit
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 3145728,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];

-- Storage Policies: Owners upload to {owner_id}/{invitation_id}/*
-- Note: storage.objects has RLS enabled by default in Supabase system catalog
drop policy if exists "Owners can upload invitation photos" on storage.objects;
create policy "Owners can upload invitation photos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'invitation-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Owners can read own invitation photos" on storage.objects;
create policy "Owners can read own invitation photos"
on storage.objects for select
to authenticated
using (
  bucket_id = 'invitation-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Owners can update own invitation photos" on storage.objects;
create policy "Owners can update own invitation photos"
on storage.objects for update
to authenticated
using (
  bucket_id = 'invitation-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Owners can delete own invitation photos" on storage.objects;
create policy "Owners can delete own invitation photos"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'invitation-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- ==============================================================================
-- 5. SEED INITIAL TEMPLATE (Mor Pankh)
-- ==============================================================================

do $$
begin
  if exists (select 1 from public.templates where slug = 'mor-pankh' or id::text = 'mor-pankh') then
    update public.templates
    set
      slug = 'mor-pankh',
      name = 'Mor Pankh',
      price_inr = 1749, -- Signature Plan price from siteConfig
      is_active = true
    where slug = 'mor-pankh' or id::text = 'mor-pankh';
  else
    begin
      insert into public.templates (id, slug, name, price_inr, is_active)
      values (
        'mor-pankh',
        'mor-pankh',
        'Mor Pankh',
        1749,
        true
      );
    exception when others then
      insert into public.templates (id, slug, name, price_inr, is_active)
      values (
        'a0000000-0000-0000-0000-000000000001',
        'mor-pankh',
        'Mor Pankh',
        1749,
        true
      );
    end;
  end if;
end $$;
