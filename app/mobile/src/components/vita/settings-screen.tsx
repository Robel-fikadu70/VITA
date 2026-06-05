import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { useToast } from '@/components/vita/toast';
import { logout } from '@/lib/auth-storage';
import { getUserProfile } from '@/lib/onboarding-storage';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.5)';
const GREEN = '#52B788';

const SOURCES = [
  { icon: 'wifi-outline' as const, label: 'Health Connect', color: '#52B788' },
  { icon: 'phone-portrait-outline' as const, label: 'Screen Time API', color: '#74C0FC' },
  { icon: 'moon-outline' as const, label: 'Daily Pulse', color: '#ADB5BD' },
];

const PREFS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub: string;
  color: string;
  route?: string;
}[] = [
  {
    icon: 'shield-outline',
    label: 'Consent',
    sub: 'Manage data access permissions',
    color: '#52B788',
    route: '/(tabs)/consent',
  },
  { icon: 'notifications-outline', label: 'Notification Settings', sub: '3 active alerts', color: '#F4A261' },
  { icon: 'shield-checkmark-outline', label: 'Privacy Settings', sub: 'All data local', color: '#52B788' },
  { icon: 'globe-outline', label: 'Language', sub: 'English (Amharic available)', color: '#74C0FC' },
  { icon: 'card-outline', label: 'Subscription', sub: 'Premium · 450 ETB/mo', color: '#D4AF37' },
];

const STATS = [
  { label: 'Score', value: '68' },
  { label: 'Streak', value: '7 days' },
  { label: 'Points', value: '142' },
];

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 20;
  const [displayName, setDisplayName] = useState('Abel Tesfaye');
  const [displayEmail, setDisplayEmail] = useState('abel.tesfaye@email.com');
  const [avatarLetter, setAvatarLetter] = useState('A');

  useEffect(() => {
    getUserProfile().then((profile) => {
      if (!profile) return;
      if (profile.fullName) {
        setDisplayName(profile.fullName);
        setAvatarLetter(profile.fullName.trim().charAt(0).toUpperCase() || 'A');
      }
      if (profile.email) setDisplayEmail(profile.email);
    });
  }, []);

  return (
    <LinearGradient
      colors={['#071A0F', '#1B4332', '#0A200F']}
      locations={[0, 0.6, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 22, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <Text style={styles.title}>Profile & Settings</Text>
          <Text style={styles.subtitle}>Manage your wellness account</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(100).springify()} style={styles.profileCard}>
          <View style={styles.profileRow}>
            <LinearGradient colors={['#1B4332', '#52B788']} style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            </LinearGradient>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{displayName}</Text>
              <Text style={styles.email}>{displayEmail}</Text>
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumEmoji}>👑</Text>
                <Text style={styles.premiumText}>Premium Member</Text>
              </View>
            </View>
          </View>
          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <View key={stat.label} style={styles.statCell}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Sources</Text>
          <View style={styles.card}>
            {SOURCES.map((source, index) => (
              <View
                key={source.label}
                style={[styles.row, index < SOURCES.length - 1 && styles.rowBorder]}>
                <View style={[styles.iconWrap, { backgroundColor: `${source.color}18`, borderColor: `${source.color}30` }]}>
                  <Ionicons name={source.icon} size={18} color={source.color} />
                </View>
                <Text style={styles.rowLabel}>{source.label}</Text>
                <View style={styles.connectedBadge}>
                  <Ionicons name="checkmark" size={11} color={GREEN} />
                  <Text style={styles.connectedText}>Connected</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            {PREFS.map((pref, index) => (
              <Pressable
                key={pref.label}
                accessibilityRole="button"
                onPress={() => {
                  if (pref.route) {
                    router.push(pref.route as '/(tabs)/consent');
                  } else {
                    showToast(`${pref.label} — coming soon`, 'info');
                  }
                }}
                style={({ pressed }) => [
                  styles.prefRow,
                  index < PREFS.length - 1 && styles.rowBorder,
                  pressed && styles.pressed,
                ]}>
                <View style={[styles.iconWrap, { backgroundColor: `${pref.color}18`, borderColor: `${pref.color}28` }]}>
                  <Ionicons name={pref.icon} size={18} color={pref.color} />
                </View>
                <View style={styles.prefCopy}>
                  <Text style={styles.rowLabel}>{pref.label}</Text>
                  <Text style={styles.prefSub}>{pref.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={15} color="rgba(216,243,220,0.3)" />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(450)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Logout"
            onPress={async () => {
              await logout();
              showToast('Logged out', 'info');
              router.replace('/login');
            }}
            style={({ pressed }) => [styles.logoutButton, pressed && styles.pressed]}>
            <Ionicons name="log-out-outline" size={17} color="#FF6B6B" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
          <Text style={styles.footer}>VITA v1.0 · © 2026 Addis Ababa, Ethiopia</Text>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { marginBottom: 22 },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: TEXT_MUTED, fontSize: 13 },
  profileCard: {
    backgroundColor: 'rgba(27,67,50,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.22)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 18,
  },
  profileRow: { flexDirection: 'row', gap: 16, alignItems: 'center', marginBottom: 16 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '900', color: TEXT },
  profileInfo: { flex: 1 },
  name: { color: TEXT, fontSize: 17, fontWeight: '800', marginBottom: 3 },
  email: { color: TEXT_MUTED, fontSize: 12, marginBottom: 6 },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  premiumEmoji: { fontSize: 11 },
  premiumText: { color: '#D4AF37', fontSize: 11, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10 },
  statCell: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statValue: { color: TEXT, fontSize: 16, fontWeight: '800' },
  statLabel: { color: 'rgba(216,243,220,0.45)', fontSize: 10, marginTop: 2 },
  section: { marginBottom: 18 },
  sectionTitle: {
    color: 'rgba(216,243,220,0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  prefRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, color: TEXT, fontSize: 14, fontWeight: '500' },
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(82,183,136,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.28)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  connectedText: { color: GREEN, fontSize: 11, fontWeight: '700' },
  prefCopy: { flex: 1 },
  prefSub: { color: 'rgba(216,243,220,0.4)', fontSize: 11, marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 22,
    backgroundColor: 'rgba(255,107,107,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.22)',
  },
  logoutText: { color: '#FF6B6B', fontSize: 14, fontWeight: '700' },
  footer: {
    color: 'rgba(216,243,220,0.2)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
  },
  pressed: { opacity: 0.88 },
});
