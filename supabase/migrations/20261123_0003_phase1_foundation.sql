-- ==============================================================================
-- Aahvaaan - Phase 1 Foundation Schema & Seed Migration
-- Migration: 20261123_0003_phase1_foundation.sql
-- Description: Sets up the exact user-specified tables, columns, indexes, RLS,
--              triggers, and pre-seeds the 4 templates with full content_schema.
-- ==============================================================================

-- 1. PROFILES Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Wedding Host',
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'host' CHECK (role IN ('host', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure name column exists if created previously as full_name
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'name') THEN
    ALTER TABLE public.profiles ADD COLUMN name TEXT NOT NULL DEFAULT 'Wedding Host';
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'full_name') THEN
    UPDATE public.profiles SET name = full_name WHERE name IS NULL OR name = 'Wedding Host';
  END IF;
END $$;

-- 2. TEMPLATES Table
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price_inr NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
  preview_image TEXT,
  tags TEXT[] DEFAULT '{}',
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  content_schema JSONB NOT NULL DEFAULT '{}'::jsonb,
  default_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure templates has all Phase 1 columns if table already existed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'slug') THEN
    ALTER TABLE public.templates ADD COLUMN slug TEXT UNIQUE;
    UPDATE public.templates SET slug = id::text WHERE slug IS NULL;
    ALTER TABLE public.templates ALTER COLUMN slug SET NOT NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'price_inr') THEN
    ALTER TABLE public.templates ADD COLUMN price_inr NUMERIC(10, 2) NOT NULL DEFAULT 999.00;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'preview_image') THEN
    ALTER TABLE public.templates ADD COLUMN preview_image TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'tags') THEN
    ALTER TABLE public.templates ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'is_new') THEN
    ALTER TABLE public.templates ADD COLUMN is_new BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'content_schema') THEN
    ALTER TABLE public.templates ADD COLUMN content_schema JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'templates' AND column_name = 'default_content') THEN
    ALTER TABLE public.templates ADD COLUMN default_content JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- 3. INVITATIONS Table
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL, -- references template slug or id
  slug TEXT UNIQUE NOT NULL,
  common_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(4), 'hex'),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published_content JSONB,
  published_at TIMESTAMPTZ,
  edit_expires_at TIMESTAMPTZ,
  updates_used INTEGER NOT NULL DEFAULT 0,
  personalized_limit INTEGER NOT NULL DEFAULT 5,
  package TEXT NOT NULL DEFAULT 'signature' CHECK (package IN ('starter', 'signature', 'luxury')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all Phase 1 columns exist on invitations
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    ALTER TABLE public.invitations ADD COLUMN owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'common_code') THEN
    ALTER TABLE public.invitations ADD COLUMN common_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'draft_content') THEN
    ALTER TABLE public.invitations ADD COLUMN draft_content JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_content') THEN
    ALTER TABLE public.invitations ADD COLUMN published_content JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_at') THEN
    ALTER TABLE public.invitations ADD COLUMN published_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'edit_expires_at') THEN
    ALTER TABLE public.invitations ADD COLUMN edit_expires_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'updates_used') THEN
    ALTER TABLE public.invitations ADD COLUMN updates_used INTEGER NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'personalized_limit') THEN
    ALTER TABLE public.invitations ADD COLUMN personalized_limit INTEGER NOT NULL DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'package') THEN
    ALTER TABLE public.invitations ADD COLUMN package TEXT NOT NULL DEFAULT 'signature';
  END IF;
END $$;

-- 4. GUESTS Table
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  personal_slug TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(9), 'hex'),
  delivery_status TEXT NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  first_viewed_at TIMESTAMPTZ,
  last_viewed_at TIMESTAMPTZ,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure personal_slug and delivery columns exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'personal_slug') THEN
    ALTER TABLE public.guests ADD COLUMN personal_slug TEXT UNIQUE DEFAULT encode(gen_random_bytes(9), 'hex');
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'guest_code') THEN
      UPDATE public.guests SET personal_slug = guest_code WHERE personal_slug IS NULL;
    END IF;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'delivery_status') THEN
    ALTER TABLE public.guests ADD COLUMN delivery_status TEXT NOT NULL DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'first_viewed_at') THEN
    ALTER TABLE public.guests ADD COLUMN first_viewed_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'last_viewed_at') THEN
    ALTER TABLE public.guests ADD COLUMN last_viewed_at TIMESTAMPTZ;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'view_count') THEN
    ALTER TABLE public.guests ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
  END IF;
END $$;

-- 5. RSVPS Table (with UNIQUE (invitation_id, phone))
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '9999999999',
  status TEXT NOT NULL DEFAULT 'attending' CHECK (status IN ('attending', 'not_attending', 'maybe')),
  guest_count INTEGER NOT NULL DEFAULT 1,
  dietary TEXT DEFAULT 'Pure Vegetarian',
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure phone & message columns and UNIQUE(invitation_id, phone) exist on rsvps
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'phone') THEN
    ALTER TABLE public.rsvps ADD COLUMN phone TEXT NOT NULL DEFAULT '9999999999';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'status') THEN
    ALTER TABLE public.rsvps ADD COLUMN status TEXT NOT NULL DEFAULT 'attending';
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'attending') THEN
      UPDATE public.rsvps SET status = CASE WHEN attending = 'yes' THEN 'attending' WHEN attending = 'no' THEN 'not_attending' ELSE 'maybe' END;
    END IF;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'message') THEN
    ALTER TABLE public.rsvps ADD COLUMN message TEXT;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'rsvps' AND column_name = 'wishes') THEN
      UPDATE public.rsvps SET message = wishes;
    END IF;
  END IF;

  -- Add unique constraint if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'rsvps_invitation_id_phone_key'
  ) THEN
    ALTER TABLE public.rsvps ADD CONSTRAINT rsvps_invitation_id_phone_key UNIQUE (invitation_id, phone);
  END IF;
END $$;

-- 6. VIEWS Table
CREATE TABLE IF NOT EXISTS public.views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  device_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  invitation_id UUID REFERENCES public.invitations(id) ON DELETE SET NULL,
  amount_inr NUMERIC(10, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('package', 'extra_guests')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_invitations_owner_id ON public.invitations(owner_id);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON public.invitations(slug);
CREATE INDEX IF NOT EXISTS idx_invitations_common_code ON public.invitations(common_code);
CREATE INDEX IF NOT EXISTS idx_guests_invitation_id ON public.guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_guests_personal_slug ON public.guests(personal_slug);
CREATE INDEX IF NOT EXISTS idx_rsvps_invitation_id ON public.rsvps(invitation_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_phone ON public.rsvps(phone);
CREATE INDEX IF NOT EXISTS idx_views_invitation_id ON public.views(invitation_id);
CREATE INDEX IF NOT EXISTS idx_views_guest_id ON public.views(guest_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_invitation_id ON public.orders(invitation_id);

-- ------------------------------------------------------------------------------
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Templates: public can read active
DROP POLICY IF EXISTS "templates_select_active" ON public.templates;
CREATE POLICY "templates_select_active" ON public.templates FOR SELECT USING (is_active = TRUE);

-- Invitations: Host owns their invitations
DROP POLICY IF EXISTS "invitations_owner_all" ON public.invitations;
CREATE POLICY "invitations_owner_all" ON public.invitations FOR ALL USING (auth.uid() = owner_id);

-- Guests: Host owns guests for their invitations
DROP POLICY IF EXISTS "guests_owner_all" ON public.guests;
CREATE POLICY "guests_owner_all" ON public.guests FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = guests.invitation_id
    AND invitations.owner_id = auth.uid()
  )
);

-- RSVPs: Host can view RSVPs for their invitations
DROP POLICY IF EXISTS "rsvps_owner_select" ON public.rsvps;
CREATE POLICY "rsvps_owner_select" ON public.rsvps FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = rsvps.invitation_id
    AND invitations.owner_id = auth.uid()
  )
);

-- Views: Host can view analytics for their invitations
DROP POLICY IF EXISTS "views_owner_select" ON public.views;
CREATE POLICY "views_owner_select" ON public.views FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = views.invitation_id
    AND invitations.owner_id = auth.uid()
  )
);

-- Orders: Host can view their orders
DROP POLICY IF EXISTS "orders_user_select" ON public.orders;
CREATE POLICY "orders_user_select" ON public.orders FOR SELECT USING (auth.uid() = user_id);

-- Auto-profile trigger on signup
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'host'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_sync ON auth.users;
CREATE TRIGGER on_auth_user_created_sync
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- ------------------------------------------------------------------------------
-- 10. SEED THE 4 SIGNATURE TEMPLATES (with content_schema & default_content)
-- ------------------------------------------------------------------------------
INSERT INTO public.templates (
  slug, name, description, price_inr, preview_image, tags, is_new, is_active, content_schema, default_content
) VALUES
(
  'champagne-and-rose',
  'Champagne & Rose – The Romance Collection',
  'Soft romantic wedding aesthetic with delicate florals, warm ivory and elegant rose gold details.',
  999.00,
  '/templates/rose-watercolor.svg',
  ARRAY['romantic', 'floral', 'watercolor', 'rose gold'],
  FALSE,
  TRUE,
  '{
    "palette": { "primary": "#FAF6F0", "secondary": "#E9D7CC", "accent": "#C99B91", "text": "#704B50", "gold": "#B69A70" },
    "fields": ["couple", "lineage", "events", "story", "gallery", "audio"]
  }'::jsonb,
  '{
    "brideName": "Ananya Sharma",
    "groomName": "Kabir Singhania",
    "brideFormal": "Kum. Ananya Sharma",
    "groomFormal": "Chi. Kabir Singhania",
    "shloka": "|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||",
    "weddingDate": "2027-02-22",
    "location": "Udaipur, Rajasthan",
    "venue": "The Oberoi Udaivilas, Lake Pichola",
    "mapUrl": "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
    "coupleStory": "Ananya and Kabir first crossed paths on a breezy winter evening by the serene lakes of Udaipur. From exchanging shared dreams over steaming cups of spiced chai to travelling across the globe together, their bond grew effortless and deep. After five years of unforgettable laughter and quiet companionship, they invite you to celebrate the beginning of their forever.",
    "events": [
      { "name": "Mehendi & High Tea", "date": "2027-02-20", "time": "2:00 PM – 6:00 PM", "venue": "The Lakeside Courtyard, Udaivilas", "icon": "🌿", "description": "A delicate afternoon of henna, folk melodies, pastel florals and sweet conversations by the lake." },
      { "name": "Sangeet Under The Stars", "date": "2027-02-21", "time": "7:30 PM onwards", "venue": "The Grand Promenade, Udaivilas", "icon": "🎶", "description": "An enchanting night of performances, live sufi music, cocktails, and endless dancing beneath the starlit sky." },
      { "name": "Haldi & Phoolon Ki Holi", "date": "2027-02-22", "time": "10:00 AM – 1:00 PM", "venue": "The Lotus Pond Lawns", "icon": "✨", "description": "A vibrant morning of organic turmeric paste, marigold petals, dhol beats, and blessings from family elders." },
      { "name": "The Sacred Vivaah (Pheras)", "date": "2027-02-22", "time": "5:30 PM Sunset Mandap", "venue": "The Crescent Waterfront Mandap", "icon": "💍", "description": "Vedic rituals by the holy fire, followed by royal dinner and starry reception celebrations." }
    ],
    "lineage": {
      "groomParents": "Shri Vikram Singhania & Smt. Gayatri Singhania",
      "groomGrandparents": "Late Shri Devendra Singhania & Late Smt. Kamala Devi Singhania",
      "brideParents": "Shri Rajesh Sharma & Smt. Sunita Sharma",
      "brideGrandparents": "Late Shri Pandit Brij Mohan Sharma & Late Smt. Shanti Devi Sharma"
    },
    "audio": { "enabled": true }
  }'::jsonb
),
(
  'sage-and-ivory',
  'Sage & Ivory – The Botanical Collection',
  'Botanical, nature-inspired wedding invitation with delicate foliage, calming greens and modern minimalism.',
  999.00,
  '/templates/lotus-lagoon.svg',
  ARRAY['botanical', 'minimal', 'sage green', 'contemporary'],
  FALSE,
  TRUE,
  '{
    "palette": { "primary": "#F8F7F0", "secondary": "#DDE3D3", "accent": "#A8B59C", "text": "#596B57", "gold": "#B7A78A" },
    "fields": ["couple", "lineage", "events", "story", "gallery", "audio"]
  }'::jsonb,
  '{
    "brideName": "Meera Sharma",
    "groomName": "Aarav Malhotra",
    "brideFormal": "Kum. Meera Sharma",
    "groomFormal": "Chi. Aarav Malhotra",
    "shloka": "|| ॐ श्री गणेशाय नमः ||",
    "weddingDate": "2027-02-22",
    "location": "Jaipur, Rajasthan",
    "venue": "Fairmont Jaipur, RIICO Kukas",
    "mapUrl": "https://maps.google.com/?q=Fairmont+Jaipur",
    "coupleStory": "Two souls brought together by shared passions for architecture, quiet morning coffee rituals, and travel across ancient landscapes.",
    "events": [
      { "name": "Mehendi by the Garden", "date": "2027-02-20", "time": "3:00 PM", "venue": "The Aravalli Lawns", "icon": "🌿", "description": "Gentle acoustic melodies, fresh floral aroma, and afternoon henna." },
      { "name": "Sangeet Night", "date": "2027-02-21", "time": "7:00 PM", "venue": "The Grand Ballroom", "icon": "🎶", "description": "An evening of dance, laughter and celebrations." },
      { "name": "Sacred Pheras", "date": "2027-02-22", "time": "5:00 PM", "venue": "Fairmont Central Courtyard", "icon": "💍", "description": "The sacred wedding vows at sunset." }
    ],
    "lineage": {
      "groomParents": "Shri Sunil Malhotra & Smt. Anita Malhotra",
      "groomGrandparents": "Late Shri Om Prakash Malhotra & Late Smt. Kanta Malhotra",
      "brideParents": "Shri Deepak Sharma & Smt. Geeta Sharma",
      "brideGrandparents": "Late Shri Madan Lal Sharma & Late Smt. Urmila Sharma"
    },
    "audio": { "enabled": true }
  }'::jsonb
),
(
  'royal-maroon-and-gold',
  'Royal Maroon & Gold – The Maharaja Collection',
  'Regal Indian wedding invitation featuring intricate ornamental jali motifs, rich royal maroon and antique gold.',
  999.00,
  '/templates/maharaja-royal.svg',
  ARRAY['royal', 'traditional', 'maroon', 'palace', 'antique gold'],
  FALSE,
  TRUE,
  '{
    "palette": { "primary": "#FAF1E5", "secondary": "#E6D0B5", "accent": "#761F32", "text": "#431421", "gold": "#C5A15E" },
    "fields": ["couple", "lineage", "events", "story", "gallery", "audio"]
  }'::jsonb,
  '{
    "brideName": "Gayatri Rathore",
    "groomName": "Vikramaditya Shekhawat",
    "brideFormal": "Rajkumari Gayatri Rathore",
    "groomFormal": "Yuvraj Vikramaditya Shekhawat",
    "shloka": "|| मंगलम् भगवान विष्णुः मंगलम् गरुडध्वजः । मंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः ||",
    "weddingDate": "2027-03-05",
    "location": "Jodhpur, Rajasthan",
    "venue": "Umaid Bhawan Palace, Jodhpur",
    "mapUrl": "https://maps.google.com/?q=Umaid+Bhawan+Palace+Jodhpur",
    "coupleStory": "A majestic union rooted in generations of royal heritage and shared reverence for timeless traditions.",
    "events": [
      { "name": "Shahi Ghoomar & Mehendi", "date": "2027-03-03", "time": "4:00 PM", "venue": "The Baradari Pavilion", "icon": "🌿", "description": "Traditional Rajasthani folk dances and henna." },
      { "name": "Royal Sangeet Gala", "date": "2027-03-04", "time": "7:30 PM", "venue": "The Palace Terraces", "icon": "🎶", "description": "Spectacular royal performances and dinner." },
      { "name": "The Royal Vivaha Sanskar", "date": "2027-03-05", "time": "6:00 PM", "venue": "The Royal Mandap, Umaid Bhawan", "icon": "💍", "description": "Traditional Vedic nuptials under the palace stars." }
    ],
    "lineage": {
      "groomParents": "Maharaj Shri Gajendra Singh & Smt. Padmavati Devi",
      "groomGrandparents": "Late Maharaj Shri Manvendra Singh & Smt. Rajeshwari Devi",
      "brideParents": "Thakur Shri Brijendra Rathore & Smt. Chandra Prabha",
      "brideGrandparents": "Late Thakur Shri Bhupendra Rathore & Smt. Roop Kanwar"
    },
    "audio": { "enabled": true }
  }'::jsonb
),
(
  'blush-and-lavender',
  'Blush & Lavender – The Dream Collection',
  'Dreamy pastel wedding invitation with delicate lavender blooms, blushing pink undertones and airy typography.',
  999.00,
  '/templates/dream-lavender.svg',
  ARRAY['pastel', 'dreamy', 'lavender', 'modern romance'],
  TRUE,
  TRUE,
  '{
    "palette": { "primary": "#FFF8F7", "secondary": "#F0DDE2", "accent": "#D9C5DC", "text": "#9A718C", "gold": "#B99A84" },
    "fields": ["couple", "lineage", "events", "story", "gallery", "audio"]
  }'::jsonb,
  '{
    "brideName": "Tara Kapoor",
    "groomName": "Rohan Mehra",
    "brideFormal": "Kum. Tara Kapoor",
    "groomFormal": "Chi. Rohan Mehra",
    "shloka": "|| ॐ श्री गणेशाय नमः ||",
    "weddingDate": "2027-04-18",
    "location": "Shimla & Delhi NCR",
    "venue": "Wildflower Hall, An Oberoi Resort, Shimla",
    "mapUrl": "https://maps.google.com/?q=Wildflower+Hall+Shimla",
    "coupleStory": "Met at an art gallery opening in New Delhi, bonded over vintage vinyl records and mountain treks, now ready for their greatest adventure.",
    "events": [
      { "name": "Pine Grove Mehendi", "date": "2027-04-16", "time": "1:00 PM", "venue": "The Cedar Glade Lawns", "icon": "🌿", "description": "Sunlit alpine afternoon with acoustic violin and pastel flowers." },
      { "name": "Twilight Sangeet", "date": "2027-04-17", "time": "6:30 PM", "venue": "The Himalayan Ballroom", "icon": "🎶", "description": "Cocktails, laughter, and endless celebration." },
      { "name": "Wedding Vows", "date": "2027-04-18", "time": "4:30 PM", "venue": "The Valley View Amphitheatre", "icon": "💍", "description": "Sunset vows overlooking the snow-capped peaks." }
    ],
    "lineage": {
      "groomParents": "Shri Rajiv Mehra & Smt. Shalini Mehra",
      "groomGrandparents": "Late Shri Dharam Pal Mehra & Late Smt. Kamla Mehra",
      "brideParents": "Shri Anil Kapoor & Smt. Neelam Kapoor",
      "brideGrandparents": "Late Shri Satish Kapoor & Late Smt. Mohini Kapoor"
    },
    "audio": { "enabled": true }
  }'::jsonb
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_inr = EXCLUDED.price_inr,
  preview_image = EXCLUDED.preview_image,
  tags = EXCLUDED.tags,
  is_new = EXCLUDED.is_new,
  is_active = EXCLUDED.is_active,
  content_schema = EXCLUDED.content_schema,
  default_content = EXCLUDED.default_content;
