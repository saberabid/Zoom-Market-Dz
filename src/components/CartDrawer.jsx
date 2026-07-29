import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Truck, 
  Send, 
  MessageSquare,
  AlertCircle,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import { WILAYAS } from '../data/wilayas';
import { formatPrice, validateDZPhone } from '../utils/formatters';
import { sendOrderNotification, generateWhatsAppOrderUrl } from '../utils/email';
import { TRANSLATIONS } from '../data/translations';
import { addOrderToStorage } from '../utils/storage';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  emailConfig,
  lang = 'fr'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16'); // Default 16 - Alger
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get current selected wilaya object
  const currentWilaya = WILAYAS.find(w => w.code === selectedWilayaCode) || WILAYAS[15];
  const shippingFee = currentWilaya ? currentWilaya.fee : 400;

  // Calculate Subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shippingFee;

  // Validate form fields
  const validateForm = () => {
    const errs = {};
    if (!fullName.trim()) errs.fullName = lang === 'ar' ? 'الاسم واللقب مطلوب' : 'Le nom et prénom sont obligatoires.';
    if (!phone.trim()) {
      errs.phone = lang === 'ar' ? 'رقم الهاتف مطلوب' : 'Le numéro de téléphone est obligatoire.';
    } else if (!validateDZPhone(phone)) {
      errs.phone = lang === 'ar' ? 'رقم غير صحيح (05/06/07 + 8 أرقام)' : 'Numéro invalide. Ex: 0550123456 (05, 06 ou 07 + 8 chiffres).';
    }
    if (!address.trim()) errs.address = lang === 'ar' ? 'عنوان التوصيل مطلوب' : 'L\'adresse de livraison est obligatoire.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle Submit Order via EmailJS / FormSubmit + Local Storage Order Recording
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    setLoading(true);

    const orderData = {
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        wilaya: currentWilaya.name,
        address: address.trim(),
        notes: notes.trim()
      },
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      date: new Date().toLocaleString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ')
    };

    // Save order locally for Admin listing
    addOrderToStorage(orderData);

    try {
      await sendOrderNotification({ orderData, emailConfig });
      setLoading(false);
      
      onOrderSuccess({
        orderData,
        whatsappUrl: generateWhatsAppOrderUrl(orderData, emailConfig.storePhone)
      });
      
      setFullName('');
      setPhone('');
      setAddress('');
      setNotes('');
      setErrors({});
    } catch (err) {
      console.error('Order error:', err);
      setLoading(false);
    }
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;
    if (!validateForm()) return;

    const orderData = {
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        wilaya: currentWilaya.name,
        address: address.trim(),
        notes: notes.trim()
      },
      items: cartItems,
      subtotal,
      shippingFee,
      total,
      date: new Date().toLocaleString(lang === 'ar' ? 'ar-DZ' : 'fr-DZ')
    };

    // Save order locally for Admin listing
    addOrderToStorage(orderData);

    const waUrl = generateWhatsAppOrderUrl(orderData, emailConfig.storePhone);
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-brand-navy/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />

      <div className={`absolute inset-y-0 ${lang === 'ar' ? 'left-0 pr-10' : 'right-0 pl-10'} max-w-full flex`}>
        <div className="w-screen max-w-lg bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
          
          {/* Drawer Header */}
          <div className="p-5 bg-brand-navy text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-orange text-white rounded-xl shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg leading-tight">{t.myCart}</h2>
                <p className="text-xs text-slate-300">
                  {cartItems.length} {t.selectedArticles}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {t.emptyCart}
                </h3>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  {t.emptyCartDesc}
                </p>
                <button
                  onClick={onClose}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
                >
                  {t.exploreProducts}
                </button>
              </div>
            ) : (
              <>
                {/* Product List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t.selectedArticles}
                    </span>
                    <button
                      onClick={onClearCart}
                      className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.clearCart}
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-56 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const itemTitle = (lang === 'ar' && item.titleAr) ? item.titleAr : item.title;
                      return (
                        <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                          <img
                            src={item.images ? item.images[0] : item.image}
                            alt={itemTitle}
                            className="w-14 h-14 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {itemTitle}
                            </h4>
                            <p className="text-xs text-brand-orange font-extrabold mt-0.5">
                              {formatPrice(item.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-6 text-center text-xs font-bold text-slate-900 dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end justify-between h-14">
                            <button
                              onClick={() => onRemoveItem(item.id)}
                              className="text-slate-400 hover:text-red-500 p-1"
                              title="Supprimer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <span className="text-xs font-black text-slate-900 dark:text-white">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Form Section */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    {t.shippingInfo}
                  </h3>

                  <form onSubmit={handleSubmitOrder} className="space-y-3">
                    {/* Nom & Prénom */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.fullName} <span className="text-brand-orange">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={t.fullNamePlaceholder}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border ${
                            errors.fullName ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                          } text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none`}
                        />
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.phone} <span className="text-brand-orange">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.phonePlaceholder}
                          className={`w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border ${
                            errors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                          } text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none`}
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Wilaya Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.wilaya} <span className="text-brand-orange">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={selectedWilayaCode}
                          onChange={(e) => setSelectedWilayaCode(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none appearance-none cursor-pointer"
                        >
                          {WILAYAS.map((w) => (
                            <option key={w.code} value={w.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                              {w.name} ({formatPrice(w.fee)})
                            </option>
                          ))}
                        </select>
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      </div>
                    </div>

                    {/* Adresse */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {t.address} <span className="text-brand-orange">*</span>
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={2}
                        placeholder={t.addressPlaceholder}
                        className={`w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border ${
                          errors.address ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'
                        } text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none`}
                      />
                      {errors.address && (
                        <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.address}
                        </p>
                      )}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        {t.notes}
                      </label>
                      <input
                        type="text"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={t.notesPlaceholder}
                        className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                      />
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.shippingFee}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>{t.totalToPay}</span>
                  <span className="text-brand-orange">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-glow transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.confirmOrder} ({formatPrice(total)})</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.orderViaWhatsApp}</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
