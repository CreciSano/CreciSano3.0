import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Lock,
  Check,
  Sparkles,
  Clock,
  ChefHat,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  MembershipStatus,
  Recipe,
  RecipeCategory,
} from '../types';
import { PREMIUM_COLLECTIONS } from '../data/recipes';
import { RecipeImage } from './RecipeImage';
import { RecipeCard } from './RecipeCard';

interface PremiumViewProps {
  recipes: Recipe[];
  membershipStatus: MembershipStatus;
  favorites: string[];
  onToggleFavorite: (recipeId: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onGoToSubscription: () => void;
  onSelectCollectionCategory: (cat?: RecipeCategory) => void;
}

export const PremiumView: React.FC<PremiumViewProps> = ({
  recipes,
  membershipStatus,
  favorites,
  onToggleFavorite,
  onSelectRecipe,
  onGoToSubscription,
  onSelectCollectionCategory,
}) => {
  const hasPremium = membershipStatus === 'premium_active';
  const premiumRecipes = recipes.filter((r) => r.isPremium);
  const videoRecipes = premiumRecipes.filter((r) => Boolean(r.videoTutorial));
  const newlyAdded = recipes.filter((r) => r.isNew);

  const [activeVideoRecipe, setActiveVideoRecipe] = useState<Recipe>(
    () => videoRecipes[0] || premiumRecipes[0]
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeVideoRecipe?.id]);

  const handlePlayPause = () => {
    if (!hasPremium) {
      onGoToSubscription();
      return;
    }
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play();
      setIsPlaying(true);
    } else {
      vid.pause();
      setIsPlaying(false);
    }
  };

  const handleToggleMute = () => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  };

  const handleFullscreen = () => {
    if (!hasPremium) {
      onGoToSubscription();
      return;
    }
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.requestFullscreen) {
      vid.requestFullscreen();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-14">
      {/* Exclusive Premium Banner */}
      <section className="bg-[#1B4332] text-white rounded-2xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#A7D7B8]">
            <Sparkles className="w-4 h-4" />
            <span>CRECISANO PREMIUM</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight text-balance">
            Más recetas, más ideas y más formas de alimentar con amor
          </h1>
          <p className="text-base text-[#E8F3EB] leading-relaxed max-w-xl">
            Con CreciSano cocinas con lo que tienes. Con Premium descubres todo lo que puedes crear: biblioteca ampliada, colecciones especiales y videos tutoriales paso a paso.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {hasPremium ? (
              <span className="px-4 py-2.5 bg-[#2D6A4F] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-2">
                <Check className="w-4 h-4" />
                Membresía Premium Activa
              </span>
            ) : (
              <button
                type="button"
                onClick={onGoToSubscription}
                className="px-6 py-3.5 bg-white text-[#1B4332] text-sm font-bold rounded-xl hover:bg-[#FAF8F2] transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <span>
                  {membershipStatus === 'premium_expired'
                    ? 'Renovar CreciSano Premium'
                    : 'Suscribirme a Premium'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 aspect-[4/3] rounded-xl overflow-hidden border border-white/15">
          <RecipeImage
            src="/src/assets/images/recipe_salmon_greens_1793832464854.jpg"
            alt="Plato exclusivo de CreciSano Premium"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* B. Exclusive Video Tutorials Section */}
      {activeVideoRecipe && activeVideoRecipe.videoTutorial && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E0D5] pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F] mb-1">
                Biblioteca audiovisual
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18261E]">
                Videos tutoriales paso a paso
              </h2>
            </div>
            <span className="text-xs text-[#52665A] tabular-nums">
              {videoRecipes.length} video-recetas disponibles
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Real HTML5 Video Player + Controls */}
            <div className="lg:col-span-7 bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-[#18261E]">
                <video
                  ref={videoRef}
                  src={
                    hasPremium
                      ? activeVideoRecipe.videoTutorial.videoUrl
                      : undefined
                  }
                  poster={activeVideoRecipe.videoTutorial.posterUrl}
                  controls={hasPremium}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                />

                {!hasPremium && (
                  <div className="absolute inset-0 bg-[#18261E]/75 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                    <Lock className="w-8 h-8 text-[#A7D7B8]" />
                    <div className="space-y-1 max-w-md">
                      <h3 className="font-display text-xl font-bold">
                        Video tutorial exclusivo para suscriptoras Premium
                      </h3>
                      <p className="text-xs text-[#E8F3EB]">
                        {membershipStatus === 'premium_expired'
                          ? 'Tu membresía Premium ha vencido. Renuévala para volver a ver los videos paso a paso.'
                          : 'Suscríbete a CreciSano Premium para reproducir los videos tutoriales completos.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={onGoToSubscription}
                      className="px-5 py-2.5 bg-white text-[#1B4332] text-xs font-bold rounded-xl hover:bg-[#FAF8F2] cursor-pointer"
                    >
                      Ver planes de suscripción
                    </button>
                  </div>
                )}
              </div>

              {/* Custom Accessible Controls Bar */}
              <div className="p-4 bg-[#FAF8F2] border-t border-[#E5E0D5] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="px-4 py-2 bg-[#1B4332] text-white text-xs font-semibold rounded-lg hover:bg-[#2D6A4F] inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        Reproducir
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleToggleMute}
                    aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                    className="p-2 bg-white border border-[#D8D2C5] text-[#18261E] rounded-lg hover:border-[#1B4332] cursor-pointer"
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleFullscreen}
                    aria-label="Pantalla completa"
                    className="p-2 bg-white border border-[#D8D2C5] text-[#18261E] rounded-lg hover:border-[#1B4332] cursor-pointer"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-[#52665A] tabular-nums">
                  Duración: <strong>{activeVideoRecipe.videoTutorial.duration}</strong>
                </div>
              </div>

              {/* Video Details: Ingredients, Steps & Tips */}
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
                      PREMIUM · {activeVideoRecipe.categories[0]}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#18261E]">
                      {activeVideoRecipe.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectRecipe(activeVideoRecipe)}
                    className="px-4 py-2 bg-[#E8F3EB] text-[#1B4332] text-xs font-semibold rounded-lg hover:bg-[#D5EAD9] cursor-pointer"
                  >
                    Ver receta completa
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-[#EFECE4] text-xs">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#18261E]">
                      Ingredientes necesarios:
                    </h4>
                    <ul className="space-y-1 text-[#4A5D52]">
                      {activeVideoRecipe.ingredients.map((ing) => (
                        <li key={ing.name}>
                          • {ing.name} ({ing.amount})
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#18261E]">
                      Estructura del video tutorial:
                    </h4>
                    <ul className="space-y-1 text-[#4A5D52]">
                      {activeVideoRecipe.videoTutorial.chapters.map((ch) => (
                        <li key={ch}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {activeVideoRecipe.tips && activeVideoRecipe.tips.length > 0 && (
                  <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl p-3.5 text-xs text-[#18261E]">
                    <strong>Consejo de cocina:</strong>{' '}
                    {activeVideoRecipe.tips[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Video Playlist Selector */}
            <div className="lg:col-span-5 space-y-3">
              <h3 className="text-sm font-semibold text-[#18261E]">
                Selecciona un video tutorial:
              </h3>
              <div className="space-y-3">
                {videoRecipes.map((rec) => {
                  const isSelected = rec.id === activeVideoRecipe.id;
                  return (
                    <button
                      key={rec.id}
                      type="button"
                      onClick={() => setActiveVideoRecipe(rec)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3.5 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-[#E8F3EB] border-[#1B4332]'
                          : 'bg-white border-[#E5E0D5] hover:border-[#1B4332]'
                      }`}
                    >
                      <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-[#F3EFE6]">
                        <RecipeImage src={rec.image} alt={rec.title} />
                        <span className="absolute inset-0 bg-black/25 flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-current" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#18261E] line-clamp-2">
                          {rec.title}
                        </div>
                        <div className="text-xs text-[#52665A] mt-1 tabular-nums">
                          {rec.videoTutorial?.duration} · {rec.prepTimeMinutes} min
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* C. Special Premium Collections */}
      <section className="space-y-6">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#18261E]">
            Colecciones especiales Premium
          </h2>
          <p className="text-sm text-[#4A5D52] mt-1">
            Recopilaciones temáticas diseñadas para resolver toda tu semana
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PREMIUM_COLLECTIONS.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => onSelectCollectionCategory(col.categoryFilter)}
              className="group bg-white border border-[#E5E0D5] rounded-2xl overflow-hidden text-left hover:border-[#1B4332] transition-colors flex flex-col cursor-pointer"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#F3EFE6]">
                <RecipeImage
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="p-5 space-y-1.5">
                <div className="text-xs font-semibold text-[#2D6A4F] tabular-nums">
                  {col.recipeCountLabel}
                </div>
                <h3 className="font-display text-lg font-bold text-[#18261E]">
                  {col.title}
                </h3>
                <p className="text-xs text-[#4A5D52]">{col.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* E. Recién Agregado */}
      {newlyAdded.length > 0 && (
        <section className="space-y-6">
          <div className="border-b border-[#E5E0D5] pb-4">
            <h2 className="font-display text-2xl font-bold text-[#18261E]">
              Recién agregado
            </h2>
            <p className="text-sm text-[#4A5D52] mt-1">
              Últimas recetas y video-tutoriales incorporados a CreciSano
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newlyAdded.map((rec) => (
              <RecipeCard
                key={rec.id}
                recipe={rec}
                isFavorite={favorites.includes(rec.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelectRecipe}
                userHasPremium={hasPremium}
              />
            ))}
          </div>
        </section>
      )}

      {/* A. Full Premium Recipe Library */}
      <section className="space-y-6">
        <div className="border-b border-[#E5E0D5] pb-4">
          <h2 className="font-display text-2xl font-bold text-[#18261E]">
            Biblioteca exclusiva Premium
          </h2>
          <p className="text-sm text-[#4A5D52] mt-1">
            Preparaciones detalladas con consejos adicionales, alternativas y video tutorial
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {premiumRecipes.map((rec) => (
            <RecipeCard
              key={rec.id}
              recipe={rec}
              isFavorite={favorites.includes(rec.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectRecipe}
              userHasPremium={hasPremium}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

interface SubscriptionViewProps {
  membershipStatus: MembershipStatus;
  membershipExpiresAt?: string;
  isLoggedIn: boolean;
  onGoToAuth: () => void;
  onBack: () => void;
}

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  membershipStatus,
  membershipExpiresAt,
  isLoggedIn,
  onGoToAuth,
  onBack,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>(
    'monthly'
  );
  const [plans, setPlans] = useState([
    {
      id: 'monthly',
      name: 'Plan Mensual CreciSano Premium',
      price: 6.99,
      currency: 'USD',
      durationLabel: '1 mes · Renovación mensual',
    },
    {
      id: 'annual',
      name: 'Plan Anual CreciSano Premium',
      price: 59.99,
      currency: 'USD',
      durationLabel: '12 meses · Ahorra 28%',
    },
  ]);
  const [gatewayNotice, setGatewayNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/subscription/config')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.plans) setPlans(data.plans);
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      onGoToAuth();
      return;
    }
    setLoading(true);
    setGatewayNotice(null);
    try {
      const token = localStorage.getItem('crecisano_auth_token');
      const res = await fetch('/api/subscription/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ planId: selectedPlan }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setGatewayNotice(
          data.error ||
            'La pasarela de pagos está preparada para conectar con tu cuenta de Stripe.'
        );
      }
    } catch {
      setGatewayNotice('No se pudo conectar con el servidor de suscripciones.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-10 space-y-8">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2D6A4F]">
            CRECISANO PREMIUM
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#18261E]">
            ¡Descubre todo lo que puedes crear con CreciSano Premium!
          </h1>
          <p className="text-sm sm:text-base text-[#4A5D52]">
            Con CreciSano cocinas con lo que tienes. Con Premium descubres todo lo que puedes crear.
          </p>
        </div>

        {/* Current Membership Status Banner */}
        <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[#52665A]">Estado actual de tu cuenta: </span>
            <strong className="text-[#18261E]">
              {membershipStatus === 'premium_active'
                ? 'Membresía Premium Activa'
                : membershipStatus === 'premium_expired'
                ? 'Membresía Premium Vencida'
                : 'Versión Gratuita'}
            </strong>
          </div>
          {membershipExpiresAt && (
            <span className="text-[#52665A] tabular-nums">
              Fecha de vigencia:{' '}
              {new Date(membershipExpiresAt).toLocaleDateString('es-ES')}
            </span>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
          {[
            'Biblioteca ampliada de recetas exclusivas',
            'Videos tutoriales paso a paso en alta calidad',
            'Colecciones especiales para desayunos, almuerzos y loncheras',
            'Nuevas recetas y videos agregados periódicamente',
            'Preparaciones detalladas con consejos de cocina',
            'Alternativas de ingredientes e información nutricional completa',
          ].map((benefit) => (
            <div
              key={benefit}
              className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FAF8F2] border border-[#EFECE4]"
            >
              <Check className="w-4 h-4 text-[#1B4332] mt-0.5 shrink-0" />
              <span className="text-[#18261E] font-medium">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Configurable Plan Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => {
            const active = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() =>
                  setSelectedPlan(plan.id as 'monthly' | 'annual')
                }
                className={`p-5 rounded-2xl border-2 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-[#1B4332] bg-[#E8F3EB]/50'
                    : 'border-[#E5E0D5] bg-white hover:border-[#1B4332]'
                }`}
              >
                <div className="text-xs font-semibold text-[#2D6A4F]">
                  {plan.name}
                </div>
                <div className="font-display text-3xl font-bold text-[#18261E] mt-2 tabular-nums">
                  ${plan.price}{' '}
                  <span className="text-sm font-normal text-[#52665A]">
                    {plan.currency}
                  </span>
                </div>
                <div className="text-xs text-[#52665A] mt-1">
                  {plan.durationLabel}
                </div>
              </button>
            );
          })}
        </div>

        {gatewayNotice && (
          <div className="p-4 rounded-xl bg-[#FDF2EC] border border-[#E6B89C] flex items-start gap-3 text-xs text-[#7C4D25]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{gatewayNotice}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-[#4A5D52] hover:text-[#18261E] cursor-pointer"
          >
            Volver
          </button>

          {membershipStatus === 'premium_active' ? (
            <span className="px-6 py-3.5 bg-[#E8F3EB] text-[#1B4332] text-sm font-bold rounded-xl">
              Ya cuentas con CreciSano Premium activo
            </span>
          ) : (
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1B4332] text-white text-sm font-bold rounded-xl hover:bg-[#2D6A4F] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Conectando pasarela...' : 'Suscribirme ahora'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
