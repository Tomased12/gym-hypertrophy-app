import { useState } from 'react';
import { Footprints, Plus, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { playBeep } from '../lib/sound';

interface StepCounterWidgetProps {
  currentSteps: number;
  targetSteps?: number;
  onUpdateSteps: (newSteps: number) => void;
}

export const StepCounterWidget: React.FC<StepCounterWidgetProps> = ({
  currentSteps = 0,
  targetSteps = 7000,
  onUpdateSteps,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customVal, setCustomVal] = useState(currentSteps.toString());

  const progress = Math.min(100, Math.round((currentSteps / targetSteps) * 100));
  const isGoalReached = currentSteps >= targetSteps;

  const handleAdd = (amount: number) => {
    const next = Math.max(0, currentSteps + amount);
    onUpdateSteps(next);
    setCustomVal(next.toString());
    playBeep('tick');
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(customVal, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdateSteps(parsed);
      setIsEditing(false);
      playBeep('success');
    }
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-emerald-950/40 via-dark-900 to-dark-950 border border-emerald-500/30 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
            <Footprints className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg text-white">
                Contador de Pasos Diarios (NEAT)
              </h3>
              {isGoalReached && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> ¡Meta Cumplida!
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Caminar entre <strong className="text-emerald-300">6.000 y 8.000 pasos</strong> activa la lipólisis, mejora el perfil lipídico (reduce colesterol LDL) y cuida las articulaciones sin impacto.
            </p>
          </div>
        </div>

        {/* Counter Display */}
        <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between">
          {!isEditing ? (
            <div 
              onClick={() => setIsEditing(true)}
              className="cursor-pointer group flex items-baseline gap-1.5"
              title="Haz clic para ingresar valor manual"
            >
              <span className="font-heading font-black text-3xl sm:text-4xl text-emerald-400 tracking-tight group-hover:underline">
                {currentSteps.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                / {targetSteps.toLocaleString()}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSaveCustom} className="flex items-center gap-1">
              <input
                type="number"
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                className="w-24 px-2 py-1 text-sm font-bold bg-dark-800 border border-emerald-500/40 rounded-lg text-white text-right focus:outline-none focus:ring-1 focus:ring-emerald-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg transition-colors"
              >
                OK
              </button>
            </form>
          )}
          <span className="text-[11px] text-slate-400 font-medium">
            {progress}% de la meta diaria
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3 rounded-full bg-dark-800 border border-white/5 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500 shadow-sm shadow-emerald-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 relative z-10">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Suma rápida de caminata:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAdd(500)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold transition-all"
          >
            <Plus className="w-3 h-3 text-emerald-400" /> 500
          </button>
          <button
            type="button"
            onClick={() => handleAdd(1000)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold transition-all"
          >
            <Plus className="w-3 h-3 text-emerald-400" /> 1.000
          </button>
          <button
            type="button"
            onClick={() => handleAdd(2000)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 text-xs font-semibold transition-all"
          >
            <Plus className="w-3 h-3 text-emerald-400" /> 2.000
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-400 text-xs font-semibold transition-all"
          >
            {isEditing ? 'Cerrar' : 'Manual'}
          </button>
        </div>
      </div>
    </div>
  );
};
