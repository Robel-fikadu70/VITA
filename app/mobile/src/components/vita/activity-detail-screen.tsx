import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MOCK_ACTIVITIES } from '@/lib/mock-activities';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

export function ActivityDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const activity = MOCK_ACTIVITIES.find((a) => a.id === id);

  const [selectedPackage, setSelectedPackage] = useState(0);

  if (!activity) {
    return (
      <LinearGradient colors={['#071A0F', '#1B4332']} style={styles.root}>
        <View style={[styles.center, { paddingTop: insets.top + 48 }]}>
          <Text style={styles.notFoundText}>Activity not found</Text>
          <Pressable onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>← Go back</Text>
          </Pressable>
        </View>
      </LinearGradient>
    );
  }

  const pkg = activity.packages[selectedPackage];

  const handleBook = () => {
    router.push(`/booking?activityId=${activity.id}&packageIdx=${selectedPackage}`);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Hero Area */}
        <LinearGradient colors={activity.gradientColors} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={TEXT} />
          </Pressable>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>{activity.emoji}</Text>
            <Text style={styles.heroCategory}>{activity.category}</Text>
            <Text style={styles.heroTitle}>{activity.title}</Text>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Quick Meta */}
          <Animated.View entering={FadeInDown.duration(400)} style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Ionicons name="time-outline" size={16} color={GREEN} />
              <Text style={styles.metaCardText}>{activity.duration}</Text>
            </View>
            <View style={styles.metaCard}>
              <Ionicons name="location-outline" size={16} color={GREEN} />
              <Text style={styles.metaCardText}>{activity.location}</Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{activity.description}</Text>
          </Animated.View>

          {/* Inclusions */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            <View style={styles.tagsContainer}>
              {activity.inclusions.map((item) => (
                <View key={item} style={styles.tag}>
                  <Ionicons name="checkmark-circle" size={14} color={GREEN} />
                  <Text style={styles.tagText}>{item}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Schedule */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <View style={styles.timeline}>
              {activity.schedule.map((item, index) => (
                <View key={index} style={styles.timelineRow}>
                  <View style={styles.timelineDot} />
                  {index !== activity.schedule.length - 1 && <View style={styles.timelineLine} />}
                  <Text style={styles.timelineTime}>{item.time}</Text>
                  <Text style={styles.timelineEvent}>{item.event}</Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Packages */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.section}>
            <Text style={styles.sectionTitle}>Select Package</Text>
            <View style={styles.packagesContainer}>
              {activity.packages.map((p, index) => {
                const isSelected = selectedPackage === index;
                return (
                  <Pressable
                    key={p.name}
                    onPress={() => setSelectedPackage(index)}
                    style={[styles.packageCard, isSelected && styles.packageCardSelected]}>
                    <View style={styles.packageHeader}>
                      <Text style={[styles.packageName, isSelected && styles.packageNameSelected]}>{p.name}</Text>
                      <Text style={[styles.packagePrice, isSelected && styles.packagePriceSelected]}>{p.price}</Text>
                    </View>
                    <Text style={[styles.packageDesc, isSelected && styles.packageDescSelected]}>{p.description}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <Animated.View entering={FadeInUp.delay(500)} style={[styles.footer, { paddingBottom: insets.bottom || 20 }]}>
        <View style={styles.footerPriceCol}>
          <Text style={styles.footerTotalLabel}>Total Price</Text>
          <Text style={styles.footerTotalPrice}>{pkg.price}</Text>
        </View>
        <Pressable onPress={handleBook} style={({ pressed }) => [styles.bookButton, pressed && styles.pressed]}>
          <LinearGradient colors={['#1B4332', '#52B788']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bookGradient}>
            <Text style={styles.bookText}>Book Now</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#071A0F' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: TEXT_MUTED, fontSize: 16, marginBottom: 16 },
  backLink: { padding: 8 },
  backLinkText: { color: GREEN, fontSize: 14 },

  hero: { paddingHorizontal: 20, paddingBottom: 30, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  heroContent: { alignItems: 'center' },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroCategory: { color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  heroTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', textAlign: 'center' },

  body: { paddingHorizontal: 20, paddingTop: 20 },
  
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  metaCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  metaCardText: { color: TEXT, fontSize: 13, fontWeight: '600' },

  section: { marginBottom: 30 },
  sectionTitle: { color: TEXT, fontSize: 18, fontWeight: '800', marginBottom: 12 },
  description: { color: TEXT_MUTED, fontSize: 14, lineHeight: 22 },

  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(82,183,136,0.1)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(82,183,136,0.2)' },
  tagText: { color: GREEN, fontSize: 12, fontWeight: '600' },

  timeline: { paddingLeft: 10 },
  timelineRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, position: 'relative' },
  timelineDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GREEN, marginTop: 4, marginRight: 16, zIndex: 2 },
  timelineLine: { position: 'absolute', left: 4, top: 14, bottom: -16, width: 2, backgroundColor: 'rgba(82,183,136,0.2)', zIndex: 1 },
  timelineTime: { color: GREEN, fontSize: 13, fontWeight: '700', width: 80, marginTop: 1 },
  timelineEvent: { flex: 1, color: TEXT, fontSize: 14, marginTop: 1 },

  packagesContainer: { gap: 12 },
  packageCard: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 16 },
  packageCardSelected: { backgroundColor: 'rgba(82,183,136,0.1)', borderColor: GREEN },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  packageName: { color: TEXT, fontSize: 16, fontWeight: '700' },
  packageNameSelected: { color: GREEN },
  packagePrice: { color: TEXT, fontSize: 16, fontWeight: '800' },
  packagePriceSelected: { color: GREEN },
  packageDesc: { color: TEXT_MUTED, fontSize: 13, lineHeight: 18 },
  packageDescSelected: { color: 'rgba(216,243,220,0.8)' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(7,26,15,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16 },
  footerPriceCol: { flex: 1 },
  footerTotalLabel: { color: TEXT_MUTED, fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  footerTotalPrice: { color: TEXT, fontSize: 22, fontWeight: '900' },
  bookButton: { width: 140 },
  bookGradient: { paddingVertical: 14, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bookText: { color: '#071A0F', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
