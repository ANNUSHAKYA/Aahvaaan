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
alter table public.invitations add column if not exists family_note text;
alter table public.invitations add column if not exists published_at timestamptz;
alter table public.invitations add column if not exists edit_window_ends_at timestamptz;
alter table public.invitations add column if not exists live_updates_used integer default 0;
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
alter table public.rsvps add column if not exists message text;
alter table public.rsvps add column if not exists created_at timestamptz not null default now();

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
alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;
alter table public.orders add column if not exists created_at timestamptz not null default now();

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

-- 3.1 get_public_invitation: Safe read-only access for published invitations
create or replace function public.get_public_invitation(p_slug text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
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
    'family_note', i.family_note,
    'published_at', i.published_at,
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
  left join public.templates t on t.id = i.template_id
  where i.slug = p_slug
    and i.status = 'published';

  return result;
end;
$$;

grant execute on function public.get_public_invitation(text) to anon, authenticated;

-- 3.2 submit_rsvp: Anonymous/Guest RSVP submission validating invitation slug
create or replace function public.submit_rsvp(
  p_invitation_slug text,
  p_name text,
  p_attending boolean,
  p_party_size integer default 1,
  p_message text default null,
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
  v_rsvp_id uuid;
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

  -- Insert RSVP
  insert into public.rsvps (
    invitation_id,
    guest_id,
    name,
    attending,
    party_size,
    message
  ) values (
    v_invitation_id,
    v_guest_id,
    trim(p_name),
    p_attending,
    greatest(1, coalesce(p_party_size, 1)),
    p_message
  )
  returning id into v_rsvp_id;

  return jsonb_build_object(
    'success', true,
    'rsvp_id', v_rsvp_id
  );
end;
$$;

grant execute on function public.submit_rsvp(text, text, boolean, integer, text, text) to anon, authenticated;

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
    insert into public.templates (slug, name, price_inr, is_active)
    values (
      'mor-pankh',
      'Mor Pankh',
      1749, -- Signature Plan price from siteConfig
      true
    );
  end if;
end $$;
