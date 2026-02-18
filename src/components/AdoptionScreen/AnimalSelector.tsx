import { ANIMALS } from '../../utils/animalConfig';
import { AnimalType } from '../../types';

interface AnimalSelectorProps {
  selected: AnimalType | null;
  onSelect: (id: AnimalType) => void;
}

export default function AnimalSelector({ selected, onSelect }: AnimalSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
      {ANIMALS.map((animal) => {
        const isSelected = selected === animal.id;
        return (
          <button
            key={animal.id}
            onClick={() => onSelect(animal.id)}
            className="relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200 cursor-pointer group"
            style={{
              background: isSelected
                ? `rgba(${hexToRgb(animal.accentColor)}, 0.2)`
                : 'rgba(245,239,230,0.06)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: isSelected
                ? `2px solid ${animal.accentColor}`
                : '2px solid rgba(255,255,255,0.1)',
              boxShadow: isSelected
                ? `0 0 24px ${animal.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`
                : '0 4px 16px rgba(26,46,31,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
              transform: isSelected ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <span
              className="text-5xl select-none animate-float-bob"
              style={{ animationDelay: `${ANIMALS.indexOf(animal) * 0.3}s` }}
            >
              {animal.emoji}
            </span>
            <span className="font-display font-semibold text-niebla text-sm">
              {animal.name}
            </span>
            <span className="font-body text-xs text-niebla/50 text-center leading-tight">
              {animal.description}
            </span>
            {isSelected && (
              <div
                className="absolute top-2 right-2 w-3 h-3 rounded-full"
                style={{ background: animal.accentColor }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
