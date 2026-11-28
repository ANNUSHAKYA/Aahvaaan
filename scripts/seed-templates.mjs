/**
 * Template Seeding Script for Aahvaaan (Node ESM)
 * Inserts the Mor Pankh template at the price defined in siteConfig.ts
 *
 * Usage:
 *   node scripts/seed-templates.mjs
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://nvoynqxwkbtzdlgbjvfl.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52b3lucXh3a2J0emRsZ2JqdmZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU0MzAzMzIsImV4cCI6MjExMTAwNjMzMn0.Y0zB8XKG8fC2_Pb1pdTNXi9-sbOxfcjVuZrmbw6T6VM';

async function seed() {
  console.log('Seeding templates into Supabase...');
  console.log(`Target URL: ${supabaseUrl}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Price for Signature Plan from siteConfig: ₹1,749
  const morPankhPrice = 1749;

  const { data, error } = await supabase
    .from('templates')
    .upsert(
      {
        slug: 'mor-pankh',
        name: 'Mor Pankh',
        price_inr: morPankhPrice,
        is_active: true,
      },
      { onConflict: 'slug' }
    )
    .select();

  if (error) {
    console.error('Error seeding Mor Pankh template:', error.message);
    process.exit(1);
  }

  console.log('Successfully seeded Mor Pankh template:', data);
  console.log(`Template: Mor Pankh (slug: mor-pankh, price: ₹${morPankhPrice})`);
}

seed().catch((err) => {
  console.error('Unexpected seeding error:', err);
  process.exit(1);
});
