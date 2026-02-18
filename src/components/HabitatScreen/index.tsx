import { useState, useEffect, useCallback, useRef } from 'react';
import Header from './Header';
import Terrarium from './Terrarium';
import StatsPanel from './StatsPanel';
import ActionButtons from './ActionButtons';
import InteractionParticles, { ParticleType } from './InteractionParticles';
import ResetModal from './ResetModal';
import { PetData, AvatarState } from '../../types';
import { savePet, clearPet } from '../../utils/storage';

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

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const degradeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    onReset();
  }

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <div className="w-full max-w-screen-md mx-auto flex flex-col gap-4 px-4 pb-8">
        <Header pet={pet} onReset={() => setShowResetModal(true)} />

        <div className="nazca-divider mx-4" />

        <div className="relative">
          <Terrarium
            pet={pet}
            avatarState={avatarState}
            onAnimationEnd={handleAvatarAnimEnd}
          />
          <InteractionParticles type={particles} onDone={handleParticlesDone} />
        </div>

        <StatsPanel pet={pet} />

        <ActionButtons pet={pet} onAction={handleAction} />

        <p className="text-center font-body text-xs text-niebla/20 mt-2">
          RegenHuasi · Ecosistema andino-amazónico digital
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
