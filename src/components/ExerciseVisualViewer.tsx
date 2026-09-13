import { useState, useEffect } from 'react';
import { Play, Pause, RotateCw, ExternalLink, Sparkles, Tv, Layers } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseVisualViewerProps {
  exercise: Exercise;
}

export const ExerciseVisualViewer: React.FC<ExerciseVisualViewerProps> = ({ exercise }) => {
  const [viewMode, setViewMode] = useState<'animation' | 'youtube'>('animation');
  const [activeFrameIndex, setActiveFrameIndex] = useState<number>(0);
  const [phaseText, setPhaseText] = useState<string>('3s Bajada excéntrica (Fase negativa)');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(3);
  const [isLoopPlaying, setIsLoopPlaying] = useState<boolean>(true);
  const [youtubeError, setYoutubeError] = useState<boolean>(false);

  const frames = exercise.animationFrames || [
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/0.jpg',
    'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Dumbbell_Tricep_Extension/1.jpg'
  ];

  // Tempo-synchronized loop metronome: 3s eccentric, 1s isometric, 1s concentric
  useEffect(() => {
    if (!isLoopPlaying || viewMode !== 'animation') return;

    // Cycle length: 5 seconds total (3s descent to frame 1, 1s hold at frame 1, 1s return to frame 0)
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % 5;

      if (step >= 0 && step < 3) {
        // Eccentric phase (0.jpg moving to 1.jpg)
        setActiveFrameIndex(0);
        setPhaseText('3s Bajada excéntrica lenta (TUT)');
        setSecondsRemaining(3 - step);
      } else if (step === 3) {
        // Isometric hold (1.jpg)
        setActiveFrameIndex(1);
        setPhaseText('1s Pausa isométrica en contracción');
        setSecondsRemaining(1);
      } else {
        // Concentric return (1.jpg to 0.jpg)
        setActiveFrameIndex(1);
        setPhaseText('1s Subida explosiva controlada');
        setSecondsRemaining(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoopPlaying, viewMode]);

  const youtubeId = exercise.videoEmbedUrl || 'ykJmrZ5v0Oo';
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeId}`;

  return (
    <div className="rounded-2xl overflow-hidden bg-dark-950 border border-white/10 shadow-2xl">
      {/* Top Header Switcher: Animation Loop vs YouTube */}
      <div className="px-4 py-2.5 bg-dark-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-lg bg-dark-950 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('animation')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewMode === 'animation'
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bucle HD (Garantizado)</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('youtube')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewMode === 'youtube'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Video YouTube</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'animation' && (
            <button
              type="button"
              onClick={() => setIsLoopPlaying(!isLoopPlaying)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-dark-850 hover:bg-dark-800 border border-white/5 text-[11px] font-semibold text-slate-300"
            >
              {isLoopPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isLoopPlaying ? 'Pausar' : 'Reanudar'}</span>
            </button>
          )}

          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
            <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
            Loop 100% Funcional
          </span>
        </div>
      </div>

      {/* Main Visual Display Area */}
      {viewMode === 'animation' ? (
        <div className="relative w-full aspect-[16/10] sm:aspect-video bg-dark-950 flex items-center justify-center overflow-hidden group">
          {/* Active Motion Image with crossfade */}
          <img
            src={frames[activeFrameIndex]}
            alt={exercise.name}
            className="w-full h-full object-contain transition-all duration-700 ease-in-out select-none"
            loading="eager"
          />

          {/* Floating Tempo Metronome Banner */}
          <div className="absolute top-3 left-3 z-10">
            <div className="px-3 py-1.5 rounded-xl bg-dark-950/90 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Metrónomo de Tempo (6 kg)</span>
                <span className="text-xs font-bold text-amber-300">{phaseText} ({secondsRemaining}s)</span>
              </div>
            </div>
          </div>

          {/* Pose indicator dots */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono">
            <span className={`w-2 h-2 rounded-full ${activeFrameIndex === 0 ? 'bg-amber-400 scale-125' : 'bg-slate-600'} transition-all`} />
            <span className="text-slate-400">Inicio</span>
            <span className="text-slate-600">➔</span>
            <span className={`w-2 h-2 rounded-full ${activeFrameIndex === 1 ? 'bg-emerald-400 scale-125' : 'bg-slate-600'} transition-all`} />
            <span className="text-slate-400">Contracción</span>
          </div>
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {!youtubeError ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=1&modestbranding=1&rel=0&playsinline=1`}
              title={exercise.name}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              onError={() => setYoutubeError(true)}
            />
          ) : (
            <div className="p-6 text-center text-slate-300 max-w-sm">
              <p className="text-xs text-amber-400 font-bold mb-2">
                YouTube restringió la inserción directa de este video en tu navegador.
              </p>
              <div className="flex flex-col gap-2">
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Abrir en YouTube Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setViewMode('animation')}
                  className="py-2 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 text-xs font-semibold"
                >
                  Volver al Bucle HD Garantizado
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trajectory & Elbow Angle Guide Footer */}
      {exercise.visualCue && (
        <div className="p-3.5 bg-dark-900/80 border-t border-white/10 flex items-start gap-2.5 text-xs">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            🎯
          </div>
          <div>
            <strong className="text-amber-400 block mb-0.5">Clave Biomecánica & Ángulo de Codos:</strong>
            <p className="text-slate-300 leading-relaxed">{exercise.visualCue}</p>
          </div>
        </div>
      )}
    </div>
  );
};
