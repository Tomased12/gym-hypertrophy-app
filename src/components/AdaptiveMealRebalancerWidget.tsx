import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Utensils, 
  Plus, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Loader2,
  Clock,
  ShieldCheck,
  Zap,
  Heart
} from 'lucide-react';
import type { MealEntry, UserProfile } from '../types';
import { 
  analyzeDailyNutritionBalance, 
  getLocalMealRecommendations, 
  fetchAdaptiveRecommendationsWithGemini, 
  type RecommendedMealOption,
  type MealRebalanceAnalysis 
} from '../lib/adaptiveMealPlanner';
import { playBeep } from '../lib/sound';
import confetti from 'canvas-confetti';

interface AdaptiveMealRebalancerWidgetProps {
  profile: UserProfile;
  meals: MealEntry[];
  onDirectAddMeal: (meal: MealEntry) => void;
  onLoadMealIntoInput: (text: string, mealType: MealEntry['mealType']) => void;
}

export const AdaptiveMealRebalancerWidget: React.FC<AdaptiveMealRebalancerWidgetProps> = ({
  profile,
  meals,
  onDirectAddMeal,
  onLoadMealIntoInput
}) => {
  const isMiranda = profile.id === 'miranda';

  // Real-time analysis of balance
  const analysis: MealRebalanceAnalysis = analyzeDailyNutritionBalance(profile, meals);

  const [recommendations, setRecommendations] = useState<RecommendedMealOption[]>(() => 
    getLocalMealRecommendations(profile, analysis)
  );
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [sourceAi, setSourceAi] = useState(false);

  // Update recommendations whenever meals change if not already loaded from AI
  useEffect(() => {
    if (!sourceAi) {
      setRecommendations(getLocalMealRecommendations(profile, analysis));
    }
  }, [meals.length, profile.id]);

  const handleFetchAi = async () => {
    setIsLoadingAi(true);
    playBeep('tick');
    try {
      const aiRecs = await fetchAdaptiveRecommendationsWithGemini(profile, meals, analysis);
      setRecommendations(aiRecs);
      setSourceAi(true);
      playBeep('success');
    } catch (e) {
      console.error('Error fetching AI recommendations', e);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleOneClickRegister = (rec: RecommendedMealOption) => {
    const newMeal: MealEntry = {
      id: `meal_rec_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dateStr: new Date().toISOString().split('T')[0],
      rawText: rec.ingredientsText,
      mealType: rec.mealType,
      calories: rec.calories,
      protein: rec.protein,
      carbs: rec.carbs,
      fats: rec.fats,
      recognizedItems: rec.recognizedItems
    };

    onDirectAddMeal(newMeal);
    playBeep('success');
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border shadow-2xl relative overflow-hidden transition-all ${
      analysis.status === 'compensation'
        ? 'bg-gradient-to-br from-amber-950/40 via-dark-900 to-dark-950 border-amber-500/40'
        : (analysis.status === 'exceeded' 
            ? 'bg-gradient-to-br from-red-950/40 via-dark-900 to-dark-950 border-red-500/40'
            : (isMiranda 
                ? 'bg-gradient-to-br from-emerald-950/40 via-dark-900 to-dark-950 border-emerald-500/30'
                : 'bg-gradient-to-br from-dark-900 via-dark-850 to-dark-950 border-white/10'))
    }`}>
      {/* Glow */}
      <div className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none ${
        analysis.status === 'compensation' ? 'bg-amber-500/15' : (isMiranda ? 'bg-emerald-500/10' : 'bg-blue-500/10')
      }`} />

      {/* Header & Budget Status Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg ${
            analysis.status === 'compensation'
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20'
              : (isMiranda 
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20' 
                  : 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-400 shadow-amber-500/20')
          }`}>
            {analysis.status === 'compensation' ? (
              <Zap className="w-6 h-6 animate-pulse" />
            ) : isMiranda ? (
              <Heart className="w-6 h-6 animate-pulse" />
            ) : (
              <Utensils className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                analysis.status === 'compensation'
                  ? 'bg-amber-500/25 text-amber-300 border-amber-500/40 animate-pulse'
                  : (analysis.status === 'exceeded'
                      ? 'bg-red-500/25 text-red-300 border-red-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30')
              }`}>
                {analysis.status === 'compensation' 
                  ? '⚡ Compensación Calórica Activa' 
                  : (analysis.status === 'exceeded' ? '⚠️ Límite Diario Alcanzado' : '🟢 Ritmo Óptimo')}
              </span>

              {sourceAi && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Generado por Gemini AI
                </span>
              )}
            </div>

            <h3 className="font-heading font-black text-xl text-white mt-1">
              ¿Qué comer en tu próxima comida? ({analysis.nextSuggestedMealType})
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
              {analysis.statusMessage}
            </p>
          </div>
        </div>

        {/* Remaining Budget Chips & Refresh button */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          <div className="px-3.5 py-2 rounded-2xl bg-dark-950/80 border border-white/10 text-center min-w-[105px]">
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Te Quedan</span>
            <span className={`text-lg font-heading font-black ${
              analysis.remainingCalories > 0 ? (isMiranda ? 'text-emerald-400' : 'text-amber-400') : 'text-red-400'
            }`}>
              {analysis.remainingCalories > 0 ? analysis.remainingCalories : 0}
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-0.5">kcal</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-dark-950/80 border border-white/10 text-center min-w-[105px]">
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Proteína Falta</span>
            <span className="text-lg font-heading font-black text-cyan-400">
              {analysis.remainingProtein}
            </span>
            <span className="text-[10px] text-slate-400 font-mono ml-0.5">g</span>
          </div>

          <button
            type="button"
            onClick={handleFetchAi}
            disabled={isLoadingAi}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50 shrink-0"
            title="Pedirle a Gemini AI sugerencias inteligentes en tiempo real"
          >
            {isLoadingAi ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Pensando...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black" />
                <span>Pedir a Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Suggested Meal Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className="rounded-2xl p-4 bg-dark-950/80 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              {/* Tag & Meal Type */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                  rec.tag === 'Volumen & Saciedad'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : (rec.tag === 'Rápida & Práctica'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30')
                }`}>
                  {rec.tag}
                </span>

                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  {rec.mealType}
                </span>
              </div>

              {/* Title & Description */}
              <h4 className="font-heading font-black text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                {rec.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {rec.description}
              </p>

              {/* Ingredients Pill */}
              <div className="mt-3 p-2.5 rounded-xl bg-dark-900 border border-white/5 text-[11px] text-slate-200">
                <strong className="text-slate-400 block text-[9px] uppercase tracking-wider mb-0.5">Ingredientes:</strong>
                <span className="font-medium text-slate-100">{rec.ingredientsText}</span>
              </div>

              {/* Nutritional Breakdown */}
              <div className="mt-3 flex items-baseline justify-between border-t border-white/5 pt-2 font-mono text-xs">
                <div>
                  <span className="font-heading font-black text-base text-emerald-400">
                    {rec.calories}
                  </span>
                  <span className="text-[10px] text-slate-400 ml-0.5">kcal</span>
                </div>
                <div className="text-[11px] text-slate-400 space-x-1.5">
                  <span><strong className="text-cyan-400 font-bold">{rec.protein}g</strong> P</span>
                  <span>•</span>
                  <span><strong className="text-amber-300 font-bold">{rec.carbs}g</strong> C</span>
                  <span>•</span>
                  <span><strong className="text-rose-300 font-bold">{rec.fats}g</strong> G</span>
                </div>
              </div>

              {/* Clinical Balance Why Note */}
              <div className="mt-2 text-[10px] text-slate-300 italic bg-white/[0.02] p-2 rounded-lg border border-white/5 flex items-start gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{rec.whyThisOption}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onLoadMealIntoInput(rec.ingredientsText, rec.mealType)}
                className="p-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-400 hover:text-white transition-colors"
                title="Cargar texto en el campo para editar cantidades"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleOneClickRegister(rec)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-black font-extrabold text-xs flex items-center justify-center gap-1.5 border border-emerald-500/40 hover:border-transparent transition-all shadow-sm shadow-emerald-500/10"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar 1 Clic</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
