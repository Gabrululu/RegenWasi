import { usePrivyAuth } from '../../hooks/usePrivyAuth';

interface LoginScreenProps {
  onExplore: () => void;
}

export default function LoginScreen({ onExplore }: LoginScreenProps) {
  const { ready, login } = usePrivyAuth();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-10">
      <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-screen-md">
        <h1 className="font-display" style={{ fontSize: '40px', color: 'var(--niebla)' }}>
          🌿 RegenWasi
        </h1>
        <p className="font-body italic text-sm" style={{ color: 'var(--niebla)', opacity: 0.8 }}>
          Inicia sesión para guardar tu Guardián en el cosmos andino
        </p>

        <div className="glass-card p-6 w-full flex flex-col items-center gap-4">
          {!ready && (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-hoja animate-spin" />
              <span>Conectando con el Wasi...</span>
            </div>
          )}

          <button
            onClick={() => login()}
            className="px-6 py-3 rounded-full font-display font-bold"
            style={{ background: 'var(--sol)', color: 'var(--noche)', transform: 'scale(1)' }}
          >
            🌿 Iniciar Sesión
          </button>

          <button
            onClick={onExplore}
            className="mt-2 text-sm text-niebla/80 underline"
          >
            Explorar sin login →
          </button>

          <p className="text-xs dm-sans" style={{ opacity: 0.6 }}>
            Puedes explorar sin cuenta, pero tus monedas no se guardarán
          </p>
        </div>
      </div>
    </div>
  );
}
