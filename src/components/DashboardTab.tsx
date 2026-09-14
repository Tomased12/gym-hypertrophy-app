import { 
  Flame, 
  Award, 
  Dumbbell, 
  Utensils, 
  ArrowRight, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp,
  Check,
  Zap,
  Heart,
  Scale,
  Footprints,
  Sparkles,
  BatteryCharging
} from 'lucide-react';
import type { UserProfile, DailyLog, BodyMeasurement, UserId } from '../types';
import { getRoutineForUser } from '../lib/workoutPlan';
import type { TabType } from './Navbar';
import { playBeep } from '../lib/sound';
import { StepCounterWidget } from './StepCounterWidget';
import { WaterTrackerWidget } from './WaterTrackerWidget';
import { MirandaAntiCravingWidget } from './MirandaAntiCravingWidget';
import { analyzeDailyNutritionBalance } from '../lib/adaptiveMealPlanner';

interface DashboardTabProps {
  profile: UserProfile;
  todayLog: DailyLog;
  measurements: BodyMeasurement[];
  onNavigateTab: (tab: TabType) => void;
  onUpdateTodayLog: (updates: Partial<DailyLog>) => void;
  onOpenCardioModal: () => void;
  consistencyRate: number;
  onSwitchUser?: (userId: UserId) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  profile,
  todayLog,
  measurements,
  onNavigateTab,
  onUpdateTodayLog,
  onOpenCardioModal,
  consistencyRate,
  onSwitchUser
}) => {
  const currentDay = profile.currentDay;
  const daysRemaining = 60 - currentDay;
  const cyclePercent = Math.round((currentDay / 60) * 100);
  const isMiranda = profile.id === 'miranda';

  const routine = getRoutineForUser(profile.id, currentDay);

  const latestMeas = measurements[measurements.length - 1] || {
    armCircumference: profile.currentArmCm || 0,
    bodyWeight: profile.weightKg || 70,
    waistCircumference: 0,
    hipCircumference: 0
  };

  const armGained = Math.round(((latestMeas.armCircumference || 0) - (profile.startArmCm || 0)) * 10) / 10;
  const weightChange = Math.round(((latestMeas.bodyWeight || profile.weightKg) - profile.startWeightKg) * 10) / 10;

  const nutritionAnalysis = analyzeDailyNutritionBalance(profile, todayLog.meals || []);

  const handleToggleCheck = (field: 'workoutCompleted' | 'nutritionTargetMet' | 'cardioCompleted') => {
    onUpdateTodayLog({ [field]: !todayLog[field] });
    playBeep('tick');
  };

  const targetCals = profile.targetCalories || profile.targetSurplusCalories || 2650;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Hero 60-Day Progress & Countdown */}
      <div className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl ${
        isMiranda 
          ? 'bg-gradient-to-br from-emerald-950/50 via-dark-900 to-dark-950 border border-emerald-500/30'
          : 'glass-card-amber'
      }`}>
        {/* Background glow circle */}
        <div className={`absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          isMiranda ? 'bg-emerald-500/15' : 'bg-amber-500/10'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 border ${
              isMiranda 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            }`}>
              {isMiranda ? (
                <>
                  <Heart className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                  Déficit & Recomposición Saludable • 60 Días
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                  Ciclo de Hipertrofia Extrema • 60 Días
                </>
              )}
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
              Día <span className={`text-transparent bg-clip-text ${
                isMiranda 
                  ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400' 
                  : 'bg-gradient-to-r from-amber-400 via-orange-400 to-red-500'
              }`}>{currentDay}</span> de 60
            </h1>

            {isMiranda ? (
              <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                Meta: <strong>62 kg ➔ 55 kg (-7 kg)</strong> con tonificación en casa (Silla + Colchoneta + Mancuernas 6 kg). Perfil: <span className="text-emerald-300 font-bold">1.55 m • 27 años</span> • Nutrición: <span className="text-teal-300 font-bold">1.350 - 1.400 kcal (Alto TEF) / 100g proteína mín.</span> • Predisposición genética & metabolismo basal lento • <span className="text-red-300 font-bold">Cero palta</span> • Meta NEAT: 8.000 pasos.
              </p>
            ) : (
              <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
                Prioridad: <strong>Grosor en brazos (60% tríceps, bíceps & braquial)</strong> con mancuernas de 6 kg (Tempo 3-1-1-0 de 15-25 reps), silla y colchoneta. Perfil: <span className="text-amber-300 font-bold">70 kg (1.79 m)</span> • Meta fija: <span className="text-emerald-300 font-bold">2.650 kcal / 140-150g prote</span>.
              </p>
            )}

            {/* In-Card Quick Profile Switcher (Guaranteed visible and easy to tap) */}
            {onSwitchUser && (
              <div className="mt-4 inline-flex items-center gap-2 p-1.5 rounded-2xl bg-dark-950/90 border border-white/15 shadow-xl w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => onSwitchUser('tomas')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
                    !isMiranda
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-extrabold shadow-md shadow-amber-500/30 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-dark-800 active:scale-95'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Tomás</span>
                  {!isMiranda && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchUser('miranda')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all touch-manipulation cursor-pointer ${
                    isMiranda
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-extrabold shadow-md shadow-emerald-500/30 scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-dark-800 active:scale-95'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Miranda</span>
                  {isMiranda && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-dark-950/80 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Consistencia</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-2xl font-heading font-black text-emerald-400">{consistencyRate}%</span>
              </div>
              <span className="text-[10px] text-slate-400">Éxito en ciclo</span>
            </div>

            {isMiranda ? (
              <div 
                onClick={() => onNavigateTab('progress')}
                className="p-3.5 rounded-2xl bg-dark-950/80 border border-white/10 text-center cursor-pointer hover:border-emerald-500/40 transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Peso Meta (55 kg)</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <Scale className="w-4 h-4 text-emerald-400" />
                  <span className="text-2xl font-heading font-black text-emerald-400">
                    {latestMeas.bodyWeight || profile.currentWeightKg || profile.weightKg}
                  </span>
                  <span className="text-xs font-mono text-slate-400">kg</span>
                </div>
                <span className="text-[10px] text-emerald-300 underline">
                  {weightChange !== 0 ? `${weightChange > 0 ? '+' : ''}${weightChange} kg desde inicio` : 'Meta: -7 kg'}
                </span>
              </div>
            ) : (
              <div 
                onClick={() => onNavigateTab('progress')}
                className="p-3.5 rounded-2xl bg-dark-950/80 border border-white/10 text-center cursor-pointer hover:border-amber-500/40 transition-colors"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Brazo Ganado</span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-2xl font-heading font-black text-amber-400">
                    {measurements.length > 0 ? `+${armGained}` : '--'}
                  </span>
                  <span className="text-xs font-mono text-slate-400">cm</span>
                </div>
                <span className="text-[10px] text-amber-300 underline">
                  {measurements.length > 0 ? `${latestMeas.armCircumference} cm actual` : 'Toca para medir'}
                </span>
              </div>
            )}

            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-dark-950/80 border border-white/10 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Progreso Ciclo</span>
              <div className="flex items-center justify-center gap-1 mt-0.5">
                <Flame className={`w-4 h-4 ${isMiranda ? 'text-emerald-400' : 'text-orange-400'}`} />
                <span className="text-2xl font-heading font-black text-white">{cyclePercent}%</span>
              </div>
              <span className="text-[10px] text-slate-400">{daysRemaining} días restantes</span>
            </div>
          </div>
        </div>

        {/* 60-Day Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 relative z-10">
          <div className="flex justify-between text-xs font-semibold mb-1.5 text-slate-300">
            <span>Día 1: Inicio</span>
            <span className={isMiranda ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              Día {currentDay} (Semana {Math.ceil(currentDay / 7)})
            </span>
            <span>{isMiranda ? 'Día 60: Meta (55 kg)' : 'Día 60: Meta (+3.0 cm)'}</span>
          </div>
          <div className="w-full h-3.5 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 shadow-md ${
                isMiranda 
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 shadow-amber-500/30'
              }`}
              style={{ width: `${cyclePercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bio-Readiness Quick Card for Tomás / General */}
      {profile.id === 'tomas' && (
        <div 
          onClick={() => onNavigateTab('workout')}
          className={`glass-card rounded-2xl p-4 sm:p-5 border cursor-pointer transition-all hover:scale-[1.01] ${
            todayLog.readinessCheck?.status === 'critico'
              ? 'bg-gradient-to-r from-red-950/50 via-dark-900 to-red-900/20 border-red-500/40 shadow-lg shadow-red-500/10'
              : todayLog.readinessCheck?.status === 'moderado'
                ? 'bg-gradient-to-r from-amber-950/40 via-dark-900 to-amber-900/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
                : todayLog.readinessCheck?.status === 'optimo'
                  ? 'bg-gradient-to-r from-emerald-950/40 via-dark-900 to-teal-900/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                  : 'border-white/10 hover:border-amber-500/30'
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                todayLog.readinessCheck?.status === 'critico'
                  ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30'
                  : todayLog.readinessCheck?.status === 'moderado'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                    : todayLog.readinessCheck?.status === 'optimo'
                      ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                      : 'bg-dark-800 text-amber-400 border border-white/10'
              }`}>
                <BatteryCharging className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                    Batería Biológica Pre-Entreno
                  </span>
                  {todayLog.readinessCheck ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      todayLog.readinessCheck.status === 'critico'
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : todayLog.readinessCheck.status === 'moderado'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {todayLog.readinessCheck.readinessScore}% Capacidad
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Pendiente
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {todayLog.readinessCheck ? todayLog.readinessCheck.coachTitle : 'Evalúa tu combustible biológico antes de entrenar'}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
                  {todayLog.readinessCheck 
                    ? todayLog.readinessCheck.coachMessage 
                    : 'Calcula el impacto de tu sueño, nicotina y azúcar para adaptar las series de hoy.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 shrink-0 bg-dark-800/80 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <span>{todayLog.readinessCheck ? 'Ver Rutina Adaptada' : 'Evaluar Ahora'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Daily Quick Check-in & Habit Confirmation */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-heading font-bold text-lg text-white">
              Check-in Diario de Cumplimiento (Día {currentDay})
            </h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {isMiranda ? 'La constancia y el déficit moderado aseguran el éxito' : 'El secreto de la hipertrofia es no romper la cadena'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1: Workout */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            todayLog.workoutCompleted 
              ? 'bg-emerald-950/30 border-emerald-500/40' 
              : 'bg-dark-950 border-white/5'
          }`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {isMiranda ? '1. Rutina o Caminata' : '1. Hipertrofia de Brazos'}
              </span>
              <p className="text-sm font-bold text-white">
                {routine.isRestDay ? '¿Cumpliste descanso/caminata?' : '¿Completaste la rutina de hoy?'}
              </p>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>{routine.isRestDay ? 'Regeneración muscular' : `${routine.exercises.length} ejercicios + Elongación Anti-Dolor`}</span>
                {!routine.isRestDay && todayLog.stretchingCompleted && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                    ✓ Estiramientos listos
                  </span>
                )}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => handleToggleCheck('workoutCompleted')}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  todayLog.workoutCompleted
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                    : isMiranda
                      ? 'bg-dark-800 text-slate-300 border border-white/10 hover:border-emerald-500 hover:text-white'
                      : 'bg-dark-800 text-slate-300 border border-white/10 hover:border-amber-500 hover:text-white'
                }`}
              >
                {todayLog.workoutCompleted ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡SÍ, CUMPLIDO!</span>
                  </>
                ) : (
                  <span>NO AÚN (Marcar Sí)</span>
                )}
              </button>
            </div>
          </div>

          {/* Question 2: Nutrition */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            todayLog.nutritionTargetMet 
              ? 'bg-emerald-950/30 border-emerald-500/40' 
              : 'bg-dark-950 border-white/5'
          }`}>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {isMiranda ? '2. Déficit & Proteína' : '2. Superávit & Proteína'}
              </span>
              <p className="text-sm font-bold text-white">
                ¿Llegaste a tu meta diaria?
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {todayLog.caloriesConsumed} / {targetCals} kcal • {todayLog.proteinConsumed} / {profile.targetProteinGrams}g prote
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => handleToggleCheck('nutritionTargetMet')}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  todayLog.nutritionTargetMet
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                    : 'bg-dark-800 text-slate-300 border border-white/10 hover:border-cyan-500 hover:text-white'
                }`}
              >
                {todayLog.nutritionTargetMet ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡SÍ, CUMPLIDO!</span>
                  </>
                ) : (
                  <span>NO AÚN (Marcar Sí)</span>
                )}
              </button>
            </div>
          </div>

          {/* Question 3: Individualized Cardio Rule */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
            todayLog.cardioCompleted 
              ? 'bg-emerald-950/30 border-emerald-500/40' 
              : 'bg-dark-950 border-white/5'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {isMiranda ? '3. Cardio Diario & Pasos' : '3. Regla Anti-Catabolismo'}
                </span>
                <button
                  type="button"
                  onClick={onOpenCardioModal}
                  className={`text-[10px] font-bold underline ${
                    isMiranda ? 'text-emerald-400 hover:text-emerald-300' : 'text-amber-400 hover:text-amber-300'
                  }`}
                >
                  Ver regla
                </button>
              </div>
              <p className="text-sm font-bold text-white">
                {isMiranda ? '¿Completaste cardio o tus pasos?' : '¿Respetaste la regla de cardio?'}
              </p>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                {isMiranda 
                  ? '30–45 min de caminata/bici o 6.000–8.000 pasos (colesterol & quema)'
                  : 'Evitaste cardio excesivo (máx 15–20 min suaves para no quemar músculo)'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleCheck('cardioCompleted')}
                className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md ${
                  todayLog.cardioCompleted
                    ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                    : isMiranda
                      ? 'bg-dark-800 text-slate-300 border border-white/10 hover:border-emerald-500 hover:text-white'
                      : 'bg-dark-800 text-slate-300 border border-white/10 hover:border-red-500 hover:text-white'
                }`}
              >
                {todayLog.cardioCompleted ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡SÍ, CUMPLIDO!</span>
                  </>
                ) : (
                  <span>NO AÚN (Marcar Sí)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hydration Tracking & Daily Activity */}
      {isMiranda ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WaterTrackerWidget
            profile={profile}
            waterLiters={todayLog.waterLiters || 0}
            onUpdateWater={(amount) => onUpdateTodayLog({ waterLiters: amount })}
          />
          <StepCounterWidget
            currentSteps={todayLog.stepsCount || 0}
            targetSteps={profile.targetSteps || 8000}
            onUpdateSteps={(steps) => onUpdateTodayLog({ 
              stepsCount: steps,
              cardioCompleted: steps >= (profile.targetSteps || 8000) ? true : todayLog.cardioCompleted
            })}
          />
        </div>
      ) : (
        <WaterTrackerWidget
          profile={profile}
          waterLiters={todayLog.waterLiters || 0}
          onUpdateWater={(amount) => onUpdateTodayLog({ waterLiters: amount })}
        />
      )}

      {/* Routine of the Day Quick Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Routine Card */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className={`w-5 h-5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {routine.isRestDay ? (isMiranda ? 'Caminata & Descanso Activo' : 'Descanso de Crecimiento') : 'Sesión de Hoy'}
                </span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-dark-950 text-slate-300 border border-white/10 font-medium">
                {routine.isRestDay ? 'Descanso muscular' : `~${routine.estimatedMinutes} min`}
              </span>
            </div>

            <h3 className="font-heading font-black text-2xl text-white">
              {routine.title}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {routine.tagline}
            </p>

            {/* Exercise preview pills */}
            {!routine.isRestDay ? (
              <div className="mt-4 space-y-2">
                {routine.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-dark-950/70 border border-white/5 flex items-center justify-between text-xs">
                    <span className="font-semibold text-white">{ex.name}</span>
                    <span className="text-slate-400 font-mono">{ex.sets} × {ex.reps}</span>
                  </div>
                ))}
                {routine.exercises.length > 3 && (
                  <p className="text-[11px] text-slate-400 text-center pt-1">
                    +{routine.exercises.length - 3} ejercicios más en la rutina guiada
                  </p>
                )}
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                <strong className="text-blue-300 block mb-1">
                  {isMiranda ? 'Pauta para el día de caminata / descanso:' : 'Día de reconstrucción biológica:'}
                </strong>
                {routine.recoveryNote}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Equipamiento: <span className="text-white font-semibold">Silla • Colchoneta • Mancuernas 6 kg</span>
            </div>
            <button
              onClick={() => onNavigateTab('workout')}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md ${
                isMiranda 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20' 
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
              }`}
            >
              <span>{routine.isRestDay ? 'Ver Consejos & Movilidad' : 'Abrir Rutina Guiada'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Nutrition & Strategy Side Card */}
        <div className="space-y-4">
          {/* Nutrition Snapshot */}
          <div className="glass-card rounded-2xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Utensils className={`w-4 h-4 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} /> 
                {isMiranda ? 'Nutrición Cardiosaludable' : 'Nutrición Anabólica'}
              </span>
              <button
                onClick={() => onNavigateTab('nutrition')}
                className={`text-xs hover:underline font-semibold ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}
              >
                Registrar
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Calorías Hoy:</span>
                <strong className={isMiranda ? 'text-emerald-400' : 'text-amber-400'}>
                  {todayLog.caloriesConsumed} / {targetCals} kcal
                </strong>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Proteína ({isMiranda ? '1.6g/kg' : '2g/kg'}):</span>
                <strong className="text-cyan-400">{todayLog.proteinConsumed} / {profile.targetProteinGrams}g</strong>
              </div>
            </div>

            {nutritionAnalysis.status === 'compensation' && (
              <div className="mt-2.5 p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5 animate-pulse">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Compensación activa para tu {nutritionAnalysis.nextSuggestedMealType}.</span>
              </div>
            )}

            <button
              onClick={() => onNavigateTab('nutrition')}
              className={`mt-3 w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                isMiranda 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-emerald-500/20 hover:brightness-110' 
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-amber-500/20 hover:brightness-110'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span>¿Qué comer ahora? Ver menú equilibrado ➔</span>
            </button>
          </div>

          {/* Cardio / Strategy Alert Card */}
          {isMiranda ? (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-950/40 to-dark-900 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <Footprints className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Estrategia Cardiovascular & Colesterol
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Prioriza caminatas activas, bici fija o elíptica (<strong>30 a 45 min</strong>) para sumar tus <strong>6.000 a 8.000 pasos</strong>. Eleva el HDL sin desgaste articular.
                  </p>
                  <button
                    onClick={onOpenCardioModal}
                    className="mt-2.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                  >
                    Registrar Sesión de Cardio / Ver Meta ➔
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-red-950/30 to-dark-900 border border-red-500/30">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wider">
                    Regla de Oro Anti-Catabolismo
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    ¿Sales a correr? Limítate a <strong>15-20 min suaves</strong> para evitar quemar la masa muscular que estás construyendo en tus brazos.
                  </p>
                  <button
                    onClick={onOpenCardioModal}
                    className="mt-2.5 text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                  >
                    Registrar Cardio / Ver Alerta ➔
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Miranda Anti-Craving & Cholesterol Widget on Dashboard */}
      {isMiranda && (
        <div className="mt-4">
          <MirandaAntiCravingWidget />
        </div>
      )}
    </div>
  );
};
