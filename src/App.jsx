import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import AdminModal from './components/AdminModal';
import EmailSettingsModal from './components/EmailSettingsModal';
import SuccessModal from './components/SuccessModal';
import Footer from './components/Footer';

import { CATEGORIES } from './data/initialProducts';
import { 
  getStoredProducts, 
  saveProducts, 
  resetStoredProducts, 
  getStoredEmailConfig, 
  saveEmailConfig 
} from './utils/storage';

import { 
  Sparkles, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export default function App() {
  // Products & Email Config State
  const [products, setProducts] = useState(getStoredProducts);
  const [emailConfig, setEmailConfig] = useState(getStoredEmailConfig);
  
  // Cart State
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('zoom_market_cart_v1');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('zoom_market_dark') === 'true' || true;
  });

  // Modal States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isEmailConfigOpen, setIsEmailConfigOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [successOrderData, setSuccessOrderData] = useState(null);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('zoom_market_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync Dark Mode class to <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zoom_market_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zoom_market_dark', 'false');
    }
  }, [darkMode]);

  // Cart Operations
  const handleAddToCart = (product, quantity = 1) => {
    if (product.inStock === false || product.stockQuantity === 0 || product.badge === 'Rupture de Stock') return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const handleBuyNow = (product, quantity = 1) => {
    if (product.inStock === false || product.stockQuantity === 0 || product.badge === 'Rupture de Stock') return;
    handleAddToCart(product, quantity);
    setQuickViewProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Product Admin Operations - Immediate publication to store catalog
  const handleAddProduct = (newProduct) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    saveProducts(updated);
  };

  const handleDeleteProduct = (productId) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
  };

  const handleResetProducts = () => {
    const initial = resetStoredProducts();
    setProducts(initial);
  };

  // Email Config Update
  const handleSaveEmailConfig = (newConfig) => {
    setEmailConfig(newConfig);
    saveEmailConfig(newConfig);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Tous' || product.category === selectedCategory;
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchTerm]);

  const cartTotalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-brand-orange selection:text-white transition-colors duration-200">
      
      {/* Top Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={CATEGORIES}
        cartCount={cartTotalItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenEmailConfig={() => setIsEmailConfigOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        storePhone={emailConfig.storePhone}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Showcase Section */}
        {selectedCategory === 'Tous' && !searchTerm && (
          <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 shadow-inner">
            {/* Geometric Glow Background Accents */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-orange/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div className="space-y-4 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-orange/20 border border-brand-orange/30 text-brand-orange font-bold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Marketplace N°1 en Algérie 🇩🇿</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  Le Meilleur du Shopping en Algérie avec <span className="text-brand-orange">Zoom Market Dz</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Découvrez une sélection rigoureuse d'articles High-Tech, Accessoires et Produits de tendance. Commandez en toute sérénité avec paiement après livraison !
                </p>

                {/* Badges */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    <span>Livraison 69 Wilayas</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Paiement à la livraison</span>
                  </div>
                </div>
              </div>

              {/* Banner Card Preview */}
              <div className="hidden lg:block relative">
                <div className="relative mx-auto max-w-md bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-brand-orange flex items-center gap-1">
                      <Flame className="w-4 h-4" /> Offre Spéciale
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      En Stock
                    </span>
                  </div>

                  <img
                    src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"
                    alt="Offre Spéciale"
                    className="w-full h-52 object-cover rounded-2xl mb-4 shadow-md"
                  />

                  <h3 className="font-extrabold text-lg text-white">Écouteurs Pro Active Noise Cancelling</h3>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-2xl font-black text-brand-orange">5 800 DA</span>
                    <span className="text-xs text-slate-400 line-through">7 500 DA</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Catalog Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Section Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Nos Produits</span>
                {selectedCategory !== 'Tous' && (
                  <span className="text-sm font-semibold text-brand-orange bg-brand-orange/10 px-3 py-1 rounded-full">
                    {selectedCategory}
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {filteredProducts.length} article(s) trouvé(s)
              </p>
            </div>

            {/* Quick Filter Reset */}
            {(selectedCategory !== 'Tous' || searchTerm) && (
              <button
                onClick={() => { setSelectedCategory('Tous'); setSearchTerm(''); }}
                className="text-xs font-bold text-brand-orange hover:underline self-start sm:self-auto"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onQuickView={setQuickViewProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto my-8 p-8">
              <Search className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                Aucun produit ne correspond à votre recherche
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-6">
                Essayez un autre mot clé ou sélectionnez une autre catégorie.
              </p>
              <button
                onClick={() => { setSelectedCategory('Tous'); setSearchTerm(''); }}
                className="bg-brand-orange hover:bg-brand-orange-hover text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow"
              >
                Afficher tous les produits
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modals & Drawers */}
      
      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSuccess={(successPayload) => {
          setIsCartOpen(false);
          setCart([]);
          setSuccessOrderData(successPayload);
        }}
        emailConfig={emailConfig}
      />

      {/* Product Quick View Modal */}
      <ProductModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetProducts={handleResetProducts}
      />

      {/* Email & WhatsApp Settings Modal */}
      <EmailSettingsModal
        isOpen={isEmailConfigOpen}
        onClose={() => setIsEmailConfigOpen(false)}
        emailConfig={emailConfig}
        onSaveConfig={handleSaveEmailConfig}
      />

      {/* Order Success Modal */}
      <SuccessModal
        isOpen={!!successOrderData}
        onClose={() => setSuccessOrderData(null)}
        data={successOrderData}
      />

      {/* Footer */}
      <Footer
        onCategorySelect={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 400, behavior: 'smooth' });
        }}
        storePhone={emailConfig.storePhone}
        recipientEmail={emailConfig.recipientEmail}
      />
    </div>
  );
}
