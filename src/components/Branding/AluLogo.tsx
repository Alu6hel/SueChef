import React from 'react';
import { useSueChef } from '../../context/SueChefContext';

interface AluLogoProps {
  className?: string;
  variant?: 'full' | 'symbol' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const AluLogo: React.FC<AluLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showLabel = false
}) => {
  const { theme } = useSueChef();
  const isLight = theme === 'parchment-ink';

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14'
  }[size];

  // Pick appropriate logo based on theme & variant
  let logoSrc = './logos/alu-company-logo.svg';
  if (isLight) {
    logoSrc = variant === 'symbol' 
      ? './logos/alu-company-logo-symbol.svg' 
      : './logos/light-alu-logo.svg';
  } else {
    logoSrc = variant === 'symbol' 
      ? './logos/alu-company-logo-symbol.svg' 
      : './logos/dark-alu-company-logo.svg';
  }

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      <img
        src="./logos/alu-company-logo-symbol.svg"
        alt="SueChef"
        className={`${sizeClasses} w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)] shrink-0`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = './logos/alu-company-logo-symbol.svg';
        }}
      />
      {showLabel && (
        <div className="flex items-center leading-none whitespace-nowrap shrink-0">
          <span className="font-serif font-black text-base sm:text-lg tracking-wider text-[var(--text-main)] uppercase select-none">
            SUE<span className="text-[var(--accent-gold)]">CHEF</span>
          </span>
        </div>
      )}
    </div>
  );
};
