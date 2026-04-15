import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, CreditCard, Shield, Zap, Globe, Printer, Users, BarChart3, Mail, Database, Loader2, Store } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AccountsPanelProps {
  business: any;
  user: any;
}

const AccountsPanel = ({ business, user }: AccountsPanelProps) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [plansRes, subRes] = await Promise.all([
        supabase.from('subscription_plans').select('*').eq('is_active', true).order('sort_order'),
        business ? supabase.from('business_subscriptions').select('*, subscription_plans(*)').eq('business_id', business.id).order('created_at', { ascending: false }).limit(1).maybeSingle() : Promise.resolve({ data: null }),
      ]);
      if (plansRes.data) setPlans(plansRes.data);
      if (subRes.data) setSubscription(subRes.data);
      setLoading(false);
    };
    fetch();
  }, [business]);

  const currentPlan = subscription?.plan_name || 'Free';

  if (loading) return (
    <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
  );

  return (
    <div className="space-y-6">
      {/* Current Plan Summary */}
      <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Crown className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{currentPlan} Plan</p>
            <p className="text-xs text-muted-foreground">
              {subscription?.status === 'active' ? 'Active' : 'Free tier'}
              {subscription?.expires_at && ` • Expires ${new Date(subscription.expires_at).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium text-foreground">{user?.email}</p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Business</p>
            <p className="text-sm font-medium text-foreground">{business?.business_name || 'Not set'}</p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Category</p>
            <p className="text-sm font-medium text-foreground capitalize">{business?.category?.replace('_', ' ') || 'General'}</p>
          </div>
          <div className="rounded-xl border border-border p-4 space-y-1">
            <p className="text-xs text-muted-foreground">Store Link</p>
            <p className="text-sm font-medium text-primary">{business?.store_slug ? `/store/${business.store_slug}` : 'Not configured'}</p>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-foreground">Plan Features</h3>
        <div className="space-y-2">
          {[
            { icon: Store, label: 'Products', free: 'Up to 50', pro: 'Unlimited', current: currentPlan === 'Free' ? 'Up to 50' : 'Unlimited' },
            { icon: Globe, label: 'Store Themes', free: '1 Theme', pro: 'All 10+', current: currentPlan === 'Free' ? '1 Theme' : 'All 10+' },
            { icon: Printer, label: 'Invoice Branding', free: '✗', pro: '✓', current: currentPlan !== 'Free' ? '✓' : '✗' },
            { icon: Users, label: 'Multi-Staff', free: '✗', pro: '✓ (Enterprise)', current: currentPlan === 'Enterprise' ? '✓' : '✗' },
            { icon: Mail, label: 'Email Notifications', free: '✗', pro: '✓', current: currentPlan !== 'Free' ? '✓' : '✗' },
            { icon: Database, label: 'Data Backup', free: '✗', pro: '✓', current: currentPlan !== 'Free' ? '✓' : '✗' },
            { icon: BarChart3, label: 'Advanced Reports', free: '✗', pro: '✓', current: currentPlan !== 'Free' ? '✓' : '✗' },
          ].map(feature => (
            <div key={feature.label} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border/50">
              <div className="flex items-center gap-3">
                <feature.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">{feature.label}</span>
              </div>
              <span className={`text-xs font-semibold ${feature.current === '✗' ? 'text-muted-foreground' : 'text-success'}`}>
                {feature.current}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      {plans.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground">Available Plans</h3>
          <div className="grid grid-cols-1 gap-3">
            {plans.map(plan => {
              const featuresList = Array.isArray(plan.features) ? plan.features : [];
              const isCurrent = plan.name.toLowerCase() === currentPlan.toLowerCase();
              return (
                <div key={plan.id} className={`rounded-xl border-2 p-4 space-y-3 transition-all ${isCurrent ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-foreground">{plan.name}</p>
                      <p className="text-lg font-bold gradient-primary-text">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}/${plan.interval}`}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Current</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuresList.slice(0, 4).map((f: string, j: number) => (
                      <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{f}</span>
                    ))}
                    {featuresList.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{featuresList.length - 4} more</span>
                    )}
                  </div>
                  {!isCurrent && plan.price > 0 && (
                    <motion.button whileTap={{ scale: 0.97 }}
                      className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-bold">
                      Upgrade to {plan.name}
                    </motion.button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountsPanel;
