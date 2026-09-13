import type { DayRoutine, Exercise } from '../types';

const DB_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export const MIRANDA_EXERCISE_LIBRARY: Record<string, Exercise> = {
  // 1. Sentadilla a la Silla (Box Squat) - Cuidado de rodillas y activación de cuádriceps/glúteo
  SENTADILLA_SILLA: {
    id: 'miranda_sentadilla_silla',
    name: 'Sentadilla a la Silla (Box Squat Controlado)',
    muscleTarget: 'Glúteos & Piernas (Bajo Impacto)',
    equipment: 'Silla',
    sets: 3,
    reps: '12 - 15 reps',
    tempo: '3s Bajada controlada • 1s Toque suave en silla • 1s Subida firme',
    restSeconds: 60,
    rpe: 'RPE 7.5 (Tensión controlada sin forzar articulaciones)',
    setupTime: 'Coloca una silla estable apoyada contra la pared para máxima seguridad.',
    technique: 'Párate frente a la silla a unos 10 cm con pies al ancho de hombros. Inicia el movimiento llevando la cadera hacia atrás como si fueras a sentarte. Desciende en 3 segundos lentos manteniendo el pecho erguido. Toca el asiento con los glúteos de forma sutil sin desplomarte y sube contrayendo los glúteos con fuerza en 1 segundo.',
    biomechanicCues: [
      'Cero impacto articular: la silla actúa como referencia de profundidad para no sobrecargar los meniscos.',
      'Rodillas alineadas con la punta de los pies en todo el recorrido.',
      'Aprieta los glúteos fuertemente al llegar arriba sin arquear la espalda baja.'
    ],
    mistakesToAvoid: [
      'Dejarse caer con todo el peso sobre la silla.',
      'Juntar las rodillas hacia adentro (valgo de rodilla) al levantarse.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Bodyweight_Squat/0.jpg`,
      `${DB_IMG_BASE}Bodyweight_Squat/1.jpg`
    ],
    videoEmbedUrl: 'aclHkVaku9U',
    videoTitle: 'Técnica de Box Squat en Silla para Principiantes',
    visualCue: 'La cadera va hacia atrás primero. Los talones nunca se despegan del suelo.'
  },

  // 2. Puente de Glúteos en Colchoneta (Glute Bridge) - Cero impacto en espalda baja
  PUENTE_GLUTEOS: {
    id: 'miranda_puente_gluteos',
    name: 'Puente de Glúteos en Colchoneta con Pausa Isométrica',
    muscleTarget: 'Glúteos & Piernas (Bajo Impacto)',
    equipment: 'Colchoneta',
    sets: 3,
    reps: '15 - 20 reps',
    tempo: '2s Subida • 2s Pausa isométrica arriba • 3s Bajada lenta',
    restSeconds: 60,
    rpe: 'RPE 8 (Activación y congestión muscular limpia)',
    setupTime: 'Acuéstate boca arriba sobre la colchoneta con rodillas flexionadas a 90°.',
    technique: 'Pies apoyados planos al ancho de caderas. Presiona los talones contra el suelo y eleva la pelvis hacia el techo hasta alinear rodillas, caderas y hombros. Aprieta intensamente los glúteos durante 2 segundos arriba. Desciende vértebra por vértebra en 3 segundos controlados.',
    biomechanicCues: [
      'Empuja desde los talones, no desde la punta de los pies.',
      'Mantén 2 segundos de contracción máxima arriba: clave para tonificación sin peso externo.',
      'Mantén el abdomen contraído para que no sea la espalda baja la que arquee.'
    ],
    mistakesToAvoid: [
      'Hiperextender la columna lumbar al subir.',
      'Hacer el movimiento rebotando rápidamente sin sostener la pausa arriba.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Glute_Bridge/0.jpg`,
      `${DB_IMG_BASE}Glute_Bridge/1.jpg`
    ],
    videoEmbedUrl: 'wPM8icPu6H8',
    videoTitle: 'Puente de Glúteos Técnico en Colchoneta',
    visualCue: 'Línea recta de rodilla a hombro en la cima. Glúteos contraídos como una roca durante 2s.'
  },

  // 3. Peso Muerto Rumano con Mancuernas de 6 kg (RDL) - Cadena posterior e isquios
  PESO_MUERTO_RUMANO: {
    id: 'miranda_peso_muerto_rumano',
    name: 'Peso Muerto Rumano con Mancuernas de 6 kg',
    muscleTarget: 'Cadena Posterior & Isquios',
    equipment: 'Mancuernas',
    sets: 3,
    reps: '12 - 15 reps',
    tempo: '3s Bajada excéntrica rozando muslos • 1s Subida',
    restSeconds: 60,
    rpe: 'RPE 7.5 (Estiramiento seguro de isquios)',
    setupTime: 'Toma una o ambas mancuernas de 6 kg con agarre cómodo y firme.',
    technique: 'De pie con pies al ancho de caderas y rodillas ligeramente flexionadas (desbloqueadas). Empuja los glúteos hacia la pared de atrás, manteniendo la espalda completamente neutra. Deja que las mancuernas desciendan rozando las piernas hasta justo debajo de las rodillas. Siente el estiramiento en la parte posterior del muslo y regresa empujando la cadera hacia adelante.',
    biomechanicCues: [
      'Bisagra de cadera pura: piensa en empujar una puerta con los glúteos hacia atrás.',
      'Las mancuernas siempre pegadas a las piernas, nunca separadas del cuerpo.',
      'Espalda recta y cuello alineado con la columna.'
    ],
    mistakesToAvoid: [
      'Curvar la espalda lumbar al bajar.',
      'Flexionar las rodillas como en una sentadilla.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Straight_Leg_Deadlift/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Straight_Leg_Deadlift/1.jpg`
    ],
    videoEmbedUrl: 'JCXUYuzwNrM',
    videoTitle: 'Peso Muerto Rumano con Mancuernas para Principiantes',
    visualCue: 'La cadera va hacia atrás. Las mancuernas descienden pegadas a las tibias.'
  },

  // 4. Flexiones Inclinadas en Silla (Incline Push-ups) - Tono en pecho, hombros y tríceps
  FLEXIONES_INCLINADAS_SILLA: {
    id: 'miranda_flexiones_inclinadas',
    name: 'Flexiones Inclinadas Apoyada en Silla (Incline Push-up)',
    muscleTarget: 'Hombros & Brazos Firmes',
    equipment: 'Silla',
    sets: 3,
    reps: '10 - 12 reps',
    tempo: '3s Bajada al pecho • 1s Subida controlada',
    restSeconds: 60,
    rpe: 'RPE 8 (Firmeza en tren superior sin impacto articular)',
    setupTime: 'Coloca la silla contra la pared para que no resbale. Apoya las manos en el respaldo o asiento.',
    technique: 'Apoya las manos al ancho de los hombros sobre el respaldo (más fácil) o sobre el asiento de la silla (intermedio). Cuerpo en plancha recta de cabeza a talones. Desciende flexionando los codos a 45° en 3 segundos hasta acercar el pecho a la silla. Empuja firme para volver arriba.',
    biomechanicCues: [
      'La inclinación reduce la carga de peso corporal en un 40-50%, ideal para progresar sin dolor de muñecas.',
      'Codos orientados en flecha hacia atrás (45°), nunca en cruz (90°).',
      'Abdomen activo y glúteos contraídos para evitar que la cadera caiga.'
    ],
    mistakesToAvoid: [
      'Hundir la cintura o dejar la cadera arriba.',
      'Abrir los codos excesivamente.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Incline_Push-Up/0.jpg`,
      `${DB_IMG_BASE}Incline_Push-Up/1.jpg`
    ],
    videoEmbedUrl: '4dF1DOWzf20',
    videoTitle: 'Flexiones Inclinadas en Silla - Guía Técnica',
    visualCue: 'Cuerpo recto como una tabla. El pecho busca el borde de la silla con codos en flecha.'
  },

  // 5. Plancha Abdominal en Colchoneta (Isometric Plank) - Estabilidad y abdomen plano
  PLANCHA_ABDOMINAL: {
    id: 'miranda_plancha_abdominal',
    name: 'Plancha Abdominal Frontal en Colchoneta',
    muscleTarget: 'Core & Abdomen',
    equipment: 'Colchoneta',
    sets: 3,
    reps: '20 - 35 segundos',
    tempo: 'Tensión isométrica continua y respiración diafragmática',
    restSeconds: 45,
    rpe: 'RPE 8 (Activación profunda del transverso)',
    setupTime: 'Coloca la colchoneta sobre suelo firme.',
    technique: 'Apoya antebrazos en la colchoneta con los codos debajo de los hombros. Extiende las piernas y apoya las puntas de los pies (o rodillas si necesitas adaptar). Mantén el cuerpo en línea recta horizontal. Mete ligeramente el ombligo hacia la columna y respira con calma sin aguantar el aire.',
    biomechanicCues: [
      'Excelente ejercicio de bajo impacto cardiovascular y articular para fortalecer la faja natural abdominal.',
      'Activa glúteos y cuádriceps para estabilizar la pelvis.',
      'Respira hondo para ayudar al control de la ansiedad y estrés.'
    ],
    mistakesToAvoid: [
      'Dejar caer la cadera hacia el suelo (tensión lumbar).',
      'Elevar los glúteos formando una pirámide.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Front_Plank/0.jpg`,
      `${DB_IMG_BASE}Front_Plank/1.jpg`
    ],
    videoEmbedUrl: 'ASdvN_XEl_c',
    videoTitle: 'Plancha Abdominal Correcta',
    visualCue: 'Codos bajo los hombros. Cuerpo horizontal alineado sin arquear la zona lumbar.'
  },

  // 6. Elevaciones Laterales con Mancuernas de 6 kg (o peso adaptado) - Deltoides & postura
  ELEVACIONES_LATERALES: {
    id: 'miranda_elevaciones_laterales',
    name: 'Elevaciones Laterales Controladas (Tonificación Hombros)',
    muscleTarget: 'Hombros & Brazos Firmes',
    equipment: 'Mancuernas',
    sets: 3,
    reps: '12 - 15 reps',
    tempo: '2s Subida • 1s Pausa arriba • 3s Bajada lenta',
    restSeconds: 60,
    rpe: 'RPE 7.5 (Tono estético y postura erguida)',
    setupTime: 'Toma las mancuernas de 6 kg (puedes hacerlas de forma unilateral o sentado en la silla para mayor control).',
    technique: 'De pie o sentada en la silla con espalda recta. Brazos a los costados con ligera flexión de codos (15°). Eleva los brazos hacia los laterales en el plano escapular (ligeramente hacia adelante) hasta la altura de los hombros. Sostén 1 segundo y desciende en 3 segundos lentos.',
    biomechanicCues: [
      'Piensa en empujar los codos hacia las paredes laterales, no levantar con las muñecas.',
      'Bajar en 3 segundos produce una estimulación metabólica fantástica para tonificar sin volumen excesivo.',
      'Hombros lejos de las orejas, sin encoger el trapecio.'
    ],
    mistakesToAvoid: [
      'Balancear el tronco para subir el peso.',
      'Subir las mancuernas por encima de la altura de los hombros.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Side_Lateral_Raise/0.jpg`,
      `${DB_IMG_BASE}Side_Lateral_Raise/1.jpg`
    ],
    videoEmbedUrl: '3VcKaXpzqRo',
    videoTitle: 'Elevaciones Laterales Correctas',
    visualCue: 'Codos ligeramente flexionados, elevación suave hasta la altura del hombro en 2s y bajada en 3s.'
  }
};

export const MIRANDA_WEEKLY_TEMPLATE: DayRoutine[] = [
  {
    dayOfWeek: 1,
    title: 'Día 1: Tonificación Full-Body A (Fuerza & Postura)',
    tagline: 'Sentadillas en Silla + Flexiones Inclinadas + Plancha + Pasos Diarios',
    isRestDay: false,
    focusMuscles: ['Cuádriceps & Glúteos', 'Pectoral & Brazos', 'Core'],
    estimatedMinutes: 35,
    recoveryNote: 'Sesión suave y progresiva. Recuerda tomar agua y mantener el tempo de 3s en cada descenso.',
    exercises: [
      MIRANDA_EXERCISE_LIBRARY.SENTADILLA_SILLA,
      MIRANDA_EXERCISE_LIBRARY.FLEXIONES_INCLINADAS_SILLA,
      MIRANDA_EXERCISE_LIBRARY.PLANCHA_ABDOMINAL
    ]
  },
  {
    dayOfWeek: 2,
    title: 'Día 2: Descanso Activo & Caminata Saludable',
    tagline: 'Meta: 6.000 a 8.000 pasos para salud cardiovascular y colesterol',
    isRestDay: true,
    focusMuscles: ['Cardiovascular', 'Salud Metabólica'],
    estimatedMinutes: 30,
    recoveryNote: 'Hoy no hay ejercicios de fuerza. Prioriza una caminata relajante de 30-45 minutos al aire libre o en cinta para sumar tus pasos y reducir el cortisol.',
    exercises: []
  },
  {
    dayOfWeek: 3,
    title: 'Día 3: Tonificación Full-Body B (Cadena Posterior & Hombros)',
    tagline: 'Puente de Glúteos + Peso Muerto Rumano + Elevaciones Laterales',
    isRestDay: false,
    focusMuscles: ['Glúteos & Isquios', 'Hombros & Brazos Firmes'],
    estimatedMinutes: 35,
    recoveryNote: 'Excelente para tonificar glúteos y mejorar la postura de la espalda y hombros sin impacto articular.',
    exercises: [
      MIRANDA_EXERCISE_LIBRARY.PUENTE_GLUTEOS,
      MIRANDA_EXERCISE_LIBRARY.PESO_MUERTO_RUMANO,
      MIRANDA_EXERCISE_LIBRARY.ELEVACIONES_LATERALES
    ]
  },
  {
    dayOfWeek: 4,
    title: 'Día 4: Descanso Regenerativo & Movilidad',
    tagline: 'Caminar relajada + Estiramientos suaves + Hidratación',
    isRestDay: true,
    focusMuscles: ['Regeneración & Movilidad Articular'],
    estimatedMinutes: 20,
    recoveryNote: 'Descanso activo: camina a ritmo cómodo para alcanzar tus 7.000 pasos. Toma una infusión de manzanilla o té verde para calmar el sistema nervioso.',
    exercises: []
  },
  {
    dayOfWeek: 5,
    title: 'Día 5: Circuito Funcional Integral (Quema & Tono)',
    tagline: 'Sentadilla en Silla + Puente de Glúteos + Flexiones Inclinadas + Plancha',
    isRestDay: false,
    focusMuscles: ['Cuerpo Completo', 'Core', 'Resistencia Muscular'],
    estimatedMinutes: 40,
    recoveryNote: 'Última sesión de fuerza de la semana. Haz 3 vueltas con calma, sintiendo cada músculo trabajar.',
    exercises: [
      MIRANDA_EXERCISE_LIBRARY.SENTADILLA_SILLA,
      MIRANDA_EXERCISE_LIBRARY.PUENTE_GLUTEOS,
      MIRANDA_EXERCISE_LIBRARY.FLEXIONES_INCLINADAS_SILLA,
      MIRANDA_EXERCISE_LIBRARY.PLANCHA_ABDOMINAL
    ]
  },
  {
    dayOfWeek: 6,
    title: 'Día 6: Descanso & Paseo Anti-Ansiedad',
    tagline: 'Caminata libre + Snack saludable saciante (sin palta)',
    isRestDay: true,
    focusMuscles: ['Equilibrio Emocional & Salud Vascular'],
    estimatedMinutes: 30,
    recoveryNote: 'Día libre de pesas. Si sientes antojo dulce tras comer, prepárate unas frutillas con canela o yogur 0% con una infusión caliente.',
    exercises: []
  },
  {
    dayOfWeek: 7,
    title: 'Día 7: Evaluación Semanal & Hábitos Saludables',
    tagline: 'Pesaje semanal en ayunas + Medición de cintura/cadera (cm)',
    isRestDay: true,
    focusMuscles: ['Evaluación & Planificación Semanal'],
    estimatedMinutes: 10,
    recoveryNote: 'Hoy revisamos el progreso en la balanza (hacia los 55 kg) y medimos cintura y cadera. ¡La consistencia es tu mayor aliada!',
    exercises: []
  }
];

export function getMirandaRoutineForCycleDay(dayNumber: number): DayRoutine {
  const dayIndex = (dayNumber - 1) % 7;
  const baseRoutine = MIRANDA_WEEKLY_TEMPLATE[dayIndex];

  const week = Math.ceil(dayNumber / 7);
  let phaseTag = `Fase 1 (Semanas 1-2): Adaptación Anatómica & Técnica Segura`;
  if (week >= 3 && week <= 4) phaseTag = `Fase 2 (Semanas 3-4): Quema Metabólica & Tempo Controlado`;
  if (week >= 5 && week <= 6) phaseTag = `Fase 3 (Semanas 5-6): Firmeza & Resistencia Muscular`;
  if (week >= 7) phaseTag = `Fase 4 (Semanas 7-8): Consolidación de Hábitos & 55 kg`;

  return {
    ...baseRoutine,
    title: `[Día ${dayNumber}/60] ${baseRoutine.title}`,
    tagline: `${phaseTag} • ${baseRoutine.tagline}`
  };
}
