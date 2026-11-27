// Vercel Serverless Function: Open Graph Meta Generator for WhatsApp & Social Crawlers
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).send('Missing slug parameter');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    let inv = null;
    let guestName = null;
    const isPersonalGuest = String(slug).startsWith('r/');
    const cleanSlug = isPersonalGuest ? String(slug).replace(/^r\//, '') : String(slug);

    // 1. Try personal guest lookup if slug starts with r/
    if (isPersonalGuest) {
      const { data: guestData } = await supabase
        .from('guests')
        .select('*, invitations(*)')
        .eq('personal_slug', cleanSlug)
        .maybeSingle();

      if (guestData) {
        guestName = guestData.name;
        inv = guestData.invitations;
      }
    }

    // 2. Try common code lookup
    if (!inv) {
      const { data: rpcInv } = await supabase.rpc('get_invitation_by_common_code', {
        p_code: cleanSlug,
      });
      inv = rpcInv;
    }

    // 3. Fallback direct table query by slug or common_code
    if (!inv) {
      const { data: directInv } = await supabase
        .from('invitations')
        .select('*')
        .or(`slug.eq.${cleanSlug},common_code.eq.${cleanSlug}`)
        .maybeSingle();
      inv = directInv;
    }

    if (!inv) {
      // Default brand OG tags if invitation not found
      return res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Aahvaaan by Vow & Vision | Luxury Digital Wedding Invitations</title>
  <meta name="description" content="Experience royal Indian digital wedding invitations with 3D arch gate opening, shehnai music, and seamless WhatsApp guest tracking.">
  <meta property="og:title" content="Aahvaaan by Vow & Vision | Luxury Wedding Invitations">
  <meta property="og:description" content="Every celebration deserves a beautiful beginning. Craft your royal digital wedding invitation.">
  <meta property="og:image" content="https://aahvaaan.vercel.app/templates/mor-pankh.svg">
  <meta property="og:url" content="https://aahvaaan.vercel.app">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>
  <h2>Aahvaaan by Vow & Vision</h2>
  <a href="https://aahvaaan.vercel.app">Visit Website</a>
</body>
</html>`);
    }

    const content = inv.content || inv.published_content || inv.draft_content || {};
    const bride = content.brideName || content.bride || 'Bride';
    const groom = content.groomName || content.groom || 'Groom';
    const weddingDate = content.weddingDate
      ? new Date(content.weddingDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';
    const venue = content.venue || content.location || 'Jaipur, Rajasthan';
    const previewImage = content.gallery?.[0] || 'https://aahvaaan.vercel.app/templates/mor-pankh.svg';

    const title = guestName
      ? `Namaste ${guestName}! You are cordially invited to ${bride} & ${groom}'s Wedding`
      : `${bride} & ${groom}'s Royal Wedding Invitation | Aahvaaan`;

    const description = guestName
      ? `With the divine blessings of our families, we invite you, ${guestName}, to bless us on our auspicious wedding day (${weddingDate}) at ${venue}.`
      : `Together with our families, we joyfully invite you to celebrate our wedding on ${weddingDate} at ${venue}. Open your interactive royal invitation.`;

    const targetUrl = isPersonalGuest
      ? `https://${req.headers.host}/invite/r/${cleanSlug}`
      : `https://${req.headers.host}/invite/${inv.slug || cleanSlug}`;

    const userAgent = req.headers['user-agent'] || '';
    const isCrawler = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|applebot|googlebot/i.test(userAgent);

    if (!isCrawler) {
      return res.redirect(302, targetUrl);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
    return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${targetUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${previewImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Aahvaaan by Vow & Vision">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${previewImage}">
</head>
<body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding: 48px 24px; background: #FAF7F2; color: #512D38;">
  <h1 style="font-size: 26px; margin-bottom: 12px;">${title}</h1>
  <p style="font-size: 15px; color: #65575A; max-width: 600px; margin: 0 auto 24px;">${description}</p>
  <a href="${targetUrl}" style="display: inline-block; padding: 12px 28px; background: #512D38; color: #fff; text-decoration: none; border-radius: 9999px; font-weight: 600;">
    Open Interactive Invitation
  </a>
</body>
</html>`);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
