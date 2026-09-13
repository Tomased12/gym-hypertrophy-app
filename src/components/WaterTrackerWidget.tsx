import React from 'react';
import { Droplets, Droplet, GlassWater, Plus, Minus, RotateCcw, CheckCircle2, Sparkles, Info } from 'lucide-react';
import type { UserProfile } from '../types';
import { playBeep } from '../lib/sound';

interface WaterTrackerWidgetProps {
  profile: UserProfile;
  waterLiters: number;
  onUpdateWater: (newAmount: number) => void;
}

export const WaterTrackerWidget: React.FC<WaterTrackerWidgetProps> = ({
  profile,
  waterLiters = 0,
  onUpdateWater
}) => {
  const isMiranda = profile.id === 'miranda';

  // Target: Tomás = 3.2L, Miranda = 2.2L
  const targetLiters = profile.targetWaterLiters || (isMiranda ? 2.2 : 3.2);

  const roundedCurrent = Math.max(0, Math.round(waterLiters * 100) / 100);
  const percent = Math.min(100, Math.round((roundedCurrent / targetLiters) * 100));
  const isTargetMet = roundedCurrent >= targetLiters;

  // Glass size is 0.25L (250 ml)
  const glassVolume = 0.25;
  const totalGlasses = Math.ceil(targetLiters / glassVolume);
  const filledGlasses = Math.min(totalGlasses, Math.floor(roundedCurrent / glassVolume));

  const handleAddWater = (liters: number) => {
    const updated = Math.round((roundedCurrent + liters) * 100) / 100;
    onUpdateWater(updated);
    if (!isTargetMet && updated >= targetLiters) {
      playBeep('success');
    } else {
      playBeep('tick');
    }
  };

  const handleSubtractWater = (liters: number) => {
    const updated = Math.max(0, Math.round((roundedCurrent - liters) * 100) / 100);
    onUpdateWater(updated);
    playBeep('tick');
  };

  const handleReset = () => {
    onUpdateWater(0);
    playBeep('tick');
  };

  // Motivational messages
  const getMotivationalMessage = () => {
    if (isMiranda) {
      if (roundedCurrent < 0.75) {
        return 'Beber agua antes de las comidas ocupa espacio gástrico y previene confundir sed con apetito en tu déficit.';
      } else if (roundedCurrent < 1.5) {
        return 'Un vaso de agua reduce los antojos por dulces post-comida y activa la fibra soluble para regular tu colesterol.';
      } else if (roundedCurrent < targetLiters) {
        return '¡Gran ritmo depurativo! El agua ayuda a tus riñones a eliminar toxinas y combate la retención de líquidos.';
      } else {
        return '¡Meta de 2.2L completada! Saciedad prolongada, digestión óptima y cero retención para alcanzar tus 55 kg.';
      }
    } else {
      // Tomás
      if (roundedCurrent < 1.0) {
        return 'Los músculos son 75% agua. La deshidratación de apenas 2% reduce tu fuerza en un 15% para entrenar brazos.';
      } else if (roundedCurrent < 2.2) {
        return 'Hidratación muscular activa. El agua transporta aminoácidos a tus bíceps facilitando la síntesis proteica con 145g de proteína.';
      } else if (roundedCurrent < targetLiters) {
        return '¡Casi en la meta anabólica! La hidratación celular máxima estimula el volumen muscular y la vía mTOR.';
      } else {
        return '¡Meta de 3.2L completada! Volumen muscular celular pleno, transporte de creatina y articulaciones protegidas.';
      }
    }
  };

  return (
    <div className={`rounded-3xl p-5 sm:p-6 border transition-all relative overflow-hidden shadow-xl ${
      isMiranda 
        ? 'bg-gradient-to-br from-teal-950/40 via-dark-900 to-dark-950 border-teal-500/30'
        : 'bg-gradient-to-br from-sky-950/40 via-dark-900 to-dark-950 border-sky-500/30'
    }`}>
      {/* Background glow circle */}
      <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
        isMiranda ? 'bg-teal-500/10' : 'bg-sky-500/10'
      }`} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 mb-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
            isMiranda
              ? 'bg-teal-500/20 border-teal-500/40 text-teal-400'
              : 'bg-sky-500/20 border-sky-500/40 text-sky-400'
          }`}>
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                Seguimiento de Hidratación
              </h3>
              {isTargetMet && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 animate-in zoom-in-95">
                  <CheckCircle2 className="w-3 h-3" /> Meta Alcanzada
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isMiranda 
                ? 'Meta: 2.2 L / día • Saciedad, control de antojos y colesterol'
                : 'Meta: 3.2 L / día • Volumen muscular y síntesis de 145g de proteína'}
            </p>
          </div>
        </div>

        {/* Liters Big Counter */}
        <div className="flex items-baseline gap-1.5 sm:self-center">
          <span className={`font-mono font-black text-3xl sm:text-4xl ${
            isTargetMet 
              ? 'text-emerald-400' 
              : isMiranda ? 'text-teal-400' : 'text-sky-400'
          }`}>
            {roundedCurrent.toFixed(2)}
          </span>
          <span className="text-slate-400 text-sm font-semibold">/ {targetLiters.toFixed(1)} L</span>
        </div>
      </div>

      {/* Liquid Progress Bar */}
      <div className="relative z-10 mb-4">
        <div className="w-full bg-dark-950/80 border border-white/10 rounded-2xl h-6 p-1 relative overflow-hidden flex items-center shadow-inner">
          <div
            className={`h-full rounded-xl transition-all duration-500 relative flex items-center justify-end pr-2 ${
              isTargetMet
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400'
                : isMiranda
                  ? 'bg-gradient-to-r from-teal-600 via-teal-400 to-emerald-400'
                  : 'bg-gradient-to-r from-sky-600 via-sky-400 to-blue-400'
            }`}
            style={{ width: `${Math.max(5, percent)}%` }}
          >
            {percent >= 20 && (
              <span className="text-[10px] font-black text-dark-950 font-mono drop-shadow-sm">
                {percent}%
              </span>
            )}
          </div>
        </div>
        {percent < 20 && (
          <div className="text-right mt-1">
            <span className="text-[11px] font-mono font-bold text-slate-400">
              {percent}% Completado
            </span>
          </div>
        )}
      </div>

      {/* Visual Glasses Rack */}
      <div className="relative z-10 mb-5 p-3 rounded-2xl bg-dark-950/60 border border-white/5">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <GlassWater className="w-3.5 h-3.5 text-cyan-400" />
            Vasos de 250 ml ({filledGlasses} de {totalGlasses})
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {Math.max(0, totalGlasses - filledGlasses)} restantes
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {Array.from({ length: totalGlasses }).map((_, idx) => {
            const isFilled = idx < filledGlasses;
            return (
              <div
                key={idx}
                className={`w-7 h-8 sm:w-8 sm:h-9 rounded-lg border flex items-center justify-center transition-all ${
                  isFilled
                    ? isMiranda
                      ? 'bg-teal-500/25 border-teal-400 text-teal-300 shadow-sm shadow-teal-500/20'
                      : 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-sm shadow-sky-500/20'
                    : 'bg-dark-900/60 border-white/10 text-slate-600'
                }`}
                title={`Vaso ${idx + 1} (250 ml)`}
              >
                <Droplet className={`w-3.5 h-3.5 ${isFilled ? 'fill-current' : 'opacity-30'}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
        {/* +250 ml */}
        <button
          onClick={() => handleAddWater(0.25)}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isMiranda
              ? 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-200 border-teal-500/30 hover:border-teal-400'
              : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-200 border-sky-500/30 hover:border-sky-400'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+250 ml (Vaso)</span>
        </button>

        {/* +500 ml */}
        <button
          onClick={() => handleAddWater(0.50)}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isMiranda
              ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-200 border-emerald-500/30 hover:border-emerald-400'
              : 'bg-blue-500/15 hover:bg-blue-500/25 text-blue-200 border-blue-500/30 hover:border-blue-400'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+500 ml (Botella)</span>
        </button>

        {/* +1.0 L */}
        <button
          onClick={() => handleAddWater(1.0)}
          className={`flex-1 min-w-[95px] py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 ${
            isMiranda
              ? 'bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border-teal-500/40'
              : 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border-sky-500/40'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+1.0 L (Termo)</span>
        </button>

        {/* Subtract -250 ml (Undo button) */}
        {roundedCurrent > 0 && (
          <button
            onClick={() => handleSubtractWater(0.25)}
            className="p-2.5 rounded-xl bg-dark-950 hover:bg-dark-800 text-slate-400 hover:text-white border border-white/10 text-xs font-semibold flex items-center justify-center transition-all"
            title="Restar 250 ml por toque accidental"
          >
            <Minus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline ml-1">-250 ml</span>
          </button>
        )}

        {/* Reset button */}
        {roundedCurrent > 0 && (
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-dark-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 text-xs font-semibold flex items-center justify-center transition-all"
            title="Reiniciar contador a 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Motivational Message Pill */}
      <div className={`p-3 rounded-2xl border flex items-start gap-2.5 text-xs ${
        isTargetMet
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
          : isMiranda
            ? 'bg-teal-950/30 border-teal-500/20 text-teal-200'
            : 'bg-sky-950/30 border-sky-500/20 text-sky-200'
      }`}>
        <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${
          isTargetMet ? 'text-emerald-400' : isMiranda ? 'text-teal-400' : 'text-sky-400'
        }`} />
        <p className="leading-relaxed">
          <strong>{isTargetMet ? '¡Objetivo Diario Superado!' : (isMiranda ? 'Consejo Nutricional:' : 'Consejo de Hipertrofia:')}</strong> {getMotivationalMessage()}
        </p>
      </div>
    </div>
  );
};
