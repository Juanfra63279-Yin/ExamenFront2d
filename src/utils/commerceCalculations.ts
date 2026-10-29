import { ProofTier } from '../types';

export function calculateProofTier(proofPct: number): ProofTier {
  if (proofPct >= 38) return 'alta';
  if (proofPct >= 15) return 'media';
  return 'baja';
}

export function calculateCartSubtotal(items: { price: number; quantity: number }[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateCouponDiscount(code: string | undefined, subtotal: number): number {
  if (!code) return 0;
  const normalized = code.trim().toUpperCase();
  if (normalized === 'NEZAEXPRESS') {
    return Math.min(50, Math.round(subtotal * 0.5));
  }
  if (normalized === 'FIESTA2026') {
    return Math.round(subtotal * 0.1);
  }
  return 0;
}

export function calculateDeliveryFee(subtotal: number, baseFee: number, freeThreshold: number): number {
  if (subtotal <= 0) return 0;
  if (subtotal >= freeThreshold) return 0;
  return baseFee;
}

export function calculateIVA(taxableAmount: number): number {
  // 16% Mexican VAT included in retail price
  return Math.round((taxableAmount * (16 / 116)) * 100) / 100;
}

export function calculateProfitMargin(wholesaleCost: number, retailPrice: number): number {
  if (retailPrice <= 0) return 0;
  return Math.round(((retailPrice - wholesaleCost) / retailPrice) * 1000) / 10;
}
