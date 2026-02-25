import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import AdoptionScreen from './components/AdoptionScreen';
import HabitatScreen from './components/HabitatScreen';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { PetData } from './types';
import { loadPet, applyRetroactiveDegradation, setCurrentUserId, migrateGuestToUser } from './utils/storage';
import { usePrivyAuth } from './hooks/usePrivyAuth';
import LoginScreen from './components/AdoptionScreen/LoginScreen';

const guestUserId = '__guest__';

const migrateStorageKeys = () => {
  if (localStorage.getItem('regenwasi_migrated') === 'true') return;

  const simpleMigrations = [
    ['regenhuasi_pet', 'regenwasi_pet'],
    ['regenhuasi_chat', 'regenwasi_chat'],
    ['regenhuasi_memories', 'regenwasi_memories'],
  ];

  simpleMigrations.forEach(([oldKey, newKey]) => {
    const value = localStorage.getItem(oldKey);
    if (value) {
      localStorage.setItem(newKey, value);
      localStorage.removeItem(oldKey);
    }
  });

  // Migrar claves con userId
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('regenhuasi_') && !simpleMigrations.some((m) => m[0] === key)) {
      const newKey = key.replace('regenhuasi_', 'regenwasi_');
      const value = localStorage.getItem(key);
      if (value) {
        localStorage.setItem(newKey, value);
        localStorage.removeItem(key);
      }
    }
  });

  localStorage.setItem('regenwasi_migrated', 'true');
};

/**
 * Componente interno de rutas que requiere autenticación
 */
function AppRoutes() {
  const navigate = useNavigate();
  const { ready, authenticated, user } = usePrivyAuth();
  const [pet, setPet] = useState<PetData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  useEffect(() => {
    migrateStorageKeys();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const userId = authenticated ? (user?.id ?? null) : guestMode ? guestUserId : null;

    if (lastUserId && lastUserId !== userId) {
      setPet(null);
      setGuestMode(false);
    }
    setLastUserId(userId);

    setCurrentUserId(userId);

    const uid = user?.id ?? null;
    if (authenticated && uid && guestMode) {
      migrateGuestToUser(uid);
    }

    const saved = loadPet(userId);
    if (saved) {
      const degraded = applyRetroactiveDegradation(saved);
      setPet(degraded);
    }

    setLoaded(true);
  }, [ready, authenticated, user?.id, guestMode, lastUserId]);

  if (!ready || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-display text-hoja text-2xl animate-breathe">🌿</span>
        <div className="ml-3 font-body text-sm text-niebla/70">Conectando con el Wasi...</div>
      </div>
    );
  }

  if (!authenticated && !guestMode) {
    return <LoginScreen onExplore={() => setGuestMode(true)} />;
  }

  return (
    <Routes>
      {/* Leaderboard */}
      <Route path="/leaderboard" element={<LeaderboardPage onBack={() => navigate(-1)} />} />

      {/* Perfil público */}
      <Route path="/regenmon/:id" element={<PublicProfilePageWrapper onBack={() => navigate(-1)} />} />

      {/* Habitat (por defecto) */}
      <Route
        path="*"
        element={
          <div className="relative min-h-screen">
            {pet === null ? (
              <AdoptionScreen onAdopt={(newPet) => setPet(newPet)} />
            ) : (
              <HabitatScreen
                key={pet.createdAt}
                initialPet={pet}
                onReset={() => setPet(null)}
              />
            )}
          </div>
        }
      />
    </Routes>
  );
}

/**
 * Wrapper para PublicProfilePage que obtiene el ID de los params
 */
function PublicProfilePageWrapper({ onBack }: { onBack?: () => void }) {
  const { id } = useParams<{ id: string }>();
  return (
    <PublicProfilePage
      regenmonId={id || ''}
      onBack={onBack}
      showToast={(msg, type) => {
        console.log(`[${type}] ${msg}`);
      }}
    />
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
