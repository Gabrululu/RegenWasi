import { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw } from 'lucide-react';
import Header from './Header';
import Terrarium from './Terrarium';
import StatsPanel from './StatsPanel';
import ActionButtons from './ActionButtons';
import InteractionParticles, { ParticleType } from './InteractionParticles';
import ResetModal from './ResetModal';
import ChatSection from './ChatSection';
import MemoryBadge from './MemoryBadge';
import { PetData, AvatarState, Memories } from '../../types';
import { savePet, clearPet } from '../../utils/storage';
import { loadMemories, saveMemories, clearChat } from '../../utils/chat';
import TabNav from './TabNav';
import TrainingScreen from '../TrainingScreen';

const DEGRADE_INTERVAL_MS = 15000;
const SAVE_DEBOUNCE_MS = 500;

interface HabitatScreenProps {
  initialPet: PetData;
  onReset: () => void;
}

export default function HabitatScreen({ initialPet, onReset }: HabitatScreenProps) {
  const [pet, setPet] = useState<PetData>(initialPet);
  const [avatarState, setAvatarState] = useState<AvatarState>('breathe');
  const [particles, setParticles] = useState<ParticleType>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [memories, setMemories] = useState<Memories>({ facts: [], lastUpdated: new Date().toISOString() });
  const [frutas, setFrutas] = useState<number>(initialPet.frutas ?? 100);
  const [totalFrutasEarned, setTotalFrutasEarned] = useState<number>(initialPet.totalFrutasEarned ?? (initialPet.frutas ?? 100));
  const [totalFrutasSpent, setTotalFrutasSpent] = useState<number>(initialPet.totalFrutasSpent ?? 0);
  const [lastCoinEarnedAt, setLastCoinEarnedAt] = useState<string | null>(initialPet.lastCoinEarnedAt ?? null);
  const [activityLog, setActivityLog] = useState(initialPet.activityLog ?? [] as any[]);
  const [floatingCoins, setFloatingCoins] = useState<{ id: number; amount: number; emoji: string; isPositive: boolean }[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error'; visible: boolean }>({ message: '', type: 'info', visible: false });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'wasi' | 'chat' | 'training'>('wasi');

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const degradeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    setMemories(loadMemories());
  }, []);

  useEffect(() => {
    if (isProcessing) {
      document.body.classList.add('processing');
    } else {
      document.body.classList.remove('processing');
    }
    return () => document.body.classList.remove('processing');
  }, [isProcessing]);

  const debouncedSave = useCallback((updatedPet: PetData) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => savePet(updatedPet), SAVE_DEBOUNCE_MS);
  }, []);

  const startDegradeTimer = useCallback(() => {
    if (degradeTimerRef.current) clearInterval(degradeTimerRef.current);
    degradeTimerRef.current = setInterval(() => {
      setPet((prev) => {
        const next = {
          ...prev,
          vitalidad: Math.max(0, prev.vitalidad - 1),
          energia: Math.max(0, prev.energia - 1),
          nutricion: Math.max(0, prev.nutricion - 1),
        };
        debouncedSave(next);
        return next;
      });
    }, DEGRADE_INTERVAL_MS);
  }, [debouncedSave]);

  const stopDegradeTimer = useCallback(() => {
    if (degradeTimerRef.current) {
      clearInterval(degradeTimerRef.current);
      degradeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    startDegradeTimer();

    function handleVisibility() {
      if (document.hidden) {
        stopDegradeTimer();
      } else {
        startDegradeTimer();
      }
    }

    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopDegradeTimer();
      document.removeEventListener('visibilitychange', handleVisibility);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [startDegradeTimer, stopDegradeTimer]);

  const handleAction = useCallback(
    (
      stat: keyof Pick<PetData, 'vitalidad' | 'energia' | 'nutricion'>,
      particleType: ParticleType
    ) => {
      setPet((prev) => {
        const next = {
          ...prev,
          [stat]: Math.min(100, prev[stat] + 15),
          totalInteractions: prev.totalInteractions + 1,
        };
        debouncedSave(next);
        return next;
      });
      setAvatarState('bounce');
      setParticles(particleType);
    },
    [debouncedSave]
  );

  const handleAvatarAnimEnd = useCallback(() => {
    setAvatarState('breathe');
  }, []);

  const handleParticlesDone = useCallback(() => {
    setParticles(null);
  }, []);

  function handleResetConfirm() {
    stopDegradeTimer();
    clearPet();
    clearChat();
    onReset();
  }

  const showToast = (message: string, type: 'info'|'success'|'error' = 'info', duration = 2000) => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), duration);
  };

  const triggerFloatingCoin = (amount: number, emoji = '🍊') => {
    const id = Date.now();
    const isPositive = amount > 0;
    setFloatingCoins(prev => [...prev, { id, amount, emoji, isPositive }]);
    setTimeout(() => setFloatingCoins(prev => prev.filter(c => c.id !== id)), 1400);
  };

  const addActivityLog = (entry: { type: 'training'|'feed'|'chat_earn'|'other'; coins: number; label: string }) => {
    setActivityLog(prev => {
      const newEntry = { id: Date.now(), ...entry, timestamp: new Date().toISOString() };
      const next = [newEntry, ...prev].slice(0, 10);
      return next;
    });
  };

  // (removed unused wrapper) use addActivityLog directly where needed

  const handlePetUpdate = useCallback(
    (updater: (prev: PetData) => PetData) => {
      setPet((prev) => {
        const next = updater(prev);
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  // Alimentar
  const handleFeed = async () => {
    if (processingRef.current || (frutas < 10) || pet.nutricion >= 100) {
      if (frutas < 10) {
        setAvatarState('shake');
        setTimeout(() => setAvatarState('breathe'), 600);
        showToast('Habla conmigo y gana monedas primero 🍃', 'info', 2000);
      }
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);
    showToast('⏳ Procesando...', 'info', 1000);
    triggerFloatingCoin(-10, '🍊');

    const newFrutas = frutas - 10;
    const newSpent = totalFrutasSpent + 10;
    const newNutricion = Math.min(100, pet.nutricion + 20);
    const newTimestamp = new Date().toISOString();
    const newEntry = { id: Date.now(), type: 'feed' as const, coins: -10, label: 'Nutrido al Guardián', timestamp: newTimestamp };
    const newLog = [newEntry, ...activityLog].slice(0, 10);

    setFrutas(newFrutas);
    setTotalFrutasSpent(newSpent);
    setPet(prev => ({ ...prev, nutricion: newNutricion, totalInteractions: prev.totalInteractions + 1 }));
    setActivityLog(newLog);

    const reactions = [
      "¡Ñam ñam! Gracias por la comida 😋",
      "¡Delicioso! Me siento con más energía 🌿",
      "¡Era lo que necesitaba! ¡Qué rico! ✨"
    ];
    const reaction = reactions[Math.floor(Math.random() * reactions.length)];
    showToast(reaction, 'success', 1500);

    const toSave = { ...pet, frutas: newFrutas, totalFrutasEarned, totalFrutasSpent: newSpent, lastCoinEarnedAt, activityLog: newLog, nutricion: newNutricion } as PetData;
    debouncedSave(toSave);

    await new Promise(r => setTimeout(r, 600));
    setIsProcessing(false);
    processingRef.current = false;
  };

  const handleEarnCoins = (amount: number) => {
    if (amount <= 0) return;
    const newFrutas = frutas + amount;
    const newEarned = totalFrutasEarned + amount;
    const newTimestamp = new Date().toISOString();
    const newEntry = { id: Date.now(), type: 'chat_earn' as const, coins: amount, label: `Conversación con ${pet.name}`, timestamp: newTimestamp };
    const newLog = [newEntry, ...activityLog].slice(0, 10);
    
    setFrutas(newFrutas);
    setTotalFrutasEarned(newEarned);
    setLastCoinEarnedAt(newTimestamp);
    setActivityLog(newLog);
    triggerFloatingCoin(amount, '🍊');
    
    const toSave = { ...pet, frutas: newFrutas, totalFrutasEarned: newEarned, lastCoinEarnedAt: newTimestamp, activityLog: newLog } as PetData;
    debouncedSave(toSave);
  };

  function handleMemoriesUpdate(updated: Memories) {
    setMemories(updated);
    saveMemories(updated);
  }

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <div className="w-full max-w-screen-md mx-auto flex flex-col gap-4 px-4 pb-8">
        <div className="flex items-center gap-3 pt-6 pb-1">
          <Header pet={{ ...pet, frutas, totalFrutasEarned, totalFrutasSpent, lastCoinEarnedAt, activityLog } as PetData} />
          <div className="flex items-center gap-2 flex-shrink-0">
            <MemoryBadge memories={memories} onUpdate={handleMemoriesUpdate} />
            <button
              onClick={() => setShowResetModal(true)}
              className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(245,239,230,0.08)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 4px 12px rgba(26,46,31,0.3)',
              }}
              title="Reiniciar Wasi"
            >
              <RotateCcw size={16} style={{ color: 'rgba(245,239,230,0.6)' }} />
            </button>
          </div>
        </div>

        <div className="nazca-divider mx-4" />

        <TabNav active={activeTab} onChange={(id) => setActiveTab(id as 'wasi'|'chat'|'training')} />

        {activeTab === 'wasi' && (
          <>
            <div className="relative">
              <Terrarium
                pet={pet}
                avatarState={avatarState}
                onAnimationEnd={handleAvatarAnimEnd}
              />
              <InteractionParticles type={particles} onDone={handleParticlesDone} />
            </div>

            <StatsPanel pet={pet} />

            <ActionButtons pet={pet} onAction={handleAction} frutas={frutas} onFeed={handleFeed} isProcessing={isProcessing} />
          </>
        )}

        {activeTab === 'chat' && (
          <ChatSection
            pet={pet}
            memories={memories}
            onPetUpdate={handlePetUpdate}
            onMemoriesUpdate={handleMemoriesUpdate}
            onEarnCoins={handleEarnCoins}
            currentFrutas={frutas}
            totalFrutasEarned={totalFrutasEarned}
          />
        )}

        {activeTab === 'training' && (
          <TrainingScreen
            pet={pet}
            onPetUpdate={(u) => { handlePetUpdate(u); setPet(u); }}
            onShowToast={(m, t) => setToast({ message: m, type: t, visible: true })}
            onTriggerFloatingCoin={(amount, emoji) => triggerFloatingCoin(amount, emoji)}
            onAddActivityLog={(entry) => {
              // use centralized addActivityLog and persist
              addActivityLog(entry as any);
              debouncedSave({ ...pet, activityLog: [ { id: Date.now(), ...entry, timestamp: new Date().toISOString() }, ...activityLog ].slice(0,10) } as PetData);
            }}
          />
        )}

        {/* Floating coins - positioned at header */}
        <div className="fixed top-6 right-4 sm:right-6 z-40 pointer-events-none">
          {floatingCoins.map(coin => (
            <div key={coin.id} className={`animate-floatUp absolute font-bold text-sm ${coin.isPositive ? 'text-hoja' : 'text-accent'}`} style={{ right: '120px', top: 0 }}>
              {coin.isPositive ? '+' : ''}{coin.amount} {coin.emoji}
            </div>
          ))}
        </div>

        {/* Toast */}
        {toast.visible && (
          <div className={`status-toast fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-sm font-bold dm-sans backdrop-blur-md shadow-xl animate-slideUp ${toast.type === 'success' ? 'bg-musgo/90 text-niebla border border-hoja/40' : toast.type === 'error' ? 'bg-accent/90 text-white' : 'bg-white/10 text-niebla border border-white/20'}`}>
            {toast.message}
          </div>
        )}

        {/* Activity history */}
        <div className="activity-section mt-4">
          <button
            onClick={() => setHistoryOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all dm-sans text-sm text-niebla/70"
          >
            <span>📜 Historial de Actividad</span>
            <span className={`transition-transform ${historyOpen ? 'rotate-180' : ''}`}>▾</span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${historyOpen ? 'max-h-80 mt-2' : 'max-h-0'}`}>
            <div className="space-y-1.5 overflow-y-auto max-h-72 pr-1">
              {activityLog.length === 0 ? (
                <p className="text-center text-niebla/40 dm-sans text-xs py-4">Sin actividad aún...</p>
              ) : activityLog.map(entry => (
                <div key={entry.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                  <div className="flex items-center gap-2">
                    <span>{entry.type === 'feed' ? '🍎' : entry.type === 'chat_earn' ? '💬' : '🌿'}</span>
                    <span className="dm-sans text-xs text-niebla/80">{entry.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`dm-sans text-xs font-bold ${entry.coins > 0 ? 'text-hoja' : 'text-accent'}`}>{entry.coins > 0 ? '+' : ''}{entry.coins} 🍊</span>
                    <span className="dm-sans text-xs text-niebla/40">{new Date(entry.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center font-body text-xs mt-2" style={{ color: 'rgba(245,239,230,0.15)' }}>
          RegenWasi · Ecosistema andino-amazónico digital
        </p>
      </div>

      {showResetModal && (
        <ResetModal
          petName={pet.name}
          onConfirm={handleResetConfirm}
          onCancel={() => setShowResetModal(false)}
        />
      )}
    </div>
  );
}
