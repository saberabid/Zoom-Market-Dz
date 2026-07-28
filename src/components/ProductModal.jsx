import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  Star, 
  Plus, 
  Minus, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  RotateCcw
} from 'lucide-react';
import { formatPrice } from '../utils/formatters';
import { TRANSLATIONS, CATEGORY_MAP_AR } from '../data/translations';

export default function ProductModal({ product, onClose, onAddToCart, onBuyNow, lang = 'fr' }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // HD Interactive Zoom States
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isHoveringZoom, setIsHoveringZoom] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const imageRef = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;

  useEffect(() => {
    setSelectedImageIndex(0);
    setQuantity(1);
    setZoomLevel(1);
  }, [product]);

  if (!product) return null;

  const isOutOfStock = product.inStock === false || product.stockQuantity === 0 || product.badge === 'Rupture de Stock' || product.badge === 'نفذت الكمية';

  // Get image list
  const imageList = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  const currentImage = imageList[selectedImageIndex] || imageList[0];

  const titleText = (lang === 'ar' && product.titleAr) ? product.titleAr : product.title;
  const descText = (lang === 'ar' && product.descriptionAr) ? product.descriptionAr : product.description;
  const categoryLabel = (lang === 'ar' && CATEGORY_MAP_AR[product.category]) ? CATEGORY_MAP_AR[product.category] : product.category;

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleAdd = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuy = () => {
    if (isOutOfStock) return;
    onBuyNow(product, quantity);
  };

  return (
    <>
      {/* Main Product Quick View Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-fadeIn">
        <div 
          className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 relative flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white p-2 rounded-full transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Image Section & Interactive Zoom Container */}
          <div className="md:w-1/2 bg-slate-50 dark:bg-slate-850 p-6 flex flex-col justify-between relative">
            {isOutOfStock ? (
              <span className="absolute top-4 left-4 z-10 bg-red-700 text-white text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shadow flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                {t.outOfStock}
              </span>
            ) : (
              product.badge && (
                <span className="absolute top-4 left-4 z-10 bg-brand-orange text-white text-xs font-extrabold px-3 py-1 rounded-lg uppercase tracking-wider shadow">
                  {product.badge}
                </span>
              )
            )}

            {/* Main Interactive Zoomable Image Box */}
            <div 
              ref={imageRef}
              onMouseEnter={() => setIsHoveringZoom(true)}
              onMouseLeave={() => setIsHoveringZoom(false)}
              onMouseMove={handleMouseMove}
              onClick={() => setIsZoomModalOpen(true)}
              className="flex-1 flex items-center justify-center py-4 relative cursor-zoom-in overflow-hidden rounded-2xl group"
            >
              <img
                src={currentImage}
                alt={titleText}
                className={`max-h-72 w-full object-contain rounded-2xl transition-transform duration-300 ${
                  isHoveringZoom ? 'scale-125' : 'scale-100'
                } ${isOutOfStock ? 'grayscale opacity-75' : ''}`}
                style={
                  isHoveringZoom
                    ? { transformOrigin: `${mousePos.x}% ${mousePos.y}%` }
                    : { transformOrigin: 'center center' }
                }
              />

              {/* Hover Zoom Prompt Badge */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-brand-navy/80 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-md pointer-events-none">
                <ZoomIn className="w-3.5 h-3.5 text-brand-orange" />
                <span>{t.zoomHint}</span>
              </div>
            </div>

            {/* Multiple Image Gallery Thumbnails */}
            {imageList.length > 1 && (
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2.5 overflow-x-auto no-scrollbar">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-brand-orange shadow-md scale-105'
                        : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Vue ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info Section */}
          <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  {categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating || '4.8'}</span>
                  <span className="text-slate-400">({product.reviewsCount || 24} avis)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {titleText}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-3 my-4">
                <span className="text-2xl sm:text-3xl font-black text-brand-navy dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice && (
                  <span className="text-base text-slate-400 line-through font-semibold">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {descText}
              </p>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.quantity}</span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Features / Stock */}
              <div className="space-y-2 mb-6 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{t.outOfStock}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.inStock} ({product.stockQuantity ?? 10})</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-orange" />
                  <span>{t.shipping69}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-navy dark:text-slate-300" />
                  <span>{t.securePayment}</span>
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed shadow-none'
                    : added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-brand-orange" />
                <span>{isOutOfStock ? t.indisponible : added ? t.added : t.addToCart}</span>
              </button>

              <button
                onClick={handleBuy}
                disabled={isOutOfStock}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
                  isOutOfStock
                    ? 'bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed shadow-none'
                    : 'bg-brand-orange hover:bg-brand-orange-hover text-white hover:shadow-glow'
                }`}
              >
                {t.buyNow}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen HD Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-fadeIn">
          {/* Top Controls Bar */}
          <div className="flex items-center justify-between text-white z-10 px-4">
            <h3 className="font-extrabold text-sm truncate max-w-xs">{titleText}</h3>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                className="p-2 bg-slate-800/80 hover:bg-brand-orange rounded-xl transition-colors"
                title="Zoom Avant (+)"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                className="p-2 bg-slate-800/80 hover:bg-brand-orange rounded-xl transition-colors"
                title="Zoom Arrière (-)"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-2 bg-slate-800/80 hover:bg-brand-orange rounded-xl transition-colors"
                title="Réinitialiser"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-2 bg-slate-800/80 hover:bg-red-600 rounded-xl transition-colors ml-2"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Image Container */}
          <div className="flex-1 flex items-center justify-center overflow-auto p-4">
            <img
              src={currentImage}
              alt={titleText}
              className="max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-200 cursor-grab active:cursor-grabbing shadow-2xl rounded-2xl"
              style={{ transform: `scale(${zoomLevel})` }}
            />
          </div>

          {/* Bottom Thumbnails */}
          {imageList.length > 1 && (
            <div className="flex items-center justify-center gap-3 py-2 z-10">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-brand-orange scale-110' : 'border-slate-700 opacity-60'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
