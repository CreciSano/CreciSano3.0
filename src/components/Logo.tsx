import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'lg';
}

export const ORIGINAL_LOGO_URL = '/assets/aistudio/IMG_3644_6465e809.jpeg';

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'sm',
}) => {
  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-4 ${className}`}>
        <img
          src={ORIGINAL_LOGO_URL}
          alt="Logotipo original de CreciSano"
          referrerPolicy="no-referrer"
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#E5E0D5] shrink-0"
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}
    >
      <img
        src={ORIGINAL_LOGO_URL}
        alt="Logotipo de CreciSano"
        referrerPolicy="no-referrer"
        className="w-10 h-10 rounded-lg object-cover border border-[#E5E0D5] shrink-0"
      />
      <span className="font-display text-xl font-bold tracking-tight text-[#1B4332]">
        CreciSano
      </span>
    </span>
  );
};
