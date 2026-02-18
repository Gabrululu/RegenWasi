import { useMemo, useEffect, useState } from 'react';
import { PetData, AvatarState } from '../../types';
import { getAnimal } from '../../utils/animalConfig';

interface TerrariumProps {
  pet: PetData;
  avatarState: AvatarState;
  onAnimationEnd: () => void;
}

const AMBIENT_COUNTS = 8;

interface AmbientParticle {
  id: number;
  left: string;
  bottom: string;
  delay: string;
  duration: string;
}

export default function Terrarium({ pet, avatarState, onAnimationEnd }: TerrariumProps) {
  const animal = getAnimal(pet.animal);
  const isSad = pet.vitalidad === 0 || pet.energia === 0 || pet.nutricion === 0;

  const ambientParticles = useMemo<AmbientParticle[]>(() => {
    return Array.from({ length: AMBIENT_COUNTS }, (_, i) => ({
      id: i,
      left: `${8 + i * 11}%`,
      bottom: `${5 + (i % 3) * 8}%`,
      delay: `${(i * 0.7) % 4}s`,
      duration: `${3.5 + (i % 4) * 0.8}s`,
    }));
  }, []);

  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (avatarState !== 'breathe') {
      setAnimKey((k) => k + 1);
    }
  }, [avatarState]);

  function getAvatarAnimClass() {
    if (isSad) return 'animate-shake-pet';
    if (avatarState === 'bounce') return 'animate-bounce-pet';
    if (avatarState === 'pop') return 'animate-pop-action';
    return 'animate-breathe';
  }

  const mountainSvg = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 400 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <polygon
        points="0,100 80,30 140,65 200,15 260,55 320,25 400,70 400,100"
        fill={animal.terrarium.mountainColor}
        fillOpacity="0.7"
      />
      <polygon
        points="0,100 60,55 100,70 160,40 220,65 280,45 340,60 400,45 400,100"
        fill={animal.terrarium.mountainColor}
        fillOpacity="0.4"
      />
    </svg>
  );

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden"
      style={{
        minHeight: '240px',
        background: animal.terrarium.gradient,
        boxShadow: `inset 0 0 40px rgba(0,0,0,0.2), 0 4px 24px rgba(26,46,31,0.3)`,
      }}
    >
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none opacity-80">
        {mountainSvg}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {ambientParticles.map((p) => (
          <span
            key={p.id}
            className="absolute text-sm select-none"
            style={{
              left: p.left,
              bottom: p.bottom,
              animationName: 'spore-rise',
              animationDuration: p.duration,
              animationDelay: p.delay,
              animationTimingFunction: 'ease-out',
              animationIterationCount: 'infinite',
              animationFillMode: 'both',
              opacity: 0.5,
            }}
          >
            {animal.terrarium.ambientEmoji}
          </span>
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-center py-8">
        <div
          key={`${animKey}-${avatarState}`}
          className={getAvatarAnimClass()}
          style={{
            fontSize: '96px',
            lineHeight: 1,
            filter: isSad ? 'grayscale(60%)' : 'none',
            opacity: isSad ? 0.7 : 1,
            cursor: 'default',
            userSelect: 'none',
            transition: 'filter 0.5s ease, opacity 0.5s ease',
          }}
          onAnimationEnd={() => {
            if (avatarState === 'bounce' || avatarState === 'pop') {
              onAnimationEnd();
            }
          }}
        >
          {animal.emoji}
        </div>
      </div>

      {isSad && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
          <span
            className="glass-card px-3 py-1 text-xs font-body text-accent/90"
            style={{ borderRadius: '1rem' }}
          >
            😢 Necesita cuidado
          </span>
        </div>
      )}
    </div>
  );
}
