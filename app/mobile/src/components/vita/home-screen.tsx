import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { getUserProfile } from '@/lib/onboarding-storage';
import { apiClient, getActiveUserId } from '@/lib/api-client';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.5)';
const TEXT_SOFT = 'rgba(216,243,220,0.82)';
const GREEN = '#52B788';

const DEFAULT_PROTOCOL = [
  { id: 'walk', icon: 'walk-outline' as const, text: '20-Minute Walk', color: '#52B788' },
  { id: 'water', icon: 'water-outline' as const, text: 'Drink 2 Liters of Water', color: '#74C0FC' },
  { id: 'screen', icon: 'tv-outline' as const, text: 'No Screens After 10 PM', color: '#F4A261' },
];

const getProtocolIconAndColor = (text: string) => {
  const t = text.toLowerCase();
  if (t.includes('walk') || t.includes('stretch') || t.includes('exercise') || t.includes('yoga') || t.includes('movement')) {
    return { icon: 'walk-outline' as const, color: '#52B788' };
  }
  if (t.includes('water') || t.includes('drink') || t.includes('hydrate') || t.includes('nutrition') || t.includes('fasting')) {
    return { icon: 'water-outline' as const, color: '#74C0FC' };
  }
  if (t.includes('screen') || t.includes('phone') || t.includes('device') || t.includes('tv') || t.includes('sleep') || t.includes('bed')) {
    return { icon: 'moon-outline' as const, color: '#F4A261' };
  }
  return { icon: 'leaf-outline' as const, color: '#52B788' };
};

const formatPrice = (val: any): string => {
  if (val === undefined || val === null) return '';
  const s = String(val);
  return s.toUpperCase().includes('ETB') ? s : `${s} ETB`;
};

function CheckItem({ item, index, isLast, isChecked, onToggle }: { item: any, index: number, isLast: boolean, isChecked: boolean, onToggle: () => void }) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(isChecked ? 1 : 0);
  const opacity = useSharedValue(isChecked ? 0.6 : 1);

  useEffect(() => {
    checkScale.value = withSpring(isChecked ? 1 : 0, { stiffness: 400, damping: 25 });
    opacity.value = withTiming(isChecked ? 0.6 : 1, { duration: 250 });
  }, [isChecked]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }, { rotate: `${(1 - checkScale.value) * 45}deg` }],
    opacity: checkScale.value,
  }));

  const handlePressIn = () => { scale.value = withSpring(0.97, { stiffness: 500, damping: 30 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { stiffness: 500, damping: 30 }); };

  return (
    <Animated.View
      entering={FadeInLeft.delay(450 + index * 80).duration(300)}
      style={[styles.protocolRow, !isLast && styles.protocolRowGap, animatedStyle]}>
      <View style={[styles.protocolIcon, { backgroundColor: `${item.color}18`, borderColor: `${item.color}30` }]}>
        <Ionicons name={item.icon} size={18} color={item.color} />
      </View>
      <Text style={[styles.protocolText, isChecked && styles.protocolTextChecked]}>
        {item.text}
      </Text>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onToggle}
        style={[styles.checkBox, isChecked && styles.checkBoxChecked]}>
        <Animated.View style={checkAnimatedStyle}>
          <Ionicons name="checkmark" size={14} color={GREEN} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 16;
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [displayName, setDisplayName] = useState('Abel Tesfaye');
  const [avatarLetter, setAvatarLetter] = useState('A');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const userId = await getActiveUserId();
      const data = await apiClient.get<any>(`/wellness/dashboard/${userId}`);
      if (data && !data.message) {
        setReport(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProfile().then((profile) => {
      if (profile?.fullName) {
        setDisplayName(profile.fullName);
        setAvatarLetter(profile.fullName.trim().charAt(0).toUpperCase() || 'A');
      } else if (profile?.username) {
        setDisplayName(profile.username);
        setAvatarLetter(profile.username.charAt(0).toUpperCase());
      }
    });
    fetchDashboard();
  }, [fetchDashboard]);

  const toggleProtocol = useCallback((id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Determine recovery score and concerns
  const score = report?.score ?? 68;
  const concernsText = report?.concerns && report.concerns.length > 0
    ? report.concerns.join(' · ')
    : 'Your sleep quality has dropped over the last 3 days and screen time increased significantly.';

  // Map active recommended booking service
  const hasCTA = !!report?.bookingCTA;
  const cta = report?.bookingCTA || {
    id: 'tulsi-yoga',
    name: 'Tulsi Yoga',
    type: 'Restorative Yoga Session',
    emoji: '🧘',
    price: '500 ETB',
    discount: '425 ETB',
    discountLabel: '15% Wellness Discount',
    rating: '4.9',
    reviews: '218',
    distance: '0.8 km'
  };

  // Map dynamic protocols
  const protocols = report?.homeProtocols && report.homeProtocols.length > 0
    ? report.homeProtocols.map((text: string, i: number) => {
        const { icon, color } = getProtocolIconAndColor(text);
        return { id: `protocol-${i}`, icon, text, color };
      })
    : DEFAULT_PROTOCOL;

  return (
    <LinearGradient
      colors={['#071A0F', '#0D2B1C', '#1B4332', '#0A200F']}
      locations={[0, 0.4, 0.8, 1]}
      style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.headerRow}>
            <View style={styles.avatarRow}>
              <LinearGradient
                colors={['#1B4332', '#52B788']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </LinearGradient>
              <View>
                <Text style={styles.greeting}>Good Afternoon 🌤</Text>
                <Text style={styles.userName}>{displayName}</Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              onPress={() => router.push('/(tabs)/notifications')}
              style={({ pressed }) => [styles.bellButton, pressed && styles.pressed]}>
              <Ionicons name="notifications-outline" size={18} color="rgba(216,243,220,0.7)" />
              <View style={styles.bellDot} />
            </Pressable>
          </Animated.View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open daily wellness report"
            onPress={() => router.push('/(tabs)/daily-report')}>
            <Animated.View entering={FadeIn.delay(120).springify()} style={styles.recoveryCard}>
              <View style={styles.recoveryRow}>
                <View style={styles.recoveryCopy}>
                  <View style={styles.recoveryBadge}>
                    <Text style={styles.recoveryBadgeIcon}>⚠</Text>
                    <Text style={styles.recoveryBadgeText}>
                      {score < 70 ? 'RECOVERY NEEDED' : 'WELLNESS CHECK'}
                    </Text>
                  </View>
                  {loading ? (
                    <ActivityIndicator color={GREEN} style={{ alignSelf: 'flex-start', marginTop: 4 }} />
                  ) : (
                    <Text style={styles.recoveryBody}>{concernsText}</Text>
                  )}
                </View>
                <View style={styles.scoreBlock}>
                  {loading ? (
                    <ActivityIndicator color="#F4A261" />
                  ) : (
                    <Text style={[styles.scoreValue, { color: score < 50 ? '#FF6B6B' : score < 75 ? '#F4A261' : '#52B788' }]}>
                      {score}
                    </Text>
                  )}
                  <Text style={styles.scoreDenom}>/100</Text>
                  <Text style={styles.scoreLabel}>Score</Text>
                </View>
              </View>
            </Animated.View>
          </Pressable>

          <Animated.View entering={FadeInDown.delay(220).springify()} style={styles.heroCard}>
            <Text style={styles.sectionEyebrow}>
              {hasCTA ? 'AI Recommended Booking' : 'Today\'s Recommendation'}
            </Text>
            <View style={styles.providerRow}>
              <LinearGradient
                colors={['#2D6A4F', '#52B788']}
                style={styles.providerAvatar}>
                <Text style={styles.providerEmoji}>{cta.emoji || '🧘'}</Text>
              </LinearGradient>
              <View style={styles.providerInfo}>
                <View style={styles.providerTitleRow}>
                  <Text style={styles.providerName}>{cta.name}</Text>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons key={i} name="star" size={10} color="#D4AF37" />
                    ))}
                  </View>
                </View>
                <Text style={styles.sessionName}>
                  {cta.type || cta.sessionName || `${cta.category || 'Wellness'} Session`}
                </Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={11} color={TEXT_MUTED} />
                    <Text style={styles.metaText}>Today 5:00 PM</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={11} color={TEXT_MUTED} />
                    <Text style={styles.metaText}>{cta.distance || '0.8 km'} away</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountEmoji}>🏷</Text>
                <Text style={styles.discountText}>
                  {cta.discountLabel || '15% Wellness Discount'}
                </Text>
              </View>
              <View style={styles.priceBlock}>
                {cta.price && (
                  <Text style={styles.priceOld}>
                    {formatPrice(cta.price)}
                  </Text>
                )}
                <Text style={styles.priceNew}>
                  {formatPrice(cta.discount || cta.price)}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Book Now"
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/provider',
                  params: { id: cta.id },
                })
              }
              style={({ pressed }) => [pressed && styles.pressed]}>
              <LinearGradient
                colors={['#1B4332', '#2D6A4F', '#52B788']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
                <Ionicons name="arrow-forward" size={17} color={TEXT} />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(350).springify()} style={styles.protocolCard}>
            <Text style={styles.protocolEyebrow}>Or Try At Home Tonight</Text>
            {loading ? (
              <ActivityIndicator color={GREEN} style={{ marginVertical: 12 }} />
            ) : (
              protocols.map((item: any, index: number) => (
                <CheckItem
                  key={item.id}
                  item={item}
                  index={index}
                  isLast={index === protocols.length - 1}
                  isChecked={!!checked[item.id]}
                  onToggle={() => toggleProtocol(item.id)}
                />
              ))
            )}
          </Animated.View>

          <Animated.View entering={FadeIn.delay(550)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="View Full Prescription"
              onPress={() => router.push('/(tabs)/rx-details')}
              style={({ pressed }) => [styles.rxButton, pressed && styles.pressed]}>
              <Text style={styles.rxButtonText}>View Full Prescription</Text>
              <Ionicons name="chevron-forward" size={16} color={GREEN} />
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: TEXT },
  greeting: { color: TEXT_MUTED, fontSize: 12 },
  userName: { color: TEXT, fontSize: 16, fontWeight: '800' },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    borderWidth: 2,
    borderColor: '#0D2B1C',
  },
  recoveryCard: {
    backgroundColor: 'rgba(244,162,97,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.3)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  recoveryRow: { flexDirection: 'row', gap: 12 },
  recoveryCopy: { flex: 1 },
  recoveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.35)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  recoveryBadgeIcon: { fontSize: 10 },
  recoveryBadgeText: { color: '#FF6B6B', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  recoveryBody: { color: TEXT_SOFT, fontSize: 13, lineHeight: 22 },
  scoreBlock: { alignItems: 'center' },
  scoreValue: { color: '#F4A261', fontSize: 28, fontWeight: '900', lineHeight: 28 },
  scoreDenom: { color: 'rgba(216,243,220,0.4)', fontSize: 10 },
  scoreLabel: { color: 'rgba(216,243,220,0.4)', fontSize: 9, marginTop: 2 },
  heroCard: {
    backgroundColor: 'rgba(27,67,50,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.25)',
    borderRadius: 32,
    padding: 22,
    marginBottom: 16,
  },
  sectionEyebrow: {
    color: TEXT_MUTED,
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 14,
  },
  providerRow: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  providerAvatar: {
    width: 68,
    height: 68,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerEmoji: { fontSize: 30 },
  providerInfo: { flex: 1 },
  providerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  providerName: { color: TEXT, fontSize: 17, fontWeight: '800' },
  stars: { flexDirection: 'row', gap: 1 },
  sessionName: { color: GREEN, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: TEXT_MUTED, fontSize: 11 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  discountEmoji: { fontSize: 13 },
  discountText: { color: '#D4AF37', fontSize: 12, fontWeight: '700' },
  priceBlock: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
  priceOld: {
    color: 'rgba(216,243,220,0.35)',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  priceNew: { color: TEXT, fontSize: 16, fontWeight: '800', marginLeft: 6 },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 22,
  },
  bookButtonText: { color: TEXT, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  protocolCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 28,
    padding: 18,
    marginBottom: 16,
  },
  protocolEyebrow: {
    color: 'rgba(216,243,220,0.55)',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 14,
  },
  protocolRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  protocolRowGap: { marginBottom: 14 },
  protocolIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  protocolText: { flex: 1, color: TEXT, fontSize: 14, fontWeight: '600' },
  protocolTextChecked: { textDecorationLine: 'line-through', color: TEXT_MUTED },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(82,183,136,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxChecked: { backgroundColor: 'rgba(82,183,136,0.15)', borderColor: GREEN },
  rxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.25)',
    backgroundColor: 'rgba(82,183,136,0.06)',
    marginBottom: 8,
  },
  rxButtonText: { color: GREEN, fontSize: 14, fontWeight: '700', letterSpacing: 0.3 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
