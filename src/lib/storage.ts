import type { UserProfile, DailyLog, BodyMeasurement, UserId } from '../types';

export const STORAGE_KEYS = {
  ACTIVE_USER: 'arm60_active_user_id',
  USER_PROFILE: (id: UserId) => `arm60_user_${id}_profile`,
  USER_LOGS: (id: UserId) => `arm60_user_${id}_daily_logs`,
  USER_MEASUREMENTS: (id: UserId) => `arm60_user_${id}_measurements`,
};

export const DEFAULT_TOMAS_PROFILE: UserProfile = {
  id: 'tomas',
  name: 'Tomás',
  age: 26,
  gender: 'male',
  weightKg: 70, // Peso actual: 70 kg
  heightCm: 179, // Altura: 1.79 m
  startArmCm: 0, // En 0 hasta registrar primera medición
  currentArmCm: 0,
  targetArmCm: 0,
  startWeightKg: 70,
  currentWeightKg: 70,
  targetWeightKg: 74.0,
  tdeeMaintenance: 2300,
  targetCalories: 2650, // Superávit diario fijo
  targetSurplusCalories: 2650,
  calorieMode: 'surplus',
  targetProteinGrams: 145, // 140 - 150g (2.0 g/kg)
  targetCarbsGrams: 340,
  targetFatsGrams: 75,
  targetSteps: 8000,
  targetWaterLiters: 3.2, // 3.2L / día para hipertrofia, síntesis proteica con 140-150g prote y volumen celular
  dietaryRestrictions: [],
  healthNotes: 'Foco exclusivo en hipertrofia de brazos (60% tríceps, bíceps & braquial) con mancuernas de 6 kg (15-25 reps, tempo 3-1-1).',
  startDateISO: new Date().toISOString(),
  currentDay: 1,
};

export const DEFAULT_MIRANDA_PROFILE: UserProfile = {
  id: 'miranda',
  name: 'Miranda',
  age: 27,
  gender: 'female',
  weightKg: 62, // Peso inicial: 62 kg
  heightCm: 155, // Altura: 1.55 m
  startArmCm: 0,
  currentArmCm: 0,
  targetArmCm: 0,
  startWeightKg: 62,
  currentWeightKg: 62,
  targetWeightKg: 55.0, // Meta: 55 kg
  tdeeMaintenance: 1750,
  targetCalories: 1425, // Déficit moderado para perder grasa de forma progresiva
  targetSurplusCalories: 1425,
  calorieMode: 'deficit',
  targetProteinGrams: 100, // 95 - 105g (~1.6 g/kg)
  targetCarbsGrams: 135, // Carbohidratos complejos ricos en fibra
  targetFatsGrams: 42, // Grasas saludables insaturadas
  targetSteps: 7000, // 6.000 a 8.000 pasos/día para salud cardiovascular y NEAT
  targetWaterLiters: 2.2, // 2.2L / día para saciedad, control de antojos post-comida y fibra/colesterol
  dietaryRestrictions: ['sin_palta', 'bajo_colesterol_saturado'],
  healthNotes: 'Colesterol elevado. Exclusión total de palta/aguacate. Control de ansiedad por dulces post-comida con infusiones y fibra.',
  startDateISO: new Date().toISOString(),
  currentDay: 1,
};

// Retrocompatibilidad
export const DEFAULT_PROFILE = DEFAULT_TOMAS_PROFILE;
export const DEFAULT_MEASUREMENTS: BodyMeasurement[] = [];

export function loadActiveUserId(): UserId {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (saved === 'miranda' || saved === 'tomas') {
      return saved;
    }
  } catch (e) {
    console.error('Error loading active user id', e);
  }
  return 'tomas';
}

export function saveActiveUserId(userId: UserId): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, userId);
  } catch (e) {
    console.error('Error saving active user id', e);
  }
}

export function loadProfile(userId?: UserId): UserProfile {
  const activeId = userId || loadActiveUserId();
  const key = STORAGE_KEYS.USER_PROFILE(activeId);
  const defaultObj = activeId === 'miranda' ? DEFAULT_MIRANDA_PROFILE : DEFAULT_TOMAS_PROFILE;

  try {
    const data = localStorage.getItem(key);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...defaultObj, ...parsed, id: activeId };
    }

    // Migración transparente si viene de la versión anterior mono-usuario de Tomás
    if (activeId === 'tomas') {
      const oldV3 = localStorage.getItem('arm60_clean_v3_profile');
      if (oldV3) {
        const parsedOld = JSON.parse(oldV3);
        const migrated = { ...DEFAULT_TOMAS_PROFILE, ...parsedOld, id: 'tomas' as UserId };
        saveProfile(migrated, 'tomas');
        return migrated;
      }
    }
  } catch (e) {
    console.error(`Error loading profile for ${activeId}`, e);
  }

  saveProfile(defaultObj, activeId);
  return defaultObj;
}

export function saveProfile(profile: UserProfile, userId?: UserId): void {
  const targetId = userId || profile.id || loadActiveUserId();
  const key = STORAGE_KEYS.USER_PROFILE(targetId);
  try {
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (e) {
    console.error(`Error saving profile for ${targetId}`, e);
  }
}

export function loadDailyLogs(userId?: UserId): Record<string, DailyLog> {
  const activeId = userId || loadActiveUserId();
  const key = STORAGE_KEYS.USER_LOGS(activeId);

  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    // Migración retroactiva para Tomás
    if (activeId === 'tomas') {
      const oldLogs = localStorage.getItem('arm60_clean_v3_daily_logs');
      if (oldLogs) {
        const parsed = JSON.parse(oldLogs);
        saveDailyLogs(parsed, 'tomas');
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Error loading daily logs for ${activeId}`, e);
  }

  const emptyLogs: Record<string, DailyLog> = {};
  saveDailyLogs(emptyLogs, activeId);
  return emptyLogs;
}

export function saveDailyLogs(logs: Record<string, DailyLog>, userId?: UserId): void {
  const targetId = userId || loadActiveUserId();
  const key = STORAGE_KEYS.USER_LOGS(targetId);
  try {
    localStorage.setItem(key, JSON.stringify(logs));
  } catch (e) {
    console.error(`Error saving daily logs for ${targetId}`, e);
  }
}

export function loadMeasurements(userId?: UserId): BodyMeasurement[] {
  const activeId = userId || loadActiveUserId();
  const key = STORAGE_KEYS.USER_MEASUREMENTS(activeId);

  try {
    const data = localStorage.getItem(key);
    if (data) return JSON.parse(data);

    // Migración retroactiva para Tomás
    if (activeId === 'tomas') {
      const oldMeas = localStorage.getItem('arm60_clean_v3_measurements');
      if (oldMeas) {
        const parsed = JSON.parse(oldMeas);
        saveMeasurements(parsed, 'tomas');
        return parsed;
      }
    }
  } catch (e) {
    console.error(`Error loading measurements for ${activeId}`, e);
  }

  saveMeasurements(DEFAULT_MEASUREMENTS, activeId);
  return DEFAULT_MEASUREMENTS;
}

export function saveMeasurements(measurements: BodyMeasurement[], userId?: UserId): void {
  const targetId = userId || loadActiveUserId();
  const key = STORAGE_KEYS.USER_MEASUREMENTS(targetId);
  try {
    localStorage.setItem(key, JSON.stringify(measurements));
  } catch (e) {
    console.error(`Error saving measurements for ${targetId}`, e);
  }
}

export function resetUserData(userId: UserId): { profile: UserProfile; dailyLogs: Record<string, DailyLog>; measurements: BodyMeasurement[] } {
  const profileKey = STORAGE_KEYS.USER_PROFILE(userId);
  const logsKey = STORAGE_KEYS.USER_LOGS(userId);
  const measKey = STORAGE_KEYS.USER_MEASUREMENTS(userId);

  try {
    localStorage.removeItem(profileKey);
    localStorage.removeItem(logsKey);
    localStorage.removeItem(measKey);
  } catch (e) {
    console.error(`Error resetting data for user ${userId}`, e);
  }

  const defaultObj = userId === 'miranda' ? DEFAULT_MIRANDA_PROFILE : DEFAULT_TOMAS_PROFILE;
  const freshProfile = { ...defaultObj, startDateISO: new Date().toISOString() };
  saveProfile(freshProfile, userId);
  saveDailyLogs({}, userId);
  saveMeasurements([], userId);

  return {
    profile: freshProfile,
    dailyLogs: {},
    measurements: []
  };
}

export function resetAllData(): { profile: UserProfile; dailyLogs: Record<string, DailyLog>; measurements: BodyMeasurement[] } {
  const activeId = loadActiveUserId();
  return resetUserData(activeId);
}

export function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}
