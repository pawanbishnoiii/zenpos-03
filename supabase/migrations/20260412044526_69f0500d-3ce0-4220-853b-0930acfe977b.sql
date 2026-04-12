
-- New table: store_customers (customer-facing auth on store pages)
CREATE TABLE public.store_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  store_slug TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX idx_store_customers_email_slug ON public.store_customers (store_slug, lower(email));
ALTER TABLE public.store_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create store customer accounts"
  ON public.store_customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can view store customers by slug"
  ON public.store_customers FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage store customers"
  ON public.store_customers FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- New table: happy_customers (showcase section)
CREATE TABLE public.happy_customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL,
  customer_name TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  vehicle_info TEXT,
  title TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.happy_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage happy customers"
  ON public.happy_customers FOR ALL
  TO authenticated
  USING (is_business_owner(auth.uid(), business_id))
  WITH CHECK (is_business_owner(auth.uid(), business_id));

CREATE POLICY "Public can view happy customers"
  ON public.happy_customers FOR SELECT
  TO anon, authenticated
  USING (true);

-- New table: admin_apk_settings
CREATE TABLE public.admin_apk_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  apk_url TEXT DEFAULT '',
  version TEXT DEFAULT '1.0.0',
  push_notification_key TEXT DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_apk_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage APK settings"
  ON public.admin_apk_settings FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view APK settings"
  ON public.admin_apk_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Add columns to printer_settings
ALTER TABLE public.printer_settings
  ADD COLUMN IF NOT EXISTS logo_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS layout_type TEXT DEFAULT '58mm',
  ADD COLUMN IF NOT EXISTS custom_header TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_footer TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS font_size TEXT DEFAULT 'medium';

-- Add columns to businesses
ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS tagline TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS owner_card_visible BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS customer_auth_enabled BOOLEAN DEFAULT false;
