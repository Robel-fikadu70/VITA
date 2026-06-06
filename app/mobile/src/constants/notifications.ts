import type { Ionicons } from '@expo/vector-icons';

export type NotificationItem = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  border: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'recovery-score',
    icon: 'trending-down',
    color: '#FF6B6B',
    bg: 'rgba(255,107,107,0.12)',
    border: 'rgba(255,107,107,0.25)',
    title: 'Recovery Score Update',
    body: 'Your Recovery Score decreased this week. Check your prescription for next steps.',
    time: '2 min ago',
    unread: true,
  },
  {
    id: 'prescription',
    icon: 'sparkles',
    color: '#52B788',
    bg: 'rgba(82,183,136,0.1)',
    border: 'rgba(82,183,136,0.22)',
    title: 'New Prescription Available',
    body: 'A new wellness prescription is ready based on your latest data analysis.',
    time: '15 min ago',
    unread: true,
  },
  {
    id: 'flash-discount',
    icon: 'pricetag',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.1)',
    border: 'rgba(212,175,55,0.22)',
    title: 'Flash Discount — Tulsi Yoga',
    body: 'Tulsi Yoga launched a 20% flash discount. Valid for the next 3 hours only.',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 'streak',
    icon: 'trophy',
    color: '#F4A261',
    bg: 'rgba(244,162,97,0.1)',
    border: 'rgba(244,162,97,0.22)',
    title: '5-Day Streak Achieved! 🔥',
    body: "Congratulations! You've maintained a 5-day wellness streak. Keep it going!",
    time: '3 hours ago',
    unread: false,
  },
  {
    id: 'weekly-report',
    icon: 'notifications',
    color: '#ADB5BD',
    bg: 'rgba(173,181,189,0.08)',
    border: 'rgba(173,181,189,0.18)',
    title: 'Weekly Wellness Report',
    body: 'Your weekly wellness summary is ready. Recovery Score: 72/100.',
    time: '1 day ago',
    unread: false,
  },
  {
    id: 'sleep-alert',
    icon: 'trending-down',
    color: '#74C0FC',
    bg: 'rgba(116,192,252,0.08)',
    border: 'rgba(116,192,252,0.2)',
    title: 'Sleep Pattern Alert',
    body: 'Your sleep consistency has improved by 12% this week. Great progress!',
    time: '2 days ago',
    unread: false,
  },
];
