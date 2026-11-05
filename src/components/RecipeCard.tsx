import React from 'react';
import { Heart, Check, AlertCircle, Lock } from 'lucide-react';
import { Recipe } from '../types';
import { RecipeImage } from './RecipeImage';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string) => void;
  onSelect: (recipe: Recipe) => void;
  availableIngredients?: string[];
  missingIngredients?: string[];
  matchedCount?: number;
  totalCount?: number;
  matchPercentage?: number;
  userHasPremium?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelect,
  availableIngredients,
  missingIngredients,
  matchedCount,
  totalCount,
  matchPercentage,
  userHasPremium = false,
}) => {
  const isLocked = Boolean(recipe.isPremium && !userHasPremium);

  return (
    <article className="group flex flex-col bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F3EFE6]">
        <button
          type="button"
          onClick={() => onSelect(recipe)}
          className="w-full h-full block text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332]"
          aria-label={`Ver receta ${recipe.title}`}
        >
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </button>

        {recipe.isPremium && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#1B4332] text-white text-[11px] font-bold tracking-wider uppercase rounded-md inline-flex items-center gap-1">
            {isLocked && <Lock className="w-3 h-3" />}
            PREMIUM
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(recipe.id);
          }}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
            isFavorite
              ? 'bg-[#1B4332] text-white'
              : 'bg-white/95 text-[#18261E] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#52665A] tabular-nums mb-1.5">
          <span>{recipe.categories[0]}</span>
          <span aria-hidden="true">·</span>
          <span>{recipe.prepTimeMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{recipe.difficulty}</span>
          {typeof matchedCount === 'number' && typeof totalCount === 'number' && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-[#1B4332]">
                {matchedCount} de {totalCount} ingredientes ({matchPercentage}%)
              </span>
            </>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold text-[#18261E] leading-snug mb-2">
          <button
            type="button"
            onClick={() => onSelect(recipe)}
            className="text-left hover:text-[#2D6A4F] transition-colors cursor-pointer"
          >
            {recipe.title}
          </button>
        </h3>

        <p className="text-sm text-[#4A5D52] line-clamp-2 mb-4 flex-1">
          {recipe.description}
        </p>

        {availableIngredients && missingIngredients && (
          <div className="pt-3 border-t border-[#EFECE4] space-y-1.5 text-xs mb-4">
            <div className="flex items-start gap-1.5 text-[#1B4332]">
              <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>
                <strong className="font-semibold">Tienes:</strong>{' '}
                {availableIngredients.join(', ')}
              </span>
            </div>
            {missingIngredients.length > 0 ? (
              <div className="flex items-start gap-1.5 text-[#7C4D25]">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>
                  <strong className="font-semibold">Te falta:</strong>{' '}
                  {missingIngredients.join(', ')}
                </span>
              </div>
            ) : (
              <div className="flex items-start gap-1.5 text-[#1B4332]">
                <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span className="font-semibold">
                  Tienes todos los ingredientes
                </span>
              </div>
            )}
          </div>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-[#52665A] tabular-nums">
          <span>{recipe.servings} porciones</span>
          <button
            type="button"
            onClick={() => onSelect(recipe)}
            className="font-semibold text-[#1B4332] hover:underline cursor-pointer py-1"
          >
            {isLocked ? 'Ver con Premium' : 'Ver preparación'}
          </button>
        </div>
      </div>
    </article>
  );
};
