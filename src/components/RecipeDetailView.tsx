import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  Check,
  AlertCircle,
  CalendarPlus,
  Users,
  Clock,
  ChefHat,
  Share2,
  Lightbulb,
} from 'lucide-react';
import { DayOfWeek, MealSlot, Recipe } from '../types';
import { normalizeIngredient } from '../data/recipes';
import { RecipeImage } from './RecipeImage';
import { RecipeCard } from './RecipeCard';

interface RecipeDetailViewProps {
  recipe: Recipe;
  relatedRecipes: Recipe[];
  isFavorite: boolean;
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  userIngredients: string[];
  onToggleUserIngredient: (ingredient: string) => void;
  onAddToMealPlan: (day: DayOfWeek, slot: MealSlot, recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  userHasPremium: boolean;
  onBack: () => void;
}

const DAYS: DayOfWeek[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

const SLOTS: MealSlot[] = ['Desayuno', 'Almuerzo', 'Cena'];

export const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({
  recipe,
  relatedRecipes,
  isFavorite,
  favorites,
  onToggleFavorite,
  userIngredients,
  onToggleUserIngredient,
  onAddToMealPlan,
  onSelectRecipe,
  userHasPremium,
  onBack,
}) => {
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('Lunes');
  const [selectedSlot, setSelectedSlot] = useState<MealSlot>('Almuerzo');
  const [plannerAdded, setPlannerAdded] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const hasIngredient = (name: string) => {
    const norm = normalizeIngredient(name);
    return userIngredients.some((u) => {
      const nu = normalizeIngredient(u);
      return norm.includes(nu) || nu.includes(norm);
    });
  };

  const formatScaledAmount = (
    ing: Recipe['ingredients'][number],
    multiplier: number
  ) => {
    if (multiplier === 1 || !ing.numericAmount) {
      return ing.amount;
    }
    const scaled = Number((ing.numericAmount * multiplier).toFixed(2));
    return ing.unit ? `${scaled} ${ing.unit}` : `${scaled} × (${ing.amount})`;
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddToMealPlan(selectedDay, selectedSlot, recipe.id);
    setPlannerAdded(true);
    setTimeout(() => setPlannerAdded(false), 2500);
  };

  const handleShare = async () => {
    const shareText = `${recipe.title} — Receta en CreciSano (${recipe.prepTimeMinutes} min, ${recipe.servings} porciones)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} · ${window.location.href}`);
    }
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
      {/* Back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5D52] hover:text-[#18261E] transition-colors cursor-pointer py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        {recipe.isPremium && (
          <span className="px-2.5 py-1 bg-[#1B4332] text-white text-[11px] font-bold tracking-wider uppercase rounded-md">
            PREMIUM
          </span>
        )}
      </div>

      {/* Hero Split: Photo + Summary & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 aspect-[4/3] lg:aspect-auto rounded-2xl overflow-hidden bg-[#F3EFE6] border border-[#E5E0D5]">
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#2D6A4F]">
              <span>{recipe.categories.join(' · ')}</span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18261E] leading-tight">
              {recipe.title}
            </h1>

            <p className="text-sm text-[#4A5D52] leading-relaxed">
              {recipe.description}
            </p>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#EFECE4] text-center tabular-nums">
              <div className="bg-[#FAF8F2] rounded-xl p-3">
                <Clock className="w-4 h-4 text-[#1B4332] mx-auto mb-1" />
                <div className="text-sm font-semibold text-[#18261E]">
                  {recipe.prepTimeMinutes} min
                </div>
                <div className="text-xs text-[#52665A]">Tiempo</div>
              </div>
              <div className="bg-[#FAF8F2] rounded-xl p-3">
                <ChefHat className="w-4 h-4 text-[#1B4332] mx-auto mb-1" />
                <div className="text-sm font-semibold text-[#18261E]">
                  {recipe.difficulty}
                </div>
                <div className="text-xs text-[#52665A]">Dificultad</div>
              </div>
              <div className="bg-[#FAF8F2] rounded-xl p-3">
                <Users className="w-4 h-4 text-[#1B4332] mx-auto mb-1" />
                <div className="text-sm font-semibold text-[#18261E]">
                  {recipe.servings * portionMultiplier}
                </div>
                <div className="text-xs text-[#52665A]">Porciones</div>
              </div>
            </div>
          </div>

          {/* Primary Actions: Favorite + Share + Meal Planner */}
          <div className="space-y-4 pt-4 border-t border-[#EFECE4]">
            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={() => onToggleFavorite(recipe.id)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-[#1B4332] text-white hover:bg-[#2D6A4F]'
                    : 'bg-[#E8F3EB] text-[#1B4332] hover:bg-[#D5EAD9]'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`}
                />
                {isFavorite ? 'En favoritos' : 'Guardar en favoritos'}
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-3 bg-[#FAF8F2] border border-[#D8D2C5] text-[#18261E] rounded-xl text-xs font-semibold hover:border-[#1B4332] inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Share2 className="w-4 h-4" />
                <span>{sharedNotice ? 'Enlace copiado' : 'Compartir'}</span>
              </button>
            </div>

            {/* Quick Add to Meal Planner */}
            <form onSubmit={handlePlanSubmit} className="space-y-2">
              <div className="text-xs font-semibold text-[#4A5D52]">
                Agregar a Mi menú semanal:
              </div>
              <div className="flex gap-2">
                <select
                  aria-label="Día de la semana"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                  className="flex-1 px-2.5 py-2 bg-[#FAF8F2] border border-[#D8D2C5] rounded-lg text-xs font-medium text-[#18261E]"
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Comida del día"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value as MealSlot)}
                  className="flex-1 px-2.5 py-2 bg-[#FAF8F2] border border-[#D8D2C5] rounded-lg text-xs font-medium text-[#18261E]"
                >
                  {SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#18261E] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  {plannerAdded ? 'Agregado' : 'Planificar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Linked Video Tutorial for Premium Recipes */}
      {recipe.videoTutorial && userHasPremium && (
        <section className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#EFECE4] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                VIDEO TUTORIAL PASO A PASO
              </span>
              <h2 className="font-display text-xl font-bold text-[#18261E]">
                Aprende a preparar {recipe.title}
              </h2>
            </div>
            <span className="text-xs text-[#52665A] tabular-nums">
              Duración: {recipe.videoTutorial.duration}
            </span>
          </div>
          <div className="aspect-video bg-[#18261E]">
            <video
              src={recipe.videoTutorial.videoUrl}
              poster={recipe.videoTutorial.posterUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          </div>
        </section>
      )}

      {/* Ingredients + Steps + Nutrition + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Ingredients & Nutrition */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-xl font-bold text-[#18261E]">
                Ingredientes
              </h2>
              {/* Portion Scaler */}
              <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 rounded-lg border border-[#E5E0D5] tabular-nums">
                {[1, 2, 4].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setPortionMultiplier(mult)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      portionMultiplier === mult
                        ? 'bg-[#1B4332] text-white'
                        : 'text-[#4A5D52] hover:text-[#18261E]'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            <ul className="divide-y divide-[#EFECE4]">
              {recipe.ingredients.map((ing) => {
                const available = hasIngredient(ing.name);
                return (
                  <li
                    key={ing.name}
                    className="py-3 flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => onToggleUserIngredient(ing.name)}
                        title={
                          available
                            ? 'Marcar como faltante'
                            : 'Marcar como disponible en casa'
                        }
                        className={`w-6 h-6 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          available
                            ? 'bg-[#E8F3EB] text-[#1B4332]'
                            : 'bg-[#FAF8F2] text-[#7C4D25] border border-[#E5E0D5]'
                        }`}
                      >
                        {available ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <div>
                        <span className="font-medium text-[#18261E]">
                          {ing.name}
                        </span>
                        <span className="block text-xs text-[#52665A]">
                          {available ? 'Disponible en tu lista' : 'Te falta'}
                        </span>
                        {ing.alternative && (
                          <span className="block text-xs text-[#2D6A4F] mt-0.5">
                            Alternativa: {ing.alternative}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-mono text-xs font-medium text-[#4A5D52] tabular-nums shrink-0 pt-0.5">
                      {formatScaledAmount(ing, portionMultiplier)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Nutritional Information */}
          {recipe.nutrition && (
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 space-y-4">
              <h2 className="font-display text-xl font-bold text-[#18261E]">
                Información nutricional
              </h2>
              <p className="text-xs text-[#52665A]">
                Valores aproximados por porción
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 tabular-nums">
                <div className="bg-[#FAF8F2] rounded-xl p-3">
                  <div className="text-xs text-[#52665A]">Calorías</div>
                  <div className="text-base font-bold text-[#18261E] mt-0.5">
                    {recipe.nutrition.calories} kcal
                  </div>
                </div>
                <div className="bg-[#FAF8F2] rounded-xl p-3">
                  <div className="text-xs text-[#52665A]">Proteínas</div>
                  <div className="text-base font-bold text-[#18261E] mt-0.5">
                    {recipe.nutrition.protein}
                  </div>
                </div>
                <div className="bg-[#FAF8F2] rounded-xl p-3">
                  <div className="text-xs text-[#52665A]">Carbohidratos</div>
                  <div className="text-base font-bold text-[#18261E] mt-0.5">
                    {recipe.nutrition.carbs}
                  </div>
                </div>
                <div className="bg-[#FAF8F2] rounded-xl p-3">
                  <div className="text-xs text-[#52665A]">Grasas</div>
                  <div className="text-base font-bold text-[#18261E] mt-0.5">
                    {recipe.nutrition.fats}
                  </div>
                </div>
              </div>
              {recipe.nutrition.fiber && (
                <div className="text-xs text-[#4A5D52] tabular-nums">
                  Fibra dietética: <strong>{recipe.nutrition.fiber}</strong>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Preparation Steps & Tips */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold text-[#18261E]">
                Preparación paso a paso
              </h2>
              <span className="text-xs text-[#52665A] tabular-nums">
                {completedSteps.length} de {recipe.steps.length} completados
              </span>
            </div>

            <ol className="space-y-4">
              {recipe.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-xl border transition-colors cursor-pointer flex items-start gap-4 ${
                      isDone
                        ? 'bg-[#F3EFE6]/60 border-[#E5E0D5] opacity-75'
                        : 'bg-[#FAF8F2] border-[#E5E0D5] hover:border-[#1B4332]'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 tabular-nums ${
                        isDone
                          ? 'bg-[#1B4332] text-white'
                          : 'bg-white border border-[#D8D2C5] text-[#18261E]'
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                    </span>
                    <p
                      className={`text-sm leading-relaxed pt-0.5 ${
                        isDone
                          ? 'line-through text-[#52665A]'
                          : 'text-[#18261E]'
                      }`}
                    >
                      {step}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Consejos de preparación */}
          {recipe.tips && recipe.tips.length > 0 && (
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-[#1B4332]">
                <Lightbulb className="w-5 h-5" />
                <h2 className="font-display text-lg font-bold">
                  Consejos de preparación
                </h2>
              </div>
              <ul className="space-y-2 text-sm text-[#4A5D52]">
                {recipe.tips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <section className="space-y-6 pt-4 border-t border-[#E5E0D5]">
          <h2 className="font-display text-2xl font-bold text-[#18261E]">
            Recetas relacionadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRecipes.map((rel) => (
              <RecipeCard
                key={rel.id}
                recipe={rel}
                isFavorite={favorites.includes(rel.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectRecipe}
                userHasPremium={userHasPremium}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
