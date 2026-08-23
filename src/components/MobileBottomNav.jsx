import React from 'react';
import { Home, Search, ShoppingBag, Globe, Sun, Moon, Package } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenAdmin,
  isAdminLoggedIn,
  lang,
  setLang,
  darkMode,
  setDarkMode,
  onResetSearch
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const handleSearchClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const mobileInput = document.getElementById('mobile-search-input') || document.getElementById('desktop-search-input');
      if (mobileInput) {
        mobileInput.focus();
        mobileInput.classList.add('ring-2', 'ring-brand-orange');
        setTimeout(() => mobileInput.classList.remove('ring-2', 'ring-brand-orange'), 2000);
      }
    }, 150);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    onResetSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-navy/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] transition-all"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 items-center h-14 max-w-md mx-auto px-1">
        
        {/* 1. Accueil */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95"
        >
          <Home className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold mt-0.5 leading-none">{lang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
        </button>

        {/* 2. Recherche */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-medium mt-0.5 leading-none">{lang === 'ar' ? 'بحث' : 'Recherche'}</span>
        </button>

        {/* 3. Panier (Sleek Compact Badge) */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 text-slate-700 dark:text-slate-200 hover:text-brand-orange transition-colors active:scale-95"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-brand-orange" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-brand-orange text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 leading-none">{t.cart}</span>
        </button>

        {/* 4. Mode Sombre / Clair */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95"
          title={darkMode ? "Mode Clair" : "Mode Sombre"}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium mt-0.5 leading-none">{darkMode ? 'Clair' : 'Sombre'}</span>
        </button>

        {/* 5. Langue ou Admin */}
        {isAdminLoggedIn ? (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex flex-col items-center justify-center py-1 text-emerald-600 dark:text-emerald-400 font-bold transition-colors active:scale-95"
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 leading-none">Admin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex flex-col items-center justify-center py-1 text-slate-600 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95"
          >
            <Globe className="w-5 h-5 text-brand-navy dark:text-slate-300" />
            <span className="text-[10px] font-extrabold mt-0.5 leading-none">{lang === 'fr' ? 'العربية' : 'FR'}</span>
          </button>
        )}

      </div>
    </nav>
  );
}
