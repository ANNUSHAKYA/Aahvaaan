-- Seed file for Aahvaaan Supabase database
-- Inserts Mor Pankh template with Signature price from siteConfig (₹1,749)

do $$
begin
  if exists (select 1 from public.templates where slug = 'mor-pankh' or id::text = 'mor-pankh') then
    update public.templates
    set
      slug = 'mor-pankh',
      name = 'Mor Pankh',
      price_inr = 1749,
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
