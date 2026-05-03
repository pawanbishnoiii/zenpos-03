import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Save, Loader2 } from 'lucide-react';

export const RazorpayPanel = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [s, setS] = useState<any>({ key_id: '', key_secret: '', webhook_secret: '', mode: 'test', enabled: false });

  useEffect(() => {
    supabase.from('razorpay_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) setS(data);
    });
  }, []);

  const save = async () => {
    setLoading(true);
    const payload = { ...s, updated_at: new Date().toISOString() };
    const { error } = s.id
      ? await supabase.from('razorpay_settings').update(payload).eq('id', s.id)
      : await supabase.from('razorpay_settings').insert(payload);
    setLoading(false);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Saved' });
  };

  const projectRef = (import.meta as any).env.VITE_SUPABASE_PROJECT_ID;
  const webhookUrl = `https://${projectRef}.supabase.co/functions/v1/razorpay-webhook`;

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-3">
        <CreditCard className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Razorpay Gateway</h2>
      </div>

      <div className="space-y-3 bg-card border border-border rounded-xl p-4">
        <div>
          <label className="text-xs text-muted-foreground">Mode</label>
          <select value={s.mode} onChange={e => setS({ ...s, mode: e.target.value })}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground">
            <option value="test">Test</option>
            <option value="live">Live</option>
          </select>
        </div>
        {[
          ['key_id', 'Key ID'],
          ['key_secret', 'Key Secret'],
          ['webhook_secret', 'Webhook Secret'],
        ].map(([k, l]) => (
          <div key={k}>
            <label className="text-xs text-muted-foreground">{l}</label>
            <input value={s[k] || ''} onChange={e => setS({ ...s, [k]: e.target.value })}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground" />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={s.enabled} onChange={e => setS({ ...s, enabled: e.target.checked })} /> Enabled
        </label>
        <div>
          <label className="text-xs text-muted-foreground">Webhook URL</label>
          <input readOnly value={webhookUrl} onClick={(e: any) => e.target.select()}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-xs font-mono text-foreground" />
        </div>
        <button onClick={save} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>
    </div>
  );
};

export default RazorpayPanel;
