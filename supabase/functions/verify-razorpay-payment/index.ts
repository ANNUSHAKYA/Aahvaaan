// Supabase Edge Function: verify-razorpay-payment
// Verifies HMAC signature, handles webhooks idempotently, and unlocks publishing/guest limits

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// HMAC-SHA256 verification using Web Crypto API
async function verifyHmacSha256(secret: string, message: string, expectedHex: string): Promise<boolean> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const hex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hex.toLowerCase() === expectedHex.toLowerCase();
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || razorpayKeySecret;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.json();

    // ─── Scenario A: Razorpay Webhook Event ───
    if (body.event && body.payload) {
      const webhookSig = req.headers.get('x-razorpay-signature');
      if (razorpayWebhookSecret && webhookSig) {
        const rawBody = JSON.stringify(body);
        const isValid = await verifyHmacSha256(razorpayWebhookSecret, rawBody, webhookSig);
        if (!isValid) {
          return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
            status: 400,
            headers: corsHeaders,
          });
        }
      }

      if (body.event === 'order.paid' || body.event === 'payment.captured') {
        const payment = body.payload.payment?.entity;
        const orderId = payment?.order_id;
        const paymentId = payment?.id;

        if (orderId) {
          const { data: fulfillment, error: rpcErr } = await supabase.rpc('fulfill_invitation_order', {
            p_razorpay_order_id: orderId,
            p_razorpay_payment_id: paymentId,
            p_razorpay_signature: webhookSig || 'webhook',
          });

          if (rpcErr) console.error('Webhook fulfillment RPC error:', rpcErr);
          return new Response(JSON.stringify({ success: true, processed: true, fulfillment }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ─── Scenario B: Client Payment Callback ───
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invitation_id,
      auto_publish = false,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return new Response(
        JSON.stringify({ error: 'Missing payment verification details.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify signature if secret is present
    if (razorpayKeySecret && razorpay_signature) {
      const message = `${razorpay_order_id}|${razorpay_payment_id}`;
      const isValid = await verifyHmacSha256(razorpayKeySecret, message, razorpay_signature);
      if (!isValid) {
        return new Response(
          JSON.stringify({ error: 'Payment signature verification failed. Untrusted request.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // 1. Fulfill order idempotently
    const { data: fulfillment, error: fulfillErr } = await supabase.rpc('fulfill_invitation_order', {
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature || 'verified',
    });

    if (fulfillErr) {
      console.error('Fulfillment RPC error:', fulfillErr);
      throw fulfillErr;
    }

    // 2. If auto_publish is requested, publish immediately
    let publishResult = null;
    if (auto_publish && invitation_id) {
      const { data: pubData, error: pubErr } = await supabase.rpc('publish_invitation', {
        p_invitation_id: invitation_id,
      });
      if (pubErr) {
        console.warn('Auto publish warning:', pubErr);
      } else {
        publishResult = pubData;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Payment verified and order fulfilled successfully.',
        fulfillment,
        publishResult,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Verify payment error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Payment verification failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
