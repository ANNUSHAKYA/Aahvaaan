-- ==============================================================================
-- PHASE 2 MIGRATION: Storage Bucket for Invitation Media & Editor Policies
-- Supabase Storage bucket: invitation-assets
-- Features:
--   - WebP / JPEG / PNG image uploads (10MB limit)
--   - Public read access for guest invitation display
--   - Host-isolated write/update/delete policies (<owner_id>/* folders)
-- ==============================================================================

-- 1. Create or update storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'invitation-assets',
  'invitation-assets',
  TRUE,
  10485760, -- 10MB limit per file
  ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/webp', 'image/jpeg', 'image/png', 'image/svg+xml'];

-- 2. Storage object policies
-- Public Read: Wedding guests and preview visitors can view images
DROP POLICY IF EXISTS "Public Access for invitation assets" ON storage.objects;
CREATE POLICY "Public Access for invitation assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'invitation-assets');

-- Host Upload: Authenticated hosts can upload only into their own user folder: <owner_id>/...
DROP POLICY IF EXISTS "Hosts can upload own assets" ON storage.objects;
CREATE POLICY "Hosts can upload own assets" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'invitation-assets'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Host Update: Authenticated hosts can update files in their own folder
DROP POLICY IF EXISTS "Hosts can update own assets" ON storage.objects;
CREATE POLICY "Hosts can update own assets" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'invitation-assets'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- Host Delete: Authenticated hosts can delete files in their own folder
DROP POLICY IF EXISTS "Hosts can delete own assets" ON storage.objects;
CREATE POLICY "Hosts can delete own assets" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'invitation-assets'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );
