import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { PROVIDERS, type Provider } from '@/constants/providers';

type ProviderContextValue = {
  providers: Provider[];
  setProviders: (providers: Provider[]) => void;
  getProviderById: (id: string) => Provider | undefined;
};

const ProviderContext = createContext<ProviderContextValue | null>(null);

export function ProviderProvider({ children }: { children: ReactNode }) {
  const [dynamicProviders, setDynamicProviders] = useState<Provider[]>([]);

  // Combined list: dynamic (backend) first, then static fallbacks
  const allProviders = useMemo(() => {
    const combined = [...dynamicProviders];
    // Add static ones if they don't exist in dynamic list (by name or id)
    PROVIDERS.forEach(staticP => {
      if (!combined.some(p => p.id === staticP.id || p.name === staticP.name)) {
        combined.push(staticP);
      }
    });
    return combined;
  }, [dynamicProviders]);

  const getProviderById = useCallback((id: string) => {
    return allProviders.find(p => p.id === id);
  }, [allProviders]);

  const value = useMemo(
    () => ({
      providers: allProviders,
      setProviders: setDynamicProviders,
      getProviderById,
    }),
    [allProviders, getProviderById],
  );

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}

export function useProviders() {
  const ctx = useContext(ProviderContext);
  if (!ctx) {
    throw new Error('useProviders must be used within ProviderProvider');
  }
  return ctx;
}
