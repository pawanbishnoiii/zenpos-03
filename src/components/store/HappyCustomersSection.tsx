import { motion } from 'framer-motion';
import { Star, Car } from 'lucide-react';

interface HappyCustomer {
  id: string;
  customer_name: string;
  image_url?: string;
  vehicle_info?: string;
  title?: string;
}

const HappyCustomersSection = ({ customers }: { customers: HappyCustomer[] }) => {
  if (!customers || customers.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest">Happy Customers</p>
        <h2 className="text-3xl md:text-4xl font-black text-white">Our Satisfied Clients</h2>
        <p className="text-sm text-slate-400">Real results from real customers</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {customers.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden group"
          >
            <div className="aspect-square bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
              {c.image_url ? (
                <img src={c.image_url} alt={c.customer_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <Car className="w-12 h-12 text-slate-600" />
              )}
            </div>
            <div className="p-3 space-y-1">
              <p className="text-sm font-bold text-white truncate">{c.customer_name}</p>
              {c.title && <p className="text-[10px] text-cyan-400 font-medium">{c.title}</p>}
              {c.vehicle_info && <p className="text-[10px] text-slate-400">{c.vehicle_info}</p>}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HappyCustomersSection;
