import { Home } from 'lucide-react';
import { PetData } from '../../types';
import { getAnimal } from '../../utils/animalConfig';

interface HeaderProps {
  pet: PetData;
}

export default function Header({ pet }: HeaderProps) {
  const animal = getAnimal(pet.animal);
  const level = Math.floor(pet.totalInteractions / 10) + 1;

  return (
    <header className="flex items-center gap-3 flex-1 min-w-0">
      <div
        className="p-2 rounded-xl flex-shrink-0"
        style={{ background: 'rgba(245,239,230,0.1)', backdropFilter: 'blur(8px)' }}
      >
        <Home size={18} className="text-hoja" />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-2xl flex-shrink-0">{animal.emoji}</span>
          <h1
            className="font-display font-bold text-niebla truncate"
            style={{ fontSize: 'clamp(1.1rem, 4vw, 1.6rem)', textShadow: '0 0 20px rgba(126,191,142,0.3)' }}
          >
            {pet.name}
          </h1>
        </div>
        <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(126,191,142,0.7)' }}>
          Nivel {level} · Guardián del Huasi
        </p>
      </div>
    </header>
  );
}
