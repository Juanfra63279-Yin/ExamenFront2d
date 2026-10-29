import React, { useState } from 'react';
import { CartItem, DeliveryZone } from '../../types';
import { TactileStepper } from '../molecules/TactileStepper';
import { ProofBadge } from '../atoms/ProofBadge';
import {
  X,
  ShoppingBag,
  Trash2,
  MapPin,
  Tag,
  Check,
  AlertCircle,
  Truck,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface FloatingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onProceedToCheckout: (appliedDiscount: number, couponCode?: string) => void;
}

export const FloatingCart: React.FC<FloatingCartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onClearCart,
  deliveryZones,
  selectedZone,
  onSelectZone,
  onProceedToCheckout
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Price calculations
  const subtotal = items.reduce((sum, item) => sum + item.product.promoPrice * item.quantity, 0);
  const isFreeDelivery = subtotal >= selectedZone.freeThreshold;
  const deliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : selectedZone.deliveryFee;

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (code === 'NEZAEXPRESS') {
      const discount = Math.min(50, subtotal * 0.5);
      setAppliedCoupon({ code, discount });
    } else if (code === 'FIESTA2026') {
      const discount = Math.round(subtotal * 0.1);
      setAppliedCoupon({ code, discount });
    } else {
      setCouponError('Cupón no válido. Usa "NEZAEXPRESS" o "FIESTA2026"');
    }
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  // In Mexican commerce, prices usually include IVA 16% (impuesto desglosado para comprobante)
  const iva = taxableSubtotal * (16 / 116);
  const total = taxableSubtotal + deliveryFee;

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito Flotante VinoNez"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div
          className="w-screen max-w-md bg-[#2D2D2D] border-l border-[#3A3A3A] shadow-2xl flex flex-col justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#3A3A3A] bg-[#252525] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#E65100]/20 text-[#FF9800]">
                <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  Carrito Flotante
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#181818] text-[#FFB74D] border border-[#333333] font-mono tabular-nums">
                    {totalItemsCount} {totalItemsCount === 1 ? 'botella' : 'botellas'}
                  </span>
                </h2>
                <p className="text-xs text-[#9E9E9E]">Despacho exprés bodega Nezahualcóyotl</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-[#9E9E9E] hover:text-white hover:bg-[#333333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Zone Selector Callout */}
          <div className="px-4 py-3 bg-[#201F1F] border-b border-[#3A3A3A] flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-[#FF9800] font-semibold">
                <Truck className="w-4 h-4" />
                Entrega Local Neza:
              </span>
              <span className="text-[11px] font-mono text-[#00C853]">
                {isFreeDelivery ? 'Envío GRATIS' : `${formatPrice(selectedZone.deliveryFee)} envío`}
              </span>
            </div>
            <select
              value={selectedZone.id}
              onChange={(e) => {
                const zone = deliveryZones.find((z) => z.id === e.target.value);
                if (zone) onSelectZone(zone);
              }}
              className="w-full text-xs bg-[#1A1A1A] border border-[#3A3A3A] text-white rounded-md p-2 focus:outline-none focus:border-[#FFB74D]"
              aria-label="Seleccionar zona de entrega en Nezahualcóyotl"
            >
              {deliveryZones.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.name} • {zone.estimatedMinutes} (
                  {subtotal >= zone.freeThreshold ? 'Gratis' : `$${zone.deliveryFee} MXN`})
                </option>
              ))}
            </select>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-[#3A3A3A]/60">
            {items.length === 0 ? (
              <div className="py-16 text-center text-[#9E9E9E]">
                <ShoppingBag className="w-12 h-12 mx-auto stroke-[1.2] mb-3 opacity-40 text-[#FF9800]" />
                <p className="text-base font-semibold text-white">Tu carrito está vacío</p>
                <p className="text-xs text-[#9E9E9E] mt-1 max-w-xs mx-auto">
                  Agrega licores, tequilas, mezcales o vinos para despacho exprés en menos de 35 minutos.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 min-h-[44px] px-4 py-2 rounded-lg bg-[#E65100] text-white font-semibold text-xs hover:bg-[#FF6D00] transition-colors"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="pt-3 first:pt-0 flex gap-3 items-start">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-16 object-cover rounded-md bg-[#181818] border border-[#3A3A3A] flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-[#9E9E9E] flex items-center gap-1.5 mt-0.5">
                          <span>{item.product.volume}</span>
                          <span>•</span>
                          <ProofBadge
                            proofPct={item.product.proofPct}
                            tier={item.product.proofTier}
                            showTierLabel={false}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.product.id, 0)}
                        className="text-[#9E9E9E] hover:text-[#EF4444] p-1 transition-colors"
                        title="Eliminar de carrito"
                        aria-label={`Eliminar ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="text-sm font-bold text-white font-mono tabular-nums">
                        {formatPrice(item.product.promoPrice * item.quantity)}
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-[#9E9E9E] ml-1.5 font-normal">
                            ({formatPrice(item.product.promoPrice)} c/u)
                          </span>
                        )}
                      </div>

                      <TactileStepper
                        quantity={item.quantity}
                        max={item.product.stock}
                        onChange={(newQ) => onUpdateQuantity(item.product.id, newQ)}
                        size="compact"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary & Checkout Commitment */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#3A3A3A] bg-[#252525] space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-[#9E9E9E] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código (NEZAEXPRESS / FIESTA2026)"
                    className="w-full text-xs pl-8 pr-3 py-2 rounded-lg bg-[#1C1B1B] border border-[#3A3A3A] text-white placeholder-[#777] focus:outline-none focus:border-[#FFB74D] uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 rounded-lg bg-[#353534] hover:bg-[#3E3E3E] text-white text-xs font-semibold transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-[#00C853] bg-[#00C853]/10 px-2.5 py-1.5 rounded border border-[#00C853]/30">
                  <span className="flex items-center gap-1 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    Cupón &ldquo;{appliedCoupon.code}&rdquo; aplicado
                  </span>
                  <span className="font-mono font-bold">-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}

              {couponError && (
                <div className="text-[11px] text-[#EF4444] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {couponError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#E0E0E0] pt-1">
                <div className="flex justify-between">
                  <span className="text-[#9E9E9E]">Subtotal productos:</span>
                  <span className="tabular-nums font-mono">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#E65100]">
                    <span>Descuento cupón:</span>
                    <span className="tabular-nums font-mono">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-[#9E9E9E]">Envío exprés Neza:</span>
                  <span className="tabular-nums font-mono">
                    {deliveryFee === 0 ? (
                      <span className="text-[#00C853] font-bold">GRATIS</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-[#9E9E9E]">
                  <span>IVA 16% (incluido desglosado):</span>
                  <span className="tabular-nums font-mono">{formatPrice(iva)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#3A3A3A]">
                  <span>Total a pagar:</span>
                  <span className="text-xl text-[#FFB59A] tabular-nums font-mono">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="flex items-center gap-2 p-2 rounded bg-[#1C1B1B] text-[11px] text-[#9E9E9E]">
                <ShieldCheck className="w-4 h-4 text-[#FF9800] flex-shrink-0" />
                <span>Venta exclusiva a mayores de 18 años con identificación oficial INE en mano.</span>
              </div>

              {/* Primary 48px CTA */}
              <button
                type="button"
                onClick={() => onProceedToCheckout(discountAmount, appliedCoupon?.code)}
                className="w-full min-h-[48px] h-12 rounded-lg bg-[#E65100] hover:bg-[#FF6D00] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#E65100]/25 transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
