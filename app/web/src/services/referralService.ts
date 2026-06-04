import { partnerService } from './partnerService';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = (import.meta as any).env.VITE_PUBLIC_API_URL || (isLocal ? 'http://localhost:3000' : 'https://vita-7riw.onrender.com');

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
    const partnerId = partnerService.getCurrentPartnerId();
    if (!partnerId) throw new Error('No partner selected');

    try {
      const response = await fetch(`${API_URL}/partner/referrals/${partnerId}`);
      if (!response.ok) throw new Error('Failed to fetch referrals');
      return await response.json();
    } catch (error) {
      console.error('Error in referralService.getAll:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Referral | null> {
    const referrals = await this.getAll();
    return referrals.find((r) => r.id === id) || null;
  },

  async updateStatus(id: string, status: ReferralStatus): Promise<any> {
    try {
      const response = await fetch(`${API_URL}/partner/referrals/${id}/status`, {
        method: 'POST', // Changed to POST as per backend implementation
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      return await response.json();
    } catch (error) {
      console.error('Error in referralService.updateStatus:', error);
      throw error;
    }
  },

  async search(query: string): Promise<Referral[]> {
    const referrals = await this.getAll();
    const q = query.toLowerCase();
    return referrals.filter(
      (r) =>
        r.customerName.toLowerCase().includes(q) ||
        r.recommendedService.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  },
};
