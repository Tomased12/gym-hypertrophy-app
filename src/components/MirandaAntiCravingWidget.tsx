import { Ban, HeartPulse, Sparkles, Coffee, Apple, ShieldCheck, Flame } from 'lucide-react';

export const MirandaAntiCravingWidget: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Strict Avocado Exclusion Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-red-950/40 via-dark-900 to-dark-950 border border-red-500/30 flex items-start gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
          <Ban className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-black text-sm text-red-300 flex items-center gap-2">
            Restricción Dietaria Activa: 100% Libre de Palta / Aguacate
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Se excluye totalmente la palta en todas las sugerencias nutricionales. Las grasas saludables se obtienen de <strong>aceite de oliva virgen extra (1 cda sopera)</strong>, <strong>frutos secos en porción justa (15g de nueces o almendras)</strong> y <strong>semillas de chía</strong>.
          </p>
        </div>
      </div>

      {/* Anti-Craving & Post-Meal Sweet Tooth Hacks */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-950/30 via-dark-900 to-dark-950 border border-amber-500/30 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-black text-base text-white">
              Estrategia Anti-Ansiedad & Antojos Dulces Post-Comida
            </h3>
            <p className="text-xs text-slate-400">
              Protocolo para desactivar la compulsión por el azúcar sin pasar hambre
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Infusión Caliente */}
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                <Coffee className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pausa 10 Minutos</span>
              </div>
              <h5 className="text-xs font-heading font-bold text-white mb-1">
                Infusión Caliente Saciante
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Toma una taza de <strong>té de canela, manzanilla o menta piperita</strong> 10 min después de almorzar o cenar. La temperatura tibia y los polifenoles envían señales de saciedad al hipotálamo y calman el estrés.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold mt-2">0 Calorías • Digestivo</span>
          </div>

          {/* Card 2: Frutos Rojos + Cacao 100% */}
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-rose-400 mb-1.5">
                <Apple className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Antojo Chocolate</span>
              </div>
              <h5 className="text-xs font-heading font-bold text-white mb-1">
                Frutillas con Cacao Puro & Canela
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                100g de frutillas o arándanos espolvoreados con <strong>cacao amargo 100% desgrasado y canela</strong>. Satisface el deseo de postre, aporta flavonoides y fibra que retardan la absorción de glucosa.
              </p>
            </div>
            <span className="text-[10px] text-rose-300 font-semibold mt-2">~45 kcal • Antioxidante</span>
          </div>

          {/* Card 3: Yogur Griego 0% con Chía */}
          <div className="p-3.5 rounded-2xl bg-dark-950/70 border border-white/5 flex flex-col justify-between hover:border-amber-500/30 transition-colors">
            <div>
              <div className="flex items-center gap-2 text-teal-400 mb-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Saciedad Total</span>
              </div>
              <h5 className="text-xs font-heading font-bold text-white mb-1">
                Yogur Griego 0% + Chía Hidratada
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                100g de yogur desnatado con 1 cucharadita de semillas de chía hidratadas. La fibra soluble forma un mucílago en el estómago que prolonga la plenitud y ayuda a atrapar el colesterol alimentario.
              </p>
            </div>
            <span className="text-[10px] text-teal-300 font-semibold mt-2">12g Proteína • Fibra Soluble</span>
          </div>
        </div>
      </div>

      {/* Cholesterol & Heart Health Tips */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-teal-950/40 via-dark-900 to-dark-950 border border-teal-500/30 flex items-start gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-heading font-black text-sm text-teal-300">
            Pilar de Salud Cardiovascular (Control de Colesterol)
          </h4>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Prioriza carbohidratos con <strong>fibra soluble (avena, lentejas, porotos y manzana)</strong>, que actúan como una esponja reduciendo los niveles de colesterol LDL en sangre. Combina esto con tus <strong>6.000 a 8.000 pasos diarios</strong> para elevar tu HDL (colesterol protector).
          </p>
        </div>
      </div>
    </div>
  );
};
