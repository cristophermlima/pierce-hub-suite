import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state");
      
      // Update local subscription table
      await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_type: 'trial',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          subscription_start_date: null,
          subscription_end_date: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({ 
        subscribed: false,
        status: 'no_customer',
        trial_active: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active or trialing subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });

    const activeSubscription = subscriptions.data.find(
      sub => sub.status === 'active' || sub.status === 'trialing'
    );

    if (!activeSubscription) {
      logStep("No active subscription found");
      
      // Check for past_due or canceled
      const hasAnySubscription = subscriptions.data.length > 0;
      const latestSub = subscriptions.data[0];
      
      await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          subscription_type: 'expired',
          stripe_customer_id: customerId,
          stripe_subscription_id: latestSub?.id || null,
          subscription_end_date: latestSub ? new Date(latestSub.current_period_end * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });

      return new Response(JSON.stringify({
        subscribed: false,
        status: latestSub?.status || 'no_subscription',
        trial_active: false,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const isTrialing = activeSubscription.status === 'trialing';
    const subscriptionEnd = new Date(activeSubscription.current_period_end * 1000).toISOString();
    const trialEnd = activeSubscription.trial_end 
      ? new Date(activeSubscription.trial_end * 1000).toISOString() 
      : null;

    logStep("Active subscription found", { 
      subscriptionId: activeSubscription.id, 
      status: activeSubscription.status,
      isTrialing,
      endDate: subscriptionEnd 
    });

    // Update local subscription table
    await supabaseClient
      .from('user_subscriptions')
      .upsert({
        user_id: user.id,
        subscription_type: isTrialing ? 'trial' : 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: activeSubscription.id,
        subscription_start_date: new Date(activeSubscription.start_date * 1000).toISOString(),
        subscription_end_date: subscriptionEnd,
        trial_start_date: activeSubscription.trial_start 
          ? new Date(activeSubscription.trial_start * 1000).toISOString() 
          : null,
        trial_end_date: trialEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    return new Response(JSON.stringify({
      subscribed: true,
      status: activeSubscription.status,
      trial_active: isTrialing,
      trial_end: trialEnd,
      subscription_end: subscriptionEnd,
      product_id: activeSubscription.items.data[0]?.price?.product,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
