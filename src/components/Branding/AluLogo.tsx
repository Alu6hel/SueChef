import React from 'react';
import { useSueChef } from '../../context/SueChefContext';

interface AluLogoProps {
  className?: string;
  variant?: 'app' | 'full' | 'medallion' | 'company' | 'symbol' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const AluLogo: React.FC<AluLogoProps> = ({
  className = '',
  variant = 'app',
  size = 'md',
  showLabel = false
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14'
  }[size];

  const isCompany = variant === 'company' || variant === 'symbol';
  const logoSrc = isCompany ? './logos/alu-company-logo-symbol.svg' : './logos/suechef-medallion.png';

  return (
    <div className={`inline-flex items-center gap-2 shrink-0 ${className}`}>
      <img
        src={logoSrc}
        alt={isCompany ? "Alumungandr" : "SueChef"}
        className={`${sizeClasses} ${isCompany ? 'object-contain' : 'object-cover rounded-full border border-amber-500/60 shadow-[0_2px_8px_rgba(245,158,11,0.35)]'} transition-all duration-300 shrink-0`}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = isCompany ? './logos/alu-company-logo-symbol.svg' : './logos/suechef-medallion.png';
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
