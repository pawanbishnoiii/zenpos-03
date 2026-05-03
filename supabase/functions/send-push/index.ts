import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
    if (!roles?.some((r: any) => r.role === 'admin')) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const { title, message, image_url, launch_url, target = 'all', segment, player_ids = [], external_user_ids = [] } = body;
    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'title and message required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: settings } = await supabase.from('onesignal_settings').select('*').limit(1).maybeSingle();
    if (!settings?.app_id || !settings?.rest_api_key) {
      return new Response(JSON.stringify({ error: 'OneSignal not configured. Add REST API key in admin.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const payload: any = {
      app_id: settings.app_id,
      headings: { en: title },
      contents: { en: message },
    };
    if (image_url) { payload.big_picture = image_url; payload.chrome_web_image = image_url; payload.large_icon = image_url; }
    if (launch_url || settings.default_url) payload.url = launch_url || settings.default_url;
    if (settings.default_icon_url) payload.chrome_web_icon = settings.default_icon_url;

    if (target === 'players' && player_ids.length) payload.include_player_ids = player_ids;
    else if (target === 'external' && external_user_ids.length) payload.include_external_user_ids = external_user_ids;
    else if (target === 'segment' && segment) payload.included_segments = [segment];
    else payload.included_segments = ['Subscribed Users'];

    const res = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${settings.rest_api_key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();

    await supabase.from('push_notifications').insert({
      title, message, image_url: image_url || '', launch_url: launch_url || '',
      target, segment: segment || '', player_ids, external_user_ids,
      status: res.ok ? 'sent' : 'failed',
      recipients: result.recipients || 0,
      onesignal_id: result.id || '',
      error: res.ok ? '' : JSON.stringify(result.errors || result),
      sent_by: user.id,
    });

    return new Response(JSON.stringify(result), { status: res.ok ? 200 : 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || 'Internal error' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
