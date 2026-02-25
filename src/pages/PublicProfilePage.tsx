/**
 * PublicProfilePage — Perfil público de un Regenmon
 * Incluye interacciones sociales (alimentar, regalar, mensajes)
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useHubAuth } from '../hooks/useHubAuth';
import { useHub } from '../hooks/useHub';import { EVOLUTION_STAGES } from '../utils/trainingConfig';

interface PublicProfilePageProps {
  regenmonId: string;
  onBack?: () => void;
  showToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

interface ProfileData {
  id: string;
  name: string;
  ownerName: string;
  sprite: string;
  stage: number;
  stats: { happiness: number; energy: number; hunger: number };
  totalPoints: number;
  balance: number;
  totalVisits: number;
  registeredAt: string;
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({
  regenmonId,
  onBack,
  showToast = () => {},
}) => {
  const { hubId, isRegistered } = useHubAuth();
  const { getProfile, feedRegenmon, giftRegenmon } = useHub();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [myBalance, setMyBalance] = useState(0);
  const [isFeeding, setIsFeeding] = useState(false);
  const [isGifting, setIsGifting] = useState<number | null>(null);

  const isMyProfile = hubId === regenmonId;

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const result = await getProfile(regenmonId);
        setProfile(result.data);
        // Cargar balance del user actual
        const saved = localStorage.getItem('regenwasi_frutas');
        setMyBalance(saved ? parseInt(saved) : 0);
      } catch {
        showToast('⚠️ Error al cargar perfil', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [regenmonId]);

  const handleFeed = async () => {
    if (myBalance < 10 || isFeeding || !isRegistered) return;
    setIsFeeding(true);
    try {
      const result = await feedRegenmon(regenmonId);
      setMyBalance(result.data.senderBalance);
      localStorage.setItem('regenwasi_frutas', String(result.data.senderBalance));
      showToast(`🍎 ¡Le diste de comer a ${profile?.name}! -10 $FRUTA`, 'success');
    } catch {
      showToast('⚠️ El HUB está descansando', 'error');
    } finally {
      setIsFeeding(false);
    }
  };

  const handleGift = async (amount: number) => {
    if (myBalance < amount || isGifting !== null || !isRegistered) return;
    setIsGifting(amount);
    try {
      const result = await giftRegenmon(regenmonId, amount);
      setMyBalance(result.data.senderBalance);
      localStorage.setItem('regenwasi_frutas', String(result.data.senderBalance));
      showToast(`🎁 ¡Enviaste ${amount} $FRUTA a ${profile?.name}!`, 'success');
    } catch {
      showToast('⚠️ El HUB está descansando', 'error');
    } finally {
      setIsGifting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-noche px-4 py-6 max-w-screen-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-all"
          >
            <ArrowLeft size={18} className="text-niebla" />
          </button>
          <h1 className="font-display text-2xl text-niebla font-bold">👤 Perfil</h1>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-noche px-4 py-6 max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <p className="font-body text-center text-niebla/70">Guardián no encontrado 😢</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 rounded-xl bg-sol text-noche font-display font-bold">
          Volver
        </button>
      </div>
    );
  }

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
        <h1 className="font-display text-2xl text-niebla font-bold">👤 Perfil</h1>
      </div>

      {/* Modo visita */}
      {!isMyProfile && (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-body w-fit mb-4
                       bg-white/10 text-niebla/60 border border-white/15`}>
          👁️ Modo visita
        </div>
      )}

      {/* Perfil card */}
      <div className="profile-card p-6 rounded-2xl bg-white/5 border border-white/10 text-center mb-4">
        <img
          src={profile.sprite}
          alt={profile.name}
          className="w-24 h-24 mx-auto mb-4 rounded-2xl object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="font-display text-2xl text-niebla font-bold mb-1">{profile.name}</div>
        <div className="font-body text-sm text-niebla/60 mb-3">de {profile.ownerName}</div>

        {/* Stage */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-4">
          <span>{EVOLUTION_STAGES[(profile.stage || 1) as keyof typeof EVOLUTION_STAGES]?.emoji}</span>
          <span className="font-body text-xs text-niebla">{EVOLUTION_STAGES[(profile.stage || 1) as keyof typeof EVOLUTION_STAGES]?.label}</span>
        </div>

        {/* Stats */}
        <div className="space-y-2">
          {[
            { label: 'Vitalidad', value: profile.stats?.happiness ?? 0, color: 'bg-hoja' },
            { label: 'Energía', value: profile.stats?.energy ?? 0, color: 'bg-sol' },
            { label: 'Nutrición', value: profile.stats?.hunger ?? 0, color: 'bg-accent' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <span className="font-body text-xs text-niebla/50 w-20 text-right">{s.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div className={`h-full rounded-full ${s.color} transition-all duration-500`} style={{ width: `${s.value}%` }} />
              </div>
              <span className="font-body text-xs text-niebla/50 w-8">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { value: profile.totalPoints, label: 'pts', icon: '⭐', color: 'text-sol' },
            { value: profile.balance, label: '$FRUTA', icon: '🍊', color: 'text-hoja' },
            { value: profile.totalVisits ?? 0, label: 'visitas', icon: '👁️', color: 'text-niebla/50' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <div className={`font-display text-lg ${m.color}`}>{m.value}</div>
              <div className="font-body text-xs text-niebla/50">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Fecha */}
        <div className="font-body text-xs text-niebla/30 mt-3">
          Guardián desde{' '}
          {new Date(profile.registeredAt).toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>

      {/* Interacciones sociales */}
      {!isMyProfile && isRegistered && (
        <div className="space-y-3 mb-4">
          {/* Alimentar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="font-body text-sm text-niebla/70">🍎 Alimentar</span>
              <span className="font-body text-xs text-niebla/40">Tu balance: {myBalance} 🍊</span>
            </div>
            <button
              onClick={handleFeed}
              disabled={myBalance < 10 || isFeeding}
              className="w-full py-2.5 rounded-xl bg-accent/80 text-white font-body text-sm font-bold
                         hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed
                         hover:scale-101 active:scale-99 transition-all"
            >
              {isFeeding ? '🔄 Alimentando...' : '🍎 Dar de comer (-10 🍊)'}
            </button>
            {myBalance < 10 && (
              <p className="font-body text-xs text-accent/70 mt-1.5 text-center">
                Sin $FRUTA suficiente (necesitas 10 🍊)
              </p>
            )}
          </div>

          {/* Regalar */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="font-body text-sm text-niebla/70 block mb-3">🎁 Enviar regalo</span>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 25].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleGift(amount)}
                  disabled={myBalance < amount || isGifting !== null}
                  className="py-2.5 rounded-xl border font-body text-sm font-bold transition-all
                             hover:scale-102 active:scale-98
                             disabled:opacity-40 disabled:cursor-not-allowed
                             enabled:hover:border-sol/50 enabled:hover:text-sol
                             border-white/15 text-niebla/70"
                >
                  {isGifting === amount ? '🔄' : `🎁 ${amount}`}
                  <div className="text-xs font-normal opacity-60">🍊</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner para unirse si no registrado */}
      {!isMyProfile && !isRegistered && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center mb-4">
          <p className="font-body text-sm text-niebla/70 mb-3">Únete al HUB para interactuar con este Guardián</p>
          <button
            onClick={() => {
              /* navegar a social */
            }}
            className="px-6 py-2.5 rounded-xl bg-sol text-noche font-display text-sm font-bold
                       hover:scale-102 transition-all"
          >
            🌐 Unirse al HUB
          </button>
        </div>
      )}
    </div>
  );
};
