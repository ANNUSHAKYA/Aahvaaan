// Supabase Edge Function: create-razorpay-order
// Creates a Razorpay order securely on server and records it in public.orders

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PACKAGE_PRICES: Record<string, number> = {
  starter: 999,
  signature: 1499,
  luxury: 1999,
  extra_guests: 499,
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') ?? '';
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') ?? '';

    // Create Supabase Admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get Auth User from Header
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized user. Please log in.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { invitation_id, package_id = 'signature', type = 'package' } = await req.json();

    if (!invitation_id) {
      return new Response(
        JSON.stringify({ error: 'Missing invitation_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Determine INR price
    const priceKey = type === 'extra_guests' ? 'extra_guests' : (package_id || 'signature');
    const amountInr = PACKAGE_PRICES[priceKey] || 1499;
    const amountPaise = amountInr * 100;

    let razorpayOrderId = '';

    // If Razorpay live/test credentials exist in environment
    if (razorpayKeyId && razorpayKeySecret) {
      const basicAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
      const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basicAuth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountPaise,
          currency: 'INR',
          receipt: `rcpt_${invitation_id.substring(0, 8)}_${Date.now()}`,
          notes: {
            invitation_id,
            package_id,
            type,
            user_id: user.id,
          },
        }),
      });

      if (!rzpRes.ok) {
        const errText = await rzpRes.text();
        console.error('Razorpay API error:', errText);
        throw new Error(`Razorpay Order creation failed: ${errText}`);
      }

      const rzpData = await rzpRes.json();
      razorpayOrderId = rzpData.id;
    } else {
      // Sandbox fallback mode if keys are pending configuration in Supabase dashboard
      razorpayOrderId = `order_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // Insert order in database
    const { data: orderRecord, error: orderInsertErr } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        invitation_id,
        amount_inr: amountInr,
        type,
        package_id: type === 'package' ? package_id : null,
        razorpay_order_id: razorpayOrderId,
        status: 'created',
      })
      .select()
      .single();

    if (orderInsertErr) {
      console.error('Database order creation error:', orderInsertErr);
      throw orderInsertErr;
    }

    return new Response(
      JSON.stringify({
        success: true,
        order_id: razorpayOrderId,
        amount_inr: amountInr,
        amount_paise: amountPaise,
        currency: 'INR',
        key_id: razorpayKeyId || 'rzp_test_placeholder',
        order_record_id: orderRecord.id,
        is_simulated: !razorpayKeySecret,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Create order error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
