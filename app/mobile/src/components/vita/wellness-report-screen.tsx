import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInLeft, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScoreRing } from '@/components/vita/score-ring';
import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { apiClient, getActiveUserId } from '@/lib/api-client';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';
const ORANGE = '#F4A261';

const DEFAULT_STRONG = ['Consistent Activity', 'Good Hydration'];
const DEFAULT_IMPROVE = ['Excessive Night Screen Time', 'Inconsistent Sleep'];

type WellnessReportScreenProps = {
  score?: number;
  showBackButton?: boolean;
};

export function WellnessReportScreen({ score: initialScore = 72, showBackButton = false }: WellnessReportScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 28;
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const userId = await getActiveUserId();
        const data = await apiClient.get<any>(`/wellness/dashboard/${userId}`);
        if (data && !data.message) {
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to fetch wellness report:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  const handleViewPrescription = () => {
    router.push('/(tabs)/rx-details');
  };

  const activeScore = report?.score ?? initialScore;

  // Dynamic content based on score
  const isOptimal = activeScore >= 80;
  const isModerate = activeScore >= 60 && activeScore < 80;
  
  const attentionLabel = isOptimal ? '✦ Optimal Recovery' : isModerate ? '⚠ Needs Attention' : '⚠ High Stress Alert';
  const attentionColor = isOptimal ? GREEN : ORANGE;
  const recoveryText = isOptimal
    ? 'Your score is within the optimal zone. Energy reserves are high.'
    : isModerate
    ? 'Your score is below your personal baseline. Recovery recommended.'
    : 'Significant stress markers detected. Prioritize immediate rest and home protocols.';

  const strongAreas = activeScore >= 70 ? DEFAULT_STRONG : ['Mindful Presence', 'Baseline Activity Sync'];
  const improvementAreas = report?.concerns && report.concerns.length > 0 ? report.concerns : DEFAULT_IMPROVE;

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 28, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}>
        {showBackButton ? (
          <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color={TEXT} />
          </Pressable>
        ) : null}

        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.stepRow}>
            <Ionicons name="trending-up" size={15} color={GREEN} />
            <Text style={styles.stepLabel}>Analysis Complete</Text>
          </View>
          <Text style={styles.title}>Your Wellness Summary</Text>
          <Text style={styles.subtitle}>Based on your data and assessment</Text>
          <Text style={styles.dateLabel}>Daily Report · Today</Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(150).springify()} style={styles.scoreCard}>
          {loading ? (
            <ActivityIndicator size="large" color={GREEN} style={{ padding: 40 }} />
          ) : (
            <>
              <ScoreRing score={activeScore} />
              <View style={styles.scoreCopy}>
                <Text style={styles.scoreEyebrow}>Recovery Score</Text>
                <View style={[styles.attentionBadge, { borderColor: `${attentionColor}35`, backgroundColor: `${attentionColor}18` }]}>
                  <Text style={[styles.attentionText, { color: attentionColor }]}>{attentionLabel}</Text>
                </View>
                <Text style={styles.scoreBody}>
                  {recoveryText}
                </Text>
              </View>
            </>
          )}
        </Animated.View>

        <Animated.View entering={FadeInLeft.delay(300)} style={styles.strongCard}>
          <Text style={styles.strongTitle}>✦ Strong Areas</Text>
          {loading ? (
            <ActivityIndicator color={GREEN} style={{ paddingVertical: 10 }} />
          ) : (
            strongAreas.map((item: string) => (
              <View key={item} style={styles.listRow}>
                <View style={styles.strongIcon}>
                  <Ionicons name="checkmark" size={13} color={GREEN} />
                </View>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))
          )}
        </Animated.View>

        <Animated.View entering={FadeInLeft.delay(420)} style={styles.improveCard}>
          <Text style={styles.improveTitle}>⚠ Improvement Areas</Text>
          {loading ? (
            <ActivityIndicator color={ORANGE} style={{ paddingVertical: 10 }} />
          ) : (
            improvementAreas.map((item: string) => (
              <View key={item} style={styles.listRow}>
                <View style={styles.improveIcon}>
                  <Ionicons name="warning-outline" size={13} color={ORANGE} />
                </View>
                <Text style={styles.listText}>{item}</Text>
              </View>
            ))
          )}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(600)}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="View Today's Prescription"
            onPress={handleViewPrescription}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient colors={['#1B4332', '#52B788']} style={styles.ctaButton}>
              <Text style={styles.ctaText}>View Today&apos;s Prescription</Text>
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  header: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  stepLabel: {
    color: GREEN,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: TEXT_MUTED, fontSize: 13 },
  dateLabel: {
    color: 'rgba(216,243,220,0.4)',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 32,
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  scoreCopy: { flex: 1 },
  scoreEyebrow: {
    color: 'rgba(216,243,220,0.5)',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  attentionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(244,162,97,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.35)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: 10,
  },
  attentionText: { color: ORANGE, fontSize: 12, fontWeight: '700' },
  scoreBody: { color: 'rgba(216,243,220,0.65)', fontSize: 12, lineHeight: 20 },
  strongCard: {
    backgroundColor: 'rgba(82,183,136,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.2)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 14,
  },
  strongTitle: {
    color: GREEN,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  improveCard: {
    backgroundColor: 'rgba(244,162,97,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.2)',
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
  },
  improveTitle: {
    color: ORANGE,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 14,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  strongIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(82,183,136,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  improveIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: 'rgba(244,162,97,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listText: { flex: 1, color: TEXT, fontSize: 14, fontWeight: '500' },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    borderRadius: 26,
    shadowColor: '#1B4332',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaText: { color: TEXT, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
