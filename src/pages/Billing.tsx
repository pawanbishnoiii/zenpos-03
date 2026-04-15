import { motion } from 'framer-motion';
import { Search, ScanLine, ArrowLeft, ShoppingCart, X, LayoutGrid, List, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import CartPanel from '@/components/billing/CartPanel';
import BarcodeScanner from '@/components/billing/BarcodeScanner';
import { useAppStore, Product } from '@/store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { useBusiness } from '@/hooks/useBusiness';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCategoryConfig } from '@/lib/categoryConfig';

const Billing = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showCart, setShowCart] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addToCart, cart } = useAppStore();
  const navigate = useNavigate();
  const { business } = useBusiness();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const categoryConfig = business ? getCategoryConfig(business.category) : null;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!business) return;
      const { data } = await supabase.from('products').select('*').eq('business_id', business.id).order('name');
      if (data) {
        setProducts(data.map((p: any) => ({
          id: p.id, name: p.name, description: p.description || '', category: p.category,
          sku: p.sku, barcode: p.barcode_value || '', price: Number(p.price),
          discountPrice: Number(p.discount_price), taxPercent: Number(p.tax_percent),
          stock: p.stock, imageUrl: p.image_url || '',
        })));
      }
    };
    fetchProducts();
  }, [business]);

  const allCategories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBarcodeScan = (code: string) => {
    const found = products.find(p => p.barcode === code || p.sku === code);
    if (found) {
      addToCart(found);
      toast({ title: 'Added to Cart', description: found.name });
    } else {
      toast({ title: 'Not Found', description: `No product with barcode: ${code}`, variant: 'destructive' });
    }
  };

  const cartTotal = cart.reduce((s, i) => s + i.product.discountPrice * i.quantity, 0);
  const cartQty = cart.reduce((s, i) => s + i.quantity, 0);

  // Mobile layout
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/dashboard')} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </motion.button>
            <h1 className="text-xl font-bold font-display text-foreground">{categoryConfig?.navLabel.billing || 'Billing'}</h1>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowScanner(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold glow-primary">
            <ScanLine className="w-4 h-4" /> Scan
          </motion.button>
        </div>

        {cart.length > 0 && !showCart && (
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="mx-4 mb-2 rounded-xl glass-card shadow-soft border border-primary/20 overflow-hidden">
            <button onClick={() => setShowCart(true)} className="w-full p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{cart.length} items</p>
                  <p className="text-xs text-muted-foreground">Tap to view cart</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold gradient-primary-text">₹{cartTotal.toFixed(0)}</p>
              </div>
            </button>
            <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto no-scrollbar">
              {cart.slice(0, 5).map(item => (
                <span key={item.product.id} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium whitespace-nowrap">
                  {item.product.name} ×{item.quantity}
                </span>
              ))}
              {cart.length > 5 && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{cart.length - 5}</span>}
            </div>
          </motion.div>
        )}

        {showCart && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 bg-card flex flex-col">
            <div className="px-4 py-3 flex items-center justify-between border-b border-border">
              <h2 className="text-lg font-bold font-display text-foreground">Cart</h2>
              <button onClick={() => setShowCart(false)} className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <CartPanel />
            </div>
          </motion.div>
        )}

        <div className="px-4 space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search product or scan barcode..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            {allCategories.map((cat) => (
              <motion.button key={cat} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'gradient-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">No products found</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/workspace')}
                className="mt-3 px-4 py-2 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold">
                Add Products
              </motion.button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>

        <BarcodeScanner open={showScanner} onClose={() => setShowScanner(false)} onScan={handleBarcodeScan} />
      </div>
    );
  }

  // Desktop layout - upgraded
  return (
    <div className="h-screen flex flex-row bg-background">
      {/* Products Panel */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border/30 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('/dashboard')}
              className="w-10 h-10 rounded-xl bg-secondary hover:bg-muted flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </motion.button>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-bold font-display text-foreground">{categoryConfig?.navLabel.billing || 'Billing'}</motion.h1>
              <p className="text-xs text-muted-foreground">{filteredProducts.length} products • {cartQty} in cart</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold glow-primary shadow-lg shadow-primary/20">
              <ScanLine className="w-4 h-4" /> Scan Barcode
            </motion.button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="px-6 py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search product name, SKU, or barcode..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm" />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {allCategories.map((cat) => (
              <motion.button key={cat} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${activeCategory === cat ? 'gradient-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 pt-2">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <div className="w-20 h-20 rounded-2xl bg-primary/5 flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <p className="text-sm font-medium">No products found</p>
              <p className="text-xs text-muted-foreground mt-1">Add products from workspace to start billing</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/workspace')}
                className="mt-4 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-xs font-semibold shadow-lg shadow-primary/20">
                Add Products
              </motion.button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-1.5">
              {filteredProducts.map((product) => (
                <motion.div key={product.id} whileHover={{ x: 4 }} onClick={() => addToCart(product)}
                  className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border/30 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer group">
                  {product.imageUrl ? (
                    <img src={product.imageUrl.startsWith('http') ? product.imageUrl : supabase.storage.from('product-images').getPublicUrl(product.imageUrl).data.publicUrl}
                      alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} • SKU: {product.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">₹{product.discountPrice}</p>
                    {product.price > product.discountPrice && (
                      <p className="text-xs text-muted-foreground line-through">₹{product.price}</p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <ShoppingCart className="w-3.5 h-3.5 text-primary-foreground" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel - Desktop */}
      <div className="w-[420px] border-l border-border/30 bg-card flex flex-col shadow-xl">
        <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-foreground">Cart</h2>
            <p className="text-xs text-muted-foreground">{cartQty} items • ₹{cartTotal.toFixed(0)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-primary/20">
            <ShoppingCart className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <CartPanel />
        </div>
      </div>

      <BarcodeScanner open={showScanner} onClose={() => setShowScanner(false)} onScan={handleBarcodeScan} />
    </div>
  );
};

export default Billing;
