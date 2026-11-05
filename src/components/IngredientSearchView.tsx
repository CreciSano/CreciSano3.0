import React, { useState } from 'react';
import {
  Search,
  Plus,
  X,
  Check,
  RotateCcw,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  Recipe,
  RecipeCategory,
  RecipeMatchResult,
} from '../types';
import { INGREDIENT_GROUPS } from '../data/recipes';
import { RecipeCard } from './RecipeCard';

interface IngredientSearchViewProps {
  selectedIngredients: string[];
  onAddIngredient: (ingredient: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onSetIngredients: (ingredients: string[]) => void;
  onClearIngredients: () => void;
  onSearchSubmit: () => void;
  hasSearched: boolean;
  results: RecipeMatchResult[];
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onSavePantry?: () => void;
  pantrySavedNotice?: boolean;
  onExploreAllCategories: () => void;
  userHasPremium?: boolean;
}

export const IngredientSearchView: React.FC<IngredientSearchViewProps> = ({
  selectedIngredients,
  onAddIngredient,
  onRemoveIngredient,
  onSetIngredients,
  onClearIngredients,
  onSearchSubmit,
  hasSearched,
  results,
  favorites,
  onToggleFavorite,
  onSelectRecipe,
  onSavePantry,
  pantrySavedNotice,
  onExploreAllCategories,
  userHasPremium = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<RecipeCategory | 'Todas'>(
    'Todas'
  );
  const [maxTimeFilter, setMaxTimeFilter] = useState<number | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed) {
      onAddIngredient(trimmed);
      setInputValue('');
    }
  };

  const handleLoadExample = () => {
    onSetIngredients(['Pollo', 'Papa', 'Zanahoria', 'Arroz']);
    onSearchSubmit();
  };

  const filteredResults = results.filter((item) => {
    if (
      categoryFilter !== 'Todas' &&
      !item.recipe.categories.includes(categoryFilter)
    ) {
      return false;
    }
    if (maxTimeFilter !== null && item.recipe.prepTimeMinutes > maxTimeFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <section className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold text-[#2D6A4F]">
          Tú eliges los ingredientes, CreciSano encuentra las recetas
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
          ¿Qué ingredientes tienes en casa?
        </h1>
        <p className="text-base text-[#4A5D52] leading-relaxed">
          Escribe o selecciona los alimentos que tienes disponibles en tu cocina. Priorizaremos las recetas con mayor coincidencia e indicaremos qué ingredientes te faltan y qué alternativas puedes usar.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={handleLoadExample}
            className="text-xs font-semibold text-[#1B4332] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Probar ejemplo: Pollo, Papa, Zanahoria, Arroz
          </button>
        </div>
      </section>

      {/* Main Ingredient Input & Quick-Pick Panel */}
      <section className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-8">
        {/* Type & Add Ingredient */}
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-[#52665A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe un ingrediente (ej. pollo, papa, zanahoria, arroz)..."
              aria-label="Escribe un ingrediente que tengas en casa"
              className="w-full pl-11 pr-4 py-3 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm text-[#18261E] placeholder:text-[#6B7D72] focus:outline-none focus:border-[#1B4332]"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-5 py-3 bg-[#E8F3EB] text-[#1B4332] font-semibold text-sm rounded-xl hover:bg-[#D5EAD9] disabled:opacity-50 transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Agregar ingrediente
          </button>
        </form>

        {/* Selected Ingredients Tray */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-semibold text-[#18261E] tabular-nums">
              Ingredientes seleccionados ({selectedIngredients.length})
            </h2>
            <div className="flex items-center gap-4">
              {onSavePantry && selectedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={onSavePantry}
                  className="text-xs font-semibold text-[#2D6A4F] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  {pantrySavedNotice
                    ? 'Despensa guardada'
                    : 'Guardar en mi despensa'}
                </button>
              )}
              {selectedIngredients.length > 0 && (
                <button
                  type="button"
                  onClick={onClearIngredients}
                  className="text-xs font-medium text-[#52665A] hover:text-[#18261E] inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpiar todo
                </button>
              )}
            </div>
          </div>

          {selectedIngredients.length === 0 ? (
            <p className="text-sm text-[#52665A] bg-[#FAF8F2] border border-dashed border-[#D8D2C5] rounded-xl px-4 py-4">
              Aún no has agregado ingredientes. Escribe arriba o selecciona de la lista de abajo.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => onRemoveIngredient(ing)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#1B4332] text-white text-xs font-medium rounded-lg hover:bg-[#2D6A4F] transition-colors cursor-pointer"
                >
                  <span>{ing}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Categorized Quick-Pick Ingredient List */}
        <div className="pt-4 border-t border-[#EFECE4] space-y-5">
          <h2 className="text-sm font-semibold text-[#18261E]">
            O selecciona ingredientes disponibles en tu hogar:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INGREDIENT_GROUPS.map((group) => (
              <div key={group.group} className="space-y-2.5">
                <h3 className="text-xs font-semibold text-[#52665A]">
                  {group.group}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => {
                    const isSelected = selectedIngredients.some(
                      (s) => s.toLowerCase() === item.toLowerCase()
                    );
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          isSelected
                            ? onRemoveIngredient(item)
                            : onAddIngredient(item)
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E8F3EB] border-[#1B4332] text-[#1B4332] font-semibold'
                            : 'bg-[#FAF8F2] border-[#E5E0D5] text-[#18261E] hover:border-[#1B4332]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Search CTA */}
        <div className="pt-4 border-t border-[#EFECE4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#52665A]">
            Ordenaremos las recetas priorizando las que tienen mayor coincidencia con tus ingredientes.
          </p>
          <button
            type="button"
            onClick={onSearchSubmit}
            className="px-7 py-3.5 bg-[#1B4332] text-white font-semibold text-sm rounded-xl hover:bg-[#2D6A4F] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            Buscar recetas
          </button>
        </div>
      </section>

      {/* Results Section */}
      {hasSearched && (
        <section id="resultados-recetas" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18261E]">
                Recetas compatibles
              </h2>
              <p className="text-sm text-[#4A5D52] mt-1 tabular-nums">
                {selectedIngredients.length === 0
                  ? 'Selecciona al menos un ingrediente para ver coincidencias.'
                  : `${filteredResults.length} ${
                      filteredResults.length === 1
                        ? 'receta encontrada'
                        : 'recetas encontradas'
                    } con tus ingredientes`}
              </p>
            </div>

            {/* Filter Controls */}
            {results.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <select
                  aria-label="Filtrar por categoría"
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value as RecipeCategory | 'Todas')
                  }
                  className="px-3 py-2 bg-white border border-[#D8D2C5] rounded-lg text-xs font-medium text-[#18261E] focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="Todas">Todas las categorías</option>
                  {ALL_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <select
                  aria-label="Filtrar por tiempo máximo"
                  value={maxTimeFilter ?? ''}
                  onChange={(e) =>
                    setMaxTimeFilter(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  className="px-3 py-2 bg-white border border-[#D8D2C5] rounded-lg text-xs font-medium text-[#18261E] focus:outline-none focus:border-[#1B4332]"
                >
                  <option value="">Cualquier tiempo</option>
                  <option value="10">Hasta 10 min</option>
                  <option value="15">Hasta 15 min</option>
                  <option value="20">Hasta 20 min</option>
                  <option value="30">Hasta 30 min</option>
                </select>
              </div>
            )}
          </div>

          {selectedIngredients.length === 0 ? (
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-8 text-center space-y-3">
              <h3 className="font-display text-xl font-semibold text-[#18261E]">
                Agrega al menos un ingrediente para comenzar
              </h3>
              <p className="text-sm text-[#4A5D52] max-w-md mx-auto">
                Por ejemplo, prueba seleccionar «Pollo», «Papa», «Zanahoria» y «Arroz».
              </p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="bg-white border border-[#E5E0D5] rounded-2xl p-8 sm:p-10 text-center space-y-4">
              <h3 className="font-display text-xl font-semibold text-[#18261E]">
                No encontramos recetas para los ingredientes seleccionados
              </h3>
              <p className="text-sm text-[#4A5D52] max-w-lg mx-auto">
                Intenta agregar ingredientes básicos como pollo, huevo, tomate, arroz, avena o plátano, o quita los filtros activos.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCategoryFilter('Todas');
                    setMaxTimeFilter(null);
                    onClearIngredients();
                  }}
                  className="px-4 py-2.5 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-lg hover:bg-[#D5EAD9] cursor-pointer"
                >
                  Modificar búsqueda
                </button>
                <button
                  type="button"
                  onClick={onExploreAllCategories}
                  className="px-4 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] cursor-pointer"
                >
                  Explorar todas las categorías
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((item) => (
                <RecipeCard
                  key={item.recipe.id}
                  recipe={item.recipe}
                  isFavorite={favorites.includes(item.recipe.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelect={onSelectRecipe}
                  availableIngredients={item.availableIngredients}
                  missingIngredients={item.missingIngredients}
                  matchedCount={item.matchedCount}
                  totalCount={item.totalCount}
                  matchPercentage={item.matchPercentage}
                  userHasPremium={userHasPremium}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
