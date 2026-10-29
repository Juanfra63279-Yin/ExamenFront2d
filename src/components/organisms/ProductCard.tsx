import React from 'react';
import { Product } from '../../types';
import { ProofBadge } from '../atoms/ProofBadge';
import { StockPill } from '../atoms/StockPill';
import { PriceDiscountBlock } from '../molecules/PriceDiscountBlock';
import { FeedbackButton } from '../molecules/FeedbackButton';
import { Sparkles, Eye, ShieldCheck, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUndoAddToCart?: (product: Product) => void;
  onQuickView: (product: Product) => void;
  currentInCartCount?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onUndoAddToCart,
  onQuickView,
  currentInCartCount = 0
}) => {
  const isAvailable = product.stock > 0;

  return (
    <div
      className="group relative flex flex-col justify-between rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] hover:bg-[#252525] hover:border-[#3A3A3A] transition-all duration-200 overflow-hidden shadow-sm"
      tabIndex={0}
      aria-label={`Producto: ${product.name}`}
    >
      {/* Top Banner / Seasonal Tag */}
      {product.seasonalBadge && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E65100] text-white shadow-md">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{product.seasonalBadge}</span>
        </div>
      )}

      {/* Quick View Button on Hover */}
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="absolute top-3 right-3 z-10 p-2 rounded-lg bg-[#121212]/80 backdrop-blur-md text-[#E0E0E0] hover:text-[#FFFFFF] hover:bg-[#121212] opacity-80 md:opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
        title="Ver detalles de cata y origen"
        aria-label={`Ver detalles de ${product.name}`}
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Image Area */}
      <div
        className="relative w-full aspect-[4/3] bg-[#141414] overflow-hidden cursor-pointer"
        onClick={() => onQuickView(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 group-hover:brightness-100"
          loading="lazy"
        />

        {/* Ambient Bottom Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-black/30 pointer-events-none" />

        {/* Proof Badge overlay on bottom-right of image */}
        <div className="absolute bottom-2.5 right-2.5 pointer-events-none">
          <ProofBadge proofPct={product.proofPct} tier={product.proofTier} />
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-grow p-4">
        {/* Brand, Subcategory & Origin */}
        <div className="flex items-center justify-between text-xs text-[#9E9E9E] mb-1.5 gap-2">
          <span className="font-semibold text-[#FFB59A] tracking-wider uppercase text-[11px] truncate">
            {product.brand}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[#A0A0A0] truncate">
            <MapPin className="w-3 h-3 text-[#FF9800] flex-shrink-0" />
            <span className="truncate">{product.origin}</span>
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          className="text-base font-bold text-[#FFFFFF] group-hover:text-[#FFB59A] transition-colors line-clamp-2 cursor-pointer leading-tight mb-2"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Volume & Distillery specs */}
        <div className="flex items-center gap-2 text-xs text-[#8A8A8A] mb-3">
          <span className="px-2 py-0.5 rounded bg-[#151515] text-[#D0D0D0] font-mono text-[11px] border border-[#2D2D2D]">
            {product.volume}
          </span>
          <span className="text-[11px] text-[#7E7E7E] truncate">
            {product.subcategory}
          </span>
        </div>

        {/* Real-time Stock Indicator */}
        <div className="mb-4">
          <StockPill stock={product.stock} />
        </div>

        {/* Price Block */}
        <div className="mt-auto pt-3 border-t border-[#2A2A2A]/80 mb-4">
          <PriceDiscountBlock
            regularPrice={product.regularPrice}
            promoPrice={product.promoPrice}
            discountPct={product.discountPct}
          />
        </div>

        {/* Action Button: 48px Nielsen #1 Feedback Button */}
        <div>
          {isAvailable ? (
            <FeedbackButton
              label={currentInCartCount > 0 ? `En Carrito (${currentInCartCount}) • +1` : 'Agregar al Carrito'}
              loadingLabel="Añadiendo a bodega..."
              confirmedLabel="Agregado (Cancelar)"
              undoDurationMs={5000}
              onAction={async () => {
                // Simulate ultra fast cart write
                await new Promise((r) => setTimeout(r, 450));
                onAddToCart(product, 1);
              }}
              onUndo={() => {
                if (onUndoAddToCart) onUndoAddToCart(product);
              }}
            />
          ) : (
            <button
              type="button"
              disabled
              className="w-full min-h-[48px] h-12 px-4 rounded-lg bg-[#181818] border border-[#2D2D2D] text-[#777777] font-semibold text-xs cursor-not-allowed select-none"
            >
              Agotado en Bodega Neza
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
