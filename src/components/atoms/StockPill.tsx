import React from 'react';

interface StockPillProps {
  stock: number;
  className?: string;
  isCompact?: boolean;
}

export const StockPill: React.FC<StockPillProps> = ({
  stock,
  className = '',
  isCompact = false
}) => {
  const isLowStock = stock > 0 && stock <= 5;
  const isOutOfStock = stock <= 0;

  if (isOutOfStock) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium text-[#EF4444] ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
        <span>Agotado en bodega Neza</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
        isLowStock ? 'text-[#FFB300]' : 'text-[#00C853]'
      } ${className}`}
      title="Sincronización en tiempo real de bodega Nezahualcóyotl"
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isLowStock ? 'bg-[#FFB300]' : 'bg-[#00C853]'
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isLowStock ? 'bg-[#FFB300]' : 'bg-[#00C853]'
          }`}
        />
      </span>
      <span className="tabular-nums">
        {isCompact ? `${stock} disp.` : `Disponibles: ${stock} piezas`}
      </span>
    </span>
  );
};
