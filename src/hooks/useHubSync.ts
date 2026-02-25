/**
 * useHubSync — Sincronización periódica con el HUB
 * Se ejecuta cada 5 minutos y al cambiar datos importantes
 */

import { useCallback, useEffect } from 'react';
import { useHubAuth } from './useHubAuth';
import { useHub } from './useHub';

export const useHubSync = ({
  stats,
  totalPoints,
  trainingHistory,
}: {
  stats: { vitalidad: number; energia: number; nutricion: number };
  totalPoints: number;
  trainingHistory: any[];
}) => {
  const { hubId, isRegistered } = useHubAuth();
  const { sync } = useHub();

  const syncToHub = useCallback(
    async (overrideId?: string) => {
      const id = overrideId || hubId;
      if (!id) return;
      try {
        const result = await sync({
          regenmonId: id,
          stats: {
            happiness: stats.vitalidad,
            energy: stats.energia,
            hunger: stats.nutricion,
          },
          totalPoints,
          trainingHistory: trainingHistory?.slice(-5) ?? [],
        });
        // Actualizar balance si cambió
        if (result.data?.balance !== undefined) {
          localStorage.setItem('regenwasi_hub_balance', String(result.data.balance));
        }
      } catch {
        // Silencioso — no interrumpir UX
      }
    },
    [hubId, stats, totalPoints, trainingHistory, sync]
  );

  // Sync periódico cada 5 minutos
  useEffect(() => {
    if (!isRegistered) return;
    syncToHub();
    const interval = setInterval(syncToHub, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isRegistered, syncToHub]);

  return { syncToHub };
};
