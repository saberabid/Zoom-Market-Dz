import React from 'react';
import Logo from './Logo';
import { Truck, ShieldCheck, PhoneCall, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer({ onCategorySelect, storePhone, recipientEmail }) {
  return (
    <footer className="bg-brand-navy text-white pt-16 pb-8 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-brand-orange/20 text-brand-orange flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Livraison dans 69 Wilayas</h4>
              <p className="text-xs text-slate-400">Expédition rapide à domicile ou en point relais.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Paiement à la Livraison</h4>
              <p className="text-xs text-slate-400">Payez en espèces après inspection de votre produit.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-white">Service Client 7j/7</h4>
              <p className="text-xs text-slate-400">Assistance téléphonique et conseils personnalisés.</p>
            </div>
          </div>
        </div>

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Logo />
            <p className="text-xs text-slate-400 leading-relaxed">
              Zoom Market Dz est votre marketplace de confiance en Algérie. Nous sélectionnons les meilleurs produits high-tech, accessoires et objets tendance au meilleur prix.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MapPin className="w-4 h-4 text-brand-orange" />
              <span>Couverture Nationale (69 Wilayas)</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              Catégories Principales
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-medium">
              {['High-Tech', 'Électronique', 'Mode & Habillement', 'Maison & Déco', 'Beauté & Santé'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onCategorySelect(cat)}
                    className="hover:text-brand-orange transition-colors"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              Contact & Assistance
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${recipientEmail}`} className="hover:text-brand-orange transition-colors">
                  {recipientEmail || 'marketdzzoom@gmail.com'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-slate-400" />
                <a href={`tel:${storePhone}`} className="hover:text-brand-orange transition-colors font-bold text-white">
                  {storePhone || '0550 00 00 00'}
                </a>
              </li>
            </ul>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
              Engagements & Sécurité
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Toutes les commandes sont enregistrées et confirmées par téléphone avant expédition. Vous vérifiez votre marchandise à la réception avant de procéder au règlement.
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Zoom Market Dz. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Conçu avec <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> pour le e-commerce en Algérie 🇩🇿
          </p>
        </div>

      </div>
    </footer>
  );
}
