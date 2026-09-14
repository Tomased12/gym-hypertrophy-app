export type UserId = 'tomas' | 'miranda';

export type GoalType = 'hipertrofia_brazos' | 'deficit_tonificacion';

export type MuscleTarget = 
  | 'Tríceps (60% del brazo)'
  | 'Bíceps'
  | 'Braquial & Antebrazos'
  | 'Soporte Pectoral / Hombros'
  | 'Soporte Espalda / Tracción'
  | 'Glúteos & Piernas (Bajo Impacto)'
  | 'Cadena Posterior & Isquios'
  | 'Core & Abdomen'
  | 'Hombros & Brazos Firmes';

export type EquipmentType = 
  | 'Mancuernas' 
  | 'Silla' 
  | 'Colchoneta' 
  | 'Mancuernas + Silla' 
  | 'Mancuernas + Colchoneta' 
  | 'Silla + Colchoneta' 
  | 'Peso Corporal';

export interface Exercise {
  id: string;
  name: string;
  muscleTarget: MuscleTarget;
  equipment: EquipmentType;
  sets: number;
  reps: string;
  tempo: string; // Ej: 3s bajada / 1s pausa isométrica
  restSeconds: number;
  rpe: string;
  setupTime: string;
  technique: string;
  biomechanicCues: string[];
  mistakesToAvoid: string[];
  videoEmbedUrl?: string;
  videoTitle?: string;
  animationUrl?: string;
  animationFrames?: [string, string];
  visualCue?: string;
}

export interface DayRoutine {
  dayOfWeek: number; // 1 to 7
  title: string;
  tagline: string;
  isRestDay: boolean;
  focusMuscles: string[];
  estimatedMinutes: number;
  recoveryNote?: string;
  exercises: Exercise[];
}

export interface RecognizedFoodItem {
  name: string;
  quantityStr: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealEntry {
  id: string;
  timestamp: string;
  dateStr: string;
  rawText: string;
  mealType: 'Desayuno' | 'Almuerzo' | 'Merienda' | 'Cena' | 'Post-Entreno' | 'Snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recognizedItems: RecognizedFoodItem[];
}

export interface CardioLog {
  id: string;
  timestamp: string;
  durationMinutes: number;
  type: string;
  intensity: 'Ligera (Regenerativa)' | 'Moderada' | 'Intensa (Catabólica)';
  isWarning: boolean;
  coachWarning: string;
}

export interface BodyMeasurement {
  id: string;
  date: string;
  dayNumber: number; // 1 to 60
  armCircumference?: number; // cm (para Tomás)
  waistCircumference?: number; // cm (para Miranda)
  hipCircumference?: number; // cm (para Miranda)
  bodyWeight: number; // kg
  notes?: string;
}

export interface BioReadinessCheck {
  dateStr: string;
  sleepHours: number; // Horas de sueño
  bedTimeHour: number; // Hora en que se acostó (ej: 5 para las 5 AM, 23 para las 11 PM)
  wakeTimeHour: number; // Hora en que se levantó (ej: 14 para las 14:00)
  mealsCountToday: number; // Comidas realizadas antes de entrenar
  hadSugarCrashRisk: boolean; // ¿Consumió galletitas/golosinas/azúcar simple solo con estómago vacío?
  cigarettesToday: number; // Cantidad aproximada de cigarrillos
  waterLitersToday: number; // Litros de agua pura ingeridos
  currentFeeling: 1 | 2 | 3 | 4 | 5; // 1: Muy débil/temblores, 3: Normal, 5: Máxima energía
  hasTremorsOrDizziness: boolean; // ¿Siente temblores musculares o mareo?
  
  // Resultados generados por el algoritmo fisiológico
  readinessScore: number; // 0 - 100%
  status: 'optimo' | 'moderado' | 'critico';
  coachTitle: string;
  coachMessage: string;
  recommendedAction: 'entrenar_normal' | 'entrenar_reducido' | 'descarga_movilidad' | 'descanso_obligatorio';
  adaptedSets: number; // 2, 1, o 0
  adaptedRestSeconds: number; // 90s, 120s
}

export interface DailyLog {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number; // 1 to 60
  workoutCompleted: boolean;
  stretchingCompleted?: boolean;
  nutritionTargetMet: boolean;
  cardioCompleted?: boolean; // Cumplimiento de regla de cardio según perfil (Anti-catabolismo Tomás / Quema & Colesterol Miranda)
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatsConsumed: number;
  meals: MealEntry[];
  cardioLogs: CardioLog[];
  waterLiters: number;
  stepsCount?: number; // Pasos diarios (clave para Miranda)
  readinessCheck?: BioReadinessCheck; // Chequeo pre-entreno de fatiga, sueño, alimentación y nicotina
  notes?: string;
}

export interface UserProfile {
  id: UserId;
  name: string;
  age: number;
  gender: 'male' | 'female';
  weightKg: number;
  heightCm: number;
  startArmCm?: number;
  currentArmCm?: number;
  targetArmCm?: number;
  startWeightKg: number;
  currentWeightKg: number;
  targetWeightKg: number;
  tdeeMaintenance: number;
  targetCalories: number; // 2.650 kcal para Tomás (superávit) / 1.425 kcal para Miranda (déficit)
  targetSurplusCalories?: number; // Compatibilidad retroactiva
  calorieMode: 'surplus' | 'deficit';
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  targetSteps?: number; // Ej: 7.000 pasos para Miranda
  targetWaterLiters?: number; // 3.2L para Tomás / 2.2L para Miranda
  dietaryRestrictions: string[]; // Ej: ['sin_palta', 'colesterol_saludable']
  healthNotes?: string;
  startDateISO: string;
  currentDay: number; // 1 a 60
}
