export const ACTIVITY_CATEGORIES = ['All', 'Mindfulness', 'Fitness', 'Retreats', 'Therapy'];

export type ActivityPackage = {
  name: string; // e.g., 'Basic', 'Premium', 'VIP'
  price: string;
  description: string;
};

export type Activity = {
  id: string;
  category: string;
  title: string;
  description: string;
  duration: string;
  location: string;
  basePrice: string;
  emoji: string;
  gradientColors: readonly [string, string, string];
  inclusions: string[];
  targetGroup: string;
  schedule: { time: string; event: string }[];
  packages: ActivityPackage[];
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'mindful-kuriftu',
    category: 'Retreats',
    title: 'Mindful Escape at Kuriftu',
    description: 'A luxurious full-day retreat focused on mental clarity and physical relaxation at the scenic Kuriftu Resort.',
    duration: 'Full Day (8 Hours)',
    location: 'Kuriftu Resort, Bishoftu',
    basePrice: '4500 ETB',
    emoji: '🌿',
    gradientColors: ['#1B4332', '#2D6A4F', '#081C15'],
    inclusions: ['Guided Meditation', 'Spa Access', 'Healthy Lunch', 'Yoga Session'],
    targetGroup: 'Individuals seeking stress relief and deep relaxation.',
    schedule: [
      { time: '09:00 AM', event: 'Arrival & Welcome Tea' },
      { time: '10:00 AM', event: 'Morning Flow Yoga' },
      { time: '12:00 PM', event: 'Organic Lunch' },
      { time: '02:00 PM', event: 'Guided Mindfulness Meditation' },
      { time: '04:00 PM', event: 'Spa & Sauna Time' },
    ],
    packages: [
      { name: 'Basic', price: '4500 ETB', description: 'Standard access to the retreat activities.' },
      { name: 'Premium', price: '6000 ETB', description: 'Includes a 60-minute deep tissue massage.' },
      { name: 'VIP', price: '8500 ETB', description: 'Includes private suite, personal guide, and extended spa treatments.' },
    ],
  },
  {
    id: 'sunset-yoga',
    category: 'Mindfulness',
    title: 'Sunset Restorative Yoga',
    description: 'Wind down your day with a gentle restorative yoga sequence designed to improve sleep quality.',
    duration: '90 Minutes',
    location: 'Tulsi Yoga Studio',
    basePrice: '800 ETB',
    emoji: '🧘',
    gradientColors: ['#4A1530', '#C9607A', '#1A0A12'],
    inclusions: ['Yoga Mat Provided', 'Aromatherapy', 'Herbal Tea'],
    targetGroup: 'Beginners and anyone struggling with sleep or anxiety.',
    schedule: [
      { time: '05:45 PM', event: 'Arrival & Setup' },
      { time: '06:00 PM', event: 'Restorative Poses' },
      { time: '07:15 PM', event: 'Closing Meditation & Tea' },
    ],
    packages: [
      { name: 'Standard', price: '800 ETB', description: 'Group session access.' },
      { name: 'Premium', price: '1200 ETB', description: 'Premium mat placement and personal adjustments.' },
    ],
  },
  {
    id: 'high-intensity-bootcamp',
    category: 'Fitness',
    title: 'Urban HIIT Bootcamp',
    description: 'Push your limits with this high-intensity interval training session designed for maximum calorie burn.',
    duration: '60 Minutes',
    location: 'Meskel Square',
    basePrice: '500 ETB',
    emoji: '⚡',
    gradientColors: ['#FF6B6B', '#C92A2A', '#3B0B0B'],
    inclusions: ['Hydration Station', 'Equipment Provided', 'Post-workout Stretch'],
    targetGroup: 'Fitness enthusiasts looking for a challenging workout.',
    schedule: [
      { time: '06:30 AM', event: 'Dynamic Warm-up' },
      { time: '06:45 AM', event: 'HIIT Circuits' },
      { time: '07:20 AM', event: 'Cool Down & Stretch' },
    ],
    packages: [
      { name: 'Drop-in', price: '500 ETB', description: 'Single session access.' },
      { name: 'Monthly Pass', price: '4000 ETB', description: 'Unlimited access for the month.' },
    ],
  },
  {
    id: 'holistic-therapy',
    category: 'Therapy',
    title: 'Holistic Counseling Session',
    description: 'A one-on-one session with a certified therapist focusing on emotional well-being and life balance.',
    duration: '60 Minutes',
    location: 'Vita Wellness Center / Virtual',
    basePrice: '1500 ETB',
    emoji: '💬',
    gradientColors: ['#003E5C', '#0077B6', '#001A29'],
    inclusions: ['Confidential Consultation', 'Actionable Roadmap', 'Follow-up Check-in'],
    targetGroup: 'Individuals dealing with burnout, stress, or seeking personal growth.',
    schedule: [
      { time: 'Flexible', event: 'Scheduled at your convenience' },
    ],
    packages: [
      { name: 'Single Session', price: '1500 ETB', description: 'One 60-minute consultation.' },
      { name: '4-Session Bundle', price: '5000 ETB', description: 'Four 60-minute sessions over a month.' },
    ],
  },
];
