-- ==============================================================================
-- Aahvaaan - Seed Sample Published Invitation
-- Migration: 20261123_0002_sample_invitation.sql
-- Description: Seeds an initial published invitation (slug: ananya-kabir-2027)
--              with ceremonies and personalized guest links for live testing.
-- ==============================================================================

DO $$
DECLARE
  v_invite_id UUID;
BEGIN
  -- Insert or get sample invitation
  INSERT INTO public.invitations (
    template_id,
    package_id,
    slug,
    bride_name,
    groom_name,
    bride_formal,
    groom_formal,
    shloka,
    couple_story,
    bride_lineage,
    groom_lineage,
    compliments,
    wedding_date,
    location,
    venue,
    map_url,
    is_published,
    status
  ) VALUES (
    'champagne-and-rose',
    'signature',
    'ananya-kabir-2027',
    'Ananya Sharma',
    'Kabir Singhania',
    'Kum. Ananya Sharma',
    'Chi. Kabir Singhania',
    '|| वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ||',
    'Ananya and Kabir first crossed paths on a breezy winter evening by the serene lakes of Udaipur. From exchanging shared dreams over steaming cups of spiced chai to travelling across the globe together, their bond grew effortless and deep. After five years of unforgettable laughter and quiet companionship, they invite you to celebrate the beginning of their forever.',
    '{"parents": "Shri Rajesh Sharma & Smt. Sunita Sharma", "grandparents": "Late Shri Pandit Brij Mohan Sharma & Late Smt. Shanti Devi Sharma"}'::jsonb,
    '{"parents": "Shri Vikram Singhania & Smt. Gayatri Singhania", "grandparents": "Late Shri Devendra Singhania & Late Smt. Kamala Devi Singhania"}'::jsonb,
    '[{"relation": "Chacha - Chachi", "names": "Shri Rakesh Singhania & Smt. Poonam Singhania"}, {"relation": "Tauji - Taiji", "names": "Shri Anand Singhania & Smt. Vandana Singhania"}, {"relation": "Bua - Fufaji", "names": "Smt. Preeti & Shri Manoj Agarwal"}]'::jsonb,
    '2027-02-22',
    'Udaipur, Rajasthan',
    'The Oberoi Udaivilas, Haridas Ji Ki Magri, Udaipur, Rajasthan 313001',
    'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    TRUE,
    'published'
  )
  ON CONFLICT (slug) DO UPDATE SET
    is_published = TRUE,
    status = 'published'
  RETURNING id INTO v_invite_id;

  -- Remove existing ceremonies to avoid duplicates on re-run
  DELETE FROM public.ceremonies WHERE invitation_id = v_invite_id;

  -- Insert Ceremonies
  INSERT INTO public.ceremonies (invitation_id, name, event_date, event_time, venue, map_url, icon, description, sort_order)
  VALUES
  (
    v_invite_id,
    'Mehendi & High Tea',
    '2027-02-20',
    '2:00 PM – 6:00 PM',
    'The Lakeside Courtyard, Udaivilas',
    'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    '🌿',
    'A delicate afternoon of henna, folk melodies, pastel florals and sweet conversations by the lake.',
    1
  ),
  (
    v_invite_id,
    'Sangeet Under The Stars',
    '2027-02-21',
    '7:30 PM onwards',
    'The Grand Promenade, Udaivilas',
    'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    '🎶',
    'An enchanting night of performances, live sufi music, cocktails, and endless dancing beneath the starlit sky.',
    2
  ),
  (
    v_invite_id,
    'Haldi & Phoolon Ki Holi',
    '2027-02-22',
    '10:00 AM – 1:00 PM',
    'The Lotus Pond Lawns, Udaivilas',
    'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    '✨',
    'A vibrant morning of organic turmeric paste, marigold petals, dhol beats, and blessings from family elders.',
    3
  ),
  (
    v_invite_id,
    'The Sacred Vivaah (Pheras)',
    '2027-02-22',
    '5:30 PM Sunset Mandap',
    'The Crescent Waterfront Mandap, Udaivilas',
    'https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur',
    '💍',
    'Solemn Vedic wedding rituals by the holy fire, followed by royal dinner and starry reception celebrations.',
    4
  );

  -- Remove existing sample guests to avoid duplicates on re-run
  DELETE FROM public.guests WHERE invitation_id = v_invite_id;

  -- Insert Sample Personalized Guests
  INSERT INTO public.guests (invitation_id, salutation_name, guest_code, max_attendees)
  VALUES
  (
    v_invite_id,
    'The Patidar Family',
    'patidar-vip',
    5
  ),
  (
    v_invite_id,
    'Mr. & Mrs. Rajesh Sharma',
    'sharma-vip',
    2
  );

END $$;
