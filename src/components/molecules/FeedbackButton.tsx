import React, { useState, useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { WineGlassLoader } from '../atoms/WineGlassLoader';

export type ButtonFeedbackState = 'idle' | 'loading' | 'confirmed';

interface FeedbackButtonProps {
  label?: string;
  loadingLabel?: string;
  confirmedLabel?: string;
  onAction: () => Promise<void> | void;
  onUndo?: () => void;
  undoDurationMs?: number; // default 5000ms as per design spec
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  label = 'Agregar al Carrito',
  loadingLabel = 'Procesando pedido...',
  confirmedLabel = 'Confirmado (Cancelar)',
  onAction,
  onUndo,
  undoDurationMs = 5000,
  disabled = false,
  className = '',
  variant = 'primary',
  fullWidth = true,
  icon
}) => {
  const [state, setState] = useState<ButtonFeedbackState>('idle');
  const [undoCountdown, setUndoCountdown] = useState<number>(undoDurationMs / 1000);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (state === 'confirmed') {
      // Undo was clicked during the 5s window
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState('idle');
      if (onUndo) onUndo();
      return;
    }

    if (state === 'loading' || disabled) return;

    setState('loading');
    try {
      await onAction();
      setState('confirmed');
      setUndoCountdown(Math.ceil(undoDurationMs / 1000));

      const startTime = Date.now();
      intervalRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((undoDurationMs - elapsed) / 1000));
        setUndoCountdown(remaining);
      }, 200);

      timerRef.current = window.setTimeout(() => {
        setState('idle');
        if (intervalRef.current) clearInterval(intervalRef.current);
      }, undoDurationMs);
    } catch {
      setState('idle');
    }
  };

  // Base classes respecting 48px tactile target boundary (WCAG 2.2 Criterion 2.5.8)
  const baseClasses = `
    relative overflow-hidden min-h-[48px] h-12 px-6 rounded-lg font-bold text-sm tracking-wide
    flex items-center justify-center gap-2.5 transition-all duration-200 select-none
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB74D] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]
    ${fullWidth ? 'w-full' : 'w-auto'}
    ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
  `;

  if (state === 'loading') {
    return (
      <button
        type="button"
        disabled
        className={`${baseClasses} bg-[#1E1E1E] border border-[#E65100]/60 text-white cursor-wait ${className}`}
        aria-busy="true"
        aria-label={loadingLabel}
      >
        <WineGlassLoader size={22} />
        <span className="text-[#FF9800] animate-pulse">{loadingLabel}</span>
      </button>
    );
  }

  if (state === 'confirmed') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`${baseClasses} bg-[#00C853] text-[#002108] font-extrabold hover:bg-[#00b048] active:scale-[0.98] ${className}`}
        aria-label={`${confirmedLabel} - Clic para cancelar`}
      >
        {/* Undo timer progress indicator line */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-[#002108]/40 transition-all duration-200"
          style={{ width: `${(undoCountdown / (undoDurationMs / 1000)) * 100}%` }}
        />

        <Check className="w-5 h-5 stroke-[3]" />
        <span>{confirmedLabel}</span>
        <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-[#002108]/20 font-mono tabular-nums flex items-center gap-1">
          <X className="w-3 h-3" />
          {undoCountdown}s
        </span>
      </button>
    );
  }

  // Default Idle State
  const variantStyles = variant === 'primary'
    ? 'bg-[#E65100] text-white hover:bg-[#FF6D00] hover:scale-[0.98] active:scale-95 shadow-md shadow-[#E65100]/20'
    : 'bg-[#FF9800] text-[#121212] font-extrabold hover:bg-[#ffa726] hover:scale-[0.98] active:scale-95';

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClasses} ${variantStyles} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
