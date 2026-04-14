import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Car, Wrench, Zap, BarChart3, ScanLine, Printer, ChevronRight, Star, Shield,
  ShoppingCart, Pill, Laptop, Shirt, Apple, Coffee, Scissors, BookOpen,
  Hammer, Heart, Search, Users, Receipt, Globe, ArrowRight, Check, Sparkles,
  Store, Phone, Mail, MapPin, MessageSquare, Smartphone, Clock, Lock,
  Layers, TrendingUp, Eye, Play, ChevronDown, Award, Wifi, Database, Rocket, Crown,
  Download, ChevronUp
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

const appScreenshots = [
  { src: '/images/app-services-screen.jpg', label: 'Services', desc: 'Manage all your services with images, pricing, and categories' },
  { src: '/images/app-edit-screen.jpg', label: 'Edit Product', desc: 'Edit product details, pricing, stock, and barcodes in one place' },
  { src: '/images/app-billing-screen.jpg', label: 'Billing', desc: 'Beautiful grid-based billing with category filters and quick add' },
  { src: '/images/app-cart-screen.jpg', label: 'Cart & CRM', desc: 'Smart cart with customer search, credit management, and payment options' },
  { src: '/images/app-store-manager-screen.jpg', label: 'Store Manager', desc: 'Full store management with themes, preview, SEO, and customization' },
];

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [apkUrl, setApkUrl] = useState('');
  const [apkVersion, setApkVersion] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const appShowcaseRef = useRef<HTMLDivElement>(null);
  const builtForRef = useRef<HTMLDivElement>(null);

  if (!loading && user) { navigate('/', { replace: true }); }

  // Fetch dynamic pricing plans + APK
  useEffect(() => {
    supabase.from('subscription_plans').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data && data.length > 0) setPlans(data);
    });
    supabase.from('admin_apk_settings').select('*').limit(1).maybeSingle().then(({ data }) => {
      if (data) { setApkUrl(data.apk_url || ''); setApkVersion(data.version || ''); }
    });
  }, []);

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal with split effect
      gsap.from('.hero-title', { y: 100, opacity: 0, duration: 1.4, ease: 'expo.out', delay: 0.2 });
      gsap.from('.hero-subtitle', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.6 });
      gsap.from('.hero-cta', { scale: 0.5, opacity: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 1 });
      gsap.from('.hero-stats > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 1.2 });

      // Scroll-triggered reveals with stagger
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
        gsap.from(el, {
          y: 80, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
        });
      });

      // Blur transition sections
      gsap.utils.toArray<HTMLElement>('.gsap-blur-in').forEach(el => {
        gsap.from(el, {
          filter: 'blur(20px)', opacity: 0, y: 40, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      });

      // Parallax dashboard preview
      if (dashboardRef.current) {
        gsap.to('.dashboard-desktop', {
          y: -60, ease: 'none',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
        gsap.to('.dashboard-mobile', {
          y: -100, ease: 'none',
          scrollTrigger: { trigger: dashboardRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
        });
      }

      // Horizontal scroll - "Built for Indian Businesses" rises from bottom then scrolls right
      if (horizontalRef.current && horizontalTrackRef.current) {
        const track = horizontalTrackRef.current;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: horizontalRef.current,
            start: 'top top',
            end: () => `+=${track.scrollWidth - window.innerWidth + 400}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });

        // Title rises from bottom first
        tl.from('.horizontal-title', { y: 120, opacity: 0, duration: 0.3, ease: 'power3.out' });
        // Then scroll right
        tl.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth + 80),
          ease: 'none',
          duration: 1,
        }, 0.15);
      }

      // App showcase parallax stagger
      if (appShowcaseRef.current) {
        gsap.from('.app-phone', {
          y: 80, opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: appShowcaseRef.current, start: 'top 70%' }
        });
      }

      // Counter animations
      gsap.utils.toArray<HTMLElement>('.gsap-counter').forEach(el => {
        const target = parseInt(el.dataset.target || '0');
        gsap.from(el, {
          textContent: 0, duration: 2, ease: 'power1.out', snap: { textContent: 1 },
          scrollTrigger: { trigger: el, start: 'top 90%' },
          onUpdate: function () { el.textContent = Math.round(parseFloat(el.textContent || '0')).toString(); }
        });
      });

      // Stagger animations for feature cards
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((el, i) => {
        gsap.from(el, {
          y: 60, opacity: 0, scale: 0.95, duration: 0.7, ease: 'power3.out',
          delay: i * 0.05,
          scrollTrigger: { trigger: el, start: 'top 90%' }
        });
      });

      // Text reveal for section headings
      gsap.utils.toArray<HTMLElement>('.text-reveal').forEach(el => {
        gsap.from(el, {
          y: 50, opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        });
      });
    });

    return () => ctx.revert();
  }, []);

  // Mouse follow effect
  useEffect(() => {
    const cursor = document.getElementById('cursor-glow');
    if (!cursor) return;
    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Mouse follow glow */}
      <div id="cursor-glow" className="pointer-events-none fixed w-[300px] h-[300px] rounded-full opacity-[0.04] blur-3xl transition-transform duration-300 ease-out z-0"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent)' }} />

      {/* Grid Background */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.08]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px)',
        backgroundSize: '50px 50px', maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
      }} />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-[600px]" style={{ background: 'linear-gradient(180deg, hsl(var(--primary) / 0.08), transparent)' }} />

      {/* Floating orbs with 3D feel */}
      <motion.div animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.1, 1] }} transition={{ duration: 10, repeat: Infinity }} className="pointer-events-none fixed top-20 left-[5%] w-72 h-72 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, hsl(var(--primary)), transparent)' }} />
      <motion.div animate={{ y: [0, 25, 0], x: [0, -20, 0] }} transition={{ duration: 12, repeat: Infinity }} className="pointer-events-none fixed top-[40%] right-[10%] w-56 h-56 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, hsl(25 95% 60%), transparent)' }} />
      <motion.div animate={{ y: [0, -15, 0], x: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity }} className="pointer-events-none fixed bottom-[20%] left-[20%] w-40 h-40 rounded-full opacity-[0.05]" style={{ background: 'radial-gradient(circle, hsl(var(--accent)), transparent)' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-background/70 border-b border-border/30">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg font-bold font-display text-foreground">ZEN <span className="gradient-primary-text">POS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors duration-300">Features</a>
            <a href="#categories" className="hover:text-foreground transition-colors duration-300">Categories</a>
            <a href="#app-showcase" className="hover:text-foreground transition-colors duration-300">App</a>
            <a href="#pricing" className="hover:text-foreground transition-colors duration-300">Pricing</a>
            <a href="#contact" className="hover:text-foreground transition-colors duration-300">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/auth')} className="px-4 py-2 rounded-xl text-sm font-semibold text-foreground hover:bg-secondary transition-colors">Login</button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
              className="px-5 py-2 rounded-xl gradient-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20">
              Get Started
            </motion.button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Hero */}
        <section ref={heroRef} className="pt-16 pb-24 md:pt-28 md:pb-36 text-center space-y-8">
          <div>
            <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> B2B SaaS for Store Owners — Start Free
            </motion.span>
            <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold font-display text-foreground leading-[1.1]">
              The Smartest <span className="gradient-primary-text">POS System</span> <br className="hidden md:block" />
              for Every Indian Business
            </h1>
            <p className="hero-subtitle text-muted-foreground text-base md:text-xl max-w-2xl mx-auto mt-6 leading-relaxed">
              Billing, inventory, customer management, online store, email alerts and analytics — all in one beautiful app.
            </p>
          </div>

          <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <motion.button whileHover={{ scale: 1.03, boxShadow: '0 20px 40px -10px hsl(var(--primary) / 0.4)' }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/20 flex items-center justify-center gap-2 transition-shadow">
              Start Free Now <Rocket className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-secondary text-secondary-foreground font-semibold text-base flex items-center justify-center gap-2 border border-border/50">
              <Play className="w-4 h-4" /> Explore Features
            </motion.button>
          </div>

          {/* Stats */}
          <div className="hero-stats flex items-center justify-center gap-6 md:gap-12 pt-8">
            {platformStats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + i * 0.5, repeat: Infinity }}
                    className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-2 border border-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <p className="text-2xl md:text-3xl font-bold font-display gradient-primary-text">{s.val}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="pt-6">
            <ChevronDown className="w-6 h-6 mx-auto text-muted-foreground/40" />
          </motion.div>
        </section>

        {/* Dashboard Preview with Parallax */}
        <section ref={dashboardRef} className="gsap-blur-in py-16 md:py-24">
          <div className="text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Live Preview</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Beautiful Dashboard</h2>
            <p className="text-sm text-muted-foreground">See how your business looks on desktop and mobile</p>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="dashboard-desktop rounded-3xl overflow-hidden border border-border/30 shadow-2xl bg-card">
              <div className="h-9 bg-secondary/80 flex items-center gap-1.5 px-4 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <span className="ml-4 text-[10px] text-muted-foreground font-medium">zenpos.app/dashboard</span>
              </div>
              <img src="/images/dashboard-desktop.png" alt="Zen POS Dashboard Desktop View" className="w-full" loading="lazy" />
            </div>
            <div className="dashboard-mobile absolute -right-2 md:right-8 -bottom-12 w-36 md:w-52">
              <div className="rounded-[2rem] overflow-hidden border-[5px] border-foreground/10 shadow-2xl bg-card">
                <div className="h-7 bg-foreground/5 flex items-center justify-center">
                  <div className="w-14 h-1.5 rounded-full bg-foreground/10" />
                </div>
                <img src="/images/dashboard-mobile.jpg" alt="Zen POS Dashboard Mobile View" className="w-full" loading="lazy" />
              </div>
            </div>
          </div>
        </section>

        {/* App Showcase - Mobile Screenshots */}
        <section id="app-showcase" ref={appShowcaseRef} className="gsap-blur-in py-20 md:py-28 space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Mobile App</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Everything on Your Phone</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">Manage your entire business from your pocket — billing, products, customers, and store management</p>
          </div>
          <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar px-4 -mx-4 pb-8 snap-x snap-mandatory">
            {appScreenshots.map((screen, i) => (
              <motion.div key={screen.label}
                className="app-phone shrink-0 snap-center group"
                whileHover={{ y: -12, rotateY: 5 }}
                style={{ perspective: '1000px' }}>
                <div className="w-[240px] md:w-[280px] rounded-[2rem] overflow-hidden border-[5px] border-foreground/10 shadow-2xl bg-card relative">
                  <div className="h-6 bg-foreground/5 flex items-center justify-center">
                    <div className="w-12 h-1.5 rounded-full bg-foreground/10" />
                  </div>
                  <img src={screen.src} alt={screen.label} className="w-full" loading="lazy" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <div>
                      <p className="text-white text-sm font-bold">{screen.label}</p>
                      <p className="text-white/70 text-xs mt-1">{screen.desc}</p>
                    </div>
                  </div>
                </div>
                <p className="text-center text-xs font-semibold text-muted-foreground mt-3">{screen.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Store Categories */}
        <section id="categories" className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">15+ Categories</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Works for Every Store</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">No matter what you sell — ZEN POS adapts to your business</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {storeCategories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.08, y: -8 }}
                  className="feature-card rounded-2xl glass-card shadow-soft p-4 text-center space-y-2 hover:shadow-elevated transition-all cursor-pointer group border border-border/30"
                  onClick={() => navigate('/auth')}>
                  <motion.div whileHover={{ rotate: 10 }} className={`w-12 h-12 mx-auto rounded-xl ${cat.bg} flex items-center justify-center backdrop-blur-sm`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </motion.div>
                  <p className="text-xs font-semibold text-foreground">{cat.name}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Features Grid with stagger */}
        <section id="features" className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Powerful Tools</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  className="feature-card rounded-2xl glass-card shadow-soft p-6 space-y-3 hover:shadow-elevated transition-all group border border-border/30"
                  whileHover={{ y: -6 }}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform border border-primary/10">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Simple Setup</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Get Started in 3 Minutes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {howItWorks.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.15, ease: 'easeOut' }} className="feature-card rounded-2xl glass-card shadow-soft p-6 space-y-3 text-center relative overflow-hidden border border-border/30">
                  <div className="absolute -top-6 -right-6 text-[100px] font-bold font-display text-primary/[0.03]">{s.step}</div>
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/10">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-2xl font-bold font-display gradient-primary-text">{s.step}</span>
                  <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Horizontal Scroll - Built for Indian Businesses */}
      <section ref={horizontalRef} className="relative h-screen flex items-center overflow-hidden bg-gradient-to-r from-background via-card to-background">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }} />
        {/* Gooey overlay effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-40 h-40 rounded-full opacity-[0.05] blur-3xl animate-pulse" style={{ background: 'hsl(var(--primary))' }} />
          <div className="absolute bottom-[20%] right-[15%] w-56 h-56 rounded-full opacity-[0.04] blur-3xl animate-pulse" style={{ background: 'hsl(25 95% 60%)', animationDelay: '2s' }} />
        </div>
        <div ref={horizontalTrackRef} className="flex gap-8 px-[10vw] items-center">
          <div className="horizontal-title min-w-[40vw] md:min-w-[35vw] shrink-0 pr-4">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why Choose Us</span>
            <h2 className="text-3xl md:text-6xl font-bold font-display text-foreground mt-3 leading-[1.1]">Built for<br /><span className="gradient-primary-text">Indian Businesses</span></h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-sm">Scroll to explore the powerful features that make ZEN POS the #1 choice for store owners across India.</p>
          </div>
          {horizontalCards.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="min-w-[300px] md:min-w-[380px] shrink-0 rounded-3xl glass-card shadow-elevated p-0 overflow-hidden hover:scale-[1.03] transition-all duration-500 group border border-border/30">
                <div className={`bg-gradient-to-br ${f.color} p-6 pb-12 relative overflow-hidden`}>
                  <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/5 blur-xl" />
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/10">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{f.title}</h3>
                </div>
                <div className="p-6 -mt-6 relative">
                  <div className="absolute -top-7 right-6 px-5 py-2.5 rounded-2xl bg-card border border-border shadow-xl text-center">
                    <p className="text-xl font-black gradient-primary-text">{f.stat}</p>
                    <p className="text-[9px] text-muted-foreground font-medium">{f.statLabel}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-6">{f.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-3 transition-all duration-300">
                    Learn more <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        {/* Testimonials */}
        <section className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Happy Owners</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Loved by Business Owners</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }} whileHover={{ y: -4 }}
                className="feature-card rounded-2xl glass-card shadow-soft p-6 space-y-3 hover:shadow-elevated transition-all border border-border/30">
                <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-warning fill-warning" />)}</div>
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
        <section id="pricing" className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Pricing Plans</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">
              {plans.length > 0 ? 'Choose Your Plan' : 'Free Forever'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {plans.length > 0 ? 'Flexible plans for every business size' : 'No hidden charges. Everything included.'}
            </p>
          </div>

          {plans.length > 0 ? (
            <div className={`grid grid-cols-1 ${plans.length === 2 ? 'md:grid-cols-2 max-w-2xl' : plans.length >= 3 ? 'md:grid-cols-3 max-w-5xl' : 'max-w-md'} mx-auto gap-6`}>
              {plans.map((plan, i) => {
                const featuresList = Array.isArray(plan.features) ? plan.features : [];
                const isPopular = i === 1 && plans.length > 1;
                return (
                  <motion.div key={plan.id} whileHover={{ y: -8, scale: 1.02 }}
                    className={`feature-card rounded-3xl glass-card p-7 space-y-5 relative overflow-hidden transition-all ${isPopular ? 'shadow-elevated border-2 border-primary/40 ring-2 ring-primary/10' : 'shadow-soft border border-border/50'}`}>
                    {isPopular && <div className="absolute top-0 inset-x-0 h-1.5 gradient-primary" />}
                    {isPopular && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
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
                    <div className="space-y-2.5">
                      {featuresList.map((f: string, j: number) => (
                        <div key={j} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3 text-success" /></div>
                          <span className="text-sm text-foreground">{f}</span>
                        </div>
                      ))}
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${isPopular ? 'gradient-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                      {plan.price === 0 ? 'Start Free' : 'Subscribe Now'}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <motion.div whileHover={{ y: -6 }}
                className="rounded-3xl glass-card shadow-elevated p-8 space-y-5 border-2 border-primary/20 relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-1.5 gradient-primary" />
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
                  className="w-full py-3.5 rounded-xl gradient-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/20">
                  Get Started Free
                </motion.button>
              </motion.div>
            </div>
          )}
        </section>

        {/* Find Store */}
        <section className="gsap-blur-in py-16 md:py-24 space-y-6">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Discover</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Find a Store</h2>
          </div>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input type="text" placeholder="Enter store name or slug..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-card border border-border/50 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-soft"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) navigate(`/store/${val}`);
                  }
                }} />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-3">
            {[
              { q: 'Is ZEN POS really free?', a: 'Yes! ZEN POS offers a free plan with all core features. Premium plans with advanced features like custom invoice branding, multi-staff access, and email notifications are available.' },
              { q: 'Can I use it on my phone?', a: 'Absolutely! ZEN POS is built mobile-first with touch-optimized interfaces. We also offer an Android app for download.' },
              { q: 'Which printers are supported?', a: 'We support Epson, Canon, HP, Samsung, SUNMI, Star Micronics, Citizen and generic thermal printers.' },
              { q: 'Can I have an online store?', a: 'Yes! Every business gets a unique public store URL with 10+ beautiful themes including Car Wash, Auto Service, Grocery, Fashion and more.' },
              { q: 'Is my data secure?', a: 'All data is encrypted with row-level security and automatic cloud backups. You can also export your data anytime.' },
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="feature-card rounded-2xl glass-card shadow-soft p-6 space-y-2 border border-border/30">
                <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="gsap-blur-in py-16 md:py-24 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Get in Touch</span>
            <h2 className="text-reveal text-3xl md:text-5xl font-bold font-display text-foreground">Contact Us</h2>
          </div>
          <div className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: Phone, label: 'Call Us', value: '+91 98765 43210' },
              { icon: Mail, label: 'Email', value: 'hello@zenpos.in' },
              { icon: MapPin, label: 'Location', value: 'India 🇮🇳' },
            ].map(c => {
              const Icon = c.icon;
              return (
                <motion.div key={c.label} whileHover={{ y: -4 }} className="feature-card rounded-2xl glass-card shadow-soft p-5 text-center space-y-2 border border-border/30">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center border border-primary/10"><Icon className="w-5 h-5 text-primary" /></div>
                  <p className="text-xs font-bold text-foreground">{c.label}</p>
                  <p className="text-xs text-muted-foreground">{c.value}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="gsap-blur-in py-16 md:py-24">
          <motion.div whileHover={{ scale: 1.01 }}
            className="rounded-3xl gradient-primary p-10 md:p-16 text-center space-y-6 shadow-2xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative">
              <h2 className="text-3xl md:text-5xl font-bold font-display text-primary-foreground">Ready to Simplify Your Business?</h2>
              <p className="text-primary-foreground/80 text-sm md:text-base max-w-md mx-auto mt-4">Join thousands of business owners who use ZEN POS to save time, increase revenue, and delight customers.</p>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/auth')}
                className="mt-8 px-12 py-4 rounded-2xl bg-primary-foreground text-primary font-bold text-base shadow-xl">
                Start Free Today — No Credit Card
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20"><Zap className="w-4 h-4 text-primary-foreground" /></div>
                <span className="text-base font-bold font-display text-foreground">ZEN POS</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">The smartest B2B SaaS POS system for every Indian business.</p>
              {/* Android Download */}
              {apkUrl && (
                <motion.a href={apkUrl} download whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-foreground text-background text-xs font-bold shadow-lg group">
                  <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <Download className="w-4 h-4" />
                  </motion.div>
                  Download Android App {apkVersion && <span className="text-[10px] opacity-60">v{apkVersion}</span>}
                </motion.a>
              )}
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Product</p>
              <div className="space-y-1.5">{['Features', 'Categories', 'Pricing', 'Online Store'].map(l => <a key={l} href={`#${l.toLowerCase().replace(' ', '-')}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>)}</div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">Support</p>
              <div className="space-y-1.5">{['Contact Us', 'FAQ', 'Help Center', 'Privacy Policy'].map(l => <a key={l} href="#contact" className="block text-xs text-muted-foreground hover:text-foreground transition-colors">{l}</a>)}</div>
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
          <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
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
