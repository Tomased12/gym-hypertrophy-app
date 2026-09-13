import { useState, useEffect } from 'react';
import { Navbar, type TabType } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { WorkoutTab } from './components/WorkoutTab';
import { NutritionTab } from './components/NutritionTab';
import { CalendarTab } from './components/CalendarTab';
import { ProgressTab } from './components/ProgressTab';
import { RestTimerModal } from './components/RestTimerModal';
import { CardioModal } from './components/CardioModal';

import { 
  loadActiveUserId,
  saveActiveUserId,
  loadProfile, 
  saveProfile, 
  loadDailyLogs, 
  saveDailyLogs, 
  loadMeasurements, 
  saveMeasurements,
  resetUserData,
  getTodayDateStr
} from './lib/storage';
import type { UserProfile, DailyLog, BodyMeasurement, MealEntry, CardioLog, UserId } from './types';
import { getRoutineForUser } from './lib/workoutPlan';
import { playBeep } from './lib/sound';
import { RotateCcw, X } from 'lucide-react';

export function App() {
  const [activeUserId, setActiveUserId] = useState<UserId>(loadActiveUserId);
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile(activeUserId));
  const [dailyLogs, setDailyLogs] = useState<Record<string, DailyLog>>(() => loadDailyLogs(activeUserId));
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => loadMeasurements(activeUserId));
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals state
  const [isCardioModalOpen, setIsCardioModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [restTimer, setRestTimer] = useState<{ isOpen: boolean; seconds: number; exerciseName: string }>({
    isOpen: false,
    seconds: 75,
    exerciseName: 'Descanso entre series'
  });

  const todayStr = getTodayDateStr();

  // Switch User Handler
  const handleSwitchUser = (newUserId: UserId) => {
    if (newUserId === activeUserId) return;
    
    // Save current user state before switching
    saveProfile(profile, activeUserId);
    saveDailyLogs(dailyLogs, activeUserId);
    saveMeasurements(measurements, activeUserId);

    // Switch and load new user state
    saveActiveUserId(newUserId);
    setActiveUserId(newUserId);
    setProfile(loadProfile(newUserId));
    setDailyLogs(loadDailyLogs(newUserId));
    setMeasurements(loadMeasurements(newUserId));
    playBeep('tick');
  };

  // Ensure today's log exists for the active user
  const todayLog: DailyLog = dailyLogs[todayStr] || {
    dateStr: todayStr,
    dayNumber: profile.currentDay,
    workoutCompleted: false,
    nutritionTargetMet: false,
    cardioCompleted: false,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatsConsumed: 0,
    meals: [],
    cardioLogs: [],
    waterLiters: 0,
    stepsCount: 0
  };

  // Sync to localStorage
  useEffect(() => {
    saveProfile(profile, activeUserId);
  }, [profile, activeUserId]);

  useEffect(() => {
    saveDailyLogs(dailyLogs, activeUserId);
  }, [dailyLogs, activeUserId]);

  useEffect(() => {
    saveMeasurements(measurements, activeUserId);
  }, [measurements, activeUserId]);

  // Update today's log
  const handleUpdateTodayLog = (updates: Partial<DailyLog>) => {
    setDailyLogs(prev => {
      const current = prev[todayStr] || todayLog;
      const updated = { ...current, ...updates };
      return { ...prev, [todayStr]: updated };
    });
  };

  // Update specific day log (e.g. from calendar)
  const handleUpdateDayLog = (dateStr: string, updates: Partial<DailyLog>) => {
    setDailyLogs(prev => {
      const current = prev[dateStr] || {
        dateStr,
        dayNumber: 1,
        workoutCompleted: false,
        nutritionTargetMet: false,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatsConsumed: 0,
        meals: [],
        cardioLogs: [],
        waterLiters: 0,
        stepsCount: 0
      };
      return { ...prev, [dateStr]: { ...current, ...updates } };
    });
  };

  // Add meal with user-specific target evaluation
  const handleAddMeal = (meal: MealEntry) => {
    const updatedMeals = [meal, ...(todayLog.meals || [])];
    const totalCal = updatedMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProt = Math.round(updatedMeals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
    const totalCarb = Math.round(updatedMeals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
    const totalFat = Math.round(updatedMeals.reduce((acc, m) => acc + m.fats, 0) * 10) / 10;

    const isMiranda = profile.id === 'miranda';
    const targetCals = isMiranda
      ? (profile.targetCalories === 1425 ? 1380 : (profile.targetCalories || 1380))
      : (profile.targetCalories || profile.targetSurplusCalories || 2650);
    const targetProt = profile.targetProteinGrams || (isMiranda ? 100 : 140);

    const nutritionMet = isMiranda
      ? totalCal <= targetCals && totalProt >= targetProt
      : totalCal >= targetCals && totalProt >= targetProt;

    handleUpdateTodayLog({
      meals: updatedMeals,
      caloriesConsumed: totalCal,
      proteinConsumed: totalProt,
      carbsConsumed: totalCarb,
      fatsConsumed: totalFat,
      nutritionTargetMet: nutritionMet
    });
  };

  // Delete meal
  const handleDeleteMeal = (mealId: string) => {
    const updatedMeals = (todayLog.meals || []).filter(m => m.id !== mealId);
    const totalCal = updatedMeals.reduce((acc, m) => acc + m.calories, 0);
    const totalProt = Math.round(updatedMeals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
    const totalCarb = Math.round(updatedMeals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
    const totalFat = Math.round(updatedMeals.reduce((acc, m) => acc + m.fats, 0) * 10) / 10;

    const isMiranda = profile.id === 'miranda';
    const targetCals = isMiranda
      ? (profile.targetCalories === 1425 ? 1380 : (profile.targetCalories || 1380))
      : (profile.targetCalories || profile.targetSurplusCalories || 2650);
    const targetProt = profile.targetProteinGrams || (isMiranda ? 100 : 140);

    const nutritionMet = isMiranda
      ? totalCal <= targetCals && totalProt >= targetProt
      : totalCal >= targetCals && totalProt >= targetProt;

    handleUpdateTodayLog({
      meals: updatedMeals,
      caloriesConsumed: totalCal,
      proteinConsumed: totalProt,
      carbsConsumed: totalCarb,
      fatsConsumed: totalFat,
      nutritionTargetMet: nutritionMet
    });
  };

  // Add cardio log
  const handleSaveCardio = (log: CardioLog, markCompleted?: boolean) => {
    const updatedCardio = [log, ...(todayLog.cardioLogs || [])];
    const updates: Partial<DailyLog> = { cardioLogs: updatedCardio };
    if (typeof markCompleted === 'boolean') {
      updates.cardioCompleted = markCompleted;
    }
    handleUpdateTodayLog(updates);
  };

  // Add body measurement
  const handleAddMeasurement = (meas: BodyMeasurement) => {
    setMeasurements(prev => {
      const isFirst = prev.length === 0;
      setProfile(p => ({
        ...p,
        startArmCm: isFirst && meas.armCircumference ? meas.armCircumference : p.startArmCm,
        currentArmCm: meas.armCircumference ?? p.currentArmCm,
        targetArmCm: isFirst && meas.armCircumference ? Number((meas.armCircumference + 3.0).toFixed(1)) : p.targetArmCm,
        currentWeightKg: meas.bodyWeight,
        weightKg: meas.bodyWeight
      }));
      return [...prev, meas];
    });
  };

  // Trigger rest timer
  const handleStartRestTimer = (seconds: number, exerciseName: string) => {
    setRestTimer({
      isOpen: true,
      seconds,
      exerciseName
    });
  };

  // Reset current active user challenge
  const handleConfirmReset = () => {
    const fresh = resetUserData(activeUserId);
    setProfile(fresh.profile);
    setDailyLogs(fresh.dailyLogs);
    setMeasurements(fresh.measurements);
    setIsResetModalOpen(false);
    setCurrentTab('dashboard');
    playBeep('success');
  };

  // Consistency rate calculation (3 daily pillars: Workout, Nutrition, Cardio)
  let successfulDays = 0;
  for (let d = 1; d <= profile.currentDay; d++) {
    const dDate = new Date(new Date(profile.startDateISO).getTime() + (d - 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const log = dailyLogs[dDate];
    const routine = getRoutineForUser(profile.id, d);

    const hasWorkout = !!log?.workoutCompleted;
    const hasNutrition = !!log?.nutritionTargetMet;
    const hasCardio = !!log?.cardioCompleted || (profile.id === 'miranda' && (log?.stepsCount || 0) >= (profile.targetSteps || 8000));

    if (routine.isRestDay) {
      if (hasNutrition && hasCardio) successfulDays++;
      else if (hasNutrition || hasCardio) successfulDays += 0.5;
    } else {
      const itemsDone = (hasWorkout ? 1 : 0) + (hasNutrition ? 1 : 0) + (hasCardio ? 1 : 0);
      successfulDays += itemsDone / 3;
    }
  }
  const consistencyRate = profile.currentDay > 0 
    ? Math.round((successfulDays / profile.currentDay) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        dayNumber={profile.currentDay}
        consistencyRate={consistencyRate}
        activeUserId={activeUserId}
        onSwitchUser={handleSwitchUser}
        onOpenCardioModal={() => setIsCardioModalOpen(true)}
        onResetRequest={() => setIsResetModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardTab
            profile={profile}
            todayLog={todayLog}
            measurements={measurements}
            onNavigateTab={setCurrentTab}
            onUpdateTodayLog={handleUpdateTodayLog}
            onOpenCardioModal={() => setIsCardioModalOpen(true)}
            consistencyRate={consistencyRate}
          />
        )}

        {currentTab === 'workout' && (
          <WorkoutTab
            userId={profile.id}
            currentCycleDay={profile.currentDay}
            isWorkoutCompletedToday={todayLog.workoutCompleted}
            onToggleWorkoutCompleted={(completed) => handleUpdateTodayLog({ workoutCompleted: completed })}
            onStartRestTimer={handleStartRestTimer}
          />
        )}

        {currentTab === 'nutrition' && (
          <NutritionTab
            profile={profile}
            meals={todayLog.meals || []}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {currentTab === 'calendar' && (
          <CalendarTab
            userId={profile.id}
            dailyLogs={dailyLogs}
            currentDayNumber={profile.currentDay}
            startDateISO={profile.startDateISO}
            onUpdateDayLog={handleUpdateDayLog}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressTab
            profile={profile}
            measurements={measurements}
            onAddMeasurement={handleAddMeasurement}
            currentCycleDay={profile.currentDay}
          />
        )}
      </main>

      {/* Floating Rest Timer HUD */}
      <RestTimerModal
        isOpen={restTimer.isOpen}
        initialSeconds={restTimer.seconds}
        exerciseName={restTimer.exerciseName}
        onClose={() => setRestTimer(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Individualized Cardio Modal */}
      <CardioModal
        isOpen={isCardioModalOpen}
        onClose={() => setIsCardioModalOpen(false)}
        onSaveCardio={handleSaveCardio}
        recentCardioLogs={todayLog.cardioLogs || []}
        profile={profile}
        isCardioCompletedToday={todayLog.cardioCompleted}
        onToggleCardioCompleted={(completed) => handleUpdateTodayLog({ cardioCompleted: completed })}
      />

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-dark-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 mb-4">
              <RotateCcw className="w-6 h-6" />
            </div>

            <h3 className="font-heading font-black text-xl text-white">
              ¿Reiniciar el Reto de {profile.name} a Día 1?
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Esta acción pondrá en cero exclusivamente el perfil de <strong>{profile.name}</strong> (sin alterar el perfil del otro usuario):
            </p>
            <ul className="text-xs text-slate-400 mt-2 space-y-1 list-disc list-inside">
              <li>El contador volverá a <strong>Día 1 de 60</strong>.</li>
              <li>Se borrarán las comidas registradas y el checklist de hoy de {profile.name}.</li>
              <li>El historial de medidas de {profile.name} se vaciará para cargar la medida inicial real.</li>
            </ul>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsResetModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-700 text-xs font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/30"
              >
                Sí, Reiniciar Perfil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
