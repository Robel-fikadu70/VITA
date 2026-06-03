export type Provider = {
  id: string;
  name: string;
  type: string;
  price: string;
  rating: string;
  reviews: string;
  emoji: string;
  tag: string;
  tagColor: string;
  location: string;
  gradientStart: string;
  gradientEnd: string;
  categories: string[];
  description: string;
  distance: string;
  discountLabel: string;
};

export const DISCOVER_CATEGORIES = [
  'All',
  'Stress Relief',
  'Sleep',
  "Women's",
  'Nutrition',
  'Fitness',
  'Recovery',
  'Mental',
] as const;

export const PROVIDERS: Provider[] = [
  {
    id: 'tulsi-yoga',
    name: 'Tulsi Yoga',
    type: 'Morning Yoga',
    price: '425 ETB',
    rating: '4.9',
    reviews: '218',
    emoji: '🧘',
    tag: 'AI Pick',
    tagColor: '#52B788',
    location: 'Bole',
    gradientStart: '#0D2B1C',
    gradientEnd: '#2D6A4F',
    categories: ['All', 'Stress Relief', 'Recovery', 'Fitness'],
    description:
      'A premier wellness studio specializing in restorative and therapeutic yoga practices. Our certified instructors focus on recovery, stress reduction, and holistic wellbeing.',
    distance: '0.8 km',
    discountLabel: '15% Off',
  },
  {
    id: 'serenity-spa',
    name: 'Serenity Spa',
    type: 'Spa Therapy',
    price: '650 ETB',
    rating: '4.8',
    reviews: '143',
    emoji: '💆',
    tag: 'Popular',
    tagColor: '#ADB5BD',
    location: 'Kazanchis',
    gradientStart: '#1A0A22',
    gradientEnd: '#4A1570',
    categories: ['All', 'Stress Relief', 'Recovery', 'Sleep'],
    description:
      'Luxury spa treatments designed for deep relaxation and muscle recovery after demanding weeks.',
    distance: '1.2 km',
    discountLabel: '10% Off',
  },
  {
    id: 'mindful-space',
    name: 'Mindful Space',
    type: 'Meditation Session',
    price: '200 ETB',
    rating: '4.7',
    reviews: '89',
    emoji: '🧠',
    tag: 'New',
    tagColor: '#74C0FC',
    location: 'Sarbet',
    gradientStart: '#0D1A22',
    gradientEnd: '#1A3A4A',
    categories: ['All', 'Mental', 'Stress Relief', 'Sleep'],
    description:
      'Guided meditation and breathwork sessions to calm the mind and improve focus.',
    distance: '2.1 km',
    discountLabel: '5% Off',
  },
  {
    id: 'nourish-kitchen',
    name: 'Nourish Kitchen',
    type: 'Healthy Meal Program',
    price: '300 ETB',
    rating: '4.6',
    reviews: '312',
    emoji: '🥗',
    tag: 'Flash Deal',
    tagColor: '#D4AF37',
    location: 'Gerji',
    gradientStart: '#1A1500',
    gradientEnd: '#4A3800',
    categories: ['All', 'Nutrition'],
    description:
      'Nutrition-forward meal programs tailored to your wellness goals and recovery needs.',
    distance: '3.4 km',
    discountLabel: '20% Off',
  },
  {
    id: 'alpha-fitness',
    name: 'Alpha Fitness',
    type: 'Fitness Coaching',
    price: '500 ETB',
    rating: '4.8',
    reviews: '176',
    emoji: '💪',
    tag: 'Top Rated',
    tagColor: '#F4A261',
    location: 'CMC',
    gradientStart: '#0D1A0D',
    gradientEnd: '#1A4A1A',
    categories: ['All', 'Fitness', 'Recovery'],
    description:
      'Personal coaching for strength, mobility, and sustainable fitness habits.',
    distance: '4.0 km',
    discountLabel: '12% Off',
  },
  {
    id: 'luna-wellness',
    name: 'Luna Wellness',
    type: "Women's Wellness",
    price: '350 ETB',
    rating: '4.9',
    reviews: '94',
    emoji: '💗',
    tag: 'Specialized',
    tagColor: '#FAD2E1',
    location: 'Bole',
    gradientStart: '#1A0A14',
    gradientEnd: '#4A1A3A',
    categories: ['All', "Women's", 'Recovery', 'Mental'],
    description:
      "Holistic women's wellness programs including hormonal balance support and restorative care.",
    distance: '0.9 km',
    discountLabel: '15% Off',
  },
];

export const PROVIDER_SERVICES = [
  { name: 'Restorative Yoga', duration: '60 min', price: '500 ETB', discount: '425 ETB' },
  { name: 'Morning Flow', duration: '45 min', price: '400 ETB', discount: '340 ETB' },
  { name: 'Yin Yoga & Breathwork', duration: '75 min', price: '600 ETB', discount: '510 ETB' },
];

export const PROVIDER_TIMES = ['7:00 AM', '10:00 AM', '2:00 PM', '5:00 PM', '7:00 PM'];

export const BOOKING_INCLUDED = [
  '60-minute session with certified instructor',
  'Mat & equipment provided',
  'Digital wellness passport (QR code)',
  'Post-session recovery tips',
] as const;

export const PROVIDER_REVIEWS = [
  {
    name: 'Marta G.',
    rating: 5,
    text: 'Incredible experience. I felt rejuvenated after the session.',
    date: '2 days ago',
  },
  {
    name: 'Yonas A.',
    rating: 5,
    text: 'The instructor is amazing. Perfect for stress recovery.',
    date: '1 week ago',
  },
  {
    name: 'Selamawit T.',
    rating: 4,
    text: 'Very professional studio. Clean and calming environment.',
    date: '2 weeks ago',
  },
];

export function getProviderById(id: string): Provider | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export function filterProviders(
  category: string,
  query: string,
): Provider[] {
  const q = query.trim().toLowerCase();
  return PROVIDERS.filter((p) => {
    const matchesCategory = category === 'All' || p.categories.includes(category);
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.tag.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });
}
