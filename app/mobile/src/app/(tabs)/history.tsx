import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';

const TEXT = '#D8F3DC';
const GREEN = '#52B788';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24;

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Your wellness reports and past sessions</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open today's daily report"
          onPress={() => router.push('/(tabs)/daily-report')}
          style={({ pressed }) => [styles.reportCard, pressed && styles.pressed]}>
          <View style={styles.reportIcon}>
            <Ionicons name="trending-up" size={22} color={GREEN} />
          </View>
          <View style={styles.reportCopy}>
            <Text style={styles.reportTitle}>Today&apos;s Daily Report</Text>
            <Text style={styles.reportSub}>Recovery score 72 · Analysis complete</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(216,243,220,0.35)" />
        </Pressable>

        <View style={styles.placeholder}>
          <Ionicons name="time-outline" size={40} color="rgba(216,243,220,0.25)" />
          <Text style={styles.placeholderText}>Earlier reports will appear here</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  title: { color: TEXT, fontSize: 28, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: 'rgba(216,243,220,0.55)', fontSize: 14, marginBottom: 24 },
  reportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.25)',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(82,183,136,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportCopy: { flex: 1 },
  reportTitle: { color: TEXT, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  reportSub: { color: 'rgba(216,243,220,0.5)', fontSize: 12 },
  placeholder: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  placeholderText: { color: 'rgba(216,243,220,0.35)', fontSize: 14 },
  pressed: { opacity: 0.9 },
});
