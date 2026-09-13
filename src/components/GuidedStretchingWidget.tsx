import React, { useState, useEffect, useRef } from 'react';
import { 
  HeartHandshake, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { UserId } from '../types';
import { getStretchingRoutineForUser, type StretchGuideItem } from '../lib/stretchingPlan';
import { playBeep } from '../lib/sound';

interface GuidedStretchingWidgetProps {
  userId: UserId;
  isStretchingCompleted: boolean;
  onConfirmCompleted: () => void;
  highlightCard?: boolean;
}

export const GuidedStretchingWidget: React.FC<GuidedStretchingWidgetProps> = ({
  userId,
  isStretchingCompleted,
  onConfirmCompleted,
  highlightCard = false
}) => {
  const stretches: StretchGuideItem[] = getStretchingRoutineForUser(userId);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [activeSide, setActiveSide] = useState<'right' | 'left'>('right');
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});

  // Countdown timer state
  const currentStretch = stretches[activeIdx] || stretches[0];
  const [timeLeft, setTimeLeft] = useState<number>(currentStretch.durationSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Reset timer when changing stretch or side
  useEffect(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(currentStretch.durationSeconds);
  }, [activeIdx, activeSide, currentStretch.durationSeconds]);

  // Countdown logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            playBeep('success');

            // Automatically mark current stretch as completed
            setCompletedMap((m) => ({ ...m, [currentStretch.id]: true }));

            // If it has sides and was right, toggle to left
            if (currentStretch.hasSides && activeSide === 'right') {
              setActiveSide('left');
            }
            return 0;
          }
          if (prev <= 4) {
            playBeep('tick');
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, currentStretch.id, currentStretch.hasSides, activeSide]);

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(currentStretch.durationSeconds);
    }
    setIsRunning(!isRunning);
    playBeep('tick');
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(currentStretch.durationSeconds);
    playBeep('tick');
  };

  const handleToggleStretchCheck = (id: string) => {
    setCompletedMap((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
    playBeep('tick');
  };

  const completedCount = stretches.filter((s) => completedMap[s.id]).length;
  const allStretchesDone = completedCount === stretches.length;

  const handleFinalConfirm = () => {
    onConfirmCompleted();
    playBeep('success');
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff']
      });
    } catch {
      // ignore
    }
  };

  const progressPercent = Math.round((completedCount / stretches.length) * 100);
  const timerPercent = Math.round(((currentStretch.durationSeconds - timeLeft) / currentStretch.durationSeconds) * 100);

  return (
    <div
      id="guided-stretching-section"
      className={`rounded-3xl p-5 sm:p-7 transition-all duration-500 relative overflow-hidden border shadow-2xl ${
        isStretchingCompleted
          ? 'bg-gradient-to-br from-emerald-950/60 via-dark-900 to-teal-950/40 border-emerald-500/50 shadow-emerald-500/10'
          : highlightCard
          ? 'bg-gradient-to-br from-teal-950/70 via-dark-900 to-dark-950 border-teal-400 shadow-teal-500/20 ring-2 ring-teal-400/50 animate-pulse-subtle'
          : 'bg-gradient-to-br from-teal-950/40 via-dark-900 to-dark-950 border-white/10'
      }`}
    >
      {/* Background glow circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            isStretchingCompleted
              ? 'bg-emerald-500/25 border border-emerald-400 text-emerald-300'
              : 'bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-teal-500/20'
          }`}>
            <HeartHandshake className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-xs font-bold text-teal-300">
                <Clock className="w-3.5 h-3.5" /> Fase de Enfriamiento y Elongación (5-7 min)
              </span>
              {isStretchingCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400 text-[11px] font-extrabold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ¡Estiramientos Completados!
                </span>
              ) : highlightCard ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/25 border border-amber-400 text-[11px] font-extrabold text-amber-300 animate-bounce">
                  ⚡ ¡Desbloqueado tras última serie!
                </span>
              ) : null}
            </div>

            <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
              Recuperación y Estiramientos Guiados (Anti-Dolor)
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Adaptado exclusivamente a los grupos musculares trabajados en tu sesión para acelerar el drenaje de lactato, prevenir agujetas y mantener la flexibilidad articular.
            </p>
          </div>
        </div>

        {/* Progress pill */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between bg-dark-950/60 p-3 rounded-2xl border border-white/5 sm:border-0 sm:p-0">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Completados
            </span>
            <span className="text-xl font-heading font-black text-teal-300">
              {completedCount} <span className="text-xs text-slate-400 font-normal">/ {stretches.length}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-400 font-semibold mt-0.5">
            {progressPercent}% completado
          </div>
        </div>
      </div>

      {/* Progress Bar of Stretches Completed */}
      <div className="mt-4 relative z-10">
        <div className="w-full h-2.5 rounded-full bg-dark-950 border border-white/10 overflow-hidden p-0.5 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isStretchingCompleted || allStretchesDone
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-md shadow-emerald-500/40'
                : 'bg-gradient-to-r from-teal-500 to-cyan-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stretch Selector Tabs */}
      <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 relative z-10">
        {stretches.map((stretch, sIdx) => {
          const isDone = !!completedMap[stretch.id];
          const isSelected = activeIdx === sIdx;
          return (
            <button
              key={stretch.id}
              onClick={() => {
                setActiveIdx(sIdx);
                setActiveSide('right');
                playBeep('tick');
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-teal-500 text-black border-teal-400 shadow-md shadow-teal-500/25'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                  : 'bg-dark-900 text-slate-300 border-white/10 hover:bg-dark-850 hover:text-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                isSelected ? 'bg-black text-teal-300 font-black' : isDone ? 'bg-emerald-400 text-black' : 'bg-dark-800 text-slate-400'
              }`}>
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : sIdx + 1}
              </div>
              <span>{stretch.muscleName.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stretch Detailed Card with Countdown Timer */}
      <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-dark-950/80 border border-white/10 relative z-10 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-teal-500/15 text-teal-300 font-bold border border-teal-500/30">
                Equipo: {currentStretch.equipment}
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30">
                ⏱️ Duración: 25 a 30s {currentStretch.sideLabel || ''}
              </span>
            </div>
            <h4 className="font-heading font-black text-xl text-white">
              {currentStretch.muscleName}
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              🎯 <strong>Objetivo fisiológico:</strong> {currentStretch.targetRole}
            </p>
          </div>

          {/* Interactive Countdown Timer */}
          <div className="flex items-center gap-4 bg-dark-900/90 p-3.5 rounded-2xl border border-teal-500/30 self-start lg:self-center shadow-lg">
            {/* Side selector if applicable */}
            {currentStretch.hasSides && (
              <div className="flex flex-col gap-1 pr-2 border-r border-white/10 text-center">
                <span className="text-[9px] uppercase font-bold text-slate-400">Lado</span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSide('right');
                      setTimeLeft(currentStretch.durationSeconds);
                      setIsRunning(false);
                      playBeep('tick');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      activeSide === 'right'
                        ? 'bg-teal-400 text-black'
                        : 'bg-dark-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Der.
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveSide('left');
                      setTimeLeft(currentStretch.durationSeconds);
                      setIsRunning(false);
                      playBeep('tick');
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                      activeSide === 'left'
                        ? 'bg-teal-400 text-black'
                        : 'bg-dark-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Izq.
                  </button>
                </div>
              </div>
            )}

            {/* Circular Digital Display */}
            <div className="flex items-baseline gap-1">
              <span className={`font-heading font-black text-3xl sm:text-4xl tracking-tight transition-colors ${
                timeLeft === 0 ? 'text-emerald-400 animate-pulse' : isRunning ? 'text-teal-300' : 'text-white'
              }`}>
                {timeLeft}s
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">
                / {currentStretch.durationSeconds}s
              </span>
            </div>

            {/* Play/Pause & Reset Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleStartPause}
                className={`p-2.5 rounded-xl font-bold transition-all shadow-md flex items-center justify-center ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                    : 'bg-teal-500 hover:bg-teal-400 text-black shadow-teal-500/20'
                }`}
                title={isRunning ? 'Pausar cronómetro' : 'Iniciar cuenta regresiva'}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white border border-white/5 transition-all"
                title="Reiniciar cronómetro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-step Instructions using only colchoneta/silla */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-300 block mb-2">
            📋 Instrucciones Paso a Paso (Sin Equipamiento Complejo):
          </span>
          <div className="space-y-2">
            {currentStretch.instructions.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-dark-900/60 border border-white/5 text-xs text-slate-200">
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sensación Correcta Highlighted Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-dark-900 to-teal-950/40 border border-emerald-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-emerald-300 block mb-0.5 uppercase tracking-wide text-[11px]">
              Sensación Correcta Guiada:
            </span>
            <p className="text-slate-200 font-medium">
              "{currentStretch.correctSensation}"
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              💡 {currentStretch.biomechanicTip}
            </p>
          </div>
        </div>

        {/* Mark this stretch checked & Next/Prev navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleToggleStretchCheck(currentStretch.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              completedMap[currentStretch.id]
                ? 'bg-emerald-500 text-black border-emerald-400 hover:bg-emerald-400'
                : 'bg-dark-850 hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border-white/10 hover:border-teal-500/40'
            }`}
          >
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              completedMap[currentStretch.id] ? 'bg-black text-emerald-400' : 'border border-slate-500 bg-dark-900'
            }`}>
              {completedMap[currentStretch.id] && <Check className="w-3 h-3 stroke-[3]" />}
            </div>
            <span>{completedMap[currentStretch.id] ? 'Estiramiento Listo ✓' : 'Marcar como Completado'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeIdx === 0}
              className="p-2 rounded-xl bg-dark-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Estiramiento anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {activeIdx + 1} de {stretches.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveIdx((prev) => Math.min(stretches.length - 1, prev + 1))}
              disabled={activeIdx === stretches.length - 1}
              className="p-2 rounded-xl bg-dark-900 border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Siguiente estiramiento"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Checklist de Cierre: Botón Obligatorio de Confirmación */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <span className="text-xs font-bold text-white block">
            Paso Final de la Sesión:
          </span>
          <p className="text-xs text-slate-300 mt-0.5">
            {isStretchingCompleted 
              ? 'Has completado la elongación anti-dolor. Tu rutina diaria está confirmada.' 
              : 'Confirma los estiramientos para desbloquear y validar el check de rutina diaria en tu matriz de hábitos.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleFinalConfirm}
          className={`px-6 py-3.5 rounded-2xl font-heading font-black text-sm transition-all flex items-center justify-center gap-2.5 shadow-xl shrink-0 ${
            isStretchingCompleted
              ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/30'
              : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-green-500 hover:brightness-110 text-black shadow-emerald-500/25 hover:scale-[1.02]'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-black" />
          <span>{isStretchingCompleted ? 'Estiramiento completado ✓' : 'Estiramiento completado'}</span>
        </button>
      </div>
    </div>
  );
};
