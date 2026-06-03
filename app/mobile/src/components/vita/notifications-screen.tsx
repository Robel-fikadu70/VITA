import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInLeft } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BOTTOM_NAV_BAR_HEIGHT } from '@/components/vita/bottom-nav';
import { INITIAL_NOTIFICATIONS, type NotificationItem } from '@/constants/notifications';

const TEXT = '#D8F3DC';

type NotificationRowProps = {
  item: NotificationItem;
  index: number;
};

function NotificationRow({ item, index }: NotificationRowProps) {
  return (
    <Animated.View
      entering={FadeInLeft.delay(100 + index * 80).springify()}
      style={[
        styles.card,
        {
          backgroundColor: item.unread ? item.bg : 'rgba(255,255,255,0.03)',
          borderColor: item.unread ? item.border : 'rgba(255,255,255,0.07)',
        },
      ]}>
      {item.unread ? <View style={[styles.unreadDot, { backgroundColor: item.color }]} /> : null}
      <View style={styles.cardRow}>
        <View style={[styles.iconWrap, { backgroundColor: item.bg, borderColor: item.border }]}>
          <Ionicons name={item.icon} size={19} color={item.color} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={[styles.cardTitle, item.unread && styles.cardTitleUnread]}>{item.title}</Text>
          <Text style={styles.cardBody}>{item.body}</Text>
          <Text style={styles.cardTime}>{item.time}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + BOTTOM_NAV_BAR_HEIGHT + 20;
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications],
  );

  const handleClearAll = () => {
    setNotifications([]);
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
          <View style={styles.headerCopy}>
            <Text style={styles.title}>Notifications</Text>
            {unreadCount > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
              </View>
            ) : null}
          </View>
          {notifications.length > 0 ? (
            <Pressable
              onPress={handleClearAll}
              style={({ pressed }) => [styles.clearButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Clear all notifications">
              <Text style={styles.clearText}>Clear all</Text>
            </Pressable>
          ) : null}
        </Animated.View>

        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={40} color="rgba(216,243,220,0.25)" />
            <Text style={styles.emptyText}>You&apos;re all caught up</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {notifications.map((item, index) => (
              <NotificationRow key={item.id} item={item} index={index} />
            ))}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 20, flexGrow: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 22,
    gap: 12,
  },
  headerCopy: { flex: 1 },
  title: { color: TEXT, fontSize: 22, fontWeight: '800', marginBottom: 4 },
  unreadBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.35)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  unreadBadgeText: { color: '#FF6B6B', fontSize: 11, fontWeight: '700' },
  clearButton: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  clearText: { color: 'rgba(216,243,220,0.5)', fontSize: 12 },
  list: { gap: 10 },
  card: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
    paddingHorizontal: 16,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, paddingRight: 16 },
  cardTitle: { color: 'rgba(216,243,220,0.65)', fontSize: 13, fontWeight: '500', marginBottom: 5, lineHeight: 17 },
  cardTitleUnread: { color: TEXT, fontWeight: '700' },
  cardBody: { color: 'rgba(216,243,220,0.55)', fontSize: 12, lineHeight: 20, marginBottom: 6 },
  cardTime: { color: 'rgba(216,243,220,0.3)', fontSize: 11 },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: { color: 'rgba(216,243,220,0.45)', fontSize: 14 },
  pressed: { opacity: 0.85 },
});
