// TODO: Replace with GET /api/referrals
import referralsData from '../data/referrals.json';

export type ReferralStatus = 'New' | 'Booked' | 'Visited' | 'Cancelled';

export interface Referral {
  id: string;
  customerName: string;
  wellnessGoal: string;
  recommendedService: string;
  serviceType: string;
  wellnessCategory: string;
  referralDate: string;
  status: ReferralStatus;
  referralSource: string;
  contactInfo: {
    email: string;
    phone: string;
  };
  bookingDate?: string;
  visitDate?: string;
  notes: string;
}

export const referralService = {
  async getAll(): Promise<Referral[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(referralsData as Referral[]), 300);
    });
  },

  async getById(id: string): Promise<Referral | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const referral = referralsData.find((r) => r.id === id);
        resolve(referral ? (referral as Referral) : null);
      }, 200);
    });
  },

  async updateStatus(id: string, status: ReferralStatus): Promise<Referral> {
    // TODO: Replace with PATCH /api/referrals/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const referral = referralsData.find((r) => r.id === id);
        if (referral) {
          const updated = { ...referral, status } as Referral;
          resolve(updated);
        }
      }, 300);
    });
  },

  async search(query: string): Promise<Referral[]> {
    // TODO: Replace with GET /api/referrals/search?q=:query
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = referralsData.filter(
          (r) =>
            r.customerName.toLowerCase().includes(query.toLowerCase()) ||
            r.recommendedService.toLowerCase().includes(query.toLowerCase()) ||
            r.id.toLowerCase().includes(query.toLowerCase())
        );
        resolve(results as Referral[]);
      }, 200);
    });
  },
};
