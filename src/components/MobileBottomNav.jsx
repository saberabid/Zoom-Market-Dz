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
    }, 200);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    onResetSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-navy/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800 px-3 py-2 shadow-2xl transition-all">
      <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 max-w-md mx-auto">
        
        {/* 1. Home Button */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
        >
          <Home className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-extrabold leading-none">{lang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
        </button>

        {/* 2. Search button */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold leading-none">{lang === 'ar' ? 'بحث' : 'Recherche'}</span>
        </button>

        {/* 3. Floating Cart CTA Button */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center -mt-6 bg-brand-orange text-white w-14 h-14 rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-950 active:scale-90 transition-transform touch-manipulation"
        >
          <ShoppingBag className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-navy text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
              {cartCount}
            </span>
          )}
        </button>

        {/* 4. Dark / Light Theme Toggle */}
        <button
          type="button"
          onClick={() => setDarkMode(!darkMode)}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
          title={darkMode ? "Mode Clair" : "Mode Sombre"}
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-bold leading-none">{darkMode ? 'Clair' : 'Sombre'}</span>
        </button>

        {/* 5. Language Switch OR Admin Panel (if logged in) */}
        {isAdminLoggedIn ? (
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-emerald-600 dark:text-emerald-400 font-extrabold transition-colors active:scale-95 touch-manipulation"
          >
            <Package className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] leading-none">Admin</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
            className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
          >
            <Globe className="w-5 h-5 text-brand-orange" />
            <span className="text-[10px] font-extrabold leading-none">{lang === 'fr' ? 'العربية' : 'FR'}</span>
          </button>
        )}

      </div>
    </nav>
  );
}
