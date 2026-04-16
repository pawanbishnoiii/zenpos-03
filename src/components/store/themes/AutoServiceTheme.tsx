import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ShoppingBag, Star, MapPin, Phone, Wrench, Car, Shield, Zap, Clock, Award, ChevronRight, MessageCircle, Bike, Bus, Truck, Droplets, Sparkles, Eye, Users, CheckCircle, Play, Calendar, Send, Check } from 'lucide-react';
import BannerSlideshow from '../BannerSlideshow';
import OffersSection from '../OffersSection';
import VideoSection from '../VideoSection';
import MotionFooter from '@/components/ui/motion-footer';
import BeforeAfterSlider from '../BeforeAfterSlider';
import HappyCustomersSection from '../HappyCustomersSection';
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
  { id: 'car', label: 'Car', icon: Car, color: 'from-blue-500 to-cyan-500' },
  { id: 'bike', label: 'Bike', icon: Bike, color: 'from-orange-500 to-red-500' },
  { id: 'truck', label: 'Truck', icon: Truck, color: 'from-slate-600 to-slate-800' },
  { id: 'bus', label: 'Bus', icon: Bus, color: 'from-emerald-500 to-teal-500' },
];

const SERVICES_LIST = [
  { name: 'Exterior Wash', desc: 'Full pressure wash', icon: Droplets, price: '₹249' },
  { name: 'Interior Clean', desc: 'Vacuum & dashboard', icon: Sparkles, price: '₹349' },
  { name: 'Foam Wash', desc: 'Premium snow foam', icon: Zap, price: '₹449' },
  { name: 'Ceramic Coating', desc: 'Long-lasting shine', icon: Shield, price: '₹1299' },
  { name: 'Engine Bay', desc: 'Engine detailing', icon: Wrench, price: '₹599' },
  { name: 'Full Detail', desc: 'Complete care package', icon: Award, price: '₹1999' },
];

const AnimatedCounter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return <div ref={ref}>{count}{suffix}</div>;
};

const AutoServiceTheme = ({ business, products, reviews, banners, offers, videos, onProductClick, getImageSrc }: ThemeProps) => {
  const [selectedVehicle, setSelectedVehicle] = useState('car');
  const [happyCustomers, setHappyCustomers] = useState<any[]>([]);
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewProduct, setReviewProduct] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingService, setBookingService] = useState('');
  const [activeServiceFilter, setActiveServiceFilter] = useState('all');

  const theme = {
    footerBg: 'bg-slate-900', footerText: 'text-slate-400', emoji: '🚗',
    tagline: business.tagline || 'Premium Auto Care & Service',
  };
  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  useEffect(() => {
    const fetchHappy = async () => {
      const { data } = await supabase.from('happy_customers').select('*').eq('business_id', business.id).order('sort_order');
      setHappyCustomers(data || []);
    };
    fetchHappy();
  }, [business.id]);

  const handleSubmitReview = async () => {
    if (!reviewName.trim()) return;
    setSubmittingReview(true);
    const productId = reviewProduct || (products.length > 0 ? products[0].id : null);
    if (!productId) { setSubmittingReview(false); return; }
    
    await supabase.from('product_reviews').insert({
      business_id: business.id,
      product_id: productId,
      reviewer_name: reviewName.trim(),
      review_text: reviewText.trim(),
      rating: reviewRating,
      is_approved: false,
    });
    setReviewName(''); setReviewText(''); setReviewRating(5); setReviewProduct('');
    setSubmittingReview(false);
  };

  const handleWhatsAppBooking = () => {
    const phone = (business.whatsapp_number || business.phone || '').replace(/\D/g, '');
    if (!phone) return;
    const msg = encodeURIComponent(`🔧 *Service Booking Request*\n\n📅 Date: ${bookingDate}\n⏰ Time: ${bookingTime}\n🚗 Service: ${bookingService || 'General Service'}\n🏪 Store: ${business.business_name}`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  const trustBadges = [
    { icon: Shield, label: 'Trusted Service', value: '100%' },
    { icon: Award, label: 'Happy Customers', value: `${Math.max(reviews.length * 10, 100)}+` },
    { icon: Clock, label: 'Quick Service', value: '30 min' },
    { icon: Wrench, label: 'Expert Team', value: 'Certified' },
  ];

  const counterStats = [
    { target: Math.max(reviews.length * 50, 500), suffix: '+', label: 'Cars Serviced' },
    { target: Math.max(reviews.length * 10, 100), suffix: '+', label: 'Happy Clients' },
    { target: 5, suffix: '★', label: 'Avg Rating' },
    { target: 3, suffix: '+', label: 'Years Exp' },
  ];

  const currentVehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle) || VEHICLE_TYPES[0];

  const filteredProducts = activeServiceFilter === 'all'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeServiceFilter);

  const productCategories = ['all', ...new Set(products.map(p => p.category?.toLowerCase()).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-950" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(0,188,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,188,212,0.3) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
      }} />

      {/* Promo Strip */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white text-center py-2.5 text-xs font-semibold tracking-wide relative overflow-hidden">
        <motion.div animate={{ x: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
          🔧 Free Vehicle Health Checkup on Every Visit! <span className="hidden md:inline">| ⭐ Rated {avgRating || '5.0'} by our customers</span>
        </motion.div>
      </div>

      {/* Sticky Nav */}
      <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {business.logo_url ? (
              <img src={getImageSrc(business.logo_url)} alt="" className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-400/30" />
            ) : (
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentVehicle.color} flex items-center justify-center shadow-lg`}>
                <Car className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <span className="text-sm font-bold text-white tracking-tight">{business.business_name}</span>
              <p className="text-[10px] text-slate-400">{theme.tagline}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#services" className="hover:text-cyan-400 transition-colors">Services</a>
            <a href="#gallery" className="hover:text-cyan-400 transition-colors">Gallery</a>
            <a href="#products" className="hover:text-cyan-400 transition-colors">Parts</a>
            <a href="#booking" className="hover:text-cyan-400 transition-colors">Book</a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">Reviews</a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            {business.phone && (
              <a href={`tel:${business.phone}`} className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
                <Phone className="w-3.5 h-3.5" /> Call Now
              </a>
            )}
            {business.whatsapp_number && (
              <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500 text-white text-xs font-bold hover:bg-green-400 transition-colors">
                <MessageCircle className="w-3.5 h-3.5" /> <span className="hidden md:inline">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/50 to-slate-950" />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300bcd4\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />

        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-28">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-xs font-semibold text-cyan-400">
                <Droplets className="w-3.5 h-3.5" /> Premium Auto Care Center
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-white">
                {business.business_name}
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-lg text-slate-400 max-w-md">
                {theme.tagline}
              </motion.p>

              {/* Vehicle Selector */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="flex gap-2 justify-center md:justify-start">
                {VEHICLE_TYPES.map(v => {
                  const VIcon = v.icon;
                  const active = selectedVehicle === v.id;
                  return (
                    <motion.button key={v.id} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl border-2 transition-all ${active ? `border-cyan-400 bg-gradient-to-br ${v.color} shadow-lg` : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'}`}>
                      <VIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span className={`text-[10px] font-bold ${active ? 'text-white' : 'text-slate-500'}`}>{v.label}</span>
                    </motion.button>
                  );
                })}
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href="#products" className={`px-8 py-3.5 rounded-2xl bg-gradient-to-r ${currentVehicle.color} text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg flex items-center gap-2`}>
                  <ShoppingBag className="w-4 h-4" /> View Services
                </a>
                <a href="#booking" className="px-6 py-3.5 rounded-2xl border-2 border-slate-600 text-white text-sm font-bold hover:bg-white/5 transition-all flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Book Now
                </a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
              className="relative">
              {business.logo_url ? (
                <img src={getImageSrc(business.logo_url)} alt="" className="w-48 h-48 md:w-56 md:h-56 rounded-3xl object-cover border-4 border-slate-700/50 shadow-2xl" />
              ) : (
                <div className={`w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br ${currentVehicle.color} flex items-center justify-center shadow-2xl`}>
                  <currentVehicle.icon className="w-20 h-20 text-white/80" />
                </div>
              )}
              <div className={`absolute -inset-4 rounded-3xl bg-gradient-to-br ${currentVehicle.color} opacity-20 blur-2xl -z-10`} />
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent" />
      </section>

      {/* Counter Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {counterStats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
              whileHover={{ y: -3 }}
              className="rounded-2xl bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-700/50 p-4 text-center">
              <p className="text-2xl md:text-3xl font-black text-cyan-400">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {trustBadges.map((badge, i) => (
            <motion.div key={badge.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 * i }}
              className="rounded-2xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/30 p-4 text-center group hover:border-cyan-500/30 transition-colors">
              <badge.icon className="w-6 h-6 mx-auto text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-lg font-black text-white">{badge.value}</p>
              <p className="text-[10px] text-slate-400 font-medium">{badge.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {banners.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <BannerSlideshow banners={banners} />
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Our Services</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">What We Do Best</h2>
          <p className="text-sm text-slate-400">Professional auto care for every vehicle type</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SERVICES_LIST.map((svc, i) => {
            const SvcIcon = svc.icon;
            return (
              <motion.div key={svc.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -4, scale: 1.02 }}
                className="rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-5 text-center space-y-3 group hover:border-cyan-500/30 transition-all">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <SvcIcon className="w-7 h-7 text-cyan-400" />
                </div>
                <h3 className="text-sm font-bold text-white">{svc.name}</h3>
                <p className="text-[10px] text-slate-400">{svc.desc}</p>
                <p className="text-lg font-black text-cyan-400">{svc.price}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Before/After Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Results</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">Before & After</h2>
          <p className="text-sm text-slate-400">Drag the slider to see the difference</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <BeforeAfterSlider
            beforeImage="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=800&h=450&fit=crop"
            afterImage="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&h=450&fit=crop"
            beforeLabel="Before Wash"
            afterLabel="After Wash"
          />
        </div>
      </section>

      <OffersSection offers={offers} theme={theme} />
      <VideoSection videos={videos} />

      {/* Happy Customers */}
      <HappyCustomersSection customers={happyCustomers} />

      {/* WhatsApp Booking */}
      <section id="booking" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center space-y-2 mb-8">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Book Online</p>
          <h2 className="text-3xl font-black text-white">Schedule Your Service</h2>
          <p className="text-sm text-slate-400">Select your preferred time and we'll confirm via WhatsApp</p>
        </div>
        <div className="max-w-md mx-auto rounded-3xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 space-y-4">
          <select value={bookingService} onChange={e => setBookingService(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="">Select a service</option>
            {SERVICES_LIST.map(s => <option key={s.name} value={s.name}>{s.name} - {s.price}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={bookingDate} onChange={e => setBookingDate(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            <input type="time" value={bookingTime} onChange={e => setBookingTime(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <button onClick={handleWhatsAppBooking} disabled={!bookingDate || !bookingTime}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <MessageCircle className="w-4 h-4" /> Book via WhatsApp
          </button>
        </div>
      </section>

      {/* About / Owner Card */}
      {(business.owner_card_visible !== false) && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-xl shrink-0">
                {business.logo_url ? (
                  <img src={getImageSrc(business.logo_url)} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <Users className="w-12 h-12 text-white/80" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left space-y-3">
                <h3 className="text-2xl font-black text-white">{business.business_name}</h3>
                <p className="text-slate-400 text-sm max-w-lg">{theme.tagline}</p>
                {business.address && (
                  <p className="text-sm text-slate-500 flex items-center gap-2 justify-center md:justify-start">
                    <MapPin className="w-4 h-4 text-cyan-400" /> {business.address}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {business.phone && (
                    <a href={`tel:${business.phone}`} className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> {business.phone}
                    </a>
                  )}
                  {business.whatsapp_number && (
                    <a href={`https://wa.me/${business.whatsapp_number}`} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20 hover:bg-green-500/20 transition-colors flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Google Map */}
      {business.google_map_url && (
        <section id="contact" className="max-w-7xl mx-auto px-4 pb-16">
          <div className="text-center space-y-2 mb-8">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Find Us</p>
            <h2 className="text-3xl font-black text-white">Our Location</h2>
          </div>
          <div className="rounded-3xl overflow-hidden border border-slate-700/50 shadow-xl">
            {business.google_map_url.includes('/embed') || business.google_map_url.includes('output=embed') ? (
              <iframe src={business.google_map_url} width="100%" height="350" style={{ border: 0 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Location" />
            ) : (
              <a href={business.google_map_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 py-12 bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <MapPin className="w-6 h-6 text-cyan-400" />
                <span className="text-sm font-bold text-white/70 hover:text-white">View on Google Maps →</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* Services / Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Our Services & Parts</p>
          <h2 className="text-3xl md:text-4xl font-black text-white">What We Offer</h2>
        </div>
        {/* Category filter */}
        <div className="flex gap-2 justify-center flex-wrap">
          {productCategories.map(cat => (
            <button key={cat} onClick={() => setActiveServiceFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeServiceFilter === cat ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {cat === 'all' ? 'All' : cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((p, i) => {
            const img = getImageSrc(p.image_url || '');
            const hasDiscount = p.discount_price < p.price;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }} whileHover={{ y: -4 }}
                className="rounded-2xl bg-slate-800/70 backdrop-blur-sm overflow-hidden cursor-pointer shadow-md hover:shadow-xl hover:shadow-cyan-500/10 transition-all border border-slate-700/50 group"
                onClick={() => onProductClick(p)}>
                <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative overflow-hidden">
                  {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <Wrench className="w-10 h-10 text-slate-600" />}
                  {hasDiscount && (
                    <span className="absolute top-2 right-2 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500 text-white shadow-md">
                      {Math.round(((p.price - p.discount_price) / p.price) * 100)}% OFF
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-semibold flex items-center gap-1"><Eye className="w-3 h-3" /> View</span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-white truncate">{p.name}</p>
                  {p.description && <p className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</p>}
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <p className="text-lg font-black text-cyan-400">₹{p.discount_price || p.price}</p>
                    {hasDiscount && <p className="text-xs text-slate-500 line-through">₹{p.price}</p>}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="bg-slate-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Testimonials</p>
            <h2 className="text-3xl font-black text-white">What Our Customers Say {avgRating && `⭐ ${avgRating}`}</h2>
          </div>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.slice(0, 6).map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 space-y-3 hover:border-cyan-500/30 transition-colors">
                  <div className="flex gap-0.5">{[...Array(5)].map((_, j) => <Star key={j} className={`w-4 h-4 ${j < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}`} />)}</div>
                  {r.review_text && <p className="text-sm text-slate-300 italic leading-relaxed">"{r.review_text}"</p>}
                  <p className="text-xs text-slate-400 font-semibold">{r.reviewer_name}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm">No reviews yet. Be the first to leave one!</p>
          )}

          {/* Review Form */}
          <div className="max-w-lg mx-auto rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white text-center">Leave a Review</h3>
            <input type="text" placeholder="Your Name" value={reviewName} onChange={e => setReviewName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            <textarea placeholder="Your experience..." value={reviewText} onChange={e => setReviewText(e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Rating:</span>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setReviewRating(s)}>
                  <Star className={`w-5 h-5 ${s <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}`} />
                </button>
              ))}
            </div>
            {products.length > 0 && (
              <select value={reviewProduct} onChange={e => setReviewProduct(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
                <option value="">Select a service (optional)</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            )}
            <button onClick={handleSubmitReview} disabled={!reviewName.trim() || submittingReview}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity">
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
            <p className="text-[10px] text-slate-500 text-center">Reviews are moderated and will appear after approval.</p>
          </div>
        </div>
      </section>

      <MotionFooter business={business} theme={theme} />
    </div>
  );
};

export default AutoServiceTheme;
