import React, { useState } from 'react';
import { 
  X, 
  BatteryCharging, 
  Activity, 
  Moon, 
  Utensils, 
  Cigarette, 
  Droplet, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import type { BioReadinessCheck } from '../types';
import { calculateBioReadiness } from '../lib/readinessEngine';
import { playBeep } from '../lib/sound';

interface BioReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateStr: string;
  initialCheck?: BioReadinessCheck;
  onSaveReadiness: (check: BioReadinessCheck) => void;
}

export const BioReadinessModal: React.FC<BioReadinessModalProps> = ({
  isOpen,
  onClose,
  dateStr,
  initialCheck,
  onSaveReadiness
}) => {
  const [sleepHours, setSleepHours] = useState<number>(initialCheck?.sleepHours ?? 8);
  const [isLateBedtime, setIsLateBedtime] = useState<boolean>((initialCheck?.bedTimeHour ?? 0) >= 3 && (initialCheck?.bedTimeHour ?? 0) <= 7);
  const [isLateWakeTime, setIsLateWakeTime] = useState<boolean>((initialCheck?.wakeTimeHour ?? 9) >= 13);
  const [mealsCount, setMealsCount] = useState<number>(initialCheck?.mealsCountToday ?? 2);
  const [hadSugarCrash, setHadSugarCrash] = useState<boolean>(initialCheck?.hadSugarCrashRisk ?? false);
  const [cigaretteLevel, setCigaretteLevel] = useState<number>(initialCheck?.cigarettesToday ?? 0);
  const [waterLiters, setWaterLiters] = useState<number>(initialCheck?.waterLitersToday ?? 1.5);
  const [currentFeeling, setCurrentFeeling] = useState<1 | 2 | 3 | 4 | 5>(initialCheck?.currentFeeling ?? 3);
  const [hasTremors, setHasTremors] = useState<boolean>(initialCheck?.hasTremorsOrDizziness ?? false);

  const [evaluatedResult, setEvaluatedResult] = useState<BioReadinessCheck | null>(initialCheck || null);

  if (!isOpen) return null;

  const handleRunAnalysis = () => {
    const result = calculateBioReadiness({
      dateStr,
      sleepHours,
      bedTimeHour: isLateBedtime ? 5 : 23,
      wakeTimeHour: isLateWakeTime ? 14 : 9,
      mealsCountToday: mealsCount,
      hadSugarCrashRisk: hadSugarCrash,
      cigarettesToday: cigaretteLevel,
      waterLitersToday: waterLiters,
      currentFeeling,
      hasTremorsOrDizziness: hasTremors
    });

    setEvaluatedResult(result);
    playBeep(result.status === 'critico' ? 'tick' : 'success');
  };

  const handleApplyAndClose = () => {
    if (!evaluatedResult) {
      handleRunAnalysis();
      return;
    }
    onSaveReadiness(evaluatedResult);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-dark-900 border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black shadow-lg shadow-amber-500/20">
            <BatteryCharging className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-white">
              Test de Batería Biológica
            </h3>
            <p className="text-xs text-slate-400">
              Calibración según sueño, glucosa, nicotina e hidratación
            </p>
          </div>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* 1. SUEÑO Y RITMO CIRCADIANO */}
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-indigo-400" /> Horas de Sueño:
              </span>
              <span className="font-mono font-black text-sm text-indigo-300">
                {sleepHours} hs
              </span>
            </div>
            <input 
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsLateBedtime(!isLateBedtime)}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isLateBedtime
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-dark-900 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                {isLateBedtime ? '⚠️ Me dormí después de las 3-5 AM' : 'Horario normal (antes de 2 AM)'}
              </button>

              <button
                type="button"
                onClick={() => setIsLateWakeTime(!isLateWakeTime)}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isLateWakeTime
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-dark-900 text-slate-400 border-white/5 hover:text-slate-200'
                }`}
              >
                {isLateWakeTime ? 'Desperté tarde (13-14 hs)' : 'Desperté en horario regular'}
              </button>
            </div>
          </div>

          {/* 2. ALIMENTACIÓN & GLUCOSA */}
          <div className="p-3.5 rounded-2xl bg-dark-950 border border-white/5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-400" /> Comidas realizadas antes de entrenar:
              </span>
              <div className="flex items-center gap-1 bg-dark-900 p-1 rounded-lg border border-white/5">
                {[0, 1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setMealsCount(num)}
                    className={`w-7 h-6 rounded-md font-bold text-xs transition-all ${
                      mealsCount === num
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {num === 3 ? '3+' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Alerta de Galletitas / Azúcar en ayunas */}
            <button
              type="button"
              onClick={() => setHadSugarCrash(!hadSugarCrash)}
              className={`w-full py-2 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-between gap-2 transition-all ${
                hadSugarCrash
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-sm shadow-red-500/10'
                  : 'bg-dark-900 text-slate-400 border-white/5 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 text-left">
                <AlertTriangle className={`w-4 h-4 shrink-0 ${hadSugarCrash ? 'text-red-400' : 'text-slate-500'}`} />
                <span>¿Comiste galletitas dulces, golosinas o azúcar con el estómago vacío?</span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                hadSugarCrash ? 'bg-red-500 text-white' : 'bg-dark-800 text-slate-400'
              }`}>
                {hadSugarCrash ? 'SÍ (Riesgo Hipoglucemia)' : 'NO'}
              </span>
            </button>
          </div>

          {/* 3. TABACO & HIDRATACIÓN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cigarrillos */}
            <div className="p-3.5 rounded-2xl bg-dark-950 border border-white/5 space-y-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Cigarette className="w-4 h-4 text-orange-400" /> Cigarrillos fumados hoy:
              </span>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {[0, 5, 10, 15].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setCigaretteLevel(lvl)}
                    className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                      cigaretteLevel === lvl
                        ? 'bg-orange-500 text-black font-black shadow-sm'
                        : 'bg-dark-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {lvl === 0 ? '0' : lvl === 15 ? '15+' : `~${lvl}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Agua */}
            <div className="p-3.5 rounded-2xl bg-dark-950 border border-white/5 space-y-1.5">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-cyan-400" /> Agua pura tomada hoy:
              </span>
              <div className="grid grid-cols-3 gap-1 pt-1">
                {[0.5, 1.5, 2.5].map((liters) => (
                  <button
                    key={liters}
                    type="button"
                    onClick={() => setWaterLiters(liters)}
                    className={`py-1.5 rounded-lg font-bold text-[11px] transition-all ${
                      waterLiters === liters
                        ? 'bg-cyan-500 text-black font-black shadow-sm'
                        : 'bg-dark-900 text-slate-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {liters === 0.5 ? '< 1L' : liters === 1.5 ? '1.5L' : '2.5L+'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. TEMBLORES O MAREO (SÍNTOMA CRÍTICO) */}
          <button
            type="button"
            onClick={() => setHasTremors(!hasTremors)}
            className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${
              hasTremors
                ? 'bg-red-950/40 border-red-500/50 text-red-200 shadow-lg shadow-red-500/20'
                : 'bg-dark-950 border-white/5 text-slate-400 hover:text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                hasTremors ? 'bg-red-500 text-white animate-pulse' : 'bg-dark-850 text-slate-500'
              }`}>
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">
                  ¿Sentís temblores en los brazos, debilidad o mareo?
                </span>
                <span className="text-[10px] text-slate-400">
                  Indica agotamiento del SNC, hipoglucemia o falta de electrolitos.
                </span>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
              hasTremors ? 'bg-red-500 text-white' : 'bg-dark-800 text-slate-400'
            }`}>
              {hasTremors ? 'SÍ' : 'NO'}
            </span>
          </button>
        </div>

        {/* Action Button: Calcular */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleRunAnalysis}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-black text-sm transition-all hover:scale-[1.02] shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analizar mi Capacidad de Hoy con el Coach</span>
          </button>
        </div>

        {/* RESULTS CARD */}
        {evaluatedResult && (
          <div className="mt-5 p-4 rounded-2xl bg-dark-950 border border-white/10 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Índice de Capacidad Biológica:
                </span>
                <h4 className="font-heading font-black text-lg text-white">
                  {evaluatedResult.coachTitle}
                </h4>
              </div>

              <div className={`text-2xl font-black font-heading px-3 py-1 rounded-xl border ${
                evaluatedResult.status === 'optimo'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : evaluatedResult.status === 'moderado'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    : 'bg-red-500/20 text-red-400 border-red-500/30'
              }`}>
                {evaluatedResult.readinessScore}%
              </div>
            </div>

            {/* Diagnostic Message */}
            <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/90 p-3 rounded-xl border border-white/5">
              {evaluatedResult.coachMessage}
            </p>

            {/* Action Adaptation Protocol */}
            <div className="p-3 rounded-xl bg-dark-900 border border-white/5 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Ajuste Automático en Rutina:
                </span>
                <span className="text-xs font-bold text-white">
                  {evaluatedResult.status === 'critico'
                    ? '🛑 Modo Rescate: 0 a 1 serie suave (Cero sobreentrenamiento)'
                    : evaluatedResult.status === 'moderado'
                      ? '⚡ Calibración: 2 series con 120s de descanso'
                      : '✅ Rutina Completa: 2 series efectivas con 90s de descanso'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleApplyAndClose}
                className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-all shadow-md shrink-0"
              >
                Aplicar Ajuste
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
