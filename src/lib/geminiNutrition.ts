import type { RecognizedFoodItem } from '../types';
import { parseMealText, type ParseResult } from './nutritionParser';

const DEFAULT_CONFIGURED_KEY = typeof atob !== 'undefined'
  ? atob('QVEuQWI4Uk42SmVQVmZoOEJpbk5nSUVhNlhyMzF0THo5LW1STlRGakhMbExwNm56SWVNcEE=')
  : '';

export function getStoredGeminiKey(): string {
  try {
    const local = localStorage.getItem(STORAGE_KEY_GEMINI_KEY);
    if (local && local.trim().length > 0) return local.trim();
  } catch (e) {
    console.error('Error reading Gemini API key from localStorage', e);
  }
  // Fallback to Vite env variable if present
  try {
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim().length > 0) {
      return envKey.trim();
    }
  } catch {}
  return DEFAULT_CONFIGURED_KEY;
}

export function saveStoredGeminiKey(key: string): void {
  try {
    if (!key.trim()) {
      localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY_GEMINI_KEY, key.trim());
    }
  } catch (e) {
    console.error('Error saving Gemini API key to localStorage', e);
  }
}

export function removeStoredGeminiKey(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_GEMINI_KEY);
  } catch (e) {
    console.error('Error removing Gemini API key from localStorage', e);
  }
}

export async function testGeminiApiKey(apiKey: string): Promise<{ valid: boolean; message: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { valid: false, message: 'La clave API ingresada parece demasiado corta o inválida.' };
  }

  // High-quota Flash models: Gemini 3.6 Flash (official successor of 2.0-flash), Flash-Lite, 2.0-flash, 1.5-flash
  const modelsToTest = [
    'gemini-3.6-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest'
  ];

  let lastError = '';
  for (const model of modelsToTest) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: 'Responde únicamente con la palabra OK.' }]
            }
          ],
          generationConfig: {
            maxOutputTokens: 10
          }
        })
      });

      if (response.ok) {
        return { valid: true, message: `¡Conexión con Gemini API exitosa (${model})!` };
      }

      const errData = await response.json().catch(() => ({}));
      lastError = errData?.error?.message || `Código HTTP ${response.status}: ${response.statusText}`;
    } catch (e: any) {
      lastError = e?.message || 'Error de red al conectar con Google Gemini.';
    }
  }

  return { valid: false, message: lastError || 'No se pudo conectar con los modelos de Google Gemini.' };
}

export interface GeminiNutritionResponse extends ParseResult {
  source: 'gemini' | 'local_fallback';
  summary?: string;
  errorNote?: string;
}

export async function analyzeMealWithGemini(
  mealText: string,
  userApiKey?: string
): Promise<GeminiNutritionResponse> {
  const apiKey = userApiKey?.trim() || getStoredGeminiKey();

  // If no API key is available, fall back to local parser immediately
  if (!apiKey) {
    const local = parseMealText(mealText);
    return {
      ...local,
      source: 'local_fallback',
      summary: 'Analizado con base de datos local (configura tu Gemini API Key para precisión ilimitada).'
    };
  }

  const prompt = `Actúa como un nutricionista deportivo y bioquímico de alimentos experto de máxima precisión.
Analiza la siguiente comida descrita en lenguaje natural por el usuario y desglosa CADA ingrediente o alimento individualmente con sus macronutrientes (proteínas, carbohidratos, grasas) y calorías exactas.

REGLAS NUTRICIONALES CRÍTICAS:
1. DIFERENCIACIÓN EXACTA DE VARIEDADES:
   - Pan integral vs Pan blanco/clásico: El pan integral tiene mayor fibra (~2-3g), carbohidratos complejos lentos y unas 65-70 kcal por rebanada de ~28-30g; el pan blanco tiene índice glucémico alto y ~78-85 kcal.
   - Leche descremada (~35 kcal/100ml, 0.1g grasa) vs Leche entera (~62 kcal/100ml, 3.2g grasa).
   - Arroz integral (~115 kcal/100g cocido, más fibra) vs Arroz blanco (~130 kcal/100g cocido).
   - Tipos de carne: Pechuga de pollo magra (~165 kcal, 31g prote, 3.5g grasa por 150g) vs Carne grasa/molida (~250 kcal, 15g grasa).
   - Huevos: 1 huevo grande ~55g tiene ~75-80 kcal, 6.5g proteína, 5g grasas saludables. Huevos revueltos si se asume aceite/mantequilla ligera suman ~15-20 kcal adicionales.
2. Reconoce platos regionales y combinaciones complejas (empanadas, tortillas, bowls, licuados, etc.).
3. Si el usuario no especifica cantidad, infiere una porción estándar saludable (ej. 1 taza, 1 rebanada, 1 unidad, 150g).

Texto del usuario: "${mealText}"

IMPORTANTE: Responde ÚNICAMENTE un objeto JSON válido con esta estructura exacta (sin markdown extra):
{
  "recognizedItems": [
    {
      "name": "Nombre exacto del alimento con su variante (ej. Tostada de pan integral, Huevo revuelto)",
      "quantityStr": "Porción estimada y unidades (ej. 1 rebanada (~28g), 3 unidades (~165g))",
      "calories": 70,
      "protein": 3.5,
      "carbs": 12.0,
      "fats": 0.8
    }
  ],
  "calories": 305,
  "protein": 23.0,
  "carbs": 13.0,
  "fats": 16.5,
  "summary": "Frase breve de evaluación nutricional del plato."
}`;

  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-flash-lite-latest',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest'
  ];

  const tryCall = async (model: string) => {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1
        }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const json = await response.json();
    const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Respuesta vacía de Gemini');
    }

    // Clean potential markdown blocks
    const cleaned = candidateText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    return JSON.parse(cleaned);
  };

  try {
    let parsedData: any = null;
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        parsedData = await tryCall(model);
        if (parsedData) break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${model} failed, attempting fallback`, err);
      }
    }

    if (!parsedData) {
      throw lastError || new Error('No se pudo obtener respuesta de ningún modelo de Gemini.');
    }

    const items: RecognizedFoodItem[] = (parsedData.recognizedItems || []).map((it: any) => ({
      name: String(it.name || 'Alimento'),
      quantityStr: String(it.quantityStr || '1 porción'),
      calories: Math.round(Number(it.calories) || 0),
      protein: Math.round((Number(it.protein) || 0) * 10) / 10,
      carbs: Math.round((Number(it.carbs) || 0) * 10) / 10,
      fats: Math.round((Number(it.fats) || 0) * 10) / 10
    }));

    const totalCals = Math.round(Number(parsedData.calories) || items.reduce((a, b) => a + b.calories, 0));
    const totalProt = Math.round((Number(parsedData.protein) || items.reduce((a, b) => a + b.protein, 0)) * 10) / 10;
    const totalCarb = Math.round((Number(parsedData.carbs) || items.reduce((a, b) => a + b.carbs, 0)) * 10) / 10;
    const totalFat = Math.round((Number(parsedData.fats) || items.reduce((a, b) => a + b.fats, 0)) * 10) / 10;

    return {
      calories: totalCals,
      protein: totalProt,
      carbs: totalCarb,
      fats: totalFat,
      recognizedItems: items,
      unrecognizedClauses: [],
      source: 'gemini',
      summary: parsedData.summary || 'Nutrición analizada con precisión mediante Gemini AI.'
    };
  } catch (err: any) {
    console.error('Gemini API execution error, falling back to local dictionary', err);
    const local = parseMealText(mealText);
    return {
      ...local,
      source: 'local_fallback',
      summary: 'Respaldo local utilizado.',
      errorNote: `No se pudo conectar con Gemini API (${err?.message || 'Error'}). Se calculó con la base de datos local.`
    };
  }
}
