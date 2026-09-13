import { useState, useEffect, useRef } from 'react';
import { 
  Utensils, 
  Plus, 
  Flame, 
  Sparkles, 
  Trash2, 
  Beef,
  Heart,
  AlertOctagon,
  Key,
  CheckCircle2,
  Loader2,
  Settings2,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MealEntry, UserProfile } from '../types';
import { parseMealText, type ParseResult } from '../lib/nutritionParser';
import { 
  getStoredGeminiKey, 
  analyzeMealWithGemini, 
  type GeminiNutritionResponse 
} from '../lib/geminiNutrition';
import { playBeep } from '../lib/sound';
import { MirandaAntiCravingWidget } from './MirandaAntiCravingWidget';
import { GeminiApiKeyModal } from './GeminiApiKeyModal';
import { AdaptiveMealRebalancerWidget } from './AdaptiveMealRebalancerWidget';

interface NutritionTabProps {
  profile: UserProfile;
  meals: MealEntry[];
  onAddMeal: (meal: MealEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

const TOMAS_PRESETS = [
  '3 huevos revueltos, 2 tostadas de pan integral y una cucharada de mantequilla de maní',
  '200g pechuga de pollo con 200g arroz blanco y 1 cucharada de aceite de oliva',
  '1 scoop de proteína con 250ml leche descremada y 1 banana',
  '1 lata de atún con 150g pasta y 1 cucharada de aceite de oliva',
  '150g yogur griego con 50g avena y 30g frutos secos'
];

const MIRANDA_PRESETS = [
  '100g pechuga de pollo a la plancha con 100g arroz integral y ensalada de tomate con 1 cdita aceite de oliva',
  'Tortilla de 2 huevos con espinacas y 1 rebanada de pan integral tostado',
  '150g yogur griego 0% con 30g avena y 1 cucharada de semillas de chía hidratadas',
  '1 lata de atún al natural con 1 papa mediana cocida y hojas verdes',
  '100g frutillas frescas con 1 cdita de cacao puro 100% y té de canela caliente'
];

export const NutritionTab: React.FC<NutritionTabProps> = ({
  profile,
  meals,
  onAddMeal,
  onDeleteMeal
}) => {
  const [inputText, setInputText] = useState('');
  const [mealType, setMealType] = useState<MealEntry['mealType']>('Desayuno');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(() => Boolean(getStoredGeminiKey()));
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiResult, setAiResult] = useState<GeminiNutritionResponse | null>(null);

  const debounceTimerRef = useRef<any>(null);

  const isMiranda = profile.id === 'miranda';
  const targetCalories = isMiranda 
    ? (profile.targetCalories === 1425 ? 1380 : (profile.targetCalories || 1380))
    : (profile.targetCalories || profile.targetSurplusCalories || 2650);
  const targetProtein = profile.targetProteinGrams || (isMiranda ? 100 : 145);

  // Local instant preview
  const localPreview: ParseResult = parseMealText(inputText);
  // Current active preview: if AI has parsed this text, prioritize AI; otherwise show local
  const currentPreview = aiResult && aiResult.recognizedItems.length > 0 ? aiResult : localPreview;

  // Auto-analyze with Gemini when user stops typing (650ms debounce)
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    const trimmed = inputText.trim();
    if (!trimmed) {
      setAiResult(null);
      setIsAnalyzingAi(false);
      return;
    }

    if (!hasGeminiKey) {
      setAiResult(null);
      return;
    }

    setIsAnalyzingAi(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await analyzeMealWithGemini(trimmed);
        setAiResult(res);
      } catch (e) {
        console.error('Error during debounced Gemini analysis', e);
      } finally {
        setIsAnalyzingAi(false);
      }
    }, 650);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [inputText, hasGeminiKey]);

  // Manual Trigger for Gemini AI Analysis
  const handleForceAiAnalysis = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    if (!hasGeminiKey) {
      setIsApiKeyModalOpen(true);
      return;
    }

    setIsAnalyzingAi(true);
    try {
      const res = await analyzeMealWithGemini(trimmed);
      setAiResult(res);
      playBeep('tick');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  // Check if Miranda wrote avocado/palta
  const hasAvocadoMention = isMiranda && (
    inputText.toLowerCase().includes('palta') || 
    inputText.toLowerCase().includes('aguacate') || 
    inputText.toLowerCase().includes('guacamole')
  );

  // Totals for today
  const totalCalories = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = Math.round(meals.reduce((acc, m) => acc + m.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(meals.reduce((acc, m) => acc + m.carbs, 0) * 10) / 10;
  const totalFats = Math.round(meals.reduce((acc, m) => acc + m.fats, 0) * 10) / 10;

  const calPercent = Math.min(100, Math.round((totalCalories / targetCalories) * 100));
  const protPercent = Math.min(100, Math.round((totalProtein / targetProtein) * 100));

  const isSurplusReached = isMiranda 
    ? totalCalories <= targetCalories
    : totalCalories >= targetCalories;

  const isProteinReached = totalProtein >= targetProtein;

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    let finalParsed: ParseResult = currentPreview;

    // If Gemini key exists and not yet analyzed by AI, fetch AI result before saving
    if (hasGeminiKey && (!aiResult || aiResult.source !== 'gemini')) {
      setIsAnalyzingAi(true);
      try {
        const aiRes = await analyzeMealWithGemini(trimmed);
        if (aiRes && aiRes.recognizedItems.length > 0) {
          finalParsed = aiRes;
        }
      } catch (err) {
        console.warn('Fallback to current preview', err);
      } finally {
        setIsAnalyzingAi(false);
      }
    }

    const newMeal: MealEntry = {
      id: `meal_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toISOString().split('T')[0],
      rawText: trimmed,
      mealType,
      calories: finalParsed.calories,
      protein: finalParsed.protein,
      carbs: finalParsed.carbs,
      fats: finalParsed.fats,
      recognizedItems: finalParsed.recognizedItems
    };

    onAddMeal(newMeal);
    setInputText('');
    setAiResult(null);
    playBeep('success');

    // Confetti if goals met
    if (totalProtein + finalParsed.protein >= targetProtein) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const presetList = isMiranda ? MIRANDA_PRESETS : TOMAS_PRESETS;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* Top Banner: Surplus/Deficit & Protein Status */}
      <div className={`rounded-2xl p-5 sm:p-6 border ${
        isMiranda 
          ? 'bg-gradient-to-br from-emerald-500/10 via-dark-850 to-dark-900 border-emerald-500/30'
          : 'bg-gradient-to-br from-amber-500/10 via-dark-850 to-dark-900 border-amber-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mb-2 ${
              isMiranda ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {isMiranda ? (
                <>
                  <Heart className="w-3.5 h-3.5 animate-pulse" /> Protocolo Déficit & Salud Vascular
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 animate-pulse" /> Ecuación Anabólica
                </>
              )}
            </div>
            <h2 className="font-heading font-black text-2xl text-white">
              {isMiranda ? 'Déficit Calórico & Control de Colesterol' : 'Superávit Calórico & Meta Proteica'}
            </h2>
            {isMiranda ? (
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Para descender a tus <strong>55 kg</strong> y optimizar el colesterol, tu meta es un déficit limpio de <strong className="text-emerald-400">1.425 kcal diarias</strong> con <strong className="text-teal-400">95-105g de proteína</strong> (1.6 g/kg) y fuentes cardiosaludables (cero palta).
              </p>
            ) : (
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Para ganar masa muscular limpia en tus <strong>70 kg (1.79 m)</strong>, requieres un superávit fijo de <strong className="text-amber-400">2.650 kcal diarias</strong> (+350 kcal) y entre <strong className="text-emerald-400">140 g y 150 g de proteína por día</strong> (2 g/kg).
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border text-center min-w-[130px] ${
              isMiranda 
                ? (totalCalories <= targetCalories ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-red-950/40 border-red-500/40')
                : (totalCalories >= targetCalories ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-dark-950 border-white/10')
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {isMiranda ? 'Meta 1.350-1.400 kcal' : 'Superávit'}
              </span>
              <span className={`text-xl font-heading font-black ${
                isMiranda 
                  ? (totalCalories <= targetCalories ? 'text-emerald-400' : 'text-rose-400')
                  : (totalCalories >= targetCalories ? 'text-emerald-400' : 'text-amber-400')
              }`}>
                {totalCalories} <span className="text-xs font-normal text-slate-400">/ {targetCalories}</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">{isMiranda ? 'kcal (Déficit Sostenible)' : 'kcal'}</span>
            </div>

            <div className={`p-3 rounded-xl border text-center min-w-[130px] ${
              isProteinReached ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-dark-950 border-white/10'
            }`}>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                {isMiranda ? 'Proteína TEF (Mín. 100g)' : 'Proteína (2g/kg)'}
              </span>
              <span className={`text-xl font-heading font-black ${isProteinReached ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {totalProtein} <span className="text-xs font-normal text-slate-400">/ {targetProtein}</span>
              </span>
              <span className="text-[10px] text-slate-400 block font-mono">{isMiranda ? 'gramos (Efecto Térmico)' : 'gramos'}</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bars */}
        <div className="mt-5 space-y-3">
          {/* Calorie Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Flame className={`w-3.5 h-3.5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} /> 
                {isMiranda ? 'Ingesta Calórica vs Límite Diario' : 'Calorías Totales Hoy'}
              </span>
              <span className={isMiranda 
                ? (totalCalories <= targetCalories ? 'text-emerald-400' : 'text-rose-400')
                : (isSurplusReached ? 'text-emerald-400' : 'text-amber-400')
              }>
                {isMiranda ? (
                  totalCalories <= targetCalories 
                    ? `${calPercent}% ✓ DENTRO DEL DÉFICIT (Quedan ${targetCalories - totalCalories} kcal)`
                    : `${calPercent}% ⚠️ SUPERASTE LA META POR ${totalCalories - targetCalories} kcal`
                ) : (
                  `${calPercent}% ${isSurplusReached ? '✓ SUPERÁVIT CONSEGUIDO' : `(Faltan ${Math.max(0, targetCalories - totalCalories)} kcal)`}`
                )}
              </span>
            </div>
            <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isMiranda 
                    ? (totalCalories <= targetCalories 
                        ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-md shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-red-500')
                    : (isSurplusReached
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500')
                }`}
                style={{ width: `${calPercent}%` }}
              />
            </div>
          </div>

          {/* Protein Progress Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Beef className="w-3.5 h-3.5 text-cyan-400" /> Síntesis Proteica Requerida
              </span>
              <span className={isProteinReached ? 'text-emerald-400' : 'text-cyan-400'}>
                {protPercent}% {isProteinReached ? '✓ META PROTEICA CUMPLIDA' : `(Faltan ${Math.max(0, Math.round(targetProtein - totalProtein))}g)`}
              </span>
            </div>
            <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isProteinReached
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-md shadow-cyan-400/30'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-400'
                }`}
                style={{ width: `${protPercent}%` }}
              />
            </div>
          </div>

          {/* Macronutrient breakdown footer */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="p-2 rounded-lg bg-dark-950/70 border border-white/5">
              <span className="text-slate-400 block">Carbohidratos</span>
              <strong className="text-amber-300 font-bold">{totalCarbs}g</strong>
            </div>
            <div className="p-2 rounded-lg bg-dark-950/70 border border-white/5">
              <span className="text-slate-400 block">Proteínas</span>
              <strong className="text-cyan-300 font-bold">{totalProtein}g</strong>
            </div>
            <div className="p-2 rounded-lg bg-dark-950/70 border border-white/5">
              <span className="text-slate-400 block">Grasas Saludables</span>
              <strong className="text-rose-300 font-bold">{totalFats}g</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Adaptive Meal Rebalancer & Intelligent Recommendations */}
      <AdaptiveMealRebalancerWidget
        profile={profile}
        meals={meals}
        onDirectAddMeal={onAddMeal}
        onLoadMealIntoInput={(text, type) => {
          setInputText(text);
          setMealType(type);
        }}
      />

      {/* Smart Free-Text Meal Logger Form with Gemini Integration */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10 relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-5 h-5 ${hasGeminiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                Registro Inteligente en Lenguaje Natural
              </h3>
              <p className="text-xs text-slate-400">
                Escribe tu comida tal como la consumes; la IA detecta alimentos, gramajes y variantes exactas.
              </p>
            </div>
          </div>

          {/* Gemini AI Status & Settings Button */}
          <div className="flex items-center gap-2">
            {hasGeminiKey ? (
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500/25 transition-all shadow-sm"
                title="Configuración de Gemini API"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Gemini AI Activo</span>
                <Settings2 className="w-3 h-3 text-emerald-400 ml-0.5 opacity-70" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black text-xs font-extrabold hover:brightness-110 transition-all shadow-md shadow-emerald-500/20 animate-pulse"
                title="Conecta tu Gemini API Key gratuita para reconocimiento de cualquier comida"
              >
                <Key className="w-3.5 h-3.5 text-black" />
                <span>Conectar Gemini AI (Gratis)</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick presets buttons */}
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Ejemplos rápidos:</span>
          {presetList.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setInputText(preset)}
              className="text-[11px] px-2.5 py-1 rounded-full bg-dark-850 hover:bg-dark-800 border border-white/10 text-slate-300 hover:text-white shrink-0 transition-colors"
            >
              {preset.split(',')[0]}...
            </button>
          ))}
        </div>

        {/* Regla Metabólica de Orden de Ingesta para Miranda */}
        {isMiranda && (
          <div className="mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-dark-900 to-teal-950/40 border border-emerald-500/30 flex items-start gap-3 text-xs text-slate-200 shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-emerald-300 block text-[13px] mb-0.5">
                💡 Regla Metabólica: Orden de Ingesta Estratégico
              </span>
              <p className="text-slate-300 leading-relaxed">
                <strong>Priorizar orden de ingesta: vegetales/fibra primero, luego proteína y al final carbohidratos complejos</strong> para aplanar picos de glucosa y evitar almacenamiento graso abdominal.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleAddMeal} className="space-y-4">
          {/* Avocado Alert if typed for Miranda */}
          {hasAvocadoMention && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-2.5 text-xs text-red-300 animate-in fade-in">
              <AlertOctagon className="w-4 h-4 text-red-400 shrink-0" />
              <span>
                <strong>Recordatorio:</strong> Miranda no consume palta/aguacate. Considera reemplazarla por 1 cucharada de aceite de oliva virgen extra o 15g de frutos secos.
              </span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Meal Type Select */}
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealEntry['mealType'])}
              className="sm:w-44 bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-200 focus:outline-none focus:border-amber-500 shrink-0"
            >
              <option value="Desayuno">🍳 Desayuno</option>
              <option value="Almuerzo">🍗 Almuerzo</option>
              <option value="Merienda">🥪 Merienda</option>
              <option value="Cena">🥩 Cena</option>
              <option value="Post-Entreno">⚡ Post-Entreno</option>
              <option value="Snack">🥜 Snack</option>
            </select>

            {/* Free-text input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isMiranda 
                  ? 'Ej: 3 huevos revueltos + 1 tostada de pan integral con té de canela'
                  : 'Ej: 3 huevos revueltos, 2 tostadas de pan integral y una cucharada de mantequilla de maní'
                }
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />

              {/* In-field loading spinner if AI is thinking */}
              {isAnalyzingAi && (
                <div className="absolute right-3 top-3 flex items-center gap-1.5 text-xs text-emerald-400 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[11px] font-semibold hidden md:inline">Consultando Gemini...</span>
                </div>
              )}
            </div>

            {/* Force AI Analysis button if key is set */}
            {hasGeminiKey && inputText.trim() && (
              <button
                type="button"
                onClick={handleForceAiAnalysis}
                disabled={isAnalyzingAi}
                className="px-3 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shrink-0"
                title="Re-analizar con Gemini AI"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Analizar IA</span>
              </button>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isAnalyzingAi}
              className={`py-2.5 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition-all shadow-lg disabled:opacity-40 disabled:pointer-events-none shrink-0 ${
                isMiranda 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-amber-500/20'
              }`}
            >
              {isAnalyzingAi ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-black" />
                  <span>Registrar</span>
                </>
              )}
            </button>
          </div>

          {/* Real-Time Recognition Live Preview Box */}
          {inputText.trim() && (
            <div className={`p-4 rounded-xl bg-dark-950 border animate-in fade-in space-y-2.5 transition-all ${
              aiResult?.source === 'gemini'
                ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                : (isMiranda ? 'border-emerald-500/30' : 'border-amber-500/30')
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    aiResult?.source === 'gemini' 
                      ? 'text-emerald-400' 
                      : (isMiranda ? 'text-emerald-400' : 'text-amber-400')
                  }`}>
                    <Sparkles className="w-3.5 h-3.5" /> 
                    Detección de Alimentos & Macros:
                  </span>

                  {/* Engine Source Badge */}
                  {aiResult?.source === 'gemini' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                      ✨ Gemini AI (Precisión Máxima)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-dark-800 text-slate-400 text-[10px] font-bold border border-white/10">
                      📖 Base de Datos Local
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs">
                  Total: <strong className={isMiranda ? 'text-emerald-400' : 'text-amber-400'}>{currentPreview.calories} kcal</strong> | <strong className="text-cyan-400">{currentPreview.protein}g Prot</strong> | <strong className="text-amber-300">{currentPreview.carbs}g Carb</strong> | <strong className="text-rose-300">{currentPreview.fats}g Grasa</strong>
                </div>
              </div>

              {/* Recognized Items Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentPreview.recognizedItems.map((item, i) => (
                  <div key={i} className="px-3 py-2 rounded-xl bg-dark-850 border border-white/10 text-xs flex items-center gap-2.5 shadow-sm">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-[10px] text-slate-400">{item.quantityStr}</span>
                    </div>
                    <div className="text-right pl-2 border-l border-white/10 font-mono text-[11px]">
                      <span className={`font-bold block ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {item.calories} kcal
                      </span>
                      <span className="text-slate-400 text-[10px]">
                        {item.protein}g P • {item.carbs}g C • {item.fats}g G
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Clinical Note if available */}
              {aiResult?.summary && (
                <p className="text-[11px] text-emerald-300/90 italic pt-1 border-t border-white/5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{aiResult.summary}</span>
                </p>
              )}

              {/* Prompt to connect Gemini if using local */}
              {!hasGeminiKey && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>¿Deseas que reconozca cualquier plato exótico o marca?</span>
                  <button
                    type="button"
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Key className="w-3 h-3" /> Conectar Gemini API Gratis ➔
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Miranda Anti-Craving & Cholesterol Widget */}
      {isMiranda && (
        <MirandaAntiCravingWidget />
      )}

      {/* Logged Meals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
            <Utensils className={`w-5 h-5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
            Comidas Registradas Hoy ({meals.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Total: {totalCalories} kcal • {totalProtein}g proteína
          </span>
        </div>

        {meals.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-dark-900 border border-white/5">
            <Utensils className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Aún no has registrado comidas hoy.</p>
            <p className="text-xs text-slate-500 mt-1">Usa el campo de texto arriba para ingresar tu primer alimento.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="p-4 rounded-xl bg-dark-900 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/20 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${
                      isMiranda 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {meal.mealType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {meal.timestamp}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-100 mt-1.5">
                    "{meal.rawText}"
                  </p>

                  {/* Micro pill items */}
                  {meal.recognizedItems && meal.recognizedItems.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {meal.recognizedItems.map((item, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-dark-950 text-slate-300 border border-white/5">
                          {item.name}: <strong className={isMiranda ? 'text-emerald-400' : 'text-amber-400'}>{item.calories} kcal</strong> / <strong className="text-cyan-400">{item.protein}g P</strong>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right totals and delete */}
                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/5">
                  <div className="text-right">
                    <div className={`font-mono font-bold text-sm ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {meal.calories} kcal
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {meal.protein}g P • {meal.carbs}g C • {meal.fats}g G
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar comida"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gemini API Key Configuration Modal */}
      <GeminiApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(hasKey) => {
          setHasGeminiKey(hasKey);
          if (hasKey && inputText.trim()) {
            handleForceAiAnalysis();
          }
        }}
      />
    </div>
  );
};
