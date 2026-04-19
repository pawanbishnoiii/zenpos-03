import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate as animeAnimate } from 'animejs';
import {
  Car, Wrench, Zap, BarChart3, ScanLine, Printer, Star, Shield,
  ShoppingCart, Pill, Laptop, Shirt, Apple, Coffee, Scissors, BookOpen,
  Hammer, Heart, Search, Users, Receipt, Globe, ArrowRight, Check, Sparkles,
  Store, Phone, Mail, MapPin, MessageSquare, Smartphone, Lock,
  Layers, Eye, Play, ChevronDown, Award, Database, Rocket, Crown
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const storeCategories = [
  { icon: Car, name: 'Car Wash', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { icon: Wrench, name: 'Auto Parts', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { icon: ShoppingCart, name: 'Grocery', color: 'text-green-500', bg: 'bg-green-500/10' },
  { icon: Pill, name: 'Medical', color: 'text-red-500', bg: 'bg-red-500/10' },
  { icon: Laptop, name: 'Electronics', color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { icon: Shirt, name: 'Fashion', color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { icon: Apple, name: 'Fruits & Veg', color: 'text-lime-500', bg: 'bg-lime-500/10' },
  { icon: Coffee, name: 'Café', color: 'text-amber-600', bg: 'bg-amber-600/10' },
  { icon: Scissors, name: 'Salon', color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
  { icon: Hammer, name: 'Hardware', color: 'text-slate-500', bg: 'bg-slate-500/10' },
  { icon: BookOpen, name: 'Stationery', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { icon: Heart, name: 'Pet Store', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

const features = [
  { icon: ScanLine, title: 'Barcode Scanner', desc: 'Scan product barcodes with camera to instantly add items to billing or inventory' },
  { icon: Printer, title: 'Multi-Printer Support', desc: 'Connect Epson, Canon, HP, SUNMI, Samsung and more printers for instant receipt printing' },
  { icon: BarChart3, title: 'Smart Reports', desc: 'Revenue analytics, daily/weekly/monthly trends, and inventory insights' },
  { icon: Shield, title: 'Cloud Secured', desc: 'All your business data is encrypted and backed up in the cloud automatically' },
  { icon: Users, title: 'Customer CRM', desc: 'Auto-save customer profiles, track visits, spending history and vehicle info' },
  { icon: Globe, title: 'Online Store', desc: 'Get a unique public store link with 10+ beautiful themes to share your catalog' },
  { icon: Smartphone, title: 'Mobile Optimized', desc: 'Use billing, workspace and dashboard on phone with touch-optimized interface' },
  { icon: MessageSquare, title: 'WhatsApp Sharing', desc: 'Share bills, store links and receipts directly via WhatsApp' },
  { icon: Lock, title: 'Admin Controls', desc: 'Central admin dashboard to manage all businesses, users and platform features' },
];

const testimonials = [
  { name: 'Rajesh Kumar', biz: 'AutoSpa Car Wash', text: 'ZEN POS completely transformed our billing. Barcode scanning and thermal printing saves us 30 minutes daily!', avatar: '🚗' },
  { name: 'Priya Sharma', biz: 'Krishna Grocery', text: 'Managing 500+ products was a nightmare. Now I scan, bill, and track everything from my phone.', avatar: '🛒' },
  { name: 'Ahmed Khan', biz: 'TechZone Electronics', text: 'The customer management feature helps me remember every customer. My repeat business is up 40%!', avatar: '💻' },
  { name: 'Dr. Meena', biz: 'LifeCare Pharmacy', text: 'Expiry tracking and batch management has been a game changer for our pharmacy.', avatar: '💊' },
  { name: 'Sunita Devi', biz: 'Style Studio Salon', text: 'Appointment booking and service tracking makes managing my salon so much easier.', avatar: '✂️' },
  { name: 'Ravi Patel', biz: 'Fresh Farm Veggies', text: 'Weight-based billing is perfect for my vegetable shop. Daily price updates are so simple now.', avatar: '🥬' },
];

const howItWorks = [
  { step: '01', title: 'Sign Up Free', desc: 'Create your account with email. No credit card needed.', icon: Users },
  { step: '02', title: 'Choose Category', desc: 'Select your business type from 15+ categories.', icon: Layers },
  { step: '03', title: 'Add Products', desc: 'Pick from 100+ pre-built gallery or scan barcodes.', icon: ScanLine },
  { step: '04', title: 'Start Billing', desc: 'Create invoices, print receipts, share on WhatsApp.', icon: Receipt },
];

const platformStats = [
  { val: '15+', label: 'Business Types', icon: Store },
  { val: '100+', label: 'Pre-built Products', icon: Database },
  { val: '9+', label: 'Printer Brands', icon: Printer },
  { val: '10', label: 'Store Themes', icon: Eye },
];

const horizontalCards = [
  { icon: ScanLine, title: 'Smart Billing', desc: 'Scan barcodes, auto-calculate tax, print thermal receipts — all in under 10 seconds per bill.', color: 'from-orange-500 to-red-500', stat: '10x', statLabel: 'Faster Checkout' },
  { icon: Globe, title: 'Online Store', desc: '10+ premium themes with SEO, QR codes, reviews, and WhatsApp ordering built-in.', color: 'from-blue-500 to-cyan-500', stat: '10+', statLabel: 'Theme Options' },
  { icon: Users, title: 'CRM Built-in', desc: 'Auto-save every customer visit, vehicle info, credit ledger, and spending history.', color: 'from-green-500 to-emerald-500', stat: '40%', statLabel: 'More Repeat Biz' },
  { icon: BarChart3, title: 'Analytics', desc: 'Revenue trends, expense tracking, profit margins — all visualized in beautiful charts.', color: 'from-purple-500 to-pink-500', stat: '24/7', statLabel: 'Real-time Data' },
  { icon: Printer, title: 'Print Anywhere', desc: 'Bluetooth, WiFi, USB printer support for Epson, Canon, HP, SUNMI, and 5+ more brands.', color: 'from-amber-500 to-orange-500', stat: '9+', statLabel: 'Printer Brands' },
  { icon: Shield, title: 'Secure Cloud', desc: 'End-to-end encryption, automatic daily backups, row-level security for every business.', color: 'from-teal-500 to-cyan-500', stat: '99.9%', statLabel: 'Uptime SLA' },
  { icon: Smartphone, title: 'Mobile First', desc: 'Touch-optimized interface that works beautifully on any phone or tablet.', color: 'from-rose-500 to-pink-500', stat: '100%', statLabel: 'Responsive' },
  { icon: MessageSquare, title: 'WhatsApp', desc: 'Share bills, store links, and receipts directly via WhatsApp with one tap.', color: 'from-emerald-500 to-green-600', stat: '1-Tap', statLabel: 'Bill Sharing' },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const landingProgressRef = useRef<HTMLDivElement>(null);
  const finderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [loading, navigate, user]);

  // Fetch dynamic pricing plans
  useEffect(() => {
    supabase.from('subscription_plans').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setPlans(data);
    });
  }, []);

  // GSAP Animations
  useEffect(() => {
    let removeCtaListeners: (() => void) | null = null;
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-badge', { y: 30, opacity: 0, duration: 0.45 })
        .from('.hero-word', { yPercent: 120, opacity: 0, duration: 0.8, stagger: 0.07 }, '-=0.1')
        .from('.hero-subtitle', { y: 24, opacity: 0, duration: 0.55 }, '-=0.4')
        .from('.hero-cta', { scale: 0.92, opacity: 0, duration: 0.4 }, '-=0.3')
        .from('.hero-stat', { y: 16, opacity: 0, stagger: 0.08, duration: 0.35 }, '-=0.2');

      if (landingProgressRef.current) {
        gsap.to(landingProgressRef.current, {
          scaleX: 1,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: {
            trigger: document.documentElement,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
        gsap.from(el, {
          y: 60, opacity: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      if (dashboardRef.current) {
        gsap.to('.dashboard-desktop', {
          y: -40, ease: 'none',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.dashboard-mobile', {
          y: -80, ease: 'none',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }

      mm.add('(min-width: 1024px)', () => {
        if (horizontalRef.current && horizontalTrackRef.current) {
          const track = horizontalTrackRef.current;
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + 80),
            ease: 'none',
            scrollTrigger: {
              trigger: horizontalRef.current,
              start: 'top top',
              end: () => `+=${Math.max(track.scrollWidth - window.innerWidth + 200, 700)}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
            },
          });
        }
      });

      // Counter animations
      gsap.utils.toArray<HTMLElement>('.gsap-counter').forEach(el => {
        gsap.from(el, {
          textContent: 0, duration: 2, ease: 'power1.out', snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: function () { el.textContent = Math.round(parseFloat(el.textContent || '0')).toString(); }
        });
      });

      if (ctaButtonRef.current) {
        const ctaElement = ctaButtonRef.current;
        const ctaX = gsap.quickTo(ctaButtonRef.current, 'x', { duration: 0.25, ease: 'power3' });
        const ctaY = gsap.quickTo(ctaButtonRef.current, 'y', { duration: 0.25, ease: 'power3' });
        const reset = () => {
          ctaX(0);
          ctaY(0);
        };
        const onMouseMove = (e: MouseEvent) => {
          const rect = ctaElement.getBoundingClientRect();
          if (!rect) return;
          const strength = 0.18;
          ctaX((e.clientX - (rect.left + rect.width / 2)) * strength);
          ctaY((e.clientY - (rect.top + rect.height / 2)) * strength);
        };
        ctaElement.addEventListener('mousemove', onMouseMove);
        ctaElement.addEventListener('mouseleave', reset);

        removeCtaListeners = () => {
          ctaElement.removeEventListener('mousemove', onMouseMove);
          ctaElement.removeEventListener('mouseleave', reset);
        };
      }
    });

    try {
      animeAnimate('.anime-float', {
        translateY: [-5, 5], duration: 3000, direction: 'alternate', ease: 'inOutSine', loop: true,
      });
    } catch {}

    return () => {
      removeCtaListeners?.();
      mm.revert();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [plans.length]);

  const goToStore = () => {
    const val = finderInputRef.current?.value.trim();
    if (val) navigate(`/store/${val}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      <div ref={landingProgressRef} className="fixed top-0 left-0 h-1 w-full z-[60] bg-primary/80 scale-x-0" />
      {/* Grid Background */}
      <div className="pointer-events-none fixed inset-0 opacity-15" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border) / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.5) 1px, transparent 1px)',
        backgroundSize: '40px 40px', maskImage: 'radial-gradient(circle at center, black 20%, transparent 75%)',
      }} />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-96" style={{ background: 'linear-gradient(180deg, hsl(var(--primary) / 0.12), transparent)' }} />

      {/* Floating orbs */}
      <motion.div animate={{ y: [0, -20, 0], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} className="pointer-events-none fixed top-32 left-[10%] w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent)' }} />
      <motion.div animate={{ y: [0, 20, 0], x: [0, -15, 0] }} transition={{ duration: 10, repeat: Infinity }} className="pointer-events-none fixed top-64 right-[15%] w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, hsl(var(--accent)), transparent)' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 15 }} className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg font-bold font-display text-foreground">ZEN <span className="gradient-primary-text">POS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#categories" className="hover:text-foreground transition-colors">Categories</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Login</button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
              className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-bold glow-primary">
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Hero */}
        <section ref={heroRef} className="pt-16 pb-20 md:pt-24 md:pb-32 text-center space-y-8">
          <div>
            <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
              className="hero-badge inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> B2B SaaS for Store Owners — Start Free
            </motion.span>
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold font-display text-foreground leading-tight">
              <span className="inline-block overflow-hidden align-bottom"><span className="hero-word inline-block">The Smartest</span></span>{' '}
              <span className="inline-block overflow-hidden align-bottom"><span className="hero-word inline-block gradient-primary-text">POS System</span></span>{' '}
              <br className="hidden md:block" />
              <span className="inline-block overflow-hidden align-bottom"><span className="hero-word inline-block">for Every Indian Business</span></span>
            </h1>
            <p className="hero-subtitle text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
              Billing, inventory, customer management, online store, email alerts and analytics — all in one beautiful app.
              Built for car washes, grocery, medical, electronics, fashion, cafés, salons and 8+ more categories.
            </p>
          </div>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.button ref={ctaButtonRef} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-sm glow-primary flex items-center justify-center gap-2 shadow-xl">
              Start Free Now <Rocket className="w-4 h-4" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-sm flex items-center justify-center gap-2">
              <Play className="w-4 h-4" /> Explore Features
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 md:gap-10 pt-8">
            {platformStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="hero-stat text-center anime-float">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold font-display gradient-primary-text">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="pt-4">
            <ChevronDown className="w-5 h-5 mx-auto text-muted-foreground/50" />
          </motion.div>
        </section>

        {/* Dashboard Preview */}
        <section ref={dashboardRef} className="gsap-reveal py-16 md:py-20">
          <div className="text-center space-y-3 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Live Preview</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Beautiful Dashboard</h2>
            <p className="text-sm text-muted-foreground">See how your business looks on desktop and mobile</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="dashboard-desktop rounded-3xl overflow-hidden border border-border/50 shadow-elevated bg-card">
              <div className="h-8 bg-secondary flex items-center gap-1.5 px-4">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-warning/50" />
                <div className="w-3 h-3 rounded-full bg-success/50" />
                <span className="ml-4 text-[10px] text-muted-foreground font-medium">zenpos.app/dashboard</span>
              </div>
              <img src="/images/dashboard-desktop.png" alt="Zen POS Dashboard Desktop View" className="w-full" loading="lazy" />
            </div>
            <div className="dashboard-mobile absolute -right-4 md:right-8 -bottom-8 w-32 md:w-48">
              <div className="rounded-3xl overflow-hidden border-4 border-foreground/10 shadow-2xl bg-card">
                <div className="h-6 bg-foreground/5 flex items-center justify-center">
                  <div className="w-12 h-1.5 rounded-full bg-foreground/10" />
                </div>
                <img src="/images/dashboard-mobile.jpg" alt="Zen POS Dashboard Mobile View" className="w-full" loading="lazy" />
              </div>
            </div>
          </div>
          <div className="dashboard-desktop mt-12 rounded-3xl overflow-hidden border border-border/50 shadow-elevated bg-card max-w-4xl mx-auto">
            <div className="h-8 bg-secondary flex items-center gap-1.5 px-4">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-warning/50" />
              <div className="w-3 h-3 rounded-full bg-success/50" />
              <span className="ml-4 text-[10px] text-muted-foreground font-medium">zenpos.app/dashboard — Quick Actions</span>
            </div>
            <img src="/images/dashboard-desktop2.png" alt="Zen POS Quick Actions" className="w-full" loading="lazy" />
          </div>
        </section>

        {/* Store Categories */}
        <section id="categories" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">15+ Categories</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Works for Every Store</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">No matter what you sell — ZEN POS adapts to your business with custom dashboards and workflows</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {storeCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl glass-card shadow-soft p-4 text-center space-y-2 hover:shadow-elevated transition-all cursor-pointer group"
                  onClick={() => navigate('/auth')}>
                  <motion.div whileHover={{ rotate: 10 }} className={`w-12 h-12 mx-auto rounded-xl ${cat.bg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </motion.div>
                  <p className="text-xs font-semibold text-foreground">{cat.name}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Powerful Tools</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
                  className="rounded-2xl glass-card shadow-soft p-5 space-y-3 hover:shadow-elevated transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Simple Setup</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Get Started in 3 Minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {howItWorks.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }} className="rounded-2xl glass-card shadow-soft p-6 space-y-3 text-center relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 text-8xl font-bold font-display text-primary/5">{s.step}</div>
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-xl font-bold font-display gradient-primary-text">{s.step}</span>
                  <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Horizontal Scroll with Creative Cards */}
      <section ref={horizontalRef} className="relative min-h-[85vh] lg:h-screen flex items-center overflow-x-auto lg:overflow-hidden bg-gradient-to-r from-background via-card to-background">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div ref={horizontalTrackRef} className="flex gap-8 px-[10vw] py-8 lg:py-0 items-center">
          <div className="min-w-[40vw] md:min-w-[30vw] shrink-0 pr-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Why Choose Us</span>
            <h2 className="text-3xl md:text-5xl font-bold font-display text-foreground mt-2">Built for<br /><span className="gradient-primary-text">Indian Businesses</span></h2>
            <p className="text-sm text-muted-foreground mt-3 max-w-xs">Scroll to explore the powerful features that make ZEN POS the #1 choice.</p>
          </div>
          {horizontalCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="min-w-[320px] md:min-w-[380px] shrink-0 rounded-3xl glass-card shadow-elevated p-0 overflow-hidden hover:scale-[1.02] transition-transform group">
                {/* Card gradient header */}
                <div className={`bg-gradient-to-br ${f.color} p-6 pb-10 relative`}>
                  <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 blur-2xl" />
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                </div>
                {/* Card body */}
                <div className="p-6 -mt-4 relative">
                  {/* Floating stat badge */}
                  <div className="absolute -top-6 right-6 px-4 py-2 rounded-2xl bg-card border border-border shadow-lg text-center">
                    <p className="text-lg font-black gradient-primary-text">{f.stat}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">{f.statLabel}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-4">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8">
        {/* Testimonials */}
        <section id="testimonials" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Happy Owners</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Loved by Business Owners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}
                className="rounded-2xl glass-card shadow-soft p-5 space-y-3 hover:shadow-elevated transition-all">
                <div className="flex gap-1">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-warning fill-warning" />)}</div>
                <p className="text-sm text-foreground italic leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.avatar}</span>
                  <div><p className="text-xs font-bold text-foreground">{t.name}</p><p className="text-[10px] text-muted-foreground">{t.biz}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Dynamic Pricing */}
        <section id="pricing" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Pricing Plans</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              {plans.length > 0 ? 'Choose Your Plan' : 'Free Forever'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {plans.length > 0 ? 'Flexible plans for every business size' : 'No hidden charges. Everything included.'}
            </p>
          </div>

          {plans.length > 0 ? (
            <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-2xl' : plans.length >= 3 ? 'md:grid-cols-3 max-w-4xl' : 'max-w-md'} mx-auto gap-5`}>
              {plans.map((plan, i) => {
                const featuresList = Array.isArray(plan.features) ? plan.features : [];
                const isPopular = i === 1 && plans.length > 1;
                return (
                  <motion.div key={plan.id} whileHover={{ y: -6, scale: 1.02 }}
                    className={`rounded-3xl glass-card p-7 space-y-5 relative overflow-hidden transition-all ${isPopular ? 'shadow-elevated border-2 border-primary/30 ring-2 ring-primary/10' : 'shadow-soft border border-border/50'}`}>
                    {isPopular && <div className="absolute top-0 inset-x-0 h-1 gradient-primary" />}
                    {isPopular && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                        <Crown className="w-3 h-3" /> Most Popular
                      </span>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-wider text-primary">{plan.name}</p>
                      <p className="text-4xl font-bold font-display text-foreground">
                        {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                        {plan.price > 0 && <span className="text-base font-normal text-muted-foreground">/{plan.interval}</span>}
                      </p>
                    </div>
                    <div className="space-y-2">
                      {featuresList.map((f: string, j: number) => (
                        <div key={j} className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-success" /></div>
                          <span className="text-sm text-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm ${isPopular ? 'gradient-primary text-primary-foreground glow-primary' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                      {plan.price === 0 ? 'Start Free' : 'Subscribe Now'}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <motion.div whileHover={{ y: -4 }}
                className="rounded-3xl glass-card shadow-elevated p-8 space-y-5 border-2 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1 gradient-primary" />
                <div className="text-center space-y-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-bold mb-2"><Award className="w-3 h-3" /> Best Value</span>
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">Free Plan</p>
                  <p className="text-5xl font-bold font-display text-foreground">₹0<span className="text-base font-normal text-muted-foreground">/month</span></p>
                </div>
                <div className="space-y-2.5">
                  {['Unlimited Products & Services', 'Barcode Scanner & Multi-Printer', 'Customer CRM', 'Online Store with 10 Themes', 'Revenue Reports', 'WhatsApp Sharing', 'Cloud Backup', 'Email Notifications'].map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-success" /></div>
                      <span className="text-sm text-foreground">{f}</span>
                    </div>
                  ))}
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                  className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm glow-primary">
                  Get Started Free
                </motion.button>
              </motion.div>
            </div>
          )}
        </section>

        {/* Find Store */}
        <section className="gsap-reveal py-16 md:py-20 space-y-6">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Discover</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Find a Store</h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                ref={finderInputRef}
                type="text"
                placeholder="Enter store name or slug..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    goToStore();
                  }
                }} />
              <button
                type="button"
                onClick={goToStore}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 text-xs font-semibold rounded-xl bg-primary text-primary-foreground"
              >
                Open
              </button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: 'Is ZEN POS really free?', a: 'Yes! ZEN POS offers a free plan with all core features. Premium plans available for advanced features.' },
              { q: 'Can I use it on my phone?', a: 'Absolutely! ZEN POS is built mobile-first with touch-optimized interfaces.' },
              { q: 'Which printers are supported?', a: 'We support Epson, Canon, HP, Samsung, SUNMI, Star Micronics, Citizen and generic thermal printers.' },
              { q: 'Can I have an online store?', a: 'Yes! Every business gets a unique public store URL with 10+ beautiful themes.' },
              { q: 'Is my data secure?', a: 'All data is encrypted with row-level security and automatic cloud backups.' },
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl glass-card shadow-soft p-5 space-y-2">
                <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="gsap-reveal py-16 md:py-20 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Get in Touch</span>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Contact Us</h2>
          </div>
          <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Phone, label: 'Call Us', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'hello@zenpos.in' },
              { icon: MapPin, label: 'Location', value: 'India 🇮🇳' },
            ].map(c => {
              const Icon = c.icon;
              return (
                <motion.div key={c.label} whileHover={{ y: -3 }} className="rounded-2xl glass-card shadow-soft p-5 text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                  <p className="text-xs font-bold text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="gsap-reveal py-16 md:py-20">
          <motion.div whileHover={{ scale: 1.01 }}
            className="rounded-3xl gradient-primary p-8 md:p-14 text-center space-y-5 glow-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold font-display text-primary-foreground">Ready to Simplify Your Business?</h2>
              <p className="text-primary-foreground/80 text-sm max-w-md mx-auto mt-3">Join thousands of business owners who use ZEN POS to save time, increase revenue, and delight customers.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                className="mt-6 px-10 py-4 rounded-2xl bg-primary-foreground text-primary font-bold text-sm shadow-xl">
                Start Free Today — No Credit Card
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"><Zap className="w-4 h-4 text-primary-foreground" /></div>
                <span className="text-sm font-bold font-display text-foreground">ZEN POS</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">The smartest B2B SaaS POS system for every Indian business.</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Product</p>
              <div className="space-y-1.5">{[
                { label: 'Features', href: '#features' },
                { label: 'Categories', href: '#categories' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Testimonials', href: '#testimonials' },
              ].map((l) => <a key={l.label} href={l.href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Support</p>
              <div className="space-y-1.5">{[
                { label: 'Contact Us', href: '#contact' },
                { label: 'FAQ', href: '#faq' },
                { label: 'Help Center', href: '#features' },
                { label: 'Privacy Policy', href: '#contact' },
              ].map((l) => <a key={l.label} href={l.href} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Connect</p>
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="w-3 h-3" /> +91 98765 43210</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Mail className="w-3 h-3" /> hello@zenpos.in</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Made in India 🇮🇳</p>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">© 2026 ZEN POS. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Terms</span><span>Privacy</span><span>Cookies</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
