import { Home, LogOut } from 'lucide-react';
import { PetData } from '../../types';
import { getAnimal } from '../../utils/animalConfig';
import { usePrivyAuth } from '../../hooks/usePrivyAuth';

interface HeaderProps {
  pet: PetData;
}

export default function Header({ pet }: HeaderProps) {
  const { authenticated, displayName, login, logout } = usePrivyAuth();
  const animal = getAnimal(pet.animal);
  const level = Math.floor(pet.totalInteractions / 10) + 1;

  return (
    <header className="flex items-center justify-between px-4 py-3 w-full bg-white/5 backdrop-blur-md rounded-2xl mb-4 border border-white/10">
      <div className="flex items-center gap-3 min-w-0">
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
      </div>

      <div className="flex items-center gap-3">
        <div className={`frutas-counter flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-sol/30`}>
          <span className="text-lg">🍊</span>
          <span className="font-bold text-sol fraunces">
            {authenticated ? (pet.frutas ?? 0) : '—'}
          </span>
          <span className="text-xs text-niebla/60 dm-sans">$FRUTA</span>
        </div>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <>
              <span className="text-sm font-medium text-niebla/80">{displayName}</span>
              <button onClick={() => logout?.()} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-niebla/60 hover:text-niebla">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button onClick={() => login?.()} className="text-sm text-sol underline">Iniciar Sesión</button>
          )}
        </div>
      </div>
    </header>
  );
}
