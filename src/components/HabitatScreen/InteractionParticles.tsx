import { useEffect, useState } from 'react';

export type ParticleType = 'heart' | 'star' | 'leaf' | null;

interface Particle {
  id: number;
  tx: number;
  ty: number;
  emoji: string;
  angle: number;
}

interface InteractionParticlesProps {
  type: ParticleType;
  onDone: () => void;
}

const PARTICLE_EMOJIS: Record<NonNullable<ParticleType>, string[]> = {
  heart: ['💚', '💚', '💛', '🌿'],
  star: ['✨', '⭐', '💫', '✨'],
  leaf: ['🍃', '🌿', '🍀', '🍃'],
};

export default function InteractionParticles({ type, onDone }: InteractionParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!type) return;
    const emojis = PARTICLE_EMOJIS[type];
    const count = 10;
    const ps: Particle[] = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360;
      const rad = (angle * Math.PI) / 180;
      const dist = 50 + Math.random() * 30;
      return {
        id: i,
        tx: Math.round(Math.cos(rad) * dist),
        ty: Math.round(Math.sin(rad) * dist - 30),
        emoji: emojis[i % emojis.length],
        angle,
      };
    });
    setParticles(ps);

    const timeout = setTimeout(() => {
      setParticles([]);
      onDone();
    }, 850);

    return () => clearTimeout(timeout);
  }, [type]);

  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute text-lg select-none"
          style={{
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`,
            animationName: 'particle-emit',
            animationDuration: '0.8s',
            animationTimingFunction: 'ease-out',
            animationFillMode: 'forwards',
          } as React.CSSProperties}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
