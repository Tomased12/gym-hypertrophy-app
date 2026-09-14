import { useState } from 'react';
import { 
  Dumbbell, 
  CheckCircle2, 
  Circle, 
  Info, 
  Play, 
  ChevronRight, 
  ChevronLeft, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Coffee, 
  Sparkles, 
  Video, 
  Heart, 
  HeartHandshake,
  BatteryCharging,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DayRoutine, UserId, BioReadinessCheck } from '../types';
import { getRoutineForUser } from '../lib/workoutPlan';
import { playBeep } from '../lib/sound';
import { ExerciseVisualViewer } from './ExerciseVisualViewer';
import { GuidedStretchingWidget } from './GuidedStretchingWidget';
import { BioReadinessModal } from './BioReadinessModal';

interface WorkoutTabProps {
  userId?: UserId;
  currentCycleDay: number;
  isWorkoutCompletedToday: boolean;
  isStretchingCompletedToday?: boolean;
  onToggleWorkoutCompleted: (completed: boolean) => void;
  onToggleStretchingCompleted?: (completed: boolean) => void;
  onStartRestTimer: (seconds: number, exerciseName: string) => void;
  readinessCheck?: BioReadinessCheck;
  onSaveReadiness?: (check: BioReadinessCheck) => void;
  dateStr?: string;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  userId = 'tomas',
  currentCycleDay,
  isWorkoutCompletedToday,
  isStretchingCompletedToday = false,
  onToggleWorkoutCompleted,
  onToggleStretchingCompleted,
  onStartRestTimer,
  readinessCheck,
  onSaveReadiness,
  dateStr = new Date().toISOString().split('T')[0]
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(currentCycleDay);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean[]>>({});
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);
  const [highlightCooldown, setHighlightCooldown] = useState(false);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState<boolean>(false);

  const isMiranda = userId === 'miranda';
  const routine: DayRoutine = getRoutineForUser(userId, selectedDay);
  const isSelectedDayToday = selectedDay === currentCycleDay;

  // Toggle set checkbox
  const handleToggleSet = (exerciseId: string, setIndex: number, totalSets: number, restSec: number, exName: string) => {
    const current = completedSets[exerciseId] || new Array(totalSets).fill(false);
    const updated = [...current];
    updated[setIndex] = !updated[setIndex];

    setCompletedSets(prev => ({
      ...prev,
      [exerciseId]: updated
    }));

    // If marked as completed, play subtle beep and automatically trigger the rest timer
    if (updated[setIndex]) {
      playBeep('tick');
      onStartRestTimer(restSec, exName);

      // Check if this was the last set of the last exercise
      const exercises = routine.exercises || [];
      const lastEx = exercises[exercises.length - 1];
      const isLastEx = lastEx && lastEx.id === exerciseId;
      const isLastSet = setIndex === totalSets - 1;

      if (isLastEx && isLastSet) {
        setHighlightCooldown(true);
        setTimeout(() => {
          const el = document.getElementById('guided-stretching-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    }
  };

  const handleConfirmStretching = () => {
    if (onToggleStretchingCompleted) {
      onToggleStretchingCompleted(true);
    }
    if (!isWorkoutCompletedToday) {
      onToggleWorkoutCompleted(true);
    }
  };

  const handleFinishRoutine = () => {
    if (!routine.isRestDay && !isStretchingCompletedToday) {
      setHighlightCooldown(true);
      const el = document.getElementById('guided-stretching-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      playBeep('tick');
      return;
    }

    onToggleWorkoutCompleted(!isWorkoutCompletedToday);
    if (!isWorkoutCompletedToday) {
      playBeep('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#3b82f6', '#ffffff']
      });
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Top Day Switcher Bar */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
        <button
          onClick={() => setSelectedDay(prev => Math.max(1, prev - 1))}
          disabled={selectedDay <= 1}
          className="p-2 rounded-xl bg-dark-900 border border-white/5 hover:bg-dark-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-slate-300" />
        </button>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {isSelectedDayToday ? 'HOY EN EL CICLO' : 'VISTA DE PLAN'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              Semana {Math.ceil(selectedDay / 7)}
            </span>
          </div>
          <h2 className="font-heading font-black text-xl text-white mt-0.5">
            Día {selectedDay} de 60
          </h2>
        </div>

        <button
          onClick={() => setSelectedDay(prev => Math.min(60, prev + 1))}
          disabled={selectedDay >= 60}
          className="p-2 rounded-xl bg-dark-900 border border-white/5 hover:bg-dark-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-slate-300" />
        </button>
      </div>

      {/* Routine Banner: Training vs Rest */}
      {routine.isRestDay ? (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-dark-900 via-dark-850 to-blue-950/40 border border-blue-500/30 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Día de Descanso & Supercompensación
              </div>
              <h3 className="font-heading font-black text-2xl text-white">
                {routine.title}
              </h3>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {routine.recoveryNote}
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-dark-950/60 border border-white/5 text-xs text-slate-300">
                  <strong className="text-white block mb-1">💡 Prioridad Nutricional:</strong>
                  Mantener el superávit calórico y alcanzar los 2g de proteína/kg. El músculo se reconstruye en el reposo.
                </div>
                <div className="p-3 rounded-xl bg-dark-950/60 border border-white/5 text-xs text-slate-300">
                  <strong className="text-white block mb-1">💧 Hidratación & Sueño:</strong>
                  Bebe 2.5 a 3L de agua y duerme al menos 8 horas para optimizar el pico de hormona de crecimiento.
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={`rounded-2xl p-6 relative overflow-hidden ${
          isMiranda 
            ? 'bg-gradient-to-br from-emerald-500/15 via-dark-850 to-dark-900 border border-emerald-500/40'
            : 'bg-gradient-to-br from-amber-500/15 via-dark-850 to-dark-900 border border-amber-500/40'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mb-2 ${
                isMiranda 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {isMiranda ? (
                  <>
                    <Heart className="w-3.5 h-3.5 animate-pulse" /> Sesión de Tonificación & Firmeza
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 animate-pulse" /> Sesión de Hipertrofia Intensiva
                  </>
                )}
              </div>
              <h3 className="font-heading font-black text-2xl text-white">
                {routine.title}
              </h3>
              <p className={`text-xs font-medium mt-1 ${isMiranda ? 'text-emerald-200/80' : 'text-amber-200/80'}`}>
                {routine.tagline}
              </p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {routine.focusMuscles.map((muscle, idx) => (
                  <span key={idx} className="text-[11px] px-2.5 py-1 rounded-lg bg-dark-950/80 text-slate-200 border border-white/10 font-semibold">
                    🎯 {muscle}
                  </span>
                ))}
                <span className={`text-[11px] px-2.5 py-1 rounded-lg bg-dark-950/80 font-semibold flex items-center gap-1 border ${
                  isMiranda ? 'text-emerald-400 border-emerald-500/20' : 'text-amber-400 border-amber-500/20'
                }`}>
                  <Clock className="w-3.5 h-3.5" /> ~{routine.estimatedMinutes} min
                </span>
              </div>
            </div>

            {/* Complete routine button for today */}
            {isSelectedDayToday && (
              <button
                onClick={handleFinishRoutine}
                className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isWorkoutCompletedToday
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                    : !routine.isRestDay && !isStretchingCompletedToday
                      ? 'bg-dark-900/90 text-amber-300 border border-amber-500/40 hover:bg-dark-850 shadow-md'
                      : isMiranda
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black shadow-emerald-500/20 hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/20 hover:scale-[1.02]'
                }`}
              >
                {isWorkoutCompletedToday ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    ¡Rutina de Hoy Completada!
                  </>
                ) : !routine.isRestDay && !isStretchingCompletedToday ? (
                  <>
                    <HeartHandshake className="w-5 h-5 text-amber-400 animate-pulse" />
                    Falta Elongación Anti-Dolor
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-black" />
                    Marcar Rutina Completada
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exercises List (Only on training days) */}
      {!routine.isRestDay && (
        <div className="space-y-4">
          {/* Bio-Readiness Auto-Calibration Card */}
          <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
            readinessCheck?.status === 'critico'
              ? 'bg-gradient-to-r from-red-950/60 via-dark-900 to-red-900/20 border-red-500/50 shadow-xl shadow-red-500/10'
              : readinessCheck?.status === 'moderado'
                ? 'bg-gradient-to-r from-amber-950/40 via-dark-900 to-amber-900/20 border-amber-500/40 shadow-xl shadow-amber-500/10'
                : readinessCheck?.status === 'optimo'
                  ? 'bg-gradient-to-r from-emerald-950/40 via-dark-900 to-teal-900/20 border-emerald-500/40 shadow-xl shadow-emerald-500/10'
                  : 'bg-dark-900/90 border-white/10 shadow-lg'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 font-black shadow-lg ${
                  readinessCheck?.status === 'critico'
                    ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                    : readinessCheck?.status === 'moderado'
                      ? 'bg-amber-500 text-black shadow-amber-500/30'
                      : readinessCheck?.status === 'optimo'
                        ? 'bg-emerald-500 text-black shadow-emerald-500/30'
                        : 'bg-dark-800 text-amber-400 border border-white/10'
                }`}>
                  <BatteryCharging className="w-6 h-6" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Batería Biológica & Preparación Pre-Entreno
                    </span>
                    {readinessCheck && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold border ${
                        readinessCheck.status === 'critico'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : readinessCheck.status === 'moderado'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {readinessCheck.readinessScore}% Capacidad
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading font-black text-base text-white mt-0.5">
                    {readinessCheck ? readinessCheck.coachTitle : '¿Cómo está tu cuerpo hoy? (Sueño, Glucosa y Nicotina)'}
                  </h4>

                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {readinessCheck 
                      ? readinessCheck.coachMessage
                      : 'Comprobá en 20 segundos tu nivel de energía real antes de tocar las mancuernas para prevenir mareos, debilidad y temblores.'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsReadinessModalOpen(true)}
                  className="py-2.5 px-4 rounded-xl font-bold text-xs bg-dark-800 hover:bg-dark-700 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{readinessCheck ? 'Re-evaluar Batería' : 'Chequear Batería Pre-Entreno'}</span>
                </button>
              </div>
            </div>

            {/* Protocolo de Rescate en Estado Crítico */}
            {readinessCheck?.status === 'critico' && (
              <div className="mt-3 pt-3 border-t border-red-500/20 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-red-300 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  {readinessCheck.recommendedAction === 'descanso_obligatorio' 
                    ? 'El Coach recomienda descanso estratégico hoy para evitar colapso neuromuscular.'
                    : 'Rutina adaptada a 1 serie suave en colchoneta.'}
                </span>

                <div className="flex items-center gap-2">
                  {readinessCheck.recommendedAction === 'descanso_obligatorio' && !isWorkoutCompletedToday && (
                    <button
                      type="button"
                      onClick={() => onToggleWorkoutCompleted(true)}
                      className="py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all shadow-md"
                    >
                      Activar Descanso de Rescate (Proteger Racha)
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 6kg Biomechanics & Adaptive Progression Banner */}
          <div className={`p-4 rounded-2xl border flex items-start gap-3 shadow-lg ${
            isMiranda
              ? 'bg-gradient-to-r from-emerald-500/15 via-dark-900 to-teal-500/10 border-emerald-500/30'
              : 'bg-gradient-to-r from-amber-500/15 via-dark-900 to-emerald-500/10 border-amber-500/30'
          }`}>
            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 animate-pulse ${
              isMiranda ? 'text-emerald-400' : 'text-amber-400'
            }`} />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-xs font-black uppercase tracking-wide ${
                  isMiranda ? 'text-emerald-300' : 'text-amber-300'
                }`}>
                  {isMiranda ? 'Protocolo Miranda: Firmeza & Bajo Impacto' : 'Calibración Adaptativa: 2 Series • RIR 2 • Cero Dolor de Muñeca'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {isMiranda ? '12 - 15 Reps' : '8 - 12 Reps • 90s Descanso'}
                </span>
                {!isMiranda && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                    100% en Colchoneta (Sin Sillas)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {isMiranda ? (
                  <>Control articular estricto y respiración diafragmática continua sin saltos ni impacto en meniscos.</>
                ) : (
                  <>
                    Para evitar el agotamiento prematuro en la serie 2, tu rutina está calibrada a <strong className="text-amber-300">2 series efectivas de trabajo</strong> dejando <strong className="text-emerald-300">2 repeticiones en recámara (RIR 2)</strong> sin llegar al fallo extenuante. Hemos eliminado los fondos en silla: ahora todo se realiza en la <strong className="text-cyan-300">colchoneta con agarre neutro</strong> (cero compresión en muñecas) y descansos completos de <strong>90 segundos</strong>.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
              <Dumbbell className={`w-5 h-5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
              Ejercicios Guiados ({routine.exercises.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {isMiranda ? '12 - 15 Reps • Control Articular' : '2 Series de Trabajo • 8 - 12 Reps (RIR 2)'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {routine.exercises.map((exercise, index) => {
              const isExpanded = expandedExerciseId === exercise.id;
              const effectiveSets = readinessCheck?.status === 'critico' && readinessCheck.adaptedSets <= 1
                ? 1
                : exercise.sets;
              const restTime = readinessCheck?.adaptedRestSeconds || exercise.restSeconds;
              const setsState = completedSets[exercise.id] || new Array(effectiveSets).fill(false);
              const allSetsDone = setsState.slice(0, effectiveSets).filter(Boolean).length === effectiveSets;

              return (
                <div
                  key={exercise.id}
                  className={`rounded-2xl transition-all border ${
                    allSetsDone 
                      ? 'bg-emerald-950/20 border-emerald-500/30' 
                      : 'bg-dark-900 border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        allSetsDone ? 'bg-emerald-500 text-black' : 'bg-dark-800 text-amber-400 border border-white/10'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-heading font-bold text-base text-white">
                            {exercise.name}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                            {exercise.equipment}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          <span className="text-amber-400 font-semibold">{effectiveSets} Series</span> × <span className="text-white font-semibold">{exercise.reps}</span> • Descanso: <span className="text-amber-400 font-semibold">{restTime}s</span> • {exercise.rpe}
                        </p>

                        {/* Tempo Tag */}
                        <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-[11px]">
                          <span className="font-bold">⏱️ TEMPO:</span>
                          <span className="text-slate-200">{exercise.tempo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Rest Timer Trigger Button */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onStartRestTimer(restTime, exercise.name)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-xs text-amber-400 border border-amber-500/20 font-semibold transition-colors"
                        title="Iniciar cronómetro de descanso"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{restTime}s</span>
                      </button>

                      <button
                        onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          isExpanded 
                            ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20' 
                            : 'bg-dark-800 text-amber-300 border-amber-500/30 hover:bg-dark-700 hover:text-amber-200'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Ocultar Demo' : 'Ver Demostración'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Series Checkboxes */}
                  <div className="px-4 sm:px-5 pb-4 pt-1 border-t border-white/5 flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-xs font-semibold text-slate-400 mr-1">
                      Series:
                    </span>
                    {Array.from({ length: effectiveSets }).map((_, sIdx) => {
                      const isChecked = setsState[sIdx] || false;
                      return (
                        <button
                          key={sIdx}
                          onClick={() => handleToggleSet(exercise.id, sIdx, effectiveSets, restTime, exercise.name)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            isChecked
                              ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-sm shadow-emerald-500/30'
                              : 'bg-dark-950 border-white/10 text-slate-400 hover:text-white hover:border-amber-500/50'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                          ) : (
                            <Circle className="w-3.5 h-3.5" />
                          )}
                          <span>Serie {sIdx + 1}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded Technique Guide & Looping Visual Demo */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-dark-950/80 border-t border-white/10 rounded-b-2xl space-y-4 animate-in fade-in">
                      {/* 1. VISOR VISUAL TÉCNICO EN BUCLE */}
                      <div>
                        <ExerciseVisualViewer exercise={exercise} />
                      </div>

                      {/* 2. PREPARACIÓN CON EQUIPAMIENTO CASERO */}
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                          <Info className="w-4 h-4" /> Preparación con equipamiento casero
                        </div>
                        <p className="text-xs text-slate-300 bg-dark-900 p-2.5 rounded-lg border border-white/5">
                          {exercise.setupTime}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-1">
                          <Play className="w-4 h-4 text-emerald-400" /> Ejecución Técnica Hipertrófica
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {exercise.technique}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs">
                          <span className="font-bold text-emerald-400 block mb-1">
                            ✓ Claves Biomecánicas (Máxima Hipertrofia):
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300">
                            {exercise.biomechanicCues.map((cue, cIdx) => (
                              <li key={cIdx}>{cue}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/20 text-xs">
                          <span className="font-bold text-red-400 block mb-1">
                            ✕ Errores Catastróficos a Evitar:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-slate-300">
                            {exercise.mistakesToAvoid.map((mistake, mIdx) => (
                              <li key={mIdx}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Módulo Interactivo de Recuperación y Estiramientos Guiados (Anti-Dolor) */}
          <GuidedStretchingWidget
            userId={userId}
            isStretchingCompleted={!!isStretchingCompletedToday}
            onConfirmCompleted={handleConfirmStretching}
            highlightCard={highlightCooldown}
          />
        </div>
      )}

      {/* Bio-Readiness Assessment Modal */}
      {onSaveReadiness && (
        <BioReadinessModal
          isOpen={isReadinessModalOpen}
          onClose={() => setIsReadinessModalOpen(false)}
          dateStr={dateStr}
          initialCheck={readinessCheck}
          onSaveReadiness={onSaveReadiness}
        />
      )}
    </div>
  );
};
