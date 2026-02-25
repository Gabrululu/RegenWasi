/**
 * SocialHub — Tab principal para interacciones sociales
 * incluye registro, dashboard, navegación al leaderboard y perfil
 */

import React, { useState } from 'react';
import { Copy } from 'lucide-react';
import { useHubAuth } from '../../hooks/useHubAuth';
import { useHub } from '../../hooks/useHub';
import type { PetData } from '../../types';
import { ANIMAL_EMOJIS, EVOLUTION_STAGES } from '../../utils/trainingConfig';

interface SocialHubProps {
  pet: PetData;
  stats: { vitalidad: number; energia: number; nutricion: number };
  totalPoints: number;
  frutas: number;
  showToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  onNavigate?: (path: string) => void;
}

export const SocialHub: React.FC<SocialHubProps> = ({
  pet,
  stats,
  totalPoints,
  frutas,
  showToast,
  onNavigate,
}) => {
  const { hubId, isRegistered, saveHubRegistration } = useHubAuth();
  const { register } = useHub();
  const [view, setView] = useState(isRegistered && hubId ? 'dashboard' : 'register');
  const [isRegistering, setIsRegistering] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');

  const getSpriteUrl = (emoji: string) => {
    const codePoints = [...emoji]
      .map((c) => c.codePointAt(0)?.toString(16))
      .filter(Boolean)
      .join('-');
    return `https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/${codePoints}.png`;
  };

  const handleRegister = async () => {
    if (isRegistering) return;
    setIsRegistering(true);
    showToast('⏳ Conectando con el HUB...', 'info');

    try {
      const result = await register({
        name: pet.name,
        ownerName: pet.name,
        ownerEmail: ownerEmail || '',
        appUrl: window.location.origin,
        sprite: getSpriteUrl(ANIMAL_EMOJIS[pet.animal as keyof typeof ANIMAL_EMOJIS] || '🌿'),
      });

      if (result.success || result.data?.id) {
        const newHubId = result.data.id;
        saveHubRegistration(newHubId);
        setView('dashboard');
        showToast('✅ ¡RegenWasi conectado al HUB!', 'success');
      }
    } catch {
      showToast('⚠️ El HUB está descansando, intenta después 🍃', 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const copyPublicUrl = () => {
    const url = `${window.location.origin}/regenmon/${hubId}`;
    navigator.clipboard.writeText(url);
    showToast('🔗 URL copiada', 'success');
  };

  const handleNavigate = (path: string) => {
    if (onNavigate) onNavigate(path);
  };

  return (
    <div className="space-y-4 px-4 py-4">
      {/* VISTA: REGISTRO */}
      {view === 'register' && (
        <div className="space-y-5">
          {/* Preview */}
          <div className="preview-card p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <img
              src={getSpriteUrl(ANIMAL_EMOJIS[pet.animal as keyof typeof ANIMAL_EMOJIS] || '🌿')}
              alt={pet.name}
              className="w-20 h-20 mx-auto mb-3 rounded-xl object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="font-display text-xl text-niebla font-bold mb-1">{pet.name}</div>
            <div className="font-body text-sm text-niebla/60 mb-3">
              {EVOLUTION_STAGES[(pet.stage || 1) as keyof typeof EVOLUTION_STAGES]?.emoji} {EVOLUTION_STAGES[(pet.stage || 1) as keyof typeof EVOLUTION_STAGES]?.label} · {totalPoints} pts
            </div>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Vitalidad', value: stats.vitalidad, color: 'text-hoja' },
                { label: 'Energía', value: stats.energia, color: 'text-sol' },
                { label: 'Nutrición', value: stats.nutricion, color: 'text-accent' },
              ].map((s) => (
                <div key={s.label} className="p-2 rounded-xl bg-white/5">
                  <div className={`font-display text-lg font-bold ${s.color}`}>{s.value}</div>
                  <div className="font-body text-xs text-niebla/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Email opcional */}
          <div>
            <label className="font-body text-xs text-niebla/60 block mb-1.5">
              Email (opcional, para notificaciones)
            </label>
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15
                         text-niebla font-body text-sm focus:border-sol/50 focus:outline-none
                         focus:bg-white/8 transition-all"
            />
          </div>

          {/* URL pública */}
          <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <p className="font-body text-xs text-niebla/50 mb-1">🔗 Tu URL pública será:</p>
            <p className="font-body text-xs text-sol break-all">{window.location.origin}/regenmon/[id-generado]</p>
          </div>

          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className="w-full py-3.5 rounded-xl bg-sol text-noche font-display font-bold
                       hover:scale-102 active:scale-98 disabled:opacity-50 transition-all"
          >
            {isRegistering ? '🔄 Conectando al HUB...' : '🌐 Unirse al HUB'}
          </button>
        </div>
      )}

      {/* VISTA: DASHBOARD */}
      {view === 'dashboard' && hubId && (
        <div className="space-y-4">
          {/* Badge HUB MEMBER */}
          <div className="flex items-center justify-between p-4 rounded-2xl
                          bg-gradient-to-r from-musgo/30 to-hoja/20
                          border border-hoja/30">
            <div className="flex items-center gap-3">
              <img
                src={getSpriteUrl(ANIMAL_EMOJIS[pet.animal as keyof typeof ANIMAL_EMOJIS] || '🌿')}
                alt=""
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <div className="font-display text-sm text-niebla font-bold">{pet.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-body font-bold
                                 bg-hoja/30 text-hoja border border-hoja/40">
                    🌐 HUB MEMBER
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={copyPublicUrl}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/15 transition-all"
              title="Copiar URL pública"
            >
              <Copy size={16} className="text-niebla/70" />
            </button>
          </div>

          {/* URL pública visible */}
          <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
            <p className="font-body text-xs text-niebla/40 mb-0.5">🔗 Tu perfil público:</p>
            <p className="font-body text-xs text-sol break-all">{window.location.origin}/regenmon/{hubId}</p>
          </div>

          {/* Navegación rápida */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleNavigate('/leaderboard')}
              className="py-3 rounded-xl bg-white/5 border border-white/10
                         hover:bg-white/10 transition-all text-center"
            >
              <div className="text-2xl mb-1">🏆</div>
              <div className="font-body text-xs text-niebla/70">Leaderboard</div>
            </button>
            <button
              onClick={() => handleNavigate(`/regenmon/${hubId}`)}
              className="py-3 rounded-xl bg-white/5 border border-white/10
                         hover:bg-white/10 transition-all text-center"
            >
              <div className="text-2xl mb-1">👤</div>
              <div className="font-body text-xs text-niebla/70">Mi Perfil</div>
            </button>
          </div>

          {/* Resumen */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="font-display text-sm text-niebla font-bold mb-3">📊 Mi resumen social</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Balance $FRUTA', value: frutas, icon: '🍊' },
                { label: 'Puntos totales', value: totalPoints, icon: '⭐' },
                { label: 'Etapa actual', value: `${EVOLUTION_STAGES[(pet.stage || 1) as keyof typeof EVOLUTION_STAGES]?.emoji} ${EVOLUTION_STAGES[(pet.stage || 1) as keyof typeof EVOLUTION_STAGES]?.label}`, icon: '🌱' },
                { label: 'Visitas', value: '0', icon: '👁️' },
              ].map((item) => (
                <div key={item.label} className="text-center p-3 rounded-xl bg-white/5">
                  <div className="text-xl mb-1">{item.icon}</div>
                  <div className="font-display text-base text-niebla font-bold truncate">{item.value}</div>
                  <div className="font-body text-xs text-niebla/50 truncate">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Notificación */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="font-body text-sm text-niebla/70 mb-2">🔗 Comparte tu perfil para recibir visitas y regalos</p>
            <button
              onClick={copyPublicUrl}
              className="w-full px-4 py-2 rounded-lg bg-sol/20 text-sol font-body text-xs font-bold
                         hover:bg-sol/30 transition-all"
            >
              Copiar enlace
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
