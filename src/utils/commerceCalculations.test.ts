import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProofTier,
  calculateCartSubtotal,
  calculateCouponDiscount,
  calculateDeliveryFee,
  calculateIVA,
  calculateProfitMargin
} from './commerceCalculations';

test('calculateProofTier categorizes spirit proof correctly per spec', () => {
  // Alta (> 38% Alc. Vol.)
  assert.equal(calculateProofTier(40), 'alta');
  assert.equal(calculateProofTier(38), 'alta');

  // Media (15% - 37% Alc. Vol.)
  assert.equal(calculateProofTier(35), 'media');
  assert.equal(calculateProofTier(15), 'media');

  // Baja (< 15% Alc. Vol. / Cervezas & Vinos)
  assert.equal(calculateProofTier(13.8), 'baja');
  assert.equal(calculateProofTier(5.0), 'baja');
});

test('calculateCartSubtotal sums quantities and promotional prices', () => {
  const items = [
    { price: 943, quantity: 2 }, // Don Julio 70
    { price: 520, quantity: 1 }  // Mezcal 400 Conejos
  ];
  assert.equal(calculateCartSubtotal(items), 1886 + 520);
});

test('calculateCouponDiscount applies NEZAEXPRESS and FIESTA2026 accurately', () => {
  assert.equal(calculateCouponDiscount('NEZAEXPRESS', 1000), 50);
  assert.equal(calculateCouponDiscount('FIESTA2026', 1000), 100);
  assert.equal(calculateCouponDiscount('INVALID_CODE', 1000), 0);
  assert.equal(calculateCouponDiscount(undefined, 1000), 0);
});

test('calculateDeliveryFee applies free delivery over zone threshold', () => {
  const baseFee = 45;
  const freeThreshold = 800;

  assert.equal(calculateDeliveryFee(0, baseFee, freeThreshold), 0);
  assert.equal(calculateDeliveryFee(750, baseFee, freeThreshold), 45);
  assert.equal(calculateDeliveryFee(800, baseFee, freeThreshold), 0);
  assert.equal(calculateDeliveryFee(1200, baseFee, freeThreshold), 0);
});

test('calculateProfitMargin calculates wholesale to retail percentage', () => {
  // Wholesale 710, Retail 943 -> ((943 - 710) / 943) * 100 = 24.708% -> 24.7%
  assert.equal(calculateProfitMargin(710, 943), 24.7);
  assert.equal(calculateProfitMargin(100, 200), 50.0);
});
