// Vercel Serverless Function: Open Graph Meta Generator for /api/og?slug=<slug>
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
    const { data: inv, error } = await supabase.rpc('get_invitation_by_common_code', {
      p_code: slug,
    });

    if (error || !inv) {
      return res.status(404).send('Invitation not found');
    }

    const content = inv.content || {};
    const bride = content.brideName || 'Bride';
    const groom = content.groomName || 'Groom';
    const weddingDate = content.weddingDate
      ? new Date(content.weddingDate).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '';
    const venue = content.venue || content.location || 'Jaipur, Rajasthan';
    const previewImage = content.gallery?.[0] || inv.template?.preview_image || 'https://aahvaaan.com/og-default.jpg';
    const title = `${bride} & ${groom}'s Wedding Invitation | Aahvaaan`;
    const description = `We cordially invite you to celebrate our wedding on ${weddingDate} at ${venue}. Open your interactive invitation here.`;
    const canonicalUrl = `https://${req.headers.host}/invite/${inv.slug}`;

    const userAgent = req.headers['user-agent'] || '';
    const isCrawler = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|applebot|googlebot/i.test(userAgent);

    if (!isCrawler) {
      return res.redirect(302, `/invite/${inv.slug}`);
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
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${previewImage}">
  <meta property="og:site_name" content="Aahvaaan by Vow & Vision">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${previewImage}">
</head>
<body style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; background: #FAF7F2; color: #512D38;">
  <h2>${title}</h2>
  <p>${description}</p>
  <a href="${canonicalUrl}">Open Wedding Invitation</a>
</body>
</html>`);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
