/**
 * useHubAuth — Gestión de autenticación y registro en el HUB
 * Almacena hubId e isRegistered en localStorage con persistent hydration
 */

export const useHubAuth = () => {
  const hubId = typeof window !== 'undefined' ? localStorage.getItem('regenwasi_hub_id') : null;
  const isRegistered = typeof window !== 'undefined' ? localStorage.getItem('regenwasi_hub_registered') === 'true' : false;

  const saveHubRegistration = (id: string) => {
    localStorage.setItem('regenwasi_hub_id', id);
    localStorage.setItem('regenwasi_hub_registered', 'true');
  };

  const clearHubRegistration = () => {
    localStorage.removeItem('regenwasi_hub_id');
    localStorage.removeItem('regenwasi_hub_registered');
  };

  return { hubId, isRegistered, saveHubRegistration, clearHubRegistration };
};
