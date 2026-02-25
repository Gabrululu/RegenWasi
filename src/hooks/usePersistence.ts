import { useCallback } from 'react';
import { loadPet as loadFromStorage, savePet as saveToStorage, clearPet as clearStorage, setCurrentUserId } from '../utils/storage';

export const usePersistence = (userId?: string | null) => {
  const KEY = userId ? `regenwasi_${userId}_data` : 'regenwasi_guest_data';

  // ensure storage module knows current user
  setCurrentUserId(userId ?? null);

  const load = useCallback(() => {
    try {
      const raw = loadFromStorage(userId ?? null);
      return raw;
    } catch {
      return null;
    }
  }, [userId]);

  const save = useCallback((data: any) => {
    try {
      // data should be PetData-like
      saveToStorage(data, userId ?? null);
    } catch (e) {
      console.error('usePersistence save error', e);
    }
  }, [userId]);

  const clear = useCallback(() => {
    try {
      clearStorage(userId ?? null);
    } catch (e) {
      console.error('usePersistence clear error', e);
    }
  }, [userId]);

  return { load, save, clear, KEY };
};
