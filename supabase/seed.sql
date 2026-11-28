-- Seed file for Aahvaaan Supabase database
-- Inserts Mor Pankh template with Signature price from siteConfig (₹1,749)

insert into public.templates (id, slug, name, price_inr, is_active)
values (
  'a0000000-0000-0000-0000-000000000001',
  'mor-pankh',
  'Mor Pankh',
  1749,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  price_inr = excluded.price_inr,
  is_active = excluded.is_active;
