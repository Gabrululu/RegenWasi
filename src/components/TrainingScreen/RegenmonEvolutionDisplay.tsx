import { EVOLUTION_STAGES } from '../../utils/trainingConfig';
import { getAnimal } from '../../utils/animalConfig';
import { AnimalType } from '../../types';

interface RegenmonEvolutionDisplayProps {
  petName: string;
  animal: AnimalType;
  stage: number;
  totalPoints: number;
}

export default function RegenmonEvolutionDisplay({
  petName,
  animal,
  stage,
  totalPoints
}: RegenmonEvolutionDisplayProps) {
  const animalEmoji = getAnimal(animal).emoji;
  const currentStage = EVOLUTION_STAGES[stage as 1 | 2 | 3];
  const nextStage = stage < 3 ? EVOLUTION_STAGES[(stage + 1) as 1 | 2 | 3] : null;

  const progress = nextStage
    ? ((totalPoints - currentStage.minPoints) / (nextStage.minPoints - currentStage.minPoints)) * 100
    : 100;

  return (
    <div className="evolution-display p-4 rounded-2xl bg-white/5 border border-white/10 mb-4">
      {/* Avatar con stage emoji */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <span className="text-5xl">{animalEmoji}</span>
          <span className="absolute -bottom-1 -right-1 text-xl">{currentStage.emoji}</span>
        </div>
        <div>
          <div className="fraunces text-lg text-niebla font-bold">{petName}</div>
          <div className="dm-sans text-xs text-niebla/60">
            {currentStage.emoji} {currentStage.label} · Etapa {stage}/3
          </div>
          <div className="dm-sans text-xs text-sol mt-0.5">⭐ {totalPoints} pts totales</div>
        </div>
      </div>

      {/* Barra de progreso */}
      {nextStage && (
        <div>
          <div className="flex justify-between mb-1">
            <span className="dm-sans text-xs text-niebla/50">
              Progreso a {nextStage.emoji} {nextStage.label}
            </span>
            <span className="dm-sans text-xs text-sol">
              {totalPoints}/{nextStage.minPoints} pts
            </span>
          </div>
          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-musgo to-sol transition-all duration-700"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="dm-sans text-xs text-niebla/40 mt-1 text-right">
            Faltan {Math.max(0, nextStage.minPoints - totalPoints)} pts para evolucionar
          </div>
        </div>
      )}
      {!nextStage && (
        <div className="text-center dm-sans text-sm text-sol">
          ✨ ¡Evolución máxima alcanzada!
        </div>
      )}
    </div>
  );
}
