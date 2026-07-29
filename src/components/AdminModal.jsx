import React, { useState } from 'react';
import { 
  X, 
  PlusCircle, 
  Trash2, 
  RotateCcw, 
  Upload, 
  Package, 
  Check,
  Zap,
  Images,
  Globe,
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';
import { formatPrice } from '../utils/formatters';
import { getStoredSpecialOffer, saveSpecialOffer } from '../utils/storage';

export default function AdminModal({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onDeleteProduct,
  onResetProducts,
  specialOffer,
  onUpdateSpecialOffer
}) {
  const [activeTab, setActiveTab] = useState('add'); // 'add', 'manage', 'special_offer'
  
  // Add Product Form State
  const [title, setTitle] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [price, setPrice] = useState('');
  const [oldPrice, setOldPrice] = useState('');
  const [category, setCategory] = useState(CATEGORIES[1] || 'High-Tech');
  const [badge, setBadge] = useState('Nouveau');
  const [description, setDescription] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  
  // Stock Management State
  const [inStock, setInStock] = useState(true);
  const [stockQuantity, setStockQuantity] = useState('10');

  // Multi-Image State
  const [imageUrlsText, setImageUrlsText] = useState('');
  const [imageFilesPreviews, setImageFilesPreviews] = useState([]);

  // Special Offer Admin Form State
  const [soEnabled, setSoEnabled] = useState(specialOffer ? specialOffer.enabled : true);
  const [soTagline, setSoTagline] = useState(specialOffer ? specialOffer.tagline : 'Vente Flash 24H ⚡');
  const [soSeasonBadge, setSoSeasonBadge] = useState(specialOffer ? specialOffer.seasonBadge : 'Arrivage Spécial Saison ☀️');
  const [soTitle, setSoTitle] = useState(specialOffer ? specialOffer.title : '');
  const [soTitleAr, setSoTitleAr] = useState(specialOffer ? specialOffer.titleAr : '');
  const [soPrice, setSoPrice] = useState(specialOffer ? specialOffer.price : '');
  const [soOldPrice, setSoOldPrice] = useState(specialOffer ? specialOffer.oldPrice : '');
  const [soCategory, setSoCategory] = useState(specialOffer ? specialOffer.category : 'High-Tech');
  const [soDescription, setSoDescription] = useState(specialOffer ? specialOffer.description : '');
  const [soDescriptionAr, setSoDescriptionAr] = useState(specialOffer ? specialOffer.descriptionAr : '');
  const [soImageFiles, setSoImageFiles] = useState(specialOffer ? (specialOffer.images || []) : []);
  const [soUrlsText, setSoUrlsText] = useState('');

  const [formSuccess, setFormSuccess] = useState(false);
  const [soSuccess, setSoSuccess] = useState(false);

  if (!isOpen) return null;

  // Handle Uploading Multiple Image Files for Add Product
  const handleMultipleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((base64Images) => {
      setImageFilesPreviews((prev) => [...prev, ...base64Images]);
    });
  };

  const handleRemovePreview = (index) => {
    setImageFilesPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Uploading Multiple Image Files for Special Offer
  const handleSoMultipleImageFiles = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((base64Images) => {
      setSoImageFiles((prev) => [...prev, ...base64Images]);
    });
  };

  const handleRemoveSoImage = (index) => {
    setSoImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Select Catalog product to quick-fill Special Offer
  const handleSelectProductForSpecialOffer = (prodId) => {
    const p = products.find((item) => item.id === prodId);
    if (p) {
      setSoTitle(p.title);
      setSoTitleAr(p.titleAr || '');
      setSoPrice(p.price);
      setSoOldPrice(p.oldPrice || p.price * 1.25);
      setSoCategory(p.category);
      setSoDescription(p.description);
      setSoDescriptionAr(p.descriptionAr || '');
      setSoImageFiles(p.images && p.images.length > 0 ? p.images : [p.image]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !price || !description.trim()) {
      alert('Veuillez remplir le nom, le prix et la description.');
      return;
    }

    const urlList = imageUrlsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const allImages = [...imageFilesPreviews, ...urlList];
    const defaultFallback = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80";
    const finalImageList = allImages.length > 0 ? allImages : [defaultFallback];

    const newProd = {
      id: `prod-${Date.now()}`,
      title: title.trim(),
      titleAr: titleAr.trim() || title.trim(),
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : null,
      category,
      badge: inStock ? badge.trim() : 'Rupture de Stock',
      description: description.trim(),
      descriptionAr: descriptionAr.trim() || description.trim(),
      image: finalImageList[0],
      images: finalImageList,
      inStock: inStock,
      stockQuantity: inStock ? parseInt(stockQuantity || 10) : 0,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString()
    };

    onAddProduct(newProd);
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 2500);

    setTitle('');
    setTitleAr('');
    setPrice('');
    setOldPrice('');
    setDescription('');
    setDescriptionAr('');
    setImageUrlsText('');
    setImageFilesPreviews([]);
    setStockQuantity('10');
    setInStock(true);
    setBadge('Nouveau');
  };

  const handleSaveSpecialOfferForm = (e) => {
    e.preventDefault();
    if (!soTitle.trim() || !soPrice) {
      alert('Veuillez renseigner le titre et le prix de l\'offre spéciale.');
      return;
    }

    const urlList = soUrlsText
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const allImages = [...soImageFiles, ...urlList];
    const defaultFallback = "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80";
    const finalImages = allImages.length > 0 ? allImages : [defaultFallback];

    const updatedOffer = {
      enabled: soEnabled,
      tagline: soTagline.trim() || 'Vente Flash ⚡',
      seasonBadge: soSeasonBadge.trim() || 'Arrivage Spécial Saison',
      title: soTitle.trim(),
      titleAr: soTitleAr.trim() || soTitle.trim(),
      price: parseFloat(soPrice),
      oldPrice: soOldPrice ? parseFloat(soOldPrice) : null,
      category: soCategory,
      description: soDescription.trim(),
      descriptionAr: soDescriptionAr.trim() || soDescription.trim(),
      images: finalImages,
      countdownHours: 24
    };

    onUpdateSpecialOffer(updatedOffer);
    saveSpecialOffer(updatedOffer);
    setSoSuccess(true);
    setTimeout(() => setSoSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 bg-brand-navy text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Package className="w-5 h-5 text-brand-orange" />
            <div>
              <h2 className="font-extrabold text-lg">Espace Administration & Configuration</h2>
              <p className="text-xs text-slate-300">Gestion des produits, stocks et de l'Offre Spéciale</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 px-4 pt-3 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'add'
                ? 'border-brand-orange text-brand-orange bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Nouveau Produit
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('special_offer')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'special_offer'
                ? 'border-brand-orange text-brand-orange bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4 text-brand-orange" />
            ⭐ Offre Spéciale du Jour
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manage'
                ? 'border-brand-orange text-brand-orange bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            Produits Publiés ({products.length})
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: Add New Product */}
          {activeTab === 'add' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {formSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Produit créé et publié en direct dans la boutique !
                </div>
              )}

              {/* Titles Fr / Ar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nom du produit (Français) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Écouteurs Bluetooth Pro 5"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم المنتج (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="مثال: سماعات بلوتوث برو 5"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'Tous').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge personnalisé
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Ex: Nouveau, Promo -15%, Top"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prix Vente DA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Ex: 4500"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ancien prix DA (Optionnel)
                  </label>
                  <input
                    type="number"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="Ex: 5500"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Stock Management */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-orange" />
                  Gestion des Stocks & Disponibilité
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Statut de Disponibilité
                    </label>
                    <select
                      value={inStock ? 'available' : 'out_of_stock'}
                      onChange={(e) => setInStock(e.target.value === 'available')}
                      className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                    >
                      <option value="available">🟢 En Stock (Disponible à la vente)</option>
                      <option value="out_of_stock">🔴 Rupture de Stock (Vente désactivée)</option>
                    </select>
                  </div>

                  {inStock && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Quantité disponible en stock
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(e.target.value)}
                        placeholder="Ex: 15"
                        className="w-full p-2 bg-white dark:bg-slate-900 rounded-lg text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Descriptions Fr / Ar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description (Français) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Caractéristiques, détails..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف المنتج (بالعربية)
                </label>
                <textarea
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  rows={2}
                  placeholder="المواصفات، التفاصيل بالعربية..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  dir="rtl"
                />
              </div>

              {/* Multi-Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Images className="w-4 h-4 text-brand-orange" />
                    Charger Plusieurs Photos du Produit (3-5 photos conseillées)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {imageFilesPreviews.length} photo(s) sélectionnée(s)
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-brand-orange transition-colors">
                  <Upload className="w-6 h-6 text-brand-orange mb-1" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Sélectionner plusieurs images depuis votre appareil
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageFiles}
                    className="hidden"
                  />
                </label>

                <div>
                  <textarea
                    value={imageUrlsText}
                    onChange={(e) => setImageUrlsText(e.target.value)}
                    rows={2}
                    placeholder="Ou coller plusieurs liens d'images (un par ligne) https://..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-mono"
                  />
                </div>

                {imageFilesPreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {imageFilesPreviews.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePreview(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Globe className="w-4 h-4" />
                <span>Publier le produit dans la boutique</span>
              </button>
            </form>
          )}

          {/* TAB 2: SPECIAL OFFER CONFIGURATION */}
          {activeTab === 'special_offer' && (
            <form onSubmit={handleSaveSpecialOfferForm} className="space-y-4">
              {soSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Offre Spéciale du Jour mise à jour et publiée en haut du site !
                </div>
              )}

              {/* Enable Switcher */}
              <div className="p-3.5 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-orange" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">Afficher la Bannière Offre Spéciale</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Positionnée en haut du site pour attirer l'attention des acheteurs</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={soEnabled}
                    onChange={(e) => setSoEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange" />
                </label>
              </div>

              {/* Quick Fill From Existing Catalog */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Remplissage rapide : Choisir un produit existant dans le magasin
                </label>
                <select
                  onChange={(e) => handleSelectProductForSpecialOffer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                >
                  <option value="">-- Sélectionner un produit pour l'Offre Spéciale --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({formatPrice(p.price)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Taglines & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tag / Titre de la Vente Flash
                  </label>
                  <input
                    type="text"
                    value={soTagline}
                    onChange={(e) => setSoTagline(e.target.value)}
                    placeholder="Ex: Vente Flash 24H ⚡, Vente Exclusive 💥"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Badge de Saison / Événement
                  </label>
                  <input
                    type="text"
                    value={soSeasonBadge}
                    onChange={(e) => setSoSeasonBadge(e.target.value)}
                    placeholder="Ex: Arrivage Spécial Été ☀️, Offre Ramadan 🌙"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              {/* Offer Title (Fr / Ar) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Titre du Produit (Français) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={soTitle}
                    onChange={(e) => setSoTitle(e.target.value)}
                    placeholder="Titre de l'article en offre spéciale"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    عنوان المنتج (بالعربية)
                  </label>
                  <input
                    type="text"
                    value={soTitleAr}
                    onChange={(e) => setSoTitleAr(e.target.value)}
                    placeholder="عنوان العرض الخاص بالعربية"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Price & Old Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prix Offre Spéciale DA <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={soPrice}
                    onChange={(e) => setSoPrice(e.target.value)}
                    placeholder="Ex: 5800"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Ancien Prix DA (Barré)
                  </label>
                  <input
                    type="number"
                    value={soOldPrice}
                    onChange={(e) => setSoOldPrice(e.target.value)}
                    placeholder="Ex: 7500"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-bold"
                  />
                </div>
              </div>

              {/* Descriptions Fr / Ar */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description de l'Offre (Français)
                </label>
                <textarea
                  value={soDescription}
                  onChange={(e) => setSoDescription(e.target.value)}
                  rows={2}
                  placeholder="Texte de présentation de l'offre spéciale..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  وصف العرض الخاص (بالعربية)
                </label>
                <textarea
                  value={soDescriptionAr}
                  onChange={(e) => setSoDescriptionAr(e.target.value)}
                  rows={2}
                  placeholder="تفاصيل العرض الخاص بالعربية..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none"
                  dir="rtl"
                />
              </div>

              {/* Multi-Photo Loader for Special Offer */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-brand-orange">
                    <Images className="w-4 h-4" />
                    Photos de l'Offre Spéciale (Charger au moins 3 à 4 photos HD)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {soImageFiles.length} photo(s)
                  </span>
                </label>

                <label className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 cursor-pointer hover:border-brand-orange transition-colors">
                  <Upload className="w-6 h-6 text-brand-orange mb-1" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Charger plusieurs photos HD pour le carrousel
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleSoMultipleImageFiles}
                    className="hidden"
                  />
                </label>

                <div>
                  <textarea
                    value={soUrlsText}
                    onChange={(e) => setSoUrlsText(e.target.value)}
                    rows={2}
                    placeholder="Ou coller des liens d'images (une URL par ligne) https://..."
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:border-brand-orange focus:outline-none font-mono"
                  />
                </div>

                {soImageFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {soImageFiles.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 group">
                        <img src={img} alt={`Offer Preview ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveSoImage(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publier l'Offre Spéciale du Jour en haut du site</span>
              </button>
            </form>
          )}

          {/* TAB 3: Manage Products */}
          {activeTab === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {products.length} produit(s) en ligne dans votre catalogue.
                </p>
                <button
                  type="button"
                  onClick={onResetProducts}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 bg-rose-50 dark:bg-rose-950/30 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Réinitialiser la démo
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
                {products.map((p) => {
                  const isOut = p.inStock === false || p.stockQuantity === 0 || p.badge === 'Rupture de Stock' || p.badge === 'نفذت الكمية';
                  const imgCount = p.images ? p.images.length : (p.image ? 1 : 0);

                  return (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                      <img
                        src={p.images ? p.images[0] : p.image}
                        alt={p.title}
                        className={`w-12 h-12 object-cover rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0 ${
                          isOut ? 'grayscale opacity-60' : ''
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {p.title}
                          </h4>
                          {isOut ? (
                            <span className="text-[10px] font-extrabold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.5 rounded">
                              Rupture
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.5 rounded">
                              En stock ({p.stockQuantity ?? 10})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] font-bold text-brand-orange">
                            {formatPrice(p.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {p.category}
                          </span>
                          {imgCount > 1 && (
                            <span className="text-[10px] text-sky-500 font-semibold">
                              🖼️ {imgCount} photos
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Supprimer du catalogue"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
