import React, { useState, useEffect } from 'react';
import { X, Lock, Key, ShieldCheck, AlertCircle, Check, Clock, ShieldAlert, Globe, Radio } from 'lucide-react';
import { verifyAdminPin, changeAdminPin, getLockoutStatus } from '../utils/auth';
import { verifyAdminGeoLocation } from '../utils/geoSecurity';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [lockoutInfo, setLockoutInfo] = useState(getLockoutStatus);

  // Geo-Fencing State
  const [geoChecking, setGeoChecking] = useState(true);
  const [geoStatus, setGeoStatus] = useState(null);
  
  // Change PIN mode
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);

  // Run Geo-Fencing verification whenever modal is opened
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setGeoChecking(true);
    setError('');

    verifyAdminGeoLocation().then((result) => {
      if (isMounted) {
        setGeoStatus(result);
        setGeoChecking(false);
        if (!result.allowed) {
          setError(result.message);
        }
      }
    });

    return () => { isMounted = false; };
  }, [isOpen]);

  // Check lockout status every second if locked
  useEffect(() => {
    if (!isOpen) return;
    setLockoutInfo(getLockoutStatus());

    const interval = setInterval(() => {
      const status = getLockoutStatus();
      setLockoutInfo(status);
      if (!status.isLocked && error.includes('bloqué')) {
        setError('');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, error]);

  if (!isOpen) return null;

  const isGeoBlocked = geoStatus && !geoStatus.allowed;

  const handleLogin = async (e) => {
    e.preventDefault();

    // Block if outside Algeria or on VPN
    if (isGeoBlocked) {
      setError(geoStatus.message);
      return;
    }

    if (!pin.trim()) {
      setError('Veuillez saisir votre code PIN administrateur.');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const result = await verifyAdminPin(pin);
      setIsVerifying(false);

      if (result.success) {
        setError('');
        setPin('');
        onLoginSuccess();
      } else {
        setError(result.message || 'Code PIN incorrect.');
        setLockoutInfo(getLockoutStatus());
      }
    } catch (err) {
      setIsVerifying(false);
      setError('Erreur de validation de sécurité.');
    }
  };

  const handleChangePin = async (e) => {
    e.preventDefault();

    if (isGeoBlocked) {
      setError(geoStatus.message);
      return;
    }

    if (!currentPinInput.trim() || !newPinInput.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setIsVerifying(true);
    const verifyCurrent = await verifyAdminPin(currentPinInput);
    if (!verifyCurrent.success) {
      setIsVerifying(false);
      setError('Le code PIN actuel est incorrect.');
      return;
    }

    if (newPinInput.length < 4) {
      setIsVerifying(false);
      setError('Le nouveau code PIN doit comporter au moins 4 chiffres.');
      return;
    }

    try {
      await changeAdminPin(newPinInput);
      setIsVerifying(false);
      setChangeSuccess(true);
      setError('');
      setTimeout(() => {
        setChangeSuccess(false);
        setIsChangingPin(false);
        setCurrentPinInput('');
        setNewPinInput('');
      }, 1500);
    } catch (err) {
      setIsVerifying(false);
      setError(err.message || 'Erreur lors du changement de PIN.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/75 backdrop-blur-md animate-fadeIn">
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

        {/* Lock Icon with Geo Indicator */}
        <div className={`w-16 h-16 ${
          isGeoBlocked || lockoutInfo.isLocked
            ? 'bg-red-500/10 text-red-500 border-red-500/30'
            : 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
        } rounded-full flex items-center justify-center mx-auto mb-4 border-2 shadow-inner`}>
          {isGeoBlocked || lockoutInfo.isLocked ? <ShieldAlert className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1">
          Espace Administrateur Sécurisé 🔒
        </h2>
        
        {/* Geo Status Badge */}
        {geoChecking ? (
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 mb-5">
            <Radio className="w-3.5 h-3.5 text-brand-orange animate-pulse" />
            <span>Vérification de la localisation géographique...</span>
          </p>
        ) : geoStatus?.allowed ? (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold mb-5 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>Connexion Sécurisée depuis l'Algérie 🇩🇿 (Sans VPN)</span>
          </div>
        ) : null}

        {/* Geo Block Alert Banner */}
        {isGeoBlocked && (
          <div className="mb-5 p-4 bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 rounded-2xl text-xs font-bold border-2 border-red-300 dark:border-red-800 text-left space-y-1.5 shadow-md">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 font-black text-sm">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-600" />
              <span>Accès Géographiquement Bloqué 🚫</span>
            </div>
            <p className="text-[11px] font-normal leading-relaxed text-red-700 dark:text-red-300">
              {geoStatus.message}
            </p>
            <p className="text-[10px] text-red-600 dark:text-red-400 pt-1 border-t border-red-200 dark:border-red-900 font-mono">
              IP: {geoStatus.ip} | Pays: {geoStatus.countryName} ({geoStatus.countryCode})
            </p>
          </div>
        )}

        {/* Lockout Warning Banner */}
        {lockoutInfo.isLocked && !isGeoBlocked && (
          <div className="mb-4 p-3.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded-2xl text-xs font-bold border border-red-200 dark:border-red-900 flex items-center gap-2.5 text-left">
            <Clock className="w-5 h-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-extrabold">Accès temporairement verrouillé</p>
              <p className="text-[11px] font-normal mt-0.5">
                Temps restant : <strong>{lockoutInfo.remainingMinutes} min ({lockoutInfo.remainingSeconds}s)</strong>
              </p>
            </div>
          </div>
        )}

        {error && !lockoutInfo.isLocked && !isGeoBlocked && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {changeSuccess && (
          <div className="mb-4 p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 text-left">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Code PIN administrateur sécurisé et mis à jour !</span>
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
                  disabled={isGeoBlocked || lockoutInfo.isLocked || isVerifying || geoChecking}
                  value={pin}
                  onChange={(e) => { setPin(e.target.value); setError(''); }}
                  placeholder="••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold text-center tracking-widest disabled:opacity-40 disabled:cursor-not-allowed"
                  autoFocus
                  maxLength={12}
                />
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isGeoBlocked || lockoutInfo.isLocked || isVerifying || geoChecking}
              className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Valider l'authentification (Algérie 🇩🇿)</span>
                </>
              )}
            </button>

            {!isGeoBlocked && (
              <button
                type="button"
                disabled={lockoutInfo.isLocked}
                onClick={() => { setIsChangingPin(true); setError(''); }}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline block mx-auto pt-2"
              >
                Modifier le code PIN Administrateur
              </button>
            )}
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Code PIN Actuel
              </label>
              <input
                type="password"
                disabled={isGeoBlocked}
                value={currentPinInput}
                onChange={(e) => setCurrentPinInput(e.target.value)}
                placeholder="PIN actuel"
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nouveau Code PIN (Min. 4 chiffres)
              </label>
              <input
                type="password"
                disabled={isGeoBlocked}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Nouveau PIN secret"
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
                disabled={isVerifying || isGeoBlocked}
                className="flex-1 bg-brand-orange hover:bg-brand-orange-hover text-white py-2.5 rounded-xl font-bold text-xs shadow disabled:opacity-50"
              >
                {isVerifying ? 'Hachage...' : 'Enregistrer PIN'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
