import React from 'react';

interface PriceDiscountBlockProps {
  regularPrice: number;
  promoPrice: number;
  discountPct: number;
  size?: 'normal' | 'large';
  className?: string;
}

export const PriceDiscountBlock: React.FC<PriceDiscountBlockProps> = ({
  regularPrice,
  promoPrice,
  discountPct,
  size = 'normal',
  className = ''
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(val);
  };

  const hasDiscount = discountPct > 0 && regularPrice > promoPrice;

  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span
          className={`font-bold text-[#FFFFFF] tabular-nums tracking-tight ${
            size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}
        >
          {formatCurrency(promoPrice)}
        </span>

        {hasDiscount && (
          <span
            className={`font-semibold text-xs px-1.5 py-0.5 rounded bg-[#E65100] text-white tracking-wide uppercase tabular-nums`}
          >
            -{discountPct}% OFF
          </span>
        )}
      </div>

      {hasDiscount && (
        <div className="flex items-center gap-1.5 text-xs text-[#9E9E9E]">
          <span className="line-through tabular-nums">{formatCurrency(regularPrice)}</span>
          <span className="text-[11px] text-[#FF9800]">
            Ahorras {formatCurrency(regularPrice - promoPrice)}
          </span>
        </div>
      )}
    </div>
  );
};
