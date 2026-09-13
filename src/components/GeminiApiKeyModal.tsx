import { useState } from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, ExternalLink, X, Eye, EyeOff, Trash2, Loader2 } from 'lucide-react';
import { getStoredGeminiKey, saveStoredGeminiKey, removeStoredGeminiKey, testGeminiApiKey } from '../lib/geminiNutrition';
import { playBeep } from '../lib/sound';

interface GeminiApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (hasKey: boolean) => void;
}

export const GeminiApiKeyModal: React.FC<GeminiApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(getStoredGeminiKey());
  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setTestResult({ success: false, message: 'Por favor ingresa una clave válida de Gemini.' });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    const res = await testGeminiApiKey(apiKeyInput.trim());
    setIsTesting(false);

    if (res.valid) {
      saveStoredGeminiKey(apiKeyInput.trim());
      setTestResult({ success: true, message: '¡API Key verificada y guardada exitosamente!' });
      playBeep('success');
      onKeySaved(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setTestResult({ success: false, message: res.message });
      playBeep('tick');
    }
  };

  const handleRemoveKey = () => {
    removeStoredGeminiKey();
    setApiKeyInput('');
    setTestResult({ success: true, message: 'Clave eliminada. El sistema volverá a la base local.' });
    onKeySaved(false);
    playBeep('tick');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-dark-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              Inteligencia Artificial Gemini
            </div>
            <h3 className="font-heading font-black text-xl text-white">
              Conectar Gemini API (Reconocimiento Total)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Reconoce cualquier comida, ingredientes exactos y diferencias (pan integral vs blanco, cocciones, etc.).
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-2xl bg-dark-950 border border-white/5 space-y-2 mb-5 text-xs text-slate-300">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-emerald-400" />
            ¿Cómo obtener tu clave gratuita en 1 minuto?
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
            <li>Entra gratis a <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-semibold inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-2.5 h-2.5" /></a> con tu cuenta de Google.</li>
            <li>Haz clic en <strong>"Create API Key"</strong> y copia el código generado.</li>
            <li>Pégalo en el campo aquí abajo y presiona <strong>"Verificar y Guardar"</strong>.</li>
          </ol>
          <p className="text-[10px] text-slate-500 pt-1">
            * Tu clave se guarda únicamente en tu navegador (`localStorage`), de forma segura y privada.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleTestAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tu Gemini API Key:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-dark-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono pr-20"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 transition-colors"
                  title={showPassword ? 'Ocultar' : 'Mostrar'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-red-950/40 border-red-500/40 text-red-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {getStoredGeminiKey() && (
              <button
                type="button"
                onClick={handleRemoveKey}
                className="px-3.5 py-2.5 rounded-xl bg-dark-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Desconectar clave y usar base local"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Desconectar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white text-xs font-bold transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isTesting || !apiKeyInput.trim()}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-black" />
                  <span>Verificar y Guardar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
