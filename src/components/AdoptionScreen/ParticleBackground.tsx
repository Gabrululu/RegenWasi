import { useMemo } from 'react';

const PARTICLE_COUNT = 20;

interface Particle {
  id: number;
  left: string;
  size: number;
  delay: string;
  duration: string;
  emoji: string;
}

const SPORES = ['·', '°', '•', '∘'];

export default function ParticleBackground() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
      id: i,
      left: `${(i * 5.3 + 3) % 100}%`,
      size: 4 + (i % 4) * 2,
      delay: `${(i * 0.4) % 6}s`,
      duration: `${6 + (i % 5) * 1.5}s`,
      emoji: SPORES[i % SPORES.length],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute bottom-0 font-display"
          style={{
            left: p.left,
            fontSize: `${p.size}px`,
            color: 'rgba(126,191,142,0.6)',
            animationName: 'spore-rise',
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationTimingFunction: 'ease-out',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  );
}
