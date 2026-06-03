export const PRESCRIPTION_BENEFITS = [
  'Better Sleep',
  'Reduced Stress',
  'Improved Recovery',
] as const;

export const DEFAULT_PRESCRIPTION = {
  name: 'Cortisol Reset',
  reason:
    'Elevated stress indicators detected. Your cortisol patterns suggest chronic fatigue accumulated over 3+ days.',
  recommendedAction: '60-Minute Restorative Yoga',
  providerId: 'tulsi-yoga',
  providerEmoji: '🧘',
  providerName: 'Tulsi Yoga',
  appointmentTime: 'Today 5:00 PM',
  location: 'Bole, Addis Ababa',
  bookingTime: '5:00 PM',
  serviceName: 'Restorative Yoga',
} as const;
