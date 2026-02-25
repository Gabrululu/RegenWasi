/**
 * LeaderboardPage — Ranking global de todos los Regenmons
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useHubAuth } from '../hooks/useHubAuth';
import { useHub } from '../hooks/useHub';

interface LeaderboardEntry {
  id: string;
  name: string;
  ownerName: string;
  sprite: string;
  totalPoints: number;
  stage: number;
  balance?: number;
  totalVisits?: number;
}

interface LeaderboardPageProps {
  onBack?: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onBack }) => {
  const { hubId } = useHubAuth();
  const { getLeaderboard } = useHub();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const result = await getLeaderboard(page, 10, filter === 'all' ? undefined : filter);
        setEntries(result.data?.entries || []);
        setTotal(result.data?.total || 0);
        setTotalPages(result.data?.pages || 1);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [page, filter]);

  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen bg-noche px-4 py-6 max-w-screen-md mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-all"
        >
          <ArrowLeft size={18} className="text-niebla" />
        </button>
        <h1 className="font-display text-2xl text-niebla font-bold">🏆 Leaderboard</h1>
        <span className="font-body text-xs text-niebla/50 ml-auto">{total} Guardianes</span>
      </div>

      {/* Filtros por stage */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[
          { value: 'all', label: 'Todos' },
          { value: '1', label: '🥚 Bebé' },
          { value: '2', label: '🐣 Joven' },
          { value: '3', label: '🐉 Adulto' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => {
              setFilter(f.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full font-body text-xs whitespace-nowrap transition-all
                       ${
                         filter === f.value
                           ? 'bg-sol text-noche font-bold'
                           : 'bg-white/10 text-niebla/60 hover:bg-white/15'
                       }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-body text-sm text-niebla/50">Sin Guardianes en esta categoría</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, idx) => {
            const globalRank = (page - 1) * 10 + idx + 1;
            const isMe = entry.id === hubId;
            return (
              <button
                key={entry.id}
                onClick={() => {
                  /* navegaría a perfil público */
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl
                           border transition-all hover:scale-101 active:scale-99 text-left
                           ${
                             isMe
                               ? 'bg-sol/15 border-sol/40'
                               : 'bg-white/5 border-white/10 hover:bg-white/8'
                           }`}
              >
                {/* Rank */}
                <span className="font-display text-xl w-8 text-center flex-shrink-0">
                  {getRankDisplay(globalRank)}
                </span>
                {/* Sprite */}
                <img
                  src={entry.sprite}
                  alt={entry.name}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm text-niebla font-bold truncate">
                      {entry.name}
                    </span>
                    {isMe && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-body bg-sol/30 text-sol flex-shrink-0">
                        Tú
                      </span>
                    )}
                  </div>
                  <div className="font-body text-xs text-niebla/50 truncate">{entry.ownerName}</div>
                </div>
                {/* Stats */}
                <div className="text-right flex-shrink-0">
                  <div className="font-display text-sm text-sol font-bold">
                    {entry.totalPoints?.toLocaleString()}
                  </div>
                  <div className="font-body text-xs text-niebla/40">pts</div>
                </div>
                <ChevronRight size={14} className="text-niebla/30 flex-shrink-0" />
              </button>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-white/10 font-body text-sm text-niebla/70
                       disabled:opacity-30 hover:bg-white/15 transition-all"
          >
            ← Anterior
          </button>
          <span className="font-body text-xs text-niebla/50">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                       bg-white/10 font-body text-sm text-niebla/70
                       disabled:opacity-30 hover:bg-white/15 transition-all"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
};
