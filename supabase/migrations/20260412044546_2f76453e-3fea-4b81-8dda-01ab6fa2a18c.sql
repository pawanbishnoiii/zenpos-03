
DROP POLICY IF EXISTS "Anyone can create store customer accounts" ON public.store_customers;
CREATE POLICY "Anyone can create store customer accounts"
  ON public.store_customers FOR INSERT
  TO anon, authenticated
  WITH CHECK (length(trim(email)) > 0 AND length(trim(password_hash)) > 0);
