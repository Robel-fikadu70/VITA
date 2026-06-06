import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { useToast } from '@/components/vita/toast';
import {
  BOOKING_INCLUDED,
  PROVIDER_SERVICES,
  type Provider,
} from '@/constants/providers';
import { apiClient, getActiveUserId } from '@/lib/api-client';
import { MOCK_ACTIVITIES } from '@/lib/mock-activities';

const TEXT = '#D8F3DC';
const GREEN = '#52B788';

type PaymentMethod = 'telebirr' | 'chapa';

export type BookingScreenProps = {
  provider: Provider;
  time: string;
  serviceName?: string;
  activityId?: string;
  packageIdx?: string;
};

function parseEtb(value: string): number {
  return parseInt(value.replace(/[^\d]/g, ''), 10) || 0;
}

function formatBookingDate(date = new Date()): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function parseDiscountPercent(label: string): number {
  const match = label.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}

function SpinningPhone({ active }: { active: boolean }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (active) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 800, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      rotation.value = 0;
    }
  }, [active, rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={spinStyle}>
      <Ionicons name="phone-portrait-outline" size={18} color={active ? 'rgba(255,255,255,0.5)' : '#ffffff'} />
    </Animated.View>
  );
}

export function BookingScreen({ provider, time, serviceName, activityId, packageIdx }: BookingScreenProps) {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24;
  const [paying, setPaying] = useState<PaymentMethod | null>(null);

  const activity = useMemo(() => MOCK_ACTIVITIES.find(a => a.id === activityId), [activityId]);
  const pkg = activity && packageIdx ? activity.packages[parseInt(packageIdx, 10)] : null;

  const service = useMemo(
    () => PROVIDER_SERVICES.find((s) => s.name === serviceName) ?? PROVIDER_SERVICES[0],
    [serviceName],
  );

  const pricing = useMemo(() => {
    if (activity && pkg) {
      const original = parseEtb(pkg.price);
      // Let's pretend there's a small discount for booking via Vita
      const savings = Math.floor(original * 0.1); 
      const total = original - savings;
      return { original, total, savings, discountPercent: 10 };
    }

    const original = parseEtb(service.price);
    const total = parseEtb(service.discount);
    const discountPercent = parseDiscountPercent(provider.discountLabel);
    const savings = original - total;
    return { original, total, savings, discountPercent };
  }, [provider.discountLabel, service, activity, pkg]);

  const handlePay = (method: PaymentMethod) => {
    if (paying) return;
    setPaying(method);
    const label = method === 'telebirr' ? 'Telebirr' : 'Chapa';
    showToast(`Processing ${label} payment…`, 'info');
    setTimeout(async () => {
      try {
        const userId = await getActiveUserId();
        await apiClient.post('/book', {
          userId,
          serviceId: activity ? activity.id : service.name,
          partnerId: activity ? activity.location : provider.id,
          price: pricing.total,
        });
        setPaying(null);
        showToast('Booking confirmed! Your wellness passport is ready.', 'success');
        router.replace('/(tabs)');
      } catch (err) {
        console.error('Booking creation failed:', err);
        setPaying(null);
        showToast('Payment successful, but server failed to log booking.', 'info');
        router.replace('/(tabs)');
      }
    }, 1800);
  };

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 22, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={18} color="rgba(216,243,220,0.7)" />
          </Pressable>
          <View>
            <Text style={styles.brand}>VITA</Text>
            <Text style={styles.headerTitle}>Booking Screen</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <LinearGradient colors={activity ? activity.gradientColors : ['#1B4332', '#52B788']} style={styles.summaryThumb}>
              <Text style={styles.summaryEmoji}>{activity ? activity.emoji : provider.emoji}</Text>
            </LinearGradient>
            <View style={styles.summaryCopy}>
              <Text style={styles.providerLabel}>{activity ? activity.location : provider.name}</Text>
              <Text style={styles.serviceName}>{activity ? `${activity.title} (${pkg?.name})` : service.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={11} color="rgba(216,243,220,0.4)" />
                  <Text style={styles.metaText}>{formatBookingDate()}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={11} color="rgba(216,243,220,0.4)" />
                  <Text style={styles.metaText}>{time}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.priceBreakdown}>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service price</Text>
              <Text style={styles.priceStrikethrough}>{pricing.original} ETB</Text>
            </View>
            <View style={styles.priceRow}>
              <View style={styles.discountLabelRow}>
                <Text style={styles.discountLabel}>Wellness Discount</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>-{pricing.discountPercent}%</Text>
                </View>
              </View>
              <Text style={styles.savingsText}>-{pricing.savings} ETB</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{pricing.total} ETB</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(250)} style={styles.includedCard}>
          <Text style={styles.includedTitle}>What&apos;s Included</Text>
          {activity ? activity.inclusions.map((item) => (
            <View key={item} style={styles.includedRow}>
              <Ionicons name="checkmark" size={13} color={GREEN} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          )) : BOOKING_INCLUDED.map((item) => (
            <View key={item} style={styles.includedRow}>
              <Ionicons name="checkmark" size={13} color={GREEN} />
              <Text style={styles.includedText}>{item}</Text>
            </View>
          ))}
        </Animated.View>

        <Text style={styles.paymentHeading}>Select Payment Method</Text>

        <Animated.View entering={FadeInUp.delay(350)}>
          <Pressable
            onPress={() => handlePay('telebirr')}
            disabled={paying !== null}
            style={({ pressed }) => [pressed && paying === null && styles.pressed]}>
            <LinearGradient
              colors={paying === 'telebirr' ? ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.08)'] : ['#0066FF', '#0099FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.telebirrButton, paying !== null && paying !== 'telebirr' && styles.buttonDisabled]}>
              {paying === 'telebirr' ? (
                <SpinningPhone active />
              ) : (
                <Ionicons name="phone-portrait-outline" size={18} color="#ffffff" />
              )}
              <Text style={styles.telebirrText}>
                {paying === 'telebirr' ? 'Processing…' : 'Pay with Telebirr'}
              </Text>
            </LinearGradient>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(450)}>
          <Pressable
            onPress={() => handlePay('chapa')}
            disabled={paying !== null}
            style={({ pressed }) => [
              styles.chapaButton,
              paying === 'chapa' && styles.chapaButtonActive,
              paying !== null && paying !== 'chapa' && styles.buttonDisabled,
              pressed && paying === null && styles.pressed,
            ]}>
            {paying === 'chapa' ? (
              <ActivityIndicator size="small" color={TEXT} />
            ) : (
              <Text style={styles.chapaEmoji}>💳</Text>
            )}
            <Text style={styles.chapaText}>{paying === 'chapa' ? 'Processing…' : 'Pay with Chapa'}</Text>
            {paying !== 'chapa' ? (
              <Ionicons name="chevron-forward" size={16} color="rgba(216,243,220,0.5)" />
            ) : null}
          </Pressable>
        </Animated.View>

        <Text style={styles.footerNote}>
          🔒 256-bit encrypted · Powered by Chapa Financial Technologies{'\n'}
          By booking you agree to our cancellation policy.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: 'rgba(216,243,220,0.5)', fontSize: 11, letterSpacing: 1 },
  headerTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 14,
  },
  summaryTop: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  summaryThumb: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryEmoji: { fontSize: 26 },
  summaryCopy: { flex: 1 },
  providerLabel: { color: 'rgba(216,243,220,0.5)', fontSize: 11, marginBottom: 3 },
  serviceName: { color: TEXT, fontSize: 16, fontWeight: '800', marginBottom: 3 },
  metaRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: 'rgba(216,243,220,0.5)', fontSize: 11 },
  priceBreakdown: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceLabel: { color: 'rgba(216,243,220,0.55)', fontSize: 13 },
  priceStrikethrough: {
    color: 'rgba(216,243,220,0.55)',
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  discountLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  discountLabel: { color: GREEN, fontSize: 13 },
  discountBadge: {
    backgroundColor: 'rgba(82,183,136,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.3)',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  discountBadgeText: { color: GREEN, fontSize: 10, fontWeight: '700' },
  savingsText: { color: GREEN, fontSize: 13, fontWeight: '700' },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingTop: 12,
  },
  totalLabel: { color: TEXT, fontSize: 16, fontWeight: '800' },
  totalValue: { color: TEXT, fontSize: 22, fontWeight: '900' },
  includedCard: {
    backgroundColor: 'rgba(82,183,136,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.16)',
    borderRadius: 22,
    padding: 14,
    marginBottom: 22,
  },
  includedTitle: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  includedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  includedText: { color: 'rgba(216,243,220,0.7)', fontSize: 12, flex: 1 },
  paymentHeading: {
    color: 'rgba(216,243,220,0.5)',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 12,
  },
  telebirrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 24,
    marginBottom: 12,
  },
  telebirrText: { color: '#ffffff', fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  chapaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 24,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chapaButtonActive: { backgroundColor: 'rgba(255,255,255,0.05)' },
  chapaEmoji: { fontSize: 18 },
  chapaText: { color: TEXT, fontSize: 15, fontWeight: '700' },
  buttonDisabled: { opacity: 0.55 },
  footerNote: {
    color: 'rgba(216,243,220,0.28)',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 17,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
