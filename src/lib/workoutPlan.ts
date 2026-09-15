import type { DayRoutine, Exercise, UserId } from '../types';
import { getMirandaRoutineForCycleDay } from './mirandaWorkoutPlan';

const DB_IMG_BASE = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export const EXERCISE_LIBRARY: Record<string, Exercise> = {
  // --- TRÍCEPS (60% DEL VOLUMEN DEL BRAZO - CERO DOLOR DE MUÑECA, CERO SILLAS) ---
  PRESS_CERRADO_TRICEPS_COLCHONETA: {
    id: 'press_cerrado_triceps_colchoneta',
    name: 'Press Cerrado en Colchoneta con Mancuernas Juntas (Cero Dolor de Muñeca)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps (RIR 2: deja 2 reps antes del fallo)',
    tempo: '2s Bajada hasta rozar colchoneta • 1s Bloqueo de tríceps arriba',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8 (Tensión pura sin quemazón destructiva)',
    setupTime: 'Acuéstate en la colchoneta con rodillas dobladas. Junta ambas mancuernas de 6 kg en el centro del pecho con agarre neutro (palmas enfrentadas). Cero tensión en muñecas ni hombros.',
    technique: 'Mantén las dos mancuernas pegadas una contra otra y las muñecas perfectamente rectas (sin flexionarlas hacia atrás). Empuja hacia el techo extendiendo los codos y contrayendo al máximo los tríceps durante 1 segundo arriba. Desciende en 2 segundos lentos manteniendo los codos pegados a las costillas hasta que los tríceps rocen suavemente la colchoneta. Vuelve a empujar con control.',
    biomechanicCues: [
      'CERO DOLOR DE MUÑECAS: El agarre neutro (palmas mirándose) mantiene la muñeca en su eje anatómico más resistente, eliminando toda la compresión de los fondos.',
      'PROTECCIÓN ARTICULAR DE HOMBRO: El suelo actúa como tope de seguridad e impide la rotación interna lesiva que producen las sillas.',
      'Juntar las dos mancuernas en el centro genera una contracción isométrica continua en las cabezas lateral y medial del tríceps.'
    ],
    mistakesToAvoid: [
      'Abrir los codos como alas hacia los lados (deben ir pegados al cuerpo a 45°).',
      'Rebotar los codos bruscamente contra el suelo.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Floor_Press/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Floor_Press/1.jpg`
    ],
    videoEmbedUrl: 'uUGDRwge4F8',
    videoTitle: 'Press Cerrado con Mancuernas en el Suelo (Floor Press Tríceps)',
    visualCue: 'Acostado en la colchoneta. Mancuernas juntas con agarre neutro. Los codos bajan pegados a las costillas y rozan la colchoneta.'
  },

  // Alias para retrocompatibilidad
  FONDOS_SILLA: {
    id: 'press_cerrado_triceps_colchoneta',
    name: 'Press Cerrado en Colchoneta con Mancuernas Juntas (Cero Dolor de Muñeca)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps (RIR 2: deja 2 reps antes del fallo)',
    tempo: '2s Bajada hasta rozar colchoneta • 1s Bloqueo de tríceps arriba',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8 (Tensión pura sin quemazón destructiva)',
    setupTime: 'Acuéstate en la colchoneta con rodillas dobladas. Junta ambas mancuernas de 6 kg en el centro del pecho con agarre neutro (palmas enfrentadas). Cero tensión en muñecas ni hombros.',
    technique: 'Mantén las dos mancuernas pegadas una contra otra y las muñecas perfectamente rectas (sin flexionarlas hacia atrás). Empuja hacia el techo extendiendo los codos y contrayendo al máximo los tríceps durante 1 segundo arriba. Desciende en 2 segundos lentos manteniendo los codos pegados a las costillas hasta que los tríceps rocen suavemente la colchoneta. Vuelve a empujar con control.',
    biomechanicCues: [
      'CERO DOLOR DE MUÑECAS: El agarre neutro (palmas mirándose) mantiene la muñeca en su eje anatómico más resistente, eliminando toda la compresión de los fondos.',
      'PROTECCIÓN ARTICULAR DE HOMBRO: El suelo actúa como tope de seguridad e impide la rotación interna lesiva que producen las sillas.',
      'Juntar las dos mancuernas en el centro genera una contracción isométrica continua en las cabezas lateral y medial del tríceps.'
    ],
    mistakesToAvoid: [
      'Abrir los codos como alas hacia los lados (deben ir pegados al cuerpo a 45°).',
      'Rebotar los codos bruscamente contra el suelo.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Floor_Press/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Floor_Press/1.jpg`
    ],
    videoEmbedUrl: 'uUGDRwge4F8',
    videoTitle: 'Press Cerrado con Mancuernas en el Suelo (Floor Press Tríceps)',
    visualCue: 'Acostado en la colchoneta. Mancuernas juntas con agarre neutro. Los codos bajan pegados a las costillas y rozan la colchoneta.'
  },

  PRESS_FRANCES_COLCHONETA: {
    id: 'press_frances_colchoneta',
    name: 'Press Francés en Colchoneta con Mancuernas (Agarre Neutro)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps (RIR 2)',
    tempo: '2s Bajada lenta • 1s Extensión controlada',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8 (Control y tensión sin fatiga extrema)',
    setupTime: 'Acuéstate sobre la colchoneta con mancuernas en agarre neutro (palmas enfrentadas). Si 2 mancuernas de 6 kg son pesadas, puedes usar 1 sola mancuerna de 6 kg tomada con ambas manos.',
    technique: 'Tumbado en la colchoneta con rodillas dobladas. Brazos apuntando levemente hacia atrás de la cabeza (75° respecto al suelo). Flexiona únicamente los codos bajando las mancuernas hacia los lados de la frente/orejas en 2 segundos. Extiende apretando los tríceps 1 segundo arriba.',
    biomechanicCues: [
      'Agarre neutro: muñecas alineadas en línea recta con el antebrazo, sin rotaciones.',
      'La colchoneta actúa como tope seguro impidiendo sobre-extensión del codo.',
      'Mantén los codos quietos apuntando hacia el techo.'
    ],
    mistakesToAvoid: [
      'Mover los hombros hacia adelante y atrás.',
      'Arquear la espalda lumbar de la colchoneta.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Lying_Dumbbell_Tricep_Extension/0.jpg`,
      `${DB_IMG_BASE}Lying_Dumbbell_Tricep_Extension/1.jpg`
    ],
    videoEmbedUrl: 'd_KZxkY_0cM',
    videoTitle: 'Floor Skullcrusher con Mancuernas en Suelo',
    visualCue: 'Los brazos inclinados levemente hacia la cabeza. Codos firmes; flexión y extensión pura de antebrazo.'
  },

  COPA_DOS_MANOS: {
    id: 'copa_dos_manos',
    name: 'Extensión Copa en Colchoneta (Sentado o de Rodillas - Mancuerna 6 kg)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps (RIR 2)',
    tempo: '2s Bajada tras la nuca • 1s Extensión hacia el techo',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8',
    setupTime: 'Siéntate en la colchoneta con las piernas cruzadas o de rodillas, con el torso erguido y abdomen activo.',
    technique: 'Sujeta una sola mancuerna de 6 kg verticalmente con ambas manos bajo el disco superior (copa). Elévala sobre tu cabeza. Desciende el peso por detrás de la nuca flexionando los codos en 2 segundos. Extiende hacia arriba y aprieta 1 segundo arriba.',
    biomechanicCues: [
      'La cabeza larga del tríceps recibe su mayor estiramiento con el brazo por encima de la cabeza.',
      'Mantén los codos apuntando al frente, sin abrirlos en exceso.',
      'Glúteos y abdomen firmes en la colchoneta para estabilizar la columna.'
    ],
    mistakesToAvoid: [
      'Arquear la espalda baja.',
      'Acelerar el movimiento cuando empiece a sentirse la fatiga.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Standing_Dumbbell_Triceps_Extension/0.jpg`,
      `${DB_IMG_BASE}Standing_Dumbbell_Triceps_Extension/1.jpg`
    ],
    videoEmbedUrl: '_gsUck-7M74',
    videoTitle: 'Extensión de Tríceps Copa a Dos Manos',
    visualCue: 'Codos cerrados hacia adelante. Estiramiento suave tras la nuca y extensión vertical completa.'
  },

  PATADA_TRICEPS: {
    id: 'patada_triceps',
    name: 'Patada de Tríceps en Colchoneta en 4 Apoyos (Kickback 6 kg - Sin Silla)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps por brazo (RIR 2)',
    tempo: '2s Regreso • 1s Pausa isométrica con brazo estirado',
    restSeconds: 90,
    rpe: 'RPE 8 (Contracción pura sin impacto articular)',
    setupTime: 'Ponte en 4 apoyos sobre la colchoneta (rodillas acolchadas y una mano plana apoyada en la colchoneta). Cero bordes de silla.',
    technique: 'Con una mancuerna de 6 kg en la mano libre, sube el codo hasta que quede pegado a tus costillas y paralelo al suelo. Extiende el antebrazo hacia atrás hasta que el brazo quede recto. Aprieta el tríceps 1 segundo y regresa en 2 segundos controlados.',
    biomechanicCues: [
      'La colchoneta acolchada proporciona una base ancha y 100% estable para las rodillas y la mano de apoyo.',
      'El codo queda congelado como una bisagra contra las costillas.'
    ],
    mistakesToAvoid: [
      'Balancear el torso o dejar caer el codo al retornar el peso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Tricep_Dumbbell_Kickback/0.jpg`,
      `${DB_IMG_BASE}Tricep_Dumbbell_Kickback/1.jpg`
    ],
    videoEmbedUrl: '6SS6K3lAwZ8',
    videoTitle: 'Patada de Tríceps con Mancuerna en Suelo',
    visualCue: 'Codo pegado a las costillas sin moverse. Extensión hacia atrás con pausa de 1 segundo arriba.'
  },

  // --- BÍCEPS & BRAQUIAL ---
  CURL_SUPINO_MANCUERNAS: {
    id: 'curl_supino_mancuernas',
    name: 'Curl con Mancuernas de 6 kg con Supinación Continua',
    muscleTarget: 'Bíceps',
    equipment: 'Mancuernas',
    sets: 2,
    reps: '8 - 12 reps (RIR 2: deja 2 reps en reserva)',
    tempo: '2s Bajada excéntrica • 1s Giro y contracción arriba',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8 (Congestión óptima sin quemazón excesiva)',
    setupTime: 'De pie o sentado en la colchoneta con espalda recta y hombros relajados.',
    technique: 'Sujeta las mancuernas de 6 kg. Flexiona los codos girando la muñeca hacia afuera (supinación total). Aprieta el bíceps 1 segundo arriba y baja en 2 segundos controlados sintiendo cómo el músculo frena el descenso.',
    biomechanicCues: [
      'PROTECCIÓN DEL CODO: No bloquees ni hiperextiendas el codo al bajar. Detén el descenso dejando unos 15° de flexión en el codo para retener la tensión en el músculo y descargar el tendón distal.',
      '2 segundos de bajada controlada: estimula la síntesis de proteína sin agotar el glucógeno.',
      'Codos pegados a los costados sin balancear la espalda.'
    ],
    mistakesToAvoid: [
      'Hiperextender o dejar caer el peso al 100% estirando bruscamente el codo (inflama el tendón del pliegue anterior).',
      'Balancear el torso para tomar impulso con la zona lumbar.',
      'Apurar las repeticiones perdiendo el control del descenso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Bicep_Curl/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Bicep_Curl/1.jpg`
    ],
    videoEmbedUrl: 'ykJmrZ5v0Oo',
    videoTitle: 'Curl de Bíceps con Mancuernas y Supinación',
    visualCue: 'Inicio con agarre neutro, giro de supinación al subir. Codos pegados a las costillas.'
  },

  CURL_MARTILLO: {
    id: 'curl_martillo',
    name: 'Curl Martillo Estricto (Braquial & Grosor de Brazo - 6 kg)',
    muscleTarget: 'Braquial & Antebrazos',
    equipment: 'Mancuernas',
    sets: 2,
    reps: '8 - 12 reps (RIR 2)',
    tempo: '2s Bajada • 1s Isometría arriba con palmas neutras',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8 (Ensancha el brazo visto de frente)',
    setupTime: 'De pie o sentado en la colchoneta con espalda recta.',
    technique: 'Agarre neutro estricto (palmas mirándose). Sube las mancuernas de 6 kg con los pulgares apuntando hacia arriba. Aprieta el músculo braquial 1 segundo arriba y desciende en 2 segundos controlados sin trabar codos abajo.',
    biomechanicCues: [
      'El músculo braquial empuja al bíceps hacia afuera al crecer, dando mayor grosor al brazo.',
      'Agarre neutro: el más seguro y amigable para las muñecas y los tendones del codo.',
      'Conserva una micro-flexión protectora en el punto bajo del movimiento.'
    ],
    mistakesToAvoid: [
      'Girar las muñecas hacia los lados.',
      'Subir con inercia de los hombros.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Hammer_Curls/0.jpg`,
      `${DB_IMG_BASE}Hammer_Curls/1.jpg`
    ],
    videoEmbedUrl: 'zC3nLlEvin4',
    videoTitle: 'Curl Martillo con Mancuernas',
    visualCue: 'Palmas enfrentadas en todo momento. Foco absoluto en el braquial y antebrazo.'
  },

  CURL_CONCENTRADO_SILLA: {
    id: 'curl_concentrado_silla',
    name: 'Curl Concentrado en Colchoneta (Pico de Bíceps - 6 kg)',
    muscleTarget: 'Bíceps',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps por brazo (RIR 2)',
    tempo: '2s Descenso estricto • 1s Isometría en contracción pico',
    restSeconds: 90,
    rpe: 'RPE 8 (Aislamiento puro sin trampas)',
    setupTime: 'Siéntate en la colchoneta con piernas abiertas en V. Apoya el codo contra la cara interna del muslo.',
    technique: 'El brazo desciende con la mancuerna de 6 kg manteniendo una leve flexión protectora. Flexiona el codo levantando el peso hacia el hombro sin mover el torso. En la cima aprieta el bíceps 1 segundo y baja en 2 segundos lentos frenando antes del bloqueo articular.',
    biomechanicCues: [
      'El muslo bloquea el codo impidiendo balanceos y asegurando aislamiento del bíceps.',
      'CERO BLOQUEO ARTICULAR: Frena el descenso a unos 150-160° (deja una leve flexión). NUNCA dejes colgar el peso con el codo trabado al 100% para proteger el tendón distal del bíceps.'
    ],
    mistakesToAvoid: [
      'Dejar caer el brazo hasta la extensión absoluta bloqueando el codo con peso.',
      'Despegar el codo del muslo al subir.',
      'Tirar del cuello o girar el pecho.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Concentration_Curls/0.jpg`,
      `${DB_IMG_BASE}Concentration_Curls/1.jpg`
    ],
    videoEmbedUrl: 'Jvj2wV0vOYU',
    videoTitle: 'Curl Concentrado en Suelo',
    visualCue: 'Codo apoyado en la cara interna del muslo. Cero balanceo del torso.'
  },

  // --- SOPORTE & COMPUESTOS (100% COLCHONETA / CERO SILLAS) ---
  FLOOR_PRESS_MANCUERNAS: {
    id: 'floor_press_mancuernas',
    name: 'Floor Press en Colchoneta con Mancuernas de 6 kg',
    muscleTarget: 'Soporte Pectoral / Hombros',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '10 - 12 reps (RIR 2)',
    tempo: '2s Bajada hasta rozar colchoneta • 1s Empuje arriba',
    restSeconds: 90,
    rpe: 'RPE 7.5',
    setupTime: 'Acuéstate en la colchoneta con rodillas dobladas y mancuernas a los lados del pecho.',
    technique: 'Empuja las mancuernas hacia arriba con los codos a 45° respecto al cuerpo. Al bajar en 2 segundos, los tríceps rozan suavemente la colchoneta sin rebotar. Vuelve a subir con potencia.',
    biomechanicCues: [
      'La colchoneta protege la cápsula del hombro y aísla tríceps y pecho.',
      'Empuje seguro sin necesidad de bancos de gimnasio.'
    ],
    mistakesToAvoid: [
      'Rebotar los codos bruscamente contra el piso.',
      'Abrir los codos a 90° alineados con el cuello.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Dumbbell_Floor_Press/0.jpg`,
      `${DB_IMG_BASE}Dumbbell_Floor_Press/1.jpg`
    ],
    videoEmbedUrl: 'uUGDRwge4F8',
    videoTitle: 'Dumbbell Floor Press en el Suelo',
    visualCue: 'Codos a 45° respecto al cuerpo. Los tríceps tocan la colchoneta sin rebotar.'
  },

  FLEXIONES_DECLINADAS_SILLA: {
    id: 'flexiones_declinadas_silla',
    name: 'Flexiones en Colchoneta sobre Rodillas (Cero Dolor de Muñeca)',
    muscleTarget: 'Soporte Pectoral / Hombros',
    equipment: 'Colchoneta',
    sets: 2,
    reps: '8 - 10 reps (RIR 2)',
    tempo: '2s Bajada controlada • 1s Empuje',
    restSeconds: 90,
    rpe: 'RPE 7.5',
    setupTime: 'Apoya las rodillas sobre la colchoneta acolchada. Para cuidar las muñecas al 100%, puedes apoyar las manos sujetando los mangos de tus mancuernas en el piso (agarre neutro) o apoyar las palmas con dedos bien separados.',
    technique: 'Cuerpo en línea recta desde las rodillas hasta los hombros. Desciende el pecho en 2 segundos hacia la colchoneta con los codos a 45°. Empuja con fuerza hasta estirar los brazos.',
    biomechanicCues: [
      'Apoyar las rodillas reduce la carga al 55% del peso corporal, permitiendo técnica estricta sin fatiga extrema.',
      'Sujetar las mancuernas como base elimina la hiperextensión de muñeca.'
    ],
    mistakesToAvoid: [
      'Quebrar la cintura dejando caer la pelvis.',
      'Llevar los codos demasiado abiertos hacia las orejas.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Decline_Push-Up/0.jpg`,
      `${DB_IMG_BASE}Decline_Push-Up/1.jpg`
    ],
    videoEmbedUrl: 'SKPab2YC8BE',
    videoTitle: 'Flexiones sobre Rodillas Controladas',
    visualCue: 'Rodillas acolchadas en la colchoneta, espalda recta, codos a 45° bajando hacia el suelo.'
  },

  FLEXIONES_DIAMANTE_COLCHONETA: {
    id: 'flexiones_diamante_colchoneta',
    name: 'Flexiones Cerradas sobre Rodillas en Colchoneta (Tríceps)',
    muscleTarget: 'Tríceps (60% del brazo)',
    equipment: 'Colchoneta',
    sets: 2,
    reps: '8 - 10 reps (RIR 2)',
    tempo: '2s Bajada lenta • 1s Empuje firme',
    restSeconds: 90,
    rpe: 'RPE 8',
    setupTime: 'Rodillas en la colchoneta. Manos apoyadas en la colchoneta debajo del centro del pecho.',
    technique: 'Desciende en 2 segundos manteniendo los codos pegados a las costillas hasta que el pecho roce el suelo. Empuja extendiendo los codos con la fuerza de los tríceps. Si sientes tensión en las muñecas, puedes realizar el Press Cerrado con Mancuernas en su lugar.',
    biomechanicCues: [
      'Codos pegados a los costados para dirigir el trabajo a los tríceps.',
      'Rodillas en colchoneta para dosificar la intensidad de forma cómoda.'
    ],
    mistakesToAvoid: [
      'Forzar la flexión si notas molestia en las muñecas.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}Push-Ups_-_Close_Triceps_Position/0.jpg`,
      `${DB_IMG_BASE}Push-Ups_-_Close_Triceps_Position/1.jpg`
    ],
    videoEmbedUrl: 'J0DnG1_S92I',
    videoTitle: 'Flexiones Cerradas para Tríceps',
    visualCue: 'Manos centradas, codos rozando las costillas en el descenso y extensión completa.'
  },

  REMO_MANCUERNAS_UNILATERAL: {
    id: 'remo_mancuernas_unilateral',
    name: 'Remo Unilateral en Colchoneta en Posición de Zancada (6 kg - Sin Silla)',
    muscleTarget: 'Soporte Espalda / Tracción',
    equipment: 'Mancuernas + Colchoneta',
    sets: 2,
    reps: '8 - 12 reps por lado (RIR 2)',
    tempo: '2s Descenso • 1s Isometría arriba apretando dorsal',
    restSeconds: 90,
    rpe: 'RPE 7.5 - 8',
    setupTime: 'Adelanta una pierna en posición de zancada sobre la colchoneta. Apoya el antebrazo de ese lado sobre el muslo delantero para dar apoyo estable a la espalda.',
    technique: 'Con la mancuerna de 6 kg en la otra mano, tira hacia arriba y atrás dirigiendo el codo hacia la cadera. Aprieta la espalda y el brazo 1 segundo arriba y desciende en 2 segundos controlados.',
    biomechanicCues: [
      'Posición de zancada con antebrazo en muslo: máxima estabilidad sin requerir ninguna silla o banco.',
      'Tirón enfocado desde el codo hacia la cadera.'
    ],
    mistakesToAvoid: [
      'Girar el pecho o balancear el cuerpo para elevar el peso.'
    ],
    animationFrames: [
      `${DB_IMG_BASE}One-Arm_Dumbbell_Row/0.jpg`,
      `${DB_IMG_BASE}One-Arm_Dumbbell_Row/1.jpg`
    ],
    videoEmbedUrl: 'roCP6wCXPqo',
    videoTitle: 'Remo con Mancuerna en Posición de Zancada',
    visualCue: 'Torso inclinado 45°, antebrazo apoyado en el muslo. El codo viaja hacia la cadera.'
  }
};

// Rutina semanal estructurada para 60 días (Calibrada a 2 series de trabajo y 100% en colchoneta)
export const WEEKLY_ROUTINE_TEMPLATE: DayRoutine[] = [
  {
    dayOfWeek: 1,
    title: 'Día 1: Hipertrofia de Brazos (6 kg) - Tríceps (60%) & Bíceps',
    tagline: '2 series • 8-12 reps (RIR 2) • 90s descanso • Cero dolor de muñeca',
    isRestDay: false,
    focusMuscles: ['Tríceps (Floor Press Cerrado)', 'Bíceps Supinador', 'Braquial'],
    estimatedMinutes: 30,
    exercises: [
      EXERCISE_LIBRARY.PRESS_CERRADO_TRICEPS_COLCHONETA,
      EXERCISE_LIBRARY.CURL_SUPINO_MANCUERNAS,
      EXERCISE_LIBRARY.PRESS_FRANCES_COLCHONETA,
      EXERCISE_LIBRARY.CURL_MARTILLO,
      EXERCISE_LIBRARY.PATADA_TRICEPS
    ]
  },
  {
    dayOfWeek: 2,
    title: 'Día 2: Empuje Pectoral & Tríceps en Colchoneta (6 kg)',
    tagline: '2 series • 8-12 reps • 100% Suelo / Sin Sillas ni Bancos',
    isRestDay: false,
    focusMuscles: ['Pectoral (Floor Press)', 'Tríceps Cabeza Larga', 'Deltoides'],
    estimatedMinutes: 25,
    exercises: [
      EXERCISE_LIBRARY.FLOOR_PRESS_MANCUERNAS,
      EXERCISE_LIBRARY.PRESS_CERRADO_TRICEPS_COLCHONETA,
      EXERCISE_LIBRARY.COPA_DOS_MANOS,
      EXERCISE_LIBRARY.FLEXIONES_DECLINADAS_SILLA
    ]
  },
  {
    dayOfWeek: 3,
    title: 'Día 3: Descanso & Crecimiento Muscular Obligatorio',
    tagline: 'Superávit anabólico (2.650 kcal) y síntesis proteica (140-150g)',
    isRestDay: true,
    focusMuscles: ['Recuperación SNC', 'Síntesis Proteica Miofibrilar'],
    estimatedMinutes: 0,
    recoveryNote: 'Los brazos crecen durante el reposo cuando hay balance positivo de nitrógeno. Con mancuernas de 6 kg y series controladas de 8-12 reps, el estímulo es perfecto. Hoy tu trabajo es alcanzar las 2.650 kcal y tus 140-150g de proteína sin realizar cardio extenuante.',
    exercises: []
  },
  {
    dayOfWeek: 4,
    title: 'Día 4: Densidad de Brazos & Grosor del Braquial (6 kg)',
    tagline: '2 series • 8-12 reps • Aislamiento en colchoneta',
    isRestDay: false,
    focusMuscles: ['Braquial', 'Braquiorradial', 'Pico de Bíceps', 'Tríceps'],
    estimatedMinutes: 30,
    exercises: [
      EXERCISE_LIBRARY.CURL_MARTILLO,
      EXERCISE_LIBRARY.PRESS_CERRADO_TRICEPS_COLCHONETA,
      EXERCISE_LIBRARY.CURL_CONCENTRADO_SILLA,
      EXERCISE_LIBRARY.COPA_DOS_MANOS,
      EXERCISE_LIBRARY.PRESS_FRANCES_COLCHONETA
    ]
  },
  {
    dayOfWeek: 5,
    title: 'Día 5: Tracción en Colchoneta & Bíceps Bombeo Estricto',
    tagline: '2 series • 8-12 reps • Conexión mente-músculo sin sobrecarga',
    isRestDay: false,
    focusMuscles: ['Espalda Dorsal (Zancada)', 'Bíceps Supinación', 'Tríceps'],
    estimatedMinutes: 30,
    exercises: [
      EXERCISE_LIBRARY.REMO_MANCUERNAS_UNILATERAL,
      EXERCISE_LIBRARY.CURL_SUPINO_MANCUERNAS,
      EXERCISE_LIBRARY.PRESS_CERRADO_TRICEPS_COLCHONETA,
      EXERCISE_LIBRARY.CURL_MARTILLO
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
  let phaseTag = `Fase 1 (Semanas 1-2): Adaptación Anatómica (2 series • 8-12 reps RIR 2 • Cero Dolor de Muñeca)`;
  if (week >= 3 && week <= 4) phaseTag = `Fase 2 (Semanas 3-4): Consolidación & Pausa Isométrica de 1s`;
  if (week >= 5 && week <= 6) phaseTag = `Fase 3 (Semanas 5-6): Progresión a 12-15 reps con 6 kg`;
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

