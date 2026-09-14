import type { BioReadinessCheck } from '../types';

export interface ReadinessInput {
  dateStr: string;
  sleepHours: number;
  bedTimeHour: number; // 0 a 23
  wakeTimeHour: number; // 0 a 23
  mealsCountToday: number;
  caloriesConsumedToday?: number;
  hadSugarCrashRisk: boolean;
  cigarettesToday: number;
  waterLitersToday: number;
  currentFeeling: 1 | 2 | 3 | 4 | 5;
  hasTremorsOrDizziness: boolean;
}

export function calculateBioReadiness(input: ReadinessInput): BioReadinessCheck {
  let score = 100;
  const warnings: string[] = [];

  // 1. EVALUACIÓN DE SUEÑO Y RITMO CIRCADIANO (Ponderación 30%)
  if (input.sleepHours < 6) {
    score -= 22;
    warnings.push('Sueño insuficiente (< 6 horas): síntesis proteica y recuperación del SNC deprimidas.');
  } else if (input.sleepHours < 7.5) {
    score -= 10;
  }

  // Desfasaje circadiano severo (ej. acostarse de 3 AM a 7 AM)
  const isLateBedtime = input.bedTimeHour >= 3 && input.bedTimeHour <= 7;
  if (isLateBedtime) {
    score -= 20;
    warnings.push('Desfasaje circadiano (acostarse de madrugada): altera la curva de cortisol y deja el sistema nervioso desincronizado.');
  }

  if (input.wakeTimeHour >= 13) {
    score -= 8;
  }

  // 2. COMBUSTIBLE, GLUCÓGENO Y AZÚCARES SIMPLES (Ponderación 35%)
  if (input.hadSugarCrashRisk) {
    score -= 25;
    warnings.push('Riesgo de hipoglucemia reactiva: comer azúcares/galletitas solas con el estómago vacío produce un desplome brusco de glucosa que debilita los músculos en minutos.');
  }

  if (input.mealsCountToday === 0) {
    score -= 30;
    warnings.push('Ayuno absoluto pre-entreno: glucógeno muscular y hepático en niveles críticos.');
  } else if (input.mealsCountToday === 1) {
    score -= 15;
    warnings.push('Solo 1 comida previa: volumen calórico bajo para levantar cargas de forma segura.');
  }

  // 3. OXIGENACIÓN & NICOTINA (Ponderación 20%)
  if (input.cigarettesToday >= 12) {
    score -= 25;
    warnings.push('Hipoxia celular & vasoconstricción alta (+12 cigarrillos): el monóxido de carbono satura la hemoglobina y asfixia a las fibras musculares, acelerando el fallo en la serie 2.');
  } else if (input.cigarettesToday >= 6) {
    score -= 15;
    warnings.push('Carga de nicotina moderada: flujo sanguíneo periférico restringido en los brazos.');
  } else if (input.cigarettesToday >= 2) {
    score -= 6;
  }

  // 4. HIDRATACIÓN & ELECTROLITOS (Ponderación 15%)
  if (input.waterLitersToday < 1.0) {
    score -= 16;
    warnings.push('Deshidratación celular (< 1L de agua): menor volumen de sangre, baja presión y mayor propensión a temblores.');
  } else if (input.waterLitersToday < 1.8) {
    score -= 6;
  }

  // 5. SÍNTOMAS DIRECTOS DE FATIGA CENTRAL
  if (input.hasTremorsOrDizziness) {
    score -= 24;
    warnings.push('Temblores musculares o mareo: señal de auxilio de nervios periféricos por depleción de acetilcolina y sales minerales.');
  }

  // Sensación subjetiva
  if (input.currentFeeling === 1) score -= 18;
  else if (input.currentFeeling === 2) score -= 10;
  else if (input.currentFeeling === 4) score += 4;
  else if (input.currentFeeling === 5) score += 8;

  // Clampear entre 10 y 100
  const finalScore = Math.max(10, Math.min(100, Math.round(score)));

  // Determinar Estado y Recomendación
  if (finalScore < 50 || input.hasTremorsOrDizziness) {
    const isTotalExhaustion = finalScore < 38 || input.hasTremorsOrDizziness;
    return {
      dateStr: input.dateStr,
      sleepHours: input.sleepHours,
      bedTimeHour: input.bedTimeHour,
      wakeTimeHour: input.wakeTimeHour,
      mealsCountToday: input.mealsCountToday,
      hadSugarCrashRisk: input.hadSugarCrashRisk,
      cigarettesToday: input.cigarettesToday,
      waterLitersToday: input.waterLitersToday,
      currentFeeling: input.currentFeeling,
      hasTremorsOrDizziness: input.hasTremorsOrDizziness,
      readinessScore: finalScore,
      status: 'critico',
      coachTitle: '🔴 Batería Biológica Crítica — Modo Rescate',
      coachMessage: warnings.length > 0 
        ? warnings.join(' • ') 
        : 'Tu cuerpo está en déficit de glucógeno y oxígeno. Forzar la rutina hoy provocaría fallos prematuros y temblores.',
      recommendedAction: isTotalExhaustion ? 'descanso_obligatorio' : 'descarga_movilidad',
      adaptedSets: isTotalExhaustion ? 0 : 1,
      adaptedRestSeconds: 120
    };
  }

  if (finalScore < 78) {
    return {
      dateStr: input.dateStr,
      sleepHours: input.sleepHours,
      bedTimeHour: input.bedTimeHour,
      wakeTimeHour: input.wakeTimeHour,
      mealsCountToday: input.mealsCountToday,
      hadSugarCrashRisk: input.hadSugarCrashRisk,
      cigarettesToday: input.cigarettesToday,
      waterLitersToday: input.waterLitersToday,
      currentFeeling: input.currentFeeling,
      hasTremorsOrDizziness: input.hasTremorsOrDizziness,
      readinessScore: finalScore,
      status: 'moderado',
      coachTitle: '🟡 Batería Moderada — Calibración con Precaución',
      coachMessage: (warnings.length > 0 ? warnings.join(' • ') + ' • ' : '') + 
        'Recomendación del Coach: Tomate 300 ml de agua y comé un carbohidrato rápido (banana o tostada con miel) antes de tocar una mancuerna. Descansos ampliados a 120s.',
      recommendedAction: 'entrenar_reducido',
      adaptedSets: 2,
      adaptedRestSeconds: 120
    };
  }

  return {
    dateStr: input.dateStr,
    sleepHours: input.sleepHours,
    bedTimeHour: input.bedTimeHour,
    wakeTimeHour: input.wakeTimeHour,
    mealsCountToday: input.mealsCountToday,
    hadSugarCrashRisk: input.hadSugarCrashRisk,
    cigarettesToday: input.cigarettesToday,
    waterLitersToday: input.waterLitersToday,
    currentFeeling: input.currentFeeling,
    hasTremorsOrDizziness: input.hasTremorsOrDizziness,
    readinessScore: finalScore,
    status: 'optimo',
    coachTitle: '🟢 Batería Biológica Óptima — Luz Verde para Hipertrofia',
    coachMessage: 'Tanque cargado de glucógeno, hidratación correcta y sistema nervioso fresco. Adelante con tus 2 series de trabajo con agarre neutro.',
    recommendedAction: 'entrenar_normal',
    adaptedSets: 2,
    adaptedRestSeconds: 90
  };
}
