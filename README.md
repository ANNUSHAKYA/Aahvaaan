# 🪷 Aahvaaan (आह्वान) — Luxury Digital Wedding Invitations
> **By Vow & Vision** • Handcrafted with authentic Indian heritage, RSVP inbox, and personal guest greetings.

[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-INR%20Payments-02042B?style=flat&logo=razorpay&logoColor=white)](https://razorpay.com/)

---

## 📖 Overview

Aahvaaan replaces static wedding PDFs and video files with an interactive digital wedding website experience. Couples can customize ceremony itineraries, Indian family lineages, background shehnai/sufi audio, venue GPS navigation, and collect real-time guest RSVPs with dietary preferences (Jain, Pure Veg, etc.).

### ✨ Key Features
- **4 Signature Collections**: Dedicated colour palettes, typography, and traditional layouts (Champagne & Rose, Sage & Ivory, Royal Maroon & Gold, and Blush & Lavender).
- **Dual Sharing Links**:
  - **Open Link (`/invite/:code`)**: Broadcast link for family groups and bulk sharing.
  - **Named Link (`/invite/r/:personalSlug`)**: Warm, individual greetings with 24-character cryptographically secure unguessable slugs.
- **WYSIWYG Live Studio Editor**: Real-time split-screen editor for event ceremonies, Sanskrit shlokas, family compliments, and photo galleries.
- **Monetization & Publishing Lifecycle**:
  - Razorpay INR integration handled securely in Supabase Edge Functions.
  - Tiered packages: **Starter (₹999)**, **Signature (₹1,499)**, and **Luxury (₹1,999)**.
  - Publishing enforces a **6-month active window** with up to **3 live updates** pushed directly to all guest links.
- **Host Analytics & Insights**: Total views, unique visitors, device breakdown (mobile vs desktop), RSVP headcounts, dietary breakdowns, and one-click CSV exports.
- **Security & Performance**:
  - 100% Row-Level Security (RLS) across all database tables.
  - No secret keys exposed to the client (only `anon` key used; Razorpay secrets stay in Edge Functions).
  - Client-side & server-side rate limits on RSVP and contact form submissions.
  - Client-side caching and dynamic route code-splitting for instant renders on mobile 4G networks.

---

## 🎨 4 Signature Collections

1. **Champagne & Rose** (*The Romance Collection*)
   - **Palette**: Warm Ivory (`#FAF6F0`), Champagne Beige (`#E9D7CC`), Dusty Rose (`#C99B91`), Muted Burgundy (`#704B50`), Antique Gold (`#B69A70`)
   - **Aesthetic**: Soft romantic florals, elegant gold borders, feminine serif typography.
2. **Sage & Ivory** (*The Botanical Collection*)
   - **Palette**: Soft Ivory (`#F8F7F0`), Pale Sage (`#DDE3D3`), Muted Sage (`#A8B59C`), Forest Sage (`#596B57`), Warm Beige (`#B7A78A`)
   - **Aesthetic**: Organic eucalyptus foliage, minimalist layouts, calming green accents.
3. **Royal Maroon & Gold** (*The Maharaja Collection*)
   - **Palette**: Cream (`#FAF1E5`), Champagne (`#E6D0B5`), Royal Maroon (`#761F32`), Deep Burgundy (`#431421`), Antique Gold (`#C5A15E`)
   - **Aesthetic**: Grand Rajasthani palace heritage, gold damask motifs, regal borders.
4. **Blush & Lavender** (*The Dream Collection*)
   - **Palette**: Soft White (`#FFF8F7`), Blush Pink (`#F0DDE2`), Lavender (`#D9C5DC`), Muted Mauve (`#9A718C`), Rose Beige (`#B99A84`)
   - **Aesthetic**: Ethereal pastels, delicate typography, dreamy layered invitation cards.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Framer Motion, Lucide Icons, Canvas Confetti.
- **Styling**: Tailwind CSS with custom royal wine & antique gold color tokens.
- **Backend**: Supabase (PostgreSQL 15+, Auth with Google OAuth & Email/Password, Storage).
- **Edge Functions**: Deno TypeScript on Supabase Edge runtime (`create-razorpay-order`, `verify-razorpay-payment`, `og-meta`).
- **Payment Gateway**: Razorpay (INR payments, signatures verified server-side).

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>

# Business WhatsApp line for enquiry fallback (Country code + digits, no +)
VITE_WHATSAPP_NUMBER=919876543210
```

> ⚠️ **Security Notice**: Never put `SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` in `.env` or client code. They must only be stored as Supabase Secrets via the Supabase CLI:
> ```bash
> supabase secrets set RAZORPAY_KEY_ID=rzp_live_... RAZORPAY_KEY_SECRET=...
> ```

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/ANNUSHAKYA/Aahvaaan.git
cd Aahvaaan
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Database Setup

Run the migrations in your **Supabase SQL Editor** (`https://supabase.com/dashboard/project/<your-project-id>/sql`) in the following chronological order:

1. `supabase/migrations/20261123_0001_initial_schema.sql` — Profiles, invitations, templates, and storage buckets.
2. `supabase/migrations/20261123_0002_sample_invitation.sql` — Initial seed data.
3. `supabase/migrations/20261123_0003_phase1_foundation.sql` — Auth triggers and initial RLS policies.
4. `supabase/migrations/20261123_0004_phase2_storage_and_editor.sql` — Storage buckets and draft content schemas.
5. `supabase/migrations/20261123_0005_phase3_guest_rpc_and_features.sql` — Guest list, personal slug generator, view tracking, and RSVP RPCs.
6. `supabase/migrations/20261123_0006_phase4_monetization_and_publishing.sql` — Orders table, publishing lifecycle (6 months & 3 live updates), and analytics RPCs.
7. `supabase/migrations/20261124_0007_phase5_security_and_admin.sql` — Security review, RLS enforcement, RSVP flood rate-limiting, and Admin overview functions.

---

## 📦 Deployment Guide

### Frontend Deployment (Vercel)
1. Import your GitHub repository to [Vercel](https://vercel.com/).
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
6. `vercel.json` is preconfigured with SPA rewrite rules to ensure deep links (e.g., `/invite/r/:personalSlug`, `/dashboard`) load seamlessly without 404 errors.

### Supabase Edge Functions Deployment
```bash
# Login to Supabase CLI
supabase login

# Link your remote project
supabase link --project-ref <your-project-id>

# Deploy Edge Functions
supabase functions deploy create-razorpay-order --no-verify-jwt
supabase functions deploy verify-razorpay-payment --no-verify-jwt
supabase functions deploy og-meta --no-verify-jwt
```

---

## 📋 Comprehensive Manual QA Checklist

Follow this checklist to verify the complete end-to-end user and guest journey:

### 1. Authentication & Sign Up
- [ ] Visit `/signup` and register a new host account (name, email, password).
- [ ] Verify profile row is auto-created in `public.profiles` via Supabase database trigger.
- [ ] Log out and log back in via `/login`. Verify session persistence on page refresh.

### 2. Create Invitation Draft
- [ ] On the host `/dashboard`, click **+ Create invitation**.
- [ ] Enter Bride Name (e.g. *Ananya*) and Groom Name (e.g. *Kabir*).
- [ ] Select a template (e.g. *Royal Maroon & Gold*) and package tier (*Signature*).
- [ ] Click **Create Draft & Start Editing**. Confirm redirect to `/dashboard/invitations/:id/edit`.

### 3. Live WYSIWYG Studio Editor
- [ ] Modify wedding date, venue, and Google Maps URL. Confirm live preview updates instantly.
- [ ] Add/Edit a ceremony (Mehendi, Sangeet, Haldi, Muhurtham).
- [ ] Edit Sanskrit shloka and Indian family compliments (Chacha, Tauji, Bua, Mama).
- [ ] Click **Save Changes** and confirm changes persist in `draft_content`.

### 4. Razorpay Payment & Edge Function
- [ ] In the editor or dashboard, click **Publish Invitation**.
- [ ] Select package (*Signature ₹1,499*) and click **Proceed to Payment**.
- [ ] Verify Razorpay modal opens with INR currency amount.
- [ ] Complete test payment (using Razorpay test credentials or mock fallback).
- [ ] Confirm Edge Function `verify-razorpay-payment` marks order as `paid` and sets `invitations.status = 'published'`.

### 5. Publishing Lifecycle
- [ ] Confirm `published_at` is set to current timestamp.
- [ ] Confirm `edit_expires_at` is set to `published_at + 6 months`.
- [ ] Confirm `updates_used` starts at `0/3`.

### 6. Sharing & Guest Links
- [ ] In host dashboard, click **Share**.
  - [ ] Verify open link (`/invite/:code`) copies to clipboard.
  - [ ] Test the WhatsApp share button (`api.whatsapp.com/send?text=...`).
- [ ] Open **Guests & RSVPs**:
  - [ ] Add a guest manually (*Rajesh Sharma*, phone number).
  - [ ] Verify personal slug is a 24-character unguessable hex string.
  - [ ] Upload a test CSV with multiple rows (`Name, Phone`).
  - [ ] Verify the package limit (e.g., 20 guests for Signature) is strictly enforced.

### 7. Guest Experience & RSVP Submission
- [ ] Open open link `/invite/:code` in an incognito window:
  - [ ] Confirm envelope animation, background wedding music, countdown timer, and venue map directions.
  - [ ] Submit RSVP (*Attending*, 2 guests, *Pure Vegetarian*, warm blessing message).
  - [ ] Test rate limiting by rapidly submitting multiple times. Verify flood protection prevents spam.
- [ ] Open named link `/invite/r/:personalSlug`:
  - [ ] Verify guest is greeted warmly by name (*"Dear Rajesh Sharma"*).
  - [ ] Verify phone and name are pre-populated in the RSVP form.

### 8. Live Update Flow
- [ ] Return to host editor (`/dashboard/invitations/:id/edit`).
- [ ] Modify venue name or time (e.g. change time to `7:30 PM`).
- [ ] Click **Push Live Changes**.
- [ ] Confirm modal shows update count incrementing (`1 of 3 updates used`).
- [ ] Refresh the open guest invitation in the incognito tab; confirm new details appear immediately without changing links.

### 9. Host Analytics & CSV Export
- [ ] In host dashboard, click **Analytics**:
  - [ ] Confirm total views and unique visitor count have incremented.
  - [ ] Verify device breakdown shows mobile vs desktop correctly.
  - [ ] Verify per-guest opened status, first viewed, and view count.
- [ ] In **Guests & RSVPs**, click **Export RSVPs (CSV)**.
  - [ ] Confirm CSV downloads with Name, Phone, Status, Guest Count, Dietary choices, and Messages.

### 10. Admin Dashboard
- [ ] Navigate to `/admin`.
- [ ] Verify KPI summary cards (Total Revenue, Paid Orders, Registered Users).
- [ ] Inspect Orders tab, Users tab, and Template Management tab.

---

## 🔒 Security Summary

| Vector | Protection Mechanism |
|---|---|
| **Database Access** | 100% tables protected by PostgreSQL Row Level Security (RLS). |
| **API Keys** | Only public `anon` key in frontend; `service_role` and Razorpay secrets confined to serverless Edge Functions. |
| **Guest Link Security** | Unpredictable 24-hex-character slugs generated with `gen_random_bytes(12)` ($7.9 \times 10^{28}$ space). |
| **Spam / Flood Protection** | Rate limiter utility on client + 10-minute flood window in `submit_guest_rsvp` RPC. |
| **Data Isolation** | Hosts can only query their own invitations, guest lists, and order histories. |

---

## 📄 License

Proprietary © 2026 **Aahvaaan by Vow & Vision**. All rights reserved.
