import { useId } from 'react';

type BrandLogoProps = {
  variant?: 'full' | 'compact' | 'symbol';
  tone?: 'default' | 'inverse' | 'bicolor';
  showEndorsement?: boolean;
  className?: string;
};

export function BrandLogo({
  variant = 'full',
  tone = 'default',
  showEndorsement = false,
  className = '',
}: BrandLogoProps) {
  const bronzeTopId = useId();
  const bronzeMidId = useId();
  const bicolor = tone === 'bicolor';
  const endorsementSrc = '/prefeitura-rio-educacao.svg';

  return (
    <div className={`brand-lockup brand-lockup--${variant} brand-lockup--${tone} ${className}`.trim()}>
      <div className="brand-primary">
        <svg
          className="brand-symbol"
          viewBox="0 0 96 96"
          role="img"
          aria-label="Símbolo Fluxo CTRH"
        >
          {bicolor && (
            <defs>
              <linearGradient id={bronzeTopId} x1="16" y1="8" x2="84" y2="34" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#DFB98B" />
                <stop offset="55%" stopColor="#C69C6D" />
                <stop offset="100%" stopColor="#9E7344" />
              </linearGradient>
              <linearGradient id={bronzeMidId} x1="16" y1="36" x2="72" y2="62" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#D6AE7F" />
                <stop offset="60%" stopColor="#BC9162" />
                <stop offset="100%" stopColor="#93683B" />
              </linearGradient>
            </defs>
          )}
          <path
            d="M19 15C19 9.5 23.5 5 29 5h54c0 12.7-10.3 23-23 23H30c-6.1 0-11 4.9-11 11V15Z"
            fill={bicolor ? `url(#${bronzeTopId})` : 'currentColor'}
          />
          <path
            d="M19 42c0-5.5 4.5-10 10-10h47c0 12.7-10.3 23-23 23H30c-6.1 0-11 4.9-11 11V42Z"
            fill={bicolor ? `url(#${bronzeMidId})` : 'currentColor'}
            opacity={bicolor ? 1 : 0.92}
          />
          <path
            d="M19 69c0-5.5 4.5-10 10-10h20c0 17.7-14.3 32-32 32h-2V73c0-2.2 1.8-4 4-4Z"
            fill={bicolor ? '#ffffff' : 'currentColor'}
            opacity={bicolor ? 1 : 0.82}
          />
        </svg>

        {variant !== 'symbol' && (
          <div className="brand-copy">
            <div className="brand-name">Fluxo CTRH</div>
            {variant === 'full' && (
              <div className="brand-tagline">Gestão inteligente de processos e pessoas</div>
            )}
          </div>
        )}
      </div>

      {showEndorsement && variant !== 'symbol' && (
        <div className="brand-endorsement">
          <img
            className="brand-endorsement-image"
            src={endorsementSrc}
            alt="Prefeitura do Rio de Janeiro — Educação"
            loading="eager"
            decoding="sync"
          />
        </div>
      )}
    </div>
  );
}
