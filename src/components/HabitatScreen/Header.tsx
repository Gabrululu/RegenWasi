import { Home, RotateCcw } from 'lucide-react';
import { PetData } from '../../types';
import { getAnimal } from '../../utils/animalConfig';

interface HeaderProps {
  pet: PetData;
  onReset: () => void;
}

export default function Header({ pet, onReset }: HeaderProps) {
  const animal = getAnimal(pet.animal);
  const level = Math.floor(pet.totalInteractions / 10) + 1;

  return (
    <header className="w-full flex items-start justify-between px-4 pt-6 pb-2">
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-xl"
          style={{ background: 'rgba(245,239,230,0.1)', backdropFilter: 'blur(8px)' }}
        >
          <Home size={18} className="text-hoja" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{animal.emoji}</span>
            <h1
              className="font-display font-bold text-niebla"
              style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', textShadow: '0 0 20px rgba(126,191,142,0.3)' }}
            >
              {pet.name}
            </h1>
          </div>
          <p className="font-body text-xs text-hoja/70 mt-0.5">
            Nivel {level} · Guardián del Huasi
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="p-2.5 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: 'rgba(245,239,230,0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 4px 12px rgba(26,46,31,0.3)',
        }}
        title="Reiniciar Huasi"
      >
        <RotateCcw size={16} className="text-niebla/60" />
      </button>
    </header>
  );
}
