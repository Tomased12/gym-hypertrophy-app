import { 
  Flame, 
  Dumbbell, 
  Utensils, 
  Calendar, 
  TrendingUp, 
  Activity, 
  Award,
  AlertTriangle,
  RotateCcw,
  Heart,
  Footprints
} from 'lucide-react';
import type { UserId } from '../types';
import { ProfileSwitcher } from './ProfileSwitcher';

export type TabType = 'dashboard' | 'workout' | 'nutrition' | 'calendar' | 'progress';

interface NavbarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  dayNumber: number;
  consistencyRate: number;
  activeUserId: UserId;
  onSwitchUser: (userId: UserId) => void;
  onOpenCardioModal: () => void;
  onResetRequest: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  dayNumber,
  consistencyRate,
  activeUserId,
  onSwitchUser,
  onOpenCardioModal,
  onResetRequest
}) => {
  const isMiranda = activeUserId === 'miranda';

  const activeBgClass = isMiranda 
    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30';

  const activeColor = isMiranda ? 'text-emerald-400' : 'text-amber-400';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-dark-950/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo / Brand */}
          <div 
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl p-0.5 shadow-lg group-hover:scale-105 transition-transform ${
              isMiranda 
                ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-emerald-500/20'
                : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 shadow-amber-500/20'
            }`}>
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                {isMiranda ? (
                  <Heart className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                ) : (
                  <Dumbbell className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black tracking-wider text-lg sm:text-xl text-white">
                  {isMiranda ? 'FIT' : 'ARM'}<span className={isMiranda ? 'text-emerald-400' : 'text-amber-400'}>-60</span>
                </span>
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                  isMiranda 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isMiranda ? 'RECOMPOSICIÓN' : 'HIPERTROFIA'}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium hidden md:block">
                {isMiranda ? 'Déficit • Fuerza + Pasos • Cardiosaludable' : 'Ciclo Intensivo • Mancuernas + Silla + Colchoneta'}
              </p>
            </div>
          </div>

          {/* Profile Switcher */}
          <div className="shrink-0">
            <ProfileSwitcher 
              activeUserId={activeUserId} 
              onSwitchUser={onSwitchUser} 
            />
          </div>

          {/* Center Badges (Day & Consistency) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-850 border border-white/10 text-xs font-semibold text-slate-200">
              <Flame className={`w-4 h-4 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'} animate-pulse`} />
              <span>Día <strong className={`${isMiranda ? 'text-emerald-400' : 'text-amber-400'} text-sm`}>{dayNumber}</strong> de 60</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-dark-850 border border-white/10 text-xs font-semibold text-slate-200">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Consistencia: <strong className="text-emerald-400 text-sm">{consistencyRate}%</strong></span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'dashboard'
                  ? activeBgClass
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('workout')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'workout'
                  ? activeBgClass
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              Rutina Guiada
            </button>

            <button
              onClick={() => onSelectTab('nutrition')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'nutrition'
                  ? activeBgClass
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Utensils className="w-4 h-4" />
              Nutrición
            </button>

            <button
              onClick={() => onSelectTab('calendar')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'calendar'
                  ? activeBgClass
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              60 Días
            </button>

            <button
              onClick={() => onSelectTab('progress')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentTab === 'progress'
                  ? activeBgClass
                  : 'text-slate-300 hover:text-white hover:bg-dark-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Medidas
            </button>
          </nav>

          <div className="flex items-center gap-2">
            {/* Quick Cardio Warning / Goal Action Button */}
            <button
              onClick={onOpenCardioModal}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105 border ${
                isMiranda
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
              }`}
              title={isMiranda ? 'Meta de cardio saludable, tonificación y colesterol' : 'Registrar o consultar regla de cardio anti-catabolismo'}
            >
              {isMiranda ? (
                <Footprints className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400" />
              )}
              <span className="hidden sm:inline">{isMiranda ? 'Cardio & Pasos' : 'Regla Cardio'}</span>
            </button>

            {/* Discrete Reset Cycle Button */}
            <button
              onClick={onResetRequest}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-dark-850 hover:bg-red-500/15 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 text-xs font-semibold transition-all"
              title="Reiniciar ciclo de 60 días y vaciar datos"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Reiniciar Reto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-dark-950/95 backdrop-blur-lg border-t border-white/10 px-2 py-1">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
              currentTab === 'dashboard' ? activeColor : 'text-slate-400'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Inicio</span>
          </button>

          <button
            onClick={() => onSelectTab('workout')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
              currentTab === 'workout' ? activeColor : 'text-slate-400'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Rutina</span>
          </button>

          <button
            onClick={() => onSelectTab('nutrition')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
              currentTab === 'nutrition' ? activeColor : 'text-slate-400'
            }`}
          >
            <Utensils className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Comidas</span>
          </button>

          <button
            onClick={() => onSelectTab('calendar')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
              currentTab === 'calendar' ? activeColor : 'text-slate-400'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">60 Días</span>
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-lg transition-colors ${
              currentTab === 'progress' ? activeColor : 'text-slate-400'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-medium mt-1">Medidas</span>
          </button>
        </div>
      </div>
    </header>
  );
};
