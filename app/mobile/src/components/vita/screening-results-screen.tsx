import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { getScreeningById } from '@/lib/screening-registry';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

const MEDICAL_DISCLAIMER =
  'This assessment is not a medical diagnosis. Results are educational wellness insights only and should not replace professional medical advice. Please consult a qualified healthcare professional for diagnosis or treatment.';

/* ─────── AI response section parser ─────── */
type ParsedResult = {
  wellnessInsight: string;
  areasToMonitor: string;
  recommendedActions: string;
  suggestedSupport: string;
  raw: string;
};

function parseAiResponse(text: string): ParsedResult {
  const extract = (heading: string, nextHeadings: string[]): string => {
    const pattern = new RegExp(`${heading}[:\\s]*([\\s\\S]*?)(?=${nextHeadings.map(h => h.replace(/[[\]()]/g, '\\$&')).join('|')}|$)`, 'i');
    const match = text.match(pattern);
    return match?.[1]?.trim() ?? '';
  };

  const headings = ['WELLNESS INSIGHT', 'POTENTIAL AREAS TO MONITOR', 'RECOMMENDED ACTIONS', 'SUGGESTED WELLNESS SUPPORT'];
  const insight = extract(headings[0], headings.slice(1));
  const areas = extract(headings[1], headings.slice(2));
  const actions = extract(headings[2], headings.slice(3));
  const support = extract(headings[3], []);

  // Fallback: if parsing fails, show full text in first section
  const hasStructure = insight || areas || actions || support;

  return {
    wellnessInsight: hasStructure ? insight : text,
    areasToMonitor: areas,
    recommendedActions: actions,
    suggestedSupport: support,
    raw: text,
  };
}

/* ─────── Section Card ─────── */
type ResultSectionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  body: string;
  delay: number;
};

function ResultSection({ icon, color, title, body, delay }: ResultSectionProps) {
  if (!body) return null;
  return (
    <Animated.View entering={FadeInUp.delay(delay).springify()} style={styles.section}>
      <View style={[styles.sectionHeader, { borderColor: `${color}25` }]}>
        <View style={[styles.sectionIconWrap, { backgroundColor: `${color}18`, borderColor: `${color}30` }]}>
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      </View>
      <Text style={styles.sectionBody}>{body}</Text>
    </Animated.View>
  );
}

/* ─────── Main Screen ─────── */
export function ScreeningResultsScreen() {
  const insets = useSafeAreaInsets();
  const { screeningId, aiResponse } = useLocalSearchParams<{
    screeningId: string;
    aiResponse: string;
  }>();

  const screening = getScreeningById(screeningId ?? '');
  const parsed = useMemo(() => parseAiResponse(aiResponse ?? ''), [aiResponse]);

  const accentColor = screening?.color ?? GREEN;

  return (
    <LinearGradient
      colors={screening?.gradientColors as [string, string, string] ?? ['#071A0F', '#1B4332', '#0A200F']}
      locations={[0, 0.5, 1]}
      style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 32,
          },
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <Pressable onPress={() => router.push('/(tabs)/screenings')} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={accentColor} />
          <Text style={[styles.backButtonText, { color: accentColor }]}>Screenings</Text>
        </Pressable>

        {/* Hero header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View
              style={[styles.heroIconWrap, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}30` }]}>
              <Ionicons
                name={screening?.icon as keyof typeof Ionicons.glyphMap ?? 'clipboard-outline'}
                size={28}
                color={accentColor}
              />
            </View>
            <View style={styles.heroBadge}>
              <Ionicons name="sparkles" size={11} color={accentColor} />
              <Text style={[styles.heroBadgeText, { color: accentColor }]}>AI Analysis Complete</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>{screening?.title ?? 'Screening'} Results</Text>
          <Text style={styles.heroSubtitle}>
            Based on your responses, here are your personalized wellness insights from Vita AI.
          </Text>
        </Animated.View>

        {/* Result sections */}
        <ResultSection
          icon="search-outline"
          color={accentColor}
          title="Wellness Insight"
          body={parsed.wellnessInsight}
          delay={100}
        />
        <ResultSection
          icon="eye-outline"
          color="#F4A261"
          title="Potential Areas To Monitor"
          body={parsed.areasToMonitor}
          delay={200}
        />
        <ResultSection
          icon="checkmark-circle-outline"
          color="#52B788"
          title="Recommended Actions"
          body={parsed.recommendedActions}
          delay={300}
        />
        <ResultSection
          icon="bulb-outline"
          color="#ADB5BD"
          title="Suggested Wellness Support"
          body={parsed.suggestedSupport}
          delay={400}
        />

        {/* Medical disclaimer */}
        <Animated.View entering={FadeIn.delay(500)} style={styles.disclaimer}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#F4A261" />
            <Text style={styles.disclaimerTitle}>Important Notice</Text>
          </View>
          <Text style={styles.disclaimerText}>{MEDICAL_DISCLAIMER}</Text>
        </Animated.View>

        {/* Action buttons */}
        <Animated.View entering={FadeInUp.delay(550)} style={styles.actions}>
          <Pressable
            onPress={() => router.replace('/(tabs)/screenings')}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.10)']}
              style={styles.secondaryButton}>
              <Ionicons name="clipboard-outline" size={16} color={TEXT} />
              <Text style={styles.secondaryButtonText}>Back to Screenings</Text>
            </LinearGradient>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [pressed && styles.pressed]}>
            <LinearGradient
              colors={['#1B4332', '#52B788']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
              <Ionicons name="chevron-forward" size={16} color={TEXT} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  backButtonText: { fontSize: 13, fontWeight: '600' },

  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  heroIconWrap: {
    width: 54,
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroBadgeText: { fontSize: 11, fontWeight: '700' },
  heroTitle: {
    color: TEXT,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  heroSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
    lineHeight: 19,
  },

  section: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 18,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
  },
  sectionIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionBody: {
    color: 'rgba(216,243,220,0.75)',
    fontSize: 13,
    lineHeight: 22,
  },

  disclaimer: {
    backgroundColor: 'rgba(244,162,97,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(244,162,97,0.25)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  disclaimerTitle: {
    color: '#F4A261',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  disclaimerText: {
    color: 'rgba(244,162,97,0.75)',
    fontSize: 11,
    lineHeight: 19,
  },

  actions: { gap: 10 },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 24,
  },
  primaryButtonText: { color: TEXT, fontSize: 15, fontWeight: '800' },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonText: { color: TEXT_MUTED, fontSize: 14, fontWeight: '600' },
  pressed: { opacity: 0.92, transform: [{ scale: 0.98 }] },
});
