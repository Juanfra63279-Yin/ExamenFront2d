import React from 'react';
import { ProofTier } from '../../types';

interface ProofBadgeProps {
  proofPct: number;
  tier?: ProofTier;
  showTierLabel?: boolean;
  className?: string;
}

export const ProofBadge: React.FC<ProofBadgeProps> = ({
  proofPct,
  tier,
  showTierLabel = true,
  className = ''
}) => {
  // Determine tier if not explicitly provided
  const activeTier: ProofTier = tier || (proofPct >= 38 ? 'alta' : proofPct >= 15 ? 'media' : 'baja');

  let styleClasses = '';
  let tierLabel = '';

  switch (activeTier) {
    case 'alta':
      // Red ruby border #EF4444, background rgba(239, 68, 68, 0.12), text #FF8A80
      styleClasses = 'border-[#EF4444] bg-[#EF4444]/12 text-[#FF8A80]';
      tierLabel = 'Alta';
      break;
    case 'media':
      // Amber border #FF9800, background rgba(255, 152, 0, 0.12), text #FFD54F
      styleClasses = 'border-[#FF9800] bg-[#FF9800]/12 text-[#FFD54F]';
      tierLabel = 'Media';
      break;
    case 'baja':
    default:
      // Emerald green border #00C853, background rgba(0, 200, 83, 0.12), text #B9F6CA
      styleClasses = 'border-[#00C853] bg-[#00C853]/12 text-[#B9F6CA]';
      tierLabel = 'Baja';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold tracking-wide whitespace-nowrap select-none ${styleClasses} ${className}`}
      title={`Graduación alcohólica: ${proofPct}% Alc. Vol.`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {showTierLabel && <span>{tierLabel}</span>}
      {showTierLabel && <span className="opacity-60">•</span>}
      <span className="tabular-nums font-mono">{proofPct}% Alc. Vol.</span>
    </span>
  );
};
