import { useState, useEffect } from 'react';
import { 
  Footprints, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  Smartphone, 
  Heart,
  Check,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playBeep } from '../lib/sound';

interface StepCounterWidgetProps {
  currentSteps: number;
  targetSteps?: number;
  onUpdateSteps: (newSteps: number) => void;
}

export const StepCounterWidget: React.FC<StepCounterWidgetProps> = ({
  currentSteps = 0,
  targetSteps = 8000,
  onUpdateSteps,
}) => {
  const [inputValue, setInputValue] = useState(currentSteps > 0 ? currentSteps.toString() : '');
  const [justSaved, setJustSaved] = useState(false);

  // Sync internal input when currentSteps changes externally
  useEffect(() => {
    setInputValue(currentSteps > 0 ? currentSteps.toString() : '');
  }, [currentSteps]);

  const progress = Math.min(100, Math.round((currentSteps / targetSteps) * 100));
  const isGoalReached = currentSteps >= targetSteps;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }
  };

  const handleApplySteps = (steps: number) => {
    const validSteps = Math.max(0, steps);
    onUpdateSteps(validSteps);
    setInputValue(validSteps > 0 ? validSteps.toString() : '');
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);

    if (validSteps >= targetSteps && !isGoalReached) {
      playBeep('success');
      triggerCelebration();
    } else {
      playBeep('tick');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      handleApplySteps(parsed);
    }
  };

  const handleQuickAdd = (amount: number) => {
    handleApplySteps(currentSteps + amount);
  };

  const handleToggleCompleted = () => {
    if (isGoalReached) {
      handleApplySteps(0);
    } else {
      handleApplySteps(targetSteps);
    }
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 transition-all duration-500 relative overflow-hidden shadow-xl border ${
      isGoalReached
        ? 'bg-gradient-to-br from-emerald-950/60 via-dark-900 to-emerald-950/40 border-emerald-500/50 shadow-emerald-500/10'
        : 'bg-gradient-to-br from-emerald-950/30 via-dark-900 to-dark-950 border-white/10'
    }`}>
      {/* Background glow circle */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all ${
        isGoalReached ? 'bg-emerald-500/20' : 'bg-emerald-500/10'
      }`} />

      {/* Header: Title & Meta Visual */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all ${
            isGoalReached
              ? 'bg-emerald-500/30 border border-emerald-400 text-emerald-300 shadow-emerald-500/30'
              : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-emerald-500/20'
          }`}>
            <Footprints className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            {/* Tag / Subtitle */}
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-300">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
                Widget NEAT (Apple Health Sync / Manual)
              </span>
              {isGoalReached && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400 text-[10px] font-extrabold text-emerald-300 animate-in fade-in">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> ¡Meta Superada!
                </span>
              )}
            </div>

            {/* Main Title */}
            <h3 className="font-heading font-black text-lg text-white">
              Pasos Diarios (Actividad Involuntaria / NEAT)
            </h3>

            {/* Meta Visual info */}
            <p className="text-xs text-slate-300 mt-0.5">
              Meta visual: <strong className="text-emerald-400 font-bold">8.000 pasos</strong> al día
            </p>
          </div>
        </div>

        {/* Counter Display & Progress Ratio */}
        <div className="text-right flex sm:flex-col items-baseline sm:items-end justify-between bg-dark-950/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl border border-white/5 sm:border-0">
          <div className="flex items-baseline gap-1.5">
            <span className={`font-heading font-black text-3xl sm:text-4xl tracking-tight transition-colors ${
              isGoalReached ? 'text-emerald-400' : 'text-slate-100'
            }`}>
              {currentSteps.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              / 8.000
            </span>
          </div>
          <span className={`text-[11px] font-semibold ${
            isGoalReached ? 'text-emerald-400' : 'text-slate-400'
          }`}>
            {progress}% de la meta
          </span>
        </div>
      </div>

      {/* Progress Bar (changes to vibrant green when >= 8000) */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-3.5 rounded-full bg-dark-950 border border-white/10 overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGoalReached
                ? 'bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 shadow-md shadow-emerald-500/50 animate-pulse'
                : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick Numeric Input Field: "Ingresar pasos de hoy (consulta la app Salud de tu iPhone)" */}
      <div className="mt-5 pt-4 border-t border-white/10 relative z-10 space-y-3">
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ingresar pasos de hoy (consulta la app Salud de tu iPhone):</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                min="0"
                step="1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ej. 8450 (según Apple Health)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-400 pointer-events-none font-medium">
                pasos
              </span>
            </div>
            <button
              type="submit"
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-md ${
                justSaved
                  ? 'bg-emerald-500 text-black'
                  : 'bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black border border-emerald-500/40 hover:border-emerald-500'
              }`}
            >
              {justSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <span>Guardar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Increment Buttons (+500, +1.000, +2.000, and 8.000 toggle) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">
              Incrementos rápidos:
            </span>
            <button
              type="button"
              onClick={() => handleQuickAdd(500)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 text-emerald-400" /> 500
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(1000)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 text-emerald-400" /> 1.000
            </button>
            <button
              type="button"
              onClick={() => handleQuickAdd(2000)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 text-emerald-400" /> 2.000
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleCompleted}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
              isGoalReached
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-dark-850 hover:bg-emerald-500/10 text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded flex items-center justify-center ${
              isGoalReached ? 'bg-emerald-400 text-black' : 'border border-slate-500 bg-dark-900'
            }`}>
              {isGoalReached && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{isGoalReached ? '8.000 pasos ✓' : 'Fijar 8.000'}</span>
          </button>
        </div>

        {/* Mensaje Pedagógico debajo del input */}
        <div className="p-3 rounded-2xl bg-dark-950/60 border border-white/5 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            <Sparkles className="w-3 h-3" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            "No necesitas salir a correr: llevar el iPhone en el bolsillo mientras limpias, caminas por la casa o haces recados ya suma a tu quema de grasa pasiva".
          </p>
        </div>
      </div>
    </div>
  );
};
