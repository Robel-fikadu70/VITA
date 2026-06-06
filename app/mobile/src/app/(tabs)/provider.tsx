import { Redirect, useLocalSearchParams } from 'expo-router';

import { ProviderDetailScreen } from '@/components/vita/provider-detail-screen';
import { useProviders } from '@/context/provider-context';
import { PROVIDERS } from '@/constants/providers';

export default function ProviderRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { getProviderById } = useProviders();
  const provider = (id && getProviderById(id)) || PROVIDERS[0];

  if (!provider) {
    return <Redirect href="/(tabs)/discover" />;
  }

  return <ProviderDetailScreen provider={provider} />;
}
