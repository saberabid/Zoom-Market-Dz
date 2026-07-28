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

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-brand-navy/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-2 shadow-2xl transition-all">
      <div className="flex items-center justify-around text-slate-600 dark:text-slate-300">
        
        {/* Home Button */}
        <button
          onClick={() => {
            onResetSearch();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-brand-orange transition-colors active:scale-90"
        >
          <Home className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-extrabold">{lang === 'ar' ? 'الرئيسية' : 'Accueil'}</span>
        </button>

        {/* Search focus */}
        <button
          onClick={() => {
            window.scrollTo({ top: 100, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-brand-orange transition-colors active:scale-90"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-bold">{lang === 'ar' ? 'بحث' : 'Recherche'}</span>
        </button>

        {/* Floating Cart CTA Button */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center -mt-6 bg-brand-orange text-white w-14 h-14 rounded-full shadow-lg border-4 border-slate-50 dark:border-slate-950 active:scale-90 transition-transform"
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
          onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-brand-orange transition-colors active:scale-90"
        >
          <Globe className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-extrabold">{lang === 'fr' ? 'العربية' : 'FR'}</span>
        </button>

        {/* Admin Lock / Unlock */}
        <button
          onClick={() => {
            if (isAdminLoggedIn) onOpenAdmin();
            else onOpenAdminLogin();
          }}
          className="flex flex-col items-center gap-1 p-1.5 hover:text-brand-navy dark:hover:text-white transition-colors active:scale-90"
        >
          {isAdminLoggedIn ? (
            <Unlock className="w-5 h-5 text-emerald-500" />
          ) : (
            <Lock className="w-5 h-5 text-slate-400" />
          )}
          <span className="text-[10px] font-bold">
            {isAdminLoggedIn ? (lang === 'ar' ? 'مشرف' : 'Admin') : (lang === 'ar' ? 'قفل' : 'Admin')}
          </span>
        </button>

      </div>
    </div>
  );
}
