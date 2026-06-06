import { Redirect, useLocalSearchParams } from 'expo-router';

import { BookingScreen } from '@/components/vita/booking-screen';
import { useProviders } from '@/context/provider-context';
import { PROVIDERS, PROVIDER_SERVICES } from '@/constants/providers';

export default function BookingRoute() {
  const { id, time, service, activityId, packageIdx } = useLocalSearchParams<{
    id?: string;
    time?: string;
    service?: string;
    activityId?: string;
    packageIdx?: string;
  }>();

  const { getProviderById } = useProviders();
  const provider = (id && getProviderById(id)) || PROVIDERS[0];
  const serviceName =
    service && PROVIDER_SERVICES.some((s) => s.name === service)
      ? service
      : PROVIDER_SERVICES[0].name;

  if (!provider && !activityId) {
    return <Redirect href="/(tabs)/discover" />;
  }

  return (
    <BookingScreen
      provider={provider}
      time={time ?? '5:00 PM'}
      serviceName={serviceName}
      activityId={activityId}
      packageIdx={packageIdx}
    />
  );
}
