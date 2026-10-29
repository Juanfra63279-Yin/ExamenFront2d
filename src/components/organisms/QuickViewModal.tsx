import React, { useState } from 'react';
import { Product } from '../../types';
import { ProofBadge } from '../atoms/ProofBadge';
import { StockPill } from '../atoms/StockPill';
import { PriceDiscountBlock } from '../molecules/PriceDiscountBlock';
import { TactileStepper } from '../molecules/TactileStepper';
import { FeedbackButton } from '../molecules/FeedbackButton';
import { X, ShieldCheck, MapPin, Award, UtensilsCrossed, Sparkles, Building2 } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalles de ${product.name}`}
    >
      <div
        className="relative w-full max-w-3xl rounded-2xl bg-[#1E1E1E] border border-[#333333] shadow-2xl shadow-black overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#121212]/80 text-[#E0E0E0] hover:text-white hover:bg-[#121212] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Badges */}
        <div className="md:w-5/12 bg-[#121212] relative flex items-center justify-center min-h-[260px] md:min-h-full p-6">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[360px] object-cover rounded-xl shadow-lg border border-[#2D2D2D]"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <ProofBadge proofPct={product.proofPct} tier={product.proofTier} />
            {product.seasonalBadge && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E65100] text-white">
                <Sparkles className="w-3 h-3" />
                {product.seasonalBadge}
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Purchase Actions */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase text-[#FFB59A] tracking-wider mb-1">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-[#9E9E9E]">{product.subcategory}</span>
            </div>

            <h2 className="text-xl md:text-2xl font-extrabold text-[#FFFFFF] leading-snug mb-3">
              {product.name}
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#E0E0E0] mb-4">
              <span className="flex items-center gap-1 bg-[#252525] px-2.5 py-1 rounded border border-[#333333]">
                <MapPin className="w-3.5 h-3.5 text-[#FF9800]" />
                {product.origin}
              </span>
              <span className="bg-[#252525] px-2.5 py-1 rounded border border-[#333333] font-mono">
                {product.volume}
              </span>
              <StockPill stock={product.stock} />
            </div>

            {/* Tasting Notes */}
            <div className="mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9E9E9E] mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#FF9800]" />
                Notas de Cata & Barrica
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.tastingNotes.map((note, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-[#252525] border border-[#3A3A3A] text-xs text-[#E0E0E0]"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* Food Pairing */}
            <div className="mb-4 p-3 rounded-xl bg-[#252525]/60 border border-[#2D2D2D]">
              <div className="text-xs font-bold text-[#FF9800] flex items-center gap-1.5 mb-1">
                <UtensilsCrossed className="w-4 h-4" />
                Maridaje Recomendado
              </div>
              <p className="text-xs text-[#E0E0E0] leading-relaxed">
                {product.pairing}
              </p>
            </div>

            {/* Distillery & Authenticity */}
            <div className="flex items-center justify-between text-[11px] text-[#9E9E9E] border-t border-[#2D2D2D] pt-3 mb-4">
              <div className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#A0A0A0]" />
                <span>{product.distillery}</span>
              </div>
              <div className="flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#00C853]" />
                <span>SAT / Marbete 100% Original</span>
              </div>
            </div>
          </div>

          {/* Pricing & Cart Action Bottom Section */}
          <div className="pt-4 border-t border-[#2D2D2D] bg-[#1E1E1E]">
            <div className="flex items-center justify-between mb-4">
              <PriceDiscountBlock
                regularPrice={product.regularPrice}
                promoPrice={product.promoPrice}
                discountPct={product.discountPct}
                size="large"
              />
              <TactileStepper
                quantity={quantity}
                max={product.stock}
                onChange={(q) => setQuantity(Math.max(1, q))}
              />
            </div>

            <FeedbackButton
              label={`Agregar ${quantity} al Carrito`}
              loadingLabel="Confirmando existencia en bodega..."
              confirmedLabel="¡Agregado con éxito!"
              onAction={async () => {
                await new Promise((r) => setTimeout(r, 400));
                onAddToCart(product, quantity);
                setTimeout(onClose, 900);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
