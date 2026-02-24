import { Heart, Wind, Leaf } from 'lucide-react';
import { PetData } from '../../types';
import { ParticleType } from './InteractionParticles';

interface ActionConfig {
  id: 'abrazar' | 'explorar' | 'nutrir';
  label: string;
  icon: React.ElementType;
  stat: keyof Pick<PetData, 'vitalidad' | 'energia' | 'nutricion'>;
  color: string;
  particleType: ParticleType;
}

const ACTIONS: ActionConfig[] = [
  { id: 'abrazar', label: 'Abrazar', icon: Heart, stat: 'vitalidad', color: '#7EBF8E', particleType: 'heart' },
  { id: 'explorar', label: 'Explorar', icon: Wind, stat: 'energia', color: '#F2B705', particleType: 'star' },
  { id: 'nutrir', label: 'Nutrir', icon: Leaf, stat: 'nutricion', color: '#E8472A', particleType: 'leaf' },
];

interface ActionButtonsProps {
  pet: PetData;
  onAction: (
    stat: keyof Pick<PetData, 'vitalidad' | 'energia' | 'nutricion'>,
    particleType: ParticleType
  ) => void;
  frutas?: number;
  onFeed?: () => void;
  isProcessing?: boolean;
}

export default function ActionButtons({ pet, onAction, frutas = 0, onFeed, isProcessing = false }: ActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {ACTIONS.map(({ id, label, icon: Icon, stat, color, particleType }) => {
        const statValue = pet[stat];
        const isFull = statValue >= 100;
        const isEmpty = statValue === 0;
        const disabled = isFull || isEmpty || (id === 'nutrir' && frutas < 10);

        return (
          <button
            key={id}
            onClick={() => {
              if (disabled) return;
              if (id === 'nutrir' && onFeed) return onFeed();
              return onAction(stat, particleType);
            }}
            disabled={disabled || isProcessing}
            className="flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-150 relative"
            style={{
              background: 'rgba(245,239,230,0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: `1px solid ${disabled ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)'}`,
              boxShadow: disabled
                ? 'none'
                : `0 4px 20px rgba(26,46,31,0.3), inset 0 1px 0 rgba(255,255,255,0.08)`,
              opacity: disabled ? 0.45 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px) scale(1.03)';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 28px rgba(26,46,31,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px ${color}33`;
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
              (e.currentTarget as HTMLElement).style.boxShadow = disabled
                ? 'none'
                : '0 4px 20px rgba(26,46,31,0.3), inset 0 1px 0 rgba(255,255,255,0.08)';
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.96)';
              }
            }}
            onMouseUp={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.01)';
              }
            }}
          >
            <Icon size={28} style={{ color: disabled ? 'rgba(245,239,230,0.3)' : color }} />
            <span
              className="font-display font-semibold text-sm"
              style={{ color: disabled ? 'rgba(245,239,230,0.3)' : 'rgba(245,239,230,0.9)' }}
            >
              {label}
            </span>
            {isEmpty && (
              <span className="absolute top-1.5 right-2 text-xs">😢</span>
            )}
            {isFull && (
              <span
                className="absolute top-1.5 right-2 text-xs font-body"
                style={{ color: color, opacity: 0.7 }}
              >
                MAX
              </span>
            )}
            {id === 'nutrir' && (
              <span className="text-xs text-sol font-bold mt-2">10 🍊</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
