import { useState } from 'react';
import { X, CheckCircle2, ShieldAlert, HeartPulse, Info, Footprints, Flame, Check } from 'lucide-react';
import type { CardioLog, UserProfile } from '../types';

interface CardioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCardio: (log: CardioLog, markCompleted?: boolean) => void;
  recentCardioLogs: CardioLog[];
  profile: UserProfile;
  isCardioCompletedToday?: boolean;
  onToggleCardioCompleted?: (completed: boolean) => void;
}

export const CardioModal: React.FC<CardioModalProps> = ({
  isOpen,
  onClose,
  onSaveCardio,
  recentCardioLogs,
  profile,
  isCardioCompletedToday = false,
  onToggleCardioCompleted
}) => {
  const isMiranda = profile.id === 'miranda';

  // Tomás defaults: 20 min safe limit
  // Miranda defaults: 35 min optimal health/fat-loss zone
  const [minutes, setMinutes] = useState<number>(isMiranda ? 35 : 20);
  const [activityType, setActivityType] = useState<string>(
    isMiranda ? 'Caminata Rápida / Marcha al Aire Libre' : 'Caminata Ligera Regenerativa'
  );
  const [intensity, setIntensity] = useState<'Ligera (Regenerativa)' | 'Moderada' | 'Intensa (Catabólica)'>(
    isMiranda ? 'Moderada' : 'Ligera (Regenerativa)'
  );

  if (!isOpen) return null;

  // Evaluation for Tomás: excessive if > 20 min or catabolic intensity
  // Evaluation for Miranda: optimal between 25-50 min, short if < 20 min
  const isExcessiveTomas = !isMiranda && (minutes > 20 || intensity === 'Intensa (Catabólica)');
  const isOptimalMiranda = isMiranda && minutes >= 25 && minutes <= 50;
  const isShortMiranda = isMiranda && minutes < 20;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    let warningMsg = '';
    let isWarning = false;
    let autoCompleteChecklist = false;

    if (isMiranda) {
      if (minutes >= 25) {
        warningMsg = `¡Excelente sesión de ${minutes} min (${intensity})! Cumpliste tu objetivo de cardio saludable para estimulación metabólica, tonificación de tren inferior y control de colesterol.`;
        isWarning = false;
        autoCompleteChecklist = true;
      } else {
        warningMsg = `Sesión de ${minutes} min registrada. Buen esfuerzo; intenta alcanzar al menos 30 min o sumar tus 6.000-8.000 pasos en el día.`;
        isWarning = false;
        autoCompleteChecklist = minutes >= 20;
      }
    } else {
      // Tomás
      if (isExcessiveTomas) {
        warningMsg = `ADVERTENCIA DE HIPERTROFIA: Sesión de ${minutes} min registrada. Tu prioridad durante este ciclo de 60 días es ganar volumen en tríceps y bíceps. Salir a correr o hacer cardio extenuante activa la enzima AMPK que frena la vía mTOR de hipertrofia y consume tu superávit. Limita a 15-20 min suaves o añade al menos 250-350 kcal extra hoy.`;
        isWarning = true;
        autoCompleteChecklist = false;
      } else {
        warningMsg = `Sesión regenerativa óptima (${minutes} min). Flujo sanguíneo adecuado para recuperación sin comprometer la ganancia de masa muscular.`;
        isWarning = false;
        autoCompleteChecklist = true;
      }
    }

    const newLog: CardioLog = {
      id: `cardio_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMinutes: minutes,
      type: activityType,
      intensity,
      isWarning,
      coachWarning: warningMsg
    };

    onSaveCardio(newLog, autoCompleteChecklist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className={`w-full max-w-lg bg-dark-900 border rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto ${
        isMiranda ? 'border-emerald-500/40 shadow-emerald-950/40' : 'border-red-500/40 shadow-red-950/40'
      }`}>
        {/* Glow */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          isMiranda ? 'bg-emerald-500/10' : 'bg-red-500/10'
        }`} />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
            isMiranda 
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
              : 'bg-red-500/20 border-red-500/40 text-red-400'
          }`}>
            {isMiranda ? <Footprints className="w-6 h-6" /> : <HeartPulse className="w-6 h-6" />}
          </div>
          <div>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mb-1 border ${
              isMiranda 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30'
            }`}>
              {isMiranda ? 'Perfil Miranda • Quema & Salud' : 'Perfil Tomás • Anti-Catabolismo'}
            </div>
            <h3 className="font-heading font-black text-xl text-white">
              {isMiranda ? 'Cardio Saludable & Quema de Grasa' : 'Regla de Cardio Anti-Catabolismo'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isMiranda 
                ? 'Control de colesterol, déficit calórico y tonificación articular'
                : 'Protocolo estricto para proteger la hipertrofia de brazos en 60 días'}
            </p>
          </div>
        </div>

        {/* Coach Rule Banner */}
        <div className={`mb-5 p-4 rounded-2xl border flex items-start gap-3 text-xs leading-relaxed ${
          isMiranda 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
        }`}>
          <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`} />
          <div>
            <strong className={`block font-bold mb-1 ${isMiranda ? 'text-emerald-300' : 'text-amber-300'}`}>
              REGLA DEL ENTRENADOR:
            </strong>
            {isMiranda ? (
              <span>
                Para bajar hacia tu meta de 55 kg y mejorar tu perfil lipídico (bajar colesterol LDL y elevar HDL), necesitas 
                <strong className="text-white"> 30 a 45 minutos de cardio de bajo impacto</strong> (caminata a paso ligero, elíptica o bici fija) 
                o completar tu meta de <strong className="text-emerald-300 font-bold">6.000 a 8.000 pasos diarios</strong>.
              </span>
            ) : (
              <span>
                Para ganar centímetros reales en bíceps y tríceps necesitas <strong className="text-white">superávit calórico y balance de nitrógeno positivo</strong>. 
                Evita el cardio prolongado o agotador. Si sales a trotar, limítate a <strong className="text-amber-300 font-bold">15 a 20 minutos suaves</strong> de recuperación activa.
              </span>
            )}
          </div>
        </div>

        {/* Quick Checklist Toggle Inside Modal */}
        {onToggleCardioCompleted && (
          <div className={`mb-5 p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
            isCardioCompletedToday 
              ? 'bg-emerald-950/40 border-emerald-500/40' 
              : 'bg-dark-950 border-white/10'
          }`}>
            <div className="pr-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                Estado en tu Checklist de Hoy
              </span>
              <p className="text-xs font-bold text-white mt-0.5">
                {isMiranda 
                  ? (isCardioCompletedToday ? '✓ Meta de cardio/pasos cumplida hoy' : 'Pendiente: 30-45 min o pasos activos')
                  : (isCardioCompletedToday ? '✓ Regla anti-catabolismo cumplida (sin cardio excesivo)' : '¿Respetaste la regla de cardio hoy?')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onToggleCardioCompleted(!isCardioCompletedToday)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 flex items-center gap-1.5 transition-all shadow-md ${
                isCardioCompletedToday
                  ? 'bg-emerald-500 text-black shadow-emerald-500/20 hover:bg-emerald-400'
                  : isMiranda
                    ? 'bg-dark-800 text-slate-300 border border-white/10 hover:border-emerald-500 hover:text-white'
                    : 'bg-dark-800 text-slate-300 border border-white/10 hover:border-amber-500 hover:text-white'
              }`}
            >
              {isCardioCompletedToday ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡CUMPLIDO!</span>
                </>
              ) : (
                <span>MARCAR SÍ</span>
              )}
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tipo de Actividad Aeróbica
            </label>
            <select
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              className="w-full bg-dark-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              {isMiranda ? (
                <>
                  <option value="Caminata Rápida / Marcha al Aire Libre">Caminata Rápida / Marcha al Aire Libre (Recomendado Colesterol)</option>
                  <option value="Bicicleta Fija / Paseo Recreativo">Bicicleta Fija / Paseo Recreativo (Bajo Impacto)</option>
                  <option value="Caminata Inclinada en Cinta">Caminata Inclinada en Cinta (Glúteos & Quema)</option>
                  <option value="Elíptica / Cero Impacto Articular">Elíptica (Cero Impacto Articular)</option>
                  <option value="Trote Suave / Intervalos">Trote Suave / Intervalos</option>
                  <option value="Rutina de Baile o Aeróbica en Casa">Rutina de Baile o Aeróbica en Casa</option>
                </>
              ) : (
                <>
                  <option value="Caminata Ligera Regenerativa">Caminata Ligera Regenerativa (Recomendado)</option>
                  <option value="Trote Suave Regenerativo (≤ 20 min)">Trote Suave Regenerativo (≤ 20 min)</option>
                  <option value="Ciclismo Recreativo Suave">Ciclismo Recreativo Suave</option>
                  <option value="Salto de Cuerda / HIIT">Salto de Cuerda / HIIT (¡Alerta Catabolismo!)</option>
                  <option value="Salida a Correr Prolongada">Salida a Correr Prolongada (¡Alerta Catabolismo!)</option>
                </>
              )}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Duración de la Sesión
              </label>
              <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg border ${
                isMiranda
                  ? isOptimalMiranda
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : isShortMiranda
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : isExcessiveTomas
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              }`}>
                {minutes} minutos
              </span>
            </div>

            <input
              type="range"
              min={isMiranda ? 10 : 5}
              max={isMiranda ? 90 : 60}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              className={`w-full h-2 bg-dark-950 rounded-lg appearance-none cursor-pointer ${
                isMiranda ? 'accent-emerald-500' : 'accent-amber-500'
              }`}
            />

            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>{isMiranda ? '10 min' : '5 min (Mínimo)'}</span>
              <span className={`font-semibold ${isMiranda ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isMiranda ? '30 a 45 min (Zona Óptima Miranda)' : '20 min (Límite Recomendado)'}
              </span>
              <span>{isMiranda ? '90 min' : '60 min'}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Intensidad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(isMiranda 
                ? ['Ligera (Zona 1 - Regenerativa)', 'Moderada (Zona 2 - Quema Grasa)', 'Intensa (Zona 3-4)'] 
                : ['Ligera (Regenerativa)', 'Moderada', 'Intensa (Catabólica)']
              ).map(level => (
                <button
                  type="button"
                  key={level}
                  onClick={() => setIntensity(level as any)}
                  className={`py-2 px-1.5 rounded-xl text-[11px] font-semibold border transition-all text-center ${
                    intensity === level
                      ? isMiranda
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                        : level.includes('Catabólica')
                          ? 'bg-red-500/20 border-red-500 text-red-300 font-bold'
                          : 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-dark-950 border-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {level.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Feedback Box */}
          {isMiranda ? (
            isOptimalMiranda ? (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-200 leading-relaxed">
                  <strong>¡Rango Óptimo para Miranda ({minutes} min)!</strong> Estímulo cardiovascular perfecto para quemar grasa subcutánea, aumentar el colesterol bueno (HDL) y proteger tus rodillas sin disparar el cortisol.
                </p>
              </div>
            ) : isShortMiranda ? (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-2.5">
                <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed">
                  Sesión corta ({minutes} min). Es un buen inicio para moverte, pero te sugerimos llegar a los <strong>30–45 minutos</strong> o sumar pasos en el día para acelerar tu déficit de 55 kg.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-start gap-2.5">
                <Flame className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-cyan-200 leading-relaxed">
                  Sesión extensa ({minutes} min). Gran gasto energético. Recuerda beber agua abundante y descansar bien para que los músculos se recuperen sin rigidez.
                </p>
              </div>
            )
          ) : (
            isExcessiveTomas ? (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 animate-in fade-in flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-red-300 uppercase tracking-wide">
                    ¡Atención! Riesgo de interferencia hipertrófica
                  </h4>
                  <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                    Has seleccionado <strong>{minutes} min</strong> con intensidad <strong>{intensity}</strong>.
                    Correr en exceso activará la enzima AMPK que frena la vía mTOR e impide que tus brazos ganen volumen.
                    Si realizas esta sesión, <span className="underline decoration-amber-400 font-bold text-white">deberás consumir al menos 300 kcal adicionales</span> para no perder músculo.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p className="text-xs text-emerald-300">
                  Sesión dentro del rango seguro (15-20 min). Fomenta recuperación activa y flujo capilar sin sabotear la ganancia de masa muscular.
                </p>
              </div>
            )
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-dark-800 text-slate-300 hover:text-white hover:bg-dark-700 text-xs font-bold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 rounded-xl font-black text-xs transition-all shadow-lg text-black ${
                isMiranda
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20'
                  : isExcessiveTomas
                    ? 'bg-amber-500 hover:bg-amber-400 shadow-amber-500/20'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20'
              }`}
            >
              Registrar Sesión de Cardio
            </button>
          </div>
        </form>

        {/* History of recent cardio */}
        {recentCardioLogs.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">
              Historial de Cardio Registrado Hoy
            </h4>
            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {recentCardioLogs.map(log => (
                <div key={log.id} className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{log.type}</span>
                    <span className="text-slate-400 ml-2">({log.durationMinutes} min - {log.intensity})</span>
                  </div>
                  {isMiranda ? (
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold ${
                      log.durationMinutes >= 25 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                    }`}>
                      {log.durationMinutes >= 25 ? '✓ Meta Óptima' : 'Actividad Registrada'}
                    </span>
                  ) : (
                    log.isWarning ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                        Aviso Catabólico
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Regenerativo Seguro
                      </span>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
