// Supabase Edge Function: Dynamic Open Graph Metadata Generator for WhatsApp & Social Crawlers
// Deployed as: og-meta
// Usage: https://<project-ref>.supabase.co/functions/v1/og-meta?slug=<invitation-slug>

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const slug = url.searchParams.get("slug") || url.pathname.split("/").pop();

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Call Security Definer RPC
    const { data: inv, error } = await supabase.rpc("get_invitation_by_common_code", {
      p_code: slug,
    });

    if (error || !inv) {
      return new Response("Invitation not found", { status: 404 });
    }

    const content = inv.content || {};
    const bride = content.brideName || "Bride";
    const groom = content.groomName || "Groom";
    const weddingDate = content.weddingDate ? new Date(content.weddingDate).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }) : "";
    const venue = content.venue || content.location || "Jaipur, Rajasthan";
    const previewImage = content.gallery?.[0] || inv.template?.preview_image || "https://aahvaaan.com/og-default.jpg";
    const title = `${bride} & ${groom}'s Wedding Invitation | Aahvaaan`;
    const description = `We cordially invite you to celebrate our wedding on ${weddingDate} at ${venue}. Open your interactive invitation here.`;
    const canonicalUrl = `https://aahvaaan.com/invite/${inv.slug}`;

    // Inspect User-Agent to detect crawlers
    const userAgent = req.headers.get("user-agent") || "";
    const isCrawler = /whatsapp|facebookexternalhit|facebot|twitterbot|telegrambot|linkedinbot|slackbot|applebot|googlebot/i.test(userAgent);

    // Normal human visitors: redirect directly to the live single-page app
    if (!isCrawler) {
      return Response.redirect(canonicalUrl, 302);
    }

    // Crawlers (WhatsApp, Facebook, Twitter): return rich HTML with complete Open Graph & Twitter meta tags
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / WhatsApp / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${previewImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Aahvaaan by Vow & Vision">

  <!-- Twitter -->
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
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
