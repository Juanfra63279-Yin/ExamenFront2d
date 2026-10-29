import React, { useState, useRef, useEffect } from 'react';
import { Wine, Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { ProofBadge } from '../atoms/ProofBadge';

interface PredictiveSearchBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onFilterCategory?: (category: string) => void;
  className?: string;
}

export const PredictiveSearchBar: React.FC<PredictiveSearchBarProps> = ({
  products,
  onSelectProduct,
  onFilterCategory,
  className = ''
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const cleanQuery = query.toLowerCase().trim();

  // Matched products
  const matchedProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          p.brand.toLowerCase().includes(cleanQuery) ||
          p.origin.toLowerCase().includes(cleanQuery) ||
          p.subcategory.toLowerCase().includes(cleanQuery) ||
          (p.seasonalBadge && p.seasonalBadge.toLowerCase().includes(cleanQuery))
      ).slice(0, 6)
    : [];

  // Segment by liquor type and seasonal
  const tequilasMezcales = matchedProducts.filter((p) => p.category === 'tequila_mezcal');
  const vinos = matchedProducts.filter((p) => p.category === 'vino');
  const whiskiesLicores = matchedProducts.filter((p) => p.category === 'whisky_licor');
  const cervezas = matchedProducts.filter((p) => p.category === 'cerveza');
  const seasonalMatches = products
    .filter((p) => p.seasonalBadge && (p.seasonalBadge.toLowerCase().includes(cleanQuery) || cleanQuery.length === 0))
    .slice(0, 3);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(val);

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      {/* 48px Search Bar Container */}
      <div className="relative flex items-center h-12 w-full rounded-lg bg-[#1E1E1E] border border-[#333333] px-3.5 focus-within:border-[#FFB74D] focus-within:ring-2 focus-within:ring-[#FFB74D]/20 transition-all">
        {/* Prefix Wine Bottle Icon */}
        <div className="text-[#FF9800] mr-2.5 flex-shrink-0">
          <Wine className="w-5 h-5 stroke-[2]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar tequila, mezcal, vino de Parras, whisky o temporada..."
          aria-label="Buscar bebidas espirituosas y vinos"
          className="w-full bg-transparent text-[#FFFFFF] placeholder-[#9E9E9E] text-sm focus:outline-none"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            aria-label="Limpiar búsqueda"
            className="p-1 rounded-md text-[#9E9E9E] hover:text-[#FFFFFF] hover:bg-[#252525] focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-[#9E9E9E] pointer-events-none p-1">
            <Search className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#252525] border border-[#333333] rounded-xl shadow-2xl shadow-black/80 z-50 overflow-hidden max-h-[75vh] overflow-y-auto">
          {/* Quick Category Chips if query is short */}
          {cleanQuery.length === 0 && (
            <div className="p-3 border-b border-[#333333] bg-[#1E1E1E]/80">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9E9E] mb-2 px-1">
                Explorar por Colección de Temporada
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Fiestas Patrias', 'Fin de Año', 'Noche Neza', 'Tequila Cristalino', 'Mezcal Oaxaca', 'Cervezas Artesanales'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        setIsOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full text-xs bg-[#1E1E1E] border border-[#3A3A3A] text-[#E0E0E0] hover:border-[#FF9800] hover:text-[#FF9800] transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Results segmented */}
          {matchedProducts.length > 0 ? (
            <div className="divide-y divide-[#333333]/60">
              {/* Tequilas y Mezcales segment */}
              {tequilasMezcales.length > 0 && (
                <div className="p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FF9800] px-2 py-1 flex items-center justify-between">
                    <span>Tequila & Mezcal ({tequilasMezcales.length})</span>
                    <span className="text-[10px] text-[#9E9E9E]">Denominación de Origen</span>
                  </div>
                  {tequilasMezcales.map((prod) => (
                    <ProductSearchRow
                      key={prod.id}
                      product={prod}
                      onSelect={() => {
                        onSelectProduct(prod);
                        setIsOpen(false);
                      }}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}

              {/* Vinos segment */}
              {vinos.length > 0 && (
                <div className="p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#3ce36a] px-2 py-1 flex items-center justify-between">
                    <span>Vinos de México ({vinos.length})</span>
                    <span className="text-[10px] text-[#9E9E9E]">Parras / Guadalupe</span>
                  </div>
                  {vinos.map((prod) => (
                    <ProductSearchRow
                      key={prod.id}
                      product={prod}
                      onSelect={() => {
                        onSelectProduct(prod);
                        setIsOpen(false);
                      }}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}

              {/* Whiskies & Licores */}
              {whiskiesLicores.length > 0 && (
                <div className="p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#FFB59A] px-2 py-1 flex items-center justify-between">
                    <span>Whiskies & Licores ({whiskiesLicores.length})</span>
                    <span className="text-[10px] text-[#9E9E9E]">Importación Selecta</span>
                  </div>
                  {whiskiesLicores.map((prod) => (
                    <ProductSearchRow
                      key={prod.id}
                      product={prod}
                      onSelect={() => {
                        onSelectProduct(prod);
                        setIsOpen(false);
                      }}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}

              {/* Cervezas */}
              {cervezas.length > 0 && (
                <div className="p-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#00C853] px-2 py-1">
                    Cervecería Artesanal ({cervezas.length})
                  </div>
                  {cervezas.map((prod) => (
                    <ProductSearchRow
                      key={prod.id}
                      product={prod}
                      onSelect={() => {
                        onSelectProduct(prod);
                        setIsOpen(false);
                      }}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : cleanQuery.length > 0 ? (
            <div className="p-6 text-center text-[#9E9E9E]">
              <p className="text-sm">No encontramos botellas para &ldquo;{query}&rdquo;.</p>
              <p className="text-xs text-[#9E9E9E] mt-1">Prueba con &ldquo;Don Julio&rdquo;, &ldquo;Mezcal&rdquo;, &ldquo;Casa Madero&rdquo; o &ldquo;Whisky&rdquo;.</p>
            </div>
          ) : null}

          {/* Seasonal / Temporada Callout Footer */}
          {seasonalMatches.length > 0 && (
            <div className="p-3 bg-[#1A1A1A] border-t border-[#333333] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#FF9800]">
                <Sparkles className="w-4 h-4 text-[#FF9800]" />
                <span className="font-semibold">Especiales Temporada Neza:</span>
                <span className="text-[#E0E0E0]">{seasonalMatches.map((p) => p.name.split(' ')[0]).join(', ')}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (onFilterCategory) onFilterCategory('promociones');
                  setIsOpen(false);
                }}
                className="text-xs font-bold text-[#E65100] hover:text-[#FF6D00] flex items-center gap-1"
              >
                Ver promociones <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ProductSearchRowProps {
  product: Product;
  onSelect: () => void;
  formatPrice: (n: number) => string;
}

const ProductSearchRow: React.FC<ProductSearchRowProps> = ({ product, onSelect, formatPrice }) => {
  return (
    <div
      onClick={onSelect}
      className="flex items-center justify-between gap-3 p-2 rounded-lg hover:bg-[#2D2D2D] cursor-pointer transition-colors group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect();
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-10 h-10 object-cover rounded bg-[#181818] border border-[#333333] flex-shrink-0"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#FFFFFF] group-hover:text-[#FF9800] truncate">
            {product.name}
          </div>
          <div className="text-xs text-[#9E9E9E] flex items-center gap-2">
            <span>{product.origin}</span>
            <span>•</span>
            <span>{product.volume}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <ProofBadge proofPct={product.proofPct} tier={product.proofTier} showTierLabel={false} />
        <div className="text-right">
          <div className="text-sm font-bold text-[#FFFFFF] tabular-nums">
            {formatPrice(product.promoPrice)}
          </div>
          {product.discountPct > 0 && (
            <div className="text-[10px] text-[#E65100] font-bold">-{product.discountPct}%</div>
          )}
        </div>
      </div>
    </div>
  );
};
