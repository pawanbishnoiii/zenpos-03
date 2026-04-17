
-- Add missing columns to admin_apk_settings
ALTER TABLE public.admin_apk_settings 
  ADD COLUMN IF NOT EXISTS description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS file_size_mb numeric DEFAULT 0;

-- Create dedicated public bucket for APK files
INSERT INTO storage.buckets (id, name, public)
VALUES ('app-files', 'app-files', true)
ON CONFLICT (id) DO NOTHING;

-- Public can read APKs
CREATE POLICY "Public can view app files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'app-files');

-- Only admins can upload/update/delete APKs
CREATE POLICY "Admins can upload app files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'app-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update app files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'app-files' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete app files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'app-files' AND has_role(auth.uid(), 'admin'::app_role));
