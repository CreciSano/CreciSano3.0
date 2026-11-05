import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Heart,
  MessageSquare,
  Send,
  Check,
  ShoppingBag,
  X,
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  CommunityPost,
  DayOfWeek,
  MealSlot,
  Recipe,
  RecipeCategory,
  WeeklyMealPlan,
} from '../types';
import { normalizeIngredient } from '../data/recipes';
import { RecipeImage } from './RecipeImage';

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

interface MealPlannerViewProps {
  mealPlan: WeeklyMealPlan;
  recipes: Recipe[];
  userIngredients: string[];
  onUpdateSlot: (day: DayOfWeek, slot: MealSlot, recipeId: string | null) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const MealPlannerView: React.FC<MealPlannerViewProps> = ({
  mealPlan,
  recipes,
  userIngredients,
  onUpdateSlot,
  onSelectRecipe,
}) => {
  const [editingCell, setEditingCell] = useState<{
    day: DayOfWeek;
    slot: MealSlot;
  } | null>(null);
  const [checkedShopping, setCheckedShopping] = useState<string[]>([]);

  const getRecipeById = (id: string | null) =>
    id ? recipes.find((r) => r.id === id) || null : null;

  // Aggregate weekly shopping list
  const plannedIngredientsMap = new Map<string, string[]>();
  for (const day of DAYS) {
    for (const slot of SLOTS) {
      const rec = getRecipeById(mealPlan[day]?.[slot] ?? null);
      if (rec) {
        for (const ing of rec.ingredients) {
          const existing = plannedIngredientsMap.get(ing.name) || [];
          existing.push(ing.amount);
          plannedIngredientsMap.set(ing.name, existing);
        }
      }
    }
  }

  const allPlannedIngredients = Array.from(plannedIngredientsMap.entries());
  const hasInPantry = (name: string) => {
    const norm = normalizeIngredient(name);
    return userIngredients.some((u) => {
      const nu = normalizeIngredient(u);
      return norm.includes(nu) || nu.includes(norm);
    });
  };

  const toBuy = allPlannedIngredients.filter(([name]) => !hasInPantry(name));
  const alreadyHave = allPlannedIngredients.filter(([name]) => hasInPantry(name));

  const toggleShoppingItem = (name: string) => {
    setCheckedShopping((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="max-w-3xl">
        <p className="text-sm font-medium text-[#2D6A4F] mb-2">
          Organización semanal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight mb-3">
          Planificador de comidas
        </h1>
        <p className="text-base text-[#4A5D52]">
          Organiza tus desayunos, almuerzos y cenas de la semana. Calculamos automáticamente los ingredientes que necesitas comprar según lo que ya tienes en casa.
        </p>
      </div>

      {/* Recipe Picker Modal/Banner when editing a cell */}
      {editingCell && (
        <div className="bg-white border-2 border-[#1B4332] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#18261E]">
              Elegir receta para {editingCell.day} · {editingCell.slot}
            </h2>
            <button
              type="button"
              onClick={() => setEditingCell(null)}
              className="p-1.5 text-[#52665A] hover:text-[#18261E] cursor-pointer"
              aria-label="Cerrar selector"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {recipes.map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => {
                  onUpdateSlot(editingCell.day, editingCell.slot, rec.id);
                  setEditingCell(null);
                }}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E0D5] bg-[#FAF8F2] hover:border-[#1B4332] text-left transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#EFECE4]">
                  <RecipeImage src={rec.image} alt={rec.title} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#18261E] truncate">
                    {rec.title}
                  </div>
                  <div className="text-xs text-[#52665A] tabular-nums">
                    {rec.prepTimeMinutes} min · {rec.categories[0]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-white border border-[#E5E0D5] rounded-2xl p-4 flex flex-col space-y-3"
          >
            <h2 className="font-display text-base font-bold text-[#1B4332] border-b border-[#EFECE4] pb-2">
              {day}
            </h2>

            {SLOTS.map((slot) => {
              const recipe = getRecipeById(mealPlan[day]?.[slot] ?? null);
              return (
                <div key={slot} className="space-y-1">
                  <div className="text-xs font-medium text-[#52665A]">{slot}</div>
                  {recipe ? (
                    <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl p-2.5 space-y-2">
                      <button
                        type="button"
                        onClick={() => onSelectRecipe(recipe)}
                        className="text-xs font-semibold text-[#18261E] hover:text-[#2D6A4F] text-left line-clamp-2 leading-snug cursor-pointer"
                      >
                        {recipe.title}
                      </button>
                      <div className="flex items-center justify-between text-xs text-[#52665A] tabular-nums">
                        <span>{recipe.prepTimeMinutes} min</span>
                        <button
                          type="button"
                          onClick={() => onUpdateSlot(day, slot, null)}
                          aria-label={`Quitar ${recipe.title} de ${day} ${slot}`}
                          className="text-[#7C4D25] hover:text-[#18261E] p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditingCell({ day, slot })}
                      className="w-full py-3 px-2 border border-dashed border-[#D8D2C5] rounded-xl text-xs font-medium text-[#52665A] hover:border-[#1B4332] hover:text-[#1B4332] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Automatic Weekly Shopping List */}
      <section className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-[#1B4332]" />
          <div>
            <h2 className="font-display text-xl font-bold text-[#18261E]">
              Lista de compras semanal
            </h2>
            <p className="text-xs text-[#52665A]">
              Generada automáticamente a partir de tus recetas planificadas y tu despensa actual
            </p>
          </div>
        </div>

        {allPlannedIngredients.length === 0 ? (
          <p className="text-sm text-[#4A5D52]">
            Agrega recetas a tu planificador semanal para generar tu lista de compras.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#18261E] tabular-nums">
                Por comprar ({toBuy.length})
              </h3>
              {toBuy.length === 0 ? (
                <p className="text-xs text-[#2D6A4F] bg-[#E8F3EB] p-3 rounded-xl">
                  ¡Tienes todos los ingredientes necesarios para tu semana!
                </p>
              ) : (
                <ul className="divide-y divide-[#EFECE4]">
                  {toBuy.map(([name, amounts]) => {
                    const checked = checkedShopping.includes(name);
                    return (
                      <li
                        key={name}
                        onClick={() => toggleShoppingItem(name)}
                        className="py-2.5 flex items-center justify-between gap-3 text-sm cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-5 h-5 rounded flex items-center justify-center border ${
                              checked
                                ? 'bg-[#1B4332] border-[#1B4332] text-white'
                                : 'border-[#D8D2C5] bg-[#FAF8F2]'
                            }`}
                          >
                            {checked && <Check className="w-3.5 h-3.5" />}
                          </span>
                          <span
                            className={
                              checked
                                ? 'line-through text-[#52665A]'
                                : 'font-medium text-[#18261E]'
                            }
                          >
                            {name}
                          </span>
                        </div>
                        <span className="text-xs text-[#52665A] font-mono tabular-nums">
                          {amounts.join(' + ')}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#18261E] tabular-nums">
                Ya tienes en casa ({alreadyHave.length})
              </h3>
              {alreadyHave.length === 0 ? (
                <p className="text-xs text-[#52665A]">
                  Ninguno de los ingredientes planificados está marcado en tu despensa aún.
                </p>
              ) : (
                <ul className="divide-y divide-[#EFECE4]">
                  {alreadyHave.map(([name, amounts]) => (
                    <li
                      key={name}
                      className="py-2.5 flex items-center justify-between gap-3 text-sm text-[#2D6A4F]"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span className="font-medium">{name}</span>
                      </div>
                      <span className="text-xs font-mono tabular-nums">
                        {amounts.join(' + ')}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

interface CommunityViewProps {
  posts: CommunityPost[];
  recipes: Recipe[];
  onLikePost: (postId: string) => void;
  onCommentPost: (postId: string, text: string) => void;
  onCreateRecipePost: (data: {
    title: string;
    category: RecipeCategory;
    prepTimeMinutes: number;
    difficulty: 'Fácil' | 'Media' | 'Elaborada';
    servings: number;
    ingredientsText: string;
    stepsText: string;
    story: string;
  }) => Promise<void>;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  posts,
  recipes,
  onLikePost,
  onCommentPost,
  onCreateRecipePost,
  onSelectRecipe,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Recetas saludables');
  const [prepTimeMinutes, setPrepTimeMinutes] = useState(20);
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Media' | 'Elaborada'>('Fácil');
  const [servings, setServings] = useState(2);
  const [ingredientsText, setIngredientsText] = useState('');
  const [stepsText, setStepsText] = useState('');
  const [story, setStory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !ingredientsText.trim()) return;
    setSubmitting(true);
    try {
      await onCreateRecipePost({
        title,
        category,
        prepTimeMinutes,
        difficulty,
        servings,
        ingredientsText,
        stepsText,
        story,
      });
      setTitle('');
      setIngredientsText('');
      setStepsText('');
      setStory('');
      setShowForm(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;
    onCommentPost(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-[#2D6A4F] mb-2">
            Cocina colaborativa
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight mb-2">
            Comunidad CreciSano
          </h1>
          <p className="text-base text-[#4A5D52]">
            Descubre cómo otras personas aprovechan los ingredientes de su despensa y comparte tus propias preparaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((prev) => !prev)}
          className="px-5 py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cerrar formulario' : 'Compartir receta'}
        </button>
      </div>

      {/* Share Recipe Form */}
      {showForm && (
        <form
          onSubmit={handlePublish}
          className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <h2 className="font-display text-xl font-bold text-[#18261E]">
            Publicar una nueva receta en la comunidad
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Nombre de la preparación *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Crema tibia de calabacín y papa"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                  Minutos
                </label>
                <input
                  type="number"
                  min={5}
                  max={180}
                  value={prepTimeMinutes}
                  onChange={(e) => setPrepTimeMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                  Dificultad
                </label>
                <select
                  value={difficulty}
                  onChange={(e) =>
                    setDifficulty(e.target.value as 'Fácil' | 'Media' | 'Elaborada')
                  }
                  className="w-full px-2.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Media">Media</option>
                  <option value="Elaborada">Elaborada</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                  Porciones
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm tabular-nums"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Ingredientes (uno por línea, ej. Calabacín - 2 unidades) *
              </label>
              <textarea
                rows={3}
                required
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                placeholder={'Calabacín - 2 unidades\nCebolla - 1/2 unidad\nAceite de oliva - 1 cucharada'}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Pasos de preparación (uno por línea)
              </label>
              <textarea
                rows={3}
                value={stepsText}
                onChange={(e) => setStepsText(e.target.value)}
                placeholder={'Sofríe la cebolla picada.\nAgrega el calabacín en cubos y cocina 12 minutos.\nLicúa hasta obtener una crema suave.'}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                ¿Qué ingredientes aprovechaste o qué consejo recomiendas?
              </label>
              <input
                type="text"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder="Ej. Perfecta para aprovechar calabacines maduros de la nevera."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 text-sm font-medium text-[#4A5D52] hover:text-[#18261E] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Publicando...' : 'Publicar receta'}
            </button>
          </div>
        </form>
      )}

      {/* Community Feed */}
      <div className="space-y-6">
        {posts.map((post) => {
          const linkedRecipe = post.recipeId
            ? recipes.find((r) => r.id === post.recipeId)
            : undefined;

          return (
            <article
              key={post.id}
              className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
            >
              <div className="md:col-span-4 aspect-[4/3] md:aspect-auto bg-[#F3EFE6]">
                <RecipeImage
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#52665A] tabular-nums">
                    <span className="font-semibold text-[#1B4332]">
                      {post.authorName}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{post.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{post.prepTimeMinutes} min</span>
                  </div>

                  <h2 className="font-display text-xl font-bold text-[#18261E]">
                    {post.title}
                  </h2>

                  <p className="text-sm text-[#4A5D52] leading-relaxed">
                    {post.story}
                  </p>
                </div>

                {/* Actions & Comments */}
                <div className="space-y-4 pt-3 border-t border-[#EFECE4]">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => onLikePost(post.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B4332] hover:text-[#2D6A4F] cursor-pointer tabular-nums"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes} Me gusta</span>
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#52665A] tabular-nums">
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} comentarios</span>
                      </span>
                    </div>

                    {linkedRecipe && (
                      <button
                        type="button"
                        onClick={() => onSelectRecipe(linkedRecipe)}
                        className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer"
                      >
                        Ver receta completa
                      </button>
                    )}
                  </div>

                  {post.comments.length > 0 && (
                    <div className="bg-[#FAF8F2] rounded-xl p-3 space-y-2">
                      {post.comments.map((c) => (
                        <div key={c.id} className="text-xs text-[#18261E]">
                          <strong className="font-semibold">{c.authorName}:</strong>{' '}
                          <span className="text-[#4A5D52]">{c.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => handleCommentSubmit(e, post.id)}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Escribe un comentario o consejo..."
                      className="flex-1 px-3 py-2 bg-[#FAF8F2] border border-[#D8D2C5] rounded-lg text-xs text-[#18261E] focus:outline-none focus:border-[#1B4332]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#E8F3EB] text-[#1B4332] rounded-lg text-xs font-semibold hover:bg-[#D5EAD9] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
