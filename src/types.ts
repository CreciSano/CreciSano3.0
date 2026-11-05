export type RecipeCategory =
  | 'Desayunos'
  | 'Almuerzos'
  | 'Cenas'
  | 'Bebidas y jugos naturales'
  | 'Loncheras saludables'
  | 'Postres'
  | 'Snacks y aperitivos'
  | 'Recetas económicas'
  | 'Recetas saludables'
  | 'Recetas rápidas';

export const ALL_CATEGORIES: RecipeCategory[] = [
  'Desayunos',
  'Almuerzos',
  'Cenas',
  'Bebidas y jugos naturales',
  'Loncheras saludables',
  'Postres',
  'Snacks y aperitivos',
  'Recetas económicas',
  'Recetas saludables',
  'Recetas rápidas',
];

export type MembershipStatus = 'free' | 'premium_active' | 'premium_expired';

export interface RecipeIngredient {
  name: string;
  amount: string;
  numericAmount?: number;
  unit?: string;
  alternative?: string;
}

export interface RecipeNutrition {
  calories: number;
  protein: string;
  carbs: string;
  fats: string;
  fiber?: string;
}

export interface RecipeVideoTutorial {
  id: string;
  videoUrl: string;
  posterUrl: string;
  duration: string;
  chapters: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTimeMinutes: number;
  difficulty: 'Fácil' | 'Media' | 'Elaborada';
  servings: number;
  categories: RecipeCategory[];
  ingredients: RecipeIngredient[];
  steps: string[];
  nutrition?: RecipeNutrition;
  tips?: string[];
  isPremium?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  videoTutorial?: RecipeVideoTutorial;
  authorName?: string;
  isCommunity?: boolean;
  likes?: number;
}

export interface RecipeMatchResult {
  recipe: Recipe;
  availableIngredients: string[];
  missingIngredients: string[];
  matchedCount: number;
  totalCount: number;
  matchPercentage: number;
}

export interface NotificationPreferences {
  newRecipes: boolean;
  newVideos: boolean;
  premiumCollections: boolean;
  recommendedRecipes: boolean;
  crecisanoNews: boolean;
}

export interface AppNotification {
  id: string;
  type: 'recipe' | 'video' | 'collection' | 'recommendation' | 'news';
  title: string;
  message: string;
  date: string;
  read: boolean;
  targetScreen?: AppScreen;
  targetRecipeId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  membershipStatus: MembershipStatus;
  membershipExpiresAt?: string;
  preferences: string[];
  pantry: string[];
  recipeHistory: string[];
  notificationPrefs: NotificationPreferences;
  createdAt: string;
}

export type DayOfWeek =
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export type MealSlot = 'Desayuno' | 'Almuerzo' | 'Cena';

export type WeeklyMealPlan = Record<DayOfWeek, Record<MealSlot, string | null>>;

export interface CommunityComment {
  id: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  recipeId?: string;
  authorName: string;
  title: string;
  story: string;
  image: string;
  category: RecipeCategory;
  prepTimeMinutes: number;
  likes: number;
  likedBy: string[];
  comments: CommunityComment[];
  createdAt: string;
}

export interface PremiumCollection {
  id: string;
  title: string;
  subtitle: string;
  recipeCountLabel: string;
  image: string;
  categoryFilter?: RecipeCategory;
}

export type AppScreen =
  | 'welcome'
  | 'home'
  | 'auth'
  | 'search'
  | 'results'
  | 'recipe-detail'
  | 'categories'
  | 'favorites'
  | 'planner'
  | 'community'
  | 'premium'
  | 'subscription'
  | 'notifications'
  | 'profile';
