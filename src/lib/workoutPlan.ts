import type { DayRoutine, Exercise, UserId } from '../types';
import { getMirandaRoutineForCycleDay } from './mirandaWorkoutPlan';

const DB_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export const EXERCISE_LIBRARY: Record<string, Exercise> = {
  // --- TRÍCEPS (60% DEL VOLUMEN DEL BRAZO) ---
  FONDOS_SILLA: {
    id: 'fondos_silla',
    name: 'Fondos de Tríceps en Silla (Bench Dips)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Silla',
    sets: 4,
    reps: '15 - 25 reps (RIR 1-2)',
    tempo: '3s Bajada excéntrica • 1s Pausa isométrica arriba • 1s Subida',
    restSeconds: 75,
    rpe: 'RPE 9 (Fallo técnico cercano)',
    setupTime: 'Coloca la silla firme contra la pared para evitar desplazamientos.',
    technique: 'Apoya las palmas en el borde frontal de la silla, codos orientados hacia atrás. Piernas extendidas o pies apoyados sobre la colchoneta. Desciende en 3 segundos estrictos flexionando los codos a 90° con la espalda rozando la silla. Sube y mantén 1 segundo de contracción isométrica máxima bloqueando con los tríceps.',
    biomechanicCues: [
      'TEMPO OBLIGATORIO: 3s de descenso excéntrico para maximizar micro-roturas miofibrilares.',
      '1 segundo de compresión isométrica en la parte más alta para bombeo vascular extremo.',
      'Codos pegados hacia atrás, sin abrir hacia los lados.'
    ],
    mistakesToAvoid: [
      'Alejar la pelvis de la silla (crea torsión lesiva en el manguito rotador anterior).',
      'Hacer repeticiones rápidas o con rebote sin respetar los 3 segundos de bajada.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Bench_Dips/0.jpg`,
      `${DB_IMG_BASE}Bench_Dips/1.jpg`
    ],
    videoEmbedUrl: 'c3ZGl4pAwZ4',
    videoTitle: 'Fondos de Tríceps en Silla - Técnica',
    visualCue: 'Codos cerrados apuntando directamente hacia atrás a 90°. La espalda desciende vertical rozando el asiento de la silla.'
  },

  PRESS_FRANCES_COLCHONETA: {
    id: 'press_frances_colchoneta',
    name: 'Press Francés en Colchoneta con Mancuernas de 6 kg',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 4,
    reps: '15 - 25 reps (RIR 1-2 o fallo)',
    tempo: '3s Bajada lenta • 1s Isometría en estiramiento y contracción',
    restSeconds: 75,
    rpe: 'RPE 9 (Máxima tensión metabólica con 6 kg)',
    setupTime: 'Acuéstate sobre la colchoneta con mancuernas de 6 kg en agarre neutro.',
    technique: 'Tumbado en la colchoneta, inclina los brazos 15° hacia atrás de la perpendicular para que la cabeza larga del tríceps permanezca bajo tensión continua. Flexiona los codos en 3 segundos bajando las mancuernas hacia las sienes/suelo. Pausa 1 segundo en el estiramiento y extiende con potencia, apretando 1 segundo.',
    biomechanicCues: [
      'Con 6 kg, el secreto es la lentitud: 3 segundos de bajada multiplican la carga interna percibida.',
      'La colchoneta actúa como seguro articular impidiendo sobre-extensión brusca del codo.',
      'Mantén los codos clavados en su ángulo, no dejes que oscilen hacia el pecho.'
    ],
    mistakesToAvoid: [
      'Mover el hombro en lugar de flexo-extender exclusivamente el codo.',
      'Subir con inercia o balanceo de torso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Lying_Dumbbell_Tricep_Extension/0.jpg`,
      `${DB_IMG_BASE}Lying_Dumbbell_Tricep_Extension/1.jpg`
    ],
    videoEmbedUrl: 'd_KZxkY_0cM',
    videoTitle: 'Floor Skullcrusher con Mancuernas',
    visualCue: 'Los brazos forman un ángulo de 75-80° hacia la cabeza, no perpendiculares. Las mancuernas bajan rozando las orejas.'
  },

  COPA_DOS_MANOS: {
    id: 'copa_dos_manos',
    name: 'Extensión Copa Sentado en Silla (Mancuerna 6 kg)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Silla',
    sets: 3,
    reps: '18 - 25 reps (Alto volumen)',
    tempo: '3s Bajada tras la nuca • 1s Pausa isométrica arriba',
    restSeconds: 75,
    rpe: 'RPE 8.5 (Quemazón profunda en cabeza larga)',
    setupTime: 'Siéntate erguido en la silla con abdomen contraído.',
    technique: 'Sujeta la mancuerna de 6 kg con ambas manos bajo el disco superior (o una en cada mano si buscas unilateral). Elévala sobre la cabeza. Desciende la mancuerna por detrás de la nuca en 3 segundos sintiendo el estiramiento máximo del tríceps. Pausa 1 segundo abajo y extiende hacia el techo con 1 segundo de contracción en el pico.',
    biomechanicCues: [
      'La cabeza larga del tríceps representa el mayor porcentaje de masa del brazo y solo se estira por encima de la cabeza.',
      'Excéntrica de 3 segundos para activar fibras tipo I y II mediante estrés metabólico.',
      'Espalda pegada y abdomen firme: no arquees la columna lumbar.'
    ],
    mistakesToAvoid: [
      'Abrir los codos en exceso como alas.',
      'Acelerar el movimiento cuando empiece la fatiga.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Standing_Dumbbell_Triceps_Extension/0.jpg`,
      `${DB_IMG_BASE}Standing_Dumbbell_Triceps_Extension/1.jpg`
    ],
    videoEmbedUrl: '_gsUck-7M74',
    videoTitle: 'Extensión de Tríceps Copa Sentado',
    visualCue: 'Estiramiento profundo en la nuca. Al extender, no permitas que los codos se abran como alas hacia los costados.'
  },

  PATADA_TRICEPS: {
    id: 'patada_triceps',
    name: 'Patada de Tríceps Apoyado en Silla (Kickback 6 kg)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Silla',
    sets: 3,
    reps: '15 - 20 reps por brazo',
    tempo: '3s Regreso controlado • 1.5s Pausa isométrica en contracción',
    restSeconds: 60,
    rpe: 'RPE 9.5 (Pico de contracción extrema)',
    setupTime: 'Apoya una rodilla y una mano en la silla manteniendo la espalda horizontal.',
    technique: 'Con la mancuerna de 6 kg, eleva el codo hasta que quede pegado a las costillas y paralelo al suelo. Extiende el antebrazo hacia atrás en línea recta. Mantén una contracción isométrica voluntaria durísima de 1.5 segundos con el brazo estirado. Regresa en 3 segundos lentos.',
    biomechanicCues: [
      'La patada es el único ejercicio donde el tríceps se acorta al 100% en posición anatómica de extensión completa.',
      'Con 6 kg, la pausa isométrica de 1.5 segundos arriba es donde ocurre la magia del estímulo.'
    ],
    mistakesToAvoid: [
      'Dejar caer el codo al retornar la mancuerna.',
      'Usar el impulso de rotación del torso para lanzar el peso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Tricep_Dumbbell_Kickback/0.jpg`,
      `${DB_IMG_BASE}Tricep_Dumbbell_Kickback/1.jpg`
    ],
    videoEmbedUrl: '6SS6K3lAwZ8',
    videoTitle: 'Patada de Tríceps con Mancuerna',
    visualCue: 'El codo queda congelado contra las costillas. Solo se mueve el antebrazo hasta la extensión horizontal completa.'
  },

  // --- BÍCEPS & BRAQUIAL ---
  CURL_SUPINO_MANCUERNAS: {
    id: 'curl_supino_mancuernas',
    name: 'Curl con Mancuernas de 6 kg con Supinación Continua',
    muscleTarget: 'Bíceps',
    equipment: 'Mancuernas',
    sets: 4,
    reps: '15 - 25 reps (Fallo técnico)',
    tempo: '3s Bajada excéntrica • 1s Giro y pausa isométrica arriba',
    restSeconds: 75,
    rpe: 'RPE 9',
    setupTime: 'De pie, pies al ancho de hombros, hombros hacia atrás y abajo.',
    technique: 'Sujeta las mancuernas de 6 kg. Al subir flexiona el codo mientras giras activamente la muñeca hacia afuera (supinación total). En la cima, gira la palma hacia el hombro elevando ligeramente el meñique y aprieta el bíceps 1 segundo en pausa isométrica. Baja en 3 segundos lentos sintiendo cómo el bíceps frena la carga.',
    biomechanicCues: [
      '3 segundos de bajada excéntrica: no dejes caer el peso tras completar la repetición.',
      'El bíceps es un músculo con alta respuesta al tiempo bajo tensión (TUT). 20 reps a 4s por rep = 80 segundos de estímulo anabólico puro.',
      'Codos pegados a los costados sin adelantarse.'
    ],
    mistakesToAvoid: [
      'Balancear la cadera o tirar la espalda hacia atrás.',
      'Perder la supinación antes de finalizar la bajada.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Bicep_Curl/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Bicep_Curl/1.jpg`
    ],
    videoEmbedUrl: 'ykJmrZ5v0Oo',
    videoTitle: 'Curl de Bíceps con Mancuernas y Supinación',
    visualCue: 'Inicio con agarre neutro, giro de supinación al pasar las caderas. El dedo meñique termina más alto que el pulgar.'
  },

  CURL_MARTILLO: {
    id: 'curl_martillo',
    name: 'Curl Martillo Estricto (Braquial & Antebrazo - 6 kg)',
    muscleTarget: 'Braquial & Antebrazos',
    equipment: 'Mancuernas',
    sets: 4,
    reps: '15 - 25 reps (RIR 1-2)',
    tempo: '3s Bajada • 1s Isometría arriba con palmas neutras',
    restSeconds: 75,
    rpe: 'RPE 9 (Clave para ensanchar el grosor del brazo)',
    setupTime: 'De pie o sentado en la silla con espalda recta.',
    technique: 'Agarre neutro estricto (palmas enfrentadas). Eleva las mancuernas de 6 kg manteniendo los pulgares apuntando hacia arriba durante todo el recorrido. En la cima haz 1 segundo de pausa isométrica apretando el músculo braquial y el antebrazo. Desciende en 3 segundos controlados.',
    biomechanicCues: [
      'El músculo braquial se ubica debajo del bíceps: al hipertrofiarse empuja al bíceps hacia el exterior, dando un brazo notablemente más ancho de frente.',
      'La excéntrica de 3 segundos fatiga las fibras del antebrazo y del braquiorradial sin necesidad de kilos excesivos.'
    ],
    mistakesToAvoid: [
      'Girar las muñecas hacia supinación o pronación.',
      'Subir con inercia de los hombros.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Hammer_Curls/0.jpg`,
      `${DB_IMG_BASE}Hammer_Curls/1.jpg`
    ],
    videoEmbedUrl: 'zC3nLlEvin4',
    videoTitle: 'Curl Martillo con Mancuernas',
    visualCue: 'Palmas enfrentadas durante el 100% de la trayectoria. Foco absoluto en el braquial y braquiorradial.'
  },

  CURL_CONCENTRADO_SILLA: {
    id: 'curl_concentrado_silla',
    name: 'Curl Concentrado en Silla (Pico de Bíceps - 6 kg)',
    muscleTarget: 'Bíceps',
    equipment: 'Mancuernas + Silla',
    sets: 3,
    reps: '15 - 20 reps por brazo',
    tempo: '3s Descenso estricto • 1.5s Isometría en contracción pico',
    restSeconds: 60,
    rpe: 'RPE 10 (Fallo muscular técnico garantizado)',
    setupTime: 'Siéntate en el borde de la silla, piernas abiertas.',
    technique: 'Apoya el tríceps contra la cara interna de tu muslo. El brazo cuelga completamente extendido con la mancuerna de 6 kg. Flexiona el codo levantando la mancuerna hacia la cara sin mover el torso. En la cima aprieta el bíceps durante 1.5 segundos de isometría brutal. Desciende en 3 segundos lentos.',
    biomechanicCues: [
      'El muslo elimina cualquier posibilidad de trampa. Cada gramo de los 6 kg va directo a las fibras del bíceps.',
      'Estira completamente el bíceps abajo antes de iniciar la siguiente repetición.'
    ],
    mistakesToAvoid: [
      'Despegar el codo del muslo durante la subida.',
      'Tirar del cuello o torso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Concentration_Curls/0.jpg`,
      `${DB_IMG_BASE}Concentration_Curls/1.jpg`
    ],
    videoEmbedUrl: 'Jvj2wV0vOYU',
    videoTitle: 'Curl Concentrado Sentado',
    visualCue: 'El codo se bloquea en la parte interna del muslo. Cero oscilación del torso; aislamiento del pico del bíceps.'
  },

  // --- SOPORTE & COMPUESTOS ---
  FLOOR_PRESS_MANCUERNAS: {
    id: 'floor_press_mancuernas',
    name: 'Floor Press en Colchoneta con Mancuernas de 6 kg',
    muscleTarget: 'Soporte Pectoral / Hombros',
    equipment: 'Mancuernas + Colchoneta',
    sets: 4,
    reps: '20 - 25 reps (Alta cadencia controlada)',
    tempo: '3s Bajada hasta rozar colchoneta • 1s Pausa isométrica arriba',
    restSeconds: 75,
    rpe: 'RPE 8.5',
    setupTime: 'Acuéstate sobre la colchoneta con rodillas dobladas y mancuernas en el pecho.',
    technique: 'Empuja las mancuernas de 6 kg hacia arriba con los codos a 45° respecto al torso. Al descender en 3 segundos lentos, los tríceps tocan suavemente la colchoneta sin rebotar. Sube con potencia y contrae el pecho y tríceps 1 segundo.',
    biomechanicCues: [
      'La colchoneta protege el hombro y aísla la fase concéntrica de tríceps y pectoral.',
      'Cadencia lenta de 3s para convertir 6 kg en una bomba de bombeo e hipertrofia sarcoplásmica.'
    ],
    mistakesToAvoid: [
      'Rebotar los codos violentamente contra el piso.',
      'Abrir los codos a 90° con los hombros.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Floor_Press/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Floor_Press/1.jpg`
    ],
    videoEmbedUrl: 'uUGDRwge4F8',
    videoTitle: 'Dumbbell Floor Press en el Suelo',
    visualCue: 'Codos en ángulo de 45° respecto al cuerpo. Descenso lento hasta que los tríceps tocan la colchoneta sin rebotar.'
  },

  FLEXIONES_DECLINADAS_SILLA: {
    id: 'flexiones_declinadas_silla',
    name: 'Flexiones Declinadas con Pies en Silla',
    muscleTarget: 'Soporte Pectoral / Hombros',
    equipment: 'Silla + Colchoneta',
    sets: 3,
    reps: '15 - 20 reps',
    tempo: '3s Descenso hacia el suelo • 1s Isometría abajo y arriba',
    restSeconds: 75,
    rpe: 'RPE 9',
    setupTime: 'Pies en el asiento de la silla, manos en la colchoneta al ancho de hombros.',
    technique: 'Cuerpo recto como una tabla. Desciende el pecho en 3 segundos lentos hacia la colchoneta. Pausa 1 segundo a 2 cm del suelo y empuja explosivo, apretando hombros y tríceps arriba.',
    biomechanicCues: [
      'Construye hombros y pecho superior que crean el marco estético para que los brazos luzcan el doble de grandes.'
    ],
    mistakesToAvoid: [
      'Dejar caer la cintura arqueando la zona lumbar.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Decline_Push-Up/0.jpg`,
      `${DB_IMG_BASE}Decline_Push-Up/1.jpg`
    ],
    videoEmbedUrl: 'SKPab2YC8BE',
    videoTitle: 'Flexiones Declinadas con Pies Elevados',
    visualCue: 'Pies sobre la silla, cuerpo en línea recta sin quebrar la cadera. El pecho desciende a 2 cm de la colchoneta.'
  },

  FLEXIONES_DIAMANTE_COLCHONETA: {
    id: 'flexiones_diamante_colchoneta',
    name: 'Flexiones Diamante en Colchoneta (Tríceps Puro)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Colchoneta',
    sets: 3,
    reps: '12 - 20 reps (RIR 1)',
    tempo: '3s Bajada lenta • 1s Pausa en contracción de tríceps',
    restSeconds: 75,
    rpe: 'RPE 9.5',
    setupTime: 'En la colchoneta, dedos índices y pulgares formando un diamante bajo el esternón.',
    technique: 'Desciende en 3 segundos manteniendo los codos pegados a las costillas hasta que el pecho roce tus manos. Empuja con la fuerza de los tríceps y bloquea arriba 1 segundo. Si es necesario, apoya las rodillas para no comprometer el tempo de 3 segundos.',
    biomechanicCues: [
      'Máxima activación EMG de la cabeza lateral y medial del tríceps comprobada en estudios biomecánicos.'
    ],
    mistakesToAvoid: [
      'Abrir los codos en exceso comprometiendo muñecas.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Push-Ups_-_Close_Triceps_Position/0.jpg`,
      `${DB_IMG_BASE}Push-Ups_-_Close_Triceps_Position/1.jpg`
    ],
    videoEmbedUrl: 'J0DnG1_S92I',
    videoTitle: 'Flexiones Diamante para Tríceps',
    visualCue: 'Pulgares e índices unidos bajo el centro del pecho. Codos pegados al cuerpo para transferir toda la carga al tríceps.'
  },

  REMO_MANCUERNAS_UNILATERAL: {
    id: 'remo_mancuernas_unilateral',
    name: 'Remo Unilateral en Silla con Mancuerna de 6 kg',
    muscleTarget: 'Soporte Espalda / Tracción',
    equipment: 'Mancuernas + Silla',
    sets: 4,
    reps: '18 - 25 reps por lado',
    tempo: '3s Descenso controlado • 1.5s Isometría apretando dorsal y bíceps',
    restSeconds: 60,
    rpe: 'RPE 8.5',
    setupTime: 'Rodilla y mano izquierda en la silla, pie derecho en el suelo, torso plano.',
    technique: 'Sujeta la mancuerna de 6 kg. Tira desde el codo llevando la mancuerna hacia la cadera. Arriba haz una pausa isométrica estricta de 1.5 segundos contrayendo la espalda y el bíceps. Baja en 3 segundos lentos sintiendo el estiramiento completo.',
    biomechanicCues: [
      'La fuerza de tirón dorsal estabiliza la articulación del codo para los curls pesados de alta repetición.'
    ],
    mistakesToAvoid: [
      'Rotar el torso o impulsarse con el cuello.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}One-Arm_Dumbbell_Row/0.jpg`,
      `${DB_IMG_BASE}One-Arm_Dumbbell_Row/1.jpg`
    ],
    videoEmbedUrl: 'roCP6wCXPqo',
    videoTitle: 'Remo Unilateral con Mancuerna Apoyado en Banco/Silla',
    visualCue: 'Tirón desde el codo hacia la cadera en trayectoria diagonal, sintiendo la contracción dorsal y flexión del brazo.'
  }
};

// Rutina semanal estructurada para 60 días
export const WEEKLY_ROUTINE_TEMPLATE: DayRoutine[] = [
  {
    dayOfWeek: 1,
    title: 'Día 1: Hipertrofia de Brazos (6 kg) - Tríceps (60%) & Bíceps',
    tagline: '15-25 reps • Tempo 3-1-1-0 • Tensión Mecánica Continua',
    isRestDay: false,
    focusMuscles: ['Tríceps Cabeza Larga & Lateral', 'Bíceps Supinador', 'Braquial'],
    estimatedMinutes: 45,
    exercises: [
      EXERCISE_LIBRARY.PRESS_FRANCES_COLCHONETA,
      EXERCISE_LIBRARY.CURL_SUPINO_MANCUERNAS,
      EXERCISE_LIBRARY.FONDOS_SILLA,
      EXERCISE_LIBRARY.CURL_MARTILLO,
      EXERCISE_LIBRARY.PATADA_TRICEPS
    ]
  },
  {
    dayOfWeek: 2,
    title: 'Día 2: Empuje & Base Pectoral/Hombros + Tríceps Bloqueo',
    tagline: '15-25 reps • Tempo 3s excéntrico • Estabilidad articular',
    isRestDay: false,
    focusMuscles: ['Pectoral', 'Deltoides Anterior', 'Tríceps'],
    estimatedMinutes: 40,
    exercises: [
      EXERCISE_LIBRARY.FLOOR_PRESS_MANCUERNAS,
      EXERCISE_LIBRARY.COPA_DOS_MANOS,
      EXERCISE_LIBRARY.FLEXIONES_DECLINADAS_SILLA,
      EXERCISE_LIBRARY.FLEXIONES_DIAMANTE_COLCHONETA
    ]
  },
  {
    dayOfWeek: 3,
    title: 'Día 3: Descanso & Crecimiento Muscular Obligatorio',
    tagline: 'Superávit anabólico (2.650 kcal) y síntesis proteica (140-150g)',
    isRestDay: true,
    focusMuscles: ['Recuperación SNC', 'Síntesis Proteica Miofibrilar'],
    estimatedMinutes: 0,
    recoveryNote: 'Los brazos crecen durante el reposo cuando hay balance positivo de nitrógeno. Con mancuernas de 6 kg y series de 15-25 reps al fallo técnico, el microtrauma es alto. Hoy tu trabajo es alcanzar las 2.650 kcal y tus 140-150g de proteína sin realizar cardio extenuante.',
    exercises: []
  },
  {
    dayOfWeek: 4,
    title: 'Día 4: Densidad de Brazos & Grosor del Braquial (6 kg)',
    tagline: '15-25 reps • Isometría pico de 1s • Bombeo vascular',
    isRestDay: false,
    focusMuscles: ['Braquial', 'Braquiorradial', 'Pico de Bíceps', 'Tríceps Cabeza Larga'],
    estimatedMinutes: 45,
    exercises: [
      EXERCISE_LIBRARY.CURL_MARTILLO,
      EXERCISE_LIBRARY.FONDOS_SILLA,
      EXERCISE_LIBRARY.CURL_CONCENTRADO_SILLA,
      EXERCISE_LIBRARY.COPA_DOS_MANOS,
      EXERCISE_LIBRARY.PRESS_FRANCES_COLCHONETA
    ]
  },
  {
    dayOfWeek: 5,
    title: 'Día 5: Tracción Espalda & Bíceps Bombeo Extremo',
    tagline: '15-25 reps • Tempo estricto 3s bajada • Agotamiento neuromuscular',
    isRestDay: false,
    focusMuscles: ['Espalda Dorsal', 'Bíceps', 'Flexiones Diamante'],
    estimatedMinutes: 45,
    exercises: [
      EXERCISE_LIBRARY.REMO_MANCUERNAS_UNILATERAL,
      EXERCISE_LIBRARY.CURL_SUPINO_MANCUERNAS,
      EXERCISE_LIBRARY.FLEXIONES_DIAMANTE_COLCHONETA,
      EXERCISE_LIBRARY.CURL_CONCENTRADO_SILLA
    ]
  },
  {
    dayOfWeek: 6,
    title: 'Día 6: Descanso Activo / Regeneración Muscular',
    tagline: 'Recarga de glucógeno para las fibras de los brazos',
    isRestDay: true,
    focusMuscles: ['Regeneración Celular'],
    estimatedMinutes: 0,
    recoveryNote: 'Evita salidas a correr que superen los 15-20 minutos. Las reservas de glucógeno y los aminoácidos deben dirigirse a reparar los bíceps y tríceps.',
    exercises: []
  },
  {
    dayOfWeek: 7,
    title: 'Día 7: Descanso Total & Medición Semanal (cm y kg)',
    tagline: 'Registro de contorno del brazo flexionado (cm) y peso (70 kg base)',
    isRestDay: true,
    focusMuscles: ['Evaluación Antropométrica'],
    estimatedMinutes: 10,
    recoveryNote: 'Hoy se toma la medición semanal matutina del brazo flexionado en 90° con contracción isométrica máxima y el peso corporal en ayunas.',
    exercises: []
  }
];

export function getRoutineForCycleDay(dayNumber: number): DayRoutine {
  const dayIndex = (dayNumber - 1) % 7;
  const baseRoutine = WEEKLY_ROUTINE_TEMPLATE[dayIndex];
  
  const week = Math.ceil(dayNumber / 7);
  let phaseTag = `Fase 1 (Semanas 1-2): Dominio del Tempo 3s Excéntrica`;
  if (week >= 3 && week <= 4) phaseTag = `Fase 2 (Semanas 3-4): Densidad & Pausas Isométricas de 1.5s`;
  if (week >= 5 && week <= 6) phaseTag = `Fase 3 (Semanas 5-6): Fallo Técnico (20-25 reps a 6 kg)`;
  if (week >= 7) phaseTag = `Fase 4 (Semanas 7-8): Supercompensación & Máximo Volumen`;

  return {
    ...baseRoutine,
    title: `[Día ${dayNumber}/60] ${baseRoutine.title}`,
    tagline: `${phaseTag} • ${baseRoutine.tagline}`
  };
}

export function getRoutineForUser(userId: UserId, dayNumber: number): DayRoutine {
  if (userId === 'miranda') {
    return getMirandaRoutineForCycleDay(dayNumber);
  }
  return getRoutineForCycleDay(dayNumber);
}

