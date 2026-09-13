import type { MealEntry, UserProfile, RecognizedFoodItem } from '../types';
import { getStoredGeminiKey } from './geminiNutrition';

export interface RecommendedMealOption {
  id: string;
  title: string;
  tag: 'Volumen & Saciedad' | 'Rápida & Práctica' | 'Snack / Dulce Saludable' | 'Hipertrofia Limpia';
  description: string;
  ingredientsText: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  whyThisOption: string;
  mealType: MealEntry['mealType'];
  recognizedItems: RecognizedFoodItem[];
}

export type BalanceStatus = 'optimal' | 'compensation' | 'exceeded';

export interface MealRebalanceAnalysis {
  caloriesConsumed: number;
  proteinConsumed: number;
  targetCalories: number;
  targetProtein: number;
  remainingCalories: number;
  remainingProtein: number;
  status: BalanceStatus;
  statusMessage: string;
  highestCalorieMeal?: MealEntry;
  nextSuggestedMealType: MealEntry['mealType'];
  budgetPerRemainingMeal: number;
}

/**
 * Calculates current daily nutritional balance and determines if compensation mode is needed
 */
export function analyzeDailyNutritionBalance(
  profile: UserProfile,
  meals: MealEntry[]
): MealRebalanceAnalysis {
  const isMiranda = profile.id === 'miranda';
  const targetCalories = profile.targetCalories || profile.targetSurplusCalories || (isMiranda ? 1425 : 2650);
  const targetProtein = profile.targetProteinGrams || (isMiranda ? 100 : 145);

  const caloriesConsumed = meals.reduce((acc, m) => acc + m.calories, 0);
  const proteinConsumed = Math.round(meals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
  const remainingCalories = targetCalories - caloriesConsumed;
  const remainingProtein = Math.max(0, Math.round((targetProtein - proteinConsumed) * 10) / 10);

  // Determine highest single meal to detect spikes
  const highestCalorieMeal = meals.length > 0 
    ? [...meals].sort((a, b) => b.calories - a.calories)[0] 
    : undefined;

  // Determine what meal is next based on logged meal types
  const loggedTypes = new Set(meals.map(m => m.mealType));
  let nextSuggestedMealType: MealEntry['mealType'] = 'Almuerzo';
  let estimatedRemainingMealsCount = 2;

  if (!loggedTypes.has('Desayuno')) {
    nextSuggestedMealType = 'Desayuno';
    estimatedRemainingMealsCount = 3;
  } else if (!loggedTypes.has('Almuerzo')) {
    nextSuggestedMealType = 'Almuerzo';
    estimatedRemainingMealsCount = 2;
  } else if (!loggedTypes.has('Merienda')) {
    nextSuggestedMealType = 'Merienda';
    estimatedRemainingMealsCount = 2;
  } else if (!loggedTypes.has('Cena')) {
    nextSuggestedMealType = 'Cena';
    estimatedRemainingMealsCount = 1;
  } else {
    nextSuggestedMealType = 'Snack';
    estimatedRemainingMealsCount = 1;
  }

  const budgetPerRemainingMeal = Math.max(
    80, 
    Math.round(remainingCalories / Math.max(1, estimatedRemainingMealsCount))
  );

  // Status diagnosis
  let status: BalanceStatus = 'optimal';
  let statusMessage = '';

  if (isMiranda) {
    if (remainingCalories <= 0) {
      status = 'exceeded';
      statusMessage = `Has alcanzado el límite de ${targetCalories} kcal. Para no frenar tu déficit, priorizamos hidratación, infusiones relajantes y alimentos de volumen casi nulo en calorías.`;
    } else if (
      (highestCalorieMeal && highestCalorieMeal.calories >= targetCalories * 0.48) || 
      (remainingCalories < 480 && estimatedRemainingMealsCount >= 2) ||
      (remainingCalories < 280 && estimatedRemainingMealsCount === 1)
    ) {
      status = 'compensation';
      const spikeText = highestCalorieMeal ? ` (comida de ${highestCalorieMeal.calories} kcal)` : '';
      statusMessage = `¡Modo Compensación Activo! Detectamos una ingesta calórica densa${spikeText}. Ajustamos tus próximas comidas a platos de gran volumen, fibra y proteína magra para mantener tu meta de 55 kg sin pasar hambre.`;
    } else {
      status = 'optimal';
      statusMessage = `Ritmo calórico equilibrado. Te quedan ${remainingCalories} kcal y ${remainingProtein}g de proteína distribuidas para el resto del día.`;
    }
  } else {
    // Tomás (Surplus)
    if (caloriesConsumed >= targetCalories && remainingProtein > 15) {
      status = 'compensation';
      statusMessage = `Has llegado a tus calorías pero te faltan ${remainingProtein}g de proteína. Te sugerimos fuentes proteicas ultra-puras (claras o batido whey) para no acumular grasa innecesaria.`;
    } else if (remainingCalories > 1100 && meals.length >= 2) {
      status = 'compensation';
      statusMessage = `Vas bajo en calorías para tu superávit de brazos (te faltan ${remainingCalories} kcal). Te sugerimos fuentes limpias y densas en energía para asegurar la hipertrofia.`;
    } else {
      status = 'optimal';
      statusMessage = `Buen ritmo anabólico. Restan ${remainingCalories} kcal y ${remainingProtein}g de proteína para completar tu superávit del día.`;
    }
  }

  return {
    caloriesConsumed,
    proteinConsumed,
    targetCalories,
    targetProtein,
    remainingCalories,
    remainingProtein,
    status,
    statusMessage,
    highestCalorieMeal,
    nextSuggestedMealType,
    budgetPerRemainingMeal
  };
}

/**
 * Generates immediate local recommended meal options tailored to the user and their remaining budget
 */
export function getLocalMealRecommendations(
  profile: UserProfile,
  analysis: MealRebalanceAnalysis
): RecommendedMealOption[] {
  const isMiranda = profile.id === 'miranda';
  const { remainingCalories, remainingProtein, status, nextSuggestedMealType, budgetPerRemainingMeal } = analysis;

  if (isMiranda) {
    if (status === 'compensation' || remainingCalories < 450) {
      // High volume, high satiety, very low calorie density options for Miranda
      return [
        {
          id: 'rec_m_comp_1',
          title: 'Wok Abundante de Verduras al Vapor con Pechuga de Pollo',
          tag: 'Volumen & Saciedad',
          description: 'Gran plato de 400g de vegetales crujientes con proteína magra que llena el estómago sin sumar calorías.',
          ingredientsText: '130g pechuga de pollo a la plancha con 200g calabacín, 100g champiñones y 1 cdita aceite de oliva',
          calories: 275,
          protein: 34,
          carbs: 11,
          fats: 6,
          whyThisOption: 'Aporta 34g de proteína con solo 275 kcal. Los vegetales añaden volumen gástrico para neutralizar el hambre sin romper el déficit.',
          mealType: nextSuggestedMealType,
          recognizedItems: [
            { name: 'Pechuga de pollo a la plancha', quantityStr: '130g', calories: 215, protein: 32, carbs: 0, fats: 4.5 },
            { name: 'Calabacín y champiñones', quantityStr: '300g', calories: 60, protein: 2, carbs: 11, fats: 1.5 }
          ]
        },
        {
          id: 'rec_m_comp_2',
          title: 'Bowl Verde de Atún al Natural con Tomate & Orégano',
          tag: 'Rápida & Práctica',
          description: 'Se prepara en 3 minutos. Proteína limpia de rápida absorción sin grasas saturadas.',
          ingredientsText: '1 lata de atún al natural con 1 tomate grande picado, hojas verdes y 1 cdita de semillas de chía',
          calories: 195,
          protein: 28,
          carbs: 8,
          fats: 4,
          whyThisOption: 'Rescata tu déficit con menos de 200 kcal y 28g de proteína. La chía aporta fibra soluble cardioprotectora.',
          mealType: nextSuggestedMealType,
          recognizedItems: [
            { name: 'Atún al natural en lata', quantityStr: '1 lata (120g)', calories: 120, protein: 26, carbs: 0, fats: 1 },
            { name: 'Tomate y hojas verdes con chía', quantityStr: '1 bowl', calories: 75, protein: 2, carbs: 8, fats: 3 }
          ]
        },
        {
          id: 'rec_m_comp_3',
          title: 'Postre Anti-Ansiedad: Yogur 0% con Canela & Té Caliente',
          tag: 'Snack / Dulce Saludable',
          description: 'El postre perfecto para cerrar el día sin culpa y desactivar las ganas de dulce.',
          ingredientsText: '120g yogur griego 0% con 80g frutillas frescas, canela en polvo y té digestivo caliente',
          calories: 105,
          protein: 13,
          carbs: 11,
          fats: 0.5,
          whyThisOption: 'Sacia el paladar dulce con solo 105 kcal y 13g de proteína. La infusión caliente activa saciedad cerebral.',
          mealType: 'Snack',
          recognizedItems: [
            { name: 'Yogur griego 0% con frutillas', quantityStr: '1 porción', calories: 105, protein: 13, carbs: 11, fats: 0.5 }
          ]
        }
      ];
    } else {
      // Miranda Normal Balanced Options
      return [
        {
          id: 'rec_m_norm_1',
          title: 'Pechuga a la Plancha con Arroz Integral & Ensalada',
          tag: 'Volumen & Saciedad',
          description: 'Carbohidratos de asimilación lenta con fibra y proteína limpia para el tono muscular.',
          ingredientsText: '120g pechuga de pollo, 90g arroz integral cocido y ensalada verde con 1 cdita aceite de oliva',
          calories: 360,
          protein: 32,
          carbs: 26,
          fats: 8,
          whyThisOption: 'Mantiene tu metabolismo activo y aporta energía estable para tu caminata diaria.',
          mealType: nextSuggestedMealType,
          recognizedItems: [
            { name: 'Pechuga de pollo', quantityStr: '120g', calories: 200, protein: 30, carbs: 0, fats: 4 },
            { name: 'Arroz integral cocido', quantityStr: '90g', calories: 105, protein: 2.3, carbs: 22, fats: 0.8 },
            { name: 'Ensalada con aceite de oliva', quantityStr: '1 porción', calories: 55, protein: 0.5, carbs: 4, fats: 4 }
          ]
        },
        {
          id: 'rec_m_norm_2',
          title: 'Tortilla Francesa de 2 Huevos con Espinacas & Tostada Integral',
          tag: 'Rápida & Práctica',
          description: 'Desayuno o cena reconfortante y saciante con proteína completa.',
          ingredientsText: '2 huevos revueltos con espinacas y 1 tostada de pan integral',
          calories: 235,
          protein: 16.5,
          carbs: 13.5,
          fats: 11,
          whyThisOption: 'Aporta colina, hierro y fibra lenta, perfecto para calmar la ansiedad.',
          mealType: nextSuggestedMealType,
          recognizedItems: [
            { name: 'Huevos revueltos con espinacas', quantityStr: '2 unidades', calories: 165, protein: 13.5, carbs: 1.5, fats: 10.5 },
            { name: 'Tostada de pan integral', quantityStr: '1 rebanada (30g)', calories: 70, protein: 3, carbs: 12, fats: 0.8 }
          ]
        },
        {
          id: 'rec_m_norm_3',
          title: 'Pudding de Chía con Yogur 0% & Arándanos',
          tag: 'Snack / Dulce Saludable',
          description: 'Snack saciante rico en omega-3 vegetales y antioxidantes.',
          ingredientsText: '150g yogur griego 0% con 1 cda de chía hidratada y 50g arándanos',
          calories: 165,
          protein: 15,
          carbs: 15,
          fats: 3.5,
          whyThisOption: 'La fibra soluble de la chía disminuye el colesterol y aporta saciedad por más de 3 horas.',
          mealType: 'Snack',
          recognizedItems: [
            { name: 'Yogur griego 0% con chía y arándanos', quantityStr: '1 vaso', calories: 165, protein: 15, carbs: 15, fats: 3.5 }
          ]
        }
      ];
    }
  } else {
    // Tomás (Hypertrophy Surplus)
    return [
      {
        id: 'rec_t_1',
        title: 'Bowl Anabólico de Arroz Blanco, Pollo & Aceite de Oliva',
        tag: 'Hipertrofia Limpia',
        description: 'La comida dorada de la hipertrofia: digestión rápida para rellenar glucógeno en bíceps y tríceps.',
        ingredientsText: '200g pechuga de pollo con 200g arroz blanco cocido y 1 cucharada de aceite de oliva virgen extra',
        calories: 590,
        protein: 52,
        carbs: 56,
        fats: 15,
        whyThisOption: '52g de proteína de altísimo valor biológico con leucina para activar mTOR en tus brazos.',
        mealType: nextSuggestedMealType,
        recognizedItems: [
          { name: 'Pechuga de pollo a la plancha', quantityStr: '200g', calories: 330, protein: 48, carbs: 0, fats: 6 },
          { name: 'Arroz blanco cocido', quantityStr: '200g', calories: 260, protein: 5.4, carbs: 56, fats: 0.6 }
        ]
      },
      {
        id: 'rec_t_2',
        title: 'Batido Hipercalórico Limpio de Avena, Proteína & Banana',
        tag: 'Rápida & Práctica',
        description: 'Listo en 2 minutos para sumar calorías limpias sin saturar el sistema digestivo.',
        ingredientsText: '1 scoop de proteína whey, 60g avena en hojuelas, 1 banana madura y 250ml leche',
        calories: 490,
        protein: 38,
        carbs: 65,
        fats: 7,
        whyThisOption: 'Si te faltan calorías para tus 2.650 kcal, este batido aporta casi 500 kcal con 38g de proteína.',
        mealType: 'Merienda',
        recognizedItems: [
          { name: 'Batido de proteína con avena y banana', quantityStr: '1 vaso grande (500ml)', calories: 490, protein: 38, carbs: 65, fats: 7 }
        ]
      },
      {
        id: 'rec_t_3',
        title: 'Tostadas Integrales con Huevos & Crema de Maní',
        tag: 'Hipertrofia Limpia',
        description: 'Combinación perfecta de grasas monoinsaturadas y aminoácidos para la noche.',
        ingredientsText: '3 huevos revueltos con 2 tostadas de pan integral y 1 cda de mantequilla de maní',
        calories: 470,
        protein: 27,
        carbs: 29,
        fats: 23,
        whyThisOption: 'Excelente síntesis proteica nocturna mientras descansas para la reconstrucción de los tríceps.',
        mealType: nextSuggestedMealType,
        recognizedItems: [
          { name: 'Huevos revueltos', quantityStr: '3 unidades', calories: 230, protein: 19, carbs: 1.5, fats: 16 },
          { name: 'Tostada de pan integral con mantequilla de maní', quantityStr: '2 tostadas + 1 cda', calories: 240, protein: 8, carbs: 27, fats: 7 }
        ]
      }
    ];
  }
}

/**
 * Calls Gemini AI to generate live, highly tailored recommendations based on what the user already ate
 */
export async function fetchAdaptiveRecommendationsWithGemini(
  profile: UserProfile,
  meals: MealEntry[],
  analysis: MealRebalanceAnalysis
): Promise<RecommendedMealOption[]> {
  const apiKey = getStoredGeminiKey();
  if (!apiKey) {
    return getLocalMealRecommendations(profile, analysis);
  }

  const isMiranda = profile.id === 'miranda';
  const eatenListText = meals.length > 0
    ? meals.map(m => `- ${m.mealType}: "${m.rawText}" (${m.calories} kcal, ${m.protein}g P)`).join('\n')
    : '(Aún no ha registrado comidas hoy)';

  const prompt = `Actúa como un entrenador y nutricionista deportivo de élite.
El usuario se llama ${profile.name}, tiene ${profile.age} años, pesa ${profile.weightKg} kg y su objetivo es ${isMiranda ? 'DÉFICIT CALÓRICO y tonificación hacia los 55 kg' : 'SUPERÁVIT CALÓRICO e hipertrofia de brazos'}.

SITUACIÓN NUTRICIONAL EXACTA DEL DÍA DE HOY:
- Meta diaria: ${analysis.targetCalories} kcal y ${analysis.targetProtein}g de proteína.
- Ya consumió hoy: ${analysis.caloriesConsumed} kcal y ${analysis.proteinConsumed}g de proteína.
- LE RESTAN POR CONSUMIR: EXACTAMENTE ${analysis.remainingCalories} kcal y ${analysis.remainingProtein}g de proteína.
- Comidas ya registradas hoy:
${eatenListText}

ESTADO DE BALANCE:
${analysis.status === 'compensation' 
  ? `ALERTA DE COMPENSACIÓN ACTIVA: El usuario tuvo una comida densa o le quedan pocas calorías (${analysis.remainingCalories} kcal). DEBES sugerir comidas de MÁXIMO VOLUMEN y saciedad (verduras de hoja, proteína magra, sopas/caldos, fibra soluble) para que no pase hambre y mantenga su meta intacta.`
  : `RITMO NORMAL: Recomienda opciones deliciosas y balanceadas que encajen en el presupuesto de su próxima comida (${analysis.nextSuggestedMealType}).`
}

REGLAS ESPECÍFICAS OBLIGATORIAS:
${isMiranda ? '- REGLA ESTRICTA 1: CERO PALTA / AGUACATE. No incluyas palta en ninguna recomendación.\n- REGLA ESTRICTA 2: Control de colesterol: grasas saludables vegetales (aceite de oliva crudo, chía, nueces medidas), nada de fritos ni grasas saturadas.\n- Incluye opciones anti-ansiedad de dulces saludables (frutillas con cacao puro 100%, canela, infusiones digestivas calientes).' : '- Prioriza fuentes ricas en proteína para hipertrofia de brazos (pollo, huevos, atún, avena, leche).'}
- Próxima comida objetivo sugerida: ${analysis.nextSuggestedMealType}.

Genera exactamente 3 opciones variadas que ayuden a equilibrar el día:
1. Opción 1: "Volumen & Saciedad" (Mucho plato, pocas calorías, saciedad extrema)
2. Opción 2: "Rápida & Práctica" (Menos de 10 minutos de preparación)
3. Opción 3: ${isMiranda ? '"Snack / Dulce Saludable" (Anti-antojo dulce post-comida o merienda saciante)' : '"Hipertrofia Limpia" (Calorías densas y limpias)'}

Responde ÚNICAMENTE un JSON con esta estructura exacta (sin markdown extra):
{
  "recommendations": [
    {
      "title": "Nombre llamativo del plato",
      "tag": "Volumen & Saciedad",
      "description": "Breve descripción apetitosa de 1 frase",
      "ingredientsText": "120g pechuga de pollo, 200g calabacín salteado y 1 cdita de aceite de oliva",
      "calories": 280,
      "protein": 32.0,
      "carbs": 12.0,
      "fats": 6.0,
      "whyThisOption": "Por qué equilibra tu día hoy (ej. Te aporta 32g de proteína consumiendo solo el 40% de tus calorías restantes)",
      "mealType": "${analysis.nextSuggestedMealType}",
      "recognizedItems": [
        {
          "name": "Pechuga de pollo a la plancha",
          "quantityStr": "120g",
          "calories": 190,
          "protein": 30,
          "carbs": 0,
          "fats": 4
        }
      ]
    }
  ]
}`;

  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest'
  ];

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        })
      });

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) continue;

      const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed.recommendations) && parsed.recommendations.length > 0) {
        return parsed.recommendations.map((rec: any, idx: number) => ({
          id: `gemini_rec_${Date.now()}_${idx}`,
          title: String(rec.title || 'Opción Recomendada'),
          tag: rec.tag || 'Volumen & Saciedad',
          description: String(rec.description || ''),
          ingredientsText: String(rec.ingredientsText || rec.title),
          calories: Math.round(Number(rec.calories) || 250),
          protein: Math.round((Number(rec.protein) || 20) * 10) / 10,
          carbs: Math.round((Number(rec.carbs) || 15) * 10) / 10,
          fats: Math.round((Number(rec.fats) || 6) * 10) / 10,
          whyThisOption: String(rec.whyThisOption || 'Equilibra tu presupuesto nutricional.'),
          mealType: (rec.mealType as MealEntry['mealType']) || analysis.nextSuggestedMealType,
          recognizedItems: Array.isArray(rec.recognizedItems) && rec.recognizedItems.length > 0 
            ? rec.recognizedItems 
            : [
                {
                  name: rec.title,
                  quantityStr: '1 porción sugerida',
                  calories: Math.round(Number(rec.calories) || 250),
                  protein: Math.round(Number(rec.protein) || 20),
                  carbs: Math.round(Number(rec.carbs) || 15),
                  fats: Math.round(Number(rec.fats) || 6)
                }
              ]
        }));
      }
    } catch (err) {
      console.warn(`Error attempting model ${model} for adaptive recommendations:`, err);
    }
  }

  return getLocalMealRecommendations(profile, analysis);
}
