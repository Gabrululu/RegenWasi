import { useState, useEffect } from 'react';
import AdoptionScreen from './components/AdoptionScreen';
import HabitatScreen from './components/HabitatScreen';
import { PetData } from './types';
import { loadPet, applyRetroactiveDegradation } from './utils/storage';

export default function App() {
  const [pet, setPet] = useState<PetData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = loadPet();
    if (saved) {
      const degraded = applyRetroactiveDegradation(saved);
      setPet(degraded);
    }
    setLoaded(true);
  }, []);

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="font-display text-hoja text-2xl animate-breathe">🌿</span>
      </div>
    );
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
