/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, DeliveryZone, Order, Employee, OrderStatus } from './types';
import { INITIAL_PRODUCTS, DELIVERY_ZONES, INITIAL_ORDERS, INITIAL_EMPLOYEES } from './data/mockData';
import { ConsumerStorefront } from './components/organisms/ConsumerStorefront';
import { AdminOpsView } from './components/organisms/AdminOpsView';
import { FloatingCart } from './components/organisms/FloatingCart';
import { QuickViewModal } from './components/organisms/QuickViewModal';
import { CheckoutModal } from './components/organisms/CheckoutModal';
import { AgeVerificationGate } from './components/organisms/AgeVerificationGate';

export default function App() {
  // Current active view: consumer storefront or back-office operations
  const [currentView, setCurrentView] = useState<'storefront' | 'admin'>('storefront');

  // Application Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryZones] = useState<DeliveryZone[]>(DELIVERY_ZONES);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone>(DELIVERY_ZONES[0]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [checkoutCouponCode, setCheckoutCouponCode] = useState<string | undefined>(undefined);

  // Age verification state (Mexico +18 legal requirement)
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('vinonez_age_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [showAgeGate, setShowAgeGate] = useState<boolean>(!isAgeVerified);

  const handleConfirmAge = () => {
    try {
      localStorage.setItem('vinonez_age_verified', 'true');
    } catch {
      // ignore
    }
    setIsAgeVerified(true);
    setShowAgeGate(false);
  };

  const handleRejectAge = () => {
    // Redirect or display block message
    window.location.href = 'https://www.google.com';
  };

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQuantity = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
      }
    });
  };

  const handleUndoAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter((item) => item.product.id !== product.id);
      }
      return prev.map((item) =>
        item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCartItems((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleProceedToCheckout = (discount: number, coupon?: string) => {
    setCheckoutDiscount(discount);
    setCheckoutCouponCode(coupon);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Deduct stock in real-time
    setProducts((prev) =>
      prev.map((prod) => {
        const boughtItem = newOrder.items.find((i) => i.product.id === prod.id);
        if (boughtItem) {
          return { ...prod, stock: Math.max(0, prod.stock - boughtItem.quantity) };
        }
        return prod;
      })
    );

    // Empty cart
    setCartItems([]);
  };

  // Ops Actions
  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleToggleEmployeeActive = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, active: !e.active } : e))
    );
  };

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-[#E0E0E0]">
      {/* Age Verification Gate (Mexican legal +18 requirement) */}
      <AgeVerificationGate
        isOpen={showAgeGate}
        onConfirm={handleConfirmAge}
        onReject={handleRejectAge}
      />

      {/* Main View Switching: Storefront vs VinoNez Ops */}
      {currentView === 'storefront' ? (
        <ConsumerStorefront
          products={products}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onUndoAddToCart={handleUndoAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onQuickView={(p) => setQuickViewProduct(p)}
          deliveryZones={deliveryZones}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
          onSwitchToAdmin={() => setCurrentView('admin')}
        />
      ) : (
        <AdminOpsView
          products={products}
          orders={orders}
          employees={employees}
          onUpdateProductStock={handleUpdateProductStock}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onToggleEmployeeActive={handleToggleEmployeeActive}
          onSwitchView={() => setCurrentView('storefront')}
        />
      )}

      {/* Floating Quick Cart Sheet */}
      <FloatingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onClearCart={handleClearCart}
        deliveryZones={deliveryZones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Quick View Tasting & Spec Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Checkout & Real-time Express Dispatch Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedZone={selectedZone}
        discount={checkoutDiscount}
        couponCode={checkoutCouponCode}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}
