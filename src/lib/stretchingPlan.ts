import type { UserId } from '../types';

export interface StretchGuideItem {
  id: string;
  muscleName: string;
  targetRole: string; // "Tríceps & Codos", "Bíceps & Pecho", etc.
  equipment: 'Silla' | 'Colchoneta' | 'Pared o Silla' | 'Silla o De pie';
  durationSeconds: number; // 25 to 30s
  hasSides: boolean; // whether to do right/left side
  sideLabel?: string; // "por lado" / "por brazo" / "por pierna"
  instructions: string[];
  correctSensation: string;
  biomechanicTip: string;
}

export const TOMAS_ARM_TORSO_STRETCHES: StretchGuideItem[] = [
  {
    id: 'stretch_tomas_triceps',
    muscleName: 'Tríceps Braquial (tras nuca)',
    targetRole: 'Descompresión del tendón del tríceps y codo',
    equipment: 'Silla o De pie',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por brazo',
    instructions: [
      'Siéntate erguido en la silla o quédate de pie con los pies al ancho de hombros.',
      'Eleva el brazo derecho y flexiónalo por detrás de la cabeza, buscando que la palma toque la parte alta de la espalda entre los omóplatos.',
      'Con la mano izquierda, toma suavemente el codo derecho y empújalo con cuidado hacia abajo y ligeramente hacia adentro.',
      'Mantén el cuello largo y la mirada al frente sin flexionar la cabeza.',
      'Respira hondo durante 30 segundos y repite con el brazo izquierdo.'
    ],
    correctSensation: 'Tensión suave y progresiva en la cara posterior del brazo (tríceps), nunca dolor punzante en la articulación del hombro.',
    biomechanicTip: 'Clave tras extensiones pesadas de tríceps: desactiva el tono espástico del tendón y previene tendinitis de codo.'
  },
  {
    id: 'stretch_tomas_biceps_pec',
    muscleName: 'Bíceps y Pectoral (en pared o silla)',
    targetRole: 'Apertura de bíceps, braquial anterior y fascia torácica',
    equipment: 'Pared o Silla',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por lado',
    instructions: [
      'Párate de costado junto a una pared o al respaldo alto de la silla.',
      'Extiende el brazo hacia atrás apoyando la palma a la altura del hombro, con los dedos orientados hacia atrás.',
      'Mantén el codo en suave extensión y rota suavemente el torso hacia el lado opuesto.',
      'Avanza milimétricamente el pecho hacia adelante hasta sentir la apertura completa del bíceps y pectoral.',
      'Sostén 30 segundos con respiraciones tranquilas y cambia de lado.'
    ],
    correctSensation: 'Tensión suave y progresiva a lo largo de la parte anterior del brazo y pecho, nunca dolor punzante en el hombro o muñeca.',
    biomechanicTip: 'Descomprime la cabeza corta del bíceps y evita que los hombros se vayan hacia adelante (postura cifótica).'
  },
  {
    id: 'stretch_tomas_forearms',
    muscleName: 'Flexores y Extensores de Antebrazo & Muñeca',
    targetRole: 'Alivio del agarre de mancuernas (braquiorradial & flexores de muñeca)',
    equipment: 'Silla o De pie',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por brazo (15s flexores + 15s extensores)',
    instructions: [
      'Extiende el brazo derecho al frente a la altura del hombro con el codo completamente recto.',
      'Fase 1 (Flexores - 15s): Orienta la palma al frente con los dedos hacia arriba. Con la mano izquierda, tira suavemente de los dedos hacia ti.',
      'Fase 2 (Extensores - 15s): Orienta la palma hacia tu cuerpo con los dedos hacia abajo. Con la otra mano, presiona suavemente el dorso de la mano hacia ti.',
      'Repite la secuencia completa con el brazo izquierdo.'
    ],
    correctSensation: 'Tensión suave y progresiva en toda la masa del antebrazo, disipando la congestión del agarre; nunca dolor punzante.',
    biomechanicTip: 'Protege las muñecas y los tendones epicondíleos tras series intensas de curls de bíceps y martillo.'
  },
  {
    id: 'stretch_tomas_lats_back',
    muscleName: 'Dorsal Ancho & Espalda Media',
    targetRole: 'Descompresión escapular y estiramiento de dorsales',
    equipment: 'Silla',
    durationSeconds: 30,
    hasSides: false,
    instructions: [
      'Siéntate en el borde de la silla con los pies firmes en el suelo y rodillas separadas.',
      'Entrelaza los dedos de ambas manos al frente a la altura del pecho.',
      'Empuja las palmas fuertemente hacia adelante mientras redondeas suavemente la espalda alta (curvando la columna dorsal).',
      'Deja caer la cabeza relajada entre los brazos mirando hacia el regazo.',
      'Inhala expandiendo la espalda posterior y exhala profundizando el estiramiento.'
    ],
    correctSensation: 'Tensión suave y progresiva de apertura entre los omóplatos y dorsales, nunca dolor punzante lumbar.',
    biomechanicTip: 'Restaura el espacio articular del hombro y la movilidad de la caja torácica tras empujes y tracciones.'
  }
];

export const MIRANDA_FULLBODY_STRETCHES: StretchGuideItem[] = [
  {
    id: 'stretch_miranda_hamstrings',
    muscleName: 'Isquiotibiales (Cadena Posterior)',
    targetRole: 'Alivio y flexibilidad en la parte posterior del muslo',
    equipment: 'Colchoneta',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por pierna (o ambas juntas)',
    instructions: [
      'Siéntate sobre la colchoneta con la espalda erguida y las piernas extendidas al frente.',
      'Inicia el movimiento flexionando desde las caderas (llevando el ombligo hacia los muslos), sin arquear ni encorvar la columna en exceso.',
      'Desliza las manos por las piernas hacia las espinillas, tobillos o pies según tu nivel cómodo de flexibilidad.',
      'Mantén los hombros relajados y el cuello suave, respirando de forma pausada.',
      'Sostén 30 segundos relajando la tensión con cada exhalación.'
    ],
    correctSensation: 'Tensión suave y progresiva en el vientre de los isquiotibiales (detrás del muslo), nunca dolor punzante detrás de la rodilla.',
    biomechanicTip: 'Alivia la tensión acumulada por peso muerto rumano y sentadillas, cuidando la zona lumbar.'
  },
  {
    id: 'stretch_miranda_glutes_fig4',
    muscleName: 'Glúteos & Piramidal (Figura 4 Anti-Pinzamiento)',
    targetRole: 'Descompresión profunda de glúteo mayor y cadera',
    equipment: 'Colchoneta',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por pierna',
    instructions: [
      'Acuéstate boca arriba en la colchoneta con ambas rodillas flexionadas y pies apoyados.',
      'Cruza el tobillo derecho sobre el muslo o rodilla izquierda, formando un número "4".',
      'Pasa las manos por detrás del muslo izquierdo y acércalo suavemente hacia tu pecho.',
      'Mantén la cabeza y los hombros relajados descansando sobre la colchoneta.',
      'Siente la liberación en el centro del glúteo derecho durante 30 segundos y luego cambia de lado.'
    ],
    correctSensation: 'Tensión suave y progresiva en el glúteo y cadera profunda, sensación de alivio; nunca dolor punzante articular.',
    biomechanicTip: 'Esencial tras box squats, zancadas y puentes de glúteo: previene la contractura del piramidal y sobrecarga ciática.'
  },
  {
    id: 'stretch_miranda_quadriceps',
    muscleName: 'Cuádriceps & Flexores de Cadera',
    targetRole: 'Relajación de la cara anterior del muslo y psoas',
    equipment: 'Silla',
    durationSeconds: 30,
    hasSides: true,
    sideLabel: 'por pierna',
    instructions: [
      'Párate erguida junto a la silla y apoya una mano en el respaldo para equilibrio total y seguro.',
      'Con la mano libre, flexiona la rodilla hacia atrás y toma el empeine o tobillo, llevando el talón suavemente hacia el glúteo.',
      'Mantén ambas rodillas juntas y alineadas, con la pelvis en posición neutra (aprieta ligeramente el abdomen para no arquear la cintura).',
      'Sostén el tronco erguido y respira con calma durante 30 segundos.',
      'Baja la pierna lentamente y repite con el lado opuesto.'
    ],
    correctSensation: 'Tensión suave y progresiva en la parte frontal del muslo (cuádriceps), nunca dolor punzante en la rótula.',
    biomechanicTip: 'Restaura la longitud del cuádriceps tras las zancadas y sentadillas, protegiendo los tendones rotulianos.'
  },
  {
    id: 'stretch_miranda_chest_shoulders_chair',
    muscleName: 'Pecho y Hombros en Silla (Apertura Torácica)',
    targetRole: 'Apertura de pectoral, deltoides y corrección postural',
    equipment: 'Silla',
    durationSeconds: 30,
    hasSides: false,
    instructions: [
      'Siéntate en el borde delantero de la silla con los pies firmes y planos en el suelo.',
      'Lleva los brazos hacia atrás y apoya las palmas en el borde trasero del asiento o en la base del respaldo.',
      'Gira suavemente los hombros hacia atrás y hacia abajo, y proyecta el esternón hacia arriba abriendo el tórax.',
      'Mantén el cuello neutro (sin tirar la cabeza bruscamente hacia atrás).',
      'Realiza respiraciones diafragmáticas lentas y profundas, sintiendo la relajación del sistema nervioso.'
    ],
    correctSensation: 'Tensión suave y progresiva de apertura torácica y liberación de hombros, sensación de alivio y respiración amplia.',
    biomechanicTip: 'Contrarresta la tensión de las flexiones inclinadas y ayuda a reducir los niveles de cortisol post-entreno.'
  }
];

export function getStretchingRoutineForUser(userId: UserId): StretchGuideItem[] {
  if (userId === 'miranda') {
    return MIRANDA_FULLBODY_STRETCHES;
  }
  return TOMAS_ARM_TORSO_STRETCHES;
}
