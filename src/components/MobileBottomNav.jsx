import React from 'react';
import { Home, Search, ShoppingBag, Globe, Lock, Unlock } from 'lucide-react';
import { TRANSLATIONS } from '../data/translations';

export default function MobileBottomNav({
  cartCount,
  onOpenCart,
  onOpenAdminLogin,
  onOpenAdmin,
  isAdminLoggedIn,
  lang,
  setLang,
  onResetSearch
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const handleSearchClick = (e) => {
    e.preventDefault();
    // Scroll smoothly to top search area
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Focus mobile search input field
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
        
        {/* Home Button */}
        <button
          type="button"
          onClick={handleHomeClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
        >
          <Home className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-extrabold leading-none">{lang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
        </button>

        {/* Search button with auto-focus */}
        <button
          type="button"
          onClick={handleSearchClick}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold leading-none">{lang === 'ar' ? 'بحث' : 'Recherche'}</span>
        </button>

        {/* Floating Cart CTA Button */}
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

        {/* Language switch */}
        <button
          type="button"
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-orange transition-colors active:scale-95 touch-manipulation"
        >
          <Globe className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-extrabold leading-none">{lang === 'fr' ? 'العربية' : 'FR'}</span>
        </button>

        {/* Admin Lock / Unlock */}
        <button
          type="button"
          onClick={() => {
            if (isAdminLoggedIn) onOpenAdmin();
            else onOpenAdminLogin();
          }}
          className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 text-slate-700 dark:text-slate-300 hover:text-brand-navy dark:hover:text-white transition-colors active:scale-95 touch-manipulation"
        >
          {isAdminLoggedIn ? (
            <Unlock className="w-5 h-5 text-emerald-500" />
          ) : (
            <Lock className="w-5 h-5 text-slate-400" />
          )}
          <span className="text-[10px] font-bold leading-none">
            {isAdminLoggedIn ? (lang === 'ar' ? 'مشرف' : 'Admin') : (lang === 'ar' ? 'قفل' : 'Admin')}
          </span>
        </button>

      </div>
    </nav>
  );
}
