import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { ACTIVITY_CATEGORIES, MOCK_ACTIVITIES } from '@/lib/mock-activities';

const TEXT = '#D8F3DC';
const TEXT_MUTED = 'rgba(216,243,220,0.55)';
const GREEN = '#52B788';

export function ActivitiesScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredActivities = MOCK_ACTIVITIES.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(search.toLowerCase()) || activity.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || activity.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <LinearGradient colors={['#071A0F', '#1B4332', '#0A200F']} locations={[0, 0.6, 1]} style={styles.root}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 28, paddingBottom: insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 24 }]}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="leaf-outline" size={18} color={GREEN} />
            <Text style={styles.eyebrow}>Wellness Activities</Text>
          </View>
          <Text style={styles.title}>Find Your Balance</Text>
          <Text style={styles.subtitle}>Discover retreats, fitness classes, and therapies tailored to your needs.</Text>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={TEXT_MUTED} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search activities..."
            placeholderTextColor={TEXT_MUTED}
            value={search}
            onChangeText={setSearch}
          />
        </Animated.View>

        {/* Categories */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {ACTIVITY_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={[styles.categoryTab, isActive && styles.categoryTabActive]}>
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Activity List */}
        <View style={styles.list}>
          {filteredActivities.map((activity, index) => (
            <Animated.View key={activity.id} entering={FadeInDown.delay(300 + index * 100).springify()}>
              <Pressable
                onPress={() => router.push({ pathname: '/activity/[id]', params: { id: activity.id } })}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
                
                <LinearGradient colors={activity.gradientColors} style={styles.cardHero}>
                  <Text style={styles.cardEmoji}>{activity.emoji}</Text>
                  <View style={styles.priceBadge}>
                    <Text style={styles.priceText}>From {activity.basePrice}</Text>
                  </View>
                </LinearGradient>
                
                <View style={styles.cardBody}>
                  <Text style={styles.cardCategory}>{activity.category}</Text>
                  <Text style={styles.cardTitle}>{activity.title}</Text>
                  
                  <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={12} color={TEXT_MUTED} />
                      <Text style={styles.metaText}>{activity.duration}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="location-outline" size={12} color={TEXT_MUTED} />
                      <Text style={styles.metaText}>{activity.location}</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
          {filteredActivities.length === 0 && (
            <Text style={styles.emptyText}>No activities found matching your criteria.</Text>
          )}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  header: { marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  eyebrow: { color: GREEN, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '700' },
  title: { color: TEXT, fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: TEXT_MUTED, fontSize: 13, lineHeight: 21 },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: TEXT, fontSize: 15 },
  
  categoryScroll: { gap: 10, paddingBottom: 20 },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(82,183,136,0.15)',
    borderColor: GREEN,
  },
  categoryText: { color: TEXT_MUTED, fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: GREEN },

  list: { gap: 16 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  cardHero: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cardEmoji: { fontSize: 48 },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: { color: TEXT, fontSize: 11, fontWeight: '700' },
  cardBody: { padding: 16 },
  cardCategory: { color: GREEN, fontSize: 10, fontWeight: '700', textTransform: 'uppercase', marginBottom: 4 },
  cardTitle: { color: TEXT, fontSize: 17, fontWeight: '800', marginBottom: 12 },
  cardMeta: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: TEXT_MUTED, fontSize: 11 },

  emptyText: { color: TEXT_MUTED, textAlign: 'center', marginTop: 40, fontSize: 14 },
});
