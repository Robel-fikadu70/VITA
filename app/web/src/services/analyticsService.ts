// TODO: Replace with GET /api/analytics
import analyticsData from '../data/analytics.json';
import referralsData from '../data/referrals.json';
import bookingsData from '../data/bookings.json';
import notificationsData from '../data/notifications.json';

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
  weeklyReferrals: Array<{ day: string; referrals: number; conversions: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  conversionFunnel: Array<{ stage: string; value: number }>;
  recentActivity: RecentActivity[];
  recentReferrals: RecentReferral[];
}

export const analyticsService = {
  async getAnalytics(): Promise<Analytics> {
    return new Promise((resolve) => {
      setTimeout(() => {

        // ── Recent Referrals (live from referrals.json) ──────────────────
        const recentReferrals = (referralsData as any[])
          .sort((a, b) => new Date(b.referralDate).getTime() - new Date(a.referralDate).getTime())
          .slice(0, 5)
          .map(r => ({
            id:                 r.id,
            customerName:       r.customerName,
            wellnessGoal:       r.wellnessGoal,
            recommendedService: r.recommendedService,
            status:             r.status,
            referralDate:       r.referralDate,
          }));

        // ── Recent Activity (built from ALL real source files) ────────────

        // 1. from referrals.json → "X was referred for Y"
        const referralEvents: RecentActivity[] = (referralsData as any[]).map(r => ({
          id:         `ACT-REF-${r.id}`,
          type:       'referral',
          message:    `${r.customerName} was referred for ${r.recommendedService}`,
          timestamp:  r.referralDate,
          referralId: r.id,
        }));

        // 2. from bookings.json → "X booked/completed Y"
        const bookingEvents: RecentActivity[] = (bookingsData as any[]).map(b => ({
          id:         `ACT-BOOK-${b.id}`,
          type:       b.status === 'Completed' ? 'visit' : 'booking',
          message:    b.status === 'Completed'
                        ? `${b.customerName} completed ${b.service}`
                        : `${b.customerName} booked ${b.service}`,
          timestamp:  b.status === 'Completed' ? b.completedAt : b.createdAt,
          referralId: b.referralId,
        }));

        // 3. from notifications.json → campaign & system events
        const notificationEvents: RecentActivity[] = (notificationsData as any[]).map(n => ({
          id:         `ACT-NOT-${n.id}`,
          type:       n.type,
          message:    n.message,
          timestamp:  n.timestamp,
          referralId: n.referralId ?? undefined,
          campaignId: n.campaignId ?? undefined,
        }));

        // merge all → sort by time → take 5 most recent
        const recentActivity = [
          ...referralEvents,
          ...bookingEvents,
          ...notificationEvents,
        ]
          .filter(e => e.timestamp) // safety: skip entries with no timestamp
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        resolve({
          ...(analyticsData as any), // kpis, charts, funnel stay from analytics.json
          recentActivity,            // ← now real, from all 3 sources
          recentReferrals,           // ← real, from referrals.json
        });

      }, 300);
    });
  },
};