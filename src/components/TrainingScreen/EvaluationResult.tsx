import { getScoreTier, getStatEffects } from '../../utils/trainingConfig';
import { EvaluationResult as EvalType } from '../../utils/training';

interface EvaluationResultProps {
  result: EvalType;
  totalPoints: number;
  stage: number;
  onRetrain: () => void;
}

export default function EvaluationResult({
  result,
  totalPoints,
  stage,
  onRetrain
}: EvaluationResultProps) {
  const tier = getScoreTier(result.score);
  const effects = getStatEffects(result.score);

  return (
    <div className="result-card space-y-4 animate-messageIn">
      {/* Score */}
      <div
        className="text-center py-6 rounded-2xl border"
        style={{ background: tier.bg, borderColor: tier.border }}
      >
        <div className="text-5xl mb-2 animate-bounce">{tier.emoji}</div>
        <div className="fraunces text-6xl font-bold text-niebla">
          {result.score}
          <span className="text-2xl text-niebla/50">/100</span>
        </div>
        <div className="dm-sans text-sm mt-1" style={{ color: tier.border }}>
          {tier.label}
        </div>
      </div>

      {/* Feedback */}
      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <p className="dm-sans text-xs text-niebla/50 mb-1">💬 Tu Guardián dice:</p>
        <p className="dm-sans text-sm text-niebla italic">"{result.feedback}"</p>
      </div>

      {/* Recompensas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="fraunces text-2xl text-sol font-bold">+{result.pointsEarned}</div>
          <div className="dm-sans text-xs text-niebla/60">⭐ Puntos</div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-center">
          <div className="fraunces text-2xl text-hoja font-bold">+{result.tokensEarned}</div>
          <div className="dm-sans text-xs text-niebla/60">🍊 $FRUTA</div>
        </div>
      </div>

      {/* Efectos en stats */}
      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <p className="dm-sans text-xs text-niebla/50 mb-2">📊 Efectos en tu Guardián:</p>
        <div className="space-y-1">
          {(['vitalidad', 'energia', 'nutricion'] as const).map(stat => (
            <div key={stat} className="flex justify-between items-center">
              <span className="dm-sans text-xs text-niebla/70 capitalize">{stat}</span>
              <span
                className={`dm-sans text-xs font-bold ${
                  effects[stat] > 0 ? 'text-hoja' : effects[stat] < 0 ? 'text-accent' : 'text-niebla/50'
                }`}
              >
                {effects[stat] > 0 ? '+' : ''}{effects[stat]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso de evolución */}
      <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
        <div className="dm-sans text-xs text-niebla/50 mb-1">📈 Estado de Evolución:</div>
        <div className="fraunces text-sm text-sol font-bold">
          ⭐ {totalPoints} / {stage >= 3 ? 'MAX' : stage === 2 ? '1500' : '500'} pts
        </div>
      </div>

      {/* Botón de reinicio */}
      <button
        onClick={onRetrain}
        className="w-full py-3 rounded-xl bg-white/10 text-niebla hover:bg-white/15 dm-sans font-medium transition-all"
      >
        🎓 Entrenar Nuevamente
      </button>
    </div>
  );
}
