import React, { useState } from 'react';
import {
  User,
  Check,
  Plus,
  X,
  LogOut,
  Calendar,
  Search,
  Sparkles,
  Bell,
  Heart,
  History,
  Crown,
} from 'lucide-react';
import {
  AppNotification,
  AppScreen,
  NotificationPreferences,
  Recipe,
  UserProfile,
  WeeklyMealPlan,
} from '../types';
import { RecipeImage } from './RecipeImage';

const DIETARY_OPTIONS = [
  'Recetas saludables',
  'Recetas rápidas',
  'Recetas económicas',
  'Loncheras saludables',
  'Desayunos',
  'Bebidas y jugos naturales',
  'Postres',
];

interface AuthViewProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (
    name: string,
    email: string,
    password: string,
    preferences: string[]
  ) => Promise<void>;
  onRecoverPassword: (email: string, newPassword: string) => Promise<string | null>;
  error: string | null;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onLogin,
  onRegister,
  onRecoverPassword,
  error,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'recover'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [preferences, setPreferences] = useState<string[]>([
    'Recetas saludables',
    'Recetas rápidas',
  ]);
  const [loading, setLoading] = useState(false);
  const [recoverMessage, setRecoverMessage] = useState<string | null>(null);

  const togglePref = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRecoverMessage(null);
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else if (mode === 'register') {
        await onRegister(name, email, password, preferences);
      } else {
        const msg = await onRecoverPassword(email, password);
        if (msg) {
          setRecoverMessage(msg);
          setMode('login');
          setPassword('');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoPass: string) => {
    setLoading(true);
    try {
      await onLogin(demoEmail, demoPass);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#18261E]">
            {mode === 'login'
              ? 'Iniciar sesión'
              : mode === 'register'
              ? 'Crear cuenta en CreciSano'
              : 'Recuperar contraseña'}
          </h1>
          <p className="text-sm text-[#4A5D52]">
            Tu cuenta se sincroniza automáticamente entre la aplicación móvil y el sitio web oficial de CreciSano.
          </p>
        </div>

        {/* Mode Switch */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setRecoverMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'login'
                ? 'bg-[#1B4332] text-white'
                : 'text-[#4A5D52] hover:text-[#18261E]'
            }`}
          >
            Iniciar sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setRecoverMessage(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              mode === 'register'
                ? 'bg-[#1B4332] text-white'
                : 'text-[#4A5D52] hover:text-[#18261E]'
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {recoverMessage && (
          <div className="p-3 rounded-xl bg-[#E8F3EB] border border-[#A7D7B8] text-xs font-medium text-[#1B4332]">
            {recoverMessage}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-[#FDF2EC] border border-[#E6B89C] text-xs font-medium text-[#7C4D25]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Sofía Navarro"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
              {mode === 'recover' ? 'Nueva contraseña' : 'Contraseña'}
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 4 caracteres"
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
            />
          </div>

          {mode === 'register' && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-semibold text-[#18261E]">
                Preferencias de alimentación
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map((pref) => {
                  const active = preferences.includes(pref);
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => togglePref(pref)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#E8F3EB] border-[#1B4332] text-[#1B4332] font-semibold'
                          : 'bg-[#FAF8F2] border-[#E5E0D5] text-[#4A5D52]'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading
              ? 'Procesando...'
              : mode === 'login'
              ? 'Iniciar sesión'
              : mode === 'register'
              ? 'Crear cuenta'
              : 'Actualizar contraseña'}
          </button>
        </form>

        <div className="text-center">
          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => setMode('recover')}
              className="text-xs font-medium text-[#2D6A4F] hover:underline cursor-pointer"
            >
              ¿Olvidaste tu contraseña? Recuperar acceso
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs font-medium text-[#2D6A4F] hover:underline cursor-pointer"
            >
              Volver a iniciar sesión
            </button>
          )}
        </div>

        {/* Demo Accounts for Testing Free, Active Premium & Expired Membership */}
        <div className="pt-4 border-t border-[#EFECE4] space-y-2">
          <div className="text-xs font-semibold text-[#18261E] text-center">
            Cuentas de prueba (sincronizadas con la base de datos):
          </div>
          <button
            type="button"
            onClick={() => handleQuickDemo('sofia@crecisano.com', 'crecisano123')}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-xl hover:bg-[#D5EAD9] transition-colors cursor-pointer"
          >
            Entrar como Sofía (Cuenta Gratis)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('camila@crecisano.com', 'premium123')}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#1B4332] text-white text-xs font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors cursor-pointer"
          >
            Entrar como Camila (Membresía Premium Activa)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('andres@crecisano.com', 'vencida123')}
            disabled={loading}
            className="w-full py-2 px-4 bg-[#FAF8F2] border border-[#D8D2C5] text-[#52665A] text-xs font-medium rounded-xl hover:text-[#18261E] transition-colors cursor-pointer"
          >
            Entrar como Andrés (Membresía Vencida)
          </button>
        </div>
      </div>
    </div>
  );
};

interface ProfileViewProps {
  user: UserProfile;
  recipes: Recipe[];
  favoritesCount: number;
  mealPlan: WeeklyMealPlan;
  unreadNotificationsCount: number;
  onUpdateProfile: (data: {
    name?: string;
    avatarUrl?: string;
    preferences?: string[];
    pantry?: string[];
  }) => Promise<void>;
  onUsePantryForSearch: (pantry: string[]) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onNavigate: (screen: AppScreen) => void;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  recipes,
  favoritesCount,
  mealPlan,
  unreadNotificationsCount,
  onUpdateProfile,
  onUsePantryForSearch,
  onSelectRecipe,
  onNavigate,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [preferences, setPreferences] = useState<string[]>(user.preferences || []);
  const [pantry, setPantry] = useState<string[]>(user.pantry || []);
  const [newPantryItem, setNewPantryItem] = useState('');
  const [savedBanner, setSavedBanner] = useState(false);

  const plannedCount = Object.values(mealPlan).reduce((acc, daySlots) => {
    return (
      acc +
      Object.values(daySlots).filter((recipeId) => recipeId !== null).length
    );
  }, 0);

  const historyRecipes = (user.recipeHistory || [])
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is Recipe => Boolean(r));

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleAddPantry = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newPantryItem.trim();
    if (
      trimmed &&
      !pantry.some((p) => p.toLowerCase() === trimmed.toLowerCase())
    ) {
      setPantry((prev) => [...prev, trimmed]);
      setNewPantryItem('');
    }
  };

  const handleRemovePantry = (item: string) => {
    setPantry((prev) => prev.filter((p) => p !== item));
  };

  const handleSave = async () => {
    await onUpdateProfile({ name, avatarUrl, preferences, pantry });
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const membershipLabel =
    user.membershipStatus === 'premium_active'
      ? 'CreciSano Premium (Activa)'
      : user.membershipStatus === 'premium_expired'
      ? 'CreciSano Premium (Vencida)'
      : 'CreciSano Gratis';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border border-[#E5E0D5] shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-[#E8F3EB] text-[#1B4332] flex items-center justify-center shrink-0">
              <User className="w-7 h-7" />
            </div>
          )}
          <div>
            <h1 className="font-display text-2xl font-bold text-[#18261E]">
              {user.name}
            </h1>
            <p className="text-sm text-[#52665A]">{user.email}</p>
            <div className="mt-1 text-xs font-semibold text-[#1B4332]">
              Tipo de cuenta: {membershipLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('notifications')}
            className="px-4 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] text-[#18261E] text-xs font-semibold rounded-xl hover:border-[#1B4332] inline-flex items-center gap-2 cursor-pointer tabular-nums"
          >
            <Bell className="w-4 h-4 text-[#1B4332]" />
            Notificaciones ({unreadNotificationsCount})
          </button>
          <button
            type="button"
            onClick={() => onNavigate('subscription')}
            className="px-4 py-2.5 bg-[#1B4332] text-white text-xs font-semibold rounded-xl hover:bg-[#2D6A4F] inline-flex items-center gap-2 cursor-pointer"
          >
            <Crown className="w-4 h-4" />
            {user.membershipStatus === 'premium_active'
              ? 'Mi membresía'
              : 'Pasar a Premium'}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] text-[#4A5D52] text-xs font-semibold rounded-xl hover:text-[#18261E] inline-flex items-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Quick Access Cards: Favoritos, Mi menú semanal, Despensa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 tabular-nums">
        <button
          type="button"
          onClick={() => onNavigate('favorites')}
          className="bg-white border border-[#E5E0D5] rounded-2xl p-5 text-left hover:border-[#1B4332] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#52665A]">
            <span>Mis favoritos</span>
            <Heart className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#18261E] mt-1">
            {favoritesCount}
          </div>
          <div className="text-xs text-[#2D6A4F] mt-1 font-medium">
            Consultar guardadas
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('planner')}
          className="bg-white border border-[#E5E0D5] rounded-2xl p-5 text-left hover:border-[#1B4332] transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#52665A]">
            <span>Mi menú semanal</span>
            <Calendar className="w-4 h-4 text-[#1B4332]" />
          </div>
          <div className="font-display text-2xl font-bold text-[#18261E] mt-1">
            {plannedCount}
          </div>
          <div className="text-xs text-[#2D6A4F] mt-1 font-medium">
            Organizar semana
          </div>
        </button>

        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5">
          <div className="text-xs text-[#52665A]">Ingredientes en despensa</div>
          <div className="font-display text-2xl font-bold text-[#18261E] mt-1">
            {pantry.length}
          </div>
          <div className="text-xs text-[#52665A] mt-1">
            Sincronizados con la web
          </div>
        </div>
      </div>

      {/* Historial de recetas */}
      {historyRecipes.length > 0 && (
        <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-[#1B4332]" />
            <h2 className="font-display text-xl font-bold text-[#18261E]">
              Historial de recetas consultadas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {historyRecipes.slice(0, 4).map((rec) => (
              <button
                key={rec.id}
                type="button"
                onClick={() => onSelectRecipe(rec)}
                className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F2] border border-[#E5E0D5] hover:border-[#1B4332] text-left transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
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

      {/* Profile Settings & Pantry */}
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-8">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-[#18261E]">
            Datos personales y preferencias
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Nombre para mostrar
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#18261E] mb-1.5">
                Fotografía de perfil (URL opcional)
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#18261E]">
              Tus preferencias culinarias
            </label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((pref) => {
                const active = preferences.includes(pref);
                return (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => togglePreference(pref)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#E8F3EB] border-[#1B4332] text-[#1B4332] font-semibold'
                        : 'bg-[#FAF8F2] border-[#E5E0D5] text-[#4A5D52]'
                    }`}
                  >
                    {active && <Check className="w-3.5 h-3.5" />}
                    <span>{pref}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Saved Pantry */}
        <div className="pt-6 border-t border-[#EFECE4] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-xl font-bold text-[#18261E]">
                Mi despensa habitual en casa
              </h2>
              <p className="text-xs text-[#52665A]">
                Mantén actualizados los ingredientes que sueles tener disponibles.
              </p>
            </div>
            {pantry.length > 0 && (
              <button
                type="button"
                onClick={() => onUsePantryForSearch(pantry)}
                className="px-4 py-2 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-lg hover:bg-[#D5EAD9] inline-flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                Buscar recetas con mi despensa
              </button>
            )}
          </div>

          <form onSubmit={handleAddPantry} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newPantryItem}
              onChange={(e) => setNewPantryItem(e.target.value)}
              placeholder="Agregar ingrediente a mi despensa..."
              className="flex-1 px-3.5 py-2 bg-[#FAF8F2] border border-[#D8D2C5] rounded-xl text-sm"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-xl hover:bg-[#2D6A4F] inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {pantry.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleRemovePantry(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F2] border border-[#D8D2C5] text-xs font-medium text-[#18261E] rounded-lg hover:border-[#7C4D25] cursor-pointer"
              >
                <span>{item}</span>
                <X className="w-3.5 h-3.5 text-[#52665A]" />
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[#EFECE4] flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className="text-xs font-medium text-[#52665A] hover:text-[#18261E] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ver pantalla de bienvenida
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-3 bg-[#1B4332] text-white text-sm font-semibold rounded-xl hover:bg-[#2D6A4F] transition-colors cursor-pointer"
          >
            {savedBanner ? 'Cambios guardados' : 'Guardar perfil'}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NotificationsViewProps {
  notifications: AppNotification[];
  prefs: NotificationPreferences;
  onMarkAllRead: () => void;
  onUpdatePrefs: (prefs: NotificationPreferences) => void;
  onOpenNotification: (notif: AppNotification) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  prefs,
  onMarkAllRead,
  onUpdatePrefs,
  onOpenNotification,
}) => {
  const togglePref = (key: keyof NotificationPreferences) => {
    onUpdatePrefs({
      ...prefs,
      [key]: !prefs[key],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-6">
        <div>
          <p className="text-sm font-medium text-[#2D6A4F] mb-1">
            Centro de avisos
          </p>
          <h1 className="font-display text-3xl font-bold text-[#18261E]">
            Notificaciones
          </h1>
        </div>
        <button
          type="button"
          onClick={onMarkAllRead}
          className="text-xs font-semibold text-[#1B4332] hover:underline cursor-pointer self-start sm:self-auto"
        >
          Marcar todas como leídas
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notif) => (
          <button
            key={notif.id}
            type="button"
            onClick={() => onOpenNotification(notif)}
            className={`w-full p-5 rounded-2xl border text-left transition-colors flex items-start justify-between gap-4 cursor-pointer ${
              notif.read
                ? 'bg-white border-[#E5E0D5]'
                : 'bg-[#E8F3EB]/50 border-[#1B4332]'
            }`}
          >
            <div className="space-y-1">
              <div className="text-xs font-semibold text-[#2D6A4F]">
                {notif.date} {!notif.read && '· Nueva'}
              </div>
              <h2 className="font-display text-base font-bold text-[#18261E]">
                {notif.title}
              </h2>
              <p className="text-sm text-[#4A5D52]">{notif.message}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Notification Preferences */}
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 space-y-4">
        <h2 className="font-display text-xl font-bold text-[#18261E]">
          Preferencias de notificaciones
        </h2>
        <p className="text-xs text-[#52665A]">
          Elige qué novedades deseas recibir en tu cuenta de CreciSano:
        </p>

        <div className="divide-y divide-[#EFECE4]">
          {(
            [
              { key: 'newRecipes', label: 'Nuevas recetas agregadas' },
              { key: 'newVideos', label: 'Nuevos videos tutoriales Premium' },
              { key: 'premiumCollections', label: 'Nuevas colecciones Premium' },
              {
                key: 'recommendedRecipes',
                label: 'Recetas recomendadas según tu despensa',
              },
              { key: 'crecisanoNews', label: 'Novedades de CreciSano' },
            ] as { key: keyof NotificationPreferences; label: string }[]
          ).map((item) => {
            const enabled = prefs[item.key];
            return (
              <div
                key={item.key}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <span className="text-sm font-medium text-[#18261E]">
                  {item.label}
                </span>
                <button
                  type="button"
                  onClick={() => togglePref(item.key)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    enabled
                      ? 'bg-[#1B4332] text-white'
                      : 'bg-[#FAF8F2] border border-[#D8D2C5] text-[#52665A]'
                  }`}
                >
                  {enabled ? 'Activado' : 'Desactivado'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
