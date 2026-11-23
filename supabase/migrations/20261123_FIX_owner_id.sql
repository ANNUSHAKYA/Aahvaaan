-- ==============================================================================
-- EMERGENCY FIX: Ensure owner_id column and all Phase 1-3 columns exist on public.invitations
-- Run this in Supabase SQL Editor if you see "column invitations.owner_id does not exist"
-- ==============================================================================

DO $$
BEGIN
  -- 1. If host_id exists and owner_id does not, rename host_id to owner_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'host_id')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    ALTER TABLE public.invitations RENAME COLUMN host_id TO owner_id;
  END IF;

  -- 2. If neither exists, add owner_id
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    ALTER TABLE public.invitations ADD COLUMN owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  -- 3. If both exist, sync values from host_id into owner_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'host_id')
     AND EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'owner_id') THEN
    UPDATE public.invitations SET owner_id = host_id WHERE owner_id IS NULL AND host_id IS NOT NULL;
  END IF;

  -- 4. Ensure common_code exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'common_code') THEN
    ALTER TABLE public.invitations ADD COLUMN common_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(4), 'hex');
  END IF;

  -- 5. Ensure status exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'status') THEN
    ALTER TABLE public.invitations ADD COLUMN status TEXT NOT NULL DEFAULT 'draft';
  END IF;

  -- 6. Ensure draft_content & published_content exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'draft_content') THEN
    ALTER TABLE public.invitations ADD COLUMN draft_content JSONB NOT NULL DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_content') THEN
    ALTER TABLE public.invitations ADD COLUMN published_content JSONB;
  END IF;

  -- 7. Ensure package & personalized_limit exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'package') THEN
    ALTER TABLE public.invitations ADD COLUMN package TEXT NOT NULL DEFAULT 'signature';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'personalized_limit') THEN
    ALTER TABLE public.invitations ADD COLUMN personalized_limit INTEGER NOT NULL DEFAULT 5;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'updates_used') THEN
    ALTER TABLE public.invitations ADD COLUMN updates_used INTEGER NOT NULL DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'published_at') THEN
    ALTER TABLE public.invitations ADD COLUMN published_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'invitations' AND column_name = 'edit_expires_at') THEN
    ALTER TABLE public.invitations ADD COLUMN edit_expires_at TIMESTAMPTZ;
  END IF;
END $$;

-- 8. Apply/Refresh RLS policies on public.invitations
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "invitations_owner_all" ON public.invitations;
DROP POLICY IF EXISTS "invitations_host_all" ON public.invitations;

CREATE POLICY "invitations_owner_all" ON public.invitations
  FOR ALL
  USING (auth.uid() = owner_id);

-- Notify completion
SELECT 'Successfully updated public.invitations with owner_id and Phase 1-3 columns!' AS result;
