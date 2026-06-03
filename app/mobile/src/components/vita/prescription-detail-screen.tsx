import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { DEFAULT_PRESCRIPTION, PRESCRIPTION_BENEFITS } from '@/constants/prescription';

const TEXT = '#D8F3DC';
const GREEN = '#52B788';
const GOLD = '#D4AF37';

export function PrescriptionDetailScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24;
  const rx = DEFAULT_PRESCRIPTION;

  const handleBook = () => {
    router.push({
      pathname: '/(tabs)/booking',
      params: {
        id: rx.providerId,
        time: rx.bookingTime,
        service: rx.serviceName,
      },
    });
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
          <View style={styles.headerCopy}>
            <Text style={styles.brand}>VITAL-ETHIO AI</Text>
            <Text style={styles.headerTitle}>Prescription Details</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Rx ACTIVE</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).springify()}>
          <LinearGradient
            colors={['rgba(27,67,50,0.7)', 'rgba(13,43,28,0.85)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.rxCard}>
            <View style={styles.rxLabelRow}>
              <View style={styles.rxLabelBadge}>
                <Text style={styles.rxLabelText}>Rx PRESCRIPTION</Text>
              </View>
              <Ionicons name="leaf" size={14} color={GREEN} />
            </View>

            <Text style={styles.rxName}>{rx.name}</Text>

            <View style={styles.reasonBox}>
              <Text style={styles.boxEyebrow}>Reason</Text>
              <Text style={styles.reasonBody}>{rx.reason}</Text>
            </View>

            <View style={styles.actionBox}>
              <Text style={styles.boxEyebrow}>Recommended Action</Text>
              <Text style={styles.actionText}>{rx.recommendedAction}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInLeft.delay(280)} style={styles.benefitsCard}>
          <Text style={styles.sectionTitle}>Expected Benefits</Text>
          {PRESCRIPTION_BENEFITS.map((benefit, index) => (
            <Animated.View
              key={benefit}
              entering={FadeInLeft.delay(350 + index * 80)}
              style={[styles.benefitRow, index < PRESCRIPTION_BENEFITS.length - 1 && styles.benefitRowSpaced]}>
              <View style={styles.benefitIcon}>
                <Ionicons name="checkmark" size={14} color={GREEN} />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </Animated.View>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.providerCard}>
          <Text style={styles.providerHeading}>Provider</Text>
          <View style={styles.providerRow}>
            <LinearGradient colors={['#2D6A4F', '#52B788']} style={styles.providerThumb}>
              <Text style={styles.providerEmoji}>{rx.providerEmoji}</Text>
            </LinearGradient>
            <View style={styles.providerCopy}>
              <View style={styles.providerTitleRow}>
                <Text style={styles.providerName}>{rx.providerName}</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Ionicons key={i} name="star" size={10} color={GOLD} />
                  ))}
                </View>
              </View>
              <View style={styles.providerMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={11} color="rgba(216,243,220,0.4)" />
                  <Text style={styles.metaText}>{rx.appointmentTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={11} color="rgba(216,243,220,0.4)" />
                  <Text style={styles.metaText}>{rx.location}</Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(550)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Book appointment"
            onPress={handleBook}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient colors={['#1B4332', '#52B788']} style={styles.bookButton}>
              <Text style={styles.bookText}>Book Appointment</Text>
              <Ionicons name="chevron-forward" size={17} color={TEXT} />
            </LinearGradient>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
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
  headerCopy: { flex: 1 },
  brand: { color: 'rgba(216,243,220,0.5)', fontSize: 11, letterSpacing: 1 },
  headerTitle: { color: TEXT, fontSize: 16, fontWeight: '800' },
  activeBadge: {
    backgroundColor: 'rgba(82,183,136,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  activeBadgeText: { color: GREEN, fontSize: 11, fontWeight: '700' },
  rxCard: {
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.4)',
    borderRadius: 32,
    padding: 22,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8,
  },
  rxLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  rxLabelBadge: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  rxLabelText: { color: GOLD, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  rxName: { color: TEXT, fontSize: 22, fontWeight: '900', marginBottom: 6 },
  reasonBox: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.2)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  boxEyebrow: {
    color: 'rgba(216,243,220,0.55)',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  reasonBody: { color: TEXT, fontSize: 13, lineHeight: 21 },
  actionBox: {
    backgroundColor: 'rgba(82,183,136,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.2)',
    borderRadius: 16,
    padding: 12,
    paddingHorizontal: 16,
  },
  actionText: { color: GREEN, fontSize: 15, fontWeight: '800' },
  benefitsCard: {
    backgroundColor: 'rgba(82,183,136,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.18)',
    borderRadius: 28,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionTitle: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  benefitRowSpaced: { marginBottom: 12 },
  benefitIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: 'rgba(82,183,136,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: { color: TEXT, fontSize: 14 },
  providerCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 28,
    padding: 18,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  providerHeading: {
    color: 'rgba(216,243,220,0.5)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  providerRow: { flexDirection: 'row', gap: 14 },
  providerThumb: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerEmoji: { fontSize: 24 },
  providerCopy: { flex: 1 },
  providerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  providerName: { color: TEXT, fontSize: 15, fontWeight: '800' },
  starsRow: { flexDirection: 'row', gap: 1 },
  providerMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: 'rgba(216,243,220,0.5)', fontSize: 11 },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 26,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 20,
    elevation: 8,
  },
  bookText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
