import { useState, useEffect } from 'react';
import AdoptionScreen from './components/AdoptionScreen';
import HabitatScreen from './components/HabitatScreen';
import { PetData } from './types';
import { loadPet, applyRetroactiveDegradation, setCurrentUserId, migrateGuestToUser } from './utils/storage';
import { usePrivyAuth } from './hooks/usePrivyAuth';
import LoginScreen from './components/AdoptionScreen/LoginScreen';

const guestUserId = '__guest__';

export default function App() {
  const { ready, authenticated, user } = usePrivyAuth();
  const [pet, setPet] = useState<PetData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [guestMode, setGuestMode] = useState(false);
  const [lastUserId, setLastUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;

    const userId = authenticated ? user?.id : guestMode ? guestUserId : null;

    // Detectar cambio de usuario (ej: logout, login diferente)
    if (lastUserId && lastUserId !== userId) {
      setPet(null);
      setGuestMode(false);
    }
    setLastUserId(userId);

    // set storage context
    setCurrentUserId(userId);

    // if just authenticated, try migration from guest
    if (authenticated && user?.id && guestMode) {
      migrateGuestToUser(user.id);
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
        <div className="ml-3 font-body text-sm text-niebla/70">Conectando con el Huasi...</div>
      </div>
    );
  }

  if (!authenticated && !guestMode) {
    return <LoginScreen onExplore={() => setGuestMode(true)} />;
  }

  return (
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
  );
}
