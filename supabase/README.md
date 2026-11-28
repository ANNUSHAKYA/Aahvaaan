# Aahvaaan Supabase Database & Auth Architecture (Phase 5A)

This document describes the database schema, Row-Level Security (RLS), authentication flows, storage bucket policies, and recommended rate-limiting strategy for Aahvaaan by Vow & Vision.

---

## 1. How to Apply the Migration

### Method A: Supabase Dashboard (Recommended & Instant)
1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard).
2. Select your project.
3. Open the **SQL Editor** from the left navigation panel.
4. Click **New Query**, open the file `supabase/migrations/001_init.sql`, paste its complete contents, and click **Run**.
5. The tables, triggers, RLS policies, and safe RPC functions will be created immediately.

### Method B: Supabase CLI
If using the local Supabase CLI linked to your remote project:
```bash
# Link your project (if not linked yet)
npx supabase link --project-ref nvoynqxwkbtzdlgbjvfl

# Push new migrations
npx supabase db push
```

---

## 2. How to Run the Seed Script

The seed script inserts the **Mor Pankh** template into the `templates` catalog reading the price dynamically from `lib/siteConfig.ts` (`siteConfig.pricing.signature.price = 1749`):

```bash
# Run using npx tsx
npx tsx scripts/seed-templates.ts
```

Alternatively, if running SQL directly in the Supabase SQL Editor:
Run `supabase/seed.sql`.

---

## 3. Schema & Row Level Security (RLS) Overview

All tables have Row Level Security enabled. Direct access for unauthenticated (anon) requests is revoked on core tables:

| Table | Owner Access | Public (Anon) Access | Notes |
| :--- | :--- | :--- | :--- |
| `profiles` | SELECT, INSERT, UPDATE own profile | None | Auto-created via `handle_new_user()` trigger on `auth.users` |
| `templates` | Admin | SELECT active templates | Public catalog of available designs |
| `invitations` | SELECT, INSERT, UPDATE, DELETE own | **None (Direct table blocked)** | Public accesses published invites via `get_public_invitation(slug)` RPC |
| `invitation_drafts` | SELECT, INSERT, UPDATE, DELETE own | None | Work-in-progress edits; published via `publish_invitation` RPC |
| `guests` | Full CRUD for own invites | None | Named guests with unique 12-char slugs |
| `rsvps` | SELECT, UPDATE, DELETE own | **INSERT via RPC only** | Guests submit responses via `submit_rsvp(slug, ...)` RPC |
| `views` | SELECT own counts | **INSERT via RPC only** | Analytics page views tracked via `track_view(slug, ...)` RPC |
| `orders` | SELECT, INSERT, UPDATE own | None | Tracks Razorpay payment status and invitation upgrades |

### Public RPC Functions (Security Definer)
- `public.get_public_invitation(p_slug text)`: Returns only safe, client-facing invitation fields (couple names, wedding date, event list, venue details, photos, music choice, family note) for published invitations. Omits owner IDs and internal fields.
- `public.submit_rsvp(...)`: Validates that the invitation slug exists and is published before creating an RSVP record.
- `public.track_view(...)`: Validates the invitation slug before logging device view statistics.

---

## 4. Storage Bucket Configuration ("invitation-photos")

- **Bucket**: `invitation-photos`
- **Visibility**: **Private** (Not public)
- **Path format**: `{owner_id}/{invitation_id}/{filename}`
- **Constraints**: Maximum 8 images per invitation, maximum 3 MB per image, formats restricted to `image/jpeg`, `image/png`, `image/webp`.
- **Serving Mechanism**: Served through **signed URLs** generated via the Supabase client:
  ```typescript
  const { data, error } = await supabase.storage
    .from('invitation-photos')
    .createSignedUrl(`${ownerId}/${invitationId}/${filename}`, 60 * 60); // 1 hour validity
  ```

---

## 5. Rate Limiting Strategy (Architecture Notes)

*Note: As per Phase 5A requirements, rate limiting is documented here and will be implemented in subsequent phases.*

### Threat Vectors & Protection Targets
1. **Public RSVP Submissions (`submit_rsvp` RPC)**:
   - *Risk*: Bot spamming fake guest RSVPs to overwhelm host notifications or pollute the guest list.
   - *Target Limit*: Max 5 RSVP submissions per IP per 10 minutes per invitation.
2. **Page Views / Analytics (`track_view` RPC)**:
   - *Risk*: Refresh loops or bots artificially inflating view analytics.
   - *Target Limit*: Max 1 view record per IP per 5 minutes per invitation slug.
3. **Authentication Endpoints (`/login`, `/signup`, `/forgot-password`)**:
   - *Risk*: Brute-force credential stuffing or password-reset spam.
   - *Target Limit*: Max 5 failed login attempts per IP per 15 minutes.

### Recommended Implementation Approaches
1. **Edge Middleware (Upstash Redis / Vercel KV)**:
   - Using `@upstash/ratelimit` inside Next.js `middleware.ts` for edge-speed IP rate limiting before requests ever hit the database.
   - Return HTTP `429 Too Many Requests` with `Retry-After` header when thresholds are reached.
2. **Postgres In-Database Token Bucket (Fallback)**:
   - For RPC calls, maintain an ephemeral table `public.rate_limits (key text primary key, tokens integer, last_refill timestamptz)`.
   - RPC checks `key = 'rsvp:' || client_ip || ':' || p_invitation_slug`.
3. **Bot Protection**:
   - Integrate Cloudflare Turnstile or Supabase Auth Captcha on `/login`, `/signup`, and the RSVP submission modal.
