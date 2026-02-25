import { EVOLUTION_STAGES } from '../../utils/trainingConfig';

interface EvolutionModalProps {
  stage: number;
  petName: string;
  onClose: () => void;
}

export default function EvolutionModal({ stage, petName, onClose }: EvolutionModalProps) {
  const stageData = EVOLUTION_STAGES[stage as 1 | 2 | 3];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="evolution-modal max-w-sm w-full mx-4 p-8 rounded-3xl bg-gradient-to-b from-noche to-musgo/30 border border-sol/40 text-center shadow-2xl animate-evolutionPop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animación de emoji */}
        <div className="relative mb-6 flex justify-center">
          <div className="text-8xl animate-evolution-spin">{stageData.emoji}</div>
        </div>

        <div className="fraunces text-2xl font-bold text-niebla mb-2">🎉 ¡Evolución!</div>
        <div className="dm-sans text-niebla/80 mb-1">
          <span className="text-sol font-bold">{petName}</span> evolucionó a
        </div>
        <div className="fraunces text-3xl text-sol font-bold mb-2">
          {stageData.emoji} {stageData.label}
        </div>
        <div className="dm-sans text-sm text-hoja mb-6">+100 🍊 de bonus de evolución</div>

        <button
          onClick={onClose}
          className="px-8 py-3 rounded-xl font-bold fraunces transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--sol)', color: 'var(--noche)' }}
        >
          ¡Increíble! ✨
        </button>
      </div>
    </div>
  );
}
