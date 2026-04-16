CREATE OR REPLACE FUNCTION public.get_store_by_slug(_slug text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _biz json;
  _products json;
  _reviews json;
  _biz_id uuid;
BEGIN
  SELECT id INTO _biz_id FROM businesses WHERE store_slug = _slug LIMIT 1;
  IF _biz_id IS NULL THEN RETURN NULL; END IF;

  SELECT row_to_json(b) INTO _biz FROM (
    SELECT id, business_name, category, phone, address, logo_url, store_slug, store_theme,
           google_map_url, whatsapp_number, contact_email, tagline, instagram_handle,
           youtube_handle, pincode, owner_card_visible, upi_id, gst_number,
           customer_auth_enabled, owner_id, theme
    FROM businesses WHERE id = _biz_id
  ) b;

  SELECT COALESCE(json_agg(row_to_json(p)), '[]'::json) INTO _products FROM (
    SELECT p.id, p.name, p.description, p.category, p.price, p.discount_price, p.image_url, p.brand_name,
      COALESCE((SELECT json_agg(json_build_object('id', pi.id, 'image_url', pi.image_url, 'sort_order', pi.sort_order) ORDER BY pi.sort_order) FROM product_images pi WHERE pi.product_id = p.id), '[]'::json) as images
    FROM products p WHERE p.business_id = _biz_id ORDER BY p.name
  ) p;

  SELECT COALESCE(json_agg(row_to_json(r)), '[]'::json) INTO _reviews FROM (
    SELECT id, product_id, reviewer_name, rating, review_text, created_at
    FROM product_reviews WHERE business_id = _biz_id AND is_approved = true ORDER BY created_at DESC LIMIT 20
  ) r;

  RETURN json_build_object('business', _biz, 'products', _products, 'reviews', _reviews);
END;
$function$;