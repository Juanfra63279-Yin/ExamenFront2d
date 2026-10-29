import React from 'react';

interface WineGlassLoaderProps {
  progress?: number; // 0 to 100
  size?: number; // size in pixels, default 28
  className?: string;
}

export const WineGlassLoader: React.FC<WineGlassLoaderProps> = ({
  progress,
  size = 28,
  className = ''
}) => {
  // If progress is provided, calculate liquid height; otherwise run smooth CSS wave animation
  const fillPct = progress !== undefined ? Math.min(Math.max(progress, 8), 92) : 65;

  return (
    <div
      className={`inline-flex items-center justify-center relative ${className}`}
      style={{ width: size, height: size }}
      aria-label="Cargando estado de vino"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <clipPath id="glassClip">
            {/* Bowl shape of wine glass */}
            <path d="M7 6C7 16.5 13.5 21 18 21C22.5 21 29 16.5 29 6H7Z" />
          </clipPath>
          <linearGradient id="wineLiquidGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF6D00" />
            <stop offset="100%" stopColor="#E65100" />
          </linearGradient>
        </defs>

        {/* Liquid Fill masked to glass bowl */}
        <g clipPath="url(#glassClip)">
          {progress !== undefined ? (
            <rect
              x="5"
              y={21 - (fillPct / 100) * 15}
              width="26"
              height="20"
              fill="url(#wineLiquidGrad)"
              className="transition-all duration-300 ease-out"
            />
          ) : (
            <g className="animate-pulse">
              <path
                d="M5 12 Q12 10 18 12 T31 12 V24 H5 Z"
                fill="url(#wineLiquidGrad)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="-3 0; 3 0; -3 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}

          {/* Liquid meniscus highlight */}
          <line
            x1="8"
            y1={progress !== undefined ? 21 - (fillPct / 100) * 15 : 12}
            x2="28"
            y2={progress !== undefined ? 21 - (fillPct / 100) * 15 : 12}
            stroke="#FFB59A"
            strokeWidth="1"
            opacity="0.6"
          />
        </g>

        {/* Wine Glass Outline */}
        {/* Bowl */}
        <path
          d="M7 6C7 16.5 13.5 21 18 21C22.5 21 29 16.5 29 6H7Z"
          stroke="#E0E0E0"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stem */}
        <path
          d="M18 21V30"
          stroke="#E0E0E0"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        {/* Base */}
        <path
          d="M11 30H25"
          stroke="#E0E0E0"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Rim highlight */}
        <path
          d="M7 6H29"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
