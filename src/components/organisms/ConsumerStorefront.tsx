import React, { useState, useMemo } from 'react';
import { Product, CartItem, DeliveryZone, CategoryId, ProofTier } from '../../types';
import { ProductCard } from './ProductCard';
import { PredictiveSearchBar } from '../molecules/PredictiveSearchBar';
import { ProofBadge } from '../atoms/ProofBadge';
import { WineGlassLoader } from '../atoms/WineGlassLoader';
import {
  Wine,
  ShoppingBag,
  MapPin,
  ShieldCheck,
  Truck,
  Sparkles,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Settings,
  ChevronDown,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ConsumerStorefrontProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (product: Product, quantity?: number) => void;
  onUndoAddToCart: (product: Product) => void;
  onOpenCart: () => void;
  onQuickView: (product: Product) => void;
  deliveryZones: DeliveryZone[];
  selectedZone: DeliveryZone;
  onSelectZone: (zone: DeliveryZone) => void;
  onSwitchToAdmin: () => void;
}

export const ConsumerStorefront: React.FC<ConsumerStorefrontProps> = ({
  products,
  cartItems,
  onAddToCart,
  onUndoAddToCart,
  onOpenCart,
  onQuickView,
  deliveryZones,
  selectedZone,
  onSelectZone,
  onSwitchToAdmin
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');
  const [selectedProofTier, setSelectedProofTier] = useState<ProofTier | 'todas'>('todas');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'proof_desc'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [showZonePicker, setShowZonePicker] = useState(false);

  // Cart count & total
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((sum, item) => sum + item.product.promoPrice * item.quantity, 0);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

  // Category filter
  const categories: { id: CategoryId; label: string; icon: string }[] = [
    { id: 'todos', label: 'Todo el Catálogo', icon: '🍷' },
    { id: 'tequila_mezcal', label: 'Tequila & Mezcal', icon: '🌵' },
    { id: 'vino', label: 'Vinos de México', icon: '🍇' },
    { id: 'whisky_licor', label: 'Whiskies & Licores', icon: '🥃' },
    { id: 'cerveza', label: 'Cervecería Artesanal', icon: '🍺' },
    { id: 'promociones', label: 'Promos & Fiestas', icon: '🎉' }
  ];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory === 'promociones') {
          if (!p.seasonalBadge && p.discountPct < 16) return false;
        } else if (selectedCategory !== 'todos' && p.category !== selectedCategory) {
          return false;
        }

        // Proof tier filter
        if (selectedProofTier !== 'todas' && p.proofTier !== selectedProofTier) {
          return false;
        }

        // Stock filter
        if (onlyInStock && p.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.promoPrice - b.promoPrice;
        if (sortBy === 'price_desc') return b.promoPrice - a.promoPrice;
        if (sortBy === 'proof_desc') return b.proofPct - a.proofPct;
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      });
  }, [products, selectedCategory, selectedProofTier, onlyInStock, sortBy]);

  return (
    <div className="min-h-screen bg-[#121212] text-[#E0E0E0] pb-24 md:pb-12 flex flex-col antialiased">
      {/* 1. Header Navigation Bar (Fixed / Sticky) */}
      <header className="sticky top-0 z-40 bg-[#121212]/95 backdrop-blur-md border-b border-[#2A2A2A]">
        {/* Top utility row */}
        <div className="bg-[#181818] border-b border-[#2A2A2A] text-xs text-[#9E9E9E] px-4 md:px-10 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[#00C853] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
              Bodega Nezahualcóyotl Abierta
            </span>
            <span className="hidden sm:inline text-[#4A4A4A]">|</span>
            <span className="hidden sm:inline">Despacho garantizado en menos de 35 min</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#FFB59A] text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF9800]" />
              SAT Marbete Verificado (+18)
            </span>
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="px-2 py-0.5 rounded bg-[#252525] hover:bg-[#333333] text-white text-[11px] font-bold flex items-center gap-1 transition-colors border border-[#3A3A3A]"
              title="Acceder al panel de administración de bodega e inventario"
            >
              <Settings className="w-3 h-3 text-[#FF9800]" />
              <span>VinoNez Ops</span>
            </button>
          </div>
        </div>

        {/* Main Header bar */}
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => setSelectedCategory('todos')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E65100] to-[#FF9800] p-0.5 flex items-center justify-center shadow-lg shadow-[#E65100]/20">
              <div className="w-full h-full bg-[#121212] rounded-[10px] flex items-center justify-center text-[#FF9800]">
                <Wine className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">VinoNez</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#E65100]/20 text-[#FF9800] border border-[#E65100]/40">
                  NEZA
                </span>
              </div>
              <p className="text-[10px] text-[#9E9E9E] font-medium tracking-wide">
                Licores, Vinos & Despacho Exprés
              </p>
            </div>
          </div>

          {/* Search Bar (Desktop Center) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <PredictiveSearchBar
              products={products}
              onSelectProduct={onQuickView}
              onFilterCategory={(cat) => setSelectedCategory(cat as CategoryId)}
            />
          </div>

          {/* Right Header Actions: Zone Selector & Cart Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Zone Selector Pill */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowZonePicker(!showZonePicker)}
                className="min-h-[44px] px-3 py-2 rounded-lg bg-[#1E1E1E] hover:bg-[#252525] border border-[#333333] text-xs flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D]"
                aria-label="Cambiar zona de entrega en Nezahualcóyotl"
              >
                <MapPin className="w-4 h-4 text-[#FF9800] flex-shrink-0" />
                <div className="text-left hidden lg:block">
                  <div className="text-[10px] text-[#9E9E9E] leading-none">Entrega en:</div>
                  <div className="text-white font-bold truncate max-w-[140px]">{selectedZone.name}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#9E9E9E]" />
              </button>

              {/* Zone Selector Dropdown Menu */}
              {showZonePicker && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#252525] border border-[#333333] shadow-2xl p-2 z-50">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9E9E] px-2.5 py-1.5 border-b border-[#333333] mb-1">
                    Zonas de Cobertura Nezahualcóyotl
                  </div>
                  {deliveryZones.map((z) => (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => {
                        onSelectZone(z);
                        setShowZonePicker(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        z.id === selectedZone.id
                          ? 'bg-[#E65100]/20 text-[#FF9800] font-bold'
                          : 'text-[#E0E0E0] hover:bg-[#2D2D2D]'
                      }`}
                    >
                      <div>
                        <div>{z.name}</div>
                        <div className="text-[10px] text-[#9E9E9E]">{z.estimatedMinutes}</div>
                      </div>
                      <span className="font-mono text-[11px] text-[#00C853] font-bold">
                        {cartSubtotal >= z.freeThreshold ? 'Gratis' : `$${z.deliveryFee}`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Cart Button */}
            <button
              type="button"
              onClick={onOpenCart}
              className="min-h-[48px] px-4 py-2 rounded-lg bg-[#E65100] hover:bg-[#FF6D00] text-white font-extrabold text-sm flex items-center gap-2.5 transition-all shadow-md shadow-[#E65100]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D] active:scale-95"
              aria-label={`Ver carrito de compras con ${cartCount} artículos`}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.4]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-[#E65100] text-xs font-black flex items-center justify-center font-mono">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-mono tabular-nums">
                {cartSubtotal > 0 ? formatPrice(cartSubtotal) : 'Carrito'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="md:hidden px-4 pb-3">
          <PredictiveSearchBar
            products={products}
            onSelectProduct={onQuickView}
            onFilterCategory={(cat) => setSelectedCategory(cat as CategoryId)}
          />
        </div>
      </header>

      {/* 2. Hero / Operational Cellar Banner */}
      <section className="bg-gradient-to-b from-[#1C1B1B] to-[#121212] border-b border-[#2A2A2A] py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="relative rounded-2xl bg-[#1E1E1E] border border-[#2D2D2D] p-6 md:p-8 overflow-hidden shadow-2xl">
            {/* Background Cellar Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E65100]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E65100]/15 border border-[#E65100]/30 text-[#FF9800] text-xs font-bold mb-3">
                <Flame className="w-3.5 h-3.5 text-[#E65100]" />
                <span>Despacho Inmediato en Motocicleta • Cd. Nezahualcóyotl</span>
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight mb-3">
                Espíritus Prémium, Tequilas y Vinos a Temperatura de Cava.
              </h1>

              <p className="text-xs md:text-sm text-[#A0A0A0] leading-relaxed mb-6">
                Catálogo certificado con marbete oficial SAT. Stock en tiempo real sincronizado
                directamente desde nuestra bodega central en Neza para entregas en 20 a 35 minutos.
              </p>

              {/* Operational Metrics Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-[#2D2D2D]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#252525] text-[#00C853] border border-[#333333]">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">{selectedZone.estimatedMinutes}</div>
                    <div className="text-[10px] text-[#9E9E9E]">Tiempo Promedio</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#252525] text-[#FF9800] border border-[#333333]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">100% Original</div>
                    <div className="text-[10px] text-[#9E9E9E]">Marbete Fiscal SAT</div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                  <div className="p-2 rounded-lg bg-[#252525] text-[#3ce36a] border border-[#333333]">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Envío Gratis</div>
                    <div className="text-[10px] text-[#9E9E9E]">Desde $800 MXN</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Category & Filter Controls Bar */}
      <section className="sticky top-[108px] md:top-[73px] z-30 bg-[#121212]/95 backdrop-blur-md border-b border-[#2A2A2A] py-3">
        <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-3">
          {/* Category Chips Carousel */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#E65100] text-white shadow-md shadow-[#E65100]/25'
                    : 'bg-[#1E1E1E] text-[#D0D0D0] hover:bg-[#252525] hover:text-white border border-[#2D2D2D]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Secondary Filters: Proof Intensity, Sorting, Stock */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            {/* Alcohol Proof Intensity Filters (Alta, Media, Baja) */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#9E9E9E] font-medium text-[11px] mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF9800]" />
                Graduación:
              </span>

              <button
                type="button"
                onClick={() => setSelectedProofTier('todas')}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
                  selectedProofTier === 'todas'
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#1E1E1E] text-[#9E9E9E] hover:text-white border border-[#2D2D2D]'
                }`}
              >
                Todas
              </button>

              <button
                type="button"
                onClick={() => setSelectedProofTier('alta')}
                className={`transition-all ${
                  selectedProofTier === 'alta' ? 'scale-105 shadow-md shadow-red-500/20' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <ProofBadge proofPct={38} tier="alta" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedProofTier('media')}
                className={`transition-all ${
                  selectedProofTier === 'media' ? 'scale-105 shadow-md shadow-amber-500/20' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <ProofBadge proofPct={35} tier="media" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedProofTier('baja')}
                className={`transition-all ${
                  selectedProofTier === 'baja' ? 'scale-105 shadow-md shadow-green-500/20' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <ProofBadge proofPct={14} tier="baja" />
              </button>
            </div>

            {/* In-Stock Only & Sort Options */}
            <div className="flex items-center gap-3 ml-auto">
              <label className="flex items-center gap-2 cursor-pointer select-none text-[#9E9E9E] hover:text-white">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded border-[#444] text-[#E65100] focus:ring-[#FFB74D]"
                />
                <span className="text-[11px]">Solo con stock disponible</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1E1E1E] border border-[#2D2D2D] rounded-lg text-xs text-white p-1.5 focus:outline-none focus:border-[#FFB74D]"
              >
                <option value="featured">Populares VinoNez</option>
                <option value="price_asc">Menor precio</option>
                <option value="price_desc">Mayor precio</option>
                <option value="proof_desc">Mayor graduación Alc.</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Product Catalog Grid */}
      <main className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex-grow">
        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-white">
              {categories.find((c) => c.id === selectedCategory)?.label || 'Catálogo de Licores'}
            </h2>
            <p className="text-xs text-[#9E9E9E] mt-0.5">
              Mostrando {filteredProducts.length} botellas disponibles con entrega hoy
            </p>
          </div>
        </div>

        {/* 12-column responsive layout adhering to design spec */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-[#1E1E1E] border border-[#2D2D2D] p-8">
            <Wine className="w-12 h-12 mx-auto stroke-[1.2] text-[#9E9E9E] mb-3" />
            <h3 className="text-base font-bold text-white">No hay productos que coincidan con los filtros</h3>
            <p className="text-xs text-[#9E9E9E] mt-1">
              Prueba cambiando la graduación o seleccionando otra categoría.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('todos');
                setSelectedProofTier('todas');
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-[#E65100] text-white text-xs font-bold hover:bg-[#FF6D00]"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product) => {
              const inCartItem = cartItems.find((i) => i.product.id === product.id);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onUndoAddToCart={onUndoAddToCart}
                  onQuickView={onQuickView}
                  currentInCartCount={inCartItem?.quantity || 0}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* 5. Mobile Sticky Conversion Control Bar (Bottom 25% of viewport, 48px touch target) */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-3 left-4 right-4 z-40 animate-slide-up">
          <button
            type="button"
            onClick={onOpenCart}
            className="w-full min-h-[52px] h-[52px] rounded-xl bg-[#E65100] text-white font-extrabold px-5 flex items-center justify-between shadow-2xl shadow-black/80 border border-[#FF6D00]/50 active:scale-[0.98] transition-transform"
            aria-label="Abrir resumen de carrito y finalizar compra"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-mono text-xs">
                {cartCount}
              </span>
              <span className="text-sm">Ver Carrito VinoNez</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black tabular-nums">{formatPrice(cartSubtotal)}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-[#2A2A2A] bg-[#161616] py-8 text-xs text-[#9E9E9E]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">VinoNez</span>
            <span>•</span>
            <span>Nezahualcóyotl, Estado de México</span>
            <span>•</span>
            <span className="text-[#00C853] font-medium">Despacho Activo</span>
          </div>

          <div className="text-[11px] text-center md:text-right">
            El abuso en el consumo de este producto es nocivo para la salud. Prohibida la venta a menores de 18 años.
          </div>
        </div>
      </footer>
    </div>
  );
};
