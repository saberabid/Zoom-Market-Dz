import React, { useState } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle, Check } from 'lucide-react';
import { verifyAdminPin, saveAdminPin, getStoredAdminPin } from '../utils/auth';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  // Change PIN mode
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Veuillez saisir votre code PIN administrateur.');
      return;
    }

    if (verifyAdminPin(pin)) {
      setError('');
      setPin('');
      onLoginSuccess();
    } else {
      setError('Code PIN incorrect. Accès refusé.');
    }
  };

  const handleChangePin = (e) => {
    e.preventDefault();
    if (!verifyAdminPin(currentPinInput)) {
      setError('Le code PIN actuel est incorrect.');
      return;
    }

    if (newPinInput.length < 4) {
      setError('Le nouveau code PIN doit comporter au moins 4 chiffres.');
      return;
    }

    saveAdminPin(newPinInput);
    setChangeSuccess(true);
    setError('');
    setTimeout(() => {
      setChangeSuccess(false);
      setIsChangingPin(false);
      setCurrentPinInput('');
      setNewPinInput('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative p-6 sm:p-8 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon */}
        <div className="w-16 h-16 bg-brand-orange/10 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-brand-orange/20 shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          Espace Administrateur Réservé 🔒
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          Veuillez vous authentifier avec votre code PIN pour gérer la boutique <strong>Zoom Market Dz</strong>.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 text-left">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Code PIN administrateur modifié avec succès !</span>
          </div>
        )}

        {!isChangingPin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 text-left">
                Code PIN Administrateur
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  placeholder="Saisissez le code PIN (Par défaut: 2026)"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold text-center tracking-widest"
                  autoFocus
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1 text-left">
                Code PIN par défaut : <strong className="text-brand-orange">2026</strong>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Se Connecter en tant qu'Admin</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsChangingPin(true); setError(''); }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline block mx-auto pt-2"
            >
              Modifier le code PIN Administrateur
            </button>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Code PIN Actuel
              </label>
              <input
                type="password"
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="PIN actuel (ex: 2026)"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nouveau Code PIN
              </label>
              <input
                type="password"
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Ex: 4321"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setIsChangingPin(false); setError(''); }}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-bold text-xs"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white py-2.5 rounded-xl font-bold text-xs shadow"
              >
                Enregistrer PIN
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
