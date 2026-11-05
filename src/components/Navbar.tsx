import React from 'react';
import { Home, BookOpen, Search, Calendar, User } from 'lucide-react';
import { AppScreen, UserProfile } from '../types';
import { Logo } from './Logo';

interface NavbarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  user: UserProfile | null;
}

const DESKTOP_NAV_ITEMS: { label: string; screen: AppScreen }[] = [
  { label: 'Inicio', screen: 'home' },
  { label: 'Recetas', screen: 'categories' },
  { label: 'Buscar', screen: 'search' },
  { label: 'Mi menú', screen: 'planner' },
  { label: 'Premium', screen: 'premium' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  user,
}) => {
  return (
    <>
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF8F2]/95 backdrop-blur-sm border-b border-[#E5E0D5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4332] rounded-md"
          >
            <Logo />
          </button>

          {/* Zone 2: 5 concise single-line text links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A5D52]"
          >
            {DESKTOP_NAV_ITEMS.map((item) => {
              const isActive =
                currentScreen === item.screen ||
                (item.screen === 'search' && currentScreen === 'results') ||
                (item.screen === 'premium' && currentScreen === 'subscription');
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  className={`whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                    isActive
                      ? 'border-[#1B4332] text-[#1B4332] font-semibold'
                      : 'border-transparent hover:text-[#18261E]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate(user ? 'profile' : 'auth')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#1B4332] rounded-lg hover:bg-[#2D6A4F] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {user ? 'Mi cuenta' : 'Iniciar sesión'}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar (5 required items: Inicio, Recetas, Buscar, Mi menú, Mi cuenta) */}
      <nav
        aria-label="Navegación móvil inferior"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E5E0D5] h-16 grid grid-cols-5"
      >
        {[
          { label: 'Inicio', screen: 'home' as AppScreen, Icon: Home },
          { label: 'Recetas', screen: 'categories' as AppScreen, Icon: BookOpen },
          { label: 'Buscar', screen: 'search' as AppScreen, Icon: Search },
          { label: 'Mi menú', screen: 'planner' as AppScreen, Icon: Calendar },
          {
            label: 'Mi cuenta',
            screen: (user ? 'profile' : 'auth') as AppScreen,
            Icon: User,
          },
        ].map(({ label, screen, Icon }) => {
          const active =
            currentScreen === screen ||
            (screen === 'search' && currentScreen === 'results') ||
            (screen === 'profile' &&
              (currentScreen === 'favorites' ||
                currentScreen === 'notifications' ||
                currentScreen === 'auth'));
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(screen)}
              className={`flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                active
                  ? 'text-[#1B4332] font-semibold'
                  : 'text-[#52665A] hover:text-[#18261E]'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate max-w-full px-1">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
