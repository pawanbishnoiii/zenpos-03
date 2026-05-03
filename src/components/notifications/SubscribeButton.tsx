import { useEffect, useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

const STORAGE_KEY = 'os_subscribed_v1';

export const SubscribeButton = () => {
  const { toast } = useToast();
  const [hidden, setHidden] = useState<boolean>(() => localStorage.getItem(STORAGE_KEY) === '1');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (hidden) return;
    let cancelled = false;
    const onReady = (OneSignal: any) => {
      if (cancelled) return;
      try {
        const optedIn = OneSignal?.User?.PushSubscription?.optedIn;
        const id = OneSignal?.User?.PushSubscription?.id;
        if (optedIn && id) {
          localStorage.setItem(STORAGE_KEY, '1');
          setHidden(true);
        }
        setReady(true);
        OneSignal.User.PushSubscription.addEventListener('change', async (e: any) => {
          if (e?.current?.optedIn && e?.current?.id) {
            await persist(e.current.id);
            localStorage.setItem(STORAGE_KEY, '1');
            setHidden(true);
          }
        });
      } catch {
        setReady(true);
      }
    };
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(onReady);
    return () => { cancelled = true; };
  }, [hidden]);

  const persist = async (player_id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('push_subscribers').upsert({
        player_id,
        user_id: user?.id ?? null,
        email: user?.email ?? '',
        user_agent: navigator.userAgent,
        is_active: true,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'player_id' });
    } catch {/* ignore */}
  };

  const handleSubscribe = async () => {
    setBusy(true);
    try {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          await OneSignal.Notifications.requestPermission();
          await OneSignal.User.PushSubscription.optIn();
          const id = OneSignal.User.PushSubscription.id;
          if (id) {
            await persist(id);
            localStorage.setItem(STORAGE_KEY, '1');
            setHidden(true);
            toast({ title: 'Subscribed!', description: 'You will receive updates.' });
          } else {
            toast({ title: 'Permission needed', description: 'Please allow notifications.', variant: 'destructive' });
          }
        } catch (err: any) {
          toast({ title: 'Error', description: err?.message || 'Could not subscribe', variant: 'destructive' });
        } finally {
          setBusy(false);
        }
      });
    } catch {
      setBusy(false);
    }
  };

  if (hidden || !ready) return null;

  return (
    <button
      onClick={handleSubscribe}
      disabled={busy}
      className="fixed bottom-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:scale-105 transition-transform disabled:opacity-60"
      aria-label="Subscribe to notifications"
    >
      {busy ? <BellOff className="w-4 h-4 animate-pulse" /> : <Bell className="w-4 h-4" />}
      <span className="text-sm font-semibold">Get Notifications</span>
    </button>
  );
};

export default SubscribeButton;
