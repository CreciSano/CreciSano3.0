import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calendar,
  Heart,
  Search,
  Sparkles,
  Users,
  Crown,
  Plus,
  X,
} from 'lucide-react';
import {
  ALL_CATEGORIES,
  AppNotification,
  AppScreen,
  CommunityPost,
  DayOfWeek,
  MealSlot,
  MembershipStatus,
  NotificationPreferences,
  Recipe,
  RecipeCategory,
  UserProfile,
  WeeklyMealPlan,
} from './types';
import {
  CATEGORY_METADATA,
  HERO_KITCHEN_IMAGE,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECIPES,
  matchRecipesByIngredients,
} from './data/recipes';
import { Logo } from './components/Logo';
import { Navbar } from './components/Navbar';
import { RecipeImage } from './components/RecipeImage';
import { RecipeCard } from './components/RecipeCard';
import { IngredientSearchView } from './components/IngredientSearchView';
import { RecipeDetailView } from './components/RecipeDetailView';
import {
  CommunityView,
  MealPlannerView,
} from './components/PlannerAndCommunity';
import {
  AuthView,
  NotificationsView,
  ProfileView,
} from './components/AuthAndProfile';
import {
  PremiumView,
  SubscriptionView,
} from './components/PremiumAndSubscription';

const TOKEN_STORAGE_KEY = 'crecisano_auth_token';

function createDefaultMealPlan(): WeeklyMealPlan {
  const days: DayOfWeek[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  const plan = {} as WeeklyMealPlan;
  for (const day of days) {
    plan[day] = { Desayuno: null, Almuerzo: null, Cena: null };
  }
  return plan;
}

export function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [previousScreen, setPreviousScreen] = useState<AppScreen>('home');

  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Auth & User State
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_STORAGE_KEY)
  );
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Home Quick Search Bar
  const [homeQuery, setHomeQuery] = useState('');

  // Core Feature: Ingredient Search State
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Pollo',
    'Papa',
    'Zanahoria',
    'Arroz',
  ]);
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [pantrySavedNotice, setPantrySavedNotice] = useState<boolean>(false);

  // Categories State
  const [activeCategory, setActiveCategory] =
    useState<RecipeCategory>('Desayunos');
  const [categoryIngredientInput, setCategoryIngredientInput] = useState('');
  const [categoryMaxTime, setCategoryMaxTime] = useState<number | null>(null);

  // Favorites, Meal Plan, Community & Notifications State
  const [favorites, setFavorites] = useState<string[]>([
    'arroz-pollo-papa-zanahoria',
    'tostadas-palta-huevo',
  ]);
  const [mealPlan, setMealPlan] = useState<WeeklyMealPlan>(
    createDefaultMealPlan
  );
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(
    INITIAL_COMMUNITY_POSTS
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  const membershipStatus: MembershipStatus =
    user?.membershipStatus || 'free';
  const userHasPremium = membershipStatus === 'premium_active';

  // Initial Data Load from Centralized Backend API
  useEffect(() => {
    fetch('/api/recipes')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.recipes && Array.isArray(data.recipes)) {
          setRecipes(data.recipes);
        }
      })
      .catch(() => {});

    fetch('/api/community')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.posts && Array.isArray(data.posts)) {
          setCommunityPosts(data.posts);
        }
      })
      .catch(() => {});

    fetch('/api/notifications')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.notifications && Array.isArray(data.notifications)) {
          setNotifications(data.notifications);
        }
      })
      .catch(() => {});
  }, []);

  // Restore session if token exists
  useEffect(() => {
    if (!token) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        return res.json();
      })
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          if (Array.isArray(data.favorites)) setFavorites(data.favorites);
          if (data.mealPlan) setMealPlan(data.mealPlan);
          if (Array.isArray(data.user.pantry) && data.user.pantry.length > 0) {
            setSelectedIngredients(data.user.pantry);
          }
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const navigateTo = (next: AppScreen) => {
    setPreviousScreen(screen);
    setScreen(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    // Control Premium Access: if free or expired, invite to subscribe
    if (recipe.isPremium && !userHasPremium) {
      setPreviousScreen(screen);
      setScreen('subscription');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setPreviousScreen(screen);
    setSelectedRecipe(recipe);
    setScreen('recipe-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Record in recipe history
    if (token) {
      fetch('/api/profile/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipeId: recipe.id }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.recipeHistory && user) {
            setUser({ ...user, recipeHistory: data.recipeHistory });
          }
        })
        .catch(() => {});
    }
  };

  // Ingredient handlers
  const handleAddIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (!trimmed) return;
    setSelectedIngredients((prev) =>
      prev.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : [...prev, trimmed]
    );
  };

  const handleRemoveIngredient = (ing: string) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item.toLowerCase() !== ing.toLowerCase())
    );
  };

  const handleToggleIngredient = (ing: string) => {
    const exists = selectedIngredients.some(
      (item) => item.toLowerCase() === ing.toLowerCase()
    );
    if (exists) {
      handleRemoveIngredient(ing);
    } else {
      handleAddIngredient(ing);
    }
  };

  const handleClearIngredients = () => {
    setSelectedIngredients([]);
  };

  const handleSearchSubmit = () => {
    setHasSearched(true);
    if (screen !== 'search' && screen !== 'results') {
      navigateTo('search');
    } else {
      const el = document.getElementById('resultados-recetas');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = homeQuery.trim();
    if (trimmed) {
      const parts = trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      for (const p of parts) {
        handleAddIngredient(p);
      }
      setHomeQuery('');
    }
    setHasSearched(true);
    navigateTo('search');
  };

  const searchResults = useMemo(
    () => matchRecipesByIngredients(recipes, selectedIngredients),
    [recipes, selectedIngredients]
  );

  // Home Sections: Recomendadas, Populares, Nuevas, Rápidas
  const recommendedRecipes = useMemo(() => {
    if (searchResults.length >= 3) {
      return searchResults.slice(0, 3).map((r) => r.recipe);
    }
    return recipes.slice(0, 3);
  }, [recipes, searchResults]);

  const popularRecipes = useMemo(
    () => recipes.filter((r) => r.isPopular).slice(0, 3),
    [recipes]
  );

  const newRecipes = useMemo(
    () => recipes.filter((r) => r.isNew).slice(0, 3),
    [recipes]
  );

  const quickRecipes = useMemo(
    () => recipes.filter((r) => r.prepTimeMinutes <= 15).slice(0, 3),
    [recipes]
  );

  // Favorites handler
  const handleToggleFavorite = async (recipeId: string) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );

    if (token) {
      try {
        const res = await fetch('/api/favorites/toggle', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipeId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
          }
        }
      } catch {
        // Optimistic state already updated
      }
    }
  };

  // Meal Planner handler
  const handleUpdateMealSlot = async (
    day: DayOfWeek,
    slot: MealSlot,
    recipeId: string | null
  ) => {
    setMealPlan((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: recipeId,
      },
    }));

    if (token) {
      try {
        const res = await fetch('/api/meal-plan', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ day, slot, recipeId }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.mealPlan) setMealPlan(data.mealPlan);
        }
      } catch {
        // Optimistic state already updated
      }
    }
  };

  // Auth handlers
  const handleLogin = async (email: string, password: string) => {
    setAuthError(null);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'No se pudo iniciar sesión.');
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    if (Array.isArray(data.favorites)) setFavorites(data.favorites);
    if (data.mealPlan) setMealPlan(data.mealPlan);
    if (Array.isArray(data.user.pantry) && data.user.pantry.length > 0) {
      setSelectedIngredients(data.user.pantry);
    }
    navigateTo('home');
  };

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
    preferences: string[]
  ) => {
    setAuthError(null);
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, preferences }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'No se pudo crear la cuenta.');
      return;
    }
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    setFavorites(data.favorites || []);
    if (data.mealPlan) setMealPlan(data.mealPlan);
    navigateTo('home');
  };

  const handleRecoverPassword = async (
    email: string,
    newPassword: string
  ): Promise<string | null> => {
    setAuthError(null);
    const res = await fetch('/api/auth/recover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      setAuthError(data.error || 'No se pudo recuperar la contraseña.');
      return null;
    }
    return data.message;
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    navigateTo('home');
  };

  const handleUpdateProfile = async (updates: {
    name?: string;
    avatarUrl?: string;
    preferences?: string[];
    pantry?: string[];
    notificationPrefs?: NotificationPreferences;
  }) => {
    if (!token) return;
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) setUser(data.user);
    }
  };

  const handleSaveCurrentIngredientsToPantry = async () => {
    if (!user || !token) {
      navigateTo('auth');
      return;
    }
    await handleUpdateProfile({ pantry: selectedIngredients });
    setPantrySavedNotice(true);
    setTimeout(() => setPantrySavedNotice(false), 2500);
  };

  // Community handlers
  const handleLikePost = async (postId: string) => {
    const res = await fetch(`/api/community/${postId}/like`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const data = await res.json();
      if (data.post) {
        setCommunityPosts((prev) =>
          prev.map((p) => (p.id === postId ? data.post : p))
        );
      }
    }
  };

  const handleCommentPost = async (postId: string, text: string) => {
    const res = await fetch(`/api/community/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ text }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.post) {
        setCommunityPosts((prev) =>
          prev.map((p) => (p.id === postId ? data.post : p))
        );
      }
    }
  };

  const handleCreateRecipePost = async (form: {
    title: string;
    category: RecipeCategory;
    prepTimeMinutes: number;
    difficulty: 'Fácil' | 'Media' | 'Elaborada';
    servings: number;
    ingredientsText: string;
    stepsText: string;
    story: string;
  }) => {
    const parsedIngredients = form.ingredientsText
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [namePart, amountPart] = line.split('-').map((s) => s.trim());
        return {
          name: namePart || line,
          amount: amountPart || 'Al gusto',
        };
      });

    const parsedSteps = form.stepsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        title: form.title,
        categories: [form.category, 'Recetas saludables'],
        prepTimeMinutes: form.prepTimeMinutes,
        difficulty: form.difficulty,
        servings: form.servings,
        ingredients: parsedIngredients,
        steps: parsedSteps,
        story: form.story,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.recipe) {
        setRecipes((prev) => [data.recipe, ...prev]);
      }
      if (data.post) {
        setCommunityPosts((prev) => [data.post, ...prev]);
      }
    }
  };

  // Notifications handlers
  const handleMarkAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch('/api/notifications/read-all', { method: 'POST' }).catch(
      () => {}
    );
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Filtered recipes for Categories screen (with integrated ingredient search!)
  const categoryBaseRecipes = useMemo(
    () => recipes.filter((r) => r.categories.includes(activeCategory)),
    [recipes, activeCategory]
  );

  const categoryFilteredRecipes = useMemo(() => {
    let list = categoryBaseRecipes;
    if (categoryMaxTime !== null) {
      list = list.filter((r) => r.prepTimeMinutes <= categoryMaxTime);
    }
    if (selectedIngredients.length > 0) {
      const matched = matchRecipesByIngredients(list, selectedIngredients);
      if (matched.length > 0) {
        return matched.map((m) => m.recipe);
      }
    }
    return list;
  }, [categoryBaseRecipes, categoryMaxTime, selectedIngredients]);

  // Favorite recipes list
  const favoriteRecipes = useMemo(
    () => recipes.filter((r) => favorites.includes(r.id)),
    [recipes, favorites]
  );

  // Related recipes for RecipeDetailView
  const relatedRecipes = useMemo(() => {
    if (!selectedRecipe) return [];
    return recipes
      .filter(
        (r) =>
          r.id !== selectedRecipe.id &&
          r.categories.some((c) => selectedRecipe.categories.includes(c))
      )
      .slice(0, 3);
  }, [recipes, selectedRecipe]);

  // 1. PANTALLA DE BIENVENIDA
  if (screen === 'welcome') {
    return (
      <div className="min-h-screen bg-[#FAF8F2] text-[#18261E] flex flex-col justify-between">
        <header className="max-w-6xl w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <button
            type="button"
            onClick={() => navigateTo(user ? 'profile' : 'auth')}
            className="text-sm font-semibold text-[#1B4332] hover:underline cursor-pointer"
          >
            {user ? `Hola, ${user.name.split(' ')[0]}` : 'Iniciar sesión'}
          </button>
        </header>

        <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Logo size="lg" />
            <p className="text-sm font-semibold text-[#2D6A4F]">
              Tú eliges los ingredientes, CreciSano encuentra las recetas
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#18261E] leading-[1.12] tracking-tight text-balance">
              Cocinar rico y saludable nunca fue tan fácil
            </h1>
            <p className="text-base sm:text-lg text-[#4A5D52] leading-relaxed max-w-xl">
              La plataforma pensada para madres y familias que desean preparar comidas nutritivas, prácticas y económicas usando los ingredientes que ya tienen en casa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigateTo('home')}
                className="px-7 py-3.5 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Comenzar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo('auth')}
                className="px-5 py-3.5 bg-[#E8F3EB] text-[#1B4332] text-sm font-semibold rounded-xl hover:bg-[#D5EAD9] transition-colors cursor-pointer"
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => navigateTo('auth')}
                className="px-5 py-3.5 bg-white border border-[#D8D2C5] text-[#18261E] text-sm font-semibold rounded-xl hover:border-[#1B4332] transition-colors cursor-pointer"
              >
                Crear cuenta
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#E5E0D5] bg-[#F3EFE6]">
              <RecipeImage
                src={HERO_KITCHEN_IMAGE}
                alt="Alimentos saludables y preparación casera en CreciSano"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </main>

        <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-4 text-xs text-[#52665A]">
          <span>CreciSano · Tú eliges los ingredientes, CreciSano encuentra las recetas</span>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigateTo('categories')}
              className="hover:text-[#18261E] cursor-pointer"
            >
              Categorías
            </button>
            <button
              type="button"
              onClick={() => navigateTo('premium')}
              className="hover:text-[#18261E] cursor-pointer"
            >
              CreciSano Premium
            </button>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F2] text-[#18261E]">
      <Navbar currentScreen={screen} onNavigate={navigateTo} user={user} />

      <main className="flex-1 pb-20 md:pb-0">
        {/* 2. PANTALLA PRINCIPAL – INICIO */}
        {screen === 'home' && (
          <div className="space-y-14 pb-16">
            {/* Hero Section with Personalized Greeting & Search Bar */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-7 flex flex-col justify-center bg-white border border-[#E5E0D5] rounded-2xl p-7 sm:p-10 space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#2D6A4F]">
                      {user
                        ? `Hola, ${user.name.split(' ')[0]} · Bienvenida a CreciSano`
                        : 'Bienvenida a CreciSano · Cocina práctica en familia'}
                    </p>
                    <h1 className="font-display text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#18261E] leading-[1.15] tracking-tight text-balance">
                      ¿Qué cocinamos hoy?
                    </h1>
                    <p className="text-base text-[#4A5D52] leading-relaxed">
                      Tú eliges los ingredientes, CreciSano encuentra las recetas. Escribe lo que tienes en casa o explora nuestras categorías.
                    </p>
                  </div>

                  {/* Search Bar */}
                  <form
                    onSubmit={handleHomeSearchSubmit}
                    className="flex flex-col sm:flex-row gap-2.5"
                  >
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#52665A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={homeQuery}
                        onChange={(e) => setHomeQuery(e.target.value)}
                        placeholder="Ej. pollo, papa, zanahoria, arroz..."
                        aria-label="Buscar por ingredientes"
                        className="w-full pl-10 pr-4 py-3 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm text-[#18261E] focus:outline-none focus:border-[#1B4332]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Buscar recetas
                    </button>
                  </form>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => navigateTo('search')}
                      className="px-5 py-2.5 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-xl hover:bg-[#D5EAD9] transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Buscador por ingredientes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigateTo('planner')}
                      className="px-5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] text-[#18261E] text-xs font-semibold rounded-xl hover:border-[#1B4332] transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#1B4332]" />
                      <span>Mi menú semanal</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-5 aspect-[4/3] lg:aspect-auto rounded-2xl overflow-hidden border border-[#E5E0D5] bg-[#F3EFE6]">
                  <RecipeImage
                    src={HERO_KITCHEN_IMAGE}
                    alt="Ingredientes frescos y platos saludables de CreciSano"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* 10 Categorías Principales */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#18261E]">
                    Categorías principales
                  </h2>
                  <p className="text-sm text-[#4A5D52]">
                    10 bibliotecas especializadas para cada momento del día
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('categories')}
                  className="text-sm font-semibold text-[#1B4332] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Ver todas
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {ALL_CATEGORIES.map((cat) => {
                  const count = recipes.filter((r) =>
                    r.categories.includes(cat)
                  ).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat);
                        navigateTo('categories');
                      }}
                      className="p-4 bg-white border border-[#E5E0D5] rounded-xl text-left hover:border-[#1B4332] transition-colors cursor-pointer"
                    >
                      <div className="font-display text-sm font-semibold text-[#18261E] leading-snug">
                        {cat}
                      </div>
                      <div className="text-xs text-[#52665A] mt-1 tabular-nums">
                        {count} {count === 1 ? 'receta' : 'recetas'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recetas Recomendadas */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="flex items-end justify-between gap-4 border-b border-[#E5E0D5] pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#18261E]">
                    Recetas recomendadas
                  </h2>
                  <p className="text-sm text-[#4A5D52] mt-1">
                    Según tus ingredientes en casa ({selectedIngredients.join(', ') || 'variados'})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('search')}
                  className="text-sm font-semibold text-[#1B4332] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Editar ingredientes
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedRecipes.map((recipe) => {
                  const match = searchResults.find(
                    (m) => m.recipe.id === recipe.id
                  );
                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectRecipe}
                      availableIngredients={match?.availableIngredients}
                      missingIngredients={match?.missingIngredients}
                      matchedCount={match?.matchedCount}
                      totalCount={match?.totalCount}
                      matchPercentage={match?.matchPercentage}
                      userHasPremium={userHasPremium}
                    />
                  );
                })}
              </div>
            </section>

            {/* Featured Access to CreciSano Premium */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="bg-[#1B4332] text-white rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A7D7B8]">
                    <Crown className="w-4 h-4" />
                    <span>CRECISANO PREMIUM</span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl font-bold">
                    Más recetas, más ideas y más formas de alimentar con amor
                  </h2>
                  <p className="text-sm text-[#E8F3EB]">
                    Accede a videos tutoriales paso a paso, colecciones especiales y recetas exclusivas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('premium')}
                  className="px-6 py-3.5 bg-white text-[#1B4332] text-sm font-bold rounded-xl hover:bg-[#FAF8F2] transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start md:self-center"
                >
                  Explorar CreciSano Premium
                </button>
              </div>
            </section>

            {/* Recetas Populares & Recetas Rápidas */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="border-b border-[#E5E0D5] pb-4">
                <h2 className="font-display text-2xl font-bold text-[#18261E]">
                  Recetas populares
                </h2>
                <p className="text-sm text-[#4A5D52] mt-1">
                  Las preparaciones favoritas de las familias en CreciSano
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {popularRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={handleSelectRecipe}
                    userHasPremium={userHasPremium}
                  />
                ))}
              </div>
            </section>

            <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
              <div className="border-b border-[#E5E0D5] pb-4">
                <h2 className="font-display text-2xl font-bold text-[#18261E]">
                  Recetas rápidas (15 minutos o menos)
                </h2>
                <p className="text-sm text-[#4A5D52] mt-1">
                  Soluciones nutritivas para días con poco tiempo
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={handleSelectRecipe}
                    userHasPremium={userHasPremium}
                  />
                ))}
              </div>
            </section>

            {newRecipes.length > 0 && (
              <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
                <div className="border-b border-[#E5E0D5] pb-4">
                  <h2 className="font-display text-2xl font-bold text-[#18261E]">
                    Nuevas recetas
                  </h2>
                  <p className="text-sm text-[#4A5D52] mt-1">
                    Recién incorporadas a nuestra biblioteca
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {newRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={handleSelectRecipe}
                      userHasPremium={userHasPremium}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 3. REGISTRO E INICIO DE SESIÓN */}
        {screen === 'auth' && (
          <AuthView
            onLogin={handleLogin}
            onRegister={handleRegister}
            onRecoverPassword={handleRecoverPassword}
            error={authError}
          />
        )}

        {/* 4 & 5. BUSCADOR DE INGREDIENTES Y RESULTADOS */}
        {(screen === 'search' || screen === 'results') && (
          <IngredientSearchView
            selectedIngredients={selectedIngredients}
            onAddIngredient={handleAddIngredient}
            onRemoveIngredient={handleRemoveIngredient}
            onSetIngredients={setSelectedIngredients}
            onClearIngredients={handleClearIngredients}
            onSearchSubmit={handleSearchSubmit}
            hasSearched={hasSearched}
            results={searchResults}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            onSavePantry={handleSaveCurrentIngredientsToPantry}
            pantrySavedNotice={pantrySavedNotice}
            onExploreAllCategories={() => navigateTo('categories')}
            userHasPremium={userHasPremium}
          />
        )}

        {/* 6. DETALLE DE CADA RECETA */}
        {screen === 'recipe-detail' && selectedRecipe && (
          <RecipeDetailView
            recipe={selectedRecipe}
            relatedRecipes={relatedRecipes}
            isFavorite={favorites.includes(selectedRecipe.id)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            userIngredients={selectedIngredients}
            onToggleUserIngredient={handleToggleIngredient}
            onAddToMealPlan={handleUpdateMealSlot}
            onSelectRecipe={handleSelectRecipe}
            userHasPremium={userHasPremium}
            onBack={() =>
              navigateTo(
                previousScreen === 'recipe-detail' ? 'home' : previousScreen
              )
            }
          />
        )}

        {/* 7, 9 & 10. CATEGORÍAS INDEPENDIENTES CON BUSCADOR INTEGRADO */}
        {screen === 'categories' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((cat) => {
                const count = recipes.filter((r) =>
                  r.categories.includes(cat)
                ).length;
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
                      active
                        ? 'bg-[#1B4332] text-white'
                        : 'bg-white border border-[#E5E0D5] text-[#4A5D52] hover:text-[#18261E]'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Category Presentation Banner */}
            <div className="bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div className="md:col-span-5 aspect-[16/10] md:aspect-auto bg-[#F3EFE6]">
                <RecipeImage
                  src={CATEGORY_METADATA[activeCategory].image}
                  alt={CATEGORY_METADATA[activeCategory].title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                  Categoría CreciSano
                </span>
                <h1 className="font-display text-3xl font-bold text-[#18261E]">
                  {CATEGORY_METADATA[activeCategory].title}
                </h1>
                <p className="text-sm text-[#4A5D52] leading-relaxed">
                  {CATEGORY_METADATA[activeCategory].description}
                </p>

                {/* Integrated Ingredient Search inside Category */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (categoryIngredientInput.trim()) {
                      handleAddIngredient(categoryIngredientInput);
                      setCategoryIngredientInput('');
                    }
                  }}
                  className="flex gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={categoryIngredientInput}
                    onChange={(e) => setCategoryIngredientInput(e.target.value)}
                    placeholder={`Filtrar ${activeCategory.toLowerCase()} por ingrediente...`}
                    className="flex-1 px-3.5 py-2 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-xs"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-xl hover:bg-[#D5EAD9] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Agregar
                  </button>
                </form>

                {selectedIngredients.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-[#52665A]">
                      Ingredientes activos:
                    </span>
                    {selectedIngredients.map((ing) => (
                      <button
                        key={ing}
                        type="button"
                        onClick={() => handleRemoveIngredient(ing)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1B4332] text-white text-[11px] font-medium rounded-md cursor-pointer"
                      >
                        <span>{ing}</span>
                        <X className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filter Bar & Recipe Grid */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-[#4A5D52] tabular-nums">
                Mostrando <strong>{categoryFilteredRecipes.length}</strong>{' '}
                preparaciones en {activeCategory}
              </div>

              <select
                aria-label="Filtrar por tiempo"
                value={categoryMaxTime ?? ''}
                onChange={(e) =>
                  setCategoryMaxTime(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="px-3 py-2 bg-white border border-[#D8D2C5] rounded-lg text-xs font-medium text-[#18261E]"
              >
                <option value="">Cualquier tiempo</option>
                <option value="10">Hasta 10 min</option>
                <option value="15">Hasta 15 min</option>
                <option value="20">Hasta 20 min</option>
                <option value="30">Hasta 30 min</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryFilteredRecipes.map((recipe) => {
                const match = searchResults.find(
                  (m) => m.recipe.id === recipe.id
                );
                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.includes(recipe.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={handleSelectRecipe}
                    availableIngredients={match?.availableIngredients}
                    missingIngredients={match?.missingIngredients}
                    matchedCount={match?.matchedCount}
                    totalCount={match?.totalCount}
                    matchPercentage={match?.matchPercentage}
                    userHasPremium={userHasPremium}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 11. MIS FAVORITOS */}
        {screen === 'favorites' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-6">
              <div>
                <p className="text-sm font-medium text-[#2D6A4F] mb-2">
                  Sincronizados con tu cuenta
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18261E] tracking-tight">
                  Mis favoritos
                </h1>
              </div>
              <span className="text-sm text-[#52665A] tabular-nums">
                {favoriteRecipes.length}{' '}
                {favoriteRecipes.length === 1
                  ? 'receta guardada'
                  : 'recetas guardadas'}
              </span>
            </div>

            {favoriteRecipes.length === 0 ? (
              <div className="bg-white border border-[#E5E0D5] rounded-2xl p-10 text-center space-y-4">
                <Heart className="w-8 h-8 text-[#2D6A4F] mx-auto" />
                <h2 className="font-display text-xl font-bold text-[#18261E]">
                  Aún no tienes recetas guardadas en Mis favoritos
                </h2>
                <p className="text-sm text-[#4A5D52] max-w-md mx-auto">
                  Presiona el ícono de corazón en cualquier receta para consultarla rápidamente cuando vayas a cocinar.
                </p>
                <button
                  type="button"
                  onClick={() => navigateTo('search')}
                  className="px-6 py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] cursor-pointer"
                >
                  Explorar recetas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                    onSelect={handleSelectRecipe}
                    userHasPremium={userHasPremium}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 12. MI MENÚ SEMANAL */}
        {screen === 'planner' && (
          <MealPlannerView
            mealPlan={mealPlan}
            recipes={recipes}
            userIngredients={selectedIngredients}
            onUpdateSlot={handleUpdateMealSlot}
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {/* 13. CRECISANO PREMIUM & VIDEOS TUTORIALES */}
        {screen === 'premium' && (
          <PremiumView
            recipes={recipes}
            membershipStatus={membershipStatus}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={handleSelectRecipe}
            onGoToSubscription={() => navigateTo('subscription')}
            onSelectCollectionCategory={(cat) => {
              if (cat) setActiveCategory(cat);
              navigateTo('categories');
            }}
          />
        )}

        {/* 14. SUSCRIPCIÓN Y ACCESO PREMIUM */}
        {screen === 'subscription' && (
          <SubscriptionView
            membershipStatus={membershipStatus}
            membershipExpiresAt={user?.membershipExpiresAt}
            isLoggedIn={Boolean(user)}
            onGoToAuth={() => navigateTo('auth')}
            onBack={() =>
              navigateTo(
                previousScreen === 'subscription' ? 'premium' : previousScreen
              )
            }
          />
        )}

        {/* 16. NOTIFICACIONES */}
        {screen === 'notifications' && (
          <NotificationsView
            notifications={notifications}
            prefs={
              user?.notificationPrefs || {
                newRecipes: true,
                newVideos: true,
                premiumCollections: true,
                recommendedRecipes: true,
                crecisanoNews: true,
              }
            }
            onMarkAllRead={handleMarkAllNotificationsRead}
            onUpdatePrefs={(newPrefs) =>
              handleUpdateProfile({ notificationPrefs: newPrefs })
            }
            onOpenNotification={(notif) => {
              if (notif.targetRecipeId) {
                const found = recipes.find((r) => r.id === notif.targetRecipeId);
                if (found) {
                  handleSelectRecipe(found);
                  return;
                }
              }
              if (notif.targetScreen) {
                navigateTo(notif.targetScreen);
              }
            }}
          />
        )}

        {/* COMUNIDAD */}
        {screen === 'community' && (
          <CommunityView
            posts={communityPosts}
            recipes={recipes}
            onLikePost={handleLikePost}
            onCommentPost={handleCommentPost}
            onCreateRecipePost={handleCreateRecipePost}
            onSelectRecipe={handleSelectRecipe}
          />
        )}

        {/* 15. MI CUENTA */}
        {screen === 'profile' &&
          (user ? (
            <ProfileView
              user={user}
              recipes={recipes}
              favoritesCount={favorites.length}
              mealPlan={mealPlan}
              unreadNotificationsCount={unreadNotificationsCount}
              onUpdateProfile={handleUpdateProfile}
              onUsePantryForSearch={(pantry) => {
                setSelectedIngredients(pantry);
                setHasSearched(true);
                navigateTo('search');
              }}
              onSelectRecipe={handleSelectRecipe}
              onNavigate={navigateTo}
              onLogout={handleLogout}
            />
          ) : (
            <AuthView
              onLogin={handleLogin}
              onRegister={handleRegister}
              onRecoverPassword={handleRecoverPassword}
              error={authError}
            />
          ))}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="hidden md:block bg-white border-t border-[#E5E0D5] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="space-y-3">
            <Logo />
            <p className="text-xs text-[#52665A] leading-relaxed max-w-xs">
              Tú eliges los ingredientes, CreciSano encuentra las recetas. Plataforma sincronizada entre web y aplicación móvil.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs font-medium text-[#4A5D52]">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Inicio
            </button>
            <button
              type="button"
              onClick={() => navigateTo('search')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Buscar por ingredientes
            </button>
            <button
              type="button"
              onClick={() => navigateTo('categories')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Categorías
            </button>
            <button
              type="button"
              onClick={() => navigateTo('planner')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Mi menú semanal
            </button>
            <button
              type="button"
              onClick={() => navigateTo('favorites')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Mis favoritos
            </button>
            <button
              type="button"
              onClick={() => navigateTo('premium')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              CreciSano Premium
            </button>
            <button
              type="button"
              onClick={() => navigateTo('community')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Comunidad
            </button>
            <button
              type="button"
              onClick={() => navigateTo('notifications')}
              className="text-left hover:text-[#18261E] cursor-pointer"
            >
              Notificaciones
            </button>
          </div>

          <div className="flex flex-col sm:items-end justify-between space-y-3 text-xs text-[#52665A]">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => navigateTo('welcome')}
                className="inline-flex items-center gap-1 hover:text-[#18261E] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Bienvenida
              </button>
              <button
                type="button"
                onClick={() => navigateTo(user ? 'profile' : 'auth')}
                className="inline-flex items-center gap-1 hover:text-[#18261E] cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                {user ? 'Mi cuenta' : 'Iniciar sesión'}
              </button>
            </div>
            <span>© 2026 CreciSano. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
