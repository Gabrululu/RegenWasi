interface TrainingStatsProps {
  totalTrainings: number;
  averageScore: number;
  streakDays: number;
}

export default function TrainingStats({
  totalTrainings,
  averageScore,
  streakDays
}: TrainingStatsProps) {
  return (
    <div className="training-stats grid grid-cols-3 gap-2 mb-4">
      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xl mb-1">🎓</div>
        <div className="fraunces text-lg font-bold text-niebla">{totalTrainings}</div>
        <div className="dm-sans text-xs text-niebla/50">Entrenamientos</div>
      </div>
      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xl mb-1">📊</div>
        <div className="fraunces text-lg font-bold text-niebla">
          {averageScore ? `${averageScore}/100` : '—'}
        </div>
        <div className="dm-sans text-xs text-niebla/50">Score promedio</div>
      </div>
      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="text-xl mb-1">📅</div>
        <div className="fraunces text-lg font-bold text-niebla">{streakDays}d 🔥</div>
        <div className="dm-sans text-xs text-niebla/50">Racha</div>
      </div>
    </div>
  );
}
