import { PetData } from '../types';

const KEY = 'regenhuasi_pet';

export function loadPet(): PetData | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PetData) : null;
  } catch {
    return null;
  }
}

export function savePet(pet: PetData): void {
  localStorage.setItem(KEY, JSON.stringify({ ...pet, lastSaved: new Date().toISOString() }));
}

export function clearPet(): void {
  localStorage.removeItem(KEY);
}

export function applyRetroactiveDegradation(pet: PetData): PetData {
  const lastSaved = new Date(pet.lastSaved).getTime();
  const now = Date.now();
  const secondsElapsed = Math.max(0, Math.floor((now - lastSaved) / 1000));
  const ticks = Math.floor(secondsElapsed / 15);
  const degradation = Math.min(ticks, 50);

  return {
    ...pet,
    vitalidad: Math.max(0, pet.vitalidad - degradation),
    energia: Math.max(0, pet.energia - degradation),
    nutricion: Math.max(0, pet.nutricion - degradation),
  };
}
