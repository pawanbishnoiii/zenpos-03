import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Star, Shield, Zap, ArrowLeft, ChevronRight, Clock, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const APP_FEATURES = [
  { icon: Zap, title: 'Lightning Fast Billing', desc: 'Scan barcodes & create invoices in seconds' },
  { icon: Shield, title: 'Cloud Secured Data', desc: 'End-to-end encryption with automatic backups' },
  { icon: Star, title: '10+ Store Themes', desc: 'Beautiful online store with unique URL' },
  { icon: Package, title: 'Inventory Management', desc: 'Track stock, categories & pricing in real-time' },
];

const AppDownload = () => {
  const navigate = useNavigate();
  const [apk, setApk] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('admin_apk_settings').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { setApk(data); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground">Zen POS App</span>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
            className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
            <Smartphone className="w-12 h-12 text-primary-foreground" />
          </motion.div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-foreground">Zen POS for Android</h1>
            <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
              The smartest POS system for Indian businesses. Download and start billing in minutes.
            </p>
          </div>

          {apk?.apk_url ? (
            <motion.a href={apk.apk_url} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground text-background text-base font-bold shadow-xl group">
              <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Download className="w-5 h-5" />
              </motion.div>
              Download APK
              {apk.version && <span className="text-xs opacity-60 bg-background/10 px-2 py-0.5 rounded-full">v{apk.version}</span>}
            </motion.a>
          ) : (
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-muted text-muted-foreground text-sm font-medium">
              <Clock className="w-4 h-4" /> Coming Soon
            </div>
          )}
        </motion.div>

        {/* Version Info */}
        {apk && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Latest Version</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Version</p>
                <p className="text-sm font-bold text-foreground">{apk.version || '1.0.0'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Updated</p>
                <p className="text-sm font-bold text-foreground">{new Date(apk.updated_at).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Features */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground text-center">What's Inside</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APP_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  className="p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition-shadow space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Screenshots */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground text-center">Screenshots</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {['/images/app-services-screen.jpg', '/images/app-billing-screen.jpg', '/images/app-cart-screen.jpg', '/images/app-edit-screen.jpg', '/images/app-store-manager-screen.jpg'].map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className="shrink-0 w-48 rounded-2xl overflow-hidden border border-border shadow-lg">
                <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-auto" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <button onClick={() => navigate('/auth')} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Get Started Free <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
