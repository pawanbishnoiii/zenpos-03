import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Save, Loader2, Trash2, Users, Activity, Webhook } from 'lucide-react';

const TABS = ['settings', 'send', 'history', 'subscribers', 'webhooks', 'events'] as const;
type Tab = typeof TABS[number];

export const OneSignalPanel = () => {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>('settings');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>({
    app_id: '5823040d-3c28-4360-baa3-2902b1691a0a',
    rest_api_key: '', safari_web_id: '', default_icon_url: '', default_url: '',
    webhook_displayed_url: '', webhook_clicked_url: '', webhook_dismissed_url: '',
    enabled: true,
  });
  const [history, setHistory] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [send, setSend] = useState({ title: '', message: '', image_url: '', launch_url: '', target: 'all', segment: 'Subscribed Users', player_ids: '' });

  const projectRef = (import.meta as any).env.VITE_SUPABASE_PROJECT_ID;
  const fnBase = `https://${projectRef}.supabase.co/functions/v1`;
  const webhookUrl = (ev: string) => `${fnBase}/onesignal-webhook?event=${ev}`;

  useEffect(() => { void loadAll(); }, []);

  const loadAll = async () => {
    const [s, h, sb, ev] = await Promise.all([
      supabase.from('onesignal_settings').select('*').limit(1).maybeSingle(),
      supabase.from('push_notifications').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('push_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(200),
      supabase.from('push_events').select('*').order('created_at', { ascending: false }).limit(100),
    ]);
    if (s.data) setSettings({ ...settings, ...s.data });
    setHistory(h.data || []);
    setSubs(sb.data || []);
    setEvents(ev.data || []);
  };

  const saveSettings = async () => {
    setLoading(true);
    const payload = { ...settings, updated_at: new Date().toISOString() };
    const { error } = settings.id
      ? await supabase.from('onesignal_settings').update(payload).eq('id', settings.id)
      : await supabase.from('onesignal_settings').insert(payload);
    setLoading(false);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Saved' }); void loadAll(); }
  };

  const sendNow = async () => {
    if (!send.title || !send.message) { toast({ title: 'Title & message required', variant: 'destructive' }); return; }
    setLoading(true);
    const body: any = { ...send };
    if (send.target === 'players') body.player_ids = send.player_ids.split(',').map(s => s.trim()).filter(Boolean);
    const { data, error } = await supabase.functions.invoke('send-push', { body });
    setLoading(false);
    if (error) toast({ title: 'Send failed', description: error.message, variant: 'destructive' });
    else { toast({ title: 'Sent', description: `Recipients: ${data?.recipients ?? '—'}` }); void loadAll(); }
  };

  const deleteSub = async (id: string) => {
    await supabase.from('push_subscribers').delete().eq('id', id);
    setSubs(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Bell className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">OneSignal Push</h2>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'settings' && (
        <div className="space-y-3 bg-card border border-border rounded-xl p-4">
          {[
            ['app_id', 'OneSignal App ID'],
            ['rest_api_key', 'REST API Key (secret)'],
            ['safari_web_id', 'Safari Web ID (optional)'],
            ['default_icon_url', 'Default Icon URL'],
            ['default_url', 'Default Launch URL'],
          ].map(([k, l]) => (
            <div key={k}>
              <label className="text-xs text-muted-foreground">{l}</label>
              <input value={settings[k] || ''} onChange={e => setSettings({ ...settings, [k]: e.target.value })}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
            </div>
          ))}
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={settings.enabled} onChange={e => setSettings({ ...settings, enabled: e.target.checked })} /> Enabled
          </label>
          <button onClick={saveSettings} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Settings
          </button>
        </div>
      )}

      {tab === 'send' && (
        <div className="space-y-3 bg-card border border-border rounded-xl p-4">
          <input placeholder="Title" value={send.title} onChange={e => setSend({ ...send, title: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          <textarea placeholder="Message" rows={3} value={send.message} onChange={e => setSend({ ...send, message: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          <input placeholder="Image URL (optional)" value={send.image_url} onChange={e => setSend({ ...send, image_url: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          <input placeholder="Launch URL (optional)" value={send.launch_url} onChange={e => setSend({ ...send, launch_url: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          <select value={send.target} onChange={e => setSend({ ...send, target: e.target.value })}
            className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground">
            <option value="all">All Subscribed</option>
            <option value="segment">Segment</option>
            <option value="players">Specific Player IDs</option>
          </select>
          {send.target === 'segment' && (
            <input placeholder="Segment name" value={send.segment} onChange={e => setSend({ ...send, segment: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          )}
          {send.target === 'players' && (
            <textarea placeholder="Comma-separated player IDs" rows={2} value={send.player_ids} onChange={e => setSend({ ...send, player_ids: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          )}
          <button onClick={sendNow} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Now
          </button>
        </div>
      )}

      {tab === 'history' && (
        <div className="space-y-2">
          {history.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notifications sent yet</p>}
          {history.map(h => (
            <div key={h.id} className="bg-card border border-border rounded-xl p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-foreground">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.message}</p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${h.status === 'sent' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{h.status}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Recipients: {h.recipients} · {new Date(h.created_at).toLocaleString()}</p>
              {h.error && <p className="text-[10px] text-red-500 mt-1">{h.error}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'subscribers' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground"><Users className="w-4 h-4" /> Total: {subs.length}</div>
          {subs.map(s => (
            <div key={s.id} className="bg-card border border-border rounded-xl p-3 flex justify-between items-center">
              <div className="min-w-0">
                <p className="text-xs font-mono text-foreground truncate">{s.player_id}</p>
                <p className="text-[10px] text-muted-foreground truncate">{s.email || s.user_agent}</p>
              </div>
              <button onClick={() => deleteSub(s.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'webhooks' && (
        <div className="space-y-3 bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1"><Webhook className="w-3 h-3" /> Paste these URLs in your OneSignal dashboard → Settings → Webhooks.</p>
          {[
            ['Displayed', webhookUrl('displayed')],
            ['Clicked', webhookUrl('clicked')],
            ['Dismissed', webhookUrl('dismissed')],
          ].map(([label, url]) => (
            <div key={label}>
              <label className="text-xs text-muted-foreground">{label}</label>
              <input readOnly value={url} onClick={(e: any) => e.target.select()}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground" />
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-foreground"><Activity className="w-4 h-4" /> Recent: {events.length}</div>
          {events.map(e => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-3">
              <div className="flex justify-between">
                <span className="text-xs font-bold capitalize text-foreground">{e.event_type}</span>
                <span className="text-[10px] text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-muted-foreground font-mono truncate">{e.notification_id} · {e.player_id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OneSignalPanel;
