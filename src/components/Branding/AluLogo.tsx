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
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={logoSrc}
        alt="Alu"
        className={`${sizeClasses} w-auto object-contain transition-all duration-300 drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]`}
        onError={(e) => {
          // Fallback
          (e.currentTarget as HTMLImageElement).src = './logos/alu-company-logo.svg';
        }}
      />
      {showLabel && (
        <div className="flex flex-col leading-none">
          <span className="font-serif font-extrabold text-sm tracking-widest text-[var(--text-main)] uppercase">
            SUE<span className="text-[var(--accent-gold)]">CHEF</span>
          </span>
          <span className="text-[9px] font-mono text-[var(--accent-gold)] tracking-wider">
            BY ALU
          </span>
        </div>
      )}
    </div>
  );
};
