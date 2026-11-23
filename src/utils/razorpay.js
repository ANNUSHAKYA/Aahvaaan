// Razorpay SDK Integration for Aahvaaan
import supabase, { isSupabaseConfigured } from '../lib/supabase';
import config from '../data/config';

// Load Razorpay script dynamically
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Initiates Razorpay payment for an invitation package or guest add-on.
 * Calls Supabase Edge Function to create order, opens Razorpay modal,
 * and calls verify endpoint on payment completion.
 */
export async function initiatePayment({
  invitationId,
  packageId = 'signature',
  type = 'package', // 'package' | 'extra_guests'
  userEmail = '',
  userName = '',
  userPhone = '',
  onSuccess,
  onError,
}) {
  try {
    // 1. Create order via Edge Function or Supabase RPC
    let orderData = null;
    let createOrderError = null;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.functions.invoke('create-razorpay-order', {
          body: {
            invitation_id: invitationId,
            package_id: packageId,
            type,
          },
        });
        if (error) throw error;
        orderData = data;
      } catch (fnErr) {
        console.warn('Edge function invoke failed, using client fallback order creation:', fnErr);
        createOrderError = fnErr;
      }
    }

    // Fallback order generation if Edge Functions are not yet deployed in project
    if (!orderData) {
      const priceMap = { starter: 999, signature: 1499, luxury: 1999, extra_guests: 499 };
      const amount = priceMap[type === 'extra_guests' ? 'extra_guests' : packageId] || 1499;
      const simOrderId = `order_sim_${Date.now()}`;

      // Insert directly into orders table if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user && invitationId) {
        await supabase.from('orders').insert({
          user_id: user.id,
          invitation_id: invitationId,
          amount_inr: amount,
          type,
          package_id: type === 'package' ? packageId : null,
          razorpay_order_id: simOrderId,
          status: 'created',
        });
      }

      orderData = {
        order_id: simOrderId,
        amount_inr: amount,
        amount_paise: amount * 100,
        currency: 'INR',
        key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_simulated',
        is_simulated: true,
      };
    }

    // 2. Load Razorpay script
    const isScriptLoaded = await loadRazorpayScript();

    // If script couldn't load or simulated key, provide interactive simulator
    if (!isScriptLoaded || orderData.is_simulated || orderData.key_id === 'rzp_test_simulated' || orderData.key_id === 'rzp_test_placeholder') {
      // Simulate successful payment confirmation prompt for testing
      const confirmed = window.confirm(
        `💳 [Razorpay Payment Simulation]\n\nPackage: ${packageId.toUpperCase()}\nAmount: ₹${orderData.amount_inr}\nOrder ID: ${orderData.order_id}\n\nWould you like to simulate successful payment confirmation?`
      );

      if (confirmed) {
        const simPaymentId = `pay_sim_${Date.now()}`;
        const simSignature = `sig_sim_${Date.now()}`;

        // Fulfill via RPC or direct update
        await fulfillPayment({
          orderId: orderData.order_id,
          paymentId: simPaymentId,
          signature: simSignature,
          invitationId,
          type,
          packageId,
        });

        if (onSuccess) {
          onSuccess({
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: simPaymentId,
            status: 'paid',
          });
        }
        return;
      } else {
        if (onError) onError(new Error('Payment cancelled by user.'));
        return;
      }
    }

    // 3. Open official Razorpay modal
    const options = {
      key: orderData.key_id,
      amount: orderData.amount_paise,
      currency: 'INR',
      name: config.brandName || 'Aahvaaan',
      description: type === 'extra_guests'
        ? '50 Extra Personalized Invitation Links'
        : `${packageId.toUpperCase()} Wedding Website Package`,
      image: '/favicon.svg',
      order_id: orderData.order_id,
      prefill: {
        name: userName || '',
        email: userEmail || '',
        contact: userPhone || '',
      },
      theme: {
        color: '#6B1D2F', // Aahvaaan Royal Wine
      },
      handler: async function (response) {
        try {
          await fulfillPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            invitationId,
            type,
            packageId,
          });

          if (onSuccess) onSuccess(response);
        } catch (verErr) {
          console.error('Payment fulfillment error:', verErr);
          if (onError) onError(verErr);
        }
      },
      modal: {
        ondismiss: function () {
          if (onError) onError(new Error('Checkout closed without payment.'));
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      if (onError) onError(new Error(resp.error?.description || 'Payment failed'));
    });
    rzp.open();
  } catch (err) {
    console.error('Initiate payment exception:', err);
    if (onError) onError(err);
  }
}

// Fulfill payment calling verify function or RPC fallback
async function fulfillPayment({ orderId, paymentId, signature, invitationId, type, packageId }) {
  try {
    const { data, error } = await supabase.functions.invoke('verify-razorpay-payment', {
      body: {
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        invitation_id: invitationId,
        auto_publish: false,
      },
    });

    if (error) throw error;
    return data;
  } catch (fnErr) {
    console.warn('Verify Edge Function unavailable, fulfilling directly via RPC:', fnErr);
    // Fallback direct RPC
    const { data: rpcData, error: rpcErr } = await supabase.rpc('fulfill_invitation_order', {
      p_razorpay_order_id: orderId,
      p_razorpay_payment_id: paymentId,
      p_razorpay_signature: signature,
    });

    if (rpcErr) throw rpcErr;
    return rpcData;
  }
}
