-- Enable RLS on tables that have policies but RLS disabled
ALTER TABLE public.jewelry_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ring_closures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;