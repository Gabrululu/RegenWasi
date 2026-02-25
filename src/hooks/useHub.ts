/**
 * useHub — Hook central para interactuar con el HUB remoto
 * Consume APIs de https://regenmon-final.vercel.app
 */

import { useHubAuth } from './useHubAuth';

const HUB_BASE = 'https://regenmon-final.vercel.app';

interface HubFetchOptions extends RequestInit {
  method?: string;
  body?: string;
}

export const useHub = () => {
  const { hubId } = useHubAuth();

  // Fetch con retry automático
  const hubFetch = async (url: string, options: HubFetchOptions = {}, retries = 1): Promise<any> => {
    try {
      const res = await fetch(`${HUB_BASE}${url}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (retries > 0) {
        await new Promise((r) => setTimeout(r, 2000));
        return hubFetch(url, options, retries - 1);
      }
      throw err;
    }
  };

  const register = (body: {
    name: string;
    ownerName: string;
    ownerEmail?: string;
    appUrl: string;
    sprite: string;
  }) => hubFetch('/api/register', { method: 'POST', body: JSON.stringify(body) });

  const sync = (body: {
    regenmonId: string;
    stats: { happiness: number; energy: number; hunger: number };
    totalPoints: number;
    trainingHistory: any[];
  }) => hubFetch('/api/sync', { method: 'POST', body: JSON.stringify(body) });

  const getLeaderboard = (page = 1, limit = 10, stage?: string) => {
    let url = `/api/leaderboard?page=${page}&limit=${limit}`;
    if (stage) url += `&stage=${stage}`;
    return hubFetch(url);
  };

  const getProfile = (id: string) => hubFetch(`/api/regenmon/${id}`);

  const feedRegenmon = (targetId: string) =>
    hubFetch(`/api/regenmon/${targetId}/feed`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: hubId }),
    });

  const giftRegenmon = (targetId: string, amount: number) =>
    hubFetch(`/api/regenmon/${targetId}/gift`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: hubId, amount }),
    });

  const getMessages = (targetId: string) => hubFetch(`/api/regenmon/${targetId}/messages?limit=20`);

  const sendMessage = (targetId: string, fromName: string, message: string) =>
    hubFetch(`/api/regenmon/${targetId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ fromRegenmonId: hubId, fromName, message }),
    });

  const getActivity = () => hubFetch(`/api/regenmon/${hubId}/activity?limit=10`);

  return {
    register,
    sync,
    getLeaderboard,
    getProfile,
    feedRegenmon,
    giftRegenmon,
    getMessages,
    sendMessage,
    getActivity,
  };
};
