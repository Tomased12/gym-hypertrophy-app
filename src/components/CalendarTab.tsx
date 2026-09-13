import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import type { DailyLog, UserId } from '../types';
import { getRoutineForUser } from '../lib/workoutPlan';
import { playBeep } from '../lib/sound';

interface CalendarTabProps {
  userId?: UserId;
  dailyLogs: Record<string, DailyLog>;
  currentDayNumber: number;
  startDateISO: string;
  onUpdateDayLog: (dateStr: string, updates: Partial<DailyLog>) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  userId = 'tomas',
  dailyLogs,
  currentDayNumber,
  startDateISO,
  onUpdateDayLog
}) => {
  const [selectedDayToEdit, setSelectedDayToEdit] = useState<{ dayNum: number; dateStr: string } | null>(null);
  const isMiranda = userId === 'miranda';

  const startDate = new Date(startDateISO);

  // Helper to get date for day N
  const getDateForDay = (dayNum: number) => {
    const d = new Date(startDate.getTime() + (dayNum - 1) * 24 * 60 * 60 * 1000);
    return d.toISOString().split('T')[0];
  };

  // Calculate overall stats for past/current days
  let greenCount = 0;
  let partialCount = 0;
  let redCount = 0;

  for (let d = 1; d <= currentDayNumber; d++) {
    const dateStr = getDateForDay(d);
    const log = dailyLogs[dateStr];
    const routine = getRoutineForUser(userId, d);

    const hasWorkout = !!log?.workoutCompleted;
    const hasNutrition = !!log?.nutritionTargetMet;
    const hasCardio = !!log?.cardioCompleted || (isMiranda && (log?.stepsCount || 0) >= 8000);

    if (routine.isRestDay) {
      if (hasNutrition && hasCardio) {
        greenCount++;
      } else if (hasNutrition || hasCardio) {
        partialCount++;
      } else {
        redCount++;
      }
    } else {
      const itemsDone = (hasWorkout ? 1 : 0) + (hasNutrition ? 1 : 0) + (hasCardio ? 1 : 0);
      if (itemsDone === 3) {
        greenCount++;
      } else if (itemsDone > 0) {
        partialCount++;
      } else {
        redCount++;
      }
    }
  }

  const evaluatedDays = currentDayNumber;
  const consistencyRate = evaluatedDays > 0 ? Math.round(((greenCount + partialCount * 0.5) / evaluatedDays) * 100) : 100;

  const handleToggleCheck = (type: 'workout' | 'nutrition' | 'cardio') => {
    if (!selectedDayToEdit) return;
    const dateStr = selectedDayToEdit.dateStr;
    const existing = dailyLogs[dateStr] || {
      dateStr,
      dayNumber: selectedDayToEdit.dayNum,
      workoutCompleted: false,
      stretchingCompleted: false,
      nutritionTargetMet: false,
      cardioCompleted: false,
      caloriesConsumed: 0,
      proteinConsumed: 0,
      carbsConsumed: 0,
      fatsConsumed: 0,
      meals: [],
      cardioLogs: [],
      waterLiters: 2.5
    };

    if (type === 'workout') {
      onUpdateDayLog(dateStr, { workoutCompleted: !existing.workoutCompleted });
    } else if (type === 'nutrition') {
      onUpdateDayLog(dateStr, { nutritionTargetMet: !existing.nutritionTargetMet });
    } else {
      onUpdateDayLog(dateStr, { cardioCompleted: !existing.cardioCompleted });
    }
    playBeep('tick');
  };

  const selectedLog = selectedDayToEdit ? dailyLogs[selectedDayToEdit.dateStr] : null;
  const selectedRoutine = selectedDayToEdit ? getRoutineForUser(userId, selectedDayToEdit.dayNum) : null;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Summary Header */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase mb-2">
              <Calendar className="w-3.5 h-3.5" /> Matriz de Hábitos
            </div>
            <h2 className="font-heading font-black text-2xl text-white">
              Calendario del Ciclo de 60 Días
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Visualiza tu disciplina diaria: Verde = Meta Completa, Naranja = Parcial, Rojo = Día Perdido.
            </p>
          </div>

          {/* Color Legend & Stats */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-emerald-500/30 text-xs">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">Cumplido:</span>
              <strong className="text-emerald-400 font-bold">{greenCount}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-amber-500/30 text-xs">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
              <span className="text-slate-300">Parcial:</span>
              <strong className="text-amber-400 font-bold">{partialCount}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 border border-red-500/30 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50" />
              <span className="text-slate-300">Fallado:</span>
              <strong className="text-red-400 font-bold">{redCount}</strong>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
              <span>{consistencyRate}% Éxito</span>
            </div>
          </div>
        </div>
      </div>

      {/* 60-Day Grid */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center justify-between">
          <span>Mapa de los 60 Días de Transformación</span>
          <span className="text-xs font-normal text-slate-400">Haz clic en cualquier día para ver o editar</span>
        </h3>

        {/* Weeks representation */}
        <div className="space-y-4">
          {Array.from({ length: 9 }).map((_, wIdx) => {
            const weekNumber = wIdx + 1;
            const startDay = wIdx * 7 + 1;
            if (startDay > 60) return null;

            return (
              <div key={weekNumber} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
                  <span>Semana {weekNumber}</span>
                  <span className="text-[10px] text-slate-500">Días {startDay} - {Math.min(60, startDay + 6)}</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 7 }).map((_, dOffset) => {
                    const dayNum = startDay + dOffset;
                    if (dayNum > 60) {
                      return <div key={dOffset} className="hidden sm:block opacity-0" />;
                    }

                    const dateStr = getDateForDay(dayNum);
                    const log = dailyLogs[dateStr];
                    const routine = getRoutineForUser(userId, dayNum);
                    const isToday = dayNum === currentDayNumber;
                    const isFuture = dayNum > currentDayNumber;

                    let statusBg = 'bg-dark-950 border-white/5 text-slate-500';
                    let statusDot = 'bg-slate-700';

                    if (isFuture) {
                      statusBg = 'bg-dark-950/40 border-white/5 text-slate-600 opacity-60';
                      statusDot = 'bg-slate-800';
                    } else if (routine.isRestDay) {
                      const hasNutrition = !!log?.nutritionTargetMet;
                      const hasCardio = !!log?.cardioCompleted || (isMiranda && (log?.stepsCount || 0) >= 8000);
                      if (hasNutrition && hasCardio) {
                        statusBg = 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300';
                        statusDot = 'bg-emerald-400';
                      } else if (hasNutrition || hasCardio) {
                        statusBg = 'bg-amber-950/40 border-amber-500/40 text-amber-200';
                        statusDot = 'bg-amber-400';
                      } else {
                        statusBg = 'bg-red-950/30 border-red-500/30 text-red-300';
                        statusDot = 'bg-red-500';
                      }
                    } else {
                      const hasCardioActive = !!log?.cardioCompleted || (isMiranda && (log?.stepsCount || 0) >= 8000);
                      const done = (log?.workoutCompleted ? 1 : 0) + (log?.nutritionTargetMet ? 1 : 0) + (hasCardioActive ? 1 : 0);
                      if (done === 3) {
                        statusBg = 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 shadow-sm shadow-emerald-500/20';
                        statusDot = 'bg-emerald-400';
                      } else if (done > 0) {
                        statusBg = 'bg-amber-950/40 border-amber-500/40 text-amber-200';
                        statusDot = 'bg-amber-400';
                      } else {
                        statusBg = 'bg-red-950/40 border-red-500/40 text-red-300';
                        statusDot = 'bg-red-500';
                      }
                    }

                    return (
                      <button
                        key={dayNum}
                        onClick={() => setSelectedDayToEdit({ dayNum, dateStr })}
                        className={`relative rounded-xl p-2.5 text-left border transition-all hover:scale-105 ${statusBg} ${
                          isToday ? 'ring-2 ring-amber-400 font-bold' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold">
                            {dayNum}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${statusDot}`} />
                        </div>
                        <div className="mt-1 text-[10px] truncate">
                          {routine.isRestDay ? 'Descanso' : 'Brazos'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Inspection & Quick Check-in Modal */}
      {selectedDayToEdit && selectedRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedDayToEdit(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Check-in de Hábitos
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                {selectedDayToEdit.dateStr}
              </span>
            </div>
            <h3 className="font-heading font-black text-xl text-white">
              Día {selectedDayToEdit.dayNum} de 60
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">
              {selectedRoutine.title}
            </p>

            <div className="space-y-3">
              {/* Question 1: Workout */}
              {!selectedRoutine.isRestDay ? (
                <div className="p-3.5 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      ¿Completaste la rutina?
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Entrenamiento de hipertrofia de brazos
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleCheck('workout')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selectedLog?.workoutCompleted
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-dark-800 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {selectedLog?.workoutCompleted ? '✓ Sí, Cumplida' : '✕ No'}
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-300">
                  🛡️ Día de descanso programado: el descanso muscular es obligatorio para la síntesis de nuevas fibras en los brazos.
                </div>
              )}

              {/* Question 2: Nutrition */}
              <div className="p-3.5 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isMiranda ? '¿Cumpliste déficit y proteínas?' : '¿Cumpliste superávit y proteínas?'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isMiranda ? '1.350 - 1.400 kcal (alto TEF) y 100g proteína' : '2.650 kcal y 140-150g proteína anabólica'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleCheck('nutrition')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedLog?.nutritionTargetMet
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-dark-800 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedLog?.nutritionTargetMet ? '✓ Sí, Cumplida' : '✕ No'}
                </button>
              </div>

              {/* Question 3: Cardio Rule */}
              <div className="p-3.5 rounded-xl bg-dark-950 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isMiranda ? '¿Completaste cardio o pasos?' : '¿Respetaste la regla de cardio?'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isMiranda 
                      ? '30-45 min de caminata o meta NEAT de 8.000 pasos'
                      : 'Evitaste cardio excesivo (máx 15-20 min suaves)'}
                  </span>
                </div>
                <button
                  onClick={() => handleToggleCheck('cardio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    selectedLog?.cardioCompleted
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-dark-800 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {selectedLog?.cardioCompleted ? '✓ Sí, Cumplida' : '✕ No'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setSelectedDayToEdit(null)}
              className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors"
            >
              Guardar y Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
