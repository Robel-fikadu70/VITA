import { Redirect, useLocalSearchParams } from 'expo-router';

import { BookingScreen } from '@/components/vita/booking-screen';
import { getProviderById, PROVIDERS, PROVIDER_SERVICES } from '@/constants/providers';

export default function BookingRoute() {
  const { id, time, service } = useLocalSearchParams<{
    id?: string;
    time?: string;
    service?: string;
  }>();

  const provider = (id && getProviderById(id)) || PROVIDERS[0];
  const serviceName =
    service && PROVIDER_SERVICES.some((s) => s.name === service)
      ? service
      : PROVIDER_SERVICES[0].name;

  if (!provider) {
    return <Redirect href="/(tabs)/discover" />;
  }

  return (
    <BookingScreen
      provider={provider}
      time={time ?? '5:00 PM'}
      serviceName={serviceName}
    />
  );
}
