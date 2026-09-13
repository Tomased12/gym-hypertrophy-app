import React, { useState } from 'react';
import { TrendingUp, Ruler, Sparkles, Scale, Info, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { BodyMeasurement, UserProfile } from '../types';
import { playBeep } from '../lib/sound';

interface ProgressTabProps {
  profile: UserProfile;
  measurements: BodyMeasurement[];
  onAddMeasurement: (m: BodyMeasurement) => void;
  currentCycleDay: number;
}

export const ProgressTab: React.FC<ProgressTabProps> = ({
  profile,
  measurements,
  onAddMeasurement,
  currentCycleDay
}) => {
  const isMiranda = profile.id === 'miranda';
  const isFirstMeasurement = measurements.length === 0;

  // Form states
  const [armCm, setArmCm] = useState<string>(
    profile.currentArmCm && profile.currentArmCm > 0 ? profile.currentArmCm.toString() : '33.0'
  );
  const [weightKg, setWeightKg] = useState<string>(profile.weightKg.toString());
  const [waistCm, setWaistCm] = useState<string>('72.0');
  const [hipCm, setHipCm] = useState<string>('98.0');
  const [notes, setNotes] = useState<string>('');

  const sortedMeasurements = [...measurements].sort((a, b) => a.dayNumber - b.dayNumber);
  const latestMeasurement = sortedMeasurements[sortedMeasurements.length - 1];
  const hasData = sortedMeasurements.length > 0;

  // Tomás metrics
  const startArm = hasData ? (sortedMeasurements[0].armCircumference || 0) : 0;
  const currentArm = hasData ? (latestMeasurement.armCircumference || 0) : 0;
  const targetArm = hasData ? Number((startArm + 3.0).toFixed(1)) : 0;
  const armGained = hasData ? Math.max(0, Math.round((currentArm - startArm) * 10) / 10) : 0;
  const armProgressPercent = hasData && targetArm > startArm
    ? Math.min(100, Math.round(((currentArm - startArm) / (targetArm - startArm)) * 100))
    : 0;

  // Miranda metrics (Weight loss 62 kg -> 55 kg)
  const startWeight = hasData ? sortedMeasurements[0].bodyWeight : profile.startWeightKg;
  const currentWeight = hasData ? latestMeasurement.bodyWeight : profile.currentWeightKg;
  const targetWeight = profile.targetWeightKg;
  const weightDiff = Math.round((currentWeight - startWeight) * 10) / 10;
  const weightLostGoal = Math.max(0.1, startWeight - targetWeight); // e.g. 7 kg
  const weightLostSoFar = Math.max(0, Math.round((startWeight - currentWeight) * 10) / 10);
  const weightProgressPercent = Math.min(100, Math.round((weightLostSoFar / weightLostGoal) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight)) return;

    const parsedArm = isMiranda ? undefined : parseFloat(armCm);
    const parsedWaist = isMiranda && waistCm ? parseFloat(waistCm) : undefined;
    const parsedHip = isMiranda && hipCm ? parseFloat(hipCm) : undefined;

    const newMeasurement: BodyMeasurement = {
      id: `meas_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayNumber: currentCycleDay,
      bodyWeight: parsedWeight,
      armCircumference: parsedArm,
      waistCircumference: parsedWaist,
      hipCircumference: parsedHip,
      notes: notes.trim() || (isFirstMeasurement ? 'Medición base de inicio (Día 1)' : `Chequeo del Día ${currentCycleDay}`)
    };

    onAddMeasurement(newMeasurement);
    setNotes('');
    playBeep('success');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in">
      {/* First Time Onboarding Banner if empty */}
      {isFirstMeasurement && (
        <div className={`rounded-2xl p-5 border flex items-start gap-3.5 shadow-lg ${
          isMiranda 
            ? 'bg-gradient-to-r from-emerald-500/20 via-dark-850 to-dark-900 border-emerald-500/40'
            : 'bg-gradient-to-r from-amber-500/20 via-dark-850 to-dark-900 border-amber-500/40'
        }`}>
          <Info className={`w-6 h-6 shrink-0 mt-0.5 animate-bounce ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <h3 className="font-heading font-black text-base text-white">
              {isMiranda 
                ? 'Paso 1: Registra tu Peso Inicial y Medidas Base (Día 1)' 
                : 'Paso 1: Registra tu Medida Inicial de Brazo (Día 1)'}
            </h3>
            {isMiranda ? (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Pésate en ayunas por la mañana (punto de partida: <strong>62 kg</strong>) y si deseas, mide con cinta el contorno de tu <strong>cintura y cadera</strong>. Esto calibrará tu curva hacia la meta de <strong>55 kg</strong> con salud y tonificación.
              </p>
            ) : (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Toma una cinta métrica flexible. Flexiona tu brazo dominante a <strong>90 grados</strong> y haz fuerza isométrica máxima (sacando el bíceps y apretando el tríceps). Mide la parte más ancha del brazo en centímetros e ingrésala en el formulario abajo para calibrar tu objetivo (+3.0 cm).
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mb-2 ${
              isMiranda ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" /> Métricas Antropométricas
            </div>
            <h2 className="font-heading font-black text-2xl text-white">
              {isMiranda ? 'Evolución de Peso & Recomposición' : 'Evolución de Hipertrofia de Brazos'}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              {isMiranda 
                ? 'Registro de control de peso hacia los 55 kg y reducción de contornos.' 
                : 'Registro semanal del contorno del brazo flexionado (cm) y peso corporal en ayunas (70 kg base).'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isMiranda ? (
              <>
                <div className="p-3.5 rounded-xl bg-dark-950 border border-emerald-500/30 text-center min-w-[130px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Peso Actual</span>
                  <span className="text-2xl font-heading font-black text-emerald-400">
                    {hasData ? `${latestMeasurement.bodyWeight}` : profile.currentWeightKg} <span className="text-xs text-slate-400 font-mono">kg</span>
                  </span>
                  <span className="text-[10px] text-teal-300 block font-semibold">
                    Meta: {targetWeight} kg
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-950 border border-teal-500/30 text-center min-w-[130px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Progreso Total</span>
                  <span className="text-2xl font-heading font-black text-teal-300">
                    {weightDiff < 0 ? `${weightDiff}` : (weightDiff > 0 ? `+${weightDiff}` : '0')} <span className="text-xs text-slate-400 font-mono">kg</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {weightDiff < 0 ? '✓ Perdiendo grasa' : 'Inicio'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 rounded-xl bg-dark-950 border border-amber-500/30 text-center min-w-[130px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Crecimiento Brazo</span>
                  <span className="text-2xl font-heading font-black text-amber-400">
                    {hasData ? `+${armGained}` : '--'} <span className="text-xs text-slate-400 font-mono">cm</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 block font-semibold">
                    {hasData ? `${currentArm} cm actual` : 'Sin registro base'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-dark-950 border border-cyan-500/30 text-center min-w-[130px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Peso Corporal</span>
                  <span className="text-2xl font-heading font-black text-cyan-400">
                    {hasData ? `${latestMeasurement.bodyWeight}` : profile.weightKg} <span className="text-xs text-slate-400 font-mono">kg</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    {hasData ? (latestMeasurement.bodyWeight - profile.startWeightKg >= 0 ? `+${(latestMeasurement.bodyWeight - profile.startWeightKg).toFixed(1)} kg` : `${(latestMeasurement.bodyWeight - profile.startWeightKg).toFixed(1)} kg`) : 'Base'}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Milestone Bar */}
        {hasData && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-slate-300">
                {isMiranda ? (
                  <>Objetivo Recomposición: <strong className="text-white">{startWeight} kg</strong> ➔ <strong className="text-emerald-400">{targetWeight} kg (-7 kg)</strong></>
                ) : (
                  <>Objetivo 60 Días: <strong className="text-white">{startArm} cm</strong> ➔ <strong className="text-amber-400">{targetArm} cm (+3.0 cm)</strong></>
                )}
              </span>
              <span className={`font-bold ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isMiranda ? `${weightProgressPercent}% hacia la meta` : `${armProgressPercent}% completado`}
              </span>
            </div>
            <div className="w-full h-3 bg-dark-950 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className={`h-full rounded-full transition-all duration-500 shadow-md ${
                  isMiranda 
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-400 shadow-amber-500/20'
                }`}
                style={{ width: `${Math.max(5, isMiranda ? weightProgressPercent : armProgressPercent)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Visual Chart Card */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <h3 className="font-heading font-bold text-base text-white mb-4 flex items-center gap-2">
          {isMiranda ? <Scale className="w-5 h-5 text-emerald-400" /> : <Ruler className="w-5 h-5 text-amber-400" />}
          {isMiranda ? 'Curva de Peso Corporal (kg)' : 'Trayectoria de Perímetro de Brazo (cm)'}
        </h3>

        {!hasData ? (
          <div className="w-full h-44 bg-dark-950/70 rounded-xl p-6 border border-white/5 flex flex-col items-center justify-center text-center">
            {isMiranda ? <Scale className="w-8 h-8 text-slate-600 mb-2" /> : <Ruler className="w-8 h-8 text-slate-600 mb-2" />}
            <p className="text-sm font-semibold text-slate-300">Sin datos registrados aún</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Ingresa tu primera medición abajo para iniciar tu registro y calibrar tu evolución.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-full h-48 sm:h-56 bg-dark-950/70 rounded-xl p-4 border border-white/5 relative flex items-end justify-start gap-4 overflow-x-auto">
              {sortedMeasurements.map((m) => {
                const val = isMiranda ? m.bodyWeight : (m.armCircumference || 33);
                const values = sortedMeasurements.map(x => isMiranda ? x.bodyWeight : (x.armCircumference || 33));
                const minVal = Math.min(...values) - (isMiranda ? 1 : 2);
                const maxVal = Math.max(...values, minVal + (isMiranda ? 3 : 5));
                const heightPercent = Math.min(100, Math.max(30, ((val - minVal) / (maxVal - minVal)) * 100));

                return (
                  <div key={m.id} className="min-w-[60px] flex-1 flex flex-col items-center h-full justify-end group">
                    <span className={`text-[11px] font-mono font-bold mb-1 opacity-90 group-hover:scale-110 transition-transform ${
                      isMiranda ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {val} {isMiranda ? 'kg' : 'cm'}
                    </span>
                    <div 
                      className={`w-full max-w-[42px] rounded-t-lg transition-all duration-500 group-hover:brightness-125 relative ${
                        isMiranda 
                          ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-cyan-400'
                          : 'bg-gradient-to-t from-amber-600 via-orange-500 to-amber-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      <div className="absolute top-1 left-1 right-1 h-1 bg-white/40 rounded-full" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-2">
                      Día {m.dayNumber}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              {isMiranda ? 'Progreso de pesaje semanal matutino' : 'Evolución acumulada del perímetro de bíceps y tríceps'}
            </p>
          </div>
        )}
      </div>

      {/* New Measurement Form */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className={`w-5 h-5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
          <h3 className="font-heading font-bold text-base text-white">
            {isFirstMeasurement ? 'Registrar Medición Inicial (Día 1)' : `Registrar Medición Semanal (Día ${currentCycleDay})`}
          </h3>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {!isMiranda ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Contorno de Brazo Flexionado (cm)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={armCm}
                  onChange={(e) => setArmCm(e.target.value)}
                  placeholder="Ej: 33.5"
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">cm</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cintura (cm, opcional)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  placeholder="Ej: 72.0"
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">cm</span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Peso Corporal en Ayunas (kg)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder={isMiranda ? '62.0' : '70.0'}
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isMiranda ? 'Cadera (cm, opcional)' : 'Notas o Sensaciones'}
            </label>
            {isMiranda ? (
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                  placeholder="Ej: 98.0"
                  className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-bold">cm</span>
              </div>
            ) : (
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Buena congestión en tríceps"
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className={`py-2.5 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
                isMiranda 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-black" />
              <span>Guardar Registro</span>
            </button>
          </div>
        </form>
      </div>

      {/* Measurement History Table */}
      {hasData && (
        <div className="glass-card rounded-2xl p-5 border border-white/10">
          <h4 className="font-heading font-bold text-sm text-slate-300 mb-3">
            Historial de Chequeos Antropométricos ({sortedMeasurements.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 border-b border-white/5 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2 px-3">Día</th>
                  <th className="py-2 px-3">Fecha</th>
                  <th className="py-2 px-3">{isMiranda ? 'Cintura / Cadera' : 'Perímetro Brazo'}</th>
                  <th className="py-2 px-3">Peso</th>
                  <th className="py-2 px-3">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {sortedMeasurements.map((m) => (
                  <tr key={m.id} className="hover:bg-dark-900/50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-white">Día {m.dayNumber}</td>
                    <td className="py-2.5 px-3 text-slate-400">{m.date}</td>
                    <td className={`py-2.5 px-3 font-bold ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {isMiranda ? (
                        m.waistCircumference ? `${m.waistCircumference} cm / ${m.hipCircumference || '--'} cm` : '--'
                      ) : (
                        `${m.armCircumference} cm`
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">{m.bodyWeight} kg</td>
                    <td className="py-2.5 px-3 text-slate-400 font-sans">{m.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
