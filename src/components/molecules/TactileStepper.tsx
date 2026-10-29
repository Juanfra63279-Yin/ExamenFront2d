import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface TactileStepperProps {
  quantity: number;
  max: number;
  onChange: (newQuantity: number) => void;
  className?: string;
  size?: 'normal' | 'compact';
}

export const TactileStepper: React.FC<TactileStepperProps> = ({
  quantity,
  max,
  onChange,
  className = '',
  size = 'normal'
}) => {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 0) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  const isMin = quantity <= 0;
  const isMax = quantity >= max;

  const btnClasses = size === 'normal' 
    ? 'min-w-[48px] min-h-[48px] w-12 h-12 flex items-center justify-center rounded-lg bg-[#252525] border border-[#333333] text-[#E0E0E0] hover:bg-[#2D2D2D] hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100'
    : 'min-w-[40px] min-h-[40px] w-10 h-10 flex items-center justify-center rounded-lg bg-[#252525] border border-[#333333] text-[#E0E0E0] hover:bg-[#2D2D2D] hover:text-white active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D] disabled:opacity-30 disabled:cursor-not-allowed';

  return (
    <div
      className={`inline-flex items-center gap-3 p-1 rounded-lg bg-[#181818] border border-[#2A2A2A] select-none ${className}`}
      role="group"
      aria-label="Selector táctil de cantidad"
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMin}
        aria-label="Disminuir cantidad"
        className={btnClasses}
      >
        <Minus className="w-4 h-4 stroke-[2.5]" />
      </button>

      <div
        className="min-w-[40px] text-center font-mono font-bold text-base text-[#FFFFFF] tabular-nums px-2"
        aria-live="polite"
      >
        {quantity}
      </div>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMax}
        aria-label="Aumentar cantidad"
        className={btnClasses}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
};
