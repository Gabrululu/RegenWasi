import { useEffect, useRef } from 'react';
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
  const frutas = pet.frutas ?? 0;

  const coinRef = useRef<HTMLSpanElement>(null);
  const prevFrutasRef = useRef(frutas);

  useEffect(() => {
    if (prevFrutasRef.current !== frutas && coinRef.current) {
      coinRef.current.classList.remove('coin-updated');
      void coinRef.current.offsetWidth;
      coinRef.current.classList.add('coin-updated');
    }
    prevFrutasRef.current = frutas;
  }, [frutas]);

  return (
    <header className="flex items-center justify-between px-4 py-3 w-full backdrop-blur-md rounded-2xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
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
              style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', textShadow: '0 0 20px rgba(126,191,142,0.3)' }}
            >
              {pet.name}
            </h1>
          </div>
          <p className="font-body text-xs mt-0.5" style={{ color: 'rgba(126,191,142,0.7)' }}>
            Nivel {level} · Guardián del Wasi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(242,183,5,0.3)' }}>
          <span className="text-base leading-none">🍊</span>
          <span ref={coinRef} className="font-bold font-display" style={{ color: '#F2B705', fontSize: '0.95rem' }}>
            {authenticated ? frutas : '—'}
          </span>
          <span className="font-body text-xs" style={{ color: 'rgba(245,239,230,0.5)' }}>$FRUTA</span>
        </div>

        <div className="flex items-center gap-2">
          {authenticated ? (
            <>
              <span className="font-body text-xs hidden sm:inline" style={{ color: 'rgba(245,239,230,0.7)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayName}
              </span>
              <button
                onClick={() => logout?.()}
                className="p-2 rounded-xl transition-all hover:scale-105 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,239,230,0.6)' }}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={() => login?.()}
              className="font-body text-sm underline"
              style={{ color: '#F2B705' }}
            >
              Iniciar Sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
