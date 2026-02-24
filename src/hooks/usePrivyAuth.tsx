import { usePrivy } from '@privy-io/react-auth';

export const usePrivyAuth = () => {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const displayName =
    user?.email?.address || user?.google?.name || user?.google?.email || (user?.id ? `Guardián #${user.id.slice(-4)}` : undefined);

  return { ready, authenticated, user, login, logout, displayName };
};
