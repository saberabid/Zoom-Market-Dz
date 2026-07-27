import React, { useState } from 'react';
import { ShoppingCart, Eye, Star, Check, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

export default function ProductCard({ product, onAddToCart, onQuickView }) {
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isOutOfStock = product.inStock === false || product.stockQuantity === 0 || product.badge === 'Rupture de Stock';

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : null;

  const primaryImage = (product.images && product.images.length > 0) ? product.images[0] : product.image;
  const fallbackImg = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80";

  return (
    <div 
      onClick={() => onQuickView(product)}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-card dark:shadow-card-dark hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      <div>
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {isOutOfStock ? (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Rupture de stock
            </span>
          ) : (
            product.badge && (
              <span className="bg-brand-orange text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
                {product.badge}
              </span>
            )
          )}
          {discountPercent && !isOutOfStock && (
            <span className="bg-rose-600 text-white text-[11px] font-extrabold px-2 py-0.5 rounded-md shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Product Image Box */}
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={imgError || !primaryImage ? fallbackImg : primaryImage}
            alt={product.title}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out ${
              isOutOfStock ? 'grayscale opacity-60' : ''
            }`}
            loading="lazy"
          />

          {/* Multiple images indicator badge */}
          {product.images && product.images.length > 1 && (
            <span className="absolute bottom-2.5 right-2.5 bg-brand-navy/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm shadow">
              +{product.images.length} photos
            </span>
          )}

          <div className="absolute inset-0 bg-brand-navy/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="bg-white/90 hover:bg-white text-brand-navy p-3 rounded-full shadow-lg transform -translate-y-2 group-hover:translate-y-0 transition-all duration-300 font-medium text-xs flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-brand-orange" />
              <span>Aperçu</span>
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 sm:p-5">
          {/* Category & Rating & Stock count */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider">
              {product.category || 'Général'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.8'}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount || 12})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg line-clamp-2 leading-snug group-hover:text-brand-orange transition-colors">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Price & Add to Cart */}
      <div className="p-4 sm:p-5 pt-0 mt-auto border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 block -mb-0.5 font-medium">Prix</span>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white text-lg sm:text-xl">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through font-medium">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all active:scale-95 shadow-md ${
            isOutOfStock
              ? 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed shadow-none'
              : added
              ? 'bg-emerald-600 text-white'
              : 'bg-brand-navy hover:bg-brand-orange text-white dark:bg-brand-orange dark:hover:bg-brand-orange-hover'
          }`}
        >
          {isOutOfStock ? (
            <span>Indisponible</span>
          ) : added ? (
            <>
              <Check className="w-4 h-4" />
              <span>Ajouté</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Ajouter</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
