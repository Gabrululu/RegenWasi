import { useState } from 'react';
import ParticleBackground from './ParticleBackground';
import NameInput from './NameInput';
import AnimalSelector from './AnimalSelector';
import WakeButton from './WakeButton';
import { AnimalType, PetData } from '../../types';
import { savePet } from '../../utils/storage';

interface AdoptionScreenProps {
  onAdopt: (pet: PetData) => void;
}

function validateName(name: string): string {
  if (name.length === 0) return '';
  if (name.length < 3) return 'El nombre debe tener al menos 3 caracteres';
  if (name.length > 15) return 'Máximo 15 caracteres';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/.test(name))
    return 'Solo letras, números y espacios';
  return '';
}

export default function AdoptionScreen({ onAdopt }: AdoptionScreenProps) {
  const [name, setName] = useState('');
  const [animal, setAnimal] = useState<AnimalType | null>(null);
  const [nameError, setNameError] = useState('');

  const isNameValid =
    name.length >= 3 &&
    name.length <= 15 &&
    /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s]+$/.test(name);
  const canWake = isNameValid && animal !== null;

  function handleNameChange(v: string) {
    setName(v);
    setNameError(validateName(v));
  }

  function getDisabledReason() {
    if (!isNameValid && !animal) return 'Escribe un nombre y elige tu Guardián';
    if (!isNameValid) return 'Escribe un nombre válido primero';
    if (!animal) return 'Elige tu Guardián Ideal';
    return '';
  }

  function handleWake() {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }
    if (!animal) return;

    const pet: PetData = {
      name: name.trim(),
      animal,
      vitalidad: 80,
      energia: 80,
      nutricion: 80,
      createdAt: new Date().toISOString(),
      lastSaved: new Date().toISOString(),
      totalInteractions: 0,
    };
    savePet(pet);
    onAdopt(pet);
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 z-10">
      <ParticleBackground />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full max-w-screen-md">
        <div className="text-center space-y-2">
          <h1
            className="font-display font-bold text-niebla"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              textShadow: '0 0 40px rgba(126,191,142,0.4)',
              lineHeight: 1.1,
            }}
          >
            RegenWasi
          </h1>
          <p
            className="font-display italic text-hoja"
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)' }}
          >
            Elige al guardián de tu Wasi
          </p>
          <div className="nazca-divider mx-auto mt-4" style={{ width: '120px' }} />
        </div>

        <div className="glass-card p-6 sm:p-8 w-full flex flex-col items-center gap-8">
          <NameInput
            value={name}
            onChange={handleNameChange}
            error={nameError}
          />

          <div className="w-full">
            <p className="text-center font-body text-sm text-niebla/50 mb-4 uppercase tracking-widest">
              Guardianes del Ecosistema
            </p>
            <AnimalSelector selected={animal} onSelect={setAnimal} />
          </div>

          <WakeButton
            disabled={!canWake}
            disabledReason={getDisabledReason()}
            onClick={handleWake}
          />
        </div>

        <p className="font-body text-xs text-niebla/30 text-center max-w-xs">
          Estos guardianes son seres vivos que nos acompañan.
          Si los tratas con amor, tu espacio prosperará.
        </p>
      </div>
    </div>
  );
}
