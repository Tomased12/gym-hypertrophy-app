import type { RecognizedFoodItem } from '../types';

interface FoodDatabaseItem {
  aliases: string[];
  defaultUnit: string;
  defaultPortionGrams: number;
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  portionPresets?: Record<string, number>; // e.g. "unidad": 60g, "cucharada": 20g
}

const FOOD_DATABASE: FoodDatabaseItem[] = [
  {
    aliases: ['huevo', 'huevos', 'huevo revuelto', 'huevos revueltos', 'huevo cocido', 'huevo frito'],
    defaultUnit: 'unidad',
    defaultPortionGrams: 55, // 1 huevo grande ~55g
    per100g: { calories: 143, protein: 12.6, carbs: 0.7, fats: 9.5 },
    portionPresets: { unidad: 55, claras: 35, clara: 35 }
  },
  {
    aliases: ['clara', 'claras', 'claras de huevo'],
    defaultUnit: 'unidad',
    defaultPortionGrams: 35,
    per100g: { calories: 52, protein: 11, carbs: 0.7, fats: 0.2 }
  },
  {
    aliases: ['tostada de pan integral', 'pan integral', 'tostada integral', 'pan de molde integral', 'pan negro', 'rebanada de pan integral', 'pan de salvado'],
    defaultUnit: 'rebanada',
    defaultPortionGrams: 30,
    per100g: { calories: 235, protein: 11, carbs: 42, fats: 2.5 },
    portionPresets: { rebanada: 30, tostada: 30, unidad: 30 }
  },
  {
    aliases: ['tostada de pan blanco', 'pan blanco', 'pan clasico', 'pan de molde', 'pan lactal', 'pan frances', 'tostada clasica', 'tostada blanca', 'tostada', 'tostadas', 'pan', 'pan tostado', 'rebanada de pan', 'rebanadas'],
    defaultUnit: 'rebanada',
    defaultPortionGrams: 30,
    per100g: { calories: 268, protein: 8.5, carbs: 51, fats: 3.2 },
    portionPresets: { rebanada: 30, tostada: 30, unidad: 30 }
  },
  {
    aliases: ['mantequilla de mani', 'mantequilla de cacahuate', 'crema de mani', 'peanut butter', 'crema de cacahuete'],
    defaultUnit: 'cucharada',
    defaultPortionGrams: 20, // 1 cda colmada ~20g
    per100g: { calories: 588, protein: 25, carbs: 20, fats: 50 },
    portionPresets: { cucharada: 20, cucharadita: 10, cda: 20 }
  },
  {
    aliases: ['pechuga de pollo', 'pollo', 'pollo a la plancha', 'pechuga'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 150,
    per100g: { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
    portionPresets: { filete: 150, porcion: 150, presa: 120 }
  },
  {
    aliases: ['carne', 'carne de res', 'bife', 'bistec', 'ternera', 'carne picada', 'lomo'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 180,
    per100g: { calories: 220, protein: 26, carbs: 0, fats: 12.5 },
    portionPresets: { bife: 180, bistec: 180, hamburguesa: 120 }
  },
  {
    aliases: ['atun', 'atun en lata', 'atun al agua', 'lata de atun'],
    defaultUnit: 'lata',
    defaultPortionGrams: 120, // 1 lata escurrida ~120g
    per100g: { calories: 115, protein: 26, carbs: 0, fats: 1 },
    portionPresets: { lata: 120, unidad: 120 }
  },
  {
    aliases: ['arroz integral', 'arroz yamani', 'arroz integral cocido'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 150,
    per100g: { calories: 112, protein: 2.6, carbs: 23.5, fats: 0.9 },
    portionPresets: { taza: 180, plato: 200 }
  },
  {
    aliases: ['arroz blanco', 'arroz blanco cocido', 'arroz', 'arroz cocido'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 150,
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fats: 0.3 },
    portionPresets: { taza: 180, plato: 200 }
  },
  {
    aliases: ['avena', 'avena en hojuelas', 'harina de avena', 'porridge'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 50,
    per100g: { calories: 389, protein: 16.9, carbs: 66.3, fats: 6.9 },
    portionPresets: { taza: 80, cucharada: 15 }
  },
  {
    aliases: ['leche descremada', 'leche desnatada', 'leche 0%'],
    defaultUnit: 'ml',
    defaultPortionGrams: 250,
    per100g: { calories: 35, protein: 3.4, carbs: 4.9, fats: 0.1 },
    portionPresets: { vaso: 250, taza: 250 }
  },
  {
    aliases: ['leche entera', 'leche', 'leche semi', 'leche semidescremada'],
    defaultUnit: 'ml',
    defaultPortionGrams: 250,
    per100g: { calories: 60, protein: 3.2, carbs: 4.7, fats: 3.3 },
    portionPresets: { vaso: 250, taza: 250 }
  },
  {
    aliases: ['proteina', 'whey', 'proteina en polvo', 'batido de proteina', 'scoop de proteina', 'whey protein'],
    defaultUnit: 'scoop',
    defaultPortionGrams: 30, // 1 scoop ~30g
    per100g: { calories: 390, protein: 78, carbs: 6, fats: 4 },
    portionPresets: { scoop: 30, porcion: 30, batido: 35 }
  },
  {
    aliases: ['yogur griego', 'yogur', 'yogurt griego', 'yogurt natural'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 150,
    per100g: { calories: 95, protein: 10, carbs: 4, fats: 4.5 },
    portionPresets: { pote: 150, vaso: 200 }
  },
  {
    aliases: ['banana', 'platano', 'guineo'],
    defaultUnit: 'unidad',
    defaultPortionGrams: 110,
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3 },
    portionPresets: { unidad: 110, mediana: 110, grande: 140 }
  },
  {
    aliases: ['manzana'],
    defaultUnit: 'unidad',
    defaultPortionGrams: 150,
    per100g: { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
    portionPresets: { unidad: 150 }
  },
  {
    aliases: ['papa', 'patata', 'papas cocidas', 'patatas'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 200,
    per100g: { calories: 87, protein: 1.9, carbs: 20.1, fats: 0.1 },
    portionPresets: { unidad: 150, grande: 220 }
  },
  {
    aliases: ['boniato', 'batata', 'camote'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 180,
    per100g: { calories: 86, protein: 1.6, carbs: 20, fats: 0.1 }
  },
  {
    aliases: ['palta', 'aguacate'],
    defaultUnit: 'unidad',
    defaultPortionGrams: 100, // media palta ~100g
    per100g: { calories: 160, protein: 2, carbs: 8.5, fats: 14.7 },
    portionPresets: { media: 80, unidad: 150 }
  },
  {
    aliases: ['frutos secos', 'nueces', 'almendras', 'mani', 'cacahuates'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 30,
    per100g: { calories: 610, protein: 20, carbs: 17, fats: 52 },
    portionPresets: { punado: 30, cucharada: 15 }
  },
  {
    aliases: ['aceite de oliva', 'aceite'],
    defaultUnit: 'cucharada',
    defaultPortionGrams: 14,
    per100g: { calories: 884, protein: 0, carbs: 0, fats: 100 },
    portionPresets: { cucharada: 14, chorrito: 10 }
  },
  {
    aliases: ['pasta', 'fideos', 'espaguetis', 'macarrones'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 160, // cocidos
    per100g: { calories: 158, protein: 5.8, carbs: 31, fats: 0.9 }
  },
  {
    aliases: ['queso', 'queso fresco', 'queso muzzarella', 'mozzarella', 'queso magro'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 40,
    per100g: { calories: 290, protein: 22, carbs: 2, fats: 22 },
    portionPresets: { rebanada: 30, porcion: 40 }
  },
  {
    aliases: ['lentejas', 'garbanzos', 'frijoles', 'legumbres'],
    defaultUnit: 'gramos',
    defaultPortionGrams: 180,
    per100g: { calories: 116, protein: 9, carbs: 20, fats: 0.4 }
  }
];

// Spanish text to number mapping
const NUMBER_WORDS: Record<string, number> = {
  'un': 1,
  'uno': 1,
  'una': 1,
  'medio': 0.5,
  'media': 0.5,
  'dos': 2,
  'tres': 3,
  'cuatro': 4,
  'cinco': 5,
  'seis': 6,
  'siete': 7,
  'ocho': 8,
  'nueve': 9,
  'diez': 10,
  'doce': 12
};

export interface ParseResult {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  recognizedItems: RecognizedFoodItem[];
  unrecognizedClauses: string[];
}

function normalizeText(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Intelligent parser that extracts macros and calories from natural Spanish sentences
 * Example input: "3 huevos revueltos, 2 tostadas y una cucharada de mantequilla de maní"
 */
export function parseMealText(text: string): ParseResult {
  if (!text || !text.trim()) {
    return { calories: 0, protein: 0, carbs: 0, fats: 0, recognizedItems: [], unrecognizedClauses: [] };
  }

  // Split by commas, " y ", " + ", " con ", newlines
  const clauses = text
    .split(/[,;\n+]|\s+y\s+|\s+con\s+/i)
    .map(c => c.trim())
    .filter(c => c.length > 0);

  const recognizedItems: RecognizedFoodItem[] = [];
  const unrecognizedClauses: string[] = [];

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const rawClause of clauses) {
    const clauseNormalized = normalizeText(rawClause);

    // 1. Extract quantity and possible unit
    let quantity = 1;

    // Check for digits (e.g. 3, 150g, 2.5, etc.)
    const digitMatch = clauseNormalized.match(/(\d+(?:[.,]\d+)?)\s*(g|gr|gramos|kg|ml|cda|cdita|cucharada|cucharadas|taza|tazas|scoop|scoops|rebanada|rebanadas|tostada|tostadas|lata|latas|vaso|vasos)?/i);
    let explicitUnit = '';

    if (digitMatch) {
      quantity = parseFloat(digitMatch[1].replace(',', '.'));
      explicitUnit = digitMatch[2] ? digitMatch[2].toLowerCase() : '';
    } else {
      // Check for word numbers ("dos", "tres", "una", "media", etc.)
      for (const [word, val] of Object.entries(NUMBER_WORDS)) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(clauseNormalized)) {
          quantity = val;
          break;
        }
      }
    }

    // Also look for explicit units if not caught by digit regex (e.g. "una cucharada de...")
    if (!explicitUnit) {
      const unitRegex = /\b(cucharadas?|cdita|tazas?|scoops?|rebanadas?|tostadas?|latas?|vasos?|gramos|gr|g|kg|ml)\b/i;
      const uMatch = clauseNormalized.match(unitRegex);
      if (uMatch) {
        explicitUnit = uMatch[1].toLowerCase();
        // standardize plural
        if (explicitUnit === 'cucharadas') explicitUnit = 'cucharada';
        if (explicitUnit === 'tazas') explicitUnit = 'taza';
        if (explicitUnit === 'rebanadas') explicitUnit = 'rebanada';
        if (explicitUnit === 'tostadas') explicitUnit = 'tostada';
        if (explicitUnit === 'latas') explicitUnit = 'lata';
        if (explicitUnit === 'vasos') explicitUnit = 'vaso';
      }
    }

    // 2. Find best food match in database
    let bestFood: FoodDatabaseItem | null = null;
    let bestAliasLength = 0;

    for (const food of FOOD_DATABASE) {
      for (const alias of food.aliases) {
        const aliasNorm = normalizeText(alias);
        if (clauseNormalized.includes(aliasNorm) && aliasNorm.length > bestAliasLength) {
          bestFood = food;
          bestAliasLength = aliasNorm.length;
        }
      }
    }

    if (bestFood) {
      // Determine grams based on unit or food default
      let weightGrams = 0;

      if (explicitUnit.startsWith('g') || explicitUnit === 'gr' || explicitUnit === 'gramos') {
        weightGrams = quantity;
      } else if (explicitUnit === 'kg') {
        weightGrams = quantity * 1000;
      } else if (explicitUnit.startsWith('ml')) {
        weightGrams = quantity; // approx 1g/ml
      } else if (explicitUnit && bestFood.portionPresets && bestFood.portionPresets[explicitUnit]) {
        weightGrams = quantity * bestFood.portionPresets[explicitUnit];
      } else {
        // Use default portion for the food item
        weightGrams = quantity * bestFood.defaultPortionGrams;
      }

      // Calculate macros
      const factor = weightGrams / 100;
      const cal = Math.round(bestFood.per100g.calories * factor);
      const prot = Math.round(bestFood.per100g.protein * factor * 10) / 10;
      const carb = Math.round(bestFood.per100g.carbs * factor * 10) / 10;
      const fat = Math.round(bestFood.per100g.fats * factor * 10) / 10;

      totalCalories += cal;
      totalProtein += prot;
      totalCarbs += carb;
      totalFats += fat;

      recognizedItems.push({
        name: bestFood.aliases[0].charAt(0).toUpperCase() + bestFood.aliases[0].slice(1),
        quantityStr: `${quantity} ${explicitUnit || bestFood.defaultUnit} (~${Math.round(weightGrams)}g)`,
        calories: cal,
        protein: prot,
        carbs: carb,
        fats: fat
      });
    } else {
      // Heuristic fallback for unrecognized food so user gets an estimation rather than zero
      // Estimate ~200 kcal with balanced macros per unknown item
      const estCal = 220;
      const estProt = 12;
      const estCarb = 25;
      const estFat = 8;

      totalCalories += estCal;
      totalProtein += estProt;
      totalCarbs += estCarb;
      totalFats += estFat;

      recognizedItems.push({
        name: rawClause.trim().charAt(0).toUpperCase() + rawClause.trim().slice(1),
        quantityStr: 'Porción estándar estimada',
        calories: estCal,
        protein: estProt,
        carbs: estCarb,
        fats: estFat
      });
      unrecognizedClauses.push(rawClause);
    }
  }

  return {
    calories: totalCalories,
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fats: Math.round(totalFats * 10) / 10,
    recognizedItems,
    unrecognizedClauses
  };
}
