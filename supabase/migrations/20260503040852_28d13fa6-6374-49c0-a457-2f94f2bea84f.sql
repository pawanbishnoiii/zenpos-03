
CREATE TABLE IF NOT EXISTS public.onesignal_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id text NOT NULL DEFAULT '5823040d-3c28-4360-baa3-2902b1691a0a',
  rest_api_key text NOT NULL DEFAULT '',
  safari_web_id text NOT NULL DEFAULT '',
  default_icon_url text NOT NULL DEFAULT '',
  default_url text NOT NULL DEFAULT '',
  webhook_displayed_url text NOT NULL DEFAULT '',
  webhook_clicked_url text NOT NULL DEFAULT '',
  webhook_dismissed_url text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.onesignal_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage onesignal" ON public.onesignal_settings FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone view onesignal" ON public.onesignal_settings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.push_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  image_url text DEFAULT '',
  launch_url text DEFAULT '',
  target text NOT NULL DEFAULT 'all',
  segment text DEFAULT '',
  player_ids jsonb DEFAULT '[]'::jsonb,
  external_user_ids jsonb DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  recipients integer DEFAULT 0,
  onesignal_id text DEFAULT '',
  error text DEFAULT '',
  sent_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage push" ON public.push_notifications FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.push_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL UNIQUE,
  user_id uuid,
  email text DEFAULT '',
  user_agent text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.push_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone insert subscriber" ON public.push_subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone update by player" ON public.push_subscribers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admins view subscribers" ON public.push_subscribers FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone select own" ON public.push_subscribers FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins delete subscribers" ON public.push_subscribers FOR DELETE TO authenticated USING (has_role(auth.uid(),'admin'));

CREATE TABLE IF NOT EXISTS public.push_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  notification_id text DEFAULT '',
  player_id text DEFAULT '',
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.push_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view events" ON public.push_events FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'));
CREATE POLICY "Anyone insert events" ON public.push_events FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.razorpay_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_id text NOT NULL DEFAULT '',
  key_secret text NOT NULL DEFAULT '',
  webhook_secret text NOT NULL DEFAULT '',
  mode text NOT NULL DEFAULT 'test',
  enabled boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.razorpay_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage razorpay" ON public.razorpay_settings FOR ALL TO authenticated USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

INSERT INTO public.onesignal_settings (app_id) SELECT '5823040d-3c28-4360-baa3-2902b1691a0a' WHERE NOT EXISTS (SELECT 1 FROM public.onesignal_settings);
INSERT INTO public.razorpay_settings (mode) SELECT 'test' WHERE NOT EXISTS (SELECT 1 FROM public.razorpay_settings);
