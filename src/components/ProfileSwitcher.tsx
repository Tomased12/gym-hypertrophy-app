import { Dumbbell, Heart, User, Check } from 'lucide-react';
import type { UserId } from '../types';

interface ProfileSwitcherProps {
  activeUserId: UserId;
  onSwitchUser: (userId: UserId) => void;
}

export const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({
  activeUserId,
  onSwitchUser,
}) => {
  return (
    <div className="flex items-center bg-dark-900 border border-white/10 p-1 rounded-2xl shadow-inner">
      {/* Tomás Tab Button */}
      <button
        type="button"
        onClick={() => onSwitchUser('tomas')}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          activeUserId === 'tomas'
            ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-extrabold shadow-md shadow-amber-500/25 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
        }`}
        title="Cambiar a perfil de Tomás: Hipertrofia de Brazos (Superávit)"
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          activeUserId === 'tomas' ? 'bg-black/20 text-black' : 'bg-dark-800 text-amber-400'
        }`}>
          <Dumbbell className="w-3 h-3" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span>Tomás</span>
            {activeUserId === 'tomas' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className={`text-[9px] block leading-none font-medium ${
            activeUserId === 'tomas' ? 'text-black/80' : 'text-slate-500'
          }`}>
            Hipertrofia
          </span>
        </div>
      </button>

      {/* Divider */}
      <div className="w-[1px] h-6 bg-white/10 mx-0.5" />

      {/* Miranda Tab Button */}
      <button
        type="button"
        onClick={() => onSwitchUser('miranda')}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
          activeUserId === 'miranda'
            ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold shadow-md shadow-emerald-500/25 scale-[1.02]'
            : 'text-slate-400 hover:text-slate-200 hover:bg-dark-800'
        }`}
        title="Cambiar a perfil de Miranda: Déficit & Recomposición (Sin Palta / Cardiosaludable)"
      >
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
          activeUserId === 'miranda' ? 'bg-black/20 text-black' : 'bg-dark-800 text-emerald-400'
        }`}>
          <Heart className="w-3 h-3" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1">
            <span>Miranda</span>
            {activeUserId === 'miranda' && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span className={`text-[9px] block leading-none font-medium ${
            activeUserId === 'miranda' ? 'text-black/80' : 'text-slate-500'
          }`}>
            Recomposición
          </span>
        </div>
      </button>
    </div>
  );
};
