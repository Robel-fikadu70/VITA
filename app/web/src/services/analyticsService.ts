import { partnerService } from './partnerService';

const isLocal = true
const API_URL = (import.meta as any).env.VITE_PUBLIC_API_URL;

export interface KPI {
  value: number;
  change: number;
  trend: 'up' | 'down';
}

export interface RecentReferral {
  id: string;
  customerName: string;
  wellnessGoal: string;
  recommendedService: string;
  status: string;
  referralDate: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  referralId?: string;
  campaignId?: string;
}

export interface Analytics {
  kpis: {
    newReferralsToday: KPI;
    activeReferrals: KPI;
    conversionRate: KPI;
    revenueGenerated: KPI;
    completedVisits: KPI;
    campaignReach: KPI;
  };
  recentActivity: RecentActivity[];
  recentReferrals: RecentReferral[];
  weeklyReferrals?: Array<{ day: string; referrals: number }>;
}

export const analyticsService = {
  async getAnalytics(): Promise<Analytics> {
    const partnerId = partnerService.getCurrentPartnerId();
    if (!partnerId) {
      throw new Error('No partner context found. Please login.');
    }

    try {
      console.log(`${API_URL}/partner/analytics/${partnerId}`);
      const response = await fetch(`${API_URL}/partner/analytics/${partnerId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch real-time analytics');
      }
      return await response.json();
    } catch (error) {
      console.error('Analytics Fetch Error:', error);
      throw error;
    }
  },
};