-- Fix remaining database function security issues
CREATE OR REPLACE FUNCTION public.handle_new_user_trial()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (
    user_id,
    subscription_type,
    trial_start_date,
    trial_end_date
  )
  VALUES (
    NEW.id,
    'trial',
    now(),
    now() + interval '10 days'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Ensure user_has_active_access function has proper security
CREATE OR REPLACE FUNCTION public.user_has_active_access(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT CASE 
    WHEN subscription_type = 'trial' AND trial_end_date > now() THEN true
    WHEN subscription_type = 'premium' AND subscription_end_date > now() THEN true
    ELSE false
  END
  FROM public.user_subscriptions
  WHERE user_id = user_uuid;
$$;