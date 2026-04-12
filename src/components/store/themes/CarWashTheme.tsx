import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, Droplets, Car, Shield, Zap, Clock, Award, ChevronRight, MessageCircle, Bike, Bus, Truck, Sparkles, Eye, CheckCircle, Play, ChevronLeft, ArrowRight, Users, Heart, Send, Calendar, X } from 'lucide-react';
import BannerSlideshow from '../BannerSlideshow';
import OffersSection from '../OffersSection';
import VideoSection from '../VideoSection';
import BeforeAfterSlider from '../BeforeAfterSlider';
import HappyCustomersSection from '../HappyCustomersSection';
import MotionFooter from '@/components/ui/motion-footer';
import { supabase } from '@/integrations/supabase/client';

interface ThemeProps {
  business: any;
  products: any[];
  reviews: any[];
  banners: any[];
  offers: any[];
  videos: any[];
  onProductClick: (p: any) => void;
  getImageSrc: (url: string) => string;
}

const VEHICLE_TYPES = [
  { id: 'car', label: 'Car', icon: Car, color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/20' },
  { id: 'bike', label: 'Bike', icon: Bike, color: 'from-orange-500 to-amber-500', glow: 'shadow-orange-500/20' },
  { id: 'truck', label: 'Truck', icon: Truck, color: 'from-slate-500 to-zinc-600', glow: 'shadow-slate-500/20' },
  { id: 'bus', label: 'Bus', icon: Bus, color: 'from-emerald-500 to-teal-500', glow: 'shadow-emerald-500/20' },
];

const WASH_STEPS = [
  { icon: Droplets, title: 'Pre-Rinse', desc: 'High-pressure dirt removal', color: 'text-blue-400' },
  { icon: Sparkles, title: 'Foam Wash', desc: 'Premium snow foam application', color: 'text-cyan-400' },
  { icon: Shield, title: 'Hand Wash', desc: 'Detailed hand cleaning', color: 'text-green-400' },
  { icon: Zap, title: 'Polish & Dry', desc: 'Ceramic coat & micro-fiber dry', color: 'text-yellow-400' },
];

const SERVICES = [
  { icon: Droplets, name: 'Exterior Wash', desc: 'Full body pressure wash', price: '₹249' },
  { icon: Sparkles, name: 'Interior Cleaning', desc: 'Vacuum + dashboard polish', price: '₹349' },
  { icon: Shield, name: 'Foam Wash', desc: 'Premium snow foam treatment', price: '₹449' },
  { icon: Zap, name: 'Ceramic Coating', desc: 'Long-lasting body protection', price: '₹1,499' },
  { icon: Car, name: 'Full Detailing', desc: 'Complete interior + exterior', price: '₹999' },
  { icon: Bike, name: 'Bike Wash', desc: 'Two-wheeler cleaning', price: '₹149' },
];

const AnimSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }} className={className}>
      {children}
    </motion.div>
  );
};

const CarWashTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [activeStep, setActiveStep] = useState(0);
  const [happyCustomers, setHappyCustomers] = useState<any[]>([]);
  const [beforeAfterMedia, setBeforeAfterMedia] = useState<any[]>([]);
  const [showBooking, setShowBooking] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', text: '', rating: 5, product_id: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const theme = {
    footerBg: 'bg-slate-950', footerText: 'text-slate-400', emoji: '🚗',
    tagline: business.tagline || 'Premium Car Wash & Detailing',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
  const currentVehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle) || VEHICLE_TYPES[0];

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(s => (s + 1) % WASH_STEPS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!business?.id) return;
    supabase.from('happy_customers').select('*').eq('business_id', business.id).order('sort_order').then(({ data }) => {
      setHappyCustomers(data || []);
    });
    supabase.from('store_media').select('*').eq('business_id', business.id).eq('media_type', 'before_after').eq('is_active', true).then(({ data }) => {
      setBeforeAfterMedia(data || []);
    });
  }, [business?.id]);

  const handleSubmitReview = async () => {
    if (!reviewForm.name.trim() || !reviewForm.product_id) return;
    setSubmittingReview(true);
    await supabase.from('product_reviews').insert({
      business_id: business.id,
      product_id: reviewForm.product_id,
      reviewer_name: reviewForm.name.trim(),
      review_text: reviewForm.text.trim() || null,
      rating: reviewForm.rating,
    });
    setReviewForm({ name: '', text: '', rating: 5, product_id: '' });
    setSubmittingReview(false);
  };

  const handleBookingWhatsApp = (service: string, date: string, time: string) => {
    const phone = business.whatsapp_number || business.phone;
    if (!phone) return;
    const msg = encodeURIComponent(`Hi! I'd like to book: ${service}\nDate: ${date}\nTime: ${time}\n\nFrom: ${business.business_name} Store`);
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Promo strip */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-500 to-cyan-600 text-white text-center py-2 text-xs font-semibold relative overflow-hidden">
        <motion.div animate={{ x: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>
          💧 Premium Wash Starting from ₹249 | ⭐ Rated {avgRating} by Happy Customers | 🎁 Free Interior on First Visit
        </motion.div>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-400/30" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Droplets className="w-5 h-5" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold tracking-tight">{business.business_name}</span>
              <p className="text-[10px] text-white/40">Premium Auto Care</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-white/50">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#process" className="hover:text-cyan-400 transition-colors">Process</a>
            <a href="#products" className="hover:text-cyan-400 transition-colors">Packages</a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowBooking(true)} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
              <Calendar className="w-3.5 h-3.5" /> Book Now
            </button>
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950" />
          {[...Array(5)].map((_, i) => (
            <motion.div key={i}
              className="absolute rounded-full border border-cyan-400/10"
              style={{ top: '50%', left: '50%', width: `${(i + 1) * 200}px`, height: `${(i + 1) * 200}px` }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
              transition={{ duration: 4, delay: i * 0.8, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div key={i}
                className="absolute w-1 h-1 rounded-full bg-white/20"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [0, -100], opacity: [0.5, 0] }}
                transition={{ duration: 3 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }}
              />
            ))}
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300">Premium Auto Care Center</span>
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                  {business.business_name}
                </span>
              </motion.h1>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-lg text-white/40 max-w-lg">
                {theme.tagline}
              </motion.p>

              {/* Vehicle Selector */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex gap-3 justify-center lg:justify-start">
                {VEHICLE_TYPES.map(v => {
                  const VIcon = v.icon;
                  const active = selectedVehicle === v.id;
                  return (
                    <motion.button key={v.id} whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1, y: -3 }}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`flex flex-col items-center gap-1.5 px-5 py-4 rounded-2xl border-2 transition-all ${active ? `border-white/20 bg-gradient-to-br ${v.color} shadow-xl ${v.glow}` : 'border-white/5 bg-white/[0.03] hover:border-white/10'}`}>
                      <VIcon className={`w-6 h-6 ${active ? 'text-white' : 'text-white/40'}`} />
                      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-white/30'}`}>{v.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <a href="#products" className={`px-8 py-4 rounded-2xl bg-gradient-to-r ${currentVehicle.color} text-white text-sm font-bold shadow-xl ${currentVehicle.glow} flex items-center gap-2 hover:opacity-90 transition-all`}>
                  <ShoppingBag className="w-4 h-4" /> View Packages <ArrowRight className="w-4 h-4" />
                </a>
                <button onClick={() => setShowBooking(true)} className="px-6 py-4 rounded-2xl border-2 border-white/10 text-sm font-bold hover:bg-white/5 transition-all flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Book Now
                </button>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}
              className="relative flex-shrink-0">
              {business.logo_url ? (
                <img src={getImageSrc(business.logo_url)} alt="" className="w-52 h-52 md:w-72 md:h-72 rounded-3xl object-cover border-2 border-white/10 shadow-2xl" />
              ) : (
                <div className={`w-52 h-52 md:w-72 md:h-72 rounded-3xl bg-gradient-to-br ${currentVehicle.color} flex items-center justify-center shadow-2xl ${currentVehicle.glow}`}>
                  <currentVehicle.icon className="w-24 h-24 text-white/80" />
                </div>
              )}
              <div className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${currentVehicle.color} opacity-15 blur-3xl -z-10`} />
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-8 top-8 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <p className="text-xl font-black text-cyan-400">{reviews.length * 10}+</p>
                <p className="text-[10px] text-white/40">Happy Customers</p>
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                className="absolute -right-6 bottom-12 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
                <p className="text-xl font-black text-yellow-400">⭐ {avgRating}</p>
                <p className="text-[10px] text-white/40">Rating</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Shield, label: 'Trusted Service', value: '100%', color: 'text-green-400' },
            { icon: Users, label: 'Happy Customers', value: `${reviews.length * 10}+`, color: 'text-blue-400' },
            { icon: Clock, label: 'Quick Service', value: '30 min', color: 'text-yellow-400' },
            { icon: Award, label: 'Expert Team', value: 'Certified', color: 'text-purple-400' },
          ].map((badge, i) => (
            <AnimSection key={badge.label} delay={i * 0.1}>
              <div className="rounded-2xl bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 text-center hover:bg-white/[0.06] transition-colors group">
                <badge.icon className={`w-6 h-6 mx-auto ${badge.color} mb-2 group-hover:scale-110 transition-transform`} />
                <p className="text-2xl font-black">{badge.value}</p>
                <p className="text-[10px] text-white/40 mt-1">{badge.label}</p>
              </div>
            </AnimSection>
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <AnimSection className="text-center mb-12">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Our Services</p>
            <h2 className="text-3xl md:text-5xl font-black">What We <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Offer</span></h2>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {SERVICES.map((s, i) => (
              <AnimSection key={s.name} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4, scale: 1.02 }}
                  className="rounded-3xl bg-white/[0.03] border border-white/5 p-6 text-center hover:border-cyan-500/20 transition-all group cursor-pointer">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <s.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-bold mb-1">{s.name}</h3>
                  <p className="text-[11px] text-white/40 mb-3">{s.desc}</p>
                  <p className="text-lg font-black text-cyan-400">{s.price}</p>
                </motion.div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Wash Process */}
      <section id="process" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <AnimSection className="text-center mb-12">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Our Process</p>
            <h2 className="text-3xl md:text-5xl font-black">How We <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Clean</span></h2>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {WASH_STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <AnimSection key={step.title} delay={i * 0.1}>
                  <motion.div
                    animate={isActive ? { scale: 1.05, borderColor: 'rgba(6, 182, 212, 0.3)' } : { scale: 1, borderColor: 'rgba(255,255,255,0.05)' }}
                    className={`rounded-3xl p-6 text-center border-2 transition-all cursor-pointer ${isActive ? 'bg-white/[0.05]' : 'bg-white/[0.02]'}`}
                    onClick={() => setActiveStep(i)}>
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isActive ? 'bg-cyan-500/20' : 'bg-white/5'} transition-colors`}>
                      <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <div className="text-xs text-white/30 font-bold mb-1">Step {i + 1}</div>
                    <h3 className="text-sm font-bold mb-1">{step.title}</h3>
                    <p className="text-[11px] text-white/40">{step.desc}</p>
                    {isActive && <motion.div layoutId="step-indicator" className="w-8 h-1 rounded-full bg-cyan-400 mx-auto mt-3" />}
                  </motion.div>
                </AnimSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      {beforeAfterMedia.length >= 2 && (
        <section className="py-20 max-w-4xl mx-auto px-4">
          <AnimSection className="text-center mb-8">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Results</p>
            <h2 className="text-3xl md:text-4xl font-black">Before & After</h2>
          </AnimSection>
          <BeforeAfterSlider
            beforeImage={beforeAfterMedia[0]?.url || ''}
            afterImage={beforeAfterMedia[1]?.url || ''}
          />
        </section>
      )}

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-20 space-y-10">
        <AnimSection className="text-center">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Our Packages</p>
          <h2 className="text-3xl md:text-5xl font-black">Choose Your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Wash</span></h2>
          <p className="text-sm text-white/40 mt-2">Prices tailored for your {currentVehicle.label}</p>
        </AnimSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            const discountPct = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
            return (
              <AnimSection key={p.id} delay={i * 0.03}>
                <motion.div whileHover={{ y: -6, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}
                  className="rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden cursor-pointer group hover:border-cyan-500/20 transition-all"
                  onClick={() => onProductClick(p)}>
                  <div className="aspect-square bg-gradient-to-br from-slate-800/50 to-slate-900/50 flex items-center justify-center relative overflow-hidden">
                    {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <Droplets className="w-10 h-10 text-white/10" />}
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 text-[10px] font-black px-3 py-1 rounded-full bg-red-500 text-white shadow-lg">
                        {discountPct}% OFF
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-white text-xs font-semibold flex items-center gap-1"><Eye className="w-3 h-3" /> View Details</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold truncate">{p.name}</p>
                    {p.description && <p className="text-[10px] text-white/40 truncate mt-0.5">{p.description}</p>}
                    <div className="flex items-baseline gap-2 mt-2">
                      <p className="text-xl font-black text-cyan-400">₹{p.discount_price || p.price}</p>
                      {hasDiscount && <p className="text-xs text-white/30 line-through">₹{p.price}</p>}
                    </div>
                  </div>
                </motion.div>
              </AnimSection>
            );
          })}
        </div>
      </section>

      {/* Happy Customers */}
      <HappyCustomersSection customers={happyCustomers} />

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <AnimSection className="text-center">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-black">Customer Love ⭐ {avgRating}</h2>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviews.slice(0, 6).map((r, i) => (
              <AnimSection key={r.id} delay={i * 0.05}>
                <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 space-y-3 hover:border-cyan-500/20 transition-colors">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`} />
                    ))}
                  </div>
                  {r.review_text && <p className="text-sm text-white/60 italic leading-relaxed">"{r.review_text}"</p>}
                  <p className="text-xs text-white/30 font-semibold">{r.reviewer_name}</p>
                </div>
              </AnimSection>
            ))}
          </div>

          {/* Review Form */}
          <AnimSection>
            <div className="max-w-lg mx-auto rounded-3xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-bold text-center">Leave a Review</h3>
              <input type="text" placeholder="Your Name" value={reviewForm.name} onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
              <select value={reviewForm.product_id} onChange={e => setReviewForm(p => ({ ...p, product_id: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
                <option value="" className="bg-slate-900">Select a service/product</option>
                {products.map(p => <option key={p.id} value={p.id} className="bg-slate-900">{p.name}</option>)}
              </select>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewForm(p => ({ ...p, rating: s }))}>
                    <Star className={`w-6 h-6 ${s <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Your experience..." value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none resize-none focus:ring-2 focus:ring-cyan-500/30" />
              <button onClick={handleSubmitReview} disabled={submittingReview || !reviewForm.name.trim() || !reviewForm.product_id}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Submit Review
              </button>
            </div>
          </AnimSection>
        </div>
      </section>

      {/* Location & Contact */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 space-y-10">
          <AnimSection className="text-center">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-[0.3em] mb-2">Find Us</p>
            <h2 className="text-3xl md:text-4xl font-black">Location & Contact</h2>
          </AnimSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Map */}
            {business.google_map_url && (
              <AnimSection>
                <div className="rounded-3xl overflow-hidden border border-white/10 aspect-video">
                  <iframe
                    src={business.google_map_url.includes('embed') ? business.google_map_url : `https://maps.google.com/maps?q=${encodeURIComponent(business.address || business.business_name)}&output=embed`}
                    className="w-full h-full" allowFullScreen loading="lazy" title="Location"
                  />
                </div>
              </AnimSection>
            )}
            {/* Contact Info */}
            <AnimSection delay={0.1}>
              <div className="rounded-3xl bg-white/[0.03] border border-white/5 p-8 space-y-6">
                <div className="space-y-4">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div><p className="text-sm font-bold">Address</p><p className="text-xs text-white/50">{business.address}</p></div>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-cyan-400 mt-0.5" />
                      <div><p className="text-sm font-bold">Phone</p><a href={`tel:${business.phone}`} className="text-xs text-cyan-400 hover:underline">{business.phone}</a></div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="flex-1 py-3 rounded-xl bg-cyan-500 text-white text-sm font-bold text-center hover:bg-cyan-400 transition-colors">
                      <Phone className="w-4 h-4 inline mr-1" /> Call Now
                    </a>
                  )}
                  {business.whatsapp_number && (
                    <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-3 rounded-xl bg-green-500 text-white text-sm font-bold text-center hover:bg-green-400 transition-colors">
                      <MessageCircle className="w-4 h-4 inline mr-1" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBooking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 rounded-3xl p-6 max-w-md w-full space-y-4 border border-white/10" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">Book a Service</h3>
                <button onClick={() => setShowBooking(false)}><X className="w-5 h-5 text-white/50" /></button>
              </div>
              <select id="book-service" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white">
                {SERVICES.map(s => <option key={s.name} value={s.name} className="bg-slate-900">{s.name} — {s.price}</option>)}
              </select>
              <input type="date" id="book-date" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white" />
              <input type="time" id="book-time" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white" />
              <button onClick={() => {
                const s = (document.getElementById('book-service') as HTMLSelectElement)?.value;
                const d = (document.getElementById('book-date') as HTMLInputElement)?.value;
                const t = (document.getElementById('book-time') as HTMLInputElement)?.value;
                handleBookingWhatsApp(s, d, t);
                setShowBooking(false);
              }} className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" /> Book via WhatsApp
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <MotionFooter business={business} theme={theme} />
    </div>
  );
};

export default CarWashTheme;
