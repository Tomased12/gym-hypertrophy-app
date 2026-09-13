import { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Plus, X, Volume2, VolumeX } from 'lucide-react';
import { playBeep } from '../lib/sound';

interface RestTimerProps {
  initialSeconds?: number;
  isOpen: boolean;
  onClose: () => void;
  exerciseName?: string;
}

export const RestTimerModal: React.FC<RestTimerProps> = ({
  initialSeconds = 75,
  isOpen,
  onClose,
  exerciseName = 'Descanso entre series'
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<number | null>(null);

  // Sync when initialSeconds changes
  useEffect(() => {
    setTotalSeconds(initialSeconds);
    setTimeLeft(initialSeconds);
    setIsActive(true);
  }, [initialSeconds]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (soundEnabled) playBeep('rest_complete');
            setIsActive(false);
            return 0;
          }
          if (prev <= 4 && soundEnabled) {
            playBeep('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, soundEnabled]);

  if (!isOpen) return null;

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const setPreset = (sec: number) => {
    setTotalSeconds(sec);
    setTimeLeft(sec);
    setIsActive(true);
  };

  const addTime = (sec: number) => {
    setTimeLeft(prev => prev + sec);
    setTotalSeconds(prev => Math.max(prev, timeLeft + sec));
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="w-80 sm:w-88 rounded-2xl bg-dark-900/95 border border-amber-500/40 shadow-2xl shadow-black/80 backdrop-blur-xl p-4 overflow-hidden relative">
        {/* Glowing top line */}
        <div 
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 truncate max-w-[170px]">
              {exerciseName}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
              title={soundEnabled ? 'Sonido activado' : 'Sonido desactivado'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timer Display */}
        <div className="my-4 text-center">
          <div className="relative inline-flex items-center justify-center">
            <span className={`font-mono text-5xl font-black tracking-tight ${
              timeLeft === 0 ? 'text-emerald-400 animate-bounce' : timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
              {timeLeft === 0 ? '¡A DARLE!' : formattedTime}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {timeLeft === 0 ? 'Descanso finalizado. Comienza la siguiente serie.' : 'Recuperación neuromuscular para máxima hipertrofia'}
          </p>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <button
            onClick={() => setPreset(60)}
            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              totalSeconds === 60 ? 'bg-amber-500 text-black border-amber-400 font-bold' : 'bg-dark-800 border-white/5 text-slate-300 hover:bg-dark-700'
            }`}
          >
            60s
          </button>
          <button
            onClick={() => setPreset(75)}
            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              totalSeconds === 75 ? 'bg-amber-500 text-black border-amber-400 font-bold' : 'bg-dark-800 border-white/5 text-slate-300 hover:bg-dark-700'
            }`}
          >
            75s
          </button>
          <button
            onClick={() => setPreset(90)}
            className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              totalSeconds === 90 ? 'bg-amber-500 text-black border-amber-400 font-bold' : 'bg-dark-800 border-white/5 text-slate-300 hover:bg-dark-700'
            }`}
          >
            90s
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all ${
              isActive 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
            }`}
          >
            {isActive ? <><Pause className="w-4 h-4" /> Pausar</> : <><Play className="w-4 h-4" /> Reanudar</>}
          </button>

          <button
            onClick={() => addTime(15)}
            className="py-2 px-3 rounded-xl bg-dark-800 border border-white/10 hover:bg-dark-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
            title="Añadir 15 segundos"
          >
            <Plus className="w-3.5 h-3.5" /> 15s
          </button>

          <button
            onClick={() => {
              setTimeLeft(totalSeconds);
              setIsActive(true);
            }}
            className="p-2 rounded-xl bg-dark-800 border border-white/10 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors"
            title="Reiniciar descanso"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
