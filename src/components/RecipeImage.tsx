import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface RecipeImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const RecipeImage: React.FC<RecipeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#E8F3EB] text-[#1B4332] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Utensils className="w-8 h-8 mb-2 opacity-70" />
        <span className="font-display text-sm font-medium line-clamp-2">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
