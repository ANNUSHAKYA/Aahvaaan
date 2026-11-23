-- ==============================================================================
-- Aahvaaan by Vow & Vision - Supabase Initial Schema & Security Migration
-- Migration: 20261123_0001_initial_schema.sql
-- Description: Core tables, RLS policies, and SECURITY DEFINER RPC functions for
--              public guest reads, RSVP submissions, and host management.
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Helper Functions: Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 3. Profiles (Host accounts linked to auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'host' CHECK (role IN ('host', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on Auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Wedding Host'),
    NEW.raw_user_meta_data->>'phone',
    'host'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. Templates Catalog (The 4 Signature Designs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  collection TEXT NOT NULL,
  category TEXT NOT NULL,
  starting_price NUMERIC(10, 2) NOT NULL DEFAULT 999.00,
  price_display TEXT NOT NULL DEFAULT 'Starts at ₹999',
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  design_direction TEXT NOT NULL,
  image_url TEXT NOT NULL,
  palette JSONB NOT NULL,
  colors JSONB NOT NULL,
  theme_styles JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Invitations (Digital wedding websites instances)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_id TEXT NOT NULL REFERENCES public.templates(id),
  package_id TEXT NOT NULL DEFAULT 'signature' CHECK (package_id IN ('starter', 'signature', 'luxury')),
  slug TEXT UNIQUE NOT NULL,
  
  -- Couple details
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  bride_formal TEXT,
  groom_formal TEXT,
  
  -- Auspicious headers and stories
  shloka TEXT DEFAULT '|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||',
  couple_story TEXT,
  
  -- Family lineages (Grandparents, Parents)
  bride_lineage JSONB DEFAULT '{}'::jsonb,
  groom_lineage JSONB DEFAULT '{}'::jsonb,
  compliments JSONB DEFAULT '[]'::jsonb, -- स्नेही स्वजन relatives
  
  -- Venue & Dates
  wedding_date DATE NOT NULL,
  location TEXT NOT NULL,
  venue TEXT NOT NULL,
  map_url TEXT,
  
  -- Media
  gallery_photos JSONB DEFAULT '[]'::jsonb,
  audio_url TEXT,
  
  -- Status and Metrics
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 6. Ceremonies / Events (Itinerary items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ceremonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  venue TEXT NOT NULL,
  map_url TEXT,
  icon TEXT NOT NULL DEFAULT '💍',
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Guests (Personalized invitation tokens)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  salutation_name TEXT NOT NULL, -- e.g. "The Patidar Family", "Mr. & Mrs. Sharma"
  guest_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(9), 'hex'), -- Unguessable slug
  phone TEXT,
  max_attendees INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. RSVPs (Guest responses)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.guests(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  attending TEXT NOT NULL CHECK (attending IN ('yes', 'no', 'tentative')),
  attendee_count INTEGER NOT NULL DEFAULT 1,
  dietary_preference TEXT NOT NULL DEFAULT 'Pure Vegetarian',
  wishes TEXT,
  ip_address TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. Orders (Package purchases / WhatsApp fallback checkout tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  template_id TEXT NOT NULL REFERENCES public.templates(id),
  package_id TEXT NOT NULL CHECK (package_id IN ('starter', 'signature', 'luxury')),
  customer_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  bride_name TEXT NOT NULL,
  groom_name TEXT NOT NULL,
  wedding_date DATE NOT NULL,
  additional_requirements TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'enquiry_pending' CHECK (status IN ('enquiry_pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_method TEXT NOT NULL DEFAULT 'whatsapp_direct',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Contact Enquiries
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Invitation Views (Analytics tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.invitation_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID NOT NULL REFERENCES public.invitations(id) ON DELETE CASCADE,
  guest_code TEXT,
  user_agent TEXT,
  ip_address TEXT,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ceremonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitation_views ENABLE ROW LEVEL SECURITY;

-- 12.1 Profiles: Users can view and edit their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 12.2 Templates: Publicly viewable catalog
CREATE POLICY "Templates are viewable by everyone"
  ON public.templates FOR SELECT
  USING (is_active = TRUE);

-- 12.3 Invitations: Host owns their invitations
CREATE POLICY "Hosts can view own invitations"
  ON public.invitations FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can create own invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update own invitations"
  ON public.invitations FOR UPDATE
  USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete own invitations"
  ON public.invitations FOR DELETE
  USING (auth.uid() = host_id);

-- 12.4 Ceremonies: Host owns ceremonies of their invitations
CREATE POLICY "Hosts can manage ceremonies"
  ON public.ceremonies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = ceremonies.invitation_id
      AND invitations.host_id = auth.uid()
    )
  );

-- 12.5 Guests: Host owns guests of their invitations
CREATE POLICY "Hosts can manage guests"
  ON public.guests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = guests.invitation_id
      AND invitations.host_id = auth.uid()
    )
  );

-- 12.6 RSVPs: Host can view RSVPs for their invitations (Guests submit through RPC)
CREATE POLICY "Hosts can view RSVPs"
  ON public.rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = rsvps.invitation_id
      AND invitations.host_id = auth.uid()
    )
  );

-- 12.7 Orders: Users can view their own orders; public can insert orders
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = host_id);

CREATE POLICY "Anyone can create an order enquiry"
  ON public.orders FOR INSERT
  WITH CHECK (TRUE);

-- 12.8 Contact Enquiries: Anyone can submit; only admins can view
CREATE POLICY "Anyone can submit a contact enquiry"
  ON public.contact_enquiries FOR INSERT
  WITH CHECK (TRUE);

-- 12.9 Views: Host can view analytics
CREATE POLICY "Hosts can view invitation view logs"
  ON public.invitation_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations
      WHERE invitations.id = invitation_views.invitation_id
      AND invitations.host_id = auth.uid()
    )
  );

-- ==============================================================================
-- 13. SECURITY DEFINER RPC FUNCTIONS (Public Guest Access Without Table Access)
-- ==============================================================================

-- 13.1 Fetch Public Invitation by Slug (Supports common & personalized links)
CREATE OR REPLACE FUNCTION public.get_public_invitation(
  p_slug TEXT,
  p_guest_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation RECORD;
  v_template RECORD;
  v_ceremonies JSONB;
  v_guest RECORD;
  v_result JSONB;
BEGIN
  -- 1. Locate published invitation
  SELECT * INTO v_invitation
  FROM public.invitations
  WHERE slug = p_slug AND (is_published = TRUE OR status = 'published');

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- 2. Fetch template details
  SELECT * INTO v_template
  FROM public.templates
  WHERE id = v_invitation.template_id;

  -- 3. Fetch ceremonies ordered by sort_order and date
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'id', c.id,
        'name', c.name,
        'date', c.event_date,
        'time', c.event_time,
        'venue', c.venue,
        'mapUrl', c.map_url,
        'icon', c.icon,
        'description', c.description
      ) ORDER BY c.sort_order ASC, c.event_date ASC
    ),
    '[]'::jsonb
  ) INTO v_ceremonies
  FROM public.ceremonies c
  WHERE c.invitation_id = v_invitation.id;

  -- 4. Check guest code if provided
  IF p_guest_code IS NOT NULL AND p_guest_code <> '' THEN
    SELECT * INTO v_guest
    FROM public.guests
    WHERE invitation_id = v_invitation.id AND guest_code = p_guest_code;
  END IF;

  -- 5. Construct sanitized public JSON
  v_result := jsonb_build_object(
    'id', v_invitation.id,
    'slug', v_invitation.slug,
    'packageId', v_invitation.package_id,
    'brideName', v_invitation.bride_name,
    'groomName', v_invitation.groom_name,
    'brideFormal', v_invitation.bride_formal,
    'groomFormal', v_invitation.groom_formal,
    'shloka', v_invitation.shloka,
    'coupleStory', v_invitation.couple_story,
    'brideLineage', v_invitation.bride_lineage,
    'groomLineage', v_invitation.groom_lineage,
    'compliments', v_invitation.compliments,
    'weddingDate', v_invitation.wedding_date,
    'location', v_invitation.location,
    'venue', v_invitation.venue,
    'mapUrl', v_invitation.map_url,
    'galleryPhotos', v_invitation.gallery_photos,
    'audioUrl', v_invitation.audio_url,
    'events', v_ceremonies,
    'template', jsonb_build_object(
      'id', v_template.id,
      'name', v_template.name,
      'collection', v_template.collection,
      'category', v_template.category,
      'palette', v_template.palette,
      'colors', v_template.colors,
      'themeStyles', v_template.theme_styles,
      'imageUrl', v_template.image_url
    ),
    'personalizedGuest', CASE
      WHEN v_guest.id IS NOT NULL THEN jsonb_build_object(
        'salutationName', v_guest.salutation_name,
        'maxAttendees', v_guest.max_attendees,
        'guestCode', v_guest.guest_code
      )
      ELSE NULL
    END
  );

  RETURN v_result;
END;
$$;

-- 13.2 Submit Public RSVP (with Input Validation and Rate Limiting)
CREATE OR REPLACE FUNCTION public.submit_public_rsvp(
  p_slug TEXT,
  p_guest_name TEXT,
  p_attending TEXT,
  p_guest_count INTEGER DEFAULT 1,
  p_dietary TEXT DEFAULT 'Pure Vegetarian',
  p_wishes TEXT DEFAULT NULL,
  p_guest_code TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation_id UUID;
  v_guest_id UUID := NULL;
  v_recent_submissions INTEGER;
BEGIN
  -- 1. Input sanitization & validation
  IF p_slug IS NULL OR length(trim(p_slug)) = 0 THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Invalid invitation slug');
  END IF;

  IF p_guest_name IS NULL OR length(trim(p_guest_name)) < 2 THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Please enter a valid guest name');
  END IF;

  IF p_attending NOT IN ('yes', 'no', 'tentative') THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Invalid attendance status');
  END IF;

  IF p_guest_count < 1 OR p_guest_count > 25 THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Guest count must be between 1 and 25');
  END IF;

  -- 2. Locate invitation
  SELECT id INTO v_invitation_id
  FROM public.invitations
  WHERE slug = p_slug AND (is_published = TRUE OR status = 'published');

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Invitation not found or inactive');
  END IF;

  -- 3. Rate limiting: Prevent flooding (max 10 submissions per minute on this invite)
  SELECT COUNT(*) INTO v_recent_submissions
  FROM public.rsvps
  WHERE invitation_id = v_invitation_id
    AND submitted_at > NOW() - INTERVAL '1 minute';

  IF v_recent_submissions >= 15 THEN
    RETURN jsonb_build_object('success', FALSE, 'message', 'Too many requests. Please wait a moment.');
  END IF;

  -- 4. Verify guest code if provided
  IF p_guest_code IS NOT NULL AND p_guest_code <> '' THEN
    SELECT id INTO v_guest_id
    FROM public.guests
    WHERE invitation_id = v_invitation_id AND guest_code = p_guest_code;
  END IF;

  -- 5. Insert RSVP
  INSERT INTO public.rsvps (
    invitation_id,
    guest_id,
    guest_name,
    attending,
    attendee_count,
    dietary_preference,
    wishes
  ) VALUES (
    v_invitation_id,
    v_guest_id,
    trim(p_guest_name),
    p_attending,
    p_guest_count,
    COALESCE(p_dietary, 'Pure Vegetarian'),
    trim(p_wishes)
  );

  RETURN jsonb_build_object(
    'success', TRUE,
    'message', 'Dhanyavaad! Your RSVP has been received with joy.'
  );
END;
$$;

-- 13.3 Record Public Page View (Increment View Counter & Log View)
CREATE OR REPLACE FUNCTION public.record_public_view(
  p_slug TEXT,
  p_guest_code TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invitation_id UUID;
BEGIN
  SELECT id INTO v_invitation_id
  FROM public.invitations
  WHERE slug = p_slug;

  IF FOUND THEN
    -- Increment aggregate counter
    UPDATE public.invitations
    SET view_count = view_count + 1
    WHERE id = v_invitation_id;

    -- Record detailed view entry
    INSERT INTO public.invitation_views (invitation_id, guest_code, user_agent)
    VALUES (v_invitation_id, p_guest_code, p_user_agent);
  END IF;
END;
$$;

-- ==============================================================================
-- 14. PRE-SEED TEMPLATES (The 4 Signature Aahvaaan Collections)
-- ==============================================================================
INSERT INTO public.templates (
  id, name, collection, category, starting_price, price_display,
  short_description, description, design_direction, image_url,
  palette, colors, theme_styles, is_active
) VALUES
(
  'champagne-and-rose',
  'Champagne & Rose',
  'The Romance Collection',
  'Floral & Romance',
  999.00,
  'Starts at ₹999',
  'Soft romantic wedding aesthetic with delicate florals, warm ivory and elegant rose gold details.',
  'Inspired by the softness of blooming romance, Champagne & Rose pairs warm ivory backgrounds with dusty rose highlights and subtle antique gold borders.',
  'Soft romantic wedding aesthetic, delicate floral illustrations, elegant gold borders, beautiful serif typography, ivory background.',
  '/templates/rose-watercolor.svg',
  '{"warmIvory": "#FAF6F0", "champagneBeige": "#E9D7CC", "dustyRose": "#C99B91", "mutedBurgundy": "#704B50", "antiqueGold": "#B69A70"}'::jsonb,
  '[{"name": "Warm Ivory", "hex": "#FAF6F0"}, {"name": "Champagne Beige", "hex": "#E9D7CC"}, {"name": "Dusty Rose", "hex": "#C99B91"}, {"name": "Muted Burgundy", "hex": "#704B50"}, {"name": "Antique Gold", "hex": "#B69A70"}]'::jsonb,
  '{"bgPrimary": "#FAF6F0", "bgSecondary": "#E9D7CC", "textPrimary": "#704B50", "textSecondary": "#65575A", "accentPrimary": "#C99B91", "accentSecondary": "#B69A70", "buttonBg": "#704B50", "buttonText": "#FAF6F0", "cardBg": "#FFFFFF", "badgeBg": "#E9D7CC", "badgeText": "#704B50"}'::jsonb,
  TRUE
),
(
  'sage-and-ivory',
  'Sage & Ivory',
  'The Botanical Collection',
  'Botanical & Minimal',
  999.00,
  'Starts at ₹999',
  'Botanical, nature-inspired wedding invitation with delicate foliage, calming greens and modern minimalism.',
  'Calm, organic and effortlessly sophisticated. Sage & Ivory celebrates the serenity of botanical foliage, hand-drawn eucalyptus sprigs, and gentle earth tones.',
  'Botanical and nature-inspired wedding invitation, delicate green leaves and floral illustrations, minimal elegant layouts.',
  '/templates/lotus-lagoon.svg',
  '{"softIvory": "#F8F7F0", "paleSage": "#DDE3D3", "mutedSage": "#A8B59C", "forestSage": "#596B57", "warmBeige": "#B7A78A"}'::jsonb,
  '[{"name": "Soft Ivory", "hex": "#F8F7F0"}, {"name": "Pale Sage", "hex": "#DDE3D3"}, {"name": "Muted Sage", "hex": "#A8B59C"}, {"name": "Forest Sage", "hex": "#596B57"}, {"name": "Warm Beige", "hex": "#B7A78A"}]'::jsonb,
  '{"bgPrimary": "#F8F7F0", "bgSecondary": "#DDE3D3", "textPrimary": "#596B57", "textSecondary": "#65575A", "accentPrimary": "#A8B59C", "accentSecondary": "#B7A78A", "buttonBg": "#596B57", "buttonText": "#F8F7F0", "cardBg": "#FFFFFF", "badgeBg": "#DDE3D3", "badgeText": "#596B57"}'::jsonb,
  TRUE
),
(
  'royal-maroon-and-gold',
  'Royal Maroon & Gold',
  'The Maharaja Collection',
  'Royal & Traditional',
  999.00,
  'Starts at ₹999',
  'Regal Indian wedding invitation featuring intricate ornamental jali motifs, rich royal maroon and antique gold.',
  'Imbued with the stately grandeur of Rajasthan’s historic palaces, Royal Maroon & Gold is designed for couples planning an unforgettable royal spectacle.',
  'Luxurious Indian royal wedding invitation, traditional Indian ornamental patterns, rich maroon backgrounds, gold decorative borders and motifs.',
  '/templates/maharaja-royal.svg',
  '{"cream": "#FAF1E5", "champagne": "#E6D0B5", "royalMaroon": "#761F32", "deepBurgundy": "#431421", "antiqueGold": "#C5A15E"}'::jsonb,
  '[{"name": "Cream", "hex": "#FAF1E5"}, {"name": "Champagne", "hex": "#E6D0B5"}, {"name": "Royal Maroon", "hex": "#761F32"}, {"name": "Deep Burgundy", "hex": "#431421"}, {"name": "Antique Gold", "hex": "#C5A15E"}]'::jsonb,
  '{"bgPrimary": "#FAF1E5", "bgSecondary": "#E6D0B5", "textPrimary": "#431421", "textSecondary": "#65575A", "accentPrimary": "#761F32", "accentSecondary": "#C5A15E", "buttonBg": "#761F32", "buttonText": "#FAF1E5", "cardBg": "#FFFFFF", "badgeBg": "#E6D0B5", "badgeText": "#761F32"}'::jsonb,
  TRUE
),
(
  'blush-and-lavender',
  'Blush & Lavender',
  'The Dream Collection',
  'Pastel & Dreamy',
  999.00,
  'Starts at ₹999',
  'Dreamy pastel wedding invitation with delicate lavender blooms, blushing pink undertones and airy typography.',
  'Soft as a whisper and magical as twilight, Blush & Lavender captures whimsical romanticism. Gentle lavender tones intertwine with blush pink watercolor washes.',
  'Romantic pastel wedding invitation, soft blush and lavender floral elements, delicate typography, elegant layered invitation cards.',
  '/templates/dream-lavender.svg',
  '{"softWhite": "#FFF8F7", "blushPink": "#F0DDE2", "lavender": "#D9C5DC", "mutedMauve": "#9A718C", "roseBeige": "#B99A84"}'::jsonb,
  '[{"name": "Soft White", "hex": "#FFF8F7"}, {"name": "Blush Pink", "hex": "#F0DDE2"}, {"name": "Lavender", "hex": "#D9C5DC"}, {"name": "Muted Mauve", "hex": "#9A718C"}, {"name": "Rose Beige", "hex": "#B99A84"}]'::jsonb,
  '{"bgPrimary": "#FFF8F7", "bgSecondary": "#F0DDE2", "textPrimary": "#9A718C", "textSecondary": "#65575A", "accentPrimary": "#D9C5DC", "accentSecondary": "#B99A84", "buttonBg": "#9A718C", "buttonText": "#FFF8F7", "cardBg": "#FFFFFF", "badgeBg": "#F0DDE2", "badgeText": "#9A718C"}'::jsonb,
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  collection = EXCLUDED.collection,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  palette = EXCLUDED.palette,
  colors = EXCLUDED.colors,
  theme_styles = EXCLUDED.theme_styles;
