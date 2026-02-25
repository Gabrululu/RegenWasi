import { PetData } from '../types';

let CURRENT_USER_ID: string | null = null;

function keyFor(userId?: string | null) {
  if (userId === '__guest__') return 'regenwasi_guest_data';
  if (userId) return `regenwasi_${userId}_data`;
  return 'regenwasi_guest_data';
}

export function setCurrentUserId(id: string | null) {
  CURRENT_USER_ID = id;
}

export function migrateGuestToUser(userId: string) {
  try {
    const guestKey = 'regenwasi_guest_data';
    const guest = localStorage.getItem(guestKey);
    if (!guest) return;
    const destKey = `regenwasi_${userId}_data`;
    if (!localStorage.getItem(destKey)) {
      localStorage.setItem(destKey, guest);
    }
    localStorage.removeItem(guestKey);
  } catch (e) {
    console.error('Migration error', e);
  }
}

export function loadPet(userId?: string | null): PetData | null {
  try {
    const KEY = keyFor(userId ?? CURRENT_USER_ID);
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PetData) : null;
  } catch {
    return null;
  }
}

export function savePet(pet: PetData, userId?: string | null): void {
  try {
    const KEY = keyFor(userId ?? CURRENT_USER_ID);
    localStorage.setItem(KEY, JSON.stringify({ ...pet, lastSaved: new Date().toISOString() }));
  } catch (e) {
    console.error('savePet error', e);
  }
}

export function clearPet(userId?: string | null): void {
  const KEY = keyFor(userId ?? CURRENT_USER_ID);
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
